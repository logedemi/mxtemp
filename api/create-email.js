const { v4: uuidv4 } = require('uuid');

// Simpan di memory (reset saat fungsi restart)
const emailStorage = new Map();

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const { username, expiresIn = 24 } = data;
    
    // Generate random username
    const adjectives = ['quick', 'lazy', 'happy', 'sleepy', 'noisy', 'hungry'];
    const nouns = ['fox', 'dog', 'cat', 'bird', 'fish', 'lion'];
    const randomNum = Math.floor(Math.random() * 1000);
    const emailUsername = username || 
      `${adjectives[Math.floor(Math.random() * adjectives.length)]}_${
        nouns[Math.floor(Math.random() * nouns.length)]}_${randomNum}`;
    
    // Domain berdasarkan Netlify site
    const domain = process.env.URL ? 
      new URL(process.env.URL).hostname : 'tempmail.netlify.app';
    
    const emailAddress = `${emailUsername}@${domain}`;
    const apiKey = uuidv4();
    const expiresAt = Date.now() + (expiresIn * 60 * 60 * 1000);
    
    // Simpan email
    emailStorage.set(emailAddress, {
      email: emailAddress,
      apiKey: apiKey,
      created: Date.now(),
      expires: expiresAt,
      inbox: [], // Simpan email masuk di sini
      sent: []
    });
    
    // Simpan untuk global access (di fungsi lain)
    // Note: Ini hanya bertahan selama fungsi ini hidup
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        email: emailAddress,
        api_key: apiKey,
        dashboard_link: `/dashboard.html?email=${encodeURIComponent(emailAddress)}&key=${apiKey}`,
        expires_at: new Date(expiresAt).toISOString(),
        note: "This is a simulated temporary email. No real emails will be sent or received."
      })
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
