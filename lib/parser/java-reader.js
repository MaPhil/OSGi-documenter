'use strict';

const 
	$ = require('../utilities');

const lineUpData = (data)=>{
	return data.split('\n');
}
/*
[A-Za-z]
*/
const read = (data,str)=>{
	data = lineUpData(data);
	let out = [];
	for (var i = 0; i < data.length; i++) {
		let match = data[i].match(new RegExp(`new(\\\s)+${str}`,'g'));
		//if(data[i].indexOf('new')!=-1 && data[i].indexOf('new '+str)!=-1)console.log('---------------------',data[i], match,str);
		if(match!=null){
			let variable = data[i].match(/(\s)*(this\.)?[a-zA-Z]+(\s)+=/g);
			if(variable!= null){
				variable = variable[0].replace(/\s+/g,'').replace('=','');
				out.push({
					line:i+1,
					kind:'instance',
					variable:variable,
					used:readUse(data,variable,i)
				});
			}
		}
	}
	return out;
}
const readUse = (data, str, excludeLine)=>{
	let arr = [];
	for (var i = 0; i < data.length; i++) {
		let match = data[i].match(new RegExp(str,'g'));
		if(match != null && i != excludeLine){
			let subMatchFN = data[i].match(new RegExp(`${str}\\\.[\\\.a-zA-Z]+\\\(\\\)`));
			let subMatchVar = data[i].match(new RegExp(`${str}\\\.[\\\.a-zA-Z]+`));
			if(subMatchFN != null){
				arr.push({
					line:i+1,
					variable:str,
					kind:'function'
				});
			}else if(subMatchVar != null){
				arr.push({
					line:i+1,
					variable:str,
					kind:'variable'
				});
			}
		}
	}
	return arr;
}


module.exports = {
	get_lines: path =>{
		return new Promise(resolve => {
			$.countFileLines(path).then(count =>{
				resolve(count);
			})
		});
	},
	isAbstract: data =>{
		let match = data.match(/^(public )?abstract class [^\s]+/gm);
		if(match == null)return false;
		else return true;
	},
	isInterface: data =>{
		let match = data.match(/public class [^\s]+/gm);
		if(match == null)return false;
		else return true;
	},
	isClass: data =>{
		let match = data.match(/public class [^\s]+/gm);
		if(match == null)return false;
		else return true;
	},
	isEnum: data =>{
		let match = data.match(/public enum [^\s]+/gm);
		if(match == null)return false;
		else return true;
	},
	get_class_name: (data,kind)=>{
		let regex,cutoff;
		if(kind == 0){
			//it is a class
			regex = /public class [^\s]+/gm;
			cutoff = /public class /gm;
		}else if(kind == 1){
			//it is an abstract class
			regex = /^(public )?abstract class [^\s]+/gm
			cutoff = /^(public )?abstract class /gm;
		}else if(kind == 2){
			//it is an interface
			regex = /public interface [^\s]+/gm
			cutoff = /public interface /gm;
		}else if(kind == 3){
			//it is an interface
			regex = /public enum [^\s]+/gm
			cutoff = /public enum /gm;
		}

		let name = data.match(regex)
		if(name != null){
			name = name[0];
			name = name.replace(cutoff, '');
			return name;
		}else {
			return 'no class or interface or abstract class';
		}
	},
	get_imported_packages: (data)=>{
		let regex = /import [^;]+/gm;
		let packages = data.match(regex);
		if(packages != null){
			for (var i = 0; i < packages.length; i++) {
				packages[i] = packages[i].substr(7);
			}
			return packages;
		}else{
			return [];
		}
	},
	get_publics:  (file, thisPackage, classes) => {
		let out = [];
		for (var i = 0; i < file.packages.length; i++) {
			let obj = file.packages[i].split('.')[file.packages[i].split('.').length-1];
			if(obj != '*'){
				let using = readUse(lineUpData(file.data),obj,-1);
				if(using.length>0){
					out.push({
						way_of_usage:'import',
						variable:obj,
						used:using
					});
				}
			}
		}
		thisPackage = thisPackage.split(';')[0];
		if(classes[thisPackage]){
			$.forEach(classes[thisPackage],(el,k,i)=>{
				let classUsed = {
					way_of_usage:'class',
					variable:el.class,
					used:read(file.data,el.class)
				}
				if(classUsed.used.length>0){
					out.push(classUsed);
				}
			});
		}
		return out;
	}
}






