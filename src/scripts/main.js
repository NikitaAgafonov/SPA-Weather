"use strict";

var _module = angular.module('app', ['ngRoute']),
    apiKey = '91e7624fe047e7301b135221bf0587cf';

var daysWatch = [],
    selectedDay = 0;

_module.config(function ($routeProvider) {
	$routeProvider.when('/stat', {
		templateUrl: 'statistic.html',
		controller: 'statistic'
	}).when('/forecast', {
		templateUrl: 'forecast.html',
		controller: 'forecast'
	}).when('/error', {
		template: '<h1>404 NOT FOUND</h1>'
	}).when('/day:id', {
		templateUrl: 'main.html',
		controller: 'dayCtrl'
	});
});

_module.controller('mainCtrl', function ($scope, $http, getData, $location) {
	$scope.dataTown = [{
		name: 'Омск',
		id: 1496153
	}, {
		name: 'Москва',
		id: 524901
	}, {
		name: 'Сочи',
		id: 491422
	}];
	$scope.daysTemp = [];
	$scope.listTemp = [];
	$scope.idTown = 1496153;
	$scope.getData = getData;
	$scope.httpReady = 0;
	if ($location.url() !== '/stat') {
		$scope.$watch('setTown', function (newValue, oldValue, scope) {
			$scope.httpReady = 0;
			if (newValue) {
				$scope.idTown = newValue;
			}
			$scope.getData.getDataServer($scope);
			$location.path('/day0');
		});
	}
});

_module.controller('dayCtrl', function ($scope, $routeParams, $location, showDay) {
	$scope.$watch('httpReady', function (newValue, oldValue, scope) {
		if (newValue) {
			$scope.selectedDay = $routeParams.id;
			$scope.daysWatch = showDay.returnMainTemp($scope.daysTemp, $scope.selectedDay);
			daysWatch = $scope.daysWatch;
			$scope.pastDay = showDay.returnPastDay($scope.daysWatch[0]);
			$scope.nowDay = showDay.returnNowDay($scope.daysWatch[1]);
			$scope.nextDay = showDay.returnNextDay($scope.daysWatch[2]);
			$scope.selectPastDay = function () {
				$scope.selectedDay--;
				$location.path('/day' + $scope.selectedDay);
			};
			$scope.selectNextDay = function () {
				$scope.selectedDay++;
				$location.path('/day' + $scope.selectedDay);
			};
			$scope.showStatistic = function () {};
		}
	});
	$scope.$watch('selectedDay', function (newValue, oldValue, scope) {
		selectedDay = newValue;
	});
});

_module.controller('calendar', function ($scope, $location, showDay) {
	$scope.$watch('httpReady', function (newValue, oldValue, scope) {
		if (newValue) {
			$scope.calendar = showDay.returnCalendar($scope.daysTemp);
			$scope.selectDay = function (id) {
				$location.path('/day' + id);
			};
		}
	});
});

_module.controller('statistic', function ($scope, $location, showDay) {
	if (!daysWatch[1]) {
		$location.path('/error');
	} else {
		$scope.back = function () {
			$location.path('/day' + selectedDay);
		};
		$scope.stat = showDay.returnStat(daysWatch[1]);
	}
});

_module.controller('forecast', function ($scope, $location, showDay) {
	if (!daysWatch[1]) {
		$location.path('/error');
	} else {
		$scope.back = function () {
			$location.path('/day' + selectedDay);
		};
		$scope.forecast = showDay.returnForecast(daysWatch[1]);
	}
});

_module.factory('getData', function ($http) {
	return {
		getDataServer: function getDataServer($scope) {
			$http({
				method: 'GET',
				url: "http://api.openweathermap.org/data/2.5/forecast/city?id=" + $scope.idTown + "&APPID=" + apiKey
			}).then(function (response) {

				$scope.listTemp = [];
				$scope.daysTemp = [];

				for (var i = 0; i < response.data.list.length; i++) {
					$scope.listTemp.push(response.data.list[i]);
				}

				$scope.getData.getDaysTemp($scope);

				$scope.httpReady++;
			});
		},
		getDaysTemp: function getDaysTemp($scope) {

			var date = new Date($scope.listTemp[0].dt_txt),
			    nowDay = date.getDate();
			for (var i = 0, j = 0; i < 5; i++) {
				$scope.daysTemp[i] = [];
				for (; j < $scope.listTemp.length; j++) {
					var listDate = new Date($scope.listTemp[j].dt_txt);
					if (listDate.getDate() === nowDay) {
						$scope.daysTemp[i].push($scope.listTemp[j]);
					} else {
						break;
					}
				}
				nowDay++;
			}
			$scope.daysTemp.length = 5;
		}

	};
});

