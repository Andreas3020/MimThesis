var chart; 

function getStat(){
    database.once('value', function(snapshot) {
        let roomList = Object.keys(snapshot.val());
        let nrOfRooms = roomList.length;

        if(nrOfRooms>0){
            roomName = roomList[1];
            database.child(roomName).child("Statistics").on('value', function(snapshot){
                var randArr = Object.values(snapshot.val());
                createChart(randArr);
            });
        }
    });
}

// Create the chart
function createChart(randArr){
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
    
    chart = Highcharts.chart('skippedPatients', {
        title: {
            text: 'Skipped patients'
        },
    
        xAxis: [{
            visible: false,
        }, {
            title: { text: 'Nr of skipped patients' },
            showLastLabel: true,
        }],
    
        yAxis: [{
            visible: false
        }, {
            title: { text: 'Nr of players' },
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
            type: 'histogram',
            xAxis: 1,
            yAxis: 1,
            baseSeries: 1
        }, 
        {
            visible: false,
            data: randArr
        }]
    });

    chart = Highcharts.chart('variance', {
        title: {
            text: 'Skipped patients'
        },
    
        xAxis: [{
            visible: false,
        }, {
            title: { text: 'Nr of skipped patients' },
            showLastLabel: true,
        }],
    
        yAxis: [{
            visible: false
        }, {
            title: { text: 'Nr of players' },
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
            type: 'histogram',
            xAxis: 1,
            yAxis: 1,
            baseSeries: 1
        }, 
        {
            visible: false,
            data: randArr
        }]
    });
}

function addData(){
    database.once('value', function(snapshot) {
        let roomList = Object.keys(snapshot.val());
        let roomName = roomList[1];
        database.child(roomName).child("Statistics").once('value', function(snapshotChild){
            let i = snapshotChild.numChildren();
            let nr = Math.round(Math.random()*10);
            console.log(nr);
            database.child(roomName).child("Statistics").child(i).set(nr);
        });
    });
}
