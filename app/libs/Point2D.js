(function (win, doc) {

	'use strict';

	/**
	* Point2D.js
	* copyright 2001-2002, Kevin Lindsey
	*/
	var Point2D = function (x, y) {
		this.x = x;
		this.y = y;
	}

	Point2D.prototype.clone = function() {
		return new Point2D(this.x, this.y);
	};

	Point2D.prototype.add = function(that) {
		return new Point2D(this.x+that.x, this.y+that.y);
	};

	Point2D.prototype.addEquals = function(that) {
		this.x += that.x;
		this.y += that.y;

		return this;
	};

	/**
	* offset - used in dom_graph
	* This method is based on code written by Walter Korman
	* http://www.go2net.com/internet/deep/1997/05/07/body.html
	* which is in turn based on an algorithm by Sven Moen
	*/
	Point2D.prototype.offset = function(a, b) {
		var result = 0;

		if ( !( b.x <= this.x || this.x + a.x <= 0 ) ) {
			var t = b.x * a.y - a.x * b.y;
			var s;
			var d;

			if ( t > 0 ) {
				if ( this.x < 0 ) {
					s = this.x * a.y;
					d = s / a.x - this.y;
				} else if ( this.x > 0 ) {
					s = this.x * b.y;
					d = s / b.x - this.y
				} else {
					d = -this.y;
				}
			} else {
				if ( b.x < this.x + a.x ) {
					s = ( b.x - this.x ) * a.y;
					d = b.y - (this.y + s / a.x);
				} else if ( b.x > this.x + a.x ) {
					s = (a.x + this.x) * b.y;
					d = s / b.x - (this.y + a.y);
				} else {
					d = b.y - (this.y + a.y);
				}
			}

			if ( d > 0 ) {
				result = d;
			}
		}

		return result;
	};

	Point2D.prototype.rmoveto = function(dx, dy) {
		this.x += dx;
		this.y += dy;
	};

	Point2D.prototype.scalarAdd = function(scalar) {
		return new Point2D(this.x+scalar, this.y+scalar);
	};

	Point2D.prototype.scalarAddEquals = function(scalar) {
		this.x += scalar;
		this.y += scalar;

		return this;
	};

	Point2D.prototype.subtract = function(that) {
		return new Point2D(this.x-that.x, this.y-that.y);
	};

	Point2D.prototype.subtractEquals = function(that) {
		this.x -= that.x;
		this.y -= that.y;

		return this;
	};

	Point2D.prototype.scalarSubtract = function(scalar) {
		return new Point2D(this.x-scalar, this.y-scalar);
	};

	Point2D.prototype.scalarSubtractEquals = function(scalar) {
		this.x -= scalar;
		this.y -= scalar;

		return this;
	};

	Point2D.prototype.multiply = function(scalar) {
		return new Point2D(this.x*scalar, this.y*scalar);
	};

	Point2D.prototype.multiplyEquals = function(scalar) {
		this.x *= scalar;
		this.y *= scalar;

		return this;
	};

	Point2D.prototype.divide = function(scalar) {
		return new Point2D(this.x/scalar, this.y/scalar);
	};

	Point2D.prototype.divideEquals = function(scalar) {
		this.x /= scalar;
		this.y /= scalar;

		return this;
	};

	Point2D.prototype.compare = function(that) {
		return (this.x - that.x || this.y - that.y);
	};

	Point2D.prototype.eq = function(that) {
		return ( this.x == that.x && this.y == that.y );
	};

	Point2D.prototype.lt = function(that) {
		return ( this.x < that.x && this.y < that.y );
	};

	Point2D.prototype.lte = function(that) {
		return ( this.x <= that.x && this.y <= that.y );
	};

	Point2D.prototype.gt = function(that) {
		return ( this.x > that.x && this.y > that.y );
	};

	Point2D.prototype.gte = function(that) {
		return ( this.x >= that.x && this.y >= that.y );
	};

	Point2D.prototype.lerp = function(that, t) {
		return new Point2D(
			this.x + (that.x - this.x) * t,
			this.y + (that.y - this.y) * t
		);
	};

	Point2D.prototype.distanceFrom = function(that) {
		var dx = this.x - that.x;
		var dy = this.y - that.y;

		return Math.sqrt(dx*dx + dy*dy);
	};

	Point2D.prototype.min = function(that) {
		return new Point2D(
			Math.min( this.x, that.x ),
			Math.min( this.y, that.y )
		);
	};

	Point2D.prototype.max = function(that) {
		return new Point2D(
			Math.max( this.x, that.x ),
			Math.max( this.y, that.y )
		);
	};

	Point2D.prototype.toString = function() {
		return this.x + "," + this.y;
	};

	Point2D.prototype.setXY = function(x, y) {
		this.x = x;
		this.y = y;
	};

	Point2D.prototype.setFromPoint = function(that) {
		this.x = that.x;
		this.y = that.y;
	};

	Point2D.prototype.swap = function(that) {
		var x = this.x;
		var y = this.y;

		this.x = that.x;
		this.y = that.y;

		that.x = x;
		that.y = y;
	};

	win.Point2D = Point2D;

}(window, document));