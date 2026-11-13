# ALAMAT: Isles of the Forgotten

**A Philippine-inspired creature-collecting adventure RPG**

**Genre:** 2D top-down exploration, turn-based combat, creature collecting  
**Platform:** Web browser (local Django development server)  
**Visual style:** Modern HD pixel art  
**Development status:** Playable academic prototype — actively under development

## About the game

**ALAMAT: Isles of the Forgotten** is an original, story-driven role-playing game set in a fictional archipelago inspired by the natural environments, wildlife, and cultural storytelling traditions of the Philippines.

Players explore coastal villages, mysterious forests, and sacred ruins, meeting the people and creatures that inhabit the islands. A supernatural disturbance known as the **Lilim** is beginning to affect the land. As a new adventurer, the player must discover what is happening, form bonds with extraordinary creatures, strengthen their team, and uncover the secrets hidden throughout the isles.

The game's core identity is built around **exploration, companionship, environmental mystery, and Philippine-inspired fantasy**. Rather than simply capturing monsters, the player earns their trust and uses a special item called a **Selyo** to form a bond.

> **Cultural note:** The setting and its original creature species are fantasy creations, not literal representations of Philippine folklore. Traditional beings such as the Tikbalang and Bakunawa retain their documented names and are researched separately. Lilim, the game's supernatural disturbance, and the Selyo bonding system are original fictional concepts.

## The story

The adventure begins in **Lumina Village**, a quiet settlement where the player encounters local guides and learns about the creatures that live nearby. After selecting a first companion, the player journeys into **Balete Forest**, where wild creatures roam and signs of the Lilim begin to emerge.

Beyond the forest lies the **Ancient Shrine**, a place connected to the island's deeper mysteries. The current prototype introduces these three locations and the first chapter of the adventure. The wider archipelago, additional quests, and a fuller storyline remain in development.

## How the game works

The gameplay follows a simple cycle:

**Explore → Talk to NPCs → Encounter creatures → Battle or bond → Develop your party → Discover new areas → Save progress**

### Main features

- **Top-down exploration:** Walk through interconnected maps with tile-based movement, obstacles, and environmental details.
- **Turn-based creature battles:** Fight using each creature's moves, statistics, and elemental attributes.
- **Bonding instead of ordinary capture:** Weaken and build trust with wild creatures, then spend a Selyo to attempt recruitment.
- **15 original creatures:** Discover species with distinctive designs, abilities, and attributes.
- **Eight attributes:** Flame (Fire), Tide (Water), Stone (Earth), Bloom (Nature), Gale (Wind), Spark, Light, and Shadow. Attribute matchups influence combat.
- **Creature Dex:** Unknown creatures appear as silhouettes. Their identities and details are revealed when recruited.
- **Party and reserve storage:** Bring up to **3 creatures** into battle and keep up to **30 additional creatures** in Storage; swap team members as needed.
- **Growth and progression:** Creatures gain experience, level up, and learn stronger moves. The current level cap is 30.
- **Player accounts and progress saving:** Register, sign in, and save or load your game through the Django backend.
- **Game audio:** Optional looping background music with on/off and volume controls, when its separately supplied MP3 is installed.

### Starter creatures

| Creature | Attribute | Description |
|---|---|---|
| **Tarsilaw** | Light | A bright-eyed forest watcher inspired by the Philippine tarsier |
| **Agilunos** | Gale / Wind | An eagle-inspired guardian of the highland skies |
| **Bagaon** | Flame / Fire | A sturdy ember beast with a volcanic appearance |

### The 15-creature roster

| # | Creature | Attribute | # | Creature | Attribute |
|---|---|---|---|---|---|
| 001 | Tarsilaw | Light | 009 | Kidlatin | Spark |
| 002 | Agilunos | Gale / Wind | 010 | Silong | Shadow |
| 003 | Bagaon | Flame / Fire | 011 | Arawan | Light |
| 004 | Alitaptap | Spark | 012 | Ugbok | Stone / Earth |
| 005 | Lumot | Bloom / Nature | 013 | Bulakna | Bloom / Nature |
| 006 | Pakpak | Shadow | 014 | Habagat | Gale / Wind |
| 007 | Bato | Stone / Earth | 015 | Liyaban | Flame / Fire |
| 008 | Dagat | Tide / Water | | | |

All 15 have prepared battle artwork. Final overworld sprites, animations, and visual verification are still ongoing. See the [Creature Art Tracker](docs/CREATURE_ART_TRACKER.md).

## Locations

| Location | Role |
|---|---|
| **Lumina Village** | Starting hub, NPC interactions, introductory story, and village buildings |
| **Balete Forest** | Wild encounters, exploration, and the path toward the shrine |
| **Ancient Shrine** | Mysterious location associated with the Lilim and the first chapter |

The village's new shop, hospital, storage-house, and workshop buildings are being developed. Some currently offer introductory dialogue rather than complete store or crafting interfaces. The shrine's replacement building art also requires local installation and map integration.

## Controls

| Control | Function |
|---|---|
| Arrow keys / WASD | Move |
| E / Space / Enter | Interact or confirm |
| Esc / X | Back / close a menu |
| P | Party |
| B | Creature Storage |
| K | Creature Dex |
| G | Attribute counter guide |
| M | Toggle music |
| F5 | Save |
| F9 | Load |
| F3 | Reset a stuck view outside battle |
| F2 | Show collision inspector |
| N (title screen) | New game |

