(function($, window, undefined) {
	"use strict";

	var mj_wizard = function(parent, opts) {
		this.init(parent, opts);
	}
	$.extend(mj_wizard.prototype, {
		init: function(parent, opts) {
			this.render.init(parent, opts);
			this.bindEvent(parent, opts);
		},
		__: {
			current: 'current-step',
			tab: '.block-tabby li',
			block: '.block-container fieldset',
			button: []
		},
		// DOM模板
		temp: {
			btn: '<p class="wizard-btn"></p>',
			prev: '<a id="{ID}" href="javascript:;" class="button-back btn btn-info">{prev}</a>',
			next: '<a id="{ID}" href="javascript:;" class="button-next btn btn-info">{next}</a>',
			finish: '<a id="{ID}" href="javascript:;" class="finish btn btn-info btn-extend">{finish}</a>'
		},
		render: {
			init: function(parent, opts) {
				var me    = mj_wizard.prototype,
					id    = parent.substr(1),
					tab   = $(parent).find(me.__.tab),
					block = $(parent).find(me.__.block),
					len   = tab.length;
				$(parent).find('wizard-btn').remove();
				block.append(me.temp.btn);
				block.each(function(i, e) {
					var p = $(e).find('.wizard-btn');
					tab.eq(i).attr({ id: id + '_tab_' + i });
					$(e).attr({ id: id + '_fieldset_' + i });
					if (i) {
						p.append(me.temp.prev.substitute({
							prev: opts.prev || '上一步',
							ID: id + '_prev_' + (i-1)
						}));
						var b = '#'+id+'_tab_'+(i-1)+',#'+id+'_prev_'+(i-1);
					}
					if (i == len-1) {
						p.append(me.temp.finish.substitute({
							finish: opts.finish || '完成',
							ID: id + '_finish'
						}));
					}
					if (i < len-1) {
						p.append(me.temp.next.substitute({
							next: opts.next || '下一步',
							ID: id + '_next_' + (i+1)
						}));
					}
					if (i == 0) {
						me.__.button.push('#'+id+'_tab_'+i+',#'+id+'_prev_'+i);
					} else if (i == len-1) {
						me.__.button.push('#'+id+'_tab_'+i+',#'+id+'_next_'+i);
					} else {
						me.__.button.push('#'+id+'_tab_'+i+',#'+id+'_next_'+i+',#'+id+'_prev_'+i);
					}
				});
				//console.log(me.__.button);
			}
		},
		bindEvent: function(parent, opts) {
			var me    = mj_wizard.prototype,
				tab   = $(parent).find(me.__.tab),
				block = $(parent).find(me.__.block);
			$.each(me.__.button, function(i, e) {
				$(e).bind('click', function() {
					tab.removeClass(me.__.current);
					block.hide();
					if (opts.button) {
						if (typeof(opts.button[i].click) === 'function') {
							opts.button[i].click($(this));
							var validation = true;
							if (typeof(opts.button[i].validation) === 'function') {
								validation = opts.button[i].validation();
							}
							if (validation) {
								tab.eq(i).addClass(me.__.current);
								block.eq(i).show();
							}
						}
					} else {
						tab.eq(i).addClass(me.__.current);
						block.eq(i).show();
					}
				});
			});
			$(parent+'_finish').bind('click', function() {
				if (typeof(opts.callback)==='function') opts.callback();
			});
		}
	});

	MJJS.define('MJJS.page.custom.wizard', function (parent, opts) {
		new mj_wizard(parent, opts);
	});

})(jQuery, window);