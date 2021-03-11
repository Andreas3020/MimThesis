var chart; 
var skippedPatientsListE, skippedPatientsListLM, skippedPatientsListH;
var varianceListE, varianceListM, varianceListH;
var avgDifferenceListE, avgDifferenceListM, avgDifferenceListH;
var appointementSpeedListE, appointementSpeedListM, appointementSpeedListH;
var timeListE, timeListM, timeListH;


function getStat(){
    database.once('value', function(snapshot) {
        let roomList = Object.keys(snapshot.val());
        let nrOfRooms = roomList.length;

        if(nrOfRooms>0){
            roomName = roomList[0];
            //skipped patients lists
            database.child(roomName).child("statistics").child("skippedPatients").child("easy").on('value', function(snapshot){
              skippedPatientsListE = Object.values(snapshot.val());
            });

            database.child(roomName).child("statistics").child("skippedPatients").child("moderate").on('value', function(snapshot){
              skippedPatientsListM = Object.values(snapshot.val());
            });

            database.child(roomName).child("statistics").child("skippedPatients").child("hard").on('value', function(snapshot){
              skippedPatientsListH = Object.values(snapshot.val());
            });

            //variance lists
            database.child(roomName).child("statistics").child("variance").child("easy").child("variance").on('value', function(snapshot){
                varianceListE = Object.values(snapshot.val());
            });
            database.child(roomName).child("statistics").child("variance").child("easy").child("avgDifference").on('value', function(snapshot){
                avgDifferenceListE = Object.values(snapshot.val());
            });

            database.child(roomName).child("statistics").child("variance").child("moderate").child("variance").on('value', function(snapshot){
              varianceListM = Object.values(snapshot.val());
            });
            database.child(roomName).child("statistics").child("variance").child("moderate").child("avgDifference").on('value', function(snapshot){
              avgDifferenceListM = Object.values(snapshot.val());
            });

            database.child(roomName).child("statistics").child("variance").child("hard").child("variance").on('value', function(snapshot){
              varianceListH = Object.values(snapshot.val());
            });
            database.child(roomName).child("statistics").child("variance").child("hard").child("avgDifference").on('value', function(snapshot){
              avgDifferenceListH = Object.values(snapshot.val());
            });

            //appointment speed lists
            database.child(roomName).child("statistics").child("appointmentSpeed").child("easy").on('value', function(snapshot){
                appointementSpeedListE = Object.values(snapshot.val());
            });
            database.child(roomName).child("statistics").child("appointmentSpeed").child("moderate").on('value', function(snapshot){
              appointementSpeedListM = Object.values(snapshot.val());
            });
            database.child(roomName).child("statistics").child("appointmentSpeed").child("hard").on('value', function(snapshot){
              appointementSpeedListH = Object.values(snapshot.val());
            });

            //completion time lists
            database.child(roomName).child("statistics").child("time").child("easy").on('value', function(snapshot){
              timeListE = Object.values(snapshot.val());
            });
            database.child(roomName).child("statistics").child("time").child("moderate").on('value', function(snapshot){
              timeListM = Object.values(snapshot.val());
            });
            database.child(roomName).child("statistics").child("time").child("hard").on('value', function(snapshot){
              timeListH = Object.values(snapshot.val());
              createChart();
            });

        }
    });
}

