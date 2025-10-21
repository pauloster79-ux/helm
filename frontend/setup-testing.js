#!/usr/bin/env node

/**
 * Phase 2B Testing Setup Script
 * 
 * This script sets up the testing environment and runs comprehensive tests
 * for the task management functionality.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Phase 2B Testing Environment...\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Error: package.json not found. Please run this script from the frontend directory.');
  process.exit(1);
}

// Add testing dependencies
console.log('📦 Installing testing dependencies...');
const testingDeps = [
  'vitest',
  '@testing-library/react',
  '@testing-library/jest-dom',
  '@testing-library/user-event',
  'jsdom',
  '@vitest/ui'
];

try {
  execSync(`npm install --save-dev ${testingDeps.join(' ')}`, { stdio: 'inherit' });
  console.log('✅ Testing dependencies installed successfully!\n');
} catch (error) {
  console.error('❌ Error installing testing dependencies:', error.message);
  process.exit(1);
}

// Update package.json with test scripts
console.log('📝 Adding test scripts to package.json...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

packageJson.scripts = {
  ...packageJson.scripts,
  'test': 'vitest',
  'test:ui': 'vitest --ui',
  'test:run': 'vitest run',
  'test:coverage': 'vitest run --coverage',
  'test:task-management': 'vitest run src/tests/task-management.test.ts',
  'test:watch': 'vitest --watch',
  'type-check': 'tsc --noEmit'
};

fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
console.log('✅ Test scripts added to package.json!\n');

// Create vitest config
console.log('⚙️ Creating Vitest configuration...');
const vitestConfig = `import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/tests/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/'
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})`;

fs.writeFileSync('vitest.config.ts', vitestConfig);
console.log('✅ Vitest configuration created!\n');

// Create test setup file
console.log('🧪 Creating test setup file...');
const testSetup = `import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            range: vi.fn(() => Promise.resolve({ data: [], error: null }))
          }))
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: {}, error: null }))
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({ data: {}, error: null }))
          }))
        }))
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null }))
      }))
    })),
    rpc: vi.fn(() => Promise.resolve({ data: [], error: null }))
  }
}))

// Mock Auth Context
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id', email: 'test@example.com' },
    loading: false
  })
}))

// Mock React Router
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => vi.fn(),
  useParams: () => ({ projectId: 'test-project-id' })
}))

// Global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
`;

fs.writeFileSync('src/tests/setup.ts', testSetup);
console.log('✅ Test setup file created!\n');

// Create comprehensive test runner
console.log('🏃 Creating comprehensive test runner...');
const testRunner = `#!/usr/bin/env node

/**
 * Comprehensive Task Management Test Runner
 * 
 * This script runs all task management tests and provides detailed reporting
 */

import { execSync } from 'child_process';
import fs from 'fs';

const testSuites = [
  {
    name: 'Task Creation Tests',
    command: 'npm run test:run -- --reporter=verbose src/tests/task-management.test.ts -t "Task Creation"'
  },
  {
    name: 'Task Update Tests', 
    command: 'npm run test:run -- --reporter=verbose src/tests/task-management.test.ts -t "Task Status"'
  },
  {
    name: 'Task List & Filtering Tests',
    command: 'npm run test:run -- --reporter=verbose src/tests/task-management.test.ts -t "Task List"'
  },
  {
    name: 'Error Handling Tests',
    command: 'npm run test:run -- --reporter=verbose src/tests/task-management.test.ts -t "Error Handling"'
  },
  {
    name: 'Performance Tests',
    command: 'npm run test:run -- --reporter=verbose src/tests/task-management.test.ts -t "Performance"'
  },
  {
    name: 'Accessibility Tests',
    command: 'npm run test:run -- --reporter=verbose src/tests/task-management.test.ts -t "Accessibility"'
  }
];

console.log('🧪 Running Comprehensive Task Management Tests...\\n');

let totalPassed = 0;
let totalFailed = 0;

