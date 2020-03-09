'use strict';
const fs = require('fs');
const getParsedTheses = require('./get_theses').getParsedTheses;

async function run() {
    var parsedTheses = await getParsedTheses()  
    fs.writeFileSync('parsed-theses.json', JSON.stringify(parsedTheses[0]));
    console.log(parsedTheses[1] + ' documents parsed.')
}

run();