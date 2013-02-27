(function (win, doc, MMM) {

	'use strict';

	MMM.create("entity").set("basicArena", function (oSandbox) {

		return {

			type: "circle",
			renderer: "circle",

			radius : 400,
			x : 400,
			y : 400,

			velocity : {
				x : 0,
				y : 0
			},

			init : function () {
				this.fillStyle("#FFFFFF");
				this.strokeStyle("#000000");
			},

			getVelocityXY : function () {
				return {
					x : 0,
					y : 0
				}
			}

		};

	});

}(window, document, MMM));