for (const suite of testSuites) {
  console.log(\`📋 Running \${suite.name}...\`);
  try {
    execSync(suite.command, { stdio: 'inherit' });
    console.log(\`✅ \${suite.name} - PASSED\\n\`);
    totalPassed++;
  } catch (error) {
    console.log(\`❌ \${suite.name} - FAILED\\n\`);
    totalFailed++;
  }
}

console.log('📊 Test Summary:');
console.log(\`✅ Passed: \${totalPassed}\`);
console.log(\`❌ Failed: \${totalFailed}\`);
console.log(\`📈 Total: \${totalPassed + totalFailed}\`);

if (totalFailed === 0) {
  console.log('\\n🎉 All tests passed! Task management implementation is solid.');
} else {
  console.log('\\n⚠️ Some tests failed. Please review the output above.');
  process.exit(1);
}
`;

fs.writeFileSync('src/tests/run-comprehensive-tests.js', testRunner);
console.log('✅ Comprehensive test runner created!\n');

// Create database schema application guide
console.log('🗄️ Creating database schema application guide...');
const dbGuide = `# Database Schema Application Guide

## Step 1: Apply the Enhanced Task Schema

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of \`docs/architecture/PHASE_2B_TASK_SCHEMA_UPDATE.sql\`
4. Click "Run" to execute the schema

## Step 2: Verify Schema Application

Run this query to verify the schema was applied correctly:

\`\`\`sql
-- Check if new columns exist
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'tasks'
ORDER BY ordinal_position;

-- Check if task_dependencies table exists
SELECT table_name
FROM information_schema.tables
WHERE table_name = 'task_dependencies';

-- Check if functions exist
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_name IN ('check_circular_dependency', 'update_task_completion', 'add_latest_position');
\`\`\`

## Step 3: Test Database Functions

\`\`\`sql
-- Test task creation with new fields
INSERT INTO tasks (project_id, user_id, title, description, status, priority, progress_percentage)
VALUES (
  'your-project-id',
  'your-user-id', 
  'Test Task',
  'Test description',
  'todo',
  'medium',
  0
);

-- Test latest position addition
SELECT add_latest_position(
  'your-task-id',
  'Test progress update',
  'your-user-id'
);

-- Test task hierarchy
SELECT * FROM get_task_hierarchy('your-task-id');
\`\`\`

## Step 4: Verify RLS Policies

\`\`\`sql
-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename IN ('tasks', 'task_dependencies');

-- Check policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('tasks', 'task_dependencies');
\`\`\`

## Troubleshooting

### Common Issues:

1. **Permission Errors**: Ensure you're using the service role key for schema changes
2. **Constraint Violations**: Check that referenced tables (projects, profiles) exist
3. **Function Errors**: Verify PostgreSQL extensions (uuid-ossp) are enabled

### Rollback (if needed):

\`\`\`sql
-- Remove new columns (be careful - this will delete data!)
ALTER TABLE tasks DROP COLUMN IF EXISTS progress_percentage;
ALTER TABLE tasks DROP COLUMN IF EXISTS parent_task_id;
ALTER TABLE tasks DROP COLUMN IF EXISTS owner_id;
ALTER TABLE tasks DROP COLUMN IF EXISTS latest_position;
ALTER TABLE tasks DROP COLUMN IF EXISTS due_date;
ALTER TABLE tasks DROP COLUMN IF EXISTS completed_at;
ALTER TABLE tasks DROP COLUMN IF EXISTS deleted_at;

-- Drop task_dependencies table
DROP TABLE IF EXISTS task_dependencies;

-- Drop functions
DROP FUNCTION IF EXISTS check_circular_dependency();
DROP FUNCTION IF EXISTS update_task_completion();
DROP FUNCTION IF EXISTS add_latest_position(UUID, TEXT, UUID);
DROP FUNCTION IF EXISTS get_task_hierarchy(UUID);
DROP FUNCTION IF EXISTS soft_delete_task(UUID);
\`\`\`
`;

fs.writeFileSync('DATABASE_SETUP_GUIDE.md', dbGuide);
console.log('✅ Database setup guide created!\n');

console.log('🎉 Testing environment setup complete!\n');
console.log('📋 Next steps:');
console.log('1. Apply the database schema using DATABASE_SETUP_GUIDE.md');
console.log('2. Run tests: npm run test:task-management');
console.log('3. Run comprehensive tests: node src/tests/run-comprehensive-tests.js');
console.log('4. Start development server: npm run dev');
console.log('\n🚀 Ready for comprehensive testing!');
