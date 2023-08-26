/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.js":
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
 *  Bootstrap TouchSpin - v4.3.0
 *  A mobile and touch friendly input spinner component for Bootstrap 3 & 4.
 *  http://www.virtuosoft.eu/code/bootstrap-touchspin/
 *
 *  Made by István Ujj-Mészáros
 *  Under Apache License v2.0 License
 */
(function(factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__("jquery")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
}(function($) {
  'use strict';

  var _currentSpinnerId = 0;

  $.fn.TouchSpin = function(options) {

    var defaults = {
      min: 0, // If null, there is no minimum enforced
      max: 100, // If null, there is no maximum enforced
      initval: '',
      replacementval: '',
      firstclickvalueifempty: null,
      step: 1,
      decimals: 0,
      stepinterval: 100,
      forcestepdivisibility: 'round', // none | floor | round | ceil
      stepintervaldelay: 500,
      verticalbuttons: false,
      verticalup: '+',
      verticaldown: '-',
      verticalupclass: '',
      verticaldownclass: '',
      prefix: '',
      postfix: '',
      prefix_extraclass: '',
      postfix_extraclass: '',
      booster: true,
      boostat: 10,
      maxboostedstep: false,
      mousewheel: true,
      buttondown_class: 'btn btn-primary',
      buttonup_class: 'btn btn-primary',
      buttondown_txt: '-',
      buttonup_txt: '+',
      callback_before_calculation: function(value) {
        return value;
      },
      callback_after_calculation: function(value) {
        return value;
      }
    };

    var attributeMap = {
      min: 'min',
      max: 'max',
      initval: 'init-val',
      replacementval: 'replacement-val',
      firstclickvalueifempty: 'first-click-value-if-empty',
      step: 'step',
      decimals: 'decimals',
      stepinterval: 'step-interval',
      verticalbuttons: 'vertical-buttons',
      verticalupclass: 'vertical-up-class',
      verticaldownclass: 'vertical-down-class',
      forcestepdivisibility: 'force-step-divisibility',
      stepintervaldelay: 'step-interval-delay',
      prefix: 'prefix',
      postfix: 'postfix',
      prefix_extraclass: 'prefix-extra-class',
      postfix_extraclass: 'postfix-extra-class',
      booster: 'booster',
      boostat: 'boostat',
      maxboostedstep: 'max-boosted-step',
      mousewheel: 'mouse-wheel',
      buttondown_class: 'button-down-class',
      buttonup_class: 'button-up-class',
      buttondown_txt: 'button-down-txt',
      buttonup_txt: 'button-up-txt'
    };

    return this.each(function() {

      var settings,
        originalinput = $(this),
        originalinput_data = originalinput.data(),
        _detached_prefix,
        _detached_postfix,
        container,
        elements,
        value,
        downSpinTimer,
        upSpinTimer,
        downDelayTimeout,
        upDelayTimeout,
        spincount = 0,
        spinning = false;

      init();

      function init() {
        if (originalinput.data('alreadyinitialized')) {
          return;
        }

        originalinput.data('alreadyinitialized', true);
        _currentSpinnerId += 1;
        originalinput.data('spinnerid', _currentSpinnerId);

        if (!originalinput.is('input')) {
          console.log('Must be an input.');
          return;
        }

        _initSettings();
        _setInitval();
        _checkValue();
        _buildHtml();
        _initElements();
        _hideEmptyPrefixPostfix();
        _bindEvents();
        _bindEventsInterface();
      }

      function _setInitval() {
        if (settings.initval !== '' && originalinput.val() === '') {
          originalinput.val(settings.initval);
        }
      }

      function changeSettings(newsettings) {
        _updateSettings(newsettings);
        _checkValue();

        var value = elements.input.val();

        if (value !== '') {
          value = Number(settings.callback_before_calculation(elements.input.val()));
          elements.input.val(settings.callback_after_calculation(Number(value).toFixed(settings.decimals)));
        }
      }

      function _initSettings() {
        settings = $.extend({}, defaults, originalinput_data, _parseAttributes(), options);
      }

      function _parseAttributes() {
        var data = {};
        $.each(attributeMap, function(key, value) {
          var attrName = 'bts-' + value + '';
          if (originalinput.is('[data-' + attrName + ']')) {
            data[key] = originalinput.data(attrName);
          }
        });
        return data;
      }

      function _destroy() {
        var $parent = originalinput.parent();

        stopSpin();

        originalinput.off('.touchspin');

        if ($parent.hasClass('bootstrap-touchspin-injected')) {
          originalinput.siblings().remove();
          originalinput.unwrap();
        }
        else {
          $('.bootstrap-touchspin-injected', $parent).remove();
          $parent.removeClass('bootstrap-touchspin');
        }

        originalinput.data('alreadyinitialized', false);
      }

      function _updateSettings(newsettings) {
        settings = $.extend({}, settings, newsettings);

        // Update postfix and prefix texts if those settings were changed.
        if (newsettings.postfix) {
          var $postfix = originalinput.parent().find('.bootstrap-touchspin-postfix');

          if ($postfix.length === 0) {
            _detached_postfix.insertAfter(originalinput);
          }

          originalinput.parent().find('.bootstrap-touchspin-postfix .input-group-text').text(newsettings.postfix);
        }

        if (newsettings.prefix) {
          var $prefix = originalinput.parent().find('.bootstrap-touchspin-prefix');

          if ($prefix.length === 0) {
            _detached_prefix.insertBefore(originalinput);
          }

          originalinput.parent().find('.bootstrap-touchspin-prefix .input-group-text').text(newsettings.prefix);
        }

        _hideEmptyPrefixPostfix();
      }

      function _buildHtml() {
        var initval = originalinput.val(),
          parentelement = originalinput.parent();

        if (initval !== '') {
          initval = settings.callback_after_calculation(Number(initval).toFixed(settings.decimals));
        }

        originalinput.data('initvalue', initval).val(initval);
        originalinput.addClass('form-control');

        if (parentelement.hasClass('input-group')) {
          _advanceInputGroup(parentelement);
        }
        else {
          _buildInputGroup();
        }
      }

      function _advanceInputGroup(parentelement) {
        parentelement.addClass('bootstrap-touchspin');

        var prev = originalinput.prev(),
          next = originalinput.next();

        var downhtml,
          uphtml,
          prefixhtml = '<span class="input-group-addon input-group-prepend bootstrap-touchspin-prefix input-group-prepend bootstrap-touchspin-injected"><span class="input-group-text">' + settings.prefix + '</span></span>',
          postfixhtml = '<span class="input-group-addon input-group-append bootstrap-touchspin-postfix input-group-append bootstrap-touchspin-injected"><span class="input-group-text">' + settings.postfix + '</span></span>';

        if (prev.hasClass('input-group-btn') || prev.hasClass('input-group-prepend')) {
          downhtml = '<button class="' + settings.buttondown_class + ' bootstrap-touchspin-down bootstrap-touchspin-injected" type="button">' + settings.buttondown_txt + '</button>';
          prev.append(downhtml);
        }
        else {
          downhtml = '<span class="input-group-btn input-group-prepend bootstrap-touchspin-injected"><button class="' + settings.buttondown_class + ' bootstrap-touchspin-down" type="button">' + settings.buttondown_txt + '</button></span>';
          $(downhtml).insertBefore(originalinput);
        }

        if (next.hasClass('input-group-btn') || next.hasClass('input-group-append')) {
          uphtml = '<button class="' + settings.buttonup_class + ' bootstrap-touchspin-up bootstrap-touchspin-injected" type="button">' + settings.buttonup_txt + '</button>';
          next.prepend(uphtml);
        }
        else {
          uphtml = '<span class="input-group-btn input-group-append bootstrap-touchspin-injected"><button class="' + settings.buttonup_class + ' bootstrap-touchspin-up" type="button">' + settings.buttonup_txt + '</button></span>';
          $(uphtml).insertAfter(originalinput);
        }

        $(prefixhtml).insertBefore(originalinput);
        $(postfixhtml).insertAfter(originalinput);

        container = parentelement;
      }

      function _buildInputGroup() {
        var html;

        var inputGroupSize = '';
        if (originalinput.hasClass('input-sm')) {
          inputGroupSize = 'input-group-sm';
        }

        if (originalinput.hasClass('input-lg')) {
          inputGroupSize = 'input-group-lg';
        }

        if (settings.verticalbuttons) {
          html = '<div class="input-group ' + inputGroupSize + ' bootstrap-touchspin bootstrap-touchspin-injected"><span class="input-group-addon input-group-prepend bootstrap-touchspin-prefix"><span class="input-group-text">' + settings.prefix + '</span></span><span class="input-group-addon bootstrap-touchspin-postfix input-group-append"><span class="input-group-text">' + settings.postfix + '</span></span><span class="input-group-btn-vertical"><button class="' + settings.buttondown_class + ' bootstrap-touchspin-up ' + settings.verticalupclass + '" type="button">' + settings.verticalup + '</button><button class="' + settings.buttonup_class + ' bootstrap-touchspin-down ' + settings.verticaldownclass + '" type="button">' + settings.verticaldown + '</button></span></div>';
        }
        else {
          html = '<div class="input-group bootstrap-touchspin bootstrap-touchspin-injected"><span class="input-group-btn input-group-prepend"><button class="' + settings.buttondown_class + ' bootstrap-touchspin-down" type="button">' + settings.buttondown_txt + '</button></span><span class="input-group-addon bootstrap-touchspin-prefix input-group-prepend"><span class="input-group-text">' + settings.prefix + '</span></span><span class="input-group-addon bootstrap-touchspin-postfix input-group-append"><span class="input-group-text">' + settings.postfix + '</span></span><span class="input-group-btn input-group-append"><button class="' + settings.buttonup_class + ' bootstrap-touchspin-up" type="button">' + settings.buttonup_txt + '</button></span></div>';
        }

        container = $(html).insertBefore(originalinput);

        $('.bootstrap-touchspin-prefix', container).after(originalinput);

        if (originalinput.hasClass('input-sm')) {
          container.addClass('input-group-sm');
        }
        else if (originalinput.hasClass('input-lg')) {
          container.addClass('input-group-lg');
        }
      }

      function _initElements() {
        elements = {
          down: $('.bootstrap-touchspin-down', container),
          up: $('.bootstrap-touchspin-up', container),
          input: $('input', container),
          prefix: $('.bootstrap-touchspin-prefix', container).addClass(settings.prefix_extraclass),
          postfix: $('.bootstrap-touchspin-postfix', container).addClass(settings.postfix_extraclass)
        };
      }

      function _hideEmptyPrefixPostfix() {
        if (settings.prefix === '') {
          _detached_prefix = elements.prefix.detach();
        }

        if (settings.postfix === '') {
          _detached_postfix = elements.postfix.detach();
        }
      }

      function _bindEvents() {
        originalinput.on('keydown.touchspin', function(ev) {
          var code = ev.keyCode || ev.which;

          if (code === 38) {
            if (spinning !== 'up') {
              upOnce();
              startUpSpin();
            }
            ev.preventDefault();
          }
          else if (code === 40) {
            if (spinning !== 'down') {
              downOnce();
              startDownSpin();
            }
            ev.preventDefault();
          }
        });

        originalinput.on('keyup.touchspin', function(ev) {
          var code = ev.keyCode || ev.which;

          if (code === 38) {
            stopSpin();
          }
          else if (code === 40) {
            stopSpin();
          }
        });

        originalinput.on('blur.touchspin', function() {
          _checkValue();
          originalinput.val(settings.callback_after_calculation(originalinput.val()));
        });

        elements.down.on('keydown', function(ev) {
          var code = ev.keyCode || ev.which;

          if (code === 32 || code === 13) {
            if (spinning !== 'down') {
              downOnce();
              startDownSpin();
            }
            ev.preventDefault();
          }
        });

        elements.down.on('keyup.touchspin', function(ev) {
          var code = ev.keyCode || ev.which;

          if (code === 32 || code === 13) {
            stopSpin();
          }
        });

        elements.up.on('keydown.touchspin', function(ev) {
          var code = ev.keyCode || ev.which;

          if (code === 32 || code === 13) {
            if (spinning !== 'up') {
              upOnce();
              startUpSpin();
            }
            ev.preventDefault();
          }
        });

        elements.up.on('keyup.touchspin', function(ev) {
          var code = ev.keyCode || ev.which;

          if (code === 32 || code === 13) {
            stopSpin();
          }
        });

        elements.down.on('mousedown.touchspin', function(ev) {
          elements.down.off('touchstart.touchspin');  // android 4 workaround

          if (originalinput.is(':disabled')) {
            return;
          }

          downOnce();
          startDownSpin();

          ev.preventDefault();
          ev.stopPropagation();
        });

        elements.down.on('touchstart.touchspin', function(ev) {
          elements.down.off('mousedown.touchspin');  // android 4 workaround

          if (originalinput.is(':disabled')) {
            return;
          }

          downOnce();
          startDownSpin();

          ev.preventDefault();
          ev.stopPropagation();
        });

        elements.up.on('mousedown.touchspin', function(ev) {
          elements.up.off('touchstart.touchspin');  // android 4 workaround

          if (originalinput.is(':disabled')) {
            return;
          }

          upOnce();
          startUpSpin();

          ev.preventDefault();
          ev.stopPropagation();
        });

        elements.up.on('touchstart.touchspin', function(ev) {
          elements.up.off('mousedown.touchspin');  // android 4 workaround

          if (originalinput.is(':disabled')) {
            return;
          }

          upOnce();
          startUpSpin();

          ev.preventDefault();
          ev.stopPropagation();
        });

        elements.up.on('mouseup.touchspin mouseout.touchspin touchleave.touchspin touchend.touchspin touchcancel.touchspin', function(ev) {
          if (!spinning) {
            return;
          }

          ev.stopPropagation();
          stopSpin();
        });

        elements.down.on('mouseup.touchspin mouseout.touchspin touchleave.touchspin touchend.touchspin touchcancel.touchspin', function(ev) {
          if (!spinning) {
            return;
          }

          ev.stopPropagation();
          stopSpin();
        });

        elements.down.on('mousemove.touchspin touchmove.touchspin', function(ev) {
          if (!spinning) {
            return;
          }

          ev.stopPropagation();
          ev.preventDefault();
        });

        elements.up.on('mousemove.touchspin touchmove.touchspin', function(ev) {
          if (!spinning) {
            return;
          }

          ev.stopPropagation();
          ev.preventDefault();
        });

        originalinput.on('mousewheel.touchspin DOMMouseScroll.touchspin', function(ev) {
          if (!settings.mousewheel || !originalinput.is(':focus')) {
            return;
          }

          var delta = ev.originalEvent.wheelDelta || -ev.originalEvent.deltaY || -ev.originalEvent.detail;

          ev.stopPropagation();
          ev.preventDefault();

          if (delta < 0) {
            downOnce();
          }
          else {
            upOnce();
          }
        });
      }

      function _bindEventsInterface() {
        originalinput.on('touchspin.destroy', function() {
          _destroy();
        });

        originalinput.on('touchspin.uponce', function() {
          stopSpin();
          upOnce();
        });

        originalinput.on('touchspin.downonce', function() {
          stopSpin();
          downOnce();
        });

        originalinput.on('touchspin.startupspin', function() {
          startUpSpin();
        });

        originalinput.on('touchspin.startdownspin', function() {
          startDownSpin();
        });

        originalinput.on('touchspin.stopspin', function() {
          stopSpin();
        });

        originalinput.on('touchspin.updatesettings', function(e, newsettings) {
          changeSettings(newsettings);
        });
      }

      function _forcestepdivisibility(value) {
        switch (settings.forcestepdivisibility) {
          case 'round':
            return (Math.round(value / settings.step) * settings.step).toFixed(settings.decimals);
          case 'floor':
            return (Math.floor(value / settings.step) * settings.step).toFixed(settings.decimals);
          case 'ceil':
            return (Math.ceil(value / settings.step) * settings.step).toFixed(settings.decimals);
          default:
            return value.toFixed(settings.decimals);
        }
      }

      function _checkValue() {
        var val, parsedval, returnval;

        val = settings.callback_before_calculation(originalinput.val());

        if (val === '') {
          if (settings.replacementval !== '') {
            originalinput.val(settings.replacementval);
            originalinput.trigger('change');
          }
          return;
        }

        if (settings.decimals > 0 && val === '.') {
          return;
        }

        parsedval = parseFloat(val);

        if (isNaN(parsedval)) {
          if (settings.replacementval !== '') {
            parsedval = settings.replacementval;
          }
          else {
            parsedval = 0;
          }
        }

        returnval = parsedval;

        if (parsedval.toString() !== val) {
          returnval = parsedval;
        }

        if ((settings.min !== null) && (parsedval < settings.min)) {
          returnval = settings.min;
        }

        if ((settings.max !== null) && (parsedval > settings.max)) {
          returnval = settings.max;
        }

        returnval = _forcestepdivisibility(returnval);

        if (Number(val).toString() !== returnval.toString()) {
          originalinput.val(returnval);
          originalinput.trigger('change');
        }
      }

      function _getBoostedStep() {
        if (!settings.booster) {
          return settings.step;
        }
        else {
          var boosted = Math.pow(2, Math.floor(spincount / settings.boostat)) * settings.step;

          if (settings.maxboostedstep) {
            if (boosted > settings.maxboostedstep) {
              boosted = settings.maxboostedstep;
              value = Math.round((value / boosted)) * boosted;
            }
          }

          return Math.max(settings.step, boosted);
        }
      }

      function valueIfIsNaN() {
        if(typeof(settings.firstclickvalueifempty) === 'number') {
          return settings.firstclickvalueifempty;
        } else {
          return (settings.min + settings.max) / 2;
        }
      }

      function upOnce() {
        _checkValue();

        value = parseFloat(settings.callback_before_calculation(elements.input.val()));

        var initvalue = value;
        var boostedstep;

        if (isNaN(value)) {
          value = valueIfIsNaN();
        } else {
          boostedstep = _getBoostedStep();
          value = value + boostedstep;
        }

        if ((settings.max !== null) && (value > settings.max)) {
          value = settings.max;
          originalinput.trigger('touchspin.on.max');
          stopSpin();
        }

        elements.input.val(settings.callback_after_calculation(Number(value).toFixed(settings.decimals)));

        if (initvalue !== value) {
          originalinput.trigger('change');
        }
      }

      function downOnce() {
        _checkValue();

        value = parseFloat(settings.callback_before_calculation(elements.input.val()));

        var initvalue = value;
        var boostedstep;

        if (isNaN(value)) {
          value = valueIfIsNaN();
        } else {
          boostedstep = _getBoostedStep();
          value = value - boostedstep;
        }

        if ((settings.min !== null) && (value < settings.min)) {
          value = settings.min;
          originalinput.trigger('touchspin.on.min');
          stopSpin();
        }

        elements.input.val(settings.callback_after_calculation(Number(value).toFixed(settings.decimals)));

        if (initvalue !== value) {
          originalinput.trigger('change');
        }
      }

      function startDownSpin() {
        stopSpin();

        spincount = 0;
        spinning = 'down';

        originalinput.trigger('touchspin.on.startspin');
        originalinput.trigger('touchspin.on.startdownspin');

        downDelayTimeout = setTimeout(function() {
          downSpinTimer = setInterval(function() {
            spincount++;
            downOnce();
          }, settings.stepinterval);
        }, settings.stepintervaldelay);
      }

      function startUpSpin() {
        stopSpin();

        spincount = 0;
        spinning = 'up';

        originalinput.trigger('touchspin.on.startspin');
        originalinput.trigger('touchspin.on.startupspin');

        upDelayTimeout = setTimeout(function() {
          upSpinTimer = setInterval(function() {
            spincount++;
            upOnce();
          }, settings.stepinterval);
        }, settings.stepintervaldelay);
      }

      function stopSpin() {
        clearTimeout(downDelayTimeout);
        clearTimeout(upDelayTimeout);
        clearInterval(downSpinTimer);
        clearInterval(upSpinTimer);

        switch (spinning) {
          case 'up':
            originalinput.trigger('touchspin.on.stopupspin');
            originalinput.trigger('touchspin.on.stopspin');
            break;
          case 'down':
            originalinput.trigger('touchspin.on.stopdownspin');
            originalinput.trigger('touchspin.on.stopspin');
            break;
        }

        spincount = 0;
        spinning = false;
      }

    });

  };

}));


/***/ }),

/***/ "./node_modules/bootstrap/js/dist/alert.js":
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/*!
  * Bootstrap alert.js v4.6.2 (https://getbootstrap.com/)
  * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
   true ? module.exports = factory(__webpack_require__("jquery"), __webpack_require__("./node_modules/bootstrap/js/dist/util.js")) :
  0;
})(this, (function ($, Util) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var $__default = /*#__PURE__*/_interopDefaultLegacy($);
  var Util__default = /*#__PURE__*/_interopDefaultLegacy(Util);

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  /**
   * Constants
   */

  var NAME = 'alert';
  var VERSION = '4.6.2';
  var DATA_KEY = 'bs.alert';
  var EVENT_KEY = "." + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $__default["default"].fn[NAME];
  var CLASS_NAME_ALERT = 'alert';
  var CLASS_NAME_FADE = 'fade';
  var CLASS_NAME_SHOW = 'show';
  var EVENT_CLOSE = "close" + EVENT_KEY;
  var EVENT_CLOSED = "closed" + EVENT_KEY;
  var EVENT_CLICK_DATA_API = "click" + EVENT_KEY + DATA_API_KEY;
  var SELECTOR_DISMISS = '[data-dismiss="alert"]';
  /**
   * Class definition
   */

  var Alert = /*#__PURE__*/function () {
    function Alert(element) {
      this._element = element;
    } // Getters


    var _proto = Alert.prototype;

    // Public
    _proto.close = function close(element) {
      var rootElement = this._element;

      if (element) {
        rootElement = this._getRootElement(element);
      }

      var customEvent = this._triggerCloseEvent(rootElement);

      if (customEvent.isDefaultPrevented()) {
        return;
      }

      this._removeElement(rootElement);
    };

    _proto.dispose = function dispose() {
      $__default["default"].removeData(this._element, DATA_KEY);
      this._element = null;
    } // Private
    ;

    _proto._getRootElement = function _getRootElement(element) {
      var selector = Util__default["default"].getSelectorFromElement(element);
      var parent = false;

      if (selector) {
        parent = document.querySelector(selector);
      }

      if (!parent) {
        parent = $__default["default"](element).closest("." + CLASS_NAME_ALERT)[0];
      }

      return parent;
    };

    _proto._triggerCloseEvent = function _triggerCloseEvent(element) {
      var closeEvent = $__default["default"].Event(EVENT_CLOSE);
      $__default["default"](element).trigger(closeEvent);
      return closeEvent;
    };

    _proto._removeElement = function _removeElement(element) {
      var _this = this;

      $__default["default"](element).removeClass(CLASS_NAME_SHOW);

      if (!$__default["default"](element).hasClass(CLASS_NAME_FADE)) {
        this._destroyElement(element);

        return;
      }

      var transitionDuration = Util__default["default"].getTransitionDurationFromElement(element);
      $__default["default"](element).one(Util__default["default"].TRANSITION_END, function (event) {
        return _this._destroyElement(element, event);
      }).emulateTransitionEnd(transitionDuration);
    };

    _proto._destroyElement = function _destroyElement(element) {
      $__default["default"](element).detach().trigger(EVENT_CLOSED).remove();
    } // Static
    ;

    Alert._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var $element = $__default["default"](this);
        var data = $element.data(DATA_KEY);

        if (!data) {
          data = new Alert(this);
          $element.data(DATA_KEY, data);
        }

        if (config === 'close') {
          data[config](this);
        }
      });
    };

    Alert._handleDismiss = function _handleDismiss(alertInstance) {
      return function (event) {
        if (event) {
          event.preventDefault();
        }

        alertInstance.close(this);
      };
    };

    _createClass(Alert, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION;
      }
    }]);

    return Alert;
  }();
  /**
   * Data API implementation
   */


  $__default["default"](document).on(EVENT_CLICK_DATA_API, SELECTOR_DISMISS, Alert._handleDismiss(new Alert()));
  /**
   * jQuery
   */

  $__default["default"].fn[NAME] = Alert._jQueryInterface;
  $__default["default"].fn[NAME].Constructor = Alert;

  $__default["default"].fn[NAME].noConflict = function () {
    $__default["default"].fn[NAME] = JQUERY_NO_CONFLICT;
    return Alert._jQueryInterface;
  };

  return Alert;

}));
//# sourceMappingURL=alert.js.map


