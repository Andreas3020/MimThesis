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
let lengthSelectedSlot = -1;      //Length
let weekNrFirstSelectedSlot = -1; //Periodiciteit
let oncoSlotOC = -1;
let slotsTakenArray = [];


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
          if(slotsTakenArray[weekNr][6*i + 42*j +k] == false) {
            core += `<td class="${weekdaysShort[i]} ${greyedOutString}" id="D${i}_H${j}_OC${k}"></td> </tr>`;
          } //Slot is TAKEN/UNAVAILABLE
          else {  
            core += `<td class="${weekdaysShort[i]} slotTaken ${greyedOutString}" id="D${i}_H${j}_OC${k}"> ${slotsTakenArray[weekNr][6*i + 42*j +k].patientID}</td> </tr>`;
          }     
        } 
        else { //Not end of row, so no </tr> needed)
          //Slot is AVAILABLE
          if(slotsTakenArray[weekNr][6*i + 42*j+k] == false) {
            core += `<td class="${weekdaysShort[i]} ${greyedOutString}" id="D${i}_H${j}_OC${k}"></td>`;
          } //Slot is TAKEN/UNAVAILABLE
          else {  
            core += `<td class="${weekdaysShort[i]} slotTaken ${greyedOutString}" id="D${i}_H${j}_OC${k}"> ${slotsTakenArray[weekNr][6*i + 42*j +k].patientID}</td>`; 
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

//checks if the currentPatient is the last patient of the day and if so go to the next day (make the current day grey)
function checkPatientsPerDay()
{
  if(Patient.list[tableBody.rows[1].cells[0].innerHTML].lastPatientBool == true)
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
  }
}


//CHANGE WEEK - EVENTLISTENERS (previous + next)
document.querySelector(".prev").addEventListener("click", () => {
  if(weekNr > 0) {
    weekNr -= 1;
    renderAgenda();
  } //else {console.log("Can't move further back than week 1!");"}
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
  const tableBody = document.getElementById('patientTableScheduler');
  let currentPatientId = tableBody.rows[1].cells[0].innerHTML;  //Id equals amount of patients already passed by to schedule.
  let currentPatientObject = Patient.list[currentPatientId];
  let nrOncoAppointments = currentPatientObject.onco;
  let nrChemoAppointments = currentPatientObject.chemo;
  let oncoToPlan = tableBody.rows[1].cells[5].innerHTML;
  let chemoToPlan = tableBody.rows[1].cells[7].innerHTML;
  let NrSelectedSlot = getSlotNrFromId(IdSelectedSlot.toString())[3];

  //ONLY ONCO APPOINTMENT (2 slots)
  if(nrOncoAppointments >= 1 && nrChemoAppointments == 0) {
    let a = nextPatientEvent();
    //let NrSelectedSlot = getSlotNrFromId(IdSelectedSlot.toString())[3];

    //Indien laatste patient => a = 1 => laatste keer reservatie wegschrijven. Zelfde persoon terugweergeven??
    if(a <= 1) {
      for(let range = lengthSelectedSlot; range > 0; range--) {
        let tempSlotNr = NrSelectedSlot + (range-1)*42;
        let tempSlotId = getSlotIdFromNr(tempSlotNr);
        document.getElementById(tempSlotId).innerHTML = currentPatientObject.patientID;
        slotsTakenArray[weekNr][tempSlotNr] = currentPatientObject;
      }
      IdSelectedSlot = -1;
      lengthSelectedSlot = -1;
    }
  }

  //ONLY CHEMO APPOINTMENTS (No bloodtest to schedule)
  else if(nrOncoAppointments == 0 && nrChemoAppointments >= 2) {

    /*Need to know which week first appointment for periodic appointments was scheduled.
    in order to determine whether correct week selected.
    See eventListener 'else{}' for scheduling 2nd up to Xth chemo.*/
    if(weekNrFirstSelectedSlot == -1) { weekNrFirstSelectedSlot = weekNr; }

    //let NrSelectedSlot = getSlotNrFromId(IdSelectedSlot.toString())[3];
    let amountAlreadyPlanned = nrChemoAppointments - tableBody.rows[1].cells[7].innerHTML;
    let weekNrAppointment = weekNrFirstSelectedSlot + amountAlreadyPlanned;

    //LAST CHEMO TO PLAN
    if(chemoToPlan == 1) {
      let a = nextPatientEvent();

      //Laatste patient? => a = 1 => laatste keer reservatie wegschrijven. 
      //Zelfde persoon terugweergeven?? Geen persoon meer weergeven?
      if(a <= 1) {
        for(let range = lengthSelectedSlot; range > 0; range--) {
          let tempSlotNr = NrSelectedSlot + (range-1)*42;
          let tempSlotId = getSlotIdFromNr(tempSlotNr);
          document.getElementById(tempSlotId).innerHTML = currentPatientObject.patientID;
          slotsTakenArray[weekNrAppointment][tempSlotNr] = currentPatientObject;
        }
        IdSelectedSlot = -1;
        lengthSelectedSlot = -1;
        weekNrFirstSelectedSlot = -1;
      }
    }

    //NOT LAST CHEMO SESSION TO PLAN.
    else {
      for(let range = lengthSelectedSlot; range > 0; range--) {
        let tempSlotNr = NrSelectedSlot + (range-1)*42;
        let tempSlotId = getSlotIdFromNr(tempSlotNr);
        document.getElementById(tempSlotId).innerHTML = currentPatientObject.patientID;
        slotsTakenArray[weekNrAppointment][tempSlotNr] = currentPatientObject;
      }
      IdSelectedSlot = -1;
      tableBody.rows[1].cells[7].innerHTML = chemoToPlan - 1;
    }
  }


  //O&C APPOINTMENTS (Bloodtest to schedule)
  else if(nrOncoAppointments >= 1 && nrChemoAppointments >= 2) {

    if(weekNrFirstSelectedSlot == -1) { weekNrFirstSelectedSlot = weekNr; }

    //SCHEDULE ONCO
    if(tableBody.rows[1].cells[5].innerHTML == tableBody.rows[1].cells[7].innerHTML) {
      document.getElementById(IdSelectedSlot).innerHTML = currentPatientObject.patientID;
      slotsTakenArray[weekNr][NrSelectedSlot] = currentPatientObject;      
      IdSelectedSlot = -1;
      lengthSelectedSlot = -1;
      oncoSlotOC = NrSelectedSlot;
      tableBody.rows[1].cells[5].innerHTML = chemoToPlan - 1;
    }
    //SCHEDULE CHEMO
    else if(tableBody.rows[1].cells[5].innerHTML == tableBody.rows[1].cells[7].innerHTML - 1) {

      let amountAlreadyPlanned = nrChemoAppointments - tableBody.rows[1].cells[7].innerHTML;
      let weekNrAppointment = weekNrFirstSelectedSlot + amountAlreadyPlanned;

      //LAST CHEMO TO PLAN
      if(chemoToPlan == 1) {
        let a = nextPatientEvent();
        //Last patient? Save one last time (a = 1)
        if(a <= 1) {
          for(let range = lengthSelectedSlot; range > 0; range--) {
            let tempSlotNr = NrSelectedSlot + (range-1)*42;
            let tempSlotId = getSlotIdFromNr(tempSlotNr);
            document.getElementById(tempSlotId).innerHTML = currentPatientObject.patientID;
            slotsTakenArray[weekNrAppointment][tempSlotNr] = currentPatientObject;
          }
          IdSelectedSlot = -1;
          lengthSelectedSlot = -1;
          weekNrFirstSelectedSlot = -1;
          oncoSlotOC = -1;
        }
      }
      //NOT LAST CHEMO OF O&C TO PLAN
      else {
        for(let range = lengthSelectedSlot; range > 0; range--) {
          let tempSlotNr = NrSelectedSlot + (range-1)*42;
          let tempSlotId = getSlotIdFromNr(tempSlotNr);
          document.getElementById(tempSlotId).innerHTML = currentPatientObject.patientID;
          slotsTakenArray[weekNrAppointment][tempSlotNr] = currentPatientObject;
        }
        IdSelectedSlot = -1;
        lengthSelectedSlot = -1;
        oncoSlotOC = -1;
        tableBody.rows[1].cells[7].innerHTML = chemoToPlan - 1;
      }
    }
    //NOR CHEMO NOR ONCO. PROBLEM.
    else { console.log("Not planning onco, nor planning chemo, inside the O&C appointment eventListener. CODE PROBLEM."); }
  }
  
  checkPatientsPerDay()
}

function addEventlistenerSlots() 
{
  document.querySelectorAll("#agendaBody > tr > td:not(.greyedOutSlotToday):not(.greyedOutSlot)").forEach
  ( slot => {
    slot.addEventListener("click", event => {
      
      //Need to lookup slotId again, because IdSelectedSlot becomes -1 after clicking "next".
      let dayNr; let hourSlot; let oncoChemoNr; let slotNr;
      let slotId = event.currentTarget.id;                 
      [dayNr, hourSlot, oncoChemoNr, slotNr] = getSlotNrFromId(slotId.toString());
      //slotId & slotNr are the clicked slot!!


      const tableBody = document.getElementById('patientTableScheduler');
      let currentPatientId = tableBody.rows[1].cells[0].innerHTML;
      let currentPatientObject = Patient.list[currentPatientId];
      let avDay = currentPatientObject.availability;
      let nrOncoAppointments = currentPatientObject.onco;
      let nrChemoAppointments = currentPatientObject.chemo;
      let cLength = currentPatientObject.chemoLength;


      //PATIENT NOT AVAILABLE
      if(weekdays[dayNr] != avDay) { alert("Patient is not available this weekday.") }

      //PATIENT AVAILABLE
      else {
        //ONLY ONCO APPOINTMENT (2 slots)
        if(nrOncoAppointments >= 1 && nrChemoAppointments == 0) {
          //Bijhouden dat 2 slots moeten weggeschreven worden bij klikken next (en dus niet 1)
          lengthSelectedSlot = 2;

          //CHEMO SELECTED (ONCO NEEDED)
          if(oncoChemoNr > 1) { window.alert('The patient needs to be alloted an onco slot!'); }
          //ONCO SELECTED (ONCO NEEDED) (oncoChemoNr <= 1)
          else {
            //2 SLOTS AVAILABLE?
            if (checkSlotsAvailable(slotNr)) {
              //2 SLOTS AANDUIDEN
              updateSlotsSelected(event, slotNr);
            }
          } 
        }

        //ONLY CHEMO APPOINTMENTS
        //Schedule chemo without bloodtests in advance
        else if(nrOncoAppointments == 0 && nrChemoAppointments >= 2) {
          //Bijhouden dat 2 slots moeten weggeschreven worden bij klikken next (en dus niet 1)
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
                updateSlotsSelected(event, slotNr);
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
                  updateSlotsSelected(event, slotNr);
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
            //CHEMO SELECTED (ONCO NEEDED)
            if(oncoChemoNr > 1) { window.alert('The patient needs to be alloted an onco slot!'); }
            //ONCO SELECTED (ONCO NEEDED) (oncoChemoNr <= 1)
            else {
              //1st time O&C
              if(weekNrFirstSelectedSlot == -1) {
                //SLOT(S) AVAILABLE?
                if(checkSlotsAvailable(slotNr) == 1) {
                  //SLOT(S) AANDUIDEN
                  updateSlotsSelected(event, slotNr);
                  oncoSlotOC = slotNr;
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
                    updateSlotsSelected(event, slotNr);
                  }
                }
              }
            }
          }
          //SCHEDULE CHEMO
          else if(tableBody.rows[1].cells[5].innerHTML == tableBody.rows[1].cells[7].innerHTML - 1) {
            lengthSelectedSlot = cLength;
            //ONCO SELECTED (CHEMO NEEDED)
            if(oncoChemoNr <= 1) { window.alert('The patient needs to be alloted a chemo slot!'); }
            // CHEMO SELECTED (CHEMO NEEDED)
            else {
              let amountAlreadyPlanned = nrChemoAppointments - tableBody.rows[1].cells[7].innerHTML;
              //WRONG WEEK
              if((weekNrFirstSelectedSlot + amountAlreadyPlanned) != weekNr) {
                alert("You are scheduling the next onco appointment in the wrong week!");
              }
              //CORRECT WEEK
              else {
                //SLOT(S) AVAILABLE?
                if(checkSlotsAvailable(slotNr) == 1) {
                  //MINIMUM 4 BLOCKS AFTER ONCO?
                  if(slotNr >= oncoSlotOC+5*42  ) {
                    //SLOT(S) AANDUIDEN
                    updateSlotsSelected(event, slotNr);
                  }
                  else {window.alert("There must be at least 2 hours of time between the onco & chemo appointment.");}
                }
              }
            }
          }
          else { console.log("Not planning onco, nor planning chemo, inside the O&C appointment eventListener. CODE PROBLEM."); }
        }

        else {console.log("Both nrOncoAppointments & nrChemoAppointments are zero. Not possible! CODE PROBLEM!!");}
      }


      //----------SHOW PATIENT INFO--------------//
      if(slotsTakenArray[weekNr][slotNr] != false) {
        const tableRight = document.getElementById('patientTableSlotinfo');
        let patientObj = slotsTakenArray[weekNr][slotNr];     //let toegevoegd!
        tableRight.rows[1].cells[0].innerHTML = patientObj.patientID;
        tableRight.rows[1].cells[1].innerHTML = patientObj.firstName;
        tableRight.rows[1].cells[2].innerHTML = patientObj.lastName;
        tableRight.rows[1].cells[3].innerHTML = patientObj.availability;
        tableRight.rows[1].cells[4].innerHTML = patientObj.onco;
        tableRight.rows[1].cells[5].innerHTML = patientObj.chemo;
        //tableBody.rows[1].cells[6].innerHTML = patientObj.chemoLength;
      
        document.getElementById("box2Right").style.display = "flex";
      }
      else { //slotsTakenArray[weekNr][slotNr] == false (available slot)
        document.getElementById("box2Right").style.display = "none";
      }
    });
  });
}

