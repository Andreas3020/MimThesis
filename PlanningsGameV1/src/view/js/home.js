var setting = document.getElementsByName("difficulty") //Radio button (input)

let roomName;
let roomNameJString;
let difficulty; 
let rnumber;
let rnumberJString
var skippedPatientsListE = [], skippedPatientsListM = [], skippedPatientsListH = [];
var varianceListE = [], varianceListM = [], varianceListH = [];
var avgDifferenceListE = [], avgDifferenceListM = [], avgDifferenceListH = [];
var appointementSpeedListE = [], appointementSpeedListM = [], appointementSpeedListH = [];
var timeListE = [], timeListM = [], timeListH = [];

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
    row.insertCell(1).textContent = Math.round(100*scores[i]["skippedPatients"])/100;
    row.insertCell(2).textContent = Math.round(100*scores[i]["avgAppDev"])/100;
    row.insertCell(3).textContent = Math.round(100*scores[i]["avgAppDiff"])/100;
    row.insertCell(4).textContent = Math.round(100*scores[i]["avgAppSpeed"])/100;
    row.insertCell(5).textContent = Math.round(100*scores[i]["time"])/100 + " min";
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
    createAvg();
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

  let avgTimeEasy = Math.round(timeListE.reduce((a, b) => a + b, 0)/skippedPatientsListE.length);
  let avgTimeModerate = Math.round(timeListM.reduce((a, b) => a + b, 0)/skippedPatientsListM.length);
  let avgTimeHard = Math.round(timeListH.reduce((a, b) => a + b, 0)/skippedPatientsListH.length);

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
  const video = document.getElementById("video");
  video.pause();
}

function showPicture(source){
  const popUp = document.getElementById("instructionPopUp");
  popUp.style.display = "flex";
  const img = document.getElementById("img");
  console.log(source);
  img.src = source;
  
}

function playVideo(source){
  const popUp = document.getElementById("instructionPopUp");
  popUp.style.display = "flex";
  const video = document.getElementById("video");
  video.src = source;
}