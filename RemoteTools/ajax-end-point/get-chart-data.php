<?php
header('Content-Type: application/json');
require_once('../functions.php');

$pdo = pdo_connect_mysql();
$tools = $pdo->query("SELECT id, name FROM `tools`")->fetchAll();
$tool_rating_parameters = $pdo->query("SELECT * FROM `tool_rating_parameters`")->fetchAll();
$rating_parameters_averages = $pdo->query("SELECT id, rating FROM `rating_parameters_averages`")->fetchAll();

echo json_encode(array(
    "tools" => $tools,
    "tool_rating_parameters" => $tool_rating_parameters,
    "rating_parameters_averages" => $rating_parameters_averages,
));