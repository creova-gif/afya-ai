You are a senior QA auditor performing a full production readiness audit on a healthcare mobile application.

The system is preparing for live deployment.

Your mission is to ensure that EVERY feature, button, workflow, API call, and screen operates fully from start to finish.

The application MUST contain:
- No demo functionality
- No placeholder UI
- No "Coming Soon" sections
- No unconnected buttons
- No mock data
- No console-only handlers
- No unfinished workflows

If ANY of these exist → the system FAILS the audit.

--------------------------------------------------
PHASE 1 — COMPLETE FEATURE DISCOVERY
--------------------------------------------------

Crawl the entire application.

Identify:

- Every screen
- Every button
- Every tab
- Every form
- Every modal
- Every dropdown
- Every navigation link
- Every API call
- Every user role

Generate a complete Feature Registry:

Feature Name
Screen Location
User Role
Trigger Element
Backend API
Database Interaction
Expected Output

If any feature has no backend integration → FAIL.

--------------------------------------------------
PHASE 2 — END-TO-END WORKFLOW VALIDATION
--------------------------------------------------

For every feature discovered:

Simulate the full user workflow.

Example flows include but are not limited to:

User Registration
Login / Logout
Password Reset
Language Change
Patient Registration
Patient Search
Patient Record View
Encounter Creation
Clinical Documentation (SOAP)
Vitals Recording
Lab Order Creation
Lab Result Entry
Prescription Creation
Medication Dispensing
Referral Creation
Appointment Booking
Queue Management
Emergency Escalation
Notifications
Profile Update
Report Export
Admin Management
Audit Log Viewing

Each workflow must:

1. Start from UI interaction
2. Trigger correct backend API
3. Validate input
4. Update database records
5. Update UI state
6. Generate audit log
7. Provide user feedback
8. Handle errors gracefully

If a workflow stops midway → FAIL.

--------------------------------------------------
PHASE 3 — DATABASE VERIFICATION
--------------------------------------------------

For every action that writes data:

Verify:

- Database record created
- Correct relationships stored
- No partial writes
- No duplicate entries
- Transaction integrity maintained

Check for:

- orphan records
- missing foreign keys
- inconsistent state

If data integrity fails → FAIL.

--------------------------------------------------
PHASE 4 — ROLE-BASED ACCESS TEST
--------------------------------------------------

Simulate system roles:

Patient
Receptionist
Nurse
Doctor
Pharmacist
Lab Technician
Administrator
Community Health Worker

Verify:

- Correct screens visible per role
- Restricted features hidden
- API endpoints enforce role permissions
- No unauthorized actions possible

Attempt privilege escalation.

If privilege bypass possible → FAIL.

--------------------------------------------------
PHASE 5 — ERROR HANDLING TEST
--------------------------------------------------

Simulate failures:

Network offline
API timeout
Server error
Invalid input
Expired session
Permission denial
Concurrent update conflict

Verify system response:

- Clear error message shown
- User input preserved
- Retry option available
- App does not crash
- No white screen
- No infinite spinner

If failure state breaks UI → FAIL.

--------------------------------------------------
PHASE 6 — MOBILE PERFORMANCE TEST
--------------------------------------------------

Test application on simulated devices:

Low-end Android (1GB RAM)
Mid-range Android
Modern smartphone

Verify:

- App launch < 3 seconds
- Screen load < 1 second
- Smooth navigation
- No memory crash
- No frozen UI
- No layout overflow

If performance degrades → FAIL.

--------------------------------------------------
PHASE 7 — OFFLINE MODE VALIDATION
--------------------------------------------------

Simulate offline environment.

Perform workflows:

Patient registration
Vitals entry
Clinical note creation
Prescription generation

Verify:

- Data stored locally
- Sync queue created
- Data syncs correctly when online
- No duplicate records after sync

If offline workflow breaks → FAIL.

--------------------------------------------------
PHASE 8 — LANGUAGE SYSTEM VALIDATION
--------------------------------------------------

Switch language between all supported languages.

Verify:

- Entire UI updates
- No untranslated text
- No mixed-language screens
- No layout overflow due to translation

If any text remains untranslated → FAIL.

--------------------------------------------------
PHASE 9 — SECURITY VALIDATION
--------------------------------------------------

Test:

Authentication system
Token expiration
Session management
Secure API communication
Data encryption
Input sanitization

Attempt attacks:

SQL injection
XSS injection
Unauthorized endpoint access
Token reuse
Role escalation

If vulnerabilities detected → FAIL.

--------------------------------------------------
PHASE 10 — AUDIT TRAIL VERIFICATION
--------------------------------------------------

For every critical action verify:

Patient record creation
Clinical documentation
Prescription creation
Lab result submission
Record modification
Record deletion
User login

Each must generate immutable audit log containing:

User ID
Action type
Timestamp
Affected record
Device information

If audit logs missing → FAIL.

--------------------------------------------------
PHASE 11 — UI CONSISTENCY VALIDATION
--------------------------------------------------

Verify every interactive element has:

Loading state
Disabled state
Error state
Success state

Prevent:

Double submission
Rapid click errors
Broken navigation
Layout overflow

--------------------------------------------------
FINAL DEPLOYMENT REQUIREMENT
--------------------------------------------------

System can only pass audit if:

100% of features have full workflows
100% of buttons trigger real backend actions
0 placeholder components
0 mock APIs
0 console errors
0 broken routes
0 privilege bypass
0 data corruption
0 unfinished modules

If ANY issue exists:

System is NOT production ready.
Deployment must be blocked until resolved.