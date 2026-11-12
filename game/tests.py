import copy
import json

from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.test import Client, TestCase, override_settings
from django.urls import reverse
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

from . import rules
from .models import PlayerSave

User = get_user_model()
GOOD_PW = 'Sup3r-Secret-Pass'


def valid_save(**over):
    data = {
        'party': [rules.make_creature('tarsilaw', 5)],
        'selyo': 3, 'herbs': 2, 'f': {'starter': True},
        'mapId': 'V', 'x': 19, 'y': 17, 'dir': 0,
    }
    data.update(over)
    return data


class CacheClearMixin:
    def setUp(self):
        super().setUp()
        cache.clear()


# --------------------------------------------------------------------------- rules

class RulesTests(TestCase):
    def test_every_species_move_exists_and_is_consistent(self):
        for sid, s in rules.SPECIES.items():
            self.assertIn(s['a'], rules.MOVES, sid)
            if s['up']:
                self.assertIn(s['up'], rules.MOVES, sid)
            self.assertIn(s['t'], rules.DATA['type_chart'], sid)
            for lv in (1, 5, 7, 30):
                self.assertTrue(all(m in rules.MOVES for m in rules.moves_for(sid, lv)))

    def test_creature_roster_and_matchup_coverage(self):
        self.assertEqual(len(rules.SPECIES), 15)
        self.assertEqual(len(rules.DATA['dex_order']), 15)
        self.assertEqual(set(rules.DATA['dex_order']), set(rules.SPECIES))
        available = set(rules.DATA['encounters']['F'] + rules.DATA['encounters']['S'])
        self.assertEqual(available, set(rules.SPECIES))
        self.assertEqual(len(rules.DATA['attribute_names']), 8)
        for species in rules.SPECIES.values():
            self.assertIn(species['t'], rules.DATA['type_chart'])
            self.assertTrue(species.get('lore'))

    def test_attribute_counters(self):
        chart = rules.DATA['type_chart']
        self.assertGreater(chart['Water']['Fire'], 1)
        self.assertGreater(chart['Spark']['Water'], 1)
        self.assertGreater(chart['Light']['Shadow'], 1)
        self.assertGreater(chart['Fire']['Nature'], 1)

    def test_stat_formula_matches_client_known_values(self):
        # same numbers asserted by the browser self-test ("Stats formula matches server rules.py")
        self.assertEqual(rules.stats_for('tarsilaw', 10),
                         {'max': 48, 'atk': 13, 'def': 8, 'spd': 11})
        self.assertEqual(rules.stats_for('tarsilaw', 5),
                         {'max': 34, 'atk': 9, 'def': 6, 'spd': 8})

    def test_js_round_rounds_half_up_like_javascript(self):
        self.assertEqual(rules.js_round(2.5), 3)
        self.assertEqual(rules.js_round(3.5), 4)  # python's round() would give 4 and 4 -> 2, 4

    def test_second_move_unlocks_at_level_seven(self):
        self.assertEqual(rules.moves_for('lumot', 6)[1], 'Tackle')
        self.assertEqual(rules.moves_for('lumot', 7)[1], 'Root Guard')
        self.assertEqual(rules.moves_for('bato', 30)[1], 'Tackle')  # no upgrade defined