/***/ }),

/***/ "./node_modules/bootstrap/js/dist/button.js":
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/*!
  * Bootstrap button.js v4.6.2 (https://getbootstrap.com/)
  * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
   true ? module.exports = factory(__webpack_require__("jquery")) :
  0;
})(this, (function ($) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var $__default = /*#__PURE__*/_interopDefaultLegacy($);

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  /**
   * Constants
   */

  var NAME = 'button';
  var VERSION = '4.6.2';
  var DATA_KEY = 'bs.button';
  var EVENT_KEY = "." + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $__default["default"].fn[NAME];
  var CLASS_NAME_ACTIVE = 'active';
  var CLASS_NAME_BUTTON = 'btn';
  var CLASS_NAME_FOCUS = 'focus';
  var EVENT_CLICK_DATA_API = "click" + EVENT_KEY + DATA_API_KEY;
  var EVENT_FOCUS_BLUR_DATA_API = "focus" + EVENT_KEY + DATA_API_KEY + " " + ("blur" + EVENT_KEY + DATA_API_KEY);
  var EVENT_LOAD_DATA_API = "load" + EVENT_KEY + DATA_API_KEY;
  var SELECTOR_DATA_TOGGLE_CARROT = '[data-toggle^="button"]';
  var SELECTOR_DATA_TOGGLES = '[data-toggle="buttons"]';
  var SELECTOR_DATA_TOGGLE = '[data-toggle="button"]';
  var SELECTOR_DATA_TOGGLES_BUTTONS = '[data-toggle="buttons"] .btn';
  var SELECTOR_INPUT = 'input:not([type="hidden"])';
  var SELECTOR_ACTIVE = '.active';
  var SELECTOR_BUTTON = '.btn';
  /**
   * Class definition
   */

  var Button = /*#__PURE__*/function () {
    function Button(element) {
      this._element = element;
      this.shouldAvoidTriggerChange = false;
    } // Getters


    var _proto = Button.prototype;

    // Public
    _proto.toggle = function toggle() {
      var triggerChangeEvent = true;
      var addAriaPressed = true;
      var rootElement = $__default["default"](this._element).closest(SELECTOR_DATA_TOGGLES)[0];

      if (rootElement) {
        var input = this._element.querySelector(SELECTOR_INPUT);

        if (input) {
          if (input.type === 'radio') {
            if (input.checked && this._element.classList.contains(CLASS_NAME_ACTIVE)) {
              triggerChangeEvent = false;
            } else {
              var activeElement = rootElement.querySelector(SELECTOR_ACTIVE);

              if (activeElement) {
                $__default["default"](activeElement).removeClass(CLASS_NAME_ACTIVE);
              }
            }
          }

          if (triggerChangeEvent) {
            // if it's not a radio button or checkbox don't add a pointless/invalid checked property to the input
            if (input.type === 'checkbox' || input.type === 'radio') {
              input.checked = !this._element.classList.contains(CLASS_NAME_ACTIVE);
            }

            if (!this.shouldAvoidTriggerChange) {
              $__default["default"](input).trigger('change');
            }
          }

          input.focus();
          addAriaPressed = false;
        }
      }

      if (!(this._element.hasAttribute('disabled') || this._element.classList.contains('disabled'))) {
        if (addAriaPressed) {
          this._element.setAttribute('aria-pressed', !this._element.classList.contains(CLASS_NAME_ACTIVE));
        }

        if (triggerChangeEvent) {
          $__default["default"](this._element).toggleClass(CLASS_NAME_ACTIVE);
        }
      }
    };

    _proto.dispose = function dispose() {
      $__default["default"].removeData(this._element, DATA_KEY);
      this._element = null;
    } // Static
    ;

    Button._jQueryInterface = function _jQueryInterface(config, avoidTriggerChange) {
      return this.each(function () {
        var $element = $__default["default"](this);
        var data = $element.data(DATA_KEY);

        if (!data) {
          data = new Button(this);
          $element.data(DATA_KEY, data);
        }

        data.shouldAvoidTriggerChange = avoidTriggerChange;

        if (config === 'toggle') {
          data[config]();
        }
      });
    };

    _createClass(Button, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION;
      }
    }]);

    return Button;
  }();
  /**
   * Data API implementation
   */


  $__default["default"](document).on(EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE_CARROT, function (event) {
    var button = event.target;
    var initialButton = button;

    if (!$__default["default"](button).hasClass(CLASS_NAME_BUTTON)) {
      button = $__default["default"](button).closest(SELECTOR_BUTTON)[0];
    }

    if (!button || button.hasAttribute('disabled') || button.classList.contains('disabled')) {
      event.preventDefault(); // work around Firefox bug #1540995
    } else {
      var inputBtn = button.querySelector(SELECTOR_INPUT);

      if (inputBtn && (inputBtn.hasAttribute('disabled') || inputBtn.classList.contains('disabled'))) {
        event.preventDefault(); // work around Firefox bug #1540995

        return;
      }

      if (initialButton.tagName === 'INPUT' || button.tagName !== 'LABEL') {
        Button._jQueryInterface.call($__default["default"](button), 'toggle', initialButton.tagName === 'INPUT');
      }
    }
  }).on(EVENT_FOCUS_BLUR_DATA_API, SELECTOR_DATA_TOGGLE_CARROT, function (event) {
    var button = $__default["default"](event.target).closest(SELECTOR_BUTTON)[0];
    $__default["default"](button).toggleClass(CLASS_NAME_FOCUS, /^focus(in)?$/.test(event.type));
  });
  $__default["default"](window).on(EVENT_LOAD_DATA_API, function () {
    // ensure correct active class is set to match the controls' actual values/states
    // find all checkboxes/readio buttons inside data-toggle groups
    var buttons = [].slice.call(document.querySelectorAll(SELECTOR_DATA_TOGGLES_BUTTONS));

    for (var i = 0, len = buttons.length; i < len; i++) {
      var button = buttons[i];
      var input = button.querySelector(SELECTOR_INPUT);

      if (input.checked || input.hasAttribute('checked')) {
        button.classList.add(CLASS_NAME_ACTIVE);
      } else {
        button.classList.remove(CLASS_NAME_ACTIVE);
      }
    } // find all button toggles


    buttons = [].slice.call(document.querySelectorAll(SELECTOR_DATA_TOGGLE));

    for (var _i = 0, _len = buttons.length; _i < _len; _i++) {
      var _button = buttons[_i];

      if (_button.getAttribute('aria-pressed') === 'true') {
        _button.classList.add(CLASS_NAME_ACTIVE);
      } else {
        _button.classList.remove(CLASS_NAME_ACTIVE);
      }
    }
  });
  /**
   * jQuery
   */

  $__default["default"].fn[NAME] = Button._jQueryInterface;
  $__default["default"].fn[NAME].Constructor = Button;

  $__default["default"].fn[NAME].noConflict = function () {
    $__default["default"].fn[NAME] = JQUERY_NO_CONFLICT;
    return Button._jQueryInterface;
  };

  return Button;

}));
//# sourceMappingURL=button.js.map


/***/ }),

/***/ "./node_modules/bootstrap/js/dist/tab.js":
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/*!
  * Bootstrap tab.js v4.6.2 (https://getbootstrap.com/)
  * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
   true ? module.exports = factory(__webpack_require__("jquery"), __webpack_require__("./node_modules/bootstrap/js/dist/util.js")) :
  0;
})(this, (function ($, Util) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var $__default = /*#__PURE__*/_interopDefaultLegacy($);
  var Util__default = /*#__PURE__*/_interopDefaultLegacy(Util);

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  /**
   * Constants
   */

  var NAME = 'tab';
  var VERSION = '4.6.2';
  var DATA_KEY = 'bs.tab';
  var EVENT_KEY = "." + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $__default["default"].fn[NAME];
  var CLASS_NAME_DROPDOWN_MENU = 'dropdown-menu';
  var CLASS_NAME_ACTIVE = 'active';
  var CLASS_NAME_DISABLED = 'disabled';
  var CLASS_NAME_FADE = 'fade';
  var CLASS_NAME_SHOW = 'show';
  var EVENT_HIDE = "hide" + EVENT_KEY;
  var EVENT_HIDDEN = "hidden" + EVENT_KEY;
  var EVENT_SHOW = "show" + EVENT_KEY;
  var EVENT_SHOWN = "shown" + EVENT_KEY;
  var EVENT_CLICK_DATA_API = "click" + EVENT_KEY + DATA_API_KEY;
  var SELECTOR_DROPDOWN = '.dropdown';
  var SELECTOR_NAV_LIST_GROUP = '.nav, .list-group';
  var SELECTOR_ACTIVE = '.active';
  var SELECTOR_ACTIVE_UL = '> li > .active';
  var SELECTOR_DATA_TOGGLE = '[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]';
  var SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle';
  var SELECTOR_DROPDOWN_ACTIVE_CHILD = '> .dropdown-menu .active';
  /**
   * Class definition
   */

  var Tab = /*#__PURE__*/function () {
    function Tab(element) {
      this._element = element;
    } // Getters


    var _proto = Tab.prototype;

    // Public
    _proto.show = function show() {
      var _this = this;

      if (this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && $__default["default"](this._element).hasClass(CLASS_NAME_ACTIVE) || $__default["default"](this._element).hasClass(CLASS_NAME_DISABLED) || this._element.hasAttribute('disabled')) {
        return;
      }

      var target;
      var previous;
      var listElement = $__default["default"](this._element).closest(SELECTOR_NAV_LIST_GROUP)[0];
      var selector = Util__default["default"].getSelectorFromElement(this._element);

      if (listElement) {
        var itemSelector = listElement.nodeName === 'UL' || listElement.nodeName === 'OL' ? SELECTOR_ACTIVE_UL : SELECTOR_ACTIVE;
        previous = $__default["default"].makeArray($__default["default"](listElement).find(itemSelector));
        previous = previous[previous.length - 1];
      }

      var hideEvent = $__default["default"].Event(EVENT_HIDE, {
        relatedTarget: this._element
      });
      var showEvent = $__default["default"].Event(EVENT_SHOW, {
        relatedTarget: previous
      });

      if (previous) {
        $__default["default"](previous).trigger(hideEvent);
      }

      $__default["default"](this._element).trigger(showEvent);

      if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) {
        return;
      }

      if (selector) {
        target = document.querySelector(selector);
      }

      this._activate(this._element, listElement);

      var complete = function complete() {
        var hiddenEvent = $__default["default"].Event(EVENT_HIDDEN, {
          relatedTarget: _this._element
        });
        var shownEvent = $__default["default"].Event(EVENT_SHOWN, {
          relatedTarget: previous
        });
        $__default["default"](previous).trigger(hiddenEvent);
        $__default["default"](_this._element).trigger(shownEvent);
      };

      if (target) {
        this._activate(target, target.parentNode, complete);
      } else {
        complete();
      }
    };

    _proto.dispose = function dispose() {
      $__default["default"].removeData(this._element, DATA_KEY);
      this._element = null;
    } // Private
    ;

    _proto._activate = function _activate(element, container, callback) {
      var _this2 = this;

      var activeElements = container && (container.nodeName === 'UL' || container.nodeName === 'OL') ? $__default["default"](container).find(SELECTOR_ACTIVE_UL) : $__default["default"](container).children(SELECTOR_ACTIVE);
      var active = activeElements[0];
      var isTransitioning = callback && active && $__default["default"](active).hasClass(CLASS_NAME_FADE);

      var complete = function complete() {
        return _this2._transitionComplete(element, active, callback);
      };

      if (active && isTransitioning) {
        var transitionDuration = Util__default["default"].getTransitionDurationFromElement(active);
        $__default["default"](active).removeClass(CLASS_NAME_SHOW).one(Util__default["default"].TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
      } else {
        complete();
      }
    };

    _proto._transitionComplete = function _transitionComplete(element, active, callback) {
      if (active) {
        $__default["default"](active).removeClass(CLASS_NAME_ACTIVE);
        var dropdownChild = $__default["default"](active.parentNode).find(SELECTOR_DROPDOWN_ACTIVE_CHILD)[0];

        if (dropdownChild) {
          $__default["default"](dropdownChild).removeClass(CLASS_NAME_ACTIVE);
        }

        if (active.getAttribute('role') === 'tab') {
          active.setAttribute('aria-selected', false);
        }
      }

      $__default["default"](element).addClass(CLASS_NAME_ACTIVE);

      if (element.getAttribute('role') === 'tab') {
        element.setAttribute('aria-selected', true);
      }

      Util__default["default"].reflow(element);

      if (element.classList.contains(CLASS_NAME_FADE)) {
        element.classList.add(CLASS_NAME_SHOW);
      }

      var parent = element.parentNode;

      if (parent && parent.nodeName === 'LI') {
        parent = parent.parentNode;
      }

      if (parent && $__default["default"](parent).hasClass(CLASS_NAME_DROPDOWN_MENU)) {
        var dropdownElement = $__default["default"](element).closest(SELECTOR_DROPDOWN)[0];

        if (dropdownElement) {
          var dropdownToggleList = [].slice.call(dropdownElement.querySelectorAll(SELECTOR_DROPDOWN_TOGGLE));
          $__default["default"](dropdownToggleList).addClass(CLASS_NAME_ACTIVE);
        }

        element.setAttribute('aria-expanded', true);
      }

      if (callback) {
        callback();
      }
    } // Static
    ;

    Tab._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var $this = $__default["default"](this);
        var data = $this.data(DATA_KEY);

        if (!data) {
          data = new Tab(this);
          $this.data(DATA_KEY, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    _createClass(Tab, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION;
      }
    }]);

    return Tab;
  }();
  /**
   * Data API implementation
   */


  $__default["default"](document).on(EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
    event.preventDefault();

    Tab._jQueryInterface.call($__default["default"](this), 'show');
  });
  /**
   * jQuery
   */

  $__default["default"].fn[NAME] = Tab._jQueryInterface;
  $__default["default"].fn[NAME].Constructor = Tab;

  $__default["default"].fn[NAME].noConflict = function () {
    $__default["default"].fn[NAME] = JQUERY_NO_CONFLICT;
    return Tab._jQueryInterface;
  };

  return Tab;

}));
//# sourceMappingURL=tab.js.map


/***/ }),

/***/ "./node_modules/bootstrap/js/dist/util.js":
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/*!
  * Bootstrap util.js v4.6.2 (https://getbootstrap.com/)
  * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
   true ? module.exports = factory(__webpack_require__("jquery")) :
  0;
})(this, (function ($) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var $__default = /*#__PURE__*/_interopDefaultLegacy($);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.6.2): util.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * Private TransitionEnd Helpers
   */

  var TRANSITION_END = 'transitionend';
  var MAX_UID = 1000000;
  var MILLISECONDS_MULTIPLIER = 1000; // Shoutout AngusCroll (https://goo.gl/pxwQGp)

  function toType(obj) {
    if (obj === null || typeof obj === 'undefined') {
      return "" + obj;
    }

    return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
  }

  function getSpecialTransitionEndEvent() {
    return {
      bindType: TRANSITION_END,
      delegateType: TRANSITION_END,
      handle: function handle(event) {
        if ($__default["default"](event.target).is(this)) {
          return event.handleObj.handler.apply(this, arguments); // eslint-disable-line prefer-rest-params
        }

        return undefined;
      }
    };
  }

  function transitionEndEmulator(duration) {
    var _this = this;

    var called = false;
    $__default["default"](this).one(Util.TRANSITION_END, function () {
      called = true;
    });
    setTimeout(function () {
      if (!called) {
        Util.triggerTransitionEnd(_this);
      }
    }, duration);
    return this;
  }

  function setTransitionEndSupport() {
    $__default["default"].fn.emulateTransitionEnd = transitionEndEmulator;
    $__default["default"].event.special[Util.TRANSITION_END] = getSpecialTransitionEndEvent();
  }
  /**
   * Public Util API
   */


  var Util = {
    TRANSITION_END: 'bsTransitionEnd',
    getUID: function getUID(prefix) {
      do {
        // eslint-disable-next-line no-bitwise
        prefix += ~~(Math.random() * MAX_UID); // "~~" acts like a faster Math.floor() here
      } while (document.getElementById(prefix));

      return prefix;
    },
    getSelectorFromElement: function getSelectorFromElement(element) {
      var selector = element.getAttribute('data-target');

      if (!selector || selector === '#') {
        var hrefAttr = element.getAttribute('href');
        selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : '';
      }

      try {
        return document.querySelector(selector) ? selector : null;
      } catch (_) {
        return null;
      }
    },
    getTransitionDurationFromElement: function getTransitionDurationFromElement(element) {
      if (!element) {
        return 0;
      } // Get transition-duration of the element


      var transitionDuration = $__default["default"](element).css('transition-duration');
      var transitionDelay = $__default["default"](element).css('transition-delay');
      var floatTransitionDuration = parseFloat(transitionDuration);
      var floatTransitionDelay = parseFloat(transitionDelay); // Return 0 if element or transition duration is not found

      if (!floatTransitionDuration && !floatTransitionDelay) {
        return 0;
      } // If multiple durations are defined, take the first


      transitionDuration = transitionDuration.split(',')[0];
      transitionDelay = transitionDelay.split(',')[0];
      return (parseFloat(transitionDuration) + parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
    },
    reflow: function reflow(element) {
      return element.offsetHeight;
    },
    triggerTransitionEnd: function triggerTransitionEnd(element) {
      $__default["default"](element).trigger(TRANSITION_END);
    },
    supportsTransitionEnd: function supportsTransitionEnd() {
      return Boolean(TRANSITION_END);
    },
    isElement: function isElement(obj) {
      return (obj[0] || obj).nodeType;
    },
    typeCheckConfig: function typeCheckConfig(componentName, config, configTypes) {
      for (var property in configTypes) {
        if (Object.prototype.hasOwnProperty.call(configTypes, property)) {
          var expectedTypes = configTypes[property];
          var value = config[property];
          var valueType = value && Util.isElement(value) ? 'element' : toType(value);

          if (!new RegExp(expectedTypes).test(valueType)) {
            throw new Error(componentName.toUpperCase() + ": " + ("Option \"" + property + "\" provided type \"" + valueType + "\" ") + ("but expected type \"" + expectedTypes + "\"."));
          }
        }
      }
    },
    findShadowRoot: function findShadowRoot(element) {
      if (!document.documentElement.attachShadow) {
        return null;
      } // Can find the shadow root otherwise it'll return the document


      if (typeof element.getRootNode === 'function') {
        var root = element.getRootNode();
        return root instanceof ShadowRoot ? root : null;
      }

      if (element instanceof ShadowRoot) {
        return element;
      } // when we don't find a shadow root


      if (!element.parentNode) {
        return null;
      }

      return Util.findShadowRoot(element.parentNode);
    },
    jQueryDetection: function jQueryDetection() {
      if (typeof $__default["default"] === 'undefined') {
        throw new TypeError('Bootstrap\'s JavaScript requires jQuery. jQuery must be included before Bootstrap\'s JavaScript.');
      }

      var version = $__default["default"].fn.jquery.split(' ')[0].split('.');
      var minMajor = 1;
      var ltMajor = 2;
      var minMinor = 9;
      var minPatch = 1;
      var maxMajor = 4;

      if (version[0] < ltMajor && version[1] < minMinor || version[0] === minMajor && version[1] === minMinor && version[2] < minPatch || version[0] >= maxMajor) {
        throw new Error('Bootstrap\'s JavaScript requires at least jQuery v1.9.1 but less than v4.0.0');
      }
    }
  };
  Util.jQueryDetection();
  setTransitionEndSupport();

  return Util;

}));
//# sourceMappingURL=util.js.map


/***/ }),

