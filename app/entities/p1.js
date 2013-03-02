(function (win, doc, MMM) {

	'use strict';

	MMM.create("entity").set("p1", function (oSandbox) {

		return {

			heartbeat : function () {
				//this.move(nMove);
				//this.rotate(nBotRotate);
				//this.rotateCannon(nCannonRotate);
			},

			collisionWithWall : function () {
				oSandbox.debug.log("Collision WITH WALL!!!", null, 1000);
			},

			collisionWithBot : function () {
				oSandbox.debug.log("Collision WITH BOT!!!", null, 1000);
			},

			collisionWithBullet : function (oData) {
				oSandbox.debug.log("Collision WITH BULLET!!!", oData, 1000);
			},

			botDetected : function () {},

			bulletDetected : function () {}

		};

	});

}(window, document, MMM));
