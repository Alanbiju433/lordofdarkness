// BGM script for the website
let audio;
let playBtn;

function createPlayButton() {
    if (playBtn) return; // Prevent multiple buttons
    playBtn = document.createElement('button');
    playBtn.id = 'bgmPlayBtn';
    playBtn.innerHTML = '🎵 Play Music';
    playBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #667eea;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 25px;
        cursor: pointer;
        font-size: 14px;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    playBtn.addEventListener('click', function() {
        audio.play().then(() => {
            playBtn.remove();
            playBtn = null;
            localStorage.setItem('bgmPlayed', 'true');
            sessionStorage.setItem('musicStarted', 'true');
        }).catch(e => console.log('Audio play failed:', e));
    });
    document.body.appendChild(playBtn);
}

function playBGM() {
    if (audio) {
        audio.play().then(() => {
            if (playBtn) {
                playBtn.remove();
                playBtn = null;
            }
            localStorage.setItem('bgmPlayed', 'true');
            sessionStorage.setItem('musicStarted', 'true');
        }).catch(e => console.log('Audio play failed:', e));
    }
}

document.addEventListener('DOMContentLoaded', function() {
    audio = new Audio('moonlight.mp3');
    audio.loop = true;

    // Resume from stored time if available
    const storedTime = sessionStorage.getItem('musicCurrentTime');
    if (storedTime) {
        audio.currentTime = parseFloat(storedTime);
    }

    if (!localStorage.getItem('bgmPlayed')) {
        // Create overlay for headphones message
        const overlay = document.createElement('div');
        overlay.id = 'headphonesOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            font-family: Arial, sans-serif;
        `;
        overlay.innerHTML = `
            <div style="
                background: white;
                padding: 30px;
                border-radius: 15px;
                text-align: center;
                box-shadow: 0 0 20px rgba(0,0,0,0.5);
            ">
                <h2 style="margin: 0 0 20px 0; color: #333;">🎧 Please Use Headphones</h2>
                <p style="margin: 0 0 20px 0; color: #666;">For the best experience, please put on your headphones.</p>
                <button id="continueBtn" style="
                    background: #667eea;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                ">Continue</button>
            </div>
        `;
        document.body.appendChild(overlay);

        document.getElementById('continueBtn').addEventListener('click', function() {
            overlay.remove();
            audio.play().then(() => {
                localStorage.setItem('bgmPlayed', 'true');
                sessionStorage.setItem('musicStarted', 'true');
            }).catch(e => {
                console.log('Audio play failed:', e);
                createPlayButton();
            });
        });
    } else {
        // On subsequent visits, if music was started, try to play
        if (sessionStorage.getItem('musicStarted') === 'true') {
            audio.play().catch(e => {
                console.log('Audio play failed:', e);
                createPlayButton();
            });
        } else {
            createPlayButton();
        }
    }
});

// Save current time on page unload
window.addEventListener('beforeunload', function() {
    if (audio && !audio.paused) {
        sessionStorage.setItem('musicCurrentTime', audio.currentTime);
    }
});

// Expose playBGM function globally
window.playBGM = playBGM;
