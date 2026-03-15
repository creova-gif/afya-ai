MOBILE-ONLY PLATFORM ENFORCEMENT

Your system should behave like apps such as:

WhatsApp

Uber

Google Maps

Meaning:

Designed for touch

Built for small screens

Optimized for mobile connectivity

Distributed through app stores

1️⃣ MOBILE-FIRST UI/UX REQUIREMENTS

All screens must follow these constraints.

Screen Size

Design only for:

320px – 480px (small phones)
360px – 640px (standard Android)
390px – 844px (modern phones)

Avoid desktop patterns like:

❌ Multi-column dashboards
❌ Hover interactions
❌ Large tables
❌ Keyboard shortcuts

Use mobile patterns:

✔ Bottom navigation
✔ Swipe gestures
✔ Card layouts
✔ Large tap targets

Navigation Structure

Mobile standard:

Bottom Tab Bar

Home
Care
Assistant
Messages
Profile

Rules:

Maximum 5 tabs

Minimum 48px tap targets

One primary action per screen

Interaction Design

Mobile users often have:

one hand

poor internet

older devices

Therefore:

✔ Loading skeletons
✔ Offline support
✔ One-tap actions
✔ Large readable text

2️⃣ MOBILE-ONLY TECHNICAL ARCHITECTURE

You must restrict the platform to mobile clients only.

Recommended stacks:

Option A (Best for cross-platform)

React Native

or

Option B

Flutter

These produce:

Android app

iOS app

From one codebase.

Backend Access Restriction

Your API should only allow requests from:

Mobile app clients

Example security rules:

Reject requests without mobile app token
Reject browser user-agents
Require signed mobile build certificate
3️⃣ APP STORE DISTRIBUTION

Your deployment should target:

Android:

Google Play Store

iOS:

Apple App Store

No web deployment.

No desktop portal.

Hospitals would access the system via mobile tablets or phones.

4️⃣ MOBILE PERFORMANCE REQUIREMENTS

To work in Tanzania:

Optimize for:

2G / 3G networks

low-end Android devices

intermittent connectivity

Targets:

App launch < 2 seconds
Screen load < 500ms
Offline mode functional
App size < 50MB
5️⃣ MOBILE SECURITY

Required protections:

biometric login

encrypted local storage

device binding

session expiration

secure offline data

🧪 MOBILE-ONLY BRUTE AUDIT PROMPT

Use this to verify the system remains mobile-focused.

Perform a mobile-only platform audit.

Confirm:

1. No desktop-only UI components exist.
2. No hover interactions exist.
3. All interactions are touch-friendly.
4. No screen requires keyboard input beyond mobile typing.
5. All layouts render correctly on:
   - 320px width
   - 360px width
   - 390px width
6. Bottom navigation remains usable on all screens.
7. No tables require horizontal scrolling.
8. No modal exceeds screen height.
9. No workflow requires more than 5 taps.
10. All actions are reachable with one thumb.

Simulate devices:

- Android low-end (1GB RAM)
- Android mid-range
- iPhone standard size

Test:

- offline mode
- poor network
- device rotation
- background app resume
- push notification navigation

If any screen breaks on mobile dimensions → FAIL.
⚠️ IMPORTANT STRATEGIC NOTE

For hospitals, mobile-only works if they use:

tablets

clinic phones

nurse devices

But some facilities prefer desktop EMR systems.

Many global healthcare platforms like:

Epic Systems

Cerner

use desktop for clinicians + mobile for patients.

So your strategy might be:

Mobile-first platform
with optional hospital dashboard later.