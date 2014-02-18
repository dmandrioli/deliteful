define(["dcl/dcl",
	"dojo/sniff",
	"dojo/on",
	"dojo/Deferred",
	"dojo/dom-geometry",
	"dojo/dom-class",
	"delite/register",
	"delite/Widget",
	"delite/DisplayContainer",
	"deliteful/LinearLayout",
	"delite/themes/load!./MultiColumns/themes/{{theme}}/MultiColumns_css"],
	function (dcl, has, on, Deferred, domGeometry, domClass, register, Widget, DisplayContainer, LinearLayout) {
		return register("d-multi-columns", [HTMLElement, Widget, DisplayContainer], {
			// summary:
			//		MultiColumns responsive container widget.
			//
			// example:

			baseClass: "d-multi-columns",

			preCreate: function () {
				//this.on("DOMNodeInserted", this.invl.bind(this));
			},

			buildRendering: function () {

			},

			postCreate: function() {
				this._ll = new LinearLayout({vertical:false});
				this._ll.startup();
				this._ll.style.width = "100%";
				this._ll.style.height = "100%";

				var child;
				while(this.children.length > 0){
					child = this.children[0];
					this._ll.addChild(child);
					domClass.add(child, "fill");
				}
				this.addChild(this._ll);
			},

			showNext: function (props) {

			},

			showPrevious: function (props) {
			},

			performDisplay: function (widget, event) {
				return new Deferred().promise;
			},

			show: dcl.superCall(function (sup) {
				return function(dest, params) {
					return sup.apply(this, arguments);
				}
			})

		});
	});

