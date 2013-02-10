beforeEach(function () {

	this.addMatchers({
		toBeFunction: function () {
			return typeof this.actual  === 'function';
		},
		toBeObject: function () {
			return typeof this.actual === 'object';
		},
		toBeArray: function () {
			return toString.call(this.actual) === '[object Array]';
		},
		toBeBoolean : function () {
			return this.actual === true || this.actual === false || toString.call(this.actual) == '[object Boolean]';
		},
		toBeNumeric : function () {
			return typeof this.actual === 'number';
		}
	});

});