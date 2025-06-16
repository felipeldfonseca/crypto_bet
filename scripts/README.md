# 🛠️ Scripts Directory

## 📋 **Purpose**

This directory contains enterprise-grade automation scripts for the Crypto Bet Platform. These scripts handle deployment, monitoring, security, and maintenance operations.

## 📁 **Planned Structure**

### **🔒 Security Scripts**
- ✅ `security/security-audit.js` - **IMPLEMENTED** - Comprehensive security audit leveraging SecurityMonitor infrastructure
- `security/compliance-check.js` - Regulatory compliance verification

### **⚡ Performance Scripts**
- ✅ `performance/performance-audit.js` - **IMPLEMENTED** - Performance audit leveraging PerformanceMonitor infrastructure
- `performance/lighthouse-audit.js` - Automated Lighthouse performance scoring
- `performance/memory-monitor.js` - Advanced memory usage tracking

### **🚀 Deployment Scripts**
- ✅ `deploy/pre-deployment-audit.js` - **IMPLEMENTED** - Comprehensive production readiness validation
- `deploy/build-and-deploy.sh` - Production deployment automation
- `deploy/rollback.sh` - Emergency rollback procedures

### **⚙️ Solana Scripts**
- `solana/program-deploy.sh` - Smart contract deployment
- `solana/program-upgrade.sh` - Contract upgrade procedures
- `solana/account-monitor.js` - On-chain monitoring

### **🛠️ Development Scripts**
- `dev/setup-env.sh` - Development environment setup
- `dev/test-all.sh` - Comprehensive testing suite
- `dev/clean-install.sh` - Clean dependency installation

## 🎯 **Usage**

### **Available Commands**
```bash
# Security audit leveraging existing SecurityMonitor infrastructure
node scripts/security/security-audit.js

# Performance audit leveraging existing PerformanceMonitor infrastructure  
node scripts/performance/performance-audit.js

# Comprehensive pre-deployment validation
node scripts/deploy/pre-deployment-audit.js
```

### **Script Features**
- ✅ Leverage existing SecurityMonitor and PerformanceMonitor infrastructure
- ✅ Enterprise-grade reporting with JSON output
- ✅ Color-coded console output with severity levels
- ✅ Comprehensive error handling and logging
- ✅ Environment-specific configurations
- ✅ Production readiness validation

## 📊 **Integration**

These scripts integrate with:
- ✅ **Existing Infrastructure**: SecurityMonitor, PerformanceMonitor, and EnvironmentSecurity classes
- ✅ **Build System**: npm scripts and Next.js build process
- ✅ **Package Management**: npm audit integration
- CI/CD pipelines (GitHub Actions, etc.)
- Monitoring systems (performance, security)
- Deployment workflows

## 🔧 **Script Capabilities**

### **Security Audit Script**
- Dependency vulnerability scanning
- Security infrastructure verification  
- Component security analysis
- Configuration security audit
- Smart contract security check
- Comprehensive reporting with actionable recommendations

### **Performance Audit Script**
- Build performance analysis
- Bundle size optimization verification
- Component optimization scanning
- Memory usage analysis
- Performance monitoring verification
- Optimization recommendations

### **Pre-Deployment Audit Script**
- Infrastructure readiness validation
- Security audit integration
- Performance audit integration
- Environment-specific checks
- Production readiness scoring
- Deployment approval/blocking logic

