(function($, window, undefined) {
	"use strict";
	if (!window._oTable_) window._oTable_ = {};
	var mj_dataTable = function(parent, opts) {
		this.init(parent, opts);
	}
	$.extend(mj_dataTable.prototype, {
		init: function(parent, opts) {
			this[opts.ID] = {
				_select_:         [],
				_input_:          [],
				_inputSelect_:    [],
				_inputDate_:      [],
				_inputDateGroup_: [],
				_button_:         [],
				_buttonGroup_:    []
			};
			this[opts.ID]._ID_ = 'MJ_'+this.random()+'_';

			this.analysis.init(parent, opts.params, opts.ID, this[opts.ID]);
			this.bindEvent.init(this[opts.ID]);
			this.datatable.init(parent, opts.datatable, this[opts.ID]);
		},
		random: function() {
			return ''+Math.round(Math.random()*12345*Math.random()*67890);
		},
		// DOM模板
		temp: {
			parent: '<div id="{ID}" class="adv-search">{row}</div>',
			row: '<div class="row">{col}</div>',
			col: '<div class="col-sm-{columns}">{content}</div>',
			select: {
				parent: '<select id="{ID}" class="form-control m-bot15" data-key="{key}" name="{key}" data-reload="{reload}">{option}</select>',
				optgroup: '<optgroup label="{name}">{option}</optgroup>',
				option: '<option value="{value}">{name}</option>'
			},
			text: '<div class="{isRow}" style="float: {dir}; padding: 7px 0; border: 0;" dataid= "{dataID}">{text}</div>',
			label: '<div class="form-group m-bot15 clearfix form-horizontal text-{dir}"><label class="control-label">{name}</label></div>',
			input: '<div class="form-group m-bot15 clearfix"><input id="{ID}" type="text" class="form-control" placeholder="{placeholder}" data-key="{key}" name="{key}"></div>',
			inputSelect: {
				parent: [
					'<div class="input-group m-bot15">',
						'{select_left}',
						'<input type="text" class="form-control" placeholder="{defaultName}">',
						'{select_right}',
					'</div>'
				].join(''),
				select: [
					'<div class="input-group-btn">',
						'<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"><span id="{ID}" data-key="{defaultKey}">{defaultName}</span> <span class="caret"></span></button>',
						'<ul class="dropdown-menu">',
							'{option}',
						'</ul>',
					'</div>'
				].join(''),
				option: '<li><a key="{key}">{name}</a></li>'
			},
			inputDate: [
				'<div id="{ID}" class="form_datetime input-group date m-bot15" data-key="{key}" name="{key}" data-opts=\"{opts}\" data-isload="{isload}">',
					'<input type="text" class="form-control" readonly placeholder="{placeholder}">',
					'<span class="input-group-btn">',
						'<button type="button" class="btn btn-success date-set"><i class="fa fa-calendar"></i></button>',
					'</span>',
				'</div>'
				].join(''),
			inputDateGroup: [
				'<div id="{ID}" class="form_datetime input-group date m-bot15" data-key="{key}" name="{key}" data-isload="{isload}">',
					'<input class="checkin form-control" type="text" class="form-control" readonly placeholder="{placeholder}" data-opts=\"{opts1}\" data-key="{key1}" name="{key1}">',
					'<span class="input-group-addon">{split}</span>',
					'<input class="checkout form-control" type="text" class="form-control" readonly placeholder="{placeholder}" data-opts=\"{opts2}\" data-key="{key2}" name="{key2}">',
				'</div>'
			].join(''),
			button: '<button id="{ID}" class="btn btn-block btn-{style}" type="button">{name}</button>',
			buttonGroup: {
				parent: '{title} <div id="{ID}" class="form_buttongroup m-bot15" data-key="{key}" name="{key}" data-mode="{mode}" data-defstyle="{defaultStyle}" data-actstyle="{activeStyle}" style="display: inline-block;">{button}</div>',
				button: '<button class="btn" type="button" data-value="{value}">{name}</button> '
			}
		},
		// 模块解析
		analysis: {
			init: function(parent, opts, ID, k) {
				if (typeof(parent) === 'string') {
					var temp = this.parent(opts, ID, k);
					$(parent).parents('.adv-table').eq(0).prepend(temp);
				}
			},
			_ID: function(me, name, opts, ID, k) {
				ID += me.random();
				k['_' + name + '_'].push({ id: ID, opts: opts });
				return ID;
			},
			parent: function(opts, ID, k) {
				var me = mj_dataTable.prototype;
				var temp = me.temp;
				var _str = [''];
				if (opts && opts.length) {
					var len = opts.length;
					_str = [];
					for (var i = 0; i < len; i++) {
						_str.push(this.row(opts[i], ID, k));
					}
				}
				var parent = temp.parent.substitute({
					ID: ID,
					row: _str.join('')
				});
				return parent;
			},
			row: function(opts, ID, k) {
				var temp = mj_dataTable.prototype.temp;
				var _str  = [''];
				if (opts && opts.length) {
					var len = opts.length;
					_str = [];
					for (var i = 0; i < len; i++) {
						_str.push(this.col(opts[i], ID, k));
					}
				}
				return temp.row.substitute({ col: _str.join('') });
			},
			col: function(opts, ID, k) {
				var temp    = mj_dataTable.prototype.temp;
				var content = this[opts.type]? this[opts.type](opts, temp[opts.type], ID, k): '';
				var col     = temp.col.substitute({
					columns: opts.columns || 1,
					content: content
				});
				return col;
			},
			each: function(option, temp) {
				var _option = [];
				if (option && option.length) {
					var len = option.length;
					_option = [];
					for (var i = 0; i < len; i++) {
						_option.push(temp.substitute(option[i]));
					}
				}
				return _option.join('');
			},
			text: function(opts, temp) {
				opts.dir = opts.dir || 'left';
				opts.isRow = opts.dir === 'right'? 'row': '';
				opts.dataid = opts.dataID;
				return temp.substitute(opts);
			},
			label: function(opts, temp) {
				opts.dir = opts.dir? opts.dir: 'left';
				return temp.substitute(opts);
			},
			select: function(opts, temp, ID, k) {
				var _this = this;
				var me = mj_dataTable.prototype;
				var ID = this._ID(me, 'select', opts, ID, k);
				var _option = [];
				$.each(opts.option, function(i, e) {
					if (!e.data) {
						_option.push(temp.option.substitute(e))
					} else {
						var _optgroup = [];
						var option = _this.each(e.data, temp.option);
						var optgroup = temp.optgroup.substitute({
							name: e.name,
							option: option
						});
						_optgroup.push(optgroup);
						_option.push(_optgroup.join(''));
					}
				});
				_option = _option.join('');
				return temp.parent.substitute({
					ID: ID,
					key: opts.key,
					reload: opts.reload === 0? 0: 1,
					// defaultValue: opts.option[0].value || '',
					option: _option
				});
			},
			input: function(opts, temp, ID, k) {
				var me = mj_dataTable.prototype;
				var ID = this._ID(me, 'input', opts, ID, k);
				opts.ID = ID;
				return temp.substitute(opts);
			},
			inputSelect: function(opts, temp, ID, k) {
				var me = mj_dataTable.prototype;
				var ID = this._ID(me, 'inputSelect', opts, ID, k);
				var dir = {
					defaultName: opts.option[0].name || ''
				};
				var option = this.each(opts.option, temp.option);
				var select = temp.select.substitute({
					ID: ID,
					defaultName: opts.option[0].name,
					defaultKey: opts.option[0].key,
					option: option
				});
				dir['select_' + (opts.dir || 'left')] = select;
				return temp.parent.substitute(dir);
			},
			inputDate: function(opts, temp, ID, k) {
				var me = mj_dataTable.prototype;
				var ID = this._ID(me, 'inputDate', opts, ID, k);
				var isload = !opts.isload? false: opts.isload;
				isload = isload === true? true: isload;
				opts.ID = ID;
				opts.isload = isload;
				opts.opts = MJJS.json.stringify(opts.opts).replace(/\"/g, '\'');
				return temp.substitute(opts);
			},
			inputDateGroup: function(opts, temp, ID, k) {
				var me = mj_dataTable.prototype;
				var ID = this._ID(me, 'inputDateGroup', opts, ID, k);
				var isload = !opts.isload? false: opts.isload;
				isload = isload === true? true: isload;
				opts.ID = ID;
				opts.isload = isload;
				opts.split = opts.split || '至';
				opts.opts1 = opts.opts1? MJJS.json.stringify(opts.opts1).replace(/\"/g, '\''): '';
				opts.opts2 = opts.opts2? MJJS.json.stringify(opts.opts2).replace(/\"/g, '\''): '';
				return temp.substitute(opts);	
			},
			button: function(opts, temp, ID, k) {
				var me = mj_dataTable.prototype;
				var ID = this._ID(me, 'button', opts, ID, k);
				opts.ID = ID;
				var color = {
					default: 1,
					primary: 1,	// 深蓝
					success: 1,	// 绿
					info: 1,	// 蓝
					warning: 1,	// 橙
					danger: 1	// 红
				};
				opts.style = (opts.style in color)? opts.style: 'info';
				opts.name = opts.name || '查询';
				return temp.substitute(opts);
			},
			buttonGroup: function(opts, temp, ID, k) {
				var me = mj_dataTable.prototype;
				var ID = this._ID(me, 'buttonGroup', opts, ID, k);
				var button = this.each(opts.button, temp.button);
				var color = {
					default: 1,
					primary: 1,	// 深蓝
					success: 1,	// 绿
					info: 1,	// 蓝
					warning: 1,	// 橙
					danger: 1	// 红
				};
				var mode = {
					checkbox: 1,
					radio: 1
				};
				var defaultStyle = opts.defaultStyle
				var group = temp.parent.substitute({
					ID: ID,
					key: opts.key,
					mode: (opts.mode in mode)? opts.mode: 'radio',
					defaultStyle: (opts.defaultStyle in color)? 'btn-'+opts.defaultStyle: 'btn-default',
					activeStyle: (opts.activeStyle in color)? 'btn-'+opts.activeStyle: 'btn-info',
					button: button
				});
				return group;
			}
		},
		// 事件绑定
		bindEvent: {
			init: function(k) {
				this.select(k);
				this.input(k);
				this.inputSelect(k);
				this.inputDate(k);
				this.inputDateGroup(k);
				this.button(k);
				this.buttonGroup(k);
			},
			select: function(k) {
				var me = mj_dataTable.prototype;
				var id = k._select_;
				$.each(id, function(i, e) {
					var _ = $('#'+e.id);
					var reload = ~~(_.attr('data-reload'));
					if (reload) {
						_.on('change', function() {
							k._oTable_._fnPageChange(0);
							k._oTable_._fnAjaxUpdate();
						});
					}
				});
			},
			input: function() {
				// var me = mj_dataTable.prototype;
				// var id = k._input_;
			},
			inputSelect: function(k) {
				var me = mj_dataTable.prototype;
				var id = k._inputSelect_;
				$.each(id, function(i, e) {
					var _ = $('#'+e.id);
					var parent = _.parents('.input-group').eq(0);
					var opts   = parent.find('a');
					var ipt    = parent.find('input');
					opts.on('click', function() {
						var name = $(this).text();
						_.html(name);
						ipt.attr({ placeholder: name });
					});
				});
			},
			inputDate: function(k) {
				var me = mj_dataTable.prototype;
				var id = k._inputDate_;
				if (id.length) {
					MJJS.load(['timepicker'], function() {
						$.each(id, function(i, e) {
							var _ = $('#'+e.id);
							var isload = _.attr('data-isload');
							if (isload === 'true') {
								MJJS.ui.timepicker('#'+e.id, {
									callback: function() {
										k._oTable_._fnPageChange(0);
										k._oTable_._fnAjaxUpdate();
									}
								});
							} else {
								MJJS.ui.timepicker('#'+e.id);
							}
						});
					});
				}
			},
			// 设置开始|结束日期
			setDate: function(e1, e2, diff, callback) {
				var _e1 = e1, _e2 = e2;
				if (diff < 0) {
					_e1 = e2;
					_e2 = e1;
				}
				MJJS.ui.timepicker(_e1, {
					callback: function() {
						var ed1 = $(_e1).val().parseDate().getTime(),
							ed2 = $(_e2).val().parseDate().getTime();
						if ((ed1 > ed2 && diff > 0) || (ed1 < ed2 && diff < 0)) {
							$(_e2).val($(_e1).val().parseDate().dateAdd('d', diff).format('yyyy-mm-dd'));
						}
						typeof(callback) === 'function' && callback();
					}
				});
			},
			inputDateGroup: function(k) {
				var me = mj_dataTable.prototype;
				var that = this;
				var id = k._inputDateGroup_;
				if (id.length) {
					MJJS.load(['timepicker'], function() {
						$.each(id, function(i, e) {
							var _ = $('#'+e.id);
							var e1 = '#'+e.id+' .checkin';
							var e2 = '#'+e.id+' .checkout';
							that.setDate(e1, e2, 1, e.opts.callback);
							that.setDate(e1, e2, -1, e.opts.callback);
						});
					});
				}
			},
			button: function(k) {
				var me = mj_dataTable.prototype;
				var id = k._button_;
				$.each(id, function(i, e) {
					var _ = $('#'+e.id);
					var _opts = e.opts;
					var reload = 1;
					if(_opts.reload === 0){
						reload = 0;
					}
					_.on('click', function() {	
						if (reload) {
							k._oTable_._fnPageChange(0);
							k._oTable_._fnAjaxUpdate();
						}
						typeof(_opts.callback) === 'function' && _opts.callback(_);
					});
				});
			},
			buttonGroup: function(k) {
				var me = mj_dataTable.prototype;
				var id = k._buttonGroup_;
				if (id.length) {
					$.each(id, function(i, e) {
						var _ = $('#'+e.id);
						var _opts = e.opts;
						var btns   = _.find('.btn');
						var defstyle = _.attr('data-defstyle');
						var actstyle = _.attr('data-actstyle');
						var mode = _.attr('data-mode');
						btns.addClass(defstyle);
						var modeFn;
						if (mode === 'radio') {
							modeFn = function(__) {
								btns.removeClass(actstyle);
								__.addClass(actstyle);
								_.attr('data-value', __.attr('data-value'));
							}
						} else if (mode === 'checkbox') {
							_.addClass('btn-group');
							modeFn = function(__) {
								if (__.hasClass(actstyle)) __.removeClass(actstyle);
								else __.addClass(actstyle);
								var actBtn = _.find('.'+actstyle);
								var len = actBtn.length;
								var val = [];
								$.each(actBtn, function(j, f) {
									val.push($(f).attr('data-value'));
								});
								_.attr('data-value', val.join(','));
							}
						}
						btns.on('click', function() {
							var btn = $(this);
							modeFn(btn);
							typeof(_opts.callback) === 'function' && _opts.callback(btn);
							k._oTable_._fnPageChange(0);
							k._oTable_._fnAjaxUpdate();
						});
					});
				}
			}
		},
		datatable: {
			init: function(parent, opts, k) {
				var me = mj_dataTable.prototype;
				if (!opts.url || typeof(parent) !== 'string') return;
				var me     = mj_dataTable.prototype;
				var _this  = this;
				var url    = opts.url;
				var type   = opts.type || 'GET';
				var isArray =  opts.isArray || false;
				var data   = {
					searching: false,
					processing: true,
					serverSide: true,
					bLengthChange: false,
					pageLength: opts.pageLength || 10,
					ordering: opts.sort || false,
					ajax: {
						url: url,
						type: type,
						data: function(d) {
							$.isFunction(opts.init) && opts.init(d, k);
							_this.select(d, k);
							_this.input(d, k);
							_this.inputSelect(d, k);
							_this.inputDate(d, k);
							_this.inputDateGroup(d, k);
							_this.buttonGroup(d, k);
							$.isFunction(opts.data) && opts.data(d, k);
						}
					},
					pagingType: 'simple_numbers',
					language: {
						paginate: {
							'previous': '<i class="fa fa-chevron-left"></i>',
							'next': '<i class="fa fa-chevron-right"></i>'
						},
						zeroRecords: opts.searchEmpty || '搜索不到数据'
					}
				};
				if (!isArray && opts.columns) {
					data.columns = this.columns(opts.columns);
					data.columnDefs = this.columnDefs(opts.columnDefs);
				}
				k._oTable_ = $(parent)
				.on('init.dt', function () {
					k._oTable_.removeAttr('style');
					$.isFunction(opts.load) && opts.load(k._oTable_);
				})
				.on('draw.dt', function () {
					$.isFunction(opts.draw) && opts.draw(k._oTable_);
				})
				.dataTable(data);
				window._oTable_[parent.substr(1)] = k._oTable_;
			},
			columns: function(columns) {
				if (columns && columns.length) {
					var len = columns.length;
					var arr = [];
					$.each(columns, function(i, e) {
						arr.push({ data: e });
					});
					return arr;
				}
			},
			columnDefs: function(columns) {
				if (columns && columns.length) {
					var len = columns.length;
					var arr = [];
					$.each(columns, function(i, e) {
						arr.push({
							targets: e.index,
							width: e.width,
							render: function (data, type, full) {
								if (e.temp) {
									return e.temp.substitute(full);
								} else if (typeof(e.render) === 'function') {
									return e.render(full);
								}
							}
						});
					});
					return arr;
				}
			},
			select: function(d, k) {
				var me = mj_dataTable.prototype;
				var id = k._select_;
				$.each(id, function(i, e) {
					var _ = $('#'+e.id);
					d[_.attr('data-key')] = _.val();
				});
			},
			input: function(d, k) {
				var me = mj_dataTable.prototype;
				var id = k._input_;
				$.each(id, function(i, e) {
					var _ = $('#'+e.id);
					d[_.attr('data-key')] = _.val();
					_.on('keydown', function(event) {
						var code = event.keyCode || evt.which;
						if (code === 13) {
							k._oTable_._fnPageChange(0);
							k._oTable_._fnAjaxUpdate();
						}
					});
				});
			},
			inputSelect: function(d, k) {
				var me = mj_dataTable.prototype;
				var id = k._inputSelect_;
				$.each(id, function(i, e) {
					var _ = $('#'+e.id);
					var parent = _.parents('.input-group').eq(0);
					var ipt    = parent.find('input');
					d[_.attr('data-key')] = ipt.val();
					ipt.on('keydown', function(event) {
						var code = event.keyCode || evt.which;
						if (code === 13) {
							k._oTable_._fnPageChange(0);
							k._oTable_._fnAjaxUpdate();
						}
					});
				});
			},
			inputDate: function(d, k) {
				var me = mj_dataTable.prototype;
				var id = k._inputDate_;
				$.each(id, function(i, e) {
					var _ = $('#'+e.id);
					var ipt    = _.find('input');
					d[_.attr('data-key')] = ipt.val();
				});
			},
			inputDateGroup: function(d, k) {
				var me = mj_dataTable.prototype;
				var id = k._inputDateGroup_;
				$.each(id, function(i, e) {
					var _ = $('#'+e.id);
					var st = _.find('.checkin');
					var ed = _.find('.checkout');
					if (st.val()) d[st.attr('data-key')] = st.val();
					if (ed.val()) d[ed.attr('data-key')] = ed.val();
				});
			},
			buttonGroup: function(d, k) {
				var me = mj_dataTable.prototype;
				var id = k._buttonGroup_;
				if (id.length) {
					$.each(id, function(i, e) {
						var _ = $('#'+e.id);
						var btns = _.find('.'+_.attr('data-actstyle'));
						if (!btns.length) return;
						d[_.attr('data-key')] = _.attr('data-value');
					});
				}
			}
		}
	});

	MJJS.define('MJJS.ui.custom.datatable', function (parent, opts) {
		new mj_dataTable(parent, opts);
	});

})(jQuery, window);