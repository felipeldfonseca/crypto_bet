#!/usr/bin/env node

/**
 * 🚀 ENTERPRISE PRE-DEPLOYMENT AUDIT AUTOMATION SCRIPT
 * 
 * Comprehensive production readiness validation leveraging existing
 * SecurityMonitor and PerformanceMonitor infrastructure.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 CRYPTO BET PLATFORM - PRE-DEPLOYMENT AUDIT');
console.log('=' .repeat(60));

// Deployment readiness configuration
const DEPLOYMENT_CONFIG = {
  requiredFiles: [
    'src/lib/security.ts',
    'src/lib/performance.ts',
    'src/hooks/usePerformance.ts',
    'next.config.mjs',
    'package.json',
    'program/programs/crypto-bet/src/lib.rs'
  ],
  securityThresholds: {
    vulnerabilities: 0,
    criticalIssues: 0,
    highIssues: 0
  },
  performanceThresholds: {
    bundleSize: 400, // KB
    buildTime: 60,   // seconds
    optimizationRate: 80 // percentage
  },
  environments: ['development', 'staging', 'production']
};

// Audit results aggregator
let deploymentAudit = {
  timestamp: new Date().toISOString(),
  environment: process.env.NODE_ENV || 'development',
  readiness: {
    security: false,
    performance: false,
    infrastructure: false,
    overall: false
  },
  scores: {
    security: 0,
    performance: 0,
    infrastructure: 0,
    overall: 0
  },
  issues: [],
  recommendations: []
};

function log(message, severity = 'info') {
  const colors = {
    info: '\x1b[37m',        // White
    success: '\x1b[32m',     // Green
    warning: '\x1b[33m',     // Yellow
    error: '\x1b[31m',       // Red
    deployment: '\x1b[35m',  // Magenta
    reset: '\x1b[0m'
  };
  
  const color = colors[severity] || colors.info;
  console.log(`${color}${message}${colors.reset}`);
}

function addIssue(category, severity, message, recommendation = null) {
  deploymentAudit.issues.push({
    category,
    severity,
    message,
    timestamp: Date.now()
  });
  
  if (recommendation) {
    deploymentAudit.recommendations.push(recommendation);
  }
}

// 1. INFRASTRUCTURE READINESS CHECK
function auditInfrastructureReadiness() {
  log('\n🏗️ INFRASTRUCTURE READINESS AUDIT', 'info');
  log('-'.repeat(50));
  
  let infrastructureScore = 0;
  const totalChecks = DEPLOYMENT_CONFIG.requiredFiles.length + 3; // +3 for additional checks
  
  // Check required files
  DEPLOYMENT_CONFIG.requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      log(`✅ ${file} - Found`, 'success');
      infrastructureScore++;
    } else {
      log(`❌ ${file} - Missing`, 'error');
      addIssue('infrastructure', 'critical', `Required file missing: ${file}`, 
        `Create or restore missing file: ${file}`);
    }
  });
  
  // Check package.json scripts
  if (fs.existsSync('package.json')) {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredScripts = ['build', 'start', 'dev'];
    
    let scriptsFound = 0;
    requiredScripts.forEach(script => {
      if (pkg.scripts && pkg.scripts[script]) {
        scriptsFound++;
      }
    });
    
    if (scriptsFound === requiredScripts.length) {
      log('✅ Required npm scripts - All present', 'success');
      infrastructureScore++;
    } else {
      log(`❌ Required npm scripts - ${scriptsFound}/${requiredScripts.length} found`, 'error');
      addIssue('infrastructure', 'high', 'Missing required npm scripts', 
        'Add missing scripts: build, start, dev');
    }
  }
  
  // Check environment configuration
  if (process.env.NODE_ENV) {
    log(`✅ NODE_ENV configured: ${process.env.NODE_ENV}`, 'success');
    infrastructureScore++;
  } else {
    log('⚠️ NODE_ENV not configured', 'warning');
    addIssue('infrastructure', 'medium', 'NODE_ENV not set', 
      'Set NODE_ENV environment variable');
  }
  
  // Check TypeScript configuration
  if (fs.existsSync('tsconfig.json')) {
    log('✅ TypeScript configuration - Found', 'success');
    infrastructureScore++;
  } else {
    log('❌ TypeScript configuration - Missing', 'error');
    addIssue('infrastructure', 'high', 'TypeScript config missing', 
      'Create tsconfig.json file');
  }
  
  const infrastructurePercentage = (infrastructureScore / totalChecks * 100).toFixed(1);
  deploymentAudit.scores.infrastructure = parseFloat(infrastructurePercentage);
  
  log(`\n📊 Infrastructure Score: ${infrastructurePercentage}%`, 'deployment');
  
  if (infrastructureScore === totalChecks) {
    log('✅ Infrastructure readiness: PASSED', 'success');
    deploymentAudit.readiness.infrastructure = true;
  } else {
    log('❌ Infrastructure readiness: FAILED', 'error');
    deploymentAudit.readiness.infrastructure = false;
  }
  
  return infrastructureScore === totalChecks;
}

// 2. SECURITY AUDIT INTEGRATION
async function runSecurityAudit() {
  log('\n🔒 SECURITY AUDIT INTEGRATION', 'info');
  log('-'.repeat(50));
  
  try {
    // Run dependency audit
    log('Running dependency vulnerability scan...', 'info');
    const auditOutput = execSync('npm audit --json', { encoding: 'utf8' });
    const audit = JSON.parse(auditOutput);
    
    const vulnerabilities = audit.metadata.vulnerabilities;
    const totalVulns = vulnerabilities.critical + vulnerabilities.high + vulnerabilities.moderate + vulnerabilities.low;
    
    if (totalVulns === 0) {
      log('✅ Dependency security: PASSED (0 vulnerabilities)', 'success');
      deploymentAudit.scores.security = 100;
      deploymentAudit.readiness.security = true;
    } else {
      log(`❌ Dependency security: FAILED (${totalVulns} vulnerabilities)`, 'error');
      
      if (vulnerabilities.critical > 0) {
        addIssue('security', 'critical', `${vulnerabilities.critical} critical vulnerabilities`, 
          'Run npm audit fix --force immediately');
      }
      
      deploymentAudit.scores.security = Math.max(0, 100 - (totalVulns * 10));
      deploymentAudit.readiness.security = vulnerabilities.critical === 0 && vulnerabilities.high === 0;
    }
    
  } catch (error) {
    if (error.status === 1) {
      // Handle npm audit exit code 1 (vulnerabilities found)
      try {
        const auditOutput = error.stdout.toString();
        const audit = JSON.parse(auditOutput);
        const vulnerabilities = audit.metadata.vulnerabilities;
        const totalVulns = vulnerabilities.critical + vulnerabilities.high + vulnerabilities.moderate + vulnerabilities.low;
        
        log(`❌ Security audit: ${totalVulns} vulnerabilities found`, 'error');
        deploymentAudit.scores.security = Math.max(0, 100 - (totalVulns * 10));
        deploymentAudit.readiness.security = vulnerabilities.critical === 0 && vulnerabilities.high === 0;
        
        if (vulnerabilities.critical > 0) {
          addIssue('security', 'critical', `${vulnerabilities.critical} critical vulnerabilities`, 
            'Run npm audit fix --force immediately');
        }
      } catch (parseError) {
        log('❌ Security audit: Failed to parse results', 'error');
        deploymentAudit.scores.security = 0;
        deploymentAudit.readiness.security = false;
      }
    } else {
      log(`❌ Security audit: Failed to run (${error.message})`, 'error');
      deploymentAudit.scores.security = 0;
      deploymentAudit.readiness.security = false;
    }
  }
  
  // Check security infrastructure
  const securityFile = 'src/lib/security.ts';
  if (fs.existsSync(securityFile)) {
    const content = fs.readFileSync(securityFile, 'utf8');
    const securityClasses = ['SecurityMonitor', 'WalletSecurity', 'InputSanitizer'];
    const foundClasses = securityClasses.filter(cls => content.includes(`class ${cls}`));
    
    if (foundClasses.length === securityClasses.length) {
      log('✅ Security infrastructure: All classes present', 'success');
    } else {
      log(`⚠️ Security infrastructure: ${foundClasses.length}/${securityClasses.length} classes found`, 'warning');
      addIssue('security', 'medium', 'Incomplete security infrastructure', 
        'Verify all security classes are implemented');
    }
  }
}

// 3. PERFORMANCE AUDIT INTEGRATION  
async function runPerformanceAudit() {
  log('\n⚡ PERFORMANCE AUDIT INTEGRATION', 'info');
  log('-'.repeat(50));
  
  try {
    const startTime = Date.now();
    
    // Run production build
    log('Running production build for performance analysis...', 'info');
    const buildOutput = execSync('npm run build', { 
      encoding: 'utf8',
      timeout: 90000 // 90 second timeout
    });
    
    const buildTime = (Date.now() - startTime) / 1000;
    
    if (buildTime < DEPLOYMENT_CONFIG.performanceThresholds.buildTime) {
      log(`✅ Build performance: ${buildTime.toFixed(2)}s (Good)`, 'success');
    } else {
      log(`⚠️ Build performance: ${buildTime.toFixed(2)}s (Slow)`, 'warning');
      addIssue('performance', 'medium', 'Slow build time', 
        'Optimize build configuration and dependencies');
    }
    
    // Parse bundle sizes
    const bundleRegex = /│\s+○\s+([^\s]+)\s+([0-9.,]+\s+kB)\s+([0-9.,]+\s+kB)/g;
    let match;
    let maxBundleSize = 0;
    
    while ((match = bundleRegex.exec(buildOutput)) !== null) {
      const [, route, size, firstLoad] = match;
      const firstLoadKB = parseFloat(firstLoad.replace(/[,\s]/g, ''));
      maxBundleSize = Math.max(maxBundleSize, firstLoadKB);
    }
    
    if (maxBundleSize < DEPLOYMENT_CONFIG.performanceThresholds.bundleSize) {
      log(`✅ Bundle size: ${maxBundleSize.toFixed(1)}kB (Optimized)`, 'success');
      deploymentAudit.scores.performance = 100;
      deploymentAudit.readiness.performance = true;
    } else {
      log(`⚠️ Bundle size: ${maxBundleSize.toFixed(1)}kB (Large)`, 'warning');
      deploymentAudit.scores.performance = Math.max(0, 100 - ((maxBundleSize - DEPLOYMENT_CONFIG.performanceThresholds.bundleSize) / 10));
      deploymentAudit.readiness.performance = false;
      addIssue('performance', 'medium', 'Large bundle size', 
        'Optimize bundle splitting and remove unused dependencies');
    }
    
  } catch (error) {
    log(`❌ Performance audit: Failed (${error.message})`, 'error');
    deploymentAudit.scores.performance = 0;
    deploymentAudit.readiness.performance = false;
    addIssue('performance', 'critical', 'Build failed', 
      'Fix build errors before deployment');
  }
  
  // Check performance infrastructure
  const performanceFile = 'src/lib/performance.ts';
  if (fs.existsSync(performanceFile)) {
    const content = fs.readFileSync(performanceFile, 'utf8');
    
    if (content.includes('PerformanceMonitor')) {
      log('✅ Performance monitoring: Infrastructure ready', 'success');
    } else {
      log('⚠️ Performance monitoring: Limited infrastructure', 'warning');
      addIssue('performance', 'low', 'Performance monitoring incomplete', 
        'Enhance performance monitoring capabilities');
    }
  }
}

// 4. ENVIRONMENT-SPECIFIC CHECKS
function auditEnvironmentReadiness() {
  log('\n🌍 ENVIRONMENT READINESS AUDIT', 'info');
  log('-'.repeat(50));
  
  const environment = deploymentAudit.environment;
  
  // Environment-specific validations
  switch (environment) {
    case 'production':
      log('🏭 Production environment checks...', 'deployment');
      
      // Check for production optimizations
      if (fs.existsSync('next.config.mjs')) {
        const config = fs.readFileSync('next.config.mjs', 'utf8');
        
        if (config.includes('compress')) {
          log('✅ Compression enabled for production', 'success');
        } else {
          log('⚠️ Compression not configured', 'warning');
          addIssue('environment', 'medium', 'Production compression not enabled', 
            'Enable compression in next.config.mjs');
        }
      }
      
      // Check for security headers
      if (fs.existsSync('next.config.mjs')) {
        const config = fs.readFileSync('next.config.mjs', 'utf8');
        
        if (config.includes('headers()')) {
          log('✅ Security headers configured', 'success');
        } else {
          log('❌ Security headers missing', 'error');
          addIssue('environment', 'high', 'Security headers not configured', 
            'Configure security headers for production');
        }
      }
      break;
      
    case 'staging':
      log('🧪 Staging environment checks...', 'deployment');
      log('✅ Staging environment ready', 'success');
      break;
      
    default:
      log('🔧 Development environment checks...', 'deployment');
      log('✅ Development environment ready', 'success');
  }
}

// 5. GENERATE DEPLOYMENT READINESS REPORT
function generateDeploymentReport() {
  log('\n📊 DEPLOYMENT READINESS SUMMARY', 'deployment');
  log('='.repeat(60));
  
  // Calculate overall score
  const overallScore = (
    deploymentAudit.scores.infrastructure +
    deploymentAudit.scores.security +
    deploymentAudit.scores.performance
  ) / 3;
  
  deploymentAudit.scores.overall = parseFloat(overallScore.toFixed(1));
  
  // Determine overall readiness
  deploymentAudit.readiness.overall = 
    deploymentAudit.readiness.infrastructure &&
    deploymentAudit.readiness.security &&
    deploymentAudit.readiness.performance;
  
  // Display scores
  log(`📈 Overall Readiness Score: ${deploymentAudit.scores.overall}%`);
  log(`🏗️ Infrastructure: ${deploymentAudit.scores.infrastructure}%`);
  log(`🔒 Security: ${deploymentAudit.scores.security}%`);
  log(`⚡ Performance: ${deploymentAudit.scores.performance}%`);
  
  // Deployment readiness determination
  let readinessLevel = 'NOT READY';
  let readinessColor = 'error';
  
  if (deploymentAudit.readiness.overall && deploymentAudit.scores.overall >= 90) {
    readinessLevel = 'READY FOR DEPLOYMENT';
    readinessColor = 'success';
  } else if (deploymentAudit.scores.overall >= 75) {
    readinessLevel = 'READY WITH WARNINGS';
    readinessColor = 'warning';
  } else if (deploymentAudit.scores.overall >= 50) {
    readinessLevel = 'NEEDS IMPROVEMENTS';
    readinessColor = 'warning';
  } else {
    readinessLevel = 'NOT READY FOR DEPLOYMENT';
    readinessColor = 'error';
  }
  
  log(`\n🚀 Deployment Status: ${readinessLevel}`, readinessColor);
  
  // Critical issues blocking deployment
  const criticalIssues = deploymentAudit.issues.filter(issue => 
    issue.severity === 'critical' || issue.severity === 'high'
  );
  
  if (criticalIssues.length > 0) {
    log('\n🚨 BLOCKING ISSUES - MUST FIX BEFORE DEPLOYMENT', 'error');
    log('-'.repeat(50));
    
    criticalIssues.forEach(issue => {
      log(`❌ ${issue.category}: ${issue.message}`, 'error');
    });
  }
  
  // Recommendations
  if (deploymentAudit.recommendations.length > 0) {
    log('\n💡 DEPLOYMENT RECOMMENDATIONS', 'deployment');
    log('-'.repeat(50));
    
    deploymentAudit.recommendations.slice(0, 5).forEach((rec, index) => {
      log(`${index + 1}. ${rec}`, 'info');
    });
  }
  
  // Save detailed report
  const reportPath = 'deployment-readiness-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(deploymentAudit, null, 2));
  log(`\n📄 Detailed report saved to: ${reportPath}`);
  
  return deploymentAudit.readiness.overall && deploymentAudit.scores.overall >= 85;
}

// MAIN DEPLOYMENT AUDIT EXECUTION
async function runDeploymentAudit() {
  const startTime = Date.now();
  
  try {
    log(`🌍 Environment: ${deploymentAudit.environment.toUpperCase()}`, 'deployment');
    
    auditInfrastructureReadiness();
    await runSecurityAudit();
    await runPerformanceAudit();
    auditEnvironmentReadiness();
    
    const isReady = generateDeploymentReport();
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    log(`\n⏱️ Deployment audit completed in ${duration}s`);
    
    if (isReady) {
      log('\n🎉 DEPLOYMENT APPROVED - Ready to deploy!', 'success');
    } else {
      log('\n🛑 DEPLOYMENT BLOCKED - Fix issues before proceeding', 'error');
    }
    
    // Exit with appropriate code
    process.exit(isReady ? 0 : 1);
    
  } catch (error) {
    log(`\n❌ Deployment audit failed: ${error.message}`, 'error');
    process.exit(1);
  }
}

// Execute deployment audit
if (require.main === module) {
  runDeploymentAudit();
}

module.exports = { runDeploymentAudit, DEPLOYMENT_CONFIG }; 