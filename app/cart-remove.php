<?php
session_start();
header('Content-Type: application/json');
require_once __DIR__ . '/../db.php';

$user_id = $_SESSION['id'] ?? $_SESSION['user_id'] ?? null;

if (!$user_id) {
    echo json_encode(['success' => false, 'error' => 'Please log in.']);
    exit();
}

$book_id = intval($_POST['book_id'] ?? 0);

if (!$book_id) {
    echo json_encode(['success' => false, 'error' => 'Invalid book.']);
    exit();
}

// Remove from cart
$stmt = $conn->prepare("DELETE FROM cart WHERE user_id = ? AND book_id = ?");
$stmt->bind_param("ii", $user_id, $book_id);
$stmt->execute();
$stmt->close();
$conn->close();

echo json_encode(['success' => true]);
?>