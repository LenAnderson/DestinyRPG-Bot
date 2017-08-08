class UI {
	get page() {
		return $('body > .views > .view > .pages > .page.page-on-center') || $('body > .views > .view > .pages > .page[data-page="index-1"]');
	}
	get stage() {
		let page = this.page;
		if (page) {
			return page.getAttribute('data-page').toLowerCase();
		}
	}
	get busy() {
		return this.page.querySelector('.preloader-indicator-overlay') != null;
	}
}