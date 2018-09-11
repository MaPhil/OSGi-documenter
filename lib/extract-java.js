'use strict';


const 
	$ = require('./utilities'),
	fs = require('fs'),
	path =require('path'),
	java_reader = require('./parser/java-reader');


module.exports = {
	get_file_list:()=>{
		let java = {};
		for (const single_path of $.listFilesInDirectory(`${__dirname}/../source/`,'.java')) {
			java[single_path] = {};
		}
		return java;
	},
	get_info: async (files,classes)=>{
		await $.asyncForEach(files,async (elem,key,index) => {
			//count lines in file
			let javaPath = path.resolve(`${__dirname}/../source/${key}`);
			files[key].lines = await java_reader.get_lines(javaPath);
			files[key].java_path = `/source${key}`;
			//read file
			let data = fs.readFileSync(javaPath,'utf8');

			//check if file is abstract class
			files[key].abstract = java_reader.isAbstract(data);

			if(!files[key].abstract){
				files[key].interface = java_reader.isInterface(data);
				files[key].class = java_reader.isClass(data);
				files[key].enum = java_reader.isEnum(data);

				if(files[key].class){
					//read class name
					files[key].class_name = java_reader.get_class_name(data,0);



					//add hash map for better overview
					let tmp = key.split('/src/')[0].replace('/','');

					if(!classes[tmp])classes[tmp] = {};

					let ownpackage = key.substr(tmp.length+6).replace(/\//gm,'.').replace('.java','');

					classes[tmp][ownpackage] = {
						class:files[key].class_name.match(/[a-zA-Z0-9]+/gm)[0],
						file_uri:key
					}

					//read imported packages
					files[key].packages = java_reader.get_imported_packages(data);

					files[key].data = data;

				}else if(files[key].interface){
					//read class name
					files[key].interface_name = java_reader.get_class_name(data,2);				 
				}else if(files[key].enum){
					//read class name
					files[key].enum_name = java_reader.get_class_name(data,3);
				}
			}else{
				//read class name
				files[key].class_name = java_reader.get_class_name(data,1);
			}
		})
	}
}