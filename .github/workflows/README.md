# GitHub Actions Workflows

This directory contains GitHub Actions workflows for CI/CD automation.

## Workflows

### 🧪 ci.yml - Continuous Integration
**Triggers:** Push to main/master, Pull Requests

**Jobs:**
- **Test & Build** - Runs on Node.js 18.x and 20.x
  - Linting with ESLint
  - TypeScript type checking
  - Unit tests with Vitest
  - Production build
  - Test coverage generation (Node 20.x only)
  - Coverage upload to Codecov (optional)

- **Lint Commits** - Validates commit message length (PR only)

**Required Checks:** All jobs must pass before merging

---

### 🔒 codeql.yml - Code Security Analysis
**Triggers:** Push to main/master, Pull Requests, Weekly schedule

**Jobs:**
- **Analyze** - Scans for security vulnerabilities
  - JavaScript/TypeScript code analysis
  - Identifies potential security issues
  - Creates security alerts

**Schedule:** Runs every Monday at midnight

---

### 📦 dependency-review.yml - Dependency Security
**Triggers:** Pull Requests only

**Jobs:**
- **Review Dependencies** - Checks for vulnerable dependencies
  - Fails on moderate or higher severity vulnerabilities
  - Comments summary on PR when issues found
  - Reviews new dependencies added in PR

---

### 📊 pr-test-results.yml - Test Result Reporting
**Triggers:** Pull Requests only

**Jobs:**
- **Test Report** - Posts detailed test results
  - Runs full test suite
  - Parses results and generates summary
  - Comments on PR with test statistics
  - Updates existing comment on subsequent runs

**Output Format:**
```
## ✅ Test Results

Status: All tests passed!

| Metric | Count |
|--------|-------|
| Total Tests | 299 |
| ✅ Passed | 289 |
| ❌ Failed | 10 |
| ⏭️ Skipped | 0 |
```

---

### 🚀 deploy.yml - Deployment
**Triggers:** Push to main/master, Manual workflow dispatch

**Jobs:**
- **Deploy to Production**
  - Runs tests before deployment
  - Builds production bundle
  - Deployment step (configure based on platform)

**Supported Platforms:**
- Vercel (commented out - add tokens to secrets)
- GitHub Pages (commented out - enable if needed)
- Custom deployment (add your own step)

**Required Secrets:**
- `VERCEL_TOKEN` (if using Vercel)
- `VERCEL_ORG_ID` (if using Vercel)
- `VERCEL_PROJECT_ID` (if using Vercel)

---

## Setup Instructions

### 1. Enable Workflows
All workflows are enabled by default when pushed to your repository.

### 2. Configure Branch Protection
Recommended settings for main/master branch:

```yaml
Required status checks:
  - Test & Build (ubuntu-latest, 18.x)
  - Test & Build (ubuntu-latest, 20.x)
  - Test Report

Require branches to be up to date: ✓
Require linear history: ✓
```

### 3. Add Secrets (Optional)

For Codecov integration:
- `CODECOV_TOKEN` - Get from https://codecov.io

For Vercel deployment:
- `VERCEL_TOKEN` - Generate from Vercel account settings
- `VERCEL_ORG_ID` - Found in Vercel project settings
- `VERCEL_PROJECT_ID` - Found in Vercel project settings

To add secrets:
1. Go to repository Settings
2. Navigate to Secrets and variables → Actions
3. Click "New repository secret"
4. Add the secret name and value

### 4. Customize Workflows

#### Change Node.js versions:
Edit `ci.yml`:
```yaml
strategy:
  matrix:
    node-version: [18.x, 20.x, 21.x]  # Add/remove versions
```

#### Adjust test coverage threshold:
Add to `vitest.config.ts`:
```typescript
coverage: {
  thresholds: {
    lines: 80,
    functions: 80,
    branches: 80,
    statements: 80
  }
}
```

#### Enable deployment:
Uncomment the desired deployment section in `deploy.yml` and add required secrets.

---

## Troubleshooting

### CI Failing on Type Check
```bash
# Run locally to see errors
npx tsc --noEmit
```

### Tests Passing Locally but Failing in CI
- Check Node.js version compatibility
- Ensure `npm ci` is used (not `npm install`)
- Verify timezone-dependent tests
- Check for race conditions in async tests

### Coverage Upload Failing
- Verify `CODECOV_TOKEN` is set
- Check `coverage/` directory is generated
- Ensure coverage files aren't in `.gitignore`

### Dependency Review Blocking PR
- Update vulnerable dependencies: `npm audit fix`
- Review security alerts in GitHub Security tab
- Override with `--fail-on-severity: high` if needed

---

## Best Practices

1. **Always run tests locally** before pushing
2. **Keep dependencies updated** regularly
3. **Review security alerts** promptly
4. **Monitor workflow run times** - optimize if > 10 minutes
5. **Cache dependencies** to speed up builds
6. **Use matrix builds** for multiple Node.js versions
7. **Fail fast** to save CI minutes

---

## Workflow Status Badges

Add to your main README.md:

```markdown
![CI](https://github.com/USERNAME/REPO/actions/workflows/ci.yml/badge.svg)
![CodeQL](https://github.com/USERNAME/REPO/actions/workflows/codeql.yml/badge.svg)
```

Replace `USERNAME` and `REPO` with your GitHub username and repository name.
