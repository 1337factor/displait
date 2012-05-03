var Displait = (function () {
	var r = {
		settings: {},
		data: {},
		Utils: {
			templates: {},
			/**
			 * This function searches the lis tof dictionaries by the attributes that can even be objects, but doesn't go beyond first level for the comparison.
			 * The comparison is strict (===)!
			 *
			 * @param list of objects to search from
			 * @param attribute by which to search
			 * @param content the value of the field of the searched object
			 */
			searchObjectList: function (list, attribute, content) {
				var i = 0, j = list.length;
				if (list.length < 1 || !attribute || !content) { // If list is empty OR attribute is evaluated to false OR content is evaluated to false -> return null
					return null;
				}

				for (; i < j; i += 1) {
					if (list[i][attribute] === content) {
						return list[i]; // Don't proceed if you find the desired element!
					}
				}
			},
			capitalize: function (text) {
				if (!text || text.length < 1) {
					return null; // Should I rather return an empty string here?
				}
				return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
			},
			/**
			 * Simple template system
			 * @author Alessandro Pasotti
			 * @url http://www.itopen.it/2007/08/24/un-semplicissimo-sistema-di-template-in-javascripta-super-simple-javascript-templating-system
			 *
			 * Usage:
			 * var t = new Template('<div id="div_{id}" class="{class}"></div>');
			 * var html = t.run({id : 'div_one', class : 'my_class'});
			 *
			 * This version is modified
			 * TODO: devise and implement tests for this (especially for testing whether the string copy in render works...)
			 */
			template: function(template) {
				if (!this.templates[template]) {
					this.templates[template] = {
						tpl: template,
						tokens: [],
						isCompiled: false,
						compile: function () {
							var re = /\{(\w+)\}/g, tok = null;
							while ((tok = re.exec(this.tpl)) != null) {
								this.tokens.push(tok[1]);
							}
							this.isCompiled = true;
						},
						render: function (json) {
							var rendered = this.tpl; // This doesn't provide any guarantee that "rendered" will hold a true copy of the string stored in this.tpl...
							//var rendered = '' + this.tpl; // Is this really necessary? Maybe... this ensures that "rendered" will get a true copy of this.tpl's value
							if (!this.isCompiled) {
								this.compile();
							}
							for (var jk = 0; jk < this.tokens.length; jk++) {
								var pattern = new RegExp('\{' + this.tokens[jk] + '\}', 'g');
								rendered = rendered.replace(pattern, json[this.tokens[jk]]);
							}
							return rendered;
						}
					}
				}
				return r.templates[template];
			}
		},
		ItemList: {
			skeleton: '',
			dueDateAutocomplete: function () {
				var autocompleteDueDate = function (input) {
					var dateBehaviour = {
						'Today': function (ev) {
							$(input).attr('value', r.TimeUtils.formatDate(new Date()));
							r.ItemList.autocompleteClear();
							ev.preventDefault();
						},
						'Tomorrow': function (ev) {
							$(input).attr('value', r.TimeUtils.formatDate(r.TimeUtils.addDaysToDate(new Date(), 1)));
							r.ItemList.autocompleteClear();
							ev.preventDefault();
						},
						'In Two Days': function (ev) {
							$(input).attr('value', r.TimeUtils.formatDate(r.TimeUtils.addDaysToDate(new Date(), 2)));
							r.ItemList.autocompleteClear();
							ev.preventDefault();
						},
						'In Three Days': function (ev) {
							$(input).attr('value', r.TimeUtils.formatDate(r.TimeUtils.addDaysToDate(new Date(), 3)));
							r.ItemList.autocompleteClear();
							ev.preventDefault();
						},
						'In A Week': function (ev) {
							$(input).attr('value', r.TimeUtils.formatDate(r.TimeUtils.addDaysToDate(new Date(), 7)));
							r.ItemList.autocompleteClear();
							ev.preventDefault();
						},
						'In Two Weeks': function (ev) {
							$(input).attr('value', r.TimeUtils.formatDate(r.TimeUtils.addDaysToDate(new Date(), 14)));
							r.ItemList.autocompleteClear();
							ev.preventDefault();
						},
						'In A Month': function (ev) {
							$(input).attr('value', r.TimeUtils.formatDate(r.TimeUtils.addMothsToDate(new Date(), 1)));
							r.ItemList.autocompleteClear();
							ev.preventDefault();
						}
					},
					dateList = $('<ul>', {
						'class': 'autocomplete dropdown fine-gradient'
					}).css({
						'top': $(input).position().top + 26,
						'left': $(input).position().left,
						'width': $(input).outerWidth()
					});
					$.each(dateBehaviour, function (key, value) {
						dateList.append($('<li>').append($('<a>', {
							href: '#',
							text: key
						})
						.on('click.autocomplete', value)
						.css({
							'text-align': 'left'
						})));
					});
					$(input).parent().append(dateList);
				};

				$('.itemlist').on('focus.autocomplete click.autocomplete', '.itemlist-due', function (ev) {
					autocompleteDueDate(this);
				});
				$('.itemlist').on('blur.autocomplete', '.itemlist-due', function (ev) {
					r.ItemList.autocompleteClear();
				});
			},
			autocompleteClear: function () {
				$('.autocomplete').remove();
			},
			orderMenu: function () {
				$('.itemlist .itemlist-header').find('ul').hide().end()
				.find('span').on('click', function () {
					$(this).next('ul').show();
				}).end();

				$('.itemlist-items li').find('ol.sublist').hide().end()
				.find('h6 a').on('click', function (ev) {
					$(this).closest('h6').next('ol.sublist').toggle();
					ev.preventDefault();
				});
			},
			initialize: function () {
				this.dueDateAutocomplete();
				this.autocompleteClear();
				this.orderMenu();
			}
		},
		TimeUtils: {
			formatDate: function (date) {
				return date.format(r.settings.dateFormat || 'mmm dd yyyy');
			},
			addDaysToDate: function (date, number) {
				date.setDate(date.getDate() + number);
				return date;
			},
			addMothsToDate: function (date, number) {
				date.setMonth(date.getMonth() + number);
				return date;
			},
			/** Returns dict formated as such:
			 * {
			 *  date: 'mmm dd yyyy' // unless you specify your format in your settings
			 *  time: '01 : 01' // unless you specify your format in your settings
			 * }
			 */
			formatClockDateTime: function (date) {
				return {
					date: date.format(r.settings.dateFormat || 'mmm dd yyyy'),
					time: date.format(r.settings.timeFormat || 'hh : MM')
				};
			}
		},
		Clock: {
			initialize: function () {
				var dateElement = $('.' + r.settings.clock.timeMacro),
				timeElement = $('.' + r.settings.clock.timeMicro),
				renderTime = function () { // Put the formatting for time into Utils
					var date = new Date(),
					formattedDateTime = r.TimeUtils.formatClockDateTime(date);

					timeElement.text(formattedDateTime.time);
					dateElement.text(formattedDateTime.date);
				};
				setInterval(renderTime, 500);
			}
		},
		UI: {
			draggables: function () {
				$('body').sortable({
					revert: true,
					containment: "body"
				});
			},
			initialize: function () {
				this.draggables();
			}
		}
	}, u = {
		/**
		 * From Zemanta jQuery widget class
		 * Licensed under GPLv3
		 * @author Zemanta Front-end Team <info@zemanta.com>
		 *
		 *     This is a little bit modified code.
		 *     Usage:
		 *
		 *     Displait.events.trigger('eventName', {data: value}); // To trigger an event
		 *     Displait.one('eventName', function () {...}); // To attach one time handler
		 *     Displait.bind('eventName', function () {...}); // To attach handler
		 *     Displait.unbind('eventName', function () {...}); // To detach handler
		 */
		Events: (function () {
			var h = $({}), u = {
				trigger: function () {
					try {
						h.trigger.apply(h, arguments);
					} catch (er) {
						return; // This is so wrong, but I have no good logging function atm.
					}
				},
				init: function (o) {
					h = $(o);
					(function (method) {
						if (method.constructor === Array) {
							$.map(method, arguments.callee);
						} else {
							o[method] = function () {
								h[method].apply(h, arguments);
								return this;
							};
						}
					}(['bind', 'one', 'unbind']));
					return o;
				}
			};
			return u;
		}()),
		initialize: function (settings) {
			r.settings = settings;

			// Start initializing
			r.Clock.initialize();
			r.UI.initialize();
			r.ItemList.initialize();

			return this; // this is u, the public part
		}
	};
	return u;
})();
