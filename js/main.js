// --- Supabase Configuration ---
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://pgiqfrehalcccuavkfpp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaXFmcmVoYWxjY2N1YXZrZnBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5Mzc4MTQsImV4cCI6MjA2ODUxMzgxNH0.PfqBYqc72IqJKWCQXFkRiATuUytPyMSKI3qgUaSquT8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- DOM Elements ---
const logoutButton = document.getElementById('logout-button');
const testimonialLink = document.getElementById('testimonial-link');
const testimonialsList = document.getElementById('testimonials-list');
const testimonialForm = document.getElementById('testimonial-form');

// --- Event Listeners ---
if(logoutButton) {
    logoutButton.addEventListener('click', async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            window.location.href = 'index.html';
        } else {
            alert('Logout failed: ' + error.message);
        }
    });
}

// --- Main Logic ---

// Check if a user is logged in
supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
        // User is signed in.
        if(window.location.pathname.includes('dashboard.html')){
            setupDashboard(session.user);
        }
    } else {
        // No user is signed in.
        // If on a protected page, redirect to login
        if(window.location.pathname.includes('dashboard.html')){
            window.location.href = 'login.html';
        }
    }
});

async function setupDashboard(user){
    // Set the testimonial link
    const link = `${window.location.origin}/public/index.html?user=${user.id}`;
    testimonialLink.href = link;
    testimonialLink.textContent = link;

    // Load testimonials
    loadTestimonials(user.id);
}

async function loadTestimonials(userId){
    const { data, error } = await supabase
        .from('testimonials')
        .select('name, company, text')
        .eq('user_id', userId);

    if (error) {
        console.error('Error loading testimonials:', error.message);
        testimonialsList.innerHTML = '<p>Error loading testimonials.</p>';
        return;
    }

    testimonialsList.innerHTML = ''; // Clear the list
    if (data.length === 0) {
        testimonialsList.innerHTML = '<p>No testimonials yet. Share your link to start collecting!</p>';
    } else {
        data.forEach(testimonial => {
            const div = document.createElement('div');
            div.className = 'testimonial';
            div.innerHTML = `
                <p><strong>${testimonial.name}</strong> from ${testimonial.company || 'N/A'}</p>
                <p>${testimonial.text}</p>
            `;
            testimonialsList.appendChild(div);
        });
    }
}


if(testimonialForm){
    testimonialForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('user');

        if(!userId){
            return alert('This form is not linked to a user. Please ensure you are using the correct link.');
        }

        const { error } = await supabase
            .from('testimonials')
            .insert([
                {
                    user_id: userId,
                    name: document.getElementById('customer-name').value,
                    company: document.getElementById('customer-company').value,
                    text: document.getElementById('testimonial-text').value,
                }
            ]);

        if (error) {
            alert('Error submitting testimonial: ' + error.message);
        } else {
            testimonialForm.innerHTML = '<h2>Thank you for your feedback!</h2><p>Your testimonial has been submitted.</p>';
        }
    });
}