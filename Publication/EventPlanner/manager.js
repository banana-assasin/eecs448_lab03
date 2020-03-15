//OwnedEvents allows for the user to interact with a table of the events that the user created.
//The user may view the current attendees and the time they will attend, they may add or remove time slots to the event, and they can delete the event.

class OwnedEvents
{
  constructor()
  {
    this.sm = new StorageManager();
    this.table = document.querySelector("#createdEvents");
    this.allEvents = sm.retrieveAll();
    this.getAccount();
    this.createInnerTables();
  }

  //@pre userTable and timeTable havent been created. Called by the constructor
  //@post userTable and timeTable are created as empty tables. their presence is set to false;
  createInnerTables()
  {
    this.userTable = document.createElement("TABLE");
    this.userTablePresence = false;
    this.timeTable = document.createElement("TABLE");
    this.timeTablePresence = false;
  }

  // this function generates the table if there is a user logged in.
  //@pre None
  //@post this.accountName is set as the currently logged in account username. If not logged in, then it is set to "";
  //@post If there is an account logged in, this.account is set to the logged in account object. The table is then generated.
  getAccount()
  {
    this.accountName = sm.getCurrentAccount();
    if(this.accountName!="")
    {
      this.account = sm.retrieveAccount(sm.getAccountId(this.accountName));
      this.createHeader();
      this.account.updateEventsCreated();
      this.createBody();
    }
  }

  // This function creates the header of the table.
  //@pre There must be an account logged in.
  //@post The table has one row with header cells.
  createHeader()
  {
    document.querySelector("#createdTitle").innerText = "Events Created by You";
    this.table.insertRow(0);
    this.table.rows[0].innerHTML = "<th>Event Name</th><th>Date</th><th>Possible Number of Participants (Including You)</th><th>View Time Breakdown</th>";
  }

  // This function creates the body of the created event table.
  //@pre there must be an account logged in and a table header present
  //@post Dynamically generates a row in the table for every event the user created. Adds a button for the user to make changes to the time availability, and a button to delete the event permanenty.

  createBody()
  {
    for(let i = 1;i<=this.account.eventsCreated.length;i++)
    {
      this.table.insertRow(i);
      for(let j = 0; j<4;j++)
      {
        this.table.rows[i].insertCell(j);
      }
      let event = this.sm.retrieveEvent(sm.getEventId(this.account.eventsCreated[i-1]));
      let eventNum = sm.getEventId(this.account.eventsCreated[i-1]);
      this.table.rows[i].setAttribute("id", "row"+eventNum);
      this.table.rows[i].cells[0].innerText = event.eventName;
      this.table.rows[i].cells[1].innerText = event.getDateString(true);
      this.table.rows[i].cells[2].innerText = event.getMaxAttendeeCount();

      //create button to view attendees of an event.
      let x = document.createElement("INPUT");
      x.setAttribute("id", "viewUsers"+eventNum);
      x.setAttribute("type", "button");
      x.setAttribute("value", "View Users");
      this.table.rows[i].cells[3].appendChild(x);
      x.addEventListener("click", ()=>{this.closeTables(); this.viewUsers(eventNum)})


      //create button to see edit the times of the event
      x = document.createElement("INPUT");
      x.setAttribute("id", "editTimes"+eventNum);
      x.setAttribute("type", "button");
      x.setAttribute("value", "Edit Times");
      x.addEventListener("click", ()=>{this.closeTables(); this.viewTimes(eventNum)});
      this.table.rows[i].cells[3].appendChild(x);


      //create button to delete the event
      x = document.createElement("INPUT")
      x.setAttribute("id", "delete"+eventNum);
      x.setAttribute("type", "button");
      x.setAttribute("value", "Delete Event");
      this.table.rows[i].cells[3].appendChild(x);


      //create span to contain a warning about deleting events.
      x = document.createElement("SPAN");
      x.setAttribute("id", "ownedWarning"+eventNum);
      x.innerText = "";
      this.table.rows[i].cells[3].appendChild(x);
      document.querySelector("#delete"+eventNum).addEventListener("click", ()=>
      {
        this.closeTables();
        this.deleteEvent(eventNum);
      })
    }
  }


