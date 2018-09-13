'use strict';

const 
	java_reader = require('./parser/java-reader'),
	$ = require('./utilities');

module.exports =  (plugins,files,classes) => {

	//loop through the plugins
	$.forEach(plugins, (el,key,index)=>{
		console.log('reading plugin source -- '+key);
		plugins[key].sources = [];

		//loop through the files
		for (var i = 0; i < plugins[key].src.length; i++) {
			let basePath = `/${key}/src${plugins[key].src[i]}`;
			let file = files[basePath];
			if(file.class == true){
				file.used = [];

				//loop through the required plugins
				for (var j = 0; j < plugins[key].require.length; j++) {
					let response = java_reader.get_publics(file,plugins[key].require[j],classes);
					if(response.length>0){
						file.used.push({
							plugin_name:plugins[key].require[j],
							usage:response
						});
					}
				}
				delete file.data;
				plugins[key].sources.push(file);
			}
		}
	});
}