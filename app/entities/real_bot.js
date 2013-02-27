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

			velocity : {
				x : 0,
				y : 0,
				current : 0,
				max : 3,
				desired : 0
			},
			acceleration : 0.02,

			mass : 10,

			angle : {
				bot : -30,
				cannon : 0
			},

			life : 100,

			init : function () {
				this.images = {
					bot : oSandbox.assets.get('image', 'bot'),
					cannon : oSandbox.assets.get('image', 'cannon')
				};
				this.setAngle(this.angle.bot);
			},

			move : function ( nVelocity ) {

				// nVelocity is the % of the velocity the bot wants to go
				// So it can't be more than 100 or less than 0.
				if (nVelocity > 100) {
					nVelocity = 100;
				} else if (nVelocity < 0) {
					nVelocity = 0;
				}
				// Desired velocity.
				this.velocity.desired = (nVelocity * this.velocity.max) / 100;

			},

			/**
			 *
			 */
			rotateBot : function ( nDegree ) {
				this.angle.bot += nDegree;

				if (this.angle.bot >= 360) {
					this.angle.bot -= 360;
				}

				this.setAngle(this.angle.bot);
			},

			/**
			 *
			 */
			rotateCannon : function (nDegree) {
				this.angle.cannon += nDegree;

				if (this.angle.cannon >= 360) {
					this.angle.cannon -= 360;
				}
			},

			shoot : function ( nPower ) {
				this.arena.bullet.create.call(this.arena, {
					oRealBot : this
				});

			},

			updateVelocity : function () {

				var nCurrentVelocity = this.velocity.current,
					nDesiredVelocity = this.velocity.desired,
					nMaxVelocity = this.velocity.max,
					oVelocity;

				if (nCurrentVelocity < nDesiredVelocity) {
					this.velocity.current += this.acceleration;
				} else if (nCurrentVelocity > nDesiredVelocity) {
					this.velocity.current -= this.acceleration;
				}

				nCurrentVelocity = this.velocity.current;

				if (nCurrentVelocity > nMaxVelocity) {
					this.velocity.current = nMaxVelocity;
				} else if (nCurrentVelocity < 0) {
					this.velocity.current = 0;
				}

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

				if (oSandbox.debug.active() === true) {
					this.saveOldPositions();
				}

				this.x += this.velocity.x;
				this.y += this.velocity.y;

			},

			draw : function (oBufferContext, nCx, nCy) {
				var oTopLeft = this.getTopLeftCorner(),
					oCenter = this.getCenter();

				oBufferContext.drawImage(this.images.bot, oTopLeft.x - nCx, oTopLeft.y - nCy);

				oBufferContext.setTransform(1, 0, 0, 1, 0, 0);
				oBufferContext.translate(oCenter.x - nCx, oCenter.y - nCy);
				oBufferContext.rotate(this.angle.cannon * this._MATHPI180);
				oBufferContext.translate(-(oCenter.x - nCx), -(oCenter.y - nCy));

				oBufferContext.drawImage(this.images.cannon, oTopLeft.x - nCx, oTopLeft.y - nCy);
			},

			/**
			 * RealBot Debug.
			 */

			oDebug : {
				aOldPositions : [],
				nCaptureInterval : 200, //ms
				nLastCapturation : 0
			},

			debugDraw : function (oBufferContext, nCx, nCy) {

				this.drawOldPositions(oBufferContext, nCx, nCy);

			},

			saveOldPositions : function () {

				var nCurrentTime = new win.Date().getTime();

				if ((nCurrentTime - this.oDebug.nLastCapturation) >= this.oDebug.nCaptureInterval) {
					this.oDebug.aOldPositions.push({
						x : this.x,
						y : this.y
					});

					if (this.oDebug.aOldPositions.length > 200) {
						this.oDebug.aOldPositions.splice(0, 1);
					}

					this.oDebug.nLastCapturation = nCurrentTime;
				}

			},

			drawOldPositions : function (oBufferContext, nCx, nCy) {
				var nCount = 0,
					nLen = this.oDebug.aOldPositions.length,
					oPosition;

				for (nCount; nCount < nLen; nCount += 1) {
					oPosition = this.oDebug.aOldPositions[nCount];
					oBufferContext.setTransform(1, 0, 0, 1, 0, 0);
					oBufferContext.beginPath();
					oBufferContext.arc(oPosition.x, oPosition.y, 1, this._DOUBLEMATHPI, false);
					oBufferContext.closePath();
					oBufferContext.fill();
				}
			}
		};

	});

}(window, document, MMM));