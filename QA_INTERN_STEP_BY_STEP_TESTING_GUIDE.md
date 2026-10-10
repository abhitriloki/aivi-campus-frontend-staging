# 🎓 ROOKIE QA INTERN STEP-BY-STEP TESTING GUIDE (NO CODING REQUIRED)
**Platform Under Test:** `https://staging.aivicampus.com`  
**Audience:** QA Interns & Manual Testers (No prior coding or command-line experience required)  
**Goal:** Execute the 3-Day Break-Testing Master Runbook using free visual tools and browser controls.

---

## 🛠️ THE ONLY 2 TOOLS YOU NEED (FREE & EASY)

You do **NOT** need to edit code, touch GitHub, or run terminal commands. You only need:

### Tool 1: Google Chrome (Already on your laptop)
Used for 85% of testing:
* **F12 / Right-Click $\rightarrow$ Inspect:** Opens Chrome DevTools.
* **Network Tab:** Shows every API call, status code (`200 OK`, `401 Unauthorized`, `500 Server Error`), and response.
* **Console Tab:** Shows red frontend JavaScript crashes or warnings.
* **Device Toggle (`Ctrl + Shift + M`):** Tests mobile/tablet responsive views.

### Tool 2: Postman (Free Visual API Tool) or Hoppscotch (Zero-Install Web App)
Used for the 15% API testing:
* **Option A (Desktop App):** Download free [Postman](https://www.postman.com/downloads/).
* **Option B (Zero Install in Browser):** Open [Hoppscotch.io](https://hoppscotch.io) in a browser tab.
* *Why we use it:* It lets you paste a web address, paste an input, click a big blue "Send" button, and see the result without writing any code.

---

## 🔑 HOW TO GET YOUR "AUTH TOKEN" IN 3 CLICKS (WITHOUT CODING)

For tests that check API security in Postman/Hoppscotch, you need an **Authorization Token** (this tells the server who you are). Here is how to grab it in 10 seconds:

1. Open `https://staging.aivicampus.com/campus/login` in Google Chrome and log in.
2. Press **F12** on your keyboard (or right-click anywhere and choose **Inspect**).
3. Click the **Network** tab at the top of the DevTools window.
4. Click any button on the page (for example, click "Students" or "Drives").
5. In the Network list, click on any request (e.g., `getCampusStudents` or `getMyTenantContext`).
6. In the right-hand panel, look under **Request Headers** for `Authorization: Bearer eyJ...`.
7. **Copy that entire long string** starting from `eyJ...` (that is your token).

```
[Chrome DevTools]
  └── Network Tab
        └── Click on "getCampusStudents"
              └── Headers Tab
                    └── Request Headers
                          └── authorization: Bearer eyJhbGciOiJSUzI1Ni... (COPY THIS!)
```

---

## 📅 DAY 1: STEP-BY-STEP BREAK-TESTING GUIDE

### 👤 QA Tester 1 (Functional & User Journey Flow)

#### Task 1: Testing Login, Logout & Session Security
1. Go to `https://staging.aivicampus.com/campus/login`.
2. Try logging in with:
   - A malformed email: `teststudent@` (Verify UI shows "Please enter a valid email").
   - Uppercase email: `STUDENT@SUNRISE.EDU` vs lowercase `student@sunrise.edu` (Verify both work or give clear feedback).
   - Password less than 6 characters (Verify UI prevents submission).
3. Log in successfully. Open a new tab in the same browser, go to `https://staging.aivicampus.com/campus`. Verify you are automatically logged in.
4. Click your profile avatar $\rightarrow$ Click **"Log out"**.
5. Click the browser's **Back button** (`←`).
   * **Pass:** You stay logged out and are redirected back to login.
   * **FAIL (Bug):** The app lets you see private student data after logging out!

#### Task 2: Testing Role Escalation (Can a Student Sneak into Admin Pages?)
1. Log in with your **Student** test account.
2. In the browser address bar, manually type this URL and press Enter:
   `https://staging.aivicampus.com/campus/platform-admin`
3. *Expected Result:* You must be blocked! You should see a "Permission Denied" screen or be redirected to login.
4. Now type:
   `https://staging.aivicampus.com/campus/students`
5. *Expected Result:* Blocked or redirected. A student must **never** see the list of all students in the college.
6. If you can see the admin page as a student $\rightarrow$ **Mark as P0 Blocker Bug immediately in the tracker!**

#### Task 3: Dirty CSV Upload Test (The "Messy College Data" Test)
1. Log in as a TPO (`tpo@sunrise.edu`).
2. Go to **Students** $\rightarrow$ **Import Students** (`/campus/students/import`).
3. Open Excel or Notepad on your computer and create a file called `broken_students.csv` with these exact contents:
   ```csv
   Roll Number,Full Name,Email,Branch,CGPA,Graduation Year
   101,Aman Sharma,aman@college.edu,CSE,8.5,2026
   101,Rahul Verma,rahul@college.edu,CSE,7.2,2026
   103,Priya Singh,priya-no-at-sign,ECE,9.1,2026
   104,Sneha Patel,sneha@college.edu,UNKNOWN_BRANCH,15.5,1995
   ```
   *(Notice: duplicate roll `101`, invalid email for Priya, impossible CGPA `15.5`, and ancient year `1995`)*.
4. Drag and drop this CSV into the import wizard.
5. Click **"Upload & Validate"**.
   * **Pass:** The app highlights Row 2 (Duplicate Roll), Row 3 (Invalid Email), and Row 4 (Invalid CGPA) in red with clear error messages.
   * **FAIL:** The website crashes with a blank white screen, or imports `15.5` CGPA without complaining.

---

### 👤 QA Tester 2 (Inputs, Tampering & Security Attacks)

#### Task 1: 50,000-Character Overflow Attack (No Coding)
1. Open any text box on the site (for example, **Create Drive** $\rightarrow$ Job Description box, or **Contact Us** form message box).
2. Generate 50,000 characters for free at [lipsum.com](https://www.lipsum.com/) or copy-paste the word `BREAKTEST` 5,000 times.
3. Paste the entire giant text into the box and click **Submit**.
   * **Pass:** The UI tells you: *"Text exceeds character limit (e.g., max 5,000 chars)"* or gracefully truncates it.
   * **FAIL:** The browser freezes permanently, or the server throws an uncaught `500 Server Error`.

#### Task 2: Copy-Paste XSS Attack (Cross-Site Scripting)
1. Go to your Student Profile or create a new Drive.
2. In the **Student Name**, **Project Title**, or **Drive Company Name** fields, copy and paste this exact string:
   ```html
   <script>alert('AIVI_HACKED')</script><b>TestBold</b>
   ```
3. Save the profile or drive.
4. Refresh the page and look at where your name appears.
   * **Pass:** You see the literal text `<script>alert('AIVI_HACKED')</script><b>TestBold</b>` displayed on screen.
   * **FAIL (CRITICAL BUG):** A popup alert box appears saying `AIVI_HACKED` or the text becomes bold! This means malicious hackers could steal student cookies.

#### Task 3: Negative Salary / Decimal Price Attack
1. Log in as TPO and go to **Placement Drives** $\rightarrow$ View a completed drive.
2. When marking a student as "Placed", enter:
   - CTC/Package: `-15` (Negative 15 Lakhs)
   - CTC/Package: `0.000001`
   - CTC/Package: `99999999`
3. Click Save.
   * **Pass:** Form displays red error: *"Package must be a positive number between 1 and 200 LPA"*.
   * **FAIL:** Database saves `-15 LPA` and shows negative placement packages on the TPO dashboard.

---

## 📅 DAY 2: STEP-BY-STEP BREAK-TESTING GUIDE

### 👤 QA Tester 1 (Billing & Cross-Tenant Snooping)

#### Task 1: The "Cross-College Snooping" Attack (IDOR)
*Goal: Prove that College A cannot look at College B's private student data.*

1. Log in as TPO of **Sunrise College** (`tenantId = sunrise`).
2. Open Postman or Hoppscotch.
3. Set Method to **POST**.
4. Set URL to:
   `https://us-central1-aivi-campus-stg.cloudfunctions.net/getCampusStudents`
5. In the **Headers** tab, add:
   - `Content-Type`: `application/json`
   - `Authorization`: `Bearer YOUR_TOKEN_FROM_SUNRISE_TPO`
6. In the **Body** tab (select raw JSON), enter:
   ```json
   {
     "data": {
       "tenantId": "apex_university"
     }
   }
   ```
7. Click the blue **Send** button.
   * **Pass:** Response shows Status `403 Forbidden` with message: *"Unauthorized cross-tenant access"*.
   * **FAIL (P0 CRITICAL DATA LEAK):** Response returns students of Apex University!

#### Task 2: Razorpay ₹1 Plan Tampering Test
1. In Postman, set Method to **POST**.
2. Set URL to:
   `https://us-central1-aivi-campus-stg.cloudfunctions.net/createPaymentOrder`
3. In Headers, paste your Auth Token.
4. In Body, enter:
   ```json
   {
     "data": {
       "planType": "pro",
       "amount": 100
     }
   }
   ```
   *(We are trying to buy the ₹59,900 Pro Plan for 100 paise = ₹1!)*
5. Click **Send**.
   * **Pass:** The server returns `amount: 5990000` (₹59,900 in paise). The server safely ignored our fake ₹1 input!
   * **FAIL:** Server creates Razorpay order for ₹1.

---

### 👤 QA Tester 2 (Concurrency, File Uploads & Network Outages)

#### Task 1: Rapid 10-Tab Double-Click Concurrency Test (No Code Needed!)
*Goal: Try to apply a coupon or claim credits multiple times simultaneously.*

1. Open 10 different tabs in Google Chrome to the checkout/coupon page.
2. In all 10 tabs, type the same coupon code into the box.
3. Arrange tabs side-by-side (or use both hands).
4. Click **"Apply"** rapidly across all 10 tabs within 2 seconds.
   * **Pass:** Exactly **1 tab** says "Coupon Applied Successfully". The other 9 tabs say "Coupon already redeemed" or "Rate limit exceeded".
   * **FAIL:** Multiple tabs succeed and give 50% discount stacked on top of 50%!

#### Task 2: Dangerous File Upload Attacks
1. Go to **Student Workspace** $\rightarrow$ **Resume Vault** (`/campus/student-vault`).
2. **Test A (Fake PDF):** Take any `.exe` or `.txt` file, rename it to `my_resume.pdf`. Upload it.
   * *Pass:* System detects invalid PDF structure and rejects it.
3. **Test B (Zero-Byte File):** On Windows, right-click $\rightarrow$ New $\rightarrow$ Text Document $\rightarrow$ don't type anything $\rightarrow$ rename to `empty.pdf` (0 bytes). Upload it.
   * *Pass:* System shows error: *"File is empty"*.
4. **Test C (Oversized File):** Find any video or zip file larger than 15 MB, rename to `giant_resume.pdf`. Upload it.
   * *Pass:* UI immediately rejects file saying *"Maximum file size is 10MB"*.

#### Task 3: Simulated Offline / Airplane Mode Voice Interview Test
1. Go to `/campus/interviews` and start an AI Mock Interview.
2. Answer Question 1.
3. When the AI is loading Question 2, **turn off your laptop Wi-Fi** (or enable Airplane Mode).
4. Try speaking your answer into the microphone.
5. Re-enable Wi-Fi after 15 seconds.
   * **Pass:** The app shows *"Connection lost. Reconnecting..."* and lets you retry your answer without losing your entire interview session.
   * **FAIL:** The screen goes completely blank white, and all previous answers are erased.

---

## 📅 DAY 3: 15-MINUTE SMOKE SWEEP & LOGGING DEFECTS

On Day 3, both QA interns walk through this final checklist on `https://staging.aivicampus.com` before the founder signs off for production launch:

```
[15-Minute Daily Smoke Checklist]
 [ ] 1. Open staging.aivicampus.com -> Check Government Badges (DIPP271794, Start in UP, MSME).
 [ ] 2. Check Grievance Officer in Footer -> Must show Mr. Mithlesh Mishra.
 [ ] 3. Open /campus/login -> Must NOT have demo buttons.
 [ ] 4. Open /campus/login/sunrise -> Demo buttons MUST be visible.
 [ ] 5. Student logs in -> Uploads resume -> ATS score completes -> Takes 1 mock interview turn.
 [ ] 6. TPO logs in -> Views student count -> Verifies student resume with QR code.
 [ ] 7. Scan QR code on phone -> Verified public badge loads with student credentials.
 [ ] 8. SuperAdmin logs into /campus/platform-admin -> No 404 error.
```

---

## 📝 HOW TO LOG BUGS IN THE TRACKER (SECTION 5 OF MASTER RUNBOOK)

Whenever you find an issue, do **NOT** just send a WhatsApp message. Open [`QA_3_DAY_BREAK_TESTING_MASTER_RUNBOOK.md`](file:///c:/Users/abhis/OneDrive/Documents/GitHub/aivi-campus-os/QA_3_DAY_BREAK_TESTING_MASTER_RUNBOOK.md) and add a row in Section 5:

### Example of a Perfect Bug Report:
* **Bug ID:** `BUG-011`
* **Discovered By:** QA Intern (Your Name)
* **Module / Route:** `/campus/student-vault`
* **Severity:** `P1 - High Priority`
* **Short Title:** Zero-byte PDF upload causes infinite spinning spinner
* **Steps to Reproduce:**
  1. Login as student at `/campus/login/sunrise`.
  2. Navigate to Student Vault.
  3. Upload an empty 0-byte file named `empty.pdf`.
  4. Notice the upload spinner spins forever and no error message is shown.
* **Console Error:** Right-click page $\rightarrow$ Inspect $\rightarrow$ Console tab $\rightarrow$ Copy red text: `FirebaseError: storage/invalid-argument`.
* **Fix Status:** `Open`
