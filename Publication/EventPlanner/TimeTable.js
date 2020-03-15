//  Script that causes a table of possible times to appear when creating an event
class TimeTable{

  constructor(mode24){this.mode24 = mode24;}

  //Not's the value of mode24 and changes the button text to reflect the change
  changeMode(){
    this.mode24 = !this.mode24;
    if(this.mode24)
    {
      document.querySelector("#button24").innerText = "12 Hour Mode";
    }
    else
    {
      document.querySelector("#button24").innerText = "24 Hour Mode";
    }
    this.openTable();
  }
  //this function systematically sets all of the table values to correctly reflect the base 60, 20 minute timeslots as well as accounting for
  //12 hour and 24 hour mode and adding the suffix "a.m." or "p.m." to correctly tell the user what times they are working with.
  getTime = (n) =>
  {
    n = n-1;
    let totalMinutes = 20*n + 300;
    let timeSuffix = "";
    if(n>20)
    {
      totalMinutes = 20*(n-22)+800;
    }
    let minutes = totalMinutes % 60;
    if(n%3==0)
    {
      minutes = "00";
    }
    let hours = (totalMinutes - minutes)/60;
    if(n<15)
    {
      hours = "0" + hours;
    }
    if(!this.mode24 && hours<12)
    {
      timeSuffix = "a.m.";
    }
    else if(!this.mode24 && hours>=12)
    {
      timeSuffix = "p.m.";
    }
    if(hours>12 && !this.mode24)
    {
      hours = "0" + hours - 12;
    }
    return(hours + ":" + minutes + " " + timeSuffix);
  }

  // generates the table of times if there are no error messages currently from the validation of the month.
  openTable = () =>
  {
    if(document.querySelector("#TypeErrorMessage").innerText==""&&document.querySelector("#MonthErrorMessage").innerText==""&&document.querySelector("#DayErrorMessage").innerText==""&&document.querySelector("#YearErrorMessage").innerText=="")
    {
      let table = document.querySelector("#TimeTable");
      while(table.firstChild)
      {
        table.removeChild(table.firstChild);
      }
      let head = table.insertRow(0);
      head.innerHTML = "<th>20 Minute Time Slot</th><th>Available</th><th>20 Minute Time Slot</th><th>Available</th><th>20 Minute Time Slot</th><th>Available?</th>"
      //the creation of this table is split into 3 for loops which reflects the 3 table setup we used for the timetable
      //we went with a 3 table setup to better use the space we have on a webpage.
        for(let i=1;i<=21;i++)
        {
          table.insertRow(i);
          table.rows[i].insertCell(0);
          table.rows[i].insertCell(1);
          table.rows[i].insertCell(2);
          table.rows[i].insertCell(3);
          table.rows[i].insertCell(4);
          table.rows[i].insertCell(5);
          table.rows[i].cells[0].innerText = this.getTime(i);
          let x = document.createElement("INPUT");//adds a checkbox to allow the user to select any of the 20 minute timeslots
          x.setAttribute("type", "checkbox");
          x.setAttribute("id", "checkBox"+i);
          table.rows[i].cells[1].addEventListener("click", () =>{
            let timeSelect = document.querySelector("#checkBox" +i);//lets the user click anywhere inside of the cell, instead of just inside the checkbox, to select a timeslot
            if(timeSelect.checked)
            {
              timeSelect.checked = false;
            }
            else
            {
              timeSelect.checked = true;
            }
          })
          x.addEventListener("click", () => {
            let timeSelect = document.querySelector("#checkBox" +i);
            if(timeSelect.checked)
            {
              timeSelect.checked = false;
            }
            else
            {
              timeSelect.checked = true;
            }
          })
          table.rows[i].cells[1].appendChild(x);//appends 'x' to the table

        }
        //the second for loop is similar to the first, but allows us to have a second column of timetable values.
        for(let i=1;i<=21;i++)
        {
          table.rows[i].cells[2].innerText = this.getTime(i+21);
          let x = document.createElement("INPUT");
          x.setAttribute("type", "checkbox");
          x.setAttribute("id", "checkBox"+(i+21));
          table.rows[i].cells[3].addEventListener("click", () =>{
            let timeSelect = document.querySelector("#checkBox" +(i+21));
            if(timeSelect.checked)
            {
              timeSelect.checked = false;
            }
            else
            {
              timeSelect.checked = true;
            }
          })
          x.addEventListener("click", () => {
            let timeSelect = document.querySelector("#checkBox" +(i+21));
            if(timeSelect.checked)
            {
              timeSelect.checked = false;
            }
            else
            {
              timeSelect.checked = true;
            }
          })
          table.rows[i].cells[3].appendChild(x);

        }

        //the third for loop that allows for the third table column.
        for(let i=1;i<=12;i++)
        {
          table.rows[i].cells[4].innerText = this.getTime(i + 42);
          let x = document.createElement("INPUT");
          x.setAttribute("type", "checkbox");
          x.setAttribute("id", "checkBox"+(i+42));
          table.rows[i].cells[5].addEventListener("click", () =>{
            let timeSelect = document.querySelector("#checkBox" +(i+42));
            if(timeSelect.checked)
            {
              timeSelect.checked = false;
            }
            else
            {
              timeSelect.checked = true;
            }
          })
          x.addEventListener("click", () => {
            let timeSelect = document.querySelector("#checkBox" +(i+42));
            if(timeSelect.checked)
            {
              timeSelect.checked = false;
            }
            else
            {
              timeSelect.checked = true;
            }
          })
          table.rows[i].cells[5].appendChild(x);

        }
      }
    else if(document.querySelector("#TimeTable").firstChild)
    {
      let table = document.querySelector("#TimeTable");
      while(table.firstChild)
      {
        table.removeChild(table.firstChild);
      }
    }

  }
}
