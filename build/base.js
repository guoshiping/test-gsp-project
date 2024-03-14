const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');

class Base {
    constructor() {
        this.rootPath = path.join(__dirname, '../');
        this.destPath = path.join(this.rootPath, 'lib');
    }

    getPackageJson() {
        return fs.readJSONSync(path.join(this.rootPath, 'package.json'));
    }

    logError(message) {
        console.log(chalk.red(message));
    }
}

module.exports = Base;
