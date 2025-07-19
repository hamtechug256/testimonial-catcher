// --- Supabase Configuration ---
const SUPABASE_URL = 'https://pgiqfrehalcccuavkfpp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaXFmcmVoYWxjY2N1YXZrZnBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5Mzc4MTQsImV4cCI6MjA2ODUxMzgxNH0.PfqBYqc72IqJKWCQXFkRiATuUytPyMSKI3qgUaSquT8';

let supabase; // Declare it here so it's accessible within the DOMContentLoaded

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Supabase client here, after DOM is ready and Supabase CDN is loaded
    supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // --- DOM Elements ---
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');

    // --- Event Listeners ---

    // Show/Hide Forms
    if (showSignup) {
        showSignup.addEventListener('click', (e) => {
            e.preventDefault();
            if (loginForm) loginForm.style.display = 'none';
            if (signupForm) signupForm.style.display = 'block';
        });
    }

    if (showLogin) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            if (loginForm) loginForm.style.display = 'block';
            if (signupForm) signupForm.style.display = 'none';
        });
    }

    // --- Authentication Logic ---

    // Signup
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;

            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
            });

            if (error) {
                alert(error.message);
            } else {
                alert('Signup successful! Please check your email to confirm your account.');
                window.location.href = 'login.html';
            }
        });
    }

    // Login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                alert(error.message);
            } else {
                window.location.href = 'dashboard.html';
            }
        });
    }
});