class SanitizeSaveTests(TestCase):
    def test_valid_save_round_trips(self):
        clean, adjusted = rules.sanitize_save(valid_save())
        self.assertEqual(adjusted, [])
        self.assertEqual(clean['party'][0], rules.make_creature('tarsilaw', 5))
        self.assertEqual((clean['mapId'], clean['x'], clean['y']), ('V', 19, 17))

    def test_dex_unlocks_are_saved_and_legacy_party_migrates(self):
        old, _ = rules.sanitize_save(valid_save())
        self.assertEqual(old['dex'], ['tarsilaw'])
        raw = valid_save(dex=['kidlatin', 'agilunos', 'kidlatin'])
        current, _ = rules.sanitize_save(raw)
        self.assertEqual(current['dex'], ['tarsilaw', 'agilunos', 'kidlatin'])
        self.assertEqual(rules.sanitize_save(current)[0]['dex'], current['dex'])

    def test_invalid_dex_entries_are_rejected(self):
        for dex in ('tarsilaw', ['unknown'], [123], [{}], ['tarsilaw'] * 16):
            with self.assertRaises(rules.SaveError):
                rules.sanitize_save(valid_save(dex=dex))

    def test_dex_stays_unlocked_after_party_swap(self):
        clean, _ = rules.sanitize_save(valid_save(party=[rules.make_creature('bato', 5)],
                                                  dex=['tarsilaw', 'kidlatin']))
        self.assertEqual(clean['dex'], ['tarsilaw', 'bato', 'kidlatin'])

    def test_reserve_roundtrip_and_dex_unlock(self):
        reserve = [rules.make_creature('bato', 5), rules.make_creature('pakpak', 7)]
        clean, adj = rules.sanitize_save(valid_save(storage=reserve))
        self.assertEqual(adj, [])
        self.assertEqual([x['id'] for x in clean['storage']], ['bato', 'pakpak'])
        self.assertEqual(clean['dex'], ['tarsilaw', 'pakpak', 'bato'])
        self.assertEqual(rules.sanitize_save(clean)[0], clean)

    def test_reserve_limit_and_corruption_rejected(self):
        cap = rules.LIMITS['max_storage']
        self.assertEqual(cap, 30)
        reserve = [rules.make_creature('bato', 5) for _ in range(cap)]
        self.assertEqual(len(rules.sanitize_save(valid_save(storage=reserve))[0]['storage']), cap)
        for value in ('oops', [{'id': 'not-a-species'}], reserve + reserve[:1]):
            with self.assertRaises(rules.SaveError):
                rules.sanitize_save(valid_save(storage=value))

    def test_legacy_saves_have_empty_reserve(self):
        clean, _ = rules.sanitize_save(valid_save())
        self.assertEqual(clean['storage'], [])

    def test_empty_save_is_allowed(self):
        self.assertEqual(rules.sanitize_save({}), ({}, []))

    def test_tampered_stats_are_recomputed_not_trusted(self):
        c = rules.make_creature('tarsilaw', 5)
        c.update(atk=99999, max=99999, hp=99999, mv=['Sky Cut', 'Nonsense'], n='Hacker', t='Fire')
        clean, adjusted = rules.sanitize_save(valid_save(party=[c]))
        out = clean['party'][0]
        self.assertEqual((out['atk'], out['max'], out['n'], out['t']), (9, 34, 'Tarsilaw', 'Light'))
        self.assertEqual(out['hp'], 34)
        self.assertEqual(out['mv'], ['Leaf Pounce', 'Tackle', 'Soothe'])
        self.assertTrue(any('hp out of range' in a for a in adjusted))

    def test_level_is_capped_and_xp_bounded(self):
        c = rules.make_creature('bato', 5)
        c.update(lv=99, xp=10 ** 9)
        out = rules.sanitize_save(valid_save(party=[c]))[0]['party'][0]
        self.assertEqual(out['lv'], rules.LIMITS['max_level'])
        self.assertLess(out['xp'], out['next'])

    def test_item_counts_are_capped(self):
        clean, _ = rules.sanitize_save(valid_save(selyo=10 ** 6, herbs=-5))
        self.assertEqual((clean['selyo'], clean['herbs']), (rules.LIMITS['max_items'], 0))

    def test_structural_problems_raise(self):
        bad = [
            [], 'x', 5,
            valid_save(party='nope'),
            valid_save(party=[{'id': 'mewtwo'}]),
            valid_save(party=[{'id': 5}]),
            valid_save(party=['str']),
            valid_save(party=[rules.make_creature('bato', 5)] * 4),
            valid_save(selyo='lots'), valid_save(selyo=True), valid_save(f=[1]),
            valid_save(party=[{'id': 'bato', 'lv': 'high'}]),
        ]
        for payload in bad:
            with self.assertRaises(rules.SaveError, msg=repr(payload)[:60]):
                rules.sanitize_save(payload)

    def test_unknown_flags_dropped_and_story_flags_made_consistent(self):
        clean, adjusted = rules.sanitize_save(
            valid_save(party=[], f={'done': True, 'shrine': True, 'bonded': True, 'admin': True}))
        self.assertEqual(clean['f'], {})
        self.assertTrue(adjusted)

    def test_party_implies_starter(self):
        clean, _ = rules.sanitize_save(valid_save(f={}))
        self.assertTrue(clean['f']['starter'])

    def test_locked_maps_move_player_to_village(self):
        clean, _ = rules.sanitize_save(valid_save(f={'starter': True}, mapId='S', x=7, y=4))
        self.assertEqual((clean['mapId'], clean['x'], clean['y']), ('V', 19, 17))
        clean, _ = rules.sanitize_save(valid_save(party=[], f={}, mapId='F', x=3, y=3))
        self.assertEqual(clean['mapId'], 'V')

    def test_unlocked_map_keeps_position(self):
        clean, _ = rules.sanitize_save(valid_save(f={'starter': True, 'bonded': True}, mapId='S', x=7, y=4, dir=2))
        self.assertEqual((clean['mapId'], clean['x'], clean['y'], clean['dir']), ('S', 7, 4, 2))

    def test_bad_position_falls_back_to_spawn(self):
        clean, _ = rules.sanitize_save(valid_save(x=500, y=-3))
        self.assertEqual((clean['x'], clean['y']), tuple(rules.MAPS['V']['spawn']))
        clean, _ = rules.sanitize_save(valid_save(x='a', y=None, mapId='???'))
        self.assertEqual(clean['mapId'], 'V')

    def test_input_is_not_mutated(self):
        data = valid_save()
        before = copy.deepcopy(data)
        rules.sanitize_save(data)
        self.assertEqual(data, before)


