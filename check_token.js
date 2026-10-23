const fs = require('fs');

const envContent = fs.readFileSync('/home/ubuntu/omniflow/.env', 'utf8');
const env = {};
for (const line of envContent.split('\n')) {
  if (line.includes('=') && !line.startsWith('#')) {
    const idx = line.indexOf('=');
    const key = line.substring(0, idx).trim();
    const val = line.substring(idx + 1).trim();
    env[key] = val;
  }
}

const appId = env['META_APP_ID'];
const appSecret = env['META_APP_SECRET'];
const token = env['META_ACCESS_TOKEN'] || env['WHATSAPP_TOKEN'];

console.log('App ID:', appId);
console.log('App Secret exists:', !!appSecret);

async function testWithAppSecret() {
  if (appId && appSecret) {
    const appToken = `${appId}|${appSecret}`;
    try {
      const url = `https://graph.facebook.com/debug_token?input_token=${token}&access_token=${appToken}`;
      const res = await fetch(url);
      const data = await res.json();
      console.log('--- DEBUG WITH APP TOKEN ---');
      console.log(JSON.stringify(data, null, 2));
    } catch (e) {
      console.error(e);
    }
  } else {
    console.log('No App ID or App Secret found');
  }
}

testWithAppSecret();
