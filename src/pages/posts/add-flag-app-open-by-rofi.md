---
title: '👨💻 How to add flag wayland for electron applications?'
pubDate: 2022-07-01
description: 'Hello guys, this post will allow you to use unicode in Electron apps (google-chrome, brave, discord,...) open via rofi'
author: 'Krix Daniel'
image:
    url: 'https://docs.astro.build/assets/rose.webp'
    alt: 'The Astro logo on a dark background with a pink glow.'
tags: ["astro", "blogging"]
layout: '@/layouts/MarkDownPostLayout.astro'
---

Hello guys, this post will allow you to use unicode in Electron apps (google-chrome, brave, discord,...) open via `rofi`

If you are using [i3](https://github.com/i3/i3) (X11) and [ibus-bamboo](https://github.com/BambooEngine/ibus-bamboo) you don't have to worry about it cause the ibus-bamboo work well in electrons app.

And if you using [hyprland](https://hyprland.org/) (wayland) or any desktrop enviroment based on wayland, and have to use [fcitx] (https://fcitx-im.org/wiki/Fcitx_5) for unicode. Then this post is what you need.

## The magic flag
```
--enable-features=UseOzonePlatform --ozone-platform=wayland --enable-wayland-ime
```
## Setup with rofi
- Create file `~/.local/bin/rofi-electron-launch`
```bash
#!/bin/bash

# List of apps that require the Wayland flags
ELECTRON_APPS=(
  "discord"
  "thunar"
  "code"
  "firefox"
  "google-chrome"
  "brave-browser"
  "obsidian"
  "chromium"
  "vscode"
  "brave"
  # Adding more your application class name
)

# Extract the base command (before any args)
CMD="$1"
BASE_CMD=$(basename "$CMD")
FLAG="--enable-features=UseOzonePlatform --ozone-platform=wayland --enable-wayland-ime"

# Check if the base command matches any Electron app
for app in "${ELECTRON_APPS[@]}"; do
  if [[ "$BASE_CMD" == "$app" ]]; then
    exec "$CMD" $FLAG
  fi
done

# If not in the list, run as-is with arguments
exec "$@"
```
- Set execute mode: chmod +x ~/.local/bin/rofi-electron-launch
- In keybindings file (for me is ~/.config/hypr/conf/keybindings/default.conf) define a path to file `rofi-electron-launch`
```
$ELECTRON_LAUNCH_SCRIPT=$HOME/.local/bin/rofi-electron-launch 
```
- Add a flag [`-run-command`](https://davatorium.github.io/rofi/current/rofi.1/#run-settings) after keybinding launch rofi
```
pkill rofi || rofi -show drun -replace -i -run-command "$ELECTRON_LAUNCH_SCRIPT {cmd}"
```
- Reload the config and enjoy!

## Alternative ways
- Open app and add the flag manual in terminal
```
discord --enable-features=UseOzonePlatform --ozone-platform=wayland --enable-wayland-ime
```
[Other ways GPT](https://shorturl.at/GoGjX)