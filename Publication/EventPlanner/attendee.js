let eventDisplayer = new EventDisplayer();
let eventList = new EventList(eventDisplayer);
let calendar = new Calendar();
let notLoggedIn = document.querySelector("#notLoggedIn");
let loggedIn = document.querySelector("#loggedIn");
let timeMode = true;

//when attendee page loads this will create the table of local storage events from scratch and hide the calendar view.
document.addEventListener("DOMContentLoaded",() => {
  eventList.destroyEvents();
  eventList.createTable();
  calendar.hide();
});

loggedIn.style.display="none";

//when clicking the "next month" or "previous month" buttons on calendar view this function will update the calendar and current month to correctly reflect the change.
let changeMonth = () =>
{
  calendar.previous.addEventListener("click", ()=>
  {
    calendar.destroyCalendar();
    calendar.date.setMonth(calendar.date.getMonth()-1);
    calendar.createCalendar();
    changeMonth();
  })
  calendar.next.addEventListener("click", ()=>
  {
    calendar.destroyCalendar()
    calendar.date.setMonth(calendar.date.getMonth()+1);
    calendar.createCalendar();
    changeMonth();
  })
}

//when clicking on the calandar view button hides the list of events in favor of the calendar view and vice-versa.
document.querySelector("#changeView").addEventListener("click", () =>
{
  if(eventList.present)
  {
    eventList.hide();
    calendar.find();
    document.querySelector("#changeView").value="Change to Event List";
    changeMonth();
  }
  else
  {
    calendar.hide();
    eventList.find();
    document.querySelector("#changeView").value="Change to Calendar View";
  }
})

//upon clicking the "12 Hour Mode" or "24 Hour Mode" button changes the event times to reflect the mode change.
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
})



//date method help from https://www.w3schools.com/js/js_date_methods_set.asp
