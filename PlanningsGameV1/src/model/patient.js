function Patient(profile){
  this.patientID = profile.patientID;
  this.firstName = profile.firstName;
  this.lastName = profile.lastName;
  this.availability = profile.availability;
  this.onco = profile.onco;
  this.chemo = profile.chemo;
  this.lastPatientBool = profile.lastPatientBool;
  this.chemoLength = profile.chemoLength;
  this.probBloodFail = profile.probBloodFail;
  this.weekNrFirstSelectedSlot = profile.weekNrFirstSelectedSlot;
};

var minNrDay = 3;
var maxNrDay = 5;
var minLength = 3;
var maxLength = 7;
var oncoProb = 0.5;
var nrOfPersons = 70;
var minPatDay = 3;
var maxPatDay = 6;
var maxChemoLength = 3;

Patient.genList = {};
Patient.list = {};

//Patient object - variables
var firstNameMale = 
["Jef", "Jos", "Jan", "Piet", "Bart", "Reggy", "Aart", "Wouter", "Gust", "Arjan", "Teun", "Walter", "Henk-Jan", "Floris", "Karst-Jan", "Nelis", "Daantje", "Geert", "Joeri", "David", "Lode", "Sander", "Tijl", "Jochem", "Kevin", "Lars", "Xavier", "Guido"];
var firstNameFemale = 
["Fien", "Annalies", "Femke", "Mariska", "Iemke", "Madelien", "Linde", "Carolien", "Liene", "Loes", "Floortje", "Josje", "Jolien", "Willemieke", "Karlijn", "Eline", "Petra", "Madelief", "Riet", "Marie", "Merel", "Renske"];
var lastName =
["Stas", "Kappers", "Schulenburg", "Vanherbergen", "Janssens", "Davenschot", "Dierickx", "Van Riet", "Herms", "Feijtzes", "Kinds", "ter Welle", "Dreteler", "Kortstee", "Haaks", "Kompagnie", "Sietzen", "Velner", "Nevenzel", "van Beulingen", "Boekholt", "Grootehaar", "Soepenberg", "Schulting", "Mulhof", "Posthuma", "Klein Jan","Onnes", "Ganzeboom", "Verbomen", "Mets", "van 't Hag", "Hendrix", "Mourik", "Velderman", "van Lente", "Kroon", "Pongers", "Berkenvelder", "Groothuis", "Lugtenbeld", "Middelwijk", "Vorring", "Heijsman", "Aalders", "Kamp", "Kleinjans", "van het Vriesendijks", "Vermeer", "Pakhuis"];
var availability = ["Monday", "Tuesday","Wednesday","Friday","Saturday","Sunday"];
var onco = [0,1];
var chemo = [0,2,3,4,5,6];  //Chemo: Niet, of periodisch tussen 2 tot 6 weken lang.

//AMOUNT PATIENTS TO BE ASSIGNED ON CURRENT DAY (updated per day.)
var nrPatientsCurrentDay = getRandomInt(minNrDay,maxNrDay);

// PATIENT LIST LOCALSTORAGE (Generate + save)
Patient.generate = function() {
  var patientTableString="", error=false;

  //Temp variables to write to individual object
  var tempFname = "";
  var tempLname = "";
  var tempAvailability = "";
  var tempOnco, tempChemo;    //tempChemo = periodicity (# weeks)
  var tempChemoLength;        //tempChemoLength = length of chemosession (type of chemo)
  var tempLastPatientBool;
  var tempProbBloodFail;

  //TOTAL AMOUNT OF PERSONS TO BE SCHEDULED DURING THE GAME

  for (let i = 0; i < nrOfPersons; i++) {
    //Generate patient variables (random)...
    if(flipCoin()) { tempFname = firstNameFemale[getRandomInt(0, firstNameFemale.length)];}
    else { tempFname = firstNameMale[getRandomInt(0, firstNameMale.length)];}
    tempLname = lastName[getRandomInt(0, lastName.length)];
    tempAvailability = availability[getRandomInt(0, availability.length)];

    [tempOnco, tempChemo] = allocateTempOncoAndChemo();
    tempChemoLength = getRandomInt(minLength,maxLength);

    // if( i === nrOfPersons-1) { tempLastPatientBool = false; }
    
    tempProbBloodFail = getRandomFloat(0,0.99).toFixed(2);
    
    tempWeekNrFirstSelectedSlot = -1;
    //Create patient/Write to list
    Patient.genList[i] = new Patient({patientID: i, firstName: tempFname, lastName: tempLname, availability: tempAvailability, onco: tempOnco, chemo: tempChemo, chemoLength: tempChemoLength, lastPatientBool: tempLastPatientBool, probBloodFail: tempProbBloodFail, weekNrFirstSelectedSlot: tempWeekNrFirstSelectedSlot});
  }

  //Save patient list (JSONstringify) to localStorage (patientTable)
  try {
      patientTableString = JSON.stringify( Patient.genList);
      localStorage["patientTable"] = patientTableString;
    } catch (e) {
      alert("Error when writing to Local Storage\n" + e);
      error = true;
    }
};



