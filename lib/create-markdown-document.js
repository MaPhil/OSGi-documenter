'use strict';

const $ = require('./utilities'),path = require('path'),fs = require('fs');

module.exports = (plugins, config) => {
	console.log('writing plugin documentation');
	
	let out ='# Documentation\n';
	$.forEach(plugins,(el,k,i)=>{
		// if(config != 'all' && config.indexOf(k)!=-1)out+=`[Plugin: ${k} (further description below)](#${k})\n`;
		out+=`Plugin: ${k}\n`;
	});

	fs.writeFileSync(path.join(`${__dirname}/../document/Markdown/overview.md`),out,'utf8');

	out = '';
	$.forEach(plugins,(el,k,i)=>{
		if(config != 'all' && config.indexOf(k)!=-1){
			out =`## ${k}
### general info

plugin requires | plugin used in 
:- | :-\n`;
			for (var j = 0; j < Math.max(el.require.length,el.usage.length); j++) {
				out+= `${(el.require[j]||' ')} | ${(el.usage[j]||' ')}\n`;
			}
			for (var i2 = 0; i2 < el.sources.length; i2++) {
				let t = el.sources[i2];
							out+=`### plugin files

#### __File ${t.java_path.split('/')[t.java_path.split('/').length-1]}__
> file path: ${t.java_path}
> file length: ${t.lines}`;
				out+='\n> this file is ';
				if(t.abstract)out+='an abstract class';
				else if(t.interface)out+='an interface class\n> class name: '+t.class_name;
				else if(t.enum)out+='an enum\n> class name: '+t.class_name;
				else out+='an abstract class\n> class name: '+t.class_name;	
				if(t.packages.length>0){	
					out+= `\n\n|  |  |  
| :- | -: |\n`;
					for (var i3 = 0; i3 < t.packages.length; i3++) {
						if(i3 ==0)out+='| packages |'+t.packages[i3]+' |\n';
						else out+='|  |'+t.packages[i3]+' |\n';
					}
				}
				if(t.used.length>0){
					out+='In this file the following classes from other plugins are used\n';
					for (var i4 = 0; i4 < t.used.length; i4++) {
						var p = t.used[i4];
						out +=`\nused plugin: ${p.plugin_name}\n`;
						for (var i5 = 0; i5 < p.usage.length; i5++) {
							var u = p.usage[i5];

							out+='\nClass: '+u.variable;

							if(u.way_of_usage == 'import')out+=' (class used directly from package)\n';
							else out+=' (instance of the class is used)\n';
						
							if(u.used){
								out+=`| line in file | variable name | usage |
| :- | :- | :- |\n`;
								for (var i6 = 0; i6 < u.used.length; i6++) {
									let iu = u.used[i6]
									if(iu.kind =='instance'){
										out += `| ${iu.line} | ${iu.variable} | creating ${iu.kind} |\n`;
										for (var i7 = 0; i7 < iu.used.length; i7++) {
											let isubu = iu.used[i7]
											out += `| ${isubu.line} | ${isubu.variable} | ${isubu.kind} |\n`;
										}
									}else out += `| ${iu.line} | ${iu.variable} | ${iu.kind} |\n`;
								}
								out+='\n\n';
							}

							
						}



					}
				}
			}

			fs.writeFileSync(path.join(`${__dirname}/../document/Markdown/${k.replace(/\./g,'-')}.md`),out,'utf8');
		}
	});

}