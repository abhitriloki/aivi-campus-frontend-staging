# AIVI Campus — Data Breach Incident Response Runbook
## Statutory Compliance: Digital Personal Data Protection Act, 2023 (Section 8(6)) & CERT-In Cyber Security Directions

---

### 1. Statutory Mandate & Purpose
Under **Section 8(6)** of India's **Digital Personal Data Protection (DPDP) Act, 2023**:
> *"In the event of a personal data breach, the Data Fiduciary shall give the Board and each affected Data Principal, intimation of such breach, in such form and manner as may be prescribed."*

Additionally, under the **Indian Computer Emergency Response Team (CERT-In)** Cyber Security Directions (2022), specified cybersecurity incidents must be reported within **6 hours** of noticing them.

This Runbook defines the mandatory, step-by-step containment, investigation, and dual-notice workflow for **AIVI Intelligence Private Limited** (`aivicampus.com`).

---

### 2. Incident Response Team (IRT) & Escalation Roster

| Role | Officer | Contact Email | Emergency Phone |
| :--- | :--- | :--- | :--- |
| **Incident Commander / DPO** | Abhishek Mishra (Founder & CEO) | `grievance@aivicampus.com` / `abhi.triloki@gmail.com` | +91-7518695511 |
| **Lead Security Architect** | Platform Engineering Lead | `security@aivicampus.com` | Internal Bridge |
| **Legal & Regulatory Counsel** | Statutory Advocate / Counsel | `legal@aiviintelligence.com` | Legal Panel |
| **Institutional Partner Liaison** | Placement Operations Lead | `hello@aivilabs.com` | Partner Helpline |

---

### 3. Breach Severity Triage Matrix

| Severity Tier | Definition & Scope | CERT-In SLA | DPBI Board SLA | User Notice SLA |
| :--- | :--- | :--- | :--- | :--- |
| **P1 — Critical** | Systemic unauthorized access/exfiltration of student databases, resume storage buckets, or Firebase Auth credentials affecting multiple institutions. | **Within 6 Hours** | **Within 72 Hours** | **Within 72 Hours** |
| **P2 — High** | Unauthorized access to a single college's tenant partition, partial student CSV leak, or unauthorized modification of placement drive records. | **Within 6 Hours** | **Within 72 Hours** | **Within 72 Hours** |
| **P3 — Medium** | Isolated credential stuffing against individual TPO/student account without systemic database breach. | Evaluate / Log | Internal Log / Advisory | Prompt User Notice |
| **P4 — Low** | Port scanning, automated crawler reconnaissance, or blocked DDoS attempt without data exposure. | Internal Log | N/A | None |

---

### 4. Step-by-Step Incident Response Lifecycle

```
[T+0: Detection] ──> [T+2h: Isolation] ──> [T+6h: CERT-In Notice] ──> [T+24h: Forensic Audit] ──> [T+72h: DPBI Board & User Notice]
```

#### Phase 1: Immediate Containment (Hour 0 to Hour 2)
1. **Activate Global AI Kill-Switch**: If an active API key or model pipeline is exploited, engage the Global Kill-Switch in `PlatformAdminConsole.tsx` or via VPS environment flag.
2. **Rotate Cloud Credentials**: Immediately invalidate Firebase Service Account keys, Google Cloud API keys, SMTP passwords, and Razorpay webhook secrets.
3. **VPS & Firewall Lockdown**:
   ```bash
   ssh aivi-vps "ufw status verbose"
   # Isolate compromised port or reload Nginx with fail-closed maintenance page if systemic
   ```
4. **Preserve Forensic Logs**: Export Firestore audit logs, Nginx access logs (`/var/log/nginx/access.log`), and Cloud Functions logs (`gcloud logging read ...`). **Do NOT reboot or overwrite disks**.

