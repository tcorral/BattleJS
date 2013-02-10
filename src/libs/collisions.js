(function (win, doc, MMM) {

	'use strict';

	var Vector2D = win.Vector2D;

	MMM.libs.collisions = {
		/**
		 * Fast test to check circle collision.
		 * @param {object} oCircle1
		 * @param {object} oCircle2
		 */
		checkCircleCircle : function (oCircle1, oCircle2) {

			var nDx, nDy, nVx, nVy, nMovementLen, nSumRadii, nDistance;

			nDx = oCircle2.x - oCircle1.x;
			nDy = oCircle2.y - oCircle1.y;
			nDistance = Math.sqrt(nDx * nDx + nDy * nDy);

			nVx = oCircle1.velocity.x - oCircle2.velocity.x;
			nVy = oCircle1.velocity.y - oCircle2.velocity.y;
			nMovementLen = Math.sqrt((nVx * nVx) + (nVy * nVy));

			nSumRadii = oCircle1.radius + oCircle2.radius;

			if (nDistance < nSumRadii + nMovementLen) {

				return this._checkCircleCircle(oCircle1, oCircle2);

			}

			return false;
		},
		/**
		 * Check collision between circles. If they collide, apply elastic collision.
		 * @param {object} oCircle1
		 * @param {object} oCircle2
		 */
		_checkCircleCircle : function (oCircle1, oCircle2) {

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
								oCircle2.velocity.x = v2x;
								oCircle2.velocity.y = v2y;

								return true;
							}
						}
					}
				}
			}

			return false;
		},

		checkCircleInsideCircle : function (oOuterCircle, oInnerCircle) {

			var nNewOuterX = oOuterCircle.x + oOuterCircle.velocity.x,
				nNewOuterY = oOuterCircle.y + oOuterCircle.velocity.y,
				nNewInnerX = oInnerCircle.x + oInnerCircle.velocity.x,
				nNewInnerY = oInnerCircle.y + oInnerCircle.velocity.y,

				nMaxDistance = oOuterCircle.radius - oInnerCircle.radius,
				vBotDistance = new Vector2D(nNewInnerX - nNewOuterX, nNewInnerY - nNewOuterY);

			if (vBotDistance.length() > nMaxDistance) {
				return true;
			}

			return false;

		}
	};

}(window, document, MMM));