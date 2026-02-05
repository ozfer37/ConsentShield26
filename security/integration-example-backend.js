/**
 * INTEGRATION EXAMPLE FOR BACKEND (Role 2)
 * 
 * This file shows how to integrate the Security Module into your backend endpoints
 */

const express = require('express');
const { createProofOfConsent, calculateTrustScore } = require('./security/security');
const { createCertificate } = require('./security/certificate-generator');
const { generateSessionId, generateTimestamp } = require('./security/utils/hash-utils');

const app = express();
app.use(express.json());

// In-memory storage for demo (use a database in production)
const sessions = new Map();

// ============================================================================
// POST /start - Start a new consent verification session
// ============================================================================
app.post('/start', (req, res) => {
    try {
        // Generate session ID and timestamp
        const session_id = generateSessionId();
        const timestamp = generateTimestamp();

        // Generate random phrase (or pull from predefined list)
        const phrases = [
            'I freely give my consent without coercion',
            'I agree to this voluntarily and without pressure',
            'I consent of my own free will',
            'I am not being forced or threatened into this decision',
            'I make this choice independently and willingly'
        ];
        const phrase = phrases[Math.floor(Math.random() * phrases.length)];

        // Store session
        sessions.set(session_id, {
            session_id,
            phrase,
            timestamp,
            status: 'pending'
        });

        // Return session info
        res.json({
            session_id,
            phrase,
            timestamp
        });
    } catch (error) {
        console.error('Error in /start:', error);
        res.status(500).json({ error: 'Failed to start session' });
    }
});

// ============================================================================
// POST /submit - Submit verification data and get trust score + certificate
// ============================================================================
app.post('/submit', (req, res) => {
    try {
        const {
            session_id,
            blink_count,
            emotion_score,
            duration,
            face_detected = true
        } = req.body;

        // Validate inputs
        if (!session_id || blink_count === undefined || !emotion_score || !duration) {
            return res.status(400).json({
                error: 'Missing required fields: session_id, blink_count, emotion_score, duration'
            });
        }

        // Get session from storage
        const session = sessions.get(session_id);
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        // Calculate trust score from AI/CV data
        const trust_score = calculateTrustScore({
            blink_count,
            emotion_score,
            duration,
            face_detected
        });

        // Build complete session data
        const sessionData = {
            session_id: session.session_id,
            phrase: session.phrase,
            timestamp: session.timestamp,
            trust_score,
            blink_count,
            emotion_score,
            duration,
            face_detected
        };

        // Create proof of consent (generates hash)
        const proof = createProofOfConsent(sessionData);

        // Generate certificate
        const certificate = createCertificate(proof, true, './certificates');

        // Update session
        session.status = proof.status;
        session.trust_score = trust_score;
        session.hash = proof.hash;

        // Return response
        res.json({
            trust_score: proof.trust_score,
            status: proof.status,
            hash: proof.hash,
            status_message: proof.status_message,
            certificate: certificate.json,
            certificate_url: `/certificate/${session_id}` // Frontend can fetch this
        });
    } catch (error) {
        console.error('Error in /submit:', error);
        res.status(500).json({ error: 'Failed to process submission' });
    }
});

// ============================================================================
// GET /certificate/:session_id - Get certificate HTML
// ============================================================================
app.get('/certificate/:session_id', (req, res) => {
    try {
        const { session_id } = req.params;

        const session = sessions.get(session_id);
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        if (!session.hash) {
            return res.status(400).json({ error: 'Session not yet completed' });
        }

        // Read certificate file
        const fs = require('fs');
        const path = require('path');
        const certPath = path.join(__dirname, 'certificates', `certificate-${session_id}.html`);

        if (!fs.existsSync(certPath)) {
            return res.status(404).json({ error: 'Certificate not found' });
        }

        const certificateHTML = fs.readFileSync(certPath, 'utf8');
        res.setHeader('Content-Type', 'text/html');
        res.send(certificateHTML);
    } catch (error) {
        console.error('Error in /certificate:', error);
        res.status(500).json({ error: 'Failed to retrieve certificate' });
    }
});

// ============================================================================
// GET /verify/:hash - Verify a certificate by hash
// ============================================================================
app.get('/verify/:hash', (req, res) => {
    try {
        const { hash } = req.params;

        // Find session with this hash
        let foundSession = null;
        for (const [id, session] of sessions.entries()) {
            if (session.hash === hash) {
                foundSession = session;
                break;
            }
        }

        if (!foundSession) {
            return res.json({
                valid: false,
                message: 'Hash not found in system'
            });
        }

        res.json({
            valid: true,
            session_id: foundSession.session_id,
            status: foundSession.status,
            trust_score: foundSession.trust_score,
            timestamp: foundSession.timestamp
        });
    } catch (error) {
        console.error('Error in /verify:', error);
        res.status(500).json({ error: 'Verification failed' });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🛡️  ConsentShield Backend running on port ${PORT}`);
    console.log(`\nAvailable endpoints:`);
    console.log(`  POST   /start              - Start verification session`);
    console.log(`  POST   /submit             - Submit verification data`);
    console.log(`  GET    /certificate/:id    - Get certificate HTML`);
    console.log(`  GET    /verify/:hash       - Verify certificate by hash`);
});

module.exports = app;
