# Play ALAMAT on Another Device (Windows)

This guide explains how to move **ALAMAT: Isles of the Forgotten** to another Windows computer, either as a fresh installation or with existing save progress.

**Important:** The game's GitHub repository contains the code, but some custom PNG sprites and MP3 assets are distributed separately. The game uses **a local Django server**, not a public online game server. Each machine running its own Django instance has its own local database unless that database is copied.

## Recommended method — GitHub + asset backup

This avoids repeatedly uploading the entire source code to Google Drive.

### 1. Back up your assets on the original PC

Copy the full contents of this directory (including all subfolders):

```text
C:\Users\vtemp\alamat\game\static\game\assets
```

Make a ZIP archive named `Alamat_Custom_Assets_Backup.zip` and upload it to your private Google Drive. Keep its folder structure intact.

It should contain everything installed locally, not just the last ZIP we generated:

```text
assets/
├── audio/
│   └── village_compilation.mp3
├── characters/
├── creatures/
│   └── <creature-id>/battle/{front.png,back.png}
├── environment/
│   ├── buildings/finished/
│   └── forest/
└── tiles/
```

**Don't assume GitHub contains every asset.** Some images and recordings have separate reuse/redistribution conditions. Only back up and share assets you have rights to use.

### 2. Install the prerequisites on the other PC

Install [Python](https://www.python.org/downloads/) (ensure `python` and `pip` are available) and [Git](https://git-scm.com/downloads/win). Use a current supported Python 3 release compatible with the dependencies in `requirements.txt`.

Open **Command Prompt** and enter:

```cmd
cd %USERPROFILE%
git clone https://github.com/irincovictor-cmd/Alamat-Isles-of-the-Forgotten.git
cd Alamat-Isles-of-the-Forgotten
python -m venv .venv
.venv\Scripts\activate
python -m pip install -r requirements.txt
python manage.py migrate
```

If cloning into a folder that already exists, use a different destination, or update an existing clone rather than cloning again.

### 3. Restore the artwork and music

Download your private asset backup ZIP from Google Drive, extract it, and copy the entire `assets` folder into:

```text
<new-project-folder>\game\static\game\assets\
```

Choose **Replace the files in the destination** if Windows asks. Preserve lowercase filenames, paths, and the `.png` or `.mp3` extensions.

Expected example paths:

```text
game\static\game\assets\environment\buildings\finished\ancient_shrine.png
game\static\game\assets\creatures\agilunos\battle\front.png
game\static\game\assets\audio\village_compilation.mp3
```

### 4A. Start with new player accounts and progress

If you want a fresh game, **do not copy** `db.sqlite3` from the original computer. After `python manage.py migrate`, the new machine has its own SQLite database.

Start the game:

```cmd
python manage.py runserver
```

Open <http://127.0.0.1:8000/play/> and register a player account through <http://127.0.0.1:8000/register/>.

To create a local administrator for testing, stop the server and run:

```cmd
python manage.py setupadmin
```

Choose a unique strong password. For local development, the admin **Load All Creatures** feature is available to staff/superusers when DEBUG is enabled.

### 4B. Instead, transfer existing accounts and save progress

If you want **the same account and saved creatures**, copy the SQLite database from the original PC. This file contains all local user accounts, password hashes, player saves and potentially other sensitive information. **Do not upload it publicly or commit it to GitHub.**

1. Exit Django on **both** computers. Do not copy an actively changing SQLite database.
2. Make a private backup of `<original-project-folder>\db.sqlite3`. If Django was configured with `DJANGO_DB_PATH`, locate the configured database instead. Use a database-aware backup for an active database.
3. On the new PC, back up any existing `db.sqlite3` and then replace it with your copied version in the new project's root.
4. If you have environment-specific settings in a local `.env` file, recreate them appropriately on the new PC. Do **not** publish secrets or passwords. If needed, configure `DJANGO_DB_PATH` to point to the copied database.
5. Start Django with `python manage.py runserver` and sign in using your existing account.

**Warning:** Replacing `db.sqlite3` overwrites the target computer's local accounts and saves. This is a one-time transfer, **not live synchronization**. Changes made on the two computers afterward remain separate.

### 5. Verify the game

From the project root:

```cmd
python manage.py test game
python manage.py runserver
```

Open <http://127.0.0.1:8000/play/> and check:

- Lumina Village, Balete Forest and the Ancient Shrine load.
- The new shrine and other finished buildings show the correct PNGs.
- Creature battle, menu and Dex sprites appear.
- Background music plays after clicking inside the browser, and the volume slider works.
- Save, log out, log in and load your progress.

If an asset fails to load, open its local static URL, e.g.
<http://127.0.0.1:8000/static/game/assets/environment/buildings/finished/ancient_shrine.png>
or
<http://127.0.0.1:8000/static/game/assets/audio/village_compilation.mp3>.
A 404 usually indicates an incorrect filename or extraction path.

## Alternative — single offline backup ZIP

If you want one ZIP in Google Drive rather than using GitHub, archive the project root containing the source code, all locally installed assets, and **optionally** the SQLite database when preserving progress.

Recommended backup contents:

```text
Alamat-Isles-of-the-Forgotten/
├── config/
├── game/
│   └── static/game/assets/  (all installed PNGs and MP3s)
├── docs/
├── manage.py
├── requirements.txt
├── README.md
└── db.sqlite3              (optional, private only)
```

Do not include `.venv/`, `venv/`, `__pycache__/`, `.git/`, `staticfiles/`, temporary caches or unnecessary archives. A virtual environment should be recreated on the new PC. Keep `.env` and database files private. If backing up secrets, store them securely and recreate settings as needed instead of indiscriminately sharing them.

On the second PC, extract the ZIP, create a new virtual environment, install requirements, run migrations (for a fresh database), and start the server. With a copied existing database, keep its original file and avoid running migrations until you have backed it up and checked compatibility with the source version.

## Other kinds of devices

- **Another Windows PC or laptop:** Follow the instructions above.
- **Phone/tablet with only a web browser:** It **cannot run this Django project merely by opening the ZIP**. A computer or hosted server must run Django, and the phone must access that server over a permitted network address. The default `127.0.0.1` URL only refers to the device itself.
- **Access from another device on the same Wi-Fi:** A Django instance can be bound to a LAN interface with `python manage.py runserver 0.0.0.0:8000` and an appropriately configured `DJANGO_ALLOWED_HOSTS`; however, Django's development server is not intended for untrusted/public exposure. Configure firewall and networking safely, and do not port-forward or expose your development server to the Internet.
- **Play anywhere over the Internet:** Requires deploying Django to a production hosting service with proper HTTPS, static file serving, secret configuration and a persistent database. That is a separate deployment task.

## Key reminder

**GitHub = current game code. Google Drive = separate private assets and backups. SQLite database = local accounts and progress.**

You can keep using `git pull --ff-only origin main` to update an installed copy without replacing its private assets or database, provided you don't have conflicting local code edits.
