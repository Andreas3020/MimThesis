pl.view.genPatient = {
    setupUserInterface: function () {
        i = 0;
        tableBody = document.getElementById('patientTable');
        var nextButton = document.forms["Patient"].nextPatient;
        nextButton.addEventListener("click", 
          pl.view.genPatient.handleNextButtonClickEvent);

        row = tableBody.insertRow();
        keys = Object.keys( Patient.list);
        key = keys[i];
        row.insertCell(0).textContent = Patient.list[key].patientID;
        row.insertCell(1).textContent = Patient.list[key].firstName;
        row.insertCell(2).textContent = Patient.list[key].lastName;
        row.insertCell(3).textContent = Patient.list[key].availability;
    },

    handleNextButtonClickEvent: function() {
        i++;
        key = keys[i];
        try{
        tableBody.rows[1].cells[0].innerHTML = Patient.list[key].patientID;
        tableBody.rows[1].cells[1].innerHTML = Patient.list[key].firstName;
        tableBody.rows[1].cells[2].innerHTML = Patient.list[key].lastName;
        tableBody.rows[1].cells[3].innerHTML = Patient.list[key].availability;
        }
        catch(error){
            window.alert("This was the last patient.");
        }
    }
  };