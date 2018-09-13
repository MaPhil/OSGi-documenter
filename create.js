'use strict';

const fs = require('fs');

const lib = {
	create_markdown_document: require('./lib/create-markdown-document'),
	convert_to_pdf: require('./lib/convert-to-pdf'),
	extract_bundle_sources: require('./lib/extract-bundle-sources'),
	extract_bundle_usage: require('./lib/extract-bundle-usage'),
	extract_java: require('./lib/extract-java'),
	extract_require_bundle: require('./lib/extract-require-bundle')
};

(async()=>{
	try{
		lib.config = require('./config');
	}catch(e){
		lib.config = 'all';
	}

	let plugins = lib.extract_require_bundle();
	lib.extract_bundle_usage.list_plugins(plugins);
	lib.extract_bundle_usage.list_files(plugins);



	let java = lib.extract_java.get_file_list(),
		classes = {};

	await lib.extract_java.get_info(java,classes);

	lib.extract_bundle_sources(plugins,java,classes);



	fs.writeFileSync(`${__dirname}/document/data/plugin.txt`,JSON.stringify(plugins,null,2),'utf8');
	fs.writeFileSync(`${__dirname}/document/data/java_files.txt`,JSON.stringify(java,null,2),'utf8');
	fs.writeFileSync(`${__dirname}/document/data/classes.txt`,JSON.stringify(classes,null,2),'utf8');

	lib.create_markdown_document(plugins,lib.config);

	await lib.convert_to_pdf();
})()