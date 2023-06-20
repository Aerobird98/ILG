package;

import js.html.FileReader;
import js.html.FileList;
import js.html.File;
import js.html.InputElement;
import js.html.ParagraphElement;
import js.html.DivElement;
import js.Browser;

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
			if (isCSVFile(a) && isCSVFile(b)) return 0;
			if (isCSVFile(a)) {
				return 1;
			} else {
				return -1;
			}
		});
        return files;
    }

	static function main() {
		final input:InputElement = Browser.document.createInputElement();
		input.type = "file";
		input.multiple = true;
		input.accept = 'text/csv,image/*';
		Browser.document.body.appendChild(input);
		input.addEventListener("change", function() {
			Browser.document.body.removeChild(input);

			final files = sortFilesByType(input.files);
			trace(files);
			final file:File = input.files[0];
			final reader:FileReader = new FileReader();
			reader.readAsText(file);
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

							if (entry < row.length || row[entry].toString() != "") {
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
		});
	}
}
