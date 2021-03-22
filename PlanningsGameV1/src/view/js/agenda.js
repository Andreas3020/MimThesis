//VARIABLES
let weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
let weekdaysShort = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
let hours = ["8:00","8:30","9:00","9:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30"];

/* Week being displayed (may be past, future or current week)
Week 1: weekNr = 0. Array convenience for coding. (the displayed week, not actual weekNr) */
let weekNr = 0; 
let currentWeek = 0; //Actual week
let todayNr = 0;

let IdSelectedSlot = -1;  //Indicate whether currenly a slot is selected.
let lengthSelectedSlot = -1;
let weekNrFirstSelectedSlot = -1;
let weekNrFirstSelectedSlotTemp = -1;
let oncoSlotOC = -1;
let slotsTakenArray = [];     //De agenda met gereserveerde slots (alle weken)
let slotsCurrentArray = [];   //Alle gereserveerde slots patient die huidig ingepland wordt (yellow)
let slotsToAddArray = [];     //Huidige selectie eventListener

let goToNextPatient = false;
let currentPatientObject = -1;

let skippedPatientsCounter = 0;

let todayPatientsArray = [];

let scenario; 

let addSelectVar;



function renderAgenda()
{
  /* tableCore = agenda body = hour legenda (left column) + slots (7days with each 6 slots (2 onco slots + 4 chemo slots). */
  const tableCore = document.getElementById("agendaBody");
  let core = "";
  //DIT IS NIET NODIG? OF WEL?
  IdSelectedSlot = -1; //RESET
  lengthSelectedSlot = -1; //RESET
  let greyedOutString="";

  //GENERATE AGENDA BODY (hour column + slots)
  for(let j=0; j<20; j++) { //20x ROWS - HOUR SLOTS
    core += `<tr>`;
    core += `<th> ${hours[j]} </th>`;   //E.g. <th>8:00</th>

    for (let i=0; i<7; i++) { //7x DAYS
      if ( currentWeek == weekNr)     { greyedOutString = checkDay(i, "greyedOutSlot"); } 
      else if (currentWeek > weekNr)  { greyedOutString = "greyedOutSlot"; } 
      else                            { greyedOutString = ""; }

      for (let k=0; k<6; k++) { //6x ONCOCHEMO (2 onco + 4 chemo)
        if(i == 6 && k == 5) {  //End of row => add </tr>
          //Slot is AVAILABLE
          if(slotsTakenArray[weekNr][6*i + 42*j +k] === false) {
            core += `<td class="${weekdaysShort[i]} ${greyedOutString}" id="D${i}_H${j}_OC${k}"></td> </tr>`;
          }  //Slot is CURRENTLY SELECTED   
          else if( slotsTakenArray[weekNr][6*i + 42*j +k].length === 12) {
            core += `<td class="${weekdaysShort[i]} slotsCurrent ${greyedOutString}" id="D${i}_H${j}_OC${k}">${currentPatientObject.patientID}</td> </tr>`;
          }  //SLot is TAKEN/UNAVAILABLE
          else {  
            core += `<td class="${weekdaysShort[i]} slotTaken ${greyedOutString}" id="D${i}_H${j}_OC${k}"> ${slotsTakenArray[weekNr][6*i + 42*j +k]}</td> </tr>`;
          }  
        } 
        else { //Not end of row, so no </tr> needed)
          //Slot is AVAILABLE
          if(slotsTakenArray[weekNr][6*i + 42*j+k] === false) {
            core += `<td class="${weekdaysShort[i]} ${greyedOutString}" id="D${i}_H${j}_OC${k}"></td>`;
          } //Slot is CURRENTLY SELECTED   
          else if( slotsTakenArray[weekNr][6*i + 42*j +k].length === 12) {
            core += `<td class="${weekdaysShort[i]} slotsCurrent ${greyedOutString}" id="D${i}_H${j}_OC${k}">${currentPatientObject.patientID}</td>`;
          } //Slot is TAKEN/UNAVAILABLE
          else {  
            core += `<td class="${weekdaysShort[i]} slotTaken ${greyedOutString}" id="D${i}_H${j}_OC${k}"> ${slotsTakenArray[weekNr][6*i + 42*j +k]}</td>`; 
          }
        }
      }    
    }
  
    //GREYEDOUT LOGIC FOR PAST DATES
    for(let i=0; i<7; i++)
    {
      let day = weekdaysShort[i];
      // in the current week
      if( currentWeek == weekNr)
      {   
        if(i > todayNr)
        {
          document.querySelectorAll("th." + day ).forEach(div =>{
        
            div.classList.remove("greyedOutHeader");
            
          });
        }
        else if (i == todayNr)
        {
          document.querySelectorAll("th." + day).forEach(div =>{
            div.classList.remove("greyedOutHeader");
            div.classList.add("greyedOutHeaderToday");
          });
        }
        else
        {
          document.querySelectorAll("th." + day ).forEach(div =>{
            if(div.classList[1] != "greyedOutHeader")
            {
              div.classList.add("greyedOutHeader");
            }

          });
        }     
      }
      //in the past
      else if (weekNr < currentWeek)
      {
        document.querySelectorAll("th." + day ).forEach(div =>{
          if(div.classList[1] != "greyedOutHeader")
          {
            div.classList.remove("greyedOutHeaderToday");
            div.classList.add("greyedOutHeader");
          }
          
        });
      }
      //in the future
      else
      {
        document.querySelectorAll("th." + day ).forEach(div =>{
          
          div.classList.remove("greyedOutHeader");
          div.classList.remove("greyedOutHeaderToday");
          
        });    
      }
    }   
  }

  //WRITE AGENDA BODY TO HTML
  tableCore.innerHTML = core;

  //DISPLAY WEEK NR
  document.getElementById('weekNr').innerHTML= "week " + (weekNr+1);

  addEventlistenerSlots()
  
  
}

