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
        SELECT b.id, b.title, b.author, b.genre, b.cover_img, b.price, c.added_at
        FROM cart c
        JOIN books b ON c.book_id = b.id
        WHERE c.user_id = ?
        ORDER BY c.added_at DESC
    ");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $books = [];
    $total = 0;
    while ($row = $result->fetch_assoc()) {
        $books[] = $row;
        $total += floatval($row['price']);
    }

    $stmt->close();
    $conn->close();

    echo json_encode(['success' => true, 'books' => $books, 'count' => count($books), 'total' => $total]);
?>