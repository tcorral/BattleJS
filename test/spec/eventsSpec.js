(function (win, doc) {

	'use strict';

	var describe = win.describe,
		expect = win.expect,
		it = win.it,
		spyOn = win.spyOn;

	describe("events method", function() {

		var oEvents,
			oCanvas;

		beforeEach(function () {
			oEvents = MMM.sandbox.events;
		});

		it("exist", function() {
			expect(oEvents).toBeObject();
		});

		it("have a 'bind' method", function () {
			expect(oEvents.bind).toBeFunction();
		});

		it("have a 'trigger' method", function () {
			expect(oEvents.trigger).toBeFunction();
		});

		it("have a 'clean' method", function () {
			expect(oEvents.clean).toBeFunction();
		});

		describe("bind / trigger methods", function () {

			it("'trigger' method throws an error if called incorrectly", function () {

				expect(oEvents.trigger).toThrow();

			});

			it("'trigger' method triggers the event when first argument is an string", function () {

				var oEntity = {
					events : {
						event1 : function () {}
					}
				},
				oData = {
					some : 'data',
					more : 'information'
				};

				spyOn(oEntity.events, "event1");

				oEvents.bind('event1', oEntity);
				oEvents.trigger('event1', oData);

				expect(oEntity.events.event1).toHaveBeenCalledWith(oData);

			});

			it("'trigger' method triggers the event when first argument is an array of events", function () {

				var oEntity = {
					events : {
						event1 : function () {},
						event2 : function () {}
					}
				};

				spyOn(oEntity.events, "event1");
				spyOn(oEntity.events, "event2");

				oEvents.bind(['event1', 'event2'], oEntity);
				oEvents.trigger('event1', null);
				oEvents.trigger('event2', null);

				expect(oEntity.events.event1).toHaveBeenCalled();
				expect(oEntity.events.event2).toHaveBeenCalled();

			});

			it("'trigger' method sends the event information to the listeners when first argument is a string", function () {

				var oEntity = {
					events : {
						event1 : function () {}
					}
				},
				oData = {
					some : 'data',
					more : 'information'
				};

				spyOn(oEntity.events, "event1");

				oEvents.bind('event1', oEntity);
				oEvents.trigger('event1', oData);

				expect(oEntity.events.event1).toHaveBeenCalledWith(oData);

			});

			it("'trigger' method sends the event information to the listeners when first argument is an object", function () {

				var oEntity = {
					events : {
						event1 : function () {}
					}
				},
				oData = {
					type : 'event1',
					some : 'data',
					more : 'information'
				};

				spyOn(oEntity.events, "event1");

				oEvents.bind('event1', oEntity);
				oEvents.trigger(oData);

				expect(oEntity.events.event1).toHaveBeenCalledWith(oData);

			});

		});

		describe("remove method", function () {

			it("remove an element event", function () {

				var oEntity = {
					events : {
						event1 : function () {}
					}
				};

				spyOn(oEntity.events,"event1");

				oEvents.bind('event1', oEntity);
				oEvents.clean('event1', oEntity);
				oEvents.trigger('event1');

				expect(oEntity.events.event1).not.toHaveBeenCalled();

			});

		});


	});

}(window, document));