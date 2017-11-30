(function($, window, undefined) {
	"use strict";
	var mj_highcharts = function(parent, opts) {
		this.init(parent, opts);
	}
	$.extend(mj_highcharts.prototype, {
		init: function(parent, opts) {
			this.__.opts = {
				lang: {
					loading: "加载中...",
					months: "1月,2月,3月,4月,5月,6月,7月,8月,9月,10月,11月,12月".split(","),
					shortMonths: "1月,2月,3月,4月,5月,6月,7月,8月,9月,10月,11月,12月".split(","),
					weekdays: "星期日,星期一,星期二,星期三,星期四,星期五,星期六".split(","),
					decimalPoint: ".",
					numericSymbols: "k,M,G,T,P,E".split(","),
					resetZoom: "恢复缩放",
					resetZoomTitle: "恢复图表",
					noData:"没有数据",
					printChart:"打印图表",
					thousandsSep: " "
				},
				credits: {
					enabled: false
				},
				chart: {
					animation: false,
					events: {}
				},
				title: {
					x: 0
				},
				subtitle: {
					x: 0
				},
				xAxis: {
					title: { text: '' },
					tickColor: 'rgba(0,0,0,0)',
					labels: {
						enabled: false
					}
				},
				yAxis: [{
					title: { text: '' },
					labels: {
						enabled: false
					}
				}, {
					title: { text: '' },
					labels: {
						enabled: false
					}
				}],
				tooltip: {
					shared: true,
					crosshairs: true
				},
				legend: {
					enabled: false,
					x: 0,
					y: 0
				},
				plotOptions: {},
				series: []
			};
			this.analysis.init(opts, this);
			$(parent).highcharts(this.__.opts);
		},
		__: {},
		// 模块解析
		analysis: {
			init: function(opts) {
				this[opts.type || 'line'](opts);
			},
			opts: function(opts) {
				var me = mj_highcharts.prototype;
				var _opts = me.__.opts;
				_opts.chart.type = opts.type;
				_opts.chart.animation = opts.animation? true: false;
				_opts.title.text = opts.title || '';
				_opts.subtitle.text = opts.subtitle || '';
				if (opts.tooltip) {
					_opts.tooltip.formatter = function() {
						var strArr = [];
						var t = opts.tooltipTitle? opts.tooltipTitle.substitute(this): '';
						strArr.push(t);
						if (this.points) {
							$.each(this.points, function(i, e) {
								if (typeof(opts.tooltip) === 'string') {
									strArr.push(opts.tooltip.substitute(e));
								} else if (typeof(opts.tooltip) === 'object') {
									strArr.push(opts.tooltip[i].substitute(e));
								}
							});
						} else {
							strArr.push(opts.tooltip.substitute(this))
						}
						return strArr.join('');
					}
				}
				if (opts.legend) {
					_opts.legend.enabled = true;
					switch (opts.legend.x) {
						case 1:
							_opts.legend.align = 'left';
							break;
						case 3:
							_opts.legend.align = 'right';
							break;
						case 2:
						default:
							_opts.legend.align = 'center';
					}
					switch (opts.legend.y) {
						case 1:
							_opts.legend.verticalAlign = 'tooltip';
							break;
						case 2:
							_opts.legend.verticalAlign = 'middle';
							break;
						case 3:
						default:
							_opts.legend.verticalAlign = 'bottom';
					}
					switch (opts.legend.layout) {
						case 'y':
							_opts.legend.layout = 'vertical';
							break;
						case 'x':
						default:
							_opts.legend.layout = 'horizontal';
					}
				}
				if (opts.data) {
					_opts.series = opts.data;
				}
				if (opts.x) {
					_opts.xAxis.labels.enabled = true;
					_opts.xAxis.title.text = opts.x.title || '';
					if (opts.x.data) _opts.xAxis.categories = opts.x.data;
				}
				if (opts.y) {
					var len = opts.y.length;
					len = len>2? 2: len;
					if (len === 2) {
						_opts.series[0].yAxis = 0;
						_opts.series[1].yAxis = 1;
						_opts.yAxis[1].opposite = true;
					}
					$.each(opts.y, function(i, e) {
						_opts.yAxis[i].labels.enabled = true;
						_opts.yAxis[i].title.text = opts.y[i].title || '';
						_opts.yAxis[i].min = opts.y[i].min? opts.y[i].min: 0;
						_opts.yAxis[i].max = opts.y[i].max? opts.y[i].max: null;
						if (opts.y[i].format) {_opts.yAxis[i].labels.formatter = function() {
								return opts.y[i].format.substitute(this);
							}
						}
					});
				}
				if (typeof(opts.load)==='function') {
					_opts.chart.events.load = function() {
						opts.load(this);
					}
				}
			},
			line: function(opts) {
				var me = mj_highcharts.prototype;
				var _opts = me.__.opts;
				opts.animation = opts.amime || false;
				this.opts(opts);
			},
			area: function(opts) {
				var me = mj_highcharts.prototype;
				var _opts = me.__.opts;
				opts.animation = opts.amime || false;
				this.opts(opts);
			},
			pie: function(opts) {
				var me = mj_highcharts.prototype;
				var _opts = me.__.opts;
				opts.animation = opts.amime || true;
				this.events(_opts.plotOptions, 'pie.point.events', opts.events);
				/**
				 * 2016-09-20 去除opts.data冲突参数
				 */
				// opts.data = [
				// 	{
				// 		type: 'pie',
				// 		allowPointSelect: true,
				// 		innerSize: opts.pieInner || '0',
				// 		data: opts.data
				// 	}
				// ];
				this.opts(opts);
			},
			column: function(opts) {
				var me = mj_highcharts.prototype;
				var _opts = me.__.opts;
				opts.animation = opts.amime || false;
				this.opts(opts);
			},
			events: function(obj, split, events) {
				if (events) {
					var split = split.split('.');
					var len = split.length;
					var newObj = obj;
					for (var i = 0; i < len; i++) {
						if (!obj[split[i]]) newObj = newObj[split[i]] = {}
					}
					for (var p in events) {
						if (typeof(events[p])==='function') {
							newObj[p] = function() {
								events[p](this);
							}
						}
					}
				}
			}
		}
	});

	MJJS.define('MJJS.ui.custom.highcharts', function (parent, opts) {
		new mj_highcharts(parent, opts);
	});

})(jQuery, window);