function checkWeek() { 
  if ( currentWeek == weekNr){
    return  "greyedOutSlot";
  } else {
    return "";
  } 
}
function checkDay(i, greyedOutString)
{
  if(i >  todayNr ) {
    return "";
  } 
  else if (i == todayNr) {
    return greyedOutString + "Today";
  } 
  else {
    return greyedOutString;
  }
}



//CHANGE WEEK - EVENTLISTENERS (previous + next)
document.querySelector(".prev").addEventListener("click", () => {
  if(weekNr > 0) {
    weekNr -= 1;
    renderAgenda();
  } else { console.log("Can't move further back than week 1!");}
});

document.querySelector(".next").addEventListener("click", () => {
  weekNr += 1;
  if(weekNr+1 > slotsTakenArray.length){
    addWeekToArray();
  }
  renderAgenda();
});

function addWeekToArray() {
  //2D ARRAY. GENERATE WEEK ARRAY INSIDE MAIN ARRAY.
  slotsTakenArray.push([]);

  //FILL WEEK SLOTS WITH FALSE (available)
  for (let i=0; i<=839; i++){    
    slotsTakenArray[weekNr].push(false);
  } 
}


function addSelectedSlot() {
  
  if(IdSelectedSlot === -1) { alert("Must select a time slot!"); return; }

  const tableBody = document.getElementById('patientTableScheduler');
  
  
  // check the scenario (onco or chemo) that has been done and change the nr of times still needed
  if(scenario == "onco"){
    tableBody.rows[1].cells[5].innerHTML -=1;
    
  } else if(scenario == "chemo"){
    tableBody.rows[1].cells[7].innerHTML -=1
    
  } else{
    
  }

 
  currentPatientObject.weekNrFirstSelectedSlot = weekNrFirstSelectedSlot;
  Patient.list[currentPatientObject.patientID].weekNrFirstSelectedSlot = weekNrFirstSelectedSlot;
  
 
  //NEW PATIENT?
  if(tableBody.rows[1].cells[7].innerHTML == 0) {
    addSelectVar = checkPatientsPerDay();
    

    //LAST PATIENT 1x TIME PROCESS / NEW PATIENT PROCESSING
    if(addSelectVar <= 1) {
      yellow();
      red();
      let currentPatientId = tableBody.rows[1].cells[0].innerHTML;  //Id equals amount of patients already passed by to schedule.
      currentPatientObject = Patient.list[currentPatientId];
      

    }
    else if (addSelectVar === 3)
    {
      yellow();
      red();

      let todaySlot;
      
      //fill todayPatientsarray 
      for(let j=0; j<20; j++) 
      {
        for (let k=0; k<6; k++) 
        {
          todaySlot = slotsTakenArray[currentWeek][6*todayNr +42*j +k]
          if (todaySlot !== false)
          {
            //onco's blood can't fail
            if (Patient.list[todaySlot].chemo > 0)
            {
              todayPatientsArray.push(todaySlot);
            }
          }
        }
      }
      // only keep the unique patients in the array
      todayPatientsArray = todayPatientsArray.filter(onlyUnique);
      
      testBloodPatients();
      
      // a will be 4 if there are patients where bloodtest failed

      addSelectVar = checkPatientsPerDay();

      let currentPatientId = tableBody.rows[1].cells[0].innerHTML;  //Id equals amount of patients already passed by to schedule.
      currentPatientObject = Patient.list[currentPatientId];
    }
    else if (addSelectVar === 2){ //addSelectVar ==2 
      alert("You already scheduled this last patient. Game ended."); 
    }

    if (addSelectVar === 4)
    {
    
      id = todayPatientsArray[0];
      currentPatientObject = Patient.list[id];
      tableBody.rows[1].cells[0].innerHTML = currentPatientObject.patientID;
      tableBody.rows[1].cells[1].innerHTML = currentPatientObject.firstName;
      tableBody.rows[1].cells[2].innerHTML = currentPatientObject.lastName;
      tableBody.rows[1].cells[3].innerHTML = currentPatientObject.availability;
      tableBody.rows[1].cells[4].innerHTML = currentPatientObject.onco;
      if (currentPatientObject.onco>0)
      {
        tableBody.rows[1].cells[5].innerHTML = 1;
      }
      tableBody.rows[1].cells[6].innerHTML = Patient.list[id].chemo;
      if (currentPatientObject.chemo>0)
      {
        tableBody.rows[1].cells[7].innerHTML = 1;
      }
      tableBody.rows[1].cells[8].innerHTML = currentPatientObject.chemoLength;
      
      
        

        setTimeout(function() {
          alert('Patient with ID: ' + currentPatientObject.patientID + ' failed their bloodtest!');
        },15)

      
      todayPatientsArray.splice(0, 1);
      
      currentPatientObject.weekNrFirstSelectedSlot += 1;
      
      
      // Maybe don't use global variable but use currentPatientObject.
  
    }
    
    
  }
  //NOT NEW PATIENT?
  else {
    yellow();
  }
  
  IdSelectedSlot = -1;
}

