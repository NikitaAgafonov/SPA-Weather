let days = [];
let selectedDay = 0;
let daysWatch = [];

function getFiveDayTemp(i) {
	let date = new Date();
	let temp = {
		date: date.getTime()+1000*3600*24*i,
		state: 'Солнечно',
		temp: Math.round(Math.random()*(-30))
	};
	return temp;
}

function getDate(time) {
	let date = new Date(time),
		month = date.getMonth(),
		day = date.getDate(),
		nameMonth = '';
		allMonth = ['Января','Февраля','Марта','Апреля','Мая','Июня','Июля','Августа','Сентября','Октября','Ноября','Декабря'];
	return date.getDate() + ' ' + allMonth[month];
}

function returnMainTemp(days,selected) {
	let returnDays = [];
	
	if (selected === 0) {
		returnDays.push(0);
	} else {
		returnDays.push(days[selected-1]);
	}
	returnDays.push(days[selected]);
	if (selected === 4) {
		returnDays.push(0);
	} else {
		returnDays.push(days[selected+1]);
	}
	return returnDays;
}

function showPastTemp(day) {
	if (day) {
		let showDate = document.getElementsByClassName('past-temp__date_center-top')[0],
			showTemp = document.getElementsByClassName('past-temp__temperature_center')[0],
			showState = document.getElementsByClassName('past-temp__state_bottom')[0],
			pastTemp = document.getElementsByClassName('past-temp_left-center')[0],
			date = getDate(day.date);
		pastTemp.style.opacity = 1;
		showDate.innerHTML = date;
		showTemp.innerHTML = day.temp+'°';
		showState.innerHTML = day.state;
	} else {
		let pastTemp = document.getElementsByClassName('past-temp_left-center')[0];
		pastTemp.style.opacity = 0;
	}
}

function showNowTemp(day) {
	let showDate = document.getElementsByClassName('now-temp__date_center-top')[0],
		showTemp = document.getElementsByClassName('now-temp__temperature_center')[0],
		showState = document.getElementsByClassName('now-temp__state_center')[0],
		date = getDate(day.date);
	showDate.innerHTML = date;
	showTemp.innerHTML = day.temp+'°';
	showState.innerHTML = day.state;
}

function showNextTemp(day) {
	if (day) {
		let showDate = document.getElementsByClassName('next-temp__date_center-top')[0],
			showTemp = document.getElementsByClassName('next-temp__temperature_center')[0],
			showState = document.getElementsByClassName('next-temp__state_bottom')[0],
			nextTemp = document.getElementsByClassName('next-temp_right-center')[0],
			date = getDate(day.date);
		nextTemp.style.opacity = 1;
		showDate.innerHTML = date;
		showTemp.innerHTML = day.temp+'°';
		showState.innerHTML = day.state;
	} else {
		let nextTemp = document.getElementsByClassName('next-temp_right-center')[0];
		nextTemp.style.opacity = 0;
	}
}

function showMainTemp(days) {
	showPastTemp(days[0]);
	showNowTemp(days[1]);
	showNextTemp(days[2]);
}

function showCalendarTemp(days) {
	let boxTempDate = document.getElementsByClassName('box-temp__date'),
		boxTempTemp = document.getElementsByClassName('box-temp__temp'),
		boxTemp = document.getElementsByClassName('box-temp');
	for (let i=0; i<days.length; i++) {
		console.log(days[i].date);
		boxTempDate[i].innerHTML = getDate(days[i].date);
		boxTempTemp[i].innerHTML = days[i].temp;
		boxTemp[i].onclick = function () {
			selectedDay = i;
			showMainTemp(returnMainTemp(days, selectedDay));
		}
	}
}

document.addEventListener('DOMContentLoaded', function (event) {

	for (let i=0;i<5;i++) {
		days.push(getFiveDayTemp(i));
	}

	let daysWatch = returnMainTemp(days,selectedDay);
	let pastDay = document.getElementsByClassName('past-temp_left-center')[0],
		nowDay = document.getElementsByClassName('now-temp_center')[0],
		nextDay = document.getElementsByClassName('next-temp_right-center')[0];

	pastDay.onclick = function () {
		selectedDay--;
		if (selectedDay < 0) selectedDay=0;
		daysWatch = returnMainTemp(days,selectedDay);
		showMainTemp(daysWatch);
	}

	nowDay.onclick = function () {
		selectedDay;
		daysWatch = returnMainTemp(days,selectedDay);
		showMainTemp(daysWatch);
	}

	nextDay.onclick = function () {
		selectedDay++;
		if (selectedDay > 4) selectedDay=4;
		daysWatch = returnMainTemp(days,selectedDay);
		showMainTemp(daysWatch);
	}

	showMainTemp(daysWatch);
	showCalendarTemp(days);
});