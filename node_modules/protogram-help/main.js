var columnify = require('columnify');
var path = require('path');

var current_path = path.dirname(require.main.filename),
    current_filename = path.basename(process.argv[1], '.js'),
    pjson, did_output = false;

var help_name = 'help';


try {
    pjson = require(current_path + '/package.json');
} catch (e) {}


function HelpOption(opts) {

    var helpFlag = this;

    opts = opts || {};
    this.opts = opts;

    this.description = opts.description || 'Display usage information';
    this.action = opts.action || displayHelp;
    this.error = opts.error || errorHandler;
    this.shortcut = opts.shortcut || '-h';

    this.opts.version = opts.version || pjson ? pjson.version : null;
    this.opts.name = opts.name || pjson ? pjson.name : null;
    this.opts.handleError = opts.handleError || false;

    this.added = function(flag) {

        help_name = flag.flag_name;

        // 'this' becomes the command

        if (helpFlag.opts.version) {
            this.option('--version', {
                shortcut: '-V',
                description: 'Display current version',
                action: displayVersion
            });
        }

        if (helpFlag.opts.handleError === true) {
            this.opts.error = errorHandler;
        }
    };

    return this;
}

Object.defineProperty(HelpOption.prototype, "version", {
    enumerable: true,
    get: function() {
        return this.opts.version;

    },
    set: function(version) {
        this.opts.version = version;

    }
});

Object.defineProperty(HelpOption.prototype, "name", {
    enumerable: true,
    get: function() {
        return this.opts.name;
    },
    set: function(name) {
        this.opts.name = name;
    }
});

Object.defineProperty(HelpOption.prototype, "handleError", {
    enumerable: true,
    get: function() {
        return this.opts.handleError;
    },
    set: function(bool) {
        this.opts.handleError = bool;
    }
});

HelpOption.prototype.set = function(opts) {
    opts = opts || {};

    for (var opt in opts) {
        this[opt] = opts[opt];
    }
    return this;
};


function displayHelp(value) {

    var display = [],
        help = this.options[help_name];

    if (this.parent_command === undefined) {
        display.push('\n' + buildCommandInformationString(help));
    }

    display.push(buildUsageString(this));

    if (Object.keys(this.options).length > 0) display.push(renderOptionUsage(display, this));
    if (Object.keys(this.commands).length > 0) display.push(renderCommandUsage(display, this));

    console.log(display.join('\n') + '\n');
    did_output = true;
}


function errorHandler(err, args) {

    var help = this.options[help_name];

    if (!did_output) {
        if (!args[help.flag_name] && !args[help.shortcut]) {
            console.log('\n' + err);
        }
        displayHelp.call(this, null);
    }
}

function displayVersion(value) {
    var display_header = '\n  ' + buildCommandInformationString(this.options[help_name]) + '\n';
    did_output = true;
    console.log(display_header);
}


function buildCommandInformationString(help) {
    return (help.name ? help.name + ' ' : '') + (help.opts.version ? 'v' + help.opts.version : '');
}

function buildUsageString(program) {

    var str = '';

    if (program.required) {
        str += '<' + program.required + '> ';
    } else if (program.optional) {
        str += '[' + program.optional + '] ';
    }

    if (Object.keys(program.options).length > 0) {
        str += '[options]';
    }

    while (program.parent_command !== undefined) {
        str = program.command_name + ' ' + str;
        program = program.parent_command;
    }

    str = current_filename + ' ' + str;
    str = '\nUsage: ' + str;

    return str;
}

function buildFlagDetails(flag, flag_name) {

    var str = '';

    str += flag.shortcut ? '-' + flag.shortcut + ', ' : '    ';
    str += '--' + flag_name;
    str += ' ' + (flag.required ? '<' + flag.required + '> ' : (flag.optional ? '[' + flag.optional + '] ' : ' '));

    return str;
}

function buildCommandDetails(command, command_name) {

    var str = '';

    str += command_name;
    str += command.alias ? '|' + command.alias : '';
    str += ' ' + (command.required ? '<' + command.required + '> ' : (command.optional ? '[' + command.optional + '] ' : ' '));

    return str;
}


function renderCommandUsage(display, program) {

    var command, commandDisplay = [];

    display.push('\nSUBCOMMANDS');

    for (var command_name in program.commands) {
        command = program.commands[command_name];
        commandDisplay.push({
            command: buildCommandDetails(command, command_name),
            description: command.description
        });
    }

    return columnify(commandDisplay, {
        columnSplitter: '  ',
        minWidth: 30,
        showHeaders: false,
        dataTransform: function(item) {
            return ' ' + item;
        }
    });
}

function renderOptionUsage(display, program) {

    var flag, optionDisplay = [];

    display.push('\nOPTIONS');

    for (var flag_name in program.options) {
        flag = program.options[flag_name];
        optionDisplay.push({
            flag: buildFlagDetails(flag, flag_name),
            description: flag.description
        });
    }

    return columnify(optionDisplay, {
        columnSplitter: '  ',
        minWidth: 30,
        showHeaders: false,
        dataTransform: function(item) {
            return ' ' + item;
        }
    });
}

module.exports = exports = new HelpOption();
