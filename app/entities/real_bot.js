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
		renderer : 'circleImage',
		x : 100,
		y : 100,
		/**
		 * Circle radius.
		 * @type {number}
		 */
		radius : 20,

		velocity : {
			x: 0,
			y: 0
		},

		mass : 10,

		angle : 180,

		max_velocity : 4,
		max_acceleration : 0.5,

		live : 100,

		init : function () {
			this.setImage("bot");
		},

		move : function ( nAcceleration ) {
			nAcceleration = Math.round(nAcceleration);
			//nAcceleration = Math.abs(nAcceleration);

			this.velocity.x += nAcceleration / 200;
		},
		/**
		 *
		 */
		rotateBot : function ( nDegree ) {
			this.rotate( nDegree );
		},

		shoot : function ( nPower ) {

		},

		/**
		 * Entity update. Called on each frame.
		 */
		updateRealBot : function () {

			this.x += this.velocity.x;
			this.y += this.velocity.y;

		}
	};

});