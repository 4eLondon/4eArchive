<?php
    session_start();
    header('Content-Type: application/json');
    require_once __DIR__ . '/../db.php';

    if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
        header("Location: /WD3_Project_Sem2_MangaWebsite/Project/index.php");
        exit();
    }

    // data collection first
    $first_name   = trim($_POST['first-name'] ?? '');
    $last_name    = trim($_POST['last-name'] ?? '');
    $date_of_birth = trim($_POST['date-of-birth'] ?? '');
    $gender       = trim($_POST['gender'] ?? '');
    $email_address = trim($_POST['email-address'] ?? '');
    $username     = trim($_POST['username'] ?? '');
    $password     = $_POST['password'] ?? '';

    // check if username already exists
    $check_user = $conn->prepare("SELECT id FROM users WHERE username = ?");
    $check_user->bind_param("s", $username);
    $check_user->execute();
    $check_user->store_result();
    if ($check_user->num_rows > 0) {
        echo json_encode(['success' => false, 'error' => 'Username is already taken.']);
        exit();
    }
    $check_user->close();

    // check if email already exists
    $check_email = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $check_email->bind_param("s", $email_address);
    $check_email->execute();
    $check_email->store_result();
    if ($check_email->num_rows > 0) {
        echo json_encode(['success' => false, 'error' => 'Email is already registered.']);
        exit();
    }
    $check_email->close();

    // hash password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // insert new user
    $stmt = $conn->prepare("INSERT INTO users (first_name, last_name, dob, gender, email, username, password) VALUES (?, ?, ?, ?, ?, ?, ?)");
    if (!$stmt) {
        echo json_encode(['success' => false, 'error' => 'Something went wrong. Try again later.']);
        exit();
    }

    $stmt->bind_param("sssssss", $first_name, $last_name, $date_of_birth, $gender, $email_address, $username, $hashed_password);

    if ($stmt->execute()) {
        $user_id = $stmt->insert_id;
        $_SESSION['user_id']    = $user_id;
        $_SESSION['username']   = $username;
        $_SESSION['first_name'] = $first_name;
        $_SESSION['last_name']  = $last_name;
        $_SESSION['email']      = $email_address;
        $_SESSION['logged_in']  = true;
        $stmt->close();
        $conn->close();
        echo json_encode(['success' => true]);
        exit();
    } else {
        $error = $stmt->error;
        $stmt->close();
        $conn->close();
        echo json_encode(['success' => false, 'error' => 'Registration failed: ' . $error]);
        exit();
    }
?>