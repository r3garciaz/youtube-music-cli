# youtube-music-cli

- A Commandline music player for youtube-music

## Install

```bash
npm install --global @involvex/youtube-music-cli
```

## CLI

```
$ youtube-music-cli --help

  Usage
    $ youtube-music-cli

  Options
    --theme, -t    Theme to use (dark, light, midnight, matrix)
    --volume, -v   Initial volume (0-100)
    --shuffle, -s   Enable shuffle mode
    --repeat, -r   Repeat mode (off, all, one)
    --headless     Run without TUI (just play)
    --help, -h     Show this help

  Examples
    $ youtube-music-cli
    $ youtube-music-cli play dQw4w9WgXcQ
    $ youtube-music-cli search "Rick Astley"
    $ youtube-music-cli play dQw4w9WgXcQ --headless
```