  //@pre User must have clicked on the "Edit Times" button
  //@param "eventNum" - a unique identifier for each event joined. Set based on the eventId of the event upon generation of the table. Not necessarily still the eventId because events get deleted.
  //@post Creates a smaller table in which the user can view the times they have selected and decide to create more times, or delete some of the current times.
  viewTimes(eventNum)
  {
    let parentRow = document.querySelector("#row"+eventNum);
    let event = sm.retrieveEvent(sm.getEventId(parentRow.cells[0].innerText));
    this.table.insertRow(parentRow.rowIndex+1);
    this.table.rows[parentRow.rowIndex+1].insertCell(0);
    this.table.rows[parentRow.rowIndex+1].cells[0].setAttribute("colspan", 4)
    this.table.rows[parentRow.rowIndex+1].cells[0].appendChild(this.timeTable);
    while(this.timeTable.rows[0])
    {
      this.timeTable.deleteRow(0);
    }
    for(let i =0;i<4;i++)
    {
      this.timeTable.insertRow(i);
    }
    this.timeTable.rows[0].innerHTML = "<th>Time</th>";
    this.timeTable.rows[1].innerHTML = "<th>Number of attendees (Including You)</th>";
    this.timeTable.rows[2].innerHTML = "<th>Delete Time Slot?</th>";
    this.timeTable.rows[3].insertCell(0);
    this.timeTable.rows[3].cells[0].setAttribute("colspan", event.times.length+2);

    //Create a button to close the timeTable
    let x = document.createElement("INPUT");
    x.setAttribute("id" , "closeTimeTable");
    x.setAttribute("type", "button");
    x.setAttribute("value", "Stop Editing Times");
    x.addEventListener("click", ()=>{this.closeTables()});
    this.timeTable.rows[3].cells[0].appendChild(x);

    for(let i in event.times)
    {
      let realI = parseInt(i);
      this.timeTable.rows[0].insertCell(realI+1);
      this.timeTable.rows[1].insertCell(realI+1);
      this.timeTable.rows[2].insertCell(realI+1);

      this.timeTable.rows[0].cells[realI+1].innerText = event.times[realI];
      this.timeTable.rows[1].cells[realI+1].innerText = event.getAttendeeByTime(event.times[realI]);

      //Create a button to delete an event the user owns
      x = document.createElement("INPUT");
      x.setAttribute("type", "button");
      x.setAttribute("id", "deleteTime"+i);
      x.setAttribute("value", "Delete Time");
      x.addEventListener("click", ()=>
      {
        if(document.querySelector("#deleteTime"+i).value == "Delete Time")
        {
          document.querySelector("#deleteTime"+i).value = "Confirm";
        }
        else
        {
          let eventDeleted = false;
          let timesLengthIsOne = false;
          if(event.times.length == 1)
          {
            timesLengthIsOne = true;
            this.closeTables();
            eventDeleted = this.deleteEvent(eventNum);
            if(!eventDeleted){
              let warning = document.querySelector("#ownedWarning"+eventNum);
              warning.innerText = " Do you want to delete this event? (Note that an event must have at least one time slot for it to exist.)";
              return;
            }
          }
          if(!timesLengthIsOne){
            let col = document.querySelector("#deleteTime"+i).parentElement.cellIndex
            event.removeTime(this.timeTable.rows[0].cells[col].innerText);
            sm.storeEvent(event);
            for(let j=0;j<3;j++)
            {
              this.timeTable.rows[j].deleteCell(col);
            }
            this.timeTable.rows[3].cells[0].setAttribute("colspan", event.times.length+2);
          }
        }
      })
      this.timeTable.rows[2].cells[realI+1].appendChild(x);
    }
    while(this.timeTable.rows[0].cells[event.times.length+1])
    {
      this.timeTable.rows[1].deleteCell(event.times.length+1)
      this.timeTable.rows[2].deleteCell(event.times.length+1)

    }
    this.timeTable.rows[0].insertCell(event.times.length+1);
    this.timeTable.rows[0].cells[event.times.length+1].innerText = "Add Another Time Slot";
    this.timeTable.rows[1].insertCell(event.times.length+1);
    this.timeTable.rows[1].cells[event.times.length+1].setAttribute("id", "timeBox");

    //Create a dropdown box to select what hour to add an event slot
    x = document.createElement("SELECT");
    x.setAttribute("id", "hour")
    let hours = [];
    if(timeMode)
    {
      hours = ["05","06","07","08","09","10","11","13","14","15","16","17","18","19","20","21","22","23"];
    }
    else
    {
      hours = ["01","02","03","04","05","06","07","08","09","10","11","12"]
    }
    for(let y of hours)
    {
      //create an option to add to the hour dropdown box
      let option = document.createElement("OPTION");
      option.innerText = y;
      x.appendChild(option);
    }
    this.timeTable.rows[1].cells[event.times.length+1].appendChild(x);

    //create a dropdown box to select what minute you want to add an event slot to
    x = document.createElement("SELECT")
    x.setAttribute("id", "minutes");
    let minutes = ["00","20","40"]
    for(let y of minutes)
    {
      //create an option to add to the minute dropdown box
      let option = document.createElement("OPTION");
      option.innerText = y;
      x.appendChild(option);
    }
    this.timeTable.rows[1].cells[event.times.length+1].appendChild(x);

    if(!timeMode)
    {
      //If in 12 hour time, create a dropdown box to choose whether to add a time slot in the am or pm
      x = document.createElement("SELECT");
      x.setAttribute("id", "ampm");

      //create an option (am) for the am/pm dropdown box
      let option = document.createElement("OPTION");
      option.innerText = "AM";
      x.appendChild(option);

      //create an option (pm) for the am/pm dropdown box
      option = document.createElement("OPTION");
      option.innerText = "PM";
      x.appendChild(option);
      this.timeTable.rows[1].cells[event.times.length+1].appendChild(x);
    }

    this.timeTable.rows[2].insertCell(event.times.length+1);

    //create a button to confirm and add the selected time slot to the event
    x = document.createElement("INPUT");
    x.setAttribute("type", "button")
    x.setAttribute("id", "addTime");
    x.setAttribute("value", "Add Time");
    x.addEventListener("click", ()=>{this.addTime(eventNum)});
    this.timeTable.rows[2].cells[event.times.length+1].appendChild(x);

    //create a span to display an error message if necessary. Message starts as an empty string
    x = document.createElement("SPAN");
    x.setAttribute("id", "timeError");
    x.innerText = "";
    this.timeTable.rows[2].cells[event.times.length+1].appendChild(x);


    this.timeTablePresence =true;
    this.timeTableRow = parentRow.rowIndex+1;
    this.timeTableEvent = event;
    this.refreshTimes();
  }


