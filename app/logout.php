<?php
    session_start();
    session_destroy();
    header("Location: /WD3_Project_Sem2_MangaWebsite/Project/pages/login.html");
    exit();
?>