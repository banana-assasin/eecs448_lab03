class SignUpPage
{
  constructor()
  {
    this.submit = document.querySelector("#submit");
    this.passwordInput = document.querySelector("#password");
    this.confirmPasswordInput = document.querySelector("#confirmPassword");
    this.userNameInput = document.querySelector("#username");
    this.storageManager = new StorageManager();
  }
//checks the passwords in signup to make sure they are the same before allowing the user to continue
  matchingPasswords()
  {
    if(this.confirmPasswordInput.value==this.passwordInput.value)
    {
      return true;
    }
    else
    {
      return false;
    }
  }
//checks the input boxes to make sure all of them have been filled out before the user can continue
  noEmptyInputs()
  {
    if(this.passwordInput.value!=""&&this.confirmPasswordInput.value!=""&&this.userNameInput.value!="")
    {
      return true;
    }
    else
    {
      return false;
    }
  }
//checks to make sure that the username that the user has attempted to select for themselves is unique in the system
  uniqueUserName()
  {
    let accountArray = this.storageManager.retrieveAllAccounts();
    for (let i = 0; i<accountArray.length;i++)
    {
      if(this.userNameInput.value==accountArray[i].userName)
      {
        return false;
      }
    }
    return true;
  }
//calls the pre-defined functions and saves the user and logs them in if they have successfully completed all required fields
  eventListener()
  {
    this.submit.addEventListener("click", ()=>
    {
      document.querySelector("#error").innerText = "";
      if(this.matchingPasswords()&&this.noEmptyInputs()&&this.uniqueUserName())
      {
        let account = new Account(this.userNameInput.value,this.passwordInput.value);
        this.storageManager.storeAccount(account);
        this.storageManager.clearCurrentAccount();
        this.storageManager.setCurrentAccount(account.userName);
        document.querySelector("#redirect").style.display="block";
        this.submit.style.display="none";

        document.querySelector("#error").innerText = "Successfully logged in! You can now join an event, or create your own."
        /* let func = ()=>{window.history.back()};
        / setTimeout(func, 5000); / the only way I could get timeout to successfully call .back was to do this roundabout thing...*/
      }
      else if(!this.noEmptyInputs())
      {
        //error message says please fill out all inputs.
        console.log("Empty Inputs")
        document.querySelector("#error").innerText = "Please fill out all the fields.";
      }
      else if(!this.uniqueUserName())
      {
        //error message says username taken
        document.querySelector("#error").innerText = "That username has already been taken. Please choose another.";
        console.log("Non-unique User name")
      }
      else if(!this.matchingPasswords())
      {
        //error message says please make sure your passwords match.
        document.querySelector("#error").innerText = "Your passwords do not match. Please try again.";
        console.log("Passwords Don't Match")
      }
    });
  }
}

let signUpPage = new SignUpPage;


document.addEventListener("DOMContentLoaded", () =>
{
  document.querySelector("#redirect").style.display="none";
  signUpPage.eventListener();
});
