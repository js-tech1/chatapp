var program = require('protogram').create();
var help = require('../main');


// help.version = '0.3.0-beta';
// help.name = 'Protogram Help Example';
// help.handleError = true;

// OR

// help.set({
//     version: '0.0.3',
//     name: 'Protogram Help Example',
//     handleError: true
// });


program
    .command('*', { includeRoot: true })
    .option('--help', help.set({
        version: '0.0.3',
        name: 'Protogram Help Example',
        handleError: true
    }));

// Your Program Here

program
    .option('--optionA', {
        description: "This is option A",
        required: 'a value',
        action: function(value) {
            console.log("option A selected");
        }
    });

program
    .option('--optionB', {
        description: "This is option B",
        optional: 'a number',
        action: function(value) { }
    });

program
    .option('--optionC', {
        description: "This is option C",
        optional: 'an optional string'
    });


var run = program.command('run', {
    action: function(args, flags) {
        console.log("run executed", args, flags);
    },
    required: 'file path'
});

run.option('--optionE');
run.option('--optionF', {
    required: 'option value',
});


program.parse(process.argv);
