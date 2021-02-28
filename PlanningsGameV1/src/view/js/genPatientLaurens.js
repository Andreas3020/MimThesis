pl.view.genPatient = {
  setupUserInterface: function () {
      lastPatient = 0; // slecht oplossing voor probleem

      //Set clickListener on button 'next patient'
      tableBody = document.getElementById('patientTableScheduler');

      i = 0;
      row = tableBody.insertRow();
      Patient.loadAll();
      keys = Object.keys(Patient.list);
      key = keys[i];
      row.insertCell(0).textContent = Patient.list[key].patientID;
      row.insertCell(1).textContent = Patient.list[key].firstName;
      row.insertCell(2).textContent = Patient.list[key].lastName;
      row.insertCell(3).textContent = Patient.list[key].availability;
      row.insertCell(4).textContent = Patient.list[key].onco;
      row.insertCell(5).textContent = Patient.list[key].onco;
      row.insertCell(6).textContent = Patient.list[key].chemo;
      row.insertCell(7).textContent = Patient.list[key].chemo;
      row.insertCell(8).textContent = Patient.list[key].chemoLength;
  }
};


//Show new patient to be scheduled
function nextPatientEvent(){

  nrOfPatients = keys.length;

  if(i < nrOfPatients) {
      i++;
      key = keys[i];
      tableBody.rows[1].cells[0].innerHTML = Patient.list[key].patientID;
      tableBody.rows[1].cells[1].innerHTML = Patient.list[key].firstName;
      tableBody.rows[1].cells[2].innerHTML = Patient.list[key].lastName;
      tableBody.rows[1].cells[3].innerHTML = Patient.list[key].availability;
      tableBody.rows[1].cells[4].innerHTML = Patient.list[key].onco;
      tableBody.rows[1].cells[5].innerHTML = Patient.list[key].onco;
      tableBody.rows[1].cells[6].innerHTML = Patient.list[key].chemo;
      tableBody.rows[1].cells[7].innerHTML = Patient.list[key].chemo;
      tableBody.rows[1].cells[8].innerHTML = Patient.list[key].chemoLength;
      
  } else {
      window.alert("This was the last patient.");
      lastPatient++;
  }
  return lastPatient;
}

// make array of number of days you want to play elements where each element is a number that represents the number of patients that need to be sheduled that day
function nrPatientsDayGenerator()
{
  
}