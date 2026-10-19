<?php
    // logging setup
    $logFile = __DIR__ . '/logs/db_errors.log';

    function logError(string $message, string $logFile): void {
        $timestamp = date('Y-m-d H:i:s');
        $entry = "[$timestamp] ERROR: $message" . PHP_EOL;
        error_log($entry, 3, $logFile);
    }

    // connect the database
    $host = "127.0.0.1";
    $user = "root";
    $pass = "";
    $db = "yomite-db";
    $port = 3306;
    $conn = new mysqli($host, $user, $pass, $db, $port);
    // error handling
    if ($conn->connect_error) {
        logError("DB connection failed: " . $conn->connect_error, $logFile);
        die("Connection failed.");
    }
?>