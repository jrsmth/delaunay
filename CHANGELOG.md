# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<br>

## [1.2.3] - 04/08/2023

### Changed
- [DEL-43-44] Refactored tooltip styling

<br>

## [1.2.2] - 20/07/2023

### Added
- [DEL-43] Added get-version.sh script to retrieve info from package.json's

### Changed
- [DEL-43] Updated styling and template for version display

<br>

## [1.2.1] - 03/07/2023

### Changed
- [DEL-44] Styling for tooltip text now includes line-spacing 
- [DEL-44] ? character used as tooltip icon now replaced with fa-question from FontAwesome

<br>

## [1.2.0] - 26/06/2023

### Added 
- `dblclick` event listener to delete points, replacing single-click
- A help tooltip at the top-right of the interactive view

### Fixed
- [DEL-20 / #2] Moved points were being released lower than intended

### Changed
- Moved `dark` and `light` CSS classes from within `button.flat` for increased re-usability

<br>

## [1.1.2] - 27/05/2023

### Added
- Initial commit of `CHANGELOG.md` (DEL-41)
- Excluded `*.md` files in `.gitignore` for `gh-pages` branch

<br>

## [1.1.1] - 26/05/2023

### Fixed
- Prevent slider decrement if point clicked but not deleted (DEL-20)

<br>

## [1.1.0] - 26/05/2023

### Added
- Update `main` workflow to bump to next incremental `-SNAPSHOT` (DEL-40)
- Added `/app` exclusion for `gh-pages` branch to `.gitignore`

### Changed
- Refactored the `README.md`

<br>

## [1.0.4] - 22/05/2023

### Changed
- Refactored the `README.md`

<br>

## [1.0.3] - 22/05/2023

### Changed
- Refactored the `README.md`

<br>

## [1.0.2] - 22/05/2023

### Removed
- Deleted comments for `main.yaml`

### Changed
- Refactored the `README.md`

<br>

## [1.0.1] - 22/05/2023

### Added
- Addition of version bump and tag steps to `main.yaml` workflow

### Removed
- Removal of `index.js` and `index.css` from non-`gh-pages` branch

<br>

[1.2.3]: https://github.com/JRSmiffy/delaunay/compare/1.2.2...1.2.3
[1.2.2]: https://github.com/JRSmiffy/delaunay/compare/1.2.1...1.2.2
[1.2.1]: https://github.com/JRSmiffy/delaunay/compare/1.2.0...1.2.1
[1.2.0]: https://github.com/JRSmiffy/delaunay/compare/1.1.2...1.2.0
[1.1.2]: https://github.com/JRSmiffy/delaunay/compare/1.1.1...1.1.2
[1.1.1]: https://github.com/JRSmiffy/delaunay/compare/1.1.0...1.1.1
[1.1.0]: https://github.com/JRSmiffy/delaunay/compare/1.0.4...1.1.0
[1.0.4]: https://github.com/JRSmiffy/delaunay/compare/1.0.3...1.0.4
[1.0.3]: https://github.com/JRSmiffy/delaunay/compare/1.0.2...1.0.3
[1.0.2]: https://github.com/JRSmiffy/delaunay/compare/1.0.1...1.0.2
[1.0.1]: https://github.com/JRSmiffy/delaunay/releases/tag/1.0.1

# Version History
- `1.3.x` - ?
- `1.2.x` - Second wave of bug fixes and interactive tooltip
- `1.1.x` - First wave of bug fixes and workflow refactor
- `1.0.x` - Initial release and workflow set-up
- `0.x.x` - Initial development