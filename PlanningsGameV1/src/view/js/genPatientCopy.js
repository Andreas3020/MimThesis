pl.view.genPatientCopy = {
    setupUserInterface: function () {
        tableBody = document.getElementById('patientTableRoom');
        keys = Object.keys(Patient.list);
        let length = keys.length;
        //Retrieve & display patient[0]
        for(let i = 0; i < length; i++){
            row = tableBody.insertRow();
            key = keys[i];
            row.insertCell(0).textContent = Patient.list[key].patientID;
            row.insertCell(1).textContent = Patient.list[key].firstName;
            row.insertCell(2).textContent = Patient.list[key].lastName;
            row.insertCell(3).textContent = Patient.list[key].availability;
            row.insertCell(4).textContent = Patient.list[key].onco;
            row.insertCell(5).textContent = Patient.list[key].chemo;
        }
    }
};
