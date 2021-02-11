pl.view.genPatient = {
    setupUserInterface: function () {
        var tableBody = document.querySelector("table#patientTable>tbody");
        row = tableBodyEl.insertRow();
        keys = Object.keys( Patient.list);
        key = keys[0];
        row.insertCell(-1).textContent = Patient.list[key].firstName;
        row.insertCell(-1).textContent = Patient.list[key].lastName;
        row.insertCell(-1).textContent = Patient.list[key].availability;
    }
  };