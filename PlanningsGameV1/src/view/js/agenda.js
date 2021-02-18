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

<<<<<<< HEAD
=======
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
  console.log(selectedDaysArray);
});

>>>>>>> 945d27b70d12d51e91e7156b70107cc2a76b86a2
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
  
<<<<<<< HEAD
  document.getElementById('weekNr').innerHTML= "week " + weekNr  ;

  addEventlistenerToSlots()
}

function addSelectedSlot()
=======
}

//apType (appointment type): '0' stands for oncollogy and '1' stand for chemo
function addSelectedDay(apType)
>>>>>>> 945d27b70d12d51e91e7156b70107cc2a76b86a2
{
  tableBody = document.getElementById('patientTable');
  currentPatient = tableBody.rows[1].cells[1].innerHTML;
  let avDay = tableBody.rows[1].cells[3].innerHTML;
  
  //try: check if a slot is selected
  try{
<<<<<<< HEAD
   
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
=======
    //get the id from your agenda
    let a = alreadySelectedId.match(/\d+/).input;
    
    //checking the day number and the slot number and type
    /*let idArray = a.split("_")
    let strArray = idArray[0].split("d");*/
    let strArray = a.split("d");
    let dayNr = parseInt(strArray[1],10);
    /*let oID = idArray[1].split("o");
    let cID = idArray[1].split("c");
    let slotType; // '0' stands for oncollogy and '1' stand for chemo
    if(cID == ""){
      let slotNr = oID;
      slotType = 0;
    }
    else{
      let slotNr = cID;
      slotType = 1;
    }

    //check if the patient is allocated to the correct day
    if(avDay == "Monday"){
      if(dayNr == 1 && slotType == apType){
        add(currentPatient, dayNr);
      }
      else{
        window.alert('The patient has not been allocated to a correct timeslot!');
      }
    }*/
    if(avDay == "Monday"){
      if([0,7,14,21,28,35].includes(dayNr)){
        add(currentPatient, dayNr);
      }
      else{
        window.alert('The patient has not been allocated to a correct timeslot!');
      }
    }
    else if(avDay == "Tuesday"){
      if([1,8,15,22,29,36].includes(dayNr)){
        add(currentPatient, dayNr);
      }
      else{
        window.alert('The patient has not been allocated to a correct timeslot!');
      }
    }
    else if(avDay == "Wednesday"){
      if([2,9,16,23,30,37].includes(dayNr)){
        add(currentPatient, dayNr);
      }
      else{
        window.alert('The patient has not been allocated to a correct timeslot!');
      }
    }
    else if(avDay == "Thursday"){
      if([3,10,17,24,31,38].includes(dayNr)){
        add(currentPatient, dayNr);
      }
      else{
        window.alert('The patient has not been allocated to a correct timeslot!');
      }
    }
    else if(avDay == "Friday"){
      if([4,11,18,25,32,39].includes(dayNr)){
        add(currentPatient, dayNr);
      }
      else{
        window.alert('The patient has not been allocated to a correct timeslot!');
      }
    }
    else if(avDay == "Saturday"){
      if([5,12,19,26,33,40].includes(dayNr)){
        add(currentPatient, dayNr);
      }
      else{
        window.alert('The patient has not been allocated to a correct timeslot!');
      }
    }
    else if(avDay == "Sunday"){
      if([6,13,20,27,34,41].includes(dayNr)){
        add(currentPatient, dayNr);
      }
      else{
        window.alert('No timeslot has been selected!\nClick on skip if you are not able to allot a correct timeslot to the patient.');
      }
>>>>>>> 945d27b70d12d51e91e7156b70107cc2a76b86a2
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

<<<<<<< HEAD
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
=======
function addEventlistenerToDays()
{
  document.querySelectorAll(".day").forEach
  (day => {
    day.addEventListener("click", event => {
      
      if(event.currentTarget.classList.value == "day")
      {
        if(alreadySelectedId!=-1)
        {
          document.getElementById(alreadySelectedId).classList.remove("selectedDay");
        }

        alreadySelectedId = event.currentTarget.id;
        event.currentTarget.classList.add("selectedDay");
>>>>>>> 945d27b70d12d51e91e7156b70107cc2a76b86a2
      }
      else
      {

        if(alreadySelectedId != -1)
        {
<<<<<<< HEAD
          event.currentTarget.classList.remove("selectedSlot");
=======
          event.currentTarget.classList.remove("selectedDay");
>>>>>>> 945d27b70d12d51e91e7156b70107cc2a76b86a2
        }     
      }            
    });
  });
}
<<<<<<< HEAD

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

  
=======
>>>>>>> 945d27b70d12d51e91e7156b70107cc2a76b86a2
