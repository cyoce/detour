/* Where the magic happens */
"use strict";
var _temporalUndefined = {};

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var Item = _temporalUndefined;

var detour = _temporalUndefined;

function _temporalAssertDefined(val, name, undef) { if (val === undef) { throw new ReferenceError(name + " is not defined - temporal dead zone"); } return true; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _typeof(obj) { return obj && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

$(document).ready(load);
function load() {
	$("#btn-run").click(run);
	$("#stop").click(function () {
		(_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).stop = true;
	});
	$("#interval").change(function () {
		(_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).interval = this.value;
		$("#show-interval").text(this.value);
	});
	setInterval(function () {
		$("#bytes").text(" - " + $("#source").val().length + " bytes");
	});
	$("#permalink").click(function () {
		window.open(applyquery({ code: $("#source").val() }, 'http://rawgit.com/cyoce/detour/master/interp.html'));
	});
	$("#markdown").click(function () {
		var source = $("#source").val();
		var out = "# [Detour](http://rawgit.com/cyoce/detour/master/interp.html), ";
		out += source.length + " bytes\n";
		out += ("\n" + source).replace(/\n/g, "\n    ");
		out += "\n\n[Try it online!](" + applyquery({ code: $('#source').val() }, 'http://rawgit.com/cyoce/detour/master/interp.html') + ")";
		$("#source").val(out).select();
		document.execCommand("copy");
		$("#source").val(source);
	});
	var query = parse_query(location.href);
	if (query && query.code) {
		$("#source").val(query.code);
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
}
var preprocess = function preprocess(x) {
	return x;
};
// $("#btn-run")
function run() {
	var _last$input_y$input_x;

	var source = $("#source").val(),
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
	$("#stdout").html((_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).table(lines));
	(_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).chargrid = lines.map(function (x) {
		return x.split('');
	});
	(_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).funcgrid = (_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).chargrid.map(function (x) {
		return x.map(function (y) {
			return (_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).fdict[y] || (_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).fdict[' '];
		});
	});
	(_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).width = (_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).chargrid[0].length;
	(_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).height = (_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).chargrid.length;
	(_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).itemgrid = [(_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).newgrid(Array)];
	(_last$input_y$input_x = last((_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).itemgrid)[input_y][input_x]).push.apply(_last$input_y$input_x, _toConsumableArray($("#stdin").val().split(" ").map(Number).map(function (x) {
		return new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(x);
	})));
	(_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).stop = false;
	$("#stop").attr("disabled", false);
	$("#editor").css("display", "none");
	$("#stdout").css("height", "90%");
	(_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).update();
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
			last((_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).itemgrid)[this.y][this.x].push(this);
		}
	}, {
		key: "_move",
		value: function _move() {
			this.x = (_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).opdict.m(this.x + this.vx, (_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).width);
			this.y = (_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).opdict.m(this.y + this.vy, (_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).height);
		}
	}, {
		key: "comp",
		value: function comp(chars) {
			var i = 1,
			    o = new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(this);
			o.vals = [];
			while (i) {
				o._move();
				var char = (_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).chargrid[o.y][o.x];
				if (char === chars[0]) {
					i++;
				} else if (char === chars[1]) {
					i--;
				} else {
					var _o$vals;

					(_o$vals = o.vals).push.apply(_o$vals, _toConsumableArray(last((_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).itemgrid)[o.y][o.x].concat(last((_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).itemgrid, -2)) || []));
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
			return String(this.value);
		}
	}, {
		key: "valueOf",
		value: function valueOf() {
			return this.value;
		}
	}, {
		key: "dir",
		set: function set(val) {
			val = (_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).opdict.m(val, 4);
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
	for (var i in (_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).opdict) {
		var func = (_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).opdict[i];
		if (func.length === 1) (_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).fdict[i] = (function (f) {
			return function (x) {
				var o = Object.create(x);
				o.value = f(o.value);
				o = new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(o);
				o.move();
			};
		})(func);else (_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).fdict[i] = (function (f) {
			return function (x, y) {
				// console.log(x,y);
				x = x || new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)();
				var o = x.concat(y);
				o.value = f(x.value, y.value);
				o.move();
			};
		})(func);
	}
	for (var i in (_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).reducers) {
		(_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).fdict[i] = (_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).reducers[i];
		(_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).reducelist.push((_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).reducers[i]);
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
	idx = (_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).opdict.m(index, object.length);
	if (arguments.length < 3) {
		return object[idx];
	} else {
		return object[idx] = newval;
	}
}detour = {
	newgrid: function newgrid(item) {
		item = item || ret();
		var out = Array((_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).height);
		for (var y = 0; y < out.length; y++) {
			out[y] = Array((_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).width);
			for (var x = 0; x < out[y].length; x++) {
				out[y][x] = item();
			}
		}
		return out;
	},
	update: function update() {
		if ((_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).stop) {
			$("#stop").attr("disabled", true);
			$("#editor").css("display", "block");
			$("#stdout").css("height", "40px");
			return;
		}
		(_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).itemgrid.push((_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).newgrid(Array));
		var table = (_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).newgrid(),
		    moving = false,
		    items = (_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).itemgrid.slice(-2)[0],
		    reducers = [];
		for ((_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).y = 0; (_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).y < (_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).height; (_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).y++) {
			for ((_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).x = 0; (_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).x < (_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).width; (_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).x++) {
				var args = items[(_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).y][(_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).x],
				    func = (_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).funcgrid[(_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).y][(_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).x];
				if (args.length >= func.length && func.length) (_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).run(func, args), moving = true;
				if (~(_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).reducelist.indexOf(func) && args.length) reducers.push([(_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).x, (_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).y, window.__args = args, func]);
			}
		}
		var go = (_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).fast || confirm("moving");
		if (moving) {} else if (reducers.length) {
			var reducer = reducers[0],
			    x = reducer[0],
			    y = reducer[1],
			    args = reducer[2],
			    func = reducer[3];
			(_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).run(func, args);
		} else {
			go = false;
		}
		if (go) (_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).timeout = setTimeout((_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).update, (_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).interval);
		for (var y = 0; y < (_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).height; y++) {
			for (var x = 0; x < (_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).width; x++) {
				var cell = last((_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).itemgrid)[y][x];
				cell.splice.apply(cell, [0, 0].concat(_toConsumableArray(last((_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).itemgrid, -2)[y][x])));
				if ((_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).debug) table[y][x] = (_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).chargrid[y][x] + "<br> " + cell.join(', ');
			}
		}
		if ((_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).debug) $("#stdout").html((_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).table(table));
	},
	interval: 350,
	fast: true,
	run: function run(func, args) {
		func.apply(undefined, _toConsumableArray(args.splice(-func.length)));
	},
	table: function table(grid) {
		var out = "<table class='full' height='90%'><tr>";
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
	debug: true,
	chargrid: [],
	funcgrid: [],
	itemgrid: [],
	opdict: {
		",": function _(x) {
			return alert(x), x;
		},
		".": function _(x) {
			return alert(x), (_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).stop = true;
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
		"x": function x(_x) {// remove

		},
		"\\": function _(x) {
			// mirror
			var o = new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(x),
			    temp = o.vx;
			o.vx = -o.vy;
			o.vy = -temp;
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
		}
	},
	reducers: {
		"R": function R() {
			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			// reduce
			if (args.length === 1) return new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(args[0]).move(1);
			var o = new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(args[0]),
			    x;
			o._move();
			var p = new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(args[0]);
			// if (args.length%2) args.push((new Item(0)).concat(p))
			var func = (_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).opdict[(_temporalAssertDefined(detour, "detour", _temporalUndefined) && detour).chargrid[o.y][o.x]];
			if (args.length % 2) x = args.pop();
			p.value = args.reduce(func);
			if (typeof x !== "undefined") {
				p.value = [p, x].reduce(func);
			}
			p.move(1);
		},
		"S": function S(x, y) {
			// sum
			var o = _temporalUndefined;
			o = new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(x);
			if (arguments.length > 1) {
				(_temporalAssertDefined(o, "o", _temporalUndefined) && o).value += y.value;
				(_temporalAssertDefined(o, "o", _temporalUndefined) && o).move(-1);
			} else {
				(_temporalAssertDefined(o, "o", _temporalUndefined) && o).move();
			}
		},
		"P": function P(x, y) {
			// product
			var o = _temporalUndefined;
			o = new (_temporalAssertDefined(Item, "Item", _temporalUndefined) && Item)(x);
			if (arguments.length > 1) {
				(_temporalAssertDefined(o, "o", _temporalUndefined) && o).value *= y.value;
				(_temporalAssertDefined(o, "o", _temporalUndefined) && o).move(-1);
			} else {
				(_temporalAssertDefined(o, "o", _temporalUndefined) && o).move();
			}
		}
	},
	reducelist: []
};
setup();
