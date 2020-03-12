const argv = require('yargs').argv

function isNotName(str) {
    notNames = [
        "(hdr)",
        "hdr",
        "dr.",
        "pr.",
        "prof."
    ]

    return notNames.includes(str);
}

module.exports = {
    getQueryParam: function() {
        if(!argv["query"]) {
            if(!argv["q"]) {
                console.error('A query term must be given as an input.');
                return false;
            }
            else {
                return argv["q"];
            }
        }
        else {
            return argv["query"];
        }
    },
    queryOnlyInTitle: function(title, query) {
        if(argv["allintitle"] || argv['t']) {
            return title.includes(query);
        }
        else return true;
    },
    formatName: function(name) {
        var name = name.replace(/ +(?= )/g,'');
        var parts = name.split(' ');
        var formatted = "";

        parts.forEach(part => {
            if(!isNotName(part.toLowerCase())) {
                formatted += part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() + ' ';
            }
        })

        return formatted.slice(0, -1); 
    }
}