/**
 * ConsentShield - Security Configuration
 * Role 4: Security + Evidence
 * 
 * Configuration for trust score thresholds, status rules, and security settings
 */

const SecurityConfig = {
  // Trust Score Thresholds
  TRUST_THRESHOLDS: {
    VERIFIED: 70,      // trust_score >= 70 → VERIFIED
    SUSPICIOUS: 50,    // 50 <= trust_score < 70 → SUSPICIOUS
    BLOCKED: 0         // trust_score < 50 → BLOCKED
  },

  // Blink Detection Rules
  BLINK_RULES: {
    MIN_BLINKS: 2,     // Minimum blinks required
    MAX_BLINKS: 5,     // Maximum blinks allowed
    PENALTY: 20        // Penalty for failing blink rules
  },

  // Emotion Detection Rules
  EMOTION_RULES: {
    PANIC_EMOTIONS: ['fear', 'angry', 'disgust'],
    PANIC_PENALTY: 30,
    VALID_EMOTIONS: ['happy', 'neutral', 'sad', 'surprise', 'fear', 'angry', 'disgust']
  },

  // Duration Rules
  DURATION_RULES: {
    MIN_DURATION: 3,   // Minimum session duration in seconds
    MAX_DURATION: 30,  // Maximum session duration in seconds
    TIMEOUT_PENALTY: 15
  },

  // Hash Configuration
  HASH_CONFIG: {
    ALGORITHM: 'SHA-256',
    ENCODING: 'hex',
    FIELDS_ORDER: [
      'session_id',
      'phrase',
      'timestamp',
      'trust_score',
      'blink_count',
      'emotion_score',
      'duration',
      'face_detected'
    ],
    SEPARATOR: '|'
  },

  // Certificate Settings
  CERTIFICATE: {
    VALIDITY_DAYS: 365,
    ISSUER: 'ConsentShield Verification System',
    VERSION: '1.0.0'
  },

  // Status Messages
  STATUS_MESSAGES: {
    VERIFIED: 'Consent verified successfully. All liveness checks passed.',
    BLOCKED: 'Consent verification failed. Potential coercion or manipulation detected.',
    SUSPICIOUS: 'Consent verification requires manual review. Some anomalies detected.'
  }
};

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SecurityConfig;
}
