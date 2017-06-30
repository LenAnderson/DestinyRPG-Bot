let $ = document.querySelector.bind(document);
let $$ = document.querySelectorAll.bind(document);
// Element.prototype.$ = Element.prototype.querySelector;
// Element.prototype.$$ = Element.prototype.querySelectorAll;

// HTMLCollection.prototype.toArray = Array.prototype.slice;
// NodeList.prototype.toArray = Array.prototype.slice;
// NamedNodeMap.prototype.toArray = Array.prototype.slice;
function toArray(collection) {
	return Array.prototype.slice.call(collection);
}

// Node.prototype.replace = function(el) {
	// this.parentNode.replaceChild(el, this);
// }
// Node.prototype.isChildOf = function(el) {
	// return this.parentNode && this != document.body && this != document.body.parentNode && (this.parentNode == el || this.parentNode.isChildOf(el));
// }
// Node.prototype.parent = function(q) {
	// if (this.parentElement.matches(q)) return this.parentElement;
	// return this.parentElement.parent(q);
// }
// Node.prototype.getElement = function() {
	// if (this instanceof Element) return this;
	// return this.parentElement;
// }

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
	console.log('click: ', el);
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