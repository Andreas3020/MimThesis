//Init variables
let days = "";

let selectedDaysArray = [[]];
let alreadySelectedId = -1;
let currentPatient = "koekje";

const htmlDays = document.querySelector(".days");

//tableBody = document.getElementById('patientTable');
//let currentPatient = tableBody.rows[1].cells[1].innerHTML;

//Create initial DataArray
for (let i=0; i<=41; i++)
{ 
  if(i != 5)
  {
    selectedDaysArray[0].push(false);
  }
  else
  {
    selectedDaysArray[0].push(currentPatient);
  }
} 
//console.log(selectedDaysArray[0]);


//Display Agenda
function renderAgenda() 
{
  alreadySelectedId = -1;
  for (let i=0; i<=41; i++)
  {
    if( selectedDaysArray[0][i] == false)
    {
    //days += `<div id=day${i} onClick="selectDay(this.id)">${i}</div>`;
    days += `<div class=day id=d${i}>${i}</div>`;
    }
    else
    {
      days += `<div class="day, selectedDay" id=d${i}>${i}</div>`;
    }  
  }
  htmlDays.innerHTML = days;
}

renderAgenda();

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
    }
    else
    {
      if(alreadySelectedId != -1)
      {
        event.currentTarget.classList.remove("selectedDay");
      }     
    }            
  });
});

function addSelectedDay()
{
  tableBody = document.getElementById('patientTable');
  currentPatient = tableBody.rows[1].cells[1].innerHTML;
  let avDay = tableBody.rows[1].cells[3].innerHTML;
  
  try{
    let dayNr = parseInt(document.getElementById(alreadySelectedId).innerHTML,10);
    if(avDay == "Monday"){
      if([0,7,14,21,28,35].includes(dayNr)){
        add(currentPatient, dayNr);
      }
      else{
        window.alert('The patient has not been alloted a correct timeslot!');
      }
    }
    else if(avDay == "Tuesday"){
      if([1,8,15,22,29,36].includes(dayNr)){
        add(currentPatient, dayNr);
      }
      else{
        window.alert('The patient has not been alloted a correct timeslot!');
      }
    }
    else if(avDay == "Wednesday"){
      if([2,9,16,23,30,37].includes(dayNr)){
        add(currentPatient, dayNr);
      }
      else{
        window.alert('The patient has not been alloted a correct timeslot!');
      }
    }
    else if(avDay == "Thursday"){
      if([3,10,17,24,31,38].includes(dayNr)){
        add(currentPatient, dayNr);
      }
      else{
        window.alert('The patient has not been alloted a correct timeslot!');
      }
    }
    else if(avDay == "Friday"){
      if([4,11,18,25,32,39].includes(dayNr)){
        add(currentPatient, dayNr);
      }
      else{
        window.alert('The patient has not been alloted a correct timeslot!');
      }
    }
    else if(avDay == "Saturday"){
      if([5,12,19,26,33,40].includes(dayNr)){
        add(currentPatient, dayNr);
      }
      else{
        window.alert('The patient has not been alloted a correct timeslot!');
      }
    }
    else if(avDay == "Sunday"){
      if([6,12,20,27,34,41].includes(dayNr)){
        add(currentPatient, dayNr);
      }
      else{
        window.alert('The patient has not been alloted a correct timeslot or no timeslot has been selected!\nClick on skip if you are not able to allot a correct timeslot to the patient.');
      }
    }
  }
  catch{
    window.alert('The patient has not been alloted a correct timeslot or no timeslot has been selected!\nClick on skip if you are not able to allot a correct timeslot to the patient.');
  }
}

function add(currentPatient, dayNr){
  let a = nextPatientEvent();
  if(a <= 1){
    document.getElementById(alreadySelectedId).innerHTML= currentPatient;
    selectedDaysArray[0][dayNr] = currentPatient;
    alreadySelectedId = -1;
  }
}

