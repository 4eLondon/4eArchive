<?php
    session_start();
    header('Content-Type: application/json');
    require_once __DIR__ . '/../db.php';

    if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
        echo json_encode(['success' => false, 'error' => 'Not logged in.']);
        exit();
    }

    $user_id = $_SESSION['id'] ?? $_SESSION['user_id'];

    // book_ids can be a single id or "all"
    $raw = $_POST['book_ids'] ?? '';
    $buyAll = ($raw === 'all');

    if ($buyAll) {
        // Get all cart items
        $stmt = $conn->prepare("SELECT book_id FROM cart WHERE user_id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $res = $stmt->get_result();
        $bookIds = [];
        while ($row = $res->fetch_assoc()) $bookIds[] = $row['book_id'];
        $stmt->close();
    } else {
        $bookIds = array_map('intval', explode(',', $raw));
        $bookIds = array_filter($bookIds);
    }

    if (empty($bookIds)) {
        echo json_encode(['success' => false, 'error' => 'No books selected.']);
        exit();
    }

    // Move each book from cart to owned_library
    $insertOwned = $conn->prepare("INSERT IGNORE INTO owned_library (user_id, book_id) VALUES (?, ?)");
    $removeCart  = $conn->prepare("DELETE FROM cart WHERE user_id = ? AND book_id = ?");

    foreach ($bookIds as $book_id) {
        $insertOwned->bind_param("ii", $user_id, $book_id);
        $insertOwned->execute();
        $removeCart->bind_param("ii", $user_id, $book_id);
        $removeCart->execute();
    }

    $insertOwned->close();
    $removeCart->close();
    $conn->close();

    echo json_encode(['success' => true, 'purchased' => count($bookIds)]);
?>