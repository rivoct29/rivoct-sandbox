#!/usr/bin/env node
const { spawn } = require('child_process');

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit', shell: true, ...opts });
    p.on('close', (code) => (code === 0 ? resolve() : reject(new Error('Exit ' + code))));
  });
}

async function main() {
  try {
    const token = process.env.FIREBASE_TOKEN;
    const args = ['deploy', '--only', 'hosting,functions'];
    if (token) {
      args.push('--token', token);
    }

    console.log('Running: firebase', args.join(' '));
    await run('firebase', args);
    console.log('\nDeploy finished');
  } catch (err) {
    console.error('\nDeploy failed:', err.message || err);
    process.exit(1);
  }
}

main();
