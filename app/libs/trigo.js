(function (win, doc) {

	'use strict';

	var PI = Math.PI,
		CONST_PI180 = PI / 180,
		CONST_180PI = 180 / PI;

	win.Trigo = {

		getAdjacentAndOpposite : function (oData) {
			var nAngle = oData.angle,
				nHypo = oData.hypotenuse;

			return {
				adjacent : Math.cos(nAngle * CONST_PI180) * nHypo,
				opposite : Math.sin(nAngle * CONST_PI180) * nHypo
			};
		},

		getHypotenuse : function (oData) {
			var dx = oData.adjacent;
			var dy = oData.opposite;
			return Math.sqrt((dx * dx) + (dy * dy));
		},

		getAngle : function (oData) {
			return Math.atan(oData.opposite / oData.adjacent) * CONST_180PI;
		},

		getDistanceBetweenPoints : function (point1, point2) {
			var dx = point2.x - point1.x;
			var dy = point2.y - point1.y;
			return Math.sqrt((dx * dx) + (dy * dy));
		},

		getAngleBetweenPoints : function (point1, point2) {
			return Math.atan2(point2.y - point1.y, point2.x - point1.x) * CONST_180PI;
		}

	};

}(window, document));