// Generated by Haxe 4.3.1
(function ($global) { "use strict";
function $extend(from, fields) {
	var proto = Object.create(from);
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var EReg = function(r,opt) {
	this.r = new RegExp(r,opt.split("u").join(""));
};
EReg.prototype = {
	match: function(s) {
		if(this.r.global) {
			this.r.lastIndex = 0;
		}
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matchedPos: function() {
		if(this.r.m == null) {
			throw haxe_Exception.thrown("No string matched");
		}
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
};
var HxOverrides = function() { };
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) {
		return undefined;
	}
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(len == null) {
		len = s.length;
	} else if(len < 0) {
		if(pos == 0) {
			len = s.length + len;
		} else {
			return "";
		}
	}
	return s.substr(pos,len);
};
HxOverrides.now = function() {
	return Date.now();
};
var Main = function() { };
Main.isCSVFile = function(file) {
	return file.type == "text/csv";
};
Main.sortFilesByType = function(fileList) {
	var files = [];
	var _g = 0;
	var _g1 = fileList.length;
	while(_g < _g1) files.push(fileList[_g++]);
	files.sort(function(a,b) {
		if(Main.isCSVFile(a) && Main.isCSVFile(b)) {
			return 0;
		}
		if(Main.isCSVFile(a)) {
			return -1;
		} else {
			return 1;
		}
	});
	return files;
};
Main.readImage = function(file,img) {
	var fileReader = new FileReader();
	fileReader.addEventListener("load",function(event) {
		img.src = fileReader.result;
	});
	fileReader.readAsDataURL(file);
};
Main.extractNumber = function(str) {
	var regex = new EReg("(\\d+)$","");
	if(regex.match(str)) {
		var startPos = regex.matchedPos().pos;
		return Std.parseInt(str.substring(startPos,startPos + regex.matchedPos().len));
	} else {
		console.log("Main.hx:60:","Failed to extract the number from the string.");
		return -1;
	}
};
Main.main = function() {
	var input = window.document.createElement("input");
	input.type = "file";
	input.multiple = true;
	input.accept = "text/csv,image/*";
	window.document.body.appendChild(input);
	input.addEventListener("change",function() {
		window.document.body.removeChild(input);
		var files = Main.sortFilesByType(input.files);
		var file = files[0];
		var reader = new FileReader();
		if(files.length > 1) {
			var images = files.slice(1,files.length);
			reader.addEventListener("load",function() {
				var csv = reader.result;
				var rows = csv.split("\n");
				if(StringTools.trim(rows[rows.length - 1]) == "") {
					rows.pop();
				}
				var entries = [];
				var details = rows[0].split(";");
				var entryLength = details.length;
				var _g = 0;
				while(_g < rows.length) {
					var row = rows[_g];
					++_g;
					if(row != rows[0]) {
						entries.push(row.split(";"));
					}
				}
				var _g = 0;
				while(_g < entries.length) {
					var row = entries[_g];
					++_g;
					var div = window.document.createElement("div");
					var imgDiv = window.document.createElement("div");
					var displayDiv = window.document.createElement("div");
					var dataSpan = window.document.createElement("span");
					var detailsSpan = window.document.createElement("span");
					var p = window.document.createElement("p");
					var img = window.document.createElement("img");
					var _g1 = 0;
					while(_g1 < images.length) {
						var im = images[_g1];
						++_g1;
						var imgName = im.name.split(".")[0];
						if(Main.extractNumber(row[0]) == Main.extractNumber(imgName)) {
							Main.readImage(im,img);
							break;
						}
					}
					dataSpan.style.right = "0px";
					dataSpan.appendChild(p);
					imgDiv.appendChild(img);
					displayDiv.appendChild(detailsSpan);
					displayDiv.appendChild(dataSpan);
					div.appendChild(displayDiv);
					div.appendChild(imgDiv);
					var _g2 = 0;
					var _g3 = entryLength - 1;
					while(_g2 < _g3) {
						var entry = _g2++;
						var p1 = window.document.createElement("p");
						var pDetail = window.document.createElement("p");
						if(entry < row.length && row[entry].toString() != "") {
							if(entry == 2) {
								p1.innerText = "" + row[entry] + " " + row[7];
							} else {
								p1.innerText = row[entry].toString();
							}
						} else {
							p1.innerHTML = "<br>";
						}
						pDetail.innerHTML = "<b>" + details[entry] + "</b>";
						detailsSpan.appendChild(pDetail);
						dataSpan.appendChild(p1);
					}
					window.document.body.appendChild(div);
				}
			});
		} else {
			reader.addEventListener("load",function() {
				var csv = reader.result;
				var rows = csv.split("\n");
				if(StringTools.trim(rows[rows.length - 1]) == "") {
					rows.pop();
				}
				var entries = [];
				var entryLength = rows[0].split(";").length;
				var _g = 0;
				while(_g < rows.length) {
					var row = rows[_g];
					++_g;
					if(row != rows[0]) {
						entries.push(row.split(";"));
					}
				}
				var _g = 0;
				while(_g < entries.length) {
					var row = entries[_g];
					++_g;
					var div = window.document.createElement("div");
					window.document.body.appendChild(div);
					var p = window.document.createElement("p");
					p.innerHTML = "<b>" + row[0] + " " + row[1] + "</b>";
					div.appendChild(p);
					var _g1 = 0;
					while(_g1 < entryLength) {
						var entry = _g1++;
						if(entry != 0 && entry != 1 && entry != 7) {
							var p1 = window.document.createElement("p");
							if(entry < row.length && row[entry].toString() != "") {
								if(entry == 2) {
									p1.innerText = "" + row[entry] + " " + row[7];
								} else {
									p1.innerText = row[entry].toString();
								}
							} else {
								p1.innerHTML = "<br>";
							}
							div.appendChild(p1);
						}
					}
				}
			});
		}
		reader.readAsText(file);
	});
};
var Std = function() { };
Std.parseInt = function(x) {
	var v = parseInt(x);
	if(isNaN(v)) {
		return null;
	}
	return v;
};
var StringTools = function() { };
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	if(!(c > 8 && c < 14)) {
		return c == 32;
	} else {
		return true;
	}
};
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) ++r;
	if(r > 0) {
		return HxOverrides.substr(s,r,l - r);
	} else {
		return s;
	}
};
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) ++r;
	if(r > 0) {
		return HxOverrides.substr(s,0,l - r);
	} else {
		return s;
	}
};
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
};
var haxe_Exception = function(message,previous,native) {
	Error.call(this,message);
	this.message = message;
	this.__previousException = previous;
	this.__nativeException = native != null ? native : this;
};
haxe_Exception.thrown = function(value) {
	if(((value) instanceof haxe_Exception)) {
		return value.get_native();
	} else if(((value) instanceof Error)) {
		return value;
	} else {
		var e = new haxe_ValueException(value);
		return e;
	}
};
haxe_Exception.__super__ = Error;
haxe_Exception.prototype = $extend(Error.prototype,{
	get_native: function() {
		return this.__nativeException;
	}
});
var haxe_ValueException = function(value,previous,native) {
	haxe_Exception.call(this,String(value),previous,native);
	this.value = value;
};
haxe_ValueException.__super__ = haxe_Exception;
haxe_ValueException.prototype = $extend(haxe_Exception.prototype,{
});
var haxe_iterators_ArrayIterator = function(array) {
	this.current = 0;
	this.array = array;
};
haxe_iterators_ArrayIterator.prototype = {
	hasNext: function() {
		return this.current < this.array.length;
	}
	,next: function() {
		return this.array[this.current++];
	}
};
if(typeof(performance) != "undefined" ? typeof(performance.now) == "function" : false) {
	HxOverrides.now = performance.now.bind(performance);
}
Main.main();
})({});
