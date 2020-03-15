
//@file index.js
//@date 02/21/20
//@desc Handles logging in and out.


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

    let createNewEvent = document.querySelector("#create");
    let manageEvents = document.querySelector("#manage");
    let error = document.querySelector("#error");

    let sm = new StorageManager();

    if(sm.getCurrentAccount()!="")
    {
      if(createNewEvent != null){
        createNewEvent.style.visibility = "visible";
      }
      if(manageEvents != null){
        manageEvents.style.visibility = "visible";
      }
      loggedIn.style.display="initial";
      isLoggedIn = true;
      loginStatus.innerText = "Currently logged in as: " + sm.getCurrentAccount();
      notLoggedIn.style.display = "none"
    }
    else
    {
      if(createNewEvent != null){
        createNewEvent.style.visibility = "hidden";
      }
      if(manageEvents != null){
        manageEvents.style.visibility = "hidden";
      }
      loggedIn.style.display = "none"; //temporarily hide
    }

    // @pre None
    // @post Logs in the user or says that the username or password is incorrect

/*/https://medium.com/javascript-in-plain-english/how-to-detect-a-sequence-of-keystrokes-in-javascript-83ec6ffd8e93
/the code below was mostly copied from the above source (the keydown part listener that shows the jpeg image)
      let buffer = [];
      let lastKeyTime = Date.now();
      document.addEventListener('keydown', event => {
        const charList = 'biggiecheese';
        const key = event.key.toLowerCase();

        // we are only interested in alphanumeric keys
        if (charList.indexOf(key) === -1) return;

        const currentTime = Date.now();

        if (currentTime - lastKeyTime > 1000) {
            buffer = [];
        }

        buffer.push(key);
        lastKeyTime = currentTime;
        let answer = buffer.join('');
        if(answer == "biggiecheese"){
            document.body.style.background = "#f3f3f3 url('biggiecheese.jpeg') no-repeat center top";
        }*/

    /*});*/



    loginButton.addEventListener("click", (e) => {
        if (loginUsername.value == "" || loginPassword.value == "") {
            //tell user both inputs must be filled
            if(createNewEvent != null){
              createNewEvent.style.visibility = "hidden";
            }
            if(manageEvents != null){
              manageEvents.style.visibility = "hidden";
            }
            loginStatus.innerText = "Please fill out both fields.";
            logoutMessage.style.display = "none";
            loggedIn.style.display = "initial";
            return;
        }
        //check if username and password match an account in local storage, then if successful, store current account id that is logged in

        else if(sm.findAccount(loginUsername.value)&&loginPassword.value==sm.retrieveAccount(sm.getAccountId(loginUsername.value)).password)
        {
          if(createNewEvent != null){
            createNewEvent.style.visibility = "visible";
          }
          if(manageEvents != null){
            manageEvents.style.visibility = "visible";
          }
          isLoggedIn = true;
          notLoggedIn.style.display = "none";
          logoutMessage.style.display = "block";
          sm.setCurrentAccount(loginUsername.value);
          loginStatus.innerText = "Currently logged in as: " + loginUsername.value;
        }
        else if(!sm.findAccount(loginUsername.value)||(sm.findAccount(loginUsername.value)&&(sm.retrieveAccount(sm.getAccountId(loginUsername.value).password)  )))
        {
          if(createNewEvent != null){
            createNewEvent.style.visibility = "hidden";
          }
          if(manageEvents != null){
            manageEvents.style.visibility = "hidden";
          }
          loginStatus.innerText = "Incorrect Password or Username";
          logoutMessage.style.display = "none";
          loggedIn.style.display = "initial";
        }
        loggedIn.style.display = "initial";
    });


    // @pre User must be logged in
    // @post Logs the user out
    logoutButton.addEventListener("click", (e) => {
        if (isLoggedIn)
        {
            if(createNewEvent != null){
              createNewEvent.style.visibility = "hidden";
            }
            if(manageEvents != null){
              manageEvents.style.visibility = "hidden";
            }
            isLoggedIn=false;
            sm.clearCurrentAccount();
            notLoggedIn.style.display = "block";
            loginStatus.innerText = "CloggedInurrently logged in as: ";
            loggedIn.style.display = "none";
            loginUsername.value = "";
            loginPassword.value = "";
            window.location.href = "index.html";
        }
    });
    if(createNewEvent != null){
      createNewEvent.addEventListener("click", (e) => {
        if (!isLoggedIn) {
          //tell user they must be logged in to create an event
          error.innerText = "You must be logged in to create an event.";
          return;
        } else {
          location.href = "admin.html";
        }
      });
    }
    if(manageEvents != null){
      manageEvents.addEventListener("click", (e) => {
        if (!isLoggedIn) {
          //tell user they must be logged in to create an event
          error.innerText = "You must be logged in to manage your events.";
          return;
        } else {
          location.href = "manager.html";
        }
      });
    }
});
