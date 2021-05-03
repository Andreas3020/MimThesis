var chart;
var chartSkipped; 
var skippedPatientsListE = [], skippedPatientsListM = [], skippedPatientsListH = [];
var varianceListE = [], varianceListM = [], varianceListH = [];
var avgDifferenceListE = [], avgDifferenceListM = [], avgDifferenceListH = [];
var appointementSpeedListE = [], appointementSpeedListM = [], appointementSpeedListH = [];
var timeListE = [], timeListM = [], timeListH = [];
let roomNameJString;
var roomName;
var userList;

try {
  if (localStorage["roomName"]) {
    roomNameJString = localStorage["roomName"];
  }
} catch (e) {
  alert("Error when reading from Local Storage\n" + e);
}

if(roomNameJString){
  roomName = JSON.parse( roomNameJString);
}

function getStat(){

  database.child(roomName).child("users").once('value', function(snapshot){
    if(snapshot.exists()){
      let tempValList = Object.values(snapshot.val());

      for(let x = 0; x < tempValList.length; x++){
        for(let y = 0; y < tempValList[x].length; y++){
          if(tempValList[x][y].difficulty == 'Easy'){
            skippedPatientsListE[skippedPatientsListE.length] = tempValList[x][y].skippedPatients;
            varianceListE[varianceListE.length] = tempValList[x][y].avgAppDev;
            avgDifferenceListE[avgDifferenceListE.length] = tempValList[x][y].avgAppDiff;
            appointementSpeedListE[appointementSpeedListE.length] = tempValList[x][y].avgAppSpeed;
            timeListE[timeListE.length] = tempValList[x][y].time;
          }
          else if(tempValList[x][y].difficulty == 'Moderate'){
            skippedPatientsListM[skippedPatientsListM.length] = tempValList[x][y].skippedPatients;
            varianceListM[varianceListM.length] = tempValList[x][y].avgAppDev;
            avgDifferenceListM[avgDifferenceListM.length] = tempValList[x][y].avgAppDiff;
            appointementSpeedListM[appointementSpeedListM.length] = tempValList[x][y].avgAppSpeed;
            timeListM[timeListM.length] = tempValList[x][y].time;
          }
          else if(tempValList[x][y].difficulty == 'Hard'){
            skippedPatientsListH[skippedPatientsListH.length] = tempValList[x][y].skippedPatients;
            varianceListH[varianceListH.length] = tempValList[x][y].avgAppDev;
            avgDifferenceListH[avgDifferenceListH.length] = tempValList[x][y].avgAppDiff;
            appointementSpeedListH[appointementSpeedListH.length] = tempValList[x][y].avgAppSpeed;
            timeListH[timeListH.length] = tempValList[x][y].time;
          }
        }
      }
    }
  }).then(function onSuccess() {
      createChart();
  });
}

// Create the chart
function createChart(){
  //so only 3 times a '9' and 4 times a '10'
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
                  tickInterval: 1,
                },
                yAxis: {
                  title: {
                    text: "Nr of players"
                  }
                },
				        plotOptions:{
                  series:{
                      pointPlacement: 'between',
                      dataLabels: {
                        enabled: true,
                      }
                  },
                  histogram:{
                    binWidth: 0.999
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
                        text: "Average skipped patients",
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
          text: 'Average skipped patients',
          margin: 50,
          style: {
            fontWeight: 'bold',
          },
        },
        xAxis: {
          type: 'category',
          title: {
            style: {
              fontWeight: 'bold',
            },
          },
        },

        yAxis: {
          title: {
            text: undefined,
            style: {
              fontWeight: 'bold',
            },
          },
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

      chartSkipped = Highcharts.chart('skippedPatients', {
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
            text: 'Variance',
            margin: 50,
            style:{
              fontWeight: 'bold',
            },
        },
    
        xAxis: [{
            visible: false,
        }, {
            title: { 
              text: 'Standard deviaton (Nr of half hour blocks)' ,
              style: {
                fontWeight: 'bold',
              },
            },
            showLastLabel: true,
        }],
    
        yAxis: [{
            visible: false
        }, {
            title: { 
              text: 'Average difference (Nr of half hour blocks)', 
              style:{
                fontWeight: 'bold',
              },
            },
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
                  tickInterval: 0.1,
                },
                yAxis: {
                  title: {
                    text: "Nr of players"
                  },
                },
                plotOptions:{
                  series:{
                      pointPlacement: 'on',
                  },
                  histogram:{
                    pointPlacement: 'between',
                    binWidth: 0.2
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
          text: 'Average appointment speed patients',
          margin: 50,
          style: {
            fontWeight: 'bold',
          },
        },
        xAxis: {
          type: 'category',
          title: {
            style: {
              fontWeight: 'bold',
            },
          },
        },

        yAxis: {
          title: {
            text: undefined,
            style: {
              fontWeight: 'bold',
            },
          },
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
            binsNumber: "rice"
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
                  tickInterval: 5,
                },
                yAxis: {
                  title: {
                    text: "Nr of players"
                  }
                },
                plotOptions:{
                  series:{
                      pointPlacement: 'off',
                  },
                  histogram:{
                    binWidth: 10
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
          text: 'Average completion time',
          margin: 50,
          style: {
            fontWeight: 'bold',
          },
        },
        xAxis: {
          type: 'category',
          title: {
            style: {
              fontWeight: 'bold',
            },
          },
        },

        yAxis: {
          title: {
            text: undefined,
            style: {
              fontWeight: 'bold',
            },
          },
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
            //binWidth: 1
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

function update(){
  getStat();
  
  database.child(roomName).child("users").once('value', function(snapshot){
    if(snapshot.val()){
      userList = snapshot.val();
      generateRanking();
    }
  });
}

function generateRanking(){
  if(userList){
    let keys = Object.keys(userList);
    let level = document.getElementById("difficulty").value;
    let evaluationList = document.getElementsByName("evaluation");
    let evaluation;
    for (let i = 0; i < evaluationList.length; i++) {
      if(evaluationList[i].checked){
        evaluation = evaluationList[i]
      }
    }
  
    let rankingList = [];
    
    for(let i = 0; i < keys.length; i++){
      var gameList = userList[keys[i]]; 
      var diffGameList = [];
  
      for(let j = 0; j < gameList.length; j++){
        if(gameList[j].difficulty == level){
          gameList[j].rnumber = keys[i];
          diffGameList[diffGameList.length] = gameList[j];
        }
      }
  
      diffGameList.sort(function(a,b){
        return a[evaluation.value] - b[evaluation.value];
      });
      if(diffGameList.length>0){
        rankingList[rankingList.length] = diffGameList[0];
      }
    }
  
    rankingList.sort(function(a,b){
      return a[evaluation.value] - b[evaluation.value];
    });
  
    const table = document.getElementById("resultTable");
  
    let deleteLength = table.rows.length;
    while(table.rows.length>1){
      table.deleteRow(table.rows.length -1)
    }
  
    if(rankingList[0]){
      for (let i = 0; i < rankingList.length; i++) {
        let row = table.insertRow();
        row.insertCell(0).textContent = i+1;
        row.insertCell(1).textContent = rankingList[i].rnumber;
        row.insertCell(2).textContent = rankingList[i].skippedPatients;
        row.insertCell(3).textContent = rankingList[i].avgAppDev;
        row.insertCell(4).textContent = rankingList[i].avgAppDiff;
        row.insertCell(5).textContent = rankingList[i].avgAppSpeed;
        row.insertCell(6).textContent = rankingList[i].time;
      }
    }
  }
}