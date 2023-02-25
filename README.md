# Delaunay

Delaunay Triangulation Demo

jrsmiffy.github.io/delaunay/

[@jrsmiffy/delaunator](https://github.com/JRSmiffy/delaunator)

![Example Screenshot](https://user-images.githubusercontent.com/34093915/221354864-f71c18da-7269-4e21-b7a3-c9a56e1affaf.png)

## Explanation
* For a set of points `P`, the Delaunay Triangulation `DT(P)`, is such that no point in `P` lies inside the circumcircle of any triangle in `DT(P)`
* ℹ️ [More info](https://en.wikipedia.org/wiki/Delaunay_triangulation)

## Features

- :video_camera: Generates a Delaunay Triangulation for a set of points
- :cloud: Floats over all application windows (optionally).
- :art: Allows color, brightness, contrast, and saturation to be configured.
- :see_no_evil: Can live in the macOS dock, menu bar, or both.
- :zap: Built with Electron.

## Notes

- :beetle: This is an early version. Bugs may exist.
- :green_apple: Currently only supports macOS. (Could support Windows with some work.)
- :earth_asia: Contributions welcome!



## Build
* `npm run build --prefix ./app`

<br>

* Release?
* Deploy? automatically through default GH pages action

* In this project, a vanilla TypeScript `app` is transpiled into JavaScript
* It is then bundled with [Browserify](https://browserify.org/), so it can be easily consumed by `index.html`
    * See [package.json](./app/package.json)'s `build` script:
        * TypeScript Compiler (`tsc`) is used to transpile `.ts` files into `.js`
        * `browserify` then bundles the `.js` files into an easily-consumed format for `index.html`
* Use of delaunator...