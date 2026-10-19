<?php
    require_once __DIR__ . '/../db.php';

    header('Content-Type: application/json');

    $email = trim($_POST['email'] ?? '');

    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    echo json_encode(['taken' => $stmt->num_rows > 0]);
?>