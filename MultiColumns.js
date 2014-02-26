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
	function (dcl, has, on, Deferred, domGeometry, domClass,
			  register, Widget, DisplayContainer, LinearLayout) {
		return register("d-multi-columns", [HTMLElement, Widget, DisplayContainer], {
			// summary:
			//		MultiColumns responsive container widget.
			//
			// example:

			baseClass: "d-multi-columns",

			preCreate: function () {

			},

			buildRendering: function () {
				this._ll = new LinearLayout({vertical: false, style: "width: 100%; height: 100%;"});
				this._hiddenPool = document.createElement("div");
				domClass.add(this._hiddenPool, "-d-multi-columns-hidden");
				this._ll.startup();
			},

			postCreate: function () {
				var child;
				while (this.children.length > 0) {
					child = this.children[0];
					this._ll.addChild(child);
					domClass.add(child, "fill");
				}


				this.addChild(this._hiddenPool);
				this.addChild(this._ll);

			},

			showNext: function (props) {
				console.log(props);
			},

			showPrevious: function (props) {
				console.log(props);
			},

			performDisplay: function (widget, event) {
				console.log(widget, event);
				return new Deferred().promise;
			},

			show: dcl.superCall(function (sup) {
				return function (dest, params) {
					console.log(dest, params);
					var children = this._ll.children;
					if (!this._leftChild && children.length > 0) {
						this._leftChild = children[0];
					}
					if (!this._leftChild) {
						// This container has no children.
						return;
					}
					var fromIndex, targetIndex, displayStyle, colCount, colCountFound;
					for (var i = 0; i < children.length; i++) {
						displayStyle = window.getComputedStyle(children[i]).getPropertyValue("display");
						if (isNaN(fromIndex) && displayStyle !== "none") {
							fromIndex = i;
							colCount = 1;
						}
						else {
							if (displayStyle !== "none") {
								colCount++;
							}
							else {
								colCountFound = true;
							}
						}
						if (isNaN(targetIndex) && children[i] === dest) {
							targetIndex = i;
						}
						if (colCountFound && !isNaN(fromIndex) && !isNaN(targetIndex)) {
							break;
						}
					}
					targetIndex = Math.min(targetIndex, children.length - colCount);
					var toAdd = targetIndex - fromIndex;
					var scaleFactor = 100 * (colCount + toAdd) / colCount + "%";
					var transFactor = -100 * toAdd / (colCount + toAdd) + "%";
					this._ll.style.width = scaleFactor;

					for (i = 0; i < Math.min(children.length, colCount + toAdd); i++) {
						domClass.add(children[i], "-d-multi-columns-force-display");
					}
					domClass.add(this._ll, "-d-multi-columns-animate");

					// Must be called in performDisplay with event and deferred arguments
					this._setAfterTransitionHandlers(children[targetIndex], null, null);
					this.defer(function () {
						this._ll.style["-webkit-transform"] = "translate3d(V, 0px, 0px)".replace("V", transFactor);
						this._ll.style.transform = "translate3d(V, 0px, 0px)".replace("V", transFactor);
					}, 100);
					// DisplayContainer is not compatible for now
					//return sup.apply(this, arguments);
				};
			}),

			_setAfterTransitionHandlers: function (node, event, deferred) {
				var self = this, endProps = {
					node: node,
					handle: function () { self._afterTransitionHandle(endProps); },
					props: event,
					deferred: deferred
				};
				self._ll.addEventListener("webkitTransitionEnd", endProps.handle);
				self._ll.addEventListener("transitionend", endProps.handle); // IE10 + FF
			},

			_afterTransitionHandle: function (endProps) {
				this._ll.removeEventListener("webkitTransitionEnd", endProps.handle);
				this._ll.removeEventListener("transitionend", endProps.handle); // IE10 + FF
				this._ll.style.width = "100%";
				this._ll.style["-webkit-transform"] = "";
				this._ll.style.transform = "";
				domClass.remove(this._ll, "-d-multi-columns-animate");

				for (var i = 0; i < this._ll.children.length; i++) {
					domClass.remove(this._ll.children[i], "-d-multi-columns-force-display");
				}

				while (this._ll.children[0] !== endProps.node) {
					this._hiddenPool.appendChild(this._ll.children[0]);
				}
			}
		});
	});

