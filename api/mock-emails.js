const mockEmailSubjects = [
  "Welcome to Our Service!",
  "Verify Your Email Address",
  "Password Reset Request",
  "Your Order Has Been Shipped",
  "Weekly Newsletter",
  "Account Security Alert",
  "New Message Received",
  "Payment Confirmation",
  "Event Invitation",
  "Download Your Free E-book"
];

const mockSenders = [
  "noreply@example.com",
  "support@techcompany.com",
  "newsletter@blog.com",
  "security@service.com",
  "orders@shop.com",
  "team@startup.com",
  "admin@platform.com",
  "notification@social.com"
];

const mockBodies = [
  "Welcome! Thank you for signing up. Please verify your email to get started.",
  "Click the link below to reset your password. This link expires in 24 hours.",
  "Your order #ORD-12345 has been shipped. Track your package here.",
  "Here's your weekly digest of the latest news and updates from our team.",
  "We detected a new login from an unrecognized device. Was this you?",
  "You have a new message in your inbox. Click here to read it.",
  "Your payment of $29.99 has been processed successfully.",
  "You're invited to our virtual event next week. RSVP now to save your spot.",
  "Thank you for downloading! Here's your free e-book as promised."
];

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
    const { email, key, count = 5 } = event.queryStringParameters;
    
    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email parameter required' })
      };
    }
    
    // Generate mock emails
    const mockEmails = [];
    const now = Date.now();
    
    for (let i = 0; i < count; i++) {
      const hoursAgo = Math.floor(Math.random() * 72); // 0-72 hours ago
      const receivedTime = new Date(now - (hoursAgo * 60 * 60 * 1000));
      
      mockEmails.push({
        id: `mock_${now}_${i}`,
        from: mockSenders[Math.floor(Math.random() * mockSenders.length)],
        to: email,
        subject: mockEmailSubjects[Math.floor(Math.random() * mockEmailSubjects.length)],
        body: mockBodies[Math.floor(Math.random() * mockBodies.length)],
        received_at: receivedTime.toISOString(),
        is_read: Math.random() > 0.5,
        is_mock: true,
        html: `<p>${mockBodies[Math.floor(Math.random() * mockBodies.length)]}</p>
               <p>This is a simulated email for testing purposes.</p>
               <p>No real email was sent or received.</p>`
      });
    }
    
    // Sort by date (newest first)
    mockEmails.sort((a, b) => new Date(b.received_at) - new Date(a.received_at));
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        email: email,
        total: mockEmails.length,
        is_mock_data: true,
        note: "These are simulated emails for demonstration.",
        emails: mockEmails
      })
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
