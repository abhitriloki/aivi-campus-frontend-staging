# 🛡️ DEPLOYMENT SAFETY RULE — STAGING ONLY BY DEFAULT

1. **PROHIBITION ON AUTOMATIC PRODUCTION DEPLOYMENT**:
   - NEVER execute `python scripts/deploy_production.py` or deploy directly to the Production web roots (`/var/www/aivi-campus/html`) without explicit, one-time user confirmation in the chat.
   - Fixing a bug or implementing a feature NEVER implies permission to deploy to Production.

2. **STAGING DEPLOYMENT DEFAULT**:
   - When verified fixes or features are ready to be tested live, ONLY deploy to Staging:
     - Command: `python scripts/deploy_staging.py`
     - Live Staging URLs: `https://staging.aivilabs.com` and `https://campus.staging.aivilabs.com`

3. **PRODUCTION DEPLOYMENT REQUIREMENTS**:
   - Deploying to Production (`python scripts/deploy_production.py`) requires explicit user confirmation in the prompt before execution.