# ------------------------------------------------------------------- web: accounts

class RegisterPageTests(CacheClearMixin, TestCase):
    def post(self, **fields):
        data = {'username': 'ana', 'password1': GOOD_PW, 'password2': GOOD_PW}
        data.update(fields)
        return self.client.post(reverse('register'), data)

    def test_page_renders(self):
        r = self.client.get(reverse('register'))
        self.assertContains(r, 'Create your account')
        self.assertContains(r, 'autocomplete="new-password"')

    def test_success_creates_user_save_and_logs_in(self):
        r = self.post()
        self.assertRedirects(r, reverse('play'), fetch_redirect_response=False)
        user = User.objects.get(username='ana')
        self.assertTrue(PlayerSave.objects.filter(user=user).exists())
        self.assertEqual(int(self.client.session['_auth_user_id']), user.pk)
        self.assertEqual(self.client.get(reverse('play')).status_code, 200)

    def test_duplicate_username_is_rejected_case_insensitively(self):
        User.objects.create_user('Ana', password=GOOD_PW)
        r = self.post(username='ana')
        self.assertContains(r, 'already taken')
        self.assertEqual(User.objects.filter(username__iexact='ana').count(), 1)

    def test_username_whitespace_is_trimmed(self):
        self.post(username='  bob  ')
        self.assertTrue(User.objects.filter(username='bob').exists())

    def test_password_mismatch_shows_error(self):
        r = self.post(password2='Different-Pass-1')
        self.assertContains(r, 'role="alert"')
        self.assertFalse(User.objects.filter(username='ana').exists())

    def test_weak_passwords_rejected_with_readable_messages(self):
        for pw in ('short1', 'password', '12345678', 'ana'):
            r = self.post(password1=pw, password2=pw)
            self.assertEqual(r.status_code, 200, pw)
            self.assertFalse(User.objects.filter(username='ana').exists(), pw)
        r = self.post(password1='short1', password2='short1')
        self.assertContains(r, 'at least 8 characters')

    def test_invalid_username_characters_rejected(self):
        r = self.post(username='bad name!')
        self.assertEqual(r.status_code, 200)
        self.assertFalse(User.objects.exists())

    def test_blank_fields_rejected(self):
        r = self.client.post(reverse('register'), {})
        self.assertContains(r, 'This field is required')

    def test_authenticated_user_is_redirected_away(self):
        self.post()
        self.assertEqual(self.client.get(reverse('register')).status_code, 302)

    def test_next_is_honoured_only_for_same_site(self):
        r = self.client.post(reverse('register') + '?next=https://evil.example/x',
                             {'username': 'cy', 'password1': GOOD_PW, 'password2': GOOD_PW})
        self.assertEqual(r['Location'], reverse('play'))


