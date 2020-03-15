class EventFunctions{

      constructor(){this.validDateNum = true;}

      clientOfClassValidateEverything(day, month, year){
        this.validateDateNumbers(day,month,year)
        this.validateMonth(month)
        this.validateYear(year,month,day)
        this.validateDay(day,month)
      }
//this functions checks to make sure that the user didn't input something that is Not a Number or "NaN", it will output an error message
//if the user gives a non-number to the function.
//e.g. month: abc day:def year:ghij
//this function does use parseInt though, so if the user puts in something like 02a it will only grab the number portion.
      validateDateNumbers(day, month, year)
      {
        if(isNaN(day) || isNaN(month) || isNaN(year))
        {
          document.querySelector("#TypeErrorMessage").innerText = "All inputs must be numbers. ";
          this.validDateNum = false;
        }else{
          document.querySelector("#TypeErrorMessage").innerText = "";
          this.validDateNum = true;
        }
      }
//this function validates the month to make sure that the user has input a month number between 1 and 12. It will output an error if the user tries to select an invalid month
      validateMonth(month)
      {
        if(month < 1 || month > 12)
        {
          document.querySelector("#MonthErrorMessage").innerText = "Month must be between 1 and 12; ";
        }else{
          document.querySelector("#MonthErrorMessage").innerText = "";
        }
      }
//This function validates the day using the month to make sure that the user has input a valid day for the month they have chosen.
      validateDay(day, month){

        if(day < 1 || day > 31)
        {
          document.querySelector("#DayErrorMessage").innerText = "Day must be between 1 and 31; ";
        }
        if(month == 3 || month == 5 || month == 8 || month == 10)
        {
          if(day < 1 || day > 31)
          {
            document.querySelector("#DayErrorMessage").innerText = "Day must be between 1 and 31; ";
          }
          else{
            document.querySelector("#DayErrorMessage").innerText = "";
          }
        }
        else if(month == 4 || month == 6 || month == 9 || month == 11)
        {
          if(day < 1 || day > 30)
          {

            document.querySelector("#DayErrorMessage").innerText = "Day must be between 1 and 30; ";
          }
          else{
            document.querySelector("#DayErrorMessage").innerText = "";}

        }

        else if(month == 1)
        {
          if(day == 1)
          {
            document.querySelector("#DayErrorMessage").innerText = "Cannot make events on this date. It is holiday or special day. ";
          }
          else if(day < 2 || day > 31)
          {
            document.querySelector("#DayErrorMessage").innerText = "Day must be between 1 and 31; ";
          }    else{
            document.querySelector("#DayErrorMessage").innerText = "";}
        }
        else if(month == 7)
        {
          if(day == 4)
          {
            document.querySelector("#DayErrorMessage").innerText = "Cannot make events on this date. It is holiday or special day. ";
          }
          else if(day < 1 || day > 31)
          {
            document.querySelector("#DayErrorMessage").innerText = "Day must be between 1 and 31; ";
          }    else{
            document.querySelector("#DayErrorMessage").innerText = "";}
        }
        else if(month == 12)
        {
          if(day == 25)
          {
            document.querySelector("#DayErrorMessage").innerText = "Cannot make events on this date. It is holiday or special day. ";
          }
          else if(day < 1 || day > 31)
          {
            document.querySelector("#DayErrorMessage").innerText = "Day must be between 1 and 31; ";
          }    else{
            document.querySelector("#DayErrorMessage").innerText = "";}
        }
        else if(month == 2)
        {
          if(day < 1 || day > 29)
          {
            document.querySelector("#DayErrorMessage").innerText = "Day must be between 1 and 29; ";
          }    else{
            document.querySelector("#DayErrorMessage").innerText = "";}
        }
      }
//checks to make sure that the year is between the arbitrary values of 1965 and 3000, soft-checks for leap years, but doesn't account for the strange leap-year stuff where it isn't actually ever 4 years.
//also checks to make sure that if the user has input Feb. 29, that the year they selected is a leap year.
      validateYear(year, month, day)
      {
        if(this.validDateNum)
        {
        if(!(year > 3000) && !(year < 1965))
        {
          if(month == 2 && day == 29)
          {
            if(year % 4 != 0)
            {
              document.querySelector("#YearErrorMessage").innerText = "Year input not a leap year; ";

            } else{
              document.querySelector("#YearErrorMessage").innerText = "";}
           } else{
            document.querySelector("#YearErrorMessage").innerText = "";}
        } else{
          document.querySelector("#YearErrorMessage").innerText = "Year must be between 1965 and 3000; ";
        }
        } else{
          document.querySelector("#YearErrorMessage").innerText = "";
        }
      }
      //a function that simply checks to see if the date that the user is currently using is valid using the above functions and checking to
      //make sure all of their error outputs are "".
      isValidDate()
      {
        let validDate = false
        if(document.querySelector("#TypeErrorMessage").innerText==""&&document.querySelector("#MonthErrorMessage").innerText==""&&document.querySelector("#DayErrorMessage").innerText==""&&document.querySelector("#YearErrorMessage").innerText=="")
        {
          validDate = true;
        }
        else
        {
          validDate = false;
        }
        return(validDate);
      }
      //submitEvent only runs if all of the required fields are filled out correctly. This is ensured by admin.js
      //submitEvent takes all of the information given by the user and turns it into properly formated information to pass to storage.
  submitEvent(eventName, authorName, month, day, year, times, password)
  {
    if(month<10)
    {
      month = "0"+month;
    }
    if(day<10)
    {
      day = "0"+day;
    }
    let currentEvent = new Event(eventName,[],[],"" +authorName,""+ month,""+day,""+year, ""+password);
    let n=0;
    for(n of times)
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
      let j = 0;
      times[j] = hours + ":" + minutes;
      currentEvent.addTime("" +times[j]);
      j++;
    }
    let toStore = new StorageManager();
    toStore.storeEvent(currentEvent);
  }
}

//------------------------------------------------------------