_module.factory('showDay', function () {
	return {
		getNameDate: function getNameDate(time) {
			var date = new Date(time),
			    month = date.getMonth(),
			    day = date.getDate(),
			    nameMonth = '',
			    allMonth = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
			return date.getDate() + ' ' + allMonth[month];
		},
		returnPastDay: function returnPastDay(day) {
			if (day) {
				var date = this.getNameDate(day[0].dt_txt),
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
				return {
					opacity: 1,
					date: date,
					temp: temp,
					weather: weather,
					icon: icon,
					background: "url('./img/" + icon + "_min.jpg') no-repeat"
				};
			} else {
				return {
					opacity: 0,
					date: 'no data :(',
					temp: 'no data :(',
					weather: 'no data :('
				};
			}
		},
		returnNowDay: function returnNowDay(day) {
			var date = this.getNameDate(day[0].dt_txt),
			    timeTemp = void 0,
			    temp = void 0,
			    weather = void 0,
			    icon = void 0;
			for (var i = 0; i < day.length; i++) {
				var dayTime = new Date(day[i].dt_txt);
				if (dayTime.getHours() === 12) {
					temp = Math.round(day[i].main.temp - 273);
					weather = day[i].weather[0].main;
					icon = day[i].weather[0].icon;
					timeTemp = [{
						temp: Math.round(day[i].main.temp - 273),
						time: Math.round(new Date(day[i].dt_txt).getHours())
					}, {
						temp: Math.round(day[i + 1].main.temp - 273),
						time: Math.round(new Date(day[i + 1].dt_txt).getHours())
					}, {
						temp: Math.round(day[i + 2].main.temp - 273),
						time: Math.round(new Date(day[i + 2].dt_txt).getHours())
					}];
				};
			};
			if (!timeTemp) {
				timeTemp = [];
				for (var _i = 0; _i < day.length; _i++) {
					if (_i === 3) break;
					var obj = {
						temp: Math.round(day[_i].main.temp - 273),
						time: Math.round(new Date(day[_i].dt_txt).getHours())
					};
					timeTemp.push(obj);
				}
			}
			if (!temp) temp = Math.round(day[0].main.temp - 273);
			if (!weather) weather = day[0].weather[0].main;
			if (!icon) icon = day[0].weather[0].icon;
			document.body.style.background = "url('./img/" + icon + ".jpg') no-repeat";
			document.body.style.backgroundPosition = "center";
			return {
				date: date,
				temp: temp,
				weather: weather,
				icon: icon,
				timeTemp: timeTemp
			};
		},
		returnNextDay: function returnNextDay(day) {
			if (day) {
				var date = this.getNameDate(day[0].dt_txt),
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
				return {
					opacity: 1,
					date: date,
					temp: temp,
					weather: weather,
					icon: icon,
					background: "url('./img/" + icon + "_min.jpg') no-repeat"

				};
			} else {
				return {
					opacity: 0,
					date: 'no data :(',
					temp: 'no data :(',
					weather: 'no data :('
				};
			}
		},
		returnMainTemp: function returnMainTemp(days, selected) {
			var returnDays = [];
			if (+selected >= 5) {
				return [days[3], days[4], 0];
			}
			if (+selected <= 0) {
				return [0, days[0], days[1]];
			}
			if (+selected === 0) {
				returnDays.push(0);
			} else {
				returnDays.push(days[+selected - 1]);
			}
			returnDays.push(days[selected]);
			if (+selected === 4) {
				returnDays.push(0);
			} else {
				returnDays.push(days[+selected + 1]);
			}
			return returnDays;
		},
		returnCalendar: function returnCalendar(days) {
			var calendArr = [];
			for (var i = 0; i < 5; i++) {
				//console.log(days[i][0])
				var nameDay = this.getNameDate(days[i][0].dt_txt),
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
				var obj = {
					id: i,
					date: nameDay,
					temp: temp,
					icon: icon
				};
				calendArr.push(obj);
			}
			return calendArr;
		},
		returnStat: function returnStat(day) {
			return {
				grnd_level: day[0].main.grnd_level,
				humidity: day[0].main.humidity,
				pressure: day[0].main.pressure,
				sea_level: day[0].main.sea_level,
				speed: day[0].wind.speed,
				temp_max: Math.round(day[0].main.temp_max - 273),
				temp_min: Math.round(day[0].main.temp_min - 273)
			};
		},
		returnForecast: function returnForecast(day) {
			var arr = [];
			for (var i = 0; i < day.length; i++) {
				var obj = {
					time: Math.round(new Date(day[i].dt_txt).getHours()) + ':00',
					temp: Math.round(day[i].main.temp - 273) + '°C'
				};
				arr.push(obj);
			}
			return arr;
		}
	};
});