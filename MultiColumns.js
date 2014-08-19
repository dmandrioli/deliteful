define(["dcl/dcl",
	"decor/sniff",
	"dojo/on",
	"dojo/Deferred",
	"dojo/dom-geometry",
	"dojo/dom-class",
	"dojo/dom-construct",
	"delite/register",
	"delite/Widget",
	"delite/DisplayContainer",
	"deliteful/LinearLayout",
	"delite/theme!./MultiColumns/themes/{{theme}}/MultiColumns.css"],
	function (dcl, has, on, Deferred, domGeometry, domClass, domConstruct,
			  register, Widget, DisplayContainer, LinearLayout) {
		return register("d-multi-columns", [HTMLElement, Widget, DisplayContainer], {
			// summary:
			//		MultiColumns responsive container widget.
			//
			// example:

			baseClass: "d-multi-columns",

			buildRendering: function () {
				this._ll = new LinearLayout({vertical: false, style: "position: absolute; width: 100%; height: 100%;"});
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
				this.containerNode = this._ll;
			},

			showNext: function (props) {
				var cdn = this._ll.children;
				if (cdn.length === 0) {
					return null;
				}
				return this.show(cdn.length >= 2 ? cdn[1] : cdn[0], props);
			},

			showPrevious: function (props) {
				var leftChildren = this._hiddenPool.children;
				if (leftChildren.length === 0) {
					return null;
				}
				return this.show(leftChildren[leftChildren.length - 1], props);
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
				// Dynamic CSS, can't be set in a stylesheet
				this._ll.style["-webkit-transform"] = "translate3d(V, 0px, 0px)".replace("V", v);
				this._ll.style.transform = "translate3d(V, 0px, 0px)".replace("V", v);
			},
			show: dcl.superCall(function (sup) {
				return function (dest, params) {
					var cdn = this.getChildren();
					if (cdn.length === 0) {
						// This container has no children.
						return;
					}

					return sup.apply(this, [dest, params]);
				};
			}),

			changeDisplay: function (widget, event) {

				// Resolved when display is completed.
				var deferred = new Deferred();
				// Count visible columns (depends on widget media queries)
				var i, children = this._ll.children, translation, colsToAdd = 0, colCount = 0;
				for (i = 0; i < children.length; i++) {
					if (window.getComputedStyle(children[i]).getPropertyValue("display") !== "none") {
						colCount++;
					}
					else {
						break;
					}
				}

				if (widget.parentNode === this._ll) {
					// Slide to the right
					for (i = 0; i < children.length; i++) {
						if (colsToAdd === 0 && children[i] === widget) {
							colsToAdd = i;
							break;
						}
					}
					colsToAdd = Math.min(colsToAdd, children.length - colCount);
					translation = this._prepareAnimation(children, colCount, colsToAdd);
					domClass.add(this._ll, "-d-multi-columns-animate");


					this._setAfterTransitionHandlers(children[colsToAdd], event, deferred);
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
						if (c === widget) {
							break;
						}
					}

					translation = this._prepareAnimation(children, colCount, colsToAdd);
					this._translate(translation);

					this._setAfterTransitionHandlers(widget, null, null);
					this.defer(function () {
						domClass.add(this._ll, "-d-multi-columns-animate");
						this._translate("0px");
					}, 100);
				}

				return deferred.promise;
			},

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
			},

			getChildren: function () {
				// use Array.prototype.slice to transform the live HTMLCollection into an Array
				var toArray = Array.prototype.slice;
				return toArray.call(this._hiddenPool.children).concat(toArray.call(this._ll.children));
			},

			getVisibleChildren: function () {
				var res = [];
				var children = this._ll.children;
				for (var i = 0; i < children.length; i++) {
					if (window.getComputedStyle(children[i]).getPropertyValue("display") !== "none") {
						res.push(children[i]);
					}
					else {
						break;
					}
				}
				return res;
			}
		});
	});

