
const fs = require('fs');

const domains = fs.readFileSync('blocklist.txt', 'utf-8')
  .split('\n')
  .map(line => line.trim())
  .filter(Boolean);

const rules = domains.map((domain, index) => ({
  id: index + 1,
  priority: 1,
  action: { type: 'block' },
  condition: {
    urlFilter: domain,
    resourceTypes: ['script', 'image', 'xmlhttprequest']
  }
}));

fs.writeFileSync('rules.json', JSON.stringify(rules, null, 2));
console.log(`✅ Generated ${rules.length} rules`);
