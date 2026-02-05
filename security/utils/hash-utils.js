/**
 * ConsentShield - Hash Utilities
 * Role 4: Security + Evidence
 * 
 * Cryptographic utilities for hash generation and verification
 */

const crypto = require('crypto');
const SecurityConfig = require('../config');

/**
 * Generate SHA-256 hash from session data
 * @param {Object} sessionData - Session data object
 * @returns {string} - Hexadecimal hash string
 */
function generateHash(sessionData) {
    const { FIELDS_ORDER, SEPARATOR } = SecurityConfig.HASH_CONFIG;

    // Build hash input string in deterministic order
    const hashInput = FIELDS_ORDER
        .map(field => {
            const value = sessionData[field];
            // Handle undefined/null values
            return value !== undefined && value !== null ? String(value) : '';
        })
        .join(SEPARATOR);

    // Generate SHA-256 hash
    return crypto
        .createHash('sha256')
        .update(hashInput)
        .digest('hex');
}

/**
 * Verify hash integrity
 * @param {Object} sessionData - Session data object
 * @param {string} expectedHash - Expected hash value
 * @returns {boolean} - True if hash matches
 */
function verifyHash(sessionData, expectedHash) {
    const computedHash = generateHash(sessionData);
    return computedHash === expectedHash;
}

/**
 * Truncate hash for display (first 8 and last 8 characters)
 * @param {string} hash - Full hash string
 * @param {number} length - Number of characters from start and end (default: 8)
 * @returns {string} - Truncated hash with ellipsis
 */
function truncateHash(hash, length = 8) {
    if (!hash || hash.length <= length * 2) {
        return hash;
    }
    return `${hash.substring(0, length)}...${hash.substring(hash.length - length)}`;
}

/**
 * Generate unique session ID
 * @returns {string} - Unique session identifier
 */
function generateSessionId() {
    const timestamp = Date.now();
    const randomBytes = crypto.randomBytes(8).toString('hex');
    return `CS-${timestamp}-${randomBytes}`;
}

/**
 * Generate ISO 8601 timestamp
 * @returns {string} - ISO 8601 formatted timestamp
 */
function generateTimestamp() {
    return new Date().toISOString();
}

/**
 * Validate session data structure
 * @param {Object} sessionData - Session data to validate
 * @returns {Object} - { valid: boolean, errors: string[] }
 */
function validateSessionData(sessionData) {
    const errors = [];
    const requiredFields = SecurityConfig.HASH_CONFIG.FIELDS_ORDER;

    requiredFields.forEach(field => {
        if (sessionData[field] === undefined || sessionData[field] === null) {
            errors.push(`Missing required field: ${field}`);
        }
    });

    // Validate trust score range
    if (sessionData.trust_score !== undefined) {
        const score = Number(sessionData.trust_score);
        if (isNaN(score) || score < 0 || score > 100) {
            errors.push('trust_score must be between 0 and 100');
        }
    }

    // Validate blink count
    if (sessionData.blink_count !== undefined) {
        const blinks = Number(sessionData.blink_count);
        if (isNaN(blinks) || blinks < 0) {
            errors.push('blink_count must be a non-negative number');
        }
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

module.exports = {
    generateHash,
    verifyHash,
    truncateHash,
    generateSessionId,
    generateTimestamp,
    validateSessionData
};
