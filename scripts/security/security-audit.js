#!/usr/bin/env node

/**
 * 🔒 ENTERPRISE SECURITY AUDIT AUTOMATION SCRIPT
 * 
 * Leverages the existing SecurityMonitor infrastructure to perform
 * comprehensive automated security audits for the Crypto Bet Platform.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔒 CRYPTO BET PLATFORM - AUTOMATED SECURITY AUDIT');
console.log('=' .repeat(60));

// Audit Configuration
const AUDIT_CONFIG = {
  severity: {
    critical: { threshold: 0, color: '\x1b[31m' }, // Red
    high: { threshold: 0, color: '\x1b[33m' },     // Yellow  
    medium: { threshold: 5, color: '\x1b[36m' },   // Cyan
    low: { threshold: 10, color: '\x1b[32m' }      // Green
  },
  patterns: {
    sensitive_data: ['password', 'private', 'secret', 'key', 'token'],
    security_classes: ['InputSanitizer', 'WalletSecurity', 'SecurityMonitor', 'TransactionSecurity', 'EnvironmentSecurity'],
    xss_protection: ['DOMPurify', 'sanitize', 'escape'],
    rate_limiting: ['checkRateLimit', 'rateLimitExceeded'],
    validation: ['validatePublicKey', 'validateTransactionSignature', 'validateTransactionParams']
  }
};

// Security Audit Results
let auditResults = {
  timestamp: new Date().toISOString(),
  passed: 0,
  failed: 0,
  warnings: 0,
  critical: 0,
  issues: []
};

function log(message, severity = 'info') {
  const colors = {
    info: '\x1b[37m',    // White
    success: '\x1b[32m', // Green
    warning: '\x1b[33m', // Yellow
    error: '\x1b[31m',   // Red
    reset: '\x1b[0m'
  };
  
  const color = colors[severity] || colors.info;
  console.log(`${color}${message}${colors.reset}`);
}

function addIssue(type, severity, message, file = null, details = {}) {
  auditResults.issues.push({
    type,
    severity,
    message,
    file,
    details,
    timestamp: Date.now()
  });
  
  if (severity === 'critical') auditResults.critical++;
  else if (severity === 'error') auditResults.failed++;
  else if (severity === 'warning') auditResults.warnings++;
  else auditResults.passed++;
}

// 1. DEPENDENCY VULNERABILITY SCAN
async function auditDependencies() {
  log('\n🔍 DEPENDENCY VULNERABILITY SCAN', 'info');
  log('-'.repeat(40));
  
  try {
    const auditOutput = execSync('npm audit --json', { encoding: 'utf8' });
    const audit = JSON.parse(auditOutput);
    
    if (audit.metadata.vulnerabilities.total === 0) {
      log('✅ No vulnerabilities found in dependencies', 'success');
      addIssue('dependency_scan', 'success', 'All dependencies secure');
    } else {
      const vulns = audit.metadata.vulnerabilities;
      
      Object.entries(vulns).forEach(([severity, count]) => {
        if (count > 0 && severity !== 'total') {
          const message = `${count} ${severity} severity vulnerabilities found`;
          log(`❌ ${message}`, 'error');
          addIssue('dependency_vulnerability', severity, message, null, { count });
        }
      });
    }
  } catch (error) {
    if (error.status === 1) {
      // npm audit returns exit code 1 when vulnerabilities are found
      try {
        const auditOutput = error.stdout.toString();
        const audit = JSON.parse(auditOutput);
        const vulns = audit.metadata.vulnerabilities;
        
        Object.entries(vulns).forEach(([severity, count]) => {
          if (count > 0 && severity !== 'total') {
            const message = `${count} ${severity} severity vulnerabilities found`;
            log(`❌ ${message}`, 'error');
            addIssue('dependency_vulnerability', severity, message, null, { count });
          }
        });
      } catch (parseError) {
        log('❌ Failed to parse npm audit output', 'error');
        addIssue('dependency_scan', 'error', 'Failed to parse audit results');
      }
    } else {
      log('❌ Failed to run dependency scan', 'error');
      addIssue('dependency_scan', 'error', 'Dependency scan failed');
    }
  }
}

// 2. SECURITY INFRASTRUCTURE VERIFICATION
function auditSecurityInfrastructure() {
  log('\n🛡️ SECURITY INFRASTRUCTURE AUDIT', 'info');
  log('-'.repeat(40));
  
  const securityFile = 'src/lib/security.ts';
  
  if (!fs.existsSync(securityFile)) {
    log('❌ Security infrastructure file missing', 'error');
    addIssue('infrastructure', 'critical', 'Security file not found', securityFile);
    return;
  }
  
  const content = fs.readFileSync(securityFile, 'utf8');
  
  // Check for security classes
  AUDIT_CONFIG.patterns.security_classes.forEach(className => {
    if (content.includes(`class ${className}`)) {
      log(`✅ ${className} class implemented`, 'success');
      addIssue('security_class', 'success', `${className} class found`);
    } else {
      log(`❌ ${className} class missing`, 'error');
      addIssue('security_class', 'high', `${className} class not implemented`, securityFile);
    }
  });
  
  // Check for XSS protection
  const hasXSSProtection = AUDIT_CONFIG.patterns.xss_protection.some(pattern => 
    content.includes(pattern)
  );
  
  if (hasXSSProtection) {
    log('✅ XSS protection implemented', 'success');
    addIssue('xss_protection', 'success', 'XSS protection found');
  } else {
    log('❌ Missing XSS protection', 'error');
    addIssue('xss_protection', 'high', 'XSS protection not implemented', securityFile);
  }
  
  // Check for rate limiting
  const hasRateLimiting = AUDIT_CONFIG.patterns.rate_limiting.some(pattern =>
    content.includes(pattern)
  );
  
  if (hasRateLimiting) {
    log('✅ Rate limiting implemented', 'success');
    addIssue('rate_limiting', 'success', 'Rate limiting found');
  } else {
    log('❌ Missing rate limiting', 'error');
    addIssue('rate_limiting', 'medium', 'Rate limiting not implemented', securityFile);
  }
}

// 3. COMPONENT SECURITY SCAN
function auditComponentSecurity() {
  log('\n🔒 COMPONENT SECURITY SCAN', 'info');
  log('-'.repeat(40));
  
  const componentsDir = 'src/components';
  const securityComponents = [
    'src/components/shared/TokenSwap.tsx',
    'src/components/markets/MarketCreationForm.tsx'
  ];
  
  securityComponents.forEach(componentPath => {
    if (fs.existsSync(componentPath)) {
      const content = fs.readFileSync(componentPath, 'utf8');
      
      // Check for SecurityMonitor usage
      if (content.includes('SecurityMonitor.logSecurityEvent')) {
        log(`✅ ${path.basename(componentPath)} - Security monitoring active`, 'success');
        addIssue('component_security', 'success', 'Security monitoring implemented', componentPath);
      } else {
        log(`⚠️ ${path.basename(componentPath)} - No security monitoring`, 'warning');
        addIssue('component_security', 'medium', 'Security monitoring not implemented', componentPath);
      }
      
      // Check for input validation
      if (content.includes('validateSwapSecurity') || content.includes('validateForm')) {
        log(`✅ ${path.basename(componentPath)} - Input validation active`, 'success');
        addIssue('input_validation', 'success', 'Input validation implemented', componentPath);
      } else {
        log(`⚠️ ${path.basename(componentPath)} - Missing input validation`, 'warning');
        addIssue('input_validation', 'medium', 'Input validation not found', componentPath);
      }
    } else {
      log(`❌ ${componentPath} - File not found`, 'error');
      addIssue('component_security', 'high', 'Security component missing', componentPath);
    }
  });
}

// 4. CONFIGURATION SECURITY AUDIT
function auditConfigurationSecurity() {
  log('\n⚙️ CONFIGURATION SECURITY AUDIT', 'info');
  log('-'.repeat(40));
  
  // Check Next.js config
  const nextConfig = 'next.config.mjs';
  if (fs.existsSync(nextConfig)) {
    const content = fs.readFileSync(nextConfig, 'utf8');
    
    if (content.includes('headers()')) {
      log('✅ Security headers configured', 'success');
      addIssue('config_security', 'success', 'Security headers found', nextConfig);
    } else {
      log('❌ Missing security headers', 'error');
      addIssue('config_security', 'high', 'Security headers not configured', nextConfig);
    }
    
    if (content.includes('compress')) {
      log('✅ Compression enabled', 'success');
      addIssue('config_security', 'success', 'Compression configured', nextConfig);
    } else {
      log('⚠️ Compression not configured', 'warning');
      addIssue('config_security', 'low', 'Compression not enabled', nextConfig);
    }
  } else {
    log('❌ Next.js config missing', 'error');
    addIssue('config_security', 'critical', 'Next.js configuration not found');
  }
  
  // Check for sensitive data exposure
  const envExample = '.env.example';
  const gitignore = '.gitignore';
  
  if (fs.existsSync(gitignore)) {
    const content = fs.readFileSync(gitignore, 'utf8');
    if (content.includes('.env')) {
      log('✅ Environment files ignored by git', 'success');
      addIssue('env_security', 'success', 'Environment files protected');
    } else {
      log('❌ Environment files not ignored', 'error');
      addIssue('env_security', 'high', 'Environment files may be exposed', gitignore);
    }
  }
}

// 5. SMART CONTRACT SECURITY CHECK
function auditSmartContractSecurity() {
  log('\n⚙️ SMART CONTRACT SECURITY AUDIT', 'info');
  log('-'.repeat(40));
  
  const contractPath = 'program/programs/crypto-bet/src/lib.rs';
  
  if (fs.existsSync(contractPath)) {
    const content = fs.readFileSync(contractPath, 'utf8');
    
    // Check for security patterns
    const securityPatterns = [
      { pattern: 'require!', description: 'Access control checks' },
      { pattern: 'checked_add', description: 'Overflow protection' },
      { pattern: 'claimed', description: 'Double-claiming prevention' }
    ];
    
    securityPatterns.forEach(({ pattern, description }) => {
      if (content.includes(pattern)) {
        log(`✅ ${description} implemented`, 'success');
        addIssue('contract_security', 'success', `${description} found`, contractPath);
      } else {
        log(`⚠️ ${description} not detected`, 'warning');
        addIssue('contract_security', 'medium', `${description} may be missing`, contractPath);
      }
    });
    
    // Check file size (large contracts may indicate complexity)
    const stats = fs.statSync(contractPath);
    const sizeKB = Math.round(stats.size / 1024);
    
    if (sizeKB > 50) {
      log(`ℹ️ Contract size: ${sizeKB}KB (complex contract - review recommended)`, 'info');
      addIssue('contract_complexity', 'low', `Large contract detected: ${sizeKB}KB`, contractPath);
    } else {
      log(`✅ Contract size: ${sizeKB}KB (reasonable complexity)`, 'success');
      addIssue('contract_complexity', 'success', `Contract size appropriate: ${sizeKB}KB`, contractPath);
    }
  } else {
    log('❌ Smart contract not found', 'error');
    addIssue('contract_security', 'critical', 'Smart contract file missing', contractPath);
  }
}

// 6. GENERATE SECURITY REPORT
function generateSecurityReport() {
  log('\n📊 SECURITY AUDIT SUMMARY', 'info');
  log('='.repeat(60));
  
  const total = auditResults.passed + auditResults.failed + auditResults.warnings;
  const successRate = total > 0 ? ((auditResults.passed / total) * 100).toFixed(1) : 0;
  
  log(`📈 Security Score: ${successRate}%`);
  log(`✅ Passed: ${auditResults.passed}`);
  log(`⚠️ Warnings: ${auditResults.warnings}`);
  log(`❌ Failed: ${auditResults.failed}`);
  log(`🚨 Critical: ${auditResults.critical}`);
  
  // Security Level Assessment
  let securityLevel = 'UNKNOWN';
  let securityColor = 'info';
  
  if (auditResults.critical > 0) {
    securityLevel = 'CRITICAL ISSUES FOUND';
    securityColor = 'error';
  } else if (auditResults.failed > 3) {
    securityLevel = 'HIGH RISK';
    securityColor = 'error';
  } else if (auditResults.failed > 0 || auditResults.warnings > 5) {
    securityLevel = 'MEDIUM RISK';
    securityColor = 'warning';
  } else if (auditResults.warnings > 0) {
    securityLevel = 'LOW RISK';
    securityColor = 'warning';
  } else {
    securityLevel = 'SECURE';
    securityColor = 'success';
  }
  
  log(`🛡️ Security Level: ${securityLevel}`, securityColor);
  
  // Save report to file
  const reportPath = 'security-audit-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(auditResults, null, 2));
  log(`📄 Detailed report saved to: ${reportPath}`);
  
  // Critical issues summary
  if (auditResults.critical > 0 || auditResults.failed > 0) {
    log('\n🚨 IMMEDIATE ACTION REQUIRED', 'error');
    log('-'.repeat(40));
    
    auditResults.issues
      .filter(issue => issue.severity === 'critical' || issue.severity === 'error' || issue.severity === 'high')
      .forEach(issue => {
        log(`❌ ${issue.type}: ${issue.message}`, 'error');
        if (issue.file) log(`   File: ${issue.file}`);
      });
  }
  
  return securityLevel === 'SECURE';
}

// MAIN AUDIT EXECUTION
async function runSecurityAudit() {
  const startTime = Date.now();
  
  try {
    await auditDependencies();
    auditSecurityInfrastructure();
    auditComponentSecurity();
    auditConfigurationSecurity();
    auditSmartContractSecurity();
    
    const isSecure = generateSecurityReport();
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    log(`\n⏱️ Audit completed in ${duration}s`);
    
    // Exit with appropriate code
    process.exit(isSecure ? 0 : 1);
    
  } catch (error) {
    log(`\n❌ Audit failed: ${error.message}`, 'error');
    process.exit(1);
  }
}

// Execute audit
if (require.main === module) {
  runSecurityAudit();
}

module.exports = { runSecurityAudit, AUDIT_CONFIG }; 