const argv = require('yargs').argv
const fetch = require('node-fetch');
var nbParsed = 0;

function parseByInstitution(theses) {
    var parsed = {};

    theses.forEach(these => {
        if(queryOnlyInTitle(these.titre)) {
            nbParsed++;
            these.etablissement.forEach(etab => {
                if(etab != "") {
                    if(!parsed[etab]) {
                        parsed[etab] = {
                            discipline: {},
                            count: 0
                        }
                    }
        
                    parsed[etab].count++;
                
                    if(!parsed[etab].discipline[these.discipline]) {
                        parsed[etab].discipline[these.discipline] = {
                            directeursTheses: {},
                            count: 0
                        }
                    }
        
                    parsed[etab].discipline[these.discipline].count++;
                
                    these.directeurThese.forEach(directeur => {
                        if(!parsed[etab].discipline[these.discipline].directeursTheses[directeur]) {
                            parsed[etab].discipline[these.discipline].directeursTheses[directeur] = {
                                doctorants: []
                            }
                        }
                
                        parsed[etab].discipline[these.discipline].directeursTheses[directeur].doctorants.push({
                            nom: these.auteur,
                            sujet: these.titre
                        }) 
                    })
                }
            })
        }
    })

    return parsed;
}

function parseByInstitutionMixPeople(theses) {
    var parsed = {};

    theses.forEach(these => {
        if(queryOnlyInTitle(these.titre)) {
            nbParsed++;
            these.etablissement.forEach(etab => {
                if(etab != "") {
                    if(!parsed[etab]) {
                        parsed[etab] = {
                            discipline: [these.discipline],
                            count: 0,
                            people: []
                        }
                    }
                    else {
                        if(!parsed[etab].discipline.includes(these.discipline)) parsed[etab].discipline.push(these.discipline);
                    }
        
                
                    these.directeurThese.forEach(directeur => {
                        if(!parsed[etab].people.includes(directeur)) {
                            parsed[etab].people.push(directeur);
                            parsed[etab].count++;
                        }
                    })

                    if(!parsed[etab].people.includes(these.auteur)) {
                        parsed[etab].people.push(these.auteur);
                        parsed[etab].count++;
                    }
                }
            })
        }
    })

    return parsed;
}

function queryOnlyInTitle(title) {
    if(argv.allintitle) {
        return title.includes(argv.query);
    }
    else return true;
}

function parseByDiscipline(theses) {
    var parsed = {};

    theses.forEach(these => {
        if(queryOnlyInTitle(these.titre)) {
            nbParsed++;
            if(!parsed[these.discipline]) {
                parsed[these.discipline] = {
                    etabSoutenance: {},
                    count: 0
                }
            }
    
            parsed[these.discipline].count++;
        
            these.etablissement.forEach(etab => {
                if(etab != "") {
                    if(!parsed[these.discipline].etabSoutenance[etab]) {
                        parsed[these.discipline].etabSoutenance[etab] = {
                            directeursTheses: {},
                            count: 0
                        }
                    }
        
                    parsed[these.discipline].etabSoutenance[etab].count++;
        
                    these.directeurThese.forEach(directeur => {
                        if(!parsed[these.discipline].etabSoutenance[etab].directeursTheses[directeur]) {
                            parsed[these.discipline].etabSoutenance[etab].directeursTheses[directeur] = {
                                doctorants: []
                            }
                        }
                
                        parsed[these.discipline].etabSoutenance[etab].directeursTheses[directeur].doctorants.push(these.auteur) 
                    })
                }
            })
        }
    })

    return parsed;
}

function parseByPeople(theses) {
    var parsed = {}

    theses.forEach(these => {
        if(queryOnlyInTitle(these.titre)) {
            nbParsed++;
            these.directeurThese.forEach(directeur => {
                if(!parsed[directeur]) {
                    parsed[directeur] = {
                        etablissement: these.etabSoutenance,
                        doctorants: [these.auteur],
                        discipline: these.discipline,
                        grade: "directeur"
                    }
                }
                else {
                    parsed[directeur]["doctorants"].push(these.auteur);
                }
            })
    
            if(!parsed[these.auteur]) {
                parsed[these.auteur] = {
                    etablissement: these.etabSoutenance,
                    discipline: these.discipline,
                    sujet: these.titre,
                    grade: "doctorant"
                }
            }
        }
    })

    return parsed;
}

module.exports = {
    getParsedTheses: async function() {
        if(!argv.query) {
            console.error('A query term must be given as an input.');
            return;
        }
        
        const url = 'http://theses.fr/?q=' + argv.query + '&lng=fr/&checkedfacets=&format=json';
        
        try {
            let settings = { method: "Get" };
            var parsed;

            await fetch(url, settings)
                .then(res => res.json())
                .then((json) => {
                    var theses = json.response.docs
                    switch(argv.order) {
                        case "institution":
                            parsed = parseByInstitution(theses);
                            break;
                    
                        case "discipline":
                            parsed = parseByDiscipline(theses);
                            break;
        
                        case "people":
                            parsed = parseByPeople(theses);
                            break;
        
                        default:
                            parsed = parseByInstitutionMixPeople(theses);
                            break;
                    }
                    
                });
            
            return [parsed, nbParsed];
        }
        catch(e) {
            console.error(e);
        }
    }
}