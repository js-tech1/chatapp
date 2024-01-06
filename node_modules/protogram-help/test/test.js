var fs = require('fs');
var exec = require('child_process').exec;

var protogram = require('protogram');
var help = require('../main');

exports['Test Root with -h'] = function(test) {

    var expectedOutput = fs.readFileSync(__dirname + '/root-with-h.txt', 'utf8');

    test.expect(1);

    exec('node ' + __dirname + '/testCase.js -h', {
        encoding: 'utf8'
    }, function(error, stdout, stderr) {
        test.equal(expectedOutput, stdout);
        test.done();
    });
};


exports['Test Root without Required Option Value'] = function(test) {

    var expectedOutput = fs.readFileSync(__dirname + '/root-without-requiredopt.txt', 'utf8');

    test.expect(1);

    exec('node ' + __dirname + '/testCase.js -o', {
        encoding: 'utf8'
    }, function(error, stdout, stderr) {
        test.equal(expectedOutput, stdout);
        test.done();
    });
};


exports['Subcommand with Required Arg and Option with Missing Required'] = function(test) {

    var expectedOutput = fs.readFileSync(__dirname + '/run-with-requiredarg-O.txt', 'utf8');

    test.expect(1);

    exec('node ' + __dirname + '/testCase.js run ajh -O', {
        encoding: 'utf8'
    }, function(error, stdout, stderr) {
        test.equal(expectedOutput, stdout);
        test.done();
    });
};

exports['Subcommand Version Info'] = function(test) {

    var expectedOutput = fs.readFileSync(__dirname + '/run-with-V.txt', 'utf8');

    test.expect(1);

    exec('node ' + __dirname + '/testCase.js run -V', {
        encoding: 'utf8'
    }, function(error, stdout, stderr) {
        test.equal(expectedOutput, stdout);
        test.done();
    });
};

exports['Main Version Info'] = function(test) {

    var expectedOutput = fs.readFileSync(__dirname + '/run-with-version.txt', 'utf8');

    test.expect(1);

    exec('node ' + __dirname + '/testCase.js --version', {
        encoding: 'utf8'
    }, function(error, stdout, stderr) {
        test.equal(expectedOutput, stdout);
        test.done();
    });
};

exports['Subcommand without Required Arg but with -h'] = function(test) {

    var expectedOutput = fs.readFileSync(__dirname + '/run-without-arg-with-h.txt', 'utf8');

    test.expect(1);

    exec('node ' + __dirname + '/testCase.js run -h', {
        encoding: 'utf8'
    }, function(error, stdout, stderr) {
        test.equal(expectedOutput, stdout);
        test.done();
    });
};

exports['Subcommand without Required Arg'] = function(test) {

    var expectedOutput = fs.readFileSync(__dirname + '/run-without-arg.txt', 'utf8');

    test.expect(1);

    exec('node ' + __dirname + '/testCase.js run', {
        encoding: 'utf8'
    }, function(error, stdout, stderr) {
        test.equal(expectedOutput, stdout);
        test.done();
    });
};

exports['tearDown'] = function(done) {
    done();
};
