'use strict';

process.chdir(__dirname);
const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');

const NUMBER_POOL_SIZE = 60;
const COMBINATION_LENGTH = 7;
const COMBINATIONS_COUNT = 200000;
const BATCH_SIZE = 4 * 1000 * 1000;
const FILE_PATH = path.resolve(__dirname, './lottery3.csv');

// Delete the "lottery.csv" file if it exists.
if (fs.existsSync(FILE_PATH)) {
    fs.unlinkSync(FILE_PATH);
}

// Generate the "lottery.csv" file.
console.log('Generating the "lottery.csv" file...');
let combinations = [];
for (let i = 0; i < COMBINATIONS_COUNT; i++) {
    let combination = helpers.generateCombination(NUMBER_POOL_SIZE, COMBINATION_LENGTH);
    combination = combination.join(',') + '\r\n';
    combinations.push(combination);

    if (combinations.length >= BATCH_SIZE) {
        fs.appendFileSync(FILE_PATH, combinations.join(''));
        combinations = [];
        console.log(`${helpers.numberWithCommas(i + 1)} / ${helpers.numberWithCommas(COMBINATIONS_COUNT)} combinations generated`);
    }
}

if (combinations.length > 0) {
    fs.appendFileSync(FILE_PATH, combinations.join(''));
    console.log(`${helpers.numberWithCommas(COMBINATIONS_COUNT)} / ${helpers.numberWithCommas(COMBINATIONS_COUNT)} combinations generated`);
}

console.log('Done.');