const emailService = require('./src/services/emailService');

async function testEmail() {
  console.log('Testing email service...');
  
  // Check if email service is initialized
  if (!emailService.transporter) {
    console.log('❌ Email service is not properly initialized');
    return;
  }
  
  try {
    const result = await emailService.testEmail('statsor1@gmail.com');
    console.log('Email test result:', result);
    
    if (result.success) {
      console.log('✅ Email service is working correctly');
    } else {
      console.log('❌ Email service failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Email test failed with exception:', error.message);
  }
}

testEmail();