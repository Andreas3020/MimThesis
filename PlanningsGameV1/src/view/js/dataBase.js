function sendToDatabase(){
    console.log(fname.value + " " + lname.value);

  // Get a reference to the database service
  var database = firebase.database();
  database.ref('users/' + fname).set({
    username: lname,
  });

}