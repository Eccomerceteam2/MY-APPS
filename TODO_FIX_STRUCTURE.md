# Fix Application Structure - Full-Stack Focus

## Current Issues
- README.md describes static version, but project is full-stack
- static-app/ folder exists but may be incomplete (missing app.js, README.md)
- Documentation inconsistent between static and full-stack
- Deployment workflow deploys frontend build (static), but backend exists for local

## Planned Fixes
- [ ] Update README.md to describe full-stack setup with local backend + frontend
- [ ] Remove or complete static-app/ folder (since focus is full-stack local)
- [ ] Update PROJECT_SUMMARY.md if needed
- [ ] Ensure backend and frontend package.json are correct
- [ ] Test local run with npm run start (concurrently backend + frontend)
- [ ] Update .github/workflows/deploy.yml to clarify (keep for frontend static deploy if needed)
- [ ] Clean up any redundant files

## Files to Edit
- README.md
- Possibly remove static-app/
- Update TODO.md to reflect full-stack status

## Followup
- Test npm run start works
- Verify backend on port 5000, frontend on port 3000
- Ensure API calls work between frontend and backend
