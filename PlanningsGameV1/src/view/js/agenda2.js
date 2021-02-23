//VARIABLES
let weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
let weekdaysShort = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
let hours = ["8:00","8:30","9:00","9:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30"];

let weekNr = 0; //Week 1: weekNr = 0. Array convenience for coding. (the displayed week, not actual weekNr)

let currentWeek = 0; //The actual weekNr
let todayNr = 0;

let IdSelectedSlot = -1;  //Indicate whether currenly a slot is selected.
let slotsTakenArray = [];


function renderAgenda()
{
   /* tableCore = agenda body = hour legenda (left column) + slots (7days with each 6 slots (2 onco slots + 4 chemo slots). */
   const tableCore = document.getElementById("agendaBody");
   let core = "";
   IdSelectedSlot = -1; //RESET
  let greyedOutString1 = checkWeek();
  let greyedOutString="";
  //GENERATE AGENDA BODY (hour column + slots)
  for(let j=0; j<20; j++) { //20x ROWS - HOUR SLOTS
    core += `<tr>`;
    core += `<th> ${hours[j]} </th>`;   //E.g. <th>8:00</th>

    for (let i=0; i<7; i++) {//7x DAYS
      
      greyedOutString = checkDay(i, greyedOutString1);
      for (let k=0; k<6; k++) { //6x ONCOCHEMO (2 onco + 4 chemo)
        
        //End of row => add </tr>
        if(i == 6 && k == 5) {
          //Slot AVAILABLE
          if(slotsTakenArray[weekNr][6*i + 42*j +k] == false) {
            core += `<td class="${weekdaysShort[i]} ${greyedOutString}" id="D${i}_H${j}_OC${k}"></td> </tr>`;
          } else {  
            core += `<td class="${weekdaysShort[i]} slotTaken" id="D${i}_H${j}_OC${k}"></td> </tr>`; /* IMPLEMENT INFO PATIENT ON HOVER ?*/
          }     
        } 
        else { //Not end of row (no </tr> needed)
          if(slotsTakenArray[weekNr][6*i + 42*j+k] == false) {
            core += `<td class="${weekdaysShort[i]} ${greyedOutString}" id="D${i}_H${j}_OC${k}"></td>`;
          } else {  
            core += `<td class="${weekdaysShort[i]} slotTaken" id="D${i}_H${j}_OC${k}"></td>`; /* IMPLEMENT INFO PATIENT ON HOVER ?*/
          }
        }
      }    
    }
    for(let i=0; i<7; i++)
    {
      let today = weekdaysShort[i];
      // in the current week
      if( currentWeek == weekNr)
      {   
        if(i >=  todayNr)
        {
          document.querySelectorAll("th." + today ).forEach(div =>{
        
            div.classList.remove("greyedOutHeader");
            
          });
        }
        else
        {
          document.querySelectorAll("th." + today ).forEach(div =>{
        
            div.classList.add("greyedOutHeader");
            
          });
        }     
      }
      //in the past
      else if (weekNr < currentWeek)
      {
        document.querySelectorAll("th." + today ).forEach(div =>{
          
          div.classList.add("greyedOutHeader");
          
        });
      }
      //in the future
      else
      {
        document.querySelectorAll("th." + today ).forEach(div =>{
          
          div.classList.remove("greyedOutHeader");
          
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
  if(i >=  todayNr)
  {
    return "";
  }
  else
  {
    return greyedOutString;
  }
}

function addSelectedSlot()
{
  tableBody = document.getElementById('patientTable');
  currentPatient = tableBody.rows[1].cells[1].innerHTML;
  let avDay = tableBody.rows[1].cells[3].innerHTML;
  let nrOncoAppointments = tableBody.rows[1].cells[4].innerHTML;
  let nrChemoAppointments = tableBody.rows[1].cells[5].innerHTML;
  
  //try: check if a slot is selected
  try{
   
   //get the id from your agenda
   let a = IdSelectedSlot.match(/\d+/).input;
    
   //checking the day number and the slot number and type
   
   let strArray = a.split("_");
   let dayStr = strArray[0];
   let hourSlotStr = strArray[1];
   let oncoChemoStr = strArray[2];
   let dayNr = parseInt(dayStr.split("D")[1],10);
   let hourSlot = parseInt(hourSlotStr.split("H")[1],10);
   let oncoChemoNr = parseInt(oncoChemoStr.split("OC")[1],10);
   let slotNr = 6*dayNr + 42*hourSlot  + oncoChemoNr;
   
   if(weekdays[dayNr] == avDay){ 
      // checks if an patient needs an oncoAppointment and if the user presses on a chemo slot 
      if( nrOncoAppointments >= 1 && oncoChemoNr > 1 )
      {
        window.alert('The patient needs to be alloted an onco slot!');
      }
      // does patient need an oncoAppointment and if the user presses on a onco slot 
      else if(nrOncoAppointments>=1 && oncoChemoNr <= 1)
      {
        add(currentPatient, slotNr);
      }
      //does patient need a chemoAppointment and is an onco slot pressed?
      else if(nrChemoAppointments>=1 && oncoChemoNr <= 1)
      {
        window.alert('The patient needs to be alloted a chemo slot!');
      }
      else
      {
        add(currentPatient, slotNr);
      }
    }
   else{
      window.alert('The patient has not been alloted a correct timeslot!');
    }
  }
  catch (error){
    window.alert('The patient has not been alloted a correct timeslot or no timeslot has been selected!\nClick on skip if you are not able to allot a correct timeslot to the patient.');
  }
}


function add(currentPatient, slotNr){
  let a = nextPatientEvent();
  if(a <= 1){
    document.getElementById(IdSelectedSlot).innerHTML= currentPatient.charAt(0);
    slotsTakenArray[weekNr][slotNr] = currentPatient;
    IdSelectedSlot = -1;
    
    checkPatientsPerDay()
  }
}

//checks if the currentPatient is the last patient of the day and if so go to the next day (make the current day grey)
function checkPatientsPerDay()
{
  if(Patient.list[tableBody.rows[1].cells[0].innerHTML].lastPatientBool == true)
  {
    let today = weekdaysShort[todayNr];
    
    
    // Only show immediatly if de currentweek is also the week that is displayed in the agenda
    if(weekNr == currentWeek)
    {
      document.querySelectorAll("td." + today).forEach(div =>{
        div.classList.add("greyedOutSlot");
      });
      
      document.querySelectorAll("th." + today ).forEach(div =>{
        
        div.classList.add("greyedOutHeader");
        
      });
/*
      document.querySelectorAll("." + today + "Header").forEach(div =>{
        div.classList.add("greyedOutHeader");
        
      });*/
    }
    //go to the next day or if at the end of the week and the next week
    if(todayNr < 6)
    {
      todayNr += 1;
    }
    else
    {
      todayNr = 0;
      currentWeek += 1;
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
  document.querySelectorAll("#agendaBody > tr > td").forEach
  ( slot => {
    slot.addEventListener("click", event => {
      //Marked slot IS NOT new clicked slot?
      if(event.currentTarget.classList[1] != "slotTaken") {

        //ANOTHER SLOT MARKED ATM (remove)
        if(IdSelectedSlot != -1) {
          document.getElementById(IdSelectedSlot).classList.remove("slotTaken");
        }

      //MARK NEW (clicked) slot
      IdSelectedSlot = event.currentTarget.id;
      event.currentTarget.classList.add("slotTaken");
      }
      else { 
        if(IdSelectedSlot != -1) {
          event.currentTarget.classList.remove("slotTaken");
        }
      }
    });
  });
}

//GENERATE 1ST WEEK ARRAY
addWeekToArray();

//RENDER AGENDA 1ST TIME
renderAgenda();
