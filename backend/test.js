const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World 🚀');
});

app.listen(5001, () => {
  console.log('✅ Server running on port 5000');
});

process.on('exit', (code) => {
  console.log('⚠️ Process exiting with code:', code);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Rejection:', reason);
});
