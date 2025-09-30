const fs = require('fs');

const body = fs.readFileSync(0, 'utf8');
const required = ['**Describe the bug**', '**To Reproduce**'];
const missing = required.filter(r => !body.includes(r));
if (missing.length) {
  console.error('Issue missing required sections:', missing.join(', '));
  process.exit(1);
}
console.log('Issue format OK');


