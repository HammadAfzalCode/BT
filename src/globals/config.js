const path = require('path');
const nconf = require('nconf');

nconf.env().argv();

let env = nconf.get('NODE_ENV');
console.log("NODE_ENV = ", env);

if (!env) env = 'debug';

console.log("Loaded Config File >", path.join(__dirname, '../env', `${env}.json`));

nconf.file({ file: path.join(__dirname, '../env', `${env}.json`) });

module.exports = nconf;