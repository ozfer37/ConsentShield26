# ConsentShield Security Module

## Role 4: Security + Evidence

**Complete security infrastructure for consent verification with cryptographic proof and certificate generation.**

---

## 🎯 Features

- ✅ **SHA-256 Hash Generation** - Cryptographic proof of consent
- ✅ **Trust Score Calculation** - Rule-based scoring system
- ✅ **Status Determination** - VERIFIED/BLOCKED/SUSPICIOUS
- ✅ **Certificate Generation** - Beautiful HTML certificates
- ✅ **Hash Verification** - Tamper detection
- ✅ **Timestamp Integration** - ISO 8601 timestamps
- ✅ **Session Management** - Unique session IDs

---

## 📁 Module Structure

```
security/
├── config.js                    # Security configuration and thresholds
├── security.js                  # Core security module
├── certificate-generator.js     # Certificate creation
├── demo.js                      # Demo script
├── utils/
│   └── hash-utils.js           # Hash utilities
└── templates/
    └── certificate-template.html # HTML certificate template
```

---

## 🚀 Quick Start

### Install Dependencies

```bash
cd c:\gik.anix\ros.zhan\project\consentshield\security
npm init -y
```

### Run Demo

```bash
node demo.js
```

This will:
- Generate hashes for sample sessions
- Create certificates for all scenarios (VERIFIED/BLOCKED/SUSPICIOUS)
- Demonstrate hash verification
- Save HTML certificates to `./certificates/`

---

## 📖 API Reference

### Core Security Module (`security.js`)

#### `createProofOfConsent(sessionData)`

Creates cryptographic proof of consent with hash and metadata.

**Input:**
```javascript
{
  session_id: string,
  phrase: string,
  timestamp: string (ISO 8601),
  trust_score: number (0-100),
  blink_count: number,
  emotion_score: string,
  duration: number (seconds),
  face_detected: boolean
}
```

**Output:**
```javascript
{
  hash: string,
  session_id: string,
  timestamp: string,
  trust_score: number,
  status: 'VERIFIED' | 'BLOCKED' | 'SUSPICIOUS',
  status_message: string,
  metadata: { ... },
  certificate_version: string,
  issued_by: string
}
```

**Example:**
```javascript
const { createProofOfConsent } = require('./security');

const sessionData = {
  session_id: 'CS-1738742389000-abc123',
  phrase: 'I freely give my consent',
  timestamp: '2026-02-05T08:00:00.000Z',
  trust_score: 100,
  blink_count: 3,
  emotion_score: 'happy',
  duration: 8,
  face_detected: true
};

const proof = createProofOfConsent(sessionData);
console.log(proof.hash);  // SHA-256 hash
console.log(proof.status); // 'VERIFIED'
```

---

#### `calculateTrustScore(detectionData)`

Calculates trust score based on AI/CV detection data.

**Input:**
```javascript
{
  blink_count: number,
  emotion_score: string,
  duration: number,
  face_detected: boolean
}
```

**Output:** `number (0-100)`

**Example:**
```javascript
const { calculateTrustScore } = require('./security');

const score = calculateTrustScore({
  blink_count: 3,
  emotion_score: 'happy',
  duration: 8,
  face_detected: true
});
// Returns: 100
```

---

#### `determineStatus(trustScore, panicDetected)`

Determines verification status based on trust score and panic flag.

**Rules:**
- `panicDetected === true` → BLOCKED
- `trustScore >= 70` → VERIFIED
- `50 <= trustScore < 70` → SUSPICIOUS
- `trustScore < 50` → BLOCKED

---

### Certificate Generator (`certificate-generator.js`)

#### `createCertificate(proofData, saveToFile, outputDir)`

Complete certificate generation workflow.

**Parameters:**
- `proofData` - Proof object from `createProofOfConsent()`
- `saveToFile` - (optional) Save HTML to file (default: false)
- `outputDir` - (optional) Output directory (default: './certificates')

**Output:**
```javascript
{
  html: string,        // HTML certificate content
  json: object,        // Certificate JSON for API
  filepath: string     // File path (if saved)
}
```

**Example:**
```javascript
const { createProofOfConsent } = require('./security');
const { createCertificate } = require('./certificate-generator');

const proof = createProofOfConsent(sessionData);
const cert = createCertificate(proof, true, './certificates');

console.log(cert.filepath); // './certificates/certificate-CS-123.html'
```

---

### Hash Utilities (`utils/hash-utils.js`)

#### `generateHash(sessionData)`
Generates SHA-256 hash from session data.

#### `verifyHash(sessionData, expectedHash)`
Verifies hash integrity (returns boolean).

#### `generateSessionId()`
Creates unique session identifier.

#### `generateTimestamp()`
Generates ISO 8601 timestamp.

#### `truncateHash(hash, length)`
Truncates hash for display (default: 8 chars from start/end).

---

## 🔧 Configuration (`config.js`)

### Trust Score Thresholds

