function popUpPass(){
  const popUp = document.getElementById("roomPopUp");
  popUp.style.display = "block";

  const popUpPass= document.getElementById("popUpPass");
  popUpPass.style.display = "block";
  popUpPass.style.display = "flexbox";
}

function confirmPassword(){
  const password = document.getElementById("pass").value;
  if(password == "123"){
    clearPassPop()

    const addButton = document.getElementById("addRoomButton");
    addButton.style.display = "block";

    const delStatList = document.getElementsByClassName("delStatButton");
    for (let item of delStatList) {
      item.style.display = "block";
    }
  }
  else{
    const passErr = document.getElementById("passErr");
    passErr.innerHTML = "The password was incorrect!";
  }  
}

function clearPassPop(){
  const popUpPass = document.getElementById("popUpPass");
  popUpPass.style.display = "none";

  const popUp = document.getElementById("roomPopUp");
  popUp.style.display = "none";

}

function nameRoom(){
  const popUp = document.getElementById("roomPopUp");
  popUp.style.display = "block";
  
  const popUpText = document.getElementById("popUpText");
  popUpText.style.display = "block";
  popUpText.style.display = "flexbox";
}

function addRoom(){
  //hide the pop-up again
  clearNamePop();

  //Make the room button 
  const htmlRooms = document.getElementById("rooms");
  let roomName = "Room: ";
  roomName += document.getElementById("rname").value;
  console.log(roomName);
  htmlRooms.innerHTML +=`<div class ="roomButtonDiv" id="${roomName}"><button class="roomButton" onClick="enterRoom(\'${roomName}\')">${roomName}</button></div>`;

  const rButton = document.getElementById(roomName);
  rButton.innerHTML += `<div><button type="button" onClick="confirmDel(\'${roomName}\')">Delete</button><button type="button" onClick="roomStats(\'${roomName}\')">Statistics</button>`;

 
  //Generate patient list and send them to the database
  Patient.generate();
  database.child(roomName).child("Patient lists").set(Patient.genList);
}

function clearNamePop(){
  const popUp = document.getElementById("roomPopUp");
  popUp.style.display = "none";
  
  const popUpText = document.getElementById("popUpText");
  popUpText.style.display = "none";
}

function loadRooms(){
  //retrieve the patient lists from the database
  database.once('value', function(snapshot) {
    let roomList = Object.keys(snapshot.val());
    let nrOfRooms = roomList.length;
    
    //Load the already existing rooms into the app
    for(let i =0; i<nrOfRooms; i++){
      const htmlRooms = document.getElementById("rooms");
      let roomName = roomList[i];
    
      htmlRooms.innerHTML +=`<div class ="roomButtonDiv"  id="${roomName}"><button class="roomButton" onClick="enterRoom(\'${roomName}\')">${roomName}</button></div>`;

      const rButton = document.getElementById(roomName);
      rButton.innerHTML += `<div class="delStatButton"><button type="button" onClick="confirmDel(\'${roomName}\')">Delete</button><button type="button" onClick="roomStats(\'${roomName}\')">Statistics</button>`;
    }
  });  
}

function enterRoom(roomName){
  //get the data of the specific room and load them into the local storage
  database.child(roomName).child("Patient lists").once('value', function(snapshot) {
    let patients = Object.values(snapshot.val());
    let keys = Object.keys(snapshot.val()); 

    patientTableString = JSON.stringify(patients);
    localStorage["patientTable"] = patientTableString;

    //go the the game
    window.location.href = "agenda2.html";
  })
}

function confirmDel(roomName){
  let roomPopUp = document.getElementById("roomPopUp");
  roomPopUp.style.display ="block";
  let confirmDel = document.getElementById("confirmDel");
  confirmDel.style.display ="block";

  document.getElementById("confirmDelButton").onclick = function() {deleteRoom(roomName)};
  document.getElementById("cancelDelButton").onclick = function() {
    roomPopUp.style.display = "none";
    confirmDel.style.display = "none";
  };
}

function deleteRoom(roomName){
  database.child(roomName).remove();
  const delRoom = document.getElementById(roomName);
  delRoom.style.display = "none";

  let roomPopUp = document.getElementById("roomPopUp");
  roomPopUp.style.display ="none";
  let confirmDel = document.getElementById("confirmDel");
  confirmDel.style.display ="none";
}

function roomStats(roomName){
  let randomList = [];
  for(let i =0; i<120; i++){
    let a = Math.round(Math.random()*10);
    randomList[i]= a;
  }
  database.child(roomName).child("Statistics").set(randomList);

  randListString = JSON.stringify(randomList);
  localStorage["statistics"] = randListString;
  window.location.href = "statistics.html";
}

