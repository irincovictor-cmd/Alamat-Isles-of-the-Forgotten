# Creature Storage and Admin Art Testing

## Overview

- **Active party:** up to 3 creatures, used for battles.
- **Storage:** up to 30 extra creatures, saved under the account alongside party and Dex.
- **Automatic capture placement:** a new bond goes to active party if there is room; otherwise to Storage. At the combined limit (3+30), bonding cannot proceed until space is made. Duplicates of a species may be stored.
- **Dex:** permanently reveals any creature recruited to party or storage.
- **Old saves:** Storage defaults to an empty list, so past progress remains valid.
- **Account save:** `storage` is validated with the same canonical species and stat rules as `party`.

## How to use

While exploring (outside a battle), click **Storage** or press **B**.

- Left/Right switches between **Stored Creatures** and **Active Party**.
- Up/Down selects a creature; selection pages after every seven entries.
- Enter on a stored creature moves it into the party if fewer than 3 are active.
- If the party has 3 creatures, Enter starts a swap: choose which active creature to exchange, then Enter.
- Enter on a party creature stores it, unless that would leave the party empty or storage is full.
- Esc closes Storage or cancels a pending swap.
- F5 saves immediately. Actions also trigger the usual automatic save.

## Admin-only art test roster

The **Load All Creatures** button appears only for Django `is_staff` or `is_superuser` accounts **when `DJANGO_DEBUG=1`**.

- Sign into the game on your staff/superuser account and enter the world.
- Click **Load All Creatures**, confirm. The backend checks staff permission and local development mode.
- This **replaces the admin account's current active party and Storage** with all 15 species (3 active, 12 stored), registers all 15 in the Dex, and retains map/story progress (ensuring starter/bond flags).
- Only the *admin account* is changed; regular users' captures and Dex stay untouched.
- It does **not** create or load missing PNG artwork. Species without installed art files will display their existing placeholder.
- The endpoint uses authenticated POST + session CSRF protection, checks save revision to avoid overwriting another session's edits, and is disabled outside DEBUG mode.
- The test roster is persisted to the admin account's cloud save; do not run this button on an admin account whose current party must remain intact.

## Installation

1. Extract each downloaded art ZIP **at the project root**, preserving the `game/static/game/assets/creatures/.../` structure.
2. Pull the latest commits: `git pull --ff-only origin main`.
3. Run `python manage.py test game` and then `python manage.py runserver`.
4. Open `http://127.0.0.1:8000/play/`, hard refresh, and confirm the Dex and Storage UI.

## Quality assurance

- Confirm normal account doesn't see **Load All Creatures**.
- Confirm staff account with DEBUG enabled sees it.
- Confirm seeding yields exactly 15 Dex entries, 3 active members and 12 stored members.
- Swap two creatures; confirm that the Dex stays unlocked and that both creatures retain their level/HP.
- Save/reload; verify Storage remains stable.
- Capture another creature after party is full: it should enter Storage automatically.
- Existing game tests have new backend regression assertions, but a local Django test run and visual inspection are required after pulling.

## Future

A physically modeled storage chest or village repository could later replace the present Storage menu; the data model and account-save behavior can remain unchanged.
