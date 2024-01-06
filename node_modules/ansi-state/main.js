var util = require('util');
var stream = require('stream');
var PassThrough = stream.PassThrough || require('readable-stream').PassThrough;

var ansi_styles = require('./lib/ansi_styles'),
    ansi_styles_flat = {},
    color_regex = /\x1b\[[0-9;]*m/g,
    attr;

util.inherits(ANSIState, PassThrough);


// build ansi_styles_flat table object with each element of the form:
// code: [attribute, description]

for (var attr_name in ansi_styles) {
    attr = ansi_styles[attr_name];
    for (var code in attr) {
        ansi_styles_flat[code] = [attr_name, attr[code]];
    }
}


// ANSI state constructor

function ANSIState(legacy) {

    var feed = '',
        last_match = '',
        stream_match = [],
        _this = this;

    PassThrough.call(this);

    this.attrs = {};
    this.reset();
    this.is_reset = false;
    this.setEncoding('utf8');

    this.on('data', function(chunk) {
        feed += chunk;
        if (feed.indexOf('\033') === -1) {
            feed = '';
        } else {
            stream_match = feed.match(color_regex);
            if (stream_match.length > 0) {
                last_match = stream_match[stream_match.length - 1];
                feed = feed.slice(feed.lastIndexOf(last_match) + last_match.length);
                _this.updateWithArray(stream_match);
            }
        }
    });

    if (legacy !== undefined) {
        this.update(legacy);
    }
}


// ansi state prototype getter/setter properties

Object.defineProperty(ANSIState.prototype, 'code', {
    get: function() {
        return this.buildCode();
    }
});

Object.defineProperty(ANSIState.prototype, 'attributes', {
    get: function() {
        return this.attrs;
    }
});

addAliasesToPrototype(ANSIState.prototype, ansi_styles);


// ANSI state main API prototype methods

ANSIState.prototype.update = function(data) {

    if (Array.isArray(data)) {
        this.updateWithArray(data);
    } else if (typeof data === 'string') {
        this.updateWithString(data);
    } else if (data instanceof ANSIState) {
        this.updateWithState(data);
    }

    return this;
};

ANSIState.prototype.restore = function(date) {

    this.push(this.code);
    return this;
};

ANSIState.prototype.reset = function() {

    var attributes = this.attrs;

    for (var attr_name in ansi_styles) {
        attributes[attr_name] = null;
    }

    this.is_reset = true;
    this.xterm_foreground = undefined;
    this.xterm_background = undefined;

    return this;
};


// integral helper methods

ANSIState.prototype.updateWithRawArray = function(codes) {

    var code;
    this.is_reset = false;

    for (var i = 0; i < codes.length; i++) {
        code = codes[i];
        if (code === '38' || code === '48') {
            this.updateWithSpecialCode(code, codes, i);
        } else {
            this.updateWithCode(code);
        }
    }
    return this;
};

ANSIState.prototype.updateWithCode = function(code) {

    if (code === '0') {
        this.reset();
    } else {
        if (ansi_styles_flat[code]) {
            this.attrs[ansi_styles_flat[code][0]] = code;
        }
    }
    return this;
};

ANSIState.prototype.updateWithSpecialCode = function(code, codes, i) {

    switch (code) {
        case '38':
            this.xterm_foreground = xtermColor(codes, i);
            break;
        case '48':
            this.xterm_background = xtermColor(codes, i);
            break;
    }

    this.updateWithCode(code);
    return this;
};

ANSIState.prototype.updateWithState = function(ansi_state) {

    var state_attributes = ansi_state.attrs;

    if (ansi_state.is_reset === true) {
        this.is_reset = true;
        return this;
    } else {
        this.is_reset = false;
        for (var attr_name in state_attributes) {
            this.attrs[attr_name] = state_attributes[attr_name];
        }
    }

    if (ansi_state.xterm_foreground) this.xterm_foreground = ansi_state.xterm_foreground;
    if (ansi_state.xterm_background) this.xterm_background = ansi_state.xterm_background;

    return this;
};

ANSIState.prototype.updateWithArray = function(codes) {

    var code,
        codeList = [];

    if (codes !== null) {
        for (var i = 0; i < codes.length; i++) {
            code = codes[i];
            if (typeof code === 'string' && code[code.length - 1] === 'm') {
                codeList = codeList.concat(code.replace(/[\x1b\[|m]/g, '').split(';'));
            } else if (typeof code === 'number') {
                codeList.push('' + code);
            }
        }
    }

    this.updateWithRawArray(codeList);
    return this;
};

ANSIState.prototype.updateWithString = function(line) {

    var codes = line.match(color_regex),
        codeList = [],
        code;

    if (codes !== null) {
        for (var i = 0; i < codes.length; i++) {
            code = codes[i];
            codeList = codeList.concat(code.replace(/[\x1b\[|m]/g, '').split(';'));
        }
    }

    this.updateWithRawArray(codeList);

    return this;
};

ANSIState.prototype.buildCode = function() {

    var attributes = this.attrs,
        line = '\033[',
        val,
        i = 0;

    if (this.is_reset === true) {

        line += '0';

    } else {

        for (var attr_name in ansi_styles) {

            val = attributes[attr_name];

            if (val !== null) {

                if (val === '38') val += ';' + this.xterm_foreground.join(';');
                if (val === '48') val += ';' + this.xterm_background.join(';');

                line += (i === 0 ? '' : ';') + val;
                i++;
            }
        }
    }

    return line + 'm';
};


// help methods

function xtermColor(codes, i) {

    var type = codes[i + 1];

    if (type === '2') {
        return codes.splice(i + 1, 4);
    } else {
        return codes.splice(i + 1, 2);
    }
}

function addAliasesToPrototype(proto, styles) {
    var propertiesObj = {};
    for (var attr in styles) {
        propertiesObj[attr] = createAliasObject(attr);
    }

    Object.defineProperties(proto, propertiesObj);
}

function createAliasObject(alias_name) {
    return {
        enumerable: true,
        get: function() {
            if (this.attrs[alias_name] !== null) {
                return ansi_styles[alias_name][this.attrs[alias_name]].toLowerCase();
            }
            return null;
        }
    };
}


module.exports = exports = ANSIState;
