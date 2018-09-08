'use strict';

const $ = require('./utilities');

module.exports = {
	list_plugins:(manifest)=>{
		$.forEach(manifest,(element,plugin_name,index)=>{
			manifest[plugin_name].usage = [];
			$.forEach(manifest,(innerElement,innerPlugin_name,innerIndex)=>{
				if($.containsPartOfString(innerElement.require,plugin_name)) manifest[plugin_name].usage.push(innerPlugin_name);
			})
		})
	},
	list_files:(manifest)=>{
		$.forEach(manifest, (elem,key,index)=>{
			manifest[key].src = $.listFilesInDirectory(`${__dirname}/../source/${key}/src`,'.java');
		})
	}
}