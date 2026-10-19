<?php
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Invalid method']);
    exit;
}

$book_id = $_POST['book_id'] ?? null;
$rating = $_POST['rating'] ?? null;
$comment = $_POST['comment'] ?? null;

if (!$book_id || !$rating || !$comment) {
    echo json_encode(['success' => false, 'error' => 'Missing fields']);
    exit;
}

// Validate rating 1-5
$rating = (int)$rating;
if ($rating < 1 || $rating > 5) {
    echo json_encode(['success' => false, 'error' => 'Invalid rating']);
    exit;
}

// Trim comment
$comment = trim($comment);
if (strlen($comment) < 3 || strlen($comment) > 1000) {
    echo json_encode(['success' => false, 'error' => 'Comment must be 3-1000 chars']);
    exit;
}

// Get username (logged in or anonymous)
$username = isset($_SESSION['username']) ? $_SESSION['username'] : 'Anonymous';

echo json_encode([
    'success' => true,
    'review' => [
        'id' => uniqid(),
        'username' => $username,
        'book_id' => $book_id,
        'rating' => $rating,
        'comment' => htmlspecialchars($comment),
        'created_at' => date('Y-m-d H:i:s'),
        'likes' => 0
    ]
]);
?>