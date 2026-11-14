# Playing ALAMAT on a Phone

ALAMAT now includes a responsive mobile layout and touch controls. The game is **still a browser-based Django project**, not an Android/iOS app. A hosting computer must keep the Django server running.

## Open it on your phone (same Wi-Fi)

1. On the Windows host PC, pull the latest game:
   ```cmd
   cd C:\Users\vtemp\alamat
   git pull --ff-only origin main
   ```
2. Start the LAN development server:
   ```cmd
   powershell -ExecutionPolicy Bypass -File .\run_lan.ps1
   ```
3. Open the IP address displayed in the terminal in your phone browser, e.g. `http://192.168.1.25:8000/play/`. **This is an example, not your PC's real address.**
4. Both the phone and host PC must be connected to the **same local Wi-Fi/LAN**. On school or guest Wi-Fi, client isolation may prevent connecting.
5. Keep the host PC and server running while playing. Your account and progress are stored on that server's database.

## Touch controls

- **Direction pad (▲ ◀ ▼ ▶):** Hold to move around the world. In menus, tap once per selection.
- **A:** Interact, confirm, or advance dialogue.
- **B:** Cancel or go back.
- **Direct taps:** Choose a starter creature, a battle option, Party row, or Storage row by touching it. Tap a Dex card to highlight it; press A to open its detail/guide.
- **Party, Dex, Storage, Guide:** Use the buttons under the game, which work with touch.
- **Music / Volume:** Use the same buttons and slider as on desktop. The music may start only after tapping, due to browser autoplay policies.
- **Portrait / Landscape:** Both are supported; landscape gives a larger game display, while portrait allows scrolling down to controls.

## Troubleshooting

- A blank or inaccessible page: make sure the PC server is running, use the real LAN IP instead of `127.0.0.1`, and check Windows Firewall inbound TCP 8000 on **Private** networks.
- Old layout: force reload the browser page; if necessary, close and reopen the tab.
- No music: confirm the MP3 exists at `game/static/game/assets/audio/village_compilation.mp3`, tap inside the game, and check browser volume/music settings.
- Missing sprites: copy the entire custom `game/static/game/assets` folder to the host PC; mobile browsers do not need those images downloaded separately.
- If game text looks too small, turn the phone sideways for a larger canvas. Browser zoom may help but can affect layout.

## Safety

This LAN script uses Django's development server and is for **trusted private-network testing**. Do **not** forward port 8000 on your router or expose Django's development server publicly. An Internet-accessible game requires production deployment (HTTPS, secure cookies and secrets, appropriate hosts, static assets, persistent database, and a production application server).

## QA checklist

- [ ] Screen and buttons fit a narrow phone in portrait.
- [ ] Touch and hold the direction pad to walk, release to stop.
- [ ] A opens dialogue and proceeds through it; B cancels.
- [ ] Tap battle actions and move selections.
- [ ] Tap a starter, Dex entry, and Party/Storage row.
- [ ] Switch menus without overlapping overlays.
- [ ] Save, reload, and test the music controls.
- [ ] Rotate to landscape and repeat a battle.

**Implementation:** Responsive `game/static/game/alamat.css`, `game/templates/game/play.html`, and pointer handling in `game/static/game/alamat.js`. This change was statically syntax checked; real phone/browser interaction should still be verified.
