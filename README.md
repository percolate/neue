# neue

## A minimal web font loader for JavaScript

Load linked fonts via `@font-face`.

## Installation

```
$ npm install git+ssh://git@github.com:percolate/neue.git
```

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
