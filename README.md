# neue

## A minimal web font loader for JavaScript

Composable, async loading of linked fonts via `@font-face`.

## Installation

```
$ npm install neue
```

or:

- [neue.js]()
- [neue.min.js]()

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

To run the test server at [http://127.0.0.1](http://127.0.0.1):

```
$ npm run-script test-server
```

## License

MIT License, see [LICENSE]() for details.
