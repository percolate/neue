# neue

[![Build Status](https://circleci.com/gh/percolate/neue.png?circle-token=6bbc1bb47f0b1add61020aa5c48b878e5fef201e)](https://circleci.com/gh/percolate/neue)

## A minimal web font loader

Load linked fonts with `@font-face`.

## Installation

Install with npm:

```
$ npm install git+ssh://git@github.com:percolate/neue.git
```

## Downloads

- [neue.js](dist/neue.js)
- [neue.min.js](dist/neue.min.js)

## Usage

Load font families using [FVD-style](https://github.com/percolate/fvd) declarations:


```js
neue.load([
    { families: ['Source Sans Pro:n2,n3,n4,n6,n7,n9'], css: '//fonts.googleapis.com/css?family=Source+Sans+Pro:200,300,400,600,700,900' }
], function(err){
    // fonts are ready!
})
```

Where the CSS file looks something like this:

```css
@font-face {
    font-family: 'Source Sans Pro';
    font-style: normal;
    font-weight: 200;
    src: ...
}
@font-face {
    font-family: 'Source Sans Pro';
    font-style: normal;
    font-weight: 300;
    src: ...
}
@font-face {
    font-family: 'Source Sans Pro';
    font-style: normal;
    font-weight: 400;
    src: ...
}
@font-face {
    font-family: 'Source Sans Pro';
    font-style: normal;
    font-weight: 600;
    src: ...
}
@font-face {
    font-family: 'Source Sans Pro';
    font-style: normal;
    font-weight: 700;
    src: ...
}
@font-face {
    font-family: 'Source Sans Pro';
    font-style: normal;
    font-weight: 900;
    src: ...
}
```

## Utilities

### `parse`

```js
neue.parse('Source Sans Pro:n2') // { family: 'Source Sans Pro', variations: ['n2'] }
```

### `stringify`

```js
neue.stringify('Source Sans Pro:n2') // ['source-sans-pro-n2']
```

## Example

Run the example server at [http://127.0.0.1:3000](http://127.0.0.1:3000):

```
$ npm run example-server
```

## Tests

Run and open test server at [http://127.0.0.1:8000](http://127.0.0.1:8000):

```
$ grunt test:dev
```

## Builds

Create standalone `dist/neue.js` and `dist/neue.min.js` builds:

```
$ grunt dist
```
