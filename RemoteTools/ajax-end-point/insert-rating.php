<?php
include_once('../functions.php');
if (isset($_POST["ratedToolId"], $_POST["ratedToolRatingParameterId"], $_POST["rating"])) {
    function returnValueOrZero($var) {
        if (!isset($var)) {
            return 0;
        } else {
            return $var;
        }
    }

    $pdo = pdo_connect_mysql();

    $rated_tool_id = $_POST["ratedToolId"];
    $rated_tool_rating_parameter_id = $_POST["ratedToolRatingParameterId"];
    $rating = $_POST["rating"];
    $my_id = $rated_tool_id . $rated_tool_rating_parameter_id;

    echo "rti: " . $rated_tool_id;
    echo "rtrpi: " . $rated_tool_rating_parameter_id;
    echo "r: " . $rating;
    echo "my_id: " . $my_id;


    // Fetch actual 'users rating' and 'users ratings count' for the rated parameter of the tool
    $stmt = $pdo->prepare(
        "SELECT users_rating, users_rating_count FROM `rating_parameters_averages` WHERE id=? LIMIT 1"
    );
    $stmt->execute(array($my_id));
    $rated_tool_rating_parameter_averages = $stmt->fetch(PDO::FETCH_OBJ);
    $parameter_users_rating_average = returnValueOrZero($rated_tool_rating_parameter_averages->users_rating);
    $parameter_users_ratings_count = returnValueOrZero($rated_tool_rating_parameter_averages->users_rating_count);

    // Fetch actual 'users rating' of the rated tool
    $stmt = $pdo->prepare(
        "SELECT users_rating FROM `tools` WHERE tool_id=? LIMIT 1"
    );
    $stmt->execute([$rated_tool_id]);
    $tool_users_rating = returnValueOrZero($stmt->fetchColumn());

    // Fetch actual 'parameters to rate a tool' count
    $parameters_to_rate_a_tool = $pdo->query("SELECT count(*) FROM `tool_rating_parameters`")->fetchColumn();

    // Calculate new 'users ratings'
    $new_tool_rating_parameter_users_rating = ($parameter_users_rating_average * $parameter_users_ratings_count + $rating) / ($parameter_users_ratings_count + 1);
    $new_tool_users_rating = ($tool_users_rating * $parameters_to_rate_a_tool - $tool_users_rating + $new_tool_rating_parameter_users_rating) / $parameters_to_rate_a_tool;

    // UPDATE 'rating_parameters_averages' table
    $stmt = $pdo->prepare(
        "UPDATE `rating_parameters_averages` SET users_rating=?, users_rating_count=? WHERE id=?"
    );
    $result = $stmt->execute([round($new_tool_rating_parameter_users_rating, 2, PHP_ROUND_HALF_EVEN), ($parameter_users_ratings_count + 1), $my_id]);

    // UPDATE 'tools' table
    $stmt = $pdo->prepare(
        "UPDATE `tools` SET users_rating=? WHERE tool_id=?"
    );
    $result = $stmt->execute([round($new_tool_users_rating, 2, PHP_ROUND_HALF_EVEN), $rated_tool_id]);
}