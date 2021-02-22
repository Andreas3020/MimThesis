/* i=days, j=hourslots and k=oncoChemoslot -> 6*i + 42*j+k = slotnr in array */

//init variables

let selectedSlotsArray = [];
let alreadySelectedId = -1;
let currentPatient = "";

let weekdaysShort = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
let weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

let addedWeeksToArrayNr = 0;
let week = 0;
let currentWeek = 0;

let nrHSlotsOnco = 2;
let nrHSlotsChemo1 = 2;
let nrHSlotsChemo2 = 4;
let nrHSlotsChemo3 = 6;

let daysPassedArray = []

//let nrOfPatiensDay = getRandomInt(4,8);
let nrOfPatiensThisDay = 1;
let todayNr = 0;


//Create initial DataArray
addWeekToArray();

renderAgenda();

// Adds week to selectdDaysArray and daysPassedArray
function addWeekToArray()
{
  selectedSlotsArray.push([]);
  for (let i=0; i<=839; i++)
  {    
    selectedSlotsArray[week].push(false);        
  } 
  daysPassedArray.push([]);
  for (let i=0; i<=7; i++)
  {    
    daysPassedArray[week].push(false);        
  } 
}

//Display Agenda
function renderAgenda() 
{
  
  let slots = ""
  const htmlSlots = document.querySelector(".slots"); 
  alreadySelectedId = -1;
  let dayGrayedOut = false;

  //draw the slots
  //for every hourSlot 
  for(let j=0; j<20; j++) //verticaal
  {
    //for every day
    for (let i=0; i<7; i++) //horizontaal
    {
      if(daysPassedArray[week][i]== true)
      {
        dayGrayedOut = true;
      }
      else
      {
        dayGrayedOut = false;
      }

      let weekday = weekdaysShort[i];
      // for 2 onco and 4 chemo
      for (let k=0; k<6; k++) //horizontaal
      { 
        if( dayGrayedOut == true)
        {
          slots += `<div class=" ${weekday} slot greyedOutSlot" id=D${i}_H${j}_OC${k}></div>`;
        }
        else if(selectedSlotsArray[week][6*i + 42*j+k] == false)
        {  
          slots += `<div class=" ${weekday} slot" id=D${i}_H${j}_OC${k}></div>`;               
        }
        else
        {                    
          slots += `<div class="${weekday} slot selectedSlot" id=D${i}_H${j}_OC${k}>${selectedSlotsArray[week][6*i + 42*j+k].charAt(0)}</div>`;          
        }        
      }      
    }
  }
  //draw header 2 (weekdays- and oncoChemo header)
  daysPassedArray[week].forEach(myFunction);
  function myFunction(item,index)
  {
    let today = weekdaysShort[index];
    if(item)
    {
      document.querySelectorAll("." + today + "Header").forEach(div =>{
        div.classList.add("greyedOutHeader");
        
      });
    }
    else
    {
      document.querySelectorAll("." + today + "Header").forEach(div =>{
        div.classList.remove("greyedOutHeader");
      });
    }
  };
  
  
  htmlSlots.innerHTML = slots;

  let weekNr= week +1;
  
  document.getElementById('weekNr').innerHTML= "week " + weekNr  ;

  addEventlistenerToSlots()
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
   let a = alreadySelectedId.match(/\d+/).input;
    
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
  catch{
    window.alert('The patient has not been alloted a correct timeslot or no timeslot has been selected!\nClick on skip if you are not able to allot a correct timeslot to the patient.');
  }
}

function add(currentPatient, slotNr){
  let a = nextPatientEvent();
  if(a <= 1){
    document.getElementById(alreadySelectedId).innerHTML= currentPatient.charAt(0);
    selectedSlotsArray[week][slotNr] = currentPatient;
    alreadySelectedId = -1;
    
    checkPatientsPerDay()
  }
}

//checks if the number of patients of that day has been reached and if so go to the next day (make the current day grey)
function checkPatientsPerDay()
{
  if(Patient.list[tableBody.rows[1].cells[0].innerHTML].lastPatientBool == true)
  {
    let today = weekdaysShort[todayNr];
    daysPassedArray[currentWeek][todayNr] = true;
    
    // Only show immediatly if de currentweek is also the week that is displayed in the agenda
    if(week == currentWeek)
    {
      document.querySelectorAll("." + today).forEach(div =>{
        div.classList.add("greyedOutSlot");
      });

      document.querySelectorAll("." + today + "Header").forEach(div =>{
        div.classList.add("greyedOutHeader");
        
      });
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
    //nrOfPatiensThisDay += 1;

  }
}

function addEventlistenerToSlots()
{
  document.querySelectorAll(".slot").forEach
  (slot => {
    slot.addEventListener("click", event => {
      if(event.currentTarget.classList[2]!= "selectedSlot")
      {
        if(alreadySelectedId!=-1)
        {
          document.getElementById(alreadySelectedId).classList.remove("selectedSlot");
        }

        alreadySelectedId = event.currentTarget.id;
        event.currentTarget.classList.add("selectedSlot");
      }
      else
      {

        if(alreadySelectedId != -1)
        {
          event.currentTarget.classList.remove("selectedSlot");
        }     
      }            
    });
  });
}

document.querySelector(".prev").addEventListener("click", () => {
  if(week > 0)
  {
    week -= 1;
  renderAgenda();
  }
  
});

document.querySelector(".next").addEventListener("click", () => {
  week += 1;
  if(week>addedWeeksToArrayNr)
  { 
    addedWeeksToArrayNr += 1;
    addWeekToArray();
  }
  renderAgenda();
  
});

  
