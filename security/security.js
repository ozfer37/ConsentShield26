/**
 * ConsentShield - Core Security Module
 * Role 4: Security + Evidence
 * 
 * Main security module for hash generation, status determination, and proof of consent
 */

const { generateHash, generateTimestamp, validateSessionData } = require('./utils/hash-utils');
const SecurityConfig = require('./config');

/**
 * Determine verification status based on trust score and flags
 * @param {number} trustScore - Trust score (0-100)
 * @param {boolean} panicDetected - Whether panic/coercion was detected
 * @returns {string} - Status: 'VERIFIED', 'BLOCKED', or 'SUSPICIOUS'
 */
function determineStatus(trustScore, panicDetected = false) {
    // Immediate block if panic detected
    if (panicDetected) {
        return 'BLOCKED';
    }

    const { VERIFIED, SUSPICIOUS } = SecurityConfig.TRUST_THRESHOLDS;

    if (trustScore >= VERIFIED) {
        return 'VERIFIED';
    } else if (trustScore >= SUSPICIOUS) {
        return 'SUSPICIOUS';
    } else {
        return 'BLOCKED';
    }
}

/**
 * Create proof of consent object
 * @param {Object} sessionData - Complete session data
 * @returns {Object} - Proof of consent with hash and metadata
 */
function createProofOfConsent(sessionData) {
    // Validate session data
    const validation = validateSessionData(sessionData);
    if (!validation.valid) {
        throw new Error(`Invalid session data: ${validation.errors.join(', ')}`);
    }

    // Ensure timestamp exists
    if (!sessionData.timestamp) {
        sessionData.timestamp = generateTimestamp();
    }

    // Determine panic detection from emotion
    const panicEmotions = SecurityConfig.EMOTION_RULES.PANIC_EMOTIONS;
    const panicDetected = typeof sessionData.emotion_score === 'string'
        ? panicEmotions.includes(sessionData.emotion_score.toLowerCase())
        : false;

    // Determine status
    const status = determineStatus(sessionData.trust_score, panicDetected);

    // Generate cryptographic hash
    const hash = generateHash(sessionData);

    // Create proof object
    return {
        hash,
        session_id: sessionData.session_id,
        timestamp: sessionData.timestamp,
        trust_score: sessionData.trust_score,
        status,
        status_message: SecurityConfig.STATUS_MESSAGES[status],
        metadata: {
            phrase: sessionData.phrase,
            blink_count: sessionData.blink_count,
            emotion_score: sessionData.emotion_score,
            duration: sessionData.duration,
            face_detected: sessionData.face_detected,
            panic_detected: panicDetected
        },
        certificate_version: SecurityConfig.CERTIFICATE.VERSION,
        issued_by: SecurityConfig.CERTIFICATE.ISSUER
    };
}

/**
 * Calculate trust score (utility for backend integration)
 * @param {Object} detectionData - Data from AI/CV module
 * @returns {number} - Trust score (0-100)
 */
function calculateTrustScore(detectionData) {
    let score = 100; // Start with perfect score

    const {
        blink_count = 0,
        emotion_score = 'neutral',
        duration = 0,
        face_detected = true
    } = detectionData;

    // No face detected - automatic fail
    if (!face_detected) {
        return 0;
    }

    // Blink validation
    const { MIN_BLINKS, MAX_BLINKS, PENALTY } = SecurityConfig.BLINK_RULES;
    if (blink_count < MIN_BLINKS) {
        score -= PENALTY;
    }
    if (blink_count > MAX_BLINKS) {
        return 0; // Automatic fail
    }

    // Emotion validation
    const emotion = typeof emotion_score === 'string' ? emotion_score.toLowerCase() : 'neutral';
    if (SecurityConfig.EMOTION_RULES.PANIC_EMOTIONS.includes(emotion)) {
        score -= SecurityConfig.EMOTION_RULES.PANIC_PENALTY;
    }

    // Duration validation
    const { MIN_DURATION, MAX_DURATION, TIMEOUT_PENALTY } = SecurityConfig.DURATION_RULES;
    if (duration < MIN_DURATION || duration > MAX_DURATION) {
        score -= TIMEOUT_PENALTY;
    }

    // Ensure score is within bounds
    return Math.max(0, Math.min(100, score));
}

module.exports = {
    createProofOfConsent,
    determineStatus,
    calculateTrustScore,
    // Re-export utilities for convenience
    generateHash,
    generateTimestamp
};
