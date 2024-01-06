# node-ansi-state
[![Build Status](https://travis-ci.org/arjunmehta/node-ansi-state.svg?branch=master)](https://travis-ci.org/arjunmehta/node-ansi-state)

Use this module to capture the state of your ANSI colors and styles, and restore them at another time and/or place.

Sometimes you need to keep track of multiple ANSI style states, though you may not know what they are. This module provides:

- **Full ANSI style code capturing, including: foreground & background colour (xterm colours too!), intensity, italic, underline, blink, polarity, conceal, strikethrough, font, framed and overlined styles.**
- **The ability to check all the state style attributes listed above.`**
- **A streamable interface (pipe or write to update).**
- **The ability to create multiple instances to save multiple style states.**
- **Restore any state instance at any time.**

## Installation
```bash
npm install --save ansi-state
```

## Basic Usage

### Include

```javascript
var ANSIState = require('ansi-state')
```

### Create a New State
Instantiate a new state with the constructor:

```javascript
var state = new ANSIState()
```

### Manually Save ANSI Style Codes
You can `update` the state manually by calling the corresponding method on it and passing in a string or array that contains ansi style codes. Only the most recently received codes for various attributes will be kept (ie. you can only have one foreground colour at a time). This module keeps track of all of that for you!

```javascript
state.update('\033[32mHi there! \033[31mRed text')
//current state becomes: \033[31m

state.update('\033[1mBolding the text too')
//current state becomes: \033[1;31m

state.update('\033[34;38;5;211mxterm colors too!')
//current state becomes: \033[1;38;5;211m
```

### Automatically Save by Writing/Piping
Because states are streamable, they can be fixed in your pipeline or written to like any other writeable stream. This is handy if you want to automatically capture codes that are on their way to a particular stream (ie. stdout).

```javascript
state.write('\033[32mHi there! This is some \033[31mred text')
// current state becomes: \033[31m

state.write('\033')
state.write('[3')
state.write('7m')
// current state becomes: \033[37m

state.write('\033[1mBolded \033[2mFaint \033[22mNormal Intensity')
// current state becomes: \033[22;37m
```

Or piping from and to other streams:
```javascript
some_stream.pipe(state).pipe(process.stdout);
some_stream.write('\033[33mHi there!')
// current state becomes: \033[33m
```

### Check State Attributes
You can check certain style attributes at any time, easily:
```javascript
var state = new ANSIState('\033[32mHi there! \033[31mRed text, \033[1;48;5;21m')
console.log(state.foreground) // red
console.log(state.background, state.xterm_background) // xterm color definition, [5, 21]
console.log(state.intensity) // bold
console.log(state.blink) // null
```

### The Current ANSI State Code
Your `ANSIState` instance holds an efficient ansi style escape code for the current ansi state, accessible by its `code` property:

```javascript
var state = new ANSIState('\033[32mHi there! \033[31mRed text, \033[1;48;5;21m')
console.log(state.code + 'This is logged in the current ansi state.');
console.log('The current ansi state is:', JSON.stringify(state.code)); // "\033[1;31;48;5;21m"
```

### Restore ANSI State
Great, so you've been able to keep tabs on the current ansi state, now what if you want to restore that state some place? Well you can output the state's ansi code simply:

```javascript
process.stdout.write(state.code) // outputs current state code to stdout
```

Or if you've set a writeable stream to pipe to, you can just call the `restore` method.
```javascript
state.pipe(process.stdout)
state.restore() // will push state.code to wherever it is piped (ie. stdout).
```

### Reset ANSI State
You can reset the state by simply calling the `reset` method on the state.

```javascript
state.reset() // sets code to '\033[0m'
```

You may want to then write to the terminal with the reset code:
```javascript
process.stdout.write(state.reset().code)
```

And of course, if you are piping to another stream:
```javascript
state.pipe(process.stdout)
state.reset().restore()
```

### Create a New ANSI State from an Old One

Finally, you can fork your state from an existing one really easily:

```javascript
var new_state = new ANSIState(state)
// OR
var new_state = new ANSIState(state.code)
```


## API
### new ANSIState(legacy) Constructor
Creates a new instace of `ANSIState`. `data` can be any of type **String**, **Array** or another **ANSIState** instance.

```javascript
var state = new ANSIState('\033[1;32m');
```

### state.update(data)
Updates the ansi style state contained in the `ANSIState` instance. `data` can be any of type **String**, **Array** or another **ANSIState** instance. The array can be of the form `['\033[32m', '\033[1;22;34m']` (usually what is returned from a regex match) or `[32, 1, 22, 34]`.

```javascript
state.update('\033[32mHi there! \033[31mRed text')
//current state becomes: \033[31m

state.update('\033[1mBolding the text too')
//current state becomes: \033[1;31m

state.update('\033[34;38;5;211mxterm colors too!')
//current state becomes: \033[1;38;5;211m
```

### state.write(data)
The stream class write method on the `ANSIState` instance. `data` must be of type `String`.

```javascript
state.write('\033[32mHi there! This is some \033[31mred text')
// current state becomes: \033[31m

state.write('\033')
state.write('[3')
state.write('7m')
// current state becomes: \033[37m
```

### state.pipe(stream)
Pipe any data passed into the `ANSIState` to the supplied stream. `stream` can be any writeable stream.

```javascript
some_stream.pipe(state).pipe(process.stdout);
```

### state.reset()
Resets the current `ANSIState` instance to the ansi reset code `\033[0m`.

```javascript
state.reset()
```

### state.restore()
Pushes to any piped streams the `ANSIState` instance's code.

```javascript
state.pipe(process.stdout)
state.restore() // will push state.code to wherever it is piped (ie. stdout).
```

### state.code
Returns the current ansi code for the `ANSIState` instance.

```javascript
state.update('\033[32mHi there! \033[31mRed text')
console.log(JSON.stringfy(state.code)) // "\u001b[31m"
```

### state[attribute_name]
Returns the human readable value of the `attribute_name` for the `ANSIState` instance. You can use any of the following attributes:

- **intensity**
- **italic**
- **underline**
- **blink**
- **polarity**
- **conceal**
- **strikethrough**
- **font**
- **foreground**
- **background**
- **framed**
- **overlined**

The value of each will be `null` if not set. If the foreground or background is set to `xterm color definition` you can obtain the corresponding definition code by using `state.xterm_foreground` or `state.xterm_background` respectively.

```javascript
state.update('\033[32mHi there! \033[31mRed text, \033[1;48;5;21m')
console.log(state['foreground']) // red
console.log(state.background) // xterm color definition
console.log(state.xterm_background) // [5, 21]
console.log(state.intensity) // bold
```

### state.attributes
Returns the current attribute set for the `ANSIState` instance.

```javascript
state.update('\033[32mHi there! \033[31mRed text, \033[1;48;5;21m')
console.log(state.attributes)
// {
//     intensity: '1',
//     italic: null,
//     underline: null,
//     blink: null,
//     polarity: null,
//     conceal: null,
//     strikethrough: null,
//     font: null,
//     foreground: '31',
//     background: '48',
//     framed: null,
//     overlined: null
// }
```

## License
`The MIT License (MIT)`
`Copyright (c) 2014 Arjun Mehta`
