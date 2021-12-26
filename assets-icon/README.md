# Instructions for Generating The Icon
1. To export, select "File" > "Generator" > "Image Assets" to export assets.
2. Duplicate the generated folder and rename it as `icon.iconset`.
3. Select all the icon files within and rename them by changing `Icon-MacOS-` to `icon_` (case sensitive)
  * Example: `Icon-MacOS-16x16@1x` becomes `icon_16x16@1x`
4. Run `iconutil icon.iconset`
5. An `icon.icns` file will be generated, move it to `build` folder and that's it.

Reference: https://developer.apple.com/library/archive/documentation/GraphicsAnimation/Conceptual/HighResolutionOSX/Optimizing/Optimizing.html#//apple_ref/doc/uid/TP40012302-CH7-SW4
