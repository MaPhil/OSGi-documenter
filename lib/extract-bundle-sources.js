'use strict';

const 
	java_reader = require('./parser/java-reader'),
	$ = require('./utilities');

module.exports =  (plugins,files,classes) => {
	$.forEach(plugins, (el,key,index)=>{
		console.log(key);
		plugins[key].sources = [];
		for (var i = 0; i < plugins[key].src.length; i++) {
			let basePath = `/${key}/src${plugins[key].src[i]}`;
			let file = files[basePath];
			if(file.class == true){
				file.used = [];
				for (var j = 0; j < plugins[key].require.length; j++) {
					let response = java_reader.get_publics(file,plugins[key].require[j],classes);
					if(response.length>0){
						file.used.push(response);
					}
				}
				delete file.data;
				plugins[key].sources.push(file);
			}
		}
	});
}