# generator-fly-laravel [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> Scaffold a new Laravel or Lumen application with Fly as its tooling system.

## Installation

First, install [Yeoman](http://yeoman.io) and generator-fly-laravel using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-fly-laravel
```

Then generate your new project:

```bash
yo fly-laravel
```

## Prompts

* **Framework:** Laravel vs Lumen
* **Github:** Author & Author's Website
* **Dev URL Proxy:** Vagrant URL to proxy, via BrowserSync
* **CSS Preprocessor:** SASS, LESS, Stylus, None
* **ESLint Config:** XO preset or AirBnB preset
* **Test Runner:** Ava, Mocha, Tape, None
* **Travis:** Add a `.travis.yml` file?
* **Git:** To `init` or Not to `init`?

## License

MIT © [Luke Edwards](https://lukeed.com)


[npm-image]: https://badge.fury.io/js/generator-fly-laravel.svg
[npm-url]: https://npmjs.org/package/generator-fly-laravel
[travis-image]: https://travis-ci.org/lukeed/generator-fly-laravel.svg?branch=master
[travis-url]: https://travis-ci.org/lukeed/generator-fly-laravel
[daviddm-image]: https://david-dm.org/lukeed/generator-fly-laravel.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/lukeed/generator-fly-laravel
