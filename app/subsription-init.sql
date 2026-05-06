-- Run this against yomite-db to add subscription support
-- Subscription plans reference table
CREATE TABLE IF NOT EXISTS subscription_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(20) NOT NULL UNIQUE,      -- 'free' | 'student' | 'regular'
    name VARCHAR(50) NOT NULL,
    price_usd DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    catalog_access ENUM('limited','full') NOT NULL DEFAULT 'limited',
    max_devices TINYINT NOT NULL DEFAULT 1,
    early_chapter_access TINYINT(1) NOT NULL DEFAULT 0,
    studio_events TINYINT(1) NOT NULL DEFAULT 0,
    requires_verification TINYINT(1) NOT NULL DEFAULT 0
);

INSERT IGNORE INTO subscription_plans
    (slug, name, price_usd, catalog_access, max_devices, early_chapter_access, studio_events, requires_verification)
VALUES
    ('free',    'Yomite Free',    0.00, 'limited', 1, 0, 0, 0),
    ('student', 'Yomite Student', 5.00, 'full',    1, 1, 0, 1),
    ('regular', 'Yomite Regular', 10.00,'full',    3, 1, 1, 0);

-- Active subscription per user
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    plan_slug VARCHAR(20) NOT NULL DEFAULT 'free',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    renews_at DATE DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_slug) REFERENCES subscription_plans(slug) ON UPDATE CASCADE
);