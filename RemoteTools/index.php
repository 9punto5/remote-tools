<?php
    include_once('header.php');
    include_once('functions.php');

    $pdo = pdo_connect_mysql();

    // Fetch 'tools'
    $tools = $pdo->query("SELECT id, name FROM `tools`")->fetchAll(PDO::FETCH_OBJ);
?>
<section class="chart-section">
    <div class="container">
        <div class="row">
            <div class="col">
                <div class="title">
                    <h2>Herramientas de comunicación, colaboración y management</h2>
                    <h3>Existen distintas dimensiones para evaluar la herramienta que mejor puede funcionar para ti o para tu organización, acá una ayuda para evaluar y elegir</h3>
                </div>
                
                <div class="chart-container">
                    <canvas class="chart" id="chart"></canvas>
    
                    <div id="xDropdownContainer">
                        <div class="dropdown">
                            <button class="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span id="criteriaX"></span>
                            </button>
                            <div id="xDropdownMenu" class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            </div>
                        </div>
                    </div>
    
                    <div id="yDropdownContainer">
                        <div class="dropdown">
                            <button class="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span id="criteriaY"></span>
                            </button>
                            <div id="yDropdownMenu" class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="rating-parameters-info-container">
                    <div class="row">
                        <div class="rating-parameter-info col-md-6">
                            <p class="title" id="xAxisInfoTitle"></p>
                            <p id="xAxisInfoDescription"></p>
                        </div>
                        <div class="rating-parameter-info col-md-6">
                            <p class="title" id="yAxisInfoTitle"></p>
                            <p id="yAxisInfoDescription"></p>
                        </div>
                    </div>
                </div>
            </div><!-- #col -->
        </div><!-- #row -->
    </div><!-- #container -->
</section>

<section id="rating-section">
    <div class="container">
        <div class="row">
            <div class="col">
                <div class="title">
                    <h2>Califica las herramientas</h2>
                    <h3>Lorem ipsum dolor sit amet consectetur adipisicing elit.</h3>
                </div>

                <div id="ratingTable">
                </div>
            </div><!-- #col -->
        </div><!-- #row -->
    </div><!-- #container -->
</section>
<?php
    include_once('footer.php');
?>