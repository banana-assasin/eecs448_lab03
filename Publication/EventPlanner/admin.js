// after the DOM content is loaded the js will store a bunch of objects from the html to be used later.*/
let storeManager = new StorageManager();

if(storeManager.getCurrentAccount()!="")
{
  document.querySelector("#notLoggedInAdmin").style.visibility = "hidden";
}
else
{
  document.querySelector("#stuffToHide").style.visibility = "hidden";
  document.querySelector("#stuffToHide2").style.display = "none";
  document.querySelector("#stuffToHide3").style.display = "none";
  document.querySelector("#toManager").style.display = "none"
}

document.addEventListener("DOMContentLoaded",() => {
  let eventMonth = document.querySelector("#month");
  let eventDay = document.querySelector("#day");
  let eventYear = document.querySelector("#year");
  let theButtons = document.querySelector("#button-group");
  let button24 = document.querySelector("#button24");
  let submitButton = document.querySelector("#submit");
  let passwordInput = document.querySelector("#passwordInput");
  let passwordText = document.querySelector("#passwordTextForEvent");
  let private = document.querySelector("#privacy");

  let t = new TimeTable(true);
  let ev = new EventFunctions();
  let checkDate = false;


  theButtons.style.display = "none";//hides buttons on load of the page
  passwordInput.style.display = "none";//hides the password text on load of page
  passwordText.style.display = "none";//hides the password input box on load of page

//   @pre none
//   @post gives an error message if the date is invalid, otherwise opens a table of times.

//  this function simply validates a date given by the user in the 3 input boxes month, day and year.
  document.querySelector("#validate").addEventListener("click", (e) =>  {
    let month = parseInt(eventMonth.value);
    let day = parseInt(eventDay.value);
    let year = parseInt(eventYear.value);
    checkDate = true;

    ev.clientOfClassValidateEverything(day, month, year);
    t.openTable();

    //shows the buttons if the date is valid, otherwise it rehides them.
    if(ev.isValidDate()){
       theButtons.style.display = "initial";
    }
    else
    {
        theButtons.style.display = "none";
    }

  })

 // @pre none
  //@post checks to show or hide the password and input box as the checkbox is checked/unchecked.
  document.addEventListener("change", (e) => {
      if(private.checked)
      {
          passwordInput.style.display = "initial";
          passwordText.style.display = "initial";
      }
      else{
          passwordInput.style.display = "none";
          passwordText.style.display = "none";
      }
  })
//
//   @pre table is visible
//   @post switches the button between 12 and 24 hour modes and updates the bool associated with it.
//
  button24.addEventListener("click", (e) => {
      t.changeMode();
  })

//   @pre all of the fields are filled out in ways that are valid, this is checked and the submit button will not complete if
//         fields are not filled out, or not filled out correctly.
//   @post creates a new event with the authorName, eventName, date, and times and passes it to localStorage.

  submitButton.addEventListener("click", (e) => {
      let stopSubmit = document.querySelector("#allComplete");
      let eventName = document.querySelector("#eventName").value;
      let eventError = document.querySelector("#eventNameError");
      let anyError = false;
      let anyTimes = true;
      let allTimes = [];
      let message = "Please correct and/or complete fields above.";
      let message1 = "<-- Required Field; ";
      let month = parseInt(eventMonth.value);
      let day = parseInt(eventDay.value);
      let year = parseInt(eventYear.value);
      //checks to see if the date is correct
      ev.clientOfClassValidateEverything(day, month, year);
      if(checkDate)
      {
        if(document.querySelector("#TypeErrorMessage").innerText==""&&document.querySelector("#MonthErrorMessage").innerText==""&&document.querySelector("#DayErrorMessage").innerText==""&&document.querySelector("#YearErrorMessage").innerText=="")
        {
            anyTimes = false;
            for(let i=1;i<= 54; i++)
            {
                if(document.querySelector("#checkBox" +i).checked)
                {
                    allTimes.push(i); //pushes the index of the times onto an array that will be changed to a correct time later.
                    anyTimes = true;
                }
            }
            if(!anyTimes)
            {
                anyError = true;
            }
        }
        else
        {
            anyError = true;
        }
      }
      else
      {
          anyError = true;
      }


      //checks to make sure there is an Event Name, if there isn't displays an error message
      if(eventName == "")
      {
          eventError.innerText = "" + message1;
          anyError = true;
      }else
      {
          eventError.innerText = "";
      }

      let allEvents = storeManager.retrieveAll();

      for(let i of allEvents){
        if(i.eventName == eventName){
          eventError.innerText = "Event name already exists. Please choose another name."
          anyError = true;
          break;
        }else{
          eventError.innerText = ""
        }
      }

      //checks to see if the private checkbox is checked, if it is it checks to make sure the user input a password;
      if(document.querySelector("#privacy").checked)
      {
          //checks to make sure the user input a password, if they didn't displays an error message
          if(document.querySelector("#passwordInput").value=="")
          {
              document.querySelector("#passError").innerText = "" + message1;
              anyError = true;
          }
          else
          {
              document.querySelector("#passError").innerText = "";
          }
      }
      //if the checkbox is not checked make sure that the error message does not display any longer.
      else
      {
          document.querySelector("#passError").innerText = "";
      }
      //if there are anyErrors (if any of the fields have problems) the bool "anyError" is set to true. and will the form will catch here until the user fixes the errors.
      if(anyError)
      {
          if(!anyTimes)
          {
              stopSubmit.innerText = "" + message + " Select at least one time slot. "
          }
          else if(!checkDate)
          {
            stopSubmit.innerText = "" + message + " Please select 'Select Time(s)' after entering a date. ";
          }
          else
          {
            stopSubmit.innerText = "" + message;
          }
      }
      //if all the fields are filled out correctly, clears the error messages, submitEvent() is a function that sends the event information to
      //a class that is then stored in localstorage.
      else
      {
        stopSubmit.innerText = "";
        ev.submitEvent(eventName,storeManager.getCurrentAccount(),month,day,year,allTimes,passwordInput.value);//this creates an event, and attempts to pass it to storageManager.
        clearAllFields();
      }
  })


  //@pre none
  //@post makes sure that when the password box is not displayed the password input is cleared and an error message is not displayed.

  private.addEventListener("click", (e) =>{
      if(!private.checked)
      {
          document.querySelector("#passError").innerText = "";
          passwordInput.value = "";
      }
  })

//  @pre none though this is only called by submit button once the user has completed all fields correctly.
//  @post clears all the fields and tells the user that their event has been sccessfully submitted.
  function clearAllFields()
  {
      eventMonth.value = "";
      eventDay.value = "";
      eventYear.value = "";
      eventName.value = "";
      document.querySelector("#validate").click();
      if(private.checked)
      {
          private.checked = false;
          document.querySelector("#passError").innerText = "";
          passwordInput.value = "";
          passwordInput.style.display = "none";
          passwordText.style.display = "none";
      }
      checkDate = false;
      document.querySelector("#typeErrorMessage").innerText = "";
      document.querySelector("#allComplete").innerText = "Successfully submited event";
  }
});
