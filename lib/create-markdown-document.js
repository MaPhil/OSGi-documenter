// let out = '';
// for(let source in manifests){
// 	if(manifests.hasOwnProperty(source)){
// 		out+= '- '+source;
// 		for(let i=0;i<manifests[source].length;i++){
// 			let dep = manifests[source][i].replace(/#/gm,'');
// 			if(dep!= ''){
// 				out+=`\n\t- ${dep}`;
// 			}
// 		}
// 		out+='\n';
// 	}
// } 
// fs.writeFileSync(__dirname+'/output.txt',out,'utf8');