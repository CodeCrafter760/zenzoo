Drop looping lo-fi / ambient tracks here (`.m4a` or `.mp3`), then wire each one
into the `TRACKS` array in `src/screens/AudioLoungeScreen.tsx` with:

```ts
audio: require('../../assets/Vibe_audio/your_file.m4a'),
```

Until a track has a real `audio` file, leave its `audio` field `null` — the
Vibe screen shows those as "Coming soon" instead of trying to play them.
