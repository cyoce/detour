/* Where the magic happens */
"use strict";
$ (document).ready (load);
function load(){
	$ ("#btn-run").click (run);
	$ ("#stop").click(function(){
		detour.stop();
	});
	$ ("#interval").change(function (){
		detour.interval = this.value;
		$("#show-interval").text(this.value);
	});
	setInterval(function(){
		$("#bytes").text(" - " + $("#source").val().length + " bytes");
	});
	$("#permalink").click(function(){
		window.open(applyquery({hex:btoa($("#source").val())}, 'https://rawgit.com/cyoce/detour/master/interp.html'));
	});
	$("#markdown").click(function(){
		var source = $("#source").val();
		var out = "# [Detour](https://rawgit.com/cyoce/detour/master/interp.html), ";
		out += source.length + " bytes\n";
		out += ("\n" + source).replace(/\n/g, "\n    ");
		out += "\n\n[Try it online!](" + applyquery({hex:btoa($('#source').val())}, 'https://rawgit.com/cyoce/detour/master/interp.html') + ")";
		$("#source").val(out).select();
		document.execCommand("copy");
		$("#source").val(source);
	});
	$("#turbo").change(function(){
		detour.turbo = this.checked;
	});
	var query = parse_query(location.href);
	if (query) {
		if (query.hex){
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
		href = String(href)
			.split("?");
		if (href.length <= 1) return null;
		href = href[1];
		var out = {};
		var keys = href.split("&");
		for (var i = 0; i < keys.length; i++) {
			var
				pair = keys[i].split('=');
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
	function base64(value){
		var digits = "0123456789abcdeghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-+";
		if (typeof value === "string"){
			return digits.indexOf(value [1]) + 64 * digits.indexOf(value [0]);
		} else {
			return digits [Math.floor(value/64)] + digits [value % 64];
		}
	}
	function hexdump (string){
		return [...string].map(x => x.charCodeAt().toString(16)).map (x=>"0".repeat(2-x.length) + x).join('');
	}
	function hexcompress(string){
		var hex = hexdump(string);
		hex = "0".repeat(3-hex.length%3) + hex;
		var matches = hex.match(/.../g);
		if (matches[0] === "000") matches.splice(0,1);
		var out = [];
		for (var i = 0; i < matches.length; i++){
			var match = matches[i];
			var int = parseInt(match, 16);
			var num = base64(int);
			out.push(num)
		}
		return out.join('');
	}
	function hexdecompress(string){
		string = "0".repeat(string.length%2) + string;
		var matches = string.match(/../g), out='';
		for (var i = 0;i < matches.length; i++){
			var num = base64(matches[i]).toString(16);
			out += num;
		}
		return unescape(out.replace(/../g, "%$&"));
	}
}
var preprocess = x => x;
// $("#btn-run")
function run (){
	var
		source = $ ("#source").val().replace(/\s*#.*$/gm,""),
		lines = source.split("\n"),
		input_y,
		input_x;
	if (lines.slice(-1)[0] === '') lines.splice(-1)
	for (var i = 0; i < lines.length; i++){
		var line = lines [i];
		var idx = line.indexOf(":")
		if (!input_y && ~idx) input_y = i, input_x = idx;
	}
	if (input_y === undefined){
		var idx = Math.floor(lines.length/2);
		if ((idx % 2)) idx--;
	//	console.log(idx, lines.length-idx);
		for (var i = 0; i < lines.length; i++){
			lines [i] = (i === idx ? ":" : " ") + lines [i];
		}
		input_y = idx;
		input_x = 0;
	}
	var lastln = last(lines, -1);
	if (lastln[1] === "@"){
		last(lines, -1, lastln[0]);
		var ln = lastln.slice(2);
		detour.vars = ln.split("@");
	}
	Item.prototype.x = input_x;
	Item.prototype.y = input_y;
	var max_length = lines.reduce ((x,y) => (x.length > y.length ? x : y)).length;
	for (var i = 0; i < lines.length; i++){
		var line = lines [i];

		if (line.length < max_length){
			lines [i] += ' '.repeat(max_length - line.length);
		}
	}
	$ ("#stdout").html(detour.table(lines))
	detour.chargrid = lines.map (x => x.split(''));
	detour.funcgrid = detour.chargrid.map (x => x.map (y => y ===  "`" ? (s => function(x){
		var val = eval(s);
		if (typeof val === "string"){
			val = val.split('').reverse().join('');
			for (var i = val.length;i--;){
				var o = new Item (x);
				o.value = val.charCodeAt(i);
				o.move();
			}
		} else {
			var o = new Item (x);
			o.value = val;
			o.move();
		}
	})(detour.vars.shift()) : detour.fdict [y] || detour.fdict [' ']));
	detour.width = detour.chargrid [0].length;
	detour.height = detour.chargrid.length;
	detour.itemgrid = [detour.newgrid(Array)];
	last(detour.itemgrid)[input_y][input_x].push(...$("#stdin").val().split(" ").map(Number).map(x=>new Item(x)))
	$("#stop").attr("disabled", false);
	$(".editor").css("display","none");
	$(".runtime").css("display", "block");
	$("#output").html("");
	$("#stdout").html("");
	$("#stdout").css("height","90%");
	detour.start = new Date;
	detour.ticks = 0;
	detour.outlist = [];
	detour.outel = $("#output");
	if (detour.turbo){
		detour.go = true;
		while (detour.go){
			detour.update();
		}
		$("#output").text(detour.outlist.join("\n"));
	} else {
		detour.__timeout__ = setInterval(detour.update, detour.interval);
	}
}
function genmatrix (chars){

}
class Item {
	constructor (val, x, y){
		var len = arguments.length;
		if (len <= 1){
			x = 0;
			y = 0;
		} else {
			this.x = x;
			this.y = y;
		}
		if (len){
			if (typeof val === "object"){
				for (var i in val){
					this [i] = val [i]
				}
			} else {
				this.value = val;
			}
		}
	}
	move (x){
		if (~x) do {
			this._move();
		} while (x--);
		last(detour.itemgrid)[this.y][this.x].unshift(this);
	}
	_move (){
		this.x = detour.opdict.m (this.x + this.vx, detour.width);
		this.y = detour.opdict.m (this.y + this.vy, detour.height);
	}
	comp (chars){
		var i = 1, o = new Item (this);
		o.vals = [];
		while (i){
			o._move();
			var char = detour.chargrid [o.y][o.x];
			if (char === chars [0]){
				i++;
			} else if (char === chars [1]){
				i--;
			} else {
				o.vals.push(...(last(detour.itemgrid)[o.y][o.x].concat(last(detour.itemgrid,-2))|| []))
			}
		}
		return o;
	}
	concat (other){
		var o = {};
		for (var i in other){
			if (other.hasOwnProperty (i)) o [i] = other [i];
		}
		for (var i in this){
			if (this.hasOwnProperty (i)) o [i] = this [i];
		}
		o.other = this.other.concat(other.other);
		return new Item(o);
	}
	toString(){
		return String(this.value) + ">V<^" [this.dir];
	}
	valueOf(){
		return this.value;
	}
	set dir (val){
		val = detour.opdict.m (val, 4);
		var xy = [-~val%2, val%2].map(n => n * Math.sign((Math.abs(val-1.5)|0)*2-1));
		this.vx = xy [0];
		this.vy = xy [1];
	}
	get dir (){
		if (this.vx === 0){
			if (this.vy === 1){ // [0, +1]
				return 3;
			} else { // [0, -1]
				return 1;
			}
		} else {
			if (this.vx === 1){ // [+1, 0]
				return 0
			} else { // [-1, 0]
				return 2;
			}
		}
	}

}
Item.prototype.vx = 1;
Item.prototype.vy = 0;
Item.prototype.moving = true;
Item.prototype.other = [];

function setup (){
	for (var i in detour.opdict){
		var func = detour.opdict [i];
		if (func.length === 1) detour.fdict [i] = ((f) => function (x){
			var o = Object.create(x);
			o.value = f (o.value);
			o = new Item(o);
			o.move();
		})(func);
		else detour.fdict [i] = ((f) => function (x,y){
			// console.log(x,y);
			x = x || new Item;
			var o = x.concat(y);
			o.value = f (x.value, y.value);
			o.move();
		})(func);
	}
	for (var i in detour.reducers){
		detour.fdict [i] = detour.reducers [i];
		detour.reducelist.push(detour.reducers[i]);
	}
}

function ret (value){
	return function (){
		return value;
	};
}
function last (object, index, newval){
	var idx;
	if (arguments.length < 2){
		index = -1;
	}
	idx = detour.opdict.m(index, object.length);
	if (arguments.length < 3){
		return object [idx];
	} else {
		return object [idx] = newval;
	}
}



var detour = {
	newgrid (item){
		item = item || ret();
		var out = Array(detour.height);
		for (var y = 0; y < out.length; y++){
			out [y] = Array(detour.width);
			for (var x = 0; x < out [y].length; x++){
				out [y][x] = item();
			}
		}
		return out;
	},
	update (){
		detour.ticks++;
		if (!detour.turbo){
			$("#ticks").text(String(detour.ticks) + " tick" + (detour.ticks === 1 ? "" : "s"));
			$("#time").text(String(Math.floor((new Date - detour.start)/100)/10));
		}
		detour.itemgrid.push(detour.newgrid(Array));
		var table = detour.newgrid(), moving=false, items=detour.itemgrid.slice(-2)[0], reducers = [];
		for (detour.y = 0; detour.y < detour.height; detour.y++){
			for (detour.x = 0; detour.x < detour.width; detour.x++){
				var args = items [detour.y][detour.x],
					func = detour.funcgrid [detour.y][detour.x];
				while (args.length >= func.length && func.length) detour.run (func, args), moving = true;
				if (~detour.reducelist.indexOf(func) && args.length) reducers.push([detour.x, detour.y, window.__args=args, func]);
			}
		}
		var go = detour.fast || confirm("moving")
		if (moving){

		} else if (reducers.length){
			var reducer = reducers[0], x = reducer[0], y = reducer[1], args = reducer[2], func = reducer [3];
			detour.run (func, args, true);
		} else {
			go = false;
		}
		if (!go) detour.stop();
		for (var y = 0; y < detour.height; y++){
			for (var x = 0; x < detour.width; x++){
				var cell = last(detour.itemgrid)[y][x]
				cell.splice(0, 0, ...last(detour.itemgrid,-2)[y][x])
				if (detour.debug) table [y][x] = detour.chargrid [y][x] + "<br> " + cell.join(' ');
			}
		}
		if (detour.debug && !detour.turbo) $("#stdout").html(detour.table(table));
		if (detour.itemgrid.length > 20) detour.itemgrid.shift();
	},
	interval: 350,
	fast:true,
	run (func, args){
		func (...args.splice(-func.length));
	},
	stop(){
			$("#stop").attr("disabled",true);
			$(".editor").css("display","block");
			$("#stdout").css("height", "40px");
			$(".runtime").css("display", "none");
			console.log(detour.ticks, (new Date)-detour.start);
			clearInterval(detour.__timeout__);
			detour.go = false;
			$("#ticks").text(String(detour.ticks) + " tick" + (detour.ticks === 1 ? "" : "s"));
			$("#time").text(String(Math.floor((new Date - detour.start)/100)/10));

	},
	table (grid){
		var out = "<table class='full' class='vert'><tr>";
		for (var i = 0; i < grid.length; i++){
			out += "\t<tr height='" + String(100/grid.length) + "%'>\n";
			var array = grid [i];
			for (var j = 0; j < array.length; j++){
				out += "\t\t<td width='" + String(100/array.length) + "%'>";
				out += array [j];
				out += "</td>\n";
			}
			out += "\t</tr>\n";
		}
		out += "</table>";
		return out;
	},
	print(x){
		detour.outlist.push(x);
		if (!detour.turbo){
			detour.outel.text(detour.outlist.join("\n"));
			detour.outel[0].scrollTop = detour.outel[0].scrollHeight;
		}
	},
	debug:true,
	chargrid:[],
	funcgrid:[],
	itemgrid:[],
	opdict: {
		",": (x) => (detour.print(x),x),
		":": (x) => x,
		" ": (x) => x,
		"<": (x) => x - 1,
		">": (x) => x + 1,
		"!": (x) => -x,
		"n": (x) => !x,
		"N": (x) => ~x,
		"V": (x) => Math.sqrt(x),
		"f": (x) => Math.floor(x),
		"c": (x) => Math.ceil(x),
		"d": (x) => x / 2,
		"D": (x) => x * 2,
		"-": (x,y) => x - y,
		"+": (x,y) => x + y,
		"*": (x,y) => x * y,
		"_": (x,y) => x / y,
		"m": (x,y) => ((x % y) + y) % y, // fixed modulo
		"e": (x,y) => Math.pow(x,y),
		"o": (x,y) => Math.max(x,y),
		"O": (x,y) => x | y,
		"Z": (x,y) => x ^ y,
		"a": (x,y) => Math.min(x,y),
		"&": (x,y) => x & y,
		"0": (x) => 0,
		"1": (x) => 1,
		"2": (x) => 2,
		"3": (x) => 3,
		"4": (x) => 4,
		"5": (x) => 5,
		"6": (x) => 6,
		"7": (x) => 7,
		"8": (x) => 8,
		"9": (x) => 9,
		"G": (x) => detour.register || 0,
		"g": (x) => detour.register = x,
	},
	fdict:{
		"." (x){
			detour.stop();
			detour.print(x.value);
		},
		"x" (x){ // remove

		},
		"\\" (x){ // mirror
			var o = new Item (x), temp = o.vx;
			o.vx = o.vy;
			o.vy = temp;
			o.move();
		},
		"/" (x){ // mirror
			var o = new Item (x), temp = o.vx;
			o.vx = -o.vy;
			o.vy = -temp;
			o.move();
		},
		"?" (x){ // condition
			var o = new Item(x);
			if (x > 0){
				o.move (1)
			} else {
				o.move();
			}
		},
		"T" (x){ // split
			var o = new Item (x);
			if (o.value > 0) o.dir++;
			o.move();
		},
		"Q" (x){ // split
			var o = new Item (x);
			if (o.value > 0){
				o.dir++;
				o._move();
				o.dir--;
				o.move(-1);
			} else {
				o.move();
			}
		},
		"$" (x){ // dupe
			var o = new Item (x), p = new Item (x);
			o.move(1);
			p.move( );
		},
		";" (x){ // recurse
			var o = new Item (x);
			o.x = Item.prototype.x;
			o.y = Item.prototype.y;
			o.move(-1);
			o.dir = 0;
		},
		"~" (x){ // filter
			if (x > 0){
				(new Item(x)).move();
			}
		},
		"p" (x){
			var o = new Item(x);
			o.dir = 0;
			o.move();
		},
		"q" (x){
			var o = new Item(x);
			o.dir = 2;
			o.move();
		},
		"v" (x){
			var o = new Item (x);
			o.dir = 3;
			o.move();
		},
		"^" (x){
			var o = new Item (x);
			o.dir = 1;
			o.move();
		},
		"{" (x){ // dupe
			var o = x.comp("{}"), p = new Item (x);
			o.move();
			p.move();
		},
		"(" (x) { // skip
			var o = x.comp("()");
			o.move();
		},
		"]" (x) {
			var o = new Item (x), p = x.comp("][");
			if (x > 0){
				p.move();
			} else {
				o.move();
			}
		},
		"[" (x){
			var o;
			if (x <= 0){
				o = x.comp("[]");
			} else {
				o = new Item (x);
			}
			o.move();
		},
		"r"  (x,y){ // range
			var o = new Item (x);
			x = x.value;
			y = y.value;
			var swap, out = [];
			if (x > y){
				var t = x;
				x = y;
				y = t;
				swap = true;
			}
			while (x <= y) out.push(x++);
			if (!swap) out.reverse();
			for (var i = 0; i < out.length; i++){
				var obj = new Item (o);
				obj.value = out[i];
				obj.move();
			}
		},
		"R"  (x){ // range
			var o = new Item (x),y;
			y = x.value;
			x = 1;
			var swap, out = [];
			if (x > y){
				var t = x;
				x = y;
				y = t;
				swap = true;
			}
			while (x <= y) out.push(x++);
			if (!swap) out.reverse();
			for (var i = 0; i < out.length; i++){
				var obj = new Item (o);
				obj.value = out[i];
				obj.move();
			}
		},
		"s" (x,y){ // swap
			var o = new Item (x), p = new Item (y);
			o.move();
			p.move();
		},
		get "%" (){
			var sign = 1;
			return function (x){
				var o = new Item (x), temp = o.vx;
				o.vx = sign * o.vy;
				o.vy = sign * temp;
				o.move();
				sign *= -1;
			}
		},
	},
	reducers:{
		"L" (...args){ // reduce left
			if (args.length === 1) return (new Item(args [0])).move(1);
			var o = new Item(args[0]), x;
			o._move();
			var p = new Item(args[0]);
			// if (args.length%2) args.push((new Item(0)).concat(p))
			var func = detour.opdict[detour.chargrid[o.y][o.x]];
			if (args.length%2) x = args.pop();
			p.value = args.reduce(func);
			if (typeof x !== "undefined"){
				p.value = [p, x].reduce(func);
			}
			p.move(1);
		},
		"S" (x, y){ // sum
			var o = new Item (x);
			if (arguments.length > 1){
				o.value += y.value;
				o.move(-1);
			} else {
				o.move();
			}
		},
		"P" (x,y){ // product
			var o = new Item (x);
			if (arguments.length > 1){
				o.value *= y.value;
				o.move(-1);
			} else {
				o.move();
			}
		},
		"F" (x,y){ // reduce
			var o = new Item (x), p = new Item (x);
			if (arguments.length > 1){
				o._move();
				p.value = detour.opdict[detour.chargrid[o.y][o.x]] (x.value, y.value);
				p.move(-1);
			} else {
				o.move(1);
			}
		},
		"u" (...args){ // string
			detour.print(args.reverse().map (x => x.value).map (x => String.fromCharCode(x)).join(''));
		}
	},
	reducelist:[]
};
setup();
