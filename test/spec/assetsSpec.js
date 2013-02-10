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

	describe("assets", function () {

		var oResources,
			oCanvasInfo;

		beforeEach(function () {

			var oCanvas = doc.getElementById('MMM_Canvas');

			if (oCanvas !== null) {
				oCanvas.parentNode.removeChild(oCanvas);
			}

			oResources = MMM.sandbox.assets;

			oCanvasInfo = {
				canvas : {
					width : 960,
					height : 540,
					rescale : false
				},
				debug : true,
				images : [
					{ id : "test_1", src : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGgAAABMCAYAAACBIfKBAAAAN0lEQVR4nO3BAQ0AAAzDoPk33ft4gFUNAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/jnPiQP9Pe9sbwAAAABJRU5ErkJggg==" },
					{ id : "test_2", src : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGgAAABMCAYAAACBIfKBAAAAN0lEQVR4nO3BAQ0AAAzDoPk33ft4gFUNAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/jnPiQP9Pe9sbwAAAABJRU5ErkJggg==" }
				],
				audio : [
					{ id : "test_1", src : "fake/src" }
				],
				initialLevel : "idLevel"
			};

		});

		it("exist", function () {
			expect(oResources).toBeObject();
		});

		it("have a 'get' method", function () {
			expect(oResources.get).toBeFunction();
		});

		it("get method returns an image", function () {

			runs(function () {
				MMM.create("bootstrap", oCanvasInfo);
				MMM.init();
			});

			waits(500);

			runs(function () {

				var oImage = MMM.sandbox.assets.get('image','test_1');
				expect(oImage).toBeObject();

			});

		});

		it("throws an error if the type is not valid", function () {
			expect(function () {
				MMM.sandbox.assets.get('notValid', 'test_1');
			}).toThrow();

			expect(function () {
				MMM.sandbox.assets.get(null, 'test_1');
			}).toThrow();
		});

		it("throws an error if the ID is not valid", function () {
			expect(function () {
				MMM.sandbox.assets.get('image', null);
			}).toThrow();
		});

		it("returns false if the ID does not exist", function () {
			expect(MMM.sandbox.assets.get('image', 'test_noValid')).toBe(false);
		});

	});

}(window, document));