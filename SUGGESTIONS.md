# Feature Suggestions & Improvements

This document tracks potential features, enhancements, and improvements for youtube-music-cli.

## 🎵 Playback Features

### High Priority

- [ ] **Gapless Playback** - Seamless transitions between tracks without audio gaps
- [ ] **Crossfade Support** - Smooth audio crossfading between songs (configurable duration)
- [ ] **Equalizer** - Built-in audio equalizer with preset profiles (Bass Boost, Vocal, etc.)
- [ ] **Playback Speed Control** - Adjust playback speed (0.5x - 2.0x)

### Medium Priority

- [ ] **Offline Mode** - Cache tracks locally for offline playback
- [ ] **Audio Normalization** - Consistent volume levels across tracks
- [ ] **Sleep Timer** - Auto-stop playback after specified duration
- [ ] **Lyrics Display** - Show synced or static lyrics in the TUI

## 🔍 Discovery & Search

### High Priority

- [ ] **Advanced Search Filters** - Filter by artist, album, year, duration
- [ ] **Search History** - Quick access to previous searches
- [ ] **Smart Recommendations** - ML-based track suggestions beyond YouTube's algorithm

### Medium Priority

- [ ] **Genre Browsing** - Browse music by genre/mood
- [ ] **New Releases** - Dedicated view for new music releases
- [ ] **Charts/Trending** - Display popular/trending tracks
- [ ] **Similar Artists** - Discover artists similar to currently playing

## 📋 Playlist Management

### High Priority

- [ ] **Local Playlists** - Create and manage playlists stored locally
- [ ] **Import/Export** - Import playlists from Spotify, Apple Music, etc.
- [ ] **Playlist Sync** - Sync with YouTube Music account playlists
- [ ] **Smart Playlists** - Auto-generated playlists based on listening history

### Medium Priority

- [ ] **Collaborative Playlists** - Share playlists with others
- [ ] **Playlist Folders** - Organize playlists into folders
- [ ] **Duplicate Detection** - Warn when adding duplicate tracks

## 🎨 User Interface

### High Priority

- [ ] **Visualizer** - ASCII/ANSI audio visualizer in terminal
- [ ] **Album Art** - Display album artwork using terminal graphics (sixel, kitty protocol)
- [ ] **Mini Player Mode** - Compact single-line player mode
- [ ] **Split View** - Side-by-side queue and search results

### Medium Priority

- [ ] **Custom Keybindings** - User-configurable keyboard shortcuts
- [ ] **Mouse Support** - Click interactions for modern terminals
- [ ] **Notification Integration** - Desktop notifications for track changes
- [ ] **More Themes** - Additional color themes (Dracula, Nord, Solarized, etc.)

## 🔧 Technical Improvements

### High Priority

- [ ] **Plugin System** - Extensible architecture for community plugins
- [ ] **Multiple Audio Backends** - Support for mpv, VLC, ffplay as alternatives
- [ ] **Better Error Recovery** - Graceful handling of network failures, API limits
- [ ] **Caching Layer** - Cache API responses to reduce latency

### Medium Priority

- [ ] **Remote Control** - Control playback via HTTP API or socket
- [ ] **Scrobbling** - Last.fm / ListenBrainz scrobbling support
- [ ] **Discord Rich Presence** - Show currently playing in Discord
- [ ] **MPRIS Support** - Media player integration on Linux (playerctl compatible)

### Low Priority

- [ ] **Multi-instance Sync** - Sync playback state across multiple terminals
- [ ] **Telemetry (Opt-in)** - Anonymous usage statistics for improvement
- [ ] **Performance Profiling** - Built-in performance monitoring tools

## 🔐 Security & Privacy

### High Priority

- [ ] **Proxy Support** - HTTP/SOCKS proxy configuration
- [ ] **TOR Support** - Route traffic through TOR network
- [ ] **No Tracking Mode** - Prevent YouTube from tracking listening history

### Medium Priority

- [ ] **Encrypted Config** - Encrypt stored preferences and tokens
- [ ] **Audit Logging** - Log all external network requests

## 📱 Platform & Integration

### Medium Priority

- [ ] **Homebrew Formula** - Easy installation on macOS
- [ ] **AUR Package** - Arch Linux package
- [ ] **Snap/Flatpak** - Linux universal packages
- [ ] **Windows Installer** - MSI/EXE installer for Windows

### Low Priority

- [ ] **Web UI** - Optional browser-based interface
- [ ] **Mobile Companion** - Remote control from mobile device
- [ ] **Alfred/Raycast** - macOS launcher integration
- [ ] **tmux Integration** - Status line integration for tmux

## 🐛 Known Issues to Fix

- [ ] Occasional audio stream interruption on slow connections
- [ ] Search results sometimes don't include all available tracks
- [ ] Theme colors may not render correctly on some terminal emulators
- [ ] Volume control precision varies by audio backend

## 💡 Community Requested

_This section will be populated based on GitHub issues and discussions._

---

## Contributing

Want to work on any of these? Check our [Contributing Guide](CONTRIBUTING.md) and feel free to:

1. Open an issue to discuss the feature
2. Submit a PR implementing the feature
3. Help with documentation or testing

## Priority Legend

- **High Priority**: Core functionality improvements, frequently requested
- **Medium Priority**: Nice-to-have features, moderate complexity
- **Low Priority**: Future considerations, complex implementations
