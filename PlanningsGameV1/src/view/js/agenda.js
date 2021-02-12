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

  document.getElementById(alreadySelectedId).innerHTML= currentPatient;
  let dayNr = alreadySelectedId.charAt(1)
  selectedDaysArray[0][dayNr] = currentPatient;

  alreadySelectedId = -1;

}

