document.addEventListener('DOMContentLoaded', function() {
    const openBtn = document.querySelector('.open-btn');
    const card = document.querySelector('.card-inner');
    const balloons = document.querySelectorAll('.balloon-center');
    const flame = document.querySelector('.flame');
    
    // Animate balloons to corners
    balloons.forEach((balloon, index) => {
        const corners = [
            { top: '10%', left: '10%' },
            { top: '10%', right: '10%' },
            { top: '30%', left: '5%' },
            { top: '30%', right: '5%' },
            { top: '50%', left: '8%' },
            { top: '50%', right: '8%' }
        ];
        
        setTimeout(() => {
            balloon.style.top = corners[index].top;
            balloon.style.left = corners[index].left || 'auto';
            balloon.style.right = corners[index].right || 'auto';
            balloon.style.transform = 'scale(0.8)';
            balloon.style.transition = 'all 3s ease-in-out';
        }, index * 200);
    });
    
    // Cake falling animation is handled by CSS
    
    openBtn.addEventListener('click', function() {
        // Flip the card to reveal the birthday message
        card.style.transform = 'rotateY(180deg)';
        
        // Add celebration effect
        setTimeout(() => {
            for (let i = 0; i < 15; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti-piece';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.animationDelay = Math.random() * 2 + 's';
                confetti.style.backgroundColor = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'][Math.floor(Math.random() * 8)];
                document.querySelector('.confetti').appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 3000);
            }
        }, 500);
    });

    // New: Blow candle interaction
    flame.addEventListener('click', function() {
        // Extinguish the flame
        flame.style.display = 'none';

        // Redirect to lead.html after short delay
        setTimeout(() => {
            window.location.href = 'lead.html';
        }, 1000);
    });
});
