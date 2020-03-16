const $ = jQuery.noConflict();

$(document).ready(function(){
    ChartFunctions = {
        initChart: function() {
            Chart.plugins.register({
                beforeRender: function(chart) {
                    if (chart.config.options.showAllTooltips) {
                        // create an array of tooltips
                        // we can't use the chart tooltip because there is only one tooltip per chart
                        chart.pluginTooltips = [];
                        chart.config.data.datasets.forEach(function(dataset, i) {
                            chart.getDatasetMeta(i).data.forEach(function(sector, j) {
                                chart.pluginTooltips.push(new Chart.Tooltip({
                                        _chart: chart.chart,
                                        _chartInstance: chart,
                                        _data: chart.data,
                                        _options: chart.options.tooltips,
                                        _active: [sector]
                                    },
                                    chart
                                ));
                            });
                        });
                    // turn off normal tooltips
                    chart.options.tooltips.enabled = false;
		        }},
                afterDraw: function(chart, easing) {
                    if (chart.config.options.showAllTooltips) {
                        // we don't want the permanent tooltips to animate, so don't do anything till the animation runs atleast once
                        if (!chart.allTooltipsOnce) {
                            if (easing !== 1) return;
                            chart.allTooltipsOnce = true;
                        }

                        // turn on tooltips
                        chart.options.tooltips.enabled = true;
                        Chart.helpers.each(chart.pluginTooltips, function(tooltip) {
                            tooltip.initialize();
                            tooltip._options.bodyFontFamily = "'Montserrat', sans-serif"
                            tooltip._options.displayColors = false;
                            tooltip._options.bodyFontSize = 14;
                            tooltip._options.yPadding = 0;
                            tooltip._options.xPadding = 0;
                            tooltip.update();
                            // we don't actually need this since we are not animating tooltips
                            tooltip.pivot();
                            tooltip.transition(easing).draw();
                        });
                        chart.options.tooltips.enabled = false;
                    }
                }
            });

            Chart.defaults.global.defaultFontColor='white';

            chart = new Chart(chartCtx, {
                type: 'bubble',
                labels: [1,2,3,4,5,6,7,8,9,10],
                options: {
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
                                const toolName = chartData[tooltip.dataPoints[0]["datasetIndex"] + 1][0];
                                const xCriteriaScore = chartData[0][chartCurrentXCriteria] + ": " + tooltip.dataPoints[0].xLabel;
                                const yCriteriaScore = chartData[0][chartCurrentYCriteria] + ": " + tooltip.dataPoints[0].yLabel;
                    
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
            })
        },
        loadDemoData: function() {
            chartData = [
                {
                   "0":"Herramienta",
                   "1":"Conversación de calidad",
                   "2":"Management",
                   "3":"Calma/Foco",
                   "4":"Documentación",
                   "5":"Versatilidad",
                   "6":"Colaboración",
                   "7":"Simple",
                   "8":"Accesibilidad"
                },
                {
                   "0":"Airtable",
                   "1":"3,33",
                   "2":"6,33",
                   "3":"6,00",
                   "4":"5,00",
                   "5":"8,00",
                   "6":"8,00",
                   "7":"4,67",
                   "8":"7,00"
                },
                {
                   "0":"Asana",
                   "1":"4,50",
                   "2":"7,00",
                   "3":"6,00",
                   "4":"5,50",
                   "5":"5,50",
                   "6":"6,50",
                   "7":"6,50",
                   "8":"7,25"
                },
                {
                   "0":"Basecamp",
                   "1":"6,25",
                   "2":"8,25",
                   "3":"8,50",
                   "4":"7,50",
                   "5":"5,00",
                   "6":"8,00",
                   "7":"8,00",
                   "8":"8,25"
                },
                {
                   "0":"Correo electrónico",
                   "1":"3,67",
                   "2":"3,33",
                   "3":"4,00",
                   "4":"4,33",
                   "5":"5,00",
                   "6":"4,20",
                   "7":"8,60",
                   "8":"9,00"
                },
                {
                   "0":"Dropbox Paper",
                   "1":"4,00",
                   "2":"5,00",
                   "3":"6,00",
                   "4":"7,00",
                   "5":"6,50",
                   "6":"7,00",
                   "7":"7,50",
                   "8":"8,00"
                },
                {
                   "0":"Google D",
                   "1":"2,00",
                   "2":"3,80",
                   "3":"6,40",
                   "4":"8,00",
                   "5":"7,50",
                   "6":"7,80",
                   "7":"8,20",
                   "8":"8,60"
                },
                {
                   "0":"Notion",
                   "1":"5,50",
                   "2":"6,20",
                   "3":"6,80",
                   "4":"8,80",
                   "5":"7,00",
                   "6":"8,00",
                   "7":"7,25",
                   "8":"7,75"
                },
                {
                   "0":"Jira",
                   "1":"4,75",
                   "2":"8,00",
                   "3":"6,25",
                   "4":"6,25",
                   "5":"6,75",
                   "6":"6,75",
                   "7":"4,75",
                   "8":"4,00"
                },
                {
                   "0":"Slack",
                   "1":"7,33",
                   "2":"3,50",
                   "3":"3,33",
                   "4":"3,67",
                   "5":"7,80",
                   "6":"7,40",
                   "7":"8,20",
                   "8":"7,80"
                },
                {
                   "0":"Telegram",
                   "1":"5,75",
                   "2":"3,75",
                   "3":"4,25",
                   "4":"2,50",
                   "5":"6,00",
                   "6":"5,25",
                   "7":"8,25",
                   "8":"8,75"
                },
                {
                   "0":"Trello",
                   "1":"4,40",
                   "2":"6,67",
                   "3":"6,00",
                   "4":"5,50",
                   "5":"5,80",
                   "6":"7,20",
                   "7":"7,20",
                   "8":"8,20"
                },
                {
                   "0":"Twist",
                   "1":"8,33",
                   "2":"5,00",
                   "3":"7,67",
                   "4":"4,67",
                   "5":"4,75",
                   "6":"7,67",
                   "7":"8,33",
                   "8":"7,00"
                },
                {
                   "0":"Whatsapp",
                   "1":"4,00",
                   "2":"2,80",
                   "3":"2,60",
                   "4":"2,00",
                   "5":"4,25",
                   "6":"4,60",
                   "7":"9,00",
                   "8":"8,80"
                }
            ];
            this.setQualificationParameters();
            this.loadDataInChart();
        },
        loadDataInChart: function() {
            const chartDatasets = [];
            for (let i = 1; i < chartData.length; i++) {
                const xCriteriaScore = parseFloat(chartData[i][chartCurrentXCriteria].replace(',','.').replace(' ',''))
                const yCriteriaScore = parseFloat(chartData[i][chartCurrentYCriteria].replace(',','.').replace(' ',''))

                chartDatasets.push({
                    label: chartData[i][0],
                    borderColor: chartPointsColor,
                    backgroundColor: chartPointsColor,
                    data: [{x: xCriteriaScore, y: yCriteriaScore, r: 5}]
                });
            }

            this.updateChart(chartDatasets)
        },
        setQualificationParameters: function() {
            let qualificationParameters = Object.values(chartData[0]);

            // Add the tool names as items in the axis dropdowns
            for (let i = 1; i < qualificationParameters.length; i++) {
                chartXCriteriaDropdown.append( '<a class="dropdown-item" href="#">' + qualificationParameters[i] + '</a>' );
                chartYCriteriaDropdown.append( '<a class="dropdown-item" href="#">' + qualificationParameters[i] + '</a>' );
            }

            // Set click listeners to the tool names (dropdowns items in the axis dropdowns)
            $('.dropdown-item').click(function(){
                // +1 to match json data index
                const selectedCriteriaIndex =  $(this).index() + 1;
                const isDropdownFromXAxis = $(this).parent()[0] == chartXCriteriaDropdown[0];
        
                if (isDropdownFromXAxis) {
                    ChartFunctions.updateXAxis(selectedCriteriaIndex)
                } else {
                    ChartFunctions.updateYAxis(selectedCriteriaIndex)
                }
            });
        },
        updateXAxis: function(criteriaIndex) {
            // Must swipe axis
            if (criteriaIndex == chartCurrentYCriteria) {
                chartCurrentYCriteria = chartCurrentXCriteria;
            }

            chartCurrentXCriteria = criteriaIndex;
            const chartDatasets = [];
            
            // Obtain from each tool the note of the selected criteria
            for (let i = 1; i < chartData.length; i++) {
                const xScore = parseFloat(chartData[i][criteriaIndex].replace(',','.').replace(' ',''));
                const yScore = parseFloat(chartData[i][chartCurrentYCriteria].replace(',','.').replace(' ',''));

                chartDatasets.push({
                    label: chartData[i][0],
                    backgroundColor: chartPointsColor,
                    borderColor: chartPointsColor,
                    data: [{x: xScore, y: yScore, r: 5}]
                });
            }

            this.updateChart(chartDatasets);
        },
        updateYAxis: function(criteriaIndex) {
            // Must swipe axis
            if (criteriaIndex == chartCurrentXCriteria) {
                chartCurrentXCriteria = chartCurrentYCriteria;
            }

            chartCurrentYCriteria = criteriaIndex;
            const chartDatasets = [];    
            
            // Obtain from each tool the note of the selected criteria
            for (let i = 1; i < chartData.length; i++) {
                const xScore = parseFloat(chartData[i][chartCurrentXCriteria].replace(',','.').replace(' ',''));
                const yScore = parseFloat(chartData[i][criteriaIndex].replace(',','.').replace(' ',''));
                
                chartDatasets.push({
                    label: chartData[i][0],
                    backgroundColor: chartPointsColor,
                    borderColor: chartPointsColor,
                    data: [{x: xScore, y: yScore, r: 5}]
                });
            }

            this.updateChart(chartDatasets);
        },
        updateChart: function(datasets) {
            // Pop all the data from the chart
            chart.data.datasets.forEach((dataset) => {
                dataset.data.pop();
            });

            // Update Chart
            chart.data.datasets = datasets;
            chart.options.title.text = chartData[0][chartCurrentXCriteria] + " y " + chartData[0][chartCurrentYCriteria];
            chart.update();

            // Update Dropdown Text
            chartXCriteriaSpan.textContent = chartData[0][chartCurrentXCriteria];
            chartYCriteriaSpan.textContent = chartData[0][chartCurrentYCriteria];
        }
    }

    let chart;
    let chartData;
    let chartCurrentXCriteria = 1;
    let chartCurrentYCriteria = 2;

    const chartPointsColor = "#00e5c8";
    const chartCtx = $('#chart');
    const chartXCriteriaSpan = $('#criteriaX')[0];
    const chartYCriteriaSpan = $('#criteriaY')[0];
    const chartXCriteriaDropdown = $('#xDropdownMenu');
    const chartYCriteriaDropdown = $('#yDropdownMenu');

    ChartFunctions.initChart();
    ChartFunctions.loadDemoData();
    checkIfShowAllTooltips();

    $(window).resize(function() {
        checkIfShowAllTooltips();
    });

    function checkIfShowAllTooltips() {
        if ($(window).width() < 990) {
            chart.options.showAllTooltips = false;
            chart.update();
        } else {
            chart.options.showAllTooltips = true;
            chart.update();
        }
    }
});
