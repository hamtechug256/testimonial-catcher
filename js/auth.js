// --- Supabase Configuration ---
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://pgiqfrehalcccuavkfpp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaXFmcmVoYWxjY2N1YXZrZnBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5Mzc4MTQsImV4cCI6MjA2ODUxMzgxNH0.PfqBYqc72IqJKWCQXFkRiATuUytPyMSKI3qgUaSquT8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- DOM Elements ---
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const showSignup = document.getElementById('show-signup');
const showLogin = document.getElementById('show-login');

// --- Event Listeners ---

// Show/Hide Forms
showSignup.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
});

showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
});

// --- Authentication Logic ---

// Signup
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
        // Supabase requires email confirmation by default.
        // After confirmation, the user can log in.
        // For now, we'll just alert and let them manually go to login.
        // In a real app, you might redirect to a "check your email" page.
        window.location.href = 'login.html'; // Redirect back to login to wait for confirmation
    }
});

// Login
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