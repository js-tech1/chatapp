// a set of related ansi style codes.
// only one of each group can be active at any time

var ansi_styles = {
    intensity: {
        1: 'Bold',
        2: 'Faint',
        21: 'Bold Off',
        22: 'Normal Intensity'
    },
    italic: {
        3: 'Italic',
        20: 'Fraktur',
        23: 'Italic/Fraktur Off'
    },
    underline: {
        4: 'Underline',
        24: 'Underline Off'
    },
    blink: {
        5: 'Blink: Slow',
        6: 'Blink: Rapid',
        25: 'Blink Off'
    },
    polarity: {
        7: 'Negative Image',
        27: 'Positive Image'
    },
    conceal: {
        8: 'Conceal',
        28: 'Conceal Off'
    },
    strikethrough: {
        9: 'Crossed Out',
        29: 'Crossed Out Off'
    },
    font: {
        10: 'Primary Font',
        11: 'Font 1',
        12: 'Font 2',
        13: 'Font 3',
        14: 'Font 4',
        15: 'Font 5',
        16: 'Font 6',
        17: 'Font 7',
        18: 'Font 8',
        19: 'Font 9'
    },
    foreground: {
        30: 'Black',
        31: 'Red',
        32: 'Green',
        33: 'Yellow',
        34: 'Blue',
        35: 'Magenta',
        36: 'Cyan',
        37: 'White',
        38: 'Xterm Color Definition',
        39: 'Default Foreground'
    },
    background: {
        40: 'Black',
        41: 'Red',
        42: 'Green',
        43: 'Yellow',
        44: 'Blue',
        45: 'Magenta',
        46: 'Cyan',
        47: 'White',
        48: 'Xterm Color Definition',
        49: 'Default Background'
    },
    framed: {
        51: 'Framed',
        52: 'Encircled',
        54: 'Framed/Encircled Off'
    },
    overlined: {
        53: 'Overlined',
        55: 'Overlined Off'
    },
};


module.exports = exports = ansi_styles;
