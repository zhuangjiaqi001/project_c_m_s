(function(global, VM, CMS) {
	var API = {
		get:    '/txtrp/getTxtRPC',
		submit: '/txtrp/sortTxtRPC'
	},
	rpId = CMS.getQueryValue('rpId')

	global.VUE = new Vue(CMS.extend(VM, {
		data: {
			list: [],
			sort: {},
			rpId: rpId,
		},
		methods: {
			submit: function() {
				CMS.http.post(API.submit, { sort: this.sort }, function(o) {
					VUE.$Message.success(o.message)
				}, function(err) {
					VUE.$Message.warning(err.message)
					console.log(err)
				})
			},
			getData: function(me) {
				CMS.http.get(API.get, { id: rpId }, function(o) {
					me.list = o.data
					VUE.list.map((i, _) => { me.sort[`_${_}`] = i.id })
				}, function(err) {
					VUE.$Message.warning(err.message)
					console.log(err)
				})
			},
			get: function(e){
				// console.log(e.draggedContext.element.id)
			},
			end:function(e){
				console.clear()
				// console.log(`${e.oldIndex} 拖动到 ${e.newIndex}`)
				VUE.list.map((i, _) => { this.sort[`_${_}`] = i.id })
				console.log(this.sort)
			},
			load: function() {
				var me = this
				me.getData(me)
			}
		}
	}))


}(window, window.VM, window.CMS))
