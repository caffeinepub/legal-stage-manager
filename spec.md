# NLS TECH - Kollect Lite Portal

## Current State
The Reports section has three tabs: Legal Progress, Compliance, and Recovery Performance. The Legal Progress tab currently shows KPI cards, a bar chart of cases by stage, and a summary table.

## Requested Changes (Diff)

### Add
- Priority highlighting: cases with claim amount above KES 500,000 get a visual highlight (e.g. a colored left border or badge) in the Legal Progress table
- "Latest Update" column showing the most recent case update note per case
- "Next Legal Action" column showing the immediate next procedural step
- A dedicated "Priority" section or visual grouping that surfaces high-value cases prominently

### Modify
- Redesign the Legal Progress tab with a clean, aesthetic layout:
  - Top: 4 KPI summary cards (Total in Legal, In Litigation, Judgments Issued, Priority Cases)
  - Middle: A compact accounts table grouped or sorted by legal stage, with columns: Legal ID, Customer Name, Legal Stage, Litigation Status, Judgment Issued (Yes/No), Claim Amount, Latest Update (comment), Next Legal Action, Priority flag
  - Priority cases (claim amount > KES 500,000) visually distinguished with a left accent border or subtle background tint
  - Clean monochrome aesthetic matching the rest of the app; no colored pills

### Remove
- The existing bar chart in Legal Progress (replaced by the redesigned layout)

## Implementation Plan
1. Update the LegalProgressTab component inside the Reports page
2. Add helper to derive: latest case update note, next legal action, and priority flag (claim > 500,000) from seed data
3. Render KPI cards: Total in Legal, In Litigation, Judgments Issued, Priority Cases
4. Render accounts table with all required columns, sorted by legal stage, priority cases visually highlighted
5. Remove old bar chart from Legal Progress tab only
