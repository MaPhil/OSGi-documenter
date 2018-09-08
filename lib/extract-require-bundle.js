'use strict';

module.exports = ()=> {
	let path = __dirname+'/../source';
	const fs = require('fs');

	function getDirectories(path) {
	  return fs.readdirSync(path).filter(function (file) {
	    return fs.statSync(path+'/'+file).isDirectory();
	  });
	}
	let sources = getDirectories(path);
	let manifests = {};
	for(let i=0;i<sources.length;i++){
		try{
			manifests[sources[i]] = fs.readFileSync(`${path}/${sources[i]}/META\-INF/MANIFEST.MF`,'utf8');
			manifests[sources[i]] = manifests[sources[i]].replace(/\n/gm,'#').replace(/\r/gm,'#');
		}catch(e){}
	}
	let regexRequire = /Require-Bundle:(\s[a-zA-Z\.\;\-\=\"0-9\,]+(##|#))+/gm;
	for(let source in manifests){
		if(manifests.hasOwnProperty(source)){
			let rawRequired =  manifests[source].match(regexRequire);
			if(rawRequired !== null){
				let required = rawRequired[0];
				required = required.replace(/(##|#)(\s)?/gm,'');
				required = required.replace('Require-Bundle: ','').split(/,/gm);
				manifests[source] = {
					'require':required
				};
			}else{
				manifests[source] = {
					'require':[]
				}
			}
		}
	}
	return manifests;
}
