# Implementation Plan: Shuffle Mode

[Overview]
Add fully functional shuffle mode that toggles sequential/random playback via Shift+S, with UI feedback and robust edge-case handling.

The codebase already has a partial shuffle scaffold: `PlayerState.shuffle: boolean`, a `TOGGLE_SHUFFLE` reducer case that flips the flag, and a `toggleShuffle` action in the provider. However, the actual shuffle logic is missing from the `NEXT` reducer case, no keybinding is wired up, and there is no UI indicator showing the current shuffle state. This implementation completes all three missing pieces without interrupting playback.

The approach is surgical: modify the `NEXT` (and optionally `PREVIOUS`) reducer case to branch on `state.shuffle`, add the `Shift+S` keybinding constant and register it in `PlayerControls`, and surface the shuffle state visually in `NowPlaying` and `ShortcutsBar`.

[Types]
No new types are required; all necessary types already exist.

`PlayerState.shuffle: boolean` — already defined in `source/types/player.types.ts`
`ToggleShuffleAction` — already defined in `source/types/actions.ts` with `category: 'TOGGLE_SHUFFLE'`
`PlayerAction` union — already includes `ToggleShuffleAction`

No changes to type files are needed.

[Files]
Three existing files need modifications; no new files are created.

**Modified files:**

1. `source/utils/constants.ts`
   - Change `SHUFFLE: ['s']` to `SHUFFLE: ['shift+s']` to match the task requirement of Shift+S hotkey.
   - Add `TOGGLE_SHUFFLE: ['shift+s']` alias if clearer naming is preferred (use `SHUFFLE` key which already exists).

2. `source/stores/player.store.tsx`
   - **`NEXT` case in `playerReducer`**: Add shuffle branch. When `state.shuffle` is `true` and the queue has more than one track, pick a random index from all queue indices excluding `state.queuePosition`. When `state.shuffle` is `true` and queue is empty or has only one track, fall through to existing sequential logic or return `state`.
   - **`PREVIOUS` case in `playerReducer`**: No change needed — standard behavior (go to true previous track) is correct for PREVIOUS even in shuffle mode, matching Spotify/YouTube Music behavior.
   - **`TOGGLE_SHUFFLE` case**: Already correct — just flips `state.shuffle`. No changes needed.

3. `source/components/player/PlayerControls.tsx`
   - Import `toggleShuffle` from `usePlayer`.
   - Register `useKeyBinding(KEYBINDINGS.SHUFFLE, toggleShuffle)`.
   - Add shuffle state indicator in the JSX: display `[Shift+S] 🔀 ON` or `[Shift+S] 🔀 OFF` using `playerState.shuffle`.

4. `source/components/common/ShortcutsBar.tsx`
   - Import `toggleShuffle` from `usePlayer`.
   - Register `useKeyBinding(KEYBINDINGS.SHUFFLE, toggleShuffle)`.
   - Add `Shift+S` to the shortcuts hint text, showing current shuffle state (e.g., `Shift+S Shuffle:ON`).
   - **Note:** Decide whether to register the binding here OR in `PlayerControls` — to avoid double-dispatch, pick ONE location. Given that `PlayerControls` already duplicates bindings from `ShortcutsBar` (both register PLAY_PAUSE, NEXT, PREVIOUS, etc.), we register the shuffle binding in BOTH components (matching the existing pattern) but the registry deduplication in `useKeyboard.ts` means both handlers fire — so only register in `PlayerControls` to avoid two `toggleShuffle` calls per keypress.

   **Revised decision**: Register the shuffle keybinding ONLY in `PlayerControls.tsx` (consistent with `speedUp`/`speedDown` which are only there), and add only the visual hint in `ShortcutsBar.tsx` without a keybinding call.

5. `source/components/player/NowPlaying.tsx`
   - Add a shuffle indicator line (e.g., a small `🔀` icon with color highlight when `playerState.shuffle` is true) near the status indicators section.

[Functions]
One function body requires modification; all others are additions.

**Modified functions:**

