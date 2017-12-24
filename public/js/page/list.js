(function(global, VM, CMS) {
	var API = {
		get:     '/page/get',
		list:    '/page/getPageCList',
		remove:  '/page/removePageC',
		release: '/page/releasePageC',
		offline: '/page/offlinePageC',
		copy:    '/page/copyPageC'
	},
	pageId = CMS.getQueryValue('pageId')

	var Modal = {
		release: 'handleRelease',
		refresh: 'handleRelease',
		remove:  'handleRemove',
		offline: 'handleOffline',
		copy:    'handleCopy'
	}

	global.VUE = new Vue(CMS.extend(VM, {
		data: {
			columns: [
				{
					title: '标题',
					key: 'title'
				},
				{
					title: '创建时间',
					key: 'createdAt',
					sortable: true
				},
				{
					title: '修改时间',
					key: 'updatedAt',
					sortable: true
				},
				{
					title: '操作',
					key: '',
					render: (row, col, idx) => {
						return `<a class="text-blue" href="/page/itemEdit?pageId=${row.pageId}&id=${row.id}">编辑</a>
								<a class="text-blue" @click="handleModal(`+(row.active? `'refresh'`: `'release'`)+`, row.id)">`+(row.active? `刷新`: `发布`)+`</a>
								<a class="text-blue" @click="handleModal('remove', row.id)">删除</a>
								<a class="text-blue" @click="handleModal('copy', row.id)">复制</a>
								<a class="text-blue" target="_blank" href="/api/page/prevPageC?id=${row.id}">预览</a>`+
								(row.active? ` <a class="text-blue" @click="handleModal('offline', row.id)">下线</a>`: ``) +
								(row.active? ` <a class="text-blue" target="_blank" href="${row.url}">链接</a>`: ``)
					}
				}
			],
			removeModal: false,
			listinfo: {
				search: {
					$pageId: pageId,
				},
				api: API.list
			},
			pageinfo: {},
			pageId: pageId || '',
			id: '',
			Modal: false,
			ModalName: '',
		},
		methods: {
			handleModal: function(name, pageId) {
				this.ModalName = name
				this.pageId    = pageId
				this.Modal     = true
			},
			// 模态框操作 (发布|删除|下线)
			handleCtrl: function() {
				var fn = this[Modal[this.ModalName]]
				fn && fn()
			},
			// 发布|刷新
			handleRelease: function() {
				CMS.http.post(API.release, { id: this.pageId }, function(o) {
					console.log(o)
					VUE.$Message.success('成功!')
					CMS.getDataList(API.list)
				}, function(err) {
					VUE.$Message.warning(err.message)
				})
			},
			// 删除
			handleRemove: function() {
				CMS.http.post(API.remove, { id: this.pageId }, function(o) {
					console.log(o)
					VUE.$Message.success('成功!')
					CMS.getDataList(API.list)
				}, function(err) {
					VUE.$Message.warning(err.message)
				})
			},
			// 下线
			handleOffline: function() {
				CMS.http.post(API.offline, { id: this.pageId }, function(o) {
					console.log(o)
					VUE.$Message.success('成功!')
					CMS.getDataList(API.list)
				}, function(err) {
					VUE.$Message.warning(err.message)
				})
			},
			handleCopy: function() {
				CMS.http.post(API.copy, { id: this.pageId }, function(o) {
					console.log(o)
					VUE.$Message.success('成功!')
					CMS.getDataList(API.list)
				}, function(err) {
					VUE.$Message.warning(err.message)
				})
			},
			getData: function(me) {
				CMS.http.get(API.get, { id: pageId }, function(o) {
					me.pageinfo = o.data
					CMS.getDataList(API.list)
				}, function(err) {
					VUE.$Message.warning(err.message)
					console.log(err)
				})
			},
			load: function() {
				var me = this
				me.getData(me)
			}
		}
	}))


}(window, window.VM, window.CMS))
