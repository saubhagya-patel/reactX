-- Drop tables if they exist, in order of dependency
DROP TABLE IF EXISTS "game_scores";
DROP TABLE IF EXISTS "users";

-- Create the 'users' table
CREATE TABLE "users" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "username" VARCHAR(50) UNIQUE NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "avatar_key" VARCHAR(20) NOT NULL CHECK ("avatar_key" IN ('fire', 'water', 'air', 'earth', 'lightning', 'ice')),
    "created_at" TIMESTAMPTZ DEFAULT NOW()
);

-- Create the 'game_scores' table
CREATE TABLE "game_scores" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "game_type" VARCHAR(50) NOT NULL,
    "difficulty" VARCHAR(20) NOT NULL,
    "avg_score_time_ms" INTEGER NOT NULL,
    "avg_accuracy" FLOAT, -- This will be null for games without accuracy
    "created_at" TIMESTAMPTZ DEFAULT NOW()
);