class LoginPageTests(CacheClearMixin, TestCase):
    def setUp(self):
        super().setUp()
        User.objects.create_user('Ana', password=GOOD_PW)

    def login(self, username='Ana', password=GOOD_PW, **extra):
        return self.client.post(reverse('login'), {'username': username, 'password': password, **extra})

    def test_page_renders_with_csrf_and_autocomplete(self):
        r = Client(enforce_csrf_checks=True).get(reverse('login'))
        self.assertContains(r, 'csrfmiddlewaretoken')
        self.assertContains(r, 'autocomplete="current-password"')

    def test_success_redirects_to_game(self):
        self.assertRedirects(self.login(), reverse('play'), fetch_redirect_response=False)

    def test_username_is_case_insensitive(self):
        for name in ('ana', 'ANA', '  Ana '):
            self.client.logout()
            self.assertRedirects(self.login(name), reverse('play'), fetch_redirect_response=False)

    def test_wrong_password_shows_single_clear_error(self):
        r = self.login(password='nope-nope')
        self.assertContains(r, "don&#x27;t match")
        self.assertNotIn('_auth_user_id', self.client.session)

    def test_unknown_user_gets_same_error(self):
        self.assertContains(self.login(username='ghost'), "don&#x27;t match")

    def test_inactive_user_cannot_sign_in(self):
        User.objects.filter(username='Ana').update(is_active=False)
        self.assertContains(self.login(), 'role="alert"')

    def test_next_redirect_is_validated(self):
        r = self.login(next='/play/')
        self.assertEqual(r['Location'], '/play/')
        self.client.logout()
        for evil in ('https://evil.example/', '//evil.example/', 'javascript:alert(1)'):
            r = self.login(next=evil)
            self.assertEqual(r['Location'], reverse('play'), evil)
            self.client.logout()

    def test_authenticated_user_skips_login_page(self):
        self.login()
        self.assertEqual(self.client.get(reverse('login')).status_code, 302)

    @override_settings(LOGIN_MAX_FAILURES=3)
    def test_lockout_after_repeated_failures_even_with_right_password(self):
        for _ in range(3):
            self.login(password='wrong-pass-1')
        r = self.login()  # correct password, but locked
        self.assertContains(r, 'Too many failed sign-in attempts')
        self.assertNotIn('_auth_user_id', self.client.session)

    @override_settings(LOGIN_MAX_FAILURES=3)
    def test_lockout_is_per_username(self):
        User.objects.create_user('bea', password=GOOD_PW)
        for _ in range(3):
            self.login(password='wrong-pass-1')
        self.assertRedirects(self.login('bea'), reverse('play'), fetch_redirect_response=False)

    @override_settings(LOGIN_MAX_FAILURES=3)
    def test_success_resets_failure_counter(self):
        for _ in range(2):
            self.login(password='wrong-pass-1')
        self.login()
        self.client.logout()
        for _ in range(2):
            self.login(password='wrong-pass-1')
        self.assertRedirects(self.login(), reverse('play'), fetch_redirect_response=False)


class LogoutAndPlayTests(CacheClearMixin, TestCase):
    def setUp(self):
        super().setUp()
        User.objects.create_user('ana', password=GOOD_PW)

    def test_play_requires_login_and_keeps_next(self):
        r = self.client.get(reverse('play'))
        self.assertEqual(r.status_code, 302)
        self.assertTrue(r['Location'].startswith(reverse('login') + '?next='))

    def test_home_redirects_by_auth_state(self):
        self.assertRedirects(self.client.get('/'), reverse('login'), fetch_redirect_response=False)
        self.client.login(username='ana', password=GOOD_PW)
        self.assertRedirects(self.client.get('/'), reverse('play'), fetch_redirect_response=False)

    def test_logout_requires_post(self):
        self.client.login(username='ana', password=GOOD_PW)
        self.assertEqual(self.client.get(reverse('logout')).status_code, 405)
        self.assertEqual(self.client.get(reverse('play')).status_code, 200)
        self.client.post(reverse('logout'))
        self.assertEqual(self.client.get(reverse('play')).status_code, 302)

    def test_play_page_embeds_data_config_and_logout_form(self):
        self.client.login(username='ana', password=GOOD_PW)
        r = self.client.get(reverse('play'))
        self.assertContains(r, 'id="alamat-data"')
        self.assertContains(r, 'id="alamat-config"')
        self.assertContains(r, 'game/alamat.js')
        self.assertContains(r, 'csrfmiddlewaretoken')
        self.assertIn('csrftoken', r.cookies)
        self.assertIn('no-store', r['Cache-Control'])
        # secrets/server-only fields never reach the client
        self.assertNotContains(r, '_comment')


# ---------------------------------------------------------------------------- API

