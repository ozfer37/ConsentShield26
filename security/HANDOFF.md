# 🛡️ Role 4 Security Module - HANDOFF DOCUMENT

## For: Other Team Members (Roles 1, 2, 3, 5)

---

## ✅ What's Complete

Your **Security + Evidence** module is **100% ready** with:

- ✅ SHA-256 hash generation
- ✅ Trust score calculation 
- ✅ Status determination (VERIFIED/BLOCKED/SUSPICIOUS)
- ✅ Beautiful HTML certificates
- ✅ Hash verification & tamper detection
- ✅ Complete API integration examples

---

## 📦 What You Get

### Files in `security/` folder:

```
security/
├── config.js                          # Thresholds & rules
├── security.js                        # Core module ⭐
├── certificate-generator.js           # Certificate creation ⭐
├── demo.js                            # Working demo
├── README.md                          # Full documentation
├── package.json                       # NPM setup
├── utils/hash-utils.js               # Hash utilities
├── templates/certificate-template.html # Certificate design
├── integration-example-backend.js     # Backend guide ⭐
└── integration-example-frontend.js    # Frontend guide ⭐
```

**⭐ = Must read for integration**

---

## 🎯 Quick Integration (3 Steps)

### **BACKEND (Role 2)** - Add to `/submit` endpoint:

```javascript
const { createProofOfConsent, calculateTrustScore } = require('./security/security');
const { createCertificate } = require('./security/certificate-generator');

app.post('/submit', (req, res) => {
  // 1. Calculate trust score
  const trust_score = calculateTrustScore({
    blink_count: req.body.blink_count,
    emotion_score: req.body.emotion_score,
    duration: req.body.duration,
    face_detected: req.body.face_detected
  });
  
  // 2. Create proof with hash
  const proof = createProofOfConsent({
    session_id: req.body.session_id,
    phrase: req.body.phrase,
    timestamp: new Date().toISOString(),
    trust_score,
    blink_count: req.body.blink_count,
    emotion_score: req.body.emotion_score,
    duration: req.body.duration,
    face_detected: req.body.face_detected
  });
  
  // 3. Generate certificate
  const cert = createCertificate(proof, true);
  
  res.json({
    trust_score: proof.trust_score,
    status: proof.status,
    hash: proof.hash,
    certificate: cert.json
  });
});
```

**See full example:** `integration-example-backend.js`

---

### **FRONTEND (Role 1)** - Display results:

```javascript
// After getting response from /submit
fetch('/submit', { ... })
  .then(res => res.json())
  .then(data => {
    // Show status
    document.getElementById('status').textContent = data.status;
    document.getElementById('trust-score').textContent = data.trust_score;
    document.getElementById('hash').textContent = data.hash;
    
    // Show certificate button
    document.getElementById('view-cert-btn').onclick = () => {
      window.open(`/certificate/${data.certificate.certificate_id}`, '_blank');
    };
  });
```

**See full example:** `integration-example-frontend.js`

---

### **AI/CV (Role 3)** - Data format needed:

Send this to backend's `/submit`:

```javascript
{
  "session_id": "CS-123-abc",     // From /start
  "blink_count": 3,               // Your detection
  "emotion_score": "happy",       // Your detection (or "neutral", "fear", etc.)
  "duration": 8,                  // Seconds
  "face_detected": true           // Your detection
}
```

Backend will calculate trust score and generate hash automatically.

---

## 🎬 Test It Now

```bash
cd c:\gik.anix\ros.zhan\project\consentshield\security
node demo.js
```

This generates 3 sample certificates:
- ✅ VERIFIED (trust score 100)
- ❌ BLOCKED (panic detected)
- ⚠️ SUSPICIOUS (low trust score)

Open any `.html` file in `certificates/` folder to see the design!

---

## 🔐 Trust Score Rules

Starting score: **100**

**Deductions:**
- Blinks < 2 → **-20 points**
- Blinks > 5 → **INSTANT FAIL (score = 0)**
- Fear/angry/disgust emotion → **-30 points**
- Duration < 3s or > 30s → **-15 points**
- No face detected → **INSTANT FAIL (score = 0)**

**Status Thresholds:**
- ≥ 70 = ✅ **VERIFIED**
- 50-69 = ⚠️ **SUSPICIOUS** 
- < 50 = ❌ **BLOCKED**
- Panic emotion = ❌ **BLOCKED** (regardless of score)

*Tweak these in `config.js`*

---

## 📋 What Backend Needs to Implement

### 1. `POST /start`
Returns: `{ session_id, phrase }`

### 2. `POST /submit` 
Receives: AI/CV data  
Returns: `{ trust_score, status, hash, certificate }`

### 3. `GET /certificate/:session_id` (optional)
Returns: HTML certificate

See **complete working example** in `integration-example-backend.js`

---

## 🎨 Certificate Features

The generated HTML certificates include:

- ✨ **Beautiful gradient design** (purple theme)
- 📊 **Big trust score display**
- 🔒 **Full SHA-256 hash** with copy button
- 📋 **Session details** (ID, timestamp, duration)
- 🧠 **Verification data** (blinks, emotion, face detection)
- 🖨️ **Print button** (print-friendly CSS)
- 📱 **Responsive** (works on all devices)

**Status badges are color-coded:**
- Green (VERIFIED) ✅
- Red (BLOCKED) ❌
- Yellow (SUSPICIOUS) ⚠️

---

## 🔧 Configuration

Edit `config.js` to change:
- Trust score thresholds
- Blink min/max limits
- Panic emotions list
- Duration limits
- Penalties

---

## ❓ Questions from Team?

### Q: "Can I change the trust score formula?"
**A:** Yes! Edit `calculateTrustScore()` in `security.js` or adjust penalties in `config.js`

### Q: "How do I verify a hash?"
**A:** Use `verifyHash(sessionData, expectedHash)` from `utils/hash-utils.js`

### Q: "Can I generate PDF certificates?"
**A:** HTML is ready. For PDF, add a library like `puppeteer` or `html-pdf` to `certificate-generator.js`

### Q: "What if session data changes?"
**A:** Any change creates a different hash - that's tamper detection! Fields must match exactly.

### Q: "Can I add more fields to the hash?"
**A:** Yes! Update `FIELDS_ORDER` in `config.js` and adjust hash input logic.

---

## 🚨 Integration Checklist

**For Role 2 (Backend):**
- [ ] Copy `security/` folder to your backend
- [ ] Install dependencies: `cd security && npm install`
- [ ] Import modules in your endpoints (see `integration-example-backend.js`)
- [ ] Test with `node demo.js`

**For Role 1 (Frontend):**
- [ ] Add certificate display UI
- [ ] Call `/submit` after AI/CV detection completes
- [ ] Show trust score + status
- [ ] Add "View Certificate" button
- [ ] Test with sample data

**For Role 5 (Integration):**
- [ ] Ensure AI/CV sends correct data format
- [ ] Test all 3 scenarios (VERIFIED, BLOCKED, SUSPICIOUS)
- [ ] Verify hash consistency
- [ ] Test error handling

---

## 📞 Contact Role 4

If you need help with:
- Hash generation issues
- Certificate customization
- Trust score logic changes
- New status types
- Additional security features

**All code is documented and tested. You're ready to integrate! 🚀**

---

## 🎯 Demo for Judges

1. Run verification flow
2. Show certificate with hash
3. Explain: "This SHA-256 hash proves consent cannot be tampered with"
4. **Judges love crypto proof!** 🏆

**Good luck at the hackathon! 🛡️**
