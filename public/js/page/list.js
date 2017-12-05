(function(global, VM, CMS) {
	var API = {
		list:    '/page/getPageCList',
		remove:  '/page/removePageC',
		release: '/page/releasePageC',
		offline: '/page/offlinePageC'
	}

	var Modal = {
		release: 'handleRelease',
		refresh: 'handleRelease',
		remove:  'handleRemove',
		offline: 'handleOffline'
	}

	var VUE = new Vue(CMS.extend(VM, {
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
					render: (row, column, index) => {
						return `<a class="text-blue" href="/page/${row.pageId}/edit/${row.id}">编辑</a>
								<a class="text-blue" @click="handleModal(`+(row.active? `'refresh'`: `'release'`)+`, row.id)">`+(row.active? `刷新`: `发布`)+`</a>
								<a class="text-blue" @click="handleModal('remove', row.id)">删除</a>`+
								(row.active? ` <a class="text-blue" @click="handleModal('offline', row.id)">下线</a>`: ``) +
								(row.url? ` <a class="text-blue" target="_blank" href="${row.url}">链接</a>`: ``)
					}
				}
			],
			removeModal: false,
			dataList: [],
			total: 0,
			pageSize: 10,
			current: 1,
			search: {
				$pageId: pageId,
				title: ''
			},
			sort: '',
			pageId: '',
			id: '',
			Modal: false,
			ModalName: '',
		},
		methods: {
			handleModal (pageId, id) {
				this.removeModal = true
				this.pageId = pageId
				this.id     = id
			},
			handleRemove () {
				CMS.http.post(API.remove, {
					pageId: this.pageId,
					id: this.id
				}, function(o) {
					console.log(o)
					VUE.$Message.success('成功!')
					CMS.getDataList(API.list)
					VUE.removeModal = false
				}, function(err) {
					VUE.$Message.warning(err.message)
				})
			},
			// 页码切换
			changePage: function(cur) {
				this.current = cur
				CMS.getDataList(API)
			},
			// 每页展示数据量切换
			changePageSize: function(size) {
				this.pageSize = size
				CMS.getDataList(API)
			},
			// 列表搜索
			searchList: function() {
				this.current = 1
				CMS.getDataList(API)
			},
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
			// 排序
			sortList: function(opts) {
				var key   = opts.key === 'levelName'? 'level': opts.key,
					order = opts.order,
					arr   = []
				if (order === 'asc') {
					this.sort = key
				} else if (order === 'desc') {
					this.sort = '-' + key
				} else {
					this.sort = ''
				}
				CMS.getDataList(API.list)
			}
		}
	}))

	CMS.getDataList(API.list)

}(window, window.VM, window.CMS))
