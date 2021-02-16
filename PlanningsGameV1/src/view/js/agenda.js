//Init variables


let selectedDaysArray = [];
let alreadySelectedId = -1;
let currentPatient = "koekje";
let days = ""
const htmlDays = document.querySelector(".days");
let addedWeeksToArrayNr = 0;
let week = 0;

//tableBody = document.getElementById('patientTable');
//let currentPatient = tableBody.rows[1].cells[1].innerHTML;

//Create initial DataArray
addWeekToArray();

// Adds week to selectdDaysArray
function addWeekToArray()
{
  selectedDaysArray.push([]);
  for (let i=0; i<=41; i++)
  { 
    
    selectedDaysArray[week].push(false);
    
    //selectedDaysArray[0].push(currentPatient);    
  } 
}

//Display Agenda
function renderAgenda() 
{
  console.log(week);
  days = "";
  

  alreadySelectedId = -1;
  for (let i=0; i<=41; i++)
  {
    if( selectedDaysArray[week][i] == false)
    {
    //days += `<div id=day${i} onClick="selectDay(this.id)">${i}</div>`;
    days += `<div class=day id=d${i}>${i}</div>`;
    }
    else
    {
      days += `<div class="day, selectedDay" id=d${i}>${selectedDaysArray[week][i]}</div>`;
    }  
  }
  console.log(days);
  htmlDays.innerHTML = days;

  addEventlistenerToDays()

  document.getElementById('h2Weeknr').innerHTML= week + 1 ;
  
}

renderAgenda();



function addSelectedDay()
{
  tableBody = document.getElementById('patientTable');
  currentPatient = tableBody.rows[1].cells[1].innerHTML;

  document.getElementById(alreadySelectedId).innerHTML= currentPatient;
  let dayNr = alreadySelectedId.match(/\d+/);
  
  selectedDaysArray[week][dayNr] = currentPatient;


  alreadySelectedId = -1;

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
  console.log(selectedDaysArray);
});

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
}
