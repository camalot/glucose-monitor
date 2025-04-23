// var hbs = require('express-handlebars');
// hbs.registerAsyncHelper('section', function (name, context) {
// 	console.log(name);
// 	if (!this._sections) {
// 		this._sections = {};
// 	}

// 	if (!this._sections[name]) {
// 		this._sections[name] = [];
// 	}
// 	this._sections[name].push(context.fn(this));
// 	console.log(this._sections[name]);
// 	return null;
// });




// hbs.registerHelper("block", function (name) {
// 	if (!this._sections) {
// 		this._sections = {};
// 	}
// 	let val = (this._sections[name] || []).join('\n');
// 	this._sections[name] = [];
// 	return val;
// })
