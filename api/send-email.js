exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const { from_email, to, subject, body, api_key } = data;
    
    if (!from_email || !to || !subject || !body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Missing required fields'
        })
      };
    }
    
    // Simulate email sending (no actual SMTP)
    const messageId = `simulated_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`[SIMULATED EMAIL SENT]`);
    console.log(`From: ${from_email}`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body.substring(0, 100)}...`);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Email sent successfully (simulated)',
        message_id: messageId,
        note: "This is a simulation. No actual email was sent.",
        details: {
          from: from_email,
          to: to,
          subject: subject,
          simulated_at: new Date().toISOString()
        }
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
