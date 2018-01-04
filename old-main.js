const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

// comment out electron-reload when packaging
/*require('electron-reload')(__dirname, {
    electron: require('${__dirname}/../../node_modules/electron')
});*/

// comment out dotenv requirement when packaging
// require('dotenv').config();

let win = null;

app.on('ready', function () {

    // Initialize the window to our specified dimensions
    win = new BrowserWindow({
        width: 1000,
        height: 600,
       /* webPreferences: {
            webSecurity: false
        }*/
    });

    // Specify entry point method 1
    // Specify entry point
    //win.loadURL('http://localhost:4200');

    // Specify entry point
    //if (process.env.PACKAGE === 'true'){
        //win.loadURL(url.format({
        //    pathname: path.join(__dirname, 'dist/index.html'),
        //    protocol: 'file:',
        //    slashes: true
        //}));
    //} else {
        //win.loadURL(process.env.HOST);
        //win.webContents.openDevTools();
    //}

    // Show dev tools
    // Remove this line before distributing

    // uncomment this when packaging
    win.loadURL(`file://${__dirname}/index.html`);

    win.webContents.openDevTools();

    // Remove window once app is closed
    win.on('closed', function () {
        win = null;
    });

});

app.on('activate', () => {
    if (win === null) {
    createWindow()
}
})

app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
});



angular
.module('App',[])
.controller('LoginController', ['$scope', function($scope){
    $scope.done = '';
}])
.directive('loadingBtn', ['$timeout', function($timeout){
    return {
        link: function(scope, element, attrs){
            element.bind('click', function(){
              
              if(scope.loading == true || scope.done == 'done') {
                return;
              }
              
              scope.loading = true;
              
              element.addClass('loading');
              
              timeoutId = $timeout(function() {
                scope.loading = false;
                element.removeClass('loading');
                scope.done = 'done';
              }, 2000); 
            });
             
        }
    };
}]);
