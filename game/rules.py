"""
ALAMAT game rules (server side).

Pure Python, no HTTP and no database, so it can be unit-tested deterministically
(see docs/GAME_DESIGN.md: "deterministic rules engine separate from HTTP endpoints").

The numbers come from game/data/game_data.json, which is ALSO injected into the
browser client. Species, moves and the type chart therefore have one source of truth.

Current scope: stat formulas + save validation. Battle resolution still runs in the
client for this milestone; the validator makes sure what is *stored* is always
well-formed and internally consistent. A save cannot be proven to be "earned"
until battles are resolved server-side (next milestone).
"""
from __future__ import annotations

import json
import math
from pathlib import Path
from typing import Any

DATA_PATH = Path(__file__).resolve().parent / 'data' / 'game_data.json'
DATA: dict[str, Any] = json.loads(DATA_PATH.read_text(encoding='utf-8'))

LIMITS = DATA['limits']
SPECIES = DATA['species']
MOVES = DATA['moves']
MAPS = DATA['maps']
FLAGS = tuple(DATA['flags'])


class SaveError(ValueError):
    """The payload is structurally invalid (wrong types, unknown species, ...)."""


def js_round(x: float) -> int:
    """Match JavaScript Math.round (half rounds up) so client and server agree."""
    return math.floor(x + 0.5)


def stats_for(species_id: str, level: int) -> dict[str, int]:
    s = SPECIES[species_id]
    k = 1 + (level - 5) * 0.08
    return {
        'max': js_round(s['hp'] * k),
        'atk': js_round(s['atk'] * k),
        'def': js_round(s['def'] * k),
        'spd': js_round(s['spd'] * k),
    }


def moves_for(species_id: str, level: int) -> list[str]:
    s = SPECIES[species_id]
    second = s['up'] if s['up'] and level >= s['up_lv'] else 'Tackle'
    return [s['a'], second, 'Soothe']


def xp_to_next(level: int) -> int:
    return level * LIMITS['xp_per_level']


def make_creature(species_id: str, level: int) -> dict[str, Any]:
    """Canonical creature record (same shape the client builds in mkC)."""
    st = stats_for(species_id, level)
    s = SPECIES[species_id]
    return {
        'id': species_id, 'n': s['n'], 't': s['t'], 'lv': level,
        'xp': 0, 'next': xp_to_next(level),
        'hp': st['max'], 'dh': st['max'], 'max': st['max'],
        'atk': st['atk'], 'def': st['def'], 'spd': st['spd'],
        'mv': moves_for(species_id, level),
    }


# ---------------------------------------------------------------- validation

def _int(value: Any, where: str) -> int:
    # bool is an int subclass; True/False are never a valid number here.
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise SaveError(f'{where} must be a number')
    if isinstance(value, float):
        if not math.isfinite(value):
            raise SaveError(f'{where} must be a finite number')
        value = int(value)
    return value


def _clamp(value: int, lo: int, hi: int, where: str, adjusted: list[str]) -> int:
    if value < lo or value > hi:
        adjusted.append(f'{where} out of range, set to {min(max(value, lo), hi)}')
    return min(max(value, lo), hi)


def _creature(raw: Any, index: int, adjusted: list[str], group: str = 'party') -> dict[str, Any]:
    where = f'{group}[{index}]'
    if not isinstance(raw, dict):
        raise SaveError(f'{where} must be an object')
    sid = raw.get('id')
    if not isinstance(sid, str) or sid not in SPECIES:
        raise SaveError(f'{where}.id is not a known species')

    lv = _clamp(_int(raw.get('lv', LIMITS['starter_level']), f'{where}.lv'),
                1, LIMITS['max_level'], f'{where}.lv', adjusted)
    c = make_creature(sid, lv)           # name/type/stats/moves are always derived
    c['xp'] = _clamp(_int(raw.get('xp', 0), f'{where}.xp'), 0, c['next'] - 1,
                     f'{where}.xp', adjusted)
    c['hp'] = _clamp(_int(raw.get('hp', c['max']), f'{where}.hp'), 0, c['max'],
                     f'{where}.hp', adjusted)
    c['dh'] = c['hp']
    return c


