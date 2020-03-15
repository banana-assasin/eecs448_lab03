
//EventList controls the #Events table on attendee.html It can also be used for the admins to see only their events later too.

class EventList
{
  constructor(eventDisplayer)
  {
    this.eventDisplayer = eventDisplayer; //EventDisplayer object - the table that holds specific times for a single event.
    this.table = document.querySelector("#Events"); //the table that holds the list of all events.
    this.destroyEvents(); //ensure that the table starts empty
    this.storageManager = new StorageManager();
    this.eventArray = this.storageManager.retrieveAll();
    this.checkNumberOfElements(); //updates the value of this.numberOfEvents
    this.present = true; //this.present should be true when the table is visible, false if it isn't
  }

  // Updates the value of this.numberOfEvents, the number of events that the table should display
	//@pre none
	//@post number of events on the table correctly refects the number of events in local storage.
  checkNumberOfElements()
  {
    this.numberOfEvents = this.eventArray.length;
  }


  //@post the Events table gets a header row with column labels

  createHeader()
  {
    this.table.insertRow(0);
    this.table.rows[0].innerHTML="<th>Event Name</th> <th>Date</th> <th>Organizer</th> <th>Number of Possible Attendees (Including the Author)</th> <th>Public vs Private</th> <th>Join?</th>"
  }


  //@pre There should be a header before this is called
  //@post Creates this.numberOfEvents new rows to #Events. These are then filled with events created by the user or the dummy file.
  createBody()
  {
    for(let i = 1; i<=this.numberOfEvents;i++)
    {
      this.table.insertRow(i);
      this.table.rows[i].insertCell(0);
      this.table.rows[i].insertCell(1);
      this.table.rows[i].insertCell(2);
      this.table.rows[i].insertCell(3);
      this.table.rows[i].insertCell(4);
      this.table.rows[i].insertCell(5);
      this.table.rows[i].cells[0].innerText = this.eventArray[i-1].eventName;//grabs the event name from local storage
      this.table.rows[i].cells[1].innerText = this.eventArray[i-1].getDateString(true);//grabs the date from local storage with '/' in it
      this.table.rows[i].cells[2].innerText = this.eventArray[i-1].author;//grabs the author name from local storage
      this.table.rows[i].cells[3].innerText = this.eventArray[i-1].getMaxAttendeeCount();//grabs max number of attendees from local storage
      if(this.eventArray[i-1].password=="")
      {
        this.table.rows[i].cells[4].innerText = "Public";
      }
      else
      {
        this.table.rows[i].cells[4].innerText = "Private";
      }

      let x = document.createElement("INPUT");

      if(this.table.rows[i].cells[4].innerText=="Private")
      {
        let y = document.createElement("INPUT");
        y.setAttribute("type", "text");
        y.setAttribute("id", "passwordInput"+i);
        this.table.rows[i].cells[5].innerText = "Password:   ";
        this.table.rows[i].cells[5].appendChild(y);
        x.setAttribute("type", "button");
        x.setAttribute("value", "Submit Password");
        x.setAttribute("id", "button"+i)
        this.table.rows[i].cells[5].appendChild(x); //Moves the Join event button into the last cell in the row
      }else{
        let x = document.createElement("INPUT"); //Creates a Join event button with dynamically created id
        x.setAttribute("type", "button");
        x.setAttribute("value", "Select Event");
        x.setAttribute("id", "button"+i)
        this.table.rows[i].cells[5].appendChild(x); //Moves the Join event button into the last cell in the row
      }

    }
    this.buttonListeners(); //Activates the eventListeners on all the created buttons
  }


  //@pre #Events is an empty table without rows
  //@post #Events is filled with rows that display events (and dummy events)
  createTable()
  {
    this.checkNumberOfElements();
    this.createHeader();
    this.createBody();
  }


  //@pre none
  //@post removes the event rows.
  destroyEvents()
  {
    while(this.table.firstChild)
    {
      this.table.removeChild(this.table.firstChild);
    }
  }

  //@pre The buttons must exist, ie createBody() has been run
  //@post All the buttons have an event listener that calls eventDisplayer.place() when clicked. In addition, it activates the eventListeners for eventDisplayer

