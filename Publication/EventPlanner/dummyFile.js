
//@file dummyFile.js
//@author Ryan Boyce
//@date 02/21/20
//@desc This file loads events into local storage for demonstration purposes.


class Dummy
{
	constructor()
	{
		let sm = new StorageManager();

		let myUser1 = new User("Jacob", ["08:00"]);
		let myUser2 = new User("Dawson", ["08:00","08:40"]);
		let myUser3 = new User("Joshua",["08:20"]);
		let myEvent = new Event("Ryan's Awesome Birthday Party",["08:00","08:20","08:40"], [myUser1,myUser2,myUser3], "Ryan", "02", "24", "2020","");
		sm.storeEvent(myEvent);
		

		myUser1 = new User("Henry",["05:00"]);
		myUser2 = new User("Joshua", ["05:20","05:40"]);
		myEvent = new Event("Noah's Nobel Prize Ceremony",["05:00","05:20","05:40"], [myUser1,myUser2], "Noah?", "09", "26", "2045","");
		sm.storeEvent(myEvent);


		myUser1 = new User("Henry",["02:00"]);
		myEvent = new Event("Dawson's Graduation",["21:00","21:20","21:40","22:00"], [myUser1], "Dawson", "05", "21", "2022","dawesome");
		sm.storeEvent(myEvent);


		myEvent = new Event("Jacob's Swimming Party",["17:00","17:20","17:40"], [], "Jacob", "07", "06", "2259","");
		sm.storeEvent(myEvent);


		myUser1 = new User("Dawson",["14:00"]);
		myEvent = new Event("Meeting Time",["14:00"],[],"Jacob","02","21","2020","");
		sm.storeEvent(myEvent);
	}
}
let dummy = new Dummy();
