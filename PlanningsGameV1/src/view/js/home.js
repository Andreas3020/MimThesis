var setting = document.getElementsByName("difficulty") //Radio button (input)

let roomName;
let roomNameJString;
let difficulty; 
let rnumber;
let rnumberJString
var skippedPatientsListE, skippedPatientsListLM, skippedPatientsListH;
var varianceListE, varianceListM, varianceListH;
var avgDifferenceListE, avgDifferenceListM, avgDifferenceListH;
var appointementSpeedListE, appointementSpeedListM, appointementSpeedListH;
var timeListE, timeListM, timeListH;

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

try {
  if (localStorage["rnumber"]) {
    rnumberJString = localStorage["rnumber"];
  }
} catch (e) {
  alert("Error when reading from Local Storage\n" + e);
}

if(rnumberJString){
  rnumber = JSON.parse( rnumberJString);
}

getStat();

database.child(roomName).child("users").child(rnumber).once('value', function(snapshot) {
  if(snapshot.val()){
    let scores = Object.values(snapshot.val());

  for(let i = 0; i< scores.length; i++){
    tableBody = document.getElementById('resultTable');
    row = tableBody.insertRow();
    row.insertCell(0).textContent = scores[i]["difficulty"];
    row.insertCell(1).textContent = scores[i]["skippedPatients"];
    row.insertCell(2).textContent = scores[i]["avgAppDev"];
    row.insertCell(3).textContent = scores[i]["avgAppDiff"];
    row.insertCell(4).textContent = scores[i]["avgAppSpeed"];
    row.insertCell(5).textContent = scores[i]["time"]+" min";
  } 
  } 
});



function startGame(){
  let level; 

  // get the difficulty level
  for(let i = 0; i < 3; i++){
    if(setting[i].checked){
      level = setting[i].value;
    }
   }

  //get the data of the specific room and load them into the local storage
  database.child(roomName).child("patients").child(level).once('value', function(snapshot) {
    let patients = Object.values(snapshot.val());
    let keys = Object.keys(snapshot.val()); 

    let patientTableString = JSON.stringify(patients);
    localStorage["patientTable"] = patientTableString;

    let difficultyJString = JSON.stringify(level);
    localStorage["difficulty"] = difficultyJString;

    //go the the game
    window.location.href = "agendaNew.html";
  });
}

function getStat(){
  database.once('value', function(snapshot) {
    let roomList = Object.keys(snapshot.val());
    let nrOfRooms = roomList.length;

    if(nrOfRooms>0){
        //skipped patients lists
        database.child(roomName).child("statistics").child("skippedPatients").child("easy").once('value', function(snapshot){
          skippedPatientsListE = Object.values(snapshot.val());
        });

        database.child(roomName).child("statistics").child("skippedPatients").child("moderate").once('value', function(snapshot){
          skippedPatientsListM = Object.values(snapshot.val());
        });

        database.child(roomName).child("statistics").child("skippedPatients").child("hard").once('value', function(snapshot){
          skippedPatientsListH = Object.values(snapshot.val());
        });

        //variance lists
        database.child(roomName).child("statistics").child("variance").child("easy").child("variance").once('value', function(snapshot){
            varianceListE = Object.values(snapshot.val());
        });
        database.child(roomName).child("statistics").child("variance").child("easy").child("avgDifference").once('value', function(snapshot){
            avgDifferenceListE = Object.values(snapshot.val());
        });

        database.child(roomName).child("statistics").child("variance").child("moderate").child("variance").once('value', function(snapshot){
          varianceListM = Object.values(snapshot.val());
        });
        database.child(roomName).child("statistics").child("variance").child("moderate").child("avgDifference").once('value', function(snapshot){
          avgDifferenceListM = Object.values(snapshot.val());
        });

        database.child(roomName).child("statistics").child("variance").child("hard").child("variance").once('value', function(snapshot){
          varianceListH = Object.values(snapshot.val());
        });
        database.child(roomName).child("statistics").child("variance").child("hard").child("avgDifference").once('value', function(snapshot){
          avgDifferenceListH = Object.values(snapshot.val());
        });

        //appointment speed lists
        database.child(roomName).child("statistics").child("appointmentSpeed").child("easy").once('value', function(snapshot){
            appointementSpeedListE = Object.values(snapshot.val());
        });
        database.child(roomName).child("statistics").child("appointmentSpeed").child("moderate").once('value', function(snapshot){
          appointementSpeedListM = Object.values(snapshot.val());
        });
        database.child(roomName).child("statistics").child("appointmentSpeed").child("hard").once('value', function(snapshot){
          appointementSpeedListH = Object.values(snapshot.val());
        });

        //completion time lists
        database.child(roomName).child("statistics").child("time").child("easy").once('value', function(snapshot){
          timeListE = Object.values(snapshot.val());
        });
        database.child(roomName).child("statistics").child("time").child("moderate").once('value', function(snapshot){
          timeListM = Object.values(snapshot.val());
        });
        database.child(roomName).child("statistics").child("time").child("hard").once('value', function(snapshot){
          timeListH = Object.values(snapshot.val());
          createAvg();
        });

        }
    });
}

