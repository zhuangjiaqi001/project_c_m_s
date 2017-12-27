(function(global, VM, CMS) {
	var API = {
		getRes: '/user/getRes',
		getLog: '/log/getLogList'
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
			}],
			timeline: [],
			tType: {
				file:   '图片',
				imgrp:  '图片推荐位列表',
				imgrpc: '推荐位',
				txtrp:  '文字推荐位列表',
				txtrpc: '推荐位',
				temp:   '模块列表',
				tempc:  '模块',
				page:   '落地页列表',
				pagec:  '落地页',
				shop:   '店铺模板列表',
				shopc:  '店铺模板',
				store:  '店铺页列表',
				storec: '店铺页',
				user:   '用户',
			},
			tDirective: {
				add:     '添加',
				update:  '更新',
				remove:  '删除',
				release: '发布',
				offline: '下线',
				sort:    '排序',
			}
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
					// console.log(o)
				}, function(err) {
					VUE.$Message.warning(err.message)
					console.log(err)
				})
			},
			getLog: function(me) {
				CMS.http.get(API.getLog, function(o) {
					me.timeline = o.data.list
					console.log(o)
				}, function(err) {
					VUE.$Message.warning(err.message)
					console.log(err)
				})
			},
			load: function() {
				var me = this
				me.getRes(me)
				me.getLog(me)
			}
		}
	}))
}(window, window.VM, window.CMS))
