var chart; 
var skippedPatientsList;
var varianceList;
var avgDifferenceList;
var appointementSpeedList;
var timeList;


function getStat(){
    database.once('value', function(snapshot) {
        let roomList = Object.keys(snapshot.val());
        let nrOfRooms = roomList.length;

        if(nrOfRooms>0){
            roomName = roomList[0];
            database.child(roomName).child("statistics").child("skippedPatients").on('value', function(snapshot){
                skippedPatientsList = Object.values(snapshot.val());
            });
            database.child(roomName).child("statistics").child("variance").child("variance").on('value', function(snapshot){
                varianceList = Object.values(snapshot.val());
            });
            database.child(roomName).child("statistics").child("variance").child("avgDifference").on('value', function(snapshot){
                avgDifferenceList = Object.values(snapshot.val());
            });
            database.child(roomName).child("statistics").child("appointmentSpeed").on('value', function(snapshot){
                appointementSpeedList = Object.values(snapshot.val());
            });
            database.child(roomName).child("statistics").child("time").on('value', function(snapshot){
                timeList = Object.values(snapshot.val());
                createChart();
            });

        }
    });
}

// Create the chart
function createChart(){
    // var randArrString, randArr;
    // try {
    //     if (localStorage["statistics"]) {
    //         randArrString = localStorage["statistics"];
    //     }
    //   } catch (e) {
    //     alert("Error when reading from Local Storage\n" + e);
    //   }
    // if(randArrString){
    //     randArr = JSON.parse(randArrString);
    // }
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
                      type: 'column',
                      data: skippedPatientsList
                    },
                    'Histogram: Moderate': {
                        name: 'Moderate',
                        type: 'histogram',
                        baseSeries: 'avgSkippedModerate'
                      },
                      'Moderate': {
                        id: 'avgSkippedModerate',
                        visible: false,
                        type: 'column',
                        data: skippedPatientsList
                      },
                      'Histogram: Hard': {
                        name: 'Hard',
                        type: 'histogram',
                        baseSeries: 'avgSkippedHard'
                      },
                      'Hard': {
                        id: 'avgSkippedHard',
                        visible: false,
                        type: 'column',
                        data: skippedPatientsList
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
            binWidth: 1
          }
        },

        series: [{
          name: 'Averages per difficulty',
          colorByPoint: true,
          type: 'column',
          data: [{
            name: 'Easy',
            y: 5,
            drilldown: true
          }, {
            name: 'Moderate',
            y: 2,
            drilldown: true
          }, {
            name: 'Hard',
            y: 4,
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


    var variance2D = [];
    for(let i = 0; i<varianceList.length; i++){
        variance2D[i] = [varianceList[i], avgDifferenceList[i]];
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

        legend:{
            enabled: false
        },
    
        series: [{
            name: "Easy",
            type: "scatter",
            data: variance2D,
            xAxis: 1,
            yAxis: 1
        }]
    });

    var initialOptionsAppSpeed = {

        chart: {
          events: {
            drilldown: function(e) {
              this.update({
                title: {
                  text: "Appointment speed patient: " + e.point.name
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
                      data: appointementSpeedList
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
                        data: appointementSpeedList
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
                        data: appointementSpeedList
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
          text: 'Average appointment patients'
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
            y: 6,
            drilldown: true
          }, {
            name: 'Moderate',
            y: 1,
            drilldown: true
          }, {
            name: 'Hard',
            y: 5,
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
                      data: timeList
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
                        data: timeList
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
                        data: timeList
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
            y: 3,
            drilldown: true
          }, {
            name: 'Moderate',
            y: 7,
            drilldown: true
          }, {
            name: 'Hard',
            y: 4,
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

