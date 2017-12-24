(function(global, VM, CMS) {
	var API = '/user/list';

	CMS.getDataList(API);

	var USER = new Vue(CMS.extend(VM, {
		data: {
			columns: [
				{
					title: '头像',
					key: 'avatar',
					render: (row, col, idx) => {
						console.log(row)
						return `<img class="img-circle img-bordered-sm" width="32" height="32" src="${row.avatar}">`;
					}
				},
				{
					title: '用户名',
					key: 'loginname'
				},
				{
					title: '邮箱',
					key: 'email'
				},
				{
					title: '级别',
					key: 'levelName',
					sortable: 'custom'
				},
				{
					title: '创建时间',
					key: 'createdAt',
					sortable: true
				},
				{
					title: '操作',
					key: '',
					render: (row, col, idx) => {
						return `<a class="btn-xs"><i class="fa fa-edit"></i></a>`;
					}
				}
			],
			dataList: [],
			total: 0,
			pageSize: 10,
			current: 1,
			search: {
				loginname: '',
				email: ''
			},
			sort: ''
		},
		methods: {
		}
	}));

}(window, window.VM, window.CMS));