/***/ "./node_modules/bs-custom-file-input/dist/bs-custom-file-input.js":
/***/ (function(module) {

/*!
 * bsCustomFileInput v1.3.4 (https://github.com/Johann-S/bs-custom-file-input)
 * Copyright 2018 - 2020 Johann-S <johann.servoire@gmail.com>
 * Licensed under MIT (https://github.com/Johann-S/bs-custom-file-input/blob/master/LICENSE)
 */
(function (global, factory) {
   true ? module.exports = factory() :
  0;
}(this, (function () { 'use strict';

  var Selector = {
    CUSTOMFILE: '.custom-file input[type="file"]',
    CUSTOMFILELABEL: '.custom-file-label',
    FORM: 'form',
    INPUT: 'input'
  };

  var textNodeType = 3;

  var getDefaultText = function getDefaultText(input) {
    var defaultText = '';
    var label = input.parentNode.querySelector(Selector.CUSTOMFILELABEL);

    if (label) {
      defaultText = label.textContent;
    }

    return defaultText;
  };

  var findFirstChildNode = function findFirstChildNode(element) {
    if (element.childNodes.length > 0) {
      var childNodes = [].slice.call(element.childNodes);

      for (var i = 0; i < childNodes.length; i++) {
        var node = childNodes[i];

        if (node.nodeType !== textNodeType) {
          return node;
        }
      }
    }

    return element;
  };

  var restoreDefaultText = function restoreDefaultText(input) {
    var defaultText = input.bsCustomFileInput.defaultText;
    var label = input.parentNode.querySelector(Selector.CUSTOMFILELABEL);

    if (label) {
      var element = findFirstChildNode(label);
      element.textContent = defaultText;
    }
  };

  var fileApi = !!window.File;
  var FAKE_PATH = 'fakepath';
  var FAKE_PATH_SEPARATOR = '\\';

  var getSelectedFiles = function getSelectedFiles(input) {
    if (input.hasAttribute('multiple') && fileApi) {
      return [].slice.call(input.files).map(function (file) {
        return file.name;
      }).join(', ');
    }

    if (input.value.indexOf(FAKE_PATH) !== -1) {
      var splittedValue = input.value.split(FAKE_PATH_SEPARATOR);
      return splittedValue[splittedValue.length - 1];
    }

    return input.value;
  };

  function handleInputChange() {
    var label = this.parentNode.querySelector(Selector.CUSTOMFILELABEL);

    if (label) {
      var element = findFirstChildNode(label);
      var inputValue = getSelectedFiles(this);

      if (inputValue.length) {
        element.textContent = inputValue;
      } else {
        restoreDefaultText(this);
      }
    }
  }

  function handleFormReset() {
    var customFileList = [].slice.call(this.querySelectorAll(Selector.INPUT)).filter(function (input) {
      return !!input.bsCustomFileInput;
    });

    for (var i = 0, len = customFileList.length; i < len; i++) {
      restoreDefaultText(customFileList[i]);
    }
  }

  var customProperty = 'bsCustomFileInput';
  var Event = {
    FORMRESET: 'reset',
    INPUTCHANGE: 'change'
  };
  var bsCustomFileInput = {
    init: function init(inputSelector, formSelector) {
      if (inputSelector === void 0) {
        inputSelector = Selector.CUSTOMFILE;
      }

      if (formSelector === void 0) {
        formSelector = Selector.FORM;
      }

      var customFileInputList = [].slice.call(document.querySelectorAll(inputSelector));
      var formList = [].slice.call(document.querySelectorAll(formSelector));

      for (var i = 0, len = customFileInputList.length; i < len; i++) {
        var input = customFileInputList[i];
        Object.defineProperty(input, customProperty, {
          value: {
            defaultText: getDefaultText(input)
          },
          writable: true
        });
        handleInputChange.call(input);
        input.addEventListener(Event.INPUTCHANGE, handleInputChange);
      }

      for (var _i = 0, _len = formList.length; _i < _len; _i++) {
        formList[_i].addEventListener(Event.FORMRESET, handleFormReset);

        Object.defineProperty(formList[_i], customProperty, {
          value: true,
          writable: true
        });
      }
    },
    destroy: function destroy() {
      var formList = [].slice.call(document.querySelectorAll(Selector.FORM)).filter(function (form) {
        return !!form.bsCustomFileInput;
      });
      var customFileInputList = [].slice.call(document.querySelectorAll(Selector.INPUT)).filter(function (input) {
        return !!input.bsCustomFileInput;
      });

      for (var i = 0, len = customFileInputList.length; i < len; i++) {
        var input = customFileInputList[i];
        restoreDefaultText(input);
        input[customProperty] = undefined;
        input.removeEventListener(Event.INPUTCHANGE, handleInputChange);
      }

      for (var _i2 = 0, _len2 = formList.length; _i2 < _len2; _i2++) {
        formList[_i2].removeEventListener(Event.FORMRESET, handleFormReset);

        formList[_i2][customProperty] = undefined;
      }
    }
  };

  return bsCustomFileInput;

})));
//# sourceMappingURL=bs-custom-file-input.js.map


/***/ }),

/***/ "../../../modules/is_favoriteproducts/_theme_dev/src/js/theme/components/useFavoriteDOMHandler.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _useFavoriteProductsState__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../../modules/is_favoriteproducts/_theme_dev/src/js/theme/components/useFavoriteProductsState.js");

const useFavoriteDOMHandler = (buttonsSelector = '[data-action="toggleFavorite"]') => {
  const { getFavoriteProducts } = (0,_useFavoriteProductsState__WEBPACK_IMPORTED_MODULE_0__["default"])();
  const getButtons = () => document.querySelectorAll(buttonsSelector);
  const activeDataAttribute = "active";
  const getAllButtonsByProductKey = (key) => document.querySelectorAll(`${buttonsSelector}[data-key="${key}"]`);
  const getProductIdsFromKey = (key) => {
    const [idProduct, idProductAttribute] = key.split("_");
    return {
      idProduct: parseInt(idProduct, 10),
      idProductAttribute: parseInt(idProductAttribute, 10)
    };
  };
  const setBtnActive = (btn) => {
    const { key } = btn.dataset;
    const allButtons = getAllButtonsByProductKey(key);
    allButtons.forEach((currentBtn) => {
      currentBtn.dataset[activeDataAttribute] = true;
    });
  };
  const setBtnInactive = (btn) => {
    const { key } = btn.dataset;
    const allButtons = getAllButtonsByProductKey(key);
    allButtons.forEach((currentBtn) => {
      currentBtn.dataset[activeDataAttribute] = false;
    });
  };
  const refreshButtons = () => {
    getButtons().forEach((btn) => {
      btn.dataset[activeDataAttribute] = false;
    });
    getFavoriteProducts().forEach((productKey) => {
      const allButtons = getAllButtonsByProductKey(productKey);
      allButtons.forEach((btn) => {
        btn.dataset[activeDataAttribute] = true;
      });
    });
  };
  return {
    getProductIdsFromKey,
    refreshButtons,
    setBtnActive,
    setBtnInactive
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useFavoriteDOMHandler);


/***/ }),

/***/ "../../../modules/is_favoriteproducts/_theme_dev/src/js/theme/components/useFavoriteProducts.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var wretch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/wretch/dist/index.js");
/* harmony import */ var wretch_addons_queryString__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/wretch/dist/addons/queryString.js");
/* harmony import */ var _useFavoriteProductsState__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../../modules/is_favoriteproducts/_theme_dev/src/js/theme/components/useFavoriteProductsState.js");
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};



const useFavoriteProducts = () => {
  const initialState = window.favoriteProducts || [];
  const { getFavoriteProducts, addProductKey, removeProductKey } = (0,_useFavoriteProductsState__WEBPACK_IMPORTED_MODULE_0__["default"])(initialState);
  const getWretch = (url) => (0,wretch__WEBPACK_IMPORTED_MODULE_1__["default"])(url).addon(wretch_addons_queryString__WEBPACK_IMPORTED_MODULE_2__["default"]);
  const addToFavorite = (idProduct, idProductAttribute, refreshList = 0) => __async(void 0, null, function* () {
    return new Promise((resolve, reject) => {
      getWretch(window.addToFavoriteAction).query({
        id_product: idProduct,
        id_product_attribute: idProductAttribute,
        refresh_list: refreshList
      }).post().json((data) => {
        if (data.success) {
          addProductKey(`${idProduct}_${idProductAttribute}`);
        }
        resolve(data);
      }).catch(() => {
        reject(Error("Something went wrong"));
      });
    });
  });
  const removeFromFavorite = (idProduct, idProductAttribute, refreshList = 0) => __async(void 0, null, function* () {
    return new Promise((resolve, reject) => {
      getWretch(window.removeFromFavoriteAction).query({
        id_product: idProduct,
        id_product_attribute: idProductAttribute,
        refresh_list: refreshList
      }).post().json((data) => {
        if (data.success) {
          removeProductKey(`${idProduct}_${idProductAttribute}`);
        }
        resolve(data);
      }).catch(() => {
        reject(Error("Something went wrong"));
      });
    });
  });
  return {
    getFavoriteProducts,
    addToFavorite,
    removeFromFavorite
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useFavoriteProducts);


/***/ }),

/***/ "../../../modules/is_favoriteproducts/_theme_dev/src/js/theme/components/useFavoriteProductsState.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
let favoriteProducts = [];
const useFavoriteProductsState = (initialValue = []) => {
  if (initialValue && Array.isArray(initialValue) && initialValue.length > 0) {
    favoriteProducts = initialValue;
  }
  const getFavoriteProducts = () => favoriteProducts;
  const setFavoriteProducts = (products) => {
    favoriteProducts = products;
  };
  const addProductKey = (key) => {
    const currentFavoriteProducts = getFavoriteProducts();
    setFavoriteProducts([...currentFavoriteProducts, key]);
  };
  const removeProductKey = (key) => {
    const currentFavoriteProducts = getFavoriteProducts();
    setFavoriteProducts(currentFavoriteProducts.filter((productKey) => productKey !== key));
  };
  return {
    getFavoriteProducts,
    addProductKey,
    removeProductKey
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useFavoriteProductsState);


/***/ }),

/***/ "../../../modules/is_favoriteproducts/_theme_dev/src/js/theme/index.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _js_theme_components_useAlertToast__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./js/theme/components/useAlertToast.js");
/* harmony import */ var _components_useFavoriteProducts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../../modules/is_favoriteproducts/_theme_dev/src/js/theme/components/useFavoriteProducts.js");
/* harmony import */ var _components_useFavoriteDOMHandler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../../modules/is_favoriteproducts/_theme_dev/src/js/theme/components/useFavoriteDOMHandler.js");
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};



document.addEventListener("DOMContentLoaded", () => {
  const {
    addToFavorite,
    removeFromFavorite
  } = (0,_components_useFavoriteProducts__WEBPACK_IMPORTED_MODULE_1__["default"])();
  const {
    getProductIdsFromKey,
    refreshButtons,
    setBtnActive,
    setBtnInactive
  } = (0,_components_useFavoriteDOMHandler__WEBPACK_IMPORTED_MODULE_2__["default"])();
  const {
    success,
    danger
  } = (0,_js_theme_components_useAlertToast__WEBPACK_IMPORTED_MODULE_0__["default"])();
  const handleMessage = (messages, type = "success") => {
    if (type === "success") {
      success(messages);
    } else {
      danger(messages);
    }
  };
  const updateTopContent = (topContent) => {
    const topContentContainer = document.querySelector(".js-favorite-top-content");
    if (topContentContainer) {
      const node = document.createElement("div");
      node.innerHTML = topContent;
      topContentContainer.replaceWith(...node.children);
    }
  };
  document.addEventListener("click", (event) => __async(undefined, null, function* () {
    const btn = event.target.matches('[data-action="toggleFavorite"]') ? event.target : event.target.closest('[data-action="toggleFavorite"]');
    if (btn) {
      event.preventDefault();
      const { idProduct, idProductAttribute } = getProductIdsFromKey(btn.dataset.key);
      const isAdded = btn.dataset.active === "true";
      if (isAdded) {
        try {
          const { success: requestSuccess, messages, topContent } = yield removeFromFavorite(idProduct, idProductAttribute);
          handleMessage(messages, requestSuccess ? "success" : "error");
          if (requestSuccess) {
            setBtnInactive(btn);
            updateTopContent(topContent);
          }
        } catch (error) {
          handleMessage([error.message], "error");
        }
      } else {
        try {
          const { success: requestSuccess, messages, topContent } = yield addToFavorite(idProduct, idProductAttribute);
          handleMessage(messages, requestSuccess ? "success" : "error");
          if (requestSuccess) {
            setBtnActive(btn);
            updateTopContent(topContent);
          }
        } catch (error) {
          handleMessage([error.message], "error");
        }
      }
      if (window.isFavoriteProductsListingPage) {
        prestashop.emit("updateFacets", window.location.href);
      }
    }
  }), false);
  refreshButtons();
  prestashop.on("updatedProduct", () => {
    setTimeout(refreshButtons, 1);
  });
  prestashop.on("updatedProductList", () => {
    setTimeout(refreshButtons, 1);
  });
});


/***/ }),

/***/ "../../../modules/is_searchbar/_theme_dev/src/js/theme/components/SearchInput.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function SearchInput({
  searchUrl,
  input,
  onType,
  onResult,
  beforeSend,
  onRemoveResult,
  perPage,
  appendTo,
  min,
  timeout
}) {
  this.searchUrl = searchUrl;
  this.input = input;
  this.appendTo = document.querySelector(appendTo);
  this.onType = onType || (() => {
  });
  this.onResult = onResult || (() => {
  });
  this.onRemoveResult = onRemoveResult || (() => {
  });
  this.beforeSend = beforeSend || (() => {
  });
  this.min = min || 3;
  this.perPage = perPage || 10;
  this.timeout = timeout || 300;
  this.resultBox = null;
  const cache = {};
  let typeTimeout = null;
  const resultBoxClass = "js-search-result";
  const getInputString = () => this.input.value;
  const handleResultIfStringMatchMinLength = (str) => str.length >= this.min;
  const resetResultIfExits = () => {
    if (this.resultBox) {
      this.onRemoveResult();
      this.resultBox.remove();
    }
  };
  const displayResult = (data, str) => {
    resetResultIfExits();
    const element = document.createElement("div");
    element.classList.add(resultBoxClass);
    element.innerHTML = data.content;
    this.appendTo.appendChild(element);
    this.resultBox = document.querySelector(`.${resultBoxClass}`);
    this.onResult({
      input: this.input,
      appendTo: this.appendTo,
      s: str,
      data
    });
  };
  const handleAjax = (str) => {
    this.beforeSend({
      input: this.input,
      appendTo: this.appendTo,
      s: str
    });
    if (typeof cache[str] !== "undefined") {
      displayResult(cache[str], str);
      return;
    }
    let data = {
      s: str,
      perPage: this.perPage,
      ajax: 1
    };
    data = Object.keys(data).map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join("&");
    fetch(this.searchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: data
    }).then((response) => response.text()).then((responseData) => {
      responseData = JSON.parse(responseData);
      cache[str] = responseData;
      displayResult(responseData, str);
    }).catch((err) => console.error(err));
  };
  this.removeResults = () => {
    resetResultIfExits();
  };
  this.input.addEventListener("keyup", () => {
    if (typeTimeout) {
      clearTimeout(typeTimeout);
    }
    const str = getInputString();
    this.onType({
      input: this.input,
      appendTo: this.appendTo,
      s: str
    });
    if (!handleResultIfStringMatchMinLength(str)) {
      resetResultIfExits();
      return;
    }
    typeTimeout = setTimeout(() => {
      handleAjax(str);
    }, this.timeout);
  });
  return this;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SearchInput);


/***/ }),

/***/ "../../../modules/is_searchbar/_theme_dev/src/js/theme/index.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_SearchInput__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../../modules/is_searchbar/_theme_dev/src/js/theme/components/SearchInput.js");

const init = () => {
  const searchInput = document.querySelector(".js-search-input");
  const getAjaxUrlFromElement = (el) => el && el.length ? el.getAttribute("data-search-controller-url") : null;
  const ajaxUrl = getAjaxUrlFromElement(document.querySelector("[data-search-controller-url]"));
  const body = document.querySelector("body");
  const inputForm = searchInput.closest(".js-search-form");
  const backdrop = document.createElement("div");
  backdrop.classList.add("search-backdrop");
  body.appendChild(backdrop);
  if (!ajaxUrl) {
    return;
  }
  const Search = new _components_SearchInput__WEBPACK_IMPORTED_MODULE_0__["default"]({
    searchUrl: ajaxUrl,
    input: searchInput,
    appendTo: ".js-search-form",
    perPage: 6,
    onResult: () => {
      body.classList.add("search-result-open");
      prestashop.pageLazyLoad.update();
    },
    onRemoveResult: () => {
      body.classList.remove("search-result-open");
    },
    beforeSend: () => {
    },
    onType: () => {
    }
  });
  body.addEventListener("click", ({ target }) => {
    if (body.classList.contains("search-result-open") && target !== inputForm && !target.closest(".js-search-form")) {
      body.classList.remove("search-result-open");
      Search.removeResults();
    }
  });
};
document.addEventListener("DOMContentLoaded", init);


/***/ }),

