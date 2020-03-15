
//@file storageManager.js
//@author Ryan Boyce
//@date 02/20/20
//@desc This file contains the implementation for the StorageManager class, the object primarily responsible for handling local storage transfers.

//Web storage help from https://www.w3schools.com/html/html5_webstorage.asp



class StorageManager
{
	// Instantiates a new storageManager, an object used for translating between Event objects and local storage strings.
	
	constructor()
	{
	}

//Event functions --------------------------------------------

	// Adds the Event object to local storage or overrides the event.
	//@pre "event" must be a valid Event object.
	//@post The given event's attributes are retrievable as strings from local storage.
	
	storeEvent(event)
	{
		let eventId = "event0";	//This is used as a key for local storage to determine where the event is stored

		//Check to see if this is the first event added
		let foundEvent = false;
		if(localStorage.eventCount)
		{
			//This is not the first event, check to see if this event already exists
			for(let i = 0; i <= localStorage.eventCount; i++)
			{
				eventId = "event"+i;
				//console.log("Id checked:",eventId);
				let locEventId = localStorage.getItem(eventId);
				if(locEventId == event.eventName)	//Found the event
				{
					foundEvent = true;
					//Wipe the user list for this event, in case the event was updated to have fewer users
					for(let j = 0; j < localStorage.getItem(eventId+"_userCount"); j++)
						localStorage.setItem(eventId+"_"+j,"");
					
					//console.log("Found id:",eventId);
					break;
				}
			}
		}
		else
			localStorage.eventCount = 0;

		//If this is the first event or this event has not yet been added
		if(!foundEvent)	
		{
			//console.log("Could not find event:",eventId);
			localStorage.setItem(eventId, event.eventName);
			localStorage.eventCount++;	
		}
		
		//By doing this, local storage will have a list of events (event0, event1, event2,...),
		//where the string held by each key will contain the event name for each event that has been stored.
		

		//Store the date, author, and password
		let eventDate = eventId+"_date";	//Key used to store the date of the event
		localStorage.setItem(eventDate, event.getDateString(false));

		let eventAuthor = eventId+"_author";	//Key used to store the author of the event
		localStorage.setItem(eventAuthor, event.author);

		let eventPassword = eventId+"_password";//Key used to store the password of the event
		localStorage.setItem(eventPassword, event.password);

		//Store each time from the event's times[] array into a single string
		let eventTimes = eventId+"_times";	//Key used to store the times that users can select for this event
		let str = "";
		for(let i = 0; i < event.times.length; i++)
			str += " "+event.times[i];
		localStorage.setItem(eventTimes, str);

		//Store the user count for iteration purposes, and so it will know how many users to retrieve from storage later on
		let userCount = eventId+"_userCount";	//Key used to determine how many users (not including the author) are available for this event (event0_user_count)
		localStorage.setItem(userCount, event.attendees.length);

		//Store each user/attendee's name and times
		let userId = eventId+"_0";		//Key used to represent a user of this event (event0_0, event0_1, event0_2,...)

		let str2 = "";
		for(let i = 0; i < localStorage.getItem(userCount); i++)
		{
			//Store name
			userId = eventId+"_"+i;
			localStorage.setItem(userId,event.attendees[i].userName);

			//Obtain each time value from the current user
			for(let j = 0; j < event.attendees[i].times.length; j++)
				str2 += " "+event.attendees[i].times[j];

			//Store times
			localStorage.setItem(userId+"_times", str2);
			str2 = "";
		}

		
		// Local storage will now contain:
		// 	eventCount       -> eventCount+1
		// 	event#           -> eventName
		// 	event#_date      -> date
		// 	event#_author    -> author
		// 	event#_password  -> password
		// 	event#_times     -> time1 time 2 ...
		// 	event#_userCount -> (# of users that have signed up for the event, not including author)
		// 	event#_0         -> userName
		// 	event#_0_times   -> time1 time2 ...
		// 	event#_1         -> userName
		// 	event#_1_times   -> time1 time2 ...
		// 	...
		
	}

	// Stores all Event objects from a given list into local storage.
	//@pre "eventList" must refer to an array that contains only Event objects.
	//@post The attributes of each event will be retrievable as strings from local storage.
	
	storeAll(eventList)
	{
		for(let i = 0; i < eventList.length; i++)
			this.storeEvent(eventList[i]);
	}

