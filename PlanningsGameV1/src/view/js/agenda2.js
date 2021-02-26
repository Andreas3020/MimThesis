//VARIABLES
let weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
let weekdaysShort = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
let hours = ["8:00","8:30","9:00","9:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30"];

let weekNr = 0; //Week 1: weekNr = 0. Array convenience for coding. (the displayed week, not actual weekNr)

let currentWeek = 0; //The actual weekNr
let todayNr = 0;

let IdSelectedSlot = -1;  //Indicate whether currenly a slot is selected.
let slotsTakenArray = [];

  
console.log(Patient.list);

function renderAgenda()
{
   /* tableCore = agenda body = hour legenda (left column) + slots (7days with each 6 slots (2 onco slots + 4 chemo slots). */
   const tableCore = document.getElementById("agendaBody");
   let core = "";
   IdSelectedSlot = -1; //RESET
  
  let greyedOutString="";
  //GENERATE AGENDA BODY (hour column + slots)
  for(let j=0; j<20; j++) { //20x ROWS - HOUR SLOTS
    core += `<tr>`;
    core += `<th> ${hours[j]} </th>`;   //E.g. <th>8:00</th>

    for (let i=0; i<7; i++) {//7x DAYS
      if ( currentWeek == weekNr)
      {
        greyedOutString = checkDay(i, "greyedOutSlot");
      }
        else if (currentWeek > weekNr)
      {
        greyedOutString = "greyedOutSlot";
      } 
      else
      {
        greyedOutString = "";
      }
     // greyedOutString = checkDay(i, greyedOutString1);
      for (let k=0; k<6; k++) { //6x ONCOCHEMO (2 onco + 4 chemo)
        
        //End of row => add </tr>
        if(i == 6 && k == 5) {
          //Slot AVAILABLE
          if(slotsTakenArray[weekNr][6*i + 42*j +k] == false) {
            core += `<td class="${weekdaysShort[i]} ${greyedOutString}" id="D${i}_H${j}_OC${k}"></td> </tr>`;
          } else {  
            core += `<td class="${weekdaysShort[i]} slotTaken ${greyedOutString}" id="D${i}_H${j}_OC${k}"> ${slotsTakenArray[weekNr][6*i + 42*j +k].patientID}</td> </tr>`;
          }     
        } 
        else { //Not end of row (no </tr> needed)
          if(slotsTakenArray[weekNr][6*i + 42*j+k] == false) {
            core += `<td class="${weekdaysShort[i]} ${greyedOutString}" id="D${i}_H${j}_OC${k}"></td>`;
          } else {  
            core += `<td class="${weekdaysShort[i]} slotTaken ${greyedOutString}" id="D${i}_H${j}_OC${k}"> ${slotsTakenArray[weekNr][6*i + 42*j +k].patientID}</td>`; 
          }
        }
      }    
    }
   
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
  if ( currentWeek == weekNr)
  {
    return  "greyedOutSlot";
  }
  else
  {
    return "";
  } 
}

function checkDay(i, greyedOutString)
{
  if(i >  todayNr )
  {
    return "";
  }
  else if (i == todayNr)
  {
    return greyedOutString + "Today";
  }
  else
  {
    return greyedOutString;
  }
}

function addSelectedSlot()
{
  let tableBody = document.getElementById('patientTableScheduler');
  let currentPatientId = tableBody.rows[1].cells[0].innerHTML;  //Id equals amount of patients already passed by to schedule.
  let currentPatientObject = Patient.list[currentPatientId];

  let avDay = currentPatientObject.availability;
  let nrOncoAppointments = currentPatientObject.onco;
  let nrChemoAppointments = currentPatientObject.chemo;
  
  //try: check if a slot is selected
  try{
   
  [dayNr, hourSlot, oncoChemoNr, slotNr] = getSlotNrFromId(IdSelectedSlot.toString());
   console.log(IdSelectedSlot);
   if(weekdays[dayNr] == avDay){ 
      // ONCO NEEDED, CHEMO PRESSED (block/warn)
      if( nrOncoAppointments >= 1 && oncoChemoNr > 1 ) { window.alert('The patient needs to be alloted an onco slot!'); }
      // ONCO NEEDED, ONCE PRESSED (confirm/add)
      else if(nrOncoAppointments>=1 && oncoChemoNr <= 1) { add(currentPatientObject, slotNr); }
      // CHEMO NEEDED, ONCO PRESSED (block/warn)
      else if(nrChemoAppointments>=1 && oncoChemoNr <= 1) { window.alert('The patient needs to be alloted a chemo slot!'); }
      // CHEMO NEEDED, CHEMO PRESSED (confirm/add)
      else { add(currentPatientObject, slotNr); }
    }
    else { window.alert('The patient has not been alloted a correct timeslot!'); }
  }
  catch (error) {
    console.log(error);
    window.alert('The patient has not been alloted a correct timeslot or no timeslot has been selected!\nClick on skip if you are not able to allot a correct timeslot to the patient.');
  }
}


function add(currentPatientObject, slotNr){
  let a = nextPatientEvent();
  if(a <= 1){
    document.getElementById(IdSelectedSlot).innerHTML= currentPatientObject.patientID;
    slotsTakenArray[weekNr][slotNr] = currentPatientObject;
    IdSelectedSlot = -1;
    
    checkPatientsPerDay()
  }
}

//checks if the currentPatient is the last patient of the day and if so go to the next day (make the current day grey)
function checkPatientsPerDay()
{
  if(Patient.list[tableBody.rows[1].cells[0].innerHTML].lastPatientBool == true)
  {
    //Go to the next day or if at the end of the week and the next week
    if(todayNr < 6)
    {
      todayNr += 1;
    }
    else
    {
      todayNr = 0;
      currentWeek += 1;
    }
    let today = weekdaysShort[todayNr];
    let yesterday = weekdaysShort[todayNr-1];

    // Only show immediatly if de currentweek is also the week that is displayed in the agenda
    if(weekNr == currentWeek)
    {

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

function addEventlistenerSlots() 
{
  document.querySelectorAll("#agendaBody > tr > td:not(.greyedOutSlotToday):not(.greyedOutSlot)").forEach
  ( slot => {
    slot.addEventListener("click", event => {

      //Need to lookup slotId again, because IdSelectedSlot becomes -1 after clicking "next"
      let slotNr = getSlotNrFromId(event.currentTarget.id.toString())[3];


      //----------CSS SLOTTAKEN (RED)--------------//
      //Marked slot IS NOT new clicked slot?
      if(event.currentTarget.classList[1] != "slotTaken") {
        //ANOTHER SLOT IS MARKED AT CLICK (remove)
        if(IdSelectedSlot != -1) {
          document.getElementById(IdSelectedSlot).classList.remove("slotTaken");
        }
      //MARK NEW (clicked) slot
      IdSelectedSlot = event.currentTarget.id;
      event.currentTarget.classList.add("slotTaken");
      }
      else { 
        if(IdSelectedSlot != -1 && slotsTakenArray[weekNr][slotNr] == false) {
          event.currentTarget.classList.remove("slotTaken");
        }
      }

      
      //----------JS SLOTTAKEN (SHOW PATIENT INFO)--------------//
      

      if(slotsTakenArray[weekNr][slotNr] != false) {

        let tableBody = document.getElementById('patientTableSlotinfo');
        patientObj = slotsTakenArray[weekNr][slotNr];
        console.log(slotsTakenArray[weekNr][slotNr]);
        tableBody.rows[1].cells[0].innerHTML = patientObj.patientID;
        tableBody.rows[1].cells[1].innerHTML = patientObj.firstName;
        tableBody.rows[1].cells[2].innerHTML = patientObj.lastName;
        tableBody.rows[1].cells[3].innerHTML = patientObj.availability;
        tableBody.rows[1].cells[4].innerHTML = patientObj.onco;
        tableBody.rows[1].cells[5].innerHTML = patientObj.chemo;
        //tableBody.rows[1].cells[6].innerHTML = patientObj.chemoLength;

        document.getElementById("box2Right").style.display = "flex";
      }
      else { //slotsTakenArray[weekNr][slotNr] == false (available slot)
        document.getElementById("box2Right").style.display = "none";
      }

    });
  });
}


function getSlotNrFromId(slotId) {
  //Check day, row (hourslot) and slot based on id (Dx_Hy_OCz)
  //Return [slot number, dayNr]
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

//GENERATE 1ST WEEK ARRAY
addWeekToArray();

//RENDER AGENDA 1ST TIME
renderAgenda();