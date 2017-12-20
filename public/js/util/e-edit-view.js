(function() {
	Vue.directive('focus', {
		inserted: function (el) {
			el.focus()
		}
	})
	Vue.component('e-text', {
		props: ['value'],
		template: `<span>{{value}}</span>`,
		data: function() {
			return {}
		},
		methods: {
		}
	})
	Vue.component('e-textarea', {
		props: ['value'],
		template: `<div ><p v-for="p in contentList">{{p}}</p></div>`,
		data: function() {
			return {
				contentList: [],
			}
		},
		methods: {
		},
		mounted: function() {
			this.contentList = descList(this.value)
		}
	})
	Vue.component('e-image', {
		props: ['value'],
		template: `<img :src="value" :style="value? '': 'opacity: 0'">`,
		data: function() {
			return {}
		},
		methods: {
		},
		mounted: function() {
		}
	})
	Vue.component('e-bgimage', {
		props: ['value', 'eClass', 'maxSize', 'format'],
		template: `<div :class="eClass" :style="'background-image: url(' + (value || '') + ');'"><slot></slot></div>`,
		data: function() {
			return {}
		},
		methods: {
		},
		mounted: function() {
		}
	})

	function descList(str) {
		str = str || ''
		str = str.length > 1000? str.substr(0, 1000): str
		str = str.replace(/(^\n*)|(\n*$)/g, '').replace(/\n+/g, '|*|')
		return str.split('|*|')
	}
}());


var VUE

(function() {
	function getQueryValue(key) {
		var r = location.search.match(new RegExp('[\\?|\\&]' + key + '=([^\\&]*)', 'i'))
		return r? decodeURIComponent(r[1]): ''
	}

	var id = getQueryValue('id')
	$.get('/api/shop/getC?id=' + id, function(d) {
		if (d.code === '0000') {
			try {
				var json = JSON.parse(d.data.json)
				VUE = new Vue({
					el: '#v_edit_app',
					data: { json: json },
					methods: {
					},
					mounted: function() {
					}
				})
			} catch (e) {
				console.log(e)
			}
		}
	})
}())
