---
layout: default
title: Configuration
---

# Configuration

youtube-music-cli stores its configuration in `~/.youtube-music-cli/config.json`.

## Configuration File

```json
{
	"theme": "dark",
	"volume": 70,
	"shuffle": false,
	"repeat": "off",
	"streamQuality": "high"
}
```

## Options

### theme

The visual theme for the TUI.

| Value      | Description                  |
| ---------- | ---------------------------- |
| `dark`     | Dark theme (default)         |
| `light`    | Light theme                  |
| `midnight` | Deep blue theme              |
| `matrix`   | Green on black, Matrix-style |

**CLI flag:** `--theme` or `-t`

```bash
youtube-music-cli --theme=matrix
```

### volume

Initial playback volume (0-100).

**Default:** `70`

**CLI flag:** `--volume` or `-v`

```bash
youtube-music-cli --volume=80
```

### shuffle

Enable shuffle mode on startup.

**Default:** `false`

**CLI flag:** `--shuffle` or `-s`

```bash
youtube-music-cli --shuffle
```

### repeat

Repeat mode on startup.

| Value | Description          |
| ----- | -------------------- |
| `off` | No repeat (default)  |
| `all` | Repeat entire queue  |
| `one` | Repeat current track |

**CLI flag:** `--repeat` or `-r`

```bash
youtube-music-cli --repeat=all
```

### streamQuality

Audio streaming quality.

| Value    | Bitrate   | Description            |
| -------- | --------- | ---------------------- |
| `low`    | ~64kbps   | Save bandwidth         |
| `medium` | ~128kbps  | Balanced               |
| `high`   | ~256kbps+ | Best quality (default) |

**Note:** Change via Settings menu (`,` key) in the TUI.

## Config Directory Structure

```
~/.youtube-music-cli/
├── config.json           # Main configuration
├── plugins/              # Installed plugins
│   ├── adblock/
│   └── lyrics/
└── plugin-permissions.json  # Plugin permissions
```

## Environment Variables

| Variable                   | Description                      |
| -------------------------- | -------------------------------- |
| `YOUTUBE_MUSIC_CLI_CONFIG` | Override config directory        |
| `DEBUG`                    | Enable debug logging (`DEBUG=*`) |

## Resetting Configuration

Delete the config file to reset to defaults:

```bash
rm ~/.youtube-music-cli/config.json
```

## Editing Configuration

You can edit `config.json` directly while youtube-music-cli is not running, or use the Settings menu (`,` key) in the TUI.
