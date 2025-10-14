const { Redis } = require('@upstash/redis');
require('dotenv').config();

console.log('Testing Upstash Redis connection...');
console.log('UPSTASH_REDIS_REST_URL:', process.env.UPSTASH_REDIS_REST_URL);
console.log('UPSTASH_REDIS_REST_TOKEN exists:', !!process.env.UPSTASH_REDIS_REST_TOKEN);

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

async function testRedis() {
  try {
    console.log('\nTesting Redis operations...');
    
    // Test SET operation
    await redis.set('test-key', 'Hello Upstash!');
    console.log('✓ SET operation successful');
    
    // Test GET operation
    const value = await redis.get('test-key');
    console.log('✓ GET operation successful:', value);
    
    // Test DELETE operation
    await redis.del('test-key');
    console.log('✓ DELETE operation successful');
    
    // Test connection with PING
    const ping = await redis.ping();
    console.log('✓ PING successful:', ping);
    
    console.log('\n🎉 All Redis operations completed successfully!');
  } catch (error) {
    console.error('❌ Redis test failed:', error.message);
    process.exit(1);
  }
}

testRedis();