/***/ "../../../modules/is_shoppingcart/_theme_dev/src/js/theme/index.js":
/***/ (() => {

function initShoppingCart() {
  const body = document.querySelector("body");
  function bindEvents() {
    const blockCart = document.querySelector(".js-blockcart");
    $(blockCart).on("show.bs.dropdown", () => {
      body.classList.add("header-dropdown-open", "block-cart-open");
    });
    $(blockCart).on("hide.bs.dropdown", (e) => {
      const { target } = e;
      if (!target.classList.contains("dropdown-close") && (target.classList.contains("keep-open") || target.closest(".keep-open") || e.clickEvent && e.clickEvent.target.closest(".keep-open"))) {
        return false;
      }
      body.classList.remove("header-dropdown-open", "block-cart-open");
      return true;
    });
  }
  prestashop.blockcart = prestashop.blockcart || {};
  const { showModal } = prestashop.blockcart;
  bindEvents();
  prestashop.on(
    "updateCart",
    (event) => {
      const refreshURL = document.querySelector(".js-blockcart").dataset.refreshUrl;
      let requestData = {};
      if (event && event.reason && typeof event.resp !== "undefined" && !event.resp.hasError) {
        requestData = {
          id_customization: event.reason.idCustomization,
          id_product_attribute: event.reason.idProductAttribute,
          id_product: event.reason.idProduct,
          action: event.reason.linkAction,
          ajax: 1
        };
      }
      requestData = Object.keys(requestData).map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(requestData[key])}`).join("&");
      if (event && event.resp && event.resp.hasError) {
        const errorModal = document.querySelector("#blockcart-error");
        const alertBlock = document.querySelector(".js-blockcart-alert");
        alertBlock.innerHTML = event.resp.errors.join("<br/>");
        $(errorModal).modal("show");
      }
      fetch(refreshURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: requestData
      }).then((resp) => resp.json()).then((resp) => {
        const previewHtml = new DOMParser().parseFromString(resp.preview, "text/html").querySelector(".js-blockcart");
        if (previewHtml) {
          document.querySelector(".js-blockcart").replaceWith(previewHtml);
        }
        if (resp.modal) {
          showModal(resp.modal);
        }
        prestashop.emit("updatedBlockCart", resp);
        if (body.classList.contains("block-cart-open")) {
          const dropdown = body.querySelector('.js-blockcart [data-toggle="dropdown"]');
          if (dropdown) {
            dropdown.click();
          }
        }
        bindEvents();
        body.classList.remove("cart-loading");
      }).catch((resp) => {
        prestashop.emit("handleError", { eventType: "updateShoppingCart", resp });
      });
    }
  );
}
document.addEventListener("DOMContentLoaded", () => {
  initShoppingCart();
});


/***/ }),

/***/ "./js/theme.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _js_theme_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./js/theme/index.js");



/***/ }),

/***/ "./js/theme/components/Lazyload.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vanilla_lazyload__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/vanilla-lazyload/dist/lazyload.min.js");
/* harmony import */ var vanilla_lazyload__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vanilla_lazyload__WEBPACK_IMPORTED_MODULE_0__);

class PageLazyLoad {
  constructor({ selector = ".lazyload" } = {}) {
    this.selector = selector;
    this.lazyLoadInstance = null;
    this.init();
  }
  init() {
    this.lazyLoadInstance = new (vanilla_lazyload__WEBPACK_IMPORTED_MODULE_0___default())({
      elements_selector: this.selector
    });
  }
  update() {
    this.lazyLoadInstance.update();
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PageLazyLoad);


/***/ }),

/***/ "./js/theme/components/PageLoader.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);

class PageLoader {
  constructor() {
    this.$body = jquery__WEBPACK_IMPORTED_MODULE_0___default()("body");
  }
  showLoader() {
    this.$body.addClass("page-loader-active");
  }
  hideLoader() {
    this.$body.removeClass("page-loader-active");
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PageLoader);


/***/ }),

/***/ "./js/theme/components/TopMenu.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TopMenu)
/* harmony export */ });
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);

class TopMenu {
  constructor(el) {
    this.$el = jquery__WEBPACK_IMPORTED_MODULE_0___default()(el);
  }
  init() {
    const self = this;
    self.$el.hoverIntent({
      over: self.toggleClassSubMenu,
      out: self.toggleClassSubMenu,
      selector: " > li",
      timeout: 300
    });
  }
  toggleClassSubMenu() {
    const $item = jquery__WEBPACK_IMPORTED_MODULE_0___default()(this);
    let expanded = $item.attr("aria-expanded");
    if (typeof expanded !== "undefined") {
      expanded = expanded.toLowerCase() === "true";
      $item.toggleClass("main-menu__item--active").attr("aria-expanded", !expanded);
      jquery__WEBPACK_IMPORTED_MODULE_0___default()(".main-menu__sub", $item).attr("aria-expanded", !expanded).attr("aria-hidden", expanded);
    }
  }
}


/***/ }),

/***/ "./js/theme/components/cart/block-cart.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var prestashop__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("prestashop");
/* harmony import */ var prestashop__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(prestashop__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_1__);
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 * PrestaShop is an International Registered Trademark & Property of PrestaShop SA
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License 3.0 (AFL-3.0)
 * that is bundled with this package in the file LICENSE.md.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/AFL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade PrestaShop to newer
 * versions in the future. If you wish to customize PrestaShop for your
 * needs please refer to https://devdocs.prestashop.com/ for more information.
 *
 * @author    PrestaShop SA and Contributors <contact@prestashop.com>
 * @copyright Since 2007 PrestaShop SA and Contributors
 * @license   https://opensource.org/licenses/AFL-3.0 Academic Free License 3.0 (AFL-3.0)
 */


(prestashop__WEBPACK_IMPORTED_MODULE_0___default().blockcart) = (prestashop__WEBPACK_IMPORTED_MODULE_0___default().blockcart) || {};
(prestashop__WEBPACK_IMPORTED_MODULE_0___default().blockcart.showModal) = (html) => {
  function getBlockCartModal() {
    return jquery__WEBPACK_IMPORTED_MODULE_1___default()("#blockcart-modal");
  }
  const $blockCartModal = getBlockCartModal();
  if ($blockCartModal.length) {
    $blockCartModal.hide();
  }
  jquery__WEBPACK_IMPORTED_MODULE_1___default()("body").append(html);
  getBlockCartModal().modal("show").on("hidden.bs.modal", (e) => {
    jquery__WEBPACK_IMPORTED_MODULE_1___default()(e.currentTarget).remove();
  });
};


/***/ }),

/***/ "./js/theme/components/cart/cart.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prestashop__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("prestashop");
/* harmony import */ var prestashop__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prestashop__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _js_theme_utils_debounce__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./js/theme/utils/debounce.js");



(prestashop__WEBPACK_IMPORTED_MODULE_1___default().cart) = (prestashop__WEBPACK_IMPORTED_MODULE_1___default().cart) || {};
(prestashop__WEBPACK_IMPORTED_MODULE_1___default().cart.active_inputs) = null;
const spinnerSelector = 'input[name="product-quantity-spin"]';
let hasError = false;
let isUpdateOperation = false;
let errorMsg = "";
const CheckUpdateQuantityOperations = {
  switchErrorStat: () => {
    const $checkoutBtn = jquery__WEBPACK_IMPORTED_MODULE_0___default()((prestashop__WEBPACK_IMPORTED_MODULE_1___default().themeSelectors.checkout.btn));
    if (jquery__WEBPACK_IMPORTED_MODULE_0___default()((prestashop__WEBPACK_IMPORTED_MODULE_1___default().themeSelectors.notifications.dangerAlert)).length || errorMsg !== "" && !hasError) {
      $checkoutBtn.addClass("disabled");
    }
    if (errorMsg !== "") {
      const strError = `
        <article class="alert alert-danger" role="alert" data-alert="danger">
          <ul class="mb-0">
            <li>${errorMsg}</li>
          </ul>
        </article>
      `;
      jquery__WEBPACK_IMPORTED_MODULE_0___default()((prestashop__WEBPACK_IMPORTED_MODULE_1___default().themeSelectors.notifications.container)).html(strError);
      errorMsg = "";
      isUpdateOperation = false;
      if (hasError) {
        $checkoutBtn.removeClass("disabled");
      }
    } else if (!hasError && isUpdateOperation) {
      hasError = false;
      isUpdateOperation = false;
      jquery__WEBPACK_IMPORTED_MODULE_0___default()((prestashop__WEBPACK_IMPORTED_MODULE_1___default().themeSelectors.notifications.container)).html("");
      $checkoutBtn.removeClass("disabled");
    }
  },
  checkUpdateOperation: (resp) => {
    const { hasError: hasErrorOccurred, errors: errorData } = resp;
    hasError = hasErrorOccurred != null ? hasErrorOccurred : false;
    const errors = errorData != null ? errorData : "";
    if (errors instanceof Array) {
      errorMsg = errors.join(" ");
    } else {
      errorMsg = errors;
    }
    isUpdateOperation = true;
  }
};
function createSpin() {
  jquery__WEBPACK_IMPORTED_MODULE_0___default().each(jquery__WEBPACK_IMPORTED_MODULE_0___default()(spinnerSelector), (index, spinner) => {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()(spinner).TouchSpin({
      verticalupclass: "material-icons touchspin-up",
      verticaldownclass: "material-icons touchspin-down",
      buttondown_class: "btn btn-touchspin js-touchspin js-increase-product-quantity",
      buttonup_class: "btn btn-touchspin js-touchspin js-decrease-product-quantity",
      min: parseInt(jquery__WEBPACK_IMPORTED_MODULE_0___default()(spinner).attr("min"), 10),
      max: 1e6
    });
  });
  CheckUpdateQuantityOperations.switchErrorStat();
}
const preventCustomModalOpen = (event) => {
  if (window.shouldPreventModal) {
    event.preventDefault();
    return false;
  }
  return true;
};
jquery__WEBPACK_IMPORTED_MODULE_0___default()(() => {
  const productLineInCartSelector = (prestashop__WEBPACK_IMPORTED_MODULE_1___default().themeSelectors.cart.productLineQty);
  const promises = [];
  prestashop__WEBPACK_IMPORTED_MODULE_1___default().on("updateCart", () => {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()((prestashop__WEBPACK_IMPORTED_MODULE_1___default().themeSelectors.cart.quickview)).modal("hide");
    jquery__WEBPACK_IMPORTED_MODULE_0___default()("body").addClass("cart-loading");
  });
  prestashop__WEBPACK_IMPORTED_MODULE_1___default().on("updatedCart", () => {
    window.shouldPreventModal = false;
    jquery__WEBPACK_IMPORTED_MODULE_0___default()((prestashop__WEBPACK_IMPORTED_MODULE_1___default().themeSelectors.product.customizationModal)).on("show.bs.modal", (modalEvent) => {
      preventCustomModalOpen(modalEvent);
    });
    createSpin();
    jquery__WEBPACK_IMPORTED_MODULE_0___default()("body").removeClass("cart-loading");
  });
  createSpin();
  const $body = jquery__WEBPACK_IMPORTED_MODULE_0___default()("body");
  function isTouchSpin(namespace) {
    return namespace === "on.startupspin" || namespace === "on.startdownspin";
  }
  function shouldIncreaseProductQuantity(namespace) {
    return namespace === "on.startupspin";
  }
  function findCartLineProductQuantityInput($target) {
    const $input = $target.parents((prestashop__WEBPACK_IMPORTED_MODULE_1___default().themeSelectors.cart.touchspin)).find(productLineInCartSelector);
    if ($input.is(":focus")) {
      return null;
    }
    return $input;
  }
  function camelize(subject) {
    const actionTypeParts = subject.split("-");
    let i;
    let part;
    let camelizedSubject = "";
    for (i = 0; i < actionTypeParts.length; i += 1) {
      part = actionTypeParts[i];
      if (i !== 0) {
        part = part.substring(0, 1).toUpperCase() + part.substring(1);
      }
      camelizedSubject += part;
    }
    return camelizedSubject;
  }
  function parseCartAction($target, namespace) {
    if (!isTouchSpin(namespace)) {
      return {
        url: $target.attr("href"),
        type: camelize($target.data("link-action"))
      };
    }
    const $input = findCartLineProductQuantityInput($target);
    let cartAction = {};
    if ($input) {
      if (shouldIncreaseProductQuantity(namespace)) {
        cartAction = {
          url: $input.data("up-url"),
          type: "increaseProductQuantity"
        };
      } else {
        cartAction = {
          url: $input.data("down-url"),
          type: "decreaseProductQuantity"
        };
      }
    }
    return cartAction;
  }
  const abortPreviousRequests = () => {
    let promise;
    while (promises.length > 0) {
      promise = promises.pop();
      promise.abort();
    }
  };
  const getTouchSpinInput = ($button) => jquery__WEBPACK_IMPORTED_MODULE_0___default()($button.parents((prestashop__WEBPACK_IMPORTED_MODULE_1___default().themeSelectors.cart.touchspin)).find("input"));
  jquery__WEBPACK_IMPORTED_MODULE_0___default()((prestashop__WEBPACK_IMPORTED_MODULE_1___default().themeSelectors.product.customizationModal)).on("show.bs.modal", (modalEvent) => {
    preventCustomModalOpen(modalEvent);
  });
  const handleCartAction = (event) => {
    event.preventDefault();
    window.shouldPreventModal = true;
    const $target = jquery__WEBPACK_IMPORTED_MODULE_0___default()(event.currentTarget);
    const { dataset } = event.currentTarget;
    const cartAction = parseCartAction($target, event.namespace);
    const requestData = {
      ajax: "1",
      action: "update"
    };
    if (typeof cartAction === "undefined") {
      return;
    }
    jquery__WEBPACK_IMPORTED_MODULE_0___default().ajax({
      url: cartAction.url,
      method: "POST",
      data: requestData,
      dataType: "json",
      beforeSend: (jqXHR) => {
        promises.push(jqXHR);
      }
    }).then((resp) => {
      const $quantityInput = getTouchSpinInput($target);
      CheckUpdateQuantityOperations.checkUpdateOperation(resp);
      $quantityInput.val(resp.quantity);
      prestashop__WEBPACK_IMPORTED_MODULE_1___default().emit("updateCart", {
        reason: dataset,
        resp
      });
    }).fail((resp) => {
      prestashop__WEBPACK_IMPORTED_MODULE_1___default().emit("handleError", {
        eventType: "updateProductInCart",
        resp,
        cartAction: cartAction.type
      });
    });
  };
  $body.on("click", (prestashop__WEBPACK_IMPORTED_MODULE_1___default().themeSelectors.cart.actions), handleCartAction);
  function sendUpdateQuantityInCartRequest(updateQuantityInCartUrl, requestData, $target) {
    abortPreviousRequests();
    window.shouldPreventModal = true;
    return jquery__WEBPACK_IMPORTED_MODULE_0___default().ajax({
      url: updateQuantityInCartUrl,
      method: "POST",
      data: requestData,
      dataType: "json",
      beforeSend: (jqXHR) => {
        promises.push(jqXHR);
      }
    }).then((resp) => {
      CheckUpdateQuantityOperations.checkUpdateOperation(resp);
      $target.val(resp.quantity);
      const dataset = $target && $target.dataset ? $target.dataset : resp;
      prestashop__WEBPACK_IMPORTED_MODULE_1___default().emit("updateCart", {
        reason: dataset,
        resp
      });
    }).fail((resp) => {
      prestashop__WEBPACK_IMPORTED_MODULE_1___default().emit("handleError", {
        eventType: "updateProductQuantityInCart",
        resp
      });
    });
  }
  function getQuantityChangeType($quantity) {
    return $quantity > 0 ? "up" : "down";
  }
  function getRequestData(quantity) {
    return {
      ajax: "1",
      qty: Math.abs(quantity),
      action: "update",
      op: getQuantityChangeType(quantity)
    };
  }
  function updateProductQuantityInCart(event) {
    const $target = jquery__WEBPACK_IMPORTED_MODULE_0___default()(event.currentTarget);
    const updateQuantityInCartUrl = $target.data("update-url");
    const baseValue = $target.attr("value");
    const targetValue = $target.val();
    if (targetValue != parseInt(targetValue, 10) || targetValue < 0 || Number.isNaN(targetValue)) {
      window.shouldPreventModal = false;
      $target.val(baseValue);
      return;
    }
    const qty = targetValue - baseValue;
    if (qty === 0) {
      return;
    }
    if (targetValue === "0") {
      $target.closest(".product-line-actions").find('[data-link-action="delete-from-cart"]').click();
    } else {
      $target.attr("value", targetValue);
      sendUpdateQuantityInCartRequest(updateQuantityInCartUrl, getRequestData(qty), $target);
    }
  }
  $body.on("touchspin.on.stopspin", spinnerSelector, (0,_js_theme_utils_debounce__WEBPACK_IMPORTED_MODULE_2__["default"])(updateProductQuantityInCart));
  $body.on(
    "focusout keyup",
    productLineInCartSelector,
    (event) => {
      if (event.type === "keyup") {
        if (event.keyCode === 13) {
          isUpdateOperation = true;
          updateProductQuantityInCart(event);
        }
        return false;
      }
      if (!isUpdateOperation) {
        updateProductQuantityInCart(event);
      }
      return false;
    }
  );
  $body.on(
    "click",
    (prestashop__WEBPACK_IMPORTED_MODULE_1___default().themeSelectors.cart.discountCode),
    (event) => {
      event.stopPropagation();
      event.preventDefault();
      const $code = jquery__WEBPACK_IMPORTED_MODULE_0___default()(event.currentTarget);
      const $discountInput = jquery__WEBPACK_IMPORTED_MODULE_0___default()("[name=discount_name]");
      const $discountForm = $discountInput.closest("form");
      $discountInput.val($code.text());
      $discountForm.trigger("submit");
      return false;
    }
  );
});


/***/ }),

/***/ "./js/theme/components/customer.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);

function initRmaItemSelector() {
  jquery__WEBPACK_IMPORTED_MODULE_0___default()(`${prestashop.themeSelectors.order.returnForm} table thead input[type=checkbox]`).on("click", ({ currentTarget }) => {
    const checked = jquery__WEBPACK_IMPORTED_MODULE_0___default()(currentTarget).prop("checked");
    jquery__WEBPACK_IMPORTED_MODULE_0___default()(`${prestashop.themeSelectors.order.returnForm} table tbody input[type=checkbox]`).each((_, checkbox) => {
      jquery__WEBPACK_IMPORTED_MODULE_0___default()(checkbox).prop("checked", checked);
    });
  });
}
function setupCustomerScripts() {
  if (jquery__WEBPACK_IMPORTED_MODULE_0___default()("body#order-detail")) {
    initRmaItemSelector();
  }
}
jquery__WEBPACK_IMPORTED_MODULE_0___default()(document).ready(setupCustomerScripts);


/***/ }),

/***/ "./js/theme/components/dynamic-bootstrap-components.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _js_theme_utils_DynamicImportHandler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./js/theme/utils/DynamicImportHandler.js");


jquery__WEBPACK_IMPORTED_MODULE_0___default()(() => {
  const importModal = new _js_theme_utils_DynamicImportHandler__WEBPACK_IMPORTED_MODULE_1__["default"]({
    jqueryPluginCover: "modal",
    DOMEvents: "click",
    DOMEventsSelector: '[data-toggle="modal"]',
    DOMEventsPreventDefault: true,
    files: () => [
      __webpack_require__.e(/* import() */ "vendors-node_modules_bootstrap_js_src_modal_js").then(__webpack_require__.bind(__webpack_require__, "./node_modules/bootstrap/js/src/modal.js")),
      __webpack_require__.e(/* import() */ "css_dynamic_modal__index_scss").then(__webpack_require__.bind(__webpack_require__, "./css/dynamic/modal/_index.scss"))
    ]
  });
  const importDropdown = new _js_theme_utils_DynamicImportHandler__WEBPACK_IMPORTED_MODULE_1__["default"]({
    jqueryPluginCover: "dropdown",
    DOMEvents: "click",
    DOMEventsSelector: '[data-toggle="dropdown"]',
    DOMEventsPreventDefault: true,
    files: () => [
      Promise.all(/* import() */[__webpack_require__.e("vendors-node_modules_bootstrap_js_src_util_js-node_modules_popper_js_dist_esm_popper_js"), __webpack_require__.e("vendors-node_modules_bootstrap_js_src_dropdown_js")]).then(__webpack_require__.bind(__webpack_require__, "./node_modules/bootstrap/js/src/dropdown.js")),
      __webpack_require__.e(/* import() */ "css_dynamic_dropdown__index_scss").then(__webpack_require__.bind(__webpack_require__, "./css/dynamic/dropdown/_index.scss"))
    ]
  });
  const importCollapse = new _js_theme_utils_DynamicImportHandler__WEBPACK_IMPORTED_MODULE_1__["default"]({
    jqueryPluginCover: "collapse",
    DOMEvents: "click",
    DOMEventsSelector: '[data-toggle="collapse"]',
    DOMEventsPreventDefault: true,
    files: () => [
      __webpack_require__.e(/* import() */ "vendors-node_modules_bootstrap_js_src_collapse_js").then(__webpack_require__.bind(__webpack_require__, "./node_modules/bootstrap/js/src/collapse.js"))
    ]
  });
  const importPopover = new _js_theme_utils_DynamicImportHandler__WEBPACK_IMPORTED_MODULE_1__["default"]({
    jqueryPluginCover: "popover",
    files: () => [
      Promise.all(/* import() */[__webpack_require__.e("vendors-node_modules_bootstrap_js_src_util_js-node_modules_popper_js_dist_esm_popper_js"), __webpack_require__.e("vendors-node_modules_bootstrap_js_src_tooltip_js"), __webpack_require__.e("node_modules_bootstrap_js_src_popover_js")]).then(__webpack_require__.bind(__webpack_require__, "./node_modules/bootstrap/js/src/popover.js")),
      __webpack_require__.e(/* import() */ "css_dynamic_popover__index_scss").then(__webpack_require__.bind(__webpack_require__, "./css/dynamic/popover/_index.scss"))
    ]
  });
  const importScrollspy = new _js_theme_utils_DynamicImportHandler__WEBPACK_IMPORTED_MODULE_1__["default"]({
    jqueryPluginCover: "scrollspy",
    files: () => [
      __webpack_require__.e(/* import() */ "vendors-node_modules_bootstrap_js_src_scrollspy_js").then(__webpack_require__.bind(__webpack_require__, "./node_modules/bootstrap/js/src/scrollspy.js"))
    ]
  });
  const importToast = new _js_theme_utils_DynamicImportHandler__WEBPACK_IMPORTED_MODULE_1__["default"]({
    jqueryPluginCover: "toast",
    files: () => [
      __webpack_require__.e(/* import() */ "node_modules_bootstrap_js_src_toast_js").then(__webpack_require__.bind(__webpack_require__, "./node_modules/bootstrap/js/src/toast.js")),
      __webpack_require__.e(/* import() */ "css_dynamic_toast__index_scss").then(__webpack_require__.bind(__webpack_require__, "./css/dynamic/toast/_index.scss"))
    ]
  });
  const importTooltip = new _js_theme_utils_DynamicImportHandler__WEBPACK_IMPORTED_MODULE_1__["default"]({
    jqueryPluginCover: "tooltip",
    files: () => [
      Promise.all(/* import() */[__webpack_require__.e("vendors-node_modules_bootstrap_js_src_util_js-node_modules_popper_js_dist_esm_popper_js"), __webpack_require__.e("vendors-node_modules_bootstrap_js_src_tooltip_js")]).then(__webpack_require__.bind(__webpack_require__, "./node_modules/bootstrap/js/src/tooltip.js")),
      __webpack_require__.e(/* import() */ "css_dynamic_tooltip__index_scss").then(__webpack_require__.bind(__webpack_require__, "./css/dynamic/tooltip/_index.scss"))
    ]
  });
});


/***/ }),

/***/ "./js/theme/components/form.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Form)
/* harmony export */ });
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);

const supportedValidity = () => {
  const input = document.createElement("input");
  return "validity" in input && "badInput" in input.validity && "patternMismatch" in input.validity && "rangeOverflow" in input.validity && "rangeUnderflow" in input.validity && "tooLong" in input.validity && "tooShort" in input.validity && "typeMismatch" in input.validity && "valid" in input.validity && "valueMissing" in input.validity;
};
class Form {
  static init() {
    Form.parentFocus();
    Form.togglePasswordVisibility();
    Form.formValidation();
  }
  static parentFocus() {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()(".js-child-focus").on("focus", ({ target }) => {
      jquery__WEBPACK_IMPORTED_MODULE_0___default()(target).closest(".js-parent-focus").addClass("focus");
    });
    jquery__WEBPACK_IMPORTED_MODULE_0___default()(".js-child-focus").on("focusout", ({ target }) => {
      jquery__WEBPACK_IMPORTED_MODULE_0___default()(target).closest(".js-parent-focus").removeClass("focus");
    });
  }
  static togglePasswordVisibility() {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('[data-action="show-password"]').on("click", (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      const $btn = jquery__WEBPACK_IMPORTED_MODULE_0___default()(e.currentTarget);
      const $input = $btn.closest(".input-group").children("input.js-visible-password");
      if ($input.attr("type") === "password") {
        $input.attr("type", "text");
        $btn.html($btn.data("text-hide"));
      } else {
        $input.attr("type", "password");
        $btn.html($btn.data("textShow"));
      }
    });
  }
  static formValidation() {
    const forms = document.getElementsByClassName("needs-validation");
    if (forms.length > 0) {
      if (!supportedValidity()) {
        return;
      }
      let divToScroll = false;
      jquery__WEBPACK_IMPORTED_MODULE_0___default()("input, textarea", forms).on("blur", (e) => {
        const $field = jquery__WEBPACK_IMPORTED_MODULE_0___default()(e.currentTarget);
        $field.val($field.val().trim());
      });
      Array.prototype.filter.call(forms, (form) => {
        form.addEventListener(
          "submit",
          (event) => {
            if (form.checkValidity() === false) {
              event.preventDefault();
              event.stopPropagation();
              jquery__WEBPACK_IMPORTED_MODULE_0___default()("input:invalid,select:invalid,textarea:invalid", form).each((index, field) => {
                const $field = jquery__WEBPACK_IMPORTED_MODULE_0___default()(field);
                const $parent = $field.closest(".form-group");
                jquery__WEBPACK_IMPORTED_MODULE_0___default()(".js-invalid-feedback-browser", $parent).text(
                  $field[0].validationMessage
                );
                if (!divToScroll) {
                  divToScroll = $parent;
                }
              });
              const $form = jquery__WEBPACK_IMPORTED_MODULE_0___default()(form);
              $form.data("disabled", false);
              $form.find('[type="submit"]').removeClass("disabled");
            }
            form.classList.add("was-validated");
            if (divToScroll) {
              jquery__WEBPACK_IMPORTED_MODULE_0___default()("html, body").animate(
                { scrollTop: divToScroll.offset().top },
                300
              );
              divToScroll = false;
            }
          },
          false
        );
      });
    }
  }
}


/***/ }),

/***/ "./js/theme/components/product.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prestashop__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("prestashop");
/* harmony import */ var prestashop__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prestashop__WEBPACK_IMPORTED_MODULE_1__);


jquery__WEBPACK_IMPORTED_MODULE_0___default()(() => {
  const createInputFile = () => {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()(".js-file-input").on("change", (event) => {
      const target = jquery__WEBPACK_IMPORTED_MODULE_0___default()(event.currentTarget)[0];
      const file = target ? target.files[0] : null;
      if (target && file) {
        jquery__WEBPACK_IMPORTED_MODULE_0___default()(target).prev().text(file.name);
      }
    });
  };
  const createProductSpin = () => {
    const $quantityInput = jquery__WEBPACK_IMPORTED_MODULE_0___default()("#quantity_wanted");
    $quantityInput.TouchSpin({
      verticalupclass: "material-icons touchspin-up",
      verticaldownclass: "material-icons touchspin-down",
      buttondown_class: "btn btn-touchspin js-touchspin",
      buttonup_class: "btn btn-touchspin js-touchspin",
      min: parseInt($quantityInput.attr("min"), 10),
      max: 1e6
    });
    $quantityInput.on("focusout", () => {
      if ($quantityInput.val() === "" || $quantityInput.val() < $quantityInput.attr("min")) {
        $quantityInput.val($quantityInput.attr("min"));
        $quantityInput.trigger("change");
      }
    });
    jquery__WEBPACK_IMPORTED_MODULE_0___default()("body").on("change keyup", "#quantity_wanted", (event) => {
      jquery__WEBPACK_IMPORTED_MODULE_0___default()(event.currentTarget).trigger("touchspin.stopspin");
      prestashop__WEBPACK_IMPORTED_MODULE_1___default().emit("updateProduct", {
        eventType: "updatedProductQuantity",
        event
      });
    });
  };
  createProductSpin();
  createInputFile();
  let updateEvenType = false;
  prestashop__WEBPACK_IMPORTED_MODULE_1___default().on("updateProduct", ({ eventType }) => {
    updateEvenType = eventType;
  });
  prestashop__WEBPACK_IMPORTED_MODULE_1___default().on("updateCart", (event) => {
    if ((prestashop__WEBPACK_IMPORTED_MODULE_1___default().page.page_name) === "product" && parseInt(event.reason.idProduct, 10) === parseInt(jquery__WEBPACK_IMPORTED_MODULE_0___default()("#add-to-cart-or-refresh").find('[name="id_product"]').val(), 10)) {
      prestashop__WEBPACK_IMPORTED_MODULE_1___default().emit("updateProduct", {
        event,
        resp: {},
        reason: {
          productUrl: (prestashop__WEBPACK_IMPORTED_MODULE_1___default().urls.pages.product) || ""
        }
      });
    }
  });
  prestashop__WEBPACK_IMPORTED_MODULE_1___default().on("updatedProduct", (event) => {
    createInputFile();
    if (event && event.product_minimal_quantity) {
      const minimalProductQuantity = parseInt(event.product_minimal_quantity, 10);
      const quantityInputSelector = "#quantity_wanted";
      const quantityInput = jquery__WEBPACK_IMPORTED_MODULE_0___default()(quantityInputSelector);
      quantityInput.trigger("touchspin.updatesettings", {
        min: minimalProductQuantity
      });
    }
    if (updateEvenType === "updatedProductCombination") {
      jquery__WEBPACK_IMPORTED_MODULE_0___default()(".js-product-images").replaceWith(event.product_cover_thumbnails);
      jquery__WEBPACK_IMPORTED_MODULE_0___default()(".js-product-images-modal").replaceWith(event.product_images_modal);
      prestashop__WEBPACK_IMPORTED_MODULE_1___default().emit("updatedProductCombination", event);
    }
    updateEvenType = false;
    prestashop__WEBPACK_IMPORTED_MODULE_1___default().pageLazyLoad.update();
  });
});


/***/ }),

/***/ "./js/theme/components/quickview.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prestashop__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("prestashop");
/* harmony import */ var prestashop__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prestashop__WEBPACK_IMPORTED_MODULE_1__);


jquery__WEBPACK_IMPORTED_MODULE_0___default()(() => {
  const productConfig = (qv) => {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()(".js-thumb").on("click", (event) => {
      if (jquery__WEBPACK_IMPORTED_MODULE_0___default()(".js-thumb").hasClass("selected")) {
        jquery__WEBPACK_IMPORTED_MODULE_0___default()(".js-thumb").removeClass("selected");
      }
      jquery__WEBPACK_IMPORTED_MODULE_0___default()(event.currentTarget).addClass("selected");
      jquery__WEBPACK_IMPORTED_MODULE_0___default()(".js-qv-product-cover").attr("src", jquery__WEBPACK_IMPORTED_MODULE_0___default()(event.target).data("image-large-src"));
    });
    qv.find("#quantity_wanted").TouchSpin({
      verticalupclass: "material-icons touchspin-up",
      verticaldownclass: "material-icons touchspin-down",
      buttondown_class: "btn btn-touchspin js-touchspin",
      buttonup_class: "btn btn-touchspin js-touchspin",
      min: 1,
      max: 1e6
    });
  };
  prestashop__WEBPACK_IMPORTED_MODULE_1___default().on("clickQuickView", (elm) => {
    const data = {
      action: "quickview",
      id_product: elm.dataset.idProduct,
      id_product_attribute: elm.dataset.idProductAttribute
    };
    jquery__WEBPACK_IMPORTED_MODULE_0___default().post((prestashop__WEBPACK_IMPORTED_MODULE_1___default().urls.pages.product), data, null, "json").then((resp) => {
      jquery__WEBPACK_IMPORTED_MODULE_0___default()("body").append(resp.quickview_html);
      const productModal = jquery__WEBPACK_IMPORTED_MODULE_0___default()(
        `#quickview-modal-${resp.product.id}-${resp.product.id_product_attribute}`
      );
      productModal.modal("show");
      productConfig(productModal);
      productModal.on("hidden.bs.modal", () => {
        productModal.remove();
      });
    }).fail((resp) => {
      prestashop__WEBPACK_IMPORTED_MODULE_1___default().emit("handleError", {
        eventType: "clickQuickView",
        resp
      });
    });
  });
});


