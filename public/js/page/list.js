(function(global, VM, CMS) {
	var API = {
		list: '/page/getPageCList',
		remove: '/page/removePageC'
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
								<a class="text-blue" @click="handleModal(row.pageId, row.id)">删除</a>`+
								(row.preview? `<a class="text-blue" target="_blank" href="${row.preview}">预览</a>`: ``)
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
			id: ''
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