  buttonListeners()
  {
    for(let i=1;i<=this.numberOfEvents;i++)
    {
      document.querySelector("#button"+ i ).addEventListener("click", ()=>
      {

        if(this.eventDisplayer.present){
          this.eventDisplayer.remove();
        }

        this.eventDisplayer.n = i+1;

        if(this.eventArray[i-1].password != ""){//checks to make sure the password is correct if the event is private
          let table = document.querySelector("#Events");
            let passwordField = table.tBodies[0].rows[this.eventDisplayer.n-1].cells[5].children[0].value;
            if(passwordField != this.eventArray[i-1].password){
              this.eventDisplayer.placeErrorMessage("INCORRECT PASSWORD FOR THIS EVENT");
            }else{
              this.eventDisplayer.removeErrorMessage();
              this.eventDisplayer.event = this.eventArray[i-1];
              this.eventDisplayer.place();
              this.eventDisplayer.obtainEvent(this.eventArray[i-1]);
            }
        }else{
          this.eventArray = this.storageManager.retrieveAll();
          this.eventDisplayer.event = this.eventArray[i-1];
          this.eventDisplayer.place();
          this.eventDisplayer.obtainEvent(this.eventArray[i-1])
        }

        if(!this.eventDisplayer.listening)
        {
          this.eventDisplayer.buttonListeners()
        }
      })
    }
  }

//  @pre none
//  @post #Events no longer appears on the document.
  hide()
  {
    document.querySelector("#Events").style.display = "none";
    this.present = false;
  }

  //@pre none
  //@post #Events is displayed
  find()
  {
    document.querySelector("#Events").style.display = "table";
    this.present = true;
  }
}


//Controls the calendar in attendee.html
class Calendar
{
 // @pre none
 // @post A calendar is created and hidden. The calendar is made inside of the table #Calendar.
  constructor()
  {
    this.calendar = document.querySelector("#Calendar");
    this.destroyCalendar();
    this.month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October","November", "December"];
    this.date = new Date();
    this.tempDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
    this.row = 2;
    this.column = 0;
    this.currentDay = 2;
    this.createCalendar();
    this.hide();
  }


  //@pre The calendar is destroyed
  //@post Creates the calendar's rows and header. Calls upon createDays() to fill the cells with the numbers that should be there
  createCalendar()
  {
    this.calendar.insertRow(0);
    this.calendar.rows[0].innerHTML="<th id='Month' colspan=7><button id ='previousMonth'>Previous Month</button> <span id='monthDisplay'></span> <button id='nextMonth'>Next Month</button></th>";
    this.previous=document.querySelector("#previousMonth");
    this.next = document.querySelector("#nextMonth");
    document.querySelector("#monthDisplay").innerText=this.month[this.date.getMonth()] + " " + this.date.getFullYear();
    this.calendar.insertRow(1);
    this.calendar.rows[1].innerHTML="<th>Sunday</th> <th>Monday</th> <th>Tuesday</th> <th>Wednesday</th> <th>Thursday</th> <th>Friday</th> <th>Saturday</th>";
    for(let i = 2;i<=7;i++)
    {
      this.calendar.insertRow(i);
      for(let j = 0;j<7;j++)
      {
        this.calendar.rows[i].insertCell(j);
      }
    }
    this.calendar.rows[7].style.height="36px";
    this.createDays();
  }


//  @pre The rows must already be in place
//  @post Fills in the cells of the table with numbers to make a real valid calendar.
//  Note - Currently the only way to change the month requires deleting and recreating the calendar.
  createDays()
  {
    this.currentDay=2
    this.row=2;
    this.col=0;
    this.tempDate.setFullYear(this.date.getFullYear(), this.date.getMonth(), 1);
    while(this.tempDate.getMonth() == this.date.getMonth())
    {
      this.col = this.tempDate.getDay();
      this.calendar.rows[this.row].cells[this.col].innerText = this.tempDate.getDate();
      if(this.tempDate.getDay()==6)
      {
        this.row = this.row+1;
      }
      this.tempDate.setDate(this.currentDay);
      this.currentDay = this.currentDay + 1;
    }
    if((this.row == 7 && this.col == 6) || this.row < 7)
    {
      document.querySelector("#Calendar").rows[7].remove();
    }
  }


//  @pre none
//  @post destroys the calendar.
  destroyCalendar()
  {
    while(this.calendar.firstChild)
    {
      this.calendar.removeChild(this.calendar.firstChild);
    }
  }


//  @pre none
//  @post #Calendar is no longer displayed.
hide()
  {
    document.querySelector("#Calendar").style.display = "none";
    this.present = false;
  }


//  @pre none
//  @post #Calendar is once again displayed on the DOM
  find()
  {
    document.querySelector("#Calendar").style.display = "table";
    this.present = true;
  }
}