```javascript
TRUST_THRESHOLDS: {
  VERIFIED: 70,      // >= 70 → VERIFIED
  SUSPICIOUS: 50,    // 50-69 → SUSPICIOUS
  BLOCKED: 0         // < 50 → BLOCKED
}
```

### Blink Detection Rules

```javascript
BLINK_RULES: {
  MIN_BLINKS: 2,     // Minimum required
  MAX_BLINKS: 5,     // Maximum allowed (exceeding = FAIL)
  PENALTY: 20        // Penalty for failing
}
```

### Emotion Detection Rules

```javascript
EMOTION_RULES: {
  PANIC_EMOTIONS: ['fear', 'angry', 'disgust'],
  PANIC_PENALTY: 30
}
```

---

## 🔐 Hash Generation

### Formula

```
SHA-256(session_id|phrase|timestamp|trust_score|blink_count|emotion_score|duration|face_detected)
```

Fields are joined with `|` separator in the exact order specified in `config.js`.

### Example

```javascript
Input: {
  session_id: 'CS-123',
  phrase: 'I consent',
  timestamp: '2026-02-05T08:00:00.000Z',
  trust_score: 100,
  blink_count: 3,
  emotion_score: 'happy',
  duration: 8,
  face_detected: true
}

Hash Input String:
"CS-123|I consent|2026-02-05T08:00:00.000Z|100|3|happy|8|true"

SHA-256 Output:
"a1b2c3d4e5f6..." (64 hex characters)
```

---

## 🎨 Certificate Features

The HTML certificate includes:

- **Visual Status Badge** - Color-coded (green/red/yellow)
- **Trust Score Display** - Large prominent number
- **Session Information** - ID, timestamp, duration
- **Verification Details** - Blinks, emotion, face detection
- **Cryptographic Hash** - Full SHA-256 with copy button
- **Print Functionality** - Print-friendly CSS
- **Responsive Design** - Works on all devices

---

## 🔄 Integration with Other Roles

### Backend (Role 2) Integration

In your `/submit` endpoint:

```javascript
const { createProofOfConsent, calculateTrustScore } = require('./security/security');
const { createCertificate } = require('./security/certificate-generator');

app.post('/submit', (req, res) => {
  const { session_id, phrase, blink_count, emotion_score, duration, face_detected } = req.body;
  
  // Calculate trust score
  const trust_score = calculateTrustScore({
    blink_count,
    emotion_score,
    duration,
    face_detected
  });
  
  // Create proof of consent
  const sessionData = {
    session_id,
    phrase,
    timestamp: new Date().toISOString(),
    trust_score,
    blink_count,
    emotion_score,
    duration,
    face_detected
  };
  
  const proof = createProofOfConsent(sessionData);
  const certificate = createCertificate(proof, false);
  
  res.json({
    trust_score: proof.trust_score,
    status: proof.status,
    hash: proof.hash,
    certificate: certificate.json
  });
});
```

### Frontend (Role 1) Integration

Display the certificate:

```javascript
// After receiving response from /submit
fetch('/submit', { ... })
  .then(res => res.json())
  .then(data => {
    // Show certificate
    document.getElementById('certificate-container').innerHTML = data.certificate.html;
    
    // Or open in new window
    const certWindow = window.open('', '_blank');
    certWindow.document.write(data.certificate.html);
  });
```

---

## ✅ What's Included (Checklist)

- ✅ SHA-256 hash function
- ✅ Hash based on session data
- ✅ Timestamp added (ISO 8601)
- ✅ Trust score embedded
- ✅ Simple certificate page (HTML)
- ✅ "Verified / Blocked" status
- ✅ Hash verification function
- ✅ Status determination logic
- ✅ Demo script with examples
- ✅ Complete documentation

---

## 🎬 Demo Scenarios

Run `node demo.js` to see:

1. **VERIFIED** - Happy path (trust score 100, 3 blinks, happy emotion)
2. **BLOCKED** - Panic detected (fear emotion, too many blinks)
3. **SUSPICIOUS** - Low trust score (too few blinks)
4. **Hash Verification** - Tamper detection example

---

## 📦 What to Share with Team

### For Backend (Role 2)
- `security.js` - Import `createProofOfConsent()` and `calculateTrustScore()`
- `config.js` - Thresholds and rules

### For Frontend (Role 1)
- `certificate-generator.js` - Get HTML/JSON certificate
- Sample certificates in `./certificates/` folder

### For AI/CV (Role 3)
- Data format required (see API reference)
- Expected emotion values

### For Integration (Role 5)
- `demo.js` - Complete usage examples
- This README

---

## 🚨 Error Handling

The module validates all input data:

```javascript
const { createProofOfConsent } = require('./security');

try {
  const proof = createProofOfConsent(invalidData);
} catch (error) {
  console.error(error.message);
  // "Invalid session data: Missing required field: session_id"
}
```

---

## 📞 Support

For questions or integration help, contact Role 4 team member.

**Built with ❤️ for ConsentShield Hackathon**
