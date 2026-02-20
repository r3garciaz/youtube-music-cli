$ErrorActionPreference = 'Stop'

$package = '@involvex/youtube-music-cli'

if (Get-Command npm -ErrorAction SilentlyContinue) {
	npm install -g $package
} elseif (Get-Command bun -ErrorAction SilentlyContinue) {
	bun install -g $package
} else {
	throw "npm or bun is required to install $package."
}

Write-Host 'youtube-music-cli installed. Run: youtube-music-cli'
