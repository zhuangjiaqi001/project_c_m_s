(function(global, VM, CMS) {
	var API = {
		getRes: '/user/getRes'
	}

	global.VUE = new Vue(CMS.extend(VM, {
		data: {
			infos: [{
				color: 'aqua',
				icon:  'fa fa-image',
				name:  '图片推荐位',
				data:  0,
				href:  '/imgrp'
			},
			{
				color: 'red',
				icon:  'fa fa-file-text',
				name:  '文本推荐位',
				data:  0,
				href:  '/txtrp'
			},
			{
				color: 'green',
				icon:  'fa fa-send',
				name:  '落地页',
				data:  0,
				href:  '/page'
			}]
		},
		methods: {
			getRes: function(me) {
				CMS.http.get(API.getRes, function(o) {
					me.infos[0].data = o.data.ImgRPC
					me.infos[1].data = o.data.TxtRPC
					me.infos[2].data = o.data.PageC
					console.log(o)
				}, function(err) {
					VUE.$Message.warning(err.message)
					console.log(err)
				})
			},
			load: function() {
				var me = this
				me.getRes(me)
			}
		}
	}))
}(window, window.VM, window.CMS))
