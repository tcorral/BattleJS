(function (win, doc, MMM) {

	'use strict';

	MMM.create("bootstrap").set({

		canvas : {

			width : 800,
			height : 800,

			rescale : false

		},

		debug : true,

		images : [

			{ id : "bot", src : "app/img/bot.png" },
			{ id : "cannon", src : "app/img/cannon.png" },
		],

		audio : [],

		initialLevel : "arena"


	});

}(window, document, MMM));