/***/ }),

/***/ "./js/theme/components/responsive.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prestashop__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("prestashop");
/* harmony import */ var prestashop__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prestashop__WEBPACK_IMPORTED_MODULE_1__);


const isMobile = () => (prestashop__WEBPACK_IMPORTED_MODULE_1___default().responsive.current_width) < (prestashop__WEBPACK_IMPORTED_MODULE_1___default().responsive.min_width);
(prestashop__WEBPACK_IMPORTED_MODULE_1___default().responsive) = (prestashop__WEBPACK_IMPORTED_MODULE_1___default().responsive) || {};
(prestashop__WEBPACK_IMPORTED_MODULE_1___default().responsive.current_width) = window.innerWidth;
(prestashop__WEBPACK_IMPORTED_MODULE_1___default().responsive.min_width) = 768;
(prestashop__WEBPACK_IMPORTED_MODULE_1___default().responsive.mobile) = isMobile();
function swapChildren(obj1, obj2) {
  const temp = obj2.children().detach();
  obj2.empty().append(obj1.children().detach());
  obj1.append(temp);
}
function toggleMobileStyles() {
  if ((prestashop__WEBPACK_IMPORTED_MODULE_1___default().responsive.mobile)) {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()("*[id^='_desktop_']").each((idx, el) => {
      const target = jquery__WEBPACK_IMPORTED_MODULE_0___default()(`#${el.id.replace("_desktop_", "_mobile_")}`);
      if (target.length) {
        swapChildren(jquery__WEBPACK_IMPORTED_MODULE_0___default()(el), target);
      }
    });
    jquery__WEBPACK_IMPORTED_MODULE_0___default()("[data-collapse-hide-mobile]").collapse("hide");
  } else {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()("*[id^='_mobile_']").each((idx, el) => {
      const target = jquery__WEBPACK_IMPORTED_MODULE_0___default()(`#${el.id.replace("_mobile_", "_desktop_")}`);
      if (target.length) {
        swapChildren(jquery__WEBPACK_IMPORTED_MODULE_0___default()(el), target);
      }
    });
    jquery__WEBPACK_IMPORTED_MODULE_0___default()("[data-collapse-hide-mobile]").not(".show").collapse("show");
    jquery__WEBPACK_IMPORTED_MODULE_0___default()("[data-modal-hide-mobile].show").modal("hide");
  }
  prestashop__WEBPACK_IMPORTED_MODULE_1___default().emit("responsive update", {
    mobile: (prestashop__WEBPACK_IMPORTED_MODULE_1___default().responsive.mobile)
  });
}
jquery__WEBPACK_IMPORTED_MODULE_0___default()(window).on("resize", () => {
  const { responsive } = (prestashop__WEBPACK_IMPORTED_MODULE_1___default());
  const cw = responsive.current_width;
  const mw = responsive.min_width;
  const w = window.innerWidth;
  const toggle = cw >= mw && w < mw || cw < mw && w >= mw;
  responsive.current_width = w;
  responsive.mobile = responsive.current_width < responsive.min_width;
  if (toggle) {
    toggleMobileStyles();
  }
});
jquery__WEBPACK_IMPORTED_MODULE_0___default()(() => {
  if ((prestashop__WEBPACK_IMPORTED_MODULE_1___default().responsive.mobile)) {
    toggleMobileStyles();
  }
});


/***/ }),

/***/ "./js/theme/components/selectors.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var prestashop__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("prestashop");
/* harmony import */ var prestashop__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(prestashop__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_1__);


(prestashop__WEBPACK_IMPORTED_MODULE_0___default().themeSelectors) = {
  product: {
    tabs: ".tabs .nav-link",
    activeNavClass: "js-product-nav-active",
    activeTabClass: "js-product-tab-active",
    activeTabs: ".tabs .nav-link.active, .js-product-nav-active",
    imagesModal: ".js-product-images-modal",
    thumb: ".js-thumb",
    thumbContainer: ".thumb-container, .js-thumb-container",
    arrows: ".js-arrows",
    selected: ".selected, .js-thumb-selected",
    modalProductCover: ".js-modal-product-cover",
    cover: ".js-qv-product-cover",
    customizationModal: ".js-customization-modal"
  },
  listing: {
    searchFilterToggler: "#search_filter_toggler, .js-search-toggler",
    searchFiltersWrapper: "#search_filters_wrapper",
    searchFilterControls: "#search_filter_controls",
    searchFilters: "#search_filters",
    activeSearchFilters: "#js-active-search-filters",
    listTop: "#js-product-list-top",
    list: "#js-product-list",
    listBottom: "#js-product-list-bottom",
    listHeader: "#js-product-list-header",
    searchFiltersClearAll: ".js-search-filters-clear-all",
    searchLink: ".js-search-link"
  },
  order: {
    returnForm: "#order-return-form, .js-order-return-form"
  },
  arrowDown: ".arrow-down, .js-arrow-down",
  arrowUp: ".arrow-up, .js-arrow-up",
  clear: ".clear",
  fileInput: ".js-file-input",
  contentWrapper: "#content-wrapper, .js-content-wrapper",
  footer: "#footer, .js-footer",
  modalContent: ".js-modal-content",
  modal: ".js-checkout-modal",
  touchspin: ".js-touchspin",
  checkout: {
    termsLink: ".js-terms a",
    giftCheckbox: ".js-gift-checkbox",
    imagesLink: ".card-block .cart-summary-products p a, .js-show-details",
    carrierExtraContent: ".carrier-extra-content, .js-carrier-extra-content",
    btn: ".checkout a"
  },
  cart: {
    productLineQty: ".js-cart-line-product-quantity",
    quickview: ".quickview",
    touchspin: ".bootstrap-touchspin",
    promoCode: "#promo-code",
    displayPromo: ".display-promo",
    promoCodeButton: ".promo-code-button",
    discountCode: ".js-discount .code",
    discountName: "[name=discount_name]",
    actions: '[data-link-action="delete-from-cart"], [data-link-action="remove-voucher"]'
  },
  notifications: {
    dangerAlert: "#notifications article.alert-danger",
    container: "#notifications .container"
  },
  passwordPolicy: {
    template: "#password-feedback",
    hint: ".js-hint-password",
    container: ".js-password-strength-feedback",
    strengthText: ".js-password-strength-text",
    requirementScore: ".js-password-requirements-score",
    requirementLength: ".js-password-requirements-length",
    requirementScoreIcon: ".js-password-requirements-score i",
    requirementLengthIcon: ".js-password-requirements-length i",
    progressBar: ".js-password-policy-progress-bar",
    inputColumn: ".js-input-column"
  }
};
jquery__WEBPACK_IMPORTED_MODULE_1___default()(() => {
  prestashop__WEBPACK_IMPORTED_MODULE_0___default().emit("themeSelectorsInit");
});


/***/ }),

/***/ "./js/theme/components/sliders.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var prestashop__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("prestashop");
/* harmony import */ var prestashop__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(prestashop__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _js_theme_components_sliders_PageSlider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./js/theme/components/sliders/PageSlider.js");
/* harmony import */ var _js_theme_components_sliders_SwiperSlider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./js/theme/components/sliders/SwiperSlider.js");




(prestashop__WEBPACK_IMPORTED_MODULE_0___default().pageSlider) = new _js_theme_components_sliders_PageSlider__WEBPACK_IMPORTED_MODULE_2__["default"]();
(prestashop__WEBPACK_IMPORTED_MODULE_0___default().SwiperSlider) = _js_theme_components_sliders_SwiperSlider__WEBPACK_IMPORTED_MODULE_3__["default"];
jquery__WEBPACK_IMPORTED_MODULE_1___default()(() => {
  prestashop__WEBPACK_IMPORTED_MODULE_0___default().pageSlider.init();
});


/***/ }),

/***/ "./js/theme/components/sliders/DynamicImportSwiperModule.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class DynamicImportSwiperModule {
  constructor(getFiles) {
    this.getFiles = getFiles;
  }
  getModule() {
    return Promise.all(this.getFiles());
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DynamicImportSwiperModule);


/***/ }),

/***/ "./js/theme/components/sliders/PageSlider.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _js_theme_components_sliders_SwiperSlider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./js/theme/components/sliders/SwiperSlider.js");
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

class PageSlider {
  constructor() {
    this.observeElementClass = "js-slider-observed";
    this.selfInitializedSlidersSelector = ".swiper:not(.swiper-custom)";
  }
  init() {
    const self = this;
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(({ intersectionRatio, target }) => {
        if (intersectionRatio > 0) {
          self.observer.unobserve(target);
          PageSlider.initSlider(target);
        }
      });
    });
    this.observerElements();
  }
  static initSlider(target) {
    const swiper = new _js_theme_components_sliders_SwiperSlider__WEBPACK_IMPORTED_MODULE_0__["default"](target, PageSlider.getConfigForSliderElement(target));
    swiper.initSlider();
  }
  static getConfigForSliderElement(target) {
    let elConfig = target.dataset.swiper || {};
    if (typeof elConfig === "string") {
      elConfig = JSON.parse(elConfig);
    }
    const parent = target.parentElement;
    const nextEl = parent.querySelector(".swiper-button-next");
    const prevEl = parent.querySelector(".swiper-button-prev");
    const pagination = parent.querySelector(".swiper-pagination");
    if (nextEl && prevEl && typeof elConfig.navigation === "undefined") {
      elConfig = __spreadProps(__spreadValues({}, elConfig), {
        navigation: {
          nextEl,
          prevEl
        }
      });
    }
    if (pagination && typeof elConfig.pagination === "undefined") {
      elConfig = __spreadProps(__spreadValues({}, elConfig), {
        pagination: {
          el: pagination,
          type: "bullets",
          clickable: true
        }
      });
    }
    return elConfig;
  }
  observerElements() {
    const elms = document.querySelectorAll(this.selfInitializedSlidersSelector);
    for (let i = 0; i < elms.length; i += 1) {
      const elem = elms[i];
      if (!elem.classList.contains(this.observeElementClass)) {
        this.observer.observe(elem);
        elem.classList.add(this.observeElementClass);
      }
    }
  }
  refresh() {
    this.observerElements();
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PageSlider);


/***/ }),

/***/ "./js/theme/components/sliders/SwiperSlider.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var swiper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/swiper/modules/navigation/navigation.js");
/* harmony import */ var swiper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/swiper/modules/pagination/pagination.js");
/* harmony import */ var swiper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/swiper/modules/autoplay/autoplay.js");
/* harmony import */ var swiper__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/swiper/core/core.js");
/* harmony import */ var _js_theme_components_sliders_DynamicImportSwiperModule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./js/theme/components/sliders/DynamicImportSwiperModule.js");
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};


const dynamicModulesMap = {
  thumbs: new _js_theme_components_sliders_DynamicImportSwiperModule__WEBPACK_IMPORTED_MODULE_0__["default"](
    () => [
      __webpack_require__.e(/* import() */ "node_modules_swiper_modules_thumbs_thumbs_js").then(__webpack_require__.bind(__webpack_require__, "./node_modules/swiper/modules/thumbs/thumbs.js"))
    ]
  ),
  virtual: new _js_theme_components_sliders_DynamicImportSwiperModule__WEBPACK_IMPORTED_MODULE_0__["default"](
    () => [
      __webpack_require__.e(/* import() */ "vendors-node_modules_swiper_modules_virtual_virtual_js").then(__webpack_require__.bind(__webpack_require__, "./node_modules/swiper/modules/virtual/virtual.js")),
      __webpack_require__.e(/* import() */ "node_modules_swiper_modules_virtual_virtual_scss").then(__webpack_require__.bind(__webpack_require__, "./node_modules/swiper/modules/virtual/virtual.scss"))
    ]
  ),
  keyboard: new _js_theme_components_sliders_DynamicImportSwiperModule__WEBPACK_IMPORTED_MODULE_0__["default"](
    () => [
      __webpack_require__.e(/* import() */ "node_modules_swiper_modules_keyboard_keyboard_js").then(__webpack_require__.bind(__webpack_require__, "./node_modules/swiper/modules/keyboard/keyboard.js"))
    ]
  ),
  mousewheel: new _js_theme_components_sliders_DynamicImportSwiperModule__WEBPACK_IMPORTED_MODULE_0__["default"](
    () => [
      __webpack_require__.e(/* import() */ "vendors-node_modules_swiper_modules_mousewheel_mousewheel_js").then(__webpack_require__.bind(__webpack_require__, "./node_modules/swiper/modules/mousewheel/mousewheel.js"))
    ]
  ),
  scrollbar: new _js_theme_components_sliders_DynamicImportSwiperModule__WEBPACK_IMPORTED_MODULE_0__["default"](
    () => [
      __webpack_require__.e(/* import() */ "vendors-node_modules_swiper_modules_scrollbar_scrollbar_js").then(__webpack_require__.bind(__webpack_require__, "./node_modules/swiper/modules/scrollbar/scrollbar.js")),
      __webpack_require__.e(/* import() */ "node_modules_swiper_modules_scrollbar_scrollbar_scss").then(__webpack_require__.bind(__webpack_require__, "./node_modules/swiper/modules/scrollbar/scrollbar.scss"))
    ]
  ),
  parallax: new _js_theme_components_sliders_DynamicImportSwiperModule__WEBPACK_IMPORTED_MODULE_0__["default"](
    () => [
      __webpack_require__.e(/* import() */ "node_modules_swiper_modules_parallax_parallax_js").then(__webpack_require__.bind(__webpack_require__, "./node_modules/swiper/modules/parallax/parallax.js"))
    ]
  ),
  zoom: new _js_theme_components_sliders_DynamicImportSwiperModule__WEBPACK_IMPORTED_MODULE_0__["default"](
    () => [
      __webpack_require__.e(/* import() */ "vendors-node_modules_swiper_modules_zoom_zoom_js").then(__webpack_require__.bind(__webpack_require__, "./node_modules/swiper/modules/zoom/zoom.js")),
      __webpack_require__.e(/* import() */ "node_modules_swiper_modules_zoom_zoom_scss").then(__webpack_require__.bind(__webpack_require__, "./node_modules/swiper/modules/zoom/zoom.scss"))
    ]
  ),
  freeMode: new _js_theme_components_sliders_DynamicImportSwiperModule__WEBPACK_IMPORTED_MODULE_0__["default"](
    () => [
      __webpack_require__.e(/* import() */ "node_modules_swiper_modules_free-mode_free-mode_js").then(__webpack_require__.bind(__webpack_require__, "./node_modules/swiper/modules/free-mode/free-mode.js")),
      __webpack_require__.e(/* import() */ "node_modules_swiper_modules_free-mode_free-mode_scss").then(__webpack_require__.bind(__webpack_require__, "./node_modules/swiper/modules/free-mode/free-mode.scss"))
    ]
  ),
  controller: new _js_theme_components_sliders_DynamicImportSwiperModule__WEBPACK_IMPORTED_MODULE_0__["default"](
    () => [
      __webpack_require__.e(/* import() */ "node_modules_swiper_modules_controller_controller_js").then(__webpack_require__.bind(__webpack_require__, "./node_modules/swiper/modules/controller/controller.js")),
      Promise.all(/* import() */[__webpack_require__.e("vendors-node_modules_swiper_modules_controller_controller_scss"), __webpack_require__.e("node_modules_swiper_modules_controller_controller_scss")]).then(__webpack_require__.bind(__webpack_require__, "./node_modules/swiper/modules/controller/controller.scss"))
    ]
  )
};
const defaultModules = [swiper__WEBPACK_IMPORTED_MODULE_1__["default"], swiper__WEBPACK_IMPORTED_MODULE_2__["default"], swiper__WEBPACK_IMPORTED_MODULE_3__["default"]];
class SwiperSlider {
  constructor(target, options) {
    this.target = target;
    this.options = options;
    this.modules = defaultModules;
    this._modulesToFetch = [];
    this.SwiperInstance = null;
  }
  initSlider() {
    return __async(this, null, function* () {
      this.findNeededModulesToFetch();
      yield this.fetchNeededModules();
      yield this.initSwiper();
      return this.SwiperInstance;
    });
  }
  initSwiper() {
    this.SwiperInstance = new swiper__WEBPACK_IMPORTED_MODULE_4__["default"](this.target, __spreadProps(__spreadValues({}, this.options), {
      modules: this.modules
    }));
  }
  fetchNeededModules() {
    return __async(this, null, function* () {
      if (this._modulesToFetch.length > 0) {
        const modulesPromisesArray = [];
        for (const module of this._modulesToFetch) {
          modulesPromisesArray.push(module.getFiles());
        }
        const allPromises = Promise.all(
          modulesPromisesArray.map((innerModulesPromisesArray) => Promise.all(innerModulesPromisesArray))
        );
        return allPromises.then((arrayOfModules) => {
          for (const moduleImported of arrayOfModules) {
            for (const module of moduleImported) {
              if (typeof module.default !== "undefined") {
                this.modules = [...this.modules, module.default];
              }
            }
          }
        });
      }
      return Promise.resolve();
    });
  }
  findNeededModulesToFetch() {
    for (const dynamicModuleProp in dynamicModulesMap) {
      if (Object.prototype.hasOwnProperty.call(dynamicModulesMap, dynamicModuleProp) && typeof this.options[dynamicModuleProp] !== "undefined") {
        this._modulesToFetch.push(dynamicModulesMap[dynamicModuleProp]);
      }
    }
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SwiperSlider);


/***/ }),

/***/ "./js/theme/components/useAlertToast.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _js_theme_utils_parseToHtml__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./js/theme/utils/parseToHtml.js");

let id = 0;
const getId = (prefix = "alert_toast_") => {
  id += 1;
  return prefix + id;
};
const useAlertToast = (params) => {
  const {
    duration = 4e3
  } = params || {};
  const stackTemplateId = "alert-toast-stack";
  const bodyElement = document.querySelector("body");
  const buildToastTemplate = (text, type, toastId) => (0,_js_theme_utils_parseToHtml__WEBPACK_IMPORTED_MODULE_0__["default"])(`
    <div class="alert-toast alert-toast--${type} d-none" id=${toastId}>
      <div class="alert-toast__content">
        ${text}
      </div>
    </div>
  `);
  const buildToastStackTemplate = () => (0,_js_theme_utils_parseToHtml__WEBPACK_IMPORTED_MODULE_0__["default"])(`
    <div id="${stackTemplateId}" class="alert-toast-stack">
    </div>
  `);
  const getToastStackTemplate = () => {
    const getElement = () => document.querySelector(`#${stackTemplateId}`);
    if (!getElement()) {
      bodyElement.append(buildToastStackTemplate());
    }
    return getElement();
  };
  const hideToast = (toast) => {
    toast.classList.remove("show");
    const hideDuration = parseFloat(window.getComputedStyle(toast).transitionDuration) * 1e3;
    setTimeout(() => {
      toast.remove();
    }, hideDuration);
  };
  const showToast = (text, type, timeOut = false) => {
    const toastId = getId();
    const toast = buildToastTemplate(text, type, toastId);
    const toastStack = getToastStackTemplate();
    timeOut = timeOut || duration;
    toastStack.prepend(toast);
    const toastInDOM = document.querySelector(`#${toastId}`);
    toastInDOM.classList.remove("d-none");
    setTimeout(() => {
      toastInDOM.classList.add("show");
    }, 10);
    toastInDOM.dataset.timeoutId = setTimeout(() => {
      hideToast(toastInDOM);
    }, timeOut);
  };
  const info = (text, timeOut = false) => {
    showToast(text, "info", timeOut);
  };
  const success = (text, timeOut = false) => {
    showToast(text, "success", timeOut);
  };
  const danger = (text, timeOut = false) => {
    showToast(text, "danger", timeOut);
  };
  const warning = (text, timeOut = false) => {
    showToast(text, "warning", timeOut);
  };
  return {
    info,
    success,
    danger,
    warning,
    showToast
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useAlertToast);


/***/ }),