  //@pre User must have clicked on the "View Users" button
  //@param "eventNum" - a unique identifier for each event joined. Set based on the eventId of the event upon generation of the table. Not necessarily still the eventId because events get deleted.
  //@post creates a smaller table in which the user can view each of the users, along with the times they are planning on attending.
  viewUsers(eventNum)
  {
    let parentRow = document.querySelector("#row"+eventNum);
    let event = sm.retrieveEvent(sm.getEventId(parentRow.cells[0].innerText));
    this.table.insertRow(parentRow.rowIndex+1);
    this.table.rows[parentRow.rowIndex+1].insertCell(0);
    this.table.rows[parentRow.rowIndex+1].cells[0].setAttribute("colspan", "4")
    if(event.getAttendeeCount() >1)
    {
      this.table.rows[parentRow.rowIndex+1].cells[0].appendChild(this.userTable);
      while(this.userTable.rows[0])
      {
        this.userTable.deleteRow(0);
      }
      this.userTable.insertRow(0);
      this.userTable.rows[0].innerHTML = "<th></th>";
      this.userTable.rows[0].cells[0].innerText = "Times \\ Users"
      for(let i in event.attendees)
      {
        let user = event.attendees[i].userName;
        this.userTable.rows[0].innerHTML = this.userTable.innerHTML + "<th>"+user+"</th>";
      }
      let user = sm.getCurrentAccount();
      this.userTable.rows[0].innerHTML = this.userTable.innerHTML + "<th>"+user+"</th>";
      for(let i in event.times)
      {
        let realI = parseInt(i);
        this.userTable.insertRow(realI+1);

        let time = 0;
        if(timeMode) //get time in 12 or 24 hour mode based on page's button
        {
          time = event.times[i];
        }
        else
        {
          let ampm = event.times[i];
          if(parseInt(ampm)<=12)
          {
            time = ampm + " a.m.";
          }
          else
          {
            ampm = ampm.substr(2);
            ampm = parseInt(event.times[i])-12 + ampm + " p.m.";
            time = ampm;
          }
        }

        this.userTable.rows[realI+1].innerHTML = "<th>"+time+"</th>";

        //create a checkbox to display that the creator of an event attends every time slot
        let x = document.createElement("INPUT")
        x.setAttribute("type", "checkbox");
        x.checked = true;
        x.addEventListener("click", ()=>{x.checked = !x.checked}); //makes it so that clicking the checkbox doesn't change its value;
        this.userTable.rows[realI+1].insertCell(1);
        this.userTable.rows[realI+1].cells[1].appendChild(x);

        for(let j in event.attendees)
        {
          let realJ = parseInt(j);

          //create a checkbox to display whether a user is attending an event at a given time slot
          let x = document.createElement("INPUT")
          x.setAttribute("type", "checkbox");
          x.checked = event.attendees[realJ].checkTime(event.times[realI]);
          x.addEventListener("click", ()=>{x.checked = !x.checked}); //makes it so that clicking the checkbox doesn't change its value;
          this.userTable.rows[realI+1].insertCell(realJ+1);
          this.userTable.rows[realI+1].cells[realJ+1].appendChild(x);
        }
      }
      this.userTable.insertRow(event.times.length+1);
      this.userTable.rows[event.times.length+1].insertCell(0);
      this.userTable.rows[event.times.length+1].cells[0].setAttribute("colspan", event.attendees.length+2);

      //create a button to close the userTable
      let x = document.createElement("INPUT");
      x.setAttribute("id", "closeUserTable");
      x.setAttribute("type", "button");
      x.setAttribute("value", "Stop Viewing Users");
      x.addEventListener("click", ()=>{this.closeTables()});
      this.userTable.rows[event.times.length+1].cells[0].appendChild(x);
    }
    else
    {
      this.table.rows[parentRow.rowIndex+1].cells[0].innerText = "You are currently the only attendee. Invite your friends and check back later!";
    }
    this.userTablePresence = true;
    this.userTableRow = parentRow.rowIndex+1;
    this.userTableEvent = event;
  }