//checks if the currentPatient is the last patient of the day and if so go to the next day (make the current day grey)
function checkPatientsPerDay() {

  if(todayPatientsArray.length > 0)
  { 
    return 4;
  }
  
  else if(Patient.list[tableBody.rows[1].cells[0].innerHTML].lastPatientBool == true && addSelectVar != 3 && addSelectVar != 4)
  {
    //Go to the next day or if at the end of the week and the next week
    if(todayNr < 6) {
      todayNr += 1;
    } else {
      todayNr = 0;
      currentWeek += 1;
    }
    let today = weekdaysShort[todayNr];
    let yesterday = weekdaysShort[todayNr-1];

    // Only show immediatly if de currentweek is also the week that is displayed in the agenda
    if(weekNr == currentWeek) {
      document.querySelectorAll("td." + today).forEach(div =>{
        div.classList.add("greyedOutSlotToday");
      });
  
      document.querySelectorAll("th." + today ).forEach(div =>{
        div.classList.add("greyedOutHeaderToday"); 
      });

      document.querySelectorAll("td." + yesterday).forEach(div =>{
        div.classList.remove("greyedOutSlotToday");
        div.classList.add("greyedOutSlot");
      });
      
      document.querySelectorAll("th." + yesterday ).forEach(div =>{
        div.classList.remove("greyedOutHeaderToday");
        div.classList.add("greyedOutHeader");
      });
    } 
    return 3;    
  }
  else{
    return nextPatientEvent();
  }
}

//returns array of patients where bloodtest failed
function testBloodPatients()
{
  for( var i = 0; i < todayPatientsArray.length; i++){ 
       
    // check and remove patient if bloodtest does not fail
    let probBloodFail = Patient.list[todayPatientsArray[i]].probBloodFail;
    if ( probBloodFail < 0){     
        //change propability that bloodtest fails next time
        let num = getRandomFloat(0.3,0.9).toFixed(3);   
        Patient.list[todayPatientsArray[i]].probBloodFail = num;    
        todayPatientsArray.splice(i, 1); 
        i--; 
    }
    else{

      //change propability that bloodtest fails next time
      Patient.list[todayPatientsArray[i]].probBloodFail = getRandomFloat(0.3,0.9).toFixed(3);   
    }  
  }
}


