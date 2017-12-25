(function(global, VM, CMS) {
	var API = {
		get:    '/imgrp/getImgRPC',
		submit: '/imgrp/sortImgRPC'
	},
	rpId = CMS.getQueryValue('rpId'),
	sortInit

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
					sortInit = JSON.parse(JSON.stringify(me.sort))
				}, function(err) {
					VUE.$Message.warning(err.message)
					console.log(err)
				})
			},
			get: function(e){
				// console.log(e.draggedContext.element.id)
			},
			end:function(e){
				var me = this
				console.clear()
				// console.log(`${e.oldIndex} 拖动到 ${e.newIndex}`)
				VUE.list.map((i, _) => { me.sort[`_${_}`] = i.id })
				me.sort = CMS.diffByObj2(sortInit, me.sort)
				console.log(me.sort)
			},
			load: function() {
				var me = this
				me.getData(me)
			}
		}
	}))


}(window, window.VM, window.CMS))
