/* Where the magic happens */
"use strict";
$ (document).ready (load);
function load(){
	$ ("#btn-run").click (run);
}
var preprocess = x => x;
// $("#btn-run")
function run (){
	var
		source = $ ("#source")[0].innerText,
		lines = source.split("\n"),
		input_y,
		input_x;
	if (lines.slice(-1)[0] === '') lines.splice(-1)
	for (let i = 0; i < lines.length; i++){
		let line = lines [i];
		let idx = line.indexOf(":")
		if (!input_y && ~idx) input_y = i, input_x = idx;
	}
	if (input_y === undefined){
		let idx = Math.floor(lines.length/2);
		for (var i = 0; i < lines.length; i++){
			lines [i] = (i === idx ? ":" : " ") + lines [i];
		}
		input_y = idx;
		input_x = 0;
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
	detour.funcgrid = detour.chargrid.map (x => x.map (y => detour.fdict [y] || detour.fdict [' ']));
	detour.width = detour.chargrid [0].length;
	detour.height = detour.chargrid.length;
	detour.itemgrid = [detour.newgrid(Array)];
	detour.itemgrid.last [input_y][input_x].push(...$("#stdin").val().split(" ").map(Number).map(x=>new Item(x)))
	detour.update();
}
function genmatrix (chars){

}


const detour = {
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
		detour.itemgrid.push(detour.newgrid(Array));
		var table = [[]], items = detour.itemgrid, moving=false, items=detour.itemgrid.slice(-2)[0];
		for (detour.y = 0; detour.y < detour.height; detour.y++){
			for (detour.x = 0; detour.x < detour.width; detour.x++){
				let args = items [detour.y][detour.x],
					func = detour.funcgrid [detour.y][detour.x];
				if (args.length >= func.length) detour.run (func, args), moving = true;
			}
		}
		for (var y = 0; y < detour.height; y++){
			for (var x = 0; x < detour.width; x++){
				let cell = detour.itemgrid.last[y][x]
				cell.splice(0, 0, ...detour.itemgrid [detour.itemgrid.length-2][y][x])
				if (detour.debug) table [y][x] = detour.chargrid [y][x] + "<br> " + cell.join(', ');
			}
		}
		if (detour.debug) $("#stdout").html(detour.table(table));
		if (moving){
			let go = detour.fast || confirm("moving")
			if(go) detour.timeout = setTimeout(detour.update, detour.interval);
		}

	},
	interval: 500,
	fast:true,
	run (func, args){
		func (...args.splice(-func.length));
	},
	table (grid){
		var out = "<table class='full'><tr>";
		for (var i = 0; i < grid.length; i++){
			out += "\t<tr>\n";
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
	debug:true,
	chargrid:[],
	funcgrid:[],
	itemgrid:[],
	opdict: {
		",": (x) => (alert(x),x),
		":": (x) => x,
		" ": (x) => x,
		"<": (x) => x - 1,
		">": (x) => x + 1,
		"!": (x) => -x,
		"n": (x) => !x,
		"N": (x) => ~x,
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
		"d": (x,y) => [Math.floor(x / y),detour.opdict.m(x,y)], // divmod
	},
	fdict:{
		"x"(x){ // remove

		}
	}
};
class Item {
	constructor (val, x, y){
		let len = arguments.length;
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
	move (){
		this.x = detour.opdict.m (this.x + this.xv, detour.width);
		this.y = detour.opdict.m (this.y + this.yv, detour.height);
		detour.itemgrid.last[this.y][this.x].push(this);
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
		return String(this.value)
	}
}
Item.prototype.xv = 1;
Item.prototype.yv = 0;
Item.prototype.moving = true;
Item.prototype.other = [];

for (var i in detour.opdict){
	let func = detour.opdict [i];
	if (func.length === 1) detour.fdict [i] = ((f) => function (x){
		let o = Object.create(x);
		o.value = f (o.value);
		o = new Item(o);
		o.move();
	})(func);
	else detour.fdict [i] = ((f) => function (x,y){
		let o = x.concat(y);
		o.value = f (x.value, y.value);
		o.move();
	})(func);
}

function ret (value){
	return function (){
		return value;
	};
}
Object.defineProperty(Array.prototype, 'last', {
	get (){
		return this [this.length-1];
	},
	set (val){
		this [this.length-1] = val;
	}
});
