var whoAmI = require(process.cwd() + '/package.json'),
  kabam = undefined;

if (whoAmI.name === 'kabam') {
  //this is demo application
  kabam = require('./../index.js');
} else {
  //this is application created by kabamCli
  kabam = require('../kabam');
}

var main = kabam(__dirname);

main.start();