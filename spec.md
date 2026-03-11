# Legal Stage Manager

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Case queue landing page (table view) with pre-populated sample data and a manual "Add Case" button
- Case detail screen with navigation pills: Overview, Litigation, Enforcement, Notices
- Overview tab: Customer Summary (Contact Info, Case Details, Loan Summary), Upcoming Due Dates, Case Updates
- Litigation tab: Court Case Number, Filing Date, Court Name/Jurisdiction, Court Summons Date, Hearing Date, Case Status dropdown (Filed, Awaiting Hearing, In Trial, Judgment Issued), Judgement dropdown (Wage Garnishment, Property Lien, Writ of Seizure & Sale, Asset Repossession, Auction)
- Enforcement tab: Enforcement Type, Initiation Date, Status, Amount Recovered, Responsible Legal Party
- Notices tab (read-only): Notice ID, Notice Type (1st Demand Notice, Final Demand Notice, Statutory Notice), Notice Sent Date, Notice Expiry Date, Delivery Method (Email/Courier/Physical), Delivery Status, Notice Status (Active/Expired/Complied)
- Single-user app, no authentication required

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Define Motoko data types: Case, LitigationRecord, EnforcementRecord, NoticeRecord
2. Backend functions: getCases, getCase, addCase, updateCase, updateLitigation, updateEnforcement; notices are read-only seeded data
3. Pre-populate backend with ~5 sample cases including all related sub-records
4. Frontend: Case Queue page (table with all required columns, Add Case modal/dialog)
5. Frontend: Case Detail page with tab navigation (Overview, Litigation, Enforcement, Notices)
6. Each tab renders its respective fields; Litigation and Enforcement are editable; Notices is read-only
