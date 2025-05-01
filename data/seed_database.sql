-- Insertion d'un administrateur (mot de passe : Admin123!)
INSERT INTO "Users" (
    "firstName",
    "lastName",
    email,
    password,
    role,
    "isEmailVerified",
    "createdAt",
    "updatedAt"
) VALUES (
    'Admin',
    'System',
    'admin@qualiextra.com',
    '$argon2id$v=19$m=65536,t=3,p=4$UQe6KaunbpXpXjsq8f+RoA$2Hnx8B0H0CG1LF9JXIAYwCKJPdpUb+zTm2oR8dHJ+hQ',
    'admin',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insertion d'un utilisateur vérifié (mot de passe : User123!)
INSERT INTO "Users" (
    "firstName",
    "lastName",
    email,
    password,
    role,
    "isEmailVerified",
    "createdAt",
    "updatedAt"
) VALUES (
    'John',
    'Doe',
    'john.doe@example.com',
    '$argon2id$v=19$m=65536,t=3,p=4$h6g3LSI8SN3SABJNe4jpZQ$54An4wHM0lB7h7zG4MgMVu8g6I88YoQ8AfSzkG+UI1Y',
    'user',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insertion d'un utilisateur non vérifié (mot de passe : Test123!)
INSERT INTO "Users" (
    "firstName",
    "lastName",
    email,
    password,
    role,
    "isEmailVerified",
    "verificationToken",
    "createdAt",
    "updatedAt"
) VALUES (
    'Jane',
    'Smith',
    'jane.smith@example.com',
    '$argon2id$v=19$m=65536,t=3,p=4$NEJhJ1ixhZ6P1V+8FzMN2Q$cQ3xQ+ybMI0iOLH28CS0nWpvyOpz4l6vvIH04escVSA',
    'user',
    false,
    'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);