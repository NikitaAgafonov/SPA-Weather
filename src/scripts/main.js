"use strict";

var daysTemp = [],
    listTemp = [],
    daysWatch = [],
    selectedDay = 0,
    apiKey = '91e7624fe047e7301b135221bf0587cf',
    idTown = 1496153;

function getData() {
	$.ajax({
		method: "GET",
		url: "http://api.openweathermap.org/data/2.5/forecast/city?id=" + idTown + "&APPID=" + apiKey
	}).done(function (data) {
		listTemp = [];
		daysWatch = [];
		daysTemp = [];
		for (var i = 0; i < data.list.length; i++) {
			listTemp.push(data.list[i]);
		}
		getDaysTemp(listTemp);
		console.log(daysTemp);
		MainEvent();
	});
};

getData();

function getNameDate(time) {
	var date = new Date(time),
	    month = date.getMonth(),
	    day = date.getDate(),
	    nameMonth = '',
	    allMonth = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
	return date.getDate() + ' ' + allMonth[month];
}

function getDaysTemp(listTemp) {
	var date = new Date(listTemp[0].dt_txt),
	    nowDay = date.getDate();
	for (var i = 0, j = 0; i < 5; i++) {
		daysTemp[i] = [];
		for (; j < listTemp.length; j++) {
			var listDate = new Date(listTemp[j].dt_txt);
			if (listDate.getDate() === nowDay) {
				daysTemp[i].push(listTemp[j]);
			} else {
				break;
			}
		}
		nowDay++;
	}
	daysTemp.length = 5;
}

function returnMainTemp(days, selected) {
	var returnDays = [];
	if (selected === 0) {
		returnDays.push(0);
	} else {
		returnDays.push(days[selected - 1]);
	}
	returnDays.push(days[selected]);
	if (selected === 4) {
		returnDays.push(0);
	} else {
		returnDays.push(days[selected + 1]);
	}
	return returnDays;
}

function showPastTemp(day) {
	if (day) {
		var showDate = document.getElementsByClassName('past-temp__date_center-top')[0],
		    showTemp = document.getElementsByClassName('past-temp__temperature_center')[0],
		    showState = document.getElementsByClassName('past-temp__state_bottom')[0],
		    pastTemp = document.getElementsByClassName('past-temp_left-center')[0],
		    date = getNameDate(day[0].dt_txt),
		    temp = void 0,
		    weather = void 0,
		    icon = void 0;
		for (var i = 0; i < day.length; i++) {
			var dayTime = new Date(day[i].dt_txt);
			if (dayTime.getHours() === 12) {
				temp = Math.round(day[i].main.temp - 273);
				weather = day[i].weather[0].main;
				icon = day[i].weather[0].icon;
			};
		};
		if (!temp) temp = Math.round(day[0].main.temp - 273);
		if (!weather) weather = day[0].weather[0].main;
		if (!icon) icon = day[0].weather[0].icon;
		pastTemp.style.opacity = 1;
		pastTemp.style.background = "url('./img/" + icon + "_min.jpg') no-repeat";
		pastTemp.style.backgroundPosition = 'center';
		showDate.innerHTML = date;
		showTemp.innerHTML = temp + '°C';
		showState.innerHTML = weather;
	} else {
		var _pastTemp = document.getElementsByClassName('past-temp_left-center')[0];
		_pastTemp.style.opacity = 0;
	}
}