	// Retrieves and converts strings from local storage to create an Event object.
	//@pre Parameters must refer to an event that actually exists (Ex: event0, event1,...), otherwise an empty Event object will be returned.
	//@return The Event object that matches the eventId.
	
	retrieveEvent(eventId)
	{		
		let eventName = "";
		let times = [];
		let attendees = [];
		let author = "";
		let month = "";
		let day = "";
		let year = "";
		let password = "";

		//Find the event with the corresponding event id, if it exists
		let foundEvent = false;
		if(localStorage.getItem(eventId) != "")
		{
			//Name
			eventName = localStorage.getItem(eventId);
			
			//Times
			let timesStr = eventId+"_times";
			let str = localStorage.getItem(timesStr);
			let timeCount = 0;
			times[0] = "";
			for(let i = 1; i < str.length; i++)	//Starts at 1 because the string starts with a space
			{
				if(str.charAt(i) != " ")
					times[timeCount] += str.charAt(i);
				else
				{
					timeCount++;
					times[timeCount] = "";
				}
			}

			//Attendees
			let attendeesStr = eventId+"_userCount";
			for(let i = 0; i < localStorage.getItem(attendeesStr); i++)	//For each user
			{
				let userStr = eventId+"_"+i;
				let userName = localStorage.getItem(userStr);
				let userTimesStr = userStr+"_times";
				let str2 = localStorage.getItem(userTimesStr);
				let userTimes = [];
				timeCount = 0;
				userTimes[0] = "";
				for(let j = 1; j < str2.length; j++) //For each character in the string, skipping the first space
				{
					if(str2.charAt(j) != " ")
					{
						userTimes[timeCount] += str2.charAt(j);
					}
					else
					{
						timeCount++;
						userTimes[timeCount] = "";
					}
				}
				attendees[i] = new User(userName, userTimes);
			}

			//Author
			let authorStr = eventId+"_author";
			author = localStorage.getItem(authorStr);

			//Date
			let dateStr = eventId+"_date";
			let date = localStorage.getItem(dateStr);
			month = date.substring(0,2);
			day = date.substring(2,4);
			year = date.substring(4,8);

			//Password
			let passwordStr = eventId+"_password";
			password = localStorage.getItem(passwordStr);
		}

		//Return the new object
		let event = new Event(eventName, times, attendees, author, month, day, year, password);
		return event;
	}

	// Retreives all events from local storage and places them in an array.
	//@return An array of Event objects.
	
	retrieveAll()
	{
		let eventList = [];
		let eventId = "";
		for(let i = 0; i < this.getEventCount(); i++)
		{
			eventId = "event"+i;
			eventList[i] = this.retrieveEvent(eventId);
		}
		return eventList;
	}

	// Searches for an Event in local storage with a matching eventName attribute.
	//@return "true" if a matching event is found, "false" otherwise.
	
	findEvent(eventName)
	{
		let eventList = this.retrieveAll();
		for(let i = 0; i < eventList.length; i++)
		{
			if(eventName == eventList[i].eventName)
				return true;
		}
		return false;
	}

	// Obtains the key that an event is stored under in local storage (ex: event0 for the first event, event1 for the second, ...)
	//@return The key for the given event, if the event exists. If unable to find the event, empty string is returned.
	
	getEventId(eventName)
	{
		let eventList = this.retrieveAll();
		if(this.findEvent(eventName))
		{
			for(let i = 0; i < eventList.length; i++)
			{
				if(eventName == eventList[i].eventName)
					return "event"+i;
			}
		}
		return "";	//Unable to find that event
	}

	// Obtains the total number of events that are stored in local storage.
	//@return localStorage.eventCount, if it has been assigned a value. If not, then 0 is returned.
	
	getEventCount()
	{
		if(localStorage.eventCount)
		{
			return localStorage.eventCount;
		}
		else	//If this is false, then eventCount == empty string
			return 0;
	}

	// Wipes local storage for a given event.
	//@params "eventName" refers to the eventName attribute of the Event object you wish to remove from storage; "debug" enables console logging.
	
