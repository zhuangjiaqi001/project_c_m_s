(function(g) {
	if (g.VUE) return false
	var head = $('head'),
		sc = document.createElement('script')
	head.append(sc)
	sc.src  = 'json.json'
	g.jsonpcallback = function(json) {
		g.VUE = new Vue({
			el: '#vApp',
			data: {
				json: json
			}
		})
	}

}(window));
