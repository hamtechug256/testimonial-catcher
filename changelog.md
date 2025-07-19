# Changelog

## [0.1.0] - 2025-07-19

### Added
- Initialized the "Testimonial Catcher" project.
- Created this `changelog.md` file to track progress.
- Set up GitHub repository for version control.
- Deployed the application to Netlify for continuous deployment.
- Implemented "Copy to Clipboard" functionality for testimonials on the dashboard.
- Refined testimonial display on the dashboard with a card-based layout.
- Implemented Testimonial Moderation & Status: Added `status` column to Supabase `testimonials` table, and added Approve/Reject buttons on the dashboard.
- Implemented Testimonial Rating: Added `rating` column to Supabase `testimonials` table, added star rating input to public submission form, and displayed ratings on dashboard testimonial cards.
- Implemented Embeddable Public Testimonial Widget: Created `public/embed.html` to display approved testimonials, updated Supabase RLS for public read access to approved testimonials, and added embed code generation/copy to dashboard.

### Added
- Configured Supabase `testimonials` table with `id`, `created_at`, `user_id`, `name`, `company`, and `text` columns.
- Implemented Row Level Security (RLS) policies in Supabase for `testimonials` table:
  - Allow anonymous `INSERT` for testimonial submission.
  - Allow authenticated users to `SELECT` their own testimonials.
  - Allow authenticated users to `INSERT` their own testimonials.

### Fixed
- Resolved bug where login/signup buttons and links were unresponsive by correctly loading Supabase client and JavaScript files (removing `type="module"` from script tags and using global `Supabase` object).
- Further resolved login/signup button and link unresponsiveness by ensuring DOM elements are loaded before attaching event listeners in `js/auth.js`.
- Applied the same `DOMContentLoaded` and `supabase` initialization fix to `js/main.js`.
- **- Resolved `Uncaught ReferenceError: Supabase is not defined` by ensuring the Supabase client is initialized globally in an inline script immediately after the Supabase CDN script in all HTML files.**