  //@pre can be called multiple ways, always by pressing a button of some kind
  //@post whichever of userTable and timeTable (if any) is present gets removed from the page, and the row it occupied gets deleted
  closeTables()
  {
    if(this.userTablePresence)
    {
      this.userTable.remove();
      this.table.deleteRow(this.userTableRow);
      this.userTablePresence = false;
    }
    if(this.timeTablePresence)
    {
      this.timeTable.remove();
      this.table.deleteRow(this.timeTableRow);
      this.timeTablePresence = false;
    }
  }


  // @pre user clicks the 12/24 hour button.
  // @post The times displayed in the viewUser and viewTimes tables switch if they display in 12 or 24 hour mode.
  refreshTimes()
  {
    if(this.userTablePresence)
    {
      for(let i = 0;i<this.userTableEvent.times.length;i++)
      {
        let time = 0;
        if(timeMode) //get time in 12 or 24 hour mode based on page's button
        {
          time = this.userTableEvent.times[i];
        }
        else
        {
          let ampm = this.userTableEvent.times[i];
          if(parseInt(ampm)<=12)
          {
            time = ampm + " a.m.";
          }
          else
          {
            ampm = ampm.substr(2);
            ampm = parseInt(this.userTableEvent.times[i])-12 + ampm + " p.m.";
            time = ampm;
          }
        }
        this.userTable.rows[i+1].cells[0].innerText = time;
      }

    }
    else if(this.timeTablePresence)
    {
      for(let i = 0;i<this.timeTableEvent.times.length;i++)
      {
        let time = 0;
        if(timeMode) //get time in 12 or 24 hour mode based on page's button
        {
          time = this.timeTableEvent.times[i];
        }
        else
        {
          let ampm = this.timeTableEvent.times[i];
          if(parseInt(ampm)<=12)
          {
            time = ampm + " a.m.";
          }
          else
          {
            ampm = ampm.substr(2);
            ampm = parseInt(this.timeTableEvent.times[i])-12 + ampm + " p.m.";
            time = ampm;
          }
        }
        this.timeTable.rows[0].cells[i+1].innerText = time;

        let timeBox = document.querySelector("#timeBox");
        while(timeBox.firstChild)
        {
          timeBox.removeChild(timeBox.firstChild)
        }

        //Create a dropdown box to select what hour to add an event slot
        let x = document.createElement("SELECT");
        x.setAttribute("id", "hour")
        let hours = [];
        if(timeMode)
        {
          hours = ["05","06","07","08","09","10","11","13","14","15","16","17","18","19","20","21","22","23"];
        }
        else
        {
          hours = ["01","02","03","04","05","06","07","08","09","10","11"]
        }
        for(let y of hours)
        {
          //create an option to add an hour to the "hour" dropdown box
          let option = document.createElement("OPTION");
          option.innerText = y;
          x.appendChild(option);
        }
        timeBox.appendChild(x);

        //create a dropdown box to select what minutes to add in an event slot
        x = document.createElement("SELECT")
        x.setAttribute("id", "minutes");
        let minutes = ["00","20","40"]
        for(let y of minutes)
        {
          //create an option for the minutes dropdown box
          let option = document.createElement("OPTION");
          option.innerText = y;
          x.appendChild(option);
        }
        timeBox.appendChild(x);

        if(!timeMode)
        {
          //if in 12 hour time mode, create a dropdown box to select am/pm
          x = document.createElement("SELECT");
          x.setAttribute("id", "ampm");

          //create the am option for the ampm dropdown box
          let option = document.createElement("OPTION");
          option.innerText = "AM";
          x.appendChild(option);

          //create the pm option for the ampm dropdown box
          option = document.createElement("OPTION");
          option.innerText = "PM";
          x.appendChild(option);
          timeBox.appendChild(x);
        }
      }
    }
  }

