<?php
    session_start();
    header('Content-Type: application/json');
    require_once __DIR__ . '/../db.php';

    // redirect to index if user is already logged in
    if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
        echo json_encode(['success' => true]);
        exit();
    }

    // collect post data
    $identifier = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';
    // basic check
    if (empty($identifier) || empty($password)) {
        echo json_encode(['success' => false, 'error' => 'Please fill in all fields.']);
        exit();
    }

    // check if the username exists
    $stmt = $conn->prepare("SELECT id, username, password, email, first_name, last_name FROM users WHERE email = ? OR username = ? LIMIT 1");
    if (!$stmt) {
        echo json_encode(['success' => false, 'error' => 'Something went wrong.']);
        exit();
    }

    $stmt->bind_param("ss", $identifier, $identifier);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows === 0) {
        echo json_encode(['success' => false, 'error' => 'Invalid username or password.']);
        exit();
    }

    $stmt->bind_result($db_id, $db_username, $db_password, $db_email, $db_first_name, $db_last_name);
    $stmt->fetch();
    error_log("DEBUG: username=$db_username, password=$db_password, identifier=$identifier");
    $stmt->fetch();
    if (empty($db_password)) {
        $stmt->close();
        $conn->close();
        echo json_encode(['success' => false, 'error' => 'Invalid username or password.']);
        exit();
    }

    if (password_verify($password, $db_password)) {
        session_regenerate_id(true);
        $_SESSION['id'] = $db_id;
        $_SESSION['username'] = $db_username;
        $_SESSION['email'] = $db_email;
        $_SESSION['first_name'] = $db_first_name;
        $_SESSION['last_name'] = $db_last_name;
        $_SESSION['logged_in'] = true;
        $stmt->close();
        $conn->close();
        echo json_encode(['success' => true]);
        exit();
    } else {
        echo json_encode(['success' => false, 'error' => 'Invalid username or password.']);
        exit();
    }
?>