def sanitize_save(raw: Any) -> tuple[dict[str, Any], list[str]]:
    """
    Validate and normalise a client save.

    Returns (clean_data, adjusted). `adjusted` lists values that were out of range
    or inconsistent and silently corrected. Raises SaveError for structural problems.
    An empty dict is a legal "no progress yet" save.
    """
    if not isinstance(raw, dict):
        raise SaveError('data must be an object')
    if not raw:
        return {}, []

    adjusted: list[str] = []

    party_raw = raw.get('party', [])
    if not isinstance(party_raw, list):
        raise SaveError('party must be a list')
    if len(party_raw) > LIMITS['max_party']:
        raise SaveError(f'party can hold at most {LIMITS["max_party"]} creatures')
    party = [_creature(c, i, adjusted) for i, c in enumerate(party_raw)]

    storage_raw = raw.get('storage', [])  # older cloud saves have no reserve
    if not isinstance(storage_raw, list):
        raise SaveError('storage must be a list')
    if len(storage_raw) > LIMITS['max_storage']:
        raise SaveError(f'storage can hold at most {LIMITS["max_storage"]} creatures')
    storage = [_creature(c, i, adjusted, 'storage') for i, c in enumerate(storage_raw)]

    # Permanent Dex discoveries belong to the account, not just today's party.
    # Legacy saves lack 'dex'; seed from their current party on migration.
    owned_raw = raw.get('dex', [])
    if not isinstance(owned_raw, list) or len(owned_raw) > len(SPECIES):
        raise SaveError('dex must be a list with at most one entry per species')
    if any(not isinstance(sid, str) or sid not in SPECIES for sid in owned_raw):
        raise SaveError('dex contains an unknown species')
    owned = set(owned_raw)
    owned.update(c['id'] for c in party)
    owned.update(c['id'] for c in storage)
    dex = [sid for sid in DATA['dex_order'] if sid in owned]

    selyo = _clamp(_int(raw.get('selyo', 3), 'selyo'), 0, LIMITS['max_items'], 'selyo', adjusted)
    herbs = _clamp(_int(raw.get('herbs', 2), 'herbs'), 0, LIMITS['max_items'], 'herbs', adjusted)

    flags_raw = raw.get('f', {})
    if not isinstance(flags_raw, dict):
        raise SaveError('f must be an object')
    f = {k: bool(flags_raw.get(k)) for k in FLAGS if flags_raw.get(k)}

    # Story flags must be consistent: later steps need the earlier ones.
    if party and not f.get('starter'):
        f['starter'] = True
    if not f.get('starter'):
        for k in ('bonded', 'shrine', 'done'):
            if f.pop(k, None):
                adjusted.append(f'flag {k} needs a starter, removed')
    if not f.get('bonded'):
        for k in ('shrine', 'done'):
            if f.pop(k, None):
                adjusted.append(f'flag {k} needs a bond, removed')
    if not f.get('shrine') and f.pop('done', None):
        adjusted.append('flag done needs the shrine visit, removed')

    map_id = raw.get('mapId', 'V')
    if not isinstance(map_id, str) or map_id not in MAPS:
        adjusted.append('unknown map, moved to the village')
        map_id = 'V'
    # Mirror the in-game warp gates.
    if (map_id == 'F' and not f.get('starter')) or (map_id == 'S' and not f.get('bonded')):
        adjusted.append('location not unlocked yet, moved to the village')
        map_id = 'V'
        x = y = None
    else:
        x = raw.get('x')
        y = raw.get('y')
    m = MAPS[map_id]
    try:
        xi, yi = _int(x, 'x'), _int(y, 'y')
        ok = 0 <= xi < m['w'] and 0 <= yi < m['h']
    except SaveError:
        ok = False
    if not ok:
        xi, yi = m['spawn']
        adjusted.append('position invalid, moved to the map spawn point')

    direction = raw.get('dir', 0)
    try:
        d = _int(direction, 'dir')
    except SaveError:
        d = 0
    d = d if 0 <= d <= 3 else 0

    clean = {
        'party': party, 'storage': storage, 'dex': dex, 'selyo': selyo, 'herbs': herbs, 'f': f,
        'mapId': map_id, 'x': xi, 'y': yi, 'dir': d,
    }
    return clean, adjusted


def client_data() -> dict[str, Any]:
    """What the browser needs (no server-only fields)."""
    return {k: DATA[k] for k in ('limits', 'maps', 'species', 'moves', 'type_chart', 'dex_order', 'attribute_names', 'encounters')}
