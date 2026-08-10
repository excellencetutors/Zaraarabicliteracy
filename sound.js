/* ====================================================
   Zara's Arabic Literacy - Web Audio Synthesizer with Mute
   ==================================================== */

let audioCtx = null;
let isMuted = localStorage.getItem('arabic_app_muted') === 'true';

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

/**
 * Toggles mute state and saves preference in localStorage
 */
function toggleMute() {
    isMuted = !isMuted;
    localStorage.setItem('arabic_app_muted', isMuted);
    updateMuteButtonUI();
}

/**
 * Updates button labels/styles across the DOM automatically
 */
function updateMuteButtonUI() {
    const muteBtns = document.querySelectorAll('.mute-btn');
    muteBtns.forEach(btn => {
        btn.innerText = isMuted ? '🔇 Muted' : '🔊 Sound On';
        if (isMuted) {
            btn.classList.add('muted');
        } else {
            btn.classList.remove('muted');
        }
    });
}

/**
 * Plays a cheerful 2-tone chime (C5 -> G5) for correct answers
 */
function playCorrectSound() {
    if (isMuted) return;

    try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;

        // Tone 1 (C5 - 523.25 Hz)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, now);
        gain1.gain.setValueAtTime(0.15, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.15);

        // Tone 2 (G5 - 783.99 Hz)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(783.99, now + 0.1);
        gain2.gain.setValueAtTime(0.2, now + 0.1);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.1);
        osc2.stop(now + 0.35);
    } catch (e) {
        console.warn('Audio playback failed:', e);
    }
}

/**
 * Plays a low double-buzz sound for incorrect answers
 */
function playWrongSound() {
    if (isMuted) return;

    try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.2);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
    } catch (e) {
        console.warn('Audio playback failed:', e);
    }
}

// Sync UI on load automatically
window.addEventListener('DOMContentLoaded', updateMuteButtonUI);
