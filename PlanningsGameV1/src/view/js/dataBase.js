function popUpWindow(){
  const popUp = document.getElementById("roomPopUp");
  popUp.style.display = "block";
}

function confirmPassword(){
  const password = document.getElementById("pass").value;
  if(password == "123"){
    const popUpPass = document.getElementById("popUpPass");
    popUpPass.style.display = "none";

    const popUpText = document.getElementById("popUpText");
    popUpText.style.display = "block";
    popUpText.style.display = "flexbox";

    const popUpButton = document.getElementById("popUpButton");
    popUpButton.style.display = "block";
    popUpButton.style.display = "flex";
  }
  else{
    const passErr = document.getElementById("passErr");
    passErr.innerHTML = "The password was incorrect!";
  }  
}

function addRoom(){
  //hide the pop-up again
  const popUpText = document.getElementById("popUpText");
  popUpText.style.display = "none";

  const popUpButton = document.getElementById("popUpButton");
  popUpButton.style.display = "none";

  const popUp = document.getElementById("roomPopUp");
  popUp.style.display = "none";

  const popUpPass= document.getElementById("popUpPass");
  popUpPass.style.display = "block";
  popUpPass.style.display = "flexbox";

  //Make the room button 
  const htmlRooms = document.getElementById("rooms");
  let roomName = document.getElementById("rname").value;
  htmlRooms.innerHTML += '<div class ="roomButtonDiv"> <button class="roomButton" name="Room1">'+ roomName +'</button> </div>';

  //Generate patient list and send them to the database
  Patient.generate();
  database.child("Patient lists").child("Room: " + roomName).set(Patient.list);
}

function writeData(){
  database.child(fname.value).set({firstname: fname.value, lastname: lname.value});
  database.child("id").set({onco: "no", chemo: "3"});
  getDataOnce();
  getData();
}

function getDataOnce(){
  database.child("Patient lists").child("Room: Andreas").once('value', function(snapshot) {
    let data = snapshot.val();
    console.log(data);
  })

  //voorbeeld met gebruik van child
  /*database.child(fname.value).once('value', function(snapshot) {
    let data = snapshot.val();
    console.log(data);
  })*/
}

function getData(){
  database.child(fname.value).get().then(function(snapshot) {
    if (snapshot.exists()) {
      let data = snapshot.val();
      document.getElementById("data2").innerHTML = data["lastname"] + " " + data["firstname"];
    }
    else {
      console.log("No data available");
    }
  }).catch(function(error) {
    console.error(error);
  });

  //alternatief voor hierboven met dubbel child
  /*database.child(fname.value).child("firstname").get().then(function(snapshot) {
    if (snapshot.exists()) {
      let data = snapshot.val();
      document.getElementById("data2").innerHTML = data;
    }
    else {
      console.log("No data available");
    }
  }).catch(function(error) {
    console.error(error);
  });*/
  
}