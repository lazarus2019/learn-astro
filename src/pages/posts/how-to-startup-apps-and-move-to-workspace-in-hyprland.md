---
title: '👨💻 How to startup apps and move to workspace in Hyprland?'
pubDate: 2025-05-10
description: 'Have you ever started some apps every time you boot the machine? Believe me, I do it a lot (e.g., browser, terminal, code IDE) until I want to make that process automatic.'
author: 'Krix Daniel'
image:
    url: 'https://docs.astro.build/assets/rose.webp'
    alt: 'The Astro logo on a dark background with a pink glow.'
tags: ["linux", "hyprland"]
layout: '@/layouts/MarkDownPostLayout.astro'
---

Have you ever started some apps every time you boot the machine? Believe me, I do it a lot (e.g., browser, terminal, code IDE) until I want to make that process automatic. 

The short serial steps below will help you start all your favourite apps simultaneously.

Ref solution: https://www.reddit.com/r/hyprland/comments/16bql40/launching_apps_and_moving_to_a_specific_workspace/

Let's jump on it, shall we?
- Create file `startup-app.sh` and place in `~/.config/hypr/scripts/`
```bash
#!/bin/bash
# This script will startup the app with custom flag (optional)
# receive 3 arguments: (workspace, app_class, flags?)
# flag: optional

MAX_ARGUMENTS=3

# This script using hyprctl, update to your system if needed
start_app() {
  local workspace=$1
  local command="$2"
  sleep 2 # Delay 2 second for system loaded (hyprland exec-once will run parallel)
  hyprctl dispatch exec "[workspace $workspace silent] $command"
}

log_error_syntax() {
  echo "Wrong syntax, follow arguments: (workspace, app_class, flags?)" 
}

start_app_without_flags() {
  start_app $1 $2
}

start_app_with_flags() {
  start_app $1 "$2 $3"
}

if [ "$#" -eq $((MAX_ARGUMENTS - 1)) ]; then
  start_app_without_flags $1 $2
elif [ "$#" -eq $MAX_ARGUMENTS ]; then
  start_app_with_flags $1 $2 $3
else
  log_error_syntax
fi
```
- Give execute permission
```bash
chmod +x ./startup-app.sh
```
- List startup apps in `autostart.conf`
```bash
exec-once=~/.config/hypr/scripts/startup-app.sh 1 brave "flags here"
exec-once=~/.config/hypr/scripts/startup-app.sh 2 wezterm
```
- Reboot and enjoy!

Other reference links:
Bash syntax: https://devhints.io/bash
Hyprland dispatcher: https://wiki.hyprland.org/Configuring/Dispatchers/

See you in the next post 🤠