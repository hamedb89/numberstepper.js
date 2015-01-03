var jquery = require('jquery')

+function($){
	'use strict'

	/**
	 * NumberStepper Public Declaration
	 * @param element
	 * @param options
	 */
	var NumberStepper = function(element, options){
		var $e = $(element),
			self = this
		this.$element = $e
		this.options = $.extend({}, NumberStepper.DEFAULTS, options)
		this.valueElement = $e.find('.number').first()
		this.touched = false

		$e.find('.number').first().on('focus blur change keyup', function(e){
			var $this = $(this),
				val = $this.val()


			if (val.match(/\D/gi))
				$this.val(val.replace(/\D/gi, ""))
		})
		.on('blur', function(e){
			if (parseInt($(this).val()) < self.options.minValue)
				$(this).val(self.options.minValue)
		})

		$e.find('.plus, .minus')
			.on('mousedown touchstart', function(e){
				var $this = $(this),
				value = $this.data('number')

				self.calcNumber(value)

				this.touched = setInterval(function(){
					self.calcNumber(value)
				}, 100)
				e.preventDefault()
			}).on('mouseleave mouseup touchend', function(e){
				clearInterval(this.touched)
				this.touched = false

				e.preventDefault()
			})

	}

	NumberStepper.prototype.calcNumber = function(number){
		var currentValue = parseInt(this.getValue())
		if (currentValue != undefined )
			this.setValue(currentValue+number)
	}

	NumberStepper.prototype.getValue = function(){
		var val = this.valueElement.val()
		return ($.isNumeric(val))? val : this.options.minValue;
	}

	NumberStepper.prototype.setValue = function(value){
		if (value >= this.options.minValue)
			this.valueElement.val(value)
	}

	NumberStepper.DEFAULTS = {
		minValue: 50
	}

	function Plugin(option){
		return this.each(function(){
			var $this = $(this)
			var data = $this.data('ks.numberStepper')
			var options = typeof option == 'object' && option

			if (!data) $this.data('ks.numberStepper', (data = new NumberStepper(this, options)))
		})
	}

	var old = $.fn.numberStepper

	$.fn.numberStepper = Plugin
	$.fn.numberStepper.Constructor = NumberStepper

	$.fn.numberStepper.noConflict = function(){
		$.fn.numberStepper = old
		return this
	}

	$(function(){
		$('.number-stepper').each(function(){
			Plugin.call($(this), $(this).data())
		})
	})
}(jQuery)