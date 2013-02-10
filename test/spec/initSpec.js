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

	describe("MMM.init", function() {

		var oCanvasInfo;

		beforeEach(function () {
			var oCanvas = doc.getElementById('MMM_Canvas');

			if (oCanvas !== null) {
				oCanvas.parentNode.removeChild(oCanvas);
			}

			MMM.create("level", "idLevel", function () {});

			oCanvasInfo = {
				canvas : {
					width : 960,
					height : 540,
					rescale : false
				},
				debug : true,
				images : [],
				audio : [],
				initialLevel : "idLevel"
			};
		});

		it("adds a Canvas Element on the Body", function () {

			MMM.create("bootstrap", oCanvasInfo);
			MMM.init();

			expect(doc.getElementsByTagName('canvas').length).toBe(1);

		});

		it("modify the canvas width & height properties", function () {

			var oCanvas;

			MMM.create("bootstrap", oCanvasInfo);
			MMM.init();

			oCanvas = doc.getElementsByTagName('canvas')[0];

			expect(oCanvas.width).toBe(960);
			expect(oCanvas.height).toBe(540);

		});

		it("throws an error if the width property is not valid", function () {

			oCanvasInfo.canvas.width = null;
			MMM.create("bootstrap", oCanvasInfo);

			expect(function () {
				MMM.init();
			}).toThrow();

		});

		it("throws an error if the height property is not valid", function () {

			oCanvasInfo.canvas.height = null;
			MMM.create("bootstrap", oCanvasInfo);

			expect(function () {
				MMM.init();
			}).toThrow();

		});

			it("does not add style properties to the canvas if rescale is set to 'false'", function () {

			var oCanvas;

			MMM.create("bootstrap", oCanvasInfo);
			MMM.init();

			oCanvas = doc.getElementsByTagName('canvas')[0];

			expect(oCanvas.style.width).toBeFalsy();
			expect(oCanvas.style.height).toBeFalsy();
			expect(oCanvas.style.position).toBeFalsy();
			expect(oCanvas.style.marginLeft).toBeFalsy();

		});

		it("adds style properties to the canvas if rescale is set to 'true'", function () {

			var oCanvas;

			oCanvasInfo.canvas.rescale = true;
			MMM.create("bootstrap", oCanvasInfo);
			MMM.init();

			oCanvas = doc.getElementsByTagName('canvas')[0];

			expect(oCanvas.style.width).toMatch(/^[0-9.]+px/);
			expect(oCanvas.style.height).toMatch(/^[0-9.]+px/);
			expect(oCanvas.style.position).toBe('absolute');
			expect(oCanvas.style.marginLeft).toMatch(/^[0-9.-]+px/);

		});

	});

}(window, document));