var ANSIState = require('../main');
var ansi_styles = require('../lib/ansi_styles');

exports['Exported Properly'] = function(test) {
    test.expect(3);

    var state = new ANSIState();

    test.equal(typeof ANSIState, 'function');
    test.equal(typeof state, 'object');
    test.equal(state.code, '\033[m');

    test.done();
};

exports['Basic Write and Pipe'] = function(test) {
    test.expect(1);

    var state = new ANSIState();

    state.pipe(process.stdout);
    state.write('Testing, ');
    state.write('Testing, ');
    state.write('\033[31m1 2....');
    state.write('\033[32m3....');
    process.stdout.write('\n');

    test.equal(state.code, "\033[32m");

    process.stdout.write('\033[0m');

    test.done();
};

exports['Basic Update with String'] = function(test) {
    test.expect(1);

    var state = new ANSIState();

    state.update('Hi');
    state.update('Hello');
    state.update('\033[32mIn green Now....');
    state.update('\033[31mIn Red Now....');

    test.equal(state.code, "\033[31m");

    test.done();
};

exports['Basic Update with Array'] = function(test) {
    test.expect(1);

    var state = new ANSIState();
    state.update(['\033[32m', '\033[2m', '\033[1m', '\033[37m']);

    test.equal(state.code, "\033[1;37m");

    test.done();
};

exports['Basic Update with Number Array'] = function(test) {
    test.expect(1);

    var state = new ANSIState();
    state.update([32, 2, 1, 37]);

    test.equal(state.code, "\033[1;37m");

    test.done();
};

exports['Reset'] = function(test) {
    test.expect(2);

    var state = new ANSIState();
    state.update([32, 2, 1, 37]);
    test.equal(state.code, "\033[1;37m");
    state.reset();
    test.equal(state.code, "\033[0m");

    test.done();
};

exports['Xterm Colours'] = function(test) {
    test.expect(2);

    var state = new ANSIState();
    state.update("This \033[1;37mis a test with xterm colours, \033[1;38;5;11mforeground and \033[1;48;5;255mbackground");
    test.equal(state.code, "\033[1;38;5;11;48;5;255m");
    state.update("This is a test with xterm RGB colours, \033[38;2;11;22;255mforeground and \033[48;2;77;11;0mbackground");
    test.equal(state.code, "\033[1;38;2;11;22;255;48;2;77;11;0m");

    // console.log(state.intensity, state.foreground, state.background, state.xterm_background);

    test.done();
};

exports['Mega Style Check'] = function(test) {
    test.expect(51);

    var attr, code,
        legacy_codes = [];

    var state = new ANSIState();

    for (var attr_name in ansi_styles) {
        attr = ansi_styles[attr_name];
        for (code in attr) {
            state.update([~~code]);
            if (code === '38' || code === '48') {
                continue;
            }
            test.equal(state.code, '\033[' + legacy_codes.join(';') + ((legacy_codes.length > 0) ? ';' : '') + code + 'm');
        }
        legacy_codes.push(code);
    }

    test.done();
};

exports['Ignore Non-Style ANSI Codes'] = function(test) {
    test.expect(1);

    var state = new ANSIState([
        '\033[32;22m',
        '\033[',
        '\033I',
        '\0331',
        '\033[34C',
        '\033[37C',
        '\033[1K',
        '\033[2;1y',
        '\0337',
        '\033[31m',
    ]);

    test.equal(state.code, '\033[22;31m');
    test.done();
};

exports['Check Attributes'] = function(test) {
    test.expect(3);

    var state = new ANSIState([
        '\033[32;22m',
        '\033[',
        '\033I',
        '\0331',
        '\033[34C',
        '\033[37C',
        '\033[1K',
        '\033[2;1y',
        '\0337',
        '\033[31m',
    ]);

    test.equal(state.foreground, 'red');
    test.equal(state.intensity, 'normal intensity');
    test.equal(state.strikethrough, null);
    test.done();
};

exports['tearDown'] = function(done) {
    done();
};
