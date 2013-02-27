(function (win, doc, MMM) {

	'use strict';

	var Vector2D = win.Vector2D;

	MMM.libs.collisions = {

		checkBasicCircleInsideCircle : function (oOuterCircle, oInnerCircle) {
			var nMaxDistance = oOuterCircle.radius - oInnerCircle.radius,
				vVector = new Vector2D(oOuterCircle.x - (oInnerCircle.x + oInnerCircle.velocity.x), oOuterCircle.y - (oInnerCircle.y + oInnerCircle.velocity.y));

			if (vVector.length() > nMaxDistance) {
				oInnerCircle.velocity.x = 0;
				oInnerCircle.velocity.y = 0;
				oInnerCircle.velocity.current = 0;
				return true;
			}

			return false;
		},
		/**
		 * Fast test to check circle collision.
		 * @param {object} oCircle1
		 * @param {object} oCircle2
		 * @param {boolean} bApplyCollision
		 */
		checkCircleCircle : function (oCircle1, oCircle2, bApplyCollision) {

			var nDx, nDy, nVx, nVy, nMovementLen, nSumRadii, nDistance;

			nDx = oCircle2.x - oCircle1.x;
			nDy = oCircle2.y - oCircle1.y;
			nDistance = Math.sqrt(nDx * nDx + nDy * nDy);

			nVx = oCircle1.velocity.x - oCircle2.velocity.x;
			nVy = oCircle1.velocity.y - oCircle2.velocity.y;
			nMovementLen = Math.sqrt((nVx * nVx) + (nVy * nVy));

			nSumRadii = oCircle1.radius + oCircle2.radius;

			if (nDistance < nSumRadii + nMovementLen) {

				return this._checkCircleCircle(oCircle1, oCircle2, bApplyCollision);

			}

			return false;
		},
		/**
		 * Check collision between circles. If they collide, apply elastic collision.
		 * @param {object} oCircle1
		 * @param {object} oCircle2
		 * @param {boolean} bApplyCollision
		 */
		_checkCircleCircle : function (oCircle1, oCircle2, bApplyCollision) {

			var C, Clen, V, Vlen, V1, V2, VN1, VN2, sumRadii, sumRadiiSquared, M1, M2, F, N, n, D, T, a1, a2, v1x, v1y, v2x, v2y, optimizedP, distance;

			V1 = new Vector2D(oCircle1.velocity.x, oCircle1.velocity.y);
			V2 = new Vector2D(oCircle2.velocity.x, oCircle2.velocity.y);
			V = V1.substract(V2);

			C = new Vector2D(oCircle2.x - oCircle1.x, oCircle2.y - oCircle1.y);
			Clen = C.length();

			/**
			 * Our next early escape test is to determine if A is actually moving towards B.
			 * If it's not, then obviously you don't have to worry about them colliding.
			 * To do this, we take advantage of our friend, the Dot Product. First, find C,
			 * the vector from the center of A to the center of B. Remember that a point
			 * minus a point is a vector, so C = B - A. Now get the dot product of C and
			 * the movement vector, V: if the result is less than or equal to 0, then A is
			 * not moving towards B, and no more testing needs to be done.
			 */
			N = V.unit();

			if (N !== false) {

				D = N.dot(C);

				if (D > 0) {
					sumRadii = oCircle1.radius + oCircle2.radius;
					D = Math.abs(D);
					F = (Clen * Clen) - (D * D);
					sumRadiiSquared = sumRadii * sumRadii;

					//If the closest that A ever gets to B is more than the sum of their radii,
					//then they do not hit. Dot product to the rescue again!

					if (F <= sumRadiiSquared) {
						T = sumRadiiSquared - F;
						// If there is no such right triangle with sides length of
						// sumRadii and sqrt(f), T will probably be less than 0.
						// Better to check now than perform a square root of a
						// negative number.
						if(T >= 0){
							// Therefore the distance the circle has to travel along
							// movevec is D - sqrt(T)
							distance = D - Math.sqrt(T);
							Vlen = V.length();
							// Finally, make sure that the distance A has to move
							// to touch B is not greater than the magnitude of the
							// movement vector.
							if(Vlen >= distance){

								if (bApplyCollision === true) {

									M1 = oCircle1.mass;
									M2 = oCircle2.mass;
									// Then perform the dynamic-static collision algorithm on the
									// circles and the new vector. If they collide, divide the
									// length of the shortened vector by the length of the one you
									// originally passed into the function. The result should be a
									// floating-point number between 0 and 1.
									// This represents when over the course of their movement the
									// circles collided. Multiply the original movement vectors by
									// this number, and the result is shortened movement vectors
									// that take the circles up to the point where they touch for the
									// first time.
									VN1 = V1.unit();
									VN2 = V2.unit();

									oCircle1.x += VN1.x * distance;
									oCircle1.y += VN1.y * distance;

									oCircle2.x += VN2.x * distance;
									oCircle2.y += VN2.y * distance;

									// Find the normalized vector n from the center of
									// circle1 to the center of circle2
									C = new Vector2D(oCircle2.x - oCircle1.x, oCircle2.y - oCircle1.y);

									n = C.unit();

									// Find the length of the component of each of the movement
									// vectors along n.
									a1 = V1.dot(n);
									a2 = V2.dot(n);

									// Using the optimized version,
									// optimizedP =  2(a1 - a2)
									//              -----------
									//                m1 + m2
									optimizedP = (2.0 * (a1 - a2)) / (M1 + M2);

									// Calculate v1', the new movement vector of circle1
									v1x = V1.x - optimizedP * M2 * n.x;
									v1y = V1.y - optimizedP * M2 * n.y;

									// Calculate v2', the new movement vector of circle2
									v2x = V2.x + optimizedP * M1 * n.x;
									v2y = V2.y + optimizedP * M1 * n.y;

									oCircle1.velocity.x = v1x;
									oCircle1.velocity.y = v1y;
									oCircle1.velocity.current = win.Trigo.getHypotenuse({
										adjacent: v1x,
										opposite: v1y
									});

									oCircle2.velocity.x = v2x;
									oCircle2.velocity.y = v2y;

									oCircle1.velocity.current = win.Trigo.getHypotenuse({
										adjacent: v2x,
										opposite: v2y
									});
								}

								return true;
							}
						}
					}
				}
			}

			return false;
		},
		/**
		 * Check if a inner (small) circle intersects with the outer (big) circle.
		 * The problem is solved by transforming it into a line-circle intersection.
		 *
		 * NOT USED. NOT FINISHED / OPTIMIZED.
		 *
		 * @param {object} oOuterCircle
		 * @param {object} oInnerCircle
		 * @return {boolean} true or false
		 */
		checkCircleInsideCircle : function (oOuterCircle, oInnerCircle) {

			var oResult = false,
				oCenter = new win.Point2D(oOuterCircle.x, oOuterCircle.y),
				nRadius = oOuterCircle.radius - oInnerCircle.radius,
				oPointA = new win.Point2D(oInnerCircle.x, oInnerCircle.y),
				oPointB = new win.Point2D(oInnerCircle.x + oInnerCircle.velocity.x, oInnerCircle.y + oInnerCircle.velocity.y),
				nA,
				nB,
				nCC,
				nDeter,
				nE,
				nU1,
				nU2,
				bCollide = false;

			nA = (oPointB.x - oPointA.x) * (oPointB.x - oPointA.x) + (oPointB.y - oPointA.y) * (oPointB.y - oPointA.y);
			nB = 2 * ((oPointB.x - oPointA.x) * (oPointA.x - oCenter.x) + (oPointB.y-oPointA.y) * (oPointA.y - oCenter.y));
			nCC = oCenter.x * oCenter.x + oCenter.y * oCenter.y + oPointA.x * oPointA.x + oPointA.y * oPointA.y - 2 * (oCenter.x * oPointA.x + oCenter.y * oPointA.y ) - nRadius * nRadius;
			nDeter = nB * nB - 4 * nA * nCC;

			if (nDeter < 0) {
				// Is outside.
				oInnerCircle.velocity.x = 0;
				oInnerCircle.velocity.y = 0;
				oInnerCircle.velocity.current = 0;
				bCollide = true;
			} else if (nDeter==0) {
				// Ball is TANGENT.
				oResult = 'tangent';
			} else {
				nE = win.Math.sqrt(nDeter);
				nU1 = (-nB + nE) / (2 * nA);
				nU2 = (-nB - nE) / (2 * nA);

				if ((nU1 < 0 || nU1 > 1) && ( nU2 < 0 || nU2 > 1 )) {
					if ((nU1 < 0 && nU2 < 0) || (nU1 > 1 && nU2 > 1 )) {
						// Is outside.
						oInnerCircle.velocity.x = 0;
						oInnerCircle.velocity.y = 0;
						oInnerCircle.velocity.current = 0;
						bCollide = true;
					} else {
						// Ball is TANGENT.
						oResult = 'tangent';
					}
				} else {
					oResult = [];
					if (0 <= nU1 && nU1 <=1) {
						// Is outside.
						oResult.push(oPointA.lerp(oPointB, nU1));
					}
					if (0 <= nU2 && nU2 <=1) {
						// Is outside.
						oResult.push(oPointA.lerp(oPointB, nU2));
					}
				}
			}

			if (typeof oResult !== 'string') {

				oInnerCircle.x = (oInnerCircle.velocity.x >= 0) ? win.Math.floor(oResult[0].x) : win.Math.ceil(oResult[0].x);
				oInnerCircle.y = (oInnerCircle.velocity.y >= 0) ? win.Math.floor(oResult[0].y) : win.Math.ceil(oResult[0].y);

				oInnerCircle.velocity.x = 0;
				oInnerCircle.velocity.y = 0;
				oInnerCircle.velocity.current = 0;

				bCollide = true;
			}

			return bCollide;

		}
	};

}(window, document, MMM));