// Create the chart
function createChart(){
  //so only 3 times a '9' and 4 times a '10'
  let testArray = [0,0,0,1,1,1,1,1,2,2,3,3,4,4,4,4,5,5,6,6,6,6,7,7,7,8,8,8,8,8,9,9,9,10,10,10,10]

  Highcharts.chart('test', {
    title: {
        text: 'test'
    },

    xAxis: [{
        visible: false,
    }, {
        title: { text: 'test x' },
        showLastLabel: true,
    }],

    yAxis: [{
        visible: false
    }, {
        title: { text: 'test y' },
    }],

    plotOptions: {
      series: {
        borderWidth: 0,
        pointPlacement: 'between',
        dataLabels: {
          enabled: true
        },
      },
      histogram: {
            binWidth: 1
        }
        
    },

    series: [{
      name: 'Test',
      type: 'histogram',
      yaxis: 1,
      xAxis: 1,
      baseSeries: 'testSeries'
    },
    {
      id: 'testSeries',
      visible: false,
      data: testArray
    }]
    });


    let avgSkippedEasy = Math.round(100*skippedPatientsListE.reduce((a, b) => a + b, 0)/skippedPatientsListE.length)/100;
    let avgSkippedModerate = Math.round(100*skippedPatientsListM.reduce((a, b) => a + b, 0)/skippedPatientsListM.length)/100;
    let avgSkippedHard = Math.round(100*skippedPatientsListH.reduce((a, b) => a + b, 0)/skippedPatientsListH.length)/100;

    var initialOptionsSkipped = {

        chart: {
          events: {
            drilldown: function(e) {
              this.update({
                title: {
                  text: "Skipped patient: " + e.point.name
                },
                xAxis: {
                  title: {
                    text: "Nr of skipped patients"
                  },
                  tickmarkPlacement: 'on',
                },
                yAxis: {
                  title: {
                    text: "Nr of players"
                  }
                },
				plotOptions:{
                    series:{
                        pointPlacement: 'between'
                    }
                }

              });

              if (!e.seriesOptions) {
                var chart = this,
                  drilldowns = {
                    'Histogram: Easy': {
                      name: 'Easy',
                      type: 'histogram',
                      baseSeries: 'avgSkippedEasy'
                    },
                    'Easy': {
                      id: 'avgSkippedEasy',
                      visible: false,
                      data: skippedPatientsListE
                    },
                    'Histogram: Moderate': {
                        name: 'Moderate',
                        type: 'histogram',
                        baseSeries: 'avgSkippedModerate'
                      },
                      'Moderate': {
                        id: 'avgSkippedModerate',
                        visible: false,
                        data: skippedPatientsListM
                      },
                      'Histogram: Hard': {
                        name: 'Hard',
                        type: 'histogram',
                        baseSeries: 'avgSkippedHard'
                      },
                      'Hard': {
                        id: 'avgSkippedHard',
                        visible: false,
                        data: skippedPatientsListH
                      }
                  },
                  series = [drilldowns['Histogram: ' + e.point.name], drilldowns[e.point.name]];

                chart.addSingleSeriesAsDrilldown(e.point, series[0]);
                chart.addSingleSeriesAsDrilldown(e.point, series[1]);
                chart.applyDrilldown();
              }

            },
            drillup: function(e) {
                this.update({
                    title: {
                        text: "Average skipped patients"
                      },
                      xAxis: {
                        title: "off",
                        tickmarkPlacement: 'off',
                        type: 'category'
                      },
                      yAxis: {
                        title: 'off'
                      },
                      plotOptions:{
                          series:{
                              pointPlacement: undefined
                          }
                      }
                });
            },

          },
        },
        title: {
          text: 'Average skipped patients'
        },
        xAxis: {
          type: 'category',
        },

        legend: {
          enabled: false
        },

        plotOptions: {
          series: {
            borderWidth: 0,
            dataLabels: {
              enabled: true
            },
          },
          histogram: {
            binWidth: 1,
          }
        },

        series: [{
          name: 'Averages per difficulty',
          //colorByPoint: true,
          type: 'column',
          data: [{
            name: 'Easy',
            y: avgSkippedEasy,
            color: '#003f7a',
            drilldown: true
          }, {
            name: 'Moderate',
            y: avgSkippedModerate,
            color: '#1fabe7',
            drilldown: true
          }, {
            name: 'Hard',
            y: avgSkippedHard,
            color: '#c0e9fa',
            drilldown: true
          }]
        }],

        drilldown: {
          series: []
        }
      }

      Highcharts.chart('skippedPatients', {
        ...initialOptionsSkipped
      });


    var variance2DE = [];
    var variance2DM = [];
    var variance2DH = [];
    
    for(let i = 0; i<varianceListE.length; i++){
        variance2DE[i] = [varianceListE[i], avgDifferenceListE[i]];
        variance2DM[i] = [varianceListM[i], avgDifferenceListM[i]];
        variance2DH[i] = [varianceListH[i], avgDifferenceListH[i]];
    }

    Highcharts.chart('variance', {
        title: {
            text: 'Variance'
        },
    
        xAxis: [{
            visible: false,
        }, {
            title: { text: 'variance (Nr of half hour blocks)' },
            showLastLabel: true,
        }],
    
        yAxis: [{
            visible: false
        }, {
            title: { text: 'average difference (Nr of half hour blocks)' },
        }],
    
        plotOptions: {
            histogram: {
                binWidth: 1
            }
            
        },
    
        series: [{
            name: "Easy",
            type: "scatter",
            data: variance2DE,
            xAxis: 1,
            yAxis: 1
        },{
          name: "Moderate",
          type: "scatter",
          data: variance2DM,
          xAxis: 1,
          yAxis: 1
        },{
          name: "Hard",
          type: "scatter",
          data: variance2DH,
          xAxis: 1,
          yAxis: 1
        }]
        });

    let avgAppSpeedEasy = Math.round(100*appointementSpeedListE.reduce((a, b) => a + b, 0)/skippedPatientsListE.length)/100;
    let avgAppSpeedModerate = Math.round(100*appointementSpeedListM.reduce((a, b) => a + b, 0)/skippedPatientsListM.length)/100;
    let avgAppSpeedHard = Math.round(100*appointementSpeedListH.reduce((a, b) => a + b, 0)/skippedPatientsListH.length)/100;
    
    var initialOptionsAppSpeed = {

        chart: {
          events: {
            drilldown: function(e) {
              this.update({
                title: {
                  text: "Appointment speed patients: " + e.point.name
                },
                xAxis: {
                  title: {
                    text: "Players average appointment speed patients (half our blocks)"
                  },
                  tickmarkPlacement: 'on',
                },
                yAxis: {
                  title: {
                    text: "Nr of players"
                  }
                },
				plotOptions:{
                    series:{
                        pointPlacement: 'between'
                    }
                }

              });

              if (!e.seriesOptions) {
                var chart = this,
                  drilldowns = {
                    'Histogram: Easy': {
                      name: 'Easy',
                      type: 'histogram',
                      baseSeries: 'avgAppSpeedEasy'
                    },
                    'Easy': {
                      id: 'avgAppSpeedEasy',
                      visible: false,
                      type: 'column',
                      data: appointementSpeedListE
                    },
                    'Histogram: Moderate': {
                        name: 'Moderate',
                        type: 'histogram',
                        baseSeries: 'avgAppSpeedModerate'
                      },
                      'Moderate': {
                        id: 'avgAppSpeedModerate',
                        visible: false,
                        type: 'column',
                        data: appointementSpeedListM
                      },
                      'Histogram: Hard': {
                        name: 'Hard',
                        type: 'histogram',
                        baseSeries: 'avgAppSpeedHard'
                      },
                      'Hard': {
                        id: 'avgAppSpeedHard',
                        visible: false,
                        type: 'column',
                        data: appointementSpeedListH
                      }
                  },
                  series = [drilldowns['Histogram: ' + e.point.name], drilldowns[e.point.name]];

                chart.addSingleSeriesAsDrilldown(e.point, series[0]);
                chart.addSingleSeriesAsDrilldown(e.point, series[1]);
                chart.applyDrilldown();
              }

            },
            drillup: function(e) {
                this.update({
                    title: {
                        text: "Average appointment speed patients"
                      },
                      xAxis: {
                        title: "off",
                        tickmarkPlacement: 'off',
                        type: 'category'
                      },
                      yAxis: {
                        title: 'off'
                      },
                      plotOptions:{
                          series:{
                              pointPlacement: undefined
                          }
                      }
                });
            },

          },
        },
        title: {
          text: 'Average appointment speed patients'
        },
        xAxis: {
          type: 'category',
        },

        legend: {
          enabled: false
        },

        plotOptions: {
          series: {
            borderWidth: 0,
            dataLabels: {
              enabled: true
            },
          },
          histogram: {
            binWidth: 1
          }
        },

        series: [{
          name: 'Averages per difficulty',
          colorByPoint: true,
          type: 'column',
          data: [{
            name: 'Easy',
            y: avgAppSpeedEasy,
            color: '#003f7a',
            drilldown: true
          }, {
            name: 'Moderate',
            y: avgAppSpeedModerate,
            color: '#1fabe7',
            drilldown: true
          }, {
            name: 'Hard',
            y: avgAppSpeedHard,
            color: '#c0e9fa',
            drilldown: true
          }]
        }],

        drilldown: {
          series: []
        }
      }

      Highcharts.chart('appSpeed', {
        ...initialOptionsAppSpeed
      });

      let avgTimeEasy = Math.round(100*timeListE.reduce((a, b) => a + b, 0)/skippedPatientsListE.length)/100;
      let avgTimeModerate = Math.round(100*timeListM.reduce((a, b) => a + b, 0)/skippedPatientsListM.length)/100;
      let avgTimeHard = Math.round(100*timeListH.reduce((a, b) => a + b, 0)/skippedPatientsListH.length)/100;

      var initialOptionsTime = {

        chart: {
          events: {
            drilldown: function(e) {
              this.update({
                title: {
                  text: "Completion time: " + e.point.name
                },
                xAxis: {
                  title: {
                    text: "Completion time (minutes)"
                  },
                  tickmarkPlacement: 'on',
                },
                yAxis: {
                  title: {
                    text: "Nr of players"
                  }
                },
				plotOptions:{
                    series:{
                        pointPlacement: 'between'
                    }
                }

              });

              if (!e.seriesOptions) {
                var chart = this,
                  drilldowns = {
                    'Histogram: Easy': {
                      name: 'Easy',
                      type: 'histogram',
                      baseSeries: 'completionTimeEasy'
                    },
                    'Easy': {
                      id: 'completionTimeEasy',
                      visible: false,
                      type: 'column',
                      data: timeListE
                    },
                    'Histogram: Moderate': {
                        name: 'Moderate',
                        type: 'histogram',
                        baseSeries: 'completionTimeModerate'
                      },
                      'Moderate': {
                        id: 'completionTimeModerate',
                        visible: false,
                        type: 'column',
                        data: timeListM
                      },
                      'Histogram: Hard': {
                        name: 'Hard',
                        type: 'histogram',
                        baseSeries: 'completionTimeHard'
                      },
                      'Hard': {
                        id: 'completionTimeHard',
                        visible: false,
                        type: 'column',
                        data: timeListH
                      }
                  },
                  series = [drilldowns['Histogram: ' + e.point.name], drilldowns[e.point.name]];

                chart.addSingleSeriesAsDrilldown(e.point, series[0]);
                chart.addSingleSeriesAsDrilldown(e.point, series[1]);
                chart.applyDrilldown();
              }

            },
            drillup: function(e) {
                this.update({
                    title: {
                        text: "Average completion time"
                      },
                      xAxis: {
                        title: "off",
                        tickmarkPlacement: 'off',
                        type: 'category'
                      },
                      yAxis: {
                        title: 'off'
                      },
                      plotOptions:{
                          series:{
                              pointPlacement: undefined
                          }
                      }
                });
            },

          },
        },
        title: {
          text: 'Average completion time'
        },
        xAxis: {
          type: 'category',
        },

        legend: {
          enabled: false
        },

        plotOptions: {
          series: {
            borderWidth: 0,
            dataLabels: {
              enabled: true
            },
          },
          histogram: {
            binWidth: 1
          }
        },

        series: [{
          name: 'Averages per difficulty',
          colorByPoint: true,
          type: 'column',
          data: [{
            name: 'Easy',
            y: avgTimeEasy,
            color: '#003f7a',
            drilldown: true
          }, {
            name: 'Moderate',
            y: avgTimeModerate,
            color: '#1fabe7',
            drilldown: true
          }, {
            name: 'Hard',
            y: avgTimeHard,
            color: '#c0e9fa',
            drilldown: true
          }]
        }],

        drilldown: {
          series: []
        }
      }

      Highcharts.chart('time', {
        ...initialOptionsTime
      });
}