- `playerReducer` in `source/stores/player.store.tsx`
  - **`NEXT` case**: Currently: `const nextPosition = state.queuePosition + 1; if (nextPosition >= state.queue.length) { ... } return { ...state, queuePosition: nextPosition, ... }`.
  - **New logic**: Before the existing sequential logic, add:

    ```typescript
    case 'NEXT': {
      if (state.queue.length === 0) return state;

      if (state.shuffle && state.queue.length > 1) {
        // Pick random index excluding current position
        let randomIndex: number;
        do {
          randomIndex = Math.floor(Math.random() * state.queue.length);
        } while (randomIndex === state.queuePosition);
        return {
          ...state,
          queuePosition: randomIndex,
          currentTrack: state.queue[randomIndex] ?? null,
          progress: 0,
        };
      }

      // Sequential: existing logic
      const nextPosition = state.queuePosition + 1;
      if (nextPosition >= state.queue.length) {
        if (state.repeat === 'all') {
          return { ...state, queuePosition: 0, currentTrack: state.queue[0] ?? null, progress: 0 };
        }
        return state;
      }
      return { ...state, queuePosition: nextPosition, currentTrack: state.queue[nextPosition] ?? null, progress: 0 };
    }
    ```

  - Edge cases handled: empty queue (return state), single-track queue (shuffle with 1 track falls through to sequential — `queue.length > 1` guard), repeat='one' is handled upstream in track-completion effect (seeks to 0 instead of calling next), repeat='all' wraps correctly in sequential branch.

**New keybinding registration (in PlayerControls.tsx):**

- Add `toggleShuffle` to the destructured player hook values.
- Add `useKeyBinding(KEYBINDINGS.SHUFFLE, toggleShuffle);` after existing `useKeyBinding` calls.

[Classes]
No class changes required. The codebase uses functional components and hooks throughout; no class-based components are involved.

[Dependencies]
No new dependencies required. All functionality uses existing React, Ink, and internal utilities.

[Testing]
Validate the following scenarios manually and via existing test patterns:

**Unit/integration test additions** in `tests/playback.test.js`:

- Test that `TOGGLE_SHUFFLE` action correctly flips `state.shuffle` from `false` to `true` and back.
- Test that `NEXT` with `shuffle: true` and a queue of 3+ tracks returns a position different from the current position (may need to mock `Math.random`).
- Test that `NEXT` with `shuffle: true` and a queue of exactly 1 track does NOT throw and returns a valid state (sequential fallthrough).
- Test that `NEXT` with `shuffle: true` and an empty queue returns unchanged state.
- Test that `NEXT` with `shuffle: false` uses sequential logic (existing behavior, regression test).
- Test that `PREVIOUS` is unaffected by shuffle state.

**Manual verification checklist:**

- [ ] Press `Shift+S` → shuffle icon/indicator changes state in UI
- [ ] Play a queue of 5+ tracks, enable shuffle, press `Next` repeatedly → tracks play in non-sequential order
- [ ] Disable shuffle mid-playback → next press of Next goes to sequential next track without interrupting current
- [ ] Enable shuffle with only 1 track in queue → Next does nothing (or repeats if repeat=all)
- [ ] Enable shuffle with empty queue → no crash
- [ ] State persists: toggle shuffle, restart app → shuffle state restored correctly (already handled by `savePlayerState`/`loadPlayerState` since `shuffle` is already persisted)

[Implementation Order]
Implement in this sequence to minimize conflicts and allow incremental testing.

1. **`source/utils/constants.ts`**: Change `SHUFFLE` keybinding from `['s']` to `['shift+s']`. This is a one-line change and the foundation for everything else.

2. **`source/stores/player.store.tsx`**: Modify the `NEXT` case in `playerReducer` to add shuffle branch. This is the core logic change. Verify the edge cases (empty queue, single track, repeat modes).

3. **`source/components/player/PlayerControls.tsx`**: Add `toggleShuffle` to hook destructuring and register `useKeyBinding(KEYBINDINGS.SHUFFLE, toggleShuffle)`. Add shuffle indicator to JSX.

4. **`source/components/player/NowPlaying.tsx`**: Add shuffle state visual indicator (small icon/text near the time display area).

5. **`source/components/common/ShortcutsBar.tsx`**: Add `Shift+S` shuffle hint to the shortcuts text (visual only — no keybinding registration here to avoid double-dispatch).

6. **`tests/playback.test.js`**: Add shuffle-specific test cases for the reducer logic.

7. **Lint + format cycle**: Run `npx eslint .` then `npx prettier . --check`, fix any issues, then `git add -A && git commit`.
