function Patient(profile){
    this.patientID = profile.patientID;
    this.firstName = profile.firstName;
    this.lastName = profile.lastName;
    this.availability = profile.availability;
};

Patient.list = {};

Patient.generate = function(){
    var patientTableString="", error=false;

    Patient.list[0] = new Patient({patientID: "00115",firstName: "Jef", lastName: "Stas", availability: "Monday"});
    Patient.list[1] = new Patient({patientID: "00116",firstName: "Jos", lastName: "Vanherbergen", availability: "Friday"});
    Patient.list[2] = new Patient({patientID: "00235",firstName: "Jan", lastName: "Janssens", availability: "Thursday"});
    Patient.list[3] = new Patient({patientID: "00246",firstName: "Piet", lastName: "Dierickx", availability: "Tuesday"});
    Patient.list[4] = new Patient({patientID: "00300",firstName: "Bart", lastName: "Van Riet", availability: "Monday"});
    try {
        patientTableString = JSON.stringify( Patient.list);
        localStorage["patientTable"] = patientTableString;
        console.log(patientTableString);
      } catch (e) {
        alert("Error when writing to Local Storage\n" + e);
        error = true;
      }
};

Patient.loadAll = function(){
    var i=0, key="", keys=[], patientTableString="", patientTable={};  
    try {
      if (localStorage["patientTable"]) {
        patientTableString = localStorage["patientTable"];
      }
    } catch (e) {
      alert("Error when reading from Local Storage\n" + e);
    }
    if (patientTableString) {
        patientTable = JSON.parse( patientTableString);

      keys = Object.keys( patientTable);
      console.log( keys.length +" patient loaded.");
      for (i=0; i < keys.length; i++) {
        key = keys[i];
        Patient.list[key] = Patient.convertRow2Obj( patientTable[key]);
      }
    }
};

Patient.convertRow2Obj = function (patientRow) {
    var patient = new Patient( patientRow);
    return patient;
};