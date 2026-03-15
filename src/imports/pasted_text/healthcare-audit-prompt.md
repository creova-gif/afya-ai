FRONTEND DATA RELEVANCE + FULL INTEGRATION AUDIT PROMPT

(No unnecessary data • No disconnected UI • No fake integrations)

Writing

You are performing a production-level audit of a healthcare mobile application.

The goal is to verify two things:

Every piece of information shown on the frontend is necessary for the user's role and workflow.

Every piece of information displayed is fully integrated with backend systems and real data sources.

The application must contain:

No unnecessary UI information

No mock or placeholder data

No hardcoded statistics

No unconnected dashboards

No fake integrations

No duplicate data display

No redundant metrics

If any exist → the system FAILS the audit.

PHASE 1 — FRONTEND DATA INVENTORY

Scan every screen in the mobile application.

Extract all displayed information elements:

Labels

Numbers

Charts

Lists

Cards

Status indicators

Notifications

Alerts

Tables

Badges

Counters

Create a Data Display Registry:

Screen Name
UI Component
Displayed Data Field
Source (API / Local / Computed)
User Role
Purpose

If any UI component displays data without a clear purpose → FLAG.

PHASE 2 — DATA NECESSITY VALIDATION

For each data element ask:

Is this information required for the user to complete their task?

Evaluate based on role:

Patient:

health summary

appointment info

medication reminders

lab results

AI triage results

Nurse:

queue

vitals

patient status

triage alerts

Doctor:

patient history

vitals

lab results

prescriptions

clinical notes

Pharmacist:

prescriptions

inventory levels

dispense status

Admin:

facility analytics

user management

audit logs

If a piece of data:

does not support a workflow

duplicates another metric

exists only for visual decoration

creates cognitive overload

→ mark as unnecessary UI.

PHASE 3 — BACKEND INTEGRATION VERIFICATION

For every displayed data field:

Trace the data source.

Verify:

Frontend component
↓
API request
↓
Backend service
↓
Database query
↓
Response returned
↓
UI state updated

If any data:

is hardcoded

uses mock JSON

uses fake counters

pulls from non-production endpoint

shows static values

→ FAIL.

PHASE 4 — API CONNECTION AUDIT

Check that each frontend feature calls a real API.

For each feature confirm:

API endpoint exists

endpoint authenticated

endpoint returns real data

errors handled

loading states handled

Monitor network calls for:

GET
POST
PUT
DELETE

If UI actions do not trigger backend calls → FAIL.

PHASE 5 — DASHBOARD METRIC VALIDATION

Inspect all dashboards.

Verify that metrics such as:

patient count

encounters today

lab orders

prescriptions

queue size

alerts

are computed from database queries.

Reject dashboards that display:

fake counters

placeholder analytics

static sample data

demo graphs

PHASE 6 — DATA SYNCHRONIZATION TEST

Perform a backend data update.

Examples:

Create patient
Add vitals
Create prescription
Upload lab result

Verify:

UI refresh reflects change

correct values displayed

no stale cache data

no duplicate records

PHASE 7 — REDUNDANCY DETECTION

Detect duplicate information.

Example failures:

Patient age shown 4 times
Vitals repeated across screens
Same metric shown in multiple cards
Repeated notifications

Reduce UI clutter.

PHASE 8 — PERFORMANCE VALIDATION

Verify frontend only loads necessary data.

Check for:

unnecessary API calls

oversized payloads

redundant queries

large unused fields

Ensure API responses contain only required fields.

PHASE 9 — SECURITY + PRIVACY CHECK

Confirm sensitive data is not unnecessarily exposed.

Examples to restrict:

National ID
Phone numbers
Full patient history
Internal audit logs

Display only what is required for role permissions.

FINAL DEPLOYMENT CONDITIONS

The system can pass audit only if:

100% of frontend data has a real backend source
100% of displayed data supports a user workflow
0 hardcoded values
0 mock API responses
0 demo dashboards
0 redundant metrics
0 unnecessary UI clutter
0 orphan UI components

If any violation exists → the application is NOT ready for production deployment.

🧠 What This Audit Protects You From

It prevents common pre-launch disasters like:

Fake metrics in dashboards

Demo data still showing in production

UI showing fields the backend doesn’t support

Backend returning data that UI never uses

Cluttered interfaces slowing clinicians down

This is critical for healthcare systems where incorrect or unnecessary data can cause clinical mistakes.