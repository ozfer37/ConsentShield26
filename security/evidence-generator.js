/**
 * ConsentShield - Simple Evidence Generator
 * Role 4: Security + Evidence
 * 
 * Creates a simple evidence page with ONLY the required fields:
 * - session_id
 * - phrase  
 * - timestamp
 * - trust_score
 * - Generated SHA-256 hash
 * - Status
 */

const fs = require('fs');
const path = require('path');
const { generateHash, generateTimestamp } = require('./utils/hash-utils');
const { determineStatus } = require('./security');

/**
 * Generate simple evidence page (matches team checklist exactly)
 * @param {Object} data - Session data
 * @returns {Object} - { html, hash, status }
 */
function generateEvidence(data) {
    const {
        session_id,
        phrase,
        timestamp = generateTimestamp(),
        trust_score
    } = data;

    // Generate SHA-256 hash with ONLY the 4 required fields
    const hashInput = {
        session_id,
        phrase,
        timestamp,
        trust_score
    };

    const hash = generateHash(hashInput);
    const status = determineStatus(trust_score, false);

    // Read evidence template
    const templatePath = path.join(__dirname, 'evidence-page.html');
    let html = fs.readFileSync(templatePath, 'utf8');

    // Determine status styling
    const statusConfig = {
        'VERIFIED': { class: 'verified', icon: '✅' },
        'BLOCKED': { class: 'blocked', icon: '❌' },
        'SUSPICIOUS': { class: 'suspicious', icon: '⚠️' }
    };

    const statusInfo = statusConfig[status] || statusConfig.SUSPICIOUS;

    // Format timestamp
    const displayTimestamp = new Date(timestamp).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    });

    const generationTime = new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
    });

    // Replace placeholders
    const replacements = {
        '{{HASH}}': hash,
        '{{STATUS}}': status,
        '{{STATUS_CLASS}}': statusInfo.class,
        '{{STATUS_ICON}}': statusInfo.icon,
        '{{TIMESTAMP}}': displayTimestamp,
        '{{SESSION_ID}}': session_id,
        '{{PHRASE}}': phrase,
        '{{TRUST_SCORE}}': trust_score,
        '{{GENERATION_TIME}}': generationTime
    };

    Object.keys(replacements).forEach(placeholder => {
        const regex = new RegExp(placeholder, 'g');
        html = html.replace(regex, replacements[placeholder]);
    });

    return {
        html,
        hash,
        status,
        session_id,
        timestamp
    };
}

/**
 * Save evidence page to file
 * @param {Object} evidence - Evidence object from generateEvidence()
 * @param {string} outputDir - Output directory
 * @returns {string} - File path
 */
function saveEvidence(evidence, outputDir = './evidence') {
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const filename = `evidence-${evidence.session_id}.html`;
    const filepath = path.join(outputDir, filename);

    fs.writeFileSync(filepath, evidence.html, 'utf8');

    return filepath;
}

module.exports = {
    generateEvidence,
    saveEvidence
};
