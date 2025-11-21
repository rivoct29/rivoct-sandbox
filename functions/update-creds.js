
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const keyData = JSON.parse(fs.readFileSync(path.join(__dirname, '../api_key_midhun_test_001.json'), 'utf8'));
const apiKey = keyData.apiKey;
const metaData = JSON.parse(fs.readFileSync(path.join(__dirname, '../temp_api_key.json'), 'utf8'));

const lookupHash = crypto.createHash('sha256').update(apiKey).digest('hex');

const creds = {
    apiKey: apiKey,
    hash: metaData.hash,
    salt: metaData.salt,
    timestamp: new Date().toISOString()
};

fs.writeFileSync(path.join(__dirname, '../midhun_mezzingo_credentials.json'), JSON.stringify(creds, null, 2));

console.log(lookupHash);
