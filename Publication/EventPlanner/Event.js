
//@file Event.js
//@author Ryan Boyce
//@date 02/21/20
//@desc This file contains the implementation for the Event, User, and Account classes. Requires StorageManager class for Account functions.


class Event
{
	// Instantiates a new Event object.
	
	constructor(eventName, times, attendees, author, month, day, year, password)
	{
		this.eventName = eventName;
		this.times = times;		//an array of times that a User can have for this event. Each time must be given as a five-digit STRING (Ex: 8:40pm becomes 20:40)
		this.attendees = attendees;	//an array of User objects, where each contains an array of available times (does not include the author)
		this.author = author;
		this.month = month;		//This must be passed as a string to preserve the 0 for single digit months
		this.day = day;			//That applies here as well
		this.year = year;
		this.password = password;	//Empty string if this is a public event
	}

	// Takes the date attributes for an Event and combines them into a single string.
	//@return The month, day, and year in mmddyyyy format.
	
	getDateString(addSlashes)
	{
		if(addSlashes)
			return this.month+"/"+this.day+"/"+this.year;
		else
			return this.month+this.day+this.year;
	}

	// Returns the total attendee count for this event.
	//@return The number of people that will attend this event, including the creator of the event.
	
	getAttendeeCount()
	{
		return(1+this.attendees.length);	//The added 1 is because attendees[] does not include the author
	}

	// Returns the number of people attending the most popular time slot;
	//@return The number of people will attend the most popular time slot, including the creator of the event.
	
	getMaxAttendeeCount()
	{
		let largest = 0;
		let current = 0;
		for(let i in this.times)
		{
			current = this.getAttendeeByTime(this.times[i])
			if(current>largest)
			{
				largest = current;
			}
			current = 0;
		}
		return largest;
	}

	//Returns the number of attendees that are planning on attending a given time slot
	//@param "time" must be a five-digit string (Ex: 8:40pm becomes 20:40).
	//@return The number of people that will attend the given time slot, including the creator of the event.
	
	getAttendeeByTime(time)
	{
		let current = 0;
		for(let j in this.attendees)
		{
			if(this.attendees[j].checkTime(time))
			{
				current = current + 1;
			}
		}
		return(current+1);
	}

	// Adds a time to the end of the Event's times array.
	//@params "time" must be a five-digit string (Ex: 8:40pm becomes 20:40).
	//@post The new time will be added to times in order from the earliest time to the latest time.
	
	addTime(time)
	{
		let newTimes = [];
		let numberTime = parseInt(parseInt(time) +time.substring(3)+"");
		let foundSlot = false;
		if(this.times.length == 0)
		{
			newTimes.push(time);
			
		}
		for(let i =0;i<this.times.length;i++)
		{
			if(parseInt(parseInt(this.times[i])+this.times[i].substring(3)+"")<numberTime)
			{
				newTimes.push(this.times[i]);
			}else if((parseInt(parseInt(this.times[i])+""+this.times[i].substring(3))>numberTime) && !foundSlot)
			{
				newTimes.push(time);
				foundSlot = true;
				i = i-1;
				
			}else if((parseInt(parseInt(this.times[i])+""+this.times[i].substring(3))>numberTime))
			{
				newTimes.push(this.times[i]);
			}
			
		}
		if(!foundSlot)
		{
			newTimes.push(time);
			foundSlot = true;
		}
		this.times = newTimes;
		/*this.times.push(time);*/
	}

	// Removes a time from the Event's times array, and updates all Users that have that time.
	//@params "time" must be a five-digit string (Ex: 8:40pm becomes 20:40).
	//@post The time provided will be removed from times.
	
	removeTime(time)
	{
		let newTimes = [];
		let foundTime = false;
		for(let i = 0; i < this.times.length; i++)
		{
			if(this.times[i] == time)
				foundTime = true;
			else
				newTimes.push(this.times[i]);
		}
		if(foundTime)
		{
			this.times = newTimes;
			for(let i = 0; i < this.attendees.length; i++)
			{
				this.attendees[i].removeTime(time);
				//Check to make sure this User still has any times left in its array
				if(this.attendees[i].times.length == 0)
				{
					this.removeUser(this.attendees[i].userName);	//Remove them if they have no times in common with this Event
					//Restart the loop, since the size of the array will have changed
					i = -1;
					continue;
				}
			}
		}
		else
			console.log("Unable to remove time from "+this.eventName+"; "+time+" is not currently an available time for this event.");
	}

