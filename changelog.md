# Changelog

## [0.1.0] - 2025-07-19

### Added
- Initialized the "Testimonial Catcher" project.
- Created this `changelog.md` file to track progress.

### Added
- Configured Supabase `testimonials` table with `id`, `created_at`, `user_id`, `name`, `company`, and `text` columns.
- Implemented Row Level Security (RLS) policies in Supabase for `testimonials` table:
  - Allow anonymous `INSERT` for testimonial submission.
  - Allow authenticated users to `SELECT` their own testimonials.
  - Allow authenticated users to `INSERT` their own testimonials.

### Changed
- Switched backend services from Firebase to Supabase for authentication and database.
- Updated `js/auth.js` and `js/main.js` to use Supabase client library and API keys.
