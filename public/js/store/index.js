(function(global, VM, CMS) {
	var API = {
		list:   '/store/getStoreList',
		remove: '/store/removeStore',
	}

	CMS.getDataList(API.list)

	var Modal = {
		remove:  'handleRemove'
	}

	global.VUE = new Vue(CMS.extend(VM, {
		data: {
			columns: [
				{
					title: '商店列表名称',
					key: 'name',
					render: (row, col, idx) => {
						return `<a class="text-blue" href="/store/list?storeId=${row.id}">${row.name}</a>
								<a class="text-blue" href="/store/edit?storeId=${row.id}"><i class="fa fa-edit"></i></i></a>`
					}
				},
				{
					title: '商店列表KEY',
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
						return `<a class="text-blue" href="/store/edit?storeId=${row.id}">编辑</i></a>
								<a class="text-blue" @click="handleModal('remove', row.id)">删除</a>`
					}
				}
			],
			Modal: false,
			ModalName: '',
			ctrlName: '',
			api: '',
			listinfo: {
				search: {
					name: '',
					key: ''
				},
				api: API.list
			},
			storeId: ''
		},
		methods: {
			handleModal (name, id) {
				this.ModalName = name
				this.storeId = id
				this.Modal = true
			},
			// 模态框操作 (发布|删除|下线)
			handleCtrl () {
				var fn = this[Modal[this.ModalName]]
				fn && fn()
			},
			handleRemove () {
				CMS.http.post(API.remove, { id: this.storeId }, function(o) {
					console.log(o)
					VUE.$Message.success('成功!')
					CMS.getDataList(API.list)
				}, function(err) {
					VUE.$Message.warning(err.message)
				})
			},
			handleRelease () {
				CMS.http.post(API.release, { id: this.storeId }, function(o) {
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
				CMS.http.post(API.offline, { id: this.storeId }, function(o) {
					console.log(o)
					VUE.$Message.success('成功!')
					CMS.getDataList(API.list)
				}, function(err) {
					VUE.$Message.warning(err.message)
				})
			},
		}
	}))

}(window, window.VM, window.CMS))
