-- Drop tables if they exist, in order of dependency

-- these should be run iff, you wanna delete the db data, or at initialization

-- DROP TABLE IF EXISTS "game_scores";
-- DROP TABLE IF EXISTS "users";

-- Create the 'users' table
CREATE TABLE IF NOT EXISTS "users" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "username" VARCHAR(50) UNIQUE NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "avatar_key" VARCHAR(20) NOT NULL CHECK ("avatar_key" IN ('fire', 'water', 'air', 'earth', 'lightning', 'ice')),
    "created_at" TIMESTAMPTZ DEFAULT NOW()
);

-- Create the 'game_scores' table
CREATE TABLE IF NOT EXISTS "game_scores" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "game_type" VARCHAR(50) NOT NULL,
    "difficulty" VARCHAR(20) NOT NULL,
    "avg_score_time_ms" INTEGER NOT NULL,
    "avg_accuracy" FLOAT, -- This will be null for games without accuracy
    "created_at" TIMESTAMPTZ DEFAULT NOW()
);


-- -- ----------------------------
-- -- POPULATE USERS
-- -- ----------------------------

-- INSERT INTO "users" ("id", "email", "username", "password_hash", "avatar_key", "created_at") VALUES
-- ('e29fc75e-3b81-4292-bf53-f66de51c9ee6', 'alice@example.com', 'alice', '$2a$10$k1N.k1j.k1N.k1j.k1N.k1j.k1N.k1j.k1N.k1j.k1N.k1j.k1N.k1', 'fire', '2025-11-01 10:39:29.539394+05:30'),
-- ('a8d20a3b-2248-4e9f-8c51-2eaa7e65b91c', 'bob@example.com', 'bob', '$2a$10$j.U.S.t.A.n.o.t.h.e.r.H.a.s.h.o.F.B.i.t.d.L.A.S.A.u', 'water', '2025-11-01 10:39:49.376473+05:30'),
-- ('ed4a96ad-ccce-4483-90e2-b9f6537334c2', 'marko@example.com', 'marko', '$2a$10$f.o.r.T.h.e.L.o.v.e.o.f.G.o.d.u.P.v.d.A.e.Q.S.T.w.u', 'lightning', '2025-11-01 10:40:09.661819+05:30')
-- ON CONFLICT ("id") DO NOTHING;


-- -- ----------------------------
-- -- POPULATE GAME SCORES
-- -- ----------------------------
-- INSERT INTO "game_scores" ("user_id", "game_type", "difficulty", "avg_score_time_ms", "avg_accuracy", "created_at") VALUES
-- ('e29fc75e-3b81-4292-bf53-f66de51c9ee6', 'visual_simple', 'medium', 285, NULL, NOW() - interval '1 day'),
-- ('e29fc75e-3b81-4292-bf53-f66de51c9ee6', 'visual_choice', 'medium', 410, 0.95, NOW() - interval '2 days'),
-- ('e29fc75e-3b81-4292-bf53-f66de51c9ee6', 'auditory_simple', 'easy', 315, NULL, NOW() - interval '2 days 3 hours'),
-- ('e29fc75e-3b81-4292-bf53-f66de51c9ee6', 'simon_game', 'medium', 3200, 1.0, NOW() - interval '3 days'),
-- ('e29fc75e-3b81-4292-bf53-f66de51c9ee6', 'stroop_effect', 'easy', 650, 0.9, NOW() - interval '4 days'),
-- ('e29fc75e-3b81-4292-bf53-f66de51c9ee6', 'number_order', 'medium', 4800, 1.0, NOW() - interval '5 days'),
-- ('e29fc75e-3b81-4292-bf53-f66de51c9ee6', 'visual_simple', 'medium', 270, NULL, NOW() - interval '6 days');

-- INSERT INTO "game_scores" ("user_id", "game_type", "difficulty", "avg_score_time_ms", "avg_accuracy", "created_at") VALUES
-- ('a8d20a3b-2248-4e9f-8c51-2eaa7e65b91c', 'visual_simple', 'easy', 380, NULL, NOW() - interval '1 day'),
-- ('a8d20a3b-2248-4e9f-8c51-2eaa7e65b91c', 'visual_simple', 'easy', 365, NULL, NOW() - interval '2 days 1 hour'),
-- ('a8d20a3b-2248-4e9f-8c51-2eaa7e65b91c', 'auditory_simple', 'easy', 410, NULL, NOW() - interval '3 days');

-- INSERT INTO "game_scores" ("user_id", "game_type", "difficulty", "avg_score_time_ms", "avg_accuracy", "created_at") VALUES
-- ('ed4a96ad-ccce-4483-90e2-b9f6537334c2', 'visual_simple', 'hard', 195, NULL, NOW() - interval '1 hour'),
-- ('ed4a96ad-ccce-4483-90e2-b9f6537334c2', 'auditory_simple', 'hard', 180, NULL, NOW() - interval '2 hours'),
-- ('ed4a96ad-ccce-4483-90e2-b9f6537334c2', 'visual_choice', 'hard', 310, 0.98, NOW() - interval '3 hours'),
-- ('ed4a96ad-ccce-4483-90e2-b9f6537334c2', 'simon_game', 'hard', 2800, 0.9, NOW() - interval '1 day 4 hours'),
-- ('ed4a96ad-ccce-4483-90e2-b9f6537334c2', 'stroop_effect', 'hard', 520, 0.85, NOW() - interval '2 days 5 hours'),
-- ('ed4a96ad-ccce-4483-90e2-b9f6537334c2', 'number_order', 'hard', 4100, 0.9, NOW() - interval '3 days 6 hours');
