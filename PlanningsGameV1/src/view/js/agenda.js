/* i=days, j=hourslots and k=oncoChemoslot -> 6*i + 42*j+k = slotnr in array */

//init variables

let selectedSlotsArray = [];
let alreadySelectedId = -1;
let currentPatient = "";

let weekdaysShort = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
let weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

let addedWeeksToArrayNr = 0;
let week = 0;

//Create initial DataArray
addWeekToArray();

renderAgenda();

// Adds week to selectdDaysArray
function addWeekToArray()
{
  selectedSlotsArray.push([]);
  for (let i=0; i<=839; i++)
  {    
    selectedSlotsArray[week].push(false);        
  } 
}

//Display Agenda
function renderAgenda() 
{
  
  let slots = ""
  const htmlSlots = document.querySelector(".slots"); 
  alreadySelectedId = -1;

  //for every hourSlot 
  for(let j=0; j<20; j++) //verticaal
  {
    //for every day
    for (let i=0; i<7; i++) //horizontaal
    {
      let weekday = weekdaysShort[i];
      // for 2 onco and 4 chemo
      for (let k=0; k<6; k++) //horizontaal
      { 
        if(selectedSlotsArray[week][6*i + 42*j+k] == false)
        {                  
          slots += `<div class="${weekday}, slot" id=D${i}_H${j}_OC${k}>${6*i + 42*j+k}</div>`;          
        }
        else
        {                    
          slots += `<div class="${weekday}, slot, selectedSlot" id=D${i}_H${j}_OC${k}>${selectedSlotsArray[week][6*i + 42*j+k].charAt(0)}</div>`;          
        }
      }      
    }
  }      
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
  
  try{
   
   //get the id from your agenda
   let a = alreadySelectedId.match(/\d+/).input;
    
   //checking the day number and the slot number and type
   /*let idArray = a.split("_")
   let strArray = idArray[0].split("d");*/
   let strArray = a.split("_");
   let dayStr = strArray[0];
   let hourSlotStr = strArray[1];
   let oncoChemoStr = strArray[2];
   let dayNr = parseInt(dayStr.split("D")[1],10);
   let hourSlot = parseInt(hourSlotStr.split("H")[1],10);
   let oncoChemoNr = parseInt(oncoChemoStr.split("OC")[1],10);
   let slotNr = 6*dayNr + 42*hourSlot  + oncoChemoNr;
   
   if(weekdays[dayNr] == avDay){
      add(currentPatient, slotNr);
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
  }
}

function addEventlistenerToSlots()
{
  document.querySelectorAll(".slot").forEach
  (slot => {
    slot.addEventListener("click", event => {
      if(event.currentTarget.classList.value.split(", ")[1]== "slot")
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

  
