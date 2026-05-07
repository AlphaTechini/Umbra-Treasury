#!/usr/bin/env node

import { Pool } from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Testing Umbra Treasury Disclosure Setup...\n');

// Test backend .env
console.log('📋 Backend Environment Variables:');
dotenv.config({ path: join(__dirname, 'apps/api/.env') });

const backendVars = {
  'DATABASE_URL': process.env.DATABASE_URL ? '✓ Set' : '✗ Missing',
  'API_PORT': process.env.API_PORT || '3007 (default)',
  'CORS_ORIGIN': process.env.CORS_ORIGIN ? '✓ Set' : '✗ Missing',
  'UMBRA_MODE': process.env.UMBRA_MODE || 'mock (default)',
  'UMBRA_NETWORK': process.env.UMBRA_NETWORK || 'devnet (default)',
};

for (const [key, value] of Object.entries(backendVars)) {
  console.log(`  ${key}: ${value}`);
}

// Test database connection
console.log('\n🗄️  Testing Database Connection...');
if (process.env.DATABASE_URL) {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000,
  });

  try {
    await pool.query('SELECT 1 AS connected');
    console.log('  ✓ Database connection successful');
  } catch (err) {
    console.error('  ✗ Database connection failed:', err.message);
  } finally {
    await pool.end();
  }
} else {
  console.log('  ✗ DATABASE_URL not set');
}

// Test frontend .env
console.log('\n📋 Frontend Environment Variables:');
dotenv.config({ path: join(__dirname, 'apps/web/.env'), override: true });

const frontendVars = {
  'PUBLIC_API_BASE_URL': process.env.PUBLIC_API_BASE_URL ? '✓ Set' : '✗ Missing',
  'PUBLIC_UMBRA_NETWORK': process.env.PUBLIC_UMBRA_NETWORK || 'devnet (default)',
  'PUBLIC_UMBRA_RPC_HTTP_URL': process.env.PUBLIC_UMBRA_RPC_HTTP_URL || 'default',
  'PUBLIC_UMBRA_RPC_WS_URL': process.env.PUBLIC_UMBRA_RPC_WS_URL || 'default',
  'PUBLIC_UMBRA_INDEXER_URL': process.env.PUBLIC_UMBRA_INDEXER_URL || 'default',
};

for (const [key, value] of Object.entries(frontendVars)) {
  console.log(`  ${key}: ${value}`);
}

console.log('\n✅ Setup Check Complete!\n');
console.log('Next steps:');
console.log('  1. Run: pnpm dev:api    (in one terminal)');
console.log('  2. Run: pnpm dev:web    (in another terminal)');
console.log('  3. Open: http://localhost:5173\n');
