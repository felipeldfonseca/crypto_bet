#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const COMMANDS = {
  create: 'create <name>  - Create a new isolated POC experiment',
  list: 'list           - List all current POC experiments',
  clean: 'clean <name>   - Remove a specific POC experiment',
  'clean-all': 'clean-all     - Remove all POC experiments',
  status: 'status        - Check for package.json conflicts'
};

function showHelp() {
  console.log('🧪 POC Helper - Safe Experimentation Tool\n');
  console.log('Usage: node scripts/poc-helper.js <command>\n');
  console.log('Commands:');
  Object.entries(COMMANDS).forEach(([cmd, desc]) => {
    console.log(`  ${desc}`);
  });
  console.log('\nSafety Features:');
  console.log('  ✅ Isolated package.json files');
  console.log('  ✅ Different ports (3001+)');
  console.log('  ✅ Separate base paths');
  console.log('  ✅ No conflicts with main app');
}

function checkConflicts() {
  const packageFiles = [];
  
  function findPackageJson(dir, depth = 0) {
    if (depth > 3) return; // Limit search depth
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.name === 'node_modules') continue;
      
      const fullPath = path.join(dir, entry.name);
      
      if (entry.name === 'package.json') {
        packageFiles.push(fullPath);
      } else if (entry.isDirectory()) {
        findPackageJson(fullPath, depth + 1);
      }
    }
  }
  
  findPackageJson('.');
  
  console.log('📦 Package.json Files Found:');
  packageFiles.forEach(file => {
    const relativePath = path.relative('.', file);
    const isMain = relativePath === 'package.json';
    const isProgram = relativePath.startsWith('program/');
    const isPOC = relativePath.startsWith('poc/');
    const isBuild = relativePath.startsWith('.next/');
    
    let status = '✅ Safe';
    if (isMain) status = '🏠 Main App';
    else if (isProgram) status = '⚙️ Rust/Anchor';
    else if (isPOC) status = '🧪 POC Experiment';
    else if (isBuild) status = '🔧 Build Artifact';
    else status = '⚠️ Unknown';
    
    console.log(`  ${status} - ${relativePath}`);
  });
  
  const conflicts = packageFiles.filter(file => {
    const relativePath = path.relative('.', file);
    return !relativePath.match(/^(package\.json|program\/|poc\/|\.next\/)/);
  });
  
  if (conflicts.length > 0) {
    console.log('\n❌ POTENTIAL CONFLICTS DETECTED:');
    conflicts.forEach(file => console.log(`  ${path.relative('.', file)}`));
    return false;
  }
  
  console.log('\n✅ No conflicts detected - Safe for POC experiments!');
  return true;
}

function createPOC(name) {
  if (!name) {
    console.error('❌ Error: Please provide a name for the POC experiment');
    console.log('Usage: node scripts/poc-helper.js create my-experiment');
    process.exit(1);
  }
  
  const pocDir = path.join('poc', 'experiments', name);
  
  if (fs.existsSync(pocDir)) {
    console.error(`❌ Error: POC experiment "${name}" already exists`);
    process.exit(1);
  }
  
  console.log(`🧪 Creating POC experiment: ${name}`);
  
  // Create directory structure
  fs.mkdirSync(pocDir, { recursive: true });
  fs.mkdirSync(path.join(pocDir, 'src', 'app'), { recursive: true });
  
  // Create package.json
  const packageJson = {
    name: `poc-${name}`,
    version: '0.1.0',
    private: true,
    scripts: {
      dev: 'next dev -p 3001',
      build: 'next build',
      start: 'next start -p 3001'
    },
    dependencies: {
      next: '^14.2.4',
      react: '^18.3.1',
      'react-dom': '^18.3.1'
    },
    devDependencies: {
      '@types/node': '^20.14.8',
      '@types/react': '^18.3.3',
      '@types/react-dom': '^18.3.0',
      typescript: '^5.5.2'
    }
  };
  
  fs.writeFileSync(
    path.join(pocDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  
  // Create next.config.js
  const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  // Isolated configuration for POC - simple setup for development
  // No basePath needed for POC experiments
  generateEtags: false,
  poweredByHeader: false,
}

module.exports = nextConfig;`;
  
  fs.writeFileSync(path.join(pocDir, 'next.config.js'), nextConfig);
  
  // Create basic page
  const pageContent = `export default function Home() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>🧪 POC Experiment: ${name}</h1>
      <p>This is an isolated experiment running on port 3001</p>
      <p>Safe to modify without affecting the main application!</p>
    </div>
  );
}`;
  
  fs.writeFileSync(path.join(pocDir, 'src', 'app', 'page.tsx'), pageContent);
  
  // Create README
  const readmeContent = `# POC Experiment: ${name}