function createAvg(){
  let avgSkippedEasy = Math.round(100*skippedPatientsListE.reduce((a, b) => a + b, 0)/skippedPatientsListE.length)/100;
  let avgSkippedModerate = Math.round(100*skippedPatientsListM.reduce((a, b) => a + b, 0)/skippedPatientsListM.length)/100;
  let avgSkippedHard = Math.round(100*skippedPatientsListH.reduce((a, b) => a + b, 0)/skippedPatientsListH.length)/100;

  let avgStDevEasy = Math.round(100*varianceListE.reduce((a, b) => a + b, 0)/varianceListE.length)/100;
  let avgStDevModerate = Math.round(100*varianceListM.reduce((a, b) => a + b, 0)/varianceListM.length)/100;
  let avgStDevHard = Math.round(100*varianceListH.reduce((a, b) => a + b, 0)/varianceListH.length)/100;

  let avgDiffEasy = Math.round(100*avgDifferenceListE.reduce((a, b) => a + b, 0)/avgDifferenceListE.length)/100;
  let avgDiffModerate = Math.round(100*avgDifferenceListM.reduce((a, b) => a + b, 0)/avgDifferenceListM.length)/100;
  let avgDiffHard = Math.round(100*avgDifferenceListH.reduce((a, b) => a + b, 0)/avgDifferenceListH.length)/100;

  let avgAppSpeedEasy = Math.round(100*appointementSpeedListE.reduce((a, b) => a + b, 0)/skippedPatientsListE.length)/100;
  let avgAppSpeedModerate = Math.round(100*appointementSpeedListM.reduce((a, b) => a + b, 0)/skippedPatientsListM.length)/100;
  let avgAppSpeedHard = Math.round(100*appointementSpeedListH.reduce((a, b) => a + b, 0)/skippedPatientsListH.length)/100;

  let avgTimeEasy = Math.round(100*timeListE.reduce((a, b) => a + b, 0)/skippedPatientsListE.length)/100;
  let avgTimeModerate = Math.round(100*timeListM.reduce((a, b) => a + b, 0)/skippedPatientsListM.length)/100;
  let avgTimeHard = Math.round(100*timeListH.reduce((a, b) => a + b, 0)/skippedPatientsListH.length)/100;

  tableBody = document.getElementById('avgTable');
  
  row = tableBody.insertRow();
  row.insertCell(0).textContent = "Easy";
  row.insertCell(1).textContent = avgSkippedEasy;
  row.insertCell(2).textContent = avgStDevEasy;
  row.insertCell(3).textContent = avgDiffEasy;
  row.insertCell(4).textContent = avgAppSpeedEasy;
  row.insertCell(5).textContent = avgTimeEasy + " min";

  row = tableBody.insertRow();
  row.insertCell(0).textContent = "Moderate";
  row.insertCell(1).textContent = avgSkippedModerate;
  row.insertCell(2).textContent = avgStDevModerate;
  row.insertCell(3).textContent = avgDiffModerate;
  row.insertCell(4).textContent = avgAppSpeedModerate;
  row.insertCell(5).textContent = avgTimeModerate + " min";

  row = tableBody.insertRow();
  row.insertCell(0).textContent = "Hard";
  row.insertCell(1).textContent = avgSkippedHard;
  row.insertCell(2).textContent = avgStDevHard;
  row.insertCell(3).textContent = avgDiffHard;
  row.insertCell(4).textContent = avgAppSpeedHard;
  row.insertCell(5).textContent = avgTimeHard + " min";
  
}

function clearPopup(){
  const popUpPass = document.getElementById("instructionPopUp");
  popUpPass.style.display = "none";

 
}

function showPicture(source){
  const popUp = document.getElementById("instructionPopUp");
  popUp.style.display = "flex";
  const img = document.getElementById("img");
  console.log(source);
  img.src = source;
  
}