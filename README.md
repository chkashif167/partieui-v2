# Partie Design Assets

This project contains HTML templates and CSS for Partie. JavaScript is intended to demo functionality, but is not production ready.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Installing

Clone repo

```
git clone git@github.com:creativedash/partie.git
```

Install npm dependencies

```
npm install
```

Run local dev server

```
npm run dev
```

Build without running dev server

```
npm run build
```

## File Structure

### /pattern_exports

These files are the full, complied HTML for each page. The HTML contained in these files is everything between the `<body>` tags.

### /public

These are the generated source files for the entire style guide. These files are not checked in to source control.

### /source

These files define the templates and CSS/JS for the elements, components, and pages. Unused files and directories are not described here for brevity.

##### /_meta

Contains patterns for tags to be included in the `<head>` block (mostly CSS and fonts) and at the end of the `<body>` block (mostly JS) 

##### /_patterns

Templates for elements, components, and pages. Numbered prefixes on directories and files are for ordering purposes only.

`.json` files contain data that is used to populate the `mustache` templates. Within the templates:

* `{{ variableName }}` does string interpolation
* `{{> patternName }}` includes a partial
* `{{#variableName}} {{/variableName}}` is either a boolean test or list iteration depending on the variable
* `{{^variableName}} {{/variableName}}` is a negative boolean test

###### /00-elements

Self contained, single purpose elements. Icons contain SVG markup.

###### /01-components

Reusable groups of elements used to compose pages.

###### /02-pages

Individual pages corresponding to designs from Figma.

#### /css

`normalize.css` and `style.css` are project files. The `pattern-scaffolding.css` file is used only within the generated styleguide.

#### /fonts

Contains the `Mont` font files used in this project. This font is *not yet* licensed for the production version of the site.

#### /images

Placeholder images exported from the Figma designs

#### /js

`app.js` contains all of the JavaScript for the demo interactions. External packages (i.e. zxcvbn, GSAP, etc.) are *not* packaged and are included in the head via the `_meta/_01-foot.mustache` file using `cdnjs.cloudflare.com`.

## Built With

* [PatternLab](https://patternlab.io/) - "Style Guide" framework
* [Mustache](http://mustache.github.io/mustache.5.html) - Templating language
* [zxcvbn](https://github.com/dropbox/zxcvbn) - Password Strength Estimation
* [GSAP](https://greensock.com/gsap) - TweenMax and TimelineMax are used here, although TweenLite and TimelineLite can be used to limit package size
* [ScrollMagic](http://scrollmagic.io/) - Animations on scroll
* [Hammer.JS](https://hammerjs.github.io/) - Touch gestures

## Authors

* **Bill Broughton** - bill@ui8.net
