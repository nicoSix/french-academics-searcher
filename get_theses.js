const fetch = require('node-fetch');
const util = require('./util');
var nbParsed = 0;

function parseResult(theses, query) {
    var parsed = {};

    theses.forEach(these => {
        if(util.queryOnlyInTitle(these.titre, query)) {
            nbParsed++;
            
            these.directeurThese.forEach(directeur => {
                if(!parsed[util.formatName(directeur)]) {
                    parsed[util.formatName(directeur)] = {
                        isDirecteurThese: true,
                        theses: [],
                        institution: these.etabSoutenance
                    }
                }

                parsed[util.formatName(directeur)].theses.push(these);
            })

            if(!parsed[util.formatName(these.auteur)]) {
                parsed[util.formatName(these.auteur)]= {
                    isDirecteurThese: false,
                    theses: [],
                    institution: these.etabSoutenance
                }
            }

            parsed[util.formatName(these.auteur)].theses.push(these);
        }
    })

    return parsed;
}

module.exports = {
    getParsedTheses: async function() {
        var query = util.getQueryParam();
        if(query) {
            const url = 'http://theses.fr/?q=' + query + '&lng=fr/&checkedfacets=&format=json';
        
            try {
                let settings = { method: "Get" };
                var parsed;

                await fetch(url, settings)
                    .then(res => res.json())
                    .then((json) => {
                        var theses = json.response.docs;
                        parsed = parseResult(theses, query);
                    });
                
                return [parsed, nbParsed];
            }
            catch(e) {
                console.error(e);
            }
        }
    }
}