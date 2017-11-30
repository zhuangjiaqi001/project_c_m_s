(function(factory) {
	factory(jQuery, window);
}(function($, window) {
	"use strict";
	var TEMP = {
		table: [
			// '<%if(1) debugger;%>',
			'<tbody>',
			'<%for(var i=0,len=this.length;i<len;i++){%>',
				'<tr>',
				'<%var tr=this[i];%>',
				'<%for(var j=0,jLen=tr.length;j<jLen;j++){%>',
				'<td><%r.push(tr[j]);%></td>',
				'<%}%>',
				'</tr>',
			'<%}%>',
			'</tbody>'
			].join(''),
		empty: '<tbody><tr><td align="center" colspan="<%this.col%>"><%this.content%></td></tr></tbody>',
		page: {
			prev: '<a class="iTable-page-prev<%if(!this.prev) r.push(\' disabled\');%>"><i class="icon-left"></i></a>',
			next: '<a class="iTable-page-next<%if(!this.next) r.push(\' disabled\');%>"><i class="icon-right"></i></a>',
			node: [
				'<%for(var i=0,len=this.arr.length;i<len;i++){%>',
					'<%var cur=this.arr[i];%>',
					'<a class="iTable-page-btn<%if(this.current===cur) r.push(\' current\');%>"><%cur%></a>',
				'<%}%>'
				].join(''),
			es: '<b>...</b>'
		},
		info: '总共 <%this.total%> 条 当前为第 <%this.current%> 页'
	};
	var objFind = function(path, o) {
		var len = path.length;
		if (len) {
			var da = o;
			for (var i = 0; i < len; i++) {
				da = da[path[i]];
			}
			return da;
		} else return false;
	}
	var iTable = function (options) {
		var me = this;

		var defaultOpts  = options.default || {};
		var startKey     = defaultOpts.startKey || 'start';
		var pageKey      = defaultOpts.pageKey  || 'page';
		var sizeKey      = defaultOpts.sizeKey  || 'size';
		var successKey   = defaultOpts.successKey   || 'code';
		var successValue = defaultOpts.successValue || '0000';
		var dataPath     = (defaultOpts.dataPath  || 'data').split('.');
		var totalPath    = (defaultOpts.totalPath || 'data.total').split('.');
		
		// 初始化
		me._fnInit = function() {
			var defOpts  = {};
			defOpts[startKey] = 0;
			defOpts[pageKey]  = 1;
			defOpts[sizeKey]  = 10;

			me._data = {};
			me._parent = me.parent();
			me.addClass('iTable');

			var type = options.type || 2;
			if (type === 1) {
				me._data[startKey] = options.start || defOpts[startKey];
			} else if (type === 2) {
				me._data[pageKey] = options.page || defOpts[pageKey];
			} else {
				me._data[pageKey] = options.page || defOpts[pageKey];
			}
			me._data[sizeKey]  = options.size || defOpts[sizeKey];
			me._fnAjaxUpdate();
			$.isFunction(options.load) && options.load(me);
		};
		// 页面切换
		me._fnPageChange = function (page) {
			var type = options.type || 2;
			if (type === 1) {
				var len = me._data[sizeKey];
				me._data[startKey] = (page-1) * len;
			} else if (type === 2) {
				me._data[pageKey] = page;
			}
		};
		// 获取数据
		me._fnAjaxUpdate = function() {
			$.isFunction(options.data) && options.data(me._data);
			var d = me._data;
			$.ajax({
				url: options.url,
				type: options.requestType || 'get',
				data: d,
				success: function(o) {
					if (o[successKey] === successValue) {
						var da = [];
						me._fnTableRender(objFind(dataPath, o));
						me._fnInfoRender(objFind(totalPath, o), d);
						me._fnPageRender(objFind(totalPath, o), d);
						me._fnPageEvent();
						$.isFunction(options.draw) && options.draw();
					} else {
						$.isFunction(options.error) && options.error(o);
					}
				},
				error: function(err) {
					$.isFunction(options.error) && options.error(err);
				}
			});
		};
		// 列表渲染
		me._fnTableRender = function(list) {
			var html = '';
			me.find('tbody').remove();
			var len = list? list.length: 0;
			var columns = options.columns;
			var cLen    = columns.length;
			if (len) {
				var nList = [];
				var render = options.render;
				for (var i = 0; i < len; i++) {
					var tr = list[i];
					var trList = [];
					if (columns && cLen) {
						for (var j=0; j<cLen; j++) {
							var key = columns[j];
							var val = render[j]? render[j](tr): tr[key];
							trList.push(val);
						}
					}
					nList.push(trList);
				}
				html = MJJS.template.render(TEMP.table, nList);
				me.find('tbody').remove();
			} else {
				html = MJJS.template.render(TEMP.empty, {
					content: options.searchEmpty || '搜索不到数据',
					col: cLen
				});
			}
			me.append(html);
		};
		// 分页详情
		me._fnInfoRender = function(total, d) {
			var pages  = Math.ceil(total/(me._data[sizeKey]));
			var current  = d[pageKey] || 1;
			var info = TEMP.info;
			var temp = '<div class="iTable-info">'+(options.info || info)+'</div>';
			var html = MJJS.template.render(temp, {
				total: total,		// 总数据
				pages: pages,		// 总页数
				current: current	// 当前页数
			});
			me._parent.find('.iTable-info').remove();
			me._parent.append(html);
		};
		// 分页渲染
		me._fnPageRender = function(total, d) {
			me._parent.find('.iTable-page').remove();
			var pages  = Math.ceil(total/(me._data[sizeKey]));
			var current  = d[pageKey] || 1;
			if (!pages) return;
			var temp = TEMP.page;
			var defaults = {
				total: total,
				prev: 0,
				next: 0
			};
			if (current > 1) defaults.prev = 1;
			if (current < pages) defaults.next = 1;
			var nObj = { current: current };
			var node = [];
			if (pages < 8) {
				nObj.arr = new Array(pages).fill().map(function(__,_){return _+1});
				node.push(MJJS.template.render(temp.node, nObj));
			} else {
				if (current < 5) {
					var pv = current+2<5? 5: current+2;
					nObj.arr = new Array(pv).fill().map(function(__,_){return _+1});
					node.push(MJJS.template.render(temp.node, nObj));
					node.push(temp.es);
					nObj.arr = [pages];
					node.push(MJJS.template.render(temp.node, nObj));
				} else if (current > pages-4) {
					var pv = pages-current+2<5? 5: pages-current+3;
					nObj.arr = [1];
					node.push(MJJS.template.render(temp.node, nObj));
					node.push(temp.es);
					nObj.arr = new Array(pv).fill().map(function(__,_){return _+pages-pv+1});
					node.push(MJJS.template.render(temp.node, nObj));
				} else {
					nObj.arr = [1];
					node.push(MJJS.template.render(temp.node, nObj));
					node.push(temp.es);
					nObj.arr = new Array(5).fill().map(function(__,_){return _+current-2});
					node.push(MJJS.template.render(temp.node, nObj));
					node.push(temp.es);
					nObj.arr = [pages];
					node.push(MJJS.template.render(temp.node, nObj));
				}
			}
			node = node.join('');
			var prev = MJJS.template.render(temp.prev, defaults);
			var next = MJJS.template.render(temp.next, defaults);
			var html = '<div class="iTable-page">'+prev+'<span>'+node+'</span>'+next+'</div>';
			me._parent.append(html);
		};
		// 分页事件绑定
		me._fnPageEvent = function() {
			var page = me._parent.find('.iTable-page');
			var current = ~~(page.find('a.current').text());
			var node = page.find('span>a').not('.current');
			var prev = page.find('a.iTable-page-prev').not('.disabled');
			var next = page.find('a.iTable-page-next').not('.disabled');
			if (node.length) {
				node.on('click', function() {
					var cur = ~~($(this).text());
					me._fnPageJump(cur);
				});
			}
			if (prev.length) prev.on('click', function() { me._fnPageJump(--current); });
			if (next.length) next.on('click', function() { me._fnPageJump(++current); });
		};
		// 分页跳转
		me._fnPageJump = function(page) {
			me._fnPageChange(page);
			me._fnAjaxUpdate();
		}
		me._fnInit();
	};
	$.fn.iTable = iTable;
	return $.fn.iTable;
}));