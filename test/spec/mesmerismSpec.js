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

	});

}(window, document));