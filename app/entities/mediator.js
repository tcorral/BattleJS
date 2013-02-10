MMM.create("entity").set("mediator", function (oSandbox) {

	var oRealBot;

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
		 * @param {number} nAcceleration Acceleration.
		 */
		move : function (nAcceleration) {
			oRealBot.move(nAcceleration);
		},
		/**
		 * To rotate the logicalBot.
		 * @param {number} nDegree Degree.
		 */
		rotate : function (nDegree) {
			oRealBot.rotateBot(nDegree);
		},
		/**
		 * Makes shot the logicalBot.
		 * @param {number} nPower Shot power.
		 */
		shoot : function (nPower) {
			oRealBot.shoot(nPower);
		},

		currentLive : function () {
			return oRealBot.live;
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