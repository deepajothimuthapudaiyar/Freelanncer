-- ==========================================================
-- Freelancer Project Management System - Database Setup
-- ==========================================================
-- Hibernate (spring.jpa.hibernate.ddl-auto=update) will AUTOMATICALLY
-- create/update all tables based on the JPA entities when the Spring
-- Boot application starts. You do NOT need to manually create tables.
--
-- This script only creates the database itself and optionally inserts
-- sample data AFTER you have started the backend at least once (so the
-- tables already exist).
-- ==========================================================

CREATE DATABASE IF NOT EXISTS freelancer_db;
USE freelancer_db;

-- ==========================================================
-- OPTIONAL SAMPLE DATA
-- Run this AFTER starting the Spring Boot app at least once,
-- so Hibernate has already created the tables below.
--
-- Passwords below are BCrypt hashes of the plaintext password: Password123
-- (BCrypt hash: $2a$10$DowQhKz1c5bF1M3wG6r36eYq4Q7VYFhE1BqzP3v9wztt6E8sVYWWK)
-- You can log in using email + "Password123" for every sample user below.
-- ==========================================================

INSERT INTO users (name, email, password, role, created_at) VALUES
('Admin User', 'admin@freelancerhub.com', '$2a$10$DowQhKz1c5bF1M3wG6r36eYq4Q7VYFhE1BqzP3v9wztt6E8sVYWWK', 'ROLE_ADMIN', NOW()),
('Alice Client', 'alice@client.com', '$2a$10$DowQhKz1c5bF1M3wG6r36eYq4Q7VYFhE1BqzP3v9wztt6E8sVYWWK', 'ROLE_CLIENT', NOW()),
('Bob Client', 'bob@client.com', '$2a$10$DowQhKz1c5bF1M3wG6r36eYq4Q7VYFhE1BqzP3v9wztt6E8sVYWWK', 'ROLE_CLIENT', NOW()),
('Charlie Freelancer', 'charlie@freelancer.com', '$2a$10$DowQhKz1c5bF1M3wG6r36eYq4Q7VYFhE1BqzP3v9wztt6E8sVYWWK', 'ROLE_FREELANCER', NOW()),
('Dana Freelancer', 'dana@freelancer.com', '$2a$10$DowQhKz1c5bF1M3wG6r36eYq4Q7VYFhE1BqzP3v9wztt6E8sVYWWK', 'ROLE_FREELANCER', NOW());

INSERT INTO freelancer_profiles (user_id, skills, bio, portfolio, average_rating)
SELECT id, 'React, Node.js, Java, Spring Boot', 'Full-stack developer with 5 years experience.', 'https://portfolio.example.com/charlie', 0.0
FROM users WHERE email = 'charlie@freelancer.com';

INSERT INTO freelancer_profiles (user_id, skills, bio, portfolio, average_rating)
SELECT id, 'UI/UX Design, Figma, CSS', 'Product designer specializing in web apps.', 'https://portfolio.example.com/dana', 0.0
FROM users WHERE email = 'dana@freelancer.com';

INSERT INTO projects (title, description, budget, deadline, status, client_id, created_at)
SELECT 'Build an E-commerce Website', 'Need a full-stack e-commerce site with cart and checkout.', 2500.00, '2026-09-30', 'OPEN', id, NOW()
FROM users WHERE email = 'alice@client.com';

INSERT INTO projects (title, description, budget, deadline, status, client_id, created_at)
SELECT 'Redesign Company Logo', 'Looking for a modern, minimal logo redesign.', 400.00, '2026-09-15', 'OPEN', id, NOW()
FROM users WHERE email = 'bob@client.com';

-- ==========================================================
-- Notes:
-- - Do NOT insert plain-text passwords. All sample passwords above
--   are BCrypt hashes of "Password123".
-- - If ddl-auto=update is not able to create tables because the
--   application hasn't started, run the app first, then this script.
-- ==========================================================
