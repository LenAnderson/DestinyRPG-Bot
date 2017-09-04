class UI {
	get page() {
		return $('body > .views > .view > .pages > .page.page-on-center') || $('body > .views > .view > .pages > .page[data-page="index-1"]');
	}
	get stage() {
		if (this.page) {
			return this.page.getAttribute('data-page').toLowerCase();
		}
		return '';
	}
	get busy() {
		if (this.page) {
			return $('.preloader-indicator-overlay') != null;
		}
		return false;
	}
	get location() {
		let el = $('body > .views > .view > .navbar > .navbar-inner.navbar-on-center > .center.sliding');
		if (el) {
			return el.textContent.trim().replace(/^Patrolling\s+/, '');
		}
		return '';
	}
}