//Controls the Small table that displays one individual event. When displayed it will sit inside of a cell that spans an entire row in #Events
class EventDisplayer
{

//  @pre None
//  @post The table is created and then hidden. In addition the buttons inside the table are tracked before they are removed so that adding an eventListener never fails
  constructor()
  {
    this.present = true;
    this.n = 0;
    this.listening = false;
    this.createTable();
    this.confirm = document.querySelector("#confirm");
    this.cancel = document.querySelector("#cancel");
    if(!document.querySelector("#joinedEvents"))
    {
      this.remove()
    }
  }


  //@pre The table doesnt already exist
  //@post The table is created with Header cells in the leftmost column and buttons to submit the changes or cancel them.

  createTable() // n = the row of eventList whose button was pressed.
  {
    this.eventTable = document.querySelector("#eventTable");
    for(let i = 0;i<4;i++)
    {
      this.eventTable.insertRow(i);
    }
    this.eventTable.rows[0].innerHTML = "<th>Time</th>";
    this.eventTable.rows[1].innerHTML = "<th>Number Attending</th>";
    this.eventTable.rows[2].innerHTML = "<th>Join This Time?</th>";
    this.eventTable.rows[3].setAttribute("id", "buttonRow");
    this.eventTable.rows[3].insertCell(0);
    /*this.eventTable.rows[4].insertCell(0);*/
    let x = document.createElement("INPUT");
    x.setAttribute("id", "confirm");
    x.setAttribute("type", "button");
    x.setAttribute("value", "Apply");
    this.eventTable.rows[3].cells[0].appendChild(x);//adding a confirm or "apply" button
    x = document.createElement("INPUT");
    x.setAttribute("id", "cancel");
    x.setAttribute("type", "button");
    x.setAttribute("value", "Cancel / Close");
    this.eventTable.rows[3].cells[0].appendChild(x);//adding a cancel or close button.
  }


  //@pre None
  //@post Destroys the table. Not currently necessary
  destroyTable()
  {
    if(this.present)
    {
      let listTable = document.querySelector("#Events");
      this.present = false;
      listTable.deleteRow(this.n);
    }
  }

//  @pre None
//  @post Adds event listeners to the confirm and cancel buttons.

  buttonListeners()
  {
    this.listening = true;
    this.confirm.addEventListener("click", ()=>{this.addUser();this.listening = true;}); //temporary
    this.cancel.addEventListener("click", () => {this.remove();this.listening = false;});
  }


  //@pre None
  //@post removes the Table from the DOM.
  remove()
  {
    if(this.present)
    {
      this.eventTable.remove();
      if(document.querySelector("#Events"))
      {
        document.querySelector("#Events").deleteRow(this.n);
      }
      else
      {
        if(document.querySelector("#No"+joinedEvents.currentEventNum))
        {
          document.querySelector("#No"+joinedEvents.currentEventNum).click();
        }
        if(this.n != -1)
        {
          document.querySelector("#joinedEvents").deleteRow(this.n);
        }
      }
      this.present = false;
      /*this.eventTable.rows[4].cells[0].innerText = "";*/
    }
  }


