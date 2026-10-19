<?php
    require_once __DIR__ . '/../db.php';

    header('Content-Type: application/json');

    // your db connection here
    $username = trim($_POST['username'] ?? '');

    $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();

    echo json_encode(['taken' => $stmt->num_rows > 0]);
?>