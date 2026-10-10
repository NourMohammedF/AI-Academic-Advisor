const fs = require('fs');
const path = require('path');

const packagePath = path.join(__dirname, 'package.json');
const package = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

package.scripts = package.scripts || {};
package.scripts.reset = 'expo start --reset-cache';

fs.writeFileSync(packagePath, JSON.stringify(package, null, 2), 'utf8');
console.log('Successfully added reset script to package.json');