var test = [
    'ttest"te', 'Metet,te', 'Mete"cu,ry', 'Mercury'
];


for (x in test) {
    var s = test[x];
    if (s.indexOf('"') != -1) {
        s = s.replace(/"/g, '""');
    }

    if (s.match(/"|,/)) {
        s = '"' + s + '"';
    }

    console.log(s);
}