class ApiAuthTests(CacheClearMixin, TestCase):
    def setUp(self):
        super().setUp()
        self.api = APIClient()

    def register(self, **fields):
        body = {'username': 'ana', 'password': GOOD_PW}
        body.update(fields)
        return self.api.post('/api/auth/register/', body, format='json')

    def test_health(self):
        self.assertEqual(self.api.get('/api/health/').json()['status'], 'ok')

    def test_register_returns_token_and_creates_save(self):
        r = self.register()
        self.assertEqual(r.status_code, 201)
        self.assertTrue(Token.objects.filter(key=r.json()['token']).exists())
        self.assertTrue(PlayerSave.objects.filter(user__username='ana').exists())

    def test_register_rejects_case_duplicate_and_trims(self):
        self.register(username='Ana')
        self.assertEqual(self.register(username='ana').status_code, 400)
        self.assertEqual(self.register(username=' bob ').json()['username'], 'bob')

    def test_register_error_shape_for_weak_password(self):
        r = self.register(password='abc123')
        self.assertEqual(r.status_code, 400)
        self.assertIn('password', r.json())

    def test_register_and_login_never_500_on_odd_json(self):
        for body in ([], 'x', {'username': None, 'password': 'x'}, {'username': {}, 'password': []},
                     {'username': 123, 'password': 'x'}, {}, {'username': 'a' * 500, 'password': 'x'}):
            for url in ('/api/auth/register/', '/api/auth/login/'):
                r = self.api.post(url, body, format='json')
                self.assertEqual(r.status_code, 400, (url, body))

    def test_malformed_json_is_400(self):
        r = self.api.post('/api/auth/login/', '{nope', content_type='application/json')
        self.assertEqual(r.status_code, 400)

    def test_login_case_insensitive_and_wrong_password(self):
        self.register()
        ok = self.api.post('/api/auth/login/', {'username': 'ANA', 'password': GOOD_PW}, format='json')
        self.assertEqual(ok.status_code, 200)
        self.assertEqual(ok.json()['username'], 'ana')
        bad = self.api.post('/api/auth/login/', {'username': 'ana', 'password': 'wrong'}, format='json')
        self.assertEqual(bad.status_code, 400)

    @override_settings(LOGIN_MAX_FAILURES=3)
    def test_login_lockout_returns_429(self):
        self.register()
        for _ in range(3):
            self.api.post('/api/auth/login/', {'username': 'ana', 'password': 'wrong'}, format='json')
        r = self.api.post('/api/auth/login/', {'username': 'ana', 'password': GOOD_PW}, format='json')
        self.assertEqual(r.status_code, 429)

    def test_logout_deletes_token(self):
        tok = self.register().json()['token']
        self.api.credentials(HTTP_AUTHORIZATION='Token ' + tok)
        self.assertEqual(self.api.post('/api/auth/logout/').status_code, 200)
        self.assertEqual(self.api.get('/api/save/').status_code, 401)


