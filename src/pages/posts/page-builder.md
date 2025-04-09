---
title: 'Page builder folder structure'
pubDate: 2025-09-04
description: 'Example folder structure'
author: 'Krix Daniel'
image:
    url: 'https://docs.astro.build/assets/rose.webp'
    alt: 'The Astro logo on a dark background with a pink glow.'
tags: ["astro", "blogging", "learning in public"]
layout: '@/layouts/MarkDownPostLayout.astro'
---

```plaintext
builder
├── config
│   ├── default-lib
│   └── dynamic-edit-form
├── lib
│   ├── drag-block-canvas
│   ├── drag-block-cell
│   ├── drag-drop
│   ├── drag-layout
│   ├── drag-lib-block
│   ├── drag-lib-layout
│   ├── dynamic-edit-form
│   └── mock-init-data
├── model
│   ├── block.hook
│   ├── block.type
│   ├── canvas.hook
│   ├── cell.hook
│   ├── cell.type
│   ├── dynamic-edit-form.type
│   ├── edit-block.constract
│   ├── edit-block.type
│   ├── edit-layout-form.hook
│   └── layout.hook
└── ui
    ├── block-library
    ├── block
    ├── builder
    ├── canvas
    ├── cell
    ├── dynamic-edit-form
    ├── edit-block-form
    ├── edit-layout-form
    ├── edit-zone
    ├── layout
    └── toolbar
```


libs:
- @atlaskit/pragmatic-drag-and-drop
    - packages:
        - @atlaskit/pragmatic-drag-and-drop-flourish
        - @atlaskit/pragmatic-drag-and-drop-hitbox
        - @atlaskit/pragmatic-drag-and-drop-react-drop-indicator