#### Phase 2: Forensic Triage & Scope Assessment (Hour 2 to Hour 24)
1. Determine exact data categories exposed:
   - Non-Sensitive (Public College names, student enrollment IDs)
   - Personal Data (Student Names, Email addresses, CGPA, Branch, Resume text)
   - High-Risk (Passwords, personal contact numbers)
2. Determine count of affected institutional tenants and Data Principals.
3. Review Firestore `audit_logs` and GCP access logs to pinpoint attacker IP, vector of ingress, and timeline.

---

### 5. Statutory Notice Templates

#### Template A: 72-Hour Data Protection Board of India (DPBI) Notice
*(Submit via DPBI Official Electronic Filing Portal / Secretary, Ministry of Electronics & IT)*

```text
FORM: STATUTORY INTIMATION OF PERSONAL DATA BREACH
Pursuant to Section 8(6) of the Digital Personal Data Protection Act, 2023

1. DATA FIDUCIARY DETAILS:
   - Entity Name: AIVI INTELLIGENCE PRIVATE LIMITED
   - Corporate Identity Number (CIN): U62099UP2026PTC249169
   - Registered Office: Kuraghat, Khaletola, Khorabar, Gorakhpur - 273010, Uttar Pradesh, India
   - Data Protection Officer: Abhishek Mishra (grievance@aivicampus.com)
   - Product Platform: AIVI Campus OS (https://aivicampus.com)

2. DETAILS OF PERSONAL DATA BREACH:
   - Date & Time of Occurrence: [YYYY-MM-DD HH:MM IST]
   - Date & Time of Discovery: [YYYY-MM-DD HH:MM IST]
   - Nature & Classification: [e.g., Unauthorized access to database partition / Misconfigured storage bucket]
   - Location of Affected Servers: Google Cloud Platform, Mumbai Region (asia-south1), India

3. CATEGORIES & VOLUME OF PERSONAL DATA COMPROMISED:
   - Categories: [e.g., Student Academic Rosters, Resume PDF documents, Email addresses]
   - Estimated Number of Affected Data Principals: [Count]
   - Number of Affected Educational Institutions: [Count]

4. POTENTIAL CONSEQUENCES & HARM ASSESSMENT:
   - Risk Assessment: [Assessment of potential harm to students / educational institutions]
   - Financial Data Exposure: NONE (Payment credentials handled exclusively by PCI-DSS compliant gateway Razorpay)
   - Biometric / Aadhaar Exposure: NONE (AIVI Campus does not collect or store biometric or Aadhaar records)

5. REMEDIAL & CONTAINMENT MEASURES IMPLEMENTED:
   - Immediate security patches applied at [Timestamp]
   - All compromised sessions and access tokens terminated
   - Credentials rotated across affected infrastructure
   - Affected Data Principals and Institutional Fiduciaries notified via direct email and in-portal alert

6. DPO CONTACT FOR INQUIRIES:
   - Name: Abhishek Mishra
   - Email: grievance@aivicampus.com / dpo@aivicampus.com
   - Phone: +91-7518695511
```

---

#### Template B: 6-Hour CERT-In Incident Reporting Notice
*(Submit to incident@cert-in.org.in or online reporting facility within 6 hours)*

```text
To: incident@cert-in.org.in
Subject: Mandatory Cybersecurity Incident Report (Direction 2022) — AIVI Intelligence Pvt Ltd

1. Organization Name: AIVI Intelligence Private Limited (CIN: U62099UP2026PTC249169)
2. Nature of Incident: [Unauthorized access to system / Data Exfiltration / Malicious Injection]
3. Affected Domain: aivicampus.com
4. Public IP / Server: Hostinger VPS Node 187.127.134.92 / Google Cloud Platform Mumbai
5. Time of Detection: [YYYY-MM-DD HH:MM IST]
6. Technical Indicators:
   - Malicious IP: [Attacker IP address]
   - Exploit Vector: [Vulnerability or compromised token]
   - Logs Snippet: [Attached sanitized log extract]
7. Immediate Action Taken: Server isolated, firewall rule updated, credentials rotated.
8. Point of Contact: Abhishek Mishra, DPO (grievance@aivicampus.com / +91-7518695511)
```

