const fs = require('fs');
const signer = require('pkcs11-smartcard-sign');
const keytar = require('keytar');

const verifyKey = fs.readFileSync('keys/public-key.pem');
const signerOptions = JSON.parse(fs.readFileSync('keys/keeweb-sign.json', 'utf8'));

function getPin() {
    if (getPin.pin) {
        return Promise.resolve(getPin.pin);
    }
    return keytar.getPassword('keeweb.pin', 'keeweb').then(pass => {
        if (pass) {
            getPin.pin = pass;
            return pass;
        } else {
            throw 'Cannot find PIN';
        }
    });
}

module.exports = function sign(data) {
    return getPin().then(pin =>
        signer
            .sign({ data, verifyKey, pin, ...signerOptions })
            .then(data => data.toString('base64'))
    );
};
