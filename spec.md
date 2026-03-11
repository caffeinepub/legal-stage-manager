# NLS TECH - Kollect Lite Portal

## Current State
- Legal Queue has filter tabs (All / Active / Notice / Litigation / Enforcement / Closed) above the table
- OverviewTab shows fields in stacked card blocks, not compact inline rows
- InvestigationTab fields laid out in a 2-column grid
- LitigationTab has faint dashed separators between sub-groups inside Suit Details

## Requested Changes (Diff)

### Add
- KPI cards row at top of Legal Queue: Calls Due (1201, Target: 60), PTPs Today (1, Target: 40), Broken Promises (0, Target: 20), Recovered (Ksh 0, Target: 10,000) — static decorative values, no dataset connection. Each card: icon + label + value on one line, thin blue progress bar, target label below.
- Dark brown active-tab indicator bar below KPI cards showing "Legal Queue" with an orange × (matching uploaded reference image style)

### Modify
- **CaseQueue.tsx**: Remove the filter pills/tabs row. Replace with KPI cards + Legal Queue active-tab bar described above. Keep search row, table, and all other functionality intact.
- **OverviewTab.tsx**: Change field layout from stacked card blocks to compact horizontally-inline rows matching the investigation style. Fields should appear as label + value pairs laid out in tight 3-column rows.
- **InvestigationTab.tsx**: Rearrange fields into specific rows:
  - Row 1 (3 inline): Product, Account Number, Loan ID
  - Row 2 (3 inline): Legal ID, Legal Description, Omniflow Number
  - Row 3 (3 inline): Investigator, Feedback Description, Feedback Upload
  - Below: Document upload and description section (unchanged multi-value)
- **LitigationTab.tsx**: 
  - Display all field groups with 3 fields horizontally inline per row
  - Remove the faint dashed dividing lines (Separators) inside the Suit Details section

### Remove
- Filter pills (All / Active / Notice / Litigation / Enforcement / Closed) from CaseQueue
- Dashed separators between sub-groups in LitigationTab Suit Details section

## Implementation Plan
1. Update CaseQueue.tsx: remove filter tabs, add KPI cards row + Legal Queue active-tab bar
2. Update OverviewTab.tsx: compact 3-column inline rows for all field display
3. Update InvestigationTab.tsx: rearrange into specified 3-column row groups
4. Update LitigationTab.tsx: 3-inline field layout, remove Suit Details sub-separators
