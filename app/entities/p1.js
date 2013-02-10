(function (win, doc, MMM) {

	'use strict';

	MMM.create("entity").set("p1", function (oSandbox) {

		var nMove = 5;

		return {

			heartbeat : function () {
				this.move(nMove);
			},

			collisionWithWall : function () {},

			collisionWithBot : function () {
				console.log("BOT1 COLLIDE!");
			},

			collisionWithBullet : function () {},

			botDetected : function () {},

			bulletDetected : function () {},

		};

	});

}(window, document, MMM));
