// Download Page JavaScript Functionality with Supabase
document.addEventListener('DOMContentLoaded', async function() {
    const finalDownloadBtn = document.getElementById('finalDownloadBtn');
    
    // Get current movie ID from session storage
    const currentMovieId = sessionStorage.getItem('currentMovieId');
    let movieDownloadUrl = 'https://example.com/movie-download'; // Default fallback
    
    // If we have a movie ID, get the actual download URL from Supabase
    if (currentMovieId) {
        try {
            const result = await window.supabaseDB.getMovieById(currentMovieId);
            if (result.success && result.movie) {
                movieDownloadUrl = result.movie.original_url;
                console.log('Movie found:', result.movie.title, 'URL:', movieDownloadUrl);
            } else {
                console.log('Movie not found for ID:', currentMovieId);
                // Redirect back to main page if movie not found
                window.location.href = 'index.html';
                return;
            }
        } catch (error) {
            console.error('Error fetching movie:', error);
            // Redirect back to main page on error
            window.location.href = 'index.html';
            return;
        }
    }
    
    // Final download button click handler
    finalDownloadBtn.addEventListener('click', function() {
        // Add loading effect
        finalDownloadBtn.textContent = 'Opening Download...';
        finalDownloadBtn.style.opacity = '0.7';
        finalDownloadBtn.disabled = true;
        
        // Simulate processing time for better UX
        setTimeout(function() {
            // Open the movie download link
            window.open(movieDownloadUrl, '_blank');
            
            // Reset button after opening link
            setTimeout(function() {
                finalDownloadBtn.textContent = 'Click Here';
                finalDownloadBtn.style.opacity = '1';
                finalDownloadBtn.disabled = false;
            }, 1000);
        }, 800);
    });

    // Add keyboard support for accessibility
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            if (document.activeElement === finalDownloadBtn) {
                event.preventDefault();
                finalDownloadBtn.click();
            }
        }
    });

    // Add entrance animation
    setTimeout(function() {
        finalDownloadBtn.style.animation = 'pulse 2s infinite';
    }, 1000);
});
