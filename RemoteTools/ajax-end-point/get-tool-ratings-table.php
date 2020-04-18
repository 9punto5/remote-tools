<?php
include_once('../functions.php');
if (isset($_POST["toolId"])) {
    $updated_rating_parameter = -1;
    if (isset($_POST["updated_rating_parameter"])) {
        $updated_rating_parameter = $_POST["updated_rating_parameter"];
    }

    $pdo = pdo_connect_mysql();

    $tool_id = $_POST["toolId"];

    // Fetch the 'selected tool'
    $stmt = $pdo->prepare("SELECT name FROM `tools` WHERE id=?");
    $stmt->execute([$tool_id]);
    $selected_tool = $stmt->fetch(PDO::FETCH_OBJ);

    // Fetch 'tools'
    $tools = $pdo->query("SELECT id, name FROM `tools`")->fetchAll(PDO::FETCH_OBJ);

    // Fetch 'parameters to rate a tool'
    $parameters_to_rate_a_tool = $pdo->query("SELECT * FROM `tool_rating_parameters`")->fetchAll(PDO::FETCH_OBJ);

    echo
    '<div id="table-scroll" class="table-scroll">
        <div class="table-wrap">
            <table class="main-table">
                <thead>
                    <tr>
                        <th class="fixed-side" scope="col">
                            <div class="dropdown tools-dropdown">
                                <button class="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" data-boundary="window" aria-haspopup="true" aria-expanded="false">    
                                    <span>'.$selected_tool->name.'</span>
                                </button>
                                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">';
                                        foreach ($tools as $tool) {
                                            echo '<a class="dropdown-item tool" role="button" tabindex="0" data-index="' . $tool->id .'">' . $tool->name . '</a>';
                                        }
                                    echo
                                '</div>
                            </div>
                        </th>
                        <th scope="col">Calificación</th>
                        <th scope="col">Calificación de usuarios</th>
                        <th scope="col">Tu calificación</th>
                    </tr>
                </thead>
                <tbody>';
                    foreach ($parameters_to_rate_a_tool as $parameter) {
                        $stmt = $pdo->prepare("SELECT id, rating, users_rating FROM `rating_parameters_averages` WHERE id=? LIMIT 1");
                        $stmt->execute([$tool_id . $parameter->id]);
                        $parameter_ratings = $stmt->fetch(PDO::FETCH_OBJ);
                        echo 
                        '<tr>
                            <td class="fixed-side">' . $parameter->name . '</td>
                            <td>'. $parameter_ratings->rating . '</td>
                            <td>';
                                if($parameter_ratings->users_rating == 0 || !isset($parameter_ratings->users_rating)) { 
                                    echo '0';
                                } else {
                                    echo $parameter_ratings->users_rating;
                                }
                            echo
                            '</td>
                            <td>
                                <div class="stars-container" data-index="' . $parameter->id . '">
                                    <i class="far fa-star" data-index="0"></i>
                                    <i class="far fa-star" data-index="1"></i>
                                    <i class="far fa-star" data-index="2"></i>
                                    <i class="far fa-star" data-index="3"></i>
                                    <i class="far fa-star" data-index="4"></i>
                                    <i class="far fa-star" data-index="5"></i>
                                    <i class="far fa-star" data-index="6"></i>
                                    <i class="far fa-star" data-index="7"></i>
                                    <i class="far fa-star" data-index="8"></i>
                                    <i class="far fa-star" data-index="9"></i>
                                </div>
                            ';
                                if ($updated_rating_parameter == $parameter->id) {
                                    echo '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1600 1240" enable-background="new 0 0 1600 1240" xml:space="preserve">
                                    <path d="m 1671,970 q 0,-40 -28,-68 L 919,178 783,42 Q 755,14 715,14 675,14 647,42 L 511,178 149,540 q -28,28 -28,68 0,40 28,68 l 136,136 q 28,28 68,28 40,0 68,-28 l 294,-295 656,657 q 28,28 68,28 40,0 68,-28 l 136,-136 q 28,-28 28,-68 z" fill="rgba(0,0,0,0)" class="path" stroke-width="50" stroke-miterLimit="10"/>
                                    </svg>';
                                }
                            echo
                            '</td>
                        </tr>';
                    }
    echo         '</tbody>
            </table>
            <table class="fixed-table-side">
                <thead>
                    <tr>
                        <th class="fixed-side" scope="col">
                            <div class="dropdown tools-dropdown">
                                <button class="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" data-boundary="window" aria-haspopup="true" aria-expanded="false">    
                                    <span>'.$selected_tool->name.'</span>
                                </button>
                                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">';
                                        foreach ($tools as $tool) {
                                            echo '<a class="dropdown-item tool" role="button" tabindex="0" data-index="' . $tool->id .'">' . $tool->name . '</a>';
                                        }
                                    echo
                                '</div>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>';
                    foreach ($parameters_to_rate_a_tool as $parameter) {
                        $stmt = $pdo->prepare("SELECT id, rating, users_rating FROM `rating_parameters_averages` WHERE id=? LIMIT 1");
                        $stmt->execute([$tool_id . $parameter->id]);
                        $parameter_ratings = $stmt->fetch(PDO::FETCH_OBJ);
                        echo 
                        '<tr>
                            <td class="fixed-side">' . $parameter->name . '</td>
                        </tr>';
                    }
                echo
                '</tbody>
            </div>
        </div>
    </div>';
}