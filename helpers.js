'use strict';

function getRandomNumber(max) {
    return Math.floor(Math.random() * max) + 1;
}

function generateCombination(poolSize, comboLen) {
    let combination = [];
    for (let i = 0; i < comboLen; i++) {
        let rndNum = getRandomNumber(poolSize);
        while (combination.includes(rndNum)) rndNum = getRandomNumber(poolSize);
        combination.push(rndNum);
    }
    return combination;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = {
    generateCombination,
    numberWithCommas,
};