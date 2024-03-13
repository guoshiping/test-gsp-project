const shell = require("shelljs");

class Build {
    
    build() {
        shell.exec('tsc')
    }

}

new Build().build()