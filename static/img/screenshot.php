<?php
$file_name = $_FILES['file']['name'];
$tmp_file = $_FILES['file']['tmp_name'];
$file_path = 'upload/'.$file_name;

$r = move_uploaded_file($tmp_file, $file_path);
?>