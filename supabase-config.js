// Supabase Configuration for Smart Saathi Movies Downloader
const SUPABASE_URL = 'https://eknblscjwlfxafjleokh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrbmJsc2Nqd2xmeGFmamxlb2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NjI2OTQsImV4cCI6MjA2ODQzODY5NH0.ONsU0kSbSpL0kAEo8KAQM2s0BHQZYEynOAd6-ooF2e8';

// Initialize Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Supabase Database Helper Functions
class SupabaseDB {
    constructor() {
        this.client = supabaseClient;
    }

    // Admin Authentication Functions
    async authenticateAdmin(email, password) {
        try {
            const { data, error } = await this.client
                .from('admin_users')
                .select('*')
                .eq('email', email)
                .eq('password', password)
                .single();

            if (error) {
                console.error('Authentication error:', error);
                return { success: false, error: error.message };
            }

            if (data) {
                return { success: true, user: data };
            } else {
                return { success: false, error: 'Invalid credentials' };
            }
        } catch (error) {
            console.error('Authentication error:', error);
            return { success: false, error: 'Authentication failed' };
        }
    }

    // Movie Management Functions
    async addMovie(movieData) {
        try {
            const { data, error } = await this.client
                .from('movies')
                .insert([movieData])
                .select()
                .single();

            if (error) {
                console.error('Add movie error:', error);
                return { success: false, error: error.message };
            }

            return { success: true, movie: data };
        } catch (error) {
            console.error('Add movie error:', error);
            return { success: false, error: 'Failed to add movie' };
        }
    }

    async getAllMovies() {
        try {
            const { data, error } = await this.client
                .from('movies')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Get movies error:', error);
                return { success: false, error: error.message };
            }

            return { success: true, movies: data || [] };
        } catch (error) {
            console.error('Get movies error:', error);
            return { success: false, error: 'Failed to fetch movies' };
        }
    }

    async getMovieById(movieId) {
        try {
            const { data, error } = await this.client
                .from('movies')
                .select('*')
                .eq('id', movieId)
                .single();

            if (error) {
                console.error('Get movie error:', error);
                return { success: false, error: error.message };
            }

            return { success: true, movie: data };
        } catch (error) {
            console.error('Get movie error:', error);
            return { success: false, error: 'Movie not found' };
        }
    }

    async deleteMovie(movieId) {
        try {
            const { error } = await this.client
                .from('movies')
                .delete()
                .eq('id', movieId);

            if (error) {
                console.error('Delete movie error:', error);
                return { success: false, error: error.message };
            }

            return { success: true };
        } catch (error) {
            console.error('Delete movie error:', error);
            return { success: false, error: 'Failed to delete movie' };
        }
    }

    async updateMovie(movieId, updateData) {
        try {
            const { data, error } = await this.client
                .from('movies')
                .update(updateData)
                .eq('id', movieId)
                .select()
                .single();

            if (error) {
                console.error('Update movie error:', error);
                return { success: false, error: error.message };
            }

            return { success: true, movie: data };
        } catch (error) {
            console.error('Update movie error:', error);
            return { success: false, error: 'Failed to update movie' };
        }
    }

    // Utility Functions
    generateMovieId() {
        return Math.random().toString(36).substr(2, 8);
    }

    generateShortLink(movieId) {
        const baseUrl = window.location.origin + window.location.pathname.replace('/index.html', '').replace('index.html', '');
        const fullPath = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
        return `${fullPath}index.html?movie=${movieId}`;
    }
}

// Initialize global Supabase database instance
window.supabaseDB = new SupabaseDB();
