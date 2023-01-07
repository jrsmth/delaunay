# Delaunay
Delaunay Triangulation Demo

<br>

## Overview
* Explanation and presentation

<br>

## Showcase
* In this project, a vanilla TypeScript `app` is transpiled into JavaScript
* It is then bundled with Browserify, so it can be easily consumed by `index.html`
    * See [package.json](./app/package.json)'s `build` script:
        * TypeScript Compiler (`tsc`) is used to transpile `.ts` files into `.js`
        * [Browserify](https://browserify.org/) then bundles the `.js` files into an easily-consumed format for `index.html`
* Use of delaunator...