let supabase; // Declare it here so it's accessible within the DOMContentLoaded

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Supabase client here, after DOM is ready and Supabase CDN is loaded
    supabase = window.supabase; // Use the globally available supabase object

    // --- DOM Elements ---
    const logoutButton = document.getElementById('logout-button');
    const testimonialLink = document.getElementById('testimonial-link');
    const embedCodeSnippet = document.getElementById('embed-code-snippet');
    const copyEmbedCodeButton = document.getElementById('copy-embed-code');
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

        // Generate and display embed code
        const embedCode = `<iframe src="${window.location.origin}/public/embed.html?user=${user.id}" style="width:100%; height:500px; border:none;" title="Testimonials"></iframe>`;
        if (embedCodeSnippet) {
            embedCodeSnippet.value = embedCode;
        }

        // Attach event listener for copy embed code button
        if (copyEmbedCodeButton) {
            copyEmbedCodeButton.addEventListener('click', () => {
                navigator.clipboard.writeText(embedCode).then(() => {
                    const originalText = copyEmbedCodeButton.textContent;
                    copyEmbedCodeButton.textContent = 'Copied!';
                    setTimeout(() => {
                        copyEmbedCodeButton.textContent = originalText;
                    }, 1500);
                }).catch(err => {
                    console.error('Failed to copy embed code: ', err);
                    alert('Failed to copy embed code.');
                });
            });
        }

        // Load testimonials
        loadTestimonials(user.id);
    }

    async function loadTestimonials(userId){
        const { data, error } = await supabase
            .from('testimonials')
            .select('id, name, company, text, status, rating') // Select rating as well
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
                div.className = 'testimonial-card';
                let statusClass = '';
                if (testimonial.status === 'approved') {
                    statusClass = 'testimonial-approved';
                } else if (testimonial.status === 'rejected') {
                    statusClass = 'testimonial-rejected';
                } else {
                    statusClass = 'testimonial-pending';
                }

                // Generate star display
                const stars = testimonial.rating ? '★'.repeat(testimonial.rating) + '☆'.repeat(5 - testimonial.rating) : '';

                div.innerHTML = `
                    <p class="testimonial-text">${testimonial.text}</p>
                    <p class="testimonial-author"><strong>${testimonial.name}</strong>${testimonial.company ? `, ${testimonial.company}` : ''}</p>
                    ${testimonial.rating ? `<div class="testimonial-rating">${stars}</div>` : ''}
                    <div class="testimonial-actions">
                        <span class="testimonial-status ${statusClass}">${testimonial.status.toUpperCase()}</span>
                        <button class="copy-btn" data-text="${testimonial.text}">Copy</button>
                        ${testimonial.status !== 'approved' ? `<button class="approve-btn" data-id="${testimonial.id}">Approve</button>` : ''}
                        ${testimonial.status !== 'rejected' ? `<button class="reject-btn" data-id="${testimonial.id}">Reject</button>` : ''}
                    </div>
                `;
                testimonialsList.appendChild(div);
            });

            // Attach event listeners to copy buttons
            document.querySelectorAll('.copy-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const textToCopy = e.target.dataset.text;
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        const originalText = e.target.textContent;
                        e.target.textContent = 'Copied!';
                        setTimeout(() => {
                            e.target.textContent = originalText;
                        }, 1500);
                    }).catch(err => {
                        console.error('Failed to copy text: ', err);
                        alert('Failed to copy testimonial.');
                    });
                });
            });

            // Attach event listeners for Approve/Reject buttons
            document.querySelectorAll('.approve-btn').forEach(button => {
                button.addEventListener('click', (e) => updateTestimonialStatus(e.target.dataset.id, 'approved'));
            });
            document.querySelectorAll('.reject-btn').forEach(button => {
                button.addEventListener('click', (e) => updateTestimonialStatus(e.target.dataset.id, 'rejected'));
            });
        }
    }

    async function updateTestimonialStatus(testimonialId, newStatus) {
        const { data, error } = await supabase
            .from('testimonials')
            .update({ status: newStatus })
            .eq('id', testimonialId);

        if (error) {
            console.error('Error updating testimonial status:', error.message);
            alert('Failed to update testimonial status.');
        } else {
            console.log(`Testimonial ${testimonialId} status updated to ${newStatus}`);
            // UI will automatically update due to onSnapshot in loadTestimonials
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

            const selectedRating = document.querySelector('input[name="rating"]:checked');
            const ratingValue = selectedRating ? parseInt(selectedRating.value) : null;

            const { error } = await supabase
                .from('testimonials')
                .insert([
                    {
                        user_id: userId,
                        name: document.getElementById('customer-name').value,
                        company: document.getElementById('customer-company').value,
                        text: document.getElementById('testimonial-text').value,
                        status: 'pending', // Default status for new testimonials
                        rating: ratingValue
                    }
                ]);

            if (error) {
                alert('Error submitting testimonial: ' + error.message);
            } else {
                testimonialForm.innerHTML = '<h2>Thank you for your feedback!</h2><p>Your testimonial has been submitted and is awaiting approval.</p>';
            }
        });
    }
});