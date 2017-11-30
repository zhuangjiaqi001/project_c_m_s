(function(global, VM, CMS) {
	var VUE = new Vue(CMS.extend(VM, {
		data: {
			infos: [{
				color: 'aqua',
				icon:  'fa fa-image',
				name:  '图片推荐位',
				data:  '90,540'
			},
			{
				color: 'red',
				icon:  'fa fa-file-text',
				name:  '文本推荐位',
				data:  '41,410'
			},
			{
				color: 'green',
				icon:  'fa fa-send',
				name:  '落地页',
				data:  '760'
			}]
		}
	}))
}(window, window.VM, window.CMS))
