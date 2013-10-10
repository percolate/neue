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

Define font families in [FVD](https://github.com/typekit/fvd) style:

```js
neue.load([
    { families: ['Source Sans Pro:n2,n3,n4,n6,n7,n9'], css: '//fonts.googleapis.com/css?family=Source+Sans+Pro:200,300,400,600,700,900' }
], function(err){
    // fonts are ready!
})
```

Where the loaded CSS is like:

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
neue.parse('Source Sans Pro') // { family: 'Source Sans Pro', variations: ['n4'] }
```

### `stringify`

```js
neue.stringify('Source Sans Pro') // ['source-sans-pro-n4']
```

## Examples

Run the example server at [http://127.0.0.1:3000](http://127.0.0.1:3000):

```
$ npm run-script example-server
```

## Builds

Create standalone builds with [Grunt](http://gruntjs.com/):

```
$ grunt dist
```
