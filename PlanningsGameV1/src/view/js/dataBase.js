function genRandomPatients(){
  pl.view.genPatientCopy.setupUserInterface();
  keys = Object.keys(Patient.list);

  database.set({Patient_List: Patient.list});
}

function writeData(){
  database.child(fname.value).set({firstname: fname.value, lastname: lname.value});
  database.child("id").set({onco: "no", chemo: "3"});
  getDataOnce();
  getData();
}

function getDataOnce(){
  database.child(fname.value).once('value', function(snapshot) {
    let data = snapshot.val();
    document.getElementById("data1").innerHTML = data["firstname"] + " " + data["lastname"];
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