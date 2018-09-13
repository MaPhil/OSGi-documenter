'use strict';

const node_pdf = require('markdown-pdf'),
	path = require('path'),
	$ = require('./utilities'),
	async = require('async'),
	fs = require("fs");

module.exports = config => {
	return new Promise(resolve =>{
		var newQ = [];
		$.listFilesInDirectory(path.resolve(`${__dirname}/../document/Markdown/`),'.md').forEach(item => {
			newQ.push((done)=>{
				node_pdf()
				.from((path.resolve(`${__dirname}/../document/Markdown/${item}`)))
				.to(path.resolve(`${__dirname}/../document/PDF/${item.split('.')[0]}.pdf`), () => {
					done("Done")
				});
			})
		})
		async.parallel(newQ,(suc,err)=>{
			resolve();
		})
	})
}
