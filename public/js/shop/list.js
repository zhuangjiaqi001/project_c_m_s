(function(global, VM, CMS) {
	var API = {
		get:    '/shop/get',
		list:   '/shop/getShopCList',
		remove: '/shop/removeShopC',
		copy:   '/shop/copyShopC'
	},
	shopId = CMS.getQueryValue('shopId')

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
						return `<a class="text-blue" href="/shop/itemEdit?shopId=${row.shopId}&id=${row.id}">编辑</a>
								<a class="text-blue" @click="rpRemove(row.shopId, row.id)">删除</a>
								<a class="text-blue" @click="rpCopy(row.shopId, row.id)">复制</a>
								<a class="text-blue" target="_blank" href="/api/shop/prevShopC?id=${row.id}">预览</a>`
					}
				}
			],
			removeModal: false,
			copyModal: false,
			listinfo: {
				search: {
					$shopId: shopId,
				},
				api: API.list
			},
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
			getData: function(me) {
				CMS.http.get(API.get, { id: shopId }, function(o) {
					me.shopinfo = o.data
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
