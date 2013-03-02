/**
* @license MesmerismJS HTML5 Canvas Game Engine
* Copyright (C) 2013, Pere Monfort Pàmies
* http://www.project-cyan.com
*
* MesmerismJS is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license.php
*/
(function (win, doc, _UNDEFINED_) {

	'use strict';

	var MMM, oSandbox, sVersion, fpIsFunction, fpIsArray, fpProxy, _FALSE_, _TRUE_, _NULL_, _OBJECT_, _STRING_, _NUMBER_;

	/**
	 * Version of MesmerismJS.
	 * @private
	 * @type {String}
	 */
	sVersion = '0.1.0';

	/**
	 * Reference to false so it can be minified.
	 * @type {Boolean}
	 * @private
	 */
	_FALSE_ = false;
	/**
	 * Reference to true so it can be minified.
	 * @type {Boolean}
	 * @private
	 */
	_TRUE_ = true;
	/**
	 * Reference to null so it can be minified.
	 * @type {Object}
	 * @private
	 */
	_NULL_ = null;
	/**
	 * Cache 'object' string so it can be minified.
	 * @type {String}
	 * @private
	 */
	_OBJECT_ = 'object';
	/**
	 * Cache 'string' string so it can be minified.
	 * @type {String}
	 * @private
	 */
	_STRING_ = 'string';
	/**
	 * Cache 'number' string so it can be minified.
	 * @type {String}
	 * @private
	 */
	_NUMBER_ = 'number';

	/**
	 * To know if the passed argument is a function.
	 * @private
	 * @param {Object} fpCallback
	 * @return {Boolean}
	 */
	fpIsFunction = function ( fpCallback ) {
		return win.toString.call(fpCallback) === '[object Function]' || typeof fpCallback === 'function';
	};
	/**
	 * To know if the passed argument is an Array.
	 * @private
	 * @param {Object} aArray
	 * @return {Boolean}
	 */
	fpIsArray = Array.isArray || function (aArr) {
		return win.toString.call(aArr) === '[object Array]';
	};

	/**
	 * Proxy function.
	 * @param {function} fpFunc Function.
	 * @param {object} oThis Context.
	 * @return {function} function.
	 */
	fpProxy = function ( fpFunc, oThis )
	{
		return function () {
			return fpFunc.apply( oThis, arguments );
		};
	};

	/**
	 * Main object.
	 * @private
	 * @type {Object}
	 */
	MMM = {};

	/**
	 * Game object.
	 * @type {object}
	 */
	MMM.game = {
		/**
		 * Prepare and starts the game execution.
		 */
		init : function () {
			var oSelf = this;

			// Check browser compatibility.
			oSelf.browserCompatibility.init();
			// Create Canvas & bind Events.
			oSelf.canvas.init();
			// Load assets.
			// Image preloading.
			oSelf.assets.load(function () {

				// Initialize Level.
				oSelf.level.init();
				// Initialize Renderer.
				oSelf.renderer.init();
				// Start Game Loop.
				oSelf.game.interval();

			});
		},
		/**
		 * Game interval.
		 */
		interval : function () {


			var /**
				 * Reference to MMM.updater.
				 * @private
				 * @type {object}
				 */
				oUpdater = MMM.updater,
				/**
				 * Reference to MMM.renderer.
				 * @private
				 * @type {object}
				 */
				oRenderer = MMM.renderer,
				/**
				 * Reference to MMM.camera.
				 * @private
				 * @type {object}
				 */
				oCamera = MMM.camera,
				/**
				 * Crossbrowser "requestAnimationFrame".
				 */
				fpAnimationFrame = win.requestAnimationFrame ||
					win.webkitRequestAnimationFrame ||
					win.mozRequestAnimationFrame ||
					win.oRequestAnimationFrame ||
					win.msRequestAnimationFrame ||
					function (callback) {
						win.setTimeout(callback, 1 / 60 * 1000);
					},
				/**
				 * Game Loop. Executed on each frame.
				 * - Update objects.
				 * - Update camera position.
				 * - Render objects.
				 */
				fpInterval = function () {
					oUpdater.update();

					if (oCamera.active === true) {
						oCamera.update();
					}

					oRenderer.render();

					fpAnimationFrame(fpInterval);
				};

			// Starts game loop.
			fpAnimationFrame(fpInterval);

		}

	};
	/**
	 * Error handler. To be implemented.
	 * @private
	 * @param {string} sError Error information.
	 * @param {object} oError Additional information.
	 * @param {boolean} bThrowError Throw or not an error.
	 */
	MMM.log = function (sError, oMessage, bThrowError) {

		var sProperty,
			sErrorMessage = sError;

		for (sProperty in oMessage) {
			if (oMessage.hasOwnProperty(sProperty)) {
				sErrorMessage += '\n - ' + sProperty + ": " + oMessage[sProperty];
			}
		}

		win.console.log(sErrorMessage);

		if (bThrowError === _TRUE_){
			throw sError;
		}

	};
	/**
	 * Used to create levels, entities, and to define the
	 * bootstrap properties.
	 * @public
	 * @param {string} sType Object type.
	 */
	MMM.create = function (sType) {
		/**
		 * "type" of objects that can be created.
		 * @private
		 * @type {array}
		 */
		var aAllowedTypes = ['bootstrap', 'level', 'entity'];

		sType = sType.toLowerCase();

		if (aAllowedTypes.indexOf(sType) === -1) {
			MMM.log('Invalid Type', {
				method : 'MMM.create',
				current : sType,
				expected : aAllowedTypes
			}, true);
		}

		return MMM[sType].getAPI();

	};

	/**
	 * Bootstrap definition.
	 * @type {object}
	 */
	MMM.bootstrap = (function () {

			/**
			 * Object to store game settings.
			 * @private
			 * @type {object}
			 */
		var oSettings = {};

		return {
			/**
			 * Save user bootstrap.
			 * @private
			 * @param {object} oUserSettings User settings
			 */
			set: function (oUserSettings) {

				if (typeof oUserSettings !== _OBJECT_ || !oUserSettings) {
					MMM.log('Received argument is not an object', {
						method: 'MMM.bootstrap.create'
					}, true);
				}

				oSettings = oUserSettings;
			},
			/**
			 * To get a bootstrap property.
			 * @param {string} sProperty Property name.
			 * @return Property value.
			 */
			get : function (sProperty) {

				if (oSettings[sProperty] === _UNDEFINED_) {
					MMM.log('Property ' + sProperty +' is not defined on the Bootstrap', {
						method: 'MMM.bootstrap.get'
					}, true);
				}

				return oSettings[sProperty];

			},
			/**
			 * Export methods to the public API.
			 * @return {object}
			 */
			getAPI : function () {
				return {
					set : this.set
				};
			}
		};
	}());

	/**
	 * Adds an entity to the Entities collection.
	 * @param {string} sId Entity Identifier.
	 * @param {function} fpConstructor Entity constructor.
	 */
	MMM.entity = (function () {

			/**
			 * Object to store entity constructors.
			 * @private
			 * @type {object}
			 */
		var oRawEntities = {},
			/**
			 * Object to store entity instances.
			 * @private
			 * @type {object}
			 */
			oBuiltEntities = {},
			/**
			 * Base Entity constructor.
			 * @private
			 * @type {function}
			 */
			EntityBase,
			/**
			 * Rectangle entity constructor.
			 * @private
			 * @type {function}
			 */
			RectangleEntity,
			/**
			 * Circle entity constructor.
			 * @private
			 * @type {function}
			 */
			CircleEntity;

		/**
		 * Entity constructor.
		 * @private
		 * @type {function}
		 */
		EntityBase = function () {

			/**
			 * Mandatory properties. Used by the framework.
			 */
			this.x = 0;
			this.y = 0;
			this.width = 0;
			this.height = 0;

			this._onScreen = false;
			this._rotation = 0;
			this._globalAlpha = 1;
			this._image = null;
			this._scale = {
				x : 1,
				y : 1
			};

			this._MATHPI180 = Math.PI / 180;
			this._MATH180PI = 180 / Math.PI;
			this._DOUBLEMATHPI = Math.PI*2;

		};

		/**
		 * Extends the entity. It does not overwrite subtree properties.
		 * @param {object} oObject New properties / methods to be added.
		 * @param {object} oInner Current context.
		 * @param {function} fpExtend Extend function.
		 */
		EntityBase.prototype.extend = function (oObject, oInner, fpExtend) {

			var sProperty,
				oSelf = (oInner === _UNDEFINED_) ? this : oInner,
				fpExtend = (fpExtend === _UNDEFINED_) ? this.extend : fpExtend;

			for (sProperty in oObject) {
				if (oObject.hasOwnProperty(sProperty)) {
					if (typeof oObject[sProperty] !== _OBJECT_ || (typeof oObject[sProperty] === _OBJECT_ && oSelf[sProperty] === _UNDEFINED_)) {
						oSelf[sProperty] = oObject[sProperty];
					} else if (typeof oObject[sProperty] === _OBJECT_ && typeof oSelf[sProperty] === _OBJECT_) {
						fpExtend(oObject[sProperty], oSelf[sProperty], fpExtend);
					}
				}
			}

		};
		/**
		 * Set the image for the entity.
		 * @param {string} sImageId Image Identifier.
		 */
		EntityBase.prototype.setImage = function (sImageId) {

			var oImage = oSandbox.assets.get("image", sImageId);

			if (oImage) {
				this._image = oImage;
			}

		};
		/**
		 * Change the entity scale.
		 * @param {number} nXscale x axis Scale factor.
		 * @param {number} nYscale y axis Scale factor.
		 */
		EntityBase.prototype.scale = function (nXscale, nYscale) {
			this._scale = {
				x : nXscale,
				y : nYscale
			};
		};
		/**
		 * Rotate the entity.
		 * @param {number} Rotation angle.
		 */
		EntityBase.prototype.rotate = function (nAngle) {
			this._rotation += (nAngle * this._MATHPI180);
		};
		/**
		 * Rotate the entity to an exact angle.
		 * @param {number} Entity angle.
		 */
		EntityBase.prototype.setAngle = function (nAngle) {
			this._rotation = nAngle * this._MATHPI180;
		}
		/**
		 * Change entity Alpha.
		 * @param {number} nAlpha Alpha.
		 */
		EntityBase.prototype.globalAlpha = function (nAlpha) {

			if (nAlpha > 1) {
				nAlpha = 1;
			} else if (nAlpha < 0) {
				nAlpha = 0;
			}

			this._globalAlpha = nAlpha;

		};
		/**
		 * Change entity fill style.
		 * @param {string} sStyle hexadecimal.
		 */
		EntityBase.prototype.fillStyle = function (sStyle) {
			this._fillStyle = sStyle;
		};
		/**
		 * Change entity stroke style.
		 * @param {string} sStyle Stroke style.
		 */
		EntityBase.prototype.strokeStyle = function (sStyle) {
			this._strokeStyle = sStyle;
		};
		/**
		 * Change entity shadow properties.
		 * @param {number} nOffsetX x axis shadow offset.
		 * @param {number} nOffestY y axis shadow offset.
		 * @param {number} nBlur shadow blur.
		 * @param {string} sColor Shadow color (hex);
		 */
		EntityBase.prototype.shadow = function (nOffsetX, nOffsetY, nBlur, sColor) {

			this._shadowColor = sColor;
			this._shadowBlur = nBlur;
			this._shadowOffsetX = nOffsetX;
			this._shadowOffsetY = nOffsetY;

		};
		/**
		 * Subscribe the entity to a render
		 */
		EntityBase.prototype.setRenderer = function (sString) {
			if (typeof sString === _STRING_) {
				MMM.renderer.add(sString, this);
			}
		};

		EntityBase.prototype.removeFromLevel = function () {
			MMM.renderer.remove(this);
			MMM.updater.remove(this);
		};

		/**
		 * Rectangle constructor.
		 * @param {string} sEntityId Entity ID.
		 */
		RectangleEntity = function () {};
		RectangleEntity.prototype = new EntityBase();

		RectangleEntity.prototype.init = function (sEntityId) {

			this._entityID = sEntityId;

			this._halfWidth = (this.width === 0) ? 0 : this.width / 2;
			this._halfHeight = (this.height === 0) ? 0 : this.height / 2;

		};

		/**
		 * Returns X and Y coords of the entity center.
		 */
		RectangleEntity.prototype.getCenter = function () {
			return {
				x : this.x + this._halfWidth,
				y : this.y + this._halfHeight
			};
		};
		/**
		 *
		 */
		RectangleEntity.prototype.getTopLeftCorner = function () {
			return {
				x : this.x,
				y : this.y
			};
		};
		/**
		 * Circle constructor.
		 * @param {string} sEntityId Entity ID.
		 */
		CircleEntity = function () {};
		CircleEntity.prototype = new EntityBase();

		CircleEntity.prototype.init = function (sEntityId) {

			this._entityID = sEntityId;

			this.width = this.height = this.radius * 2;
			this._halfWidth = this._halfHeight = this.radius;

		};
		/**
		 * Returns X and Y coords of the entity center.
		 */
		CircleEntity.prototype.getCenter = function () {
			return {
				x : this.x,
				y : this.y
			};
		};
		/**
		 *
		 */
		CircleEntity.prototype.getTopLeftCorner = function () {
			return {
				x : this.x - this.radius,
				y : this.y - this.radius
			};
		};

		return {
			/**
			 * Adds an entity to the oRawEntities collection.
			 * @param {string} sId Entity ID.
			 * @param {function} fpConstructor Entity constructor.
			 */
			set: function (sId, fpConstructor, sParentId) {
				if (typeof sId !== _STRING_ || sId === '') {
					MMM.log('Empty or Invalid "ID"', {
						method : 'MMM.create',
						current : typeof sId,
						expected : 'string'
					}, true);
				}

				if (fpIsFunction(fpConstructor) === _FALSE_) {
					MMM.log('Invalid constructor', {
						method : 'MMM.create'
					}, true);
				}

				// At this point all the scripts are loaded so
				// require will return a function synchronously.
				oRawEntities[sId] = {
					constructor : fpConstructor,
					inheritsFrom : sParentId
				};
			},

			/**
			 * Imports an entity to the game.
			 * @param {string} sEntityId Entity ID.
			 * @param {object} oProperties Properties to add to the entity.
			 * @param {boolean} bAvoidRebuild Create (false) or not (true) a new instance of the entity.
			 */
			importById : function (sEntityId, oProperties, bAvoidRebuild) {

				var oRaw,
					sParentId,
					Constructor,
					oConstructed,
					oEntity,
					bInitializeEntity = true;

				if (typeof sEntityId !== _STRING_) {
					MMM.log("Invalid entity ID", {
						method : 'MMM.entity.importById'
					});
				}

				oEntity = oBuiltEntities[sEntityId];

				if (bAvoidRebuild !== _TRUE_ || oEntity === _UNDEFINED_) {

					oRaw = this.getRaw(sEntityId);

					Constructor = oRaw.constructor;
					sParentId = oRaw.inheritsFrom;

					oConstructed = new Constructor(oSandbox);

					switch(oConstructed.type) {
						case 'rectangle':
							oEntity = new RectangleEntity();
							break;
						case 'circle':
							oEntity = new CircleEntity();
							break;
						default:
							oEntity = new RectangleEntity();
							break;
					};

					oEntity.extend(oConstructed);
					oEntity.extend(oProperties);

					if (typeof sParentId === _STRING_) {
						oEntity = this.importById(sParentId, oEntity, false);
						bInitializeEntity = false;
					}

					oEntity._uid = MMM.utilities.generateUID();
					oEntity._idName = sEntityId;
					oBuiltEntities[sEntityId] = oEntity;
				}
				/**
				 * If the current Entity is the Main entity (not a parent entity)
				 * then we set the events, subscribe it to the updater and renderer
				 * and initialize it.
				 */
				if (bInitializeEntity === true) {
					this.setEntityEvents(oEntity);
					this.setEntityUpdater(oEntity);
					this.setEntityRenderer(oEntity);

					if (oEntity.init) {
						oEntity.init();
					}
				}

				return oEntity;

			},

			extend : function (sParentId, sEntityId, fpConstructor) {

				this.set(sEntityId, fpConstructor, sParentId);

			},
			/**
			 * Check & subscribe entity events.
			 * @param {object} oEntity Entity
			 */
			setEntityEvents : function (oEntity) {

				var sProperty,
					aEvents = [];

				if (typeof oEntity.events === 'object') {

					for (sProperty in oEntity.events) {
						if (oEntity.events.hasOwnProperty(sProperty)) {
							if (fpIsFunction(oEntity.events[sProperty])) {
								aEvents.push(sProperty);
							}
						}
					}

					if (aEvents.length > 0) {
						MMM.events.bind(aEvents, oEntity);
					}

				}

			},
			setEntityRenderer : function (oEntity) {
				if (typeof oEntity.renderer === _STRING_) {
					MMM.renderer.add(oEntity.renderer, oEntity);
				}
			},
			setEntityUpdater : function (oEntity) {
				if (oEntity.update) {
					MMM.updater.add(oEntity);
				}
			},
			/**
			 * Returns the constructor of an entity.
			 * @param {string} sEntityId Entity constructor identifier.
			 * @return {function} fpRaw Entity constructor.
			 */
			getRaw : function (sEntityId) {

				var fpRaw;

				if (typeof sEntityId !== _STRING_) {
					return false;
				}

				fpRaw = oRawEntities[sEntityId];

				if (fpRaw === _UNDEFINED_) {
					return false;
				}

				return fpRaw;

			},

			getAPI : function () {
				return {
					set : fpProxy(this.set, this),
					extend : fpProxy(this.extend, this)
				};
			}
		};
	}());

	/**
	 * Level manager.
	 * @private
	 * @type {object}
	 */
	MMM.level = (function () {

		var oLevels = {},
			oRawLevels = {},
			/**
			 * Level constructor
			 * @param {object} oLevel Level properties.
			 */
			Level = function (oLevel) {
				var sProperty;

				for (sProperty in oLevel) {
					if (oLevel.hasOwnProperty(sProperty) && Level.prototype[sProperty] === _UNDEFINED_) {
						this[sProperty] = oLevel[sProperty];
					}
				}
			};
			/**
			 * Adds an entity to the level.
			 * @param {string} sId Entity ID.
			 * @param {object} oProperties Extra properties for the entity.
			 * @param {boolean} bAvoidRebuild Create or not a new instance.
			 */
			Level.prototype.importEntity = function (sId, oProperties, bAvoidRebuild) {
				return MMM.entity.importById(sId, oProperties, bAvoidRebuild);
			};

		return {

			/**
			 * Start a level.
			 * Save the constructed level into oLevels object.
			 * @public
			 * @param {string} sLevelId Entity Identifier.
			 * @param {boolean} bRebuild Rebuild level?
			 */
			init : function (sLevelId, bRebuild) {

				var oLevel,
					fpLevel;

				sLevelId = (sLevelId === _UNDEFINED_) ? MMM.bootstrap.get("initialLevel") : sLevelId ;
				bRebuild = (bRebuild === _UNDEFINED_) ? _FALSE_ : bRebuild;

				if (oRawLevels[sLevelId] === _UNDEFINED_) {
					MMM.log("The level you are trying to start does not exist", null, true);
				}

				if (bRebuild === _TRUE_ || oLevels[sLevelId] === _UNDEFINED_) {

					fpLevel = oRawLevels[sLevelId];
					oLevel = new fpLevel(oSandbox);

					oLevels[sLevelId] = oLevel = new Level(oLevel);

				} else {
					oLevel = oLevels[sLevelId];
				}
				// Launch init method if exist.
				if (oLevel.init) {
					oLevel.init();
				}
				/**
				 * Subscrive the level to the events.
				 */
				this.setLevelEvents(oLevel);
				this.setLevelUpdater(oLevel);

				return oLevel;

			},

			/**
			 * Check & subscribe level events.
			 * @param {object} oLevel Entity
			 */
			setLevelEvents : function (oLevel) {

				var sProperty,
					aEvents = [];

				if (typeof oLevel.events === 'object') {

					for (sProperty in oLevel.events) {
						if (oLevel.events.hasOwnProperty(sProperty)) {
							if (fpIsFunction(oLevel.events[sProperty])) {
								aEvents.push(sProperty);
							}
						}
					}

					if (aEvents.length > 0) {
						MMM.events.bind(aEvents, oLevel);
					}

				}

			},
			setLevelUpdater : function (oLevel) {
				if (oLevel.update) {
					MMM.updater.add(oLevel);
				}
			},
			/**
			 * Level definition.
			 * @param {string} sLevelId Level identifier.
			 * @param {function} fpLevelFunction Level Constructor.
			 * @param {boolean} bOverwrite overwrite level.
			 */
			set : function (sLevelId, fpLevelFunction, bOverwrite) {

				if (typeof sLevelId !== _STRING_) {
					MMM.log("Invalid level ID", {
						method: "MMM.level.create"
					}, true);
				}

				if (fpIsFunction(fpLevelFunction) === _FALSE_) {
					MMM.log("Invalid level constructor", {
						method: "MMM.level.create"
					}, true);
				}

				if (oRawLevels[sLevelId] === _UNDEFINED_ || bOverwrite === _TRUE_) {
					oRawLevels[sLevelId] = fpLevelFunction;
					delete oLevels[sLevelId];
				}

			},
			/**
			 * Returns a level constructor.
			 * @param {string} sLevelId Level identifier.
			 * @param {function} Level constructor.
			 */
			getRaw : function (sLevelId) {
				return oRawLevels[sLevelId] || false;
			},
			getAPI : function () {
				return {
					set : this.set
				};
			}

		};

	}());

	/**
	 * Updater. Update all the game entities.
	 */
	 MMM.updater = (function (config, camera) {

		var aEntities = [],
			oEntityKey = {},
			aToRemove = [];

		return {

			/**
			 * Add an entity to the "updater" list.
			 * @public
			 * @param {object} oEntity Entity instance.
			 */
			add : function (oEntity) {

				var bExist = false;

				if (typeof oEntity === _OBJECT_) {

					if (!oEntity.update) {
						return;
					}

					if (oEntityKey[oEntity._uid] === _UNDEFINED_) {
						aEntities.push(oEntity);
						oEntityKey[oEntity._uid] = aEntities.length - 1;
					}
				}

			},

			/**
			 * Calls the "update" method of all the objects in the updater list.
			 * @public
			 */
			update : function () {

				var nCount,
					nLength,
					oEntity;

				this.removeEntities();

				nLength = aEntities.length;

				for (nCount = 0; nCount < nLength; nCount += 1) {

					oEntity = aEntities[nCount];
					oEntity.update();

				}

			},

			/**
			 * Remove entities from the updater list.
			 * @public
			 */
			removeEntities : function () {

				var nCount,
					nRemCount,
					nLength,
					nRemLength = aToRemove.length,
					oEntity,
					oRemEntity;

				for (nRemCount = 0; nRemCount < nRemLength; nRemCount += 1) {

					nLength = aEntities.length;
					oRemEntity = aToRemove[nRemCount];

					for (nCount = 0; nCount < nLength; nCount += 1) {

						oEntity = aEntities[nCount];

						if (oEntity === oRemEntity) {

							aEntities.splice(nCount, 1);
							delete oEntityKey[oEntity._uid];

						}

					}

				}

				aToRemove = [];

			},
			/**
			 * Adds an entity to the remove list.
			 * @public
			 * @param {object} oEntity Entity to remove.
			 */
			remove : function (oEntity) {

				var sKey = oEntity._uid;

				if (oEntityKey[sKey] === _UNDEFINED_) {
					return;
				}

				aToRemove.push(oEntity);

			},
			/**
			 * Adds all the entities to the remove list.
			 * @public
			 */
			clearEntities : function () {

				var nCount,
					nLength = aEntities.length;

				for (nCount = 0; nCount < nLength; nCount += 1) {
					aToRemove.push(aEntities[nCount]);
				}

			}

		};

	}());

	/**
	 * Renderer. Draws all the active entities to the canvas.
	 * @private
	 */
	MMM.renderer = (function (config, camera) {

		var aEntities = [],
			oEntityKey = [],
			aToRemove = [],

			bDebug,
			nFps,
			nCurrentFps = 0,
			nFrameCount = 0,
			nLastCx = 0,
			nLastCy = 0,
			nLastFps = new Date().getTime(),
			DOUBLEMATHPI = Math.PI*2,
			MATHPI180 = Math.PI / 180;

		return {

			/**
			 * Initialize renderer module.
			 * @public
			 */
			init : function () {

				bDebug = MMM.bootstrap.get("debug") || false;

			},
			/**
			 * Adds an Entity to the render list.
			 * @public
			 * @param {string} sRenderType Render type.
			 * @param {object} oEntity Entity.
			 */
			add : function (sRenderType, oEntity) {

				var self = this;

				if (this.renderType[sRenderType] !== _UNDEFINED_) {

					oEntity._renderer = sRenderType;
					oEntity._draw = true;

					aEntities.push(oEntity);
					oEntityKey[oEntity._uid] = aEntities.length - 1;

				}

			},

			/**
			 * Render all the objects.
			 * "game" canvas will be rendered on each frame.
			 * "background" canvas will be rendered if camera has changed.
			 * "interface" canvas will be rendered on petition.
			 * @public
			 * @param {object} oThis CYANJS.renderer context.
			 */
			render : function () {

				var sCanvasId,
					nInterfaceLen =  aEntities.length;

				this.removeEntities();
				this.renderCanvas();

				if (bDebug === true) {
					this.renderFps();
				}

			},

			/**
			 * Render the objects of the given canvas.
			 * @public
			 * @param {string} sCanvasId Canvas Identifier.
			 * @param {object} oThis CYANJS.renderer context.
			 * @param {number} nCx Camera position on axis X.
			 * @param {number} nCy Camera position on axis Y.
			 */
			renderCanvas : function () {

				var oGPos = MMM.camera.getCameraPosition(),
					nCx = oGPos.x || 0,
					nCy = oGPos.y || 0,
					nCount = 0,
					nLength = aEntities.length,
					oEntity,
					oRenders = this.renderType,
					oCanvas = MMM.canvas.get(),
					oCanvasContext = oCanvas.context,
					oBuffer = oCanvas.buffer,
					oBufferContext = oCanvas.buffer.context,
					oCenter;

				oBufferContext.clearRect(0, 0, oCanvas.buffer.width, oCanvas.buffer.height);

				aEntities.sort(function (oEntityA, oEntityB) {
					return oEntityA.z - oEntityB.z;
				});

				for (nCount; nCount < nLength; nCount += 1) {

					oEntity = aEntities[nCount];

					if (oEntity._draw === true) {
						oCenter = oEntity.getCenter();

						if (!(oCenter.x + oEntity._halfWidth - nCx < 0 || oCenter.x - oEntity._halfWidth - nCx > oCanvas.width)
							&& !(oCenter.y + oEntity._halfHeight - nCy < 0 || oCenter.y - oEntity._halfHeight - nCy > oCanvas.height)) {

							oBufferContext.save();

							if (oEntity._rotation || oEntity._scale) {

								oBufferContext.setTransform(1, 0, 0, 1, 0, 0);
								oBufferContext.translate(oCenter.x - nCx, oCenter.y - nCy);

								if (typeof oEntity._rotation === _NUMBER_ && oEntity._rotation !== 0) {
									oBufferContext.rotate(oEntity._rotation);
								}

								if (typeof oEntity._scale === _OBJECT_ && (oEntity._scale.x !== 1 || oEntity._scale.y !== 1)) {
									oBufferContext.scale(oEntity._scale.x, oEntity._scale.y);
								}

								oBufferContext.translate(-(oCenter.x - nCx), -(oCenter.y - nCy));

							}

							if (typeof oEntity._globalAlpha === _NUMBER_) {
								oBufferContext.globalAlpha = oEntity._globalAlpha;
							}

							if (typeof oEntity._fillStyle === _STRING_) {
								oBufferContext.fillStyle = oEntity._fillStyle;
							}

							if (typeof oEntity._strokeStyle === _STRING_) {
								oBufferContext.strokeStyle = oEntity._strokeStyle;
							}

							if (typeof oEntity._shadowColor === _STRING_ && typeof oEntity._shadowBlur === _NUMBER_ && typeof oEntity._shadowOffsetX === _NUMBER_ && typeof oEntity._shadowOffsetY === _NUMBER_) {
								oBufferContext.shadowColor = oEntity._shadowColor;
								oBufferContext.shadowBlur = oEntity._shadowBlur;
								oBufferContext.shadowOffsetX = oEntity._shadowOffsetX;
								oBufferContext.shadowOffsetY = oEntity._shadowOffsetY;
							}

							oRenders[oEntity._renderer](oBufferContext, oEntity, nCx, nCy);

							if (bDebug === true) {
								if (typeof oEntity.debugDraw === 'function') {
									oEntity.debugDraw(oBufferContext, nCx, nCy);
								}
								oRenders.debug(oBufferContext, oEntity, nCx, nCy);
							}

							oBufferContext.restore();
						}
					}

				}

				oCanvasContext.clearRect(0, 0, oCanvas.width, oCanvas.height);
				oCanvasContext.drawImage(oCanvas.buffer, 0, 0);

			},

			renderType : {
				/**
				 * Calls Entity "draw" method.
				 * @public
				 * @param {object} oBufferContext Buffer context.
				 * @param {object} oEntity Entity.
				 * @param {number} nCx Camera position on axis X.
				 * @param {number} nCy Camera position on axis Y.
				 */
				own : function (oBufferContext, oEntity, nCx, nCy) {
					oEntity.draw(oBufferContext, nCx, nCy);
				},
				/**
				 * Draws a circle.
				 * @public
				 * @param {object} oBufferContext Buffer context.
				 * @param {object} oEntity Entity.
				 * @param {number} nCx Camera position on axis X.
				 * @param {number} nCy Camera position on axis Y.
				 */
				circle : function (oBufferContext, oEntity, nCx, nCy) {

					oBufferContext.beginPath();
					oBufferContext.arc(oEntity.x, oEntity.y, oEntity.radius, DOUBLEMATHPI, false);
					oBufferContext.closePath();

					oBufferContext.fill();

					if (typeof oEntity._strokeStyle === _STRING_) {
						oBufferContext.stroke();
					}

				},
				/**
				 * Draws an image inside a circle.
				 * @public
				 * @param {object} oBufferContext Buffer context.
				 * @param {object} oEntity Entity.
				 * @param {number} nCx Camera position on axis X.
				 * @param {number} nCy Camera position on axis Y.
				 */
				circleImage : function (oBufferContext, oEntity, nCx, nCy) {

					var oTopLeft = oEntity.getTopLeftCorner();
					oBufferContext.drawImage(oEntity._image, oTopLeft.x - nCx, oTopLeft.y - nCy);

				},
				/**
				 * Draws an image.
				 * @public
				 * @param {object} oBufferContext Buffer context.
				 * @param {object} oEntity Entity.
				 * @param {number} nCx Camera position on axis X.
				 * @param {number} nCy Camera position on axis Y.
				 */
				image : function (oBufferContext, oEntity, nCx, nCy) {
					oBufferContext.drawImage(oEntity._image, oEntity.x - nCx, oEntity.y - nCy);
				},
				/**
				 * Draws a part of an image.
				 * @public
				 * @param {object} oBufferContext Buffer context.
				 * @param {object} oEntity Entity.
				 * @param {number} nCx Camera position on axis X.
				 * @param {number} nCy Camera position on axis Y.
				 */
				imageFragment : function (oBufferContext, oEntity, nCx, nCy) {
					var oFragment = oEntity._imageFragment;
					oBufferContext.drawImage(oEntity._image, oFragment.iX, oFragment.iY, oFragment.width, oFragment.height, oEntity.x - nCx, oEntity.y - nCy, oFragment.width, oFragment.height);
				},
				/**
				 * Draws a resized image.
				 * @public
				 * @param {object} oBufferContext Buffer context.
				 * @param {object} oEntity Entity.
				 * @param {number} nCx Camera position on axis X.
				 * @param {number} nCy Camera position on axis Y.
				 */
				imageResizing : function (oBufferContext, oEntity, nCx, nCy) {
					oBufferContext.drawImage(oEntity._image, oEntity.x - nCx, oEntity.y - nCy, oEntity.width, oEntity.height);
				},
				/**
				 * Fill the entity with a pattern.
				 * @public
				 * @param {object} oBufferContext Buffer context.
				 * @param {object} oEntity Entity.
				 * @param {number} nCx Camera position on axis X.
				 * @param {number} nCy Camera position on axis Y.
				 */
				pattern : function (oBufferContext, oEntity, nCx, nCy) {

					if (typeof oEntity._pattern === 'undefined') {
						oEntity._pattern = oBufferContext.createPattern(oEntity.image,'repeat');
					}
					oBufferContext.fillStyle = oEntity._pattern;
					oBufferContext.fillRect(oEntity.x, oEntity.y, oEntity.width, oEntity.height);

				},
				/**
				 * Draws a polygon.
				 * @public
				 * @param {object} oBufferContext Buffer context.
				 * @param {object} oEntity Entity.
				 * @param {number} nCx Camera position on axis X.
				 * @param {number} nCy Camera position on axis Y.
				 */
				poly : function (oBufferContext, oEntity, nCx, nCy) {

					var nCount, nLength, oVector;

					oBufferContext.beginPath();
					oBufferContext.moveTo(oEntity._points[0].x - nCx, oEntity._points[0].y - nCy);

					nLength = oEntity._points.length;

					for (nCount = 1; nCount < nLength; nCount += 1) {
						oVector = oEntity._points[nCount];
						oBufferContext.lineTo(oVector.x - nCx, oVector.y - nCy);
					}


					oBufferContext.lineTo(oEntity._points[0].x - nCx, oEntity._points[0].y - nCy);
					oBufferContext.fill();


					oBufferContext.stroke();
					oBufferContext.closePath();

				},
				/**
				 * Draws a rectangle.
				 * @public
				 * @param {object} oBufferContext Buffer context.
				 * @param {object} oEntity Entity.
				 * @param {number} nCx Camera position on axis X.
				 * @param {number} nCy Camera position on axis Y.
				 */
				rectangle : function (oBufferContext, oEntity, nCx, nCy) {

					oBufferContext.fillRect(oEntity.x - nCx, oEntity.y - nCy, oEntity.width, oEntity.height);

				},
				/**
				 * Creates a sheet animation.
				 * @public
				 * @param {object} oBufferContext Buffer context.
				 * @param {object} oEntity Entity.
				 * @param {number} nCx Camera position on axis X.
				 * @param {number} nCy Camera position on axis Y.
				 */
				sheetAnimation : function (oBufferContext, oEntity, nCx, nCy) {

					var oSheet = oEntity._sheet,
						oCurrentSheet = oSheet[oEntity._sheet._current],
						nData = new Date().getTime(),
						nSourceX,
						nSourceY;

					if (nData - oSheet._lastFrame >= oSheet._timePerFrame) {
						oSheet._currentFrame += 1;
						oSheet._lastFrame = nData;

						if (oSheet._currentFrame === oCurrentSheet.frames) {
							oSheet._currentFrame = 0;
						}
					}

					nSourceX = (oCurrentSheet.orientation === "horitzontal") ? (oCurrentSheet.width * oSheet._currentFrame) + oCurrentSheet.x : oCurrentSheet.x;
					nSourceY = (oCurrentSheet.orientation === "horitzontal") ? oCurrentSheet.y : (oCurrentSheet.height * oSheet._currentFrame) + oCurrentSheet.y;
					oBufferContext.drawImage(oEntity._image, nSourceX, nSourceY, oCurrentSheet.width, oCurrentSheet.height, oEntity.x - nCx, oEntity.y - nCy, oCurrentSheet.width, oCurrentSheet.height);

				},

				debug : function (oBufferContext, oEntity, nCx, nCy) {

					var nCenter, nX, nY, nWidth, nHeight;

					if (oEntity._shape === "rectangle") {
						nX = oEntity.x;
						nY = oEntity.y;
						nWidth = oEntity.width;
						nHeight = oEntity.height;
					} else if (oEntity._shape === "poly") {
						nCenter = oEntity.getCenter();
						nX = nCenter.x - oEntity._halfWidth;
						nY = nCenter.y - oEntity._halfHeight;
						nWidth = oEntity._halfWidth * 2;
						nHeight = oEntity._halfHeight * 2;
					}

					oBufferContext.strokeStyle = "#F00";
					oBufferContext.strokeRect(nX - nCx, nY - nCy, nWidth, nHeight);

				}

			},

			/**
			 * Draws the current game FPS.
			 * @public
			 * @param {object} oBufferContext Buffer context.
			 */
			renderFps : function (oBufferContext) {
				var nThisFrame = new Date().getTime(),
					nDiffTime = Math.ceil((nThisFrame - nLastFps)),
					nInverse = MMM.canvas.proportion().inverse,
					nFontSize = (nInverse > 1) ? 12 * nInverse : 12,
					oCanvas = MMM.canvas.get(),
					oBufferContext = oCanvas.context;

				if (nDiffTime >= 1000) {
					nCurrentFps = nFrameCount;
					nFrameCount = 0.0;
					nLastFps = nThisFrame;
				}

				oBufferContext.save();
				oBufferContext.fillStyle = '#000';
				oBufferContext.font = 'bold ' + nFontSize + 'px sans-serif';
				oBufferContext.fillText('FPS: ' + nCurrentFps, 10, nFontSize);
				oBufferContext.restore();
				nFrameCount += 1;
			},
			/**
			 * Remove an element from the render list.
			 * @public
			 * @param {object} oEntity Entity to be removed.
			 */
			remove : function (oEntity) {

				var sKey = oEntity._uid;

				if (typeof oEntityKey[sKey] === 'undefined') {
					return;
				}

				aToRemove.push(oEntity);

			},
			/**
			 * Remove entities from the render list.
			 * @public
			 */
			removeEntities : function () {

				var nCount,
					nRemCount,
					nLength,
					nRemLength,
					oEntity,
					oRemEntity;

					nRemLength = aToRemove.length;

					for (nRemCount = 0; nRemCount < nRemLength; nRemCount += 1) {

						nLength = aEntities.length;
						oRemEntity = aToRemove[nRemCount];

						for (nCount = 0; nCount < nLength; nCount += 1) {

							oEntity = aEntities[nCount];

							if (oEntity === oRemEntity) {

								aEntities.splice(nCount, 1);
								delete oEntityKey[oEntity._uid];

							}

						}

					}

					aToRemove = [];

			},
			/**
			 * Adds all the entities to the "aToRemove" list.
			 * @public.
			 */
			clearEntities : function () {

				var nCount,
					nLength;

					nLength = aEntities.length;

					for (nCount = 0; nCount < nLength; nCount += 1) {
						aToRemove.push(aEntities[nCount]);
					}

			}

		};

	}());

	/**
	 * Game Camera.
	 */
	MMM.camera = (function (config) {

		var nCameraX = 0,
			nCameraY = 0,
			oTarget,
			nFOVwidth,
			nFOVheight,
			nBufferWidth,
			nBufferHeight;

		var camera = {

			/**
			 * camera initialization.
			 */
			init : function () {

				var oBuffer = MMM.canvas.get().buffer;

				nBufferWidth = oBuffer.width;
				nBufferHeight = oBuffer.height;

			},
			/**
			 * Force the camera to follow the given entity.
			 * @public
			 * @param {object} oElement Entity.
			 */
			setFocusOn : function(oElement) {
				var nNewGlobalX = (oElement.x) + (oElement.width / 2) - (nBufferWidth / 2),
					nNewGlobalY = (oElement.y) + (oElement.height / 2) - (nBufferHeight / 2);

				oElement._lastx = oElement.x;
				oElement._lasty = oElement.y;

				oTarget = oElement;

				this.moveCamera("x", Math.round(nNewGlobalX), true);
				this.moveCamera("y", Math.round(nNewGlobalY), true);

				this.active = true;
			},
			/**
			 * Sets the size that the camera should cover.
			 * @public
			 * @param {object} oDimensions Width and Height.
			 */
			setFieldOfVision : function (oDimensions) {

				nFOVwidth = oDimensions.width;
				nFOVheight = oDimensions.height;

			},
			/**
			 * Remove the current target of the Camera.
			 * @public
			 */
			resetFocus : function () {

				if (oTarget) {

					delete oTarget._lastx;
					delete oTarget._lasty;
					oTarget = null;

				}

				this.active = false;

			},
			/**
			 * Updates camera position based on target movement.
			 * @public
			 * @param {object} oThis CYANJS.viewportCamera context.
			 */
			update : function () {

				var nVariationX = oTarget.x - oTarget._lastx,
					nVariationY = oTarget.y - oTarget._lasty;

				if (nVariationX !== 0) {
					this.moveCamera('x', nVariationX, false);
					oTarget._lastx = oTarget.x;
				}

				if (nVariationY !== 0) {
					this.moveCamera('y', nVariationY, false);
					oTarget._lasty = oTarget.y;
				}

			},
			/**
			 * Moves the camera through the X or Y axis.
			 * @public
			 * @param {string} sAxis Axis (x or y).
			 * @param {number} nNewGlobal Increment value.
			 * @param {boolean} bAbsolute
			 */
			moveCamera : function(sAxis, nNewGlobal, bAbsolute) {

				var nZoneSize,
					nCanvasSize,
					nAxis,
					nFrameSize,
					nFinalGlobal,
					nMaxGlobal;

				if (sAxis === 'x') {

					nZoneSize = nFOVwidth;
					nCanvasSize = nBufferWidth;
					nAxis = oTarget.x;
					nFrameSize = oTarget.width;
					nFinalGlobal = nCameraX;
					nMaxGlobal = nFOVwidth - nCanvasSize;

				} else if (sAxis === 'y') {

					nZoneSize = nFOVheight;
					nCanvasSize = nBufferHeight;
					nAxis = oTarget.y;
					nFrameSize = oTarget.height;
					nFinalGlobal = nCameraY;
					nMaxGlobal = nFOVheight - nCanvasSize;

				}

				if ( typeof nNewGlobal === 'number') {

					if (bAbsolute === true) {
						if (nNewGlobal > nMaxGlobal) {
							nNewGlobal = nMaxGlobal;
						}
						if (nNewGlobal < 0) {
							nNewGlobal = 0;
						}
						nFinalGlobal = nNewGlobal;
					} else {
						if (nNewGlobal > 0) {
							// Comprovación de que el escenario no se salga de la pantalla.
							if (nFinalGlobal + nNewGlobal > nZoneSize - nCanvasSize) {
								nFinalGlobal = nZoneSize - nCanvasSize;
							} else if (nAxis + (nFrameSize / 2) > (nCanvasSize / 2)) {
								nFinalGlobal += nNewGlobal;
							}
						} else if (nNewGlobal < 0) {
							// Comprovación de que el escenario no se salga de la pantalla.
							if (nFinalGlobal + nNewGlobal < 0) {
								nFinalGlobal = 0;
							} else if (nAxis + (nFrameSize / 2) < (nZoneSize - (nCanvasSize / 2))) {
								nFinalGlobal += nNewGlobal;
							}
						}
					}

					if (sAxis === 'x') {
						nCameraX = nFinalGlobal;
					} else if (sAxis === 'y') {
						nCameraY = nFinalGlobal;
					}

				}
			},
			/**
			 * Returns camera current position.
			 * @public
			 * @return {object} Camera position.
			 */
			getCameraPosition : function () {

				return {
					x : nCameraX,
					y : nCameraY
				};

			},
			/**
			 * Resets camera properties.
			 */
			clear : function () {

				nCameraX = 0;
				nCameraY = 0;
				this.resetFocus();

			}

		};

		return camera;

	}());

	/**
	 * Event handler.
	 * @namespace events
	 * @private
	 */
	MMM.events = (function () {
			/**
			 * List of active events.
			 * @private
			 * @type {object}
			 */
		var oEvents = {},
			/**
			 * List of events to remove from oEvents.
			 * @private
			 * @type {object}
			 */
			oToRemove = {},
			/**
			 * Key Map.
			 * @private
			 * @type {object}
			 */
			oKeyMap = {
				"8" : "BACKTAB",
				"9" : "TAB",
				"13" : "ENTER",
				"16" : "SHIFT",
				"17" : "CTRL",
				"18" : "ALT",
				"19" : "PAUSE",
				"27" : "ESC",
				"32" : "SPACE",
				"33" : "PAGEUP",
				"34" : "PAGEDOWN",
				"35" : "END",
				"36" : "HOME",
				"37" : "LEFT",
				"38" : "UP",
				"39" : "RIGHT",
				"40" : "DOWN",
				"45" : "INSERT",
				"46" : "DELETE",
				"93" : "MENU",
				"112" : "F1",
				"113" : "F2",
				"114" : "F3",
				"115" : "F4",
				"116" : "F5",
				"117" : "F6",
				"118" : "F7",
				"119" : "F8",
				"120" : "F9",
				"121" : "F10",
				"122" : "F11",
				"123" : "F12"
			},
			/**
			 * List of Keys that does not have to execute "preventDefault".
			 * @private
			 * @type {object}
			 */
			oAvoidPreventDefaultKeyMap = {
				"17" : "Ctrl",
				"116" : "F5",
				"122" : "F11"
			};

		// Public API.
		return {
			/**
			 * Binds an event to an entity.
			 * @private
			 * @param {object} eEvents event or List of events.
			 * @param {object} oEntity Entity.
			 */
			bind : function (eEvents, oEntity) {
				var nCount = 0,
					nLength = eEvents.length,
					/**
					 * Bind an event to an entity.
					 * @private
					 * @param {string} sEvent Event type.
					 * @param {object} oEntity Entity.
					 */
					fpBindEvent = function (sEvent, oEntity) {

						// If the event doesn't exist, we create a new list.
						if (oEvents[sEvent] === _UNDEFINED_) {
							oEvents[sEvent] = [];
							oToRemove[sEvent] = [];
						}

						if (fpIsFunction(oEntity.events[sEvent])) {
							oEvents[sEvent].push(oEntity);
						}

					};

				if (fpIsArray(eEvents) && typeof oEntity === _OBJECT_) {

					for (nCount; nCount < nLength; nCount += 1) {
						fpBindEvent(eEvents[nCount], oEntity);
					}

				} else if (typeof eEvents === _STRING_) {
					fpBindEvent(eEvents, oEntity);
				}
			},
			/**
			 * Trigger an event.
			 * @public
			 * @param {object} eEvent Event data.
			 */
			trigger : function (eEvent, oEventData) {
				var sType,
					aEvent,
					oEntity,
					oData,
					nCount = 0,
					nLength,
					sKey,
					nKeyCode;

				if (eEvent === _UNDEFINED_) {
					MMM.log('Invalid event information', {
						method: 'MMM.events.trigger',
					});
				}

				if (typeof eEvent === _STRING_) {
					sType = eEvent;
					oData = oEventData || _NULL_;
				} else {
					sType = eEvent.type || '';
					oData = eEvent;
				}
				// Remove old events.
				this._remove();

				aEvent = oEvents[sType];

				if (aEvent) {

					nLength = aEvent.length;
					nKeyCode = eEvent.keyCode;

					if (nKeyCode) {
						sKey = (oKeyMap[nKeyCode] === _UNDEFINED_) ? String.fromCharCode(eEvent.keyCode) : oKeyMap[nKeyCode];
						oData.key = sKey;
					}

					for (nCount; nCount < nLength; nCount += 1) {

						oEntity = aEvent[nCount];
						oEntity.events[sType].call(oEntity, oData);

					}

					if (oAvoidPreventDefaultKeyMap[nKeyCode] === _UNDEFINED_ && eEvent.preventDefault) {
						eEvent.preventDefault();
					}

				}
			},
			/**
			 * Adds an entity event to the "oToRemove" list.
			 * @public
			 * @param eEvents event or list of events.
			 * @param {object} oEntity Entity.
			 */
			clean : function (eEvents, oEntity) {
				var nCount = 0,
					nLength = eEvents.length,

					fpAddToRemove = function (sEvent, oEntity) {
						var aEvent = oToRemove[sEvent];

						if (aEvent) {
							oToRemove[sEvent].push(oEntity);
						}
					};

				if (fpIsArray(eEvents) && typeof oEntity === _OBJECT_) {

					for (nCount; nCount < nLength; nCount += 1) {
						fpAddToRemove(eEvents[nCount], oEntity);
					}

				} else if (typeof eEvents === _STRING_) {
					fpAddToRemove(eEvents, oEntity);
				}
			},

			/**
			 * Remove events on "oToRemove".
			 * @private
			 */
			_remove : function () {

				var nCount,
					nCountEn,
					nLengthEn,
					nLength,
					sEvent,
					aEventToRemove,
					aEventEntities,
					oRemEntity,
					oEntity;
				// Iterate oToRemove elements.
				for (sEvent in oToRemove) {

					if (oToRemove.hasOwnProperty(sEvent)) {

						aEventToRemove = oToRemove[sEvent];
						nLength = aEventToRemove.length;

						for (nCount = 0; nCount < nLength; nCount += 1) {

							oRemEntity = aEventToRemove[nCount];
							aEventEntities = oEvents[sEvent];

							if (aEventEntities) {
								nLengthEn = aEventEntities.length;

								for (nCountEn = 0; nCountEn < nLengthEn; nCountEn += 1) {

									oEntity = aEventEntities[nCountEn];

									if (oEntity === oRemEntity) {
										// Remove from the array.
										aEventEntities.splice(nCountEn, 1);
									}

								}
							}

						}

						oToRemove[sEvent] = [];

					}

				}
			}

		};

	}());

	/**
	 * Collection of methods to check browser compatibility with HTML5 features.
	 * @namespace MMM.isCompatibleWith
	 * @type {object}
	 */
	MMM.browserCompatibility = {
		/**
		 * Check browser compatibility with "2D Canvas".
		 * @function
		 * @return {boolean} bIsCompatible
		 */
		canvas : (function () {
			var bIsCompatible,
				oCanvas = doc.createElement('canvas');

			bIsCompatible = (!oCanvas.getContext || !oCanvas.getContext('2d')) ? _FALSE_ : _TRUE_;
			oCanvas = _NULL_;

			return bIsCompatible;
		}()),
		/**
		 * Check browser compatibility with "localStorage".
		 * @function
		 * @return {boolean}
		 */
		localStorage : (function () {
			var sItem = 'mesmerism';
			try {
				win.localStorage.setItem(sItem, sItem);
				win.localStorage.removeItem(sItem);
				return _TRUE_;
			} catch (e) {
				return _FALSE_;
			}
		}()),
		/**
		 * Check browser compatibility with "audio".
		 * @function
		 * @return {boolean} bIsCompatible;
		 */
		audio : (function () {
			var bIsCompatible,
				sAudio = 'audio',
				sProbably = 'probably',
				sMaybe = 'maybe',
				oAudio = doc.createElement(sAudio),
				sOgg = oAudio.canPlayType(sAudio + "/ogg"),
				sWav = oAudio.canPlayType(sAudio + "/wav"),
				sMp3 = oAudio.canPlayType(sAudio + "/mp3");

			bIsCompatible = (!(sOgg === sProbably || sOgg === sMaybe)
				&& !(sWav === sProbably || sWav === sMaybe)
				&& !(sMp3 === sProbably || sMp3 === sMaybe)) ? _FALSE_ : _TRUE_;

			oAudio = sOgg = sWav = sMp3 = sAudio = sProbably = sMaybe = _NULL_;

			return bIsCompatible;
		}()),
		/**
		 * Checks browser compatibility.
		 */
		init : function () {
			var log = MMM.log;

			if (this.canvas === _FALSE_) {
				log("Canvas tag not supported", null, true);
			}
			if (this.localStorage === _FALSE_) {
				log("localStorage not supported", null, true);
			}
			if (this.audio === _FALSE_) {
				log("Audio is not supported", null, true);
			}
		}

	};
	/**
	 * Canvas object. Contains all the functions to create,
	 * resize & align the Game Canvas & Buffer.
	 * @private
	 * @type {object}
	 */
	MMM.canvas = (function () {
			/**
			 * Canvas & Buffer DOM Elements are stored here.
			 * @private
			 * @type {object}
			 */
		var oCanvasEl,
			oProportion;

		return {
			/**
			 * Creates, resize & align canvas & buffer elements.
			 * @private
			 */
			init : function () {

				var oCanvas = MMM.bootstrap.get('canvas'),
					bRescale = oCanvas.rescale,
					oOutput;

				if (typeof oCanvas !== _OBJECT_) {

				}

				// Create canvas and buffer.
				this.createCanvas(oCanvas);
				this.bindEvents();
				// Rescale canvas.
				if (bRescale === _TRUE_) {

					this.resizeCanvas();
					this.alignCanvas();
					// Proportion is needed to capture mouse coords correctly.
					this.getProportion();

					// Bind resize event.
					win.oDom.events.bind("resize", window, fpProxy(function () {

						this.rescaleFunctions();

					}, MMM.canvas), false);
				}

			},

			/**
			 * Create Canvas & Buffer Elements.
			 * @private
			 * @param {object} oBootstrap Canvas properties.
			 */
			createCanvas : function (oProperties) {

				var oCanvas = doc.createElement('canvas'),
					oBuffer = doc.createElement('canvas');

				if (typeof oProperties.width !== _NUMBER_ || typeof oProperties.height !== _NUMBER_) {
					MMM.log('Error while creating the Canvas Element. Your bootstrap does not have a valid width or height value', {
						"width" : oProperties.width,
						"height" : oProperties.height
					}, true);
				}

				oCanvas.id = 'MMM_Canvas';
				oCanvas.width = oBuffer.width = oProperties.width;
				oCanvas.height = oBuffer.height = oProperties.height;

				oCanvas.context = oCanvas.getContext('2d');

				oCanvas.buffer = oBuffer;
				oCanvas.buffer.context = oBuffer.getContext('2d');

				doc.body.appendChild(oCanvas);

				oCanvasEl = oCanvas;

				oCanvas = oBuffer = null;

			},

			/**
			 * Modify canvas dimensions to fit with the browser area.
			 * @private
			 * @param {object} oCanvas Canvas
			 */
			resizeCanvas : function () {

				var nBrowserWidth = win.innerWidth,
					nBrowserHeight = win.innerHeight,
					nBrowserProportion = nBrowserWidth / nBrowserHeight,
					nCanvasProportion = oCanvasEl.width / oCanvasEl.height;

				if (nBrowserProportion > nCanvasProportion) {
					nBrowserWidth = nBrowserHeight * nCanvasProportion;
				} else {
					nBrowserHeight = nBrowserWidth / nCanvasProportion;
				}

				oCanvasEl.style.width = nBrowserWidth + "px";
				oCanvasEl.style.height = nBrowserHeight + "px";

			},

			/**
			 * Align Canvas element to the center.
			 */
			alignCanvas : function () {

				var nCanvasWidth,
					nCanvasHeight;

				oCanvasEl.style.position = "absolute";
				oCanvasEl.style.left = "50%";
				oCanvasEl.style.top = "50%";

				nCanvasWidth = win.parseInt(oCanvasEl.style.width.replace("px", ""), 10);
				nCanvasHeight = win.parseInt(oCanvasEl.style.height.replace("px", ""), 10);

				oCanvasEl.style.marginLeft = "-" + nCanvasWidth / 2 + "px";
				oCanvasEl.style.marginTop = "-" + nCanvasHeight / 2 + "px";

			},

			/**
			 * Calculates the proportion between the original dimensions and the resized dimensions.
			 * @private
			 * @return {object} Proportions.
			 */
			getProportion : function () {

				var fpParseInt = win.parseInt,
					nRenderWidth = oCanvasEl.width,
					nRenderHeight = oCanvasEl.height,
					nRealWidth = oCanvasEl.style.width.replace("px", ""),
					nRealHeight = oCanvasEl.style.height.replace("px", ""),

					nWidthProp = fpParseInt(nRealWidth, 10) / fpParseInt(nRenderWidth, 10),
					nHeightProp = fpParseInt(nRealHeight, 10) / fpParseInt(nRenderHeight, 10),
					nInverseProp = fpParseInt(nRenderWidth, 10) / fpParseInt(nRealWidth, 10);

				oProportion = {
					x : nWidthProp,
					y : nHeightProp,
					inverse : nInverseProp
				};

			},

			bindEvents : function () {

				var oEvents = win.oDom.events,
					fpEventHandler = fpProxy(MMM.events.trigger, MMM.events);

				oEvents.bind('keydown', win, fpEventHandler);
				oEvents.bind('keyup', win, fpEventHandler);

				oEvents.bind('mousemove', oCanvasEl, fpEventHandler);
				oEvents.bind('mousedown', oCanvasEl, fpEventHandler);
				oEvents.bind('mouseup', oCanvasEl, fpEventHandler);

			},

			/**
			 * Calls all the needed functions for the resizing.
			 */
			rescaleFunctions : function () {
				this.resizeCanvas();
				this.alignCanvas();
				this.getProportion();
			},
			/**
			 * To get the Canvas Element.
			 * @private
			 * @return {object} oCanvasEl DOM Element.
			 */
			get : function () {
				return oCanvasEl;
			},
			proportion : function () {
				if (oProportion === _UNDEFINED_) {
					oProportion = {
						x : 1,
						y : 1,
						inverse : 1
					};
				}
				return oProportion;
			}
		};

	}());


	MMM.assets = (function () {

		var aImageQueue,
			oImageCollection = {},
			nSuccess = 0,
			nErrors = 0,
			fpEndCallback,
			aAudioQueue,
			oAudioCollection = {},
			oLogo,
			/**
			 * Compatible audio format for the current browser.
			 */
			sAudioFormat = (function () {

				var oAudio = doc.createElement("audio"),
					sExtension = _NULL_,
					sOgg = oAudio.canPlayType("audio/ogg"),
					sWav = oAudio.canPlayType("audio/wav"),
					sMp3 = oAudio.canPlayType("audio/mp3");

				if (sOgg === "probably" || sOgg === "maybe") {
					sExtension = "ogg";
				} else if (sWav === "probably" || sWav === "maybe") {
					sExtension = "wav";
				} else if (sMp3 === "probably" || sMp3 === "maybe") {
					sExtension = "mp3";
				}

				oAudio = _NULL_;

				return sExtension;

			}()),

			/**
			 * Check loading status / process.
			 * @private
			 * return {number} Loading percent.
			 */
			fpGetProgress = function () {
				return ((nSuccess + nErrors) * 100) / (aImageQueue.length + aAudioQueue.length);
			},
			/**
			 * Check if loading process is done.
			 * @private
			 * @return {boolean} true or false
			 */
			fpIsDone = function () {
				return ((aImageQueue.length + aAudioQueue.length) === (nSuccess + nErrors));
			},
			/**
			 * Draw progress bar on the canvas.
			 * @private
			 */
			fpDrawProgress = function () {

				var nProgress = fpGetProgress(),
					nBarWidth,
					nBarPosY,
					nBarHeight,
					nBarCurrentWidth,
					oCanvas = MMM.canvas.get(),
					oContext = oCanvas.context;

				nBarHeight = 12;

				nBarPosY = (oCanvas.height / 2) - (nBarHeight / 2) - 6;
				nBarWidth = oCanvas.width;
				nBarCurrentWidth = (nBarWidth * nProgress) / 100;

				if (!isNaN(nBarCurrentWidth) && nProgress > 0) {

					oContext.save();

					oContext.fillStyle = "#f3f3f3";
					oContext.fillRect(0, 0, oCanvas.width, oCanvas.height);

					oContext.fillStyle = "#62c5ff";

					oContext.fillRect(0, nBarPosY, nBarCurrentWidth, nBarHeight);
					oContext.font = "13px Verdana";
					oContext.fillStyle = "#00499b";
					oContext.fillText("Loading assets... ( " + (nSuccess + nErrors) + " / " + (aImageQueue.length + aAudioQueue.length) + " )", 10, nBarPosY + 44);

					oContext.drawImage(oLogo, Math.round(oCanvas.width / 2) - 52, Math.round(oCanvas.height / 2) - 38);

					oContext.restore();

				}

			},
			/**
			 * Image & audio load callback.
			 * @private
			 */
			fpLoadCallback = function (eEvent) {

				var oElement = eEvent.target,
					sTagName = oElement.tagName.toLowerCase();

				if (eEvent.type === 'error' || eEvent.type === 'load' || eEvent.type === 'canplaythrough') {

					if (eEvent.type === 'error') {
						nErrors += 1;
					} else {
						nSuccess += 1;
					}

					fpDrawProgress();

					if (sTagName === 'img') {
						oElement.removeEventListener('load', fpLoadCallback, _FALSE_);
						oImageCollection[oElement.id] = oElement;
					} else if (sTagName === 'audio') {
						oElement.removeEventListener('canplaythrough', fpLoadCallback, _FALSE_);
						oAudioCollection[oElement.id] = oElement;
					}

					oElement.removeEventListener('error', fpLoadCallback, _FALSE_);

				}

				if (fpIsDone() === true) {
					aImageQueue = [];
					aAudioQueue = [];
					nSuccess = 0;
					nErrors = 0;

					if (fpIsFunction(fpEndCallback)) {
						fpEndCallback();
					}
				}

			},
			/**
			 * Image loading.
			 * @private
			 */
			fpLoadImages = function () {

				var nLength,
					nCount,
					oImage,
					oElementInfo;

				nLength = aImageQueue.length;

				// Add event listeners to all the images.
				for (nCount = 0; nCount < nLength; nCount += 1) {

					oImage = new win.Image();
					oElementInfo = aImageQueue[nCount];

					oImage.addEventListener("load", fpLoadCallback, _FALSE_);
					oImage.addEventListener("error", fpLoadCallback, _FALSE_);

					oImage.src = oElementInfo.src;
					oImage.id = oElementInfo.id;

				}

			},
			/**
			 * Audio loading.
			 * @private
			 */
			fpLoadAudio = function () {

				var nCount,
					nLength,
					oAudio,
					oElementInfo,
					sExtension,
					sPath;

				nLength = aAudioQueue.length;

				for (nCount = 0; nCount < nLength; nCount += 1) {

					oAudio = doc.createElement('audio');
					oElementInfo = aAudioQueue[nCount];

					sPath = oElementInfo.src.split(".");
					sExtension = sPath.pop();
					sPath = sPath.join(".");
					sExtension = (sExtension === '*') ? sAudioFormat : sExtension;

					oAudio.id = oElementInfo.id;
					oAudio.src = sPath + "." + sExtension;

					oAudio.addEventListener("canplaythrough", fpLoadCallback, _FALSE_);
					oAudio.addEventListener("error", fpLoadCallback, _FALSE_);

				}
			};

		oLogo = doc.createElement("img");
		oLogo.src = 'data:image/png;base64,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';

		return {

			/**
			 * Start resources preloading.
			 * Once finished calls the callback passed as argument.
			 * @public
			 * @param {function} fpOnLoadCallback Called when preloading is finished.
			 */
			load : function (fpOnLoadCallback) {

				fpEndCallback = fpOnLoadCallback;

				aAudioQueue = MMM.bootstrap.get("audio") || [];
				aImageQueue = MMM.bootstrap.get("images") || [];

				if (aImageQueue.length === 0 && aAudioQueue.length === 0) {

					fpEndCallback();

				} else {
					fpLoadImages();
					fpLoadAudio();
				}

			},
			/**
			 * Returns a preloaded image.
			 * @public
			 * @param {string} sType "image" or "audio".
			 * @param {string} sId image/audio identifier.
			 * @return {object} Image/Audio Element.
			 */
			get : function (sType, sId) {

				var oCollection;

				if (typeof sType !== _STRING_ || typeof sId !== _STRING_) {
					MMM.log('Invalid type or ID', {
						method: "Sandbox.assets.get"
					}, true);
				}

				if (sType === 'image') {
					oCollection = oImageCollection;
				} else if (sType === 'audio') {
					oCollection = oAudioCollection;
				} else {
					MMM.log('Invalid type', {
						method: "Sandbox.assets.get"
					}, true);
				}

				return (oCollection[sId] !== _UNDEFINED_) ? oCollection[sId] : _FALSE_;

			}

		};

	}());

	/**
	 * Framework utilities.
	 * @namespace utilities.
	 * @private
	 */
	MMM.utilities = {
		/**
		 * Capitalize string first letter.
		 * @private
		 * @param {string} sString String to capitalize.
		 * @return {string} Capitalized string.
		 */
		capitalize : function (sString) {
			return sString.charAt(0).toUpperCase() + sString.slice(1);
		},
		/**
		 * Generate an Unique ID.
		 * @private
		 * @return {string} sUid Unique ID.
		 */
		generateUID : function () {
			var sUid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
				var r = win.Math.random() * 16 | 0, v = c === 'x' ? r : (r&0x3 | 0x8);
				return v.toString(16);
			});

			return sUid;
		}

	};
	/**
	 * Framework debug utilities.
	 * @namespace debug.
	 * @private
	 */
	MMM.debug = {
		log : (function () {

			var oLastTime = {};

			return function (sMessage, oInfo, nTime) {
				var nCurrentTime = new win.Date().getTime(),
					nLastTime;

				if (oLastTime[sMessage] === _UNDEFINED_) {
					oLastTime[sMessage] = 0;
				}

				if (nCurrentTime - oLastTime[sMessage] > nTime) {
					MMM.log(sMessage, oInfo);
					oLastTime[sMessage] = nCurrentTime;
				}
			}

		}())
	};
	/**
	 * Tools that can be used by the entities & levels.
	 * @type {object}
	 */
	oSandbox = (function () {

		return {
			events : {
				bind : fpProxy(MMM.events.bind, MMM.events),
				trigger : fpProxy(MMM.events.trigger, MMM.events),
				clean : fpProxy(MMM.events.clean, MMM.events)
			},
			assets : {
				get : MMM.assets.get
			},
			debug : {
				active : function () {
					return MMM.bootstrap.get("debug") || false;
				},
				log : MMM.debug.log
			}
		};

	}());

	// Export public API.
	win.MMM = {
		init : function () {
			MMM.game.init.call(MMM);
		},
		create : MMM.create,
		libs : {}
	};

}(window, document));


