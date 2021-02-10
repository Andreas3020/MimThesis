const renderAgenda = () => {

let days = "";

const htmlDays = daydocument.querySelector(".days");

for (let i=1; i<=42; i++){
  days += `<div>${i}</div>`;
  

}

htmlDays.innerHTML = days;
}

renderAgenda();