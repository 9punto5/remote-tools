jQuery( function() {
    /** 
     * Chart Functions
     * 
    */
    const chartFunctions = (function() {
        let chartData,
        currentXCriteria,
        currentYCriteria,
        xCriteriaSpan,
        yCriteriaSpan,
        lastestWindowWidth,
        lastestWindowHeight;

        const borderColor = "#00e5c8",
        backgroundColor = "#00e5c8",
        pointRadius = 7;

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
            const toQuery = chartData["rating_parameters_averages"];

            for (let i = 0; i < chartData["tools"].length; i++) {

                const x = toQuery.filter( function(item){
                    return (item.id=="" + (i + 1) + (currentXCriteria + 1));
                })[0].rating;

                const y = toQuery.filter( function(item){
                    return (item.id=="" + (i + 1) + (currentYCriteria + 1));
                } )[0].rating;

                chartDatasets.push({
                    label: chartData["tools"][i].name,
                    borderColor: borderColor,
                    backgroundColor: backgroundColor,
                    data: [{x: x, y: y, r: pointRadius}]
                });
            }

            this.updateChart(chartDatasets)
        }

        setUpAxisDropdowns = function() {
            const chartXCriteriaDropdown = $('#xDropdownMenu');
            const chartYCriteriaDropdown = $('#yDropdownMenu');
            const ratingParameters = chartData["tool_rating_parameters"];

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
            if (criteriaIndex == currentYCriteria) {
                currentYCriteria = currentXCriteria;
            }
            
            currentXCriteria = criteriaIndex;
            this.loadDataInChart();
        }

        updateYAxis = function(criteriaIndex) {
            // Swipe axis
            if (criteriaIndex == currentXCriteria) {
                currentXCriteria = currentYCriteria;
            }

            currentYCriteria = criteriaIndex;
            this.loadDataInChart();
        }

        updateChart = function(datasets) {
            // Pop all the data from the chart
            chart.data.datasets.forEach((dataset) => {
                dataset.data.pop();
            });

            // Update chart
            chart.data.datasets = datasets;
            chart.options.title.text = chartData["tool_rating_parameters"][currentXCriteria].name 
            + " y " + chartData["tool_rating_parameters"][currentYCriteria].name;
            chart.update();

            // Update Dropdown Text
            xCriteriaSpan.textContent = chartData["tool_rating_parameters"][currentXCriteria].name;
            yCriteriaSpan.textContent = chartData["tool_rating_parameters"][currentYCriteria].name;

            $('#xAxisInfoTitle')[0].textContent = chartData["tool_rating_parameters"][currentXCriteria].name;
            $('#yAxisInfoTitle')[0].textContent = chartData["tool_rating_parameters"][currentYCriteria].name;

            $('#xAxisInfoDescription')[0].textContent = chartData["tool_rating_parameters"][currentXCriteria].description;
            $('#yAxisInfoDescription')[0].textContent = chartData["tool_rating_parameters"][currentYCriteria].description;

            $('#yDropdownContainer').width($('.chart-container').height());
        }

        updateChartOptions = function(windowWidth, windowHeight) {
            $('#yDropdownContainer').width($('.chart-container').height()); 

            // We don't wanna do nothing when the user scrolls down and the navigator bar hides
            if (windowWidth == lastestWindowWidth && windowHeight != lastestWindowHeight) {
                return;
            }

            lastestWindowWidth = windowWidth;
            lastestWindowHeight = windowHeight;

            if (windowWidth < 576) {
                chart.options.maintainAspectRatio = false;

                if (windowHeight < 420) {
                    chart.canvas.parentNode.style.height = windowHeight + 'px';
                } else if (windowHeight < 600) {
                    chart.canvas.parentNode.style.height = (windowHeight / 1.5) + 'px';
                } else if (windowHeight < 900) {
                    chart.canvas.parentNode.style.height = (windowHeight / 2.5) + 'px';
                }
            } else {
                chart.canvas.parentNode.style.height = 'auto';
                chart.options.maintainAspectRatio = true;
            }

            chart.options.showAllTooltips = !(windowWidth < 960);
            chart.update();
        }

        return {
            init: function() {
                const chartCtx = $('#chart')[0].getContext('2d');
                xCriteriaSpan = $('#criteriaX')[0];
                yCriteriaSpan = $('#criteriaY')[0];
                currentXCriteria = 0;
                currentYCriteria = 1;
                customizeStyling();
                
                chart = new Chart(chartCtx, {
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
                                    const toolName = chartData["tools"][tooltip.dataPoints[0]["datasetIndex"]].name;
                                    const xCriteriaScore = chartData["tool_rating_parameters"][currentXCriteria].name + ": " + tooltip.dataPoints[0].xLabel;
                                    const yCriteriaScore = chartData["tool_rating_parameters"][currentYCriteria].name + ": " + tooltip.dataPoints[0].yLabel;
                        
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
                    $('#yDropdownContainer').width($('.chart-container').height()); 
                    updateChartOptions($(window).width(), $(window).height())
                });
            },
            loadDemoData: function() {
                chartData = {
                        "tools":[
                            {"0":"1","1":"Airtable","id":"1","name":"Airtable"},
                            {"0":"2","1":"Asana","id":"2","name":"Asana"},
                            {"0":"3","1":"Basecamp","id":"3","name":"Basecamp"},
                            {"0":"4","1":"Correo electrónico","id":"4","name":"Correo electrónico"},
                            {"0":"5","1":"Dropbox Paper","id":"5","name":"Dropbox Paper"},
                            {"0":"6","1":"Google D","id":"6","name":"Google D"},
                            {"0":"7","1":"Notion","id":"7","name":"Notion"},
                            {"0":"8","1":"Jira","id":"8","name":"Jira"},
                            {"0":"9","1":"Slack","id":"9","name":"Slack"},
                            {"0":"10","1":"Telegram","id":"10","name":"Telegram"},
                            {"0":"11","1":"Trello","id":"11","name":"Trello"},
                            {"0":"12","1":"Twist","id":"12","name":"Twist"},
                            {"0":"13","1":"Whatsapp","id":"13","name":"Whatsapp"}
                        ],
                        "tool_rating_parameters":[
                            {"0":"1","1":"Conversación de calidad","2":null,"id":"1","name":"Conversación de calidad","description":"Intercambiar ideas, necesidades, información, de manera cómoda y completa."},
                            {"0":"2","1":"Management","2":null,"id":"2","name":"Management","description":"Capacidad de administración y gestión de los recursos."},
                            {"0":"3","1":"Calma/Foco","2":null,"id":"3","name":"Calma/Foco","description":"Permite centrarnos en la tarea que se está realizando."},
                            {"0":"4","1":"Documentación","2":null,"id":"4","name":"Documentación","description":"Instrucciones, documentos y guias para utilizar la herramienta."},
                            {"0":"5","1":"Versatilidad","2":null,"id":"5","name":"Versatilidad","description":"Capacidad de adapatarse a las necesidades del usuario y utilidad en distintas tareas."},
                            {"0":"6","1":"Colaboración","2":null,"id":"6","name":"Colaboración","description":"Trabajar en conjunto para completar una tarea o alcanzar una meta."},
                            {"0":"7","1":"Simple","2":null,"id":"7","name":"Simple","description":"Facilidad de uso."},
                            {"0":"8","1":"Accesibilidad","2":null,"id":"8","name":"Accesibilidad","description":"Que es utilizable por todas las personas en condiciones de comodidad y de la forma más autónoma y natural posible."}
                        ],
                        "rating_parameters_averages":[
                            {"id":"101","tool_id":"10","parameter_id":"1","rating":"5.75","users_rating":null,"users_rating_count":null},
                            {"id":"102","tool_id":"10","parameter_id":"2","rating":"3.75","users_rating":null,"users_rating_count":null},
                            {"id":"103","tool_id":"10","parameter_id":"3","rating":"4.25","users_rating":null,"users_rating_count":null},
                            {"id":"104","tool_id":"10","parameter_id":"4","rating":"2.5","users_rating":null,"users_rating_count":null},
                            {"id":"105","tool_id":"10","parameter_id":"5","rating":"6","users_rating":null,"users_rating_count":null},
                            {"id":"106","tool_id":"10","parameter_id":"6","rating":"5.25","users_rating":null,"users_rating_count":null},
                            {"id":"107","tool_id":"10","parameter_id":"7","rating":"8.25","users_rating":null,"users_rating_count":null},
                            {"id":"108","tool_id":"10","parameter_id":"8","rating":"8.75","users_rating":null,"users_rating_count":null},
                            {"id":"11","tool_id":"1","parameter_id":"1","rating":"3.33","users_rating":null,"users_rating_count":null},
                            {"id":"111","tool_id":"11","parameter_id":"1","rating":"4.4","users_rating":null,"users_rating_count":null},
                            {"id":"112","tool_id":"11","parameter_id":"2","rating":"6.67","users_rating":null,"users_rating_count":null},
                            {"id":"113","tool_id":"11","parameter_id":"3","rating":"6","users_rating":null,"users_rating_count":null},
                            {"id":"114","tool_id":"11","parameter_id":"4","rating":"5.5","users_rating":null,"users_rating_count":null},
                            {"id":"115","tool_id":"11","parameter_id":"5","rating":"5.8","users_rating":null,"users_rating_count":null},
                            {"id":"116","tool_id":"11","parameter_id":"6","rating":"7.2","users_rating":null,"users_rating_count":null},
                            {"id":"117","tool_id":"11","parameter_id":"7","rating":"7.2","users_rating":null,"users_rating_count":null},
                            {"id":"118","tool_id":"11","parameter_id":"8","rating":"8.2","users_rating":null,"users_rating_count":null},
                            {"id":"12","tool_id":"1","parameter_id":"2","rating":"6.33","users_rating":null,"users_rating_count":null},
                            {"id":"121","tool_id":"12","parameter_id":"1","rating":"8.33","users_rating":null,"users_rating_count":null},
                            {"id":"122","tool_id":"12","parameter_id":"2","rating":"5","users_rating":null,"users_rating_count":null},
                            {"id":"123","tool_id":"12","parameter_id":"3","rating":"7.67","users_rating":null,"users_rating_count":null},
                            {"id":"124","tool_id":"12","parameter_id":"4","rating":"4.67","users_rating":null,"users_rating_count":null},
                            {"id":"125","tool_id":"12","parameter_id":"5","rating":"4.75","users_rating":null,"users_rating_count":null},
                            {"id":"126","tool_id":"12","parameter_id":"6","rating":"7.67","users_rating":null,"users_rating_count":null},
                            {"id":"127","tool_id":"12","parameter_id":"7","rating":"8.33","users_rating":null,"users_rating_count":null},
                            {"id":"128","tool_id":"12","parameter_id":"8","rating":"7","users_rating":null,"users_rating_count":null},
                            {"id":"13","tool_id":"1","parameter_id":"3","rating":"6","users_rating":null,"users_rating_count":null},
                            {"id":"131","tool_id":"13","parameter_id":"1","rating":"4","users_rating":null,"users_rating_count":null},
                            {"id":"132","tool_id":"13","parameter_id":"2","rating":"3","users_rating":null,"users_rating_count":null},
                            {"id":"133","tool_id":"13","parameter_id":"3","rating":"3","users_rating":null,"users_rating_count":null},
                            {"id":"134","tool_id":"13","parameter_id":"4","rating":"2","users_rating":null,"users_rating_count":null},
                            {"id":"135","tool_id":"13","parameter_id":"5","rating":"4","users_rating":null,"users_rating_count":null},
                            {"id":"136","tool_id":"13","parameter_id":"6","rating":"5","users_rating":null,"users_rating_count":null},
                            {"id":"137","tool_id":"13","parameter_id":"7","rating":"9","users_rating":null,"users_rating_count":null},
                            {"id":"138","tool_id":"13","parameter_id":"8","rating":"9","users_rating":null,"users_rating_count":null},
                            {"id":"14","tool_id":"1","parameter_id":"4","rating":"5","users_rating":null,"users_rating_count":null},
                            {"id":"15","tool_id":"1","parameter_id":"5","rating":"8","users_rating":null,"users_rating_count":null},
                            {"id":"16","tool_id":"6","parameter_id":"1","rating":"2","users_rating":null,"users_rating_count":null},
                            {"id":"17","tool_id":"7","parameter_id":"1","rating":"5.5","users_rating":null,"users_rating_count":null},
                            {"id":"18","tool_id":"8","parameter_id":"1","rating":"4.75","users_rating":null,"users_rating_count":null},
                            {"id":"21","tool_id":"2","parameter_id":"1","rating":"4.5","users_rating":null,"users_rating_count":null},
                            {"id":"22","tool_id":"2","parameter_id":"2","rating":"7","users_rating":null,"users_rating_count":null},
                            {"id":"23","tool_id":"3","parameter_id":"2","rating":"8.25","users_rating":null,"users_rating_count":null},
                            {"id":"24","tool_id":"4","parameter_id":"2","rating":"3.33","users_rating":null,"users_rating_count":null},
                            {"id":"25","tool_id":"5","parameter_id":"2","rating":"5","users_rating":null,"users_rating_count":null},
                            {"id":"26","tool_id":"6","parameter_id":"2","rating":"4","users_rating":null,"users_rating_count":null},
                            {"id":"27","tool_id":"2","parameter_id":"7","rating":"6.5","users_rating":null,"users_rating_count":null},
                            {"id":"28","tool_id":"2","parameter_id":"8","rating":"7.25","users_rating":null,"users_rating_count":null},
                            {"id":"31","tool_id":"3","parameter_id":"1","rating":"6.25","users_rating":null,"users_rating_count":null},
                            {"id":"32","tool_id":"2","parameter_id":"3","rating":"6","users_rating":null,"users_rating_count":null},
                            {"id":"33","tool_id":"3","parameter_id":"3","rating":"8.5","users_rating":null,"users_rating_count":null},
                            {"id":"34","tool_id":"4","parameter_id":"3","rating":"4","users_rating":null,"users_rating_count":null},
                            {"id":"35","tool_id":"5","parameter_id":"3","rating":"6","users_rating":null,"users_rating_count":null},
                            {"id":"36","tool_id":"6","parameter_id":"3","rating":"6","users_rating":null,"users_rating_count":null},
                            {"id":"37","tool_id":"7","parameter_id":"3","rating":"6.8","users_rating":null,"users_rating_count":null},
                            {"id":"38","tool_id":"8","parameter_id":"3","rating":"6.25","users_rating":null,"users_rating_count":null},
                            {"id":"4","tool_id":"4","parameter_id":"1","rating":"3.67","users_rating":null,"users_rating_count":null},
                            {"id":"41","tool_id":"2","parameter_id":"4","rating":"5.5","users_rating":null,"users_rating_count":null},
                            {"id":"42","tool_id":"3","parameter_id":"4","rating":"7.5","users_rating":null,"users_rating_count":null},
                            {"id":"43","tool_id":"4","parameter_id":"4","rating":"4.33","users_rating":null,"users_rating_count":null},
                            {"id":"44","tool_id":"5","parameter_id":"4","rating":"7","users_rating":null,"users_rating_count":null},
                            {"id":"45","tool_id":"4","parameter_id":"5","rating":"5","users_rating":null,"users_rating_count":null},
                            {"id":"46","tool_id":"4","parameter_id":"6","rating":"4.2","users_rating":null,"users_rating_count":null},
                            {"id":"47","tool_id":"4","parameter_id":"7","rating":"8.6","users_rating":null,"users_rating_count":null},
                            {"id":"48","tool_id":"8","parameter_id":"4","rating":"6.25","users_rating":null,"users_rating_count":null},
                            {"id":"51","tool_id":"5","parameter_id":"1","rating":"4","users_rating":null,"users_rating_count":null},
                            {"id":"52","tool_id":"2","parameter_id":"5","rating":"5.5","users_rating":null,"users_rating_count":null},
                            {"id":"53","tool_id":"3","parameter_id":"5","rating":"5","users_rating":null,"users_rating_count":null},
                            {"id":"55","tool_id":"5","parameter_id":"5","rating":"7","users_rating":null,"users_rating_count":null},
                            {"id":"56","tool_id":"6","parameter_id":"5","rating":"8","users_rating":null,"users_rating_count":null},
                            {"id":"57","tool_id":"7","parameter_id":"5","rating":"7","users_rating":null,"users_rating_count":null},
                            {"id":"58","tool_id":"8","parameter_id":"5","rating":"6.75","users_rating":null,"users_rating_count":null},
                            {"id":"61","tool_id":"1","parameter_id":"6","rating":"8","users_rating":null,"users_rating_count":null},
                            {"id":"62","tool_id":"2","parameter_id":"6","rating":"6.5","users_rating":null,"users_rating_count":null},
                            {"id":"63","tool_id":"3","parameter_id":"6","rating":"8","users_rating":null,"users_rating_count":null},
                            {"id":"64","tool_id":"6","parameter_id":"4","rating":"8","users_rating":null,"users_rating_count":null},
                            {"id":"65","tool_id":"5","parameter_id":"6","rating":"7","users_rating":null,"users_rating_count":null},
                            {"id":"66","tool_id":"6","parameter_id":"6","rating":"8","users_rating":null,"users_rating_count":null},
                            {"id":"67","tool_id":"7","parameter_id":"6","rating":"8","users_rating":null,"users_rating_count":null},
                            {"id":"68","tool_id":"8","parameter_id":"6","rating":"6.75","users_rating":null,"users_rating_count":null},
                            {"id":"71","tool_id":"1","parameter_id":"7","rating":"4.67","users_rating":null,"users_rating_count":null},
                            {"id":"72","tool_id":"7","parameter_id":"2","rating":"6.2","users_rating":null,"users_rating_count":null},
                            {"id":"73","tool_id":"3","parameter_id":"7","rating":"8","users_rating":null,"users_rating_count":null},
                            {"id":"74","tool_id":"7","parameter_id":"4","rating":"8.8","users_rating":null,"users_rating_count":null},
                            {"id":"75","tool_id":"5","parameter_id":"7","rating":"8","users_rating":null,"users_rating_count":null},
                            {"id":"76","tool_id":"6","parameter_id":"7","rating":"8","users_rating":null,"users_rating_count":null},
                            {"id":"77","tool_id":"7","parameter_id":"7","rating":"7.25","users_rating":null,"users_rating_count":null},
                            {"id":"78","tool_id":"8","parameter_id":"7","rating":"4.75","users_rating":null,"users_rating_count":null},
                            {"id":"81","tool_id":"1","parameter_id":"8","rating":"7","users_rating":null,"users_rating_count":null},
                            {"id":"82","tool_id":"8","parameter_id":"2","rating":"8","users_rating":null,"users_rating_count":null},
                            {"id":"83","tool_id":"3","parameter_id":"8","rating":"8.25","users_rating":null,"users_rating_count":null},
                            {"id":"84","tool_id":"4","parameter_id":"8","rating":"9","users_rating":null,"users_rating_count":null},
                            {"id":"85","tool_id":"5","parameter_id":"8","rating":"8","users_rating":null,"users_rating_count":null},
                            {"id":"86","tool_id":"6","parameter_id":"8","rating":"9","users_rating":null,"users_rating_count":null},
                            {"id":"87","tool_id":"7","parameter_id":"8","rating":"7.75","users_rating":null,"users_rating_count":null},
                            {"id":"88","tool_id":"8","parameter_id":"8","rating":"4","users_rating":null,"users_rating_count":null},
                            {"id":"91","tool_id":"9","parameter_id":"1","rating":"7.33","users_rating":null,"users_rating_count":null},
                            {"id":"92","tool_id":"9","parameter_id":"2","rating":"3.5","users_rating":null,"users_rating_count":null},
                            {"id":"93","tool_id":"9","parameter_id":"3","rating":"3.33","users_rating":null,"users_rating_count":null},
                            {"id":"94","tool_id":"9","parameter_id":"4","rating":"3.67","users_rating":null,"users_rating_count":null},
                            {"id":"95","tool_id":"9","parameter_id":"5","rating":"7.8","users_rating":null,"users_rating_count":null},
                            {"id":"96","tool_id":"9","parameter_id":"6","rating":"7.4","users_rating":null,"users_rating_count":null},
                            {"id":"97","tool_id":"9","parameter_id":"7","rating":"8.2","users_rating":null,"users_rating_count":null},
                            {"id":"98","tool_id":"9","parameter_id":"8","rating":"7.8","users_rating":null,"users_rating_count":null}
                        ]
                }
                setUpAxisDropdowns();
                loadDataInChart();
            },
            loadDatabaseData: function() {
                $.ajax({
                    url: 'ajax-end-point/get-chart-data.php',
                    method: 'POST',
                    success: function(data){
                        chartData = data;
                        setUpAxisDropdowns();
                        loadDataInChart();
                    }
                });
            }
        }
    })();

    chartFunctions.init();
    //chartFunctions.loadDemoData();
    chartFunctions.loadDatabaseData();

    /** 
     * Rating Functions
     * 
    */
    const ratingFunctions = (function() {
        const asCookie = typeof(Storage) == "undefined";
        let ratedParameter,
        selectedTool,
        rating;

        function createCookie(name, value, days) {
            var expires;
        
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toGMTString();
            } else {
                expires = "";
            }
            document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
        }
        
        function readCookie(name) {
            var nameEQ = encodeURIComponent(name) + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === ' ')
                    c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0)
                    return decodeURIComponent(c.substring(nameEQ.length, c.length));
            }
            return null;
        }

        function getUserRatingForParameterOfTool(parameter) {
            if (asCookie) {
                readCookie("" + selectedTool + parameter);
            } else {
                return localStorage.getItem("" + selectedTool + parameter);
            }
        }

        function parameterOfToolRatedIsNotRated(parameter) {
            if (asCookie) {
                return !(readCookie("" + selectedTool + parameter));
            } else {
                return !(localStorage.getItem("" + selectedTool + parameter));
            }
        }

        function setParameterOfToolAsRated() {
            if (asCookie) {
                createCookie("" + selectedTool + ratedParameter, rating, 7);
            } else {
                localStorage.setItem("" + selectedTool + ratedParameter, rating);
            }
        }

        function saveToDatabase() {
            if (rating < 1 || rating > 10) {
                return
            }
            if (parameterOfToolRatedIsNotRated(ratedParameter)) {
                $.ajax({
                    url : "ajax-end-point/insert-rating.php",
                    data : {ratedToolId:selectedTool, ratedToolRatingParameterId:ratedParameter, rating:rating},
                    type : "POST",
                    success : function(data) {
                        setParameterOfToolAsRated();
                        updateTableValues(selectedTool);
                    }
                });
            }
        }

        function styleStars(star) {
            const parent = $(star).parent();
            parent.find("i:lt(" + (parseInt($(star).attr('data-index')) + 1) + "):not(.selected)").toggleClass("far fas");
        }

        function styleStarsPermanently(star) {
            const parent = $(star).parent();

            ratedParameter = parent.attr('data-index');
            rating = parseInt($(star).attr('data-index')) + 1;
            
            parent.find("i:lt(" + rating + "):not(.selected)").toggleClass("far fas");
            parent.find("i").unbind();

            saveToDatabase();
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
                url: 'ajax-end-point/get-tool-ratings-table.php',
                method: 'POST',
                data: {toolId: toolId, updatedRatingParameter: ratedParameter},
                success: function(data){
                    $('#ratingTable').html(data);
                    setStarsListeners();

                    const starsContainers = $('.stars-container');
                    $.each(starsContainers, function(i, val) {
                        const parameter = $(val).attr('data-index');
                        if (!parameterOfToolRatedIsNotRated(parameter)) {
                            const rating = getUserRatingForParameterOfTool(parameter);
                            $(val).find("i").unbind();
                            $(val).find("i:lt(" + (parseInt(rating)) + "):not(.selected)").toggleClass("far fas");
                        }
                    });

                    $('.dropdown-item.tool').on('click', function () {
                        updateTableValues($(this).attr('data-index'));
                    });
                }
            });
        }

        return {
            init: function() {


                updateTableValues(1)
            }
        }
    })();

    ratingFunctions.init();
});