	clearEvent(eventName,debug)
	{
		//Retrieve all events and remove the event from the list
		let eventList = this.retrieveAll();
		let newList = [];
		let foundEvent = false;
		for(let i = 0; i < eventList.length; i++)
		{
			if(eventList[i].eventName == eventName)
				foundEvent = true;
			else
				newList.push(eventList[i]);
		}
		if(foundEvent)	//If the event was successfully found and removed
		{
			//Wipe storage to get rid of the event from storage
			this.clearStorage(debug);
			//Put all other events back into storage
			this.storeAll(newList);

			if(debug)
				console.log(eventName,"removed successfully from local storage");

			
			//The reason this retrieves events and wipes storage instead of editing storage directly is because
			//its easier to store an array than having to shift every string in storage labeled under event1 to
			//event0 for every event.
			
		}
		else if(debug)
			console.log("Unable to clearEvent() for",eventName,"; no event found");
	}

	// Wipes local storage of all event keys and strings.
	//@params "debug" enables console logging.
	
	clearStorage(debug)
	{
		if(debug)
			console.log("--CLEARING EVENT STORAGE--");

		let userCount = "";
		let str = "";
		for(let i = 0; i < localStorage.eventCount; i++)
		{
			userCount = "event"+i+"_userCount";
			for(let j = 0; j < localStorage.getItem(userCount); j++)
			{
				str = "event"+i+"_"+j;
				localStorage.removeItem(str);
				if(debug) console.log("Removed:","event"+i+"_"+j);
			}
			localStorage.removeItem(userCount);
			if(debug) console.log("Removed:",userCount);
			
			str = "event"+i+"_author";
			localStorage.removeItem(str);
			if(debug) console.log("Removed:",str);

			str = "event"+i+"_date";
			localStorage.removeItem(str);
			if(debug) console.log("Removed:",str);

			str = "event"+i+"_password";
			localStorage.removeItem(str);
			if(debug) console.log("Removed:",str);

			str = "event"+i;
			localStorage.removeItem(str);
			if(debug) console.log("Removed:",str);
		}
		localStorage.eventCount = "";
		if(debug)
		{
			console.log("Removed: eventCount");
			console.log("--");
		}
	}

//Account functions ----------------------------------------------------------

	// Adds the Account object to local storage or overrides the event.
	//@pre "account" must be a valid Account object.
	//@post The given account's attributes are retrievable as strings from local storage.
	
	storeAccount(account)
	{
		let accountId = "account0";	//This is used as a key for local storage to determine where the account is stored

		//Check to see if this is the first account added
		let foundAccount = false;
		if(localStorage.accountCount)
		{
			//This is not the first account, check to see if this account already exists
			for(let i = 0; i <= localStorage.accountCount; i++)
			{
				accountId = "account"+i;
				//console.log("Id checked:",accountId);
				let locAccountId = localStorage.getItem(accountId);
				let locAccountPass = localStorage.getItem(accountId+"_password");
				if(locAccountId == account.userName && locAccountPass == account.password)	//Found the account, don't store it
				{
					foundAccount = true;					
					//console.log("Found id:",accountId);
					return;
				}
			}
		}
		else
			localStorage.accountCount = 0;

		//If this is the first account or this account has not yet been added
		if(!foundAccount)	
		{
			//console.log("Could not find account:",accountId);
			localStorage.setItem(accountId, account.userName);
			localStorage.accountCount++;	
		}
		
		//By doing this, local storage will have a list of accounts (account0, account1, account2,...),
		//where the string held by each key will contain the user name for each account that has been stored.
		

		//Store the password
		let accountPassword = accountId+"_password";	//Key used to store the password
		localStorage.setItem(accountPassword, account.password);

		
		// Local storage will now contain:
		// 	accountCount     -> accountCount+1
		// 	account#         -> userName
		// 	account#_password-> password
		// 	...
		
	}

	// Stores all Account objects from a given list into local storage.
	//@pre "accountList" must refer to an array that contains only Account objects.
	//@post The attributes of each account will be retrievable as strings from local storage.
	
	storeAllAccounts(accountList)
	{
		for(let i = 0; i < accountList.length; i++)
			this.storeAccount(accountList[i]);
	}

	// Retrieves and converts strings from local storage to create an Account object.
	//@pre Parameters must refer to an account that actually exists (Ex: account0, account1,...), otherwise an empty Account object will be returned.
	//@return The Account object that matches the accountId.
	
	retrieveAccount(accountId)
	{
		let userName = "";
		let password = "";

		//Find the account with the corresponding account id, if it exists
		let foundAccount = false;
		if(localStorage.getItem(accountId) != "")
		{
			//Name
			userName = localStorage.getItem(accountId);

			//Password
			let passwordStr = accountId+"_password";
			password = localStorage.getItem(passwordStr);
		}

		//Return the new object
		let account = new Account(userName, password);
		return account;
	}

