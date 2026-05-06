<?php
session_start();
header('Content-Type: application/json');
require_once __DIR__ . '/../db.php';

// Get user ID - if not logged in, return error
$user_id = $_SESSION['id'] ?? $_SESSION['user_id'] ?? null;

if (!$user_id) {
    echo json_encode(['success' => false, 'error' => 'Please log in to use the cart.']);
    exit();
}

$book_id = intval($_POST['book_id'] ?? 0);
$format = $_POST['format'] ?? 'paperback'; // Get format: paperback, hardcover, or collectors

if (!$book_id) {
    echo json_encode(['success' => false, 'error' => 'Invalid book.']);
    exit();
}

// Validate format
$valid_formats = ['paperback', 'hardcover', 'collectors'];
if (!in_array($format, $valid_formats)) {
    $format = 'paperback';
}

// Add to cart with format
$stmt = $conn->prepare("INSERT INTO cart (user_id, book_id, format) VALUES (?, ?, ?) 
                        ON DUPLICATE KEY UPDATE format = VALUES(format)");
$stmt->bind_param("iis", $user_id, $book_id, $format);
$stmt->execute();
$success = $stmt->affected_rows > 0;
$stmt->close();
$conn->close();

echo json_encode(['success' => true, 'added' => $success, 'format' => $format]);
?>