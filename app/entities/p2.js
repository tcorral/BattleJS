(function (win, doc, MMM) {

	'use strict';

	MMM.create("entity").set("p2", function (oSandbox) {

		return {

			heartbeat : function () {
				//this.move(nMove);
				//this.rotate(1);
			},

			collisionWithWall : function () {
				oSandbox.debug.log("Collision WITH WALL!!!", null, 1000);
			},

			collisionWithBot : function () {
				oSandbox.debug.log("Collision WITH BOT!!!", null, 1000);
			},

			collisionWithBullet : function (oData) {
				console.log(oData);
			},

			botDetected : function () {},

			bulletDetected : function () {},

		};

	});

}(window, document, MMM));
