function Patient(profile){
    this.patientID = profile.patientID;
    this.firstName = profile.firstName;
    this.lastName = profile.lastName;
    this.availability = profile.availability;
};

Patient.list = {};

Patient.generate = function(){
    var patientTableString="", error=false;

    Patient.list[0] = new Patient({patientID: "0001",firstName: "Jef", lastName: "Stas", availability: "Tuesday"});    
    Patient.list[4] = new Patient({patientID: "0002",firstName: "Fien", lastName: "Kappers", availability: "Friday"});
    Patient.list[4] = new Patient({patientID: "0003",firstName: "Annalies", lastName: "Schulenburg", availability: "Sunday"});
    Patient.list[1] = new Patient({patientID: "0004",firstName: "Jos", lastName: "Vanherbergen", availability: "Monday"});
    Patient.list[2] = new Patient({patientID: "0005",firstName: "Jan", lastName: "Janssens", availability: "Saturday"});
    Patient.list[4] = new Patient({patientID: "0006",firstName: "Femke", lastName: "Davenschot", availability: "Sunday"});
    Patient.list[3] = new Patient({patientID: "0007",firstName: "Piet", lastName: "Dierickx", availability: "Wednesday"});
    Patient.list[4] = new Patient({patientID: "0008",firstName: "Bart", lastName: "Van Riet", availability: "Thursday"});
    Patient.list[4] = new Patient({patientID: "0009",firstName: "Mariska", lastName: "Herms", availability: "Tuesday"});
    Patient.list[4] = new Patient({patientID: "0010",firstName: "Iemke", lastName: "Feijtzes", availability: "Sunday"});
    Patient.list[4] = new Patient({patientID: "0011",firstName: "Madelien", lastName: "Kinds", availability: "Friday"});
    Patient.list[4] = new Patient({patientID: "0012",firstName: "Reggy", lastName: "ter Welle", availability: "Wednesday"});
    Patient.list[4] = new Patient({patientID: "0013",firstName: "Aart", lastName: "Dreteler", availability: "Friday"});
    Patient.list[4] = new Patient({patientID: "0014",firstName: "Lindert", lastName: "Kortstee", availability: "Saturday"});
    Patient.list[4] = new Patient({patientID: "0015",firstName: "Carolien", lastName: "Haaks", availability: "Wednesday"});
    Patient.list[4] = new Patient({patientID: "0016",firstName: "Wouter", lastName: "Kompagnie", availability: "Saturday"});
    Patient.list[4] = new Patient({patientID: "0017",firstName: "Gust", lastName: "Sietzen", availability: "Friday"});
    Patient.list[4] = new Patient({patientID: "0018",firstName: "Liene", lastName: "Velner", availability: "Sunday"});
    Patient.list[4] = new Patient({patientID: "0019",firstName: "Arjan", lastName: "Nevenzel", availability: "Monday"});
    Patient.list[4] = new Patient({patientID: "0020",firstName: "Teun", lastName: "van Beulingen", availability: "Wednesday"});
    Patient.list[4] = new Patient({patientID: "0021",firstName: "Walter", lastName: "Boekholt", availability: "Wednesday"});
    Patient.list[4] = new Patient({patientID: "0022",firstName: "Loes", lastName: "Grootehaar", availability: "Saturday"});
    Patient.list[4] = new Patient({patientID: "0023",firstName: "Henk-Jan", lastName: "Soepenberg", availability: "Monday"});
    Patient.list[4] = new Patient({patientID: "0024",firstName: "Florens", lastName: "Schulting", availability: "Monday"});
    Patient.list[4] = new Patient({patientID: "0025",firstName: "Karst-Jan", lastName: "Mulhof", availability: "Tuesday"});
    Patient.list[4] = new Patient({patientID: "0026",firstName: "Nelis", lastName: "Posthuma", availability: "Sunday"});
    Patient.list[4] = new Patient({patientID: "0027",firstName: "Florieke", lastName: "Klein Jan", availability: "Thursday"});
    Patient.list[4] = new Patient({patientID: "0028",firstName: "Daantje", lastName: "Onnes", availability: "Wednesday"});
    Patient.list[4] = new Patient({patientID: "0029",firstName: "Joosje", lastName: "Ganzeboom", availability: "Tuesday"});
    Patient.list[4] = new Patient({patientID: "0030",firstName: "Geert-Jan", lastName: "Olink", availability: "Tuesday"});
    Patient.list[4] = new Patient({patientID: "0031",firstName: "Joeri", lastName: "Mets", availability: "Friday"});
    Patient.list[4] = new Patient({patientID: "0032",firstName: "Jolien", lastName: "van 't Hag", availability: "Monday"});
    Patient.list[4] = new Patient({patientID: "0033",firstName: "Willemieke", lastName: "Hendrix", availability: "Monday"});
    Patient.list[4] = new Patient({patientID: "0034",firstName: "Daan", lastName: "Mourik", availability: "Thursday"});
    Patient.list[4] = new Patient({patientID: "0035",firstName: "Henk-Jan Klijn", lastName: "Velderman", availability: "Friday"});
    Patient.list[4] = new Patient({patientID: "0036",firstName: "Karlijn", lastName: "van Lente", availability: "Thursday"});
    Patient.list[4] = new Patient({patientID: "0037",firstName: "Wouter", lastName: "Kroon", availability: "Saturday"});
    Patient.list[4] = new Patient({patientID: "0038",firstName: "Eline", lastName: "Pongers", availability: "Tuesday"});
    Patient.list[4] = new Patient({patientID: "0039",firstName: "Petra", lastName: "Berkenvelder", availability: "Sunday"});
    Patient.list[4] = new Patient({patientID: "0040",firstName: "Madelief", lastName: "Groothuis", availability: "Monday"});
    Patient.list[4] = new Patient({patientID: "0041",firstName: "Tijl", lastName: "Lugtenbeld", availability: "Tuesday"});
    Patient.list[4] = new Patient({patientID: "0042",firstName: "Jochem", lastName: "Middelwijk", availability: "Thursday"});
    Patient.list[4] = new Patient({patientID: "0043",firstName: "Riet", lastName: "Vorring", availability: "Saturday"});
    Patient.list[4] = new Patient({patientID: "0044",firstName: "Ellemieke", lastName: "Heijsman", availability: "Sunday"});
    Patient.list[4] = new Patient({patientID: "0045",firstName: "Kevin", lastName: "Aalders", availability: "Wednesday"});
    Patient.list[4] = new Patient({patientID: "0046",firstName: "Lars", lastName: "Kamp", availability: "Friday"});
    Patient.list[4] = new Patient({patientID: "0047",firstName: "Henkjan", lastName: "Kleinjans", availability: "Monday"});
    Patient.list[4] = new Patient({patientID: "0048",firstName: "Miesje", lastName: "van het Vriesendijks", availability: "Tuesday"});
    Patient.list[4] = new Patient({patientID: "0049",firstName: "Renske", lastName: "Vermeer", availability: "Friday"});
    Patient.list[4] = new Patient({patientID: "0050",firstName: "Gudo", lastName: "Pakhuis", availability: "Sunday"});

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