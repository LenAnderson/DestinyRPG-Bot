let $ = document.querySelector.bind(document);
let $$ = document.querySelectorAll.bind(document);
function toArray(collection) {
	return Array.prototype.slice.call(collection);
}

let log = {
	error: (...args) => { console.error.apply(console, ['[DRB]'].concat(args)); },
	log: (...args) => { console.log.apply(console, ['[DRB]'].concat(args)); },
	warn: (...args) => { console.warn.apply(console, ['[DRB]'].concat(args)); },
}

function random(min, max) {
	if (max === undefined) {
		max = min;
		min = 0;
	}
	let range = max - min + 1;
	return Math.floor(Math.random()*range) + min;
}

function click(el) {
	if (el == null) return;
	el.scrollIntoViewIfNeeded();
	let rect = el.getBoundingClientRect();
	let x = random(Math.max(0, rect.left), Math.min(innerWidth, rect.right));
	let y = random(Math.max(0, rect.top), Math.min(innerHeight, rect.bottom));
	['mouseover', 'mousedown', 'mouseup', 'click'].forEach((name) => {
		let evt = document.createEvent('MouseEvents');
		evt.initMouseEvent(name, true, true, unsafeWindow, 1, x,y, x,y, false, false, false, false, 0, null);
		el.dispatchEvent(evt);
    });
}

function getParams(url) {
	url = url || location.search;
	let params = {};
	url.replace(/^.*?\?/, '').split('&').forEach(it=>{
		let parts = it.split('=');
		if (parts.length > 1) {
			params[parts[0]] = parts[1];
		}
	});
	return params;
}