---
title: 'Astro image format compare'
pubDate: 2025-09-04
description: 'Astro image format compare'
author: 'Krix Daniel'
image:
    url: 'https://docs.astro.build/assets/rose.webp'
    alt: 'The Astro logo on a dark background with a pink glow.'
tags: ["astro", "blogging", "learning in public"]
layout: '@/layouts/MarkDownPostLayout.astro'
---

## 📊 Benchmark
Using component `Image` from `astro:assets`
- Network configuration benchmark:
	- Download: 2mb/s
	- Upload: 2mb/s
### Example 1 (PNG)
![Example 1 (PNG)](@/assets/image-format/example_1.png)

Source: 
- Format: **PNG**
- Size: **372kb**

| Format type | Size   | Time   |
| ----------- | ------ | ------ |
| JPG         | 36.6kb | ~500ms |
| JPEG        | 36.6kb | ~500ms |
| PNG         | 360kb  | ~4.6s  |
| AVIF        | 7.3kb  | ~500ms |
| WEBP        | 25.8kb | ~450ms |
### Example 2 (JPG)
![Example 2 (JPG)](@/assets/image-format/example_2.png)

Source: 
- Format: **JPG**
- Size: **251kb**

| Format type | Size   | Time    |
| ----------- | ------ | ------- |
| JPG         | 225kb  | ~2.11s  |
| JPEG        | 255kb  | ~2.11s  |
| PNG         | 2.3mb  | ~16.15s |
| AVIF        | 51.6kb | ~4.3s   |
| WEBP        | 119kb  | ~1.6s   |
## 🧠 Summary

| Format type      | Pros                                                                                                                            | Cons                                                                                                                                                | When                                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| ==**JPG/JPEG**== | - Widely supported  <br>- Small file size for photos  <br>- Adjustable compression                                              | - Lossy compression (quality loss)  <br>- No transparency support                                                                                   | - Photographic content  <br>- Thumbnails, hero images where transparency isn't needed               |
| ==**PNG**==      | - Lossless compression  <br>- Supports transparency (alpha channel)  <br>- Good quality                                         | - Larger file size compared to JPG  <br>- Not ideal for large photos                                                                                | - Icons, logos, UI elements  <br>- Images requiring transparency or sharp edges                     |
| ==**AVIF**==     | - Very high compression (better than WebP/JPG)  <br>- Excellent quality  <br>- Supports transparency and HDR                    | - Limited browser support (improving)  <br>- Slower encoding<br>- Reduce detail color (could optimize this, check [unplash](https://unsplash.com/)) | - When you want best quality at smallest size  <br>- Progressive enhancement (fallback to WebP/PNG) |
| ==**WEBP**==     | - Better compression than JPG/PNG  <br>- Supports transparency & animation  <br>- Widely supported by modern browsers<br>       | - Not supported in older browsers  <br>- Encoding might be slower than JPG/PNG                                                                      | - Optimized images for modern web  <br>- Replace JPG/PNG for better performance                     |
| ==**SVG**==      | - Vector (resolution-independent)  <br>- Small file size for simple graphics  <br>- Animatable and stylable with CSS/JS<br><br> | - Not ideal for complex images/photos  <br>- Can be security risk if not sanitized                                                                  | - Icons, logos, illustrations  <br>- When you need scalability and interactivity                    |

- Use **===JPG===** for standard photos and photographic backgrounds.
- Use **===PNG===** for transparent UI graphics or when quality is key and size is acceptable.
- Use **==AVIF==** if performance is critical and browser support aligns.
- Use **==WEBP==** as a good middle-ground modern format.
- Use **==SVG==** for sharp, scalable icons and illustrations.
### Other formats

| Format type | Pros                                                                                                                 | Cons                                                                                          | When                                                                                                                                                   |
| ----------- | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **==GIF==**         | - Widely supported  <br>- Supports animation  <br>- Simple transparency (1-bit)                                      | - Only 256 colors (poor for photos)  <br>- Large file sizes  <br>- Outdated for animations    | - Simple animations (fallback only)  <br>- Small animated UI elements if no other format is possible  <br>_(Use WebP or Lottie instead when possible)_ |
| **==TIFF==**        | - High quality (lossless)  <br>- Supports layers, transparency, multiple pages  <br>- Great for professional imaging | - ==**Not supported**== in browsers  <br>- Very large file sizes  <br>- Not optimized for web | - ==**Do not use for web display**==  <br>- Best for **image archival**, printing, or backend processing only                                          |