//checks for duplicates. === gives true if equal value and equal type
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}


function yellow() {
  //SAVE SLOTS from slotsToAddArray
  slotsToAddArray.forEach(function(slotId) {
    slotNr = getSlotNrFromId(slotId)[3];
    slotsTakenArray[weekNr][slotNr] = "slotsCurrent";
    slotsCurrentArray.push([weekNr,slotId]); //Bijhouden alle slots (id) van huidige patiënt die volledig ingepland wordt
    document.getElementById(slotId).innerHTML = currentPatientObject.patientID;
  });
  slotsToAddArray = [];
}

function red() {
  slotsCurrentArray.forEach(function([week,slotId]) {
    slotNr = getSlotNrFromId(slotId)[3];
    slotsTakenArray[week][slotNr] = currentPatientObject.patientID;
    if(week === weekNr) {
      document.getElementById(slotId).classList.remove("slotsCurrent");
      document.getElementById(slotId).classList.add("slotTaken");
    }    
  });
  slotsCurrentArray = [];
}
//TOOOOOOOOO DOOOOOOOOOOO => end game verbeteren (lastPatient++ van genPAtient + algemene meldingen, statistieken etc)


function addEventlistenerSlots() 
{
  document.querySelectorAll("#agendaBody > tr > td:not(.greyedOutSlotToday):not(.greyedOutSlot)").forEach
  ( slot => {
    slot.addEventListener("click", event => {
      //Need to lookup slotId again, because IdSelectedSlot becomes -1 after clicking "next".
      let dayNr; let hourSlot; let oncoChemoNr; let slotNr;
      let slotId = event.currentTarget.id;                 
      [dayNr, hourSlot, oncoChemoNr, slotNr] = getSlotNrFromId(slotId.toString());
      const tableBody = document.getElementById('patientTableScheduler');
      
      let avDay = currentPatientObject.availability;
      
      let nrOncoAppointments = currentPatientObject.onco;
      let nrChemoAppointments = currentPatientObject.chemo;
      let cLength = currentPatientObject.chemoLength;
      
      weekNrFirstSelectedSlot = currentPatientObject.weekNrFirstSelectedSlot;

      if(slotsTakenArray[weekNr][slotNr] == false)
      {
        document.getElementById("box2Right").style.display = "none";

        //PATIENT NOT AVAILABLE
        if(weekdays[dayNr] != avDay) { alert("Patient is not available this weekday.") }

        //PATIENT AVAILABLE
        else {
          //ONLY ONCO APPOINTMENT (2 slots)
          if(nrOncoAppointments >= 1 && nrChemoAppointments == 0) {

            scenario = "onco";
            //Bijhouden dat 2 slots moeten weggeschreven worden bij klikken next (en dus niet 1)
            lengthSelectedSlot = 2;

            //CHEMO SELECTED (ONCO NEEDED)
            if(oncoChemoNr > 1) { window.alert('The patient needs to be alloted an onco slot!'); }
            //ONCO SELECTED (ONCO NEEDED) (oncoChemoNr <= 1)
            else {
              //2 SLOTS AVAILABLE?
              if (checkSlotsAvailable(slotNr)) {
                //2 SLOTS AANDUIDEN
                weekNrFirstSelectedSlot = weekNr;
                updateSlotsSelected(event);
              }
            } 
          }

          //ONLY CHEMO APPOINTMENTS
          //Schedule chemo without bloodtests in advance
          else if(nrOncoAppointments == 0 && nrChemoAppointments >= 2) {
            //Bijhouden dat 2 slots moeten weggeschreven worden bij klikken next (en dus niet 1)
            scenario = "chemo";
            lengthSelectedSlot = cLength;

            //ONCO SELECTED (CHEMO NEEDED)
            if(oncoChemoNr <= 1) { window.alert('The patient needs to be alloted a chemo slot!'); }
            //CHEMO SELECTED (CHEMO NEEDED)
            else {
              //1e CHEMO a/h inplannen
              if(weekNrFirstSelectedSlot == -1) {
                //SLOT(S) AVAILABLE?
                if(checkSlotsAvailable(slotNr) == 1) {
                  //SLOT(S) AANDUIDEN
                  weekNrFirstSelectedSlot = weekNr;
                  updateSlotsSelected(event);
                }
              }
              else { // 2e tot Xe chemo inplannen (weekNrFirstSelectedSlot != -1)
                let amountAlreadyPlanned = nrChemoAppointments - tableBody.rows[1].cells[7].innerHTML;
                if((weekNrFirstSelectedSlot +  amountAlreadyPlanned) != weekNr) {
                  alert("You are scheduling the next chemo appointment in the wrong week!");
                }
                else {
                  //SLOT(S) AVAILABLE?
                  if(checkSlotsAvailable(slotNr) == 1) {
                    //SLOT(S) AANDUIDEN
                    updateSlotsSelected(event);
                  }
                }
              }
            }
          }
          //O&C APPOINTMENTS
          //Schedule chemo WITH bloodtests in advance
          else if(nrOncoAppointments >= 1 && nrChemoAppointments >= 2) {
            
            //SCHEDULE ONCO
            if(tableBody.rows[1].cells[5].innerHTML == tableBody.rows[1].cells[7].innerHTML) {
              lengthSelectedSlot = 1;
              scenario = "onco";
              //CHEMO SELECTED (ONCO NEEDED)
              if(oncoChemoNr > 1) { window.alert('The patient needs to be alloted an onco slot!'); }
              //ONCO SELECTED (ONCO NEEDED) (oncoChemoNr <= 1)
              else {
                oncoSlotOC = slotNr;
                //1st time O&C
                if(weekNrFirstSelectedSlot == -1) {
                  //SLOT(S) AVAILABLE?
                  if(checkSlotsAvailable(slotNr) == 1) {
                    //SLOT(S) AANDUIDEN
                    weekNrFirstSelectedSlot = weekNr;
                    updateSlotsSelected(event);
                  }
                }
                else { //2nd or more appointment of O&C periodicity
                  let amountAlreadyPlanned = nrOncoAppointments - tableBody.rows[1].cells[5].innerHTML;
                  if((weekNrFirstSelectedSlot +  amountAlreadyPlanned) != weekNr) {
                    alert("You are scheduling the next onco appointment in the wrong week!");
                  }
                  else {
                    //SLOT(S) AVAILABLE?
                    if(checkSlotsAvailable(slotNr) == 1) {
                      //SLOT(S) AANDUIDEN
                      updateSlotsSelected(event);
                    }
                  }
                }
              }
            }
            //SCHEDULE CHEMO
            else if(tableBody.rows[1].cells[5].innerHTML == tableBody.rows[1].cells[7].innerHTML - 1) {
              scenario = "chemo";
              lengthSelectedSlot = cLength;
              //ONCO SELECTED (CHEMO NEEDED)
              if(oncoChemoNr <= 1) { window.alert('The patient needs to be alloted a chemo slot!'); }
              // CHEMO SELECTED (CHEMO NEEDED)
              else {
                let amountAlreadyPlanned = nrChemoAppointments - tableBody.rows[1].cells[7].innerHTML;
                //WRONG WEEK
                if((weekNrFirstSelectedSlot + amountAlreadyPlanned) != weekNr) {
                  alert("You are scheduling the next chemo appointment in the wrong week!");
                }
                //CORRECT WEEK
                else {
                  //SLOT(S) AVAILABLE?
                  if(checkSlotsAvailable(slotNr) == 1) {
                    //MINIMUM 4 BLOCKS AFTER ONCO?
                    if(slotNr >= oncoSlotOC+5*42  ) {
                      //SLOT(S) AANDUIDEN
                      updateSlotsSelected(event);
                    }
                    else {window.alert("There must be at least 2 hours of time between the onco & chemo appointment.");}
                  }
                }
                oncoSlotOC = -1;
              }
            }
            else { console.log("Not planning onco, nor planning chemo, inside the O&C appointment eventListener. CODE PROBLEM."); }
          }

          else {console.log("Both nrOncoAppointments & nrChemoAppointments are zero. Not possible! CODE PROBLEM!!");}
        }
      }
      else if(slotsTakenArray[weekNr][slotNr].length === 12) {
        //----------SHOW CURRENT PATIENT INFO--------------//
        const tableRight = document.getElementById('patientTableSlotinfo');
        tableRight.rows[1].cells[0].innerHTML = currentPatientObject.patientID;
        tableRight.rows[1].cells[1].innerHTML = currentPatientObject.firstName;
        tableRight.rows[1].cells[2].innerHTML = currentPatientObject.lastName;
        tableRight.rows[1].cells[3].innerHTML = currentPatientObject.availability;
        tableRight.rows[1].cells[4].innerHTML = currentPatientObject.onco;
        tableRight.rows[1].cells[5].innerHTML = currentPatientObject.chemo;
        tableRight.rows[1].cells[6].innerHTML = currentPatientObject.chemoLength;
      
        document.getElementById("box2Right").style.display = "flex";
      }
      else {
        //----------SHOW SLOT PATIENT INFO--------------//
        const tableRight = document.getElementById('patientTableSlotinfo');
        let patientObj = Patient.list[slotsTakenArray[weekNr][slotNr]];     //let toegevoegd!
        tableRight.rows[1].cells[0].innerHTML = patientObj.patientID;
        tableRight.rows[1].cells[1].innerHTML = patientObj.firstName;
        tableRight.rows[1].cells[2].innerHTML = patientObj.lastName;
        tableRight.rows[1].cells[3].innerHTML = patientObj.availability;
        tableRight.rows[1].cells[4].innerHTML = patientObj.onco;
        tableRight.rows[1].cells[5].innerHTML = patientObj.chemo;
        tableRight.rows[1].cells[6].innerHTML = patientObj.chemoLength;
      
        document.getElementById("box2Right").style.display = "flex";
      }
    });  
  });
}

