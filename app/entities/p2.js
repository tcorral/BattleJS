(function (win, doc, MMM) {

	'use strict';

	MMM.create("entity").set("p2", function (oSandbox) {

		return {

			heartbeat : function () {
				this.move(-5);
			},

			collisionWithWall : function () {},

			collisionWithBot : function () {
				console.log("BOT2 COLLIDE!");
			},

			collisionWithBullet : function () {},

			botDetected : function () {},

			bulletDetected : function () {},

		};

	});

}(window, document, MMM));
