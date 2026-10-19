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
    $check = $conn->prepare("SELECT 1 FROM owned_library WHERE user_id = ? AND book_id = ?");
    $check->bind_param("ii", $user_id, $book_id);
    $check->execute();
    $check->store_result();
    if ($check->num_rows > 0) {
        $check->close();
        $conn->close();
        echo json_encode(['success' => false, 'error' => 'already_owned']);
        exit();
    }
    $check->close();

    $stmt = $conn->prepare("INSERT IGNORE INTO owned_library (user_id, book_id) VALUES (?, ?)");
    $stmt->bind_param("ii", $user_id, $book_id);
    $stmt->execute();
    $stmt->close();
    $conn->close();

    echo json_encode(['success' => true]);
?>