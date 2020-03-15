

document.addEventListener("DOMContentLoaded", ()=>
{
	let borderRed=document.querySelector("#borderRed");
	let borderGreen=document.querySelector("#borderGreen");
	let borderBlue=document.querySelector("#borderBlue");
	let borderWidth=document.querySelector("#borderWidth");
	let backgroundRed=document.querySelector("#backgroundRed");
	let backgroundBlue=document.querySelector("#backgroundBlue");
	let backgroundGreen=document.querySelector("#backgroundGreen");
	let submit = document.querySelector("#submit");
	updateStyle = ()=>
	{
		let paragraph = document.querySelector("#paragraph");
		paragraph.style.borderStyle="solid";
		let red = parseInt(borderRed.value);
		let blue = parseInt(borderBlue.value);
		let green = parseInt(borderGreen.value);
		paragraph.style.borderColor = "rgb("+red+","+green+","+blue+")";
		let width = parseInt(borderWidth.value);
		paragraph.style.borderWidth = width+"px";
		red = parseInt(backgroundRed.value);
		blue = parseInt(backgroundBlue.value);
		green = parseInt(backgroundGreen.value);
		paragraph.style.backgroundColor = "rgb("+red+","+green+","+blue+")";
	}
	submit.addEventListener("click", updateStyle);
})
