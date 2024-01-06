protogram-help
===================

[![Build Status](https://travis-ci.org/arjunmehta/node-protogram-help.svg?branch=master)](https://travis-ci.org/arjunmehta/node-protogram-help)


A simple to use, help module to auto generate usage info when using the [protogram](https://github.com/arjunmehta/node-protogram) module for node.js.

## Installation

```bash
npm install --save protogram-help
```

## Basic Usage

### Include with Protogram

```javascript
var program = require('protogram').create();
var help = require('protogram-help');
```

### Configure Your Help (if you want)

```javascript
help.set({
    version: '0.0.3',
    name: 'Protogram Help Example',
    handleError: true
});
```

### Add as an Option Flag

```javascript
program
    .command('*', { includeRoot: true })
    .option('--help', help);
```

### Done.


## API

### help.set(options)
Sets certain options that will be used to handle the display of usage information.

- `options` **Object**:
    - `version` **String**: Your program's version number.
    - `name` **String**: The name of your program.
    - `handleError` **Boolean**: Output usage information for your program if there is an argument error.

```javascript
help.set({
    version: '0.0.3',
    name: 'Protogram Help Example',
    handleError: true
});
```

Or use it directly when setting your `--help` option:
```javascript
program
    .command('*', { includeRoot: true })
    .option('--help', help.set({
        version: '0.0.3',
        name: 'Protogram Help Example',
        handleError: true
    }));
```

### help.version
Alternative to `help.set({version: xxx })`

```javascript
help.version = '0.0.3';
```

### help.name
Alternative to `help.set({name: xxx })`

```javascript
help.name = 'Protogram Help Example';
```

### help.handleError
Alternative to `help.set({handleError: xxx })`

```javascript
help.handleError = true;
```


## License

The MIT License (MIT)
Copyright (c) 2014 Arjun Mehta
