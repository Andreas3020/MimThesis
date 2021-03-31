var setting = document.getElementsByName("difficulty") //Radio button (input)

let roomName;
let roomNameJString;
let difficulty; 
let rnumber;
let rnumberJString

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

database.child(roomName).child("users").child(rnumber).once('value', function(snapshot) {
  let scores = Object.values(snapshot.val());

  for(let i = 0; i< scores.length; i++){
    tableBody = document.getElementById('resultTable');
    row = tableBody.insertRow();
    row.insertCell(0).textContent = scores[i]["difficulty"];
    row.insertCell(1).textContent = scores[i]["skippedPatients"];
    row.insertCell(2).textContent = scores[i]["avgAppDev"];
    row.insertCell(3).textContent = scores[i]["avgAppDiff"];
    row.insertCell(4).textContent = scores[i]["avgAppSpeed"];
    row.insertCell(5).textContent = scores[i]["time"]+"min";
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