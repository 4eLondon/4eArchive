<?php
    session_start();
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

    // Check if already owned
    $owned = $conn->prepare("SELECT id FROM owned_library WHERE user_id = ? AND book_id = ?");
    $owned->bind_param("ii", $user_id, $book_id);
    $owned->execute();
    $owned->store_result();
    if ($owned->num_rows > 0) {
        echo json_encode(['success' => false, 'owned' => true, 'error' => 'Already owned.']);
        $owned->close(); $conn->close(); exit();
    }
    $owned->close();

    $stmt = $conn->prepare("INSERT IGNORE INTO cart (user_id, book_id) VALUES (?, ?)");
    $stmt->bind_param("ii", $user_id, $book_id);
    $stmt->execute();
    $affected = $stmt->affected_rows;
    $stmt->close();
    $conn->close();

    echo json_encode(['success' => true, 'already' => $affected === 0]);
?>