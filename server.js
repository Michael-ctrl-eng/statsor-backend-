// Universal server entry point - Works for both Railway and Koyeb
const express = require('express');

console.log('🚀 Starting StatSor Backend...');
console.log('📁 Loading backend server...');

// Change to backend directory to avoid module conflicts
process.chdir('./backend');

// Import and start the actual server using absolute path
const path = require('path');
require(path.resolve('./src/server.js'));