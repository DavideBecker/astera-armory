var fs = require('fs');
// var request = require('request');
var request = require('request-promise-native')

var metadata = require('./scrapping/metadata')

var scrappers = {
    armor: require('./scrapping/armor')
}

Promise.all([
    request('https://mhworld.kiranico.com/armor').then(scrappers.armor)
]).then((a) => {
    fs.writeFile('./out.json', JSON.stringify(a, null, 4), function() {
        console.log('done.')
    })
})