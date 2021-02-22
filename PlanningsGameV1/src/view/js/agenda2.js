//VARIABLES
let weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
let weekdaysShort = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
let hours = ["8:00","8:30","9:00","9:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30"];

let weekNr = 0; //Week 1: weekNr = 0. Array convenience for coding.
let IdSelectedSlot = -1;  //Indicate whether currenly a slot is selected.
let slotsTakenArray = [];


function renderAgenda() {
  /* tableCore = agenda body = hour legenda (left column) + slots (7days with each 6 slots (2 onco slots + 4 chemo slots). */
  const tableCore = document.getElementById("agendaBody");
  let core = "";
  IdSelectedSlot = -1; //RESET
  
  //GENERATE AGENDA BODY (hour column + slots)
  for(let j=0; j<20; j++) { //20x ROWS - HOUR SLOTS
    core += `<tr>`;
    core += `<th> ${hours[j]} </th>`;   //E.g. <th>8:00</th>

    for (let i=0; i<7; i++) {   //7x DAYS
      for (let k=0; k<6; k++) { //6x ONCOCHEMO (2 onco + 4 chemo)

        //End of row => add </tr>
        if(i == 6 && k == 5) {
          //Slot AVAILABLE
          if(slotsTakenArray[weekNr][6*i + 42*j +k] == false) {
            core += `<td class="${weekdaysShort[i]}" id="D${i}_H${j}_OC${k}"></td> </tr>`;
          } else {  
            core += `<td class="${weekdaysShort[i]} slotTaken" id="D${i}_H${j}_OC${k}"></td> </tr>`; /* IMPLEMENT INFO PATIENT ON HOVER ?*/
          }     
        } 
        else { //Not end of row (no </tr> needed)
          if(slotsTakenArray[weekNr][6*i + 42*j+k] == false) {
            core += `<td class="${weekdaysShort[i]}" id="D${i}_H${j}_OC${k}"></td>`;
          } else {  
            core += `<td class="${weekdaysShort[i]} slotTaken" id="D${i}_H${j}_OC${k}"></td>`; /* IMPLEMENT INFO PATIENT ON HOVER ?*/
          }
        }
      }
    }
  }

  //WRITE AGENDA BODY TO HTML
  tableCore.innerHTML = core;

  //DISPLAY WEEK NR
  document.getElementById('weekNr').innerHTML= "week " + (weekNr+1);

  addEventlistenerSlots()
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
