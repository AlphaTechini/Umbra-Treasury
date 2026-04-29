import fs from 'fs';
import https from 'https';

const screens = [
  { name: 'umbra_landing', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzA4NzNjNDcxNGVjYzQ5ZTZhZGY1NjM0NWZkM2FiZjNkEgsSBxD4qZzL5xkYAZIBJAoKcHJvamVjdF9pZBIWQhQxMzg0NzgxMzUxMzQ5ODc1MTM2Mw&filename=&opi=89354086' },
  { name: 'connect_wallet', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2QwNWU1ZWJmM2JjOTRjNzhhNTczYzZmYWViNmRkZmFlEgsSBxD4qZzL5xkYAZIBJAoKcHJvamVjdF9pZBIWQhQxMzg0NzgxMzUxMzQ5ODc1MTM2Mw&filename=&opi=89354086' },
  { name: 'dao_dashboard', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzg0ZWM0YTk1MzQ5YzQxMWRiOTZiMTk0MDg1OGJlYWQ5EgsSBxD4qZzL5xkYAZIBJAoKcHJvamVjdF9pZBIWQhQxMzg0NzgxMzUxMzQ5ODc1MTM2Mw&filename=&opi=89354086' },
  { name: 'add_private_tx', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzkxNjAyYTE3YmY2ODQ2NTBhOTc3MTQ2Y2Y0M2EzODhiEgsSBxD4qZzL5xkYAZIBJAoKcHJvamVjdF9pZBIWQhQxMzg0NzgxMzUxMzQ5ODc1MTM2Mw&filename=&opi=89354086' },
  { name: 'disclosures_dashboard', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2UxOGVmMTg3OGQwODQwN2U4YzUzYWZmY2E3OWUxMzNjEgsSBxD4qZzL5xkYAZIBJAoKcHJvamVjdF9pZBIWQhQxMzg0NzgxMzUxMzQ5ODc1MTM2Mw&filename=&opi=89354086' },
  { name: 'reveal_tx_input', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzc2ZDNkZjRmYzJlZDRlOWY5MzljNjMxZWNlZDI2OWVjEgsSBxD4qZzL5xkYAZIBJAoKcHJvamVjdF9pZBIWQhQxMzg0NzgxMzUxMzQ5ODc1MTM2Mw&filename=&opi=89354086' },
  { name: 'public_treasury', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzU2OWI1YzRhMTU4MzRlYjA4MDQ4NDhiYjVmYTgyNjNhEgsSBxD4qZzL5xkYAZIBJAoKcHJvamVjdF9pZBIWQhQxMzg0NzgxMzUxMzQ5ODc1MTM2Mw&filename=&opi=89354086' },
  { name: 'reveal_tx_success', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzQ3YTAyNzE4MmI4MjRkMTA4NGIyZjFkMzY1OGYwOTE4EgsSBxD4qZzL5xkYAZIBJAoKcHJvamVjdF9pZBIWQhQxMzg0NzgxMzUxMzQ5ODc1MTM2Mw&filename=&opi=89354086' },
  { name: 'request_disclosure', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzdhOGRlZjg2NjYzNTQ4Yzc4MzdhOGJjYzkyOTMzOTUwEgsSBxD4qZzL5xkYAZIBJAoKcHJvamVjdF9pZBIWQhQxMzg0NzgxMzUxMzQ5ODc1MTM2Mw&filename=&opi=89354086' },
  { name: 'report_auditor', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzFmOTBiMTYyNmI4ZTQxOGY4Nzg4YjM5NWE4MjA4OGJjEgsSBxD4qZzL5xkYAZIBJAoKcHJvamVjdF9pZBIWQhQxMzg0NzgxMzUxMzQ5ODc1MTM2Mw&filename=&opi=89354086' },
  { name: 'report_tax', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzI0YjdkNzg5MjU0ODQ3OGE4MDQ3YzhjNmUwMWU0ZGI1EgsSBxD4qZzL5xkYAZIBJAoKcHJvamVjdF9pZBIWQhQxMzg0NzgxMzUxMzQ5ODc1MTM2Mw&filename=&opi=89354086' },
  { name: 'report_public', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzE0YTIyZjQyZGQxNTQ2ZTE4NTY4ZTIzMzkwODYyNmVmEgsSBxD4qZzL5xkYAZIBJAoKcHJvamVjdF9pZBIWQhQxMzg0NzgxMzUxMzQ5ODc1MTM2Mw&filename=&opi=89354086' }
];

if (!fs.existsSync('stitch_screens')) {
  fs.mkdirSync('stitch_screens');
}

for (const screen of screens) {
  const req = https.get(screen.url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      fs.writeFileSync(`stitch_screens/${screen.name}.html`, data);
      console.log(`Saved ${screen.name}.html`);
    });
  });
  req.on('error', (e) => {
    console.error(e);
  });
}