	// Adds a User object to the end of the Event's attendees array.
	//@params "user" must be a valid User object.
	//@post The given User is added to attendees.
	
	addUser(user)
	{
		//Make sure user isn't already in the array
		for(let i = 0; i < this.attendees.length; i++)
		{
			if(this.attendees[i].userName == user.userName)	//If it is in the array, update it
			{
				this.attendees[i] = user;
				return;
			}
		}
		if(user.userName != this.author)
		{
			if(this.isValidTimeList(user.times))
				this.attendees.push(user);
			else
				console.log("Unable to add user "+user.userName+" to event "+this.eventName+"; user has times that are not available for this event.");
		}
		else
			console.log("Unable to add user "+user.userName+" to event "+this.eventName+"; user is already the creator for this event.");
	}

	// Removes a User object from the Event's attendees array.
	//@params "userName" refers to the userName attribute of the User object that needs to be removed.
	//@post The given User is removed from attendees and the associated Account will no longer have this event listed.
	
	removeUser(userName)
	{
		let newAttendees = [];
		let foundUser = false;
		for(let i = 0; i < this.attendees.length; i++)
		{
			if(this.attendees[i].userName == userName)
				foundUser = true;
			else
				newAttendees.push(this.attendees[i]);
		}
		if(foundUser)
			this.attendees = newAttendees;
		else if(userName == this.author)
			console.log("Unable to remove user "+userName+" from "+this.eventName+"; the event's creator cannot be removed.");
		else
			console.log("Unable to remove user "+userName+" from "+this.eventName+"; user not found.");
	}

	// Verifies whether a time is within this Event's times array. DOES NOT verify if the given time is provided in the correct format.
	//@params "time" must be a five-digit string (Ex: 8:40pm becomes 20:40).
	//@return "true" if the given time is found, "false" otherwise.
	
	isValidTime(time)
	{
		for(let i = 0; i < this.times.length; i++)
		{
			if(time == this.times[i])
				return true;
		}
		return false;
	}

	// Verifies whether an array of times is a subset of this Event's times array.
	//@params Each entry in "timeList" must be a five-digit string (Ex: 8:40pm becomes 20:40).
	//@return "true" if every time is in the array, "false" otherwise.
	
	isValidTimeList(timeList)
	{
		for(let i = 0; i < timeList.length; i++)
		{
			if(!this.isValidTime(timeList[i]))
				return false;
		}
		return true;
	}

	// Prints to console all attributes.
	
	print()
	{
		console.log("--PRINTING EVENT--");
		console.log("eventName:",this.eventName);
		console.log("author:",this.author);
		console.log("date:",this.getDateString(true));
		console.log("password:",this.password);
		console.log("times:");
		for(let i = 0; i < this.times.length; i++)
			console.log(this.times[i]);
		console.log("attendees:");
		console.log(this.author);
		for(let i = 0; i < this.attendees.length; i++)
			console.log(this.attendees[i].userName);
		console.log("--");
	}

	// Prints to console the attributes of each User in this Event's attendees array.
	
	printUsers()
	{
		for(let i = 0; i < this.attendees.length; i++)
			this.attendees[i].print();
	}
}

class User  //A User should be local to an Event; if someone signed up for two different events, two independent User objects will be made.
{
	// Instantiates a new User object.
	
	constructor(userName, times)
	{
		this.userName = userName;
		this.times = times;	//an array of numbers that represents the times that this user is available for a given Event
	}

	// Adds a time to the end of the User's times array. Note: There is no guarantee that the time being added will be compatible with the corresponding Event times.
	//@params "time" must be a five-digit string (Ex: 8:40pm becomes 20:40).
	//@post The new time will be added to times.
	addTime(time)
	{
		//Make sure the time is not already in the array
		let foundTime = false;
		for(let i = 0; i < this.times.length; i++)
		{
			if(time == this.times[i])
				foundTime = true;
		}
		if(!foundTime)
			this.times.push(time);
		else
			console.log("Unable to add time "+time+" to "+this.userName+"; time is already listed.");
	}