  //@pre none.
  //@post places the table into a newly created row in #Events.
  place() //places the table in the this.n th row
  {
    if(document.querySelector("#Events"))
    {
      this.listTable = document.querySelector("#Events");
    }
    else
    {
      this.listTable = document.querySelector("#joinedEvents");
    }
    this.listTable.insertRow(this.n);
    this.listTable.rows[this.n].innerHTML = "<td colspan = 6></td>";
    this.listTable.rows[this.n].cells[0].appendChild(this.eventTable);
    this.present = true;
    if(this.eventTable.rows[4])
    {
      this.eventTable.deleteRow(4);
    }
  }
  //presents an error message to the user when something goes wrong
  placeErrorMessage(message){
    if(document.querySelector("#Events"))
    {
      this.listTable = document.querySelector("#Events");
    }
    else
    {
      this.listTable = document.querySelector("#joinedEvents");
    }
    this.listTable.insertRow(this.n);
    this.listTable.rows[this.n].innerHTML = "<td colspan = 6></td>";
    this.listTable.rows[this.n].cells[0].innerText = message;
    this.present = true;
  }
  //removes the error message when the error is resolved
  removeErrorMessage(){
    if(this.present){
      if(this.document.querySelector("#Events"))
      {
        this.listTable = document.querySelector("#Events").deleteRow(this.n);
      }
      else
      {
        this.listTable = document.querySelector("#joinedEvents").deleteRow(this.n);
      }
      this.present = false;
    }
  }

  //@pre called when a join event button is pressed
  //@variable event - an event object passed in from eventList
  //@post sets the current event so its info can be extracted and displayed

  obtainEvent(event)
  {
    this.event = event;
    let sm = new StorageManager();
    let myAccount = sm.getCurrentAccount();

    while(this.eventTable.rows[0].cells[1])
    {
      this.eventTable.rows[0].removeChild(this.eventTable.rows[0].cells[1]);
      this.eventTable.rows[1].removeChild(this.eventTable.rows[1].cells[1]);
      this.eventTable.rows[2].removeChild(this.eventTable.rows[2].cells[1]);
      // this.eventTable.rows[4].removeChild(this.eventTable.rows[4].cells[1]);
    }
    if(this.eventTable.rows[4])
    {
      this.eventTable.deleteRow(4);
    }

    //this for loop adds all of the times selected by the creator to the table that the attendees can see as well as the rows, cells, and selection checkboxes that go along with that. It also takes into account if the user has selected to view times in a specific mode.
    for(let i=1;i<=this.event.times.length;i++)
    {
      this.eventTable.rows[0].insertCell(i);
      if(timeMode)
      {
        this.eventTable.rows[0].cells[i].innerText = event.times[i-1];
      }
      else
      {
        let ampm = event.times[i-1];
        if(parseInt(ampm)<=12)
        {
          this.eventTable.rows[0].cells[i].innerText = ampm + " a.m.";
        }
        else
        {
          ampm = ampm.substr(2);
          ampm = parseInt(event.times[i-1])-12 + ampm + " p.m.";
          this.eventTable.rows[0].cells[i].innerText = ampm;
        }

      }
      this.eventTable.rows[1].insertCell(i);
      this.eventTable.rows[1].cells[i].innerText = this.event.getAttendeeByTime(this.event.times[i-1]);//Dont know how thisll happen yet.
      this.eventTable.rows[2].insertCell(i);
      /*this.eventTable.rows[4].insertCell(i);*/
      let x=document.createElement("INPUT");
      x.setAttribute("type", "checkbox");
      x.setAttribute("id", "checkBox"+i);
      for(let j of event.attendees)
      {
        if(j.userName==sm.getCurrentAccount()&&j.checkTime(event.times[i-1]))
        {
          x.checked = true;
        }
      }
      //lets the user click anywhere inside of the cell instead of having to click specifically inside of the checkbox.
      this.eventTable.rows[2].cells[i].addEventListener("click", () =>{
        if(x.checked)
        {
          x.checked = false;
        }
        else
        {
          x.checked = true;
        }
      })
      x.addEventListener("click", () => {
        if(x.checked)
        {
          x.checked = false;
        }
        else
        {
          x.checked = true;
        }
      })
      if(myAccount == this.event.author)
      {
        x.checked = true;
        x.addEventListener("click", () => {x.checked = !x.checked});
      }
      this.eventTable.rows[2].cells[i].appendChild(x);
    }


    if(document.querySelector("#buttonRow"))
    {
      document.querySelector("#buttonRow").cells[0].setAttribute("colspan", this.event.times.length+1);
    }
    /*this.eventTable.rows[4].cells[0].setAttribute("colspan", this.event.times.length+1)*/
  }

