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

### Added
- Configured Supabase `testimonials` table with `id`, `created_at`, `user_id`, `name`, `company`, and `text` columns.
- Implemented Row Level Security (RLS) policies in Supabase for `testimonials` table:
  - Allow anonymous `INSERT` for testimonial submission.
  - Allow authenticated users to `SELECT` their own testimonials.
  - Allow authenticated users to `INSERT` their own testimonials.

### Changed
- Switched backend services from Firebase to Supabase for authentication and database.
- Updated `js/auth.js` and `js/main.js` to use Supabase client library and API keys.
- Overhauled `css/style.css` with a professional design system, including a new color palette, typography, spacing, and responsive adjustments.