/***/ "./js/theme/components/usePasswordPolicy.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var sprintf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/sprintf-js/src/sprintf.js");
/* harmony import */ var sprintf_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sprintf_js__WEBPACK_IMPORTED_MODULE_0__);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

const { passwordPolicy: PasswordPolicyMap } = prestashop.themeSelectors;
const PASSWORD_POLICY_ERROR = "The password policy elements are undefined.";
const getPasswordStrengthFeedback = (strength) => {
  switch (strength) {
    case 0:
      return {
        color: "bg-danger"
      };
    case 1:
      return {
        color: "bg-danger"
      };
    case 2:
      return {
        color: "bg-warning"
      };
    case 3:
      return {
        color: "bg-success"
      };
    case 4:
      return {
        color: "bg-success"
      };
    default:
      throw new Error("Invalid password strength indicator.");
  }
};
const watchPassword = (elementInput, feedbackContainer, hints) => __async(void 0, null, function* () {
  const { prestashop: prestashop2 } = window;
  const passwordValue = elementInput.value;
  const elementIcon = feedbackContainer.querySelector(PasswordPolicyMap.requirementScoreIcon);
  const result = yield prestashop2.checkPasswordScore(passwordValue);
  const feedback = getPasswordStrengthFeedback(result.score);
  const passwordLength = passwordValue.length;
  const popoverContent = [];
  $(elementInput).popover("dispose");
  feedbackContainer.style.display = passwordValue === "" ? "none" : "block";
  if (result.feedback.warning !== "") {
    if (result.feedback.warning in hints) {
      popoverContent.push(hints[result.feedback.warning]);
    }
  }
  result.feedback.suggestions.forEach((suggestion) => {
    if (suggestion in hints) {
      popoverContent.push(hints[suggestion]);
    }
  });
  $(elementInput).popover({
    html: true,
    placement: "top",
    content: popoverContent.join("<br/>")
  }).popover("show");
  const passwordLengthValid = passwordLength >= parseInt(elementInput.dataset.minlength, 10) && passwordLength <= parseInt(elementInput.dataset.maxlength, 10);
  const passwordScoreValid = parseInt(elementInput.dataset.minscore, 10) <= result.score;
  feedbackContainer.querySelector(PasswordPolicyMap.requirementLengthIcon).classList.toggle(
    "text-success",
    passwordLengthValid
  );
  elementIcon.classList.toggle(
    "text-success",
    passwordScoreValid
  );
  elementInput.classList.remove("border-success", "border-danger");
  elementInput.classList.add(passwordScoreValid && passwordLengthValid ? "border-success" : "border-danger");
  elementInput.classList.add("form-control", "border");
  const percentage = result.score * 20 + 20;
  const progressBar = feedbackContainer.querySelector(PasswordPolicyMap.progressBar);
  if (progressBar) {
    progressBar.style.width = `${percentage}%`;
    progressBar.classList.remove("bg-success", "bg-danger", "bg-warning");
    progressBar.classList.add(feedback.color);
  }
});
const usePasswordPolicy = (selector) => {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    const inputColumn = element == null ? void 0 : element.querySelector(PasswordPolicyMap.inputColumn);
    const elementInput = element == null ? void 0 : element.querySelector("input");
    const templateElement = document.createElement("div");
    const feedbackTemplate = document.querySelector(PasswordPolicyMap.template);
    let feedbackContainer;
    if (feedbackTemplate && element && inputColumn && elementInput) {
      templateElement.innerHTML = feedbackTemplate.innerHTML;
      inputColumn.append(templateElement);
      feedbackContainer = element.querySelector(PasswordPolicyMap.container);
      if (feedbackContainer) {
        const hintElement = document.querySelector(PasswordPolicyMap.hint);
        if (hintElement) {
          const hints = JSON.parse(hintElement.innerHTML);
          const passwordRequirementsLength = feedbackContainer.querySelector(PasswordPolicyMap.requirementLength);
          const passwordRequirementsScore = feedbackContainer.querySelector(PasswordPolicyMap.requirementScore);
          const passwordLengthText = passwordRequirementsLength == null ? void 0 : passwordRequirementsLength.querySelector("span");
          const passwordRequirementsText = passwordRequirementsScore == null ? void 0 : passwordRequirementsScore.querySelector("span");
          if (passwordLengthText && passwordRequirementsLength && passwordRequirementsLength.dataset.translation) {
            passwordLengthText.innerText = (0,sprintf_js__WEBPACK_IMPORTED_MODULE_0__.sprintf)(
              passwordRequirementsLength.dataset.translation,
              elementInput.dataset.minlength,
              elementInput.dataset.maxlength
            );
          }
          if (passwordRequirementsText && passwordRequirementsScore && passwordRequirementsScore.dataset.translation) {
            passwordRequirementsText.innerText = (0,sprintf_js__WEBPACK_IMPORTED_MODULE_0__.sprintf)(
              passwordRequirementsScore.dataset.translation,
              hints[elementInput.dataset.minscore]
            );
          }
          elementInput.addEventListener("keyup", () => watchPassword(elementInput, feedbackContainer, hints));
          elementInput.addEventListener("blur", () => {
            $(elementInput).popover("dispose");
          });
        }
      }
    }
    if (element) {
      return {
        element
      };
    }
    return {
      error: new Error(PASSWORD_POLICY_ERROR)
    };
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (usePasswordPolicy);


/***/ }),

/***/ "./js/theme/components/useStickyElement.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _js_theme_utils_debounce__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./js/theme/utils/debounce.js");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((element, stickyWrapper, options = {}) => {
  if (!element) {
    throw new Error("Sticky element: element not found");
  }
  if (!stickyWrapper) {
    throw new Error("Sticky element: stickyWrapper not found");
  }
  const {
    extraOffsetTop = 0,
    debounceTime = 5,
    zIndex = 100
  } = options;
  let isSticky = false;
  const getWrapperRect = () => {
    const wrapperRect = stickyWrapper.getBoundingClientRect();
    return {
      top: wrapperRect.top,
      bottom: wrapperRect.bottom,
      height: wrapperRect.height,
      width: wrapperRect.width
    };
  };
  const getExtraOffsetTop = typeof extraOffsetTop === "function" ? extraOffsetTop : () => extraOffsetTop;
  const setElementSticky = () => {
    const { height } = getWrapperRect();
    stickyWrapper.style.height = `${height}px`;
    element.style.top = `${getExtraOffsetTop()}px`;
    element.style.left = 0;
    element.style.right = 0;
    element.style.bottom = "auto";
    element.style.position = "fixed";
    element.style.zIndex = zIndex;
    element.classList.add("is-sticky");
    isSticky = true;
  };
  const unsetElementSticky = () => {
    element.style.top = null;
    element.style.bottom = null;
    element.style.position = null;
    element.style.zIndex = null;
    element.classList.remove("is-sticky");
    stickyWrapper.style.height = null;
    isSticky = false;
  };
  const getIsSticky = () => isSticky;
  const handleSticky = () => {
    const { top } = getWrapperRect();
    if (top <= getExtraOffsetTop()) {
      if (!isSticky) {
        setElementSticky();
      }
    } else if (isSticky) {
      unsetElementSticky();
    }
  };
  window.addEventListener("scroll", (0,_js_theme_utils_debounce__WEBPACK_IMPORTED_MODULE_0__["default"])(handleSticky, debounceTime));
  handleSticky();
  return {
    getExtraOffsetTop,
    getIsSticky
  };
});


/***/ }),

/***/ "./js/theme/index.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _js_theme_vendors_bootstrap_bootstrap_imports__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./js/theme/vendors/bootstrap/bootstrap-imports.js");
/* harmony import */ var bootstrap_touchspin__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.js");
/* harmony import */ var bootstrap_touchspin__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(bootstrap_touchspin__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var jquery_hoverintent__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/jquery-hoverintent/jquery.hoverIntent.js");
/* harmony import */ var jquery_hoverintent__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(jquery_hoverintent__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _js_theme_components_dynamic_bootstrap_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./js/theme/components/dynamic-bootstrap-components.js");
/* harmony import */ var bs_custom_file_input__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/bs-custom-file-input/dist/bs-custom-file-input.js");
/* harmony import */ var bs_custom_file_input__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(bs_custom_file_input__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _js_theme_components_selectors__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./js/theme/components/selectors.js");
/* harmony import */ var _js_theme_components_sliders__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./js/theme/components/sliders.js");
/* harmony import */ var _js_theme_components_responsive__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./js/theme/components/responsive.js");
/* harmony import */ var _js_theme_components_customer__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("./js/theme/components/customer.js");
/* harmony import */ var _js_theme_components_quickview__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("./js/theme/components/quickview.js");
/* harmony import */ var _js_theme_components_product__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("./js/theme/components/product.js");
/* harmony import */ var _js_theme_components_cart_cart__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("./js/theme/components/cart/cart.js");
/* harmony import */ var _js_theme_components_cart_block_cart__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("./js/theme/components/cart/block-cart.js");
/* harmony import */ var _js_theme_components_usePasswordPolicy__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("./js/theme/components/usePasswordPolicy.js");
/* harmony import */ var prestashop__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("prestashop");
/* harmony import */ var prestashop__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(prestashop__WEBPACK_IMPORTED_MODULE_15__);
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("./node_modules/events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_16__);
/* harmony import */ var _js_theme_components_form__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__("./js/theme/components/form.js");
/* harmony import */ var _js_theme_components_TopMenu__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__("./js/theme/components/TopMenu.js");
/* harmony import */ var _js_theme_components_Lazyload__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__("./js/theme/components/Lazyload.js");
/* harmony import */ var _js_theme_components_PageLoader__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__("./js/theme/components/PageLoader.js");
/* harmony import */ var _js_theme_components_useStickyElement__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__("./js/theme/components/useStickyElement.js");






















for (const i in (events__WEBPACK_IMPORTED_MODULE_16___default().prototype)) {
  (prestashop__WEBPACK_IMPORTED_MODULE_15___default())[i] = (events__WEBPACK_IMPORTED_MODULE_16___default().prototype)[i];
}
(prestashop__WEBPACK_IMPORTED_MODULE_15___default().pageLazyLoad) = new _js_theme_components_Lazyload__WEBPACK_IMPORTED_MODULE_19__["default"]({
  selector: ".lazyload"
});
(prestashop__WEBPACK_IMPORTED_MODULE_15___default().pageLoader) = new _js_theme_components_PageLoader__WEBPACK_IMPORTED_MODULE_20__["default"]();
function accLinksTriggerActive() {
  const url = window.location.pathname;
  jquery__WEBPACK_IMPORTED_MODULE_0___default()(".js-customer-links a").each((i, el) => {
    const $el = jquery__WEBPACK_IMPORTED_MODULE_0___default()(el);
    if ($el.attr("href").indexOf(url) !== -1) {
      $el.addClass("active");
    }
  });
}
function initStickyHeader() {
  const header = document.querySelector(".js-header-top");
  const headerWrapper = document.querySelector(".js-header-top-wrapper");
  if (header && headerWrapper) {
    (0,_js_theme_components_useStickyElement__WEBPACK_IMPORTED_MODULE_21__["default"])(header, headerWrapper);
  }
}
jquery__WEBPACK_IMPORTED_MODULE_0___default()(() => {
  initStickyHeader();
  accLinksTriggerActive();
  _js_theme_components_form__WEBPACK_IMPORTED_MODULE_17__["default"].init();
  bs_custom_file_input__WEBPACK_IMPORTED_MODULE_5___default().init();
  const topMenu = new _js_theme_components_TopMenu__WEBPACK_IMPORTED_MODULE_18__["default"]("#_desktop_top_menu .js-main-menu");
  (0,_js_theme_components_usePasswordPolicy__WEBPACK_IMPORTED_MODULE_14__["default"])(".field-password-policy");
  topMenu.init();
  jquery__WEBPACK_IMPORTED_MODULE_0___default()(".js-select-link").on("change", ({ target }) => {
    window.location.href = jquery__WEBPACK_IMPORTED_MODULE_0___default()(target).val();
  });
});


/***/ }),

/***/ "./js/theme/utils/DynamicImportDOMEvents.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);

class DynamicImportDOMEvents {
  constructor({
    importer,
    events,
    eventSelector,
    preventDefault
  } = {}) {
    this.eventSelector = eventSelector;
    this.events = events;
    this.eventsArray = events.split(" ");
    this.preventDefault = preventDefault;
    this.importer = importer;
    this.fetchFiles = this.fetchFiles.bind(this);
    this.bindEvents();
  }
  fetchFiles(e = false) {
    if (e && this.preventDefault) {
      e.preventDefault();
    }
    this.importer.loadFiles(() => {
      if (e && this.eventsArray.includes(e.type)) {
        jquery__WEBPACK_IMPORTED_MODULE_0___default()(e.target).trigger(e.type);
        this.unbindEvents();
      }
    });
  }
  bindEvents() {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()(document).on(this.events, this.eventSelector, this.fetchFiles);
  }
  unbindEvents() {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()(document).off(this.events, this.eventSelector, this.fetchFiles);
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DynamicImportDOMEvents);


/***/ }),

/***/ "./js/theme/utils/DynamicImportHandler.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DynamicImportHandler)
/* harmony export */ });
/* harmony import */ var _js_theme_utils_DynamicImportJqueryPlugin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./js/theme/utils/DynamicImportJqueryPlugin.js");
/* harmony import */ var _js_theme_utils_DynamicImportDOMEvents__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./js/theme/utils/DynamicImportDOMEvents.js");


class DynamicImportHandler {
  constructor({
    files,
    jqueryPluginCover = null,
    enableObserve = false,
    observeOptions = false,
    DOMEvents = false,
    DOMEventsSelector = false,
    DOMEventsPreventDefault = false,
    onLoadFiles = () => {
    }
  } = {}) {
    this.files = files;
    this.jqueryPluginCover = jqueryPluginCover;
    this.enableObserve = enableObserve;
    this.observeOptions = observeOptions;
    this.onLoadFiles = onLoadFiles;
    this.jqueryDynamicImport = false;
    this.dynamicDOMEvents = false;
    this.filesLoaded = false;
    if (jqueryPluginCover) {
      this.jqueryDynamicImport = new _js_theme_utils_DynamicImportJqueryPlugin__WEBPACK_IMPORTED_MODULE_0__["default"]({
        jqueryPluginCover,
        importer: this
      });
    }
    if (DOMEvents && DOMEventsSelector) {
      this.dynamicDOMEvents = new _js_theme_utils_DynamicImportDOMEvents__WEBPACK_IMPORTED_MODULE_1__["default"]({
        events: DOMEvents,
        eventSelector: DOMEventsSelector,
        preventDefault: DOMEventsPreventDefault,
        importer: this
      });
    }
  }
  loadFiles(callback = () => {
  }) {
    if (!this.filesLoaded) {
      Promise.all(this.files()).then((res) => {
        callback();
        this.onLoadFiles(res);
      });
      this.filesLoaded = true;
    }
  }
}


/***/ }),

/***/ "./js/theme/utils/DynamicImportJqueryPlugin.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);

class DynamicImportJqueryPlugin {
  constructor({
    jqueryPluginCover,
    importer
  } = {}) {
    this.jqueryPluginCover = jqueryPluginCover;
    this.importer = importer;
    this.jqueryFuncCalled = [];
    this.setJqueryPlugin();
  }
  callJqueryAction() {
    for (const fncCall of this.jqueryFuncCalled) {
      fncCall.elem[this.jqueryPluginCover](fncCall.args);
    }
  }
  fetchFiles() {
    this.importer.loadFiles(() => this.callJqueryAction());
  }
  setJqueryPlugin() {
    const self = this;
    (jquery__WEBPACK_IMPORTED_MODULE_0___default().fn)[this.jqueryPluginCover] = function(args) {
      self.jqueryFuncCalled.push({
        elem: this,
        args
      });
      self.fetchFiles();
      return this;
    };
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DynamicImportJqueryPlugin);


/***/ }),

/***/ "./js/theme/utils/debounce.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ debounce)
/* harmony export */ });
function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}


/***/ }),

/***/ "./js/theme/utils/parseToHtml.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const parseToHtml = (str) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, "text/html");
  return doc.body.children[0];
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (parseToHtml);


/***/ }),

/***/ "./js/theme/vendors/bootstrap/bootstrap-imports.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var bootstrap_js_dist_alert__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/bootstrap/js/dist/alert.js");
/* harmony import */ var bootstrap_js_dist_alert__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bootstrap_js_dist_alert__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var bootstrap_js_dist_button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/bootstrap/js/dist/button.js");
/* harmony import */ var bootstrap_js_dist_button__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bootstrap_js_dist_button__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var bootstrap_js_dist_tab__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/bootstrap/js/dist/tab.js");
/* harmony import */ var bootstrap_js_dist_tab__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(bootstrap_js_dist_tab__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var bootstrap_js_dist_util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/bootstrap/js/dist/util.js");
/* harmony import */ var bootstrap_js_dist_util__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(bootstrap_js_dist_util__WEBPACK_IMPORTED_MODULE_3__);






/***/ }),

/***/ "./node_modules/events/events.js":
/***/ ((module) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}


/***/ }),

/***/ "./node_modules/jquery-hoverintent/jquery.hoverIntent.js":
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * hoverIntent v1.10.2 // 2020.04.28 // jQuery v1.7.0+
 * http://briancherne.github.io/jquery-hoverIntent/
 *
 * You may use hoverIntent under the terms of the MIT license. Basically that
 * means you are free to use hoverIntent as long as this header is left intact.
 * Copyright 2007-2019 Brian Cherne
 */

/**
 * hoverIntent is similar to jQuery's built-in "hover" method except that
 * instead of firing the handlerIn function immediately, hoverIntent checks
 * to see if the user's mouse has slowed down (beneath the sensitivity
 * threshold) before firing the event. The handlerOut function is only
 * called after a matching handlerIn.
 *
 * // basic usage ... just like .hover()
 * .hoverIntent( handlerIn, handlerOut )
 * .hoverIntent( handlerInOut )
 *
 * // basic usage ... with event delegation!
 * .hoverIntent( handlerIn, handlerOut, selector )
 * .hoverIntent( handlerInOut, selector )
 *
 * // using a basic configuration object
 * .hoverIntent( config )
 *
 * @param  handlerIn   function OR configuration object
 * @param  handlerOut  function OR selector for delegation OR undefined
 * @param  selector    selector OR undefined
 * @author Brian Cherne <brian(at)cherne(dot)net>
 */

;(function(factory) {
    'use strict';
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__("jquery")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {}
})(function($) {
    'use strict';

    // default configuration values
    var _cfg = {
        interval: 100,
        sensitivity: 6,
        timeout: 0
    };

    // counter used to generate an ID for each instance
    var INSTANCE_COUNT = 0;

    // current X and Y position of mouse, updated during mousemove tracking (shared across instances)
    var cX, cY;

    // saves the current pointer position coordinates based on the given mousemove event
    var track = function(ev) {
        cX = ev.pageX;
        cY = ev.pageY;
    };

    // compares current and previous mouse positions
    var compare = function(ev,$el,s,cfg) {
        // compare mouse positions to see if pointer has slowed enough to trigger `over` function
        if ( Math.sqrt( (s.pX-cX)*(s.pX-cX) + (s.pY-cY)*(s.pY-cY) ) < cfg.sensitivity ) {
            $el.off(s.event,track);
            delete s.timeoutId;
            // set hoverIntent state as active for this element (permits `out` handler to trigger)
            s.isActive = true;
            // overwrite old mouseenter event coordinates with most recent pointer position
            ev.pageX = cX; ev.pageY = cY;
            // clear coordinate data from state object
            delete s.pX; delete s.pY;
            return cfg.over.apply($el[0],[ev]);
        } else {
            // set previous coordinates for next comparison
            s.pX = cX; s.pY = cY;
            // use self-calling timeout, guarantees intervals are spaced out properly (avoids JavaScript timer bugs)
            s.timeoutId = setTimeout( function(){compare(ev, $el, s, cfg);} , cfg.interval );
        }
    };

    // triggers given `out` function at configured `timeout` after a mouseleave and clears state
    var delay = function(ev,$el,s,out) {
        var data = $el.data('hoverIntent');
        if (data) {
            delete data[s.id];
        }
        return out.apply($el[0],[ev]);
    };

    // checks if `value` is a function
    var isFunction = function(value) {
        return typeof value === 'function';
    };

    $.fn.hoverIntent = function(handlerIn,handlerOut,selector) {
        // instance ID, used as a key to store and retrieve state information on an element
        var instanceId = INSTANCE_COUNT++;

        // extend the default configuration and parse parameters
        var cfg = $.extend({}, _cfg);
        if ( $.isPlainObject(handlerIn) ) {
            cfg = $.extend(cfg, handlerIn);
            if ( !isFunction(cfg.out) ) {
                cfg.out = cfg.over;
            }
        } else if ( isFunction(handlerOut) ) {
            cfg = $.extend(cfg, { over: handlerIn, out: handlerOut, selector: selector } );
        } else {
            cfg = $.extend(cfg, { over: handlerIn, out: handlerIn, selector: handlerOut } );
        }

        // A private function for handling mouse 'hovering'
        var handleHover = function(e) {
            // cloned event to pass to handlers (copy required for event object to be passed in IE)
            var ev = $.extend({},e);

            // the current target of the mouse event, wrapped in a jQuery object
            var $el = $(this);

            // read hoverIntent data from element (or initialize if not present)
            var hoverIntentData = $el.data('hoverIntent');
            if (!hoverIntentData) { $el.data('hoverIntent', (hoverIntentData = {})); }

            // read per-instance state from element (or initialize if not present)
            var state = hoverIntentData[instanceId];
            if (!state) { hoverIntentData[instanceId] = state = { id: instanceId }; }

            // state properties:
            // id = instance ID, used to clean up data
            // timeoutId = timeout ID, reused for tracking mouse position and delaying "out" handler
            // isActive = plugin state, true after `over` is called just until `out` is called
            // pX, pY = previously-measured pointer coordinates, updated at each polling interval
            // event = string representing the namespaced event used for mouse tracking

            // clear any existing timeout
            if (state.timeoutId) { state.timeoutId = clearTimeout(state.timeoutId); }

            // namespaced event used to register and unregister mousemove tracking
            var mousemove = state.event = 'mousemove.hoverIntent.hoverIntent'+instanceId;

            // handle the event, based on its type
            if (e.type === 'mouseenter') {
                // do nothing if already active
                if (state.isActive) { return; }
                // set "previous" X and Y position based on initial entry point
                state.pX = ev.pageX; state.pY = ev.pageY;
                // update "current" X and Y position based on mousemove
                $el.off(mousemove,track).on(mousemove,track);
                // start polling interval (self-calling timeout) to compare mouse coordinates over time
                state.timeoutId = setTimeout( function(){compare(ev,$el,state,cfg);} , cfg.interval );
            } else { // "mouseleave"
                // do nothing if not already active
                if (!state.isActive) { return; }
                // unbind expensive mousemove event
                $el.off(mousemove,track);
                // if hoverIntent state is true, then call the mouseOut function after the specified delay
                state.timeoutId = setTimeout( function(){delay(ev,$el,state,cfg.out);} , cfg.timeout );
            }
        };

        // listen for mouseenter and mouseleave
        return this.on({'mouseenter.hoverIntent':handleHover,'mouseleave.hoverIntent':handleHover}, cfg.selector);
    };
});


