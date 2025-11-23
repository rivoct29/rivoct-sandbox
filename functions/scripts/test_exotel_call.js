const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const { createHash } = require('crypto');

const PROJECT_ID = 'rivoct-sandbox';
const sm = new SecretManagerServiceClient();

async function accessSecret(name) {
  try {
    const [v] = await sm.accessSecretVersion({ name: `projects/${PROJECT_ID}/secrets/${name}/versions/latest` });
    return v.payload?.data?.toString() ?? '';
  } catch (e) {
    console.error('Could not read secret', name, e.message || e);
    return '';
  }
}

async function run() {
  // Trim secrets to avoid trailing newlines from manual uploads
  const apiKey = (await accessSecret('CARRIER_API_KEY')).trim();
  const clientId = (await accessSecret('CARRIER_CLIENT_ID')).trim();
  const fromNumber = (await accessSecret('CARRIER_FROM_NUMBER')).trim();
  const flow = (await accessSecret('CARRIER_FLOW')).trim();

  console.log('Using:', { clientId, fromNumber: fromNumber ? '<redacted>' : '', flow });

  if (!apiKey || !clientId) {
    console.error('Missing carrier API key or clientId');
    process.exit(2);
  }

  const [username, token] = apiKey.split(':');
  const auth = username && token ? `Basic ${Buffer.from(`${username}:${token}`).toString('base64')}` : `Basic ${Buffer.from(`:${apiKey}`).toString('base64')}`;

  const base = process.env.CARRIER_API_BASE ?? process.env.EXOTEL_BASE ?? 'https://api.exotel.com';
  const exoUrl = `${base.replace(/\/$/,'')}/v1/Accounts/${clientId}/Calls/connect`;

  const params = new URLSearchParams();
  if (fromNumber) params.append('From', fromNumber);
  if (fromNumber) params.append('CallerId', fromNumber);
  params.append('To', '+917736425590');
  if (flow) params.append('Flow', flow);
  params.append('otpCode', '6161');
  params.append('otp', '6161');

  console.log('Posting to Exotel:', exoUrl);

  const resp = await fetch(exoUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': auth
    },
    body: params.toString()
  });

  const text = await resp.text();
  console.log('Status:', resp.status);
  console.log('Response body:', text);
}

run().catch((e) => { console.error(e); process.exit(1); });
