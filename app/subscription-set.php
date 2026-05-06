<?php
    session_start();
    header('Content-Type: application/json');
    require_once __DIR__ . '/../db.php';

    if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
        echo json_encode(['success' => false, 'error' => 'Not logged in.']);
        exit();
    }

    $user_id = $_SESSION['id'] ?? $_SESSION['user_id'];
    $slug    = trim($_POST['plan'] ?? '');

    $allowed = ['free', 'student', 'regular'];
    if (!in_array($slug, $allowed)) {
        echo json_encode(['success' => false, 'error' => 'Invalid plan.']);
        exit();
    }

    // Verify the plan exists in plans table
    $check = $conn->prepare("SELECT slug FROM subscription_plans WHERE slug = ?");
    $check->bind_param("s", $slug);
    $check->execute();
    $check->store_result();
    if ($check->num_rows === 0) {
        echo json_encode(['success' => false, 'error' => 'Plan not found.']);
        $check->close(); $conn->close(); exit();
    }
    $check->close();

    // Upsert — insert or update existing row
    $renews = date('Y-m-d', strtotime('+1 month'));

    $stmt = $conn->prepare("
        INSERT INTO user_subscriptions (user_id, plan_slug, started_at, renews_at)
        VALUES (?, ?, NOW(), ?)
        ON DUPLICATE KEY UPDATE
            plan_slug  = VALUES(plan_slug),
            started_at = NOW(),
            renews_at  = VALUES(renews_at)
    ");
    $stmt->bind_param("iss", $user_id, $slug, $renews);
    $stmt->execute();
    $stmt->close();
    $conn->close();

    echo json_encode(['success' => true, 'plan' => $slug]);
?>