function showNowTemp(day) {
	var showDate = document.getElementsByClassName('now-temp__date_center-top')[0],
	    showTemp = document.getElementsByClassName('now-temp__temperature_center')[0],
	    showState = document.getElementsByClassName('now-temp__state_center')[0],
	    showIcon = document.getElementsByClassName('now-temp__icon_center')[0],
	    showTimeTempTime = document.getElementsByClassName('times-temp__time'),
	    showTimeTempTemp = document.getElementsByClassName('times-temp__temp'),
	    statistic = document.getElementById('statistic'),
	    forecast = document.getElementById('forecast'),
	    date = getNameDate(day[0].dt_txt),
	    timeTempTemp = void 0,
	    timeTempTime = void 0,
	    temp = void 0,
	    weather = void 0,
	    icon = void 0;

	for (var i = 0; i < 3; i++) {
		showTimeTempTemp[i].innerHTML = '';
		showTimeTempTime[i].innerHTML = '';
	}

	for (var _i = 0; _i < day.length; _i++) {
		var dayTime = new Date(day[_i].dt_txt);
		if (dayTime.getHours() === 12) {
			temp = Math.round(day[_i].main.temp - 273);
			weather = day[_i].weather[0].main;
			icon = day[_i].weather[0].icon;
			timeTempTemp = [Math.round(day[_i].main.temp - 273), Math.round(day[_i + 1].main.temp - 273), Math.round(day[_i + 2].main.temp - 273)];
			timeTempTime = [Math.round(new Date(day[_i].dt_txt).getHours()), Math.round(new Date(day[_i + 1].dt_txt).getHours()), Math.round(new Date(day[_i + 2].dt_txt).getHours())];
			for (var k = 0; k < 3; k++) {
				showTimeTempTemp[k].innerHTML = timeTempTemp[k] + '°C';
				showTimeTempTime[k].innerHTML = timeTempTime[k] + ':00';
			}
		};
	};

	if (!timeTempTime || !timeTempTemp) {
		timeTempTime = [];
		timeTempTemp = [];
		for (var _i2 = 0; _i2 < day.length; _i2++) {
			if (_i2 === 3) break;
			if (day[_i2].main.temp) timeTempTemp.push(Math.round(day[_i2].main.temp - 273));
			if (day[_i2].dt_txt) timeTempTime.push(Math.round(new Date(day[_i2].dt_txt).getHours()));
			if (timeTempTemp[_i2] && timeTempTime[_i2]) {
				showTimeTempTemp[_i2].innerHTML = timeTempTemp[_i2] + '°C';
				showTimeTempTime[_i2].innerHTML = timeTempTime[_i2] + ':00';
			}
		}
	}

	if (!temp) temp = Math.round(day[0].main.temp - 273);
	if (!weather) weather = day[0].weather[0].main;
	if (!icon) icon = day[0].weather[0].icon;
	showDate.innerHTML = date;
	showTemp.innerHTML = temp + '°C';
	showIcon.innerHTML = '<img src="http://openweathermap.org/img/w/' + icon + '.png"></img>';
	document.body.style.background = "url('./img/" + icon + ".jpg') no-repeat";
	document.body.style.backgroundPosition = "center";

	showState.innerHTML = weather;
	statistic.onclick = function () {
		showStatistic(day);
	};
	forecast.onclick = function () {
		showForecast(day);
	};
}

function showNextTemp(day) {
	if (day.length) {
		var showDate = document.getElementsByClassName('next-temp__date_center-top')[0],
		    showTemp = document.getElementsByClassName('next-temp__temperature_center')[0],
		    showState = document.getElementsByClassName('next-temp__state_bottom')[0],
		    nextTemp = document.getElementsByClassName('next-temp_right-center')[0],
		    date = getNameDate(day[0].dt_txt),
		    temp = void 0,
		    weather = void 0,
		    icon = void 0;
		for (var i = 0; i < day.length; i++) {
			var dayTime = new Date(day[i].dt_txt);
			if (dayTime.getHours() === 12) {
				temp = Math.round(day[i].main.temp - 273);
				weather = day[i].weather[0].main;
				icon = day[i].weather[0].icon;
			};
		};
		if (!temp) temp = Math.round(day[0].main.temp - 273);
		if (!weather) weather = day[0].weather[0].main;
		if (!icon) icon = day[0].weather[0].icon;
		nextTemp.style.opacity = 1;
		nextTemp.style.background = "url('./img/" + icon + "_min.jpg') no-repeat";
		nextTemp.style.backgroundPosition = 'center';
		showDate.innerHTML = date;
		showTemp.innerHTML = temp + '°C';
		showState.innerHTML = weather;
	} else {
		var _nextTemp = document.getElementsByClassName('next-temp_right-center')[0];
		_nextTemp.style.opacity = 0;
	}
}

function showMainTemp(days) {
	$('main').animate({ 'opacity': '0' }, 600, function () {
		showPastTemp(days[0]);
		showNowTemp(days[1]);
		showNextTemp(days[2]);
		$(this).animate({ 'opacity': '1' }, 600);
	});
}

function showCalendarTemp(days) {
	console.log(days);
	var boxTempDate = document.getElementsByClassName('box-temp__date'),
	    boxTempTemp = document.getElementsByClassName('box-temp__temp'),
	    boxTempIcon = document.getElementsByClassName('box-temp__icon'),
	    boxTemp = document.getElementsByClassName('box-temp');

	var _loop = function _loop(i) {
		//console.log(days[i][0])
		var nameDay = getNameDate(days[i][0].dt_txt),
		    temp = void 0,
		    icon = void 0;
		for (var j = 0; j < days[i].length; j++) {
			var date = new Date(days[i][j].dt_txt);
			if (date.getHours() === 12) {
				temp = Math.round(days[i][j].main.temp - 273);
				icon = days[i][j].weather[0].icon;
			};
		}
		if (!temp) temp = Math.round(days[i][0].main.temp - 273);
		if (!icon) icon = days[i][0].weather[0].icon;
		boxTempDate[i].innerHTML = getNameDate(days[i][0].dt_txt);
		boxTempTemp[i].innerHTML = temp + '°C';
		boxTempIcon[i].innerHTML = '<img src="http://openweathermap.org/img/w/' + icon + '.png"></img>';
		boxTemp[i].style.background = "url('./img/" + icon + "_min.jpg') no-repeat";
		boxTemp[i].style.backgroundPosition = 'center';
		boxTemp[i].onclick = function () {
			selectedDay = i;
			showMainTemp(returnMainTemp(days, selectedDay));
		};
	};

	for (var i = 0; i < 5; i++) {
		_loop(i);
	}
}

