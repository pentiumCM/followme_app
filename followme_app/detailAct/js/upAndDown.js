(function($) {
	var old = $.fn.swipe;

	$.fn.swipe = function(option) {
		var opt = {
			'up': $.noop,
			'down': $.noop
		};

		if($.type(option) == 'string') {
			switch(option.toLowerCase()) {
				case 'up':
					if(this.data('opt').up && $.isFunction(this.data('opt').up)) {
						this.data('opt').up.call(this);
					}
					break;
				case 'down':
					if(this.data('opt').down && $.isFunction(this.data('opt').down)) {
						this.data('opt').down.call(this);
					}
					break;
				default:
					break;
			}

			return this;
		} else if($.isPlainObject(option)) {
			var clone = {};

			//大小写不敏感处理
			$.each(option, function(k, v) {
				clone[k.toLowerCase()] = v;
			});

			$.extend(opt, clone);

			return this.each(function(index, ele) {
				//敏感距离
				var dis = 120;
				//各元素赋值，备直接触发时用
				$(ele).data('opt', $.extend({}, opt)).on('touchstart mousedown', function(e) {
					var ev = e.type == 'touchstart' ? e.originalEvent.touches[0] : e,
						startX = ev.pageX,
						startY = ev.pageY,
						startLeft = $(this).position().left,
						startTop = $(this).position().top,
						start = {
							left: startLeft,
							top: startTop
						},
						disX = startX - startLeft,
						disY = startY - startTop;

					$(document).on('touchmove.swipe.founder mousemove.swipe.founder', function(e) {
						var ev = e.type == 'touchmove' ? e.originalEvent.touches[0] : e;

						if(opt.up != $.noop || opt.down != $.noop) {
							$(ele).css('top', ev.pageY - disY - $(ele).offsetParent().offset().top + 'px');
						}

						e.preventDefault();
					});

					$(document).on('touchend.swipe.founder mouseup.swipe.founder', function(e) {
						var ev = e.type == 'touchend' ? e.originalEvent.changedTouches[0] : e,
							endX = ev.pageX,
							endY = ev.pageY,
							x = Math.abs(endX - startX),
							y = Math.abs(endY - startY),
							direction = null;

						//必须在指定dis大小外，消除敏感距离
						direction = x >= y ? (endX < startX ? (Math.abs(endX - startX) > dis ? 'left' : null) : (Math.abs(endX - startX) > dis ? 'right' : null)) : (endY < startY ? (Math.abs(endY - startY) > dis ? 'up' : null) : (Math.abs(endY - startY) > dis ? 'down' : null));

						switch(direction) {
							case 'up':
								if(opt.up && $.isFunction(opt.up)) {
									opt.up.call(ele);
								}
								break;
							case 'down':
								if(opt.down && $.isFunction(opt.down)) {
									opt.down.call(ele);
								}
								break;
							default:
								//复位
								$(ele).animate({
									'left': start.left + 'px',
									'top': start.top + 'px'
								});
								break;
						}

						$(document).off('.swipe.founder');
					});
				});
			});
		} else {
			throw new Error('%E5%8F%82%E6%95%B0%E9%94%99%E8%AF%AF！');
		}
	};

	$.fn.swipe.noConflict = function() {
		$.fn.swipe = old;
		return this;
	};
	
	$("body").swipe({
	up: function() {
		alert('下一条视频');
	},
	down: function() {
		alert('上一条视频');
	}
});

})(jQuery);

