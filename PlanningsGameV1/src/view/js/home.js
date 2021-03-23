var setting = document.getElementsByName("difficulty") //Radio button (input)

let roomName;
let roomNameString;
let difficulty; 

try {
  if (localStorage["roomName"]) {
    roomNameString = localStorage["roomName"];
  }
} catch (e) {
  alert("Error when reading from Local Storage\n" + e);
}

if(roomNameString){
  roomName = JSON.parse( roomNameString);
}

// function changeDifficulty() {

//   level = document.getElementById("diff").value;
  
//   console.log("test");
//   //Update settings to difficulty level
//   if(level == "Easy") {
//     setting[0].checked = true;
//   } else if(level == "Moderate") {
//     setting[1].checked = true;
//   } else if(level == "Difficult") {
//     setting[2].checked = true;
//   }
// }

function startGame(){
  let level; 

  // get the difficulty level
  for(let i = 0; i < 3; i++){
    if(setting[i].checked){
      level = setting[i].value;
    }
   }

  //get the data of the specific room and load them into the local storage
  database.child(roomName).child("Patient lists").child(level).once('value', function(snapshot) {
    let patients = Object.values(snapshot.val());
    let keys = Object.keys(snapshot.val()); 

    patientTableString = JSON.stringify(patients);
    localStorage["patientTable"] = patientTableString;

    //go the the game
    window.location.href = "agendaAndreas.html";
  });
}