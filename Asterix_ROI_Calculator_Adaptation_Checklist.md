# Asterix Global ROI Calculator Adaptation Checklist

This checklist outlines all steps required to adapt the existing CRM ROI Calculator for Asterix Global Services, Inc.

---

## 1. Branding & Visual Identity
- [x] Replace all "It's Just Lunch" branding with "Asterix Global Services"
- [x] Update logo in UI to use `Asterix-logo-Full-Color-1024x387.png`
- [ ] Remove or replace Faye branding as appropriate
- [ ] Update color scheme to match Asterix Global's brand (if required)
- [ ] Update favicon and meta tags for Asterix

## 2. Business Logic & Metrics
- [x] Replace matchmaking/sales metrics with insurance/reinsurance onboarding metrics
- [x] Update all business metric labels and tooltips to reflect Asterix's workflow (e.g., "Clients onboarded per year", "Onboarding time (hours)", etc.)
- [x] Implement the following calculation categories:
    - [ ] Labor Efficiency (onboarding time savings)
    - [ ] Error Reduction (duplicate/rework issue savings)
    - [ ] Software Consolidation (Canopy, Dropbox, DocuSign, etc.)
    - [ ] Revenue Enablement (capacity gains)
    - [ ] Document Handling & Risk Avoidance
- [x] Update all formulas to match Asterix's ROI model (see asterix info)
- [x] Set new default values and input ranges per Asterix's baseline (see asterix info)
- [x] Remove or adapt any irrelevant fields (e.g., matchmaker productivity)

## 3. UI/UX & Content
- [x] Update all UI text, tooltips, and help content to reflect Asterix's business and terminology
- [x] Update scenario names to "Conservative", "Moderate", and "Aggressive"
- [x] Add preset scenario buttons for these three modes, with appropriate default values
- [x] Update charts and data visualizations to match new categories and metrics
- [x] Update summary and results sections to reflect Asterix's value drivers
- [x] Add/Update qualitative benefit overlays (e.g., compliance, client satisfaction)

## 4. Export & Reporting
- [x] Update PDF/Excel export templates to use Asterix branding and new metric categories
- [x] Update exported file names and headers
- [x] Ensure all exported data matches new business logic and terminology

## 5. Technical/Codebase
- [ ] Refactor large `App.jsx` file for maintainability (optional but recommended)
- [ ] Remove unused code/components from previous client
- [ ] Update README and documentation for Asterix Global
- [ ] Test all calculations and UI flows for accuracy
- [ ] QA for responsiveness and cross-browser compatibility

## 6. Deployment
- [ ] Update deployment scripts/URLs for Asterix
- [ ] Set up new hosting or update DNS as needed

---

**Reference:** See `asterix info` for detailed business requirements, metrics, and formulas. 