(function(global, VM, CMS) {
	var API = {
		get:    '/imgrp/get',
		list:   '/imgrp/getImgRPCList',
		remove: '/imgrp/removeImgRPC',
		copy:   '/imgrp/copyImgRPC'
	},
	rpId = CMS.getQueryValue('rpId')

	global.VUE = new Vue(CMS.extend(VM, {
		data: {
			visible: false,
			columns: [
				{
					title: '图片',
					key: 'imageUrl',
					render: (row, col, idx) => {
						return `<div class="upload-list">
									<div class="bgimg bgimg_100" :style="'background-image: url(${row.imageUrl})'"></div>
									<div class="upload-list-cover">
										<Icon type="ios-eye-outline" @click.native="handleView(row.imageUrl)"></Icon>
									</div>
								</div>`
					}
				},
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
						return `<a class="text-blue" href="/imgrp/itemEdit?rpId=${row.rpId}&id=${row.id}">编辑</a>
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
			// 图片上传相关
			handleView (url) {
				this.imgPrev = url
				this.visible = true
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
