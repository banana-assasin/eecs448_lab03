
//This is the script I used to test StorageManager functionality. Be sure to run this script with storageManager.js and the script that
//contains the Event and User classes (either Event.js or EventClass.js). - Ryan



let myUser1 = new User("Jacob", ["0800"]);	//NOTE: At the moment, User names cannot contain spaces
let myUser2 = new User("Dawson", ["0800","0840"]);
let myEvent = new Event("Ryan's Awesome Birthday Party",["0800","0820","0840"], [myUser1,myUser2], "Ryan", "02", "24", "2020");

let myUser3 = new User("Joshua", ["0220","0240"]);
let myUser4 = new User("Henry",["0200"]);
let myEvent2 = new Event("Noah's Nobel Prize Ceremony",["0200","0220","0240"], [myUser3,myUser4], "Noah?", "05", "26", "2045");

//console.log(myEvent.eventName, myEvent.author, myEvent.getDateString(true));

let sm = new StorageManager();

myEvent.print();
sm.storeEvent(myEvent);		//event0

myEvent.addEventTime("0900");
myEvent.print();

sm.storeEvent(myEvent);		//overrides event0 due to matching name

myEvent2.print();
sm.storeEvent(myEvent2);	//event1

let eventList = sm.retrieveAll();

let myEvent3 = eventList[0];
//let myEvent3 = sm.retrieveEvent("event0");
myEvent3.print();

//sm.clearStorage();	//If you want to wipe the localStorage