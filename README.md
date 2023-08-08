[![Build and Deploy](https://github.com/JRSmiffy/delaunay/actions/workflows/main.yaml/badge.svg)](https://github.com/JRSmiffy/delaunay/actions/workflows/main.yaml)

# Delaunay
Delaunay Triangulation [Demo](https://jrsmiffy.github.io/delaunay/)

[@jrsmiffy/delaunator](https://github.com/JRSmiffy/delaunator)

<img width="1440" alt="Delaunay Demo Example" src="https://user-images.githubusercontent.com/34093915/221356676-ccfd0c15-4504-47e2-bd9b-d9bda5d175c6.png">

## Explanation
- 🧮  For a set of points `P`: `DT(P)` is such that no point in `P` lies inside the circumcircle of any triangle
- ℹ️  [More info](https://en.wikipedia.org/wiki/Delaunay_triangulation)

## Notes
- 📦  `npm run build --prefix ./app`
  - For Windows users, use Git Bash (or WSL) for building
  - `jq` is not included with Git Bash, so you can try `curl -L -o /usr/bin/jq.exe https://github.com/stedolan/jq/releases/latest/download/jq-win64.exe` to add it
- 🚀  `main branch is served by GitHub Pages`