class ApiSaveTests(CacheClearMixin, TestCase):
    def setUp(self):
        super().setUp()
        self.user = User.objects.create_user('ana', password=GOOD_PW)
        self.api = APIClient()
        self.api.force_authenticate(self.user)

    def put(self, data, **extra):
        return self.api.put('/api/save/', {'data': data, **extra}, format='json')

    def test_requires_auth(self):
        self.assertEqual(APIClient().get('/api/save/').status_code, 401)

    def test_new_account_has_empty_save(self):
        j = self.api.get('/api/save/').json()
        self.assertEqual((j['data'], j['exists'], j['revision']), ({}, False, 0))

    def test_put_then_get_round_trip_and_revision_increments(self):
        r = self.put(valid_save())
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.json()['revision'], 1)
        j = self.api.get('/api/save/').json()
        self.assertTrue(j['exists'])
        self.assertEqual(j['data']['party'][0]['id'], 'tarsilaw')
        self.assertEqual(self.put(valid_save(selyo=5)).json()['revision'], 2)

    def test_flat_payload_still_accepted(self):
        r = self.api.put('/api/save/', valid_save(), format='json')
        self.assertEqual(r.status_code, 200)

    def test_tampered_save_is_normalised_and_reported(self):
        c = rules.make_creature('tarsilaw', 5)
        c.update(lv=99, hp=99999, atk=99999)
        r = self.put(valid_save(party=[c], selyo=999999))
        self.assertEqual(r.status_code, 200)
        saved = self.api.get('/api/save/').json()['data']
        self.assertEqual(saved['party'][0]['lv'], 30)
        self.assertEqual(saved['party'][0]['atk'], rules.stats_for('tarsilaw', 30)['atk'])
        self.assertEqual(saved['selyo'], 99)
        self.assertTrue(r.json()['adjusted'])

    def test_invalid_bodies_are_400_not_500(self):
        for body in ([1, 2], 'x', 5):
            self.assertEqual(self.api.put('/api/save/', body, format='json').status_code, 400)
        for data in ('x', [], valid_save(party=[{'id': 'nope'}]), valid_save(party=[{}] * 9)):
            self.assertEqual(self.put(data).status_code, 400, repr(data)[:50])
        self.assertEqual(self.put(valid_save(), revision='1').status_code, 400)
        self.assertEqual(self.put(valid_save(), revision=True).status_code, 400)

    def test_stale_revision_conflicts_and_keeps_newer_save(self):
        self.put(valid_save(selyo=10))                              # revision -> 1
        r = self.put(valid_save(selyo=1), revision=0)               # stale tab
        self.assertEqual(r.status_code, 409)
        self.assertEqual(r.json()['data']['selyo'], 10)
        self.assertEqual(PlayerSave.objects.get(user=self.user).data['selyo'], 10)
        self.assertEqual(self.put(valid_save(selyo=2), revision=1).status_code, 200)

    def test_get_sanitises_legacy_or_corrupt_rows(self):
        PlayerSave.objects.update_or_create(user=self.user, defaults={'data': {'party': 'junk'}})
        self.assertEqual(self.api.get('/api/save/').json()['data'], {})
        PlayerSave.objects.filter(user=self.user).update(
            data={'party': [{'id': 'tarsilaw', 'lv': 99, 'atk': 10 ** 9}], 'selyo': 10 ** 9})
        j = self.api.get('/api/save/').json()['data']
        self.assertEqual((j['party'][0]['lv'], j['selyo']), (30, 99))

    def test_saves_are_private_per_user(self):
        self.put(valid_save(selyo=7))
        other = User.objects.create_user('bea', password=GOOD_PW)
        c = APIClient()
        c.force_authenticate(other)
        self.assertEqual(c.get('/api/save/').json()['data'], {})

    def test_admin_roster_requires_staff_and_debug(self):
        url = '/api/dev/seed-roster/'
        current = self.api.get('/api/save/').json()['revision']
        self.assertEqual(self.api.post(url, {'revision': current}, format='json').status_code, 403)
        self.user.is_staff = True
        self.user.save(update_fields=['is_staff'])
        with override_settings(DEBUG=False):
            self.assertEqual(self.api.post(url, {'revision': current}, format='json').status_code, 403)
        with override_settings(DEBUG=True):
            r = self.api.post(url, {'revision': current}, format='json')
            self.assertEqual(r.status_code, 200)
            data = r.json()['data']
            self.assertEqual(len(data['party']), 3)
            self.assertEqual(len(data['storage']), 12)
            self.assertEqual(len(data['dex']), 15)
            self.assertEqual({c['id'] for c in data['party'] + data['storage']},
                             set(rules.SPECIES))
            self.assertEqual(self.api.post(url, {'revision': current}, format='json').status_code, 409)

    def test_reserve_survives_authenticated_cloud_save(self):
        reserve = [rules.make_creature('pakpak', 5), rules.make_creature('bato', 6)]
        r = self.put(valid_save(storage=reserve))
        self.assertEqual(r.status_code, 200)
        out = self.api.get('/api/save/').json()['data']
        self.assertEqual([c['id'] for c in out['storage']], ['pakpak', 'bato'])

    def test_session_auth_requires_csrf_for_writes(self):
        c = Client(enforce_csrf_checks=True)
        c.login(username='ana', password=GOOD_PW)
        r = c.put('/api/save/', json.dumps({'data': valid_save()}), content_type='application/json')
        self.assertEqual(r.status_code, 403)
        c.get(reverse('play'))  # sets the csrftoken cookie, as the real page does
        token = c.cookies['csrftoken'].value
        r = c.put('/api/save/', json.dumps({'data': valid_save()}), content_type='application/json',
                  HTTP_X_CSRFTOKEN=token)
        self.assertEqual(r.status_code, 200)