  // @pre The user clicks the "Add Time" button in timeTable to add a time slot to an event.
  // @param "eventNum" - a unique identifier for each event joined. Set based on the eventId of the event upon generation of the table. Not necessarily still the eventId because events get deleted.
  // @post If the time is valid then the time is added to event, and displayed in a new column of timeTable
  addTime(eventNum)
  {
    let timeError = document.querySelector("#timeError");
    let timeBox = document.querySelector("#timeBox");
    let column = timeBox.cellIndex;
    let hourSelected = document.querySelector("#hour");
    let minuteSelected = document.querySelector("#minutes");
    let hour = hourSelected.value;
    let minute = minuteSelected.value;
    let time = ":";
    timeError.innerText = "";
    if(!timeMode)
    {
      let ampmSelected = document.querySelector("#ampm");
      if(ampmSelected.value == "PM")
      {
        hour = ""+(parseInt(hour)+12);
      }
    }
    time = hour + time + minute;
    if(parseInt(hour)<5)
    {
      timeError.innerText = "Invalid Time! Can't start events before 5 AM.";
    }
    else if (this.timeTableEvent.isValidTime(time))
    {
      timeError.innerText = "Invalid Time! This event already has this time slot.";
    }
    else
    {
      this.timeTableEvent.addTime(time);
      sm.storeEvent(this.timeTableEvent);
      this.account.updateEventsCreated();
      this.closeTables();
      this.viewTimes(eventNum)
    }
    /*document.querySelector("#addTime").addEventListener("click", ()=>{this.addTime(eventNum)})
*/}


//  @pre User must have clicked on the "Delete Event" button
//  @param "eventNum" - a unique identifier for each event joined. Set based on the eventId of the event upon generation of the table. Not necessarily still the eventId because events get deleted.
//  @post Upon first press: Generates a warning message that this action is permanent.
//  @post Upon second press: Completely deletes the event from permanent storage (and every account). Deletes the row the button was pressed in.
  deleteEvent(eventNum)
  {

    let viewButton = document.querySelector("#viewUsers"+eventNum);
    let editButton = document.querySelector("#editTimes"+eventNum);
    let delButton = document.querySelector("#delete"+eventNum);
    viewButton.style.display = "none";
    editButton.style.display = "none";
    delButton.style.display = "none";

    let warning = document.querySelector("#ownedWarning"+eventNum);
    warning.innerText = " This action will permanenty delete this event. Are you sure you want to delete this event?";

    //create a button to confirm deleting an event
    let yesButton = document.createElement("INPUT");
    yesButton.setAttribute("id", "Yes"+eventNum);
    yesButton.setAttribute("type", "button");
    yesButton.setAttribute("value", "Yes");

    //create a button to cancel deleting an event
    let noButton = document.createElement("INPUT");
    noButton.setAttribute("id", "No"+eventNum);
    noButton.setAttribute("type", "button");
    noButton.setAttribute("value", "No");

    let row = document.querySelector("#row"+eventNum);
    row.cells[3].appendChild(yesButton);
    row.cells[3].appendChild(noButton);
    row.cells[3].appendChild(warning);

    let event = sm.retrieveEvent(sm.getEventId(row.cells[0].innerText));
    let eventName = event.eventName;

    document.addEventListener("click", (e) => {
      console.log("click");
      if(e.target != null && e.target.id == ("Yes"+eventNum)){
        console.log('yes');
        this.closeTables();
        sm.clearEvent(eventName, true);
        this.allEvents = sm.retrieveAll();
        let allAccounts = sm.retrieveAllAccounts();
        sm.storeAllAccounts(allAccounts);
        this.account.updateEventsCreated();
        row.remove();
        return true;
      }
      if(e.target != null && e.target.id == ("No"+eventNum)){
        console.log('no');
        warning.innerText = "";
        yesButton.remove();
        noButton.remove();
        viewButton.style.display = "initial";
        editButton.style.display = "initial";
        delButton.style.display = "initial";
        return false;
      }
    })
        return false;
  }
}

