var Displait = (function () {
	var r = {
		settings: {},
		clock: function () {
			var renderTime = function () {
				var date = new Date(),
					hour = date.getHours(),
					min = date.getMinutes(),
					day = date.getDay(),
					month = date.getMonth(),
					year = date.getYear(),
					ap = '';

				if (year < 1000) {
					year += 1900;
				}

				if (hour ===  0) {
					ap = ' AM';
					hour = 12;
				} else if (hour <= 11) {
					ap = ' AM';
				} else if (hour === 12) {
					ap = ' PM';
				} else if (hour >= 13) {
					ap = ' PM';
					hour -= 12;
				}

				if (hour <= 9) {
					hour = '0' + hour;
				}
				if (min <= 9) {
					min = '0' + min;
				}

				if (day <= 9) {
					day = '0' + day
				}

				if (month <= 9) {
					month = '0' + month
				}

				$('.' + r.settings.clock.timeMicro).text(hour + ':' + min);

				$('.' + r.settings.clock.timeMacro).text(day + '.' + month + '.' + year);
			};
			setInterval(renderTime, 500);
		},
		draggables: function () {
			$('body').sortable({
				revert: true,
				containment: "body"
			});
		},
		todoList: function () {
			$('.todo .todo-header').find('ul').hide().end()
				.find('span').on('click', function () {
					$(this).next('ul').show();
				}).end();
		}
	}, u = {
		initialize: function (settings) {
			r.settings = settings;

			// Start initializing
			r.clock();
			r.draggables();
			r.todoList();

			return this; // this is u, the public part
		}
	};
	return u;
})();