//RETURN AVAILABILITY.
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

//MARK SELECTED SLOT (RANGE)
function updateSlotsSelected(event, slotNr) {

  //----------CSS SLOTTAKEN (RED)--------------//
  //SLOT AVAILABLE (Not reserved & not the currently selected slot)
  if(event.currentTarget.classList[1] != "slotTaken") {

    //Remove previous selected slots (if any)
    if(IdSelectedSlot != -1) { 
      //Previously selected slot
      let NrSelectedSlot = getSlotNrFromId(IdSelectedSlot.toString())[3];
      //Remove (range) previous selected slot
      for(let range = lengthSelectedSlot; range > 0; range--) {
        let tempSlotNr = NrSelectedSlot + (range-1)*42;
        let tempSlotId = getSlotIdFromNr(tempSlotNr);
        document.getElementById(tempSlotId).classList.remove("slotTaken");
      }
    }

    //Update new selected slots (Update IdSelectSlot + CSS)
    IdSelectedSlot = event.currentTarget.id;
    for(let range = lengthSelectedSlot; range > 0; range--) {
      let tempSlotNr = slotNr + (range-1)*42;
      let tempSlotId = getSlotIdFromNr(tempSlotNr);
      document.getElementById(tempSlotId).classList.add("slotTaken");
    }
  }
  
  //CLICKED SLOT UNAVAILABLE
  else { 
    //CURRENTLY SELECTED RANGE was clicked
    if(IdSelectedSlot != -1 && slotsTakenArray[weekNr][slotNr] == false) {
      //(Exact) SAME RANGE CLICKED => REMOVE selection
      if(IdSelectedSlot == event.currentTarget.id) {
        for(let range = lengthSelectedSlot; range > 0; range--) {
          let tempSlotNr = slotNr + (range-1)*42;
          let tempSlotId = getSlotIdFromNr(tempSlotNr);
          document.getElementById(tempSlotId).classList.remove("slotTaken");
        }
        IdSelectedSlot = -1;   //DIT WORDT NIET GEDAAN IN OUDE CODE RAF? !!!!
      }
      //Clicked the range, but not the start of range => Update/Shift selection range
      else {
        //Remove old range
        let NrSelectedSlot = getSlotNrFromId(IdSelectedSlot.toString())[3];
        for(let range = lengthSelectedSlot; range > 0; range--) {
          let tempSlotNr = NrSelectedSlot + (range-1)*42;
          let tempSlotId = getSlotIdFromNr(tempSlotNr);
          document.getElementById(tempSlotId).classList.remove("slotTaken");
        }
        //Update new range/IdSelectedSlot
        IdSelectedSlot = event.currentTarget.id;                //DIT WORDT NIET GEDAAN IN OUDE CODE RAF?
        for(let range = lengthSelectedSlot; range > 0; range--) {
          let tempSlotNr = slotNr + (range-1)*42;
          let tempSlotId = getSlotIdFromNr(tempSlotNr);
          document.getElementById(tempSlotId).classList.add("slotTaken");
        }
      }
    }
    //UNAVAILABLE SLOT WAS CLICKED (=> do nothing)
    //else if(slotsTakenArray[weekNr][slotNr] != false) {RESERVED SLOT was clicked => don't touch.}
  }
}


//Check day, row (hourslot) and slot based on id (Dx_Hy_OCz)
//Return [slot number, dayNr]
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