# Delaunay
Delaunay Triangulation Demo

<br>

## Overview
* Explanation and presentation

<br>

## Showcase
* In this project, a vanilla TypeScript `app` is transpiled into JavaScript and then bundled so it can be easily consumed by `index.html`
    * See [package.json](./app/package.json)'s `build` script:
        * TypeScript Compiler (`tsc`) is used to transpile `.ts` files into `.js`
        * Browserify then bundles the `.js` files into an easily-consumed format for `index.html`
* Use of delaunator...