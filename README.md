# Delaunay
Delaunay Triangulation Demo

<br>

## Overview
* Explanation and presentation

<br>

## Showcase
* In this project, a vanilla TypeScript `app` is transpiled into JavaScript
* It is then bundled with [Browserify](https://browserify.org/), so it can be easily consumed by `index.html`
    * See [package.json](./app/package.json)'s `build` script:
        * TypeScript Compiler (`tsc`) is used to transpile `.ts` files into `.js`
        * `browserify` then bundles the `.js` files into an easily-consumed format for `index.html`
* Use of delaunator...

<br>

## Build
* `npm run build --prefix ./app`

<br>

* Release?
* Deploy? automatically through default GH pages action