  //this function allows users to add themselves to events. If they haven't logged in it will output an error message and ask them to log in before joining events.
  //if they are logged in it stores their selected times and links it to the event that they have elected to join.
  addUser(){

    let sm = new StorageManager();
    let userName = sm.getCurrentAccount();

    if(userName == ""){
      if(!this.eventTable.rows[4])
      {
        this.eventTable.insertRow(4);
        this.eventTable.rows[4].insertCell(0);
        this.eventTable.rows[4].cells[0].setAttribute("colspan", this.event.times.length+1)
      }
      this.eventTable.rows[4].cells[0].innerText = "We don't know your name! Please log in to join event.";
      return;
    }else if(userName == this.event.author){
      if(!this.eventTable.rows[4])
      {
        this.eventTable.insertRow(4);
        this.eventTable.rows[4].insertCell(0);
        this.eventTable.rows[4].cells[0].setAttribute("colspan", this.event.times.length+1)
      }
      this.eventTable.rows[4].cells[0].innerText = "You are the creator of this event, to change times please go to Manage Events.";
      return;
    }else{
      /*this.eventTable.rows[4].cells[0].innerText = "";*/
    }


    let eventArray = sm.retrieveAll();
    let timesSelected = [];
    let selectedABox = false;

    for(let e of eventArray){
      if(e.eventName == this.event.eventName){
        for(let j = 1; j<= this.event.times.length; j++){
          if(this.eventTable.rows[2].cells[j].children[0].checked){
            selectedABox = true;
            timesSelected.push(this.event.times[j-1]);
          }
        }
        let userObject = new User(userName, timesSelected);
        if(selectedABox){
          e.addUser(userObject);
          if(!this.eventTable.rows[4])
          {
            this.eventTable.insertRow(4);
            this.eventTable.rows[4].insertCell(0);
            this.eventTable.rows[4].cells[0].setAttribute("colspan",this.event.times.length+1)
          }
          this.eventTable.rows[4].cells[0].innerText = "Successfully added/updated time(s) available for event. You are a part of this event.";
        }
        else if(document.querySelector("#joinedEvents"))
        {
          if(!this.eventTable.rows[4])
          {
            this.eventTable.insertRow(4);
            this.eventTable.rows[4].insertCell(0);
            this.eventTable.rows[4].cells[0].setAttribute("colspan",this.event.times.length+1)
          }
          this.eventTable.rows[4].cells[0].innerText = "Changes not saved. If you would like to leave an event please us the leave event button.";
        }
        else{
          for(let a of e.attendees){
            if(a.userName == userObject.userName){
              e.removeUser(a.userName);
            }
          }
          if(!this.eventTable.rows[4])
          {
            this.eventTable.insertRow(4);
            this.eventTable.rows[4].insertCell(0);
            this.eventTable.rows[4].cells[0].setAttribute("colspan",this.event.times.length+1)
          }
          this.eventTable.rows[4].cells[0].innerText = "You selected no times so you are NOT a part of this event.";
          /*if(document.querySelector("#joinedEvents"))
          {
            joinedEvents.leaveEvent(joinedEvents.currentEventNum);
          }*/

        }
        sm.storeEvent(e);
      }
    }
    if(document.querySelector("#Events"))
    {
      document.querySelector("#Events").rows[(this.n)-1].cells[3].innerText = eventArray[this.n-2].getMaxAttendeeCount();
    }
    this.event = sm.retrieveEvent(sm.getEventId(this.event.eventName));
    for(let e =0;e< this.event.times.length;e++)
    {
      this.eventTable.rows[1].cells[e+1].innerText = this.event.getAttendeeByTime(this.event.times[e]);//Dont know how thisll happen yet.
    }

  }
}
