const shell = require("shelljs");
const chalk = require("chalk");
const fs = require("fs-extra");
const path = require("path");
const Base = require("./base");

// 注释一下
class Build extends Base {
  constructor() {
    super();
  }

  run() {
    this.init();
    this.build();
  }

  init() {
    fs.emptyDirSync(path.join(this.rootPath, "lib"));
  }

  build() {
    shell.exec("tsc");
  }

  logError(message) {
    console.log(chalk.red(message));
  }
}

new Build().run();
