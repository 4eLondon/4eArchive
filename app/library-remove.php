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

    $stmt = $conn->prepare("DELETE FROM library WHERE user_id = ? AND book_id = ?");
    $stmt->bind_param("ii", $user_id, $book_id);
    $stmt->execute();
    $stmt->close();
    $conn->close();

    echo json_encode(['success' => true]);
?>