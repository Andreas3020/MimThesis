pl.view.genPatient = {
    setupUserInterface: function () {
        //Set clickListener on button 'next patient'
        tableBody = document.getElementById('patientTable');
        var nextButton = document.forms["Patient"].nextPatient;
        nextButton.addEventListener("click", 
        pl.view.genPatient.handleNextButtonClickEvent);

        //Retrieve & display patient[0]
        i = 0;
        row = tableBody.insertRow();
        keys = Object.keys( Patient.list);
        key = keys[i];
        row.insertCell(0).textContent = Patient.list[key].patientID;
        row.insertCell(1).textContent = Patient.list[key].firstName;
        row.insertCell(2).textContent = Patient.list[key].lastName;
        row.insertCell(3).textContent = Patient.list[key].availability;
    },

    //Update patient to schedule
    handleNextButtonClickEvent: function() {

        nrOfPatients = keys.length;
        console.log(nrOfPatients);
        if(i < nrOfPatients) {
            i++;
            key = keys[i];
            tableBody.rows[1].cells[0].innerHTML = Patient.list[key].patientID;
            tableBody.rows[1].cells[1].innerHTML = Patient.list[key].firstName;
            tableBody.rows[1].cells[2].innerHTML = Patient.list[key].lastName;
            tableBody.rows[1].cells[3].innerHTML = Patient.list[key].availability;
        } else {
            window.alert("This was the last patient.");
        }
    }
};