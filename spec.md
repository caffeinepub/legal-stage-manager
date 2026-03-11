# NLS TECH - Kollect Lite Portal

## Current State
- Case details open as a full page navigation (replaces queue view)
- Status filter is a dropdown in the search/filter row
- Priority filter dropdown remains
- Sidebar has Dashboard, Cases, Reports, Settings sections
- Sticky Actions column is 120px wide
- Default tab in CaseDetail is always "overview"

## Requested Changes (Diff)

### Add
- Floating modal overlay for case details (80vh, centered, background queue visible behind it)
- Clickable status filter pills with counts immediately above the search bar
- Default tab logic based on case status (In Litigation → litigation tab, Judgment Issued → litigation, Active → overview, etc.)

### Modify
- App.tsx: selectedCaseId state instead of page navigation; modal open/close handler; queue always rendered
- CaseQueue.tsx: remove Status dropdown; add clickable status pills row above search bar; widen sticky Actions column to ~160px; open modal instead of navigating
- CaseDetail.tsx: convert to modal variant with close button (X), no back button, scrollable content inside modal
- AppLayout.tsx: sidebar nav stripped to only "Legal" section with "Legal Queue" link

### Remove
- Dashboard, Cases, Reports, Settings sidebar sections
- Status dropdown from the filter row
- Full-page navigation pattern for case details

## Implementation Plan
1. Update App.tsx to hold selectedCaseId; render CaseDetail as overlay modal on top of CaseQueue
2. Update CaseQueue.tsx: remove Status Select, add status pills row above search, widen Actions column
3. Update CaseDetail.tsx: accept onClose prop, render as large modal (80vh, fixed centered overlay), default tab derived from case status
4. Update AppLayout.tsx: sidebar shows only Legal > Legal Queue