//CHECK AVAILABIlITY (ARRAY CHECK)
function checkSlotsAvailable(slotNr) {
  let slotsAvailableBool = 1;

  for(let range = lengthSelectedSlot; range > 0; range--) {
    //De duur (verschillende vakjes) aanspreken (1 per doorlopen for loop)
    let tempSlotNr = slotNr + (range-1)*42;

    if(tempSlotNr > 839) { 
      alert("Appointment would fall outside working hours!");
      slotsAvailableBool = 0;
      break;
    }
    else if(slotsTakenArray[weekNr][tempSlotNr] != false) {
      window.alert("Selection of slot(s) not available. Remember the range of slots you need is " + lengthSelectedSlot);
      slotsAvailableBool = 0;
      break;
    }
    else { /*slotsAvailableBool = 1;*/ }
  }

  return slotsAvailableBool; 
}

//MARK SELECTED SLOTRANGE (CSS UPDATE)
function updateSlotsSelected(event) {
/*All slots are available (due to checkSlotsAvailable() !!  Just need to check current selection (orange). */
// 0) Niets ervoor aangeduid => PRINT
// 1) Ergens anders => VERWIJDER => PRINT
// 2) Overlapt      => VERWIJDER => PRINT
// 3) identiek hetzelfde  => NIETS

  //No previously selected slotrange
  if(IdSelectedSlot == -1) {
    IdSelectedSlot = event.currentTarget.id;
    printNewRange();
  }

  //(Exact) SAME RANGE CLICKED => REMOVE selection
  else if(IdSelectedSlot == event.currentTarget.id) {
    removeOldRange();
    IdSelectedSlot = -1;
  }

  //There is a current selected slotrange
  else {
    removeOldRange();
    IdSelectedSlot = event.currentTarget.id;
    printNewRange();
  }
}


