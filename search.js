'use strict';
const fs = require('fs');
const util = require('./util');
const getParsedThesesFunc = require('./get_theses').getParsedTheses;
const { Parser } = require('json2csv');

async function getParsedTheses() {
    return await getParsedThesesFunc().then(res => {
        console.log('Theses.fr: ' + res[1] + ' documents parsed.');
        return(res[0]);
    })
}

async function getParsedScholarAuthors() {
    var query = util.getQueryParam();
    if(query) {
        const spawn = require("child_process").spawn;
        const pythonProcess = spawn('python',["get_scholar_authors.py", "-q", query]);

        for await (var data of pythonProcess.stdout) {
            data = JSON.parse(data)
            var res = []

            data.forEach(d => {
                res[util.formatName(d.name)] = {
                    profile: d,
                    institution: d.affiliation
                }
            })
            
            console.log('Scholar authors: ' + data.length + ' parsed.')
            return res;
        };
    }
    else {
        return false;
    }
}

function parseForCsv(result) {
    var keys = Object.keys(result);
    var parsed = []
    keys.forEach(key => {
        parsed.push({
            name: key,
            institution: result[key].institution
        })
    })

    return parsed;
}

function run() {
    !fs.existsSync('results') && fs.mkdirSync('results');
    Promise.all([getParsedTheses(), getParsedScholarAuthors()]).then(parsed => {
        var result = {}

        parsed.forEach(parsedUnit => {
            if (parsedUnit) {
                result = Object.assign(result, parsedUnit);
            }
            
        });

        fs.writeFileSync('./results/result.json', JSON.stringify(result));

        const parser = new Parser();
        const csv = parser.parse(parseForCsv(result));
        console.log(csv)
        fs.writeFileSync('./results/result.csv', csv);
    }) 
    
}

run();