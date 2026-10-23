const token = process.env.WHATSAPP_TOKEN || process.env.META_ACCESS_TOKEN;
const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

console.log('Phone ID:', phoneId);
console.log('Token prefix:', token ? token.substring(0, 15) : 'none');

if (token && phoneId) {
  fetch(`https://graph.facebook.com/v20.0/${phoneId}?access_token=${token}`)
    .then(r => r.json())
    .then(d => console.log('Result:', JSON.stringify(d, null, 2)))
    .catch(e => console.error(e));
} else {
  console.log('Missing token or phoneId');
}
