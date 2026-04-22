CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    username    VARCHAR(100) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE food (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL UNIQUE,
    calories    NUMERIC(7, 2) NOT NULL,
    carbos      NUMERIC(7, 2) NOT NULL,
    protein     NUMERIC(7, 2) NOT NULL,
    fat         NUMERIC(7, 2) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE diet (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    food_id     INTEGER NOT NULL REFERENCES food(id) ON DELETE CASCADE,
    quantity_g  NUMERIC(7, 2) NOT NULL,
    date        DATE NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE metrics (
    id           SERIAL PRIMARY KEY,
    user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    weight       NUMERIC(5, 2),
    fat_percent  NUMERIC(5, 2),
    muscle_kg    NUMERIC(5, 2),
    photo_url    TEXT,
    date         DATE NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO users (username, password)
VALUES ('sunless-dev1', '$2a$12$EeTWVxl3FDx3BYAG95B/cuKI3EP36mUTCX5ShCwOKH.Q4ATg7bq3S');