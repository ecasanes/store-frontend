const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller;
const path = require('path');
const url = require('url');

getInstallerConfig()
    .then(createWindowsInstaller)
    .catch((error) => {
        console.error(error.message || error);
        process.exit(1)
    });

function getInstallerConfig () {
    console.log('creating windows installer');
    const rootPath = path.join('./');
    const outPath = path.join(rootPath, 'release-builds');

    return Promise.resolve({
        appDirectory: path.join(outPath, 'mercury-win32-ia32'),
        authors: 'Webforest',
        description: "Inventory Tracking System",
        noMsi: true,
        outputDirectory: path.join(outPath, 'windows-installer'),
        noDelta: true,
        //setupIcon: path.join(rootPath, 'src', 'assets', 'icons', 'win', 'icon.ico'),
        /*iconUrl: url.format({
            pathname: path.join(rootPath, 'src', 'assets', 'icons', 'win', 'icon.ico'),
            protocol: 'file:',
            slashes: true
        }),*/
        //iconUrl: 'http://ecasanes.xyz/icons/icon.ico'
    })
}