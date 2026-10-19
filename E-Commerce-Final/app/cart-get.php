<?php
session_start();
header('Content-Type: application/json');
require_once __DIR__ . '/../db.php';

// Get user ID
$user_id = $_SESSION['id'] ?? $_SESSION['user_id'] ?? null;

if (!$user_id) {
    echo json_encode(['success' => false, 'error' => 'Please log in.', 'books' => [], 'count' => 0]);
    exit();
}

// Get all items in cart for this user with their format
$stmt = $conn->prepare("
    SELECT b.id, b.title, b.author, b.genre, b.cover_img, c.format
    FROM cart c
    JOIN books b ON c.book_id = b.id
    WHERE c.user_id = ?
    ORDER BY c.added_at DESC
");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$books = [];
while ($row = $result->fetch_assoc()) {
    $books[] = $row;
}

$stmt->close();
$conn->close();

echo json_encode(['success' => true, 'books' => $books, 'count' => count($books)]);
?>