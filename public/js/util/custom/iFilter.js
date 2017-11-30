(function(factory) {
	factory(jQuery, MJJS);
}(function($, MJJS) {
	"use strict";
	var T = {
		k: 'data-key="<%r.push(col.key);%>"',
		id: 'id="<%r.push(id);%>"',
		c: 'form-control',
		fg: 'form-group m-bot15 clearfix',
		i: '<input type="text"'
	};
	var TEMP = [
		// '<%if(1) debugger;%>',
		'<%var mf = this.mf,init = 0,ID = this.ID || mf._.ID;%>',
		'<%var params = this.params;var len = params.length;%>',
		'<%var color = {default:1,primary:1,success:1,info:1,warning:1,danger:1};%>',
		'<%var dir = {left:1,right:1};%>',
		'<div id="<%r.push(ID);%>" class="adv-search">',
		'<%if(len){%>',
			'<%for (var i = 0; i < len; i++) {%>',
				'<div class="row">',
				'<%var row = params[i];%>',
				'<%var len2 = row.length;%>',
				'<%for (var j = 0; j < len2; j++) {%>',
					'<%var col = row[j];%>',
					'<div class="col-sm-<%r.push(col.columns || 1);%>">',
						'<%var type = col.type || "text";%>',
						'<%if(!mf._[type]) mf._[type] = [];%>',
						'<%var id = col.ID || ID+"_"+(init++);mf._[type].push({ id: id, opts: col });%>',
						'<%if(type === "text"){%>',
							'<div '+T.id+' class="<%r.push(col.dir === "right"? "row": "");%>" style="float: <%r.push(col.dir || "left");%>; padding: 7px 0; border: 0;"><%r.push(col.text);%></div>',
						'<%}else if(type === "label"){%>',
							'<div '+T.id+' class="'+T.fg+' form-horizontal text-<%r.push(col.dir || "left");%>"><label class="control-label"><%r.push(col.name);%></label></div>',
						'<%}else if(type === "input"){%>',
							'<div '+T.id+' class="'+T.fg+'">'+T.i+' class="'+T.c+'" placeholder="<%r.push(col.placeholder);%>"></div>',
						'<%}else if(type === "button"){%>',
							'<a '+T.id+' class="btn btn-block m-bot15 btn-<%r.push((col.style in color)? col.style: "info");%>"><%r.push(col.name || "查询");%></a>',
						'<%}else if(type === "buttonGroup"){%>',
							'<%var btns = col.button,bLen = btns.length;%>',
							'<%if(bLen){%>',
								'<div '+T.id+' class="form_buttongroup m-bot15" data-style="<%r.push(col.style in color?"btn-"+col.style: "btn-info");%>" style="display: inline-block;">',
									'<%for (var o = 0; o < bLen; o++) {%>',
										'<%var btn = btns[o];%>',
										'<a class="btn btn-default" value="<%r.push(btn.value);%>"><%r.push(btn.name);%></a> ',
									'<%}%>',
								'</div>',
							'<%}%>',
						'<%}else if(type === "select"){%>',
							'<select '+T.id+' class="'+T.c+' m-bot15" value="<%r.push(col.default);%>">',
								'<%var opts = col.option,oLen = opts.length;%>',
								'<%if(oLen){%>',
									'<%for (var o = 0; o < oLen; o++) {%>',
										'<%var opt = opts[o];%>',
										'<%if(!opt.data){%>',
										'<option value="<%r.push(opt.value);%>"><%r.push(opt.name);%></option>',
										'<%}else{%>',
											'<%var group = opt.data,gLen = group.length;%>',
											'<%if(gLen){%>',
												'<optgroup label="<%r.push(opt.name);%>">',
												'<%for (var g = 0; g < gLen; g++) {%>',
													'<%var opt2 = group[g];%>',
													'<option value="<%r.push(opt2.value);%>"><%r.push(opt2.name);%></option>',
												'<%}%>',
												'</optgroup>',
											'<%}%>',
										'<%}%>',
									'<%}%>',
								'<%}%>',
							'</select>',
						'<%}else if(type === "inputSelect"){%>',
							'<div '+T.id+' class="input-group m-bot15">',
								'<%var iDir = col.dir in dir? col.dir: "left";%>',
								'<%if(iDir === "right"){%>',
									T.i+' class="'+T.c+'">',
								'<%}%>',
								'<div class="input-group-btn">',
									'<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"><span></span> <span class="caret"></span></button>',
									'<ul class="dropdown-menu">',
										'<%var option = col.option,oLen = option.length;%>',
										'<%for (var o = 0; o < oLen; o++) {%>',
											'<%var opt = option[o];%>',
											'<li><a key="<%r.push(opt.key);%>"><%r.push(opt.name);%></a></li>',
										'<%}%>',
									'</ul>',
								'</div>',
								'<%if(iDir === "left"){%>',
									T.i+' class="'+T.c+'" placeholder="<%r.push(col.defaultName);%>">',
								'<%}%>',
							'</div>',
						'<%}else if(type === "inputDate"){%>',
							'<div '+T.id+' class="form_datetime input-group date m-bot15">',
								T.i+' class="'+T.c+'" readonly placeholder="<%r.push(col.placeholder);%>">',
								'<span class="input-group-btn">',
									'<button type="button" class="btn date-set"><i class="fa fa-calendar"></i></button>',
								'</span>',
							'</div>',
						'<%}else if(type === "inputDateGroup"){%>',
							'<div '+T.id+' class="form_datetime input-group date m-bot15">',
								T.i+' class="checkin '+T.c+'" readonly placeholder="<%r.push(col.placeholder1 || col.placeholder);%>">',
								'<span class="input-group-addon"><%r.push((opt && opt.split) || "至");%></span>',
								T.i+' class="checkout '+T.c+'" readonly placeholder="<%r.push(col.placeholder2 || col.placeholder);%>">',
							'</div>',
						'<%}%>',
					'</div>',
					'<%}%>',
				'</div>',
			'<%}%>',
		'<%}%>',
		'</div>'].join('');
	var iFilter = function(opts) {
		var me = this;
		me._ = { ID: 'MJ_'+new Date().getTime() };
		opts.mf = me;

		// 模块解析
		me.analysis = function() {
			var html = MJJS.template.render(TEMP, opts);
			me.html(html);
		};
		// 事件绑定
		var _data = {};
		var bindEvent = {
			init: function(obj, opts) {
				for (var key in obj) {
					if (key !== 'ID') {
						var modular = obj[key];
						$.each(modular, function(i, e) {
							if (bindEvent[key]) bindEvent[key]($('#'+e.id), e.opts,  opts.reload);
						});
					}
				}
				$.isFunction(opts.load) && opts.load(bindEvent[obj.ID]);
			},
			input: function(p, o) {
				var ipt = p.find('input');
				_data[o.key] = ipt.val();
				ipt.on('keydown', function(e) {
					var key = e.keyCode || e.which;
					if (key === 13) {
						_data[o.key] = $(this).val();
						reload(o);
					}
				});
				ipt.on('blur', function() {
					_data[o.key] = $(this).val();
				});
			},
			select: function(p, o) {
				_data[o.key] = p.val();
				p.on('change', function(e) {
					_data[o.key] = $(this).val();
					reload(o, 1);
				});
			},
			inputSelect: function(p, o) {
				var ipt = p.find('input');
				var btn = p.find('.dropdown-toggle>span:first');
				var opt = p.find('a');
				var key = o.default || o.option[0].key;
				var name = p.find('a[key='+key+']').text();
				btn.html(name);
				ipt.attr({ placeholder: name });
				_data[key] = '';
				opt.on('click', function() {
					var val = ipt.val();
					name = $(this).text();
					key  = $(this).attr('key');
					$.each(o.option, function(i, e) {
						if (key !== e.key) delete _data[e.key];
					});
					btn.html(name);
					ipt.attr({ placeholder: name });
					_data[key] = val;
				});
				ipt.on('keydown', function(e) {
					var code = e.keyCode || e.which;
					if (code === 13) {
						_data[key] = $(this).val();
						reload(o);
					}
				});
				ipt.on('blur', function() {
					_data[key] = $(this).val();
				});
			},
			inputDate: function(p, o) {
				var id  = p[0].id;
				var ipt = p.find('input');
				_data[o.key] = ipt.val();
				MJJS.load(['timepicker'], function() {
					var opts = o.opts || {};
					opts.callback = function() {
						_data[o.key] = ipt.val();
						reload(o, 1, $('#'+id));
					}
					MJJS.ui.timepicker('#'+id, opts);
				});
			},
			setDate: function(e1, e2, diff, o) {
				var _e1 = e1, _e2 = e2, opts = o.opts1 || {};
				if (diff < 0) {
					_e1 = e2;
					_e2 = e1;
					opts = o.opts2 || {};
				}
				opts.callback = function() {
					var ed1 = $(_e1).val().parseDate().getTime(),
						ed2 = $(_e2).val().parseDate().getTime();
					if ((ed1 >= ed2 && diff >= 0) || (ed1 <= ed2 && diff <= 0)) {
						$(_e2).val($(_e1).val().parseDate().dateAdd('d', diff * (o.diff || 0)).format('yyyy-mm-dd'));
					}
					if ($(_e1).hasClass('checkin')) {
						_data[o.key1] = $(_e1).val();
						_data[o.key2] = $(_e2).val();
					} else {
						_data[o.key2] = $(_e1).val();
						_data[o.key1] = $(_e2).val();
					}
					reload(o, 1, $(_e1));
				};
				MJJS.ui.timepicker(_e1, opts);
			},
			inputDateGroup: function(p, o) {
				var me = this;
				var id = p[0].id;
				var cin = '#'+id+' .checkin';
				var cout = '#'+id+' .checkout';
				_data[o.key1] = $(cin).val();
				_data[o.key2] = $(cout).val();
				MJJS.load(['timepicker'], function() {
					me.setDate(cin, cout, 1, o);
					me.setDate(cin, cout, -1, o);
				});
			},
			button: function(p, o) {
				if (o.href) p.attr({href: o.href});
				p.on('click', function() {
					reload(o);
				});
			},
			buttonGroup: function(p, o) {
				var act = p.attr('data-style');
				var mode = o.mode;
				var btn  = p.find('a');
				var fn;
				_data[o.key] = o.default || '';
				if (o.default) {
					var s = o.default.split(',');
					$.each(s, function(i, e) {
						p.find('a[value='+e+']').addClass(act);
					});
				}
				if (mode === 'checkbox') {
					p.addClass('btn-group');
					fn = function(b) {
						if (b.hasClass(act)) b.removeClass(act)
						else b.addClass(act);
					}
				} else {
					fn = function(b) {
						btn.removeClass(act);
						b.addClass(act);
					}
				}
				btn.on('click', function() {
					var b = $(this);
					fn(b);
					var actb = p.find('.'+act);
					var val = [];
					actb.each(function(i, e) {
						val.push($(e).attr('value'));
					});
					_data[o.key] = val.join(',');
					reload(o, 1);
				});
			}
		};
		// 数据更新
		var rel = opts.reload;
		var reload = function(o, auto, dom) {
			$.isFunction(o.callback) && o.callback(_data);
			if (auto) o.auto && $.isFunction(rel) && rel(_data, dom)
			else $.isFunction(rel) && rel(_data, dom)
		};
		me.analysis();
		bindEvent.init(me._, opts);
	};
	$.fn.iFilter = iFilter;
	return $.fn.iFilter;
}));