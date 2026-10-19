<?php
    session_start();
    header('Content-Type: application/json');
    require_once __DIR__ . '/../db.php';

    if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
        echo json_encode(['success' => false, 'error' => 'Not logged in.']);
        exit();
    }

    $user_id = $_SESSION['id'] ?? $_SESSION['user_id'];

    $stmt = $conn->prepare("
        SELECT us.plan_slug, us.started_at, us.renews_at,
               sp.name, sp.price_usd, sp.catalog_access,
               sp.max_devices, sp.early_chapter_access,
               sp.studio_events
        FROM user_subscriptions us
        JOIN subscription_plans sp ON sp.slug = us.plan_slug
        WHERE us.user_id = ?
    ");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $res = $stmt->get_result();

    if ($row = $res->fetch_assoc()) {
        echo json_encode(['success' => true, 'subscription' => $row]);
    } else {
        // User has no subscription row — treat as Free
        echo json_encode([
            'success' => true,
            'subscription' => [
                'plan_slug'            => 'free',
                'name'                 => 'Yomite Free',
                'price_usd'            => '0.00',
                'catalog_access'       => 'limited',
                'max_devices'          => 1,
                'early_chapter_access' => 0,
                'studio_events'        => 0,
                'started_at'           => null,
                'renews_at'            => null
            ]
        ]);
    }

    

    $stmt->close();
    $conn->close();
?>