function removeOldRange() {
  let tempSlotNr = ""; let tempSlotId = "";
  let NrSelectedSlot = getSlotNrFromId(IdSelectedSlot.toString())[3];

  for(let range = lengthSelectedSlot; range > 0; range--) {
    tempSlotNr = NrSelectedSlot + (range-1)*42;
    tempSlotId = getSlotIdFromNr(tempSlotNr);
    document.getElementById(tempSlotId).classList.remove("slotsCurrent");
  }
  slotsToAddArray = [];
}

function printNewRange() {
  let tempSlotNr = ""; let tempSlotId = "";
  
  for(let range = lengthSelectedSlot; range > 0; range--) {
    tempSlotNr = getSlotNrFromId(IdSelectedSlot.toString())[3] + (range-1)*42;
    tempSlotId = getSlotIdFromNr(tempSlotNr);
    slotsToAddArray.push(tempSlotId); //add ids to array that have to be added to slotstakenArray after pressing next
    document.getElementById(tempSlotId).classList.add("slotsCurrent");
  }
}

function resetPatient() {
  slotsCurrentArray.forEach(function([week,slotId]) {
    let tempSlotNr = getSlotNrFromId(slotId)[3];
    //RESET SLOTSTAKENARRAY (no slotsCurrent)
    slotsTakenArray[week][tempSlotNr] = false;
    //UPDATE CSS current week
    if(week === weekNr) {
      document.getElementById(slotId).classList.remove("slotsCurrent");
      document.getElementById(slotId).innerHTML = "";
    } 
  });
    slotsToAddArray.forEach(function(slotId) {
      document.getElementById(slotId).classList.remove("slotsCurrent");
  });
  
  //RESET VARIABLES
  IdSelectedSlot = -1;  //Indicate whether currenly a slot is selected.
  currentPatientObject.weekNrFirstSelectedSlot = -1;
  Patient.list[currentPatientObject.patientID].weekNrFirstSelectedSlot = -1;
  slotsCurrentArray = [];   //Alle gereserveerde slots patient die huidig ingepland wordt (yellow)
  slotsToAddArray = [];     //Huidige selectie eventListener
  weekNrFirstSelectedSlotTemp = -1;
  //oncoSlotOC = -1;
  //lengthSelectedSlot = -1;
  //scenario = ""; 

  //Reset HTML used for counting scheduled moments
  const tableLeft = document.getElementById('patientTableScheduler');
  tableLeft.rows[1].cells[5].innerHTML = tableLeft.rows[1].cells[4].innerHTML
  tableLeft.rows[1].cells[7].innerHTML = tableLeft.rows[1].cells[6].innerHTML
}

