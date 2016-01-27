$ (document).ready (load);
function load (){
		$ ("#btn-run").click (run);
		$ ("#stop").click(function(){
			detour.stop = true;
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
		})
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
