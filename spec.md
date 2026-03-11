# NLS TECH - Kollect Lite Portal

## Current State
A legal case management portal with case queue and per-case detail screens. Case detail has tabs: Overview, Litigation, Enforcement, Notices. Overview shows Contact Information, Case Details, Loan Summary cards, plus Upcoming Due Dates and Case Timeline. Litigation has fields for court case number, filing date, court name, summons date, hearing date, case status, and judgement.

## Requested Changes (Diff)

### Add
- New "Investigation" tab inserted between Overview and Litigation in the navigation pills
- InvestigationTab component with the following fields: Product, Account Number, Loan ID, Legal Description, Omniflow Number, Investigator, Document Upload + Description (multi-value: can add multiple document/description pairs), Feedback Description (textarea), Feedback Document Upload
- New fields in LitigationTab: Suit By, Advocate Instructions (textarea), Advocate, Ground of Suit, Comment (textarea), Witness Name, Witness Email, Follow Up Description (textarea), Document Upload + Description (multi-value)
- Apply DM Sans (geometric sans-serif) font globally via index.css / tailwind config
- All label and data text should be rendered in plain black (#000 or near-black) without bold weight

### Modify
- CaseDetail tab list: add Investigation tab between Overview and Litigation
- OverviewTab: remove the Loan Summary card (third card in the summary row), adjusting the grid from 3 to 2 columns
- LitigationTab: add grouped new fields with logical sections (Case Parties, Legal Grounds, Witness, Follow Up, Documents)
- All font usage: swap to DM Sans geometric sans-serif
- Remove bold styling from data display text; labels remain as uppercase tracking-wide but not bold

### Remove
- Loan Summary card from OverviewTab

## Implementation Plan
1. Add DM Sans import in index.css and set as default font in tailwind config
2. Update OverviewTab: remove Loan Summary card, change summary grid to md:grid-cols-2
3. Create InvestigationTab component (src/frontend/src/components/tabs/InvestigationTab.tsx) with all specified fields including multi-value document upload sections
4. Update CaseDetail: add Investigation to the TABS array, render InvestigationTab
5. Update LitigationTab: add new grouped fields (Suit By, Advocate Instructions, Advocate, Ground of Suit, Comment, Witness Name, Witness Email, Follow Up Description, Document Upload+Description multi-value)
6. Validate build
