var pkgPath = 'package.json';

var david = require('david'),
    chalk = require('chalk'),
    fs = require('fs');

var manifest = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

david.getDependencies(manifest, function (er, deps) {
    console.log('\n', chalk.cyan('latest dependencies information for', manifest.name));
    listDependencies(deps, 'cyan');
});

david.getDependencies(manifest, {dev: true}, function (er, deps) {
    console.log('\n', chalk.cyan('latest devDependencies information for', manifest.name));
    listDependencies(deps, 'cyan');
});

david.getUpdatedDependencies(manifest, function (er, deps) {
    console.log('\n', chalk.magenta('dependencies with newer versions for', manifest.name));
    listDependencies(deps, 'magenta');
});

david.getUpdatedDependencies(manifest, {dev: true}, function (er, deps) {
    console.log('\n', chalk.magenta('devDependencies with newer versions for', manifest.name));
    listDependencies(deps, 'magenta');
});

david.getUpdatedDependencies(manifest, {stable: true}, function (er, deps) {
    console.log('\n', chalk.red('dependencies with newer STABLE versions for', manifest.name));
    listDependencies(deps, 'red');
});

david.getUpdatedDependencies(manifest, {dev: true, stable: true}, function (er, deps) {
    console.log('\n', chalk.red('devDependencies with newer STABLE versions for', manifest.name));
    listDependencies(deps, 'red');
});

function listDependencies(deps, color) {
    Object.keys(deps).forEach(function (depName) {
        var required = deps[depName].required || '*';
        var stable = deps[depName].stable || 'None';
        var latest = deps[depName].latest;
        var colorF = chalk[color];
        console.log(colorF(depName), 'Required:', required, 'Stable:', stable, 'Latest:', latest);
    });
}