/**
 * "dom".
 * @private
 * @type {Object}
 */
var oDom = (function (win, doc) {

	'use strict';

	var oEvents,
		oReady;

	/**
	 * Simple DOM elements event manager.
	 * @private
	 */
	oEvents = (function (win, doc) {

		'use strict';
			/**
			 * Stores a boolean with the browser compatibility with addEventListener.
			 * @private
			 * @type {Boolean}
			 */
		var bAddEventListener = ( doc.addEventListener ) ? true : false,
			/**
			 * Stores the name of the method to bind events.
			 * @private
			 * @type {String}
			 */
			sAddEvent = ( bAddEventListener ) ? 'addEventListener' : 'attachEvent',
			/**
			 * Stores the name of the method to remove events.
			 * @private
			 * @type {String}
			 */
			sRemoveEvent = ( bAddEventListener ) ? 'removeEventListener' : 'detachEvent',
			/**
			 * Stores the event prefix.
			 * @private
			 * @type {String}
			 */
			sEventPrefix = ( bAddEventListener ) ? '' : 'on';

		return {
			/**
			 * Binds an event.
			 * @param {String} sType Event type.
			 * @param {Object} oContext Context.
			 * @param {Function} fpHandler Event Handler.
			 */
			bind : function (sType, oContext, fpHandler) {
				oContext[sAddEvent]( sEventPrefix + sType, fpHandler, false );
			},
			/**
			 * Remove an event.
			 * @param {String} sType Event type.
			 * @param {Object} oContext Context.
			 * @param {Function} fpHandler Event Handler.
			 */
			remove : function (sType, oContext, fpHandler){
				oContext[sRemoveEvent]( sEventPrefix + sType, fpHandler, false );
			}
		};

	}(window, document));
	/**
	 * DOM ready handler.
	 * @private
	 * @param {Function} fpHandler Ready handler.
	 */
	oReady = function ( fpHandler )
	{
		'use strict';

		var bIsDone = false,
			bTop = true,
			docElement = doc.documentElement,
			fpDomEvents = oDom.events;
		/**
		 * Checks if the page/DOM is ready.
		 * @param {object} eEvent Event information.
		 */
		function fpReadyHandler (eEvent) {
			var sEventType = eEvent.type;

			if (sEventType === 'readystatechange' && doc.readyState !== 'complete') {
				return;
			}

			if (sEventType === 'load') {
				fpDomEvents.remove(sEventType, win, fpReadyHandler);
			} else {
				fpDomEvents.remove(sEventType, doc, fpReadyHandler);
			}

			if (!bIsDone) {
				bIsDone = true;
				fpHandler.call(win, sEventType || eEvent);
			}
		}
		/**
		 * Retry until DOM is ready.
		 */
		function fpRetry () {
			// IE hack.
			try {
				docElement.doScroll('left');
			} catch ( eError ) {
				win.setTimeout(fpRetry, 50);
				return;
			}

			fpReadyHandler( 'retry' );
		}
		/**
		 * If DOM is ready we don't need to bind the events.
		 */
		if (doc.readyState === 'complete') {
			fpHandler.call(win, 'lazy');
		} else {
			if (doc.createEventObject && docElement.doScroll) {
				try {
					bTop = !win.frameElement;
				} catch ( eError ) {}

				if (bTop) {
					fpRetry();
				}
			}
			// Event binding.
			fpDomEvents.bind('DOMContentLoaded', doc, fpReadyHandler);
			fpDomEvents.bind('readystatechange', doc, fpReadyHandler);
			fpDomEvents.bind('load', win, fpReadyHandler);
		}
	};

	return {
		events: oEvents,
		ready: oReady
	}

}(window, document));

// DOM ready callback.
oDom.ready(MMM.init);