class JoinedEvents
{
  constructor(eventDisplayer)
  {
    this.sm = new StorageManager();
    this.eventDisplayer = eventDisplayer;
    this.table = document.querySelector("#joinedEvents");
    this.allEvents = sm.retrieveAll();
    this.getAccount();
  }

// this function generates the table if there is a user logged in.
//  @pre None
//  @post this.accountName is set as the currently logged in account username. If not logged in, then it is set to "";
//  @post If there is an account logged in, this.account is set to the logged in account object. The table is then generated.
  getAccount()
  {
    this.accountName = sm.getCurrentAccount();
    if(this.accountName!="")
    {
      this.account = sm.retrieveAccount(sm.getAccountId(this.accountName));
      this.createHeader();
      this.account.updateEventsJoined();
      this.createBody();
    }
  }

// This function creates the header of the table.
//  @pre There must be an account logged in.
//  @post The table has one row with header cells.

  createHeader()
  {
    document.querySelector("#joinedTitle").innerText = "Events You Have Joined";
    this.table.insertRow(0);
    this.table.rows[0].innerHTML = "<th>Event Name</th><th>Date</th><th>Organizer</th><th>Edit Availability / Leave Event</th>";
  }

// This function creates the body of the joined events table.
//  @pre there must be an account logged in and a table header present
//  @post Dynamically generates a row in the table for every event the user is currently joined. Adds a button for the user to make changes to the times they are available, and a button to leave the event.

