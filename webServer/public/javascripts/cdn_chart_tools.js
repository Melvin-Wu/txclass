/*!
 * CDN Chart Tools v1.0 by @Kenzeng 
 * Copyright 2014 Ucloud, Inc.
 *
 * Designed and built with all the love in the world by @Kenzeng .
 */

Highcharts.theme = {
	colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
	chart: {
        spacingRight: 35,
        zoomType: 'x',
		//backgroundColor:'rgba(68, 170, 213, 0.1)',
		borderWidth: 0,
		plotBackgroundColor: 'rgba(255, 255, 255, .9)',
		plotShadow: false,
		plotBorderWidth: 1
	},
	title: {
		style: {
			color: '#000',
			font: 'bold 16px "Î¢ÈíÑÅºÚ", Verdana, sans-serif'
		}
	},
	subtitle: {
		style: {
			color: '#666666',
			font: 'bold 12px "Î¢ÈíÑÅºÚ", Verdana, sans-serif'
		}
	},
	xAxis: {
		labels: {
			style: {
				color: '#000',
				font: '11px Î¢ÈíÑÅºÚ, Verdana, sans-serif'
			}
		},
		title: {
			style: {
				color: '#333',
				fontWeight: 'bold',
				fontSize: '12px',
				fontFamily: 'Î¢ÈíÑÅºÚ, Verdana, sans-serif'

			}
		}
	},
	yAxis: {
        gridLineWidth: 1,
		minorTickInterval: 'auto',
		tickWidth: 1,
		tickColor: '#000',
		labels: {
			style: {
				color: '#000',
				font: '11px Î¢ÈíÑÅºÚ, Verdana, sans-serif'
			}
		},
		title: {
            //align: 'high',
            //offset: 0,
            //rotation: 0,
            //x: 12,
            //y: -12,
			style: {
				color: '#333',
				fontSize: '13px',
				fontFamily: 'Î¢ÈíÑÅºÚ, Verdana, sans-serif'
			}
		}
	},
	legend: {
        borderWidth: 0,
		itemStyle: {
			font: '9pt Î¢ÈíÑÅºÚ, Verdana, sans-serif',
			color: 'black'

		},
		itemHoverStyle: {
			color: '#039'
		},
		itemHiddenStyle: {
			color: 'gray'
		}
	},
	labels: {
		style: {
			color: '#99b'
		}
	},

	navigation: {
		buttonOptions: {
			theme: {
				stroke: '#CCCCCC'
			}
		}
	}
};

// Apply the theme
var highchartsOptions = Highcharts.setOptions(Highcharts.theme);
/*Ajax get chart data to series*/
function listToSeries(list,options)
{
	$.each(list, function(i, line) 
	{        
		if (i == 0) {            
		    $.each(line, function(j, item) {    
			if (j > 0) 
			{
				options.series[j-1]={name:item,data:[]};
			}
			});
		}
		else {            
			$.each(line, function(j, item) {    
			if (j == 0) 
				options.xAxis.categories.push(item);
			else
			{
				if (parseFloat(item) < 0)
				{
					options.series[j-1].data.push(null);
				}
				else
				{
				    options.series[j-1].data.push(Math.round(parseFloat(item)*1000)/1000);
				}
			}
			});
		}         
	}); 
}

function listToSeries(list,options,valueDiv)
{
	$.each(list, function(i, line) 
	{        
		if (i == 0) {            
		    $.each(line, function(j, item) {    
			if (j > 0) 
			{
				options.series[j-1]={name:item,data:[]};
			}
			});
		}
		else {            
			$.each(line, function(j, item) {    
			if (j == 0){
                if(list.length >= 288 * 20){
                    options.xAxis.tickInterval = 5;
                }
                options.xAxis.categories.push(item);				
            }
			else
			{
				if (parseFloat(item) < 0)
				{
					options.series[j-1].data.push(null);
				}
				else
				{
				    options.series[j-1].data.push(Math.round(parseFloat(item)*1000/1000/valueDiv));
				}
			}
			});
		}         
	}); 
}

/*default zero points zero*/
function listToSeriesZero(list,options)
{
	$.each(list, function(i, line) {        
		if (i == 0) {            
		    $.each(line, function(j, item) {    
			if (j > 0) {
				options.series[j-1] = {name:item,data:[]};
			}});
		} else {            
			$.each(line, function(j, item) {    
			if (j == 0) 
				options.xAxis.categories.push(item);
			else {
			    options.series[j-1].data.push(Math.round(parseFloat(item)*1000)/1000);
			}});
		}         
	}); 
}

//Linecharts
function DoLinecharts(list,div,ySuffix,height,labelStep,valueSuffix,yTitle,valueDiv)
{
		var options = {
		chart: {
			renderTo: div,
			height:height,
			defaultSeriesType: 'spline'    
		},
		title: {
			text: '',
		},
		xAxis: {
            labels: {
            	step: labelStep,
            	rotation: 45
            },
			categories: [],
		tickInterval : 1
		},
		yAxis: {
			title: {
				text: yTitle,
			},
            labels:{
                format:'{value}' + ySuffix,       
            },
			min: 0
		},
		tooltip: {
			shared: true,
			crosshairs: true,
			valueSuffix: valueSuffix
		},
		legend: {
			borderWidth: 0
		},
		plotOptions: {
            spline: {
                lineWidth: 2,	
				states: {
                    hover: {
                        lineWidth: 3	 
                    }
                },
                marker: {
                    enabled: false
					//radius: 10
                },
            }
        },
		series: []
		}
		listToSeries(list,options,valueDiv);
		var chart = new Highcharts.Chart(options);
		return chart;
}

//Linecharts
function DoAreacharts(list,div,ySuffix,height,labelStep,valueSuffix,yTitle)
{
		var options = {
		chart: {
			renderTo: div,
			height:height,
			defaultSeriesType: 'area'    
		},
		title: {
			text: '',
		},
		xAxis: {
			labels: {
				step:labelStep,
			rotation:-20
			},
			categories: []
		},
		yAxis: {
			title: {
				text: yTitle,
			},
            labels:{
                format:'{value}' + ySuffix,       
            },
			min: 0
		},
		tooltip: {
			shared: true,
			crosshairs: true,
			valueSuffix: valueSuffix
		},
		plotOptions: {
            area: {
                pointStart: 1940,
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },
		legend: {
			borderWidth: 0
		},
		series: []
		}
		listToSeries(list,options,valueDiv);
		var chart = new Highcharts.Chart(options);
		return chart;
}

function DoPiecharts(categories,list,div,title,height,yAxisName)
{
			var options = 
			{    
				chart: {        
					renderTo: div,
					height:height,
					defaultSeriesType: 'pie'    
				},    
				title: {        
					text: title   
				},    
				xAxis: {     
					categories: categories   
				},    
				plotOptions: {
					pie: {
						allowPointSelect: true,
						cursor: 'pointer',
						dataLabels: {
							enabled: false
						},
						showInLegend: true
					}
				},
				series: []
			};
			var series={
				data:[]
			}
			$.each(list, function(i, line) 
			{        
				if (i == 0) {            
				$.each(line, function(j, item) {    
					if (j > 0) options.xAxis.categories.push(item);  
					});
				}
				else {            
					if(line[0]!="")
					var d=new Array(line[0],parseFloat(line[1]));
					series.data.push(d);
				}         
			});  
			options.series.push(series);
			// Create the chart    
			var chart = new Highcharts.Chart(options);
}