/***/ }),

/***/ "../../../modules/is_favoriteproducts/_theme_dev/src/css/theme/index.scss":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./css/theme.scss":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/sprintf-js/src/sprintf.js":
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_RESULT__;/* global window, exports, define */

!function() {
    'use strict'

    var re = {
        not_string: /[^s]/,
        not_bool: /[^t]/,
        not_type: /[^T]/,
        not_primitive: /[^v]/,
        number: /[diefg]/,
        numeric_arg: /[bcdiefguxX]/,
        json: /[j]/,
        not_json: /[^j]/,
        text: /^[^\x25]+/,
        modulo: /^\x25{2}/,
        placeholder: /^\x25(?:([1-9]\d*)\$|\(([^)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijostTuvxX])/,
        key: /^([a-z_][a-z_\d]*)/i,
        key_access: /^\.([a-z_][a-z_\d]*)/i,
        index_access: /^\[(\d+)\]/,
        sign: /^[+-]/
    }

    function sprintf(key) {
        // `arguments` is not an array, but should be fine for this call
        return sprintf_format(sprintf_parse(key), arguments)
    }

    function vsprintf(fmt, argv) {
        return sprintf.apply(null, [fmt].concat(argv || []))
    }

    function sprintf_format(parse_tree, argv) {
        var cursor = 1, tree_length = parse_tree.length, arg, output = '', i, k, ph, pad, pad_character, pad_length, is_positive, sign
        for (i = 0; i < tree_length; i++) {
            if (typeof parse_tree[i] === 'string') {
                output += parse_tree[i]
            }
            else if (typeof parse_tree[i] === 'object') {
                ph = parse_tree[i] // convenience purposes only
                if (ph.keys) { // keyword argument
                    arg = argv[cursor]
                    for (k = 0; k < ph.keys.length; k++) {
                        if (arg == undefined) {
                            throw new Error(sprintf('[sprintf] Cannot access property "%s" of undefined value "%s"', ph.keys[k], ph.keys[k-1]))
                        }
                        arg = arg[ph.keys[k]]
                    }
                }
                else if (ph.param_no) { // positional argument (explicit)
                    arg = argv[ph.param_no]
                }
                else { // positional argument (implicit)
                    arg = argv[cursor++]
                }

                if (re.not_type.test(ph.type) && re.not_primitive.test(ph.type) && arg instanceof Function) {
                    arg = arg()
                }

                if (re.numeric_arg.test(ph.type) && (typeof arg !== 'number' && isNaN(arg))) {
                    throw new TypeError(sprintf('[sprintf] expecting number but found %T', arg))
                }

                if (re.number.test(ph.type)) {
                    is_positive = arg >= 0
                }

                switch (ph.type) {
                    case 'b':
                        arg = parseInt(arg, 10).toString(2)
                        break
                    case 'c':
                        arg = String.fromCharCode(parseInt(arg, 10))
                        break
                    case 'd':
                    case 'i':
                        arg = parseInt(arg, 10)
                        break
                    case 'j':
                        arg = JSON.stringify(arg, null, ph.width ? parseInt(ph.width) : 0)
                        break
                    case 'e':
                        arg = ph.precision ? parseFloat(arg).toExponential(ph.precision) : parseFloat(arg).toExponential()
                        break
                    case 'f':
                        arg = ph.precision ? parseFloat(arg).toFixed(ph.precision) : parseFloat(arg)
                        break
                    case 'g':
                        arg = ph.precision ? String(Number(arg.toPrecision(ph.precision))) : parseFloat(arg)
                        break
                    case 'o':
                        arg = (parseInt(arg, 10) >>> 0).toString(8)
                        break
                    case 's':
                        arg = String(arg)
                        arg = (ph.precision ? arg.substring(0, ph.precision) : arg)
                        break
                    case 't':
                        arg = String(!!arg)
                        arg = (ph.precision ? arg.substring(0, ph.precision) : arg)
                        break
                    case 'T':
                        arg = Object.prototype.toString.call(arg).slice(8, -1).toLowerCase()
                        arg = (ph.precision ? arg.substring(0, ph.precision) : arg)
                        break
                    case 'u':
                        arg = parseInt(arg, 10) >>> 0
                        break
                    case 'v':
                        arg = arg.valueOf()
                        arg = (ph.precision ? arg.substring(0, ph.precision) : arg)
                        break
                    case 'x':
                        arg = (parseInt(arg, 10) >>> 0).toString(16)
                        break
                    case 'X':
                        arg = (parseInt(arg, 10) >>> 0).toString(16).toUpperCase()
                        break
                }
                if (re.json.test(ph.type)) {
                    output += arg
                }
                else {
                    if (re.number.test(ph.type) && (!is_positive || ph.sign)) {
                        sign = is_positive ? '+' : '-'
                        arg = arg.toString().replace(re.sign, '')
                    }
                    else {
                        sign = ''
                    }
                    pad_character = ph.pad_char ? ph.pad_char === '0' ? '0' : ph.pad_char.charAt(1) : ' '
                    pad_length = ph.width - (sign + arg).length
                    pad = ph.width ? (pad_length > 0 ? pad_character.repeat(pad_length) : '') : ''
                    output += ph.align ? sign + arg + pad : (pad_character === '0' ? sign + pad + arg : pad + sign + arg)
                }
            }
        }
        return output
    }

    var sprintf_cache = Object.create(null)

    function sprintf_parse(fmt) {
        if (sprintf_cache[fmt]) {
            return sprintf_cache[fmt]
        }

        var _fmt = fmt, match, parse_tree = [], arg_names = 0
        while (_fmt) {
            if ((match = re.text.exec(_fmt)) !== null) {
                parse_tree.push(match[0])
            }
            else if ((match = re.modulo.exec(_fmt)) !== null) {
                parse_tree.push('%')
            }
            else if ((match = re.placeholder.exec(_fmt)) !== null) {
                if (match[2]) {
                    arg_names |= 1
                    var field_list = [], replacement_field = match[2], field_match = []
                    if ((field_match = re.key.exec(replacement_field)) !== null) {
                        field_list.push(field_match[1])
                        while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                            if ((field_match = re.key_access.exec(replacement_field)) !== null) {
                                field_list.push(field_match[1])
                            }
                            else if ((field_match = re.index_access.exec(replacement_field)) !== null) {
                                field_list.push(field_match[1])
                            }
                            else {
                                throw new SyntaxError('[sprintf] failed to parse named argument key')
                            }
                        }
                    }
                    else {
                        throw new SyntaxError('[sprintf] failed to parse named argument key')
                    }
                    match[2] = field_list
                }
                else {
                    arg_names |= 2
                }
                if (arg_names === 3) {
                    throw new Error('[sprintf] mixing positional and named placeholders is not (yet) supported')
                }

                parse_tree.push(
                    {
                        placeholder: match[0],
                        param_no:    match[1],
                        keys:        match[2],
                        sign:        match[3],
                        pad_char:    match[4],
                        align:       match[5],
                        width:       match[6],
                        precision:   match[7],
                        type:        match[8]
                    }
                )
            }
            else {
                throw new SyntaxError('[sprintf] unexpected placeholder')
            }
            _fmt = _fmt.substring(match[0].length)
        }
        return sprintf_cache[fmt] = parse_tree
    }

    /**
     * export to either browser or node.js
     */
    /* eslint-disable quote-props */
    if (true) {
        exports.sprintf = sprintf
        exports.vsprintf = vsprintf
    }
    if (typeof window !== 'undefined') {
        window['sprintf'] = sprintf
        window['vsprintf'] = vsprintf

        if (true) {
            !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
                return {
                    'sprintf': sprintf,
                    'vsprintf': vsprintf
                }
            }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
        }
    }
    /* eslint-enable quote-props */
}(); // eslint-disable-line


/***/ }),

/***/ "./node_modules/vanilla-lazyload/dist/lazyload.min.js":
/***/ (function(module) {

!function(n,t){ true?module.exports=t():0}(this,(function(){"use strict";function n(){return n=Object.assign||function(n){for(var t=1;t<arguments.length;t++){var e=arguments[t];for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(n[i]=e[i])}return n},n.apply(this,arguments)}var t="undefined"!=typeof window,e=t&&!("onscroll"in window)||"undefined"!=typeof navigator&&/(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent),i=t&&"IntersectionObserver"in window,o=t&&"classList"in document.createElement("p"),a=t&&window.devicePixelRatio>1,r={elements_selector:".lazy",container:e||t?document:null,threshold:300,thresholds:null,data_src:"src",data_srcset:"srcset",data_sizes:"sizes",data_bg:"bg",data_bg_hidpi:"bg-hidpi",data_bg_multi:"bg-multi",data_bg_multi_hidpi:"bg-multi-hidpi",data_bg_set:"bg-set",data_poster:"poster",class_applied:"applied",class_loading:"loading",class_loaded:"loaded",class_error:"error",class_entered:"entered",class_exited:"exited",unobserve_completed:!0,unobserve_entered:!1,cancel_on_exit:!0,callback_enter:null,callback_exit:null,callback_applied:null,callback_loading:null,callback_loaded:null,callback_error:null,callback_finish:null,callback_cancel:null,use_native:!1,restore_on_error:!1},c=function(t){return n({},r,t)},l=function(n,t){var e,i="LazyLoad::Initialized",o=new n(t);try{e=new CustomEvent(i,{detail:{instance:o}})}catch(n){(e=document.createEvent("CustomEvent")).initCustomEvent(i,!1,!1,{instance:o})}window.dispatchEvent(e)},u="src",s="srcset",d="sizes",f="poster",_="llOriginalAttrs",g="data",v="loading",b="loaded",m="applied",p="error",h="native",E="data-",I="ll-status",y=function(n,t){return n.getAttribute(E+t)},k=function(n){return y(n,I)},w=function(n,t){return function(n,t,e){var i="data-ll-status";null!==e?n.setAttribute(i,e):n.removeAttribute(i)}(n,0,t)},A=function(n){return w(n,null)},L=function(n){return null===k(n)},O=function(n){return k(n)===h},x=[v,b,m,p],C=function(n,t,e,i){n&&(void 0===i?void 0===e?n(t):n(t,e):n(t,e,i))},N=function(n,t){o?n.classList.add(t):n.className+=(n.className?" ":"")+t},M=function(n,t){o?n.classList.remove(t):n.className=n.className.replace(new RegExp("(^|\\s+)"+t+"(\\s+|$)")," ").replace(/^\s+/,"").replace(/\s+$/,"")},z=function(n){return n.llTempImage},T=function(n,t){if(t){var e=t._observer;e&&e.unobserve(n)}},R=function(n,t){n&&(n.loadingCount+=t)},G=function(n,t){n&&(n.toLoadCount=t)},j=function(n){for(var t,e=[],i=0;t=n.children[i];i+=1)"SOURCE"===t.tagName&&e.push(t);return e},D=function(n,t){var e=n.parentNode;e&&"PICTURE"===e.tagName&&j(e).forEach(t)},H=function(n,t){j(n).forEach(t)},V=[u],F=[u,f],B=[u,s,d],J=[g],P=function(n){return!!n[_]},S=function(n){return n[_]},U=function(n){return delete n[_]},$=function(n,t){if(!P(n)){var e={};t.forEach((function(t){e[t]=n.getAttribute(t)})),n[_]=e}},q=function(n,t){if(P(n)){var e=S(n);t.forEach((function(t){!function(n,t,e){e?n.setAttribute(t,e):n.removeAttribute(t)}(n,t,e[t])}))}},K=function(n,t,e){N(n,t.class_applied),w(n,m),e&&(t.unobserve_completed&&T(n,t),C(t.callback_applied,n,e))},Q=function(n,t,e){N(n,t.class_loading),w(n,v),e&&(R(e,1),C(t.callback_loading,n,e))},W=function(n,t,e){e&&n.setAttribute(t,e)},X=function(n,t){W(n,d,y(n,t.data_sizes)),W(n,s,y(n,t.data_srcset)),W(n,u,y(n,t.data_src))},Y={IMG:function(n,t){D(n,(function(n){$(n,B),X(n,t)})),$(n,B),X(n,t)},IFRAME:function(n,t){$(n,V),W(n,u,y(n,t.data_src))},VIDEO:function(n,t){H(n,(function(n){$(n,V),W(n,u,y(n,t.data_src))})),$(n,F),W(n,f,y(n,t.data_poster)),W(n,u,y(n,t.data_src)),n.load()},OBJECT:function(n,t){$(n,J),W(n,g,y(n,t.data_src))}},Z=["IMG","IFRAME","VIDEO","OBJECT"],nn=function(n,t){!t||function(n){return n.loadingCount>0}(t)||function(n){return n.toLoadCount>0}(t)||C(n.callback_finish,t)},tn=function(n,t,e){n.addEventListener(t,e),n.llEvLisnrs[t]=e},en=function(n,t,e){n.removeEventListener(t,e)},on=function(n){return!!n.llEvLisnrs},an=function(n){if(on(n)){var t=n.llEvLisnrs;for(var e in t){var i=t[e];en(n,e,i)}delete n.llEvLisnrs}},rn=function(n,t,e){!function(n){delete n.llTempImage}(n),R(e,-1),function(n){n&&(n.toLoadCount-=1)}(e),M(n,t.class_loading),t.unobserve_completed&&T(n,e)},cn=function(n,t,e){var i=z(n)||n;on(i)||function(n,t,e){on(n)||(n.llEvLisnrs={});var i="VIDEO"===n.tagName?"loadeddata":"load";tn(n,i,t),tn(n,"error",e)}(i,(function(o){!function(n,t,e,i){var o=O(t);rn(t,e,i),N(t,e.class_loaded),w(t,b),C(e.callback_loaded,t,i),o||nn(e,i)}(0,n,t,e),an(i)}),(function(o){!function(n,t,e,i){var o=O(t);rn(t,e,i),N(t,e.class_error),w(t,p),C(e.callback_error,t,i),e.restore_on_error&&q(t,B),o||nn(e,i)}(0,n,t,e),an(i)}))},ln=function(n,t,e){!function(n){return Z.indexOf(n.tagName)>-1}(n)?function(n,t,e){!function(n){n.llTempImage=document.createElement("IMG")}(n),cn(n,t,e),function(n){P(n)||(n[_]={backgroundImage:n.style.backgroundImage})}(n),function(n,t,e){var i=y(n,t.data_bg),o=y(n,t.data_bg_hidpi),r=a&&o?o:i;r&&(n.style.backgroundImage='url("'.concat(r,'")'),z(n).setAttribute(u,r),Q(n,t,e))}(n,t,e),function(n,t,e){var i=y(n,t.data_bg_multi),o=y(n,t.data_bg_multi_hidpi),r=a&&o?o:i;r&&(n.style.backgroundImage=r,K(n,t,e))}(n,t,e),function(n,t,e){var i=y(n,t.data_bg_set);if(i){var o=i.split("|"),a=o.map((function(n){return"image-set(".concat(n,")")}));n.style.backgroundImage=a.join(),""===n.style.backgroundImage&&(a=o.map((function(n){return"-webkit-image-set(".concat(n,")")})),n.style.backgroundImage=a.join()),K(n,t,e)}}(n,t,e)}(n,t,e):function(n,t,e){cn(n,t,e),function(n,t,e){var i=Y[n.tagName];i&&(i(n,t),Q(n,t,e))}(n,t,e)}(n,t,e)},un=function(n){n.removeAttribute(u),n.removeAttribute(s),n.removeAttribute(d)},sn=function(n){D(n,(function(n){q(n,B)})),q(n,B)},dn={IMG:sn,IFRAME:function(n){q(n,V)},VIDEO:function(n){H(n,(function(n){q(n,V)})),q(n,F),n.load()},OBJECT:function(n){q(n,J)}},fn=function(n,t){(function(n){var t=dn[n.tagName];t?t(n):function(n){if(P(n)){var t=S(n);n.style.backgroundImage=t.backgroundImage}}(n)})(n),function(n,t){L(n)||O(n)||(M(n,t.class_entered),M(n,t.class_exited),M(n,t.class_applied),M(n,t.class_loading),M(n,t.class_loaded),M(n,t.class_error))}(n,t),A(n),U(n)},_n=["IMG","IFRAME","VIDEO"],gn=function(n){return n.use_native&&"loading"in HTMLImageElement.prototype},vn=function(n,t,e){n.forEach((function(n){return function(n){return n.isIntersecting||n.intersectionRatio>0}(n)?function(n,t,e,i){var o=function(n){return x.indexOf(k(n))>=0}(n);w(n,"entered"),N(n,e.class_entered),M(n,e.class_exited),function(n,t,e){t.unobserve_entered&&T(n,e)}(n,e,i),C(e.callback_enter,n,t,i),o||ln(n,e,i)}(n.target,n,t,e):function(n,t,e,i){L(n)||(N(n,e.class_exited),function(n,t,e,i){e.cancel_on_exit&&function(n){return k(n)===v}(n)&&"IMG"===n.tagName&&(an(n),function(n){D(n,(function(n){un(n)})),un(n)}(n),sn(n),M(n,e.class_loading),R(i,-1),A(n),C(e.callback_cancel,n,t,i))}(n,t,e,i),C(e.callback_exit,n,t,i))}(n.target,n,t,e)}))},bn=function(n){return Array.prototype.slice.call(n)},mn=function(n){return n.container.querySelectorAll(n.elements_selector)},pn=function(n){return function(n){return k(n)===p}(n)},hn=function(n,t){return function(n){return bn(n).filter(L)}(n||mn(t))},En=function(n,e){var o=c(n);this._settings=o,this.loadingCount=0,function(n,t){i&&!gn(n)&&(t._observer=new IntersectionObserver((function(e){vn(e,n,t)}),function(n){return{root:n.container===document?null:n.container,rootMargin:n.thresholds||n.threshold+"px"}}(n)))}(o,this),function(n,e){t&&(e._onlineHandler=function(){!function(n,t){var e;(e=mn(n),bn(e).filter(pn)).forEach((function(t){M(t,n.class_error),A(t)})),t.update()}(n,e)},window.addEventListener("online",e._onlineHandler))}(o,this),this.update(e)};return En.prototype={update:function(n){var t,o,a=this._settings,r=hn(n,a);G(this,r.length),!e&&i?gn(a)?function(n,t,e){n.forEach((function(n){-1!==_n.indexOf(n.tagName)&&function(n,t,e){n.setAttribute("loading","lazy"),cn(n,t,e),function(n,t){var e=Y[n.tagName];e&&e(n,t)}(n,t),w(n,h)}(n,t,e)})),G(e,0)}(r,a,this):(o=r,function(n){n.disconnect()}(t=this._observer),function(n,t){t.forEach((function(t){n.observe(t)}))}(t,o)):this.loadAll(r)},destroy:function(){this._observer&&this._observer.disconnect(),t&&window.removeEventListener("online",this._onlineHandler),mn(this._settings).forEach((function(n){U(n)})),delete this._observer,delete this._settings,delete this._onlineHandler,delete this.loadingCount,delete this.toLoadCount},loadAll:function(n){var t=this,e=this._settings;hn(n,e).forEach((function(n){T(n,t),ln(n,e,t)}))},restoreAll:function(){var n=this._settings;mn(n).forEach((function(t){fn(t,n)}))}},En.load=function(n,t){var e=c(t);ln(n,e)},En.resetStatus=function(n){A(n)},t&&function(n,t){if(t)if(t.length)for(var e,i=0;e=t[i];i+=1)l(n,e);else l(n,t)}(En,window.lazyLoadOptions),En}));


/***/ }),

/***/ "jquery":
/***/ ((module) => {

"use strict";
module.exports = jQuery;

/***/ }),

/***/ "prestashop":
/***/ ((module) => {

"use strict";
module.exports = prestashop;

/***/ }),

/***/ "./node_modules/ssr-window/ssr-window.esm.js":
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "extend": () => (/* binding */ extend),
/* harmony export */   "getDocument": () => (/* binding */ getDocument),
/* harmony export */   "getWindow": () => (/* binding */ getWindow),
/* harmony export */   "ssrDocument": () => (/* binding */ ssrDocument),
/* harmony export */   "ssrWindow": () => (/* binding */ ssrWindow)
/* harmony export */ });
/**
 * SSR Window 4.0.2
 * Better handling for window object in SSR environment
 * https://github.com/nolimits4web/ssr-window
 *
 * Copyright 2021, Vladimir Kharlampidi
 *
 * Licensed under MIT
 *
 * Released on: December 13, 2021
 */
/* eslint-disable no-param-reassign */
function isObject(obj) {
    return (obj !== null &&
        typeof obj === 'object' &&
        'constructor' in obj &&
        obj.constructor === Object);
}
function extend(target = {}, src = {}) {
    Object.keys(src).forEach((key) => {
        if (typeof target[key] === 'undefined')
            target[key] = src[key];
        else if (isObject(src[key]) &&
            isObject(target[key]) &&
            Object.keys(src[key]).length > 0) {
            extend(target[key], src[key]);
        }
    });
}

const ssrDocument = {
    body: {},
    addEventListener() { },
    removeEventListener() { },
    activeElement: {
        blur() { },
        nodeName: '',
    },
    querySelector() {
        return null;
    },
    querySelectorAll() {
        return [];
    },
    getElementById() {
        return null;
    },
    createEvent() {
        return {
            initEvent() { },
        };
    },
    createElement() {
        return {
            children: [],
            childNodes: [],
            style: {},
            setAttribute() { },
            getElementsByTagName() {
                return [];
            },
        };
    },
    createElementNS() {
        return {};
    },
    importNode() {
        return null;
    },
    location: {
        hash: '',
        host: '',
        hostname: '',
        href: '',
        origin: '',
        pathname: '',
        protocol: '',
        search: '',
    },
};
function getDocument() {
    const doc = typeof document !== 'undefined' ? document : {};
    extend(doc, ssrDocument);
    return doc;
}

