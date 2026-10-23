const token = process.env.WHATSAPP_TOKEN || process.env.META_ACCESS_TOKEN;

async function checkMe() {
  const endpoints = [
    'https://graph.facebook.com/v20.0/me?access_token=' + token,
    'https://graph.facebook.com/v20.0/me/permissions?access_token=' + token,
    'https://graph.facebook.com/oauth/access_token_info?client_id=none&access_token=' + token
  ];

  for (const url of endpoints) {
    console.log('--- Checking:', url.split('?')[0]);
    try {
      const res = await fetch(url);
      const data = await res.json();
      console.log(JSON.stringify(data, null, 2));
    } catch (e) {
      console.error(e);
    }
  }
}

checkMe();
