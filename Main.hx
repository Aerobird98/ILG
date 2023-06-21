package;

import js.html.SpanElement;
import js.html.ImageElement;
import js.html.FileReader;
import js.html.FileList;
import js.html.File;
import js.html.InputElement;
import js.html.ParagraphElement;
import js.html.DivElement;
import js.Browser;

using StringTools;

typedef Entry = Array<String>;
typedef Entries = Array<Entry>;

class Main {
	static function isCSVFile(file:File):Bool {
		return file.type == "text/csv";
	}

	static function sortFilesByType(fileList:FileList):Array<File> {
		var files:Array<File> = [];
		for (i in 0...fileList.length) {
			files.push(fileList[i]);
		}
		files.sort(function(a:File, b:File) {
			if (isCSVFile(a) && isCSVFile(b))
				return 0;
			if (isCSVFile(a)) {
				return -1;
			} else {
				return 1;
			}
		});
		return files;
	}

	static function readImage(file:File, img:ImageElement):Void {
		final fileReader:FileReader = new FileReader();

		fileReader.addEventListener("load", function(event) {
			img.src = fileReader.result;
		});

		fileReader.readAsDataURL(file);
	}

	static function extractNumber(str:String):Int {
		var regex:EReg = ~/(\d+)$/;
		var matched:Bool = regex.match(str);

		if (matched) {
			var startPos:Int = regex.matchedPos().pos;
			var endPos:Int = startPos + regex.matchedPos().len;
			var numberStr:String = str.substring(startPos, endPos);
			return Std.parseInt(numberStr);
		} else {
			trace("Failed to extract the number from the string.");
			return -1;
		}
		return -1;
	}

	static function main():Void {
		final input:InputElement = Browser.document.createInputElement();
		input.type = "file";
		input.multiple = true;
		input.accept = 'text/csv,image/*';

		Browser.document.body.appendChild(input);

		input.addEventListener("change", function() {
			Browser.document.body.removeChild(input);

			final files = sortFilesByType(input.files);
			final file:File = files[0];
			final reader:FileReader = new FileReader();

			if (files.length > 1) {
				final images:Array<File> = files.slice(1, files.length);

				reader.addEventListener("load", function() {
					final csv:String = reader.result;
					final rows:Entry = csv.split("\n");

					if (StringTools.trim(rows[rows.length - 1]) == "") {
						rows.pop();
					}

					final entries:Entries = [];
					final details:Array<String> = rows[0].split(";");
					final entryLength:Int = details.length;
					for (row in rows) {
						if (row != rows[0]) {
							final entry:Entry = row.split(";");
							entries.push(entry);
						}
					}

					for (row in entries) {
						final div:DivElement = Browser.document.createDivElement();
						final imgDiv = Browser.document.createDivElement();
						final displayDiv = Browser.document.createDivElement();

						final dataSpan:SpanElement = Browser.document.createSpanElement();
						final detailsSpan:SpanElement = Browser.document.createSpanElement();

						final p:ParagraphElement = Browser.document.createParagraphElement();

						final img = Browser.document.createImageElement();
						for (im in images) {
							final dataName = row[0];
							final imgName = im.name.split(".")[0];

							if (extractNumber(dataName) == extractNumber(imgName)) {
								readImage(im, img);
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

						for (entry in 0...entryLength) {
							final p:ParagraphElement = Browser.document.createParagraphElement();
							final pDetail:ParagraphElement = Browser.document.createParagraphElement();

							if (entry < row.length && row[entry].toString() != "") {
								if (entry == 2) {
									p.innerText = '${row[entry]} ${row[7]}';
								} else {
									p.innerText = row[entry].toString();
								}
							} else {
								p.innerHTML = '<br>';
							}
							pDetail.innerText = details[entry];

							detailsSpan.appendChild(pDetail);
							dataSpan.appendChild(p);
						}

						Browser.document.body.appendChild(div);
					}
				});
			} else {
				reader.addEventListener("load", function() {
					final csv:String = reader.result;
					final rows:Entry = csv.split("\n");

					if (StringTools.trim(rows[rows.length - 1]) == "") {
						rows.pop();
					}

					final entries:Entries = [];
					final entryLength:Int = rows[0].split(";").length;
					for (row in rows) {
						if (row != rows[0]) {
							final entry:Entry = row.split(";");
							entries.push(entry);
						}
					}

					for (row in entries) {
						final div:DivElement = Browser.document.createDivElement();
						Browser.document.body.appendChild(div);
						final p:ParagraphElement = Browser.document.createParagraphElement();
						p.innerHTML = '<b>${row[0]} ${row[1]}</b>';
						div.appendChild(p);
						for (entry in 0...entryLength) {
							if (entry != 0 && entry != 1 && entry != 7) {
								final p:ParagraphElement = Browser.document.createParagraphElement();

								if (entry < row.length && row[entry].toString() != "") {
									if (entry == 2) {
										p.innerText = '${row[entry]} ${row[7]}';
									} else {
										p.innerText = row[entry].toString();
									}
								} else {
									p.innerHTML = '<br>';
								}
								div.appendChild(p);
							}
						}
					}
				});
			}

			reader.readAsText(file);
		});
	}
}
