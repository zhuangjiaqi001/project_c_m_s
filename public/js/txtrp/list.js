(function(global, VM, CMS) {
	var API = {
		get:    '/txtrp/get',
		list:   '/txtrp/getTxtRPCList',
		remove: '/txtrp/removeTxtRPC',
		copy:   '/txtrp/copyTxtRPC'
	},
	rpId = CMS.getQueryValue('rpId')

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
						return `<a class="text-blue" href="/txtrp/itemEdit?rpId=${row.rpId}&id=${row.id}">编辑</a>
								<a class="text-blue" @click="rpRemove(row.rpId, row.id)">删除</a>
								<a class="text-blue" @click="rpCopy(row.rpId, row.id)">复制</a>`
					}
				}
			],
			removeModal: false,
			copyModal: false,
			listinfo: {
				search: {
					$rpId: rpId,
				},
				api: API.list
			},
			rpinfo: {},
			rpId: rpId || '',
			id: ''
		},
		methods: {
			rpRemove (rpId, id) {
				this.removeModal = true
				this.rpId = rpId
				this.id   = id
			},
			rpCopy (rpId, id) {
				this.copyModal = true
				this.rpId = rpId
				this.id   = id
			},
			rpRemoveFn () {
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
			rpCopyFn () {
				CMS.http.post(API.copy, {
					rpId: this.rpId,
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
				CMS.http.get(API.get, { id: rpId }, function(o) {
					me.rpinfo = o.data
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
