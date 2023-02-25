# Delaunay

<br>

![Screenshot 2023-02-25 at 11 38 37](https://user-images.githubusercontent.com/34093915/221354864-f71c18da-7269-4e21-b7a3-c9a56e1affaf.png)

<br>

## Explanation
* Delaunay is...

<br>

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