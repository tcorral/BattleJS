(function (win, doc, MMM) {

	'use strict';

	MMM.create("entity").set("mediator", function (oSandbox) {

		var oRealBot,
			oArena;

		return {

			/**
			 * Define the logicalBot.
			 * @param {object} oBot LogicalBot instance.
			 */
			defineRealBot : function (oBot) {
				oRealBot = oBot;
			},
			/**
			 * To move the logicalBot.
			 * @param {number} nVelocity Desired velocity in %.
			 */
			move : function (nVelocity) {
				oRealBot.move(nVelocity);
			},
			/**
			 * To rotate the logicalBot.
			 * @param {number} nDegree Degree.
			 */
			rotate : function (nDegree) {
				oRealBot.rotateBot(nDegree);
			},
			/**
			 * To rotate the cannon.
			 * @param {number} nDegree Degree.
			 */
			rotateCannon : function (nDegree) {
				oRealBot.rotateCannon(nDegree);
			},
			/**
			 * Makes shot the logicalBot.
			 * @param {number} nPower Shot power.
			 */
			shoot : function (nPower) {
				oRealBot.shoot(nPower);
			},

			get : {
				angle : function () {
					return oRealBot.angle.bot;
				},
				cannon : function () {
					return oRealBot.angle.cannon;
				},
				life : function () {
					return oRealBot.life;
				}
			},

			/**
			 * Execute the user bot heartbeat.
			 */
			updateBot : function () {
					/**
					 * LogicalBot data that can be used by the
					 * user bot.
					 */
				var oData = {
					position : {
						x : oRealBot.x,
						y : oRealBot.y
					}
				};
				// User bot heart beat.
				this.heartbeat(oData);
			}

		};

	});

}(window, document, MMM));