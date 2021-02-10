//Get Level & Settings
let level = document.getElementById("diff").value;
let setting1 = document.getElementsByName("s1") //Radio button (input)
let setting2 = document.getElementById("s2");   //Dropdown (select)

console.log(level);

function changeDifficulty() {
  //Update settings to difficulty level
  if(level == "Easy") {
    setting1[0].checked = true;
    setting2.options[0].selected = true;
  } else if(level == "Medium") {
    setting1[1].checked = true;
    setting2.options[1].selected = true;
  } else if(level == "Difficult") {
    setting1[2].checked = true;
    setting2.options[2].selected = true;
  }
}