function showStatistic(day) {
	var pastTemp = document.getElementsByClassName('past-temp_left-center')[0],
	    nextTemp = document.getElementsByClassName('next-temp_right-center')[0],
	    nowTemp = document.getElementsByClassName('now-temp_center')[0],
	    statistic = document.getElementsByClassName('statistic_full-width')[0],
	    linkBack = document.getElementsByClassName('statistic__link-back')[0];
	pastTemp.hidden = true;
	nowTemp.hidden = true;
	nextTemp.hidden = true;
	statistic.hidden = false;
	$(statistic).animate({ 'width': document.documentElement.clientWidth + 'px' }, 600);
	linkBack.onclick = function () {
		$(statistic).animate({ 'opacity': '0' }, 600, function () {
			pastTemp.hidden = false;
			nowTemp.hidden = false;
			nextTemp.hidden = false;
			statistic.hidden = true;
			statistic.style.opacity = '1';
			statistic.style.width = 'auto';
		});
	};
	document.getElementById('grnd-level').innerHTML = day[0].main.grnd_level;
	document.getElementById('humidity').innerHTML = day[0].main.humidity;
	document.getElementById('pressure').innerHTML = day[0].main.pressure;
	document.getElementById('sea-level').innerHTML = day[0].main.sea_level;
	document.getElementById('wind-speed').innerHTML = day[0].wind.speed;
	document.getElementById('temp-max').innerHTML = Math.round(day[0].main.temp_max - 273);
	document.getElementById('temp-min').innerHTML = Math.round(day[0].main.temp_min - 273);
}

function showForecast(day) {
	console.log(day);
	var pastTemp = document.getElementsByClassName('past-temp_left-center')[0],
	    nextTemp = document.getElementsByClassName('next-temp_right-center')[0],
	    nowTemp = document.getElementsByClassName('now-temp_center')[0],
	    forecast = document.getElementsByClassName('forecast_full-width')[0],
	    linkBack = document.getElementsByClassName('forecast__link-back')[0],
	    forecastTime = document.getElementsByClassName('forecast__time'),
	    forecastTemp = document.getElementsByClassName('forecast__temp');
	pastTemp.hidden = true;
	nowTemp.hidden = true;
	nextTemp.hidden = true;
	forecast.hidden = false;
	$(forecast).animate({ 'width': document.documentElement.clientWidth + 'px' }, 600);
	linkBack.onclick = function () {
		$(forecast).animate({ 'opacity': '0' }, 600, function () {
			pastTemp.hidden = false;
			nowTemp.hidden = false;
			nextTemp.hidden = false;
			forecast.hidden = true;
			forecast.style.opacity = '1';
			forecast.style.width = 'auto';
		});
	};
	for (var i = 0; i < day.length; i++) {
		forecastTime[i].innerHTML = Math.round(new Date(day[i].dt_txt).getHours()) + ':00';
		forecastTemp[i].innerHTML = Math.round(day[i].main.temp - 273) + '°C';
	}
}

function MainEvent() {
	var selectTown = document.getElementsByClassName('form-setTown__select')[0];
	selectTown.onchange = function (event) {
		if (event.target.value === 'Omsk') idTown = 1496153;
		if (event.target.value === 'Moskow') idTown = 524901;
		if (event.target.value === 'Sochi') idTown = 491422;
		getData();
	};

	var daysWatch = returnMainTemp(daysTemp, selectedDay);
	var pastDay = document.getElementsByClassName('past-temp_left-center')[0],
	    nowDay = document.getElementsByClassName('now-temp_center')[0],
	    nextDay = document.getElementsByClassName('next-temp_right-center')[0];

	pastDay.onclick = function () {
		selectedDay--;
		if (selectedDay < 0) selectedDay = 0;
		daysWatch = returnMainTemp(daysTemp, selectedDay);
		showMainTemp(daysWatch);
	};

	nextDay.onclick = function () {
		selectedDay++;
		if (selectedDay > 4) selectedDay = 4;
		daysWatch = returnMainTemp(daysTemp, selectedDay);
		showMainTemp(daysWatch);
	};
	showMainTemp(daysWatch);
	showCalendarTemp(daysTemp);
};