---

#### Template C: Direct Notice to Affected Students (Data Principals)
*(Deliver via Email from `security@aivicampus.com` + Display High-Priority In-Portal Banner)*

```text
Subject: Important Security Notice Regarding Your AIVI Campus Account

Dear Student,

We are writing to notify you of a security incident that may have involved your personal data on AIVI Campus, in compliance with Section 8(6) of the Digital Personal Data Protection (DPDP) Act, 2023.

WHAT HAPPENED:
On [Date] at approximately [Time IST], our security monitoring detected an unauthorized attempt to access a subset of student records. Within [X hours], our engineering team contained the incident, revoked all access tokens, and blocked the unauthorized source.

WHAT INFORMATION WAS INVOLVED:
Our forensic investigation confirmed that the affected records included:
- Full Name and Institutional Email Address
- Department Branch and Batch Year
- [If applicable: Uploaded Resume document]

WHAT INFORMATION WAS NOT INVOLVED:
- Your account password was NOT exposed (passwords are cryptographically salted and hashed using Firebase scrypt).
- No payment, banking, or financial information was exposed.
- No government identification (Aadhaar/PAN) was exposed (AIVI never collects this data).

WHAT ACTIONS WE HAVE TAKEN:
1. Revoked all existing session tokens, requiring you to re-authenticate securely.
2. Sealed and audited all cloud database and storage permissions.
3. Formally notified the Data Protection Board of India (DPBI) and CERT-In.

RECOMMENDED ACTIONS FOR YOU:
- If you use the same password on any other service, we strongly advise updating it immediately.
- Be cautious of unsolicited emails or messages asking for credentials or financial details.

YOUR RIGHTS UNDER THE DPDP ACT 2023:
You have the statutory right to request a full inventory of your data, or request permanent deletion of your stored records, via our Data Rights Portal at https://aivicampus.com/data-rights.

For any questions or support, contact our dedicated Data Protection Officer directly:
Mr. Abhishek Mishra, Data Protection Officer
Email: grievance@aivicampus.com
```

---

#### Template D: Institutional Notice to College Leadership & TPO
*(Deliver to Vice-Chancellor, Principal, and Training & Placement Officer)*

```text
Subject: URGENT: Statutory Security Briefing — AIVI Campus Placement OS

To: The Leadership & Training & Placement Cell, [College Name]

This communication serves as a formal statutory briefing pursuant to India's Digital Personal Data Protection Act, 2023 and our institutional Data Processing Addendum (DPA).

1. SUMMARY OF INCIDENT:
On [Date], AIVI detected and neutralized a security incident involving [brief technical description]. 

2. IMPACT ON YOUR INSTITUTION:
Our partition audit confirms that [Count] student records associated with [College Name] were [contained / partially accessed]. No administrative TPO tokens or placement drive offer letters were compromised.

3. MITIGATION EXECUTED:
- The vulnerability was patched and deployed under Release [Version].
- Multi-factor authentication checks have been refreshed across all coordinator accounts.
- Automated security audit trails for your college are available for review in your TPO Command Center (/campus/audit-logs).

4. REGULATORY COOPERATION:
AIVI has filed the requisite statutory intimation with the Data Protection Board of India. We are available for an immediate briefing with your institutional IT and legal committee.

Contact: grievance@aivicampus.com | +91-7518695511
```

---

### 6. Post-Incident Review & Prevention Checklist
Within 7 days of incident resolution, the IRT must complete:
- [ ] Root cause analysis documented in project CHANGELOG.md.
- [ ] Vulnerability regression test added to Vitest automated test suite.
- [ ] Penetration test conducted against affected API endpoints.
- [ ] DPO sign-off on closure report submitted to the Data Protection Board of India.
