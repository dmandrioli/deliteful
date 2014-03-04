define(["dcl/dcl",
	"dojo/sniff",
	"dojo/on",
	"dojo/Deferred",
	"dojo/dom-geometry",
	"dojo/dom-class",
	"dojo/dom-construct",
	"delite/register",
	"delite/Widget",
	"delite/DisplayContainer",
	"deliteful/LinearLayout",
	"delite/themes/load!./MultiColumns/themes/{{theme}}/MultiColumns_css"],
	function (dcl, has, on, Deferred, domGeometry, domClass, domConstruct,
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
					domClass.add(child, "-d-multi-columns-mq");
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

			_prepareAnimation: function (children, colCount, toAdd) {
				for (var i = colCount; i < colCount + toAdd; i++) {
					domClass.remove(children[i], "-d-multi-columns-mq");
				}
				var scaledWidth = 100 * (colCount + toAdd) / colCount + "%";
				this._ll.style.width = scaledWidth;
				// Return the translation value
				return -100 * toAdd / (colCount + toAdd) + "%";
			},
			_translate: function (v) {
				this._ll.style["-webkit-transform"] = "translate3d(V, 0px, 0px)".replace("V", v);
				this._ll.style.transform = "translate3d(V, 0px, 0px)".replace("V", v);
			},
			show: dcl.superCall(function () {
				return function (dest /*, params (unused)*/) {
					var i, children = this._ll.children, translation, colsToAdd = 0, colCount = 0;
					if (!this._leftChild && children.length > 0) {
						this._leftChild = children[0];
					}
					if (!this._leftChild) {
						// This container has no children.
						return;
					}

					// Count visible columns
					for (i = 0; i < children.length; i++) {
						if (window.getComputedStyle(children[i]).getPropertyValue("display") !== "none") {
							colCount++;
						}
						else {
							break;
						}
					}

					if (dest.parentNode === this._ll) {
						// Slide to the right
						for (i = 0; i < children.length; i++) {
							if (colsToAdd === 0 && children[i] === dest) {
								colsToAdd = i;
								break;
							}
						}
						colsToAdd = Math.min(colsToAdd, children.length - colCount);
						translation = this._prepareAnimation(children, colCount, colsToAdd);
						domClass.add(this._ll, "-d-multi-columns-animate");

						// Must be called in performDisplay with event and deferred arguments
						this._setAfterTransitionHandlers(children[colsToAdd], null, null);
						this.defer(function () {
							this._translate(translation);
						}, 100);
					} else {
						// Slide to the left
						var c;
						for (i = this._hiddenPool.children.length - 1; i >= 0; i--) {
							colsToAdd++;
							c = this._hiddenPool.children[i];
							domConstruct.place(c, this._ll, "first");
							if (c === dest) {
								break;
							}
						}

						translation = this._prepareAnimation(children, colCount, colsToAdd);
						this._translate(translation);

						this._setAfterTransitionHandlers(dest, null, null);
						this.defer(function () {
							domClass.add(this._ll, "-d-multi-columns-animate");
							this._translate("0px");
						}, 100);
					}
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
					domClass.add(this._ll.children[i], "-d-multi-columns-mq");
				}
				// Remove left siblings of the visible node
				while (this._ll.children[0] !== endProps.node) {
					this._hiddenPool.appendChild(this._ll.children[0]);
				}
			}
		});
	});

