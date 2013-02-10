MMM.create("level").set('arena', function (oSandbox) {

	var /**
		 * Array to store player bots.
		 * @type {array}
		 */
		aLogicalBots = [],
		/**
		 * Array to store logical bots.
		 * @type {array}
		 */
		oRealBots = {},
		/**
		 * Arena entity instance.
		 * @type {object}
		 */
		oArena,
		/**
		 * Collision manager instance.
		 * @type {object}
		 */
		oCollisions = new oSandbox.collisions();

	return {
		init : function () {
			/**
			 * Import Player bots.
			 */
			aLogicalBots.push(this.importEntity("p1"));
			aLogicalBots.push(this.importEntity("p2"));
			/**
			 * Import Arena entity.
			 */
			oArena = this.importEntity("basicArena");

			this.createMediators();
		},
		/**
		 * Create logicalBots and mediators for each bot.
		 */
		createMediators : function () {

			var nLen = aLogicalBots.length,
				nCount = 0,
				oLogicalBot,
				oMediator,
				oRealBot;

			for (nCount; nCount < nLen; nCount += 1) {

				oLogicalBot = aLogicalBots[nCount];
				// Create the mediator.
				oMediator = this.importEntity("mediator");
				// Create the logicalBot.
				oRealBot = this.importEntity("realBot");
				/**
				 * We have to decide how to positon the bots in the screen.
				 */
				oRealBot.x = nCount * 400 + 200;
				oRealBot.y = 100;

				// Define the logicalBot.
				oMediator.defineRealBot(oRealBot);
				// Once the bot is defined we don't want the user
				// to redefine it, so we delete the method.
				delete oMediator.defineRealBot;
				// Extend user BOT with the mediator.
				oLogicalBot.extend(oMediator);

				// Add the logicalBot to the collection.
				// We have to do this AFTER the extend, because the
				// uid will change.
				oRealBots[oLogicalBot._uid] = oRealBot;

			}

		},
		/**
		 * Update method. Executed each frame.
		 * - Update bots.
		 * - Check collisions.
		 * - Update RealBots.
		 */
		update : function () {

			var nLen = aLogicalBots.length,
				nCount = 0,
				oLogicalBot;

			// Update bots.
			for (nCount; nCount < nLen; nCount += 1) {
				oLogicalBot = aLogicalBots[nCount];

				oLogicalBot.updateBot();

				this.collisions.checkBots(oLogicalBot);
				this.collisions.checkWalls(oLogicalBot);

				oRealBots[oLogicalBot._uid].updateRealBot();
			}

		},
		/**
		 * Object with all the necesary methods to check collisions.
		 * @type {object}
		 */
		collisions : {
			/**
			 * Check bot collisions.
			 * @param {object} oRealBot Bot to check.
			 */
			checkBots : function (oLogicalBot1) {
				var nCount = 0,
					oLogicalBot2,
					oRealBot1,
					oRealBot2,
					nLen = aLogicalBots.length,
					bCollision;

				for (nCount; nCount < nLen; nCount += 1) {
					oLogicalBot2 = aLogicalBots[nCount];

					// Avoid collision check with himself.
					if (oLogicalBot1 !== oLogicalBot2) {
						// Get logicalBot for each user bot.
						oRealBot1 = oRealBots[oLogicalBot1._uid];
						oRealBot2 = oRealBots[oLogicalBot2._uid];

						bCollision = oCollisions.checkCircleCircle(oRealBot1, oRealBot2);
						// Notify bots if they collided.
						if (bCollision === true) {
							oLogicalBot1.collisionWithBot();
							oLogicalBot2.collisionWithBot();

							// Since the collision have changed the BOT velocity/direction
							// We need to recheck the collisions with all the bots.
							// Not necessary when there are only 2 bots.
							nCount = 0;
						}

					}
				}

			},

			checkWalls : function (oLogicalBot) {

				var bCollision;
					oRealBot = oRealBots[oLogicalBot._uid];

				bCollision = oCollisions.checkCircleInsideCircle(oArena, oRealBot);

			},

			checkBullets : function (oBot1) {

			}

		},

		radar : {

			checkBots : function (oPlayerBot) {

			},

			checkBullets : function (oPlayerBot) {

			}

		}

	};

});