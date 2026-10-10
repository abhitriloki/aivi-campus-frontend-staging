# API Documentation — AIVI Career Intelligence Platform
> **Version**: 2.5.0 | **Updated**: October 1, 2026 | **Protocol**: Firebase Cloud Functions v2 (HTTPS Callable)

All backend communication uses the Firebase Web SDK (`httpsCallable(functions, endpointName)`). 

## Primary API Endpoints

### 1. `careerAnalysis`
- **Request Payload**:
  ```json
  {
    "analysisType": "resume | job_fit | roadmap | interview | promotion | portfolio",
    "resumeText": "string",
    "jobDescription": "string (required for job_fit)",
    "skills": ["string"] (required for roadmap),
    "userRole": "string (optional)",
    "targetRole": "string (optional)"
  }
  ```
- **Response**: Strict JSON containing `overall_score` (0-100), `sub_scores`, `weak_bullets`, `top_skills`, `action_plan`.

### 2. `extractPdf`
- **Request Payload**:
  ```json
  {
    "pdfBase64": "JVBERi0xLjQK..."
  }
  ```
- **Response**:
  ```json
  {
    "text": "Clean parsed UTF-8 resume text",
    "pageCount": 2
  }
  ```

### 3. `linkedinAnalyze`
- **Rate Limit**: 3 requests / 60 seconds per UID.
- **Request Payload**:
  ```json
  {
    "profileText": "string"
  }
  ```
- **Response**: Recruiter Appeal Score (0-100), headline feedback, section breakdowns.

### 4. `applyCoupon`
- **Request Payload**:
  ```json
  {
    "code": "FIRST1000"
  }
  ```
- **Response**: `{ "success": true, "plan": "starter", "expiresAt": "ISO date" }`.