  createBody()
  {
    for(let i = 1;i<=this.account.eventsJoined.length;i++)
    {
      this.table.insertRow(i);
      for(let j = 0; j<4;j++)
      {
        this.table.rows[i].insertCell(j);
      }
      let event = this.sm.retrieveEvent(sm.getEventId(this.account.eventsJoined[i-1]));
      let eventNum = sm.getEventId(event.eventName);
      this.table.rows[i].setAttribute("id", "joinedRow"+eventNum)
      this.table.rows[i].cells[0].innerText = event.eventName;
      this.table.rows[i].cells[1].innerText = event.getDateString(true);
      this.table.rows[i].cells[2].innerText = event.author;

      //create a button to open an eventDisplayer object to change availability on an event the user has joined
      let x = document.createElement("INPUT");
      x.setAttribute("id", "change"+eventNum);
      x.setAttribute("type", "button");
      x.setAttribute("value", "Change Availability");
      this.table.rows[i].cells[3].appendChild(x);
      x.addEventListener("click", ()=>{this.viewTimes(eventNum)});

      //create a button to leave a joined event
      x = document.createElement("INPUT")
      x.setAttribute("id", "leave"+eventNum);
      x.setAttribute("type", "button");
      x.setAttribute("value", "Leave Event");
      this.table.rows[i].cells[3].appendChild(x);

      document.querySelector("#leave"+eventNum).addEventListener("click", ()=>
      {
        this.leaveEvent(eventNum);

      })
    }
  }


  //@pre runs when the "change availability" button is clicked
  //@param "eventNum" - a unique identifier for each event joined. Set based on the eventId of the event upon generation of the table. Not necessarily still the eventId because events get deleted.
  //@post The eventDisplayer is placed inside a new row of the table. Shows all the times in a single event and allows you to change which ones you are planning to attend / available for.

  viewTimes(eventNum)
  {
    if(this.eventDisplayer.present){
      this.eventDisplayer.remove();
    }
    let row = document.querySelector("#joinedRow"+eventNum);
    let i=row.rowIndex;
    let eventName = row.cells[0].innerText;
    let event = sm.retrieveEvent(sm.getEventId(eventName));
    this.eventDisplayer.n = i+1;

    /* if(this.eventArray[i-1].password != ""){
    /   let table = document.querySelector("#Events");
    /     let passwordField = table.tBodies[0].rows[this.eventDisplayer.n-1].cells[5].children[0].value;
    /     if(passwordField != this.eventArray[i-1].password){
    /       this.eventDisplayer.placeErrorMessage("INCORRECT PASSWORD FOR THIS EVENT");
    /     }else{
    /       this.eventDisplayer.removeErrorMessage();
    /       this.eventDisplayer.place();
    /       this.eventDisplayer.obtainEvent(this.eventArray[i-1]);
    /     }
    / }else
    /{
      /this.eventArray = this.storageManager.retrieveAll();*/
      this.eventDisplayer.place();
      this.eventDisplayer.obtainEvent(event);
    /*}*/

    if(!this.eventDisplayer.listening)
    {
      this.eventDisplayer.buttonListeners()
    }
    this.currentEventNum = eventNum;
  }


//  @pre runs when the "leave event" button is pressed.
//  @param "eventNum" - a unique identifier for each event joined. Set based on the eventId of the event upon generation of the table. Not necessarily still the eventId because events get deleted.
//  @post Upon first press: The user is given a warning that this will cause them to leave the event.
//  @post  Upon second press: The user is removed from the event. The event is also removed from the table.

  leaveEvent(eventNum)
  {
    let availableButton = document.querySelector("#change"+eventNum);
    availableButton.style.display = "none";

    let leaveButton = document.querySelector("#leave"+eventNum);
    leaveButton.style.display = "none";

    //create a button to confirm leaving a joined event
    let yesButton = document.createElement("INPUT");
    yesButton.setAttribute("id", "Yes"+eventNum);
    yesButton.setAttribute("type", "button");
    yesButton.setAttribute("value", "Yes");

    //create a button to cancel leaving a joined event
    let noButton = document.createElement("INPUT");
    noButton.setAttribute("id", "No"+eventNum);
    noButton.setAttribute("type", "button");
    noButton.setAttribute("value", "No");

    //create a span to generate a warning message
    let warning = document.createElement("SPAN");
    warning.setAttribute("id", `joinedWarning`+eventNum);
    warning.innerText = " Are you sure you want to leave? You will be able to rejoin later from the Join Events page.";

    let row = document.querySelector("#joinedRow"+eventNum);
    if(!document.querySelector("#No"+eventNum))
    {
      row.cells[3].appendChild(yesButton);
      row.cells[3].appendChild(noButton);
      row.cells[3].appendChild(warning);
    }

    let eventName = row.cells[0].innerText;
    let event = sm.retrieveEvent(sm.getEventId(eventName));

    document.addEventListener("click", (e) =>
    {
      if(e.target != null && e.target.id== ("Yes"+eventNum)){
        event.removeUser(this.account.userName);
        sm.storeEvent(event);
        this.account.updateEventsJoined();
        this.eventDisplayer.remove();
        row.remove();
     }
     if(e.target != null && e.target.id == ("No"+eventNum)){
       yesButton.remove();
       noButton.remove();
       leaveButton.style.display = "initial";
       availableButton.style.display = "initial";
       warning.innerText = "";
       this.eventDisplayer.obtainEvent(event);
     }

    })



  }
}

