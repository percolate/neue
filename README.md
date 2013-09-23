# neue

## A minimal web font loader

Load linked fonts via `@font-face`.

## Installation

Install with npm:

```
$ npm install git+ssh://git@github.com:percolate/neue.git
```

## Downloads

- [neue.js](dist/neue.js)
- [neue.min.js](dist/neue.min.js)

## Usage

```js
neue.load([
    { families: ['Grand Hotel'], css: 'grand-hotel.css' }
], function(err){
    // fonts are ready!
})
```

Where `grand-hotel.css` is like:

```css
@font-face {
    font-family: 'Grand Hotel';
    font-style: normal;
    font-weight: 400;
    src: local('Grand Hotel'), url('grand-hotel.ttf') format('truetype');
}
```

## Tests

To run the test server at [http://127.0.0.1:3000](http://127.0.0.1:3000):

```
$ npm run-script test-server
```

## Builds

Create standalone builds with Grunt:

```
$ grunt build
```
