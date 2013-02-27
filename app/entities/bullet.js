(function (win, doc, MMM) {

	'use strict';

	MMM.create("entity").set("bullet", function (oSandbox) {

		return {

			type: "circle",
			renderer: "circle",

			radius : 2,
			x : 0,
			y : 0,
			velocity : {
				x : 0,
				y : 0
			},
			initialVelocity : 6,

			init : function () {
				var oVelocity,
					oPosition;

				this.fillStyle("#FF0000");

				oVelocity = win.Trigo.getAdjacentAndOpposite({
					angle : this.oBot.angle.cannon,
					hypotenuse : this.initialVelocity
				});

				oPosition = win.Trigo.getAdjacentAndOpposite({
					angle : this.oBot.angle.cannon,
					hypotenuse : this.oBot.radius
				});

				this.x = oPosition.adjacent + this.oBot.x;
				this.y = oPosition.opposite + this.oBot.y;

				this.velocity.x = oVelocity.adjacent;
				this.velocity.y = oVelocity.opposite;

			},
			update : function () {
				this.x += this.velocity.x;
				this.y += this.velocity.y;
			}

		};

	});

}(window, document, MMM));