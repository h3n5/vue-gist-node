/***********************
厦门宏瓒信息科技有限公司
************************/ 

;(function($, window, undefined)
{
	"use strict";
	
	$(document).ready(function()
	{
			
		// Sidebar Toggle
		$('a[data-toggle="sidebar"]').each(function(i, el)
		{
			$(el).on('click', function(ev)
			{
				ev.preventDefault();
				
				if(public_vars.$sidebarMenu.hasClass('collapsed'))
				{
					public_vars.$sidebarMenu.removeClass('collapsed');
					public_vars.$mainContent.removeClass('main-content-collapsed');
					ps_init();
				}
				else
				{
					public_vars.$sidebarMenu.addClass('collapsed');
					public_vars.$mainContent.addClass('main-content-collapsed');
					ps_destroy();
				}
				
				$(window).trigger('xenon.resize');
			});
		});
		
	
	
		
		
		// Popovers and tooltips
		$('[data-toggle="popover"]').each(function(i, el)
		{
			var $this = $(el),
				placement = attrDefault($this, 'placement', 'right'),
				trigger = attrDefault($this, 'trigger', 'click'),
				popover_class = $this.get(0).className.match(/(popover-[a-z0-9]+)/i);
			
			$this.popover({
				placement: placement,
				trigger: trigger
			});

			if(popover_class)
			{
				$this.removeClass(popover_class[1]);				
				
				$this.on('show.bs.popover', function(ev)
				{
					setTimeout(function()
					{
						var $popover = $this.next();						
						$popover.addClass(popover_class[1]);
						
					}, 0);
				});
			}
		});
		
		$('[data-toggle="tooltip"]').each(function(i, el)
		{
			var $this = $(el),
				placement = attrDefault($this, 'placement', 'top'),
				trigger = attrDefault($this, 'trigger', 'hover'),
				tooltip_class = $this.get(0).className.match(/(tooltip-[a-z0-9]+)/i);
			
			$this.tooltip({
				placement: placement,
				trigger: trigger
			});
			
			if(tooltip_class)
			{
				$this.removeClass(tooltip_class[1]);
				
				$this.on('show.bs.tooltip', function(ev)
				{
					setTimeout(function()
					{
						var $tooltip = $this.next();						
						$tooltip.addClass(tooltip_class[1]);
						
					}, 0);
				});
			}
		});
		
	});
	
})(jQuery, window);