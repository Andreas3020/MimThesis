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
    const popUpPass = document.getElementById("popUpPass");
    popUpPass.style.display = "none";

    const popUp = document.getElementById("roomPopUp");
    popUp.style.display = "none";

    const addRoomButton = document.getElementById("addRoomButton");
    addRoomButton.style.display = "block";
  }
  else{
    const passErr = document.getElementById("passErr");
    passErr.innerHTML = "The password was incorrect!";
  }  
}

function nameRoom(){
  const popUp = document.getElementById("roomPopUp");
  popUp.style.display = "block";
  
  const popUpText = document.getElementById("popUpText");
  popUpText.style.display = "block";
  popUpText.style.display = "flexbox";

  const popUpButton = document.getElementById("popUpButton");
  popUpButton.style.display = "block";
  popUpButton.style.display = "flex";
}

function addRoom(){
  //hide the pop-up again
  const popUpText = document.getElementById("popUpText");
  popUpText.style.display = "none";

  const popUpButton = document.getElementById("popUpButton");
  popUpButton.style.display = "none";

  const popUp = document.getElementById("roomPopUp");
  popUp.style.display = "none";

  //Make the room button 
  const htmlRooms = document.getElementById("rooms");
  let roomName = document.getElementById("rname").value;
  htmlRooms.insertAdjacentHTML('afterbegin',`<div class ="roomButtonDiv"><button class="roomButton" id=${roomName}>Room: ${roomName}</button> </div>`);

  //Generate patient list and send them to the database
  Patient.generate();
  database.child("Patient lists").child("Room: " + roomName).set(Patient.genList);
}

function loadRooms(){
  //retrieve the patient lists from the database
  database.child("Patient lists").once('value', function(snapshot) {
    let roomList = Object.keys(snapshot.val());
    let nrOfRooms = roomList.length;
    
    //Load the already existing rooms into the app
    for(let i =0; i<nrOfRooms; i++){
      const htmlRooms = document.getElementById("rooms");
      let roomName = roomList[i];
    
      htmlRooms.insertAdjacentHTML('afterbegin',`<div class ="roomButtonDiv"><button class="roomButton" id=${roomName} onClick="enterRoom(\'${roomName}\')">${roomName}</button></div>`);

      // htmlRooms.insertAdjacentHTML('afterbegin',`<div class ="roomButtonDiv"><button class="roomButton" id=${roomName} onClick="enterRoom(\'${roomName}\')">${roomName}</button><div><button>Delete</button><button>Statistics</button></div></div>`);
    }
  });  
}

function enterRoom(roomName){
  //get the data of the specific room and load them into the local storage
  database.child("Patient lists").child(roomName).once('value', function(snapshot) {
    let patients = Object.values(snapshot.val());
    let keys = Object.keys(snapshot.val()); 

    patientTableString = JSON.stringify(patients);
    localStorage["patientTable"] = patientTableString;

    //go the the game
    window.location.href = "agenda2.html";
  })
}