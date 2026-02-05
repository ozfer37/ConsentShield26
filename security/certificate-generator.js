/**
 * ConsentShield - Certificate Generator
 * Role 4: Security + Evidence
 * 
 * Generates HTML and PDF certificates for consent verification
 */

const fs = require('fs');
const path = require('path');
const { truncateHash } = require('./utils/hash-utils');

/**
 * Generate certificate data structure
 * @param {Object} proofData - Proof of consent object from security.js
 * @returns {Object} - Certificate data
 */
function generateCertificate(proofData) {
    return {
        session_id: proofData.session_id,
        hash: proofData.hash,
        trust_score: proofData.trust_score,
        status: proofData.status,
        status_message: proofData.status_message,
        timestamp: proofData.timestamp,
        metadata: proofData.metadata,
        issuer: proofData.issued_by,
        version: proofData.certificate_version,
        generated_at: new Date().toISOString()
    };
}

/**
 * Render HTML certificate from template
 * @param {Object} certificateData - Certificate data
 * @returns {string} - HTML string
 */
function renderHTMLCertificate(certificateData) {
    // Read template file
    const templatePath = path.join(__dirname, 'templates', 'certificate-template.html');
    let htmlTemplate = fs.readFileSync(templatePath, 'utf8');

    // Determine status class and icon
    const statusConfig = {
        'VERIFIED': { class: 'verified', icon: '✅' },
        'BLOCKED': { class: 'blocked', icon: '❌' },
        'SUSPICIOUS': { class: 'suspicious', icon: '⚠️' }
    };

    const statusInfo = statusConfig[certificateData.status] || statusConfig.SUSPICIOUS;

    // Format timestamp for display
    const displayTimestamp = new Date(certificateData.timestamp).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    });

    const generationTime = new Date(certificateData.generated_at).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
    });

    // Replace placeholders
    const replacements = {
        '{{SESSION_ID}}': certificateData.session_id,
        '{{HASH}}': certificateData.hash,
        '{{TRUST_SCORE}}': certificateData.trust_score,
        '{{STATUS}}': certificateData.status,
        '{{STATUS_CLASS}}': statusInfo.class,
        '{{STATUS_ICON}}': statusInfo.icon,
        '{{STATUS_MESSAGE}}': certificateData.status_message,
        '{{TIMESTAMP}}': displayTimestamp,
        '{{GENERATION_TIME}}': generationTime,
        '{{BLINK_COUNT}}': certificateData.metadata.blink_count,
        '{{EMOTION_SCORE}}': certificateData.metadata.emotion_score,
        '{{DURATION}}': certificateData.metadata.duration,
        '{{FACE_DETECTED}}': certificateData.metadata.face_detected ? 'Yes ✓' : 'No ✗',
        '{{PANIC_DETECTED}}': certificateData.metadata.panic_detected ? 'Yes ⚠️' : 'No ✓',
        '{{ISSUER}}': certificateData.issuer,
        '{{VERSION}}': certificateData.version
    };

    // Perform replacements
    Object.keys(replacements).forEach(placeholder => {
        const regex = new RegExp(placeholder, 'g');
        htmlTemplate = htmlTemplate.replace(regex, replacements[placeholder]);
    });

    return htmlTemplate;
}

/**
 * Save certificate to HTML file
 * @param {string} htmlContent - HTML certificate content
 * @param {string} sessionId - Session ID for filename
 * @param {string} outputDir - Output directory (default: ./certificates)
 * @returns {string} - File path of saved certificate
 */
function saveCertificateToFile(htmlContent, sessionId, outputDir = './certificates') {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate filename
    const filename = `certificate-${sessionId}.html`;
    const filepath = path.join(outputDir, filename);

    // Write file
    fs.writeFileSync(filepath, htmlContent, 'utf8');

    return filepath;
}

/**
 * Generate certificate JSON for API response
 * @param {Object} certificateData - Certificate data
 * @returns {Object} - Certificate JSON
 */
function generateCertificateJSON(certificateData) {
    return {
        certificate_id: certificateData.session_id,
        hash: certificateData.hash,
        hash_preview: truncateHash(certificateData.hash),
        trust_score: certificateData.trust_score,
        status: certificateData.status,
        status_message: certificateData.status_message,
        timestamp: certificateData.timestamp,
        verification_details: {
            blink_count: certificateData.metadata.blink_count,
            emotion_score: certificateData.metadata.emotion_score,
            duration: certificateData.metadata.duration,
            face_detected: certificateData.metadata.face_detected,
            panic_detected: certificateData.metadata.panic_detected
        },
        issuer: certificateData.issuer,
        version: certificateData.version,
        generated_at: certificateData.generated_at
    };
}

/**
 * Complete certificate generation workflow
 * @param {Object} proofData - Proof of consent from security module
 * @param {boolean} saveToFile - Whether to save HTML to file (default: false)
 * @param {string} outputDir - Output directory for saved files
 * @returns {Object} - { html, json, filepath }
 */
function createCertificate(proofData, saveToFile = false, outputDir = './certificates') {
    const certificateData = generateCertificate(proofData);
    const html = renderHTMLCertificate(certificateData);
    const json = generateCertificateJSON(certificateData);

    let filepath = null;
    if (saveToFile) {
        filepath = saveCertificateToFile(html, certificateData.session_id, outputDir);
    }

    return {
        html,
        json,
        filepath
    };
}

module.exports = {
    generateCertificate,
    renderHTMLCertificate,
    saveCertificateToFile,
    generateCertificateJSON,
    createCertificate
};
