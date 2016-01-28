/* Where the magic happens */
"use strict";
var _temporalUndefined = {};

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var Item = _temporalUndefined;

function _temporalAssertDefined(val, name, undef) { if (val === undef) { throw new ReferenceError(name + " is not defined - temporal dead zone"); } return true; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _typeof(obj) { return obj && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

$(document).ready(load);
function load() {
	$("#btn-run").click(run);
	$("#stop").click(function () {
		detour.stop();
	});
	$("#interval").change(function () {
		detour.interval = this.value;
		$("#show-interval").text(this.value);
	});
	setInterval(function () {
		$("#bytes").text(" - " + $("#source").val().length + " bytes");
	});
	$("#permalink").click(function () {
		window.open(applyquery({ hex: btoa($("#source").val()) }, 'https://rawgit.com/cyoce/detour/master/interp.html'));
	});
	$("#markdown").click(function () {
		var source = $("#source").val();
		var out = "# [Detour](https://rawgit.com/cyoce/detour/master/interp.html), ";
		out += source.length + " bytes\n";
		out += ("\n" + source).replace(/\n/g, "\n    ");
		out += "\n\n[Try it online!](" + applyquery({ hex: btoa($('#source').val()) }, 'https://rawgit.com/cyoce/detour/master/interp.html') + ")";
		$("#source").val(out).select();
		document.execCommand("copy");
		$("#source").val(source);
	});
	$("#turbo").change(function () {
		detour.turbo = this.checked;
	});
	var query = parse_query(location.href);
	if (query) {
		if (query.hex) {
			$("#source").val(atob(query.hex));
		} else {
			$("#source").val(query.code);
		}
	}
	if (query === null) query = {};
	function applyquery(query, href) {
		href = href || location.href;
		href = href.split("?")[0];
		return href + gen_query(query);
	}
	function parse_query(href) {
		href = String(href).split("?");
		if (href.length <= 1) return null;
		href = href[1];
		var out = {};
		var keys = href.split("&");
		for (var i = 0; i < keys.length; i++) {
			var pair = keys[i].split('=');
			out[unescape(pair[0])] = unescape(pair[1]);
		}
		return out;
	}
	function gen_query(obj) {
		if (obj === null || obj === Object.create(null)) return '';
		var out = '?';
		for (var key in obj) {
			if (!obj.hasOwnProperty(key)) continue;
			if (out.length !== 1) out += "&";
			out += escape(key) + "=" + escape(obj[key]);
		}
		return out;
	}
	function base64(value) {
		var digits = "0123456789abcdeghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-+";
		if (typeof value === "string") {
			return digits.indexOf(value[1]) + 64 * digits.indexOf(value[0]);
		} else {
			return digits[Math.floor(value / 64)] + digits[value % 64];
		}
	}
	function hexdump(string) {
		return [].concat(_toConsumableArray(string)).map(function (x) {
			return x.charCodeAt().toString(16);
		}).map(function (x) {
			return "0".repeat(2 - x.length) + x;
		}).join('');
	}
	function hexcompress(string) {
		var hex = hexdump(string);
		hex = "0".repeat(3 - hex.length % 3) + hex;
		var matches = hex.match(/.../g);
		if (matches[0] === "000") matches.splice(0, 1);
		var out = [];
		for (var i = 0; i < matches.length; i++) {
			var match = matches[i];
			var int = parseInt(match, 16);
			var num = base64(int);
			out.push(num);
		}
		return out.join('');
	}
	function hexdecompress(string) {
		string = "0".repeat(string.length % 2) + string;
		var matches = string.match(/../g),
		    out = '';
		for (var i = 0; i < matches.length; i++) {
			var num = base64(matches[i]).toString(16);
			out += num;
		}
		return unescape(out.replace(/../g, "%$&"));
	}
}
var preprocess = function preprocess(x) {
	return x;
};
// $("#btn-run")
function run() {
	var _last$input_y$input_x;

	var source = $("#source").val().replace(/\s*#.*$/gm, ""),
	    lines = source.split("\n"),
	    input_y,
	    input_x;
	if (lines.slice(-1)[0] === '') lines.splice(-1);
	for (var i = 0; i < lines.length; i++) {
		var line = lines[i];
		var idx = line.indexOf(":");
		if (!input_y && ~idx) input_y = i, input_x = idx;
	}
	if (input_y === undefined) {
		var idx = Math.floor(lines.length / 2);
		if (idx % 2) idx--;
		//	console.log(idx, lines.length-idx);
		for (var i = 0; i < lines.length; i++) {
			lines[i] = (i === idx ? ":" : " ") + lines[i];
		}
		input_y = idx;
		input_x = 0;
	}
	var lastln = last(lines, -1);
	if (lastln[1] === "@") {
		last(lines, -1, lastln[0]);
		var ln = lastln.slice(2);
		detour.vars = ln.split("@");
	}
	(_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item).prototype.x = input_x;
	(_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item).prototype.y = input_y;
	var max_length = lines.reduce(function (x, y) {
		return x.length > y.length ? x : y;
	}).length;
	for (var i = 0; i < lines.length; i++) {
		var line = lines[i];

		if (line.length < max_length) {
			lines[i] += ' '.repeat(max_length - line.length);
		}
	}
	$("#stdout").html(detour.table(lines));
	detour.chargrid = lines.map(function (x) {
		return x.split('');
	});
	detour.funcgrid = detour.chargrid.map(function (x) {
		return x.map(function (y) {
			return y === "`" ? (function (s) {
				return function (x) {
					var val = eval(s);
					if (typeof val === "string") {
						val = val.split('').reverse().join('');
						for (var i = val.length; i--;) {
							var o = new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(x);
							o.value = val.charCodeAt(i);
							o.move();
						}
					} else {
						var o = new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(x);
						o.value = val;
						o.move();
					}
				};
			})(detour.vars.shift()) : detour.fdict[y] || detour.fdict[' '];
		});
	});
	detour.width = detour.chargrid[0].length;
	detour.height = detour.chargrid.length;
	detour.itemgrid = [detour.newgrid(Array)];
	(_last$input_y$input_x = last(detour.itemgrid)[input_y][input_x]).push.apply(_last$input_y$input_x, _toConsumableArray($("#stdin").val().split(" ").map(Number).map(function (x) {
		return new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(x);
	})));
	$("#stop").attr("disabled", false);
	$(".editor").css("display", "none");
	$(".runtime").css("display", "block");
	$("#output").html("");
	$("#stdout").html("");
	$("#stdout").css("height", "90%");
	detour.start = new Date();
	detour.ticks = 0;
	detour.outlist = [];
	detour.outel = $("#output");
	if (detour.turbo) {
		detour.go = true;
		while (detour.go) {
			detour.update();
		}
		$("#output").text(detour.outlist.join("\n"));
	} else {
		detour.__timeout__ = setInterval(detour.update, detour.interval);
	}
}
function genmatrix(chars) {}

Item = (function () {
	function Item(val, x, y) {
		_classCallCheck(this, _temporalAssertDefined(Item, "Item", _temporalUndefined) && Item);

		var len = arguments.length;
		if (len <= 1) {
			x = 0;
			y = 0;
		} else {
			this.x = x;
			this.y = y;
		}
		if (len) {
			if ((typeof val === "undefined" ? "undefined" : _typeof(val)) === "object") {
				for (var i in val) {
					this[i] = val[i];
				}
			} else {
				this.value = val;
			}
		}
	}

	_createClass(_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item, [{
		key: "move",
		value: function move(x) {
			if (~x) do {
				this._move();
			} while (x--);
			last(detour.itemgrid)[this.y][this.x].unshift(this);
		}
	}, {
		key: "_move",
		value: function _move() {
			this.x = detour.opdict.m(this.x + this.vx, detour.width);
			this.y = detour.opdict.m(this.y + this.vy, detour.height);
		}
	}, {
		key: "comp",
		value: function comp(chars) {
			var i = 1,
			    o = new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(this);
			o.vals = [];
			while (i) {
				o._move();
				var char = detour.chargrid[o.y][o.x];
				if (char === chars[0]) {
					i++;
				} else if (char === chars[1]) {
					i--;
				} else {
					var _o$vals;

					(_o$vals = o.vals).push.apply(_o$vals, _toConsumableArray(last(detour.itemgrid)[o.y][o.x].concat(last(detour.itemgrid, -2)) || []));
				}
			}
			return o;
		}
	}, {
		key: "concat",
		value: function concat(other) {
			var o = {};
			for (var i in other) {
				if (other.hasOwnProperty(i)) o[i] = other[i];
			}
			for (var i in this) {
				if (this.hasOwnProperty(i)) o[i] = this[i];
			}
			o.other = this.other.concat(other.other);
			return new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(o);
		}
	}, {
		key: "toString",
		value: function toString() {
			return String(this.value) + ">V<^"[this.dir];
		}
	}, {
		key: "valueOf",
		value: function valueOf() {
			return this.value;
		}
	}, {
		key: "dir",
		set: function set(val) {
			val = detour.opdict.m(val, 4);
			var xy = [- ~val % 2, val % 2].map(function (n) {
				return n * Math.sign((Math.abs(val - 1.5) | 0) * 2 - 1);
			});
			this.vx = xy[0];
			this.vy = xy[1];
		},
		get: function get() {
			if (this.vx === 0) {
				if (this.vy === 1) {
					// [0, +1]
					return 3;
				} else {
					// [0, -1]
					return 1;
				}
			} else {
				if (this.vx === 1) {
					// [+1, 0]
					return 0;
				} else {
					// [-1, 0]
					return 2;
				}
			}
		}
	}]);

	return _temporalAssertDefined(Item, "Item", _temporalUndefined) && Item;
})();

(_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item).prototype.vx = 1;
(_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item).prototype.vy = 0;
(_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item).prototype.moving = true;
(_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item).prototype.other = [];

function setup() {
	for (var i in detour.opdict) {
		var func = detour.opdict[i];
		if (func.length === 1) detour.fdict[i] = (function (f) {
			return function (x) {
				var o = Object.create(x);
				o.value = f(o.value);
				o = new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(o);
				o.move();
			};
		})(func);else detour.fdict[i] = (function (f) {
			return function (x, y) {
				// console.log(x,y);
				x = x || new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)();
				var o = x.concat(y);
				o.value = f(x.value, y.value);
				o.move();
			};
		})(func);
	}
	for (var i in detour.reducers) {
		detour.fdict[i] = detour.reducers[i];
		detour.reducelist.push(detour.reducers[i]);
	}
}

function ret(value) {
	return function () {
		return value;
	};
}
function last(object, index, newval) {
	var idx;
	if (arguments.length < 2) {
		index = -1;
	}
	idx = detour.opdict.m(index, object.length);
	if (arguments.length < 3) {
		return object[idx];
	} else {
		return object[idx] = newval;
	}
}

var detour = {
	newgrid: function newgrid(item) {
		item = item || ret();
		var out = Array(detour.height);
		for (var y = 0; y < out.length; y++) {
			out[y] = Array(detour.width);
			for (var x = 0; x < out[y].length; x++) {
				out[y][x] = item();
			}
		}
		return out;
	},
	update: function update() {
		detour.ticks++;
		if (!detour.turbo) {
			$("#ticks").text(String(detour.ticks) + " tick" + (detour.ticks === 1 ? "" : "s"));
			$("#time").text(String(new Date() - detour.start));
		}
		detour.itemgrid.push(detour.newgrid(Array));
		var table = detour.newgrid(),
		    moving = false,
		    items = detour.itemgrid.slice(-2)[0],
		    reducers = [];
		for (detour.y = 0; detour.y < detour.height; detour.y++) {
			for (detour.x = 0; detour.x < detour.width; detour.x++) {
				var args = items[detour.y][detour.x],
				    func = detour.funcgrid[detour.y][detour.x];
				while (args.length >= func.length && func.length) detour.run(func, args), moving = true;
				if (~detour.reducelist.indexOf(func) && args.length) reducers.push([detour.x, detour.y, window.__args = args, func]);
			}
		}
		var go = detour.fast || confirm("moving");
		if (moving) {} else if (reducers.length) {
			var reducer = reducers[0],
			    x = reducer[0],
			    y = reducer[1],
			    args = reducer[2],
			    func = reducer[3];
			detour.run(func, args, true);
		} else {
			go = false;
		}
		if (!go) detour.stop();
		for (var y = 0; y < detour.height; y++) {
			for (var x = 0; x < detour.width; x++) {
				var cell = last(detour.itemgrid)[y][x];
				cell.splice.apply(cell, [0, 0].concat(_toConsumableArray(last(detour.itemgrid, -2)[y][x])));
				if (detour.debug) table[y][x] = detour.chargrid[y][x] + "<br> " + cell.join(' ');
			}
		}
		if (detour.debug) $("#stdout").html(detour.table(table));
	},
	interval: 350,
	fast: true,
	run: function run(func, args) {
		func.apply(undefined, _toConsumableArray(args.splice(-func.length)));
	},
	stop: function stop() {
		$("#stop").attr("disabled", true);
		$(".editor").css("display", "block");
		$("#stdout").css("height", "40px");
		$(".runtime").css("display", "none");
		console.log(detour.ticks, new Date() - detour.start);
		clearInterval(detour.__timeout__);
		detour.go = false;
	},
	table: function table(grid) {
		var out = "<table class='full' class='vert'><tr>";
		for (var i = 0; i < grid.length; i++) {
			out += "\t<tr height='" + String(100 / grid.length) + "%'>\n";
			var array = grid[i];
			for (var j = 0; j < array.length; j++) {
				out += "\t\t<td width='" + String(100 / array.length) + "%'>";
				out += array[j];
				out += "</td>\n";
			}
			out += "\t</tr>\n";
		}
		out += "</table>";
		return out;
	},
	print: function print(x) {
		detour.outlist.push(x);
		if (!detour.turbo) {
			detour.outel.text(detour.outlist.join("\n"));
			detour.outel[0].scrollTop = detour.outel[0].scrollHeight;
		}
	},
	debug: true,
	chargrid: [],
	funcgrid: [],
	itemgrid: [],
	opdict: {
		",": function _(x) {
			return detour.print(x), x;
		},
		":": function _(x) {
			return x;
		},
		" ": function _(x) {
			return x;
		},
		"<": function _(x) {
			return x - 1;
		},
		">": function _(x) {
			return x + 1;
		},
		"!": function _(x) {
			return -x;
		},
		"n": function n(x) {
			return !x;
		},
		"N": function N(x) {
			return ~x;
		},
		"V": function V(x) {
			return Math.sqrt(x);
		},
		"-": function _(x, y) {
			return x - y;
		},
		"+": function _(x, y) {
			return x + y;
		},
		"*": function _(x, y) {
			return x * y;
		},
		"_": function _(x, y) {
			return x / y;
		},
		"m": function m(x, y) {
			return (x % y + y) % y;
		}, // fixed modulo
		"e": function e(x, y) {
			return Math.pow(x, y);
		},
		"o": function o(x, y) {
			return Math.max(x, y);
		},
		"O": function O(x, y) {
			return x | y;
		},
		"Z": function Z(x, y) {
			return x ^ y;
		},
		"a": function a(x, y) {
			return Math.min(x, y);
		},
		"&": function _(x, y) {
			return x & y;
		},
		"0": function _(x) {
			return 0;
		},
		"1": function _(x) {
			return 1;
		},
		"2": function _(x) {
			return 2;
		},
		"3": function _(x) {
			return 3;
		},
		"4": function _(x) {
			return 4;
		},
		"5": function _(x) {
			return 5;
		},
		"6": function _(x) {
			return 6;
		},
		"7": function _(x) {
			return 7;
		},
		"8": function _(x) {
			return 8;
		},
		"9": function _(x) {
			return 9;
		}
	},
	fdict: {
		".": function _(x) {
			detour.stop();
			detour.print(x.value);
		},
		"x": function x(_x) {// remove

		},
		"\\": function _(x) {
			// mirror
			var o = new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(x),
			    temp = o.vx;
			o.vx = o.vy;
			o.vy = temp;
			o.move();
		},
		"/": function _(x) {
			// mirror
			var o = new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(x),
			    temp = o.vx;
			o.vx = -o.vy;
			o.vy = -temp;
			o.move();
		},
		"?": function _(x) {
			// condition
			var o = new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(x);
			if (x > 0) {
				o.move(1);
			} else {
				o.move();
			}
		},
		"T": function T(x) {
			// split
			var o = new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(x);
			if (o.value > 0) o.dir++;
			o.move();
		},
		"Q": function Q(x) {
			// split
			var o = new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(x);
			if (o.value > 0) {
				o.dir++;
				o._move();
				o.dir--;
				o.move(-1);
			} else {
				o.move();
			}
		},
		"$": function $(x) {
			// dupe
			var o = new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(x),
			    p = new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(x);
			o.move(1);
			p.move();
		},
		";": function _(x) {
			// recurse
			var o = new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(x);
			o.x = (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item).prototype.x;
			o.y = (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item).prototype.y;
			o.move(-1);
			o.dir = 0;
		},
		"~": function _(x) {
			// filter
			if (x > 0) {
				new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(x).move();
			}
		},
		"p": function p(x) {
			var o = new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(x);
			o.dir = 0;
			o.move();
		},
		"q": function q(x) {
			var o = new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(x);
			o.dir = 2;
			o.move();
		},
		"v": function v(x) {
			var o = new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(x);
			o.dir = 3;
			o.move();
		},
		"^": function _(x) {
			var o = new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(x);
			o.dir = 1;
			o.move();
		},
		"{": function _(x) {
			// dupe
			var o = x.comp("{}"),
			    p = new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(x);
			o.move();
			p.move();
		},
		"(": function _(x) {
			// skip
			var o = x.comp("()");
			o.move();
		},
		"]": function _(x) {
			var o = new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(x),
			    p = x.comp("][");
			if (x > 0) {
				p.move();
			} else {
				o.move();
			}
		},
		"[": function _(x) {
			var o;
			if (x <= 0) {
				o = x.comp("[]");
			} else {
				o = new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(x);
			}
			o.move();
		},
		"r": function r(x, y) {
			// range
			var o = new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(x);
			x = x.value;
			y = y.value;
			var swap,
			    out = [];
			if (x > y) {
				var t = x;
				x = y;
				y = t;
				swap = true;
			}
			while (x <= y) out.push(x++);
			if (!swap) out.reverse();
			for (var i = 0; i < out.length; i++) {
				var obj = new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(o);
				obj.value = out[i];
				obj.move();
			}
		},
		"R": function R(x) {
			// range
			var o = new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(x),
			    y;
			y = x.value;
			x = 1;
			var swap,
			    out = [];
			if (x > y) {
				var t = x;
				x = y;
				y = t;
				swap = true;
			}
			while (x <= y) out.push(x++);
			if (!swap) out.reverse();
			for (var i = 0; i < out.length; i++) {
				var obj = new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(o);
				obj.value = out[i];
				obj.move();
			}
		},
		"s": function s(x, y) {
			// swap
			var o = new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(x),
			    p = new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(y);
			o.move();
			p.move();
		}
	},
	reducers: {
		"L": function L() {
			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			// reduce left
			if (args.length === 1) return new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(args[0]).move(1);
			var o = new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(args[0]),
			    x;
			o._move();
			var p = new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(args[0]);
			// if (args.length%2) args.push((new Item(0)).concat(p))
			var func = detour.opdict[detour.chargrid[o.y][o.x]];
			if (args.length % 2) x = args.pop();
			p.value = args.reduce(func);
			if (typeof x !== "undefined") {
				p.value = [p, x].reduce(func);
			}
			p.move(1);
		},
		"S": function S(x, y) {
			// sum
			var o = new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(x);
			if (arguments.length > 1) {
				o.value += y.value;
				o.move(-1);
			} else {
				o.move();
			}
		},
		"P": function P(x, y) {
			// product
			var o = new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(x);
			if (arguments.length > 1) {
				o.value *= y.value;
				o.move(-1);
			} else {
				o.move();
			}
		},
		"F": function F(x, y) {
			// reduce
			var o = new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(x),
			    p = new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(x);
			if (arguments.length > 1) {
				o._move();
				p.value = detour.opdict[detour.chargrid[o.y][o.x]](x.value, y.value);
				p.move(-1);
			} else {
				o.move(1);
			}
		},
		"u": function u() {
			for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				args[_key2] = arguments[_key2];
			}

			// string
			detour.print(args.reverse().map(function (x) {
				return x.value;
			}).map(function (x) {
				return String.fromCharCode(x);
			}).join(''));
		}
	},
	reducelist: []
};
setup();
