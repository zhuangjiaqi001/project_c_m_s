(function(global, VM, CMS) {
	var API = {
		get:    '/temp/get',
		list:   '/temp/getTempCList',
		remove: '/temp/removeTempC',
		copy:   '/temp/copyTempC'
	},
	tempId = CMS.getQueryValue('tempId')

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
						return `<a class="text-blue" href="/temp/itemEdit?tempId=${row.tempId}&id=${row.id}">编辑</a>
								<a class="text-blue" @click="rpRemove(row.tempId, row.id)">删除</a>
								<a class="text-blue" @click="rpCopy(row.tempId, row.id)">复制</a>
								<a class="text-blue" target="_blank" href="/api/temp/prevTempC?id=${row.id}">预览</a>`
					}
				}
			],
			removeModal: false,
			copyModal: false,
			listinfo: {
				search: {
					$tempId: tempId,
				},
				api: API.list
			},
			tempinfo: {},
			tempId: tempId || '',
			id: ''
		},
		methods: {
			rpRemove (tempId, id) {
				this.removeModal = true
				this.tempId = tempId
				this.id     = id
			},
			rpCopy (rpId, id) {
				this.copyModal = true
				this.tempId = tempId
				this.id     = id
			},
			rpRemoveFn () {
				CMS.http.post(API.remove, {
					tempId: this.tempId,
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
					tempId: this.tempId,
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
				CMS.http.get(API.get, { id: tempId }, function(o) {
					me.tempinfo = o.data
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
