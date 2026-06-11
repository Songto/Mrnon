# Ambience sounds

The ambience mixer (bottom-right 🔈) plays your own looping audio. Drop up to
six files here with these names:

| Slot        | File            |
|-------------|-----------------|
| 🌧️ Rain      | `rain.mp3`      |
| 🔥 Fireplace | `fireplace.mp3` |
| 🎐 Chimes    | `chimes.mp3`    |
| 🎶 Lofi      | `lofi.mp3`      |
| ☕ Café      | `cafe.mp3`      |
| 🌳 Forest    | `forest.mp3`    |

Tips:
- Use **seamless looping** clips (they repeat). `.mp3` or `.ogg`, ideally a few
  minutes and < ~3 MB each.
- Rename slots / labels / emojis or change which files are used by editing the
  `SOUNDS` list in `src/components/AmbiencePlayer.tsx`.
- Until a file exists, its button is faded; tapping it tells you which file to add.
