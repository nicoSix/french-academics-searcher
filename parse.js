'use strict';

const fetch = require('node-fetch')
const fs = require('fs');
var parsed = {}
const queryTerm = process.argv.slice(2)

if(!queryTerm) {
    console.error('A query term must be given as an input.');
    return;
}

const url = 'http://theses.fr/?q=' + queryTerm + '&lng=fr/&checkedfacets=&format=json';

try {
    let settings = { method: "Get" };

    fetch(url, settings)
        .then(res => res.json())
        .then((json) => {
            var theses = json.response.docs
            theses.forEach(these => {
                if(!parsed[these.etabSoutenance]) {
                    parsed[these.etabSoutenance] = {
                        discipline: {}
                    }
                }
            
                if(!parsed[these.etabSoutenance].discipline[these.discipline]) {
                    parsed[these.etabSoutenance].discipline[these.discipline] = {
                        directeursTheses: {}
                    }
                }
            
                these.directeurThese.forEach(directeur => {
                    if(!parsed[these.etabSoutenance].discipline[these.discipline][directeur]) {
                        parsed[these.etabSoutenance].discipline[these.discipline][directeur] = {
                            doctorants: []
                        }
                    }
            
                    parsed[these.etabSoutenance].discipline[these.discipline][directeur].doctorants.push(these.auteur) 
                })
            })
            
            console.log('Results parsed in the parsed-theses.json file for the query \'' + queryTerm + '\'.')
            fs.writeFileSync('parsed-theses.json', JSON.stringify(parsed));
    });
}
catch(e) {
    console.error(e);
}
