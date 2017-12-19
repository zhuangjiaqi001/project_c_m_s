(function(global, VM, CMS) {
	var API = {
		list:   '/shop/getShopList',
		remove: '/shop/removeShop',
	}

	CMS.getDataList(API.list)

	var Modal = {
		remove:  'handleRemove'
	}

	global.VUE = new Vue(CMS.extend(VM, {
		data: {
			columns: [
				{
					title: '店铺模板名称',
					key: 'name',
					render: (row, col, idx) => {
						return `<a class="text-blue" href="/shop/list?shopId=${row.id}">${row.name}</a>
								<a class="text-blue" href="/shop/edit?shopId=${row.id}"><i class="fa fa-edit"></i></i></a>`
					}
				},
				{
					title: '店铺模板KEY',
					key: 'key'
				},
				{
					title: '描述',
					key: 'description'
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
						return `<a class="text-blue" href="/shop/edit?shopId=${row.id}">编辑</i></a>
								<a class="text-blue" @click="handleModal('remove', row.id)">删除</a>`
					}
				}
			],
			Modal: false,
			ModalName: '',
			ctrlName: '',
			api: '',
			dataList: [],
			total: 0,
			pageSize: 10,
			current: 1,
			search: {
				name: '',
				key: ''
			},
			sort: '',
			shopId: ''
		},
		methods: {
			handleModal (name, id) {
				this.ModalName = name
				this.shopId = id
				this.Modal = true
			},
			// 模态框操作 (发布|删除|下线)
			handleCtrl () {
				var fn = this[Modal[this.ModalName]]
				fn && fn()
			},
			handleRemove () {
				CMS.http.post(API.remove, { id: this.shopId }, function(o) {
					console.log(o)
					VUE.$Message.success('成功!')
					CMS.getDataList(API.list)
				}, function(err) {
					VUE.$Message.warning(err.message)
				})
			},
			handleRelease () {
				CMS.http.post(API.release, { id: this.shopId }, function(o) {
					console.log(o)
					VUE.$Message.success('成功!')
					VUE.Modal = true
					VUE.ModalName = 'link'
					CMS.getDataList(API.list)
				}, function(err) {
					VUE.$Message.warning(err.message)
				})
			},
			handleOffline () {
				CMS.http.post(API.offline, { id: this.shopId }, function(o) {
					console.log(o)
					VUE.$Message.success('成功!')
					CMS.getDataList(API.list)
				}, function(err) {
					VUE.$Message.warning(err.message)
				})
			},
			// 页码切换
			changePage (cur) {
				this.current = cur
				CMS.getDataList(API.list)
			},
			// 每页展示数据量切换
			changePageSize (size) {
				this.pageSize = size
				CMS.getDataList(API.list)
			},
			// 列表搜索
			searchList () {
				this.current = 1
				CMS.getDataList(API.list)
			},
			// 排序
			sortList (opts) {
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

}(window, window.VM, window.CMS))