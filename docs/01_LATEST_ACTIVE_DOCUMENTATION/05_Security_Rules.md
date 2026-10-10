# AIVI System Documentation — Firestore Security Rules
> **Version**: 2.5.0 | **Updated**: October 1, 2026 | **File**: `firestore.rules`

## 1. Security Architecture Principles

1. **Strict Authentication**: All private data reads and writes require a valid Firebase Auth session (`request.auth != null`).
2. **User Ownership**: Users may only read and write their own documents (`request.auth.uid == userId`).
3. **Role-Based Access Control (RBAC)**: Institutional staff and administrators are validated via `user_roles/{uid}` lookups:
   ```javascript
   function isStaff() {
     return request.auth != null && 
       exists(/databases/$(database)/documents/user_roles/$(request.auth.uid)) &&
       get(/databases/$(database)/documents/user_roles/$(request.auth.uid)).data.role in ['admin', 'staff', 'tpo'];
   }
   ```
4. **Tenant Isolation**: Cross-tenant data inspection is strictly prohibited. Queries against `profiles`, `drives`, and `vault` must match the authenticated tenant.
5. **Decoupled Student Writes**: Staff members may update student status fields (`placementStatus`, `placedCompany`, `placedPackageLpa`, `resumeVerified`) directly in Firestore without triggering `PERMISSION_DENIED`.
