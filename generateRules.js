

const https = require('https');
const fs = require('fs');


const EASYLIST_URL = 'https://easylist.to/easylist/easylist.txt';

function fetchEasyList(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}


function extractDomains(easylistText) {
  const domainSet = new Set();


  const lines = easylistText.split('\n');

  for (let line of lines) {
    line = line.trim();

    if (!line || line.startsWith('!') || line.startsWith('[')) continue;

    const match = line.match(/^\|\|([^\^\/]+)\^/);


    if (match) {
      domainSet.add(match[1]);
    }
  }

  return Array.from(domainSet);
}

function buildRules(domains) {
  return domains.map((domain, index) => ({
    id: index + 1,
    priority: 1,
    action: { type: 'block' },
    condition: {
      urlFilter: domain,
      resourceTypes: ['script', 'image', 'xmlhttprequest']
    }
  }));
}

async function main() {
  console.log('Fetching EasyList...');
  const text = await fetchEasyList(EASYLIST_URL);

  console.log('Extracting domains...');
  const domains = extractDomains(text);
  console.log(`Found ${domains.length} unique domains`);

  console.log('Building Chrome rules...');
  const rules = buildRules(domains.slice(0, 30000)); 

  fs.writeFileSync('rules.json', JSON.stringify(rules, null, 2));
  console.log('Saved to rules.json');
}

main().catch(err => {
  console.error(' Error:', err);
});

