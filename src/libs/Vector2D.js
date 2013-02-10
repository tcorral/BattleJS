(function (win, doc) {

	'use strict';

	var Vector2D = function (x, y) {
		this.x = x || 0;
		this.y = y || 0;
	};

	Vector2D.prototype.length = function () {
		return Math.sqrt(this.x*this.x + this.y*this.y);
	};

	Vector2D.prototype.dot = function (that) {
		return this.x * that.x + this.y * that.y;
	};

	Vector2D.prototype.cross = function (that) {
		return this.x * that.y - this.y * that.x;
	};

	Vector2D.prototype.unit = function () {
		var length = this.length();

		return new Vector2D(this.x / length, this.y / length);
	};

	Vector2D.prototype.unitEquals = function () {
		var length = this.length();

		this.x /= length;
		this.y /= length;

		return this;
	};

	Vector2D.prototype.add = function (that) {
		return new Vector2D(this.x + that.x, this.y + that.y);
	};

	Vector2D.prototype.addEquals = function (that) {
		this.x += that.x;
		this.y += that.y;

		return this;
	};

	Vector2D.prototype.substract = function (that) {
		return new Vector2D(this.x - that.x, this.y - that.y);
	};

	Vector2D.prototype.substractEquals = function (that) {
		this.x -= that.x;
		this.y -= that.y;

		return this;
	};

	Vector2D.prototype.multiply = function (scalar) {
		return new Vector2D(this.x * scalar, this.y * scalar);
	};

	Vector2D.prototype.multiplyEquals = function (scalar) {
		this.x *= scalar;
		this.y *= scalar;

		return this;
	};

	Vector2D.prototype.divide = function (scalar) {
		return new Vector2D(this.x / scalar, this.y / scalar);
	};

	Vector2D.prototype.divideEquals = function (scalar) {
		this.x /= scalar;
		this.y /= scalar;

		return this;
	};

	Vector2D.prototype.perp = function () {
		return new Vector2D(-this.y, this.x);
	};

	Vector2D.prototype.perpendicular = function (that) {
		return this.substract(this.project(that));
	};

	Vector2D.prototype.project = function (that) {
		var percent = this.dot(that) / that.dot(that);

		return that.multiply(percent);
	};

	Vector2D.prototype.fromPoints = function (p1, p2) {
		return new Vector2D(p2.x - p1.x, p2.y - p1.y);
	};

	Vector2D.prototype.toString = function () {
		return this.x + "," + this.y;
	};

	win.Vector2D = Vector2D;

}(window, document));