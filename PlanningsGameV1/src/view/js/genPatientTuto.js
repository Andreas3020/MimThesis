function Klant(profile){
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
  this.lastSelectedSlotId = profile.lastSelectedSlotId;
};

var patientListTuto = [
  new Klant({patientID: 1, firstName: "Andreas", lastName: "Dierickx", availability: ["Monday","Wednesday","Thursday"], onco: 0, chemo: 2, lastPatientBool: false, chemoLength: 4, probBloodFail: 0, weekNrFirstSelectedSlot: -1, lastSelectedSlotId: 0}),
  new Klant({patientID: 2, firstName: "Laurens", lastName: "Stas", availability: ["Tuesday","Thursday","Sunday"], onco: 4, chemo: 4, lastPatientBool: true, chemoLength: 3, probBloodFail: 1, weekNrFirstSelectedSlot: -1, lastSelectedSlotId: 0}),
  new Klant({patientID: 3, firstName: "Raf", lastName: "Vanherbergen", availability: ["Monday","Tuesday","Saturday"], onco: 0, chemo: 5, lastPatientBool: false, chemoLength: 3, probBloodFail: 0, weekNrFirstSelectedSlot: -1, lastSelectedSlotId: 0}),
  new Klant({patientID: 4, firstName: "Erik", lastName: "Demeulemeester", availability: ["Tuesday","Friday","Sunday"], onco: 0, chemo: 5, lastPatientBool: false, chemoLength: 3, probBloodFail: 0, weekNrFirstSelectedSlot: -1, lastSelectedSlotId: 0}),
  new Klant({patientID: 5, firstName: "Bart", lastName: "Van Riet", availability: ["Tuesday","Wednesday","Friday"], onco: 3, chemo: 3, lastPatientBool: true, chemoLength: 4, probBloodFail: 0, weekNrFirstSelectedSlot: -1, lastSelectedSlotId: 0}),
  new Klant({patientID: 6, firstName: "Adam", lastName: "Smith", availability: ["Tuesday","Thursday","Friday"], onco: 1, chemo: 0, lastPatientBool: false, chemoLength: 0, probBloodFail: 1, weekNrFirstSelectedSlot: -1, lastSelectedSlotId: 0}),
  new Klant({patientID: 7, firstName: "Martina", lastName: "Vandebroeck", availability: ["Monday","Friday","Saturday"], onco: 0, chemo: 5, lastPatientBool: false, chemoLength: 4, probBloodFail: 0, weekNrFirstSelectedSlot: -1, lastSelectedSlotId: 0}),
  new Klant({patientID: 8, firstName: "Friedrich", lastName: "Hayek", availability: ["Tuesday","Friday","Sunday"], onco: 1, chemo: 0, lastPatientBool: true, chemoLength: 0, probBloodFail: 0, weekNrFirstSelectedSlot: -1, lastSelectedSlotId: 0}),
  new Klant({patientID: 9, firstName: "Karl", lastName: "Marx", availability: ["Monday","Wednesday","Saturday"], onco: 1, chemo: 0, lastPatientBool: false, chemoLength: 0, probBloodFail: 0, weekNrFirstSelectedSlot: -1, lastSelectedSlotId: 0}),
  new Klant({patientID: 10, firstName: "Max", lastName: "Weber", availability: ["Monday","Saturday","Sunday"], onco: 2, chemo: 2, lastPatientBool: false, chemoLength: 4, probBloodFail: 0, weekNrFirstSelectedSlot: -1, lastSelectedSlotId: 0}),
  new Klant({patientID: 11, firstName: "Jan", lastName: "Tinbergen", availability: ["Monday","Tuesday","Sunday"], onco: 0, chemo: 5, lastPatientBool: true, chemoLength: 3, probBloodFail: 0, weekNrFirstSelectedSlot: -1, lastSelectedSlotId: 0}),
  new Klant({patientID: 12, firstName: "Milton", lastName: "Friedman", availability: ["Tuesday","Friday","Sunday"], onco: 3, chemo: 3, lastPatientBool: false, chemoLength: 4, probBloodFail: 0, weekNrFirstSelectedSlot: -1, lastSelectedSlotId: 0}),
  new Klant({patientID: 13, firstName: "Wilfried", lastName: "Lemahieu", availability: ["Wednesday","Friday","Saturday"], onco: 0, chemo: 5, lastPatientBool: false, chemoLength: 3, probBloodFail: 0, weekNrFirstSelectedSlot: -1, lastSelectedSlotId: 0}),
  new Klant({patientID: 14, firstName: "Luc", lastName: "Sels", availability: ["Monday","Friday","Saturday"], onco: 0, chemo: 2, lastPatientBool: false, chemoLength: 3, probBloodFail: 0, weekNrFirstSelectedSlot: -1, lastSelectedSlotId: 0}),
  new Klant({patientID: 15, firstName: "John", lastName: "Keynes", availability: ["Tuesday","Wednesday","Sunday"], onco: 3, chemo: 3, lastPatientBool: false, chemoLength: 3, probBloodFail: 0, weekNrFirstSelectedSlot: -1, lastSelectedSlotId: 0})
];



let i = 0;
pl.view.genPatientTuto = {
    setupUserInterface: function () {
        lastPatient = 0;
  
        //Set clickListener on button 'next patient'
        tableBody = document.getElementById('patientTableScheduler');

        row = tableBody.insertRow();
        row.insertCell(0).textContent = patientListTuto[0].patientID;
        row.insertCell(1).textContent = patientListTuto[0].firstName;
        row.insertCell(2).textContent = patientListTuto[0].lastName;
        row.insertCell(3).textContent = patientListTuto[0].availability;
        row.insertCell(4).textContent = patientListTuto[0].onco;
        row.insertCell(5).textContent = patientListTuto[0].onco;
        row.insertCell(6).textContent = patientListTuto[0].chemo;
        row.insertCell(7).textContent = patientListTuto[0].chemo;
        row.insertCell(8).textContent = patientListTuto[0].chemoLength;
    }
  };
  
  
  //Show new patient to be scheduled
  function nextPatientEvent(){

    nrOfPatients = patientListTuto.length;
  
    if(i < nrOfPatients-1) {
        i++;
        tableBody.rows[1].cells[0].innerHTML = patientListTuto[i].patientID;
        tableBody.rows[1].cells[1].innerHTML = patientListTuto[i].firstName;
        tableBody.rows[1].cells[2].innerHTML = patientListTuto[i].lastName;
        tableBody.rows[1].cells[3].innerHTML = patientListTuto[i].availability;
        tableBody.rows[1].cells[4].innerHTML = patientListTuto[i].onco;
        tableBody.rows[1].cells[5].innerHTML = patientListTuto[i].onco;
        tableBody.rows[1].cells[6].innerHTML = patientListTuto[i].chemo;
        tableBody.rows[1].cells[7].innerHTML = patientListTuto[i].chemo;
        tableBody.rows[1].cells[8].innerHTML = patientListTuto[i].chemoLength;
        
    } else {
        lastPatient = 1;
    }
    return lastPatient;
  }