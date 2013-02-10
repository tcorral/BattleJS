/**
 * MMM JS - Javascript library for building HTML5 Canvas Games.
 * By Pere Monfort Pàmies. http://www.project-cyan.com/quienes-somos/
 */
(function (win, doc) {

	'use strict';

	var describe = win.describe,
		expect = win.expect,
		it = win.it,
		spyOn = win.spyOn;

	describe("MMM Object", function() {

		var MMM = window.MMM;

		it("exist", function () {
			expect(MMM).toBeObject();
		});

		it("have a 'create' method", function () {
			expect(MMM.create).toBeFunction();
		});

		describe("create method", function () {

			it("throws an error if the passed type argument is not valid", function () {
				expect(function () {
					MMM.create('notValidType', 'testId', function () {});
				}).toThrow();
			});

			it("throws an error if the passed ID is not an string or it's empty", function () {
				expect(function () {
					MMM.create('level', '', function () {});
				}).toThrow();

				expect(function () {
					MMM.create('level', {}, function () {});
				}).toThrow();
			});

			it("throws an error if the third parameter is not a function", function () {
				expect(function () {
					MMM.create('level', 'testId', null);
				}).toThrow();
			});

		});

	});

}(window, document));