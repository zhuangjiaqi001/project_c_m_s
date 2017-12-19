(function(global, VM, CMS) {
	var API = {
		get:    '/shop/get',
		list:   '/shop/getShopCList',
		remove: '/shop/removeShopC',
		copy:   '/shop/copyShopC'
	},
	shopId = CMS.getQueryValue('shopId')

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
					render: (row, col, idx) => {
						return `<a class="text-blue" href="/shop/itemEdit?shopId=${row.shopId}&id=${row.id}">编辑</a>
								<a class="text-blue" @click="rpRemove(row.shopId, row.id)">删除</a>
								<a class="text-blue" @click="rpCopy(row.shopId, row.id)">复制</a>
								${row.preview? '<a class="text-blue" target="_blank" href="'+row.preview+'">预览</a>': ''}`
					}
				}
			],
			removeModal: false,
			copyModal: false,
			dataList: [],
			total: 0,
			pageSize: 10,
			current: 1,
			search: {
				$shopId: shopId,
				title: ''
			},
			sort: '',
			shopinfo: {},
			shopId: shopId || '',
			id: ''
		},
		methods: {
			rpRemove (shopId, id) {
				this.removeModal = true
				this.shopId = shopId
				this.id     = id
			},
			rpCopy (rpId, id) {
				this.copyModal = true
				this.shopId = shopId
				this.id     = id
			},
			rpRemoveFn () {
				CMS.http.post(API.remove, {
					shopId: this.shopId,
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
			rpCopyFn () {
				CMS.http.post(API.copy, {
					shopId: this.shopId,
					id: this.id
				}, function(o) {
					console.log(o)
					VUE.$Message.success('成功!')
					CMS.getDataList(API.list)
					VUE.copyModal = false
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
			},
			getData: function(me) {
				CMS.http.get(API.get, { id: shopId }, function(o) {
					me.shopinfo = o.data
				}, function(err) {
					VUE.$Message.warning(err.message)
					console.log(err)
				})
			},
			load: function() {
				var me = this
				CMS.getDataList(API.list)
				me.getData(me)
			}
		}
	}))

}(window, window.VM, window.CMS))