const ssrWindow = {
    document: ssrDocument,
    navigator: {
        userAgent: '',
    },
    location: {
        hash: '',
        host: '',
        hostname: '',
        href: '',
        origin: '',
        pathname: '',
        protocol: '',
        search: '',
    },
    history: {
        replaceState() { },
        pushState() { },
        go() { },
        back() { },
    },
    CustomEvent: function CustomEvent() {
        return this;
    },
    addEventListener() { },
    removeEventListener() { },
    getComputedStyle() {
        return {
            getPropertyValue() {
                return '';
            },
        };
    },
    Image() { },
    Date() { },
    screen: {},
    setTimeout() { },
    clearTimeout() { },
    matchMedia() {
        return {};
    },
    requestAnimationFrame(callback) {
        if (typeof setTimeout === 'undefined') {
            callback();
            return null;
        }
        return setTimeout(callback, 0);
    },
    cancelAnimationFrame(id) {
        if (typeof setTimeout === 'undefined') {
            return;
        }
        clearTimeout(id);
    },
};
function getWindow() {
    const win = typeof window !== 'undefined' ? window : {};
    extend(win, ssrWindow);
    return win;
}




/***/ }),

/***/ "./node_modules/wretch/dist/addons/queryString.js":
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function stringify(value) {
    return typeof value !== "undefined" ? value : "";
}
const appendQueryParams = (url, qp, replace, config) => {
    let queryString;
    if (typeof qp === "string") {
        queryString = qp;
    }
    else {
        const usp = config.polyfill("URLSearchParams", true, true);
        for (const key in qp) {
            const value = qp[key];
            if (qp[key] instanceof Array) {
                for (const val of value)
                    usp.append(key, stringify(val));
            }
            else {
                usp.append(key, stringify(value));
            }
        }
        queryString = usp.toString();
    }
    const split = url.split("?");
    if (!queryString)
        return replace ? split[0] : url;
    if (replace || split.length < 2)
        return split[0] + "?" + queryString;
    return url + "&" + queryString;
};
/**
 * Adds the ability to append query parameters from a javascript object.
 *
 * ```js
 * import QueryAddon from "wretch/addons/queryString"
 *
 * wretch().addon(QueryAddon)
 * ```
 */
const queryString = {
    wretch: {
        query(qp, replace = false) {
            return { ...this, _url: appendQueryParams(this._url, qp, replace, this._config) };
        }
    }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (queryString);
//# sourceMappingURL=queryString.js.map

/***/ }),

/***/ "./node_modules/wretch/dist/config.js":
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "setErrorType": () => (/* binding */ setErrorType),
/* harmony export */   "setOptions": () => (/* binding */ setOptions),
/* harmony export */   "setPolyfills": () => (/* binding */ setPolyfills)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/wretch/dist/utils.js");

const config = {
    // Default options
    options: {},
    // Error type
    errorType: "text",
    // Polyfills
    polyfills: {
    // fetch: null,
    // FormData: null,
    // URLSearchParams: null,
    // performance: null,
    // PerformanceObserver: null,
    // AbortController: null
    },
    polyfill(p, doThrow = true, instance = false, ...args) {
        const res = this.polyfills[p] ||
            (typeof self !== "undefined" ? self[p] : null) ||
            (typeof global !== "undefined" ? global[p] : null);
        if (doThrow && !res)
            throw new Error(p + " is not defined");
        return instance && res ? new res(...args) : res;
    }
};
/**
 * Sets the default fetch options that will be stored internally when instantiating wretch objects.
 *
 * ```js
 * import wretch from "wretch"
 *
 * wretch.options({ headers: { "Accept": "application/json" } });
 *
 * // The fetch request is sent with both headers.
 * wretch("...", { headers: { "X-Custom": "Header" } }).get().res();
 * ```
 *
 * @param options Default options
 * @param replace If true, completely replaces the existing options instead of mixing in
 */
function setOptions(options, replace = false) {
    config.options = replace ? options : (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.mix)(config.options, options);
}
/**
 * Sets the default polyfills that will be stored internally when instantiating wretch objects.
 * Useful for browserless environments like `node.js`.
 *
 * Needed for libraries like [fetch-ponyfill](https://github.com/qubyte/fetch-ponyfill).
 *
 * ```js
 * import wretch from "wretch"
 *
 * wretch.polyfills({
 *   fetch: require("node-fetch"),
 *   FormData: require("form-data"),
 *   URLSearchParams: require("url").URLSearchParams,
 * });
 *
 * // Uses the above polyfills.
 * wretch("...").get().res();
 * ```
 *
 * @param polyfills An object containing the polyfills
 * @param replace If true, replaces the current polyfills instead of mixing in
 */
function setPolyfills(polyfills, replace = false) {
    config.polyfills = replace ? polyfills : (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.mix)(config.polyfills, polyfills);
}
/**
 * Sets the default method (text, json, …) used to parse the data contained in the response body in case of an HTTP error.
 * As with other static methods, it will affect wretch instances created after calling this function.
 *
 * _Note: if the response Content-Type header is set to "application/json", the body will be parsed as json regardless of the errorType._
 *
 * ```js
 * import wretch from "wretch"
 *
 * wretch.errorType("json")
 *
 * wretch("http://server/which/returns/an/error/with/a/json/body")
 *   .get()
 *   .res()
 *   .catch(error => {
 *     // error[errorType] (here, json) contains the parsed body
 *     console.log(error.json)
 *   })
 * ```
 *
 * If null, defaults to "text".
 */
function setErrorType(errorType) {
    config.errorType = errorType;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (config);
//# sourceMappingURL=config.js.map

/***/ }),

/***/ "./node_modules/wretch/dist/constants.js":
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CONTENT_TYPE_HEADER": () => (/* binding */ CONTENT_TYPE_HEADER),
/* harmony export */   "FETCH_ERROR": () => (/* binding */ FETCH_ERROR),
/* harmony export */   "JSON_MIME": () => (/* binding */ JSON_MIME)
/* harmony export */ });
const JSON_MIME = "application/json";
const CONTENT_TYPE_HEADER = "Content-Type";
const FETCH_ERROR = Symbol();
//# sourceMappingURL=constants.js.map

/***/ }),

/***/ "./node_modules/wretch/dist/core.js":
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "core": () => (/* binding */ core)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/wretch/dist/utils.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/wretch/dist/constants.js");
/* harmony import */ var _resolver_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/wretch/dist/resolver.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/wretch/dist/config.js");




const core = {
    _url: "",
    _options: {},
    _config: _config_js__WEBPACK_IMPORTED_MODULE_0__["default"],
    _catchers: new Map(),
    _resolvers: [],
    _deferred: [],
    _middlewares: [],
    _addons: [],
    addon(addon) {
        return { ...this, _addons: [...this._addons, addon], ...addon.wretch };
    },
    errorType(errorType) {
        return {
            ...this,
            _config: {
                ...this._config,
                errorType
            }
        };
    },
    polyfills(polyfills, replace = false) {
        return {
            ...this,
            _config: {
                ...this._config,
                polyfills: replace ? polyfills : (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.mix)(this._config.polyfills, polyfills)
            }
        };
    },
    url(_url, replace = false) {
        if (replace)
            return { ...this, _url };
        const split = this._url.split("?");
        return {
            ...this,
            _url: split.length > 1 ?
                split[0] + _url + "?" + split[1] :
                this._url + _url
        };
    },
    options(options, replace = false) {
        return { ...this, _options: replace ? options : (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.mix)(this._options, options) };
    },
    headers(headerValues) {
        return { ...this, _options: (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.mix)(this._options, { headers: headerValues || {} }) };
    },
    accept(headerValue) {
        return this.headers({ Accept: headerValue });
    },
    content(headerValue) {
        return this.headers({ [_constants_js__WEBPACK_IMPORTED_MODULE_2__.CONTENT_TYPE_HEADER]: headerValue });
    },
    auth(headerValue) {
        return this.headers({ Authorization: headerValue });
    },
    catcher(errorId, catcher) {
        const newMap = new Map(this._catchers);
        newMap.set(errorId, catcher);
        return { ...this, _catchers: newMap };
    },
    resolve(resolver, clear = false) {
        return { ...this, _resolvers: clear ? [resolver] : [...this._resolvers, resolver] };
    },
    defer(callback, clear = false) {
        return {
            ...this,
            _deferred: clear ? [callback] : [...this._deferred, callback]
        };
    },
    middlewares(middlewares, clear = false) {
        return {
            ...this,
            _middlewares: clear ? middlewares : [...this._middlewares, ...middlewares]
        };
    },
    fetch(method = this._options.method, url = "", body = null) {
        let base = this.url(url).options({ method });
        // "Jsonify" the body if it is an object and if it is likely that the content type targets json.
        const contentType = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.extractContentType)(base._options.headers);
        const jsonify = typeof body === "object" && (!base._options.headers || !contentType || (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isLikelyJsonMime)(contentType));
        base =
            !body ? base :
                jsonify ? base.json(body, contentType) :
                    base.body(body);
        return (0,_resolver_js__WEBPACK_IMPORTED_MODULE_3__.resolver)(base
            ._deferred
            .reduce((acc, curr) => curr(acc, acc._url, acc._options), base));
    },
    get(url = "") {
        return this.fetch("GET", url);
    },
    delete(url = "") {
        return this.fetch("DELETE", url);
    },
    put(body, url = "") {
        return this.fetch("PUT", url, body);
    },
    post(body, url = "") {
        return this.fetch("POST", url, body);
    },
    patch(body, url = "") {
        return this.fetch("PATCH", url, body);
    },
    head(url = "") {
        return this.fetch("HEAD", url);
    },
    opts(url = "") {
        return this.fetch("OPTIONS", url);
    },
    body(contents) {
        return { ...this, _options: { ...this._options, body: contents } };
    },
    json(jsObject, contentType) {
        const currentContentType = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.extractContentType)(this._options.headers);
        return this.content(contentType ||
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isLikelyJsonMime)(currentContentType) && currentContentType ||
            _constants_js__WEBPACK_IMPORTED_MODULE_2__.JSON_MIME).body(JSON.stringify(jsObject));
    }
};
//# sourceMappingURL=core.js.map

/***/ }),

/***/ "./node_modules/wretch/dist/index.js":
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/wretch/dist/config.js");
/* harmony import */ var _core_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/wretch/dist/core.js");
/* harmony import */ var _resolver_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/wretch/dist/resolver.js");



/**
 * Creates a new wretch instance with a base url and base
 * [fetch options](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch).
 *
 * ```ts
 * import wretch from "wretch"
 *
 * // Reusable instance
 * const w = wretch("https://domain.com", { mode: "cors" })
 * ```
 *
 * @param _url The base url
 * @param _options The base fetch options
 * @returns A fresh wretch instance
 */
function factory(_url = "", _options = {}) {
    return { ..._core_js__WEBPACK_IMPORTED_MODULE_0__.core, _url, _options };
}
factory["default"] = factory;
/** {@inheritDoc setOptions} */
factory.options = _config_js__WEBPACK_IMPORTED_MODULE_1__.setOptions;
/** {@inheritDoc setErrorType} */
factory.errorType = _config_js__WEBPACK_IMPORTED_MODULE_1__.setErrorType;
/** {@inheritDoc setPolyfills} */
factory.polyfills = _config_js__WEBPACK_IMPORTED_MODULE_1__.setPolyfills;
factory.WretchError = _resolver_js__WEBPACK_IMPORTED_MODULE_2__.WretchError;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (factory);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/wretch/dist/middleware.js":
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "middlewareHelper": () => (/* binding */ middlewareHelper)
/* harmony export */ });
/**
 * @private @internal
 */
const middlewareHelper = (middlewares) => (fetchFunction) => {
    return middlewares.reduceRight((acc, curr) => curr(acc), fetchFunction) || fetchFunction;
};
//# sourceMappingURL=middleware.js.map

/***/ }),

/***/ "./node_modules/wretch/dist/resolver.js":
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WretchError": () => (/* binding */ WretchError),
/* harmony export */   "resolver": () => (/* binding */ resolver)
/* harmony export */ });
/* harmony import */ var _middleware_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/wretch/dist/middleware.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/wretch/dist/utils.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/wretch/dist/constants.js");



/**
 * This class inheriting from Error is thrown when the fetch response is not "ok".
 * It extends Error and adds status, text and body fields.
 */
class WretchError extends Error {
}
const resolver = (wretch) => {
    const sharedState = Object.create(null);
    wretch = wretch._addons.reduce((w, addon) => addon.beforeRequest &&
        addon.beforeRequest(w, wretch._options, sharedState)
        || w, wretch);
    const { _url: url, _options: opts, _config: config, _catchers: _catchers, _resolvers: resolvers, _middlewares: middlewares, _addons: addons } = wretch;
    const catchers = new Map(_catchers);
    const finalOptions = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.mix)(config.options, opts);
    // The generated fetch request
    let finalUrl = url;
    const _fetchReq = (0,_middleware_js__WEBPACK_IMPORTED_MODULE_1__.middlewareHelper)(middlewares)((url, options) => {
        finalUrl = url;
        return config.polyfill("fetch")(url, options);
    })(url, finalOptions);
    // Throws on an http error
    const referenceError = new Error();
    const throwingPromise = _fetchReq
        .catch(error => {
        throw { __wrap: error };
    })
        .then(response => {
        if (!response.ok) {
            const err = new WretchError();
            // Enhance the error object
            err["cause"] = referenceError;
            err.stack = err.stack + "\nCAUSE: " + referenceError.stack;
            err.response = response;
            err.url = finalUrl;
            if (response.type === "opaque") {
                throw err;
            }
            return response.text().then((body) => {
                var _a;
                err.message = body;
                if (config.errorType === "json" || ((_a = response.headers.get("Content-Type")) === null || _a === void 0 ? void 0 : _a.split(";")[0]) === "application/json") {
                    try {
                        err.json = JSON.parse(body);
                    }
                    catch (e) { /* ignore */ }
                }
                err.text = body;
                err["status"] = response.status;
                throw err;
            });
        }
        return response;
    });
    // Wraps the Promise in order to dispatch the error to a matching catcher
    const catchersWrapper = (promise) => {
        return promise.catch(err => {
            const error = err.__wrap || err;
            const catcher = (error.status && catchers.get(error.status)) ||
                catchers.get(error.name) || (err.__wrap && catchers.has(_constants_js__WEBPACK_IMPORTED_MODULE_2__.FETCH_ERROR) && catchers.get(_constants_js__WEBPACK_IMPORTED_MODULE_2__.FETCH_ERROR));
            if (catcher)
                return catcher(error, wretch);
            throw error;
        });
    };
    const bodyParser = funName => cb => funName ?
        // If a callback is provided, then callback with the body result otherwise return the parsed body itself.
        catchersWrapper(throwingPromise.then(_ => _ && _[funName]()).then(_ => cb ? cb(_) : _)) :
        // No body parsing method - return the response
        catchersWrapper(throwingPromise.then(_ => cb ? cb(_) : _));
    const responseChain = {
        _wretchReq: wretch,
        _fetchReq,
        _sharedState: sharedState,
        res: bodyParser(null),
        json: bodyParser("json"),
        blob: bodyParser("blob"),
        formData: bodyParser("formData"),
        arrayBuffer: bodyParser("arrayBuffer"),
        text: bodyParser("text"),
        error(errorId, cb) {
            catchers.set(errorId, cb);
            return this;
        },
        badRequest(cb) { return this.error(400, cb); },
        unauthorized(cb) { return this.error(401, cb); },
        forbidden(cb) { return this.error(403, cb); },
        notFound(cb) { return this.error(404, cb); },
        timeout(cb) { return this.error(408, cb); },
        internalError(cb) { return this.error(500, cb); },
        fetchError(cb) { return this.error(_constants_js__WEBPACK_IMPORTED_MODULE_2__.FETCH_ERROR, cb); },
    };
    const enhancedResponseChain = addons.reduce((chain, addon) => ({
        ...chain,
        ...addon.resolver
    }), responseChain);
    return resolvers.reduce((chain, r) => r(chain, wretch), enhancedResponseChain);
};
//# sourceMappingURL=resolver.js.map

/***/ }),

/***/ "./node_modules/wretch/dist/utils.js":
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "extractContentType": () => (/* binding */ extractContentType),
/* harmony export */   "isLikelyJsonMime": () => (/* binding */ isLikelyJsonMime),
/* harmony export */   "mix": () => (/* binding */ mix)
/* harmony export */ });
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/wretch/dist/constants.js");

function extractContentType(headers = {}) {
    var _a;
    return (_a = Object.entries(headers).find(([k]) => k.toLowerCase() === _constants_js__WEBPACK_IMPORTED_MODULE_0__.CONTENT_TYPE_HEADER.toLowerCase())) === null || _a === void 0 ? void 0 : _a[1];
}
function isLikelyJsonMime(value) {
    return /^application\/.*json.*/.test(value);
}
const mix = function (one, two, mergeArrays = false) {
    return Object.entries(two).reduce((acc, [key, newValue]) => {
        const value = one[key];
        if (Array.isArray(value) && Array.isArray(newValue)) {
            acc[key] = mergeArrays ? [...value, ...newValue] : newValue;
        }
        else if (typeof value === "object" && typeof newValue === "object") {
            acc[key] = mix(value, newValue, mergeArrays);
        }
        else {
            acc[key] = newValue;
        }
        return acc;
    }, { ...one });
};
//# sourceMappingURL=utils.js.map

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "js/" + chunkId + ".js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get mini-css chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.miniCssF = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "css/" + chunkId + ".css";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "Falcon-theme:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "/themes/falcon/assets/";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/css loading */
/******/ 	(() => {
/******/ 		if (typeof document === "undefined") return;
/******/ 		var createStylesheet = (chunkId, fullhref, oldTag, resolve, reject) => {
/******/ 			var linkTag = document.createElement("link");
/******/ 		
/******/ 			linkTag.rel = "stylesheet";
/******/ 			linkTag.type = "text/css";
/******/ 			var onLinkComplete = (event) => {
/******/ 				// avoid mem leaks.
/******/ 				linkTag.onerror = linkTag.onload = null;
/******/ 				if (event.type === 'load') {
/******/ 					resolve();
/******/ 				} else {
/******/ 					var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 					var realHref = event && event.target && event.target.href || fullhref;
/******/ 					var err = new Error("Loading CSS chunk " + chunkId + " failed.\n(" + realHref + ")");
/******/ 					err.code = "CSS_CHUNK_LOAD_FAILED";
/******/ 					err.type = errorType;
/******/ 					err.request = realHref;
/******/ 					if (linkTag.parentNode) linkTag.parentNode.removeChild(linkTag)
/******/ 					reject(err);
/******/ 				}
/******/ 			}
/******/ 			linkTag.onerror = linkTag.onload = onLinkComplete;
/******/ 			linkTag.href = fullhref;
/******/ 		
/******/ 			if (oldTag) {
/******/ 				oldTag.parentNode.insertBefore(linkTag, oldTag.nextSibling);
/******/ 			} else {
/******/ 				document.head.appendChild(linkTag);
/******/ 			}
/******/ 			return linkTag;
/******/ 		};
/******/ 		var findStylesheet = (href, fullhref) => {
/******/ 			var existingLinkTags = document.getElementsByTagName("link");
/******/ 			for(var i = 0; i < existingLinkTags.length; i++) {
/******/ 				var tag = existingLinkTags[i];
/******/ 				var dataHref = tag.getAttribute("data-href") || tag.getAttribute("href");
/******/ 				if(tag.rel === "stylesheet" && (dataHref === href || dataHref === fullhref)) return tag;
/******/ 			}
/******/ 			var existingStyleTags = document.getElementsByTagName("style");
/******/ 			for(var i = 0; i < existingStyleTags.length; i++) {
/******/ 				var tag = existingStyleTags[i];
/******/ 				var dataHref = tag.getAttribute("data-href");
/******/ 				if(dataHref === href || dataHref === fullhref) return tag;
/******/ 			}
/******/ 		};
/******/ 		var loadStylesheet = (chunkId) => {
/******/ 			return new Promise((resolve, reject) => {
/******/ 				var href = __webpack_require__.miniCssF(chunkId);
/******/ 				var fullhref = __webpack_require__.p + href;
/******/ 				if(findStylesheet(href, fullhref)) return resolve();
/******/ 				createStylesheet(chunkId, fullhref, null, resolve, reject);
/******/ 			});
/******/ 		}
/******/ 		// object to store loaded CSS chunks
/******/ 		var installedCssChunks = {
/******/ 			"theme": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.miniCss = (chunkId, promises) => {
/******/ 			var cssChunks = {"css_dynamic_modal__index_scss":1,"css_dynamic_dropdown__index_scss":1,"css_dynamic_popover__index_scss":1,"css_dynamic_toast__index_scss":1,"css_dynamic_tooltip__index_scss":1,"node_modules_swiper_modules_virtual_virtual_scss":1,"node_modules_swiper_modules_scrollbar_scrollbar_scss":1,"node_modules_swiper_modules_zoom_zoom_scss":1,"node_modules_swiper_modules_free-mode_free-mode_scss":1,"vendors-node_modules_swiper_modules_controller_controller_scss":1};
/******/ 			if(installedCssChunks[chunkId]) promises.push(installedCssChunks[chunkId]);
/******/ 			else if(installedCssChunks[chunkId] !== 0 && cssChunks[chunkId]) {
/******/ 				promises.push(installedCssChunks[chunkId] = loadStylesheet(chunkId).then(() => {
/******/ 					installedCssChunks[chunkId] = 0;
/******/ 				}, (e) => {
/******/ 					delete installedCssChunks[chunkId];
/******/ 					throw e;
/******/ 				}));
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		// no hmr
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"theme": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if("vendors-node_modules_swiper_modules_controller_controller_scss" != chunkId) {
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						} else installedChunks[chunkId] = 0;
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkFalcon_theme"] = self["webpackChunkFalcon_theme"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	__webpack_require__.O(undefined, ["swipervendor"], () => (__webpack_require__("./js/theme.js")))
/******/ 	__webpack_require__.O(undefined, ["swipervendor"], () => (__webpack_require__("./css/theme.scss")))
/******/ 	__webpack_require__.O(undefined, ["swipervendor"], () => (__webpack_require__("../../../modules/is_favoriteproducts/_theme_dev/src/js/theme/index.js")))
/******/ 	__webpack_require__.O(undefined, ["swipervendor"], () => (__webpack_require__("../../../modules/is_searchbar/_theme_dev/src/js/theme/index.js")))
/******/ 	__webpack_require__.O(undefined, ["swipervendor"], () => (__webpack_require__("../../../modules/is_shoppingcart/_theme_dev/src/js/theme/index.js")))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["swipervendor"], () => (__webpack_require__("../../../modules/is_favoriteproducts/_theme_dev/src/css/theme/index.scss")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=theme.js.map