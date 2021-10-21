#!/usr/bin/env node

const qrcode = require('qrcode-terminal');
const request = require('request');
const yargs = require("yargs");

const api = 'https://api.nano.to/name/';
const staticURL = `https://nano.to/`;

const argv = yargs
    .usage('Usage: $0 -u [username] -a [amount] -g')
    .option('u', { alias: 'username', describe: 'The username to donate to', type: 'string' })
    .option('a', { alias: 'amount', describe: 'The amount to donate', type: 'string' })
    .option('g', { alias: 'global', describe: 'Global QR code', type: 'boolean' })
    .help('h')
    .alias('h', 'help')
    .argv;


const generateQRCode = (username, amount) => {
    const nameCheck = `${api}${username}`;
    const url = `${staticURL}${username}?title=Donate&price=${amount}`;

    if (!username || !amount) {
        console.warn('\nPlease provide a username and amount to donate\n');
        process.exit(1);
    }

    request(nameCheck, (err, _res, body) => {
        if (err) {
            console.log(err);
            return;
        }
        const data = JSON.parse(body);
        if (argv.g === true) {
            qrcode.generate(data.address, { small: true });
        } else {
            qrcode.generate(url, { small: true });
        }

    });
    console.log(`Scan this QR code to donate to ${username}`);
}

generateQRCode(argv.username, argv.amount, argv.g);
