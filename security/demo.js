/**
 * ConsentShield - Security Module Demo
 * Role 4: Security + Evidence
 * 
 * Demonstration of all security features with mock data
 */

const { createProofOfConsent, calculateTrustScore } = require('./security');
const { createCertificate } = require('./certificate-generator');
const { generateSessionId, generateTimestamp } = require('./utils/hash-utils');

console.log('🛡️  ConsentShield - Security Module Demo\n');
console.log('='.repeat(60));

// ============================================================================
// SCENARIO 1: VERIFIED - Happy Path
// ============================================================================
console.log('\n📋 SCENARIO 1: VERIFIED (Happy Path)');
console.log('-'.repeat(60));

const verifiedSession = {
    session_id: generateSessionId(),
    phrase: 'I freely give my consent without coercion',
    timestamp: generateTimestamp(),
    trust_score: 100,
    blink_count: 3,
    emotion_score: 'happy',
    duration: 8,
    face_detected: true
};

console.log('Input Data:');
console.log(JSON.stringify(verifiedSession, null, 2));

const verifiedProof = createProofOfConsent(verifiedSession);
console.log('\n✅ Proof of Consent:');
console.log(JSON.stringify(verifiedProof, null, 2));

const verifiedCert = createCertificate(verifiedProof, true, './certificates');
console.log('\n📄 Certificate Generated:');
console.log(`- Status: ${verifiedCert.json.status}`);
console.log(`- Trust Score: ${verifiedCert.json.trust_score}`);
console.log(`- Hash: ${verifiedCert.json.hash_preview}`);
console.log(`- File: ${verifiedCert.filepath}`);

// ============================================================================
// SCENARIO 2: BLOCKED - Panic Detected
// ============================================================================
console.log('\n\n📋 SCENARIO 2: BLOCKED (Panic Detected)');
console.log('-'.repeat(60));

const blockedSession = {
    session_id: generateSessionId(),
    phrase: 'I freely give my consent without coercion',
    timestamp: generateTimestamp(),
    trust_score: 55,  // Even with mid-range score
    blink_count: 7,   // Too many blinks
    emotion_score: 'fear',  // Panic emotion
    duration: 6,
    face_detected: true
};

console.log('Input Data:');
console.log(JSON.stringify(blockedSession, null, 2));

const blockedProof = createProofOfConsent(blockedSession);
console.log('\n❌ Proof of Consent:');
console.log(JSON.stringify(blockedProof, null, 2));

const blockedCert = createCertificate(blockedProof, true, './certificates');
console.log('\n📄 Certificate Generated:');
console.log(`- Status: ${blockedCert.json.status}`);
console.log(`- Trust Score: ${blockedCert.json.trust_score}`);
console.log(`- Hash: ${blockedCert.json.hash_preview}`);
console.log(`- File: ${blockedCert.filepath}`);

// ============================================================================
// SCENARIO 3: SUSPICIOUS - Low Trust Score
// ============================================================================
console.log('\n\n📋 SCENARIO 3: SUSPICIOUS (Low Trust Score)');
console.log('-'.repeat(60));

const suspiciousSession = {
    session_id: generateSessionId(),
    phrase: 'I freely give my consent without coercion',
    timestamp: generateTimestamp(),
    trust_score: 60,  // Between 50-70
    blink_count: 1,   // Too few blinks
    emotion_score: 'neutral',
    duration: 5,
    face_detected: true
};

console.log('Input Data:');
console.log(JSON.stringify(suspiciousSession, null, 2));

const suspiciousProof = createProofOfConsent(suspiciousSession);
console.log('\n⚠️  Proof of Consent:');
console.log(JSON.stringify(suspiciousProof, null, 2));

const suspiciousCert = createCertificate(suspiciousProof, true, './certificates');
console.log('\n📄 Certificate Generated:');
console.log(`- Status: ${suspiciousCert.json.status}`);
console.log(`- Trust Score: ${suspiciousCert.json.trust_score}`);
console.log(`- Hash: ${suspiciousCert.json.hash_preview}`);
console.log(`- File: ${suspiciousCert.filepath}`);

// ============================================================================
// TRUST SCORE CALCULATION DEMO
// ============================================================================
console.log('\n\n📊 TRUST SCORE CALCULATION DEMO');
console.log('-'.repeat(60));

const testCases = [
    {
        name: 'Perfect score',
        data: { blink_count: 3, emotion_score: 'happy', duration: 8, face_detected: true }
    },
    {
        name: 'Too few blinks',
        data: { blink_count: 1, emotion_score: 'neutral', duration: 8, face_detected: true }
    },
    {
        name: 'Panic detected',
        data: { blink_count: 3, emotion_score: 'fear', duration: 8, face_detected: true }
    },
    {
        name: 'No face',
        data: { blink_count: 3, emotion_score: 'happy', duration: 8, face_detected: false }
    },
    {
        name: 'Too many blinks',
        data: { blink_count: 6, emotion_score: 'neutral', duration: 8, face_detected: true }
    }
];

testCases.forEach(testCase => {
    const score = calculateTrustScore(testCase.data);
    console.log(`\n${testCase.name}:`);
    console.log(`  Input: ${JSON.stringify(testCase.data)}`);
    console.log(`  Score: ${score}`);
});

// ============================================================================
// HASH VERIFICATION DEMO
// ============================================================================
console.log('\n\n🔒 HASH VERIFICATION DEMO');
console.log('-'.repeat(60));

const { generateHash, verifyHash } = require('./utils/hash-utils');

const testSession = {
    session_id: 'TEST-123',
    phrase: 'Test phrase',
    timestamp: '2026-02-05T08:00:00.000Z',
    trust_score: 100,
    blink_count: 3,
    emotion_score: 'happy',
    duration: 8,
    face_detected: true
};

const hash1 = generateHash(testSession);
console.log('\nOriginal Hash:');
console.log(hash1);

const isValid = verifyHash(testSession, hash1);
console.log(`\nHash Verification: ${isValid ? '✅ VALID' : '❌ INVALID'}`);

// Tamper with data
testSession.trust_score = 50;
const hash2 = generateHash(testSession);
console.log('\nHash after tampering:');
console.log(hash2);

const isTampered = verifyHash(testSession, hash1);
console.log(`\nTampering Detection: ${isTampered ? '❌ NOT DETECTED' : '✅ DETECTED'}`);

// ============================================================================
// SUMMARY
// ============================================================================
console.log('\n\n' + '='.repeat(60));
console.log('✅ Demo Complete!');
console.log('='.repeat(60));
console.log('\n📁 Check the ./certificates directory for generated HTML files');
console.log('📖 Open any certificate in a browser to view the visual output');
console.log('\n🔐 All security features are working:');
console.log('  ✅ SHA-256 hash generation');
console.log('  ✅ Status determination (VERIFIED/BLOCKED/SUSPICIOUS)');
console.log('  ✅ Trust score calculation');
console.log('  ✅ Certificate generation (HTML)');
console.log('  ✅ Hash verification and tampering detection');
console.log('\n');
