exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { email, key, mock = 'true' } = event.queryStringParameters;
    
    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Email parameter required'
        })
      };
    }
    
    // Default: Return mock emails jika tidak ada sistem penyimpanan
    if (mock === 'true') {
      // Call mock-emails function internally
      const mockData = require('./mock-emails');
      const mockEvent = {
        ...event,
        queryStringParameters: { ...event.queryStringParameters, count: 10 }
      };
      
      // Create a mock response
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          email: email,
          is_simulated: true,
          note: "Using simulated email data. No real email server connected.",
          emails: [
            {
              id: 'demo_1',
              from: 'welcome@tempmail.demo',
              to: email,
              subject: 'Welcome to Temporary Email Demo!',
              body: 'This is a simulated inbox. No real emails are being sent or received.',
              received_at: new Date().toISOString(),
              is_read: false,
              html: '<p>Welcome to the temporary email demo!</p><p>This system simulates email functionality without requiring SMTP servers or API keys.</p>'
            },
            {
              id: 'demo_2',
              from: 'test@example.com',
              to: email,
              subject: 'Test Email #1',
              body: 'This is a test email to show how the inbox works.',
              received_at: new Date(Date.now() - 3600000).toISOString(),
              is_read: true,
              html: '<p>This is a test email to demonstrate the temporary email system.</p>'
            },
            {
              id: 'demo_3',
              from: 'newsletter@demo.com',
              to: email,
              subject: 'Weekly Updates',
              body: 'Here are your weekly updates from our demo service.',
              received_at: new Date(Date.now() - 7200000).toISOString(),
              is_read: false,
              html: '<p>Demo newsletter content here.</p>'
            }
          ]
        })
      };
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        email: email,
        emails: [],
        note: "No email storage configured. Use mock=true parameter to get simulated emails."
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
