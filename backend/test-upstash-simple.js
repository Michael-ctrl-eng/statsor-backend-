require('dotenv').config();
const { Redis } = require('@upstash/redis');

async function testUpstash() {
  console.log('Testing Upstash Redis connection...');
  console.log('URL:', process.env.UPSTASH_REDIS_REST_URL);
  console.log('Token exists:', !!process.env.UPSTASH_REDIS_REST_TOKEN);
  console.log('Token length:', process.env.UPSTASH_REDIS_REST_TOKEN?.length);
  
  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    
    console.log('\nTesting PING...');
    const pingResult = await redis.ping();
    console.log('✅ PING result:', pingResult);
    
    console.log('\nTesting SET...');
    const setResult = await redis.set('test-key', 'test-value');
    console.log('✅ SET result:', setResult);
    
    console.log('\nTesting GET...');
    const getValue = await redis.get('test-key');
    console.log('✅ GET result:', getValue);
    
    console.log('\n✅ All Upstash Redis tests passed!');
    
  } catch (error) {
    console.error('❌ Upstash Redis test failed:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    if (error.cause) {
      console.error('Error cause:', error.cause);
    }
  }
}

testUpstash();