Patient.loadAll = function(){
  var i=0, key="", keys=[], patientTableString="", patientTable={};  
  //Load patientTable from localStorage
  try {
    if (localStorage["patientTable"]) {
      patientTableString = localStorage["patientTable"];
    }
  } catch (e) {
    alert("Error when reading from Local Storage\n" + e);
  }
  //Convert patientTable to patient objects
  //Save objects in Patient.list
  if (patientTableString) {
    patientTable = JSON.parse( patientTableString);
    keys = Object.keys( patientTable);

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



//----------HELPER FUNCTIONS----------------//

//CREATE RANDOM INT (minimum inclusive and maximum exclusive)
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
};
//CREATE RANDOM FLOAT BETWEEN MIN AND MAX
function getRandomFloat(min, max)
{
  return min + Math.random() * (max - min);
}

//RETURN 0 OR 1 (50% chance)
function flipCoin() {
  let onlyOnco = Math.random();
  if(onlyOnco < oncoProb){
    return 1;
  }
  else{
    return 0;
  }
};

//ASSIGN BOOL IF PATIENT NEEDS TO BE LAST PATIENT OF THE DAY
function lastPatient() {
  if(nrPatientsCurrentDay == 0) {
    nrPatientsCurrentDay = getRandomInt(minPatDay,maxPatDay);   //Determine # patients per day (between x & y)
    return true;
  } else {
    nrPatientsCurrentDay -= 1;
    return false;
  }
}

//ALLOCATE TEMPONCO + TEMPCHEMO
function allocateTempOncoAndChemo() {
  let tempO = onco[flipCoin()];
  let tempC = chemo[getRandomInt(0,maxChemoLength)]; //chemo=[0,2,3,4,5,6] => length 6, indexes until 5.
  
  //Onco = chemo = 0 may not happen
  if(tempO == 0 && tempC == 0) { return allocateTempOncoAndChemo(); }
  //O&C appointment => update onco (1) to #onco = #chemo
  else if(tempO == 1 && tempC >= 2) { tempO = tempC; }

  return [tempO, tempC];
};



  //Fixed patient list (50x)
  /*Patient.list[0] = new Patient({patientID: "0001",firstName: "Jef", lastName: "Stas", availability: "Tuesday"});    
  Patient.list[1] = new Patient({patientID: "0002",firstName: "Fien", lastName: "Kappers", availability: "Friday"});
  Patient.list[2] = new Patient({patientID: "0003",firstName: "Annalies", lastName: "Schulenburg", availability: "Sunday"});
  Patient.list[3] = new Patient({patientID: "0004",firstName: "Jos", lastName: "Vanherbergen", availability: "Monday"});
  Patient.list[4] = new Patient({patientID: "0005",firstName: "Jan", lastName: "Janssens", availability: "Saturday"});
  Patient.list[5] = new Patient({patientID: "0006",firstName: "Femke", lastName: "Davenschot", availability: "Sunday"});
  Patient.list[6] = new Patient({patientID: "0007",firstName: "Piet", lastName: "Dierickx", availability: "Wednesday"});
  Patient.list[7] = new Patient({patientID: "0008",firstName: "Bart", lastName: "Van Riet", availability: "Thursday"});
  Patient.list[8] = new Patient({patientID: "0009",firstName: "Mariska", lastName: "Herms", availability: "Tuesday"});
  Patient.list[9] = new Patient({patientID: "0010",firstName: "Iemke", lastName: "Feijtzes", availability: "Sunday"});
  Patient.list[10] = new Patient({patientID: "0011",firstName: "Madelien", lastName: "Kinds", availability: "Friday"});
  Patient.list[11] = new Patient({patientID: "0012",firstName: "Reggy", lastName: "ter Welle", availability: "Wednesday"});
  Patient.list[12] = new Patient({patientID: "0013",firstName: "Aart", lastName: "Dreteler", availability: "Friday"});
  Patient.list[13] = new Patient({patientID: "0014",firstName: "Linde", lastName: "Kortstee", availability: "Saturday"});
  Patient.list[14] = new Patient({patientID: "0015",firstName: "Carolien", lastName: "Haaks", availability: "Wednesday"});
  Patient.list[15] = new Patient({patientID: "0016",firstName: "Wouter", lastName: "Kompagnie", availability: "Saturday"});
  Patient.list[16] = new Patient({patientID: "0017",firstName: "Gust", lastName: "Sietzen", availability: "Friday"});
  Patient.list[17] = new Patient({patientID: "0018",firstName: "Liene", lastName: "Velner", availability: "Sunday"});
  Patient.list[18] = new Patient({patientID: "0019",firstName: "Arjan", lastName: "Nevenzel", availability: "Monday"});
  Patient.list[19] = new Patient({patientID: "0020",firstName: "Teun", lastName: "van Beulingen", availability: "Wednesday"});
  Patient.list[20] = new Patient({patientID: "0021",firstName: "Walter", lastName: "Boekholt", availability: "Wednesday"});
  Patient.list[21] = new Patient({patientID: "0022",firstName: "Loes", lastName: "Grootehaar", availability: "Saturday"});
  Patient.list[22] = new Patient({patientID: "0023",firstName: "Henk-Jan", lastName: "Soepenberg", availability: "Monday"});
  Patient.list[23] = new Patient({patientID: "0024",firstName: "Floris", lastName: "Schulting", availability: "Monday"});
  Patient.list[24] = new Patient({patientID: "0025",firstName: "Karst-Jan", lastName: "Mulhof", availability: "Tuesday"});
  Patient.list[25] = new Patient({patientID: "0026",firstName: "Nelis", lastName: "Posthuma", availability: "Sunday"});
  Patient.list[26] = new Patient({patientID: "0027",firstName: "Floortje", lastName: "Klein Jan", availability: "Thursday"});
  Patient.list[27] = new Patient({patientID: "0028",firstName: "Daantje", lastName: "Onnes", availability: "Wednesday"});
  Patient.list[28] = new Patient({patientID: "0029",firstName: "Josje", lastName: "Ganzeboom", availability: "Tuesday"});
  Patient.list[29] = new Patient({patientID: "0030",firstName: "Geert", lastName: "Verbomen", availability: "Tuesday"});
  Patient.list[30] = new Patient({patientID: "0031",firstName: "Joeri", lastName: "Mets", availability: "Friday"});
  Patient.list[31] = new Patient({patientID: "0032",firstName: "Jolien", lastName: "van 't Hag", availability: "Monday"});
  Patient.list[32] = new Patient({patientID: "0033",firstName: "Willemieke", lastName: "Hendrix", availability: "Monday"});
  Patient.list[33] = new Patient({patientID: "0034",firstName: "David", lastName: "Mourik", availability: "Thursday"});
  Patient.list[34] = new Patient({patientID: "0035",firstName: "Lode", lastName: "Velderman", availability: "Friday"});
  Patient.list[35] = new Patient({patientID: "0036",firstName: "Karlijn", lastName: "van Lente", availability: "Thursday"});
  Patient.list[36] = new Patient({patientID: "0037",firstName: "Sander", lastName: "Kroon", availability: "Saturday"});
  Patient.list[37] = new Patient({patientID: "0038",firstName: "Eline", lastName: "Pongers", availability: "Tuesday"});
  Patient.list[38] = new Patient({patientID: "0039",firstName: "Petra", lastName: "Berkenvelder", availability: "Sunday"});
  Patient.list[39] = new Patient({patientID: "0040",firstName: "Madelief", lastName: "Groothuis", availability: "Monday"});
  Patient.list[40] = new Patient({patientID: "0041",firstName: "Tijl", lastName: "Lugtenbeld", availability: "Tuesday"});
  Patient.list[41] = new Patient({patientID: "0042",firstName: "Jochem", lastName: "Middelwijk", availability: "Thursday"});
  Patient.list[42] = new Patient({patientID: "0043",firstName: "Riet", lastName: "Vorring", availability: "Saturday"});
  Patient.list[43] = new Patient({patientID: "0044",firstName: "Marie", lastName: "Heijsman", availability: "Sunday"});
  Patient.list[44] = new Patient({patientID: "0045",firstName: "Kevin", lastName: "Aalders", availability: "Wednesday"});
  Patient.list[45] = new Patient({patientID: "0046",firstName: "Lars", lastName: "Kamp", availability: "Friday"});
  Patient.list[46] = new Patient({patientID: "0047",firstName: "Xavier", lastName: "Kleinjans", availability: "Monday"});
  Patient.list[47] = new Patient({patientID: "0048",firstName: "Merel", lastName: "van het Vriesendijks", availability: "Tuesday"});
  Patient.list[48] = new Patient({patientID: "0049",firstName: "Renske", lastName: "Vermeer", availability: "Friday"});
  Patient.list[49] = new Patient({patientID: "0050",firstName: "Guido", lastName: "Pakhuis", availability: "Sunday"});
  */