let sm = new StorageManager();
let eventDisplayer = new EventDisplayer();
let joinedEvents = new JoinedEvents(eventDisplayer);
let ownedEvents = new OwnedEvents();
let timeMode = true;
eventDisplayer.n=-1;
eventDisplayer.remove();

if(sm.getCurrentAccount()==""){
  document.querySelector("#create").style.display = "none";
}


document.addEventListener("DOMContentLoaded",() => {
    let notLoggedIn = document.querySelector("#notLoggedIn");
    let loggedIn = document.querySelector("#loggedIn");
    let loginStatus = document.querySelector("#loginStatus");
    let logoutMessage = document.querySelector("#logoutMessage");
    let logoutButton = document.querySelector("#logout");
    let loginButton = document.querySelector("#login");
    let isLoggedIn = false;
    let loginUsername = document.querySelector("#username");
    let loginPassword = document.querySelector("#password");

    if(sm.getCurrentAccount()!="")
    {
      document.querySelector("#forceLogIn").style.display = "none";
      loggedIn.style.display="initial";
      isLoggedIn = true;
      loginStatus.innerText = "Currently logged in as: " + sm.getCurrentAccount();
      notLoggedIn.style.display = "none"
    }
    else
    {
      loggedIn.style.display = "none"; //temporarily hide
    }


    // @pre None
    // @post Logs in the user or says that the username or password is incorrect

    loginButton.addEventListener("click", (e) => {
        if (loginUsername.value == "" || loginPassword.value == "") {
            //tell user both inputs must be filled
            loginStatus.innerText = "Please fill out both fields.";
            logoutMessage.style.display = "none";
            loggedIn.style.display = "initial";
            return;
        }
        /*TODO: check if username and password match an account in local storage, then if successful, store current account id that is logged in*/
        /*let accounts[] = sm.retrieveAllAccounts();*/
        else if(sm.findAccount(loginUsername.value)&&loginPassword.value==sm.retrieveAccount(sm.getAccountId(loginUsername.value)).password)
        {
          isLoggedIn = true;
          notLoggedIn.style.display = "none";
          logoutMessage.style.display = "block";
          sm.setCurrentAccount(loginUsername.value);
          loginStatus.innerText = "Currently logged in as: " + loginUsername.value;
          document.querySelector("#forceLogIn").style.display = "none";
          joinedEvents.getAccount();
          ownedEvents.getAccount();
        }
        else if(sm.findAccount(loginUsername.value))
        {
          loginStatus.innerText = "Incorrect Password";
          logoutMessage.style.display = "none";
          loggedIn.style.display = "initial";
        }
        loggedIn.style.display = "initial";
        /*logoutMessage.style.display = "block";*/
    });


    // @pre User must be logged in
    // @post Logs the user out

    logoutButton.addEventListener("click", (e) => {
        sm.clearCurrentAccount();
        window.location.href = "index.html";
    });
});

//checks the current time mode and changes the displayed times to reflect the current time mode
document.querySelector("#timeChange").addEventListener("click", () =>
{
  timeMode = !timeMode;
  if(timeMode)
  {
    document.querySelector("#timeChange").value = "12 Hour Mode";
  }
  else
  {
    document.querySelector("#timeChange").value = "24 Hour Mode";
  }
  if(eventDisplayer.present)
  {
    eventDisplayer.obtainEvent(eventDisplayer.event);
  }
  ownedEvents.refreshTimes();
})
