<?php
    session_start();
    error_log("SESSION: " . print_r($_SESSION, true));
    header('Content-Type: application/json');
    require_once __DIR__ . '/../db.php';

    if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
        echo json_encode(['success' => false, 'error' => 'Not logged in.']);
        exit();
    }

    $user_id = $_SESSION['id'] ?? $_SESSION['user_id'];
    $book_id = intval($_POST['book_id'] ?? 0);

    if (!$book_id) {
        echo json_encode(['success' => false, 'error' => 'Invalid book.']);
        exit();
    }

    $stmt = $conn->prepare("INSERT IGNORE INTO library (user_id, book_id) VALUES (?, ?)");
    $stmt->bind_param("ii", $user_id, $book_id);
    $stmt->execute();
    $affected = $stmt->affected_rows;
    $stmt->close();
    $conn->close();

    if ($affected === 0) {
        echo json_encode(['success' => true, 'already' => true]);
    } else {
        echo json_encode(['success' => true, 'already' => false]);
    }
?>