	// Removes a time from the User's times array.
	//@params "time" must be a five-digit string (Ex: 8:40pm becomes 20:40).
	//@post The time provided will be removed from times.
	
	removeTime(time)
	{
		let newTimes = [];
		let foundTime = false;
		for(let i = 0; i < this.times.length; i++)
		{
			if(this.times[i] == time)
				foundTime = true;
			else
				newTimes.push(this.times[i]);
		}
		if(foundTime)
			this.times = newTimes;
		else
			console.log("Unable to remove time from "+this.userName+"; "+time+" is not a time for this user.");
	}

	// Checks if the user is planning to attend at a given time
	//@param "time" must be a five-digit string (Ex: 8:40 pm becomes 20:40).
	//@Return True if the given time is in this.times, false if its not in this.times.
	
	checkTime(time)
	{
		for(let i in this.times)
		{
			if(this.times[i]==time)
			{
				return true;
			}
		}
		return false;
	}


	// Prints to console the name and times for this User.
	
	print()
	{
		console.log("--PRINTING USER--");
		console.log("userName:",this.userName);
		console.log("times:");
		for(let i = 0; i < this.times.length; i++)
			console.log(this.times[i]);
		console.log("--");
	}
}

class Account //An Account is not local to an Event, and has the option to find what Event objects it is an author or User for.
{
	// Instantiates a new Account object.
	
	constructor(userName, password)
	{
		this.userName = userName;
		this.password = password;
		this.eventsCreated = [];	//List of eventNames, not Event objects
		this.eventsJoined = [];		//Same here

		this.updateEventsCreated();
		this.updateEventsJoined();
	}

	// Checks local storage for all the Event objects that this Account is the author for.
	
	updateEventsCreated()
	{
		let created = [];
		let sm = new StorageManager();
		//Retrieve from storage the list of events
		let eventList = sm.retrieveAll();
		for(let i = 0; i < eventList.length; i++)
		{
			if(eventList[i].author == this.userName)
				created.push(eventList[i].eventName);
		}
		this.eventsCreated = created;
	}

//	Checks local storage for all the Event objects that this Acccount is a user for.
	
	updateEventsJoined()
	{
		let joined = [];
		let sm = new StorageManager();
		//Retrieve from storage the list of events
		let eventList = sm.retrieveAll();
		for(let i = 0; i < eventList.length; i++)
		{
			for(let j = 0; j < eventList[i].attendees.length; j++)
			{
				if(eventList[i].attendees[j].userName == this.userName)
					joined.push(eventList[i].eventName);
			}
		}
		this.eventsJoined = joined;
	}

	// Verifies if this Account is the author for the given Event.
	// @params "eventName" must be the eventName attribute of the Event object being verified, not the object itself.
	// @return "true" if the given event is a part of the eventsCreated array, "false" otherwise.
	// 
	isAuthor(eventName)
	{
		this.updateEventsCreated();
		for(let i = 0; i < this.eventsCreated.length; i++)
		{
			if(this.eventsCreated[i] == eventName)
				return true;
		}
		return false;
	}

	// Verifies if this Account is a User for the given Event.
	// @params "eventName" must be the eventName attribute of the Event object being verified, not the object itself.
	// @return "true" if the given event is a part of the eventsJoined array, "false" otherwise.
	
	isUser(eventName)
	{
		this.updateEventsJoined();
		for(let i = 0; i < this.eventsJoined.length; i++)
		{
			if(this.eventsJoined[i] == eventName)
				return true;
		}
		return false;
	}

	// Prints to console the username and password for this Account.
	
	print()
	{
		console.log("--PRINTING ACCOUNT--");
		console.log("userName:",this.userName);
		console.log("password:",this.password);
		console.log("eventsCreated:");
		for(let i = 0; i < this.eventsCreated.length; i++)
			console.log(this.eventsCreated[i]);
		console.log("eventsJoined:");
		for(let i = 0; i < this.eventsJoined.length; i++)
			console.log(this.eventsJoined[i]);
		console.log("--");
	}
}
