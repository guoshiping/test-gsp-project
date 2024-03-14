const path = require('path');
const fs = require('fs-extra');
const semvr = require('semver');
const shell = require('shelljs');
const Base = require('./base');

class Release extends Base {
    constructor() {
        super();
    }

    async run() {
        this.prepare();
        await this.check();
        this.release();
    }

    prepare() {
        fs.copyFileSync(
            path.join(this.rootPath, 'package.json'),
            path.join(this.destPath, 'package.json')
        );
        fs.copyFileSync(
            path.join(this.rootPath, 'README.md'),
            path.join(this.destPath, 'README.md')
        );
    }

    async check() {
        this.checkPublishFiles();
        await this.checkLocalVersion();
    }

    async checkLocalVersion() {
        const packageJson = this.getPackageJson();
        const localVersion = packageJson.version;
        if (!localVersion) {
            this.logError('没有找到package.json文件里面的版本号');
            process.exit(1);
        }

        const res = await fetch(
            `http://registry.npmjs.org/test-gsp-project/latest`
        );
        const remotePackage = await res.json();
        const remoteVersion = remotePackage?.version;
        if (remoteVersion && semvr.gte(remoteVersion, localVersion)) {
            this.logError('发布失败，发布的版本号小于线上版本号');
            process.exit(1);
        }
    }

    checkPublishFiles() {
        const checkFiles = ['package.json', 'README.md'];
        checkFiles.forEach((file) => {
            if (!fs.existsSync(path.join(this.destPath, file))) {
                this.logError(`发布失败：${file}文件不存在`);
                process.exit(1);
            }
        });
    }

    release() {
        shell.cd(this.destPath);
        const result = shell.exec('npm publish');
        console.log('result', result);
        if (result.code !== 0) {
            this.logError('发布失败：', result.stderr);
        } else {
            this.logSuccess('发布成功');
        }
    }
}

new Release().run();
