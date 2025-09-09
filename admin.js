// Admin Panel JavaScript Functionality with Supabase
class AdminPanel {
    constructor() {
        this.isLoggedIn = false;
        this.movies = [];
        this.initializeEventListeners();
        this.loadMoviesFromDB();
    }

    initializeEventListeners() {
        // Admin button click
        document.getElementById('adminBtn').addEventListener('click', () => {
            this.openModal();
        });

        // Close modal
        document.querySelector('.admin-close').addEventListener('click', () => {
            this.closeModal();
        });

        // Close modal on outside click
        document.getElementById('adminModal').addEventListener('click', (e) => {
            if (e.target.id === 'adminModal') {
                this.closeModal();
            }
        });

        // Login functionality
        document.getElementById('loginBtn').addEventListener('click', () => {
            this.login();
        });

        // Enter key for email field
        document.getElementById('adminEmail').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('adminPassword').focus();
            }
        });

        // Enter key for password field
        document.getElementById('adminPassword').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.login();
            }
        });

        // Add movie functionality
        document.getElementById('addMovieBtn').addEventListener('click', () => {
            this.addMovie();
        });

        // Enter key for movie inputs
        document.getElementById('movieTitle').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('movieUrl').focus();
            }
        });

        document.getElementById('movieUrl').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addMovie();
            }
        });
    }

    openModal() {
        document.getElementById('adminModal').classList.remove('hidden');
        if (this.isLoggedIn) {
            this.showDashboard();
        } else {
            this.showLogin();
        }
    }

    closeModal() {
        document.getElementById('adminModal').classList.add('hidden');
        this.clearLoginError();
    }

    showLogin() {
        document.getElementById('adminLogin').classList.remove('hidden');
        document.getElementById('adminDashboard').classList.add('hidden');
        document.getElementById('adminEmail').focus();
    }

    showDashboard() {
        document.getElementById('adminLogin').classList.add('hidden');
        document.getElementById('adminDashboard').classList.remove('hidden');
        this.renderMoviesList();
    }

    async login() {
        const email = document.getElementById('adminEmail').value.trim();
        const password = document.getElementById('adminPassword').value;
        
        if (!email || !password) {
            this.showLoginError('Please enter both email and password');
            return;
        }

        try {
            const result = await window.supabaseDB.authenticateAdmin(email, password);
            
            if (result.success) {
                this.isLoggedIn = true;
                this.clearLoginError();
                this.showDashboard();
                document.getElementById('adminEmail').value = '';
                document.getElementById('adminPassword').value = '';
                await this.loadMoviesFromDB();
            } else {
                this.showLoginError(result.error || 'Invalid credentials');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showLoginError('Login failed. Please try again.');
        }
    }

    showLoginError(message = 'Incorrect email or password!') {
        const errorElement = document.getElementById('loginError');
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
        setTimeout(() => {
            this.clearLoginError();
        }, 3000);
    }

    clearLoginError() {
        document.getElementById('loginError').classList.add('hidden');
    }

    generateShortId() {
        return Math.random().toString(36).substr(2, 8);
    }

    generateShortLink(movieId) {
        const baseUrl = window.location.origin + window.location.pathname.replace('/index.html', '').replace('index.html', '');
        const fullPath = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
        return `${fullPath}index.html?movie=${movieId}`;
    }

    async addMovie() {
        const title = document.getElementById('movieTitle').value.trim();
        const url = document.getElementById('movieUrl').value.trim();

        if (!title || !url) {
            alert('Please fill in both movie title and URL');
            return;
        }

        if (!this.isValidUrl(url)) {
            alert('Please enter a valid URL');
            return;
        }

        const movieId = window.supabaseDB.generateMovieId();
        const shortLink = window.supabaseDB.generateShortLink(movieId);

        const movieData = {
            id: movieId,
            title: title,
            original_url: url,
            short_link: shortLink
        };

        try {
            const result = await window.supabaseDB.addMovie(movieData);
            
            if (result.success) {
                await this.loadMoviesFromDB();
                this.renderMoviesList();
                
                // Clear inputs
                document.getElementById('movieTitle').value = '';
                document.getElementById('movieUrl').value = '';
                
                this.showSuccessMessage('Movie added successfully!');
            } else {
                alert('Failed to add movie: ' + result.error);
            }
        } catch (error) {
            console.error('Add movie error:', error);
            alert('Failed to add movie. Please try again.');
        }
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    async deleteMovie(movieId) {
        if (confirm('Are you sure you want to delete this movie?')) {
            try {
                const result = await window.supabaseDB.deleteMovie(movieId);
                
                if (result.success) {
                    await this.loadMoviesFromDB();
                    this.renderMoviesList();
                    this.showSuccessMessage('Movie deleted successfully!');
                } else {
                    alert('Failed to delete movie: ' + result.error);
                }
            } catch (error) {
                console.error('Delete movie error:', error);
                alert('Failed to delete movie. Please try again.');
            }
        }
    }

    copyToClipboard(text, button) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                button.style.background = '#2ecc71';
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.background = '#4ecdc4';
                }, 2000);
            }).catch(err => {
                // Fallback for older browsers
                this.fallbackCopyTextToClipboard(text, button);
            });
        } else {
            // Fallback for older browsers
            this.fallbackCopyTextToClipboard(text, button);
        }
    }

    fallbackCopyTextToClipboard(text, button) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                button.style.background = '#2ecc71';
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.background = '#4ecdc4';
                }, 2000);
            }
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }

        document.body.removeChild(textArea);
    }

    renderMoviesList() {
        const moviesList = document.getElementById('moviesList');
        
        if (this.movies.length === 0) {
            moviesList.innerHTML = '<p style="color: #999; text-align: center; padding: 2rem;">No movies added yet.</p>';
            return;
        }

        moviesList.innerHTML = this.movies.map(movie => `
            <div class="movie-item">
                <div class="movie-title">${movie.title}</div>
                <div class="movie-details">Added: ${new Date(movie.created_at).toLocaleDateString()}</div>
                <div class="movie-details">Original URL: <a href="${movie.original_url}" target="_blank" style="color: #4ecdc4;">${movie.original_url}</a></div>
                <div class="movie-links">
                    <div class="short-link">${movie.short_link}</div>
                    <button class="copy-btn" onclick="adminPanel.copyToClipboard('${movie.short_link}', this)">Copy Link</button>
                    <button class="delete-btn" onclick="adminPanel.deleteMovie('${movie.id}')">Delete</button>
                </div>
            </div>
        `).join('');
    }

    showSuccessMessage(message) {
        // Create temporary success message
        const successDiv = document.createElement('div');
        successDiv.textContent = message;
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #2ecc71;
            color: white;
            padding: 1rem 2rem;
            border-radius: 5px;
            z-index: 3000;
            font-weight: 600;
        `;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            document.body.removeChild(successDiv);
        }, 3000);
    }

    async loadMoviesFromDB() {
        try {
            const result = await window.supabaseDB.getAllMovies();
            
            if (result.success) {
                this.movies = result.movies;
            } else {
                console.error('Failed to load movies:', result.error);
                this.movies = [];
            }
        } catch (error) {
            console.error('Load movies error:', error);
            this.movies = [];
        }
    }

    // Public method to get movie by ID (used by download page)
    async getMovieById(movieId) {
        try {
            const result = await window.supabaseDB.getMovieById(movieId);
            return result.success ? result.movie : null;
        } catch (error) {
            console.error('Get movie by ID error:', error);
            return null;
        }
    }

    // Public method to get all movies
    getAllMovies() {
        return this.movies;
    }
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.adminPanel = new AdminPanel();
});

// URL parameter handling for auto-generated links
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('movie');
    
    if (movieId) {
        // Store the movie ID for the download page to use
        sessionStorage.setItem('currentMovieId', movieId);
        
        // Check if movie exists
        const adminPanel = new AdminPanel();
        const movie = adminPanel.getMovieById(movieId);
        
        if (!movie) {
            // Movie not found, redirect to main page
            window.location.href = window.location.pathname;
        }
        // If movie exists, continue with normal flow
    }
});