function skipPatient() {
  resetPatient();

  addSelectVar = checkPatientsPerDay();

  if (addSelectVar == 3)
  {
    addSelectVar = nextPatientEvent();
  }
  //NOT LAST PATIENT
  if(addSelectVar != 2) {
    skippedPatientsCounter += 1;

    //SAVE NEW PATIENT TO CURRENTPATIENTOBJECT
    let currentPatientId = tableBody.rows[1].cells[0].innerHTML;  //Id equals amount of patients already passed by to schedule.
    currentPatientObject = Patient.list[currentPatientId];

    IdSelectedSlot = -1;
    
  }
  else { //addSelectVar  >= 1 
    alert("Last patient was reached. Game ended."); 
  }
  console.log("Atm " + skippedPatientsCounter + " patients are skipped and hence, not scheduled.");
}

//Check day, row (hourslot) and slot based on id (Dx_Hy_OCz)
function getSlotNrFromId(slotId) {
  let strArray = slotId.split("_");
  let dayStr = strArray[0];
  let hourSlotStr = strArray[1];
  let oncoChemoStr = strArray[2];
  let dayNr = parseInt(dayStr.split("D")[1],10);
  let hourSlot = parseInt(hourSlotStr.split("H")[1],10);
  let oncoChemoNr = parseInt(oncoChemoStr.split("OC")[1],10);
  let slotNr = 6*dayNr + 42*hourSlot  + oncoChemoNr;
  return [dayNr, hourSlot, oncoChemoNr, slotNr];
}

function getSlotIdFromNr(slotNummer) {
  let day = 0;
  let hour = 0;
  let oncoChemo = 0;

  if(slotNummer != 0) {
    //Get decimals from float
    let temp = (((slotNummer/42) % 1).toFixed(2));

    //DETERMINE DAY
    if(temp < 0.13) { day = 0;}
    else if(temp < 0.28) { day = 1;}
    else if(temp < 0.42) { day = 2;}
    else if(temp < 0.57) { day = 3;}
    else if(temp < 0.71) { day = 4;}
    else if(temp < 0.86) { day = 5;}
    else { day = 6;}

    //DETERMINE HOURSLOT
    hour = Math.floor(slotNummer/42);
    oncoChemo = slotNummer - 6*day - 42*hour;
  }
  let id = "D" + day +"_" + "H" + hour +"_" + "OC" + oncoChemo;
  return id;
}

//GENERATE 1ST WEEK ARRAY
addWeekToArray();

//RENDER AGENDA 1ST TIME
renderAgenda();

// with this we can acces patient.list
Patient.loadAll();

//Initialise current patient object
currentPatientObject = Patient.list[0];
console.log(currentPatientObject = Patient.list[0]);

