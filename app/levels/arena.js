(function (win, doc, MMM) {

	'use strict';

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
			 * Array to store all the active bullets.
			 * @type {object}
			 */
			aBullets = [],
			/**
			 * Array with the bullets that need to be removed from the game.
			 */
			aBulletsToRemove = [],
			/**
			 * Arena entity instance.
			 * @type {object}
			 */
			oArena,
			/**
			 * Collision manager instance.
			 * @type {object}
			 */
			oCollisions = MMM.libs.collisions;

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
					oRealBot = this.importEntity("realBot", {
						arena : this
					});
					/**
					 * We have to decide how to positon the bots in the screen.
					 */
					if (nCount === 1)
					{
						oRealBot.x = 100;
						oRealBot.y = 200;
					}

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
					oLogicalBot,
					oRealBot;

				// Update bots.
				for (nCount; nCount < nLen; nCount += 1) {
					oLogicalBot = aLogicalBots[nCount];
					oRealBot = oRealBots[oLogicalBot._uid];

					oLogicalBot.updateBot();
					oRealBot.updateVelocity();

					this.collisions.checkBots(oLogicalBot);
					this.collisions.checkBullets(oLogicalBot);
					this.collisions.checkWalls(oLogicalBot);

					oRealBots[oLogicalBot._uid].updateRealBot();
				}

				this.collisions.removeBullets();

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

							bCollision = oCollisions.checkCircleCircle(oRealBot1, oRealBot2, true);
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
				/**
				 * Check collisions with Arena walls.
				 * @param {object} oLogicalBot Bot to check
				 */
				checkWalls : function (oLogicalBot) {

					var bCollision,
						oRealBot = oRealBots[oLogicalBot._uid];

					bCollision = oCollisions.checkCircleInsideCircle(oArena, oRealBot);

					if (bCollision === true) {
						// Send the notification to the logical bot.
						oLogicalBot.collisionWithWall();
					}

				},
				/**
				 * Check collisions with bullets.
				 * @param {object} oLogicalBot Bot to check.
				 */
				checkBullets : function (oLogicalBot) {
					var nCount = 0,
						nLength = aBullets.length,
						oRealBot = oRealBots[oLogicalBot._uid],
						oBullet,
						bCollide,
						bIsOut;

					for (nCount; nCount < nLength; nCount += 1) {
						oBullet = aBullets[nCount];
						bCollide = oCollisions.checkCircleCircle(oRealBot, oBullet, false);

						if (bCollide === true) {

							// Remove bullet to active bullets array.
							aBulletsToRemove.push(oBullet);
							// Inform oLogicalBot about the bullet collision.
							oLogicalBot.collisionWithBullet({
								angle : win.Trigo.getAngleBetweenPoints(
									{ x : oRealBot.x, y : oRealBot.y },
									{ x : oBullet.x, y : oBullet.y }
								)
							} );
						} else {
							// Check if bullet goes out of the Arena.
							bIsOut = oCollisions.checkBasicCircleInsideCircle(oArena, oBullet);
							if (bIsOut === true) {
								// Remove bullet from level.
								aBulletsToRemove.push(oBullet);
							}
						}
					}
				},
				/**
				* Remove the bullets from the collision detection.
				*/
				removeBullets : function () {
					var nCountBullets,
						nCountBulletsToRemove,
						nBulletsLength = aBullets.length,
						nBulletsToRemoveLength = aBulletsToRemove.length,
						oCurrentBullet;
					/**
					 * Iterate all the bullets that need to be removed.
					 */
					for (nCountBulletsToRemove = 0; nCountBulletsToRemove < nBulletsToRemoveLength; nCountBulletsToRemove += 1) {
						oCurrentBullet = aBulletsToRemove[nCountBulletsToRemove];
						// Find the current bullet.
						for (nCountBullets = 0; nCountBullets < nBulletsLength; nCountBullets += 1) {
							if (oCurrentBullet === aBullets[nCountBullets]) {
								// Remove bullet from the arena.
								oCurrentBullet.removeFromLevel();
								// Remove the bullet from the collection.
								aBullets.splice(nCountBullets, 1);
								// Recalculate collection length.
								nBulletsLength = aBullets.length;
								break;
							}
						}
					}
					// Reset list.
					aBulletsToRemove = [];
				}

			},

			radar : {

				checkBots : function (oPlayerBot) {

				},

				checkBullets : function (oPlayerBot) {


				}

			},

			bullet : {
				/**
				 * Create a new bullet.
				 * @param {object} oData RealBot information
				 */
				create : function ( oData ) {
					var oRealBot = oData.oRealBot,
						oBullet;

					oBullet = this.importEntity('bullet', {
						oBot : oRealBot
					});
					aBullets.push(oBullet);
				}
			}

		};

	});

}(window, document, MMM));