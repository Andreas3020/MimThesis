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
    passErr.style.display = "block";
  }  
}

function clearPassPop(){
  const popUpPass = document.getElementById("popUpPass");
  popUpPass.style.display = "none";

  const popUp = document.getElementById("roomPopUp");
  popUp.style.display = "none";

  const passErr = document.getElementById("passErr");
    passErr.style.display = "none";
}

function nameRoom(){
  const popUp = document.getElementById("roomPopUp");
  popUp.style.display = "block";
  
  const popUpText = document.getElementById("popUpText");
  popUpText.style.display = "block";
  popUpText.style.display = "flexbox";
}

function addRoom(){
  const roomErr1 = document.getElementById("roomErr1");
  const roomErr2 = document.getElementById("roomErr2");
  const roomErr3 = document.getElementById("roomErr3");
  let name = document.getElementById("rname").value;
  let roomName = "Room: ";
  roomName += name;

  if(name == ""){
    roomErr2.style.display = "none";
    roomErr3.style.display = "none";
    roomErr1.style.display = "block";
  }
  else{
    if(name.includes("/")==false && name.includes("[")==false && name.includes("]")==false && name.includes(".") == false && name.includes("$")==false && name.includes("#")==false){
      database.once('value', function(snapshot) {
        if(snapshot.hasChild(roomName)){
          //const roomErr1 = document.getElementById("roomErr1");
          roomErr1.style.display = "none";
          roomErr3.style.display = "none";
          roomErr2.style.display = "block";
        }
        else{
            //hide the pop-up again
            clearNamePop();
          
            //Make the room button 
            const htmlRooms = document.getElementById("rooms");
            htmlRooms.innerHTML +=`<div class ="roomButtonDiv" id="${roomName}"><button class="roomButton" onClick="rnumberPop(\'${roomName}\')">${roomName}</button></div>`;
          
            const rButton = document.getElementById(roomName);
            rButton.innerHTML += `<div class="addDelStatButton"><button class="delStat" type="button" onClick="confirmDel(\'${roomName}\')">Delete</button><button class="delStat" type="button" onClick="roomStats(\'${roomName}\')">Statistics</button></div>`;
            
            //Generate patient list and send them to the database
            Patient.Easy();
            Patient.generate();
            Patient.loadAll();
            database.child(roomName).child("patients").child("Easy").set(Patient.list);
            Patient.Moderate();
            Patient.generate();
            Patient.loadAll();
            database.child(roomName).child("patients").child("Moderate").set(Patient.list);
            Patient.Hard();
            Patient.generate();
            Patient.loadAll();
            database.child(roomName).child("patients").child("Hard").set(Patient.list);
        }        
      });
    }
    else{
      roomErr1.style.display = "none";
      roomErr2.style.display = "none";
      roomErr3.style.display = "block";
    }
  }
}

function clearNamePop(){
  const popUp = document.getElementById("roomPopUp");
  popUp.style.display = "none";
  
  const popUpText = document.getElementById("popUpText");
  popUpText.style.display = "none";

  const roomErr1 = document.getElementById("roomErr1");
  roomErr1.style.display = "none";

  const roomErr2 = document.getElementById("roomErr2");
  roomErr2.style.display = "none";

  const roomErr3 = document.getElementById("roomErr3");
  roomErr3.style.display = "none";
}

function loadRooms(){
  //retrieve the patient lists from the database
  database.once('value', function(snapshot) {
    if(snapshot.exists()){
      let roomList = Object.keys(snapshot.val());
      let nrOfRooms = roomList.length;
      
      //Load the already existing rooms into the app
      for(let i =0; i<nrOfRooms; i++){
        const htmlRooms = document.getElementById("rooms");
        let roomName = roomList[i];
      
        htmlRooms.innerHTML +=`<div class ="roomButtonDiv"  id="${roomName}"><button class="roomButton" onClick="rnumberPop(\'${roomName}\')">${roomName}</button></div>`;

        const rButton = document.getElementById(roomName);
        rButton.innerHTML += `<div class="delStatButton"><button class="delStat" type="button" onClick="confirmDel(\'${roomName}\')">Delete</button><button class="delStat" type="button" onClick="roomStats(\'${roomName}\')">Statistics</button>`;
      }
    }
  });  
}

function rnumberPop(roomName){
  const popUp = document.getElementById("roomPopUp");
  popUp.style.display = "block";
  
  let userPop = document.getElementById("popUpUser");
  userPop.style.display = "block";
  userPop.style.display = "flexbox";

  document.getElementById("enterRoomButton").onclick = function() {enterRoom(roomName)};
}

function enterRoom(roomName){
  let rnumber = document.getElementById("rnumber").value;
  let rnumberArr = rnumber.split("");
  let numberString ="";

  //make the numerical value of the rnumber an Int
  for(let i = 1; i < rnumberArr.length; i++){
    numberString += rnumberArr[i];
  }

  //check if the the first value is a correct letter and if the rest is a correct number
  if(rnumberArr.length == 8 && (rnumberArr[0]== "r" || rnumberArr[0]== "u" || rnumberArr[0]== "s" ) && isNaN(numberString) == false){
    clearUserPop()
    
    // save the username in the database
    let roomNameJString = JSON.stringify(roomName);
    localStorage["roomName"] = roomNameJString;

    let rnumberJString = JSON.stringify(rnumber);
    localStorage["rnumber"] = rnumberJString;

    window.location.href = "home.html";    
  }
  else{
    let userErr = document.getElementById("userErr")
    userErr.style.display = "block"; 
  }  
}

function clearUserPop(){
  const popUp = document.getElementById("roomPopUp");
  popUp.style.display = "none";
  
  let userPop = document.getElementById("popUpUser");
  userPop.style.display = "none";

  let userErr = document.getElementById("userErr");
  userErr.style.display = "none";
}

function confirmDel(roomName){
  let roomPopUp = document.getElementById("roomPopUp");
  roomPopUp.style.display ="block";
  let confirmDel = document.getElementById("confirmDel");
  confirmDel.style.display ="block";

  let delText = document.getElementById('delText');
  delText.innerHTML = "Are you sure you want to delete '" + roomName + "'<br> All its user data will be deleted too!";

  document.getElementById("confirmDelButton").onclick = function() {deleteRoom(roomName)};
  document.getElementById("cancelDelButton").onclick = function() {
    roomPopUp.style.display = "none";
    confirmDel.style.display = "none";
  };
}

function deleteRoom(roomName){
  database.child(roomName).remove();
  const delRoom = document.getElementById(roomName);
  delRoom.remove();

  let roomPopUp = document.getElementById("roomPopUp");
  roomPopUp.style.display ="none";
  let confirmDel = document.getElementById("confirmDel");
  confirmDel.style.display ="none";
}

function roomStats(roomName){
  let roomNameJString = JSON.stringify(roomName);
  localStorage["roomName"] = roomNameJString;
  window.location.href = "statistics.html";
}

