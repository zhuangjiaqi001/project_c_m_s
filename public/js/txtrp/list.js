(function(global, VM, CMS) {
	var API = {
		list: '/txtrp/getTxtRPCList',
		remove: '/txtrp/removeTxtRPC'
	},
	rpId = CMS.getQueryValue('rpId')

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
						return `<a class="text-blue" href="/txtrp/itemEdit?rpId=${row.rpId}&id=${row.id}">编辑</a>
								<a class="text-blue" @click="handleModal(row.rpId, row.id)">删除</a>`
					}
				}
			],
			removeModal: false,
			dataList: [],
			total: 0,
			pageSize: 10,
			current: 1,
			search: {
				$rpId: rpId,
				title: ''
			},
			sort: '',
			rpId: rpId || '',
			id: ''
		},
		methods: {
			handleModal (rpId, id) {
				this.removeModal = true
				this.rpId = rpId
				this.id   = id
			},
			handleRemove () {
				CMS.http.post(API.remove, {
					rpId: this.rpId,
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
				CMS.getDataList(API.list)
			},
			// 每页展示数据量切换
			changePageSize: function(size) {
				this.pageSize = size
				CMS.getDataList(API.list)
			},
			// 列表搜索
			searchList: function() {
				this.current = 1
				CMS.getDataList(API.list)
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
