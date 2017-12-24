(function(global, VM, CMS) {
	var API = {
		list:    '/imgrp/getImgRPList',
		remove:  '/imgrp/removeImgRP',
		release: '/imgrp/releaseImgRP',
		offline: '/imgrp/offlineImgRP'
	}

	CMS.getDataList(API.list)

	var Modal = {
		release: 'handleRelease',
		refresh: 'handleRelease',
		remove:  'handleRemove',
		offline: 'handleOffline'
	}

	global.VUE = new Vue(CMS.extend(VM, {
		data: {
			columns: [
				{
					title: '推荐位名称',
					key: 'name',
					render: (row, col, idx) => {
						return `<a class="text-blue" href="/imgrp/list?rpId=${row.id}">${row.name}</a>
								<a class="text-blue" href="/imgrp/edit?rpId=${row.id}"><i class="fa fa-edit"></i></i></a>`
					}
				},
				{
					title: '推荐位KEY',
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
						return `<a class="text-blue" href="/imgrp/edit?rpId=${row.id}">编辑</i></a>
								<a class="text-blue" @click="handleModal(`+(row.active? `'refresh'`: `'release'`)+`, row.id, row.hash)">`+(row.active? `刷新`: `发布`)+`</a>
								<a class="text-blue" @click="handleModal('remove', row.id)">删除</a> `
						+ (row.active? `<a class="text-blue" @click="handleModal('offline', row.id)">下线</a> <a class="text-blue" href="/apig/rp/img?k=${row.hash}" target="_blank">API</a>`: ``)
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
			rpId: ''
		},
		methods: {
			handleModal (name, id, hash) {
				this.ModalName = name
				this.rpId = id
				this.Modal = true
				if (hash) VUE.api = location.origin + '/apig/rp/img?k=' + hash
			},
			// 模态框操作 (发布|删除|下线)
			handleCtrl () {
				var fn = this[Modal[this.ModalName]]
				fn && fn()
			},
			handleRemove () {
				CMS.http.post(API.remove, { id: this.rpId }, function(o) {
					console.log(o)
					VUE.$Message.success('成功!')
					CMS.getDataList(API.list)
				}, function(err) {
					VUE.$Message.warning(err.message)
				})
			},
			handleRelease () {
				CMS.http.post(API.release, { id: this.rpId }, function(o) {
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
				CMS.http.post(API.offline, { id: this.rpId }, function(o) {
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
