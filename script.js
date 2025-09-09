// Landing Page JavaScript Functionality
document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('startBtn');
    const countdownSection = document.getElementById('countdownSection');
    const countdownElement = document.getElementById('countdown');
    const downloadBtn = document.getElementById('downloadBtn');
    
    let countdownTimer;
    let isCountdownActive = false;

    // Start button click handler
    startBtn.addEventListener('click', function() {
        if (!isCountdownActive) {
            startCountdown();
            startBtn.style.display = 'none';
            countdownSection.classList.remove('hidden');
        }
    });

    // Countdown function
    function startCountdown() {
        let timeLeft = 8;
        isCountdownActive = true;
        
        countdownElement.textContent = timeLeft;
        
        countdownTimer = setInterval(function() {
            timeLeft--;
            countdownElement.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(countdownTimer);
                isCountdownActive = false;
                showDownloadButton();
            }
        }, 1000);
    }

    // Show download button after countdown
    function showDownloadButton() {
        downloadBtn.classList.remove('hidden');
        downloadBtn.style.animation = 'fadeInUp 0.5s ease';
        
        // Remove automatic scroll - user will scroll manually
    }

    // Download button click handler - redirect to Page 2
    downloadBtn.addEventListener('click', function() {
        // Add a loading effect
        downloadBtn.textContent = 'Redirecting...';
        downloadBtn.style.opacity = '0.7';
        
        // Redirect after a short delay for better UX
        setTimeout(function() {
            // Check if we have a movie ID from URL parameter
            const urlParams = new URLSearchParams(window.location.search);
            const movieId = urlParams.get('movie');
            
            if (movieId) {
                // Store movie ID for download page
                sessionStorage.setItem('currentMovieId', movieId);
                window.location.href = 'download.html';
            } else {
                // No movie ID, redirect to download page normally
                window.location.href = 'download.html';
            }
        }, 500);
    });

    // Smooth scrolling for better user experience
    function smoothScrollToElement(element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }

    // Add scroll event listener to detect when user scrolls down
    let hasScrolled = false;
    window.addEventListener('scroll', function() {
        if (!hasScrolled && window.scrollY > 100) {
            hasScrolled = true;
            // Add a subtle animation when user starts scrolling
            if (!downloadBtn.classList.contains('hidden')) {
                downloadBtn.style.animation = 'pulse 2s infinite';
            }
        }
    });

    // Add keyboard support for accessibility
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            if (document.activeElement === startBtn && !isCountdownActive) {
                event.preventDefault();
                startBtn.click();
            } else if (document.activeElement === downloadBtn) {
                event.preventDefault();
                downloadBtn.click();
            }
        }
    });
});
