jQuery( function() {
    /** 
     * Chart Functions
     * 
    */
    const chartFunctions = (function() {
        let myChart,
        myData,
        myCurrentXCriteria,
        myCurrentYCriteria,
        myXCriteriaSpan,
        myYCriteriaSpan,
        lastestWindowWidth,
        lastestWindowHeight;
        const myBorderColor = "#00e5c8",
        myBackgroundColor = "#00e5c8",
        myPointRadius = 7;

        customizeStyling = function() {
            Chart.defaults.global.defaultFontColor='white';
        }

        registerPlugins = function() {
            // PLUGIN FOR ALWAYS SHOW TOOLTIPS
            Chart.pluginService.register({
                beforeRender: function (chart) {
                    if (chart.config.options.showAllTooltips) {
                        // create an array of tooltips
                        // we can't use the chart tooltip because there is only one tooltip per chart
                        chart.pluginTooltips = [];
                        chart.config.data.datasets.forEach(function (dataset, i) {
                            chart.getDatasetMeta(i).data.forEach(function (sector, j) {
                                chart.pluginTooltips.push(new Chart.Tooltip({
                                    _chart: chart.chart,
                                    _chartInstance: chart,
                                    _data: chart.data,
                                    _options: chart.options.tooltips,
                                    _active: [sector]
                                }, chart));
                            });
                        });
    
                        // turn off normal tooltips
                        chart.options.tooltips.enabled = false;
                    }
                },
                afterDraw: function (chart, easing) {
                    if (chart.config.options.showAllTooltips) {
                        // we don't want the permanent tooltips to animate, so don't do anything till the animation runs atleast once
                        if (!chart.allTooltipsOnce) {
                            if (easing !== 1)
                                return;
                            chart.allTooltipsOnce = true;
                        }
    
                        // turn on tooltips
                        chart.options.tooltips.enabled = true;
                        Chart.helpers.each(chart.pluginTooltips, function (tooltip) {
                            tooltip.initialize();
                            tooltip.update();
                            // we don't actually need this since we are not animating tooltips
                            tooltip.pivot();
                            tooltip.transition(easing).draw();
                        });
                        chart.options.tooltips.enabled = false;
                    }
                }
            })
        }

        loadDataInChart = function() {
            const chartDatasets = [];
            for (let i = 0; i < myData["tools_data"].length; i++) {
                const xCriteriaScore = myData["rating_parameters_data"][myCurrentXCriteria][(i + 1) + "_average"]
                const yCriteriaScore = myData["rating_parameters_data"][myCurrentYCriteria][(i + 1) + "_average"]

                chartDatasets.push({
                    label: myData["tools_data"][i].name,
                    borderColor: myBorderColor,
                    backgroundColor: myBackgroundColor,
                    data: [{x: xCriteriaScore, y: yCriteriaScore, r: myPointRadius}]
                });
            }

            this.updateChart(chartDatasets)
        }

        setUpAxisDropdowns = function() {
            const chartXCriteriaDropdown = $('#xDropdownMenu');
            const chartYCriteriaDropdown = $('#yDropdownMenu');
            const ratingParameters = Object.values(myData["rating_parameters_data"]);

            // Add the tool names as items in the axis dropdowns
            for (let i = 0; i < ratingParameters.length; i++) {
                chartXCriteriaDropdown.append( '<a class="dropdown-item parameter" role="button" tabindex="0">' + ratingParameters[i].name + '</a>' );
                chartYCriteriaDropdown.append( '<a class="dropdown-item parameter" role="button" tabindex="0">' + ratingParameters[i].name + '</a>' );
            }

            // Set click listeners to the tool names (dropdowns items in the axis dropdowns)
            $('.dropdown-item.parameter').click(function(){
                const selectedCriteriaIndex =  $(this).index() ;
                const isDropdownFromXAxis = $(this).parent()[0] == chartXCriteriaDropdown[0];
        
                if (isDropdownFromXAxis) {
                    updateXAxis(selectedCriteriaIndex)
                } else {
                    updateYAxis(selectedCriteriaIndex)
                }
            });
        }

        updateXAxis = function(criteriaIndex) {
            // Swipe axis
            if (criteriaIndex == myCurrentYCriteria) {
                myCurrentYCriteria = myCurrentXCriteria;
            }
            
            myCurrentXCriteria = criteriaIndex;
            this.loadDataInChart();
        }

        updateYAxis = function(criteriaIndex) {
            // Swipe axis
            if (criteriaIndex == myCurrentXCriteria) {
                myCurrentXCriteria = myCurrentYCriteria;
            }

            myCurrentYCriteria = criteriaIndex;
            this.loadDataInChart();
        }

        updateChart = function(datasets) {
            // Pop all the data from the myChart
            myChart.data.datasets.forEach((dataset) => {
                dataset.data.pop();
            });

            // Update myChart
            myChart.data.datasets = datasets;
            myChart.options.title.text = myData["rating_parameters_data"][myCurrentXCriteria].name + " y " + myData["rating_parameters_data"][myCurrentYCriteria].name;
            myChart.update();

            // Update Dropdown Text
            myXCriteriaSpan.textContent = myData["rating_parameters_data"][myCurrentXCriteria].name;
            myYCriteriaSpan.textContent = myData["rating_parameters_data"][myCurrentYCriteria].name;

            $('#xAxisInfoTitle')[0].textContent = myData["rating_parameters_data"][myCurrentXCriteria].name;
            $('#yAxisInfoTitle')[0].textContent = myData["rating_parameters_data"][myCurrentYCriteria].name;

            $('#xAxisInfoDescription')[0].textContent = myData["rating_parameters_data"][myCurrentXCriteria].description;
            $('#yAxisInfoDescription')[0].textContent = myData["rating_parameters_data"][myCurrentYCriteria].description;
        }

        updateChartOptions = function(windowWidth, windowHeight) {
            console.log("Here")
            $('#yDropdownContainer').width($('.chart-container').height()); 

            // We don't wanna do nothing when the user scrolls down and the navigator bar hides
            if (windowWidth == lastestWindowWidth && windowHeight != lastestWindowHeight) {
                return;
            }

            lastestWindowWidth = windowWidth;
            lastestWindowHeight = windowHeight;

            if (windowWidth < 576) {
                myChart.options.maintainAspectRatio = false;

                if (windowHeight < 420) {
                    myChart.canvas.parentNode.style.height = windowHeight + 'px';
                } else if (windowHeight < 600) {
                    myChart.canvas.parentNode.style.height = (windowHeight / 1.5) + 'px';
                } else if (windowHeight < 900) {
                    myChart.canvas.parentNode.style.height = (windowHeight / 2.5) + 'px';
                }
            } else {
                myChart.canvas.parentNode.style.height = 'auto';
                myChart.options.maintainAspectRatio = true;
            }

            myChart.options.showAllTooltips = !(windowWidth < 960);
            myChart.update();
        }

        return {
            init: function() {
                const chartCtx = $('#chart')[0].getContext('2d');
                myXCriteriaSpan = $('#criteriaX')[0];
                myYCriteriaSpan = $('#criteriaY')[0];
                myCurrentXCriteria = 0;
                myCurrentYCriteria = 1;
                customizeStyling();
                
                myChart = new Chart(chartCtx, {
                    type: 'bubble',
                    labels: [1,2,3,4,5,6,7,8,9,10],
                    options: {
                        responsive: true,
                        responsiveAnimationDuration: 0,
                        animation: {
                            duration: 0
                        },
                        hover: {
                            animationDuration: 0
                        },
                        legend: {
                            display: false,
                        },
                        title: {
                            display: true,
                            fontSize: 20,
                            padding: 40
                        },
                        scales: {
                            xAxes: [{
                                scaleLabel: {
                                    display: true,
                                },
                                ticks:{
                                    beginAtZero: true,
                                    maxTicksLimit: 11,
                                    stepSize: 1,
                                    max: 10,
                                    xmin: 0,
                                    autoSkip: false,
                                }
                            }],
                            yAxes: [{
                                scaleLabel: {
                                    display: true,
                                },
                                ticks:{
                                    beginAtZero: true,
                                    maxTicksLimit: 11,
                                    stepSize: 1,
                                    max: 10,
                                    xmin: 0,
                                    autoSkip: false,
                                }
                            }],
                        },
                        tooltips: {
                            enabled: false,
                            backgroundColor:"rgba(0,0,0,0)",
                            callbacks: {
                                title: function(tooltipItems, data) {
                                  return data.datasets[tooltipItems[0].datasetIndex].label;
                                },
                                label: function(tooltipItem, data) {
                                    return "";
                                }
                            },
                            custom: function(tooltip) {
                                let tooltipEl = document.getElementById('chartjs-tooltip');
                        
                                if (!tooltipEl) {
                                    tooltipEl = document.createElement('div');
                                    tooltipEl.id = 'chartjs-tooltip';
                                    tooltipEl.innerHTML = '<table></table>';
                                    this._chart.canvas.parentNode.appendChild(tooltipEl);
                                }
                        
                                // Hide if no tooltip
                                if (tooltip.opacity === 0) {
                                    tooltipEl.style.opacity = 0;
                                    return;
                                }
                        
                                // Set caret Position
                                tooltipEl.classList.remove('above', 'below', 'no-transform');
                                if (tooltip.yAlign) {
                                    tooltipEl.classList.add(tooltip.yAlign);
                                } else {
                                    tooltipEl.classList.add('no-transform');
                                }
                        
                                // Set Text
                                if (tooltip.body) {
                                    let tableRoot = tooltipEl.querySelector('table');
                                    const toolName = myData["tools_data"][tooltip.dataPoints[0]["datasetIndex"]].name;
                                    const xCriteriaScore = myData["rating_parameters_data"][myCurrentXCriteria].name + ": " + tooltip.dataPoints[0].xLabel;
                                    const yCriteriaScore = myData["rating_parameters_data"][myCurrentYCriteria].name + ": " + tooltip.dataPoints[0].yLabel;
                        
                                    let innerHtml = '<thead></thead>';
                                    innerHtml += '<tr><td><strong>' + toolName + '</strong></td></tr>';
                                    innerHtml += '<tr><td>' + xCriteriaScore + '</td></tr>';
                                    innerHtml += '<tr><td>' + yCriteriaScore + '</td></tr>';
                        
                                    tableRoot.innerHTML = innerHtml;
                                }
                        
                                let positionY = this._chart.canvas.offsetTop;
                                let positionX = this._chart.canvas.offsetLeft;
                        
                                // Display, position, and set styles for font
                                tooltipEl.style.opacity = 1;
                                tooltipEl.style.left = positionX + tooltip.caretX + 'px';
                                tooltipEl.style.top = positionY + tooltip.caretY + 'px';
                                tooltipEl.style.fontFamily = tooltip._bodyFontFamily;
                                tooltipEl.style.fontSize = tooltip.bodyFontSize + 'px';
                                tooltipEl.style.fontStyle = tooltip._bodyFontStyle;
                                tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
                            }
                        },
                    }
                });

                registerPlugins();
                updateChartOptions($(window).width(), $(window).height());
                $(window).resize(function() {
                    updateChartOptions($(window).width(), $(window).height())
                });
            },
            loadDemoData: function() {
                myData = {
                    "rating_parameters_data":[
                        {"id":"1","name":"Conversación de calidad","1_average":"3.33","1_total_ratings":"1","1_average_users":"5","1_total_ratings_users":"1","2_average":"4.5","2_total_ratings":"1","2_average_users":"0","2_total_ratings_users":"0","3_average":"6.25","3_total_ratings":"1","3_average_users":"0","3_total_ratings_users":"0","4_average":"3.67","4_total_ratings":"1","4_average_users":"0","4_total_ratings_users":"0","5_average":"4","5_total_ratings":"1","5_average_users":"0","5_total_ratings_users":"0","6_average":"2","6_total_ratings":"1","6_average_users":"0","6_total_ratings_users":"0","7_average":"5.5","7_total_ratings":"1","7_average_users":"0","7_total_ratings_users":"0","8_average":"4.75","8_total_ratings":"1","8_average_users":"0","8_total_ratings_users":"0","9_average":"7.33","9_total_ratings":"1","9_average_users":"0","9_total_ratings_users":"0","10_average":"5.75","10_total_ratings":"1","10_average_users":"0","10_total_ratings_users":"0","11_average":"4.4","11_total_ratings":"1","11_average_users":"0","11_total_ratings_users":"0","12_average":"8.33","12_total_ratings":"1","12_average_users":"0","12_total_ratings_users":"0","13_average":"4","13_total_ratings":"1","13_average_users":"0","13_total_ratings_users":"0","description":"Sucesión de turnos de habla que se produce al conversar dos o más personas."},
                        {"id":"2","name":"Management","1_average":"6.33","1_total_ratings":"1","1_average_users":"10","1_total_ratings_users":"1","2_average":"7","2_total_ratings":"1","2_average_users":"0","2_total_ratings_users":"0","3_average":"8.25","3_total_ratings":"1","3_average_users":"0","3_total_ratings_users":"0","4_average":"3.33","4_total_ratings":"1","4_average_users":"0","4_total_ratings_users":"0","5_average":"5","5_total_ratings":"1","5_average_users":"0","5_total_ratings_users":"0","6_average":"3.8","6_total_ratings":"1","6_average_users":"0","6_total_ratings_users":"0","7_average":"6.2","7_total_ratings":"1","7_average_users":"0","7_total_ratings_users":"0","8_average":"8","8_total_ratings":"1","8_average_users":"0","8_total_ratings_users":"0","9_average":"3.5","9_total_ratings":"1","9_average_users":"0","9_total_ratings_users":"0","10_average":"3.75","10_total_ratings":"1","10_average_users":"0","10_total_ratings_users":"0","11_average":"6.67","11_total_ratings":"1","11_average_users":"0","11_total_ratings_users":"0","12_average":"5","12_total_ratings":"1","12_average_users":"0","12_total_ratings_users":"0","13_average":"2.8","13_total_ratings":"1","13_average_users":"0","13_total_ratings_users":"0","description":"Administración o gestión de todas las actividades asignadas por la división de trabajo dentro de una organización. "},
                        {"id":"3","name":"Calma\/Foco","1_average":"6","1_total_ratings":"1","1_average_users":"8.5","1_total_ratings_users":"2","2_average":"6","2_total_ratings":"1","2_average_users":"0","2_total_ratings_users":"0","3_average":"8.5","3_total_ratings":"1","3_average_users":"0","3_total_ratings_users":"0","4_average":"4","4_total_ratings":"1","4_average_users":"0","4_total_ratings_users":"0","5_average":"6","5_total_ratings":"1","5_average_users":"0","5_total_ratings_users":"0","6_average":"6.4","6_total_ratings":"1","6_average_users":"0","6_total_ratings_users":"0","7_average":"6.8","7_total_ratings":"1","7_average_users":"0","7_total_ratings_users":"0","8_average":"6.25","8_total_ratings":"1","8_average_users":"0","8_total_ratings_users":"0","9_average":"3.33","9_total_ratings":"1","9_average_users":"0","9_total_ratings_users":"0","10_average":"4.25","10_total_ratings":"1","10_average_users":"0","10_total_ratings_users":"0","11_average":"6","11_total_ratings":"1","11_average_users":"0","11_total_ratings_users":"0","12_average":"7.67","12_total_ratings":"1","12_average_users":"0","12_total_ratings_users":"0","13_average":"2.6","13_total_ratings":"1","13_average_users":"0","13_total_ratings_users":"0","description":"Tranquilidad, ausencia de agitación y de nervios"},
                        {"id":"4","name":"Documentación","1_average":"5","1_total_ratings":"1","1_average_users":"5","1_total_ratings_users":"3","2_average":"5.5","2_total_ratings":"1","2_average_users":"0","2_total_ratings_users":"0","3_average":"7.5","3_total_ratings":"1","3_average_users":"0","3_total_ratings_users":"0","4_average":"4.33","4_total_ratings":"1","4_average_users":"0","4_total_ratings_users":"0","5_average":"7","5_total_ratings":"1","5_average_users":"0","5_total_ratings_users":"0","6_average":"8","6_total_ratings":"1","6_average_users":"0","6_total_ratings_users":"0","7_average":"8.8","7_total_ratings":"1","7_average_users":"0","7_total_ratings_users":"0","8_average":"6.25","8_total_ratings":"1","8_average_users":"0","8_total_ratings_users":"0","9_average":"3.67","9_total_ratings":"1","9_average_users":"0","9_total_ratings_users":"0","10_average":"2.5","10_total_ratings":"1","10_average_users":"0","10_total_ratings_users":"0","11_average":"5.5","11_total_ratings":"1","11_average_users":"0","11_total_ratings_users":"0","12_average":"4.67","12_total_ratings":"1","12_average_users":"0","12_total_ratings_users":"0","13_average":"2","13_total_ratings":"1","13_average_users":"0","13_total_ratings_users":"0","description":"Calidad de las instrucciones para que el usuario aprenda a manejarlo y conozca sus funciones principales."},
                        {"id":"5","name":"Versatilidad","1_average":"8","1_total_ratings":"1","1_average_users":"0","1_total_ratings_users":"0","2_average":"5.5","2_total_ratings":"1","2_average_users":"0","2_total_ratings_users":"0","3_average":"5","3_total_ratings":"1","3_average_users":"0","3_total_ratings_users":"0","4_average":"5","4_total_ratings":"1","4_average_users":"0","4_total_ratings_users":"0","5_average":"6.5","5_total_ratings":"1","5_average_users":"0","5_total_ratings_users":"0","6_average":"7.5","6_total_ratings":"1","6_average_users":"0","6_total_ratings_users":"0","7_average":"7","7_total_ratings":"1","7_average_users":"0","7_total_ratings_users":"0","8_average":"6.75","8_total_ratings":"1","8_average_users":"0","8_total_ratings_users":"0","9_average":"7.8","9_total_ratings":"1","9_average_users":"0","9_total_ratings_users":"0","10_average":"6","10_total_ratings":"1","10_average_users":"0","10_total_ratings_users":"0","11_average":"5.8","11_total_ratings":"1","11_average_users":"0","11_total_ratings_users":"0","12_average":"4.75","12_total_ratings":"1","12_average_users":"0","12_total_ratings_users":"0","13_average":"4.25","13_total_ratings":"1","13_average_users":"0","13_total_ratings_users":"0","description":"Capacidad de adaptarse con rapidez y facilidad a distintas funciones"},
                        {"id":"6","name":"Colaboración","1_average":"8","1_total_ratings":"1","1_average_users":"0","1_total_ratings_users":"0","2_average":"6.5","2_total_ratings":"1","2_average_users":"0","2_total_ratings_users":"0","3_average":"8","3_total_ratings":"1","3_average_users":"0","3_total_ratings_users":"0","4_average":"4.2","4_total_ratings":"1","4_average_users":"0","4_total_ratings_users":"0","5_average":"7","5_total_ratings":"1","5_average_users":"0","5_total_ratings_users":"0","6_average":"7.8","6_total_ratings":"1","6_average_users":"0","6_total_ratings_users":"0","7_average":"8","7_total_ratings":"1","7_average_users":"0","7_total_ratings_users":"0","8_average":"6.75","8_total_ratings":"1","8_average_users":"0","8_total_ratings_users":"0","9_average":"7.4","9_total_ratings":"1","9_average_users":"0","9_total_ratings_users":"0","10_average":"5.25","10_total_ratings":"1","10_average_users":"0","10_total_ratings_users":"0","11_average":"7.2","11_total_ratings":"1","11_average_users":"0","11_total_ratings_users":"0","12_average":"7.67","12_total_ratings":"1","12_average_users":"0","12_total_ratings_users":"0","13_average":"4.6","13_total_ratings":"1","13_average_users":"0","13_total_ratings_users":"0","description":"Capacidad de trabajar conjuntamente con otras personas."},
                        {"id":"7","name":"Simple","1_average":"4.67","1_total_ratings":"1","1_average_users":"0","1_total_ratings_users":"0","2_average":"6.5","2_total_ratings":"1","2_average_users":"0","2_total_ratings_users":"0","3_average":"8","3_total_ratings":"1","3_average_users":"0","3_total_ratings_users":"0","4_average":"8.6","4_total_ratings":"1","4_average_users":"0","4_total_ratings_users":"0","5_average":"7.5","5_total_ratings":"1","5_average_users":"10","5_total_ratings_users":"1","6_average":"8.2","6_total_ratings":"1","6_average_users":"0","6_total_ratings_users":"0","7_average":"7.25","7_total_ratings":"1","7_average_users":"0","7_total_ratings_users":"0","8_average":"4.75","8_total_ratings":"1","8_average_users":"0","8_total_ratings_users":"0","9_average":"8.2","9_total_ratings":"1","9_average_users":"0","9_total_ratings_users":"0","10_average":"8.25","10_total_ratings":"1","10_average_users":"0","10_total_ratings_users":"0","11_average":"7.2","11_total_ratings":"1","11_average_users":"0","11_total_ratings_users":"0","12_average":"8.33","12_total_ratings":"1","12_average_users":"0","12_total_ratings_users":"0","13_average":"9","13_total_ratings":"1","13_average_users":"0","13_total_ratings_users":"0","description":"Sencillo, sin complicaciones ni dificultades"},
                        {"id":"8","name":"Accesibilidad","1_average":"7","1_total_ratings":"1","1_average_users":"0","1_total_ratings_users":"0","2_average":"7.25","2_total_ratings":"1","2_average_users":"0","2_total_ratings_users":"0","3_average":"8.25","3_total_ratings":"1","3_average_users":"0","3_total_ratings_users":"0","4_average":"9","4_total_ratings":"1","4_average_users":"0","4_total_ratings_users":"0","5_average":"8","5_total_ratings":"1","5_average_users":"0","5_total_ratings_users":"0","6_average":"8.6","6_total_ratings":"1","6_average_users":"0","6_total_ratings_users":"0","7_average":"7.75","7_total_ratings":"1","7_average_users":"0","7_total_ratings_users":"0","8_average":"4","8_total_ratings":"1","8_average_users":"0","8_total_ratings_users":"0","9_average":"7.8","9_total_ratings":"1","9_average_users":"0","9_total_ratings_users":"0","10_average":"8.75","10_total_ratings":"1","10_average_users":"0","10_total_ratings_users":"0","11_average":"8.2","11_total_ratings":"1","11_average_users":"0","11_total_ratings_users":"0","12_average":"7","12_total_ratings":"1","12_average_users":"0","12_total_ratings_users":"0","13_average":"8.8","13_total_ratings":"1","13_average_users":"0","13_total_ratings_users":"0","description":"Facilidad de acceder a la herramienta"}
                    ],
                    "tools_data":[
                        {"id":"1","name":"Airtable","average":"6.04","average_users":"4.25"},
                        {"id":"2","name":"Asana","average":"6.09","average_users":"0"},
                        {"id":"3","name":"Basecamp","average":"7.47","average_users":"0"},
                        {"id":"4","name":"Correo electrónico","average":"5.27","average_users":"0"},
                        {"id":"5","name":"Dropbox Paper","average":"6.38","average_users":"1.25"},
                        {"id":"6","name":"Google D","average":"6.54","average_users":"0"},
                        {"id":"7","name":"Notion","average":"7.16","average_users":"0"},
                        {"id":"8","name":"Jira","average":"5.94","average_users":"0"},
                        {"id":"9","name":"Slack","average":"6.13","average_users":"0"},
                        {"id":"10","name":"Telegram","average":"5.56","average_users":"0"},
                        {"id":"11","name":"Trello","average":"6.37","average_users":"0"},
                        {"id":"12","name":"Twist","average":"6.68","average_users":"0"},
                        {"id":"13","name":"Whatsapp","average":"4.76","average_users":"0"}
                    ]
                }
                
                setUpAxisDropdowns();
                loadDataInChart();
            }
        }
    })();

    chartFunctions.init();
    chartFunctions.loadDemoData();

    /** 
     * Rating Functions
     * 
    */
    const ratingFunctions = (function() {
        let selectedTool;
        let rating;

        function saveToDatabase(parameter) {
            $.ajax({
                url : "ajax-end-point/insertRating.php",
                data : {tool:selectedTool, rating:rating, parameter:parameter},
                type : "POST",
                success : function(data) {
                    updateTableValues(selectedTool);
                }
            });
        }

        function styleStars(star) {
            const parent = $(star).parent();
            parent.find("i:lt(" + (parseInt($(star).attr('data-index')) + 1) + "):not(.selected)").toggleClass("far fas");
        }

        function styleStarsPermanently(star) {
            const parent = $(star).parent();
            rating = parseInt($(star).attr('data-index')) + 1;
            parent.find("i:lt(" + rating + "):not(.selected)").toggleClass("far fas");
            saveToDatabase(parent.attr('data-index'));
        }

        function setStarsListeners() {
            $('.send').on('click', function () {
            });
        
            $('.fa-star').on('click', function () {
                styleStarsPermanently(this);
            });
        
            $('.fa-star').mouseover(function () {
                styleStars(this);
            });
        
            $('.fa-star').mouseleave(function () {
                styleStars(this);
            });
        }

        function updateTableValues(toolId) {
            selectedTool = toolId;
            $.ajax({
                url: 'ajax-end-point/getToolRatings.php',
                method: 'POST',
                data: {tool: toolId},
                success: function(data){
                    $('#bodyRatingTable').html(data);
                    setStarsListeners();
                }
            });
        }

        return {
            init: function() {
                updateTableValues(1)

                $('.dropdown-item.tool').on('click', function () {
                    updateTableValues($(this).attr('data-index'));
                });
            }
        }
    })();

    ratingFunctions.init();
});
