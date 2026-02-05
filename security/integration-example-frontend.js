/**
 * INTEGRATION EXAMPLE FOR FRONTEND (Role 1)
 * 
 * This file shows how to integrate with the backend security endpoints
 * and display certificates
 */

// ============================================================================
// 1. Start Session
// ============================================================================
async function startVerificationSession() {
    try {
        const response = await fetch('/start', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        // Store session data
        sessionStorage.setItem('session_id', data.session_id);
        sessionStorage.setItem('phrase', data.phrase);

        // Display phrase to user
        document.getElementById('phrase-display').textContent = data.phrase;

        return data;
    } catch (error) {
        console.error('Failed to start session:', error);
        alert('Failed to start verification session');
    }
}

// ============================================================================
// 2. Submit Verification Data
// ============================================================================
async function submitVerificationData(verificationData) {
    try {
        const session_id = sessionStorage.getItem('session_id');

        const response = await fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                session_id,
                blink_count: verificationData.blink_count,
                emotion_score: verificationData.emotion_score,
                duration: verificationData.duration,
                face_detected: verificationData.face_detected
            })
        });

        const result = await response.json();

        // Display results
        displayVerificationResult(result);

        return result;
    } catch (error) {
        console.error('Failed to submit verification:', error);
        alert('Failed to submit verification data');
    }
}

// ============================================================================
// 3. Display Verification Result
// ============================================================================
function displayVerificationResult(result) {
    const resultContainer = document.getElementById('result-container');

    // Determine status color
    const statusColors = {
        'VERIFIED': '#10b981',
        'BLOCKED': '#ef4444',
        'SUSPICIOUS': '#f59e0b'
    };

    const statusIcons = {
        'VERIFIED': '✅',
        'BLOCKED': '❌',
        'SUSPICIOUS': '⚠️'
    };

    // Build result HTML
    resultContainer.innerHTML = `
    <div class="result-card">
      <div class="status-badge" style="background: ${statusColors[result.status]}">
        ${statusIcons[result.status]} ${result.status}
      </div>
      
      <div class="trust-score">
        <h2>${result.trust_score}</h2>
        <p>Trust Score</p>
      </div>
      
      <div class="hash-display">
        <label>Cryptographic Proof (SHA-256)</label>
        <code>${result.hash}</code>
        <button onclick="copyToClipboard('${result.hash}')">Copy Hash</button>
      </div>
      
      <div class="message">
        <p>${result.status_message}</p>
      </div>
      
      <div class="actions">
        <button onclick="viewCertificate('${result.certificate.certificate_id}')">
          View Certificate
        </button>
        <button onclick="downloadCertificate('${result.certificate.certificate_id}')">
          Download Certificate
        </button>
      </div>
    </div>
  `;

    resultContainer.style.display = 'block';
}

// ============================================================================
// 4. View Certificate in New Window
// ============================================================================
function viewCertificate(sessionId) {
    const certificateUrl = `/certificate/${sessionId}`;
    window.open(certificateUrl, '_blank', 'width=900,height=800');
}

// ============================================================================
// 5. Download Certificate
// ============================================================================
async function downloadCertificate(sessionId) {
    try {
        const response = await fetch(`/certificate/${sessionId}`);
        const html = await response.text();

        // Create blob and download
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `ConsentShield-Certificate-${sessionId}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Failed to download certificate:', error);
        alert('Failed to download certificate');
    }
}

// ============================================================================
// 6. Copy Hash to Clipboard
// ============================================================================
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Hash copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// ============================================================================
// 7. Complete Workflow Example
// ============================================================================
async function runCompleteVerification() {
    // Step 1: Start session
    const session = await startVerificationSession();
    console.log('Session started:', session);

    // Step 2: Show phrase and start recording
    // (Your camera/AI code goes here)

    // Step 3: Collect verification data from AI/CV module (Role 3)
    const verificationData = {
        blink_count: 3,           // From AI/CV
        emotion_score: 'happy',   // From AI/CV
        duration: 8,              // From timer
        face_detected: true       // From AI/CV
    };

    // Step 4: Submit data
    const result = await submitVerificationData(verificationData);
    console.log('Verification result:', result);

    // Step 5: Result is automatically displayed
}

// ============================================================================
// 8. Error Handling
// ============================================================================
window.addEventListener('error', (event) => {
    console.error('Frontend error:', event.error);

    // Show user-friendly error
    const errorContainer = document.getElementById('error-container');
    if (errorContainer) {
        errorContainer.innerHTML = `
      <div class="error-message">
        <h3>❌ Verification Error</h3>
        <p>Something went wrong. Please try again.</p>
        <button onclick="location.reload()">Restart</button>
      </div>
    `;
        errorContainer.style.display = 'block';
    }
});

// Export functions for use in your main app
export {
    startVerificationSession,
    submitVerificationData,
    displayVerificationResult,
    viewCertificate,
    downloadCertificate,
    runCompleteVerification
};