	// Retreives all accounts from local storage and places them in an array.
	//@return An array of Account objects.
	
	retrieveAllAccounts()
	{
		let accountList = [];
		let accountId = "";
		for(let i = 0; i < this.getAccountCount(); i++)
		{
			accountId = "account"+i;
			accountList[i] = this.retrieveAccount(accountId);
		}
		return accountList;
	}

	// Searches for an Account in local storage with a matching userName attribute.
	//@return "true" if a matching account is found, "false" otherwise.
	
	findAccount(userName)
	{
		let accountList = this.retrieveAllAccounts();
		for(let i = 0; i < accountList.length; i++)
		{
			if(userName == accountList[i].userName)
				return true;
		}
		return false;
	}

	// Obtains the key that an account is stored under in local storage (ex: account0 for the first account, account1 for the second, ...)
	//@return The key for the given account, if the account exists. If unable to find the account, empty string is returned.
	
	getAccountId(userName)
	{
		let accountList = this.retrieveAllAccounts();
		if(this.findAccount(userName))
		{
			for(let i = 0; i < accountList.length; i++)
			{
				if(userName == accountList[i].userName)
					return "account"+i;
			}
		}
		return "";	//Unable to find that account
	}

	// Obtains the total number of accounts that are stored in local storage.
	//@return localStorage.accountCount, if it has been assigned a value. If not, then 0 is returned.
	
	getAccountCount()
	{
		if(localStorage.accountCount)
		{
			return localStorage.accountCount;
		}
		else	//If this is false, then accountCount == empty string
			return 0;
	}

	// Wipes local storage for a given account.
	//@params "userName" refers to the userName attribute of the Account object you wish to remove from storage; "debug" enables console logging.
	
	clearAccount(userName,debug)
	{
		//Retrieve all accounts and remove the account from the list
		let accountList = this.retrieveAllAccounts();
		let newList = [];
		let foundAccount = false;
		for(let i = 0; i < accountList.length; i++)
		{
			if(accountList[i].userName == userName)
				foundAccount = true;
			else
				newList.push(accountList[i]);
		}
		if(foundAccount)	//If the account was successfully found and removed
		{
			//Wipe storage to get rid of this account from storage
			this.clearStorageAccounts(debug);
			//Put all other accounts back into storage
			this.storeAllAccounts(newList);

			if(debug)
				console.log(userName,"removed successfully from local storage");
		}
		else if(debug)
			console.log("Unable to clearAccount() for",userName,"; no account found");
	}

	// Wipes local storage of all account keys and strings.
	//@params "debug" enables console logging.
	
	clearStorageAccounts(debug)
	{
		if(debug)
			console.log("--CLEARING ACCOUNT STORAGE--");

		let userCount = "";
		let str = "";
		for(let i = 0; i < localStorage.accountCount; i++)
		{
			str = "account"+i+"_password";
			localStorage.removeItem(str);
			if(debug) console.log("Removed:",str);

			str = "account"+i;
			localStorage.removeItem(str);
			if(debug) console.log("Removed:",str);
		}
		localStorage.accountCount = "";
		if(debug)
		{
			console.log("Removed: accountCount");
			console.log("--");
		}
	}

	// Stores the name of the currently logged-in account into session storage.
	//@params "userName" must refer to the userName of a locally stored Account object.
	//@post The name of the current account will be retrievable from storage until the current session is ended.
	//@return "true" if the account was successfully stored, "false" if the account could not be found in local storage.
	
	setCurrentAccount(userName)
	{
		let accountList = this.retrieveAllAccounts();
		for(let i = 0; accountList.length; i++)
		{
			if(accountList[i].userName == userName)
			{
				sessionStorage.currentAccount = userName;
				return true;
			}
		}
		console.log("Failed to update session storage; "+userName+" could not be found in local storage.");
		return false;
	}

	// Obtains from session storage the account that is currently logged-in.
	//@return The name of the account obtained from storage, empty string if no account has been stored.
	
	getCurrentAccount()
	{
		if(sessionStorage.currentAccount)
			return sessionStorage.currentAccount;
		else
			return "";
	}

	// Resets the currently logged-in account by wiping storage.
	//@post currentAccount will no longer contain the name of the current account.
	
	clearCurrentAccount()
	{
		sessionStorage.currentAccount = "";
	}
}

