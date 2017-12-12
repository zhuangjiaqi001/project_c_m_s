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
				list:  0,
				max:   0,
				href:  '/imgrp'
			},
			{
				color: 'red',
				icon:  'fa fa-file-text',
				name:  '文本推荐位',
				list:  0,
				max:   0,
				href:  '/txtrp'
			},
			{
				color: 'green',
				icon:  'fa fa-send',
				name:  '落地页',
				list:  0,
				max:   0,
				href:  '/page'
			}]
		},
		methods: {
			getRes: function(me) {
				CMS.http.get(API.getRes, function(o) {
					me.infos[0].list = o.data.ImgRP
					me.infos[0].max  = o.data.ImgRPC
					me.infos[1].list = o.data.TxtRP
					me.infos[1].max  = o.data.TxtRPC
					me.infos[2].list = o.data.Page
					me.infos[2].max  = o.data.PageC
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
