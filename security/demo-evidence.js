/**
 * ConsentShield - Evidence Demo
 * Simple demo showing evidence generation with ONLY required fields
 * 
 * As per team checklist for Role 4:
 * - SHA-256 hash of: session_id, phrase, timestamp, trust_score
 * - Evidence page showing: Hash, Status, Timestamp
 */

const { generateEvidence, saveEvidence } = require('./evidence-generator');
const { generateSessionId, generateTimestamp } = require('./utils/hash-utils');

console.log('🛡️  ConsentShield - Evidence Page Demo');
console.log('='.repeat(60));
console.log('\n📋 Generating Evidence Pages (Team Checklist Format)\n');

// ============================================================================
// Scenario 1: VERIFIED
// ============================================================================
console.log('✅ Scenario 1: VERIFIED');
console.log('-'.repeat(60));

const verifiedData = {
    session_id: generateSessionId(),
    phrase: 'I freely give my consent without coercion',
    timestamp: generateTimestamp(),
    trust_score: 100
};

console.log('Input Data:');
console.log(JSON.stringify(verifiedData, null, 2));

const verifiedEvidence = generateEvidence(verifiedData);
const verifiedPath = saveEvidence(verifiedEvidence, './evidence');

console.log('\n📄 Evidence Generated:');
console.log(`- Hash: ${verifiedEvidence.hash}`);
console.log(`- Status: ${verifiedEvidence.status}`);
console.log(`- Timestamp: ${verifiedEvidence.timestamp}`);
console.log(`- File: ${verifiedPath}`);

// ============================================================================
// Scenario 2: BLOCKED  
// ============================================================================
console.log('\n\n❌ Scenario 2: BLOCKED');
console.log('-'.repeat(60));

const blockedData = {
    session_id: generateSessionId(),
    phrase: 'I freely give my consent without coercion',
    timestamp: generateTimestamp(),
    trust_score: 30
};

console.log('Input Data:');
console.log(JSON.stringify(blockedData, null, 2));

const blockedEvidence = generateEvidence(blockedData);
const blockedPath = saveEvidence(blockedEvidence, './evidence');

console.log('\n📄 Evidence Generated:');
console.log(`- Hash: ${blockedEvidence.hash}`);
console.log(`- Status: ${blockedEvidence.status}`);
console.log(`- Timestamp: ${blockedEvidence.timestamp}`);
console.log(`- File: ${blockedPath}`);

// ============================================================================
// Scenario 3: SUSPICIOUS
// ============================================================================
console.log('\n\n⚠️  Scenario 3: SUSPICIOUS');
console.log('-'.repeat(60));

const suspiciousData = {
    session_id: generateSessionId(),
    phrase: 'I freely give my consent without coercion',
    timestamp: generateTimestamp(),
    trust_score: 60
};

console.log('Input Data:');
console.log(JSON.stringify(suspiciousData, null, 2));

const suspiciousEvidence = generateEvidence(suspiciousData);
const suspiciousPath = saveEvidence(suspiciousEvidence, './evidence');

console.log('\n📄 Evidence Generated:');
console.log(`- Hash: ${suspiciousEvidence.hash}`);
console.log(`- Status: ${suspiciousEvidence.status}`);
console.log(`- Timestamp: ${suspiciousEvidence.timestamp}`);
console.log(`- File: ${suspiciousPath}`);

// ============================================================================
// Hash Format Demonstration
// ============================================================================
console.log('\n\n🔒 HASH FORMAT DEMONSTRATION');
console.log('-'.repeat(60));

console.log('\nHash Input Fields (as per team checklist):');
console.log('1. session_id');
console.log('2. phrase');
console.log('3. timestamp');
console.log('4. trust_score');

console.log('\nHash Input String Example:');
console.log(`"${verifiedData.session_id}|${verifiedData.phrase}|${verifiedData.timestamp}|${verifiedData.trust_score}"`);

console.log('\nResulting SHA-256 Hash:');
console.log(verifiedEvidence.hash);

// ============================================================================
// Summary
// ============================================================================
console.log('\n\n' + '='.repeat(60));
console.log('✅ Evidence Demo Complete!');
console.log('='.repeat(60));
console.log('\n📁 Check ./evidence/ folder for generated evidence pages');
console.log('📖 Open any HTML file in a browser');
console.log('📸 Pages are screenshot-ready for presentation\n');

console.log('🎯 Team Checklist Status:');
console.log('  ✅ SHA-256 function');
console.log('  ✅ Hash input: session_id, phrase, timestamp, trust_score');
console.log('  ✅ Evidence layout (HTML)');
console.log('  ✅ Display: Hash, Status, Timestamp');
console.log('  ✅ Screenshot-ready output\n');
