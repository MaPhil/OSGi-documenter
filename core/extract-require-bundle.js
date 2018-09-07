'use strict';

let path = '/Users/philipp/Desktop/libresocial/Source';
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
			required = required.replace('Require-Bundle: ','').split(/,(##|#) /gm);
			manifests[source] = required;
		}else{
			delete manifests[source];
		}
	}
}
let out = '';
for(let source in manifests){
	if(manifests.hasOwnProperty(source)){
		out+= '- '+source;
		for(let i=0;i<manifests[source].length;i++){
			let dep = manifests[source][i].replace(/#/gm,'');
			if(dep!= ''){
				out+=`\n\t- ${dep}`;
			}
		}
		out+='\n';
	}
} 
fs.writeFileSync(__dirname+'/output.txt',out,'utf8');