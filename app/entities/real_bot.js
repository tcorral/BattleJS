(function (win, doc, MMM) {

	'use strict';

	/**
	 * Base bot.
	 */
	MMM.create("entity").set("realBot", function (oSandbox) {

		return {
			_id : 'bot',
			/**
			 * Entity type.
			 * @type {string}
			 */
			type : 'circle',
			/**
			 * Render type.
			 * @type {string}
			 */
			renderer : 'own',
			x : 400,
			y : 240,

			/**
			 * Circle radius.
			 * @type {number}
			 */
			radius : 20,
			/**
			 * Shoot constants.
			 * @type {object}
			 */
			shoot_info : {
				/**
				 * Last shot timestamp.
				 * @type {number}
				 */
				last : 0,
				/**
				 * Minimum time that have to pass between shots.
				 * @type {number}
				 */
				min_interval : 50 //ms
			},
			/**
			 * Bot velocity variables.
			 * @type {object}
			 */
			velocity : {
				/**
				 * X axis velocity.
				 * @type {number}
				 */
				x : 0,
				/**
				 * Y axis velocity.
				 * @type {number}
				 */
				y : 0,
				/**
				 * Current velocity.
				 * @type {number}
				 */
				current : 0,
				/**
				 * Max velocity constant.
				 * @type {number}
				 */
				max : 100,
				/**
				 * Minimum velocity constant.
				 * @type {number}
				 */
				min : 0,
				/**
				 * Max velocity in pixels per frame.
				 * @type {number}
				 */
				max_in_pixels : 3,
				/**
				 * Desired velocity.
				 * @type {number}
				 */
				desired : 0
			},
			/**
			 * Acceleration constant.
			 * @type {number}
			 */
			acceleration : 0.02,
			/**
			 * Bot mass constant.
			 * @type {number}
			 */
			mass : 10,
			/**
			 * Entity angles.
			 * @type {object}
			 */
			angle : {
				/**
				 * Bot angle.
				 * @type {number}
				 */
				bot : -30,
				/**
				 * Cannon angle.
				 * @type {number}
				 */
				cannon : 0
			},
			/**
			 * Life properties.
			 * @type {object}
			 */
			life : {
				/**
				 * Initial life / max life.
				 * @type {number}
				 */
				max : 100,
				/**
				 * Minimum life. When reached the bot is dead.
				 * @type {number}
				 */
				min : 0,
				/**
				 * Current bot life.
				 * @type {number}
				 */
				current : 100
			},
			/**
			 * To cache bot images.
			 * @type {object}
			 */
			images : {
				/**
				 * Bot image (DOM element).
				 * @type {object}
				 */
				bot : null,
				/**
				 * Cannon image (DOM element).
				 * @type {object}
				 */
				cannon : null
			},
			/**
			 * Bot initialization.
			 */
			init : function () {
				// Cache bot images.
				this.images = {
					bot : oSandbox.assets.get('image', 'bot'),
					cannon : oSandbox.assets.get('image', 'cannon')
				};
				// Set initial bot angle.
				this.setAngle(this.angle.bot);
			},
			/**
			 * Modify the "desired" velocity of the bot.
			 * @param {number} nVelocity Desired velocity.
			 */
			move : function ( nVelocity ) {

				var nMaxVelocity = this.velocity.max,
					nMinVelocity = this.velocity.min;

				// nVelocity is the % of the velocity the bot wants to go
				// So it can't be more than 100 or less than 0.
				if (nVelocity > nMaxVelocity) {
					nVelocity = nMaxVelocity;
				} else if (nVelocity < nMinVelocity) {
					nVelocity = nMinVelocity;
				}
				// Desired velocity.
				this.velocity.desired = (nVelocity * this.velocity.max_in_pixels) / nMaxVelocity;

			},
			/**
			 * Rotate the bot.
			 * @param {number} nDegree Bot rotation increment/decrement.
			 */
			rotateBot : function ( nDegree ) {
				this.angle.bot += nDegree;

				if (this.angle.bot >= 360) {
					this.angle.bot -= 360;
				}

				this.setAngle(this.angle.bot);
			},
			/**
			 * Rotate the bot cannon.
			 * @param {number} nDegree Cannon rotation increment/decrement.
			 */
			rotateCannon : function (nDegree) {
				this.angle.cannon += nDegree;

				if (this.angle.cannon >= 360) {
					this.angle.cannon -= 360;
				}
			},
			/**
			 * Create a bullet entity.
			 * @param {number} nPower Bullet power.
			 */
			shoot : function ( nPower ) {
				var nCurrentTime = new win.Date().getTime();

				// You cannot shot more than once per "min_interval".
				if (nCurrentTime - this.shoot_info.last > this.shoot_info.min_interval) {
					this.shoot_info.last = nCurrentTime;
					this.arena.bullet.create.call(this.arena, {
						oRealBot : this
					});
				}

			},
			/**
			 * Updates the "x" and "y" axis velocity based on the
			 * current velocity and the angle of the bot.
			 */
			updateVelocity : function () {

				var nCurrentVelocity = this.velocity.current,
					nDesiredVelocity = this.velocity.desired,
					nMaxVelocity = this.velocity.max_in_pixels,
					oVelocity;

				if (nCurrentVelocity < nDesiredVelocity) {
					this.velocity.current += this.acceleration;
					if (this.velocity.current > nDesiredVelocity) {
						this.velocity.current = nDesiredVelocity;
					}
				} else if (nCurrentVelocity > nDesiredVelocity) {
					this.velocity.current -= this.acceleration;
					if (this.velocity.current < nDesiredVelocity) {
						this.velocity.current = nDesiredVelocity;
					}
				}

				nCurrentVelocity = this.velocity.current;

				/*if (nCurrentVelocity > nMaxVelocity) {
					this.velocity.current = nMaxVelocity;
				} else if (nCurrentVelocity < 0) {
					this.velocity.current = 0;
				}*/

				oVelocity = win.Trigo.getAdjacentAndOpposite({
					angle : this.angle.bot,
					hypotenuse : this.velocity.current
				});

				this.velocity.x = oVelocity.adjacent;
				this.velocity.y = oVelocity.opposite;

			},
			/**
			 * Entity update. Called on each frame.
			 */
			updateRealBot : function () {

				var oVelocity;
				/**
				 * Debug mode.
				 */
				if (oSandbox.debug.active() === true) {
					this.oDebug.saveOldPositions.call(this);
					this.oDebug.manualActions.call(this);
				}

				this.x += this.velocity.x;
				this.y += this.velocity.y;

			},
			/**
			 * Entity renderer. Draws the bot and the cannon on each frame.
			 * @param {object} oBufferContext buffer canvas context.
			 * @param {number} nCx Camera "x" position.
			 * @param {number} nCy Camera "y" position.
			 */
			draw : function (oBufferContext, nCx, nCy) {
				var oTopLeft = this.getTopLeftCorner(),
					oCenter = this.getCenter();

				// Draw bot.
				oBufferContext.drawImage(this.images.bot, oTopLeft.x - nCx, oTopLeft.y - nCy);
				// Draw cannon.
				oBufferContext.setTransform(1, 0, 0, 1, 0, 0);
				oBufferContext.translate(oCenter.x - nCx, oCenter.y - nCy);
				oBufferContext.rotate(this.angle.cannon * this._MATHPI180);
				oBufferContext.translate(-(oCenter.x - nCx), -(oCenter.y - nCy));
				oBufferContext.drawImage(this.images.cannon, oTopLeft.x - nCx, oTopLeft.y - nCy);
			},
			/**
			 * Called when debug is active. Draws bot tragectory and information.
			 * @param {object} oBufferContext buffer canvas context.
			 * @param {number} nCx Camera "x" position.
			 * @param {number} nCy Camera "y" position.
			 */
			debugDraw : function (oBufferContext, nCx, nCy) {

				this.oDebug.drawOldPositions.call(this, oBufferContext, nCx, nCy);
				this.oDebug.drawBotInformation.call(this, oBufferContext, nCx, nCy);

			},
			/**
			 * RealBot Debug object.
			 */
			oDebug : {
				/**
				 * bot trajectory/path control.
				 */
				oPath : {
					/**
					 * Array to store old bot positions.
					 * @type {array}
					 */
					aOldPositions : [],
					/**
					 * Interval to capture bot position.
					 * @type {number}
					 */
					nCaptureInterval : 200, //ms
					/**
					 * Last position captured (timestamp).
					 */
					nLastCapturation : 0,
					/**
					 * Number of positions we want to store.
					 */
					nNumberOfPositions : 200
				},
				/**
				 * Key Map object. Will store the key for each bot action.
				 * @type {object}
				 */
				oKeys : {
					ROTATE_RIGHT : null,
					ROTATE_LEFT : null,
					ACCELERATE : null,
					BRAKE : null,
					SHOOT : null,
					CANNON_RIGHT : null,
					CANNON_LEFT : null
				},
				/**
				 * Control variables. When setted to true means that the action
				 * is going to be executed.
				 * @type {object}
				 */
				oState : {
					ROTATE_RIGHT : false,
					ROTATE_LEFT : false,
					ACCELERATE : false,
					BRAKE : false,
					SHOOT : false,
					CANNON_RIGHT : false,
					CANNON_LEFT : false
				},
				/**
				 * Stores bot position.
				 */
				saveOldPositions : function () {

					var nCurrentTime = new win.Date().getTime(),
						oPath = this.oDebug.oPath;

					if ((nCurrentTime - oPath.nLastCapturation) >= oPath.nCaptureInterval) {
						oPath.aOldPositions.push({
							x : this.x,
							y : this.y
						});

						if (oPath.aOldPositions.length > oPath.nNumberOfPositions) {
							oPath.aOldPositions.splice(0, 1);
						}

						oPath.nLastCapturation = nCurrentTime;
					}

				},
				/**
				 * Draws the bot old positions path.
				 * @param {object} oBufferContext buffer canvas context.
				 * @param {number} nCx Camera "x" position.
				 * @param {number} nCy Camera "y" position.
				 */
				drawOldPositions : function (oBufferContext, nCx, nCy) {
					var nCount = 0,
						nLen = this.oDebug.oPath.aOldPositions.length,
						oPosition;

					oBufferContext.setTransform(1, 0, 0, 1, 0, 0);

					for (nCount; nCount < nLen; nCount += 1) {
						oPosition = this.oDebug.oPath.aOldPositions[nCount];
						oBufferContext.beginPath();
						oBufferContext.arc(oPosition.x, oPosition.y, 1, this._DOUBLEMATHPI, false);
						oBufferContext.closePath();
						oBufferContext.fill();
					}
				},
				/**
				 * Apply the current active actions to the bot.
				 */
				manualActions : function () {

					var oState = this.oDebug.oState;

					if (oState.ROTATE_RIGHT === true) {
						this.rotateBot(1);
					}

					if (oState.ROTATE_LEFT === true) {
						this.rotateBot(-1);
					}

					if (oState.CANNON_RIGHT === true) {
						this.rotateCannon(1);
					}

					if (oState.CANNON_LEFT === true) {
						this.rotateCannon(-1);
					}

					if (oState.ACCELERATE === true) {
						this.velocity.desired += 0.1;
						if (this.velocity.desired > this.velocity.max_in_pixels) {
							this.velocity.desired = this.velocity.max_in_pixels;
						}
					}

					if (oState.BRAKE === true) {
						this.velocity.desired -= 0.1;
						if (this.velocity.desired < 0) {
							this.velocity.desired = 0;
						}
					}
					if (oState.SHOOT === true) {
						this.shoot();
					}
				},
				/**
				 * Draws bot information.
				 */
				drawBotInformation : function (oBufferContext, nCx, nCy) {
					var nTextX = 10,
						nTextY = 40 + (this.count * 100),
						oVelocity;

					oVelocity = win.Trigo.getAdjacentAndOpposite({
						angle : this.angle.bot,
						hypotenuse : this.velocity.current
					});

					oVelocity.opposite = Math.round(oVelocity.opposite * 1000) / 1000;
					oVelocity.adjacent = Math.round(oVelocity.adjacent * 1000) / 1000;

					oBufferContext.save();
					oBufferContext.fillStyle = '#FFF';
					oBufferContext.strokeRect(nTextX - 5, nTextY - 10, 140, 90);
					oBufferContext.fillRect(nTextX - 5, nTextY - 10, 140, 90);
					oBufferContext.font = "normal 11px Verdana";
					oBufferContext.fillStyle = '#000';

					oBufferContext.fillText('Name: ' + this.botName, nTextX, nTextY);
					nTextY += 12;
					oBufferContext.fillText('Life: ' + this.life.current, nTextX, nTextY);
					nTextY += 12;
					oBufferContext.fillText('Bot Angle: ' + this.angle.bot, nTextX, nTextY);
					nTextY += 12;
					oBufferContext.fillText('Cannon Angle: ' + this.angle.cannon, nTextX, nTextY);
					nTextY += 12;
					oBufferContext.fillText('Desired Velocity: ' + this.velocity.desired, nTextX, nTextY);
					nTextY += 12;
					oBufferContext.fillText('Velocity: ' + Math.round(this.velocity.current * 1000) / 1000, nTextX, nTextY);
					nTextY += 12;
					oBufferContext.fillText('vel x: ' + oVelocity.adjacent + ', y: ' + oVelocity.opposite, nTextX, nTextY);

					oBufferContext.restore();
				}
			},


			/**
			 * DEBUG events.
			 */
			events : {
				/**
				 * Check if the pressed key corresponds with one of the mapped keys.
				 * If so, set the action to true.
				 * @param {object} eEvent Event information.
				 */
				keydown : function (eEvent) {

					var sKey = eEvent.key,
						oKeys = this.oDebug.oKeys,
						oState = this.oDebug.oState,
						sObjectKey,
						sObjectValue;

					for (sObjectKey in oKeys) {
						if (oKeys.hasOwnProperty(sObjectKey)) {
							sObjectValue = oKeys[sObjectKey];
							if (oKeys[sObjectKey] && sObjectValue === sKey) {
								oState[sObjectKey] = true;
							}
						}
					}

				},
				/**
				 * Check if the pressed key corresponds with one of the mapped keys.
				 * If so, set the action to false.
				 * @param {object} eEvent Event information.
				 */
				keyup : function (eEvent) {
					var sKey = eEvent.key,
						oKeys = this.oDebug.oKeys,
						oState = this.oDebug.oState,
						sObjectKey,
						sObjectValue;

					for (sObjectKey in oKeys) {
						if (oKeys.hasOwnProperty(sObjectKey)) {
							sObjectValue = oKeys[sObjectKey];
							if (oKeys[sObjectKey] && sObjectValue === sKey) {
								oState[sObjectKey] = false;
							}
						}
					}
				}
			}
		};

	});

}(window, document, MMM));