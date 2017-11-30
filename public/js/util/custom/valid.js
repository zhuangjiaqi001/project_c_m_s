(function($, window, undefined) {
	"use strict";
	var ico_err = '<i class="fa fa-exclamation-circle"></i>';
	var temp = {
		err: function(name, opts) {
			var data = {
				message: ico_err + '请输入正确的' + name
			}
			if (opts) {
				if (opts.regexp) data.regexp = opts.regexp;
				if (opts.message) data.message = opts.message;
				if (opts.field) data.field = opts.field;
				if (opts.remote) data.remote = opts.remote;
			}
			return data
		},
		empty: function(name) {
			return {
				message: ico_err + name + '不能为空'
			}
		},
		max: function(name, max) {
			return {
				max: max,
				message: ico_err + '请输入' + max + '字符以内的' + name
			}
		},
		min: function(name, min) {
			return {
				min: min,
				message: ico_err + '请输入不少于' + min + '字符的' + name
			}
		},
		range: function(name, max, min) {
			return {
				min: min,
				max: max,
				message: ico_err + '请输入' + min + '-' + max + '字符的' + name
			}
		},
		only: function(num) {
			return {
				min: num,
				message: ico_err + '至少选择 ' + num + ' 个'
			}
		},
		read: function(name) {
			return {
				message: ico_err  + '请阅读并勾选' + name
			}
		}
	};
	var fields = {
		/* 申请API接入 */
		// 联系人姓名
		// name: {
		// 	validators: {
		// 		notEmpty: temp.empty('联系人姓名'),
		// 		stringLength: temp.max('联系人姓名', 10),
		// 		regexp: temp.err('联系人姓名', {
		// 			regexp: /^[A-Za-z \u4E00-\u9FA5\.]+$/
		// 		})
		// 	}
		// },
		// // 联系人电话
		// phone: {
		// 	validators: {
		// 		notEmpty: temp.empty('联系人电话'),
		// 		stringLength: temp.max('联系人电话', 20),
		// 		regexp: temp.err('联系人电话', {
		// 			regexp: /^((0\d{2,3}-\d{7,8})|(1[3|4|5|7|8]\d{9}))$/
		// 		})
		// 	}
		// },
		// // 联系人邮箱
		// email: {
		// 	validators: {
		// 		notEmpty: temp.empty('邮件地址'),
		// 		emailAddress: temp.err('邮件地址')
		// 	}
		// },
		// // 接入广告样式
		// style: {
		// 	validators: {
		// 		choice: temp.only(1)
		// 	}
		// },
		// // 预计日接入流量
		// flow: {
		// 	validators: {
		// 		notEmpty: temp.empty('预计日接入流量'),
		// 		integer: temp.err('数字')
		// 	}
		// },
		// // CPM预期
		// cpm: {
		// 	validators: {
		// 		integer: temp.err('数字')
		// 	}
		// },
		// /* 添加应用 */
		// // 应用名称
		// appname: {
		// 	validators: {
		// 		notEmpty: temp.empty('应用名称'),
		// 		stringLength: temp.max('应用名称', 20),
		// 		remote: {
		// 			url: MJJS.server.api + '/app/checkName',
		// 			data: function(o){
		// 				return {
		// 					name: o._cacheFields.appname.val()
		// 				}
		// 			},
		// 			condition: function(o) {
						
		// 				o.valid = !Number(o.data);
		// 				return o;
		// 			},
		// 			message: ico_err + '该应用名称已存在'
		// 		}
		// 	}
		// },
		// // 应用简介
		// appdescribe: {
		// 	validators: {
		// 		notEmpty: temp.empty('应用简介'),
		// 		stringLength: temp.max('应用简介', 100)
		// 	}
		// },
		// // Bundle ID
		// bundle: {
		// 	validators: {
		// 		notEmpty: temp.empty('Bundle ID')
		// 	}
		// },
		// // Package Name
		// package: {
		// 	validators: {
		// 		notEmpty: temp.empty('Package Name')
		// 	}
		// },
		// // API Bundle ID
		// 'apibundle[]': {
		// 	validators: {
		// 		notEmpty: temp.empty('Bundle ID')
		// 	}
		// },
		// /* 添加网站 */
		// // 域名
		// domain: {
		// 	validators: {
		// 		notEmpty: temp.empty('域名'),
		// 		regexp: temp.err('', {
		// 			regexp: /^[A-Za-z0-9_]+(\.(com|cn|net))$/,
		// 			message: ico_err + '请输入正确的域名，如：example.com'
		// 		}),
		// 		condition: {
		// 			fun: function(o) {
		// 				return $.isFunction(window.checkd)? window.checkd(o): o;
		// 			},
		// 			message: ico_err + '请输入正确的广告位地址'
		// 		},
		// 		remote: {
		// 			url: MJJS.server.api + '/domain/checkdomain',
		// 			condition: function(o) {
		// 				return $.isFunction(window.checkdomain)? window.checkdomain(o): o;
		// 			},
		// 			message: ico_err + '请输入正确的域名，如：example.com'
		// 		}
		// 	}
		// },
		// // 内部流量域名
		// domainin: {
		// 	validators: {
		// 		notEmpty: temp.empty('域名'),
		// 		regexp: temp.err('', {
		// 			regexp: /^[A-Za-z0-9_]+(\.(com|cn|net))$/,
		// 			message: ico_err + '请输入正确的域名，如：example.com'
		// 		})
		// 	}
		// },
		// // 网站名称
		// webname: {
		// 	validators: {
		// 		notEmpty: temp.empty('网站名称'),
		// 		stringLength: temp.max('网站名称', 20),
		// 		remote: {
		// 			url: MJJS.server.api + '/app/h5/checkName',
		// 			data: function(o){
		// 				return {
		// 					name: o._cacheFields.webname.val()
		// 				}
		// 			},
		// 			condition: function(o) {
		// 				o.valid = !Number(o.data);
		// 				return o;
		// 			},
		// 			message: ico_err + '该网站名称已存在'
		// 		}
		// 	}
		// },
		// // 网站简介
		// webdescribe: {
		// 	validators: {
		// 		notEmpty: temp.empty('网站简介'),
		// 		stringLength: temp.max('网站简介', 100)
		// 	}
		// },
		// /*h5添加广告位*/
		// //广告位名称
		// adname: {
		// 	validators: {
		// 		notEmpty: temp.empty('广告位名称'),
		// 		stringLength: temp.max('广告位名称', 20),
		// 		remote: {
		// 			url: MJJS.server.api + '/adloc/checkName',
		// 			data: function(o){
		// 				console.log(o._cacheFields)
		// 				return{
		// 					name: o._cacheFields.adname.val(),
		// 					id: o._cacheFields.adaddress.attr('adid'),
		// 					siteId: o._cacheFields.adname.attr('siteid')
		// 				}	
		// 			},
		// 			condition: function(o) {
		// 				o.valid = !Number(o.data);
		// 				//if (!o.valid) o.message = '广告位名称不可以重复,请更换广告位名称';
		// 				return o;
		// 			}
		// 		}
		// 	}
		// },
		// //广告位地址
		// adaddress: {
		// 	validators: {
		// 		notEmpty: temp.empty('广告位地址'),
		// 		condition: {
		// 			fun: function(o) {
		// 				return $.isFunction(window.checkaddress)? window.checkaddress(o): o;
		// 			},
		// 			message: ico_err + '请输入正确的广告位地址'
		// 		}
		// 	}
		// },
		// /* 注册 */
		// //注册邮箱
		// regEmail: {
		// 	validators: {
		// 		notEmpty: temp.empty('注册邮箱'),
		// 		regexp: temp.err('', {
		// 			regexp: /^([_a-zA-Z\d\-\.])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/,
		// 			message: ico_err + '请输入正确的邮件地址，如：123@example.com'
		// 		}),
		// 		remote: {
		// 			url: MJJS.server.api + '/publisher/isRepeat',
		// 			data: function(v) {
		// 				return {
		// 					registerName: v._cacheFields.regEmail.val()
		// 				}
		// 			},
		// 			condition: function(o) {
		// 				o.valid = !o.data.is_repeat;
		// 				if (!o.valid) o.message = '该邮箱已注册';
		// 				return o;
		// 			},
		// 			message: ico_err + '请输入正确的邮件地址，如：123@example.com'
		// 		}
		// 	}
		// },
		// //密码
		// passwordFirst: {
		// 	validators: {
		// 		notEmpty: temp.empty('密码'),
		// 		stringLength: temp.range('密码', 16, 6),
		// 		identical: temp.err('密码',{
		// 			field: 'passwordSecond',
		// 			message: ico_err + '两次输入的'+ name +'不一致'
		// 		}),
		// 		regexp: temp.err('密码', {
		// 			regexp: /^[a-zA-Z0-9_\.]+$/,
		// 			message: ico_err + name + '不能包含除字母数字和._以外的非法字符'
		// 		})
		// 	}
		// },
		// //确认密码
		// passwordSecond: {
		// 	validators: {
		// 		notEmpty: temp.empty('密码'),
		// 		stringLength: temp.range('密码', 16, 6),
		// 		identical: temp.err('密码',{
		// 			field: 'passwordFirst',
		// 			message: ico_err + '两次输入的'+ name +'不一致'
		// 		}),
		// 		regexp: temp.err('密码', {
		// 			regexp: /^[a-zA-Z0-9_\.]+$/,
		// 			message: ico_err + name + '不能包含除字母数字和._以外的非法字符'
		// 		})
		// 	}
		// },
		// //邮编
		// postCode: {
		// 	validators: {
		// 		regexp: temp.err('邮编', {
		// 			regexp: /^[1-9]\d{5}(?!\d)$/
		// 		})
		// 	}
		// },
		// //checkbox
		// checkbox: {
		// 	validators: {
		// 		notEmpty: temp.read('《盟聚开发者协议》', {
		// 			message: ''
		// 		})
		// 	}
		// },
		//客户名称
		ClientName: {
			validators: {
				notEmpty: temp.empty('客户名称'),
				stringLength: temp.max('客户名称', 20),
				// remote: {
				// 	url: MJJS.server.api + '/adloc/checkName',
				// 	data: function(o){
				// 		console.log(o._cacheFields)
				// 		return{
				// 			name: o._cacheFields.ClientName.val()
				// 		}	
				// 	},
				// 	condition: function(o) {
				// 		o.valid = !Number(o.data);
				// 		//if (!o.valid) o.message = '客户已存在，无法创建商机';
				// 		return o;
				// 	}
				// }
			}
		},
		//联系电话
		contactTel: {
			validators: {
				notEmpty: temp.empty('联系人电话'),
				stringLength: temp.max('联系人电话', 20),
				regexp: temp.err('联系人电话', {
					regexp: /^(1[3|4|5|7|8]\d{9})$/
				})
			}
		},
		//联系人姓名
		contactName: {
			validators: {
				notEmpty: temp.empty('联系人姓名'),
				stringLength: temp.max('联系人姓名', 10),
				regexp: temp.err('联系人姓名', {
					regexp: /^[A-Za-z \u4E00-\u9FA5\.]+$/
				})				
			}
		},
		//行业
		industry: {
			validators: {
				notEmpty: temp.read('行业', {
		 			message: ''
		 		})
			}
		},

		//联系人QQ
		contactQQ: {
			validators: {
				regexp: temp.err('QQ号', {
					regexp: /^[1-9][0-9]{4,19}$/
				})
			}
		},
		//邮箱
		Email: {
			validators: {
				regexp: temp.err('', {
					regexp: /^([_a-zA-Z\d\-\.])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/,
					message: ico_err + '请输入正确的邮件地址，如：123@example.com'
				})
			}
		},
		//固定电话fixedTel
		fixedTel: {
			validators: {
				stringLength: temp.max('联系人电话', 20),
				regexp: temp.err('联系人电话', {
					regexp: /^(0\d{2,3}-\d{7,8})$/
				})
			}
		},
		//地址
		address: {
			validators: {
				stringLength: temp.max('联系人地址', 50)
			}
		},
		//备注
		describe: {
			validators: {
				stringLength: temp.max('备注', 50)
			}
		}
	};
	$.extend(MJJS.form.valid, {
		// 获取对应的模块的校验规则
		filter: function() {
			if (!arguments.length) return false;
			var arr, obj = {};
			if($.isArray(arguments[0])) {
				arr = arguments[0];
			} else {
				arr = arguments;
			}
			$.each(arr, function(i, e) {
				if (fields[e]) obj[e] = fields[e];
			});
			return obj;
		},
		// 添加校验规则
		addField: function(valid, value) {
			if (!valid || !value) return false;
			var arr = [];
			if ($.isArray(value)) {
				arr = value;
			} else {
				arr.push(value);
			}
			$.each(arr, function(i, name) {
				if (fields[name]) valid.addField(name, fields[name]);
			});
		},
		// 删除校验规则
		removeField: function(valid, value) {
			if (!valid || !value) return false;
			var arr = [];
			if ($.isArray(value)) {
				arr = value;
			} else if (typeof(value) === 'string') {
				arr.push(value);
			} else {
				return false;
			}
			$.each(arr, function(i, name) {
				if (fields[name]) valid.removeField(name);
			});
		},
		revalidate: function(valid, value) {
			if (!valid || !value) return false;
			var arr = [];
			if ($.isArray(value)) {
				arr = value;
			} else if (typeof(value) === 'string') {
				arr.push(value);
			} else {
				return false;
			}
			$.each(arr, function(i, name) {
				if (fields[name]) valid.revalidateField(name);
			});
		},
		// 重置校验规则
		resetField: function(valid, value) {
			if (!valid || !value) return false;
			if (!(value instanceof Object) || $.isEmptyObject(value)) return false;
			for (var name in value) {
				if (fields[name]) {
					var ele = value[name];
					if (ele instanceof Object && !$.isEmptyObject(ele)) {
						valid.resetField(name, ele);
					}
				}
			}
		},
		// 获取form表单对应name的数据
		getData: function(form, value) {
			if (!form || !value) return false;
			var arr = [];
			var obj = {};
			if ($.isArray(value)) {
				arr = value;
			} else if (typeof(value) === 'string') {
				arr.push(value);
			} else {
				return false;
			}
			$.each(arr, function(i, name) {
				var ipt = $(form).find('[name="'+name+'"]');
				if (!ipt.length) return;
				var tag  = ipt.eq(0).tagName();
				var type = ipt.eq(0).attr('type');
				var tagFn = {
					input: function(type) {
						try {
							typeFn[type](name);
						} catch (err) {
							console.log(err.message);
						}
					},
					select: function() {
						obj[name] = ipt.val();
					},
					textarea: function() {
						obj[name] = ipt.val();
					}
				};
				var typeFn = {
					text: function() {
						if(ipt.length > 1) {
							var arr2 = [];
							$.each(ipt, function(j, f) {
								if (f.value.trim()) arr2.push(f.value);
							});
							obj[name] = arr2.join(',');
						} else {
							obj[name] = ipt.val();
						}
					},
					radio: function(name) {
						var _ipt = $(form).find('[name="'+name+'"]:checked');
						obj[name] = _ipt.val();
					},
					checkbox: function(name) {
						var _ipt = $(form).find('[name="'+name+'"]:checked');
						var arr2 = [];
						$.each(_ipt, function(j, f) {
							arr2.push(f.value);
						});
						obj[name] = arr2.join(',');
					}
				};
				try {
					tagFn[tag](type);
				} catch (err) {
					console.log(err.message);
				}
			});
			return obj;
		}
	});

})(jQuery, window);