On-screen controls are available for supported touch devices. Music volume can be adjusted below the game canvas.

## Installation and running the game

### Requirements

- Python and pip
- A modern web browser
- Git (for cloning the repository)

Clone the repository:

```bash
git clone https://github.com/irincovictor-cmd/Alamat-Isles-of-the-Forgotten.git
cd Alamat-Isles-of-the-Forgotten
```

Create and activate a virtual environment:

**Windows Command Prompt**

```cmd
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

**macOS / Linux**

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Open the local game at **http://127.0.0.1:8000/play/**.

New users can register at **http://127.0.0.1:8000/register/**. The main site is available at **http://127.0.0.1:8000/**.

This address is local to the machine running Django; it is **not** a publicly deployed game.

### Installing optional art and music

Some approved image assets and the recorded soundtrack are distributed separately from the public repository. Missing assets may display fallback artwork or an explicit missing-art notice.

Extract supplied asset ZIPs **into the project root**, preserving the folder structure:

```text
game/static/game/assets/
├── characters/
├── creatures/
│   └── <species-id>/
│       ├── battle/
│       │   ├── front.png
│       │   └── back.png
│       └── menu.png
├── environment/
│   ├── buildings/
│   │   └── finished/
│   └── forest/
├── tiles/
└── audio/
    └── village_compilation.mp3
```

Battle art uses a front sprite for wild creatures and a back sprite for the player's active creature. Menu artwork is reused in the Party, Dex, and related views.

The recorded soundtrack is a **single compilation** currently played continuously throughout the game. Distinct music for each area and battle is a planned enhancement. See [Music Installation](docs/GAME_MUSIC.md) and [Asset Instructions](game/static/game/assets/README.md).

## Administrator setup (local installations)

Anyone running their **own local copy** of the project can create an administrator through the terminal after database migration:

```cmd
python manage.py setupadmin
```

Follow the prompts to choose a unique username and strong password. Administrative access is **not** granted through public player registration.

While development mode is enabled, authorized staff/superusers may use **Load All Creatures** for testing the entire roster (3 in the active party, 12 in Storage). This replaces only that administrator's current test collection. The feature is not intended for regular players or production servers.

## Technology

- **Backend:** Python, Django, Django REST Framework
- **Frontend:** JavaScript, HTML Canvas, HTML, CSS
- **Game data:** Shared JSON definitions for species, moves, elemental matchups, and game limits
- **Persistence:** Django-managed user accounts and saved progress
- **Graphics:** Modern HD pixel art with optional sprite assets and procedural fallbacks
- **Audio:** Browser-based MP3 playback with volume and mute controls

The current playable game is implemented in `game/static/game/alamat.js`. Phaser and TypeScript are longer-term architectural possibilities, **not dependencies of the current game**.

## Current development status

**Playable today:** Introductory chapter, three explorable maps, starter selection, creature encounters, battle and bonding, 15-species Dex, party and storage management, attribute guide, account saves, and admin artwork testing.

**Still being developed:** Building interiors, functioning Selyo/potion shops, crafting, full shrine storyline, additional islands, polished overworld creature art and animations, refined balancing, and separate area/battle soundtracks.

This is an **academic game project and an evolving prototype**, not a finished commercial release.

### Testing

Run the Django test suite:

```bash
python manage.py test game
```

The game also shows a client self-test count beneath the canvas. Test results and graphical behavior should be checked locally after pulling code changes.

## Project documentation

- [Game Design Document](docs/GAME_DESIGN.md)
- [Art Style Bible](docs/ART_STYLE_BIBLE.md)
- [Creature Art Tracker](docs/CREATURE_ART_TRACKER.md)
- [Creature Storage and Admin Testing](docs/CREATURE_STORAGE_AND_TESTING.md)
- [Village Building Replacement](docs/VILLAGE_BUILDING_REPLACEMENT.md)
- [Game Music](docs/GAME_MUSIC.md)
- [Play on Another Device — Transfer and Backup Guide](docs/INSTALL_ON_ANOTHER_DEVICE.md)
- [Folklore Research and Naming Policy](docs/FOLKLORE_POLICY.md)
- [Backend README](README_BACKEND.md)
- [Development Progress](PROGRESS.md)

## Cultural references and asset credits

Alamat takes inspiration from Philippine environments, wildlife, and folklore research. The game's **15 collectible species are original fantasy creations** and should not be confused with documented traditional beings.

The [Aswang Project](https://www.aswangproject.com/philippine-mythology/) is used as a research starting point, with region-specific attribution and source review encouraged. Its text and imagery are **not automatically available for reuse**.

Some art and audio are sourced from independently licensed or owner-generated material. Respect each original creator's permissions. The public repository excludes certain asset bundles; game-use permission does not necessarily grant permission to redistribute the original files.

**Music:** [CLAIM.BEATS — Free RPG Style Village Music](https://claim-beats.itch.io/free-rpg-style-village-music) (installed separately).

---

*ALAMAT: Isles of the Forgotten — explore forgotten places, discover extraordinary creatures, and uncover the mystery of the Lilim.*
