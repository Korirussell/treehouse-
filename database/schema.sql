-- HostAI Database Schema
-- Note: Create the database manually first: createdb hostai
-- Or use: docker-compose exec postgres psql -U hostai -c "CREATE DATABASE hostai;"

-- Listings table
CREATE TABLE IF NOT EXISTS listings (
    id SERIAL PRIMARY KEY,
    host_input_facts JSONB NOT NULL,
    ai_description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at);

