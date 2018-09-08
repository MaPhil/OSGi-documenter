'use strict';

const
path = require("path"),
fs = require("fs");


/**
walkSync function from https://gist.github.com/luciopaiva/4ba78a124704007c702d0293e7ff58dd
*/
function *walkSync(dir) {
	const files = fs.readdirSync(dir);

	for (const file of files) {
		const pathToFile = path.join(dir, file);
		const isDirectory = fs.statSync(pathToFile).isDirectory();
		if (isDirectory) {
			yield *walkSync(pathToFile);
		} else {
			yield pathToFile;
		}
	}
}

module.exports = {
	forEach:(loop,callback)=>{
		let index=0;
		for(let key in loop){
			if(loop.hasOwnProperty(key)){
				callback(loop[key],key,index);
				index++;
			}
		}
	},
	asyncForEach:async (loop,callback)=>{
		let index=0;
		for(let key in loop){
			if(loop.hasOwnProperty(key)){
				await callback(loop[key],key,index);
				index++;
			} 
		}
	},
	containsPartOfString:(arr,str)=>{
		for (var i = 0; i < arr.length; i++) {
			if(arr[i].indexOf(str)!=-1){
				return true;
			}
		}
		return false;
	},
	listFilesInDirectory: (pathTo,extension)=>{
		pathTo = path.resolve(pathTo)
		let pathLength = pathTo.length;
		try{
			const files = [];
			for (const file of walkSync(pathTo)) {
				if(file.indexOf(extension)!=-1){
					let temp = file;
					temp = temp.substr(pathLength);
					files.push(temp);
				}
			}
			return files;
		}catch(e){
			return [];
		}
	},
	/**
	countFileLines function from https://stackoverflow.com/questions/12453057/node-js-count-the-number-of-lines-in-a-file
	*/
	countFileLines: filePath =>{
		return new Promise((resolve, reject) => {
			let lineCount = 0;
			fs.createReadStream(filePath)
			.on("data", (buffer) => {
				let idx = -1;
				lineCount--;
				do {
					idx = buffer.indexOf(10, idx+1);
					lineCount++;
				} while (idx !== -1);
			}).on("end", () => {
				resolve(lineCount);
			}).on("error", reject);
		});
	}
}