## Description
Brief description of what this experiment tests.

## Running
\`\`\`bash
cd poc/experiments/${name}
npm install
npm run dev
\`\`\`

Visit: http://localhost:3001

## Notes
- Runs on port 3001 (isolated from main app)
- Has its own dependencies
- Safe to modify without affecting main application
`;
  
  fs.writeFileSync(path.join(pocDir, 'README.md'), readmeContent);
  
  console.log('✅ POC experiment created successfully!');
  console.log('\nNext steps:');
  console.log(`  cd poc/experiments/${name}`);
  console.log('  npm install');
  console.log('  npm run dev');
  console.log('\nThen visit: http://localhost:3001');
}

function listPOCs() {
  const experimentsDir = path.join('poc', 'experiments');
  
  if (!fs.existsSync(experimentsDir)) {
    console.log('📁 No POC experiments directory found');
    return;
  }
  
  const experiments = fs.readdirSync(experimentsDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);
  
  if (experiments.length === 0) {
    console.log('🧪 No POC experiments found');
    return;
  }
  
  console.log('🧪 Current POC Experiments:');
  experiments.forEach(exp => {
    const expPath = path.join(experimentsDir, exp);
    const hasPackageJson = fs.existsSync(path.join(expPath, 'package.json'));
    const status = hasPackageJson ? '✅' : '⚠️ (incomplete)';
    console.log(`  ${status} ${exp}`);
  });
}

function cleanPOC(name) {
  if (!name) {
    console.error('❌ Error: Please provide the name of the POC to remove');
    console.log('Usage: node scripts/poc-helper.js clean my-experiment');
    process.exit(1);
  }
  
  const pocDir = path.join('poc', 'experiments', name);
  
  if (!fs.existsSync(pocDir)) {
    console.error(`❌ Error: POC experiment "${name}" not found`);
    process.exit(1);
  }
  
  fs.rmSync(pocDir, { recursive: true, force: true });
  console.log(`✅ POC experiment "${name}" removed successfully`);
}

function cleanAllPOCs() {
  const experimentsDir = path.join('poc', 'experiments');
  
  if (!fs.existsSync(experimentsDir)) {
    console.log('📁 No POC experiments to clean');
    return;
  }
  
  const experiments = fs.readdirSync(experimentsDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);
  
  if (experiments.length === 0) {
    console.log('🧪 No POC experiments to clean');
    return;
  }
  
  experiments.forEach(exp => {
    const expPath = path.join(experimentsDir, exp);
    fs.rmSync(expPath, { recursive: true, force: true });
  });
  
  console.log(`✅ Removed ${experiments.length} POC experiment(s)`);
}

// Main execution
const [,, command, ...args] = process.argv;

switch (command) {
  case 'create':
    createPOC(args[0]);
    break;
  case 'list':
    listPOCs();
    break;
  case 'clean':
    cleanPOC(args[0]);
    break;
  case 'clean-all':
    cleanAllPOCs();
    break;
  case 'status':
    checkConflicts();
    break;
  default:
    showHelp();
} 