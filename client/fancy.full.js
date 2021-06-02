/**
 * @class Fancy utilities and functions.
 * @singleton
 */
var Fancy = {
  global: this,
  /**
   * The version of the framework
   * @type String
   */
  version: '1.6.15',
  site: 'fancygrid.com',
  COLORS: ["#9DB160", "#B26668", "#4091BA", "#8E658E", "#3B8D8B", "#ff0066", "#eeaaee", "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"]
};

/**
 * Copies all the properties of `from` to the specified `to`.
 * 
 * @param {Object} to The receiver of the properties.
 * @param {Object} from The primary source of the properties.
 */
Fancy.apply = function(to, from){
  if(from === undefined){
    return;
  }

  for(var p in from){
    to[p] = from[p];
  }
};

/**
 * Copies all the properties of `from` to the specified `to`.
 * 
 * @param {Object} to The receiver of the properties.
 * @param {Object} from The primary source of the properties.
 */
Fancy.applyIf = function(to, from){
  for(var p in from){
    if( to[p] === undefined ){
      to[p] = from[p];
    }
  }
};

/**
 * Creates namespaces to be used for scoping variables and classes so that they are not global.
 * Specifying the last node of a namespace implicitly creates all other nodes.
 * @param {String} namespace1
 * @param {String} namespace2
 * @param {String} etc
 */
Fancy.namespace = function(){
  var i = 0,
    iL = arguments.length;
  
  for(;i<iL;i++){
    var value = arguments[i],
      parts = value.split("."),
      j = 1,
      jL = parts.length;
    
    Fancy.global[parts[0]] = Fancy.global[parts[0]] || {};
    var namespace = Fancy.global[parts[0]];
    
    for(;j<jL;j++){
      namespace[parts[j]] = namespace[parts[j]] || {};
      namespace = namespace[parts[j]];
    }
  }
};

/**
 * Creates namespaces to be used for scoping variables and classes so that they are not global.
 * Specifying the last node of a namespace implicitly creates all other nodes. 
 * @param {String} namespace1
 * @param {String} namespace2
 * @param {String} etc
 */
Fancy.ns = Fancy.namespace;

/**
 * Returns the type of the given variable in string format. List of possible values are:
 *
 * - `undefined`: If the given value is `undefined`
 * - `string`: If the given value is a string
 * - `number`: If the given value is a number
 * - `boolean`: If the given value is a boolean value
 * - `date`: If the given value is a `Date` object
 * - `function`: If the given value is a function reference
 * - `object`: If the given value is an object
 * - `array`: If the given value is an array
 * - `regexp`: If the given value is a regular expression
 *
 * @param {*} value
 * @return {String}
 */
Fancy.typeOf = function(value){
  if(value === null) {
    return 'null';
  }

  var type = typeof value;
  if(type === 'undefined' || type === 'string' || type === 'number' || type === 'boolean') {
    return type;
  }

  var toString = Object.prototype.toString,
    typeToString = toString.call(value);

  if(value.length !== undefined && typeof value !== 'function'){
    return 'array';
  }

  switch(typeToString){
    case '[object Array]':
      return 'array';
    case '[object Date]':
      return 'date';
    case '[object Boolean]':
      return 'boolean';
    case '[object Number]':
      return 'number';
    case '[object RegExp]':
      return 'regexp';
  }

  if(type === 'function'){
    return 'function';
  }

  if(type === 'object'){
    return 'object';
  }
};

/**
 * Returns true if the passed value is a JavaScript array, otherwise false.
 * @param {*} value The value to test
 * @return {Boolean}
 */
Fancy.isArray = ('isArray' in Array) ? Array.isArray : function(value){
  var toString = Object.prototype.toString;
  
  return toString.call(value) === '[object Array]';
};

/**
 * Returns true if the passed value is a JavaScript Object, otherwise false.
 * @param {*} value The value to test
 * @return {Boolean}
 */
Fancy.isObject = function(value){
  var toString = Object.prototype.toString;
  
  return toString.call(value) === '[object Object]';
};

/**
 * Returns true if the passed value is a JavaScript Function, otherwise false.
 * @param {*} value The value to test
 * @return {Boolean}
 */
Fancy.isFunction = function(value){
  var toString = Object.prototype.toString;
  
  return toString.apply(value) === '[object Function]';
};

/**
 * Returns true if the passed value is a string.
 * @param {*} value The value to test
 * @return {Boolean}
 */
Fancy.isString = function(value){
  return typeof value === 'string';
};

/**
 * Returns true if the passed value is a number. Returns false for non-finite numbers.
 * @param {*} value The value to test
 * @return {Boolean}
 */
Fancy.isNumber = function(value){
  return typeof value === 'number' && isFinite(value);
};

/**
 * Returns true if the passed value is a boolean.
 * @param {*} value The value to test
 * @return {Boolean}
 */
Fancy.isBoolean = function(value){
  return typeof value === 'boolean';
};

/**
 * Returns true if the passed value is a boolean.
 * @param {*} value The value to test
 * @return {Boolean}
 */
Fancy.isDate = function(value){
  return Fancy.typeOf(value) === 'date';
};

/**
 * Iterates an array calling the supplied function.
 * @param {Array} arrayObject The array to be iterated. If this
 * argument is not really an array, the supplied function is called once.
 * @param {Function} fn The function to be called with each item.
 * @return See description for the fn parameter.
 */
Fancy.each = function(arrayObject, fn){
  var type = Fancy.typeOf(arrayObject);

  switch(type){
    case 'array':
    case 'string':
      var i = 0,
        iL = arrayObject.length;

      for(;i<iL;i++){
        if(fn(arrayObject[i], i, arrayObject) === true){
          break;
        }
      }
      break;
    case 'object':
      for(var p in arrayObject){
        if(fn(arrayObject[p], p, arrayObject) === true){
          break;
        }
      }
      break;
  }
};

/**
 * Helps in OOP for light mixins.
 *
 * @private
 * Iterates an array calling the supplied function.
 * @param {Array} proto The array to be iterated. If this
 * argument is not really an array, the supplied function is called once.
 * @param {Function} classes The function to be called with each item.
 * @return See description for the fn parameter.
 */
Fancy.mixin = function(proto, classes){
   var i = 0,
    iL = classes.length;

  if( Fancy.typeOf( classes[0] ) === 'object' ){
    for(;i<iL;i++){
      var item = classes[i],
        _class = item._class,
        methods = item.methods,
        j = 0,
        jL = methods.length;

      for(;j<jL;j++){
        var methodName = methods[j];
        proto[methodName] = _class['prototype'][methodName];
      }
    }
  }
  else{
    for(;i<iL;i++){
      var item = classes[i];

      if(Fancy.isString(item)){
        var _item = Fancy.ClassManager.getMixin(item);

        if(_item){
          Fancy.apply(proto, _item['prototype']);
        }
        else{
          Fancy.ClassManager.waitMixin(item, proto);
        }
      }
      else {
        Fancy.apply(proto, item['prototype']);
      }
    }
  }
};

Fancy.Mixin = function(name, config){
  var parts = name.split("."),
    i = 1,
    iL = parts.length - 1;

  Fancy.ns(name);

  var ref = Fancy.global[parts[0]];

  for(;i<iL;i++){
    ref = ref[parts[i]];
  }

  if(parts.length > 1){
    ref[parts[parts.length - 1]] = function(){};
    ref[parts[parts.length - 1]].prototype = config;
  }
  else{
    Fancy.global[parts[0]] = function(){};
    Fancy.global[parts[0]].prototype = config;
  }

  var waiters = Fancy.ClassManager.waitMixins[name];

  if(waiters){
    waiters = waiters.waiters;

    var i = 0,
        iL = waiters.length;

    for(;i<iL;i++){
      Fancy.apply(waiters[i], config);
    }
  }
};

/**
 * Help function for OOP
 * Help to avoid multiple applying in deep class inheritance
 * Copies all the properties of `config` to the specified `object`.
 * @param {Object} object The receiver of the properties.
 * @param {Object} config The primary source of the properties.
 * @return {Object}
 */
Fancy.applyConfig = function(object, config){
  var property,
    config = config || {};

  if(object.plugins && config.plugins){
    object.plugins = object.plugins.concat(config.plugins);
    delete config.plugins;
  }

  if(object._isConfigApplied === true){
    return object;
  }
  
  for(property in config){
    object[property] = config[property];
  }
  object._isConfigApplied = true;
  
  return object;
};

/**
 * @param {Object} o
 * @return {Object}
 */
Fancy.styleToString = function(o){
  var str = '';

  o = o || {};

  for(var p in o){
    str += p + ': ' + o[p] + ';';
  }

  return str;
};

Fancy.apply(Fancy, {
  prefix: 'fancy-gen-',
  idSeed: 0,
  zIndex: 1,
  id: function(el, prefix){
    if(!el){
      return (prefix || Fancy.prefix) + (++Fancy.idSeed);
    }
    el = el.dom || {};
    if(!el.id){
      el.id = (prefix || Fancy.prefix) + (++Fancy.idSeed);
    }
    return el.id;
  }
});

/**
 * Apply base classnames for fast fetching
 */
Fancy.apply(Fancy, {
  cls: 'fancy',
  TOUCH_CLS: 'fancy-touch',
  HIDDEN_CLS: 'fancy-display-none',
  CLEARFIX_CLS: 'fancy-clearfix',
  MODAL_CLS: 'fancy-modal',
  /*
   * Panel cls-s
   */
  PANEL_CLS: 'fancy-panel',
  PANEL_BODY_CLS: 'fancy-panel-body',
  PANEL_BODY_INNER_CLS: 'fancy-panel-body-inner',
  PANEL_GRID_INSIDE_CLS: 'fancy-panel-grid-inside',
  PANEL_SHADOW_CLS: 'fancy-panel-shadow',
  PANEL_SUB_HEADER_CLS: 'fancy-panel-sub-header',
  PANEL_SUB_HEADER_TEXT_CLS: 'fancy-panel-sub-header-text',
  PANEL_HEADER_CLS: 'fancy-panel-header',
  PANEL_HEADER_IMG_CLS: 'fancy-panel-header-img',
  PANEL_HEADER_TEXT_CLS: 'fancy-panel-header-text',
  PANEL_HEADER_TOOLS_CLS: 'fancy-panel-header-tools',
  PANEL_TBAR_CLS: 'fancy-panel-tbar',
  PANEL_BBAR_CLS: 'fancy-panel-bbar',
  PANEL_SUB_TBAR_CLS: 'fancy-panel-sub-tbar',
  PANEL_BUTTONS_CLS: 'fancy-panel-buttons',
  PANEL_NOFRAME_CLS: 'fancy-panel-noframe',
  PANEL_FOOTER_CLS: 'fancy-panel-footer',
  PANEL_TAB_CLS: 'fancy-panel-tab',
  PANEL_DRAGGABLE_CLS: 'fancy-panel-draggable',
  /*
   * Bar cls-s
   */
  BAR_CLS: 'fancy-bar',
  BAR_TEXT_CLS: 'fancy-bar-text',
  BAR_CONTAINER_CLS: 'fancy-bar-container',
  BAR_BUTTON_CLS: 'fancy-bar-button',
  BAR_SEG_BUTTON_CLS: 'fancy-bar-seg-button',
  BAR_LEFT_SCROLLER_CLS: 'fancy-bar-left-scroller',
  BAR_RIGHT_SCROLLER_CLS: 'fancy-bar-right-scroller',
  /*
   * Form cls-s
   */
  FORM_CLS: 'fancy-form',
  FORM_BODY_CLS: 'fancy-form-body',
  /*
   * Field cls-s
   */
  FIELD_CLS: 'fancy-field',
  FIELD_LABEL_CLS: 'fancy-field-label',
  FIELD_EMPTY_CLS: 'fancy-field-empty',
  FIELD_BLANK_ERR_CLS: 'fancy-field-blank-err',
  FIELD_NOT_VALID_CLS: 'fancy-field-not-valid',
  FIELD_TEXT_CLS: 'fancy-field-text',
  FIELD_TEXT_INPUT_CLS: 'fancy-field-text-input',
  FIELD_ERROR_CLS: 'fancy-field-error',
  FIELD_SPIN_CLS: 'fancy-field-spin',
  FIELD_SPIN_UP_CLS: 'fancy-field-spin-up',
  FIELD_SPIN_DOWN_CLS: 'fancy-field-spin-down',
  FIELD_CHECKBOX_CLS: 'fancy-field-checkbox',
  FIELD_CHECKBOX_INPUT_CLS: 'fancy-field-checkbox-input',
  FIELD_CHECKBOX_ON_CLS: 'fancy-checkbox-on',
  FIELD_INPUT_LABEL_CLS:'fancy-field-input-label',
  FIELD_BUTTON_CLS: 'fancy-field-button',
  FIELD_TAB_CLS: 'fancy-field-tab',
  FIELD_COMBO_CLS: 'fancy-combo',
  FIELD_SEARCH_CLS: 'fancy-field-search',
  FIELD_SEARCH_LIST_CLS: 'fancy-field-search-list',
  FIELD_SEARCH_PARAMS_LINK_CLS: 'fancy-field-search-params-link',
  FIELD_SEARCH_PARAMED_CLS: 'fancy-field-search-paramed',
  FIELD_SEARCH_PARAMED_EMPTY_CLS: 'fancy-field-search-paramed-empty',
  FIELD_PICKER_BUTTON_CLS: 'fancy-field-picker-button',
  FIELD_LABEL_ALIGN_TOP_CLS: 'fancy-field-label-align-top',
  FIELD_LABEL_ALIGN_RIGHT_CLS: 'fancy-field-label-align-right',
  FIELD_TEXTAREA_CLS: 'fancy-textarea',
  FIELD_TEXTAREA_TEXT_CLS: 'fancy-textarea-text',
  FIELD_TEXTAREA_TEXT_INPUT_CLS: 'fancy-textarea-text-input',
  FIELD_RADIO_CLS: 'fancy-field-radio',
  FIELD_RADIO_COLUMN_CLS: 'fancy-field-radio-column',
  FIELD_RADIO_ON_CLS: 'fancy-field-radio-on',
  FIELD_RADIO_INPUT_CLS: 'fancy-field-radio-input',
  FIELD_TAB_ACTIVE_CLS: 'fancy-field-tab-active',
  /*
   * Grid cls-s
   */
  GRID_CLS: 'fancy-grid',
  GRID_UNSELECTABLE_CLS: 'fancy-grid-unselectable',
  GRID_EMPTY_CLS: 'fancy-grid-empty-text',
  GRID_LEFT_EMPTY_CLS: 'fancy-grid-left-empty',
  GRID_RIGHT_EMPTY_CLS: 'fancy-grid-right-empty',
  GRID_CENTER_CLS: 'fancy-grid-center',
  GRID_LEFT_CLS: 'fancy-grid-left',
  GRID_RIGHT_CLS: 'fancy-grid-right',
  GRID_RESIZER_LEFT_CLS: 'fancy-grid-resizer-left',
  GRID_RESIZER_RIGHT_CLS: 'fancy-grid-resizer-right',
  //grid header
  GRID_HEADER_CLS: 'fancy-grid-header',
  GRID_HEADER_CELL_CLS: 'fancy-grid-header-cell',
  GRID_HEADER_CELL_CONTAINER_CLS: 'fancy-grid-header-cell-container',
  GRID_HEADER_CELL_TEXT_CLS: 'fancy-grid-header-cell-text',
  GRID_HEADER_CELL_DOUBLE_CLS: 'fancy-grid-header-cell-double',
  GRID_HEADER_CELL_TRIPLE_CLS: 'fancy-grid-header-cell-triple',
  GRID_HEADER_CELL_TRIGGER_CLS: 'fancy-grid-header-cell-trigger',
  GRID_HEADER_CELL_TRIGGER_IMAGE_CLS: 'fancy-grid-header-cell-trigger-image',
  GRID_HEADER_CELL_TRIGGER_DISABLED_CLS: 'fancy-grid-header-cell-trigger-disabled',
  GRID_HEADER_CELL_GROUP_LEVEL_1_CLS: 'fancy-grid-header-cell-group-level-1',
  GRID_HEADER_CELL_GROUP_LEVEL_2_CLS: 'fancy-grid-header-cell-group-level-2',
  GRID_HEADER_CELL_SELECT_CLS: 'fancy-grid-header-cell-select',
  GRID_HEADER_CELL_TRIGGER_UP_CLS: 'fancy-grid-header-cell-trigger-up',
  GRID_HEADER_CELL_TRIGGER_DOWN_CLS: 'fancy-grid-header-cell-trigger-down',
  GRID_HEADER_COLUMN_TRIGGERED_CLS: 'fancy-gridf-header-column-triggered',
  GRID_HEADER_CELL_FILTER_CLS: 'fancy-grid-header-filter-cell',
  GRID_HEADER_CELL_FILTER_FULL_CLS: 'fancy-grid-header-filter-cell-full',
  GRID_HEADER_CELL_FILTER_SMALL_CLS: 'fancy-grid-header-filter-cell-small',
  //grid cell
  GRID_CELL_CLS: 'fancy-grid-cell',
  GRID_CELL_INNER_CLS: 'fancy-grid-cell-inner',
  GRID_CELL_OVER_CLS: 'fancy-grid-cell-over',
  GRID_CELL_SELECTED_CLS: 'fancy-grid-cell-selected',
  GRID_CELL_EVEN_CLS: 'fancy-grid-cell-even',
  GRID_CELL_WRAPPER_CLS: 'fancy-grid-cell-wrapper',
  GRID_CELL_DIRTY_CLS: 'fancy-grid-cell-dirty',
  GRID_CELL_DIRTY_EL_CLS: 'fancy-grid-cell-dirty-el',
  GRID_PSEUDO_CELL_CLS: 'fancy-grid-pseudo-cell',
  //grid column
  GRID_COLUMN_CLS: 'fancy-grid-column',
  GRID_COLUMN_OVER_CLS: 'fancy-grid-column-over',
  GRID_COLUMN_SELECT_CLS: 'fancy-grid-column-select',
  GRID_COLUMN_SELECTED_CLS: 'fancy-grid-column-selected',
  GRID_COLUMN_ELLIPSIS_CLS: 'fancy-grid-column-ellipsis',
  GRID_COLUMN_ORDER_CLS: 'fancy-grid-column-order',
  GRID_COLUMN_TEXT_CLS: 'fancy-grid-column-text',
  GRID_COLUMN_SORT_ASC: 'fancy-grid-column-sort-ASC',
  GRID_COLUMN_SORT_DESC: 'fancy-grid-column-sort-DESC',
  GRID_COLUMN_COLOR_CLS: 'fancy-grid-column-color',
  GRID_COLUMN_RESIZER_CLS: 'fancy-grid-column-resizer',
  //grid spark column
  GRID_COLUMN_SPARKLINE_CLS: 'fancy-grid-column-sparkline',
  GRID_COLUMN_SPARKLINE_BULLET_CLS: 'fancy-grid-column-sparkline-bullet',
  GRID_COLUMN_SPARK_PROGRESS_DONUT_CLS: 'fancy-grid-column-spark-progress-donut',
  GRID_COLUMN_CHART_CIRCLE_CLS: 'fancy-grid-column-chart-circle',
  GRID_COLUMN_GROSSLOSS_CLS: 'fancy-grid-column-grossloss',
  GRID_COLUMN_PROGRESS_CLS: 'fancy-grid-column-progress',
  GRID_COLUMN_PROGRESS_BAR_CLS: 'fancy-grid-column-progress-bar',
  GRID_COLUMN_H_BAR_CLS: 'fancy-grid-column-h-bar',
  GRID_COLUMN_ACTION_ITEM_CLS: 'fancy-grid-column-action-item',
  //grid row
  GRID_ROW_OVER_CLS: 'fancy-grid-cell-over',
  GRID_ROW_EDIT_CLS: 'fancy-grid-row-edit',
  GRID_ROW_EDIT_BUTTONS_CLS: 'fancy-grid-row-edit-buttons',
  GRID_ROW_EDIT_BUTTON_UPDATE_CLS: 'fancy-edit-row-button-update',
  GRID_ROW_EDIT_BUTTON_CANCEL_CLS: 'fancy-edit-row-button-cancel',
  GRID_ROW_GROUP_CLS: 'fancy-grid-group-row',
  GRID_ROW_GROUP_INNER_CLS: 'fancy-grid-group-row-inner',
  GRID_ROW_GROUP_COLLAPSED_CLS: 'fancy-grid-group-row-collapsed',
  GRID_ROW_SUMMARY_CLS: 'fancy-grid-summary-row',
  GRID_ROW_SUMMARY_CONTAINER_CLS: 'fancy-grid-summary-container',
  GRID_ROW_SUMMARY_BOTTOM_CLS: 'fancy-grid-summary-row-bottom',
  GRID_ROW_EXPAND_CLS: 'fancy-grid-expand-row',
  GRID_ROW_EXPAND_OVER_CLS: 'fancy-grid-expand-row-over',
  GRID_ROW_EXPAND_SELECTED_CLS: 'fancy-grid-expand-row-selected',
  //grid body
  GRID_BODY_CLS: 'fancy-grid-body',
  /*
   * Menu cls-S
   */
  MENU_CLS: 'fancy-menu',
  MENU_ITEM_CLS: 'fancy-menu-item',
  MENU_ITEM_IMAGE_CLS: 'fancy-menu-item-image',
  MENU_ITEM_TEXT_CLS: 'fancy-menu-item-text',
  MENU_ITEM_ACTIVE_CLS: 'fancy-menu-item-active',
  MENU_ITEM_RIGHT_IMAGE_CLS: 'fancy-menu-item-right-image',
  MENU_ITEM_EXPAND_CLS: 'fancy-menu-item-expand',
  /*
   * Tab cls-s
   */
  TAB_WRAPPER_CLS: 'fancy-tab-wrapper',
  TAB_ACTIVE_WRAPPER_CLS: 'fancy-active-tab-wrapper',
  TAB_TBAR_CLS: 'fancy-toolbar-tab',
  TAB_TBAR_ACTIVE_CLS: 'fancy-toolbar-tab-active',
  /*
   * Button cls-s
   */
  BUTTON_CLS: 'fancy-button',
  BUTTON_DISABLED_CLS: 'fancy-button-disabled',
  BUTTON_PRESSED_CLS: 'fancy-button-pressed',
  BUTTON_IMAGE_CLS: 'fancy-button-image',
  BUTTON_IMAGE_COLOR_CLS: 'fancy-button-image-color',
  BUTTON_TEXT_CLS: 'fancy-button-text',
  BUTTON_DROP_CLS: 'fancy-button-drop',
  SEG_BUTTON_CLS: 'fancy-seg-button',
  /*
   * Tooltip cls-s
   */
  TOOLTIP_CLS: 'fancy-tooltip',
  TOOLTIP_INNER_CLS: 'fancy-tooltip-inner',
  /*
   * Other cls-s
   */
  SEPARATOR_CLS: 'fancy-separator',
  FOOTER_STATUS_CLS: 'fancy-footer-status',
  STATUS_SOURCE_TEXT_CLS: 'fancy-status-source-text',
  STATUS_SOURCE_LINK_CLS: 'fancy-status-source-link',
  FOOTER_SOURCE_CLS: 'fancy-footer-source',
  /*
   * Picker cls-s
   */
  PICKER_MONTH_CELL_ACTIVE_CLS: 'fancy-month-picker-cell-active',
  PICKER_MONTH_CLS: 'fancy-month-picker',
  PICKER_BUTTON_BACK_CLS: 'fancy-picker-button-back',
  PICKER_BUTTON_NEXT_CLS: 'fancy-picker-button-next',
  PICKER_MONTH_ACTION_BUTTONS_CLS: 'fancy-month-picker-action-buttons',
  PICKER_DATE_CLS: 'fancy-date-picker',
  PICKER_DATE_CELL_TODAY_CLS: 'fancy-date-picker-cell-today',
  PICKER_DATE_CELL_ACTIVE_CLS: 'fancy-date-picker-cell-active',
  PICKER_DATE_CELL_OUT_RANGE_CLS: 'fancy-date-picker-cell-out-range',
  PICKER_BUTTON_DATE_CLS: 'fancy-picker-button-date',
  PICKER_BUTTON_DATE_WRAPPER_CLS: 'fancy-picker-button-date-wrapper',
  PICKER_BUTTON_TODAY_CLS: 'fancy-picker-button-today',
  PICKER_BUTTON_TODAY_WRAPPER_CLS: 'fancy-picker-button-today-wrapper'
});

(function(){

var userAgent = navigator.userAgent.toLowerCase(),
  check = function(regex){
    return regex.test(userAgent);
  },
  isOpera = check(/opera/),
  isIE = !isOpera && check(/msie/),
  isChromium = window.chrome,
  winNav = window.navigator,
  vendorName = winNav.vendor,
  isIEedge = winNav.userAgent.indexOf("Edge") > -1,
  isIOSChrome = winNav.userAgent.match("CriOS"),
  isChrome = function() {
    var isOpera = winNav.userAgent.indexOf("OPR") > -1;

    if (isIOSChrome) {
      return true;
    } else if (
      isChromium !== null &&
      typeof isChromium !== "undefined" &&
      vendorName === "Google Inc." &&
      isOpera === false &&
      isIEedge === false
    ) {
      return true;
    } else {
      return false;
    }
  }(),
  getInternetExplorerVersion = function(){
    var rv = -1;
    if (navigator.appName == 'Microsoft Internet Explorer') {
      var ua = navigator.userAgent,
        re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");

      if (re.exec(ua) != null) {
        rv = parseFloat(RegExp.$1);
      }
    }
    else if (navigator.appName == 'Netscape') {
      var ua = navigator.userAgent,
        re = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");

      if (re.exec(ua) != null) {
        rv = parseFloat(RegExp.$1);
      }
    }
    return rv;
  };

  if(getInternetExplorerVersion() === 11){
    isIE = true;
  }

  if(isIE === false && isIEedge){
    isIE = true;
  }

Fancy.apply(Fancy, {
  isOpera: isOpera,
  isIE: isIE,
  isChrome: isChrome
});

/**
 *
 * @return {Array}
 */
Fancy.getViewSize = function(){
  var xy = [];
  
  if(Fancy.isIE){
    xy[0] = document.documentElement.clientHeight;
    xy[1] = document.documentElement.clientWidth;
  }
  else{
    xy[0] = window.innerHeight;
    xy[1] = window.innerWidth;
  }
  
  return xy;
};

/**
 * @return {Object}
 */
Fancy.getScroll = function() {
  var dd = document.documentElement,
    db = document.body;

  if (dd && (dd.scrollTop || dd.scrollLeft)) {
    return [dd.scrollTop, dd.scrollLeft];
  } else if (db) {
    return [db.scrollTop, db.scrollLeft];
  } else {
    return [0, 0];
  }
};

/**
 * @return {String}
 */
Fancy.getMouseWheelEventName = function(){
  if('onmousewheel' in document.body){
    return 'mousewheel';
  }
  else{
    return 'DOMMouseScroll';
  }
};

/**
 * @param {Object} e
 * @return {Number}
 */
Fancy.getWheelDelta = function(e) {
  var delta = 0;

  if (e.wheelDelta) { // IE/Opera way
    delta = e.wheelDelta / 120;
  } else if (e.detail) { // Mozilla way
    delta = -e.detail / 3;
  }

  return delta;
};

Fancy.isTouch = (document.ontouchstart !== undefined);

Fancy.i18n = {};

Fancy.currencies = {
  map: { 
    EUR: '€',
    USD: '$',
    GBP: '£',
    RUB: '₽',
    CZK: 'Kč',
    AUD: '$',
    JPY: '¥',
    PLN: 'zł',
    TRY: '₺',
    DKK: 'kr',
    KRW: '₩',
    BRL: 'R$',
    CNY: '¥',
    SEK: 'kr',
    CAD: '$',
    NOK: 'kr',
    IDR: 'Rp'
  }
};

})();

Fancy.modules = {};

/*
var FancyGrid = function(config){
  var grid = config;

  Fancy.loadModule('grid', function(){
    new FancyGrid(config);
  });

  return config;
};

var FancyForm = function(){
  var grid = config;

  Fancy.loadModule('form', function(){
    new FancyForm(config);
  });
};
*/
(function() {
  var moduleNames = {};

  /**
   * @param {String} name
   * @param {Function} fn
   */
  Fancy.loadModule = function (name, fn) {
    var body = document.getElementsByTagName('body')[0],
      _script = document.createElement('script'),
      _name = name,
      endUrl = Fancy.DEBUG ? '.js' : '.min.js',
      fn = fn || function () {},
      protocol = location.protocol,
      _v = Fancy.version.replace(/\./g, ''),
      MODULESDIR = Fancy.MODULESDIR || FancyGrid.MODULESDIR || (protocol + '//cdn.fancygrid.com/modules/');

    if(Fancy.MODULELOAD === false || Fancy.MODULESLOAD === false){
      return;
    }

    name = name.replace(/ /g, '-');

    if(Fancy.DEBUG){
      endUrl += '?_dc='+(+new Date());
    }
    else{
      endUrl += '?_v=' + _v;
    }

    Fancy.Modules.on('loaded', function(modules, $name){
      if($name === name){
        Fancy.modules[_name] = true;
        fn(name);
      }
    });

    if(moduleNames[name]){
      return;
    }

    moduleNames[name] = true;

    _script.src = MODULESDIR + name + endUrl;

    _script.charset = 'utf-8';

    _script.onload = function () {
      Fancy.Modules.fire('loaded', name);
    };

    _script.onerror = function () {
      throw new Error('[FancyGrid error] - module ' + name + ' was not loaded');
    };

    body.appendChild(_script);
  };

  /**
   * @param {String} i18n
   * @param {Function} fn
   */
  Fancy.loadLang = function(i18n, fn){
    if(Fancy.i18n[i18n] !== undefined) {
      return true;
    }

    var  body = document.getElementsByTagName('body')[0],
      _script = document.createElement('script'),
      //endUrl = Fancy.DEBUG ? '.js' : '.min.js',
      endUrl = '.js',
      protocol = location.protocol,
      MODULESDIR = Fancy.MODULESDIR || FancyGrid.MODULESDIR || (protocol + '//cdn.fancygrid.com/modules/');

    _script.src = MODULESDIR + 'i18n/' + i18n + endUrl;
    _script.charset = 'utf-8';
    _script.async = 'true';

    _script.onload = function(){
      fn({
        lang: Fancy.i18n[i18n]
      });
    };

    body.appendChild(_script);
  };
})();
Fancy.fullBuilt = true;
Fancy.themes = {};

/**
 * @param {String} name
 * @param {Object} o
 */
Fancy.defineTheme = function(name, o){
  var themeConfig = {};

  if(o.extend){
    Fancy.apply(themeConfig, Fancy.getTheme(o.extend).config);
  }
  else if(name !== 'default'){
    Fancy.apply(themeConfig, Fancy.getTheme('default').config);
  }

  Fancy.apply(themeConfig, o.config);
  o.config = themeConfig;

  Fancy.themes[name] = o;
};

/**
 * @param {Object|String} name
 * @return {Object} o
 */
Fancy.getTheme = function(name){
  var theme = {
    config: {}
  };

  if(Fancy.isObject(name)){
    Fancy.applyIf(theme, Fancy.themes[name.name || 'default']);
    Fancy.apply(theme.config, Fancy.themes[name.name || 'default'].config);
    Fancy.apply(theme.config, name.config);

    return theme;
  }

  return Fancy.themes[name];
};

Fancy.defineTheme('default', {
  config: {
    cellHeaderHeight: 30,
    cellWidth: 70,
    minCellWidth: 40,
    cellHeight: 32,
    titleHeight: 42,
    subTitleHeight: 42,
    barHeight: 38,
    bottomScrollHeight: 12,
    minCenterWidth: 100,
    panelBorderWidth: 2,
    groupRowHeight: 31,

    gridBorders: [1,1,1,1],
    gridWithoutPanelBorders: [1,1,1,1],
    panelBodyBorders: [0,2,2,2],

    knobOffSet: 2,
    fieldHeight: 37
  }
});

Fancy.defineTheme('blue', {
  config: {
    panelBorderWidth: 1,
    //borders: [1,1,0,1],
    gridBorders: [1,1,1,1],
    gridWithoutPanelBorders: [1,1,1,1],
    panelBodyBorders: [0,0,0,0]
  }
});

Fancy.defineTheme('gray', {
  config: {
    panelBorderWidth: 0,
    //borders: [0,0,1,0],
    gridBorders: [0,0,1,0],
    gridWithoutPanelBorders: [1,1,1,1],
    panelBodyBorders: [0,0,0,0]
  }
});

Fancy.defineTheme('dark', {
  config: {
    panelBorderWidth: 1,
    gridBorders: [0,1,1,1],
    gridWithoutPanelBorders: [1,1,1,1],
    panelBodyBorders: [0,0,0,0]
  }
});

Fancy.defineTheme('sand', {
  config: {
    panelBorderWidth: 1,
    gridBorders: [0,1,1,1],
    gridWithoutPanelBorders: [1,1,1,1],
    panelBodyBorders: [0,0,0,0]
  }
});

Fancy.defineTheme('bootstrap', {
  config: {
    panelBorderWidth: 1,
    gridBorders: [1,1,1,1],
    gridWithoutPanelBorders: [1,1,1,1],
    panelBodyBorders: [0,0,0,0]
  }
});
/**
 * @class Fancy.String
 * @singleton
 */
Fancy.String = {
  /**
   * @param {String} tpl
   * @return {String}
   */
  format: function(tpl){
    var arr,
      i,
      iL;

    if(Fancy.typeOf(arguments[1]) === 'array'){
      arr = arguments[1];
    }
    else{
      iL = arguments.length;
      arr = [];
      i = 1;

      for(;i<iL;i++){
        arr[i - 1] = arguments[i];
      }
    }

    return tpl.replace(/\[(\d+)]/g, function(m, i) {
      return arr[i];
    });
  },
  /**
   * @param {String} str
   * @return {String}
   */
  upFirstChar: function(str) {
    return str[0].toLocaleUpperCase() + str.substr(1, str.length);
  },
  /**
   * @param {String} str
   * @return {String}
   */
  trim: function(str) {
    return str.replace(/\s/g, '');
  }
};


Fancy.Array = {
  copy: function(a, deep){
    if(!deep) {
      return a.slice();
    }

    var newArray = [],
      i = 0,
      iL = a.length;

    for(;i<iL;i++){

      switch(Fancy.typeOf(a[i])){
        case 'object':
          newArray[i] = Fancy.Object.copy(a[i]);
          break;
        case 'array':
          newArray[i] = Fancy.Array.copy(a[i]);
          break;
        default:
          newArray = a[i];
      }
    }

    return newArray;
  },
  each: function(arr, fn){
    var i = 0,
      iL = arr.length;

    for(;i<iL;i++){
      fn(arr[i], i);
    }
  },
  /*
   * @param {Array} values
   * @return {Number}
   */
  count: function(values){
    return values.length;
  },
  /*
   * @param {Array} values
   * @return {Number}
   */
  sum: function(values){
    var i = 0,
      iL = values.length,
      value = 0;

    if(Fancy.isArray(values[0])){
      value = [];
      for (;i<iL;i++){
        var j = 0,
          jL = values[i].length;

        for(;j<jL;j++){
          if(value[j] === undefined){
            value[j] = 0;
          }

          value[j] += values[i][j];
        }
      }
    }
    else {
      for (; i < iL; i++) {
        value += values[i];
      }
    }

    return value;
  },
  /*
   * @param {Array} values
   * @return {Number}
   */
  min: function(values){
    return Math.min.apply(this, values);
  },
  /*
   * @param {Array} values
   * @return {Number}
   */
  max: function(values){
    return Math.max.apply(this, values);
  }
};
/**
 * @class Fancy.Object
 * @singleton
 */
Fancy.Object = {
  /**
   * @param {Object} o
   * @return {Object}
   * TODO: deep copy
   */
  copy: function(o){
    var _o = {};

    for(var p in o){
      _o[p] = o[p];
    }

    return _o;
  }
};
/**
 * @class Fancy.Date
 * @singleton
 */
Fancy.Date = {
  daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  dayIndexes: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
  /**
   * @param {String} date
   * @param {String} format
   * @param {String} lang
   * @return {String}
   */
  format: function(date, format, lang, mode) {
    var value = '',
      h,
      _i,
      D,
      l,
      N,
      w,
      F,
      M,
      t,
      g,
      H,
      u,
      U,
      d,
      m,
      mode = mode || '';

    mode = mode.toLocaleLowerCase();

    if(lang === undefined){
      lang = Fancy.i18n.en;
    }
    else if(Fancy.isString(lang)){
      lang = Fancy.i18n[lang];
    }

    var i = 0,
      iL = format.length;

    for(;i<iL; i++){
      var c = format[i];

      switch (c) {
        case 'i':
          _i = date.getMinutes();

          if (_i < 10) {
            value += '0' + _i;
          } else {
            value += _i;
          }

          break;
        case 's':
          _i = date.getSeconds();

          if(mode === 'sql'){
            if(format.substr(i, 2) === 'ss'){
              if (_i < 10) {
                value += '0' + _i;
              } else {
                value += _i;
              }

              i++;
            }
            else{
              throw new Error('[FancyGrid Error] - Invalid date format: ' + format);
            }
          }
          else {
            if (_i < 10) {
              value += '0' + _i;
            } else {
              value += _i;
            }
          }
          break;
        case 'S':
          _i = date.getSeconds();

          if(mode === 'sql'){
            if(format.substr(i, 2) === 'SS'){
              if (_i < 10) {
                value += '0' + _i;
              } else {
                value += _i;
              }

              i++;
            }
            else{
              throw new Error('[FancyGrid Error] - Invalid date format: ' + format);
            }
          }
          else {
            throw new Error('[FancyGrid Error] - Invalid date format: ' + format);
          }
          break;
        case 'a':
          h = date.getHours();

          if (h < 13) {
            value += lang.date.am;
          } else {
            value += lang.date.pm;
          }

          break;
        case 'A':
          h = date.getHours();

          if (h < 13) {
            value += lang.date.AM;
          } else {
            value += lang.date.PM;
          }

          break;
        case 'n':
          value += date.getMonth();
          break;
        case 'j':
          value += date.getDate();
          break;
        case 'm':
          m = date.getMonth() + 1;

          if(mode === 'sql'){
            if(format.substr(i, 2) === 'mm'){
              if (m < 10) {
                m = '0' + m;
              }
              value += m;
              i++;
            }
            else if(format.substr(i, 2) === 'mi'){
              _i = date.getMinutes();

              if (_i < 10) {
                value += '0' + _i;
              } else {
                value += _i;
              }
              i++;
            }
            else{
              throw new Error('[FancyGrid Error] - Invalid date format: ' + format);
            }
          }
          else {
            if (m < 10) {
              m = '0' + m;
            }
            value += m;
          }
          break;
        case 'd':
          d = date.getDate();

          if(mode === 'sql'){
            if(format.substr(i, 2) === 'dd'){
              if (d < 10) {
                d = '0' + d;
              }

              value += d;
              i++;
            }
            else{
              throw new Error('[FancyGrid Error] - Invalid date format: ' + format);
            }
          }
          else {
            if (d < 10) {
              d = '0' + d;
            }

            value += d;
          }
          break;
        case 'Y':
          if(mode === 'sql'){
            if(format.substr(i, 4) === 'YYYY'){
              value += date.getFullYear();
              i += 3;
            }
            else if(format.substr(0, 2) === 'YY'){
              String(date.getFullYear()).substr(2, value.length);
              i += 1;
            }
            else{
              throw new Error('[FancyGrid Error] - Invalid date format: ' + format);
            }
          }
          else {
            value += date.getFullYear();
          }
          break;
        case 'y':
          if(mode === 'sql'){
            if(format.substr(i, 4) === 'yyyy'){
              value += date.getFullYear();
              i += 3;
            }
            else if(format.substr(0, 2) === 'yy'){
              String(date.getFullYear()).substr(2, value.length);
              i += 1;
            }
            else{
              throw new Error('[FancyGrid Error] - Invalid date format: ' + format);
            }
          }
          else {
            value += String(date.getFullYear()).substr(2, value.length);
          }
          break;
        case 'D':
          D = date.getDay();

          if(mode === 'sql'){
            if(format.substr(i, 2) === 'DD'){
              value += lang.date.days[D].substr(0, 3);
              i++;
            }
            else{
              throw new Error('[FancyGrid Error] - Invalid date format: ' + format);
            }
          }
          else {
            value += lang.date.days[D].substr(0, 3);
          }
          break;
        case 'l':
          l = date.getDay();

          value += lang.date.days[l];
          break;
        case 'N':
          N = date.getDay();

          if (N === 0) {
            N = 7;
          }

          value += N;
          break;
        case 'w':
          w = date.getDay();

          value += w;
          break;
        case 'F':
          F = date.getMonth();
          value += lang.date.months[F];
          break;
        case 'M':
          M = date.getMonth();

          if(mode === 'sql'){
            if(format.substr(i, 2) === 'MM'){
              value += lang.date.months[M].substr(0, 3);
              i += 1;
            }
            else if(format.substr(i, 2) === 'MI'){
              _i = date.getMinutes();

              if (_i < 10) {
                value += '0' + _i;
              } else {
                value += _i;
              }

              i++;
            }
            else{
              throw new Error('[FancyGrid Error] - Invalid date format: ' + format);
            }
          }
          else {
            value += lang.date.months[M].substr(0, 3);
          }
          break;
        case 't':
          if(mode === 'sql'){
            value += ' ';
          }
          else{
            t = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
            value += t;
          }
          break;
        case 'T':
          if(mode === 'sql'){
            value += ' ';
          }
          else{
            throw new Error('[FancyGrid Error] - Invalid date format: ' + format);
          }
          break;
        case 'g':
          g = date.getHours() % 12;

          value += g;
          break;
        case 'G':
          g = date.getHours();

          value += g;
          break;
        case 'h':
          h = date.getHours();

          if(mode === 'sql'){
            if(format.substr(i, 2) === 'hh'){
              if (h > 12) {
                value += h - 12;
              } else if (h > 9 && h < 13) {
                value += h;
              } else {
                value += '0' + h;
              }

              i += 1;
            }
            else{
              throw new Error('[FancyGrid Error] - Invalid date format: ' + format);
            }
          }
          else {
            if (h > 12) {
              value += h - 12;
            } else if (h > 9 && h < 13) {
              value += h;
            } else {
              value += '0' + h;
            }
          }
          break;
        case 'H':
          H = date.getHours();

          if(mode === 'sql'){
            if(format.substr(i, 2) === 'HH'){
              if(H < 10){
                value += '0' + H;
              } else {
                value += H;
              }

              i += 1;
            }
            else{
              throw new Error('[FancyGrid Error] - Invalid date format: ' + format);
            }
          }
          else {
            if(H < 10){
              value += '0' + H;
            } else {
              value += H;
            }
          }
          break;
        case 'u':
          u = date.getMilliseconds();

          value += u;
          break;
        case 'U':
          U = Number(date) / 1000;

          value += U;
          break;
        default:
          value += c;
      }
    }

    return value;
  },
  /**
   * @param {String} value
   * @param {String} format
   * @return {Date}
   */
  parse: function(value, format, mode){
    var date,
      now = new Date(),
      year = now.getFullYear(),
      month = now.getMonth(),
      day = now.getDate(),
      hour = 0,
      minute = 0,
      second = 0,
      millisecond = 0,
      mode = mode || '';

    mode = mode.toLocaleLowerCase();

    var i = 0,
      iL = format.length;

    for(;i<iL;i++){
      var c = format[i],
        j,
        jL,
        l;

      switch (c) {
        case 'n':
          var n;

          if (value[1] === '0' || value[1] === '1' || value[1] === '2') {
            n = value[0] + value[1];
            value = value.substr(2, value.length);
          }
          else {
            n = value[0];
            value = value.substr(1, value.length);
          }

          month = Number(n);
          break;
        case 'j':
          if (Fancy.isNumber(parseInt(value[1]))) {
            j = value[0] + value[1];
            value = value.substr(2, value.length);
          }
          else {
            j = value[0];
            value = value.substr(1, value.length);
          }

          day = Number(j);
          break;
        case 'h':
          if(mode === 'sql'){
            if(format.substr(i, 2) === 'hh'){
              var h;
              if(!isNaN(Number(value[1]))){
                h = value[0] + value[1];
                value = value.substr(2, value.length);
                i += 1;
              }
              else {
                h = value[0];
                value = value.substr(1, value.length);
              }

              hour = Number(h);
            }
            else{
              throw new Error('[FancyGrid Error] - Invalid date format: ' + format);
            }
          }
          else {
            var h;
            if (value[1] === '0' || value[1] === '1' || value[1] === '2') {
              h = value[0] + value[1];
              value = value.substr(2, value.length);
            }
            else {
              h = value[0];
              value = value.substr(1, value.length);
            }

            hour = Number(h);
          }
          break;
        case 'a':
          if (value[1] === 'm') {
            hour += 12;
          }

          value = value.substr(2, value.length);
          break;
        case 'A':
          if (value[1] === 'M') {
            hour += 12;
          }

          value = value.substr(2, value.length);
          break;
        case 'i':
          minute = value[0] + value[1];

          value = value.substr(2, value.length);
          break;
        case 's':
          if(mode === 'sql'){
            if(format.substr(i, 2) === 'ss'){
              second = value[0] + value[1];
              value = value.substr(2, value.length);
              i++;
            }
            else{
              throw new Error('[FancyGrid Error] - Invalid date format: ' + format);
            }
          }
          else{
            second = value[0] + value[1];
            value = value.substr(2, value.length);
          }
          break;
        case 'S':
          if(mode === 'sql'){
            if(format.substr(i, 2) === 'SS'){
              second = value[0] + value[1];
              value = value.substr(2, value.length);
              i++;
            }
            else{
              throw new Error('[FancyGrid Error] - Invalid date format: ' + format);
            }
          }
          else{
            second = value[0] + value[1];
            value = value.substr(2, value.length);
          }
          break;
        case 'u':
          millisecond = value[0] + value[1] + value[2];

          value = value.substr(3, value.length);
          break;
        case 'm':
          if(mode === 'sql'){
            if(format.substr(i, 2) === 'mm'){
              switch (value[0]) {
                case '0':
                case '1':
                case '2':
                case '3':
                  if (isNaN(parseInt(value[1]))) {
                    month = Number(value[0]) - 1;
                    value = value.substr(1, value.length);
                  }
                  else {
                    month = Number(value[0] + value[1]) - 1;
                    value = value.substr(2, value.length);
                  }

                  i += 1;
                  break;
                default:
                  month = Number(value[0]) - 1;
                  value = value.substr(1, value.length);
              }
            }
            else if(format.substr(i, 2) === 'mi'){
              minute = value[0] + value[1];
              value = value.substr(2, value.length);
              i++;
            }
            else{
              throw new Error('[FancyGrid Error] - Invalid date format: ' + format);
            }
          }
          else {
            switch (value[0]) {
              case '0':
              case '1':
              case '2':
              case '3':
                if (isNaN(parseInt(value[1]))) {
                  month = Number(value[0]) - 1;
                  value = value.substr(1, value.length);
                }
                else {
                  month = Number(value[0] + value[1]) - 1;
                  value = value.substr(2, value.length);
                }
                break;
              default:
                month = Number(value[0]) - 1;
                value = value.substr(1, value.length);
            }
          }
          break;
        case 'd':
          if(mode === 'sql'){
            if(format.substr(i, 2) === 'dd'){
              if (isNaN(parseInt(value[1]))) {
                day = Number(value[0]);
                value = value.substr(1, value.length);
              }
              else {
                day = Number(value[0] + value[1]);
                value = value.substr(2, value.length);
              }
              i++;
            }
            else{
              throw new Error('[FancyGrid Error] - Invalid date format: ' + format);
            }
          }
          else {
            if (isNaN(parseInt(value[1]))) {
              day = Number(value[0]);
              value = value.substr(1, value.length);
            }
            else {
              day = Number(value[0] + value[1]);
              value = value.substr(2, value.length);
            }
          }
          break;
        case 'Y':
          if(mode === 'sql'){
            if(format.substr(i, 4) === 'YYYY'){
              year = Number(value[0] + value[1] + value[2] + value[3]);
              value = value.substr(4, value.length);
              i += 3;
            }
            else if(format.substr(0, 2) === 'YY'){
              year = Number(value[0] + value[1]);
              value = value.substr(2, value.length);
              i += 1;

              if(year < 51){
                year = Number('20' + year);
              }
              else{
                year = Number('19' + year);
              }
            }
            else{
              throw new Error('[FancyGrid Error] - Invalid date format: ' + format);
            }
          }
          else{
            year = Number(value[0] + value[1] + value[2] + value[3]);
            value = value.substr(4, value.length);
          }
          break;
        case 'y':
          if(mode === 'sql'){
            if(format.substr(i, 4) === 'yyyy'){
              year = Number(value[0] + value[1] + value[2] + value[3]);
              value = value.substr(4, value.length);
              i += 3;
            }
            else if(format.substr(0, 2) === 'yy'){
              year = Number(value[0] + value[1]);
              value = value.substr(2, value.length);
              i += 1;

              if(year < 51){
                year = Number('20' + year);
              }
              else{
                year = Number('19' + year);
              }
            }
            else{
              throw new Error('[FancyGrid Error] - Invalid date format: ' + format);
            }
          }
          else {
            year = Number(value[0] + value[1]);
            if (year < 51) {
              year = Number('20' + year);
            }
            else {
              year = Number('19' + year);
            }

            value = value.substr(2, value.length);
          }
          break;
        case 'D':
          if(mode === 'sql'){
            if(format.substr(i, 2) === 'DD'){
              if (isNaN(parseInt(value[1]))) {
                day = Number(value[0]);
                value = value.substr(1, value.length);
              }
              else {
                day = Number(value[0] + value[1]);
                value = value.substr(2, value.length);
              }
              i++;
            }
            else{
              throw new Error('[FancyGrid Error] - Invalid date format: ' + format);
            }
          }
          else {
            value = value.substr(3, value.length);
          }
          break;
        case 'l':
          l = value[0] + value[1] + value[2];
          j = 0;
          jL = 7;

          for (; j < jL; j++) {
            var d = lang.days[j];

            if (l === d.substr(0, 3)) {
              value = value.substr(d.length, value.length);
              break;
            }
          }

          break;
        case 'N':
          value = value.substr(1, value.length);
          break;
        case 'w':
          value = value.substr(1, value.length);
          break;
        case 'F':
          l = value[0] + value[1] + value[2];
          j = 0;
          jL = 7;

          for (; j < jL; j++) {
            var m = lang.months[j];

            if (l === m.substr(0, 3)) {
              value = value.substr(m.length, value.length);
              break;
            }
          }

          break;
        case 'M':
          if(mode === 'sql'){
            if(format.substr(i, 2) === 'MM'){
              switch (value[0]) {
                case '0':
                case '1':
                case '2':
                case '3':
                  if (isNaN(parseInt(value[1]))) {
                    month = Number(value[0]) - 1;
                    value = value.substr(1, value.length);
                  }
                  else {
                    month = Number(value[0] + value[1]) - 1;
                    value = value.substr(2, value.length);
                  }

                  i += 1;
                  break;
                default:
                  month = Number(value[0]) - 1;
                  value = value.substr(1, value.length);
              }
            }
            else if(format.substr(i, 2) === 'MI'){
              minute = value[0] + value[1];
              value = value.substr(2, value.length);
              i++;
            }
            else{
              throw new Error('[FancyGrid Error] - Invalid date format: ' + format);
            }
          }
          else{
            value = value.substr(3, value.length);
          }
          break;
        case 't':
          if(mode === 'sql'){
            value = value.substr(1, value.length);
          }
          else{
            value = value.substr(2, value.length);
          }
          break;
        case 'T':
          if(mode === 'sql'){
            value = value.substr(1, value.length);
          }
          else{
            throw new Error('[FancyGrid Error] - Invalid date format: ' + format);
          }
          break;
        case 'G':
          if (Fancy.isNumber(parseInt(value[1]))) {
            hour = Number(value[0] + value[1]);
            value = value.substr(2, value.length);
          } else {
            hour = Number(value[0]);
            value = value.substr(1, value.length);
          }

          break;
        case 'g':
          value = value.substr(1, value.length);
          break;
        case 'H':
          if(mode === 'sql'){
            if(format.substr(i, 2) === 'HH'){
              var h;
              if(!isNaN(Number(value[1]))){
                h = value[0] + value[1];
                value = value.substr(2, value.length);
                i += 1;
              }
              else {
                h = value[0];
                value = value.substr(1, value.length);
              }

              hour = Number(h);
            }
            else{
              throw new Error('[FancyGrid Error] - Invalid date format: ' + format);
            }
          }
          else{
            hour = Number(value[0] + value[1]);
            value = value.substr(2, value.length);
          }
          break;
        default:
          value = value.substr(1, value.length);
      }
    }

    date = new Date(year, month, day, hour, minute, second, millisecond);

    return date;
  },
  /**
   * @param {Date} date
   * @return {Number}
   */
  getDaysInMonth: function(date){
    var m = date.getMonth();

    return m === 1 && Fancy.Date.isLeapYear(date) ? 29 : Fancy.Date.daysInMonth[m];
  },
  /**
   * @param {Date} date
   * @return {Number}
   */
  getFirstDayOfMonth: function(date){
    var day = (date.getDay() - (date.getDate() - 1)) % 7;

    return (day < 0) ? (day + 7) : day;
  },
  /**
   * @param {Date} date
   * @return {Boolean}
   */
  isLeapYear: function(date){
    var year = date.getFullYear();

    return !!((year & 3) === 0 && (year % 100 || (year % 400 === 0 && year)));
  },
  /**
   * @param {String|Number} year
   * @param {String|Number} month
   * @return {Number}
   */
  getMonthNumber: function(year, month){
    return new Date(year, month + 1, 0).getDate();
  }
};
/**
 * @class Fancy.Number
 * @singleton
 */
Fancy.Number = {
  /**
   * @param {Number} value
   * @return {Boolean}
   */
  isFloat: function(value){
    return Number(value) === value && value % 1 !== 0;
  },
  getPrecision: function(value){
    return (value + "").split(".")[1].length + 1;
  },
  correctFloat: function(value){
    return parseFloat(value.toPrecision(14));
  }
};
/*
 * @class Fancy.Collection
 * @constructor
 */
Fancy.Collection = function(arr){
  var me = this;

  me.items = [];
  me.keys = [];
  me.map = {};
  me.indexMap = {};
  me.length = 0;

  if( arr ){
    if(arr.length > 0){
      var i = 0,
        iL = arr.length;

      for(;i<iL;i++){
        me.add(i, arr[i]);
      }
    }
    else{
      for(var p in arr){
        me.add(p, arr[p]);
      }
    }
  }
};

Fancy.Collection.prototype = {
  /*
   *
   * @param {String|Number} key
   * @param {*} value
   */
  add: function(key, value){
    var me = this;

    me.items.push(value);
    me.keys.push(key);
    me.map[key] = value;
    me.indexMap[key] = me.length;
    me.length++;
  },
  /*
   * @param {String|Number} key
   */
  remove: function(key){
    var me = this,
      index = me.indexMap[key];

    me.items.splice(index, 1);
    me.keys.splice(index, 1);
    delete me.indexMap[index];
    delete me.map[key];
    me.length--;

    me.updateIndexMap();
  },
  updateIndexMap: function () {
    var me = this,
      i = 0,
      iL = me.keys.length;

    me.indexMap = {};

    for(;i<iL;i++){
      me.indexMap[me.keys[i]] = i;
    }
  },
  /*
   *
   */
  removeAll: function(){
    var me = this;

    me.items = [];
    me.keys = [];
    me.indexMap = {};
    me.map = {};
    me.length = 0;
  },
  /*
   * @param {String|Number} key
   * @return {*}
   */
  get: function(key){
    return this.map[key];
  },
  /*
   *
   * @param {Function} fn
   */
  each: function(fn){
    var me = this,
      i = 0,
      iL = me.length;

    for(;i<iL;i++){
      fn(me.keys[i], me.items[i], i, me.length);
    }
  }
};
/**
 * @class Fancy.Template
 * @constructor
 * @param {Array} html
 */
Fancy.Template = function(html){
  var me = this;

  if(Fancy.isArray(html)){
    me.tpl = html.join('');
  }
  else{
    me.tpl = html;
  }

  me.compile();
};

Fancy.Template.prototype = {
  re: /\{([\w\-]+)\}/g,
  /*
   * @param {Array} values
   */
  getHTML: function(values){
    return this.compiled(values);
  },
  /*
   * @return {Fancy.Template}
   */
  compile: function(){
    var me = this;

      function fn(m, name){
        name = "values['" + name + "']";
        return "'+(" + name + " === undefined ? '' : " + name + ")+'";
      }

    eval("me.compiled = function(values){ return '" + me.tpl.replace(me.re, fn) + "';};");

    return me;
  }
};
Fancy.key = {
  BACKSPACE: 8,
  TAB: 9,
  ENTER: 13,
  RETURN: 13,
  SHIFT: 16,
  CTRL: 17,
  ALT: 18,
  ESC: 27,
  END: 35,
  HOME: 36,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  INSERT: 45,
  DELETE: 46,
  ZERO: 48,
  ONE: 49,
  TWO: 50,
  THREE: 51,
  FOUR: 52,
  FIVE: 53,
  SIX: 54,
  SEVEN: 55,
  EIGHT: 56,
  NINE: 57,
  NUM_ZERO: 96,
  NUM_ONE: 97,
  NUM_TWO: 98,
  NUM_THREE: 99,
  NUM_FOUR: 100,
  NUM_FIVE: 101,
  NUM_SIX: 102,
  NUM_SEVEN: 103,
  NUM_EIGHT: 104,
  NUM_NINE: 105,
  NUM_PLUS: 107,
  NUM_MINUS: 109,
  NUM_DOT: 110,
  A: 65,
  B: 66,
  C: 67,
  D: 68,
  E: 69,
  F: 70,
  G: 71,
  H: 72,
  I: 73,
  J: 74,
  K: 75,
  L: 76,
  M: 77,
  N: 78,
  O: 79,
  P: 80,
  Q: 81,
  R: 82,
  S: 83,
  T: 84,
  U: 85,
  V: 86,
  W: 87,
  X: 88,
  Y: 89,
  Z: 90,
  DOT: 190
};

Fancy.Key = {
  /*
   * @param {number} c
   * @return {Boolean}
   */
  isNum: function(c){
    var key = Fancy.key;

    switch(c){
      case key.ZERO:
      case key.ONE:
      case key.TWO:
      case key.THREE:
      case key.FOUR:
      case key.FIVE:
      case key.SIX:
      case key.SEVEN:
      case key.EIGHT:
      case key.NINE:
      case key.NUM_ZERO:
      case key.NUM_ONE:
      case key.NUM_TWO:
      case key.NUM_THREE:
      case key.NUM_FOUR:
      case key.NUM_FIVE:
      case key.NUM_SIX:
      case key.NUM_SEVEN:
      case key.NUM_EIGHT:
      case key.NUM_NINE:
        return true;
      default:
        return false;
    }
  },
  /*
   * @param {Number} c
   * @param {Object} w
   * @return {Boolean}
   */
  isNumControl: function(c, e){
    var key = Fancy.key;

    if( Fancy.Key.isNum(c) ){
      return true;
    }

    if( e.shiftKey && c === 187){
      return true;
    }

    switch(c){
      case key.NUM_PLUS:
      case 189:
      case key.NUM_MINUS:
      case key.NUM_DOT:
      case key.BACKSPACE:
      case key.DELETE:
      case key.TAB:
      case key.ENTER:
      case key.RETURN:
      case key.SHIFT:
      case key.CTRL:
      case key.ALT:
      case key.ESC:
      case key.END:
      case key.HOME:
      case key.LEFT:
      case key.UP:
      case key.RIGHT:
      case key.DOWN:
      case key.INSERT:
      case key.DOT:
        return true;
        break;
      default:
        return false;
    }
  }
};
(function(){

var $classes = {},
  $types = {};

/**
 * Apply method and properties of Parent prototype to Child prototype
 * @private
 * @param {Object} Child
 * @param {Object} Parent
 */
var applyIf = function(Child, Parent){
  for(var p in Parent.prototype){
    if(Child.prototype[p] === undefined){
      Child.prototype[p] = Parent.prototype[p];
    }
  }
};

/**
 * @class ClassManager manage all classes, helps to manipulate
 * @private
 * @constructor
 */
var ClassManager = function(){

  this.waitMixins = {};
};
ClassManager.prototype = {
  items: new Fancy.Collection(),
  /*
   * Define class in global scope with it namespace
   * @param {String} key
   */
  add: function(key, value){
    var parts = key.split("."),
      i = 1,
      iL = parts.length - 1;
    
    Fancy.ns(key);
    
    var ref = Fancy.global[parts[0]];
    
    for(;i<iL;i++){
      ref = ref[parts[i]];
    }
    
    if(parts.length > 1){
      ref[parts[parts.length - 1]] = value;
    }
    else{
      Fancy.global[parts[0]] = value;
    }
    
    this.items.add(key, value);
  },
  /*
   * Returns class by key
   * @param {String} key
   * @return {Object}
   */
  get: function(key){
    return this.items.get(key);
  },
  /*
   * @param {String} whatWait
   * @param {String} whoWait
   */
  waitMixin: function(whatWait, whoWait){
    var me = this;

    me.waitMixins[whatWait] = me.waitMixins[whatWait] || {
        waiters: []
      };

    me.waitMixins[whatWait].waiters.push(whoWait);
  },
  /*
   * @param {String} name
   * @return {Object}
   */
  getMixin: function(name){
    var parts = name.split("."),
      j = 1,
      jL = parts.length;

    var namespace = Fancy.global[parts[0]];

    if(namespace === undefined){
      return false;
    }

    for(;j<jL;j++){
      namespace = namespace[parts[j]];

      if(namespace === undefined){
        return false;
      }
    }

    return namespace;
  }
};

/**
 * @class Fancy.ClassManager manages all classes, helps to manipulate
 * @private
 * @singleton
 */
Fancy.ClassManager = new ClassManager();

/*
 * Define class
 * @method
 * @param {String|Array} name
 * @param {Object} config
 */
Fancy.define = function(name, config){
  var config = config || {},
    names = [];
  
  if( Fancy.isArray(name) ){
    names = name;
    name = names[0];
  }
  
  if(config.constructor === Object){
    if(config.extend === undefined){
      config.constructor = function(){
        
      };
    }
    else{
      config.constructor = function(){
        this.Super('constructor', arguments);
      };
    }
  }
  
  if(config.extend === undefined){
    $classes[name] = config.constructor;
  }
  else{
    $classes[name] = config.constructor;
    
    var extendClass;
    switch(typeof config.extend){
      case 'string':
        extendClass = Fancy.ClassManager.get(config.extend);
        $classes[name].prototype.$Super = Fancy.ClassManager.get(config.extend);
        break;
      case 'function':
        extendClass = config.extend;
        $classes[name].prototype.$Super = config.extend;
        break;
    }
    delete config.extend;
    
    $classes[name].prototype.Super = function(method, args){
      var me = this;
      if( me.$Iam ){
        me.$Iam = Fancy.ClassManager.get( me.$Iam.prototype.$Super.prototype.$name );
      }
      else{
        me.$Iam = Fancy.ClassManager.get( me.$Super.prototype.$name );
      }

      switch(method){
        case 'const':
        case 'constructor':
          me.$Iam.apply(me, args);
        break;
        default:
          me.$Iam.prototype[method].apply(me, args);
      }
      
      delete me.$Iam;
    };
    applyIf($classes[name], extendClass);
  }
  
  $classes[name].prototype.$name = name;
  
  if(config.mixins){
    Fancy.mixin( $classes[name].prototype, config.mixins );
    delete $classes[name].prototype.mixins;
  }

  if(config.plugins !== undefined){
    if( $classes[name].prototype.$plugins === undefined ){
      $classes[name].prototype.$plugins = [];
    }

    $classes[name].prototype.$plugins = $classes[name].prototype.$plugins.concat( config.plugins );
    delete $classes[name].prototype.plugins;
  }

  for(var p in config){
    $classes[name].prototype[p] = config[p];
  }
  
  var _classRef = $classes[name];
  
  if( config.singleton === true ){
    delete $classes[name];
    _classRef = new _classRef(config);
    $classes[name] = _classRef;
    
  }
  
  if( names.length > 1 ){
    Fancy.each(names, function(name){
      Fancy.ClassManager.add(name, _classRef);
    });
  }
  else{
    Fancy.ClassManager.add(name, _classRef);
  }
  
  if(config.type){
    $types[config.type] = _classRef;
    Fancy.addWidgetType(config.type, _classRef);
  }
  else if(config.ptype){
    $types[config.type] = _classRef;
    Fancy.addPluginByType(config.ptype, _classRef);
  }
};

/*
 * Returns class by it's type
 * @param {String} type
 * @return {Object}
 */
Fancy.getClassByType = function(type){
  return $types[type];
};

})();
/**
 * @class Fancy.MixinClass
 * @constructor
 */
Fancy.MixinClass = function(){};

Fancy.MixinClass.prototype = {
  /**
   * generate unique id for class
   */
  initId: function(){
    var me = this,
      prefix = me.prefix || Fancy.prefix;

    me.id = me.id || Fancy.id(null, prefix);

    Fancy.addWidget(me.id, me);
  },
  /*
   * Initialize plugins if they are presented in class
   */
  initPlugins: function(){
    var me = this,
      widget = me,
      plugin,
      objectPlugin,
      pluginConfig;

    me.plugins = me.plugins || [];

    if(me._plugins){
      me.plugins = me.plugins.concat(me._plugins);
    }

    if(me.plugins !== undefined){
      me.$plugins = me.plugins;
      delete me.plugins;
    }

    if(me.$plugins === undefined){
      return;
    }

    var i = 0,
      plugins = me.$plugins,
      iL = plugins.length,
      inWidgetName,
      types = {};

    for(;i<iL;i++){
      pluginConfig = plugins[i];
      pluginConfig.widget = widget;

      var type = pluginConfig.type || pluginConfig.ptype;

      if(types[type] === true){
        continue;
      }

      types[type] = true;
      plugin = Fancy.getPluginByType( type );
      if(plugin === undefined){
        throw new Error('[FancyGrid Error] - some of module was not loaded. Grid plugin does not exist - ' + type);
      }
      objectPlugin = new plugin(pluginConfig);
      inWidgetName = pluginConfig.inWidgetName || objectPlugin.inWidgetName;

      if(inWidgetName !== undefined){
        widget[ inWidgetName ] = objectPlugin;
      }
    }
  }
};
/*
 * @class Fancy.Data
 */
Fancy.define('Fancy.Data', {
  /*
   * @constructor
   * @param {Array} data
   */
  constructor: function(data){
    var me = this;

    me.map = {};

    if(data){
      var i = 0,
        iL = data.length,
        map = me.map;

      for(;i<iL;i++){
        map[i] = data[i];
      }
    }

    me.length = 0;
  },
  /*
   * @param {String|Number} key
   * @param {*} value
   */
  add: function(key, value){
    this.map[key] = value;
    this.length++;
  },
  /*
   * @param {String|Number} key
   * @return {*}
   */
  get: function(key){
    return this.map[key];
  }
});
/*
 * @class Fancy.Model
 */
Fancy.define('Fancy.Model', {
  /*
   * @constructor
   * @param {Object|Array} data
   */
  constructor: function(data){
    var me = this,
      row = {},
      fields = me.fields || [],
      j = 0,
      jL = fields.length;

    if( Fancy.isArray(data) ){
      for(;j<jL;j++){
        var p = fields[j];
        row[p] = data[j];
      }

      if(row.id === undefined){
        Fancy.idSeed++;
        row.id = Fancy.idSeed + 1000;
      }

      me.data = row;
      me.id = me.data.id;
      //TODO - id
    }
    else{
      if(data.id){
        me.id = data.id;
      }
      else{
        Fancy.idSeed++;
        me.id = Fancy.idSeed + 1000;
      }

      if( me.fields === undefined ){
        fields = [];
        for(var p in data){
          fields.push(p)
        }
        me.fields = fields;
      }

      jL = fields.length;

      for(;j<jL;j++){
        var p = fields[j];

        if(data[p] === undefined){
          row[p] = '';
        }
        else{
          row[p] = data[p];
        }
      }

      me.data = row;
    }
  },
  /*
   * @param {String} key
   * @return {Object}
   */
  get: function(key){
    var me = this;

    if(key === undefined){
      return me.data;
    }

    return me.data[key];
  },
  /*
   * @param {String} key
   * @param {*} value
   */
  set: function(key, value){
    var me = this;

    if(value === undefined && Fancy.isObject(key)){
      for(var p in key){
        me.set(p, key[p]);
      }
      return;
    }

    me.data[key] = value;
  }
});
/*
 * @class Fancy.Data
 * @singleton
 */
Fancy.define('Fancy.PluginManager', {
  singleton: true,
  /*
   * @constructor
   */
  constructor: function(){
    this.ptypes = new Fancy.Data();
  },
  /*
   * @param {String} ptype
   * @param {Object} plugin
   */
  addPlugin: function(ptype, plugin){
    this.ptypes.add(ptype, plugin);
  },
  /*
   * @param {String} ptype
   * @return {Object}
   */
  getPlugin: function(ptype){
    return this.ptypes.get(ptype);
  }
});

/*
 * @param {String} ptype
 * @param {Object} plugin
 */
Fancy.addPluginByType = function(ptype, plugin){
  Fancy.PluginManager.addPlugin(ptype, plugin);
};

/*
 * @param {String} ptype
 * @return {Object}
 */
Fancy.getPluginByType = function(ptype){
  return Fancy.PluginManager.getPlugin(ptype);
};
/*
 * @class Fancy.WidgetManager
 * @singleton
 */
(function () {
  //SHORTCUTS
  var F = Fancy;

  F.define('Fancy.WidgetManager', {
    singleton: true,
    /*
     * @constructor
     */
    constructor: function () {
      this.wtypes = new F.Data();
      this.widgets = new F.Data();
    },
    /*
     * @param {String} wtype
     * @param {Object} widget
     */
    addWidgetType: function (wtype, widget) {
      widget.prototype.wtype = wtype;
      this.wtypes.add(wtype, widget);
    },
    /*
     * @param {String} wtype
     * @return {Object}
     */
    getWidgetClassByType: function (wtype) {
      return this.wtypes.get(wtype);
    },
    /*
     * @param {String} id
     * @param {Object} widget
     */
    addWidget: function (id, widget) {
      this.widgets.add(id, widget);
    },
    /*
     * @param {String} id
     * @return {Object}
     */
    getWidget: function (id) {
      return this.widgets.get(id);
    }
  });

  var W = F.WidgetManager;

  /*
   * @param {String} wtype
   * @param {Object} widget
   */
  F.addWidgetType = function (wtype, widget) {
    W.addWidgetType(wtype, widget);
  };

  /*
   * @param {String} wtype
   * @return {Object}
   */
  F.getWidgetClassByType = function (wtype) {
    return W.getWidgetClassByType(wtype);
  };

  /*
   * @param {String} id
   * @param {Object} widget
   */
  F.addWidget = function (id, widget) {
    W.addWidget(id, widget);
  };

  /*
   * @param {String} id
   * @return {Object} widget
   */
  F.getWidget = function (id) {
    return W.getWidget(id);
  };

})();
(function(){
var seedFn = 0,
  fns = {};

/*
 * @class Fancy.Event
 */
Fancy.define(['Fancy.Event', 'Fancy.Observable'], {
  mixins: [
    Fancy.MixinClass
  ],
  /*
   * @constructor
   * @param {Object} config
   */
  constructor: function(config){
    var me = this;

    Fancy.applyConfig(me, config || {});

    me.$events = {};
    if(me.listeners || me.events){
      var listeners = me.listeners || me.events,
        i = 0,
        iL = listeners.length;

      for(;i<iL;i++){
        var lis = listeners[i],
          eventName = null,
          handler = null,
          scope = null,
          delay = 0,
          params = [];

        for(var p in lis){
          switch(p){
            case 'scope':
              scope = lis[p];
              break;
            case 'params':
              params = lis[p];
              break;
            case 'delay':
              delay = lis[p];
              break;
            default:
              eventName = p;
              handler = lis[p];
          }
        }

        if(eventName === null){
          throw new Error('Event was not set');
        }
        else{
          switch(Fancy.typeOf(handler)){
            case 'string':
              handler = me[handler];
              lis.handler = handler;
              if(lis.scope === undefined){
                scope = me;
              }
              lis.scope = scope;
              break;
            case 'function':
              break;
            default:
              throw new Error('Handler has wrong type or not defined');
          }
        }

        if(Fancy.isArray(params) === false){
          throw new Error('params must be array');
        }

        me.addEvent(eventName);
        me.on(eventName, handler, scope, params, delay);
      }
    }
  },
  /*
   * @param {String} eventName
   * @param {Function} fn
   * @param {Object} scope
   * @param {Object} params
   */
  on: function(eventName, fn, scope, params, delay){
    if( this.$events[eventName] === undefined ){
      throw new Error('Event name is not set: ' + eventName);
    }

    if(fn === undefined){
      throw new Error('Handler is undefined. Name of event is ' + eventName + '.');
    }

    fn.$fancyFnSeed = seedFn;
    fns[seedFn] = fn;
    seedFn++;

    this.$events[eventName].push({
      fn:fn,
      scope: scope,
      params: params || [],
      delay: delay
    });
  },
  /*
   * @param {String} eventName
   * @param {Function} fn
   */
  un: function(eventName, fn){
    var me = this,
      $events = me.$events[eventName];

    if(!$events){
      return false;
    }

    var i = 0,
      iL = $events.length;

    for(;i<iL;i++){
      var lis = $events[i];
      if(lis.fn.$fancyFnSeed === fn.$fancyFnSeed){
        lis.toRemove = true;
        return true;
      }
    }
    return false;
  },
  /*
   * @param {String} eventName
   * @param {Function} fn
   * @param {Object} scope
   */
  once: function(eventName, fn, scope){
    var me = this,
      fnWrapper = function(){
        fn.apply(this, arguments);
        me.un(eventName, fnWrapper);
      };

    me.on(eventName, fnWrapper, scope);
  },
  /*
   *
   */
  unAll: function(){
    this.$events = {};
  },
  /*
   * @param {String} eventName
   */
  unAllByType: function(eventName){
    this.$events[eventName] = [];
  },
  /*
   * @param {String} eventName
   */
  fire: function(eventName){
    var me = this,
      $events = me.$events[eventName];

    if(!$events){
      return false;
    }

    var i = 1,
      iL = arguments.length,
      args = [me];

    for(;i<iL;i++){
      args.push(arguments[i]);
    }

    var i = 0,
      iL = $events.length;

    for(;i<iL;i++){
      var lis = $events[i],
        _args = [];

      if( lis.toRemove === true ){
        $events.splice(i, 1);
        i--;
        iL = $events.length;
        continue;
      }

      _args = _args.concat(args);
      if( lis.params ){
        _args = _args.concat(lis.params);
      }

      if(lis.delay){
        setTimeout(function () {
          lis.fn.apply(lis.scope || me, _args);
        }, lis.delay);
      }
      else{
        lis.fn.apply(lis.scope || me, _args);
      }
    }
  },
  /*
   * @param {String} eventName
   * @return {Array}
   */
  addEvent: function(eventName){
    return this.addEvents(eventName);
  },
  /*
   * @param {String...} eventName
   * @return {Array}
   */
  addEvents: function(eventName){
    var me = this;

    if(arguments.length > 1){
      var tempEventName = [],
        i = 0,
        iL = arguments.length;

      for(;i<iL;i++){
        tempEventName[i] = arguments[i];
      }
      eventName = tempEventName;
    }
    if(Fancy.typeOf(eventName) === 'string'){
      me.$events[eventName] = me.$events[eventName] || [];
    }
    else if(Fancy.typeOf(eventName) === 'array'){
      var i = 0,
        iL = eventName.length;

      for(;i<iL; i++){
        me.$events[eventName[i]] = me.$events[eventName[i]] || [];
      }
    }
  },
  /*
   * @param {String} eventName
   * @return {Boolean}
   */
  has: function(eventName){
    var lis = this.$events[eventName];
    if(!lis){
      return false;
    }

    return lis.length !== 0;
  }
});

  /*
   * @class Fancy.Modules
   * @singleton
   */
  Fancy.define('Fancy.Modules', {
    extend: Fancy.Event,
    singleton: true,
    /*
     * @constructor
     */
    constructor: function(){
      this.Super('const', arguments);
      this.init();
    },
    /*
     *
     */
    init: function(){
      this.addEvents('loaded');
    }
  });

})();
/*
 * @mixin Fancy.store.mixin.Paging
 */
Fancy.Mixin('Fancy.store.mixin.Paging',{
  /*
   *
   */
  initPaging: function(){
    var me = this;

    if(me.paging === undefined){
      return;
    }

    if(Fancy.isObject(me.paging)){
      Fancy.apply(me, me.paging);
    }

    me.calcPages();
    me.changeDataView();
  },
  /*
   *
   */
  firstPage: function(){
    var me = this;

    me.calcPages();

    me.showPage = 0;

    if(me.pageType === 'server'){
      me.loadPage();
    }
    else {
      me.changeDataView();
    }
  },
  /*
   *
   */
  prevPage: function(){
    var me = this;

    me.calcPages();
    me.showPage--;

    if(me.showPage < 0){
      me.showPage = 0;
    }

    if(me.pageType === 'server'){
      me.loadPage();
    }
    else {
      me.changeDataView();
    }
  },
  /*
   *
   */
  nextPage: function(){
    var me = this;

    me.calcPages();
    me.showPage++;

    if(me.showPage === me.pages){
      me.showPage--;
    }

    if(me.showPage < 0){
      me.showPage = 0;
    }

    if(me.pageType === 'server'){
      me.loadPage();
    }
    else {
      me.changeDataView();
    }
  },
  /*
   *
   */
  lastPage: function(){
    var me = this;

    me.calcPages();
    me.showPage = me.pages - 1;

    if(me.showPage < 0){
      me.showPage = 0;
    }

    if(me.pageType === 'server'){
      me.loadPage();
    }
    else {
      me.changeDataView();
    }
  },
  /*
   *
   */
  calcPages: function(){
    var me = this;

    if(me.pageType === 'server'){
      var oldPages = me.pages;
      me.pages = Math.ceil(me.getTotal() / me.pageSize);
      if(!isNaN(oldPages) && oldPages > me.pages){
        me.showPage--;
        if(me.showPage < 0){
          me.showPage = 0;
        }
        return 'needs reload';
      }
    }
    else {
      me.pages = Math.ceil(me.getTotal() / me.pageSize);
    }

    if(me.showPage >= me.pages){
      me.showPage = me.pages - 1;
    }

    if(me.showPage < 0){
      me.showPage = 0;
    }

    me.fire('changepages');
  },
  /*
   * @param {Number} value
   */
  setPage: function(value){
    var me = this;

    me.showPage = value;

    if(me.showPage === me.pages){
      me.showPage--;
    }

    if(me.showPage < 0){
      me.showPage = 0;
    }

    if(me.pageType === 'server'){
      me.loadPage();
    }
    else{
      me.changeDataView();
    }
  },
  refresh: function(){
    var me = this;

    if(me.pageType === 'server'){
      me.loadPage();
    }
    else{
      me.changeDataView();
    }
  },
  /*
   * @param {Object} o
   */
  processPagingData: function(o){
    var me = this;

    if(o.totalCount !== undefined){
      me.totalCount = o.totalCount;
    }

    me.checkPagingType(o);
    me.setData(o[me.readerRootProperty]);
    //TODO: check samples with filter, paging and server and static
    me.changeDataView({
      stoppedFilter: true
    });
    if( me.calcPages() === 'needs reload' ){
      me.loadPage();
    }
  },
  /*
   * @param {Object} o
   */
  checkPagingType: function(o){
    var me = this;

    if(o.totalCount !== undefined && o.totalCount !== o[me.readerRootProperty].length){
      me.totalCount = o.totalCount;
      me.pageType = 'server';
      if(me.remoteSort === undefined) {
        me.remoteSort = true;
      }
      //Not sure what is better about type of paging, sorting, filtering
      //maybe just actionType
      //me.actionType = 'server';
    }
  },
  /*
   *
   */
  loadPage: function(){
    var me = this;

    me.loadData();
  },
  /*
   * @param {Number} value
   */
  setPageSize: function(value){
    var me = this;

    me.pageSize = value;

    me.calcPages();

    if(me.pageType === 'server'){
      me.loadPage();
    }
    else {
      me.changeDataView();
    }
  }
});
/*
 * @mixin Fancy.store.mixin.Proxy
 */
Fancy.Mixin('Fancy.store.mixin.Proxy', {
  pageParam: 'page',
  startParam: 'start',
  limitParam: 'limit',
  sortParam: 'sort',
  directionParam: 'dir',
  keyParam: 'key',
  valueParam: 'value',
  filterParam: 'filter',
  autoLoad: true,
  autoSave: true,
  saveOrder: ['create', 'update', 'destroy'],
  batch: true,
  filterOperators: {
    '<': 'lt',
    '>': 'gt',
    '<=': 'lteq',
    '>=': 'gteq',
    '=': 'eq',
    '==': 'eq',
    '===': 'stricteq',
    '!=': 'noteq',
    '!==': 'notstricteq',
    '': 'like',
    '*': 'likeor',
    '|': 'or'
  },
  loadedTimes: 0,
  /*
   *
   */
  initProxy: function(){
    var me = this;

    me.proxy = me.data.proxy || {};
    var proxy = me.proxy;
    if(proxy.autoLoad !== undefined){
      me.autoLoad = proxy.autoLoad;
    }

    if(proxy.autoSave !== undefined){
      me.autoSave = proxy.autoSave;
    }

    if(proxy.batch !== undefined){
      me.batch = proxy.batch;
    }

    me.initReader();
    me.initWriter();
    if(me.proxy.type === 'rest'){
      me.initRest();
    }
    else {
      me.initServerAPI();
      me.initActionMethods();
      me.checkProxy();
    }

    if(me.autoLoad) {
      me.loadData();
    }
  },
  /*
   *
   */
  checkProxy: function(){
    var me = this,
      proxy = me.proxy;

    if(proxy.api.read === undefined){
      throw new Error('[FancyGrid Error] - in data proxy there is not url');
    }
  },
  /*
   * used only in Fancy.store.mixin.Rest
   */
  checkUrl: function(){
    var me = this,
      proxy = me.proxy;

    if(proxy.url === undefined){
      throw new Error('[FancyGrid Error] - in data proxy there is not url');
    }
  },
  /*
   *
   */
  initServerAPI: function(){
    var me = this,
      proxy = me.proxy;

    proxy.api = proxy.api || {};

    if(proxy.url){
      proxy.api.read = proxy.url;
    }

    if(proxy.api.update || proxy.api.read || proxy.api.create && proxy.api.destroy){
      //IDEA: maybe crudType
      me.proxyType = 'server';
    }
  },
  /*
   *
   */
  initActionMethods: function(){
    var me = this,
      proxy = me.proxy,
      methods = proxy.methods || {},
      method = proxy.method || 'GET';

    methods.create = methods.create || method;
    methods.read = methods.read || method;
    methods.update = methods.update || method;
    methods.destroy = methods.destroy || method;

    proxy.methods = methods;
  },
  /*
   *
   */
  loadData: function(){
    var me = this,
      proxy = me.proxy,
      params = me.params || proxy.params || {},
      headers = proxy.headers || {};

    me.fire('beforeload');
    //IDEA: sortType === 'server'
    //IDEA: remoteSort
    //IDEA: remotePaging

    if(me.pageType === 'server'){
      params[me.pageParam] = me.showPage;
      params[me.limitParam] = me.pageSize;
      params[me.startParam] = me.showPage * me.pageSize;
    }

    me.loading = true;

    Fancy.Ajax({
      url: proxy.api.read,
      method: proxy.methods.read,
      params: params,
      getJSON: true,
      headers: headers,
      success: function(o, status, request){
        me.loadedTimes++;
        me.loading = false;
        me.defineModel(o[me.readerRootProperty]);

        if(me.paging) {
          me.processPagingData(o);
        }
        else {
          me.setData(o[me.readerRootProperty]);
          me.widget.setSidesHeight();
        }
        me.fire('change');
        me.fire('load');

        me.fire('serversuccess', o, request);
      },
      error: function (request, errorTitle, errorMessage) {
        me.fire('servererror', errorTitle, errorMessage, request);
      }
    });
  },
  /*
   * @param {String} type
   * @param {String} id
   * @param {String} key
   * @param {*} value
   */
  proxyCRUD: function(type, id, key, value){
    var me = this;

    switch(type){
      case 'UPDATE':
        me.proxyServerUpdate(id, key, value);
        break;
      case 'DESTROY':
        me.proxyServerDestroy(id, key);
        break;
      case 'CREATE':
        me.proxyServerCreate(id, key);
        break;
    }
  },
  /*
   * @param {String} id
   * @param {String} key
   * @param {*} value
   */
  proxyServerUpdate: function(id, key, value){
    var me = this,
      proxy = me.proxy,
      params = me.params || proxy.params || {},
      sendJSON = me.writerType === 'json' || me.autoSave === false;

    if(!proxy.api.update){
      return;
    }

    if(sendJSON){
      if(Fancy.isArray(id) && key === undefined && value === undefined){
        params = id;
      }
      else {
        params = me.prepareWriterJSONParams(id, key, value);
      }
    }
    else{
      params.id = id;
      params[me.keyParam] = key;
      params[me.valueParam] = value;
      params.action = 'update';
    }

    me.loading = true;

    me.fire('beforeupdate', id, key, value);

    Fancy.Ajax({
      url: proxy.api.update,
      method: proxy.methods.update,
      params: params,
      sendJSON: sendJSON,
      success: function(o, status, request){
        me.loading = false;

        me.fire('update', id, key, value);
        me.fire('serversuccess', o, request);
      },
      error: function (request, errorTitle, errorMessage) {
        me.fire('servererror', errorTitle, errorMessage, request);
      }
    });
  },
  /*
   * @param {String} id
   * @param {*} data
   */
  proxyServerDestroy: function(id, data){
    var me = this,
      proxy = me.proxy,
      params = me.params || proxy.params || {},
      sendJSON = me.writerType === 'json' || me.autoSave === false;

    if(sendJSON && Fancy.isArray(id)){
      params = id;
    }
    else if(data){
      params = data;
    }
    else {
      params.id = id;
    }

    me.loading = true;

    me.fire('beforedestroy');

    Fancy.Ajax({
      url: proxy.api.destroy,
      method: proxy.methods.destroy,
      params: params,
      sendJSON: sendJSON,
      success: function(o, status, request){
        me.loading = false;

        me.fire('destroy', id, o);
        me.fire('serversuccess', o, request);
      },
      error: function (request, errorTitle, errorMessage) {
        me.fire('servererror', errorTitle, errorMessage, request);
      }
    });
  },
  /*
   * @param {String} id
   * @param {*} data
   */
  proxyServerCreate: function(id, data){
    var me = this,
      proxy = me.proxy,
      params = me.params || proxy.params || {},
      sendJSON = me.writerType === 'json' || me.autoSave === false;

    if(sendJSON && Fancy.isArray(id)){
      params = id;
    }
    else if(data){
      params = data;
    }
    else {
      params.id = id;
      if(params.id === undefined){
        delete params.id;
      }
    }

    me.loading = true;

    me.fire('beforecreate');

    Fancy.Ajax({
      url: proxy.api.create,
      method: proxy.methods.create,
      params: params,
      sendJSON: sendJSON,
      success: function(o, status, request){
        me.loading = false;

        if(Fancy.isObject(o.data) && String(id) !== String(o.data.id)){
          me.changeItemId(id, o.data.id);
        }
        else if(Fancy.isArray(o.data)){
          var i = 0,
            iL = id.length;

          for(;i<iL;i++){
            if(String(id[i].id) !== String(o.data[i].id)) {
              me.changeItemId(String(id[i].id), String(o.data[i].id));
            }
          }
        }

        me.fire('create', o.data);
        me.fire('serversuccess', o, request);
      },
      error: function (request, errorTitle, errorMessage) {
        me.fire('servererror', errorTitle, errorMessage, request);
      }
    });
  },
  /*
   *
   */
  save: function(){
    var me = this,
      removed = me.removed,
      changed = me.changed,
      inserted = me.inserted,
      i = 0,
      iL = me.saveOrder.length;

    for(;i<iL;i++){
      switch(me.saveOrder[i]){
        case 'create':
          me.saveInsertActions(inserted);
          break;
        case 'update':
          me.saveChangeActions(changed);
          break;
        case 'destroy':
          me.saveRemoveActions(removed);
          break;
      }
    }

    me.changed = {
      length: 0
    };

    me.removed = {
      length: 0
    };

    me.inserted = {
      length: 0
    };
  },
  /*
   * @param {Array} actions
   */
  saveChangeActions: function(actions){
    var me = this;

    if(!actions.length){
      return;
    }

    if(me.batch){
      var data = [];

      for(var p in actions){
        if(p === 'length'){
          continue;
        }

        var action = actions[p],
          itemData = {id: p};

        if(me.writeAllFields){
          itemData = me.getById(p).data;
        }
        else {
          for (var q in action) {
            if(q === 'length'){
              continue;
            }
            itemData[q] = action[q].value;
          }
        }

        data.push(itemData);
      }

      if(data.length === 1){
        data = data[0];
        me.proxyCRUD('UPDATE', data.id, data);
      }
      else {
        me.proxyCRUD('UPDATE', data);
      }
    }
    else {
      for(var p in actions){
        if(p === 'length'){
          continue;
        }

        var action = actions[p],
          data = {};

        if(me.writeAllFields){
          data = me.getById(p).data;
        }
        else {
          for (var q in action) {
            if(q === 'length'){
              continue;
            }

            data[q] = {id: action.id};
          }
        }

        me.proxyCRUD('UPDATE', p, data);
      }
    }
  },
  /*
   * @param {Array} actions
   */
  saveRemoveActions: function(actions){
    var me = this;

    if(actions.length === 0){
      return;
    }

    if(me.batch){
      var data = [];

      for(var p in actions){
        if(p === 'length'){
          continue;
        }

        var action = actions[p],
          itemData = {id: p};

        if(me.writeAllFields){
          itemData = me.getById(p).data;
        }
        else {
          for (var q in action) {
            if(q === 'length'){
              continue;
            }

            itemData = {
              id: action.id
            };
          }
        }

        data.push(itemData);
      }

      if(data.length === 1){
        data = data[0];
        me.proxyCRUD('DESTROY', data.id, data);
      }
      else {
        me.proxyCRUD('DESTROY', data);
      }
    }
    else{
      for(var p in actions){
        if(p === 'length'){
          continue;
        }

        var action = actions[p],
          data = {};

        if(me.writeAllFields){
          data = action;
        }
        else {
          for (var q in action) {
            if(q === 'length'){
              continue;
            }

            data[q] = action[q].value;
          }
        }

        me.proxyCRUD('DESTROY', p, data);
      }
    }
  },
  /*
   * @param {Array} actions
   */
  saveInsertActions: function(actions){
    var me = this;

    if(actions.length === 0){
      return;
    }

    if(me.batch){
      var data = [];

      for(var p in actions){
        if(p === 'length'){
          continue;
        }

        var action = actions[p],
          itemData = {id: p};

        if(me.writeAllFields){
          itemData = me.getById(p).data;
        }
        else {
          for (var q in action.data) {

            itemData[q] = action.data[q];
          }
        }

        data.push(itemData);
      }

      if(data.length === 1){
        data = data[0];
        me.proxyCRUD('CREATE', data.id, data);
      }
      else {
        me.proxyCRUD('CREATE', data);
      }
    }
    else{
      for(var p in actions){
        if(p === 'length'){
          continue;
        }

        var action = actions[p],
          data = {};

        if(me.writeAllFields){
          data = action;
        }
        else {
          for (var q in action) {
            if(q === 'length'){
              continue;
            }

            data[q] = action[q].value;
          }
        }

        me.proxyCRUD('CREATE', p, data);
      }
    }
  }
});
/*
 * @mixin Fancy.store.mixin.Rest
 */
Fancy.Mixin('Fancy.store.mixin.Rest', {
  /*
   *
   */
  initRest: function(){
    var me = this;

    me.proxyType = 'server';

    me.checkUrl();
    me.initRestServerAPI();
    me.initRestActionMethods();
  },
  /*
   *
   */
  initRestServerAPI: function(){
    var me = this,
      proxy = me.proxy,
      url = proxy.url;

    proxy.api = proxy.api || {};

    proxy.api.create = url;
    proxy.api.read = url;
    proxy.api.update = url;
    proxy.api.destroy = url;
  },
  /*
   *
   */
  initRestActionMethods: function(){
    var me = this,
      proxy = me.proxy,
      methods = proxy.methods || {};

    methods.create = methods.create || proxy.method || 'POST';
    methods.read = methods.read || proxy.method || 'GET';
    methods.update = methods.update || proxy.method || 'PUT';
    methods.destroy = methods.destroy || proxy.method || 'DELETE';

    proxy.methods = methods;
  }
});
/*
 *  @mixin Fancy.store.mixin.Reader
 */
Fancy.Mixin('Fancy.store.mixin.Reader', {
  readerType: 'json',
  readerRootProperty: 'data',
  /*
   *
   */
  initReader: function(){
    var me = this,
      proxy = me.proxy;

    if(proxy.reader){
      me.configReader(proxy.reader);
    }
  },
  /*
   * @param {String|Object} reader
   */
  configReader: function(reader){
    var me = this;

    switch(Fancy.typeOf(reader)){
      case 'string':

        switch(reader){
          case 'json':
            me.readerType = reader;
            break;
          default:
            throw new Error('[FancyGrid Error] - reader ' + reader + ' does not exist');
        }

        break;
      case 'object':

        switch(reader.type){
          case undefined:
            me.readerType = 'json';
            break;
          case 'json':
            me.readerType = reader.type;
            break;
          default:
            throw new Error('[FancyGrid Error] - reader ' + reader.type + ' does not exist');
        }

        if(reader.root){
          me.readerRootProperty = reader.root;
        }

        break;
    }
  }
});
/*
 * @mixin Fancy.store.mixin.Writer
 */
Fancy.Mixin('Fancy.store.mixin.Writer', {
  writerType: 'string',
  writeAllFields: false,
  /*
   *
   */
  initWriter: function(){
    var me = this,
      proxy = me.proxy;

    if(proxy.writer){
      me.configWriter(proxy.writer);
    }
  },
  /*
   * @param writer
   */
  configWriter: function(writer){
    var me = this;

    if(writer.allFields){
      me.writeAllFields = writer.allFields;
    }

    switch(Fancy.typeOf(writer)){
      case 'string':

        switch(writer){
          case 'json':
          case 'string':
            me.writerType = writer;
            break;
          default:
            throw new Error('[FancyGrid Error] - writer ' + writer.type + ' does not exist');
        }

        break;
      case 'object':

        switch(writer.type){
          case undefined:
            me.writerType = 'string';
            break;
          case 'json':
          case 'string':
            me.writerType = writer.type;
            break;
          default:
            throw new Error('[FancyGrid Error] - writer ' + writer + ' does not exist');
        }

        if(writer.writeFields){
          me.writeFields = true;
        }

        if(writer.root){
          me.writerRootProperty = writer.root;
        }

        break;
    }
  },
  /*
   * @param {String} id
   * @param {String} key
   * @param {*} value
   */
  prepareWriterJSONParams: function(id, key, value){
    var me = this,
      params = me.params || {},
      data = {};

    data.id = id;

    if(me.writeAllFields){
      Fancy.applyIf(data, me.getById(id).data);
    }
    else if(value === undefined && Fancy.isObject(key)){
      Fancy.applyIf(data, key);
    }
    else if(value === undefined && Fancy.isArray(key)){
      data = key;
    }
    else{
      data[key] = value;
    }

    if(me.rootProperty){
      params[me.rootProperty] = data;
    }
    else{
      return data;
    }

    return params;
  }
});
/*
 * @mixin Fancy.store.mixin.Sort
 */
Fancy.Mixin('Fancy.store.mixin.Sort', {
  multiSortLimit: 3,
  /*
   * @param {'ASC'|'DESC'} action
   * @param {String} type
   * @param {String|Number} key
   * @param {Object} options
   */
  sort: function(action, type, key, options){
    var me = this,
      fn,
      sortType;

    me.fire('beforesort', {
      key: 'key',
      action: action
    });

    if(me.multiSort && me.multiSortInited !== true){
      me.initMultiSort();
    }

    switch(type){
      case 'number':
      case 'checkbox':
      case 'progressdonut':
      case 'progressbar':
      case 'grossloss':
      case 'date':
      case 'currency':
        fn = 'sortNumber';
        sortType = 'number';
        break;
      case 'string':
      case 'combo':
      case 'text':
      case 'color':
        fn = 'sortString';
        sortType = 'string';
        break;
      default:
        throw new Error('[FancyGrid error] - does not exist sort function for type ' + type);
    }

    if(me.multiSort){
      me.addSorter(key, action.toLocaleUpperCase(), sortType);
    }

    if(me.remoteSort){
      me.serverSort(action, type, key);
      return;
    }

    options.type = type;

    me[fn](action, key, options);

    if(me.multiSort){
      var i = 0,
        iL = me.sorters.length - 1;

      for(;i<iL;i++){
        me.multiSortOrder(i);
      }
    }

    me.changeDataView();
    me.fire('sort', {
      key: 'key',
      action: action
    });
  },
  /*
   * @param {'ASC'|'DESC'} action
   * @param {String} type
   * @param {String|Number} key
   */
  serverSort: function(action, type, key){
    var me = this;

    me.params = me.params || {};

    if(me.multiSort){
      me.params['sorters'] = me.sorters;
    }
    else{
      me.params[me.sortParam] = key;
      me.params[me.directionParam] = action;
    }

    me.loadData();
  },
  /*
   * @param {'ASC'|'DESC'} action
   * @param {String} type
   * @param {String|Number} key
   */
  sortNumber: function(action, key, options){
    var me = this,
      columnOriginalValues = [],
      sortedColumnValues,
      i,
      iL;

    if(me.grouping){
      //BUG: It does not work for date

      var _columnOriginalValues = me.getColumnOriginalValuesByGroup(key, me.grouping.by, options);
      sortedColumnValues = [];
      i = 0;
      iL = _columnOriginalValues.length;

      switch (action) {
        case 'asc':
          for(;i<iL;i++){
            columnOriginalValues = columnOriginalValues.concat(_columnOriginalValues[i].values);

            sortedColumnValues = sortedColumnValues.concat(_columnOriginalValues[i].values.sort(function (a, b) {
              return a - b;
            }));
          }
          break;
        case 'desc':
          for(;i<iL;i++) {
            columnOriginalValues = columnOriginalValues.concat(_columnOriginalValues[i].values);

            sortedColumnValues = sortedColumnValues.concat(_columnOriginalValues[i].values.sort(function (a, b) {
              return b - a;
            }));
          }
          break;
      }
    }
    else {
      columnOriginalValues = me.getColumnOriginalValues(key, options);

      switch (action) {
        case 'asc':
          sortedColumnValues = Fancy.Array.copy(columnOriginalValues).sort(function (a, b) {
            return a - b;
          });
          break;
        case 'desc':
          sortedColumnValues = Fancy.Array.copy(columnOriginalValues).sort(function (a, b) {
            return b - a;
          });
          break;
      }
    }

    me.order = me.getOrder(columnOriginalValues, sortedColumnValues);
  },
  /*
   * @param {'ASC'|'DESC'} action
   * @param {String|Number} key
   */
  sortString: function(action, key){
    var me = this,
      columnOriginalValues = [],
      sortedColumnValues,
      i,
      iL;

    if(me.grouping){
      var _columnOriginalValues = me.getColumnOriginalValuesByGroup(key, me.grouping.by);
      sortedColumnValues = [];
      i = 0;
      iL = _columnOriginalValues.length;

      switch (action) {
        case 'asc':
          for(;i<iL;i++){
            columnOriginalValues = columnOriginalValues.concat(_columnOriginalValues[i].values);
            sortedColumnValues = sortedColumnValues.concat(_columnOriginalValues[i].values.sort());
          }
          break;
        case 'desc':
          for(;i<iL;i++) {
            columnOriginalValues = columnOriginalValues.concat(_columnOriginalValues[i].values);
            sortedColumnValues = sortedColumnValues.concat(_columnOriginalValues[i].values.sort().reverse());
          }
          break;
      }
    }
    else {
      columnOriginalValues = me.getColumnOriginalValues(key);

      switch (action) {
        case 'asc':
          sortedColumnValues = Fancy.Array.copy(columnOriginalValues).sort();
          break;
        case 'desc':
          sortedColumnValues = Fancy.Array.copy(columnOriginalValues).sort();
          sortedColumnValues = sortedColumnValues.reverse();
          break;
      }
    }

    me.order = me.getOrder(columnOriginalValues, sortedColumnValues);
  },
  /*
   * @param {Array} original
   * @param {Array} sorted
   * @return {Array}
   */
  getOrder: function(original, sorted){
    var mapValues = {},
      i = 0,
      iL = original.length,
      order = [],
      subMapValues;

    for(;i<iL;i++){
      var value = original[i];
      if(mapValues[value] === undefined){
        mapValues[value] = [];
      }

      mapValues[value].push(i);
    }

    i = 0;
    for(;i<iL;i++){
      value = sorted[i];
      subMapValues = mapValues[value];
      order.push(subMapValues[0]);

      if(subMapValues.length > 1){
        subMapValues.splice(0, 1);
      }
    }

    return order;
  },
  /*
   * @param {Number} value
   * @param {String} action
   */
  changeOrderIndexes: function(value, action){
    var me = this;

    if(action === undefined){
      action = '-';
    }

    if(me.order === undefined){
      return;
    }

    var i = 0,
      iL = me.order.length;

    if(action === '-') {
      for(;i<iL;i++){
        if(me.order[i] > value){
          me.order[i]--;
        }
      }
    }
    else{
      for(;i<iL;i++){
        if(me.order[i] >= value){
          me.order[i]++;
        }
      }
    }
  },
  /*
   *
   */
  initMultiSort:function(){
    var me = this;

    me.multiSortInited = true;

    if(!me.sorters){
      me.sorters = [];
    }
  },
  /*
   * @param {String} key
   * @param {'ASC'|'DESC'} dir
   * @param {String} type
   */
  addSorter: function(key, dir, type){
    var me = this,
      i = 0,
      iL = me.sorters.length;

    for(;i<iL;i++){
      if(me.sorters[i].key === key){
        me.sorters.splice(i, 1);
        break;
      }
    }

    me.sorters.push({
      key: key,
      dir: dir.toLocaleUpperCase(),
      type: type
    });

    if(me.sorters.length > me.multiSortLimit){
      //me.sorters.pop();
      me.sorters.shift();
    }
  },
  /*
   * @param {Number} i
   */
  multiSortOrder: function(i){
    var me = this,
      w = me.widget,
      s = w.store,
      sorter = me.sorters[i],
      prevKey = me.sorters[i + 1].key,
      key = sorter.key,
      j = 0,
      jL = me.getTotal(),
      value,
      prevValue,
      keyValues = [],
      keyValue,
      newOrder = [],
      order = [];

    for(;j<jL;j++){
      value = s.get(me.order[j], prevKey, true);
      keyValue = s.get(me.order[j], key, true);

      if(value === prevValue){
        keyValues[keyValues.length - 1].push(keyValue);
        newOrder[newOrder.length - 1].push(me.order[j]);
      }
      else{
        keyValues.push([keyValue]);
        newOrder.push([me.order[j]]);
      }

      prevValue = value;
    }

    j = 0;
    jL = newOrder.length;

    for(;j<jL;j++){
      if(newOrder[j].length === 1){
        order.push(newOrder[j][0]);
        continue;
      }

      var sortedSubValues;

      if(sorter.type === 'number'){
        switch(sorter.dir){
          case 'ASC':
            sortedSubValues = Fancy.Array.copy(keyValues[j]).sort(function (a, b) {
              return a - b;
            });
            break;
          case 'DESC':
            sortedSubValues = Fancy.Array.copy(keyValues[j]).sort(function (a, b) {
              return b - a;
            });
            break;
        }
      }
      else if(sorter.type === 'string'){
        switch(sorter.dir){
          case 'ASC':
            sortedSubValues = Fancy.Array.copy(keyValues[j]).sort();
            break;
          case 'DESC':
            sortedSubValues = Fancy.Array.copy(keyValues[j]).sort().reverse();
            break;
        }
      }

      var originSubOrder = newOrder[j],
        newSubOrder = [],
        _newSubOrder;

      _newSubOrder = me.getOrder(keyValues[j], sortedSubValues);

      var k = 0,
        kL = _newSubOrder.length;

      for(;k<kL;k++){
        newSubOrder.push(originSubOrder[_newSubOrder[k]]);
      }

      //order = order.concat(newOrder[j]);
      order = order.concat(newSubOrder);
    }

    me.order = order;
  }
});
/*
 * @mixin Fancy.store.mixin.Edit
 */
Fancy.Mixin('Fancy.store.mixin.Edit', {
  //TODO: too slow for big data, needs redo. Add some map.
  idSeed: 0,
  /*
   * @param {Object} o
   */
  remove: function(o){
    var me = this,
      id = o.id,
      index,
      orderIndex,
      itemData;

    switch(Fancy.typeOf(o)){
      case 'string':
      case 'number':
        id = o;
        break;
      default:
        id = o.id || o.data.id;
    }

    if(me.proxyType === 'server' && me.autoSave && me.proxy.api.destroy){
      me.proxyCRUD('DESTROY', id);
      return;
    }

    if(o.rowIndex){
      index = me.dataViewIndexes[o.rowIndex];
      orderIndex = o.rowIndex;
    }
    else{
      //index = o.$index;
      index = me.getDataIndex(id);
      orderIndex = me.getRow(id);
      //TODO: absent orderIndex, need to learn where to take it.
    }

    itemData = me.data.splice(index, 1)[0];

    if(me.paging){
      orderIndex += me.showPage * me.pageSize;
    }

    if(me.order){
      me.order.splice(orderIndex, 1);
    }

    //SLOW, needs all redo to another approach
    //Almost the same as resorting
    if(me.changeOrderIndexes){
      me.changeOrderIndexes(index);
    }

    if(me.paging){
      if(me.showPage !== 0 && me.showPage * me.pageSize === me.getTotal()){
        me.showPage--;
      }
      me.calcPages();
    }

    delete me.map[id];

    me.fire('remove', id, itemData);
    me.changeDataView();
  },
  /*
   * @param {Number} index
   */
  removeAt: function(index){
    //NOT FINISHED!!!
    var me = this;

    me.remove({
      rowIndex: index,
      id: me.getId(index)
    });
  },
  /*
   *
   */
  removeAll: function () {
    var me = this;

    me.data = [];
    me.dataView = [];
    delete me.order;

    if(me.paging){
      me.showPage = 0;
      me.calcPages();
    }

    if(me.filters){
      delete me.filters;
      delete me.filteredData;
      delete me.filterOrder;
    }
  },
  /*
   * @param {Object} o
   * @return {Fancy.Model}
   */
  add: function(o){
    var me = this;

    return me.insert(me.getTotal(), o);
  },
  /*
   * @param {Number} index
   * @param {Object} o
   * @return {Fancy.Model}
   */
  insert: function(index, o){
    var me = this;

    //Bug fix for empty data on start with grouping
    if(me.grouping && !me.bugFixGrouping){
      me.defineModel(o, true);
      me.bugFixGrouping = true;
    }

    me.addIndex = index;

    if(o.id === undefined){
      me.idSeed++;
      if(me.proxyType === 'server'){
        o.id = 'Temp-' + me.idSeed;
      }
      else {
        o.id = me.getTotal() + me.idSeed;
      }
    }

    if(me.getById(o.id)){
      me.remove(o.id);
    }

    if(me.proxyType === 'server' && me.autoSave && me.proxy.api.create){
      me.once('create', me.onCreate, me);
      me.proxyCRUD('CREATE', o);
    }
    else{
      return me.insertItem(o, index);
    }
  },
  /*
   * @param {Object} o
   * @return {Fancy.Model}
   */
  insertItem: function(o){
    var me = this,
      model = me.model,
      item = new model(o),
      index = me.addIndex;

    me.fire('beforeinsert');

    delete me.addIndex;
    item.$index = index;
    me.data.splice(index, 0, item);

    if(me.order){
      me.order.splice(index, 0, index);
      me.changeOrderIndexes(index, '+');
      me.order[index]--;
    }

    me.changeDataView();
    me.map[o.id] = item;
    me.fire('insert', item);
    return item;
  },
  /*
   * @param {Object} store
   * @param {Object} o
   */
  onCreate: function(store, o){
    return this.insertItem(o);
  }
});
/*
 * @mixin Fancy.store.mixin.Grouping
 */
Fancy.Mixin('Fancy.store.mixin.Grouping', {
  /*
   * @param {String} group
   * @param {*} value
   */
  expand: function(group, value){
    var me = this,
      data = me.data,
      i = 0,
      iL = data.length,
      dataView = [],
      dataViewMap = {},
      dataViewIndexes = {};

    if(me.filteredData){
      data = me.filteredData;
      iL = data.length;
    }

    me.expanded = me.expanded || {};
    me.expanded[value] = true;

    for(;i<iL;i++){
      var item = data[i];

      if(me.expanded[ item.data[group] ]){
        dataView.push(item);
        dataViewMap[item.id] = dataView.length - 1;
        dataViewIndexes[dataView.length - 1] = i;
      }
    }

    me.dataView = dataView;
    me.dataViewMap = dataViewMap;
    me.dataViewIndexes = dataViewIndexes;
  },
  /*
   * @param {String} group
   * @param {*} value
   */
  collapse: function(group, value){
    var me = this,
      data = me.data,
      i = 0,
      iL = data.length,
      dataView = [],
      dataViewMap = {},
      dataViewIndexes = {};

    me.expanded = me.expanded || {};
    delete me.expanded[value];

    for(;i<iL;i++){
      var item = data[i];

      if(me.expanded[ item.data[group] ]){
        dataView.push(item);
        dataViewMap[item.id] = dataView.length - 1;
        dataViewIndexes[dataView.length - 1] = i;
      }
    }

    me.dataView = dataView;
    me.dataViewMap = dataViewMap;
    me.dataViewIndexes = dataViewIndexes;
  },
  /*
   * @param {Array} groups
   * @param {String} by
   */
  changeOrderByGroups: function(groups, by){
    var me = this,
      grouped = {},
      data = [];

    Fancy.each(groups, function(group){
      grouped[group] = [];
    });

    if(Fancy.isArray(me.data)){
      Fancy.each(me.data, function(item){
        var group = item.data[by];

        grouped[group].push(item);
      });
    }

    Fancy.each(groups, function (group){
      data = data.concat(grouped[group]);
    });

    me.grouping = {
      by: by
    };

    me.data = data;
  },
  /*
   * @param {String} key
   * @param {String} group
   */
  getColumnOriginalValuesByGroup: function(key, group, options){
    var me = this,
      data = me.data,
      i = 0,
      iL = data.length,
      result = [],
      values = [],
      groupName = data[0].data[group];

    if(options && options.format && options.type === 'date'){
      for (; i < iL; i++) {
        if (data[i].data[group] === groupName) {
          values.push(Fancy.Date.parse(data[i].data[key], options.format, options.mode));
        }
        else {
          result.push({
            values: values,
            groupName: groupName
          });
          values = [];
          groupName = data[i].data[group];
          i--;
        }
      }
    }
    else {
      for (; i < iL; i++) {
        if (data[i].data[group] === groupName) {
          values.push(data[i].data[key]);
        }
        else {
          result.push({
            values: values,
            groupName: groupName
          });
          values = [];
          groupName = data[i].data[group];
          i--;
        }
      }
    }

    if(iL > 0) {
      result.push({
        values: values,
        groupName: groupName
      });
    }

    return result;
  },
  /*
   * @param {String} [dataProperty]
   * @return {Object}
   */
  initGroups: function(dataProperty){
    var me = this,
      w = me.widget,
      grouping = w.grouping,
      dataProperty = dataProperty || 'data',
      by = grouping.by;

    if(!by){
      throw new Error('[FancyGrid Error] - not set by param in grouping');
    }

    var values = me.getColumnOriginalValues(by, {
        dataProperty: dataProperty,
        groupMap: true
      }),
      _groups = {};

    Fancy.each(values, function(value){
      if(_groups[value] === undefined){
        _groups[value] = 0;
      }

      _groups[value]++;
    });

    var groups = [];

    for(var p in _groups){
      groups.push(p);
    }

    return {
      groups: groups,
      _groups: _groups
    };
  },
  /*
   *
   */
  orderDataByGroupOnStart: function(){
    var me = this,
      grouping = me.widget.grouping,
      o = me.initGroups(),
      groups = o.groups,
      groupNameUpperCase = {},
      upperGroups = [];

    Fancy.each(groups, function(group){
      var upperGroup = group.toLocaleUpperCase();

      groupNameUpperCase[upperGroup] = group;
      upperGroups.push(upperGroup);
    });

    upperGroups = upperGroups.sort();

    var i = 0,
      iL = groups.length;

    for(;i<iL;i++){
      groups[i] = groupNameUpperCase[ upperGroups[i] ];
    }

    me.changeOrderByGroups(groups, grouping.by);

    me.expanded = {};
    if(grouping.collapsed){
      me.collapsed = true;
    }
    else{
      Fancy.each(groups, function(group){
        if( !grouping.expanded || grouping.expanded[group] === undefined ){
          me.expanded[group] = true;
        }
      });
    }

    me.changeDataView({
      doNotFired: true
    });
  }
});
/*
 * @mixin Fancy.store.mixin.Filter
 */
Fancy.Mixin('Fancy.store.mixin.Filter', {
  /*
   * @param {Object} item
   * @return {Boolean}
   */
  filterCheckItem: function(item){
    var me = this,
      filters = me.filters,
      passed = true,
      wait = false;

    for(var p in filters){
      var indexFilters = filters[p],
        indexValue = item.data[p];

      if(me.smartIndexes && me.smartIndexes[p]){
        indexValue = me.smartIndexes[p](item.data);
      }
      else if(/\./.test(p)){
        var splitted = p.split('.');
        indexValue = item.data[splitted[0]][splitted[1]];
      }

	    if(indexFilters.type === 'date'){
		    indexValue = Number(Fancy.Date.parse(indexValue, indexFilters.format.read, indexFilters.format.mode));
	    }
	  
      for(var q in indexFilters){
		    switch(q){
		      case 'type':
		      case 'format':
			      continue;
		    }

        var value = indexFilters[q];

        switch(q){
          case '<':
            passed = Number(indexValue) < value;
            break;
          case '>':
            passed = Number(indexValue) > value;
            break;
          case '<=':
            passed = Number(indexValue) <= value;
            break;
          case '>=':
            passed = Number(indexValue) >= value;
            break;
          case '=':
          case '==':
            if(Fancy.isArray(value)){
              indexValue = String(indexValue);
              passed = value.indexOf(indexValue) !== -1;
            }
            else{
              passed = indexValue == value;
            }
            break;
          case '===':
            if(Fancy.isArray(value)){
              indexValue = String(indexValue);
              passed = value.indexOf(indexValue) !== -1;
            }
            else{
              passed = indexValue === value;
            }
            break;
          case '!==':
            passed = indexValue !== value;
            break;
          case '!=':
            passed = indexValue != value;
            break;
          case '':
            value = String(value).toLocaleLowerCase();
            indexValue = String(indexValue).toLocaleLowerCase();

            value = value.replace(/\(/g, 'bracketleft');
            value = value.replace(/\)/g, 'bracketright');
            indexValue = indexValue.replace(/\(/g, 'bracketleft');
            indexValue = indexValue.replace(/\)/g, 'bracketright');

            passed = new RegExp(value).test(indexValue);
            break;
          case '*':
            passed = new RegExp(String(value).toLocaleLowerCase()).test(String(indexValue).toLocaleLowerCase());
            wait = true;
            break;
          case '|':
            passed = value[String(indexValue).toLocaleLowerCase()] === true;
            break;
          default:
            throw new Error('FancyGrid Error 5: Unknown filter ' + q);
        }

        if(wait === true){
          if(passed === true){
            return true;
          }
        }
        else if(passed === false){
          return false;
        }
      }
    }

    if(wait === true && passed === false){
      return false;
    }

    return true;
  },
  /*
   *
   */
  filterData: function(){
    var me = this,
      data = me.data,
      filteredData = [],
      i = 0,
      iL = data.length,
      filterOrder = [],
      item = [];

    if(me.remoteFilter){
      me.serverFilter();
    }

    for(;i<iL;i++){
      if(me.order){
        filterOrder.push(me.order[i]);
        item = data[me.order[i]];
      }
      else {
        filterOrder.push(i);
        item = data[i];
      }

      if(me.filterCheckItem(item)){
        filteredData.push(item);
      }
    }

    me.filterOrder = filterOrder;
    me.filteredData = filteredData;

    if(me.paging){
      me.calcPages();
    }
    me.fire('filter');
  },
  /*
   *
   */
  serverFilter: function(){
    var me = this,
      value = '[',
      filters = me.filters || {};

    for(var p in filters){
      var filterItem = filters[p];
      for(var q in filterItem){
        switch(q){
          case 'type':
          case 'format':
            continue;
        }
        var operator = me.filterOperators[q];

        if(operator === 'or'){
          var values = [];

          for(var pp in filterItem[q]){
            values.push(pp);
          }

          var filterValue = values.join(', ');

          value += '{"operator":"' + operator + '","value":"' + filterValue + '","property":"' + p + '"},';
        }
        else{
          value += '{"operator":"' + operator + '","value":"' + filterItem[q] + '","property":"' + p + '"},';
        }
      }
    }

    value = value.replace(/\,$/, '');

    value += ']';

    me.params = me.params || {};

    if(value === '[]'){
      value = '';
      delete me.params[me.filterParam];
    }
    else {
      me.params[me.filterParam] = encodeURIComponent(value);
    }

    me.loadData();
  }
});
/*
 * @mixin Fancy.store.mixin.Dirty
 */
Fancy.Mixin('Fancy.store.mixin.Dirty', {
  /*
   *
   */
  initTrackDirty: function(){
    var me = this;

    me.changed = {
      length: 0
    };

    me.removed = {
      length: 0
    };

    me.inserted = {
      length: 0
    };

    me.on('remove', me.onDirtyRemove, me);
    me.on('set', me.onDirtySet, me);
    me.on('insert', me.onDirtyInsert, me);
  },
  /*
   *
   */
  onDirtySet: function(store, o){
    var me = this,
      id = o.id;

    if(o.key === '$selected'){
      return;
    }

    if(me.changed[id] === undefined){
      me.changed[id] = {
        length: 1
      };
      me.changed.length++;
    }
    else{
      me.changed[id].length++;
    }

    if(me.changed[id][o.key] === undefined){
      me.changed[id][o.key] = {
        originValue: o.oldValue
      };
    }

    me.changed[id][o.key].value = o.value;

    if(me.changed[id][o.key].value === me.changed[id][o.key].originValue){
      delete me.changed[id][o.key];
      me.changed[id].length--;
    }

    if(me.changed[id].length === 0){
      delete me.changed[id];
      me.changed.length--;
    }
  },
  /*
   *
   */
  onDirtyRemove: function(store, id, record){
    this.removed[id] = record.data;
    this.removed.length++;
  },
  /*
   *
   */
  onDirtyInsert: function(store, o){
    this.inserted[o.id] = o;
    this.inserted.length++;
  }
});
/*
 * @class Fancy.Store
 */
Fancy.define('Fancy.Store', {
  extend: Fancy.Event,
  mixins: [
    'Fancy.store.mixin.Paging',
    'Fancy.store.mixin.Proxy',
    'Fancy.store.mixin.Rest',
    'Fancy.store.mixin.Reader',
    'Fancy.store.mixin.Writer',
    'Fancy.store.mixin.Sort',
    'Fancy.store.mixin.Edit',
    'Fancy.store.mixin.Grouping',
    'Fancy.store.mixin.Filter',
    'Fancy.store.mixin.Search',
    'Fancy.store.mixin.Dirty'
  ],
  pageSize: 10,
  showPage: 0,
  pages: 0,
  dirty: false,
  /*
   * @constructor
   */
  constructor: function(){
    var me = this;

    me.Super('const', arguments);
    me.init();

    me.data = me.data || [];
    me.dataView = me.dataView || [];
    me.dataViewMap = me.dataViewMap  || {};
    me.map = {};

    me.setModel();

    if(me.data) {
      if (me.data.proxy) {
        me.initProxy();
      }
      else {
        me.setData(me.data);
      }
    }

    me.readSmartIndexes();

    if(me.widget.grouping){
      me.orderDataByGroupOnStart();
    }
  },
  /*
   *
   */
  init: function(){
    var me = this;

    me.addEvents(
      'add', 'change', 'changepages', 'set',
      //Proxy(server) CRUD-s events, maybe will be used not only for it, but now only for server CRUD-s
      'beforeupdate', 'update',
      'beforeremove',
      'remove',
      'beforedestroy', 'destroy',
      'beforecreate', 'create',
      'beforesort', 'sort',
      'beforeload', 'load',
      'filter',
      'beforeinsert', 'insert',
      'servererror', 'serversuccess'
    );
    me.initId();
    me.initPlugins();

    if(me.paging){
      me.initPaging();
    }

    if( me.initTrackDirty ) {
      me.initTrackDirty()
    }
  },
  /*
   *
   */
  setModel: function(){
    var me = this,
      model = me.model;

    if(model === undefined){
      model = Fancy.Model;
    }
    else{
      model = Fancy.ClassManager.get(me.model);
    }

    me.model = model;
    me.fields = model.prototype.fields;
    if( me.fields === undefined){
      throw new Error('needed to set fields in Model of Store');
    }
  },
  /*
   * @param {Array} data
   */
  setData: function(data){
    var me = this,
      i = 0,
      iL = data.length,
      model = me.model,
      item;

    me.data = [];
    me.dataView = [];
    me.dataViewMap = {};
    me.dataViewIndexes = {};

    if(me.collapsed) {
      for (; i < iL; i++) {
        item = new model(data[i]);
        item.$index = i;

        me.data[i] = item;
        me.map[item.id] = item;
      }
    }
    else {
      if(me.expanded){
        //??? It looks like never reacheds
        for (; i < iL; i++) {
          item = new model(data[i]);
          item.$index = i;

          me.data[i] = item;
          me.map[item.id] = item;
        }
      }
      else {
        if(me.paging ){
          for (; i < iL; i++) {
            item = new model(data[i]);
            item.$index = i;

            me.data[i] = item;
            if(i < me.pageSize){
              me.dataView[i] = item;
              me.dataViewMap[item.id] = i;
              me.dataViewIndexes[i] = i;
            }
            me.map[item.id] = item;
          }
        }
        else {
          for (; i < iL; i++) {
            item = new model(data[i]);
            item.$index = i;

            me.data[i] = item;
            me.dataView[i] = item;
            me.dataViewMap[item.id] = i;
            me.dataViewIndexes[i] = i;
            me.map[item.id] = item;
          }
        }
      }
    }
  },
  /*
   * @param {Number} rowIndex
   * @return {Fancy.Model}
   */
  getItem: function(rowIndex){
    var me = this;

    return me.dataView[rowIndex];
  },
  /*
   * @param {Number} rowIndex
   * @param {String|Number} key
   * @param {Boolean} origin
   */
  get: function(rowIndex, key, origin){
    var me = this,
      data;

    if(rowIndex === undefined){
      return me.data;
    }

    var item = me.dataView[rowIndex];
    if(!item){
      return undefined;
    }

    if(key === undefined){
      data = item.data;

      if(data.id === undefined){
        data.id = me.dataView[rowIndex].id;
      }

      return me.dataView[rowIndex].data;
    }
    else if(key === 'none'){
      return '';
    }

    if(origin){
      return me.data[rowIndex].data[key];
    }
    else {
      return me.dataView[rowIndex].data[key];
    }
  },
  /*
   * @param {Number} rowIndex
   * @return {String|Number}
   */
  getId: function(rowIndex){
    return this.dataView[rowIndex].id;
  },
  /*
   * @param {Number} id
   * @return {Fancy.Model}
   */
  getRow: function(id){
    return this.dataViewMap[id];
  },
  /*
   * @param {Number} rowIndex
   * @param {String|Number} key
   * @param {String|Number} value
   */
  set: function(rowIndex, key, value){
    var me = this,
      item = me.dataView[rowIndex],
      id = item.data.id || item.id,
      oldValue;

    if(value === undefined){
      var data = key;

      for(var p in data){
        if(p === 'id'){
          continue;
        }

        oldValue = me.get(rowIndex, p);

        me.dataView[rowIndex].data[p] = data[p];

        me.fire('set', {
          id: id,
          data: me.dataView[rowIndex].data,
          rowIndex: rowIndex,
          key: p,
          value: data[p],
          oldValue: oldValue,
          item: item
        });
      }

      me.proxyCRUD('UPDATE', id, data);

      return;
    }
    else{
      oldValue = me.get(rowIndex, key);

      if(oldValue == value){
        return;
      }
    }

    me.dataView[rowIndex].data[key] = value;

    if(me.proxyType === 'server' && me.autoSave){
      me.proxyCRUD('UPDATE', id, key, value);
    }

    me.fire('set', {
      id: id,
      data: me.dataView[rowIndex].data,
      rowIndex: rowIndex,
      key: key,
      value: value,
      oldValue: oldValue,
      item: item
    });
  },
  /*
   * @param {Number} rowIndex
   * @param {Object} data
   */
  setItemData: function(rowIndex, data){
    var me = this,
      pastData = me.get(rowIndex);

    if(me.writeAllFields && me.proxyType === 'server'){
      me.set(rowIndex, data);
    }
    else {
      for (var p in data) {
        if (pastData[p] == data[p]) {
          continue;
        }

        me.set(rowIndex, p, data[p]);
      }
    }
  },
  /*
   * @return {Number}
   */
  getLength: function(){
    return this.dataView.length;
  },
  /*
   * @return {Number}
   */
  getTotal: function(){
    var me = this;

    if(me.pageType === 'server'){
      return me.totalCount;
    }

    if(me.filteredData){
      return me.filteredData.length;
    }

    if(me.data === undefined){
      return 0;
    }
    else if(Fancy.isObject(me.data)){
      return 0;
    }

    return me.data.length;
  },
  /*
   * @param {Object} data
   * @param {Boolean} force
   */
  defineModel: function(data, force){
    var me = this,
      s = me.store;

    if(me.model && me.fields && me.fields.length !== 0 && !force){
      return;
    }

    var data = data || me.data || s.data,
      fields = me.getFieldsFromData(data),
      modelName = 'Fancy.model.'+Fancy.id();

    Fancy.define(modelName, {
      extend: Fancy.Model,
      fields: fields
    });

    me.model = modelName;
    me.fields = fields;

    me.setModel();
  },
  /*
   * @param {Object} data
   * @return {Array}
   */
  getFieldsFromData: function(data){
    var items = data.items || data;

    if( data.fields){
      return data.fields;
    }

    if( !items ){
      throw new Error('not set fields of data');
    }

    var itemZero = items[0],
      fields = [];

    if(items.length === undefined){
      itemZero = items;
    }

    for(var p in itemZero){
      fields.push(p);
    }

    return fields;
  },
  /*
   * @param {String|Number} key
   * @param {Object} options
   * @return {Array}
   */
  getColumnOriginalValues: function(key, options){
    var me = this,
      i = 0,
      values = [],
      options = options || {},
      dataProperty = options.dataProperty || 'data',
      data = me[dataProperty],
      iL = data.length;

    if(options.smartIndexFn){
      for(;i<iL;i++){
        values.push(options.smartIndexFn(data[i].data));
      }
    }
    else{
      if(options.format){
        if(options.type === 'date'){
          for (; i < iL; i++) {
            values.push(Fancy.Date.parse(data[i].data[key], options.format, options.mode));
          }
        }
        else{
          for (; i < iL; i++) {
            values.push(data[i].data[key]);
          }
        }
      }
      else {
        if(options.groupMap){
          me.groupMap = {};

          for (; i < iL; i++) {
            var item = data[i],
              value = item.data[key];

            values.push(value);
            me.groupMap[item.id] = value;
          }
        }
        else {
          for (; i < iL; i++) {
            values.push(data[i].data[key]);
          }
        }
      }
    }

    return values;
  },
  /*
   * @param {Object} [o]
   */
  changeDataView: function(o){
    var me = this,
      o = o || {},
      groupBy,
      dataView = [],
      dataViewMap = {},
      i = 0,
      iL = me.data.length,
      isFiltered = !!me.filters,
      isSearched = !!me.searches,
      data = me.data;

    if(isFiltered) {
      if (!o.stoppedFilter) {
        me.filterData();
      }
      else if (me.paging && me.pageType === 'server') {
        return;
      }

      if (!me.remoteFilter) {
        data = me.filteredData;
        iL = data.length;
      }
    }

    if(isSearched) {
      me.searchData();
      data = me.searchedData;
      iL = data.length;
    }

    me.dataViewIndexes = {};
    me.dataViewMap = {};

    if(me.paging){
      if( me.pageType === 'server' ){
        i = 0;
      }
      else {
        i = me.showPage * me.pageSize;
      }

      iL = i + me.pageSize;
    }

    var totalCount = me.getTotal();

    if(iL > me.data.length){
      iL = me.data.length;
    }

    if(isFiltered && iL > totalCount){
      iL = totalCount;
    }

    if(Fancy.isObject(me.data)){
      iL = 0;
    }

    var item;

    if(me.order){
      if(me.grouping){
        groupBy = me.grouping.by;

        for(;i<iL;i++){
          if( me.expanded[ me.data[me.order[i]].data[groupBy] ] ){
            if(isFiltered === true){
              me.dataViewIndexes[dataView.length] = me.filterOrder[i];
              item = data[ i ];
            }
            else {
              me.dataViewIndexes[dataView.length] = me.order[i];
              item = data[me.order[i]];
            }

            dataView.push( item );

            dataViewMap[item.id] = dataView.length - 1;
          }
        }
      }
      else {
        for(;i<iL;i++){
          if(isFiltered === true){
            me.dataViewIndexes[dataView.length] = me.filterOrder[i];
            item = data[ i ]
          }
          else {
            me.dataViewIndexes[dataView.length] = me.order[i];
            item = data[me.order[i]];
          }

          dataView.push( item );
          dataViewMap[item.id] = dataView.length - 1;
        }
      }
    }
    else{
      if(me.grouping){
        groupBy = me.grouping.by;

        for(;i<iL;i++){
          if( me.expanded[ me.data[i].data[groupBy] ] ){
            me.dataViewIndexes[dataView.length] = i;
            item = data[i];
            dataView.push(item);
            dataViewMap[item.id] = dataView.length - 1;
          }
        }
      }
      else {
        for(;i<iL;i++){
          me.dataViewIndexes[dataView.length] = i;
          item = data[i];
          dataView.push(data[i]);
          dataViewMap[item.id] = dataView.length - 1;
        }
      }
    }

    me.dataView = dataView;
    me.dataViewMap = dataViewMap;

    if(!o.doNotFired){
      me.fire('change');
    }
  },
  /*
   * @param {String|Number} key
   * @param {Function} fn
   * @return {Array}
   */
  getColumnData: function(key, fn){
    var me = this,
      i = 0,
      iL = me.data.length,
      _data = [];

    if(fn){
      for (; i < iL; i++) {
        _data.push(fn(me.data[i].data));
      }
    }
    else {
      for (; i < iL; i++) {
        _data.push(me.data[i].data[key]);
      }
    }

    return _data;
  },
  /*
   * @return {Array}
   */
  getData: function(){
    var me = this,
      i = 0,
      iL = me.data.length,
      _data = [];

    for(;i<iL;i++){
      _data.push(me.data[i].data);
    }

    return _data;
  },
  /*
   * @return {Array}
   */
  getDataView: function(){
    var me = this,
      i = 0,
      iL = me.dataView.length,
      _data = [];

    for(;i<iL;i++){
      _data.push(me.dataView[i].data);
    }

    return _data;
  },
  /*
   * @param {String} id
   * @return {Fancy.Model}
   */
  getById: function(id){
    var me = this;

    return me.map[id];
  },
  /*
   * @param {String} id
   * @param {String} newId
   */
  changeItemId: function(id, newId){
    var me = this,
      item = me.getById(id);

    if(!item){
      return false;
    }

    item.id = newId;
    if(item.data.id !== undefined){
      item.data.id = newId;
    }

    delete  me.map[id];
    me.map[newId] = item;
    me.fire('changeitemid', id, newId);
  },
  /*
   * @param {String|Number} key
   * @param {*} value
   * @return {Array}
   */
  find: function(key, value){
    var me = this,
      dataView = me.dataView,
      i = 0,
      iL = dataView.length,
      item,
      founded = [];

    for(;i<iL;i++){
      item = dataView[i];

      if(item.data[key] === value){
        founded.push(i);
      }
    }

    return founded;
  },
  /*
   * @param {String} key
   * @param {*} value
   * @return {Array}
   */
  findItem: function(key, value){
    var me = this,
      data = me.data,
      i = 0,
      iL = data.length,
      item,
      founded = [];

    for(;i<iL;i++){
      item = data[i];

      if(item.data[key] === value){
        founded.push(item);
      }
    }

    return founded;
  },
  /*
   * @param {String} id
   * @return {Array}
   */
  getDataIndex: function(id){
    var me = this,
      data = me.data,
      i = 0,
      iL = data.length,
      item,
      founded;

    for(;i<iL;i++){
      item = data[i];

      if(item.data['id'] === id){
        founded = i;
      }
    }

    return founded;
  },
  /*
   * @param {Function} fn
   * @param {Object} scope
   */
  each: function(fn, scope){
    var me = this,
      dataView = me.dataView,
      i = 0,
      iL = dataView.length;

    if(scope){
      for(;i<iL;i++){
        fn.apply(this, [dataView[i]]);
      }
    }
    else{
      for(;i<iL;i++){
        fn(dataView[i]);
      }
    }
  },
  /*
   *
   */
  readSmartIndexes: function(){
    var me = this,
      w = me.widget,
      numOfSmartIndexes = 0,
      smartIndexes = {};

    Fancy.each(w.columns, function(column){
      if(column.smartIndexFn){
        smartIndexes[column.index] = column.smartIndexFn;
        numOfSmartIndexes++;
      }
    });

    if(numOfSmartIndexes){
      me.smartIndexes = smartIndexes;
    }
  }
});
Fancy.$ = window.$ || window.jQuery;
Fancy.nojQuery = Fancy.$ === undefined;

/*
 * @param {String|Number} id
 * @return {Fancy.Element}
 */
Fancy.get = function(id){
  var type = Fancy.typeOf(id);

  switch(type){
    case 'string':
      return new Fancy.Element(Fancy.$('#'+id)[0]);
      break;
    case 'array':
      return new Fancy.Elements(id);
      break;
    default:
      return new Fancy.Element(id);
      break;
  }
};

/*
 * @class Fancy.Element
 */
Fancy.Element = function(dom){
  var me = this;

  me.dom = dom;
  me.$dom = Fancy.$(dom);
  me.length = 1;
};

Fancy.Element.prototype = {
  last: function () {
    return Fancy.get(this.$dom);
  },
  /*
   * @param {String} selector
   * @return {Fancy.Element}
   */
  closest: function(selector){
    return Fancy.get(this.$dom.closest(selector)[0]);
  },
  /*
   *
   */
  destroy: function(){
    this.$dom.remove();
  },
  /*
   *
   */
  remove: function(){
    this.$dom.remove();
  },
  //Not Used
  /*
   *
   */
  prev: function(){
    return Fancy.get(this.$dom.prev()[0]);
  },
  /*
   * @return {Fancy.Element}
   */
  lastChild: function(){
    var childs = this.$dom.children();

    return Fancy.get(childs[childs.length - 1]);
  },
  /*
   * @return {Fancy.Element}
   */
  firstChild: function(){
    return Fancy.get(this.$dom.children()[0]);
  },
  /*
   * @param {String} eventName
   * @param {Function} fn
   * @param {Object} scope
   * @param {String} delegate
   */
  on: function(eventName, fn, scope, delegate) {
    var me = this;

    if(scope){
      fn = Fancy.$.proxy(fn, scope);
    }

    if(delegate){
      me.$dom.on(eventName, delegate, fn);
    }
    else{
      me.$dom.on(eventName, fn);
    }

    //bad bug fixes
    switch(eventName){
      case 'mouseenter':
        if(me.onTouchEnterEvent){
          me.onTouchEnterEvent(eventName, fn, scope, delegate);
        }
        break;
      case 'mouseleave':
        if(me.onTouchLeaveEvent){
          me.onTouchLeaveEvent(eventName, fn, scope, delegate);
        }
        break;
      case 'mousemove':
        if(me.onTouchMove){
          me.onTouchMove('touchmove', fn);
        }
        break;
    }
  },
  /*
   * @param {String} eventName
   * @param {Function} fn
   * @param {Object} scope
   * @param {String} delegate
   */
  once: function(eventName, fn, scope, delegate) {
    var me = this;

    if (scope) {
      fn = Fancy.$.proxy(fn, scope);
    }

    if(delegate){
      me.$dom.one(eventName, delegate, fn);
    }
    else{
      me.$dom.one(eventName, fn);
    }
  },
  /*
   * @param {String} name
   * @return {String}
   */
  prop: function(name){
    return this.$dom.prop(name);
  },
  /*
   * @param {String} eventName
   * @param {Function} fn
   * @param {Object} scope
   * @param {String} delegate
   */
  un: function(eventName, fn, scope, delegate) {
    var me = this;

    if (scope) {
      fn = Fancy.$.proxy(fn, scope);
    }

    if(delegate){
      me.$dom.off(eventName, delegate, fn);
    }
    else{
      me.$dom.off(eventName, fn);
    }
  },
  /*
   *
   */
  show: function(){
    this.$dom.show();
  },
  /*
   *
   */
  hide: function(){
    this.$dom.hide();
  },
  /*
   * @param {String} oldCls
   * @param {String} newCls
   */
  replaceClass: function(oldCls, newCls){
    this.$dom.removeClass(oldCls);
    this.$dom.addClass(newCls);
  },
  /*
   * @param {String} tag
   * @return {Fancy.Element}
   */
  getByTag: function(tag){
    return Fancy.get(this.$dom.find(tag)[0]);
  },
  getByClass: function(cls){
    return this.$dom.find('.'+cls)[0];
  },
  /*
   * @param {String} cls
   */
  addClass: function(cls){
    this.addCls.apply(this, arguments);
  },
  /*
   * @param {String} cls
   */
  addCls: function(cls){
    this.$dom.addClass(cls);

    if(arguments.length > 1){
      var i = 1,
        iL = arguments.length;

      for (;i<iL;i++){
        this.addClass(arguments[i]);
      }
    }
  },
  /*
   * @param {String} cls
   */
  removeClass: function(cls){
    this.$dom.removeClass(cls);
  },
  /*
   * @param {String} cls
   */
  removeCls: function(cls){
    this.$dom.removeClass(cls);
  },
  /*
   * @param {String} cls
   * @return {Boolean}
   */
  hasClass: function(cls){
    return this.$dom.hasClass(cls);
  },
  /*
   * @param {String} cls
   * @return {Boolean}
   */
  hasCls: function(cls){
    return this.$dom.hasClass(cls);
  },
  /*
   * @param {String} cls
   */
  toggleClass: function(cls){
    this.$dom.toggleClass(cls);
  },
  /*
   * @param {String} cls
   */
  toggleCls: function(cls){
    this.$dom.toggleClass(cls);
  },
  /*
   * @param {String} selector
   * @return {Array}
   */
  select: function(selector){
    var me = this,
      founded = me.$dom.find(selector);

    if(founded.length === 1){
      return Fancy.get(founded[0]);
    }
    else if(founded.length > 1){
      return Fancy.get(founded);
    }
    else if(founded.length === 0){
      return {
        length: 0,
        dom: undefined,
        addClass: function(){},
        addCls: function(){},
        removeClass: function(){},
        removeCls: function(){},
        destroy: function(){},
        remove: function(){},
        css: function(){},
        each: function(){},
        last: function(){},
        attr: function () {}
      };
    }

    return founded;
  },
  /*
   * @param {*} o1
   * @param {String|Number} o2
   * @return {String|Number}
   */
  css: function(o1, o2){
    if( o2 === undefined ){
      return this.$dom.css(o1);
    }
    return this.$dom.css(o1, o2);
  },
  /*
   * @param {*} attr
   * @param {String|Number} o2
   * @return {String|Number}
   */
  attr: function(o1, o2){
    if( o2 === undefined ){
      return this.$dom.attr(o1);
    }
    return this.$dom.attr(o1, o2);
  },
  /*
   * @param {String} html
   * @return {Fancy.Element}
   */
  append: function(html){
    return Fancy.get(this.$dom.append(html)[0]);
  },
  after: function(html){
    return Fancy.get(this.$dom.after(html)[0]);
  },
  next: function(){
    return Fancy.get(this.$dom.next()[0]);
  },
  /*
   *
   */
  insertAfter: function(html){
    return Fancy.get(this.$dom.insertAfter(html)[0]);
  },
  /*
   * @param {String} html
   * @return {Fancy.Element}
   */
  before: function(html){
    return Fancy.get(this.$dom.before(html)[0]);
  },
  /*
   * @param {String|Number} value
   * @return {Number}
   */
  height: function(value){
    if(value){
      this.$dom.height(value);
      return this;
    }

    return this.$dom.height();
  },
  /*
   * @param {String|Number} value
   * @return {Number}
   */
  width: function(value){
    if(value){
      this.$dom.width(value);
      return this;
    }

    return this.$dom.width();
  },
  /*
   * @param {String} selector
   * @return {Fancy.Element}
   */
  parent: function(selector){
    return Fancy.get(this.$dom.parent(selector)[0]);
  },
  /*
   * @param {String} html
   */
  update: function(html){
    this.dom.innerHTML = html;
  },
  /*
   * @param {Function} overFn
   * @param {Function} outFn
   */
  hover: function(overFn, outFn){
    if(overFn){
      this.$dom.on('mouseenter', overFn);
    }

    if(overFn){
      this.$dom.on('mouseleave', outFn);
    }
  },
  /*
   * @return {Object}
   */
  position: function(){
    return this.$dom.position();
  },
  /*
   * @return {Object}
   */
  offset: function(){
    return this.$dom.offset();
  },
  /*
   *
   */
  focus: function(){
    this.$dom.focus();
  },
  /*
   *
   */
  blur: function(){
    this.$dom.blur();
  },
  /*
   * @param {HTMLElement} child
   * @return {Boolean}
   */
  within: function(child){
    var me = this,
      childId,
      isWithin = true,
      removeId = false;

    child = Fancy.get(child);
    childId = child.attr('id');

    if(childId === undefined || childId === ''){
      childId = Fancy.id();
      removeId = true;
    }

    child.attr('id', childId);

    if( me.select('#' + childId).length === 0 ){
      isWithin = false;
    }

    if(me.dom.id === child.dom.id){
      isWithin = true;
    }

    if(removeId){
      me.removeAttr(childId);
    }

    return isWithin;
  },
  /*
   * @param {String} attr
   */
  removeAttr: function(attr){
    this.$dom.removeAttr(attr);
  },
  /*
   * @return {Fancy.Element}
   */
  item: function(){
    return this;
  },
  /*
   * @param {String} style
   * @param {Number} speed
   * @param {String} easing
   * @param {Function} callback
   */
  animate: function(style,speed,easing,callback){
    this.$dom.animate(style,speed,easing,callback);
  },
  /*
   * @return {Number}
   */
  index: function(){
    return this.$dom.index();
  },
  onTouchEnterEvent: function(eventName, fn, scope, delegate){
    var me = this,
      docEl = Fancy.get(document.body);

    var wrappedFn = function(e, target){
      var tempId = Fancy.id(),
        tempAttr = 'fancy-tempt-attr';

      me.attr(tempAttr, tempId);

      var touchXY = e.originalEvent.targetTouches[0],
        xy = [touchXY.pageX, touchXY.pageY],
        targetEl = Fancy.get( document.elementFromPoint(xy[0] - document.body.scrollLeft, xy[1] - document.body.scrollTop) ),
        isWithin = false,
        maxDepth = 10,
        parentEl = targetEl;

      while(maxDepth > 0){
        if( !parentEl.dom ){
          break;
        }

        if( parentEl.attr(tempAttr) === tempId ){
          isWithin = true;
          break;
        }
        parentEl = parentEl.parent();
        maxDepth--;
      }

      if( isWithin && !me.touchIn && !delegate){
        e.pageX = touchXY.pageX;
        e.pageY = touchXY.pageY;
        fn(e, target);
        me.touchIn = true;
      }

      if(isWithin && delegate){
        maxDepth = 10;
        parentEl = targetEl;
        var found = false,
          before = targetEl,
          arr = [],
          i = 0;

        while(maxDepth > 0){
          if(!parentEl.dom){
            break;
          }

          var delegates = parentEl.select(delegate);
          if(delegates.length !== 0){
            found = true;
            //var delegateTarget = arr[i - delegate.match(/\./g).length];
            var delegateTarget = me.getDelegateTarget(delegate, delegates, arr, i);

            if(delegateTarget){
              e.currentTarget = delegateTarget;
              e.delegateTarget = delegateTarget;
              e.pageX = touchXY.pageX;
              e.pageY = touchXY.pageY;
              me.touchIn = true;
              me.touchInDelegate = me.touchInDelegate || {};
              if(me.touchInDelegate[delegate] === undefined){
                me.touchInDelegate[delegate] = delegateTarget;
              }
              else if(me.touchInDelegate[delegate] !== delegateTarget){
                me.touchInDelegate[delegate] = [me.touchInDelegate[delegate], delegateTarget];
              }


              fn.apply(scope, [e, delegateTarget]);
            }
            break;
          }

          if(parentEl.attr(tempAttr) === tempId){
            break;
          }

          arr.push(parentEl.dom);
          before = parentEl;
          parentEl = parentEl.parent();
          maxDepth--;
          i++;
        }
      }

      me.removeAttr(tempAttr);
    };

    docEl.on('touchmove', wrappedFn);
  },
  onTouchLeaveEvent: function(eventName, fn, scope, delegate){
    var me = this,
      docEl = Fancy.get(document.body),
      arr = [];

    var wrappedFn = function(e, target){
      var tempId = Fancy.id(),
        tempAttr = 'fancy-tempt-attr';

      me.attr(tempAttr, tempId);

      if(me.touchIn !== true){
        me.removeAttr(tempAttr);
        return;
      }

      var touchXY = e.originalEvent.targetTouches[0],
        xy = [touchXY.pageX, touchXY.pageY],
        targetEl = Fancy.get( document.elementFromPoint(xy[0] - document.body.scrollLeft, xy[1] - document.body.scrollTop) );

      if(!delegate){
        var isWithin = false,
          maxDepth = 10,
          parentEl = targetEl;

        while(maxDepth > 0){
          if( !parentEl.dom ){
            break;
          }

          if( parentEl.attr(tempAttr) === tempId ){
            isWithin = true;
            break;
          }
          parentEl = parentEl.parent();
          maxDepth--;
        }

        if(isWithin === false){
          e.pageX = touchXY.pageX;
          e.pageY = touchXY.pageY;

          me.touchIn = false;
          fn(e, target);
          me.removeAttr(tempAttr);
          return;
        }
      }

      if(arr.length > 30){
        arr = arr.slice(arr.length - 5, arr.length - 1);
      }

      arr.push(targetEl.dom);

      if(delegate && me.touchInDelegate[delegate]){
        var delegateTarget,
          delegateTempId = Fancy.id();

        if(Fancy.isArray(me.touchInDelegate[delegate])){
          delegateTarget = Fancy.get(me.touchInDelegate[delegate][0]);
        }
        else{
          delegateTarget = Fancy.get(me.touchInDelegate[delegate]);
        }

        delegateTarget.attr(tempAttr, delegateTempId);

        maxDepth = 10;
        var found = false;
        parentEl = targetEl;

        while(maxDepth > 0){
          if( !parentEl.dom ){
            break;
          }

          if( parentEl.attr(tempAttr) === delegateTempId ){
            found = true;
            break;
          }

          parentEl = parentEl.parent();
          maxDepth--;
        }

        delegateTarget.removeAttr(tempAttr);

        if(!found){
          delete me.touchInDelegate[delegate];
          me.touchIn = false;

          e.currentTarget = delegateTarget.dom;
          e.delegateTarget = delegateTarget.dom;
          e.pageX = touchXY.pageX;
          e.pageY = touchXY.pageY;

          fn(e, delegateTarget.dom);
        }
      }

      me.removeAttr(tempAttr);
    };

    docEl.on('touchmove', wrappedFn);
  },
  getDelegateTarget: function(delegate, delegates, arr, _i){
    var fastGetDelegate = arr[_i - delegate.match(/\./g).length],
      i = 0,
      iL = delegates.length;

    for(;i<iL;i++){
      if(delegates.item(i).dom === fastGetDelegate){
        return fastGetDelegate;
      }
    }

    return false;
  },
  onTouchMove: function(eventName, fn, scope){
    var me = this,
      docEl = Fancy.get(document.body);

    var wrappedFn = function(e, target){
      var tempId = Fancy.id(),
        tempAttr = 'fancy-tempt-attr';

      me.attr(tempAttr, tempId);

      var touchXY = e.originalEvent.targetTouches[0],
        xy = [touchXY.pageX, touchXY.pageY],
        isWithin = false,
        maxDepth = 10,
        targetEl = Fancy.get( document.elementFromPoint(xy[0] - document.body.scrollLeft, xy[1] - document.body.scrollTop) ),
        parentEl = targetEl;

      while(maxDepth > 0){
        if( !parentEl.dom ){
          break;
        }

        if( parentEl.attr(tempAttr) === tempId ){
          isWithin = true;
          break;
        }
        parentEl = parentEl.parent();
        maxDepth--;
      }

      me.removeAttr(tempAttr);

      if(!isWithin){
        return;
      }

      e.pageX = touchXY.pageX;
      e.pageY = touchXY.pageY;

      fn(e, target);
    };

    docEl.on('touchmove', wrappedFn);
  },
  each: function (fn) {
    fn(this, 0);
  }
};

/*
 * @class Fancy.Elements
 * @constructor
 * @param {HTMLElement|HTMLElements} dom
 */
Fancy.Elements = function(dom){
  var me = this;

  me.dom = dom;
  me.$dom = dom;
  me.length = dom.length;
};

Fancy.Elements.prototype = {
  attr: function(o1, o2){
    var me = this,
      dom = me.$dom;

    if(me.length > 1){
      dom = me.$dom[0]
    }

    if( o2 === undefined ){
      return dom.attr(o1);
    }

    return dom.attr(o1, o2);
  },
  /*
   * @param {String} cls
   */
  addClass: function(cls){
    this.addCls.apply(this, arguments);
  },
  /*
   * @param {String} cls
   */
  addCls: function(cls){
    var me = this,
      i = 0,
      iL = me.length;

    for(;i<iL;i++){
      Fancy.get(me.$dom[i]).addClass(cls);
    }

    if(arguments.length > 1){
      i = 1;
      iL = arguments.length;

      for(;i<iL;i++){
        me.addClass(arguments[i]);
      }
    }
  },
  /*
   * @param {String} cls
   */
  removeClass: function(cls){
    this.removeCls.apply(this, arguments);
  },
  /*
   * @param {String} cls
   */
  removeCls: function(cls){
    var me = this,
      i = 0,
      iL = me.length;

    for(;i<iL;i++){
      Fancy.get(me.$dom[i]).removeCls(cls);
    }
  },
  /*
   * @param {Function} fn
   */
  hover: function(fn){
    this.$dom.on('mouseenter', fn);
  },
  /*
   *
   */
  on: Fancy.Element.prototype.on,
  /*
   *
   */
  once: Fancy.Element.prototype.once,
  /*
   * @param {Number} index
   * @return {Fancy.Element}
   */
  item: function(index){
    return Fancy.get(this.$dom[index]);
  },
  /*
   * @param {*} o1
   * @param {String|Number} o2
   * @return {String|Number}
   */
  css: function(o1, o2){
    var me = this,
      i = 0,
      iL = me.length;

    for(;i<iL;i++){
      Fancy.get(me.$dom[i]).css(o1, o2);
    }
  },
  /*
   * @param {String} cls
   */
  toggleClass: function(cls){
    var me = this,
      i = 0,
      iL = me.length;

    for(;i<iL;i++){
      Fancy.get(me.$dom[i]).toggleClass(cls);
    }
  },
  /*
   * @param {String} cls
   */
  toggleCls: function(cls){
    var me = this,
      i = 0,
      iL = me.length;

    for(;i<iL;i++){
      Fancy.get(me.$dom[i]).toggleClass(cls);
    }
  },
  /*
   *
   */
  destroy: function(){
    var me = this,
      i = 0,
      iL = me.length;

    for(;i<iL;i++){
      Fancy.get(me.$dom[i]).destroy();
    }
  },
  /*
   *
   */
  remove: function(){
    this.destroy();
  },
  /*
   *
   */
  hide: function(){
    var me = this,
      i = 0,
      iL = me.length;

    for(;i<iL;i++){
      Fancy.get(me.$dom[i]).hide();
    }
  },
  /*
   *
   */
  show: function(){
    var me = this,
      i = 0,
      iL = me.length;

    for(;i<iL;i++){
      Fancy.get(me.$dom[i]).show();
    }
  },
  /*
   * @return {Number}
   */
  index: function(){
    return this.$dom[0].index();
  },
  /*
   * @param {Function} fn
   */
  each: function(fn){
    var me = this,
      i = 0,
      iL = me.length,
      el;

    for(;i<iL;i++){
      el = new Fancy.Element(me.$dom[i]);

      fn(el, i);
    }
  },
  last: function(){
    var me = this;

    return new Fancy.Element(me.$dom[me.length - 1]);
  }
};

/*
 * @param {String} selector
 */
Fancy.select = function(selector){
  return Fancy.get(document.body).select(selector);
};

/*
  Fancy.onReady
*/

/*
 * @param {Function} fn
 */
Fancy.onReady = function(fn){
  $(document).ready(fn);
};

/**
 * @example:
 * Fancy.Ajax({
 *   url: 'users.json',
 *   success: function(){
 *     console.log(arguments);
 *   }
 * });
 */

/*
 * @param {Object} o
 */
Fancy.Ajax = function(o){
  var _o = {};

  if( o.url ){
    _o.url = o.url;
  }

  if( o.success ){
    _o.success = o.success;
  }

  if( o.error ){
    _o.error = o.error;
  }

  if( o.method ){
    //_o.type = o.type;
    _o.type = o.method;
  }

  if( o.params ){
    _o.data = o.params;
  }

  if(o.sendJSON){
    _o.dataType = 'json';
    _o.contentType = "application/json; charset=utf-8";
    _o.data = JSON.stringify(_o.data);
  }

  if(o.getJSON){
    _o.dataType = 'json';
    _o.contentType = "application/json; charset=utf-8";
  }

  if(o.headers){
    _o.headers = o.headers;
  }

  Fancy.$.ajax(_o);
};
if( Fancy.nojQuery ){

  Fancy.$ = (function(){
    var undefined, key, $, classList, emptyArray = [], concat = emptyArray.concat, filter = emptyArray.filter, slice = emptyArray.slice,
      document = window.document,
      elementDisplay = {}, classCache = {},
      cssNumber = {
        'column-count': 1,
        'columns': 1,
        'font-weight': 1,
        'line-height': 1,
        'opacity': 1,
        'z-index': 1,
        'zoom': 1
      },
      fragmentRE = /^\s*<(\w+|!)[^>]*>/,
      singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
      tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
      rootNodeRE = /^(?:body|html)$/i,
      capitalRE = /([A-Z])/g,

    // special attributes that should be get/set via method calls
      methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],

      adjacencyOperators = ['after', 'prepend', 'before', 'append'],
      table = document.createElement('table'),
      tableRow = document.createElement('tr'),
      containers = {
        'tr': document.createElement('tbody'),
        'tbody': table, 'thead': table, 'tfoot': table,
        'td': tableRow, 'th': tableRow,
        '*': document.createElement('div')
      },
      readyRE = /complete|loaded|interactive/,
      simpleSelectorRE = /^[\w-]*$/,
      class2type = {},
      toString = class2type.toString,
      zepto = {},
      camelize, uniq,
      tempParent = document.createElement('div'),
      propMap = {
        'tabindex': 'tabIndex',
        'readonly': 'readOnly',
        'for': 'htmlFor',
        'class': 'className',
        'maxlength': 'maxLength',
        'cellspacing': 'cellSpacing',
        'cellpadding': 'cellPadding',
        'rowspan': 'rowSpan',
        'colspan': 'colSpan',
        'usemap': 'useMap',
        'frameborder': 'frameBorder',
        'contenteditable': 'contentEditable'
      },
      isArray = Array.isArray ||
        function (object) {
          return object instanceof Array
        };

    zepto.matches = function (element, selector) {
      if (!selector || !element || element.nodeType !== 1) return false
      var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||
        element.oMatchesSelector || element.matchesSelector
      if (matchesSelector) return matchesSelector.call(element, selector)
      // fall back to performing a selector:
      var match, parent = element.parentNode, temp = !parent
      if (temp) (parent = tempParent).appendChild(element)
      match = ~zepto.qsa(parent, selector).indexOf(element)
      temp && tempParent.removeChild(element)
      return match
    };

    function type(obj) {
      return obj == null ? String(obj) :
      class2type[toString.call(obj)] || "object"
    }

    function isFunction(value) {
      return type(value) == "function"
    }

    function isWindow(obj) {
      return obj != null && obj == obj.window
    }

    function isDocument(obj) {
      return obj != null && obj.nodeType == obj.DOCUMENT_NODE
    }

    function isObject(obj) {
      return type(obj) == "object"
    }

    function isPlainObject(obj) {
      return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
    }

    function likeArray(obj) {
      return typeof obj.length == 'number'
    }

    function compact(array) {
      return filter.call(array, function (item) {
        return item != null
      })
    }

    function flatten(array) {
      return array.length > 0 ? $.fn.concat.apply([], array) : array
    }

    camelize = function (str) {
      return str.replace(/-+(.)?/g, function (match, chr) {
        return chr ? chr.toUpperCase() : ''
      })
    };

    function dasherize(str) {
      return str.replace(/::/g, '/')
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
        .replace(/([a-z\d])([A-Z])/g, '$1_$2')
        .replace(/_/g, '-')
        .toLowerCase()
    }

    uniq = function (array) {
      return filter.call(array, function (item, idx) {
        return array.indexOf(item) == idx
      })
    };

    function classRE(name) {
      return name in classCache ?
        classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
    }

    function maybeAddPx(name, value) {
      return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
    }

    function defaultDisplay(nodeName) {
      var element, display
      if (!elementDisplay[nodeName]) {
        element = document.createElement(nodeName)
        document.body.appendChild(element)
        display = getComputedStyle(element, '').getPropertyValue("display")
        element.parentNode.removeChild(element)
        display == "none" && (display = "block")
        elementDisplay[nodeName] = display
      }
      return elementDisplay[nodeName]
    }

    function children(element) {
      return 'children' in element ?
        slice.call(element.children) :
        $.map(element.childNodes, function (node) {
          if (node.nodeType == 1) return node
        })
    }

    function Z(dom, selector) {
      var i, len = dom ? dom.length : 0
      for (i = 0; i < len; i++) this[i] = dom[i]
      this.length = len
      this.selector = selector || ''
    }

    // `$.zepto.fragment` takes a html string and an optional tag name
    // to generate DOM nodes from the given html string.
    // The generated DOM nodes are returned as an array.
    // This function can be overridden in plugins for example to make
    // it compatible with browsers that don't support the DOM fully.
    zepto.fragment = function (html, name, properties) {
      var dom, nodes, container

      // A special case optimization for a single tag
      if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1))

      if (!dom) {
        if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>")
        if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
        if (!(name in containers)) name = '*'

        container = containers[name]
        container.innerHTML = '' + html
        dom = $.each(slice.call(container.childNodes), function () {
          container.removeChild(this)
        })
      }

      if (isPlainObject(properties)) {
        nodes = $(dom)
        $.each(properties, function (key, value) {
          if (methodAttributes.indexOf(key) > -1) nodes[key](value)
          else nodes.attr(key, value)
        })
      }

      return dom
    };

    // `$.zepto.Z` swaps out the prototype of the given `dom` array
    // of nodes with `$.fn` and thus supplying all the Zepto functions
    // to the array. This method can be overridden in plugins.
    zepto.Z = function (dom, selector) {
      return new Z(dom, selector)
    };

    // `$.zepto.isZ` should return `true` if the given object is a Zepto
    // collection. This method can be overridden in plugins.
    zepto.isZ = function (object) {
      return object instanceof zepto.Z
    };

    // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
    // takes a CSS selector and an optional context (and handles various
    // special cases).
    // This method can be overridden in plugins.
    zepto.init = function (selector, context) {
      var dom;
      // If nothing given, return an empty Zepto collection
      if (!selector) return zepto.Z()
      // Optimize for string selectors
      else if (typeof selector == 'string') {
        selector = selector.trim()
        // If it's a html fragment, create nodes from it
        // Note: In both Chrome 21 and Firefox 15, DOM error 12
        // is thrown if the fragment doesn't begin with <
        if (selector[0] == '<' && fragmentRE.test(selector))
          dom = zepto.fragment(selector, RegExp.$1, context), selector = null
        // If there's a context, create a collection on that context first, and select
        // nodes from there
        else if (context !== undefined) return $(context).find(selector)
        // If it's a CSS selector, use it to select nodes.
        else dom = zepto.qsa(document, selector)
      }
      // If a function is given, call it when the DOM is ready
      else if (isFunction(selector)) return $(document).ready(selector)
      // If a Zepto collection is given, just return it
      else if (zepto.isZ(selector)) return selector
      else {
        // normalize array if an array of nodes is given
        if (isArray(selector)) dom = compact(selector)
        // Wrap DOM nodes.
        else if (isObject(selector))
          dom = [selector], selector = null
        // If it's a html fragment, create nodes from it
        else if (fragmentRE.test(selector))
          dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null
        // If there's a context, create a collection on that context first, and select
        // nodes from there
        else if (context !== undefined) return $(context).find(selector)
        // And last but no least, if it's a CSS selector, use it to select nodes.
        else dom = zepto.qsa(document, selector)
      }
      // create a new Zepto collection from the nodes found
      return zepto.Z(dom, selector)
    }

    // `$` will be the base `Zepto` object. When calling this
    // function just call `$.zepto.init, which makes the implementation
    // details of selecting nodes and creating Zepto collections
    // patchable in plugins.
    $ = function(selector, context){
      return zepto.init(selector, context)
    };

    function extend(target, source, deep) {
      for (key in source)
        if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
          if (isPlainObject(source[key]) && !isPlainObject(target[key]))
            target[key] = {}
          if (isArray(source[key]) && !isArray(target[key]))
            target[key] = []
          extend(target[key], source[key], deep)
        }
        else if (source[key] !== undefined) target[key] = source[key]
    }

    // Copy all but undefined properties from one or more
    // objects to the `target` object.
    $.extend = function (target) {
      var deep, args = slice.call(arguments, 1)
      if (typeof target == 'boolean') {
        deep = target
        target = args.shift()
      }
      args.forEach(function (arg) {
        extend(target, arg, deep)
      })
      return target
    };

    // `$.zepto.qsa` is Zepto's CSS selector implementation which
    // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
    // This method can be overridden in plugins.
    zepto.qsa = function (element, selector) {
      var found,
        maybeID = selector[0] == '#',
        maybeClass = !maybeID && selector[0] == '.',
        nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, // Ensure that a 1 char tag name still gets checked
        isSimple = simpleSelectorRE.test(nameOnly)
      return (element.getElementById && isSimple && maybeID) ? // Safari DocumentFragment doesn't have getElementById
        ( (found = element.getElementById(nameOnly)) ? [found] : [] ) :
        (element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11) ? [] :
          slice.call(
            isSimple && !maybeID && element.getElementsByClassName ? // DocumentFragment doesn't have getElementsByClassName/TagName
              maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
                element.getElementsByTagName(selector) : // Or a tag
              element.querySelectorAll(selector) // Or it's not simple, and we need to query all
          )
    };

    function filtered(nodes, selector) {
      return selector == null ? $(nodes) : $(nodes).filter(selector)
    }

    $.contains = document.documentElement.contains ?
      function (parent, node) {
        return parent !== node && parent.contains(node)
      } :
      function (parent, node) {
        while (node && (node = node.parentNode))
          if (node === parent) return true
        return false
      }

    function funcArg(context, arg, idx, payload) {
      return isFunction(arg) ? arg.call(context, idx, payload) : arg
    }

    function setAttribute(node, name, value) {
      value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
    }

    // access className property while respecting SVGAnimatedString
    function className(node, value) {
      var klass = node.className || '',
        svg = klass && klass.baseVal !== undefined

      if (value === undefined) return svg ? klass.baseVal : klass
      svg ? (klass.baseVal = value) : (node.className = value)
    }

    // "true"  => true
    // "false" => false
    // "null"  => null
    // "42"    => 42
    // "42.5"  => 42.5
    // "08"    => "08"
    // JSON    => parse if valid
    // String  => self
    function deserializeValue(value) {
      try {
        return value ?
        value == "true" ||
        ( value == "false" ? false :
          value == "null" ? null :
            +value + "" == value ? +value :
              /^[\[\{]/.test(value) ? $.parseJSON(value) :
                value )
          : value
      } catch (e) {
        return value
      }
    }

    $.type = type
    $.isFunction = isFunction
    $.isWindow = isWindow
    $.isArray = isArray
    $.isPlainObject = isPlainObject

    $.isEmptyObject = function (obj) {
      var name
      for (name in obj) return false
      return true
    };

    $.inArray = function (elem, array, i) {
      return emptyArray.indexOf.call(array, elem, i)
    };

    $.camelCase = camelize
    $.trim = function (str) {
      return str == null ? "" : String.prototype.trim.call(str)
    };

    // plugin compatibility
    $.uuid = 0;
    $.support = {};
    $.expr = {};
    $.noop = function(){};

    $.map = function (elements, callback) {
      var value, values = [], i, key
      if (likeArray(elements))
        for (i = 0; i < elements.length; i++) {
          value = callback(elements[i], i)
          if (value != null) values.push(value)
        }
      else
        for (key in elements) {
          value = callback(elements[key], key)
          if (value != null) values.push(value)
        }
      return flatten(values)
    };

    $.each = function (elements, callback) {
      var i, key
      if (likeArray(elements)) {
        for (i = 0; i < elements.length; i++)
          if (callback.call(elements[i], i, elements[i]) === false) return elements
      } else {
        for (key in elements)
          if (callback.call(elements[key], key, elements[key]) === false) return elements
      }

      return elements
    };

    $.grep = function (elements, callback) {
      return filter.call(elements, callback)
    };

    if (window.JSON) $.parseJSON = JSON.parse

    // Populate the class2type map
    $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (i, name) {
      class2type["[object " + name + "]"] = name.toLowerCase()
    });

    // Define methods that will be available on all
    // Zepto collections
    $.fn = {
      constructor: zepto.Z,
      length: 0,

      // Because a collection acts like an array
      // copy over these useful array functions.
      forEach: emptyArray.forEach,
      reduce: emptyArray.reduce,
      push: emptyArray.push,
      sort: emptyArray.sort,
      splice: emptyArray.splice,
      indexOf: emptyArray.indexOf,
      concat: function () {
        var i, value, args = []
        for (i = 0; i < arguments.length; i++) {
          value = arguments[i]
          args[i] = zepto.isZ(value) ? value.toArray() : value
        }
        return concat.apply(zepto.isZ(this) ? this.toArray() : this, args)
      },

      // `map` and `slice` in the jQuery API work differently
      // from their array counterparts
      map: function (fn) {
        return $($.map(this, function (el, i) {
          return fn.call(el, i, el)
        }))
      },
      slice: function () {
        return $(slice.apply(this, arguments))
      },

      ready: function (callback) {
        // need to check if document.body exists for IE as that browser reports
        // document ready when it hasn't yet created the body element
        if (readyRE.test(document.readyState) && document.body) callback($)
        else document.addEventListener('DOMContentLoaded', function () {
          callback($)
        }, false)
        return this
      },
      get: function (idx) {
        return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
      },
      toArray: function () {
        return this.get()
      },
      size: function () {
        return this.length
      },
      remove: function () {
        return this.each(function () {
          if (this.parentNode != null)
            this.parentNode.removeChild(this)
        })
      },
      each: function (callback) {
        emptyArray.every.call(this, function (el, idx) {
          return callback.call(el, idx, el) !== false
        })
        return this
      },
      filter: function (selector) {
        if (isFunction(selector)) return this.not(this.not(selector))
        return $(filter.call(this, function (element) {
          return zepto.matches(element, selector)
        }))
      },
      add: function (selector, context) {
        return $(uniq(this.concat($(selector, context))))
      },
      is: function (selector) {
        return this.length > 0 && zepto.matches(this[0], selector)
      },
      not: function (selector) {
        var nodes = []
        if (isFunction(selector) && selector.call !== undefined)
          this.each(function (idx) {
            if (!selector.call(this, idx)) nodes.push(this)
          })
        else {
          var excludes = typeof selector == 'string' ? this.filter(selector) :
            (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
          this.forEach(function (el) {
            if (excludes.indexOf(el) < 0) nodes.push(el)
          })
        }
        return $(nodes)
      },
      has: function (selector) {
        return this.filter(function () {
          return isObject(selector) ?
            $.contains(this, selector) :
            $(this).find(selector).size()
        })
      },
      eq: function (idx) {
        return idx === -1 ? this.slice(idx) : this.slice(idx, +idx + 1)
      },
      first: function () {
        var el = this[0]
        return el && !isObject(el) ? el : $(el)
      },
      last: function () {
        var el = this[this.length - 1]
        return el && !isObject(el) ? el : $(el)
      },
      find: function (selector) {
        var result, $this = this
        if (!selector) result = $()
        else if (typeof selector == 'object')
          result = $(selector).filter(function () {
            var node = this
            return emptyArray.some.call($this, function (parent) {
              return $.contains(parent, node)
            })
          })
        else if (this.length == 1) result = $(zepto.qsa(this[0], selector))
        else result = this.map(function () {
            return zepto.qsa(this, selector)
          })
        return result
      },
      closest: function (selector, context) {
        var node = this[0], collection = false
        if (typeof selector == 'object') collection = $(selector)
        while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
          node = node !== context && !isDocument(node) && node.parentNode
        return $(node)
      },
      parents: function (selector) {
        var ancestors = [], nodes = this
        while (nodes.length > 0)
          nodes = $.map(nodes, function (node) {
            if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
              ancestors.push(node)
              return node
            }
          })
        return filtered(ancestors, selector)
      },
      parent: function (selector) {
        return filtered(uniq(this.pluck('parentNode')), selector)
      },
      children: function (selector) {
        return filtered(this.map(function () {
          return children(this)
        }), selector)
      },
      contents: function () {
        return this.map(function () {
          return this.contentDocument || slice.call(this.childNodes)
        })
      },
      siblings: function (selector) {
        return filtered(this.map(function (i, el) {
          return filter.call(children(el.parentNode), function (child) {
            return child !== el
          })
        }), selector)
      },
      empty: function () {
        return this.each(function () {
          this.innerHTML = ''
        })
      },
      // `pluck` is borrowed from Prototype.js
      pluck: function (property) {
        return $.map(this, function (el) {
          return el[property]
        })
      },
      show: function () {
        return this.each(function () {
          this.style.display == "none" && (this.style.display = '')
          if (getComputedStyle(this, '').getPropertyValue("display") == "none")
            this.style.display = defaultDisplay(this.nodeName)
        })
      },
      replaceWith: function (newContent) {
        return this.before(newContent).remove()
      },
      wrap: function (structure) {
        var func = isFunction(structure)
        if (this[0] && !func)
          var dom = $(structure).get(0),
            clone = dom.parentNode || this.length > 1

        return this.each(function (index) {
          $(this).wrapAll(
            func ? structure.call(this, index) :
              clone ? dom.cloneNode(true) : dom
          )
        })
      },
      wrapAll: function (structure) {
        if (this[0]) {
          $(this[0]).before(structure = $(structure))
          var children
          // drill down to the inmost element
          while ((children = structure.children()).length) structure = children.first()
          $(structure).append(this)
        }
        return this
      },
      wrapInner: function (structure) {
        var func = isFunction(structure)
        return this.each(function (index) {
          var self = $(this), contents = self.contents(),
            dom = func ? structure.call(this, index) : structure
          contents.length ? contents.wrapAll(dom) : self.append(dom)
        })
      },
      unwrap: function () {
        this.parent().each(function () {
          $(this).replaceWith($(this).children())
        })
        return this
      },
      clone: function () {
        return this.map(function () {
          return this.cloneNode(true)
        })
      },
      hide: function () {
        return this.css("display", "none")
      },
      toggle: function (setting) {
        return this.each(function () {
          var el = $(this)
            ;
          (setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide()
        })
      },
      prev: function (selector) {
        return $(this.pluck('previousElementSibling')).filter(selector || '*')
      },
      next: function (selector) {
        return $(this.pluck('nextElementSibling')).filter(selector || '*')
      },
      html: function (html) {
        return 0 in arguments ?
          this.each(function (idx) {
            var originHtml = this.innerHTML
            $(this).empty().append(funcArg(this, html, idx, originHtml))
          }) :
          (0 in this ? this[0].innerHTML : null)
      },
      text: function (text) {
        return 0 in arguments ?
          this.each(function (idx) {
            var newText = funcArg(this, text, idx, this.textContent)
            this.textContent = newText == null ? '' : '' + newText
          }) :
          (0 in this ? this.pluck('textContent').join("") : null)
      },
      attr: function (name, value) {
        var result
        return (typeof name == 'string' && !(1 in arguments)) ?
          (!this.length || this[0].nodeType !== 1 ? undefined :
              (!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
          ) :
          this.each(function (idx) {
            if (this.nodeType !== 1) return
            if (isObject(name)) for (key in name) setAttribute(this, key, name[key])
            else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
          })
      },
      removeAttr: function (name) {
        return this.each(function () {
          this.nodeType === 1 && name.split(' ').forEach(function (attribute) {
            setAttribute(this, attribute)
          }, this)
        })
      },
      prop: function (name, value) {
        name = propMap[name] || name
        return (1 in arguments) ?
          this.each(function (idx) {
            this[name] = funcArg(this, value, idx, this[name])
          }) :
          (this[0] && this[0][name])
      },
      data: function (name, value) {
        var attrName = 'data-' + name.replace(capitalRE, '-$1').toLowerCase()

        var data = (1 in arguments) ?
          this.attr(attrName, value) :
          this.attr(attrName)

        return data !== null ? deserializeValue(data) : undefined
      },
      val: function (value) {
        return 0 in arguments ?
          this.each(function (idx) {
            this.value = funcArg(this, value, idx, this.value)
          }) :
          (this[0] && (this[0].multiple ?
              $(this[0]).find('option').filter(function () {
                return this.selected
              }).pluck('value') :
              this[0].value)
          )
      },
      offset: function (coordinates) {
        if (coordinates) return this.each(function (index) {
          var $this = $(this),
            coords = funcArg(this, coordinates, index, $this.offset()),
            parentOffset = $this.offsetParent().offset(),
            props = {
              top: coords.top - parentOffset.top,
              left: coords.left - parentOffset.left
            }

          if ($this.css('position') == 'static') props['position'] = 'relative'
          $this.css(props)
        })
        if (!this.length) return null
        if (!$.contains(document.documentElement, this[0]))
          return {top: 0, left: 0}
        var obj = this[0].getBoundingClientRect()
        return {
          left: obj.left + window.pageXOffset,
          top: obj.top + window.pageYOffset,
          width: Math.round(obj.width),
          height: Math.round(obj.height)
        }
      },
      css: function (property, value) {
        if (arguments.length < 2) {
          var computedStyle, element = this[0]
          if (!element) return
          computedStyle = getComputedStyle(element, '')
          if (typeof property == 'string')
            return element.style[camelize(property)] || computedStyle.getPropertyValue(property)
          else if (isArray(property)) {
            var props = {}
            $.each(property, function (_, prop) {
              props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop))
            })
            return props
          }
        }

        var css = ''
        if (type(property) == 'string') {
          if (!value && value !== 0)
            this.each(function () {
              this.style.removeProperty(dasherize(property))
            })
          else
            css = dasherize(property) + ":" + maybeAddPx(property, value)
        } else {
          for (key in property)
            if (!property[key] && property[key] !== 0)
              this.each(function () {
                this.style.removeProperty(dasherize(key))
              })
            else
              css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
        }

        return this.each(function () {
          this.style.cssText += ';' + css
        })
      },
      index: function (element) {
        return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
      },
      hasClass: function (name) {
        if (!name) return false
        return emptyArray.some.call(this, function (el) {
          return this.test(className(el))
        }, classRE(name))
      },
      addClass: function (name) {
        if (!name) return this
        return this.each(function (idx) {
          if (!('className' in this)) return
          classList = []
          var cls = className(this), newName = funcArg(this, name, idx, cls)
          newName.split(/\s+/g).forEach(function (klass) {
            if (!$(this).hasClass(klass)) classList.push(klass)
          }, this)
          classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
        })
      },
      removeClass: function (name) {
        return this.each(function (idx) {
          if (!('className' in this)) return
          if (name === undefined) return className(this, '')
          classList = className(this)
          funcArg(this, name, idx, classList).split(/\s+/g).forEach(function (klass) {
            classList = classList.replace(classRE(klass), " ")
          })
          className(this, classList.trim())
        })
      },
      toggleClass: function (name, when) {
        if (!name) return this
        return this.each(function (idx) {
          var $this = $(this), names = funcArg(this, name, idx, className(this))
          names.split(/\s+/g).forEach(function (klass) {
            (when === undefined ? !$this.hasClass(klass) : when) ?
              $this.addClass(klass) : $this.removeClass(klass)
          })
        })
      },
      scrollTop: function (value) {
        if (!this.length) return
        var hasScrollTop = 'scrollTop' in this[0]
        if (value === undefined) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset
        return this.each(hasScrollTop ?
          function () {
            this.scrollTop = value
          } :
          function () {
            this.scrollTo(this.scrollX, value)
          })
      },
      scrollLeft: function (value) {
        if (!this.length) return
        var hasScrollLeft = 'scrollLeft' in this[0]
        if (value === undefined) return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset
        return this.each(hasScrollLeft ?
          function () {
            this.scrollLeft = value
          } :
          function () {
            this.scrollTo(value, this.scrollY)
          })
      },
      position: function () {
        if (!this.length) return

        var elem = this[0],
        // Get *real* offsetParent
          offsetParent = this.offsetParent(),
        // Get correct offsets
          offset = this.offset(),
          parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? {top: 0, left: 0} : offsetParent.offset()

        // Subtract element margins
        // note: when an element has margin: auto the offsetLeft and marginLeft
        // are the same in Safari causing offset.left to incorrectly be 0
        offset.top -= parseFloat($(elem).css('margin-top')) || 0
        offset.left -= parseFloat($(elem).css('margin-left')) || 0

        // Add offsetParent borders
        parentOffset.top += parseFloat($(offsetParent[0]).css('border-top-width')) || 0
        parentOffset.left += parseFloat($(offsetParent[0]).css('border-left-width')) || 0

        // Subtract the two offsets
        return {
          top: offset.top - parentOffset.top,
          left: offset.left - parentOffset.left
        }
      },
      offsetParent: function () {
        return this.map(function () {
          var parent = this.offsetParent || document.body
          while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
            parent = parent.offsetParent
          return parent
        })
      }
    }

    // for now
    $.fn.detach = $.fn.remove

      // Generate the `width` and `height` functions
    ;
    ['width', 'height'].forEach(function (dimension) {
      var dimensionProperty =
        dimension.replace(/./, function (m) {
          return m[0].toUpperCase()
        })

      $.fn[dimension] = function (value) {
        var offset, el = this[0]
        if (value === undefined) return isWindow(el) ? el['inner' + dimensionProperty] :
          isDocument(el) ? el.documentElement['scroll' + dimensionProperty] :
          (offset = this.offset()) && offset[dimension]
        else return this.each(function (idx) {
          el = $(this)
          el.css(dimension, funcArg(this, value, idx, el[dimension]()))
        })
      }
    })

    function traverseNode(node, fun) {
      fun(node)
      for (var i = 0, len = node.childNodes.length; i < len; i++)
        traverseNode(node.childNodes[i], fun)
    }

    // Generate the `after`, `prepend`, `before`, `append`,
    // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
    adjacencyOperators.forEach(function (operator, operatorIndex) {
      var inside = operatorIndex % 2 //=> prepend, append

      $.fn[operator] = function () {
        // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
        var argType, nodes = $.map(arguments, function (arg) {
            argType = type(arg)
            return argType == "object" || argType == "array" || arg == null ?
              arg : zepto.fragment(arg)
          }),
          parent, copyByClone = this.length > 1
        if (nodes.length < 1) return this

        return this.each(function (_, target) {
          parent = inside ? target : target.parentNode

          // convert all methods to a "before" operation
          target = operatorIndex == 0 ? target.nextSibling :
            operatorIndex == 1 ? target.firstChild :
              operatorIndex == 2 ? target :
                null

          var parentInDocument = $.contains(document.documentElement, parent)

          nodes.forEach(function (node) {
            if (copyByClone) node = node.cloneNode(true)
            else if (!parent) return $(node).remove()

            parent.insertBefore(node, target)
            if (parentInDocument) traverseNode(node, function (el) {
              if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
                (!el.type || el.type === 'text/javascript') && !el.src)
                window['eval'].call(window, el.innerHTML)
            })
          })
        })
      }

      // after    => insertAfter
      // prepend  => prependTo
      // before   => insertBefore
      // append   => appendTo
      $.fn[inside ? operator + 'To' : 'insert' + (operatorIndex ? 'Before' : 'After')] = function (html) {
        $(html)[operator](this)
        return this
      }
    })

    zepto.Z.prototype = Z.prototype = $.fn

    // Export internal API functions in the `$.zepto` namespace
    zepto.uniq = uniq
    zepto.deserializeValue = deserializeValue
    $.zepto = zepto

    return $
  })();
}
if( Fancy.nojQuery ) {

  (function ($) {
    var _zid = 1, undefined,
      slice = Array.prototype.slice,
      isFunction = Fancy.isFunction,
      isString = function (obj) {
        return typeof obj == 'string'
      },
      handlers = {},
      specialEvents = {},
      focusinSupported = 'onfocusin' in window,
      focus = {focus: 'focusin', blur: 'focusout'},
      hover = {mouseenter: 'mouseover', mouseleave: 'mouseout'}

    specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

    function zid(element) {
      return element._zid || (element._zid = _zid++)
    }

    function findHandlers(element, event, fn, selector) {
      event = parse(event)
      if (event.ns) var matcher = matcherFor(event.ns)
      return (handlers[zid(element)] || []).filter(function (handler) {
        return handler
          && (!event.e || handler.e == event.e)
          && (!event.ns || matcher.test(handler.ns))
          && (!fn || zid(handler.fn) === zid(fn))
          && (!selector || handler.sel == selector)
      })
    }

    function parse(event) {
      var parts = ('' + event).split('.')
      return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
    }

    function matcherFor(ns) {
      return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
    }

    function eventCapture(handler, captureSetting) {
      return handler.del &&
        (!focusinSupported && (handler.e in focus)) || !!captureSetting
    }

    function realEvent(type) {
      return hover[type] || (focusinSupported && focus[type]) || type
    }

    function add(element, events, fn, data, selector, delegator, capture) {
      var id = zid(element), set = (handlers[id] || (handlers[id] = []))
      events.split(/\s/).forEach(function (event) {
        if (event == 'ready') return $(document).ready(fn)
        var handler = parse(event)
        handler.fn = fn
        handler.sel = selector
        // emulate mouseenter, mouseleave
        if (handler.e in hover) fn = function (e) {
          var related = e.relatedTarget
          if (!related || (related !== this && !$.contains(this, related)))
            return handler.fn.apply(this, arguments)
        }
        handler.del = delegator
        var callback = delegator || fn
        handler.proxy = function (e) {
          e = compatible(e)
          if (e.isImmediatePropagationStopped()) return
          e.data = data
          var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args))
          if (result === false) e.preventDefault(), e.stopPropagation()
          return result
        }
        handler.i = set.length
        set.push(handler)
        if ('addEventListener' in element)
          element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
      })
    }

    function remove(element, events, fn, selector, capture) {
      var id = zid(element)
        ;
      (events || '').split(/\s/).forEach(function (event) {
        findHandlers(element, event, fn, selector).forEach(function (handler) {
          delete handlers[id][handler.i]
          if ('removeEventListener' in element)
            element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
        })
      })
    }

    $.event = {add: add, remove: remove}

    $.proxy = function (fn, context) {
      var args = (2 in arguments) && slice.call(arguments, 2);

      if (isFunction(fn)) {
        var proxyFn = function () {
          return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments)
        }
        proxyFn._zid = zid(fn)
        return proxyFn
      }
      else if (isString(context)) {
        if (args) {
          args.unshift(fn[context], fn)
          return $.proxy.apply(null, args)
        } else {
          return $.proxy(fn[context], fn)
        }
      } else {
        throw new TypeError("expected function")
      }
    }

    $.fn.bind = function (event, data, callback) {
      return this.on(event, data, callback)
    }
    $.fn.unbind = function (event, callback) {
      return this.off(event, callback)
    }
    $.fn.one = function (event, selector, data, callback) {
      return this.on(event, selector, data, callback, 1)
    }

    var returnTrue = function () {
        return true
      },
      returnFalse = function () {
        return false
      },
      ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/,
      eventMethods = {
        preventDefault: 'isDefaultPrevented',
        stopImmediatePropagation: 'isImmediatePropagationStopped',
        stopPropagation: 'isPropagationStopped'
      }

    function compatible(event, source) {
      if (source || !event.isDefaultPrevented) {
        source || (source = event)

        $.each(eventMethods, function (name, predicate) {
          var sourceMethod = source[name]
          event[name] = function () {
            this[predicate] = returnTrue
            return sourceMethod && sourceMethod.apply(source, arguments)
          }
          event[predicate] = returnFalse
        })

        if (source.defaultPrevented !== undefined ? source.defaultPrevented :
            'returnValue' in source ? source.returnValue === false :
            source.getPreventDefault && source.getPreventDefault())
          event.isDefaultPrevented = returnTrue
      }
      return event
    }

    function createProxy(event) {
      var key, proxy = {originalEvent: event}
      for (key in event)
        if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]

      return compatible(proxy, event)
    }

    $.fn.delegate = function (selector, event, callback) {
      return this.on(event, selector, callback)
    }
    $.fn.undelegate = function (selector, event, callback) {
      return this.off(event, selector, callback)
    }

    $.fn.live = function (event, callback) {
      $(document.body).delegate(this.selector, event, callback)
      return this
    }
    $.fn.die = function (event, callback) {
      $(document.body).undelegate(this.selector, event, callback)
      return this
    }

    $.fn.on = function (event, selector, data, callback, one) {
      var autoRemove, delegator, $this = this
      if (event && !isString(event)) {
        $.each(event, function (type, fn) {
          $this.on(type, selector, data, fn, one)
        })
        return $this
      }

      if (!isString(selector) && !isFunction(callback) && callback !== false)
        callback = data, data = selector, selector = undefined
      if (callback === undefined || data === false)
        callback = data, data = undefined

      if (callback === false) callback = returnFalse

      return $this.each(function (_, element) {
        if (one) autoRemove = function (e) {
          remove(element, e.type, callback)
          return callback.apply(this, arguments)
        }

        if (selector) delegator = function (e) {
          var evt, match = $(e.target).closest(selector, element).get(0)
          if (match && match !== element) {
            evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
            return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
          }
        }

        add(element, event, callback, data, selector, delegator || autoRemove)
      })
    }
    $.fn.off = function (event, selector, callback) {
      var $this = this
      if (event && !isString(event)) {
        $.each(event, function (type, fn) {
          $this.off(type, selector, fn)
        })
        return $this
      }

      if (!isString(selector) && !isFunction(callback) && callback !== false)
        callback = selector, selector = undefined

      if (callback === false) callback = returnFalse

      return $this.each(function () {
        remove(this, event, callback, selector)
      })
    }

    $.fn.trigger = function (event, args) {
      event = (isString(event) || $.isPlainObject(event)) ? $.Event(event) : compatible(event)
      event._args = args
      return this.each(function () {
        // handle focus(), blur() by calling them directly
        if (event.type in focus && typeof this[event.type] == "function") this[event.type]()
        // items in the collection might not be DOM elements
        else if ('dispatchEvent' in this) this.dispatchEvent(event)
        else $(this).triggerHandler(event, args)
      })
    }

    // triggers event handlers on current element just as if an event occurred,
    // doesn't trigger an actual event, doesn't bubble
    $.fn.triggerHandler = function (event, args) {
      var e, result
      this.each(function (i, element) {
        e = createProxy(isString(event) ? $.Event(event) : event)
        e._args = args
        e.target = element
        $.each(findHandlers(element, event.type || event), function (i, handler) {
          result = handler.proxy(e)
          if (e.isImmediatePropagationStopped()) return false
        })
      })
      return result
    }

      // shortcut methods for `.bind(event, fn)` for each event type
    ;
    ('focusin focusout focus blur load resize scroll unload click dblclick ' +
    'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' +
    'change select keydown keypress keyup error').split(' ').forEach(function (event) {
      $.fn[event] = function (callback) {
        return (0 in arguments) ?
          this.bind(event, callback) :
          this.trigger(event)
      }
    })

    $.Event = function (type, props) {
      if (!isString(type)) props = type, type = props.type
      var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
      if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
      event.initEvent(type, bubbles, true)
      return compatible(event)
    }

  })(Fancy.$)

}
//     Zepto.js
//     (c) 2010-2016 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

if( Fancy.nojQuery ) {

  (function ($, undefined) {
    var prefix = '', eventPrefix,
      vendors = {Webkit: 'webkit', Moz: '', O: 'o'},
      testEl = document.createElement('div'),
      supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
      transform,
      transitionProperty, transitionDuration, transitionTiming, transitionDelay,
      animationName, animationDuration, animationTiming, animationDelay,
      cssReset = {}

    function dasherize(str) {
      return str.replace(/([a-z])([A-Z])/, '$1-$2').toLowerCase()
    }

    function normalizeEvent(name) {
      return eventPrefix ? eventPrefix + name : name.toLowerCase()
    }

    $.each(vendors, function (vendor, event) {
      if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
        prefix = '-' + vendor.toLowerCase() + '-'
        eventPrefix = event
        return false
      }
    })

    transform = prefix + 'transform'
    cssReset[transitionProperty = prefix + 'transition-property'] =
      cssReset[transitionDuration = prefix + 'transition-duration'] =
        cssReset[transitionDelay = prefix + 'transition-delay'] =
          cssReset[transitionTiming = prefix + 'transition-timing-function'] =
            cssReset[animationName = prefix + 'animation-name'] =
              cssReset[animationDuration = prefix + 'animation-duration'] =
                cssReset[animationDelay = prefix + 'animation-delay'] =
                  cssReset[animationTiming = prefix + 'animation-timing-function'] = ''

    $.fx = {
      off: (eventPrefix === undefined && testEl.style.transitionProperty === undefined),
      speeds: {_default: 400, fast: 200, slow: 600},
      cssPrefix: prefix,
      transitionEnd: normalizeEvent('TransitionEnd'),
      animationEnd: normalizeEvent('AnimationEnd')
    }

    $.fn.animate = function (properties, duration, ease, callback, delay) {
      if ($.isFunction(duration))
        callback = duration, ease = undefined, duration = undefined
      if ($.isFunction(ease))
        callback = ease, ease = undefined
      if ($.isPlainObject(duration))
        ease = duration.easing, callback = duration.complete, delay = duration.delay, duration = duration.duration
      if (duration) duration = (typeof duration == 'number' ? duration :
          ($.fx.speeds[duration] || $.fx.speeds._default)) / 1000
      if (delay) delay = parseFloat(delay) / 1000
      return this.anim(properties, duration, ease, callback, delay)
    }

    $.fn.anim = function (properties, duration, ease, callback, delay) {
      var key, cssValues = {}, cssProperties, transforms = '',
        that = this, wrappedCallback, endEvent = $.fx.transitionEnd,
        fired = false

      if (duration === undefined) duration = $.fx.speeds._default / 1000
      if (delay === undefined) delay = 0
      if ($.fx.off) duration = 0

      if (typeof properties == 'string') {
        // keyframe animation
        cssValues[animationName] = properties
        cssValues[animationDuration] = duration + 's'
        cssValues[animationDelay] = delay + 's'
        cssValues[animationTiming] = (ease || 'linear')
        endEvent = $.fx.animationEnd
      } else {
        cssProperties = []
        // CSS transitions
        for (key in properties)
          if (supportedTransforms.test(key)) transforms += key + '(' + properties[key] + ') '
          else cssValues[key] = properties[key], cssProperties.push(dasherize(key))

        if (transforms) cssValues[transform] = transforms, cssProperties.push(transform)
        if (duration > 0 && typeof properties === 'object') {
          cssValues[transitionProperty] = cssProperties.join(', ')
          cssValues[transitionDuration] = duration + 's'
          cssValues[transitionDelay] = delay + 's'
          cssValues[transitionTiming] = (ease || 'linear')
        }
      }

      wrappedCallback = function (event) {
        if (typeof event !== 'undefined') {
          if (event.target !== event.currentTarget) return // makes sure the event didn't bubble from "below"
          $(event.target).unbind(endEvent, wrappedCallback)
        } else
          $(this).unbind(endEvent, wrappedCallback) // triggered by setTimeout

        fired = true
        $(this).css(cssReset)
        callback && callback.call(this)
      }
      if (duration > 0) {
        this.bind(endEvent, wrappedCallback)
        // transitionEnd is not always firing on older Android phones
        // so make sure it gets fired
        setTimeout(function () {
          if (fired) return
          wrappedCallback.call(that)
        }, ((duration + delay) * 1000) + 25)
      }

      // trigger page reflow so new elements can animate
      this.size() && this.get(0).clientLeft

      this.css(cssValues)

      if (duration <= 0) setTimeout(function () {
        that.each(function () {
          wrappedCallback.call(this)
        })
      }, 0)

      return this
    }

    testEl = null
  })(Fancy.$);

}
//     Zepto.js
//     (c) 2010-2016 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.
if( Fancy.nojQuery ) {

  (function ($, undefined) {
    var origShow = $.fn.show, origHide = $.fn.hide, origToggle = $.fn.toggle

    function anim(el, speed, opacity, scale, callback) {
      if (typeof speed == 'function' && !callback) callback = speed, speed = undefined
      var props = {opacity: opacity}
      if (scale) {
        props.scale = scale
        el.css($.fx.cssPrefix + 'transform-origin', '0 0')
      }
      return el.animate(props, speed, null, callback)
    }

    function hide(el, speed, scale, callback) {
      return anim(el, speed, 0, scale, function () {
        origHide.call($(this))
        callback && callback.call(this)
      })
    }

    $.fn.show = function (speed, callback) {
      origShow.call(this)
      if (speed === undefined) speed = 0
      else this.css('opacity', 0)
      return anim(this, speed, 1, '1,1', callback)
    }

    $.fn.hide = function (speed, callback) {
      if (speed === undefined) return origHide.call(this)
      else return hide(this, speed, '0,0', callback)
    }

    $.fn.toggle = function (speed, callback) {
      if (speed === undefined || typeof speed == 'boolean')
        return origToggle.call(this, speed)
      else return this.each(function () {
        var el = $(this)
        el[el.css('display') == 'none' ? 'show' : 'hide'](speed, callback)
      })
    }

    $.fn.fadeTo = function (speed, opacity, callback) {
      return anim(this, speed, opacity, null, callback)
    }

    $.fn.fadeIn = function (speed, callback) {
      var target = this.css('opacity')
      if (target > 0) this.css('opacity', 0)
      else target = 1
      return origShow.call(this).fadeTo(speed, target, callback)
    }

    $.fn.fadeOut = function (speed, callback) {
      return hide(this, speed, null, callback)
    }

    $.fn.fadeToggle = function (speed, callback) {
      return this.each(function () {
        var el = $(this)
        el[
          (el.css('opacity') == 0 || el.css('display') == 'none') ? 'fadeIn' : 'fadeOut'
          ](speed, callback)
      })
    }

  })(Fancy.$);

}
if( Fancy.nojQuery ) {

  (function ($) {
    var jsonpID = 0,
      document = window.document,
      key,
      name,
      rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      scriptTypeRE = /^(?:text|application)\/javascript/i,
      xmlTypeRE = /^(?:text|application)\/xml/i,
      jsonType = 'application/json',
      htmlType = 'text/html',
      blankRE = /^\s*$/,
      originAnchor = document.createElement('a');

    originAnchor.href = window.location.href;

    // trigger a custom event and return false if it was cancelled
    function triggerAndReturn(context, eventName, data) {
      var event = $.Event(eventName);
      $(context).trigger(event, data);
      return !event.isDefaultPrevented()
    }

    // trigger an Ajax "global" event
    function triggerGlobal(settings, context, eventName, data) {
      if (settings.global) return triggerAndReturn(context || document, eventName, data)
    }

    // Number of active Ajax requests
    $.active = 0

    function ajaxStart(settings) {
      if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')
    }

    function ajaxStop(settings) {
      if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop')
    }

    // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
    function ajaxBeforeSend(xhr, settings) {
      var context = settings.context
      if (settings.beforeSend.call(context, xhr, settings) === false ||
        triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
        return false

      triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
    }

    function ajaxSuccess(data, xhr, settings, deferred) {
      var context = settings.context, status = 'success'
      settings.success.call(context, data, status, xhr)
      if (deferred) deferred.resolveWith(context, [data, status, xhr])
      triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
      ajaxComplete(status, xhr, settings)
    }

    // type: "timeout", "error", "abort", "parsererror"
    function ajaxError(error, type, xhr, settings, deferred) {
      var context = settings.context
      settings.error.call(context, xhr, type, error)
      if (deferred) deferred.rejectWith(context, [xhr, type, error])
      triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error || type])
      ajaxComplete(type, xhr, settings)
    }

    // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
    function ajaxComplete(status, xhr, settings) {
      var context = settings.context
      settings.complete.call(context, xhr, status)
      triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
      ajaxStop(settings)
    }

    // Empty function, used as default callback
    function empty() {
    }

    $.ajaxJSONP = function (options, deferred) {
      if (!('type' in options)) return $.ajax(options)

      var _callbackName = options.jsonpCallback,
        callbackName = ($.isFunction(_callbackName) ?
            _callbackName() : _callbackName) || ('jsonp' + (++jsonpID)),
        script = document.createElement('script'),
        originalCallback = window[callbackName],
        responseData,
        abort = function (errorType) {
          $(script).triggerHandler('error', errorType || 'abort')
        },
        xhr = {abort: abort}, abortTimeout

      if (deferred) deferred.promise(xhr)

      $(script).on('load error', function (e, errorType) {
        clearTimeout(abortTimeout)
        $(script).off().remove()

        if (e.type == 'error' || !responseData) {
          ajaxError(null, errorType || 'error', xhr, options, deferred)
        } else {
          ajaxSuccess(responseData[0], xhr, options, deferred)
        }

        window[callbackName] = originalCallback
        if (responseData && $.isFunction(originalCallback))
          originalCallback(responseData[0])

        originalCallback = responseData = undefined
      })

      if (ajaxBeforeSend(xhr, options) === false) {
        abort('abort')
        return xhr
      }

      window[callbackName] = function () {
        responseData = arguments
      }

      script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName)
      document.head.appendChild(script)

      if (options.timeout > 0) abortTimeout = setTimeout(function () {
        abort('timeout')
      }, options.timeout)

      return xhr
    }

    $.ajaxSettings = {
      // Default type of request
      type: 'GET',
      // Callback that is executed before request
      beforeSend: empty,
      // Callback that is executed if the request succeeds
      success: empty,
      // Callback that is executed the the server drops error
      error: empty,
      // Callback that is executed on request complete (both: error and success)
      complete: empty,
      // The context for the callbacks
      context: null,
      // Whether to trigger "global" Ajax events
      global: true,
      // Transport
      xhr: function () {
        return new window.XMLHttpRequest()
      },
      // MIME types mapping
      // IIS returns Javascript as "application/x-javascript"
      accepts: {
        script: 'text/javascript, application/javascript, application/x-javascript',
        json: jsonType,
        xml: 'application/xml, text/xml',
        html: htmlType,
        text: 'text/plain'
      },
      // Whether the request is to another domain
      crossDomain: false,
      // Default timeout
      timeout: 0,
      // Whether data should be serialized to string
      processData: true,
      // Whether the browser should be allowed to cache GET responses
      cache: true
    }

    function mimeToDataType(mime) {
      if (mime) mime = mime.split(';', 2)[0]
      return mime && ( mime == htmlType ? 'html' :
          mime == jsonType ? 'json' :
            scriptTypeRE.test(mime) ? 'script' :
            xmlTypeRE.test(mime) && 'xml' ) || 'text'
    }

    function appendQuery(url, query) {
      if (query == '') return url
      return (url + '&' + query).replace(/[&?]{1,2}/, '?')
    }

    // serialize payload and append it to the URL for GET requests
    function serializeData(options) {
      if (options.processData && options.data && $.type(options.data) != "string")
        options.data = $.param(options.data, options.traditional)
      if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
        options.url = appendQuery(options.url, options.data), options.data = undefined
    }

    $.ajax = function (options) {
      var settings = $.extend({}, options || {}),
        deferred = $.Deferred && $.Deferred(),
        urlAnchor, hashIndex
      for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]

      ajaxStart(settings)

      if (!settings.crossDomain) {
        urlAnchor = document.createElement('a')
        urlAnchor.href = settings.url
        // cleans up URL for .href (IE only), see https://github.com/madrobby/zepto/pull/1049
        urlAnchor.href = urlAnchor.href
        settings.crossDomain = (originAnchor.protocol + '//' + originAnchor.host) !== (urlAnchor.protocol + '//' + urlAnchor.host)
      }

      if (!settings.url) settings.url = window.location.toString()
      if ((hashIndex = settings.url.indexOf('#')) > -1) settings.url = settings.url.slice(0, hashIndex)
      serializeData(settings)

      var dataType = settings.dataType, hasPlaceholder = /\?.+=\?/.test(settings.url)
      if (hasPlaceholder) dataType = 'jsonp'

      if (settings.cache === false || (
          (!options || options.cache !== true) &&
          ('script' == dataType || 'jsonp' == dataType)
        ))
        settings.url = appendQuery(settings.url, '_=' + Date.now())

      if ('jsonp' == dataType) {
        if (!hasPlaceholder)
          settings.url = appendQuery(settings.url,
            settings.jsonp ? (settings.jsonp + '=?') : settings.jsonp === false ? '' : 'callback=?')
        return $.ajaxJSONP(settings, deferred)
      }

      var mime = settings.accepts[dataType],
        headers = {},
        setHeader = function (name, value) {
          headers[name.toLowerCase()] = [name, value]
        },
        protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
        xhr = settings.xhr(),
        nativeSetHeader = xhr.setRequestHeader,
        abortTimeout

      if (deferred) deferred.promise(xhr)

      if (!settings.crossDomain) setHeader('X-Requested-With', 'XMLHttpRequest')
      setHeader('Accept', mime || '*/*')
      if (mime = settings.mimeType || mime) {
        if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
        xhr.overrideMimeType && xhr.overrideMimeType(mime)
      }
      if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET'))
        setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded')

      if (settings.headers) for (name in settings.headers) setHeader(name, settings.headers[name])
      xhr.setRequestHeader = setHeader

      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          xhr.onreadystatechange = empty
          clearTimeout(abortTimeout)
          var result, error = false
          if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
            dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'))

            if (xhr.responseType == 'arraybuffer' || xhr.responseType == 'blob')
              result = xhr.response
            else {
              result = xhr.responseText

              try {
                // http://perfectionkills.com/global-eval-what-are-the-options/
                if (dataType == 'script')    (1, eval)(result)
                else if (dataType == 'xml')  result = xhr.responseXML
                else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result)
              } catch (e) {
                error = e
              }

              if (error) return ajaxError(error, 'parsererror', xhr, settings, deferred)
            }

            ajaxSuccess(result, xhr, settings, deferred)
          } else {
            ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings, deferred)
          }
        }
      }

      if (ajaxBeforeSend(xhr, settings) === false) {
        xhr.abort()
        ajaxError(null, 'abort', xhr, settings, deferred)
        return xhr
      }

      if (settings.xhrFields) for (name in settings.xhrFields) xhr[name] = settings.xhrFields[name]

      var async = 'async' in settings ? settings.async : true
      xhr.open(settings.type, settings.url, async, settings.username, settings.password)

      for (name in headers) nativeSetHeader.apply(xhr, headers[name])

      if (settings.timeout > 0) abortTimeout = setTimeout(function () {
        xhr.onreadystatechange = empty
        xhr.abort()
        ajaxError(null, 'timeout', xhr, settings, deferred)
      }, settings.timeout)

      // avoid sending empty string (#319)
      xhr.send(settings.data ? settings.data : null)
      return xhr
    }

    // handle optional data/success arguments
    function parseArguments(url, data, success, dataType) {
      if ($.isFunction(data)) dataType = success, success = data, data = undefined
      if (!$.isFunction(success)) dataType = success, success = undefined
      return {
        url: url
        , data: data
        , success: success
        , dataType: dataType
      }
    }

    $.get = function (/* url, data, success, dataType */) {
      return $.ajax(parseArguments.apply(null, arguments))
    }

    $.post = function (/* url, data, success, dataType */) {
      var options = parseArguments.apply(null, arguments)
      options.type = 'POST'
      return $.ajax(options)
    }

    $.getJSON = function (/* url, data, success */) {
      var options = parseArguments.apply(null, arguments)
      options.dataType = 'json'
      return $.ajax(options)
    }

    $.fn.load = function (url, data, success) {
      if (!this.length) return this
      var self = this, parts = url.split(/\s/), selector,
        options = parseArguments(url, data, success),
        callback = options.success
      if (parts.length > 1) options.url = parts[0], selector = parts[1]
      options.success = function (response) {
        self.html(selector ?
          $('<div>').html(response.replace(rscript, "")).find(selector)
          : response)
        callback && callback.apply(self, arguments)
      }
      $.ajax(options)
      return this
    }

    var escape = encodeURIComponent

    function serialize(params, obj, traditional, scope) {
      var type, array = $.isArray(obj), hash = $.isPlainObject(obj)
      $.each(obj, function (key, value) {
        type = $.type(value)
        if (scope) key = traditional ? scope :
        scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']'
        // handle data in serializeArray() format
        if (!scope && array) params.add(value.name, value.value)
        // recurse into nested objects
        else if (type == "array" || (!traditional && type == "object"))
          serialize(params, value, traditional, key)
        else params.add(key, value)
      })
    }

    $.param = function (obj, traditional) {
      var params = []
      params.add = function (key, value) {
        if ($.isFunction(value)) value = value()
        if (value == null) value = ""
        this.push(escape(key) + '=' + escape(value))
      }
      serialize(params, obj, traditional)
      return params.join('&').replace(/%20/g, '+')
    }
  })(Fancy.$);

}
/**
 * English Translations
 */

Fancy.i18n.en = {
  paging: {
    first: 'First Page',
    last: 'Last Page',
    prev: 'Previous Page',
    next: 'Next Page',
    info: 'Rows [0] - [1] of [2]',
    page: 'Page',
    of: 'of [0]'
  },
  loadingText: 'Loading...',
  thousandSeparator: ',',
  decimalSeparator: '.',
  currencySign: '$',
  sourceText: 'Source',
  date: {
    read: 'm/d/Y',
    write: 'm/d/Y',
    edit: 'm/d/Y',
    today: 'Today',
    startDay: 0,
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    am: 'am',
    pm: 'pm',
    AM: 'AM',
    PM: 'PM',
    ok: 'OK',
    cancel: 'Cancel'
  },
  yes: 'Yes',
  no: 'No',
  dragText: '[0] selected row[1]',
  update: 'Update',
  cancel: 'Cancel',
  columns: 'Columns',
  sortAsc: 'Sort ASC',
  sortDesc: 'Sort DESC'
};

Fancy.i18n['en-US'] = Fancy.i18n.en;
Fancy.controllers = {

};

/*
 * @param {String} name
 * @param {Object} o
 */
Fancy.defineController = function(name, o){
  Fancy.controllers[name] = o;
};

/*
 * @param {String} name
 * @return {Object}
 */
Fancy.getController = function(name){
  return Fancy.controllers[name];
};
/**
 * @class Fancy.DD
 * @singleton
 * @extends Fancy.Event
 */
Fancy.define('Fancy.DD', {
  extend: Fancy.Event,
  singleton: true,
  /*
   * @constructor
   * @param {Object} config
   */
  constructor: function(config){
    this.Super('const', arguments);
    this.init();
  },
  /*
   *
   */
  init: function(){
    this.addEvents();
    this.els = {};
  },
  /*
   * @param {Object} o
   */
  add: function(o){
    var me = this,
      id = Fancy.id(o.overEl);

    /*
      {
        dragEl: El,
        overEl: El
      }
    */

    me.els[id] = o;
    //o.dragEl.on('mousedown', me.onMouseDown, me);
    o.overEl.on('mousedown', me.onMouseDown, me);
  },
  /*
   * @param {Object} e
   */
  onMouseDown: function(e){
    var me = this,
      doc = Fancy.get(document),
      overEl = Fancy.get(e.currentTarget),
      dragEl = me.els[overEl.attr('id')].dragEl;

    e.preventDefault();

    me.clientX = e.clientX;
    me.clientY = e.clientY;

    me.startX = parseInt(dragEl.css('left'));
    me.startY = parseInt(dragEl.css('top'));

    me.activeId = overEl.attr('id');

    doc.once('mouseup', me.onMouseUp, me);
    doc.on('mousemove', me.onMouseMove, me);
  },
  /*
   *
   */
  onMouseUp: function(){
    var doc = Fancy.get(document);

    doc.un('mousemove', this.onMouseMove, this);
  },
  /*
   * @param {Object} e
   */
  onMouseMove: function(e){
    var me = this,
      activeO = me.els[me.activeId],
      dragEl = activeO.dragEl,
      clientX = e.clientX,
      clientY = e.clientY,
      deltaX = me.clientX - clientX,
      deltaY = me.clientY - clientY;

    dragEl.css({
      left: me.startX - deltaX,
      top: me.startY - deltaY
    });
  }
});
/**
 * @class Fancy.Widget
 * @extends Fancy.Event
 */
Fancy.define('Fancy.Widget', {
  extend: Fancy.Event,
  /*
   * @constructor
   * @param {Object} config
   */
  constructor: function(config){
    var me = this;

    Fancy.applyConfig(me, config);

    me.preInitControls();
    me.Super('const', arguments);

    me.init();
    me.initControls();
  },
  /*
   *
   */
  init: function(){
    //not runned in grid
    //maybe to redo that run
    var me = this;

    me.initId();
    me.addEvents(
      'beforerender', 'afterrender', 'render', 'show', 'beforehide', 'hide', 'destroy'
    );
    me.initPlugins();
  },
  /*
   * @param {String|HTMLElement}
   */
  renderItems: function(renderTo){
    var me = this;

    Fancy.each(me.items, function(item, i){
      var w = Fancy.getClassByType(item.type);

      item.renderTo = renderTo;
      me.items[i] = new w(item);
    });
  },
  /*
   *
   */
  preInitControls: function(){
    var me = this,
      controller = me.controller || me.controllers;

    if(controller){
      switch(Fancy.typeOf(controller)){
        case 'string':
          controller = Fancy.getController(controller);

          for(var p in controller){
            if(me[p] === undefined ) {
              me[p] = controller[p];
            }
          }
          break;
        case 'array':
          var controls = [],
            i = 0,
            iL = controller.length;

          for(;i<iL;i++){
            var _controller = Fancy.getController(controller[i]);

            for(var p in _controller){
              if(p === 'controls'){
                controls = controls.concat(_controller.controls);
                continue;
              }

              if(me[p] === undefined ) {
                me[p] = _controller[p];
              }
            }
          }

          me.controls = controls;

          break;
      }
    }
  },
  /*
   *
   */
  initControls: function(){
    var me = this;

    if(me.controls === undefined){
      return;
    }

    var controls = me.controls,
      i = 0,
      iL = controls.length;

    for(;i<iL;i++){
      var control = controls[i];

      if(control.event === undefined){
        throw new Error('[FancyGrid Error]: - not set event name for control');
      }

      if(control.handler === undefined){
        throw new Error('[FancyGrid Error]: - not set handler for control');
      }

      var event = control.event,
        handler = control.handler,
        scope = control.scope || me,
        selector = control.selector;

      if(Fancy.isString(handler)){
        handler = me[handler];
      }

      if(selector) {
        (function (event, handler, scope, selector) {
          if(me.$events[event]){
            me.on(event, function(grid, o){
              var target = o.e.target,
                el = Fancy.get(target),
                parentEl = el.parent(),
                selectored = parentEl.select(selector);

              if(selectored.length === 1 && selectored.within(target)){
                handler.apply(scope, arguments);
              }
              else if(selectored.length > 1){
                var j = 0,
                  jL = selectored.length;

                for(;j<jL;j++){
                  if( selectored.item(j).within(target) ){
                    handler.apply(scope, arguments);
                  }
                }
              }
            }, scope);
          }
          else {
            me.on('render', function () {
              me.el.on(event, handler, scope, selector);
            });
          }
        })(event, handler, scope, selector);
      }
      else if(selector === undefined && control.widget === undefined){
        me.on(event, handler, scope);
      }
    }
  },
  /*
   * @param {String|Object} o1
   * @param {Number|String} [o2]
   */
  css: function(o1, o2){
    return this.el.css(o1, o2);
  },
  /*
   * @param {String} value
   */
  addClass: function(value){
    this.el.addCls(value);
  },
  /*
   * @param {String} value
   */
  addCls: function(value){
    this.el.addCls(value);
  },
  /*
   * @param {String} value
   */
  removeClass: function(value){
    this.el.removeCls(value);
  },
  /*
 * @param {String} value
 */
  removeCls: function(value){
    this.el.removeCls(value);
  },
  /*
   * @param {String} value
   */
  hasClass: function(value){
    return this.el.hasCls(value);
  },
  /*
   * @param {String} value
   */
  hasCls: function(value){
    return this.el.hasCls(value);
  },
  /*
   * @param {String} value
   */
  toggleClass: function(value){
    this.el.toggleCls(value);
  },
  /*
   * @param {String} value
   */
  toggleCls: function(value){
    this.el.toggleCls(value);
  },
  /*
   *
   */
  destroy: function(){
    if(this.el){
      this.el.destroy();
    }
  },
  /*
   *
   */
  show: function() {
    this.el.show();
  },
  /*
   *
   */
  hide: function() {
    this.el.hide();
  },
  /*
   *
   */
  initTpl: function(){
    var me = this;

    if(!me.tpl){
      return;
    }

    me.tpl = new Fancy.Template(me.tpl);
  }
});
/*
 * @class Fancy.Plugin
 */
Fancy.define('Fancy.Plugin', {
  extend: Fancy.Event,
  /*
   * @constructor {Object} config
   */
  constructor: function(config){
    this.Super('const', arguments);
    this.init();
  },
  /*
   *
   */
  init: function(){
    this.initId();
    this.addEvents('beforerender', 'afterrender', 'render', 'show', 'hide', 'destroy');
  },
  /*
   *
   */
  initTpl: function(){
    var tpl = this.tpl;

    if(!tpl){
      return;
    }

    this.tpl = new Fancy.Template(tpl);
  }
});

(function() {
  var toggleGroups = {};

  //SHORTCUTS
  var F = Fancy;

  //CONSTANTS
  var GRID_CLS = F.GRID_CLS;
  var BUTTON_CLS = F.BUTTON_CLS;
  var BUTTON_DISABLED_CLS = F.BUTTON_DISABLED_CLS;
  var BUTTON_PRESSED_CLS = F.BUTTON_PRESSED_CLS;
  var BUTTON_IMAGE_CLS = F.BUTTON_IMAGE_CLS;
  var BUTTON_IMAGE_COLOR_CLS = F.BUTTON_IMAGE_COLOR_CLS;
  var BUTTON_TEXT_CLS = F.BUTTON_TEXT_CLS;
  var BUTTON_DROP_CLS = F.BUTTON_DROP_CLS;

  /**
   * @class Fancy.Button
   * @extends Fancy.Widget
   */
  F.define('Fancy.Button', {
    extend: F.Widget,
    minWidth: 30,
    /*
     * @constructor
     * @param {Object} config
     * @param {Object} scope
     */
    constructor: function(config, scope){
      var me = this;

      if (config.toggleGroup) {
        toggleGroups[config.toggleGroup] = toggleGroups[config.toggleGroup] || {
            active: false,
            items: []
          };

        toggleGroups[config.toggleGroup].items.push(me);
      }

      me.scope = scope;

      me.Super('const', arguments);
    },
    /*
     *
     */
    init: function(){
      var me = this;

      me.addEvents('click', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'pressedchange');
      me.Super('init', arguments);

      me.style = me.style || {};

      me.initTpl();
      me.render();
      me.setOns();
    },
    /*
     *
     */
    setOns: function () {
      var me = this,
        el = me.el;

      el.on('click', me.onClick, me);
      el.on('mousedown', me.onMouseDown, me);
      el.on('mouseup', me.onMouseUp, me);
      el.on('mouseover', me.onMouseOver, me);
      el.on('mouseout', me.onMouseOut, me);

      if(me.tip){
        el.on('mousemove', me.onMouseMove, me);
      }
    },
    widgetCls: BUTTON_CLS,
    cls: '',
    extraCls: '',
    disabledCls: BUTTON_DISABLED_CLS,
    pressedCls: BUTTON_PRESSED_CLS,
    buttonImageCls: BUTTON_IMAGE_CLS,
    buttonImageColorCls: BUTTON_IMAGE_COLOR_CLS,
    textCls: BUTTON_TEXT_CLS,
    dropCls: BUTTON_DROP_CLS,
    text: '',
    height: 28,
    paddingTextWidth: 5,
    imageWidth: 20,
    pressed: false,
    tpl: [
      '<div class="' + BUTTON_IMAGE_CLS + '"></div>',
      '<a class="' + BUTTON_TEXT_CLS + '">{text}</a>',
      '<div class="' + BUTTON_DROP_CLS + '" style="{dropDisplay}"></div>'
    ],
    /*
     *
     */
    render: function(){
      var me = this,
        renderTo,
        el = F.get(document.createElement('div')),
        width = 0;

      me.fire('beforerender');

      if( me.wrapper ){
        me.renderWrapper();
      }

      renderTo = F.get(me.renderTo || document.body).dom;

      if(me.width){
        width = me.width;
      }
      else{
        if(me.text !== false){
          width += me.text.length * 7 + 7*2;
        }
      }

      if(me.imageColor){
        me.imageCls = BUTTON_IMAGE_COLOR_CLS;
      }

      if(width < me.minWidth){
        if(me.text && me.text.length > 0){
          width = me.minWidth;
        }
        else{
          width = me.minWidth;
        }
      }

      if(me.imageCls && me.text){
        width += me.imageWidth;
      }

      el.addCls(
        F.cls,
        me.widgetCls,
        me.cls,
        me.extraCls
      );

      if (me.disabled) {
        el.addCls(BUTTON_DISABLED_CLS);
      }

      el.css({
        width: width + 'px',
        height: me.height + 'px'
      });

      if(me.hidden){
        el.css('display', 'none');
      }

      el.css(me.style || {});

      el.update(me.tpl.getHTML({
        text: me.text || ''
      }));

      if(me.imageCls){
        var imageEl = el.select('.' + BUTTON_IMAGE_CLS);
        if(me.imageColor){
          imageEl.css('background-color', me.imageColor);
        }
        imageEl.css('display', 'block');
        if(F.isString(me.imageCls)){
          imageEl.addCls(me.imageCls);
        }
      }

      me.el = F.get(renderTo.appendChild(el.dom));

      if (me.disabled) {
        me.disable();
      }

      if(me.pressed){
        me.setPressed(me.pressed);
      }

      me.initToggle();

      me.width = width;

      me.fire('afterrender');
      me.fire('render');
    },
    /*
     *
     */
    renderWrapper: function(){
      var me = this,
        wrapper = me.wrapper,
        renderTo = F.get(me.renderTo || document.body).dom,
        el = F.get(document.createElement('div'));

      el.css(wrapper.style || {});
      el.addCls(wrapper.cls || '');

      me.wrapper = F.get(renderTo.appendChild(el.dom));

      me.renderTo = me.wrapper.dom;
    },
    /*
     *
     */
    initToggle: function(){
      if (!this.enableToggle) {
        return false;
      }
    },
    /*
     * @param {Boolean} value
     */
    setPressed: function(value, fire){
      var me = this;

      if (value) {
        me.addCls(BUTTON_PRESSED_CLS);
        me.pressed = true;

        if(me.toggleGroup){
          var active = toggleGroups[me.toggleGroup].active;
          if(active){
            active.setPressed(false);
          }

          toggleGroups[me.toggleGroup].active = me;
        }
      }
      else {
        me.removeCls(BUTTON_PRESSED_CLS);
        me.pressed = false;
      }

      if(fire !== false){
        me.fire('pressedchange', me.pressed);
      }
    },
    /*
     *
     */
    toggle: function(){
      var me = this,
        value = !me.pressed;

      me.setPressed(value);
      me.pressed = value;
    },
    /*
     *
     */
    onClick: function(){
      var me = this,
        handler = me.handler;

      me.fire('click');

      if(me.disabled !== true){
        if(handler){
          if(F.isString(handler)){
            handler = me.getHandler(handler);
          }

          if (me.scope) {
            handler.apply(me.scope, [me]);
          }
          else {
            handler(me);
          }
        }

        if(me.enableToggle){
          if(me.toggleGroup){
            me.setPressed(true);
          }
          else {
            me.toggle();
          }
        }
      }
    },
    /*
     * @param {String} name
     */
    getHandler: function(name){
      var me = this,
        grid = F.getWidget(me.el.parent().parent().select('.' + GRID_CLS).attr('id'));

      return grid[name] || function(){
          throw new Error('[FancyGrid Error] - handler does not exist');
        };
    },
    /*
     *
     */
    onMouseDown: function(){
      this.fire('mousedown');
    },
    /*
     *
     */
    onMouseUp: function(){
      this.fire('mouseup');
    },
    /*
     * @param {Object} e
     */
    onMouseOver: function(e){
      var me = this;

      me.fire('mouseover');

      if(me.tip){
        me.renderTip(e);
      }
    },
    /*
     * @param {Object} e
     */
    renderTip: function(e){
      var me = this;

      if(me.tooltip){
        me.tooltip.destroy();
      }

      me.tooltip = new F.ToolTip({
        text: me.tip
      });

      me.tooltip.css('display', 'block');
      me.tooltip.show(e.pageX + 15, e.pageY - 25);
    },
    /*
     *
     */
    onMouseOut: function(){
      var me = this;

      me.fire('mouseout');

      if(me.tooltip){
        me.tooltip.destroy();
        delete me.tooltip;
      }
    },
    /*
     * @param {String} text
     */
    setText: function(text){
      var me = this,
        el = me.el;

      me.css('width', ((parseInt(el.css('font-size')) + 2 ) * text.length) + parseInt(me.css('padding-right')) * 2 + 2  );

      el.select('.' + BUTTON_TEXT_CLS).update(text);
    },
    /*
     *
     */
    disable: function(){
      this.disabled = true;
      this.addCls(BUTTON_DISABLED_CLS);
    },
    /*
     *
     */
    enable: function(){
      this.disabled = false;
      this.removeCls(BUTTON_DISABLED_CLS);
    },
    /*
     *
     */
    onMouseMove: function(e){
      var me = this;

      if(me.tip && me.tooltip){
        me.tooltip.show(e.pageX + 15, e.pageY - 25);
      }
    }
  });
})();
/**
 * @class Fancy.SegButton
 * @extends Fancy.Widget
 */
Fancy.define('Fancy.SegButton', {
  extend: Fancy.Widget,
  /*
   * @param {Object} config
   * @param {Object} scope
   */
  constructor: function(config, scope){
    this.scope = scope;
    this.Super('const', arguments);
  },
  /*
   *
   */
  init: function(){
    var me = this;

    me.addEvents('toggle');
    me.Super('init', arguments);

    me.style = me.style || {};

    me.render();
  },
  /*
   *
   */
  widgetCls: Fancy.SEG_BUTTON_CLS,
  cls: '',
  extraCls: '',
  text: '',
  /*
   *
   */
  render: function(){
    var me = this,
      renderTo,
      el = Fancy.get(document.createElement('div'));

    me.fire('beforerender');

    renderTo = Fancy.get(me.renderTo || document.body).dom;

    el.addCls(
      Fancy.cls,
      me.widgetCls,
      me.cls,
      me.extraCls
    );

    if(me.hidden){
      el.css('display', 'none');
    }

    me.el = Fancy.get(renderTo.appendChild(el.dom));

    Fancy.each(me.style, function (value, p) {
      me.el.css(p, value);
    });

    me.renderButtons();

    me.fire('afterrender');
    me.fire('render');
  },
  /*
   *
   */
  renderButtons: function(){
    var me = this,
      items = me.items,
      i = 0,
      iL = items.length,
      toggleGroup = Fancy.id(null, 'fancy-toggle-group-');

    for(;i<iL;i++){
      var item = items[i];
      item.renderTo = me.el.dom;

      if(me.allowToggle !== false) {
        item.enableToggle = true;
        if(me.multiToggle !== true){
          item.toggleGroup = toggleGroup;
        }
      }

      if(i === 0){
        item.style = {
          'border-right-width': 0,
          'border-top-right-radius': 0,
          'border-bottom-right-radius': 0
        };
      }
      else if(i > 1){
        item.style = {
          'border-left-width': 0,
          'border-top-left-radius': 0,
          'border-bottom-left-radius': 0
        };
      }
      else{
        item.style = {
          'border-top-left-radius': 0,
          'border-bottom-left-radius': 0
        };
      }

      if(items.length > 2 && i !== 0 && i !== iL - 1){
        Fancy.apply(item.style, {
          'border-top-right-radius': 0,
          'border-bottom-right-radius': 0,
          'border-top-left-radius': 0,
          'border-bottom-left-radius': 0
        });
      }

      me.items[i] = new Fancy.Button(item);
      me.items[i].on('pressedchange', function(button, value){
        me.fire('toggle', button, value, me.getValues());
      });
    }
  },
  getValues: function(){
    var me = this,
      values = [],
      items = me.items,
      i = 0,
      iL = items.length;

    for(;i<iL;i++){
      values.push(items[i].pressed);
    }

    return values;
  },
  /*
   *
   */
  clear: function(fire){
    var me = this,
      items = me.items,
      i = 0,
      iL = items.length;

    for(;i<iL;i++){
      items[i].setPressed(false, fire);
    }
  }
});
/**
 * @class Fancy.toolbar.Tab
 * @extends Fancy.Button
 */
Fancy.define('Fancy.toolbar.Tab', {
  extend: Fancy.Button,
  /*
   * @constructor
   * @param config
   * @param scope
   */
  constructor: function(config, scope){
    this.Super('const', arguments);
  },
  /*
   *
   */
  init: function(){
    this.Super('init', arguments);
  },
  cls: Fancy.BUTTON_CLS + ' ' + Fancy.TAB_TBAR_CLS,
  /*
   *
   */
  render: function(){
    this.Super('render', arguments);
  }
});
(function() {
  //SHORTCUTS
  var F = Fancy;

  //CONSTANTS
  var MENU_CLS = F.MENU_CLS;
  var MENU_ITEM_CLS = F.MENU_ITEM_CLS;
  var MENU_ITEM_IMAGE_CLS =  F.MENU_ITEM_IMAGE_CLS;
  var MENU_ITEM_TEXT_CLS = F.MENU_ITEM_TEXT_CLS;
  var MENU_ITEM_ACTIVE_CLS = F.MENU_ITEM_ACTIVE_CLS;
  var MENU_ITEM_RIGHT_IMAGE_CLS = F.MENU_ITEM_RIGHT_IMAGE_CLS;
  var MENU_ITEM_EXPAND_CLS = F.MENU_ITEM_EXPAND_CLS;

  /**
   * @class Fancy.Menu
   * @extends Fancy.Widget
   */
  Fancy.define('Fancy.Menu', {
    extend: Fancy.Widget,
    /*
     * @constructor
     * @param {Object} config
     * @param {Object} scope
     */
    constructor: function (config, scope) {
      Fancy.applyConfig(this, config);
      this.Super('const', arguments);
    },
    /*
     *
     */
    init: function () {
      var me = this;

      me.addEvents('hide');
      me.Super('init', arguments);

      me.applyDefaults();
      me.render();
      me.ons();
    },
    /*
     *
     */
    ons: function () {
      var me = this,
        el = me.el;

      el.on('mousedown', me.onItemMouseDown, me, '.' + MENU_ITEM_CLS);
      el.on('click', me.onItemClick, me, '.' + MENU_ITEM_CLS);
      el.on('mouseenter', me.onItemEnter, me, '.' + MENU_ITEM_CLS);
      el.on('mouseleave', me.onItemLeave, me, '.' + MENU_ITEM_CLS);
    },
    widgetCls: MENU_CLS,
    itemCls: MENU_ITEM_CLS,
    itemImageCls: MENU_ITEM_IMAGE_CLS,
    cls: '',
    extraCls: '',
    width: 142,
    itemHeight: 30,
    rendered: false,
    theme: 'default',
    render: function(){
      var me = this,
        renderTo,
        el = Fancy.get(document.createElement('div'));

      me.fire('beforerender');

      if( me.theme !== 'default' ){
        el.addCls('fancy-theme-' + me.theme);
      }

      el.addClass(
        Fancy.cls,
        me.widgetCls,
        me.cls,
        me.extraCls
    );

      el.css({
        width: me.width,
        height: me.getItemsHeight()
      });

      renderTo = Fancy.get(me.renderTo || document.body);

      me.el = renderTo.dom.appendChild(el.dom);
      me.el = Fancy.get(me.el);

      me.renderItems();

      me.fire('afterrender');
      me.fire('render');

      me.rendered = true;
    },
    /*
     * @return {Number}
     */
    getItemsHeight: function () {
      var height = 0,
        i = 0,
        iL = this.items.length;

      for (; i < iL; i++) {
        height += this.itemHeight;
      }

      return height;
    },
    /*
     *
     */
    renderItems: function () {
      var me = this,
        i = 0,
        iL = me.items.length,
        item;

      for(; i < iL; i++){
        item = me.items[i];
        var itemEl = Fancy.get(document.createElement('div'));
        itemEl.attr('index', i);

        itemEl.addCls(me.itemCls);
        itemEl.css('height', me.itemHeight);
        me.el.dom.appendChild(itemEl.dom);
        item.el = itemEl;

        var imageCls = item.imageCls || '';

        if(item.cls){
          itemEl.addCls(item.cls);
        }

        itemEl.update([
          item.image === false ? '' : '<div class="'+MENU_ITEM_IMAGE_CLS+' ' + imageCls + '"></div>',
          '<div class="' + MENU_ITEM_TEXT_CLS + '"></div>',
          '<div class="'+MENU_ITEM_RIGHT_IMAGE_CLS+' ' + (item.items ? MENU_ITEM_EXPAND_CLS : '') + '"></div>'
        ].join(""));

        if (item.image === false) {
          itemEl.addCls('fancy-menu-item-no-image');
        }

        switch (item.type) {
          case '':
            break;
          default:
            itemEl.select('.' + MENU_ITEM_TEXT_CLS).item(0).update(item.text || '');
        }

        if(item.checked !== undefined){
          me.items[i].checkbox = new Fancy.CheckBox({
            label: false,
            theme: me.theme,
            padding: '1px 8px 0px',
            renderTo: itemEl.select('.' + MENU_ITEM_IMAGE_CLS).item(0).dom,
            value: item.checked
          });
        }
      }
    },
    /*
     *
     */
    applyDefaults: function () {
      var me = this,
        i = 0,
        iL = me.items.length;

      if (!me.defaults) {
        return;
      }

      for (; i < iL; i++) {
        Fancy.applyIf(me.items[i], me.defaults);
      }
    },
    /*
     * @param {Object} e
     */
    onItemClick: function (e) {
      var me = this,
        target = Fancy.get(e.currentTarget),
        index = target.attr('index'),
        item = me.items[index],
        args = [me, item];

      if (item.handler) {
        if (item.scope) {
          item.handler.apply(item.scope, args);
        }
        else {
          item.handler(me, item);
        }
      }
    },
    /*
     * @param {Object} e
     */
    onItemEnter: function (e) {
      var me = this,
        target = Fancy.get(e.currentTarget),
        index = target.attr('index'),
        item = me.items[index],
        offset = target.offset();

      if(me.shownSubMenu){
        me.shownSubMenu.hide();
      }

      me.deActivateItem();
      me.activateItem(index);

      if(item.items){
        if(!item.menu){
          var itemConfig = me.items[index];

          Fancy.apply(itemConfig, {
            parentItem: item,
            parentMenu: me,
            defaults: item.defaults,
            items: item.items,
            theme: me.theme
          });

          me.items[index].menu = new Fancy.Menu(itemConfig);
        }

        item.menu.showAt(offset.left + parseInt(target.width()), offset.top);

        me.shownSubMenu = item.menu;
      }
    },
    /*
     * @param {Object} e
     */
    onItemLeave: function (e) {},
    /*
     * @param {Number} x
     * @param {Number} y
     */
    showAt: function(x, y){
      var me = this;

      me.css('position', 'absolute');
      me.css('left', x);
      me.css('top', y);

      me.el.show();

      if(me.parentMenu){
        return;
      }

      Fancy.MenuManager.add(me);
    },
    /*
     *
     */
    hide: function () {
      var me = this;

      me.el.hide();
      me.deActivateItem();

      if(me.shownSubMenu){
        me.shownSubMenu.hide();
      }

      me.fire('hide');
    },
    /*
     *
     */
    hideAll: function(){
      var parentMenu = this.parentMenu;

      if(parentMenu && parentMenu.el.css('display') !== 'none'){
        parentMenu.hide();
      }

      this.hide();
    },
    /*
     * @param {Number} index
     */
    activateItem: function (index) {
      var item = this.items[index];

      this.activeItem = item;
      item.el.addCls(MENU_ITEM_ACTIVE_CLS);
    },
    /*
     *
     */
    deActivateItem: function () {
      var activeItem = this;

      if (!activeItem) {
        return;
      }

      activeItem.el.removeClass(MENU_ITEM_ACTIVE_CLS);
      delete this.activeItem;
    },
    /*
     * @param {Object} e
     */
    onItemMouseDown: function(e) {
      e.preventDefault();
    }
  });

  Fancy.define('Fancy.MenuManager', {
    singleton: true,
    inited: false,
    constructor: function(){},
    /*
     *
     */
    init: function(){
      var docEl = Fancy.get(document);

      docEl.on('click', this.onDocClick, this);
    },
    /*
     * @param {Object} menu
     */
    add: function(menu){
      var me = this;

      if(!me.inited){
        me.init();
      }

      me.activeMenu = menu;
    },
    /*
     * @param {Object} e
     */
    onDocClick: function(e){
      var me = this,
        target = Fancy.get(e.target),
        maxDepth = 10,
        parentEl = target;

      if(!me.activeMenu){
        return;
      }

      while(maxDepth > 0){
        if( !parentEl.dom ){
          break;
        }

        if( parentEl.hasCls(MENU_CLS) ){
          return;
        }

        parentEl = parentEl.parent();
        maxDepth--;
      }

      me.activeMenu.hide();
      delete me.activeMenu;
    }
  })

})();
/*
 * @mixin Fancy.panel.mixin.PrepareConfig
 */
(function () {
  //SHORTCUTS
  var F = Fancy;

  //CONSTANTS
  var FOOTER_STATUS_CLS = F.FOOTER_STATUS_CLS;
  var STATUS_SOURCE_TEXT_CLS = F.STATUS_SOURCE_TEXT_CLS;
  var STATUS_SOURCE_LINK_CLS = F.STATUS_SOURCE_LINK_CLS;
  var FOOTER_SOURCE_CLS = F.FOOTER_SOURCE_CLS;

  Fancy.Mixin('Fancy.panel.mixin.PrepareConfig', {
    /*
     * @param {Object} config
     * @param {Object} originalConfig
     * @return {Object}
     */
    prepareConfigTheme: function (config, originalConfig) {
      var themeName = config.theme || originalConfig.theme,
        themeConfig = Fancy.getTheme(themeName).config;

      if (Fancy.isObject(themeName)) {
        config.theme = themeName.name;
      }

      Fancy.applyIf(config, themeConfig);

      return config;
    },
    //The same in grid
    /*
     * @param {Object} config
     * @return {Object}
     */
    prepareConfigFooter: function (config) {
      var footer = config.footer,
        lang = config.lang;

      if (footer) {
        var bar = [];

        if (Fancy.isString(footer.status)) {
          bar.push({
            type: 'text',
            text: footer.status,
            cls: FOOTER_STATUS_CLS
          });
        }

        if (footer.status && footer.source) {
          bar.push('side');
        }

        if (Fancy.isString(footer.source)) {
          bar.push({
            type: 'text',
            text: footer.source,
            cls: FOOTER_SOURCE_CLS
          });
        }
        else if (Fancy.isObject(footer.source)) {
          var text = footer.source.text,
            sourceText = footer.source.sourceText || lang.sourceText;

          if (footer.source.link) {
            var link = footer.source.link;

            link = link.replace('http://', '');
            link = 'http://' + link;

            text = '<span class="' + STATUS_SOURCE_TEXT_CLS + '">' + sourceText + '</span>: <a class="' + STATUS_SOURCE_LINK_CLS + '" href="' + link + '">' + text + '</a>';
          }
          else {
            text = '<span>' + sourceText + ':</span> ' + text;
          }

          bar.push({
            type: 'text',
            text: text,
            cls: FOOTER_SOURCE_CLS
          });
        }

        config.footer = bar;
      }

      return config;
    },
    /*
     * @param {Object} config
     * @param {Object} originalConfig
     * @return {Object}
     */
    prepareConfigLang: function (config, originalConfig) {
      var i18n = originalConfig.i18n || config.i18n,
        lang = Fancy.Object.copy(Fancy.i18n[i18n]);

      if (config.lang) {
        for (var p in config.lang) {
          if (Fancy.isObject(config.lang[p]) === false) {
            lang[p] = config.lang[p];
          }
        }

        lang.paging = {};
        if (config.lang.paging) {
          Fancy.apply(lang.paging, config.lang.paging);
        }

        for (var p in config.lang.paging) {
          if (p === 'paging') {
            continue;
          }

          if (Fancy.isObject(p)) {
            continue;
          }

          lang[p] = config.lang.paging[p];
        }

        lang.date = {};
        if (config.lang.date) {
          Fancy.apply(lang.date, config.lang.date);
        }
      }

      config.lang = lang;

      return config;
    }
  });

})();
/*
 * @mixin Fancy.panel.mixin.methods
 */
Fancy.Mixin('Fancy.panel.mixin.methods', {
  /*
   * @param {String} value
   */
  setTitle: function(value){
    if(this.panel){
      this.panel.setTitle(value);
    }
  },
  /*
   * @return {String}
   */
  getTitle: function(){
    if(this.panel){
      return this.panel.getTitle();
    }
  },
  /*
   * @param {String} value
   */
  setSubTitle: function(value){
    if(this.panel){
      this.panel.setSubTitle(value);
    }
  },
  /*
   * @return {String}
   */
  getSubTitle: function(){
    if(this.panel){
      return this.panel.getSubTitle();
    }
  }
});
/*
 * @mixin Fancy.panel.mixin.DD
 */
Fancy.Mixin('Fancy.panel.mixin.DD', {
  ddCls: Fancy.PANEL_DRAGGABLE_CLS,
  /*
   *
   */
  initDD: function(){
    this.addDDCls();
    this.addDD();
  },
  /*
   *
   */
  addDDCls: function(){
    this.el.addCls(this.ddCls);
  },
  /*
   *
   */
  addDD: function(){
    Fancy.DD.add({
      dragEl: this.el,
      overEl: this.el.select('.' + Fancy.PANEL_HEADER_CLS).item(0)
    });
  }
});
/*
 * @mixin Fancy.panel.mixin.Resize
 */
Fancy.Mixin('Fancy.panel.mixin.Resize', {
  cornerResizeCls: 'fancy-panel-resize-corner',
  resizeMaskCls: 'fancy-panel-resize-mask',
  /*
   *
   */
  initResize: function(){
    var me = this;

    me.addEvents('resize');
    me.activeResizeEl = undefined;

    me.renderResizeEls();
    me.onsResizeEls();
  },
  /*
   *
   */
  renderResizeEls: function(){
    var me = this,
      el = me.el,
      cornerEl = Fancy.get(document.createElement('div'));

    cornerEl.addCls(me.cornerResizeCls);

    me.cornerResizeEl = Fancy.get(el.dom.appendChild(cornerEl.dom));
  },
  /*
   *
   */
  onResize: function(){
    var me = this;

    if(me.tbar){
      me._tbar.applyScrollChanges();
    }

    if(me.subTBar){
      me._subTBar.applyScrollChanges();
    }

    if(me.bbar){
      me._bbar.applyScrollChanges();
    }

    if(me.footer){
      me._footer.applyScrollChanges();
    }

    if(me.buttons){
      me._buttons.applyScrollChanges();
    }
  },
  /*
   * @param {Boolean} initRun
   */
  onsResizeEls: function(initRun){
    var me = this;

    me.cornerResizeEl.on('mousedown', me.onMouseDownResizeEl, me);

    me.on('resize', me.onResize, me);
  },
  /*
   * @param {Object} e
   */
  onMouseDownResizeEl: function(e){
    var me = this,
      docEl = Fancy.get(document);

    e.preventDefault();
    docEl.once('mouseup', me.onMouseUpResize, me);
    docEl.on('mousemove', me.onMouseMoveResize, me);
    me.renderResizeMask();

    me.startClientX = e.clientX;
    me.startClientY = e.clientY;
  },
  /*
   *
   */
  onMouseUpResize: function(){
    var me = this,
      docEl = Fancy.get(document);

    delete me.activeResizeEl;
    me.resizeMaskEl.destroy();

    delete me.startClientX;
    delete me.startClientY;

    docEl.un('mousemove', me.onMouseMoveResize, me);

    me.setWidth(me.newResizeWidth);
    me.setHeight(me.newResizeHeight);

    me.fire('resize', {
      width: me.newResizeWidth,
      height: me.newResizeHeight
    });
  },
  /*
   * @param {Object} e
   */
  onMouseMoveResize: function(e){
    var me = this,
      clientX = e.clientX,
      clientY = e.clientY,
      deltaX = me.startClientX - clientX,
      deltaY = me.startClientY - clientY,
      newWidth = me.startResizeWidth - deltaX,
      newHeight = me.startResizeHeight - deltaY;

    e.preventDefault();
    e.stopPropagation();

    if(newWidth < me.minWidth){
      newWidth = me.minWidth;
    }

    if(newHeight < me.minHeight){
      newHeight = me.minHeight;
    }

    me.newResizeWidth = newWidth;
    me.newResizeHeight = newHeight;

    me.resizeMaskEl.css({
      width: newWidth,
      height: newHeight
    })
  },
  /*
   *
   */
  renderResizeMask: function(){
    var me = this,
      el = me.el,
      maskWidth = 2;

    var maskEl = Fancy.get(document.createElement('div')),
      panelTop = parseInt(el.css('top')),
      panelLeft = parseInt(el.css('left')),
      panelWidth = parseInt(el.css('width')) - maskWidth * 2,
      panelHeight = parseInt(el.css('height')) - maskWidth * 2,
      panelZIndex = parseInt(el.css('z-index'));

    me.startResizeWidth = panelWidth;
    me.startResizeHeight = panelHeight;

    if(!me.window && el.css('position') !== 'absolute'){
      var offset = el.offset();

      panelTop = offset.top;
      panelLeft = offset.left;
    }

    maskEl.addCls(me.resizeMaskCls);

    maskEl.css({
      left: panelLeft,
      top: panelTop,
      width: panelWidth,
      height: panelHeight,
      'z-index': panelZIndex
    });

    me.resizeMaskEl = Fancy.get(document.body.appendChild(maskEl.dom));
  }
});
/*
 * @class Fancy.Panel
 * @extends Fancy.Widget
 */
(function () {
  //SHORTCUTS
  var F = Fancy;

  /*
   * CONSTANTS
   */
  var HIDDEN_CLS = F.HIDDEN_CLS;
  var MODAL_CLS = F.MODAL_CLS;
  var PANEL_CLS = F.PANEL_CLS;
  var PANEL_HEADER_CLS = F.PANEL_HEADER_CLS;
  var PANEL_SUB_HEADER_TEXT_CLS = F.PANEL_SUB_HEADER_TEXT_CLS;
  var PANEL_HEADER_TEXT_CLS = F.PANEL_HEADER_TEXT_CLS;
  var PANEL_HEADER_TOOLS_CLS = F.PANEL_HEADER_TOOLS_CLS;
  var PANEL_SUB_HEADER_CLS = F.PANEL_SUB_HEADER_CLS;
  var PANEL_BODY_CLS = F.PANEL_BODY_CLS;
  var PANEL_BODY_INNER_CLS = F.PANEL_BODY_INNER_CLS;
  var PANEL_TBAR_CLS = F.PANEL_TBAR_CLS;
  var PANEL_SUB_TBAR_CLS = F.PANEL_SUB_TBAR_CLS;
  var PANEL_BUTTONS_CLS = F.PANEL_BUTTONS_CLS;
  var PANEL_BBAR_CLS = F.PANEL_BBAR_CLS;
  var PANEL_HEADER_IMG_CLS = F.PANEL_HEADER_IMG_CLS;
  var PANEL_NOFRAME_CLS = F.PANEL_NOFRAME_CLS;
  var PANEL_SHADOW_CLS = F.PANEL_SHADOW_CLS;
  var PANEL_FOOTER_CLS = F.PANEL_FOOTER_CLS;
  var FIELD_PICKER_BUTTON_CLS = F.FIELD_PICKER_BUTTON_CLS;

  F.define('Fancy.Panel', {
    extend: F.Widget,
    barScrollEnabled: true,
    mixins: [
      'Fancy.panel.mixin.DD',
      'Fancy.panel.mixin.Resize'
    ],
    /*
     * @param {Object} config
     */
    constructor: function (config) {
      F.apply(this, config);
      this.Super('constructor', arguments);
    },
    /*
     *
     */
    init: function () {
      var me = this;

      me.Super('init', arguments);

      me.initTpl();
      me.render();

      if (me.draggable) {
        me.initDD();
      }

      if (me.resizable) {
        me.initResize();
      }

      if (me.window) {
        me.setActiveWindowWatcher();
      }
    },
    cls: PANEL_CLS,
    value: '',
    width: 300,
    height: 200,
    titleHeight: 30,
    subTitleHeight: 30,
    barHeight: 37,
    title: undefined,
    frame: true,
    shadow: true,
    draggable: false,
    minWidth: 200,
    minHeight: 200,
    barContainer: true,
    theme: 'default',
    tpl: [
      '<div style="height:{titleHeight}px;" class="'+PANEL_HEADER_CLS+' '+HIDDEN_CLS+'">',
        '{titleImg}',
        '<div class="' + PANEL_HEADER_TEXT_CLS + '">{title}</div>',
        '<div class="' + PANEL_HEADER_TOOLS_CLS + '"></div>',
      '</div>',
      '<div style="height:{subTitleHeight}px;" class="' + PANEL_SUB_HEADER_CLS + ' '+HIDDEN_CLS+'">',
        '<div class="' + PANEL_SUB_HEADER_TEXT_CLS + '">{subTitle}</div>',
      '</div>',
      '<div class="' + PANEL_BODY_CLS + '">',
        '<div class="' + PANEL_TBAR_CLS + ' '+HIDDEN_CLS+'" style="height:{barHeight}px;"></div>',
        '<div class="' + PANEL_SUB_TBAR_CLS + ' '+HIDDEN_CLS+'" style="height:{barHeight}px;"></div>',
        '<div class="' + PANEL_BODY_INNER_CLS + '"></div>',
        '<div class="' + PANEL_BBAR_CLS + ' '+HIDDEN_CLS+'" style="height:{barHeight}px;"></div>',
        '<div class="' + PANEL_BUTTONS_CLS + ' '+HIDDEN_CLS+'" style="height:{barHeight}px;"></div>',
        '<div class="' + PANEL_FOOTER_CLS + ' '+HIDDEN_CLS+'" style="height:{barHeight}px;"></div>',
      '</div>'
    ],
    /*
     *
     */
    render: function () {
      var me = this,
        renderTo = F.get(me.renderTo || document.body),
        el = F.get(document.createElement('div')),
        minusHeight = 0,
        titleHeight = me.titleHeight,
        subTitleHeight = me.subTitleHeight;

      if (me.window === true) {
        el.css({
          display: 'none',
          position: 'absolute'
        });
      }

      if (me.frame === false) {
        el.addCls(PANEL_NOFRAME_CLS);
      }

      el.addCls(F.cls, me.cls);
      if (me.theme !== 'default') {
        el.addCls('fancy-theme-' + me.theme);
      }

      if (me.shadow) {
        el.addCls(PANEL_SHADOW_CLS);
      }

      el.css({
        width: me.width + 'px',
        height: (me.height - minusHeight) + 'px'
      });

      if (me.style) {
        el.css(me.style);
      }

      var titleText = '',
        subTitleText = '';

      if (F.isObject(me.title)) {
        titleText = me.title.text
      }
      else if (F.isString(me.title)) {
        titleText = me.title
      }

      if (F.isObject(me.subTitle)) {
        subTitleText = me.subTitle.text
      }
      else if (F.isString(me.subTitle)) {
        subTitleText = me.subTitle
      }

      var imgCls = '';

      if (F.isObject(me.title) && me.title.imgCls) {
        imgCls = '<div class="' + PANEL_HEADER_IMG_CLS + ' ' + me.title.imgCls + '"></div>';
      }

      el.update(me.tpl.getHTML({
        titleImg: imgCls,
        barHeight: me.barHeight,
        titleHeight: titleHeight,
        subTitleHeight: subTitleHeight,
        title: titleText,
        subTitle: subTitleText
      }));

      if (F.isObject(me.title)) {
        if (me.title.style) {
          el.select('.' + PANEL_HEADER_CLS).css(me.title.style);
        }

        if (me.title.cls) {
          el.select('.' + PANEL_HEADER_CLS).addCls(me.title.cls);
        }

        if (me.title.tools) {
          me.tools = me.title.tools;
        }
      }

      if (F.isObject(me.subTitle)) {
        if (me.subTitle.style) {
          el.select('.' + PANEL_SUB_HEADER_CLS).css(me.subTitle.style);
        }

        if (me.subTitle.cls) {
          el.select('.' + PANEL_SUB_HEADER_CLS).addCls(me.subTitle.cls);
        }
      }

      if (me.title) {
        el.select('.' + PANEL_HEADER_CLS).removeCls(HIDDEN_CLS);
      }
      else {
        el.select('.' + PANEL_BODY_CLS).css('border-top-width', '0px');
      }

      if (me.subTitle) {
        el.select('.' + PANEL_BODY_CLS).css('border-top-width', '0px');
        el.select('.' + PANEL_SUB_HEADER_CLS).removeCls(HIDDEN_CLS);
      }

      if (me.tbar) {
        el.select('.' + PANEL_TBAR_CLS).removeCls(HIDDEN_CLS);
      }

      if (me.subTBar) {
        el.select('.' + PANEL_SUB_TBAR_CLS).removeCls(HIDDEN_CLS);
      }

      if (me.bbar) {
        el.select('.' + PANEL_BBAR_CLS).removeCls(HIDDEN_CLS);
      }

      if (me.buttons) {
        el.select('.' + PANEL_BUTTONS_CLS).removeCls(HIDDEN_CLS);
      }

      if (me.footer) {
        el.select('.' + PANEL_FOOTER_CLS).removeCls(HIDDEN_CLS);
      }

      me.el = renderTo.dom.appendChild(el.dom);
      me.el = F.get(me.el);

      if (me.modal) {
        if (F.select(MODAL_CLS).length === 0) {
          F.get(document.body).append('<div class="'+MODAL_CLS+'" style="display: none;"></div>');
        }
      }

      if (me.id) {
        me.el.attr('id', me.id);
      }

      me.renderTools();
      me.renderBars();

      me.setHardBordersWidth();
    },
    /*
     *
     */
    setHardBordersWidth: function () {
      var panelBodyBorders = this.panelBodyBorders;

      this.el.select('.' + PANEL_BODY_CLS).css({
        'border-top-width': panelBodyBorders[0],
        'border-right-width': panelBodyBorders[1],
        'border-bottom-width': panelBodyBorders[2],
        'border-left-width': panelBodyBorders[3]
      })
    },
    /*
     *
     */
    renderTools: function () {
      var me = this,
        tools = me.tools;

      if (tools === undefined) {
        return;
      }

      F.each(tools, function (tool, i) {
        tool.renderTo = me.el.select('.' + PANEL_HEADER_TOOLS_CLS).dom;
        me.tools[i] = new F.Tool(tool, me.scope || me);
      });
    },
    /*
     *
     */
    renderBars: function () {
      var me = this,
        containsGrid = false,
        theme = me.theme,
        scope = this;

      if (me.items && me.items[0]) {
        if (me.items[0].type === 'grid') {
          containsGrid = true;
        }

        scope = me.items[0];
      }

      if (me.bbar) {
        me._bbar = new F.Bar({
          el: me.el.select('.' + PANEL_BBAR_CLS),
          items: me.bbar,
          height: me.barHeight,
          barContainer: me.barContainer,
          barScrollEnabled: me.barScrollEnabled,
          scope: scope,
          theme: theme
        });

        me.bbar = me._bbar.items;
      }

      if (me.buttons) {
        me._buttons = new F.Bar({
          el: me.el.select('.' + PANEL_BUTTONS_CLS),
          items: me.buttons,
          height: me.barHeight,
          barScrollEnabled: me.barScrollEnabled,
          scope: scope,
          theme: theme
        });

        me.buttons = me._buttons.items;
      }

      if (me.tbar) {
        me._tbar = new F.Bar({
          el: me.el.select('.' + PANEL_TBAR_CLS),
          items: me.tbar,
          height: me.barHeight,
          tabEdit: !me.subTBar && containsGrid,
          barScrollEnabled: me.barScrollEnabled,
          scope: scope,
          theme: theme
        });

        me.tbar = me._tbar.items;
      }

      if (me.subTBar) {
        me._subTBar = new F.Bar({
          el: me.el.select('.' + PANEL_SUB_TBAR_CLS),
          items: me.subTBar,
          height: me.barHeight,
          tabEdit: containsGrid,
          barScrollEnabled: me.barScrollEnabled,
          scope: scope,
          theme: theme
        });

        me.subTBar = me._subTBar.items;
      }

      if (me.footer) {
        me._footer = new F.Bar({
          disableScroll: true,
          el: me.el.select('.' + PANEL_FOOTER_CLS),
          items: me.footer,
          height: me.barHeight,
          barScrollEnabled: me.barScrollEnabled,
          scope: scope,
          theme: theme
        });

        me.footer = me._footer.items;
      }
    },
    /*
     * @param {Number} x
     * @param {Number} y
     */
    showAt: function (x, y) {
      this.css({
        left: x + 'px',
        display: '',
        'z-index': 1000 + F.zIndex++
      });

      if (y !== undefined) {
        this.css({
          top: y + 'px'
        });
      }
    },
    /*
     *
     */
    show: function () {
      var me = this;

      me.el.show();

      if (me.window !== true) {
        return;
      }

      if (me.buttons) {
        me._buttons.checkScroll();
      }

      if (me.tbar) {
        me._tbar.checkScroll();
      }

      if (me.bbar) {
        me._bbar.checkScroll();
      }

      if (me.subTBar) {
        me._subTBar.checkScroll();
      }

      var viewSize = F.getViewSize(),
        height = me.el.height(),
        width = me.el.width(),
        xy = [],
        scroll = F.getScroll(),
        scrollTop = scroll[0],
        scrollLeft = scroll[1];

      xy[0] = (viewSize[1] - width) / 2;
      xy[1] = (viewSize[0] - height) / 2;

      if (xy[0] < 10) {
        xy[0] = 10;
      }

      if (xy[1] < 10) {
        xy[1] = 10;
      }

      me.css({
        left: (xy[0] + scrollLeft) + 'px',
        top: (xy[1] + scrollTop) + 'px',
        display: '',
        'z-index': 1000 + F.zIndex++
      });

      F.select('.' + MODAL_CLS).css('display', '');
    },
    /*
     *
     */
    hide: function () {
      this.css({
        display: 'none'
      });

      F.select('.' + MODAL_CLS).css('display', 'none');

      F.each(this.items || [], function (item) {
        if (item.type === 'combo') {
          item.hideList();
        }
      });
    },
    /*
     * @param {String} value
     */
    setTitle: function (value) {
      this.el.select('.' + PANEL_HEADER_TEXT_CLS).update(value);
    },
    /*
     * @return {String}
     */
    getTitle: function () {
      return this.el.select('.' + PANEL_HEADER_TEXT_CLS).dom.innerHTML;
    },
    /*
     * @param {String} value
     */
    setSubTitle: function (value) {
      this.el.select('.' + PANEL_SUB_HEADER_TEXT_CLS).update(value);
    },
    /*
     * @return {String}
     */
    getSubTitle: function () {
      return this.el.select('.' + PANEL_SUB_HEADER_TEXT_CLS).dom.innerHTML;
    },
    /*
     * @return {Number}
     */
    getHeight: function () {
      return parseInt(this.css('height'));
    },
    /*
     * @param {String} value
     */
    setWidth: function (value) {
      //TODO: Redo
      this.items[0].setWidth(value);
    },
    /*
     * @param {Number} value
     */
    setHeight: function (value) {
      this.css('height', value);
      this.items[0].setHeight(value, false);
    },
    /*
     *
     */
    setActiveWindowWatcher: function () {
      var me = this;

      me.el.on('click', function (e) {
        var targetEl = F.get(e.target);

        if (targetEl.hasCls(FIELD_PICKER_BUTTON_CLS)) {
          return;
        }

        if (1000 + F.zIndex - 1 > parseInt(me.css('z-index'))) {
          me.css('z-index', 1000 + F.zIndex++);
        }
      });
    }
  });

})();
/**
 * @class Fancy.Tool
 * @extends Fancy.Widget
 */
(function(){
  //SHORTCUTS
  var F = Fancy;

  //CONSTANTS
  var BUTTON_CLS = F.BUTTON_CLS;

  F.define('Fancy.Tool', {
    extend: F.Widget,
    /*
     * @constructor
     * @param {Object} config
     * @param {Object} scope
     */
    constructor: function (config, scope) {
      this.scope = scope;
      this.Super('const', arguments);
    },
    /*
     *
     */
    init: function () {
      var me = this;

      me.addEvents('click', 'mousedown', 'mouseup', 'mouseover', 'mouseout');
      me.Super('init', arguments);

      me.style = me.style || {};

      me.render();
      me.ons();
    },
    /*
     *
     */
    ons: function () {
      this.on('click', this.onClick, this);
    },
    cls: BUTTON_CLS,
    text: '',
    height: 28,
    paddingTextWidth: 5,
    /*
     *
     */
    render: function () {
      var me = this,
        renderTo = F.get(me.renderTo || document.body).dom,
        el = document.createElement('div');

      me.fire('beforerender');

      el.className = 'fancy-tool-button';
      el.innerHTML = me.text;
      me.el = F.get(renderTo.appendChild(el));

      me.fire('afterrender');
      me.fire('render');
    },
    /*
     *
     */
    onClick: function () {
      var me = this;

      me.fire('click');
      if (me.handler) {
        if (me.scope) {
          me.handler.apply(me.scope, [me]);
        }
        else {
          me.handler(me);
        }
      }
    },
    /*
     * @param {String} value
     */
    setText: function (value) {
      this.el.update(value)
    }
  });

})();
/**
 * @class Fancy.panel.Tab
 */
(function () {
  //SHORTCUTS
  var F = Fancy;

  //CONSTANTS
  var PANEL_BODY_INNER_CLS = F.PANEL_BODY_INNER_CLS;
  var PANEL_GRID_INSIDE_CLS = F.PANEL_GRID_INSIDE_CLS;
  var TAB_WRAPPER_CLS = F.TAB_WRAPPER_CLS;
  var TAB_ACTIVE_WRAPPER_CLS = F.TAB_ACTIVE_WRAPPER_CLS;
  var TAB_TBAR_ACTIVE_CLS = F.TAB_TBAR_ACTIVE_CLS;
  var PANEL_TAB_CLS = F.PANEL_TAB_CLS;

  F.define(['Fancy.panel.Tab', 'Fancy.Tab', 'FancyTab'], {
    extend: F.Panel,
    /*
     * @constructor
     * @param config
     * @param scope
     */
    constructor: function (config, scope) {
      this.prepareConfigTheme(config);
      this.Super('const', arguments);
    },
    /*
     *
     */
    init: function () {
      var me = this;

      me.prepareTabs();
      me.Super('init', arguments);

      me.setActiveTab(me.activeTab);
    },
    activeTab: 0,
    theme: 'default',
    /*
     *
     */
    render: function () {
      var me = this;

      me.Super('render', arguments);

      me.panelBodyEl = me.el.select('.' + PANEL_BODY_INNER_CLS).item(0);

      me.setPanelBodySize();

      me.renderTabWrappers();

      if (!me.wrapped) {
        me.el.addCls(PANEL_GRID_INSIDE_CLS);
      }
      me.el.addCls(PANEL_TAB_CLS);

      me.rendered = true;
    },
    setPanelBodySize: function () {
      var me = this,
        height = me.height,
        panelBodyBorders = me.panelBodyBorders;

      if (me.title) {
        height -= me.titleHeight;
      }

      if (me.subTitle) {
        height -= me.subTitleHeight;
        height += panelBodyBorders[2];
      }

      if (me.bbar) {
        height -= me.barHeight;
      }

      if (me.tbar) {
        height -= me.barHeight;
      }

      if (me.subTBar) {
        height -= me.barHeight;
      }

      if (me.buttons) {
        height -= me.barHeight;
      }

      if (me.footer) {
        height -= me.barHeight;
      }

      height -= panelBodyBorders[0] + panelBodyBorders[2];

      me.panelBodyEl.css({
        height: height
      });

      me.panelBodyHeight = height;
      me.panelBodyWidth = me.width - panelBodyBorders[1] - panelBodyBorders[3];
      //me.panelBodyWidth = me.width;
    },
    prepareConfigTheme: function (config) {
      var me = this,
        themeName = config.theme || me.theme,
        themeConfig = F.getTheme(themeName).config,
        wrapped = me.wrapped || config.wrapped;

      if (wrapped) {
        config.panelBodyBorders = [0, 0, 0, 0];
        me.panelBodyBorders = [0, 0, 0, 0];
      }

      F.applyIf(config, themeConfig);
      F.apply(me, config);
    },
    prepareTabs: function () {
      var me = this,
        tabs = [],
        i = 0,
        iL = me.items.length;

      for (; i < iL; i++) {
        var item = me.items[i],
          tabConfig = {
            type: 'tab'
          };

        if (item.tabTitle) {
          tabConfig.text = item.tabTitle;
        }
        else if (item.title) {
          tabConfig.text = item.title;
          delete item.title;
        }

        tabConfig.handler = (function (i) {
          return function () {
            me.setActiveTab(i);
          }
        })(i);

        tabs.push(tabConfig);
      }

      me.tbar = tabs;
      me.tabs = tabs;
    },
    renderTabWrappers: function () {
      var me = this;

      F.each(me.items, function (item) {
        var el = F.get(document.createElement('div'));

        el.addCls(TAB_WRAPPER_CLS);

        item.renderTo = me.panelBodyEl.dom.appendChild(el.dom);
      });
    },
    setActiveTab: function (newActiveTab) {
      var me = this,
        tabs = me.el.select('.' + TAB_WRAPPER_CLS),
        oldActiveTab = me.activeTab;

      if (me.items.length === 0) {
        return;
      }

      tabs.item(me.activeTab).removeCls(TAB_ACTIVE_WRAPPER_CLS);
      me.activeTab = newActiveTab;

      tabs.item(me.activeTab).addCls(TAB_ACTIVE_WRAPPER_CLS);

      var item = me.items[me.activeTab];

      item.theme = me.theme;
      item.wrapped = true;

      item.width = me.panelBodyWidth;
      item.height = me.panelBodyHeight;

      if (!item.rendered) {
        switch (item.type) {
          case 'grid':
            me.items[me.activeTab] = new FancyGrid(item);
            break;
          case 'tab':
            me.items[me.activeTab] = new FancyTab(item);
            break;
        }
      }
      else {
        me.setActiveItemWidth();
        me.setActiveItemHeight();
      }

      if (me.tabs) {
        me.tbar[oldActiveTab].removeCls(TAB_TBAR_ACTIVE_CLS);
        me.tbar[me.activeTab].addCls(TAB_TBAR_ACTIVE_CLS);
      }
    },
    /*
     * @param {String} value
     */
    setWidth: function (value) {
      var me = this;

      me.width = value;

      me.css('width', value);
      me.setPanelBodySize();

      me.setActiveItemWidth();
    },
    /*
     * @param {Number} value
     */
    setHeight: function (value) {
      var me = this;

      me.height = value;

      me.css('height', value);
      me.setPanelBodySize();

      me.setActiveItemHeight();
    },
    setActiveItemWidth: function () {
      var me = this;

      me.items[me.activeTab].setWidth(me.panelBodyWidth);
    },
    setActiveItemHeight: function () {
      var me = this;

      me.items[me.activeTab].setHeight(me.panelBodyHeight, false);
    }
  });

  FancyTab.get = function (id) {
    var tabId = F.get(id).select('.' + PANEL_TAB_CLS).dom.id;

    return F.getWidget(tabId);
  };

  if (!F.nojQuery && F.$) {
    F.$.fn.FancyTab = function (o) {
      o.renderTo = $(this.selector)[0].id;

      return new FancyTab(o);
    };
  }

})();
/**
 * @class Fancy.toolbar.Tab
 * @extends Fancy.Button
 */
Fancy.define('Fancy.toolbar.Tab', {
  extend: Fancy.Button,
  /*
   * @constructor
   * @param config
   * @param scope
   */
  constructor: function(config, scope){
    this.Super('const', arguments);
  },
  /*
   *
   */
  init: function(){
    this.Super('init', arguments);
  },
  cls: Fancy.BUTTON_CLS + ' ' + Fancy.TAB_TBAR_CLS,
  /*
   *
   */
  render: function(){
    this.Super('render', arguments);
  }
});
/*
 * @class Fancy.Bar
 * @extends Fancy.Widget
 */
(function () {
  //SHORTCUTS
  var F = Fancy;

  //CONSTANTS
  var GRID_CLS = F.GRID_CLS;
  var GRID_CELL_CLS = F.GRID_CELL_CLS;

  var BAR_CLS = F.BAR_CLS;
  var BAR_CONTAINER_CLS = F.BAR_CONTAINER_CLS;
  var BAR_BUTTON_CLS = F.BAR_BUTTON_CLS;
  var BAR_SEG_BUTTON_CLS = F.BAR_SEG_BUTTON_CLS;
  var BAR_LEFT_SCROLLER_CLS = F.BAR_LEFT_SCROLLER_CLS;
  var BAR_RIGHT_SCROLLER_CLS = F.BAR_RIGHT_SCROLLER_CLS;

  var FIELD_LABEL_CLS = F.FIELD_LABEL_CLS;
  var FIELD_TEXT_CLS = F.FIELD_TEXT_CLS;
  var FIELD_TEXT_INPUT_CLS = F.FIELD_TEXT_INPUT_CLS;
  var FIELD_SEARCH_CLS = F.FIELD_SEARCH_CLS;
  var FIELD_SEARCH_LIST_CLS = F.FIELD_SEARCH_LIST_CLS;
  var FIELD_SEARCH_PARAMS_LINK_CLS = F.FIELD_SEARCH_PARAMS_LINK_CLS;
  var FIELD_SEARCH_PARAMED_CLS = F.FIELD_SEARCH_PARAMED_CLS;
  var FIELD_SEARCH_PARAMED_EMPTY_CLS = F.FIELD_SEARCH_PARAMED_EMPTY_CLS;

  var PICKER_MONTH_ACTION_BUTTONS_CLS = F.PICKER_MONTH_ACTION_BUTTONS_CLS;
  var CLEARFIX_CLS = F.CLEARFIX_CLS;

  F.define('Fancy.Bar', {
    extend: F.Widget,
    widgetCls: BAR_CLS,
    containerCls: BAR_CONTAINER_CLS,
    cls: '',
    text: '',
    floating: 'left',
    sideRight: 0,
    scrolled: 0,
    tabOffSet: 5,
    barScrollEnabled: true,
    /*
     * constructor
     * @param {Object} config
     */
    constructor: function (config) {
      F.apply(this, config);
      this.init();
    },
    /*
     *
     */
    init: function () {
      var me = this;

      me.roles = {};
      me.render();

      if (me.barScrollEnabled) {
        me.initScroll();
        setTimeout(function () {
          me.checkScroll();
        }, 50);
      }
    },
    /*
     *
     */
    render: function () {
      var me = this;

      me.renderEl();
      me.renderItems();
      me.initTabEdit();
    },
    /*
     *
     */
    renderEl: function () {
      var me = this;

      if (!me.el) {
        var el = F.get(document.createElement('div'));

        el.addCls(
          me.widgetCls,
          me.cls
        );

        el.update(me.text);

        me.el = F.get(me.renderTo.appendChild(el.dom));

        if (me.style) {
          me.el.css(me.style);
        }
      }

      var containerEl = F.get(document.createElement('div'));
      containerEl.addCls(me.containerCls);

      me.containerEl = F.get(me.el.dom.appendChild(containerEl.dom));
    },
    /*
     *
     */
    renderItems: function () {
      var me = this,
        containerEl = me.containerEl,
        items = me.items || [],
        i = 0,
        iL = items.length,
        isSide = false,
        barItems = [],
        sidePassed = iL - 1;

      for (; i < iL; i++) {
        var item = items[i];

        if (isSide) {
          item = items[sidePassed];
          sidePassed--;
        }

        if (item.toggleGroup) {
          item.enableToggle = true;
        }

        if (F.isObject(item)) {
          item.type = item.type || 'button';
        }

        if (isSide) {
          me.floating = 'right';
        }

        //item.renderTo = el.dom;
        item.renderTo = containerEl.dom;

        switch (item) {
          case '|':
            var style = {
              'float': me.floating,
              'margin-right': '5px',
              'margin-top': '6px',
              'padding-left': '0px'
            };

            if (me.floating === 'right') {
              F.applyIf(style, {
                right: '1px',
                position: 'absolute'
              });
            }

            barItems.push(new F.Separator({
              //renderTo: el.dom,
              renderTo: containerEl.dom,
              style: style
            }));
            continue;
            break;
          case 'side':
            isSide = true;
            continue;
            break;
          default:
            if (isSide) {
              barItems[sidePassed] = me.renderItem(item);
            }
            else {
              barItems.push(me.renderItem(item));
            }
        }
      }

      me.items = barItems;
    },
    /*
     * @param {Object} item
     * @return {Object}
     */
    renderItem: function (item) {
      var me = this,
        field,
        containerEl = me.containerEl,
        theme = me.theme;

      item.style = item.style || {};
      item.label = false;
      item.padding = false;

      F.applyIf(item.style, {
        'float': me.floating
      });

      if (me.floating === 'right') {
        F.applyIf(item.style, {
          right: me.sideRight,
          position: 'absolute'
        });
      }

      if (!item.scope && me.items) {
        item.scope = me.items[0];
      }

      switch (item.type) {
        case 'wrapper':
          if (item.cls === PICKER_MONTH_ACTION_BUTTONS_CLS) {
            containerEl.destroy();
            containerEl = me.el;
          }

          var renderTo = containerEl.append('<div class="' + (item.cls || '') + '"></div>').select('div').item(0),
            i = 0,
            iL = item.items.length,
            _item,
            width = 0;

          for (; i < iL; i++) {
            _item = item.items[i];

            if (F.isObject(_item)) {
              _item.type = _item.type || 'button';
            }

            _item.renderTo = renderTo.dom;
            field = me.renderItem(_item);
            var fieldEl = field.el;

            if (i === iL - 1) {
              fieldEl.css('margin-right', '0px');
            }
            else {
              width += parseInt(fieldEl.css('margin-right'));
            }

            if (F.nojQuery) {
              width += parseInt(fieldEl.width());
              width += parseInt(fieldEl.css('margin-left'));
            }
            else {
              width += parseInt(fieldEl.$dom.outerWidth());
            }

            width += parseInt(fieldEl.css('padding-left'));
            width += parseInt(fieldEl.css('padding-right'));
          }

          renderTo.css('width', width);

          break;
        case undefined:
        case 'button':
          item.extraCls = BAR_BUTTON_CLS;

          item.scope = me.scope;

          field = new F.Button(item);
          break;
        case 'segbutton':
          item.extraCls = BAR_SEG_BUTTON_CLS;

          F.applyIf(item.style, {
            'margin-right': '6px'
          });

          field = new F.SegButton(item);
          break;
        case 'tab':
          field = new F.toolbar.Tab(item);
          break;
        case 'text':
          F.applyIf(item.style, {
            'margin-right': '10px',
            'padding-left': '0px',
            'padding-top': '11px'
          });

          F.apply(item, {
            renderTo: containerEl.dom,
            cls: item.cls || ''
          });

          field = new F.bar.Text(item);
          break;
        case 'combo':
          item.inputWidth = 18;

          F.applyIf(item.style, {
            'padding-left': '0px',
            'margin-right': '8px',
            'margin-top': '4px'
          });

          F.applyIf(item, {
            width: 70
          });

          field = new F.Combo(item);
          break;
        case 'date':
          item.inputWidth = 18;

          F.applyIf(item.style, {
            'padding-left': '0px',
            'margin-right': '8px',
            'margin-top': '4px'
          });

          F.applyIf(item, {
            width: 100
          });

          field = new F.DateField(item);

          break;
        case 'number':
          item.inputWidth = 18;

          F.applyIf(item.style, {
            'padding-left': '0px',
            'margin-right': '8px',
            'margin-top': '4px'
          });

          F.applyIf(item, {
            width: 35
          });

          field = new F.NumberField(item);

          break;
        case 'switcher':
          F.applyIf(item.style, {
            'padding-left': '0px',
            'margin-right': '8px',
            'margin-top': '4px'
          });

          F.applyIf(item, {
            width: 35
          });

          field = new F.Switcher(item);

          break;
        case 'string':
          item.inputWidth = 18;

          F.applyIf(item.style, {
            'padding-left': '0px',
            'margin-right': '8px',
            'margin-top': '4px'
          });

          F.applyIf(item, {
            width: 100
          });

          field = new F.StringField(item);
          break;
        case 'search':
          item.inputWidth = 18;

          item.events = item.events || [];

          item.events = item.events.concat([{
            enter: function (field, value) {
              var grid = F.getWidget(field.el.parent().parent().parent().parent().select('.' + GRID_CLS).attr('id'));
              //this.search(['name', 'surname', 'position'], value);
              //this.search(value);
              //this.search(['a', 'b', 'c']);
              grid.search(value);
            }
          }, {
            key: function (field, value) {
              var me = this,
                grid = F.getWidget(field.el.parent().parent().parent().parent().select('.' + GRID_CLS).attr('id'));

              if (!me.autoEnterTime) {
                me.autoEnterTime = new Date();
              }

              if (me.intervalAutoEnter) {
                clearInterval(me.intervalAutoEnter);
              }
              delete me.intervalAutoEnter;

              me.intervalAutoEnter = setInterval(function () {
                var now = new Date();

                if (now - me.autoEnterTime > 500) {
                  clearInterval(me.intervalAutoEnter);
                  delete me.intervalAutoEnter;
                  value = field.getValue();

                  grid.search(value);
                }
              }, 200);
            }
          }, {
            render: function (field) {
              var me = this,
                isIn = false;

              field.el.on('mouseenter', function () {
                isIn = true;
              }, null, '.' + FIELD_SEARCH_PARAMS_LINK_CLS);

              field.el.on('mousedown', function (e) {
                e.preventDefault();
              }, null, '.' + FIELD_SEARCH_PARAMS_LINK_CLS);

              field.el.on('click', function (e) {
                var toShow = false,
                  grid = F.getWidget(field.el.parent().parent().parent().parent().select('.' + GRID_CLS).attr('id')),
                  columns = grid.columns || [],
                  leftColumns = grid.leftColumns || [],
                  rightColumns = grid.rightColumns || [],
                  _columns = columns.concat(leftColumns).concat(rightColumns),
                  items = [],
                  i = 0,
                  iL = _columns.length,
                  height = 1;

                for (; i < iL; i++) {
                  var column = _columns[i],
                    title = column.title;

                  if (title === undefined) {
                    title = '';
                  }

                  if (column.searchable === false) {
                    continue;
                  }

                  switch (column.type) {
                    case 'color':
                    case 'combo':
                    case 'date':
                    case 'number':
                    case 'string':
                    case 'text':
                    case 'currency':
                      break;
                    default:
                      continue;
                  }

                  height += grid.fieldHeight;

                  items.push({
                    inputLabel: ' &nbsp;&nbsp;' + title,
                    value: true,
                    name: column.index
                  });
                }

                if (!me.list) {
                  me.list = new FancyForm({
                    width: 150,
                    height: height,
                    theme: theme,
                    defaults: {
                      type: 'checkbox',
                      label: false,
                      style: {
                        padding: '8px 16px 0px'
                      }
                    },
                    items: items,
                    cls: FIELD_SEARCH_LIST_CLS,
                    events: [{
                      set: function () {
                        grid.searching.setKeys(me.list.get());
                      }
                    }, {
                      init: function () {
                        setTimeout(function () {
                          var listEl = me.list.el;

                          listEl.on('mouseenter', function () {
                            isIn = true;
                          });

                          listEl.on('mouseleave', function () {
                            isIn = false;
                            setTimeout(function () {
                              if (isIn === false) {
                                if (me.list) {
                                  listEl.css('display', 'none');
                                }
                              }
                            }, 750);
                          });

                          var el = F.get(e.target),
                            offset = el.offset(),
                            fieldHeight = parseInt(field.el.css('height'));

                          listEl.css({
                            position: 'absolute',
                            top: offset.top + fieldHeight + 20,
                            left: offset.left
                          });

                          me.list.el.css('display', 'block');

                          listEl.animate({
                            duration: 200,
                            top: offset.top + fieldHeight - 1
                          });
                        }, 50);
                      }

                    }]
                  });
                }
                else if (me.list.el.css('display') !== 'none') {
                  me.list.el.css('display', 'none');
                  return;
                }
                else {
                  toShow = true;
                }

                var el = F.get(e.target),
                  offset = el.offset(),
                  fieldHeight = parseInt(field.el.css('height'));

                if (me.list && me.list.el) {
                  me.list.css({
                    position: 'absolute',
                    top: offset.top + fieldHeight + 20,
                    left: offset.left
                  });

                  if (toShow) {
                    me.list.css('display', 'block');
                  }

                  me.list.el.animate({
                    duration: 200,
                    top: offset.top + fieldHeight - 1
                  });
                }
              }, null, '.' + FIELD_SEARCH_PARAMS_LINK_CLS);

              field.el.on('mouseleave', function () {
                isIn = false;
                setTimeout(function () {
                  if (isIn === false) {
                    if (me.list) {
                      me.list.el.css('display', 'none');
                    }
                  }
                }, 750);
              }, null, '.' + FIELD_SEARCH_PARAMS_LINK_CLS)
            }
          }]);

          F.applyIf(item.style, {
            'float': me.floating,
            'padding-left': '0px',
            'margin-right': '8px',
            'margin-top': '4px'
          });

          var cls = FIELD_SEARCH_CLS;

          if (item.paramsMenu) {
            item.tpl = [
              '<div class="' + FIELD_LABEL_CLS + '" style="{labelWidth}{labelDisplay}">',
              '{label}',
              '</div>',
              '<div class="' + FIELD_TEXT_CLS + '">',
              '<input placeholder="{emptyText}" class="' + FIELD_TEXT_INPUT_CLS + '" style="{inputWidth}" value="{value}">',
              '<div class="' + FIELD_SEARCH_PARAMS_LINK_CLS + '" style="">' + (item.paramsText || '&nbsp;') + '</div>',
              '</div>',
              '<div class="' + CLEARFIX_CLS + '"></div>'
            ];

            cls += ' ' + FIELD_SEARCH_PARAMED_CLS;
            if (!item.paramsText) {
              cls += ' ' + FIELD_SEARCH_PARAMED_EMPTY_CLS;
            }
          }

          F.applyIf(item, {
            padding: false,
            width: 250,
            cls: cls,
            emptyText: 'Search'
          });

          field = new F.StringField(item);
          break;
        default:
      }

      if (me.floating === 'right') {
        me.sideRight += field.width;
        me.sideRight += 7;
      }

      if (item.role) {
        me.roles[item.role] = field;
      }

      return field;
    },
    /*
     *
     */
    initScroll: function () {
      var me = this;

      me.leftScroller = new F.Button({
        imageCls: true,
        renderTo: me.el.dom,
        cls: BAR_LEFT_SCROLLER_CLS,
        height: me.height + 2,
        minWidth: 20,
        paddingTextWidth: 0,
        imageWidth: 20,
        width: 0,
        text: false,
        id: 'my',
        style: {
          position: 'absolute',
          left: -1,
          top: -1,
          display: 'none'
        },
        listeners: [{
          click: me.onPrevScrollClick,
          scope: me
        }]
      });

      me.rightScroller = new F.Button({
        imageCls: true,
        renderTo: me.el.dom,
        cls: BAR_RIGHT_SCROLLER_CLS,
        height: me.height + 2,
        minWidth: 20,
        paddingTextWidth: 0,
        imageWidth: 20,
        width: 0,
        text: false,
        style: {
          position: 'absolute',
          right: -1,
          top: -1,
          display: 'none'
        },
        listeners: [{
          click: me.onNextScrollClick,
          scope: me
        }]
      });
    },
    /*
     * @return {Number}
     */
    getBarWidth: function () {
      return parseInt(this.el.css('width'));
    },
    /*
     * @return {Number}
     */
    getItemsWidth: function () {
      var width = 0;

      F.each(this.items, function (item) {
        width += item.el.width();
        width += parseInt(item.el.css('margin-left'));
        width += parseInt(item.el.css('margin-right'));
        width += parseInt(item.el.css('padding-right'));
        width += parseInt(item.el.css('padding-left'));
      });

      return width;
    },
    /*
     *
     */
    onPrevScrollClick: function () {
      this.scrolled += 30;
      this.applyScrollChanges();
    },
    /*
     *
     */
    onNextScrollClick: function () {
      this.scrolled -= 30;
      this.applyScrollChanges();
    },
    /*
     *
     */
    applyScrollChanges: function () {
      var me = this,
        itemsWidth = me.getItemsWidth(),
        barWidth = me.getBarWidth() - parseInt(me.leftScroller.el.css('width')) - parseInt(me.rightScroller.el.css('width')),
        scrollPath = itemsWidth - barWidth;

      if (itemsWidth < barWidth) {
        me.scrolled = 0;

        me.leftScroller.el.hide();
        me.rightScroller.el.hide();

        me.containerEl.css('margin-left', '0px');

        return;
      }
      else if (me.scrolled > 0) {
        me.scrolled = 0;
        me.leftScroller.disable();
        me.rightScroller.enable();
      }
      else if (me.scrolled < -scrollPath) {
        me.scrolled = -scrollPath;
        me.leftScroller.enable();
        me.rightScroller.disable();
      }

      me.leftScroller.el.show();
      me.rightScroller.el.show();

      me.containerEl.css('margin-left', (me.scrolled + me.leftScroller.el.width() + me.tabOffSet) + 'px');
    },
    /*
     *
     */
    onDocMouseUp: function () {
      var me = this;

      if (me.scrollInterval) {
        clearTimeout(me.scrollInterval);
        delete me.scrollInterval;
      }
    },
    /*
     *
     */
    checkScroll: function () {
      var me = this,
        itemsWidth = me.getItemsWidth(),
        barWidth = me.getBarWidth();

      if (me.disableScroll) {
        return;
      }

      if (itemsWidth > barWidth) {
        me.enableScroll();
      }
      else {
        me.leftScroller.el.hide();
        me.rightScroller.el.hide();
      }
    },
    /*
     *
     */
    enableScroll: function () {
      var me = this;

      me.leftScroller.el.show();
      me.rightScroller.el.show();

      if (me.scrolled === 0) {
        me.leftScroller.disable();
        me.containerEl.css('margin-left', (me.leftScroller.el.width() + me.tabOffSet) + 'px');
      }
    },
    /*
     *
     */
    initTabEdit: function () {
      var me = this;

      if (!me.tabEdit) {
        return;
      }

      var i = me.items.length - 1;

      for (; i > -1; i--) {
        var item = me.items[i];

        switch (item.type) {
          case 'number':
          case 'string':
          case 'date':
            item.on('tab', me.onTabLastInput, me);
            return;
            break;
        }
      }
    },
    /*
     * @param {Object} field
     * @param {Object} e
     */
    onTabLastInput: function (field, e) {
      var me = this,
        grid = F.getWidget(me.el.parent().select('.' + GRID_CLS).attr('id'));

      //NOTE: setTimeout to fix strange bug. It runs second second cell without it.
      e.preventDefault();

      if (grid.leftColumns.length) {
        setTimeout(function () {
          grid.leftBody.el.select('.' + GRID_CELL_CLS).item(0).dom.click();
        }, 100);
      }
      else {
        setTimeout(function () {
          grid.body.el.select('.' + GRID_CELL_CLS).item(0).dom.click();
        }, 100);
      }
    }
  });

})();
/*
 * @class Fancy.Separator
 */
Fancy.define('Fancy.Separator', {
  cls: Fancy.SEPARATOR_CLS,
  /*
   * @constructor
   * @param {Object} config
   */
  constructor: function(config){
    Fancy.apply(this, config);
    this.init();
  },
  /*
   *
   */
  init: function(){
    this.render();
  },
  /*
   *
   */
  render: function(){
    var me = this,
      el = Fancy.get(document.createElement('div'));

    el.addCls(me.cls);
    el.update('<div></div>');

    me.el = Fancy.get(me.renderTo.appendChild(el.dom));

    if(me.style){
      me.el.css(me.style);
    }
  }
});
/*
 * @class Fancy.bar.Text
 */
Fancy.define('Fancy.bar.Text', {
  extend: Fancy.Widget,
  widgetCls: Fancy.BAR_TEXT_CLS,
  cls: '',
  text: '',
  /*
   * @constructor
   * @param {Object} config
   */
  constructor: function(config){
    Fancy.apply(this, config);
    this.Super('const', arguments);
  },
  /*
   *
   */
  init: function(){
    this.Super('init', arguments);
    this.render();
  },
  /*
   *
   */
  render: function(){
    var me = this,
      el = Fancy.get(document.createElement('div'));

    el.addCls(me.widgetCls, me.cls);
    el.update(me.text);

    me.el = Fancy.get(me.renderTo.appendChild(el.dom));

    if(me.style){
      me.el.css(me.style);
    }

    if(me.hidden){
      me.el.css('display', 'none');
    }
  },
  /*
   * @return {String}
   */
  get: function() {
    return this.el.dom.innerHTML;
  },
  /*
   * @return {String}
   */
  getValue: function () {
    return this.get();
  }
});
/*
 * @mixin Fancy.form.mixin.Form
 */
(function () {
  //SHORTCUTS
  var F = Fancy;

  //CONSTANTS
  var MODAL_CLS = F.MODAL_CLS;
  var FIELD_NOT_VALID_CLS = F.FIELD_NOT_VALID_CLS;
  var FORM_CLS = F.FORM_CLS;
  var FORM_BODY_CLS = F.FORM_BODY_CLS;
  var PANEL_BODY_INNER_CLS = F.PANEL_BODY_INNER_CLS;
  var PANEL_GRID_INSIDE_CLS = F.PANEL_GRID_INSIDE_CLS;
  var PANEL_SHADOW_CLS =  F.PANEL_SHADOW_CLS;
  var FIELD_BLANK_ERR_CLS = F.FIELD_BLANK_ERR_CLS;
  var FIELD_TAB_CLS = F.FIELD_TAB_CLS;
  var FIELD_TAB_ACTIVE_CLS = F.FIELD_TAB_ACTIVE_CLS;
  var TAB_TBAR_ACTIVE_CLS = F.TAB_TBAR_ACTIVE_CLS;
  var PANEL_TBAR_CLS = F.PANEL_TBAR_CLS;
  var TAB_TBAR_CLS = F.TAB_TBAR_CLS;
  var FIELD_TEXT_CLS = F.FIELD_TEXT_CLS;

  F.Mixin('Fancy.form.mixin.Form', {
    /*
     *
     */
    init: function () {
      var me = this;

      me.calcFieldSize();
      me.Super('init', arguments);

      me.addEvents('init', 'set');

      if (F.fullBuilt !== true && F.MODULELOAD !== false && F.MODULESLOAD !== false && me.fullBuilt !== true && me.neededModules !== true) {
        me.loadModules();
        return;
      }

      me.fire('beforerender');

      me.applyDefaults();
      me.preRender();
      me.render();
      me.ons();
      me.fire('init');
    },
    cls: '',
    widgetCls: FORM_CLS,
    value: '',
    width: 200,
    height: 300,
    emptyText: '',
    tpl: ['<div class="'+FORM_BODY_CLS+'"></div>'],
    /*
     *
     */
    preRender: function () {
      var me = this;

      me.initRenderTo();

      if (me.title || me.tbar || me.bbar || me.buttons) {
        me.renderPanel();
      }
    },
    /*
     *
     */
    renderPanel: function () {
      var me = this,
        panelConfig = {
          renderTo: me.renderTo,
          title: me.title,
          subTitle: me.subTitle,
          subTitleHeight: me.subTitleHeight,
          width: me.width,
          height: me.height,
          titleHeight: me.titleHeight,
          barHeight: me.barHeight,
          theme: me.theme,
          shadow: me.shadow,
          style: me.style || {},
          window: me.window,
          modal: me.modal,
          frame: me.frame,
          items: [me],
          tabs: me.tabs,
          draggable: me.draggable,
          minWidth: me.minWidth,
          minHeight: me.minHeight,
          panelBodyBorders: me.panelBodyBorders,
          resizable: me.resizable
        };

      if (me.tabs) {
        panelConfig.tbar = me.generateTabs();
        me.height -= me.barHeight;
      }

      if (me.bbar) {
        panelConfig.bbar = me.bbar;
        me.height -= me.barHeight;
      }

      if (me.tbar) {
        panelConfig.tbar = me.tbar;
        me.height -= me.barHeight;
      }

      if (me.buttons) {
        panelConfig.buttons = me.buttons;
        me.height -= me.barHeight;
        panelConfig.buttons = me.buttons;
      }

      if (me.footer) {
        panelConfig.footer = me.footer;
        me.height -= me.barHeight;
      }

      me.panel = new F.Panel(panelConfig);

      me.bbar = me.panel.bbar;
      me.tbar = me.panel.tbar;
      me.buttons = me.panel.buttons;

      if (!me.wrapped) {
        me.panel.addCls(PANEL_GRID_INSIDE_CLS);
      }

      if (me.extraCls && me.panel) {
        me.panel.addCls(me.extraCls);
      }

      if (me.title) {
        me.height -= me.titleHeight;
      }

      if (me.subTitle) {
        me.height -= me.subTitleHeight;
        me.height += me.panelBodyBorders[2];
      }

      //me.height -= me.panelBorderWidth;
      me.height -= me.panelBodyBorders[0];

      me.renderTo = me.panel.el.select('.' + PANEL_BODY_INNER_CLS).dom;
    },
    /*
     *
     */
    initRenderTo: function () {
      var me = this,
        renderTo = me.renderTo || document.body;

      if (F.isString(renderTo)) {
        renderTo = document.getElementById(renderTo);
        if (!renderTo) {
          renderTo = F.select(renderTo).item(0);
        }
      }

      me.renderTo = renderTo;
    },
    /*
     *
     */
    render: function () {
      var me = this,
        renderTo = me.renderTo,
        el = F.get(document.createElement('div'));

      el.addCls(
        me.cls,
        F.cls,
        me.widgetCls
      );

      el.attr('id', me.id);

      el.css({
        width: me.width + 'px',
        height: me.height + 'px'
      });

      el.update(me.tpl.join(' '));

      me.el = F.get(F.get(renderTo).dom.appendChild(el.dom));

      if (me.panel === undefined) {
        if (me.shadow) {
          el.addCls(PANEL_SHADOW_CLS);
        }

        if (me.theme !== 'default') {
          el.addCls('fancy-theme-' + me.theme);
        }
      }

      me._items = [];
      me.renderItems();
      me.items = me._items;
      delete me._items;

      if (me.tabs || me.tabbed) {
        me.setActiveTab();
      }

      me.fire('afterrender');
      me.fire('render');
    },
    /*
     * @param {Array} tbar
     */
    generateTabs: function () {
      var me = this,
        tbar = [];

      if (me.tabs) {
        var i = 0,
          iL = me.tabs.length;

        for (; i < iL; i++) {
          var tabConfig = {
            type: 'tab'
          };

          if (F.isString(me.tabs[i])) {
            tabConfig.text = me.tabs[i];
          }
          else {
            tabConfig = me.tabs[i];
          }

          me.tabs[i] = tabConfig;

          if (me.tabs[i].handler === undefined) {
            me.tabs[i].handler = (function (i) {
              return function () {
                me.setActiveTab(i);
              }
            })(i);
          }

          tbar.push(me.tabs[i]);
        }
      }

      return tbar;
    },
    /*
     * @param {Number} newActiveTab
     */
    setActiveTab: function (newActiveTab) {
      var me = this,
        tabs = me.el.select('.' + FIELD_TAB_CLS),
        oldActiveTab = me.el.select('.' + FIELD_TAB_ACTIVE_CLS);

      if (newActiveTab !== undefined) {
        me.activeTab = newActiveTab;
      }

      if (me.activeTab === undefined) {
        me.activeTab = 0;
      }

      oldActiveTab.removeCls(FIELD_TAB_ACTIVE_CLS);
      tabs.item(me.activeTab).addCls(FIELD_TAB_ACTIVE_CLS);

      if (me.tabs) {
        var toolbarTabs = me.panel.el.select('.' + PANEL_TBAR_CLS + ' .' + TAB_TBAR_CLS);
        toolbarTabs.removeCls(TAB_TBAR_ACTIVE_CLS);
        toolbarTabs.item(me.activeTab).addCls(TAB_TBAR_ACTIVE_CLS);
      }
    },
    /*
     * @param {HTMLElement} renderTo
     * @param {Array} [items]
     */
    renderItems: function (renderTo, items) {
      var me = this,
        i = 0,
        iL;

      items = items || me.items;
      iL = items.length;
      renderTo = renderTo || me.el.getByClass(FORM_BODY_CLS);

      for (; i < iL; i++) {
        var item = items[i],
          field;

        item.theme = me.theme;

        switch (item.type) {
          case 'pass':
          case 'password':
            field = F.form.field.String;
            item.type = 'string';
            item.isPassword = true;
            break;
          case 'hidden':
            field = F.form.field.String;
            item.hidden = true;
            break;
          case 'line':
          case 'row':
            field = F.form.field.Line;
            item = me.applyDefaults(item);
            break;
          case 'set':
          case 'fieldset':
            item.form = me;
            field = F.form.field.Set;
            item = me.applyDefaults(item);
            break;
          case 'tab':
            field = F.form.field.Tab;
            item = me.applyDefaults(item);
            break;
          case 'string':
          case undefined:
            field = F.form.field.String;
            break;
          case 'number':
            field = F.form.field.Number;
            break;
          case 'textarea':
            field = F.form.field.TextArea;
            break;
          case 'checkbox':
            field = F.form.field.CheckBox;
            break;
          case 'switcher':
            field = F.form.field.Switcher;
            break;
          case 'combo':
            field = F.form.field.Combo;
            break;
          case 'html':
            field = F.form.field.HTML;
            break;
          case 'radio':
            field = F.form.field.Radio;
            break;
          case 'date':
            field = F.form.field.Date;
            break;
          case 'recaptcha':
            field = F.form.field.ReCaptcha;
            break;
          case 'button':
            field = F.form.field.Button;
            break;
          case 'segbutton':
            field = F.form.field.SegButton;
            break;
          default:
            throw new Error('type ' + item.type + ' is not set');
        }

        item.renderTo = item.renderTo || renderTo;

        var _item = new field(item);

        switch (item.type) {
          case 'line':
          case 'row':
          case 'set':
          case 'fieldset':
          case 'tab':
            me.renderItems(_item.el.select('.' + FIELD_TEXT_CLS).dom, _item.items);
            break;
          default:
            me._items.push(_item);
        }
      }
    },
    /*
     * @param {Object} item
     * @return {Object}
     */
    applyDefaults: function (item) {
      var me = this;

      if (item === undefined) {
        var items = me.items,
          i = 0,
          iL = items.length,
          defaults = me.defaults || {};

        for (; i < iL; i++) {
          F.applyIf(items[i], defaults);
        }

        return;
      }

      var j,
        jL;

      if (item.defaults) {
        j = 0;
        jL = item.items.length;

        for (; j < jL; j++) {
          F.applyIf(item.items[j], item.defaults);
        }
      }

      return item;
    },
    /*
     *
     */
    ons: function () {
      var me = this;

      F.each(me.items, function (item) {
        switch (item.type) {
          case 'line':
          case 'row':
            break;
          case 'set':
          case 'fieldset':
            break;
          case 'tab':
          case 'button':
          case 'segbutton':
            break;
          default:
            item.on('change', me.onChange, me);
        }
      });
    },
    /*
     * @param {Object} field
     * @param {*} value
     * @param {*} oldValue
     */
    onChange: function (field, value, oldValue) {
      this.fire('set', {
        name: field.name,
        value: value,
        oldValue: oldValue
      });
    },
    /*
     * @param {String} name
     * @return {Array|String|Number}
     */
    get: function (name) {
      var me = this;

      if (name) {
        var value;
        F.each(me.items, function (item) {
          switch (item.type) {
            case 'html':
            case 'button':
              return;
              break;
          }

          if (item.name === name) {
            value = item.get();
            return true;
          }
        });
        return value;
      }
      else {
        var values = {};

        F.each(me.items, function (item) {
          switch (item.type) {
            case 'html':
            case 'button':
              return;
              break;
          }

          if (item.name === undefined) {
            return;
          }

          values[item.name] = item.get();
        });

        return values;
      }
    },
    /*
     * @param {String} name
     * @param {*} value
     */
    set: function (name, value) {
      var me = this;

      if (F.isObject(name)) {
        for (var p in name) {
          me.set(p, name[p]);
        }
        return;
      }

      if (name) {
        F.each(me.items, function (item) {
          if (item.name !== name) {
            return;
          }

          item.set(value);
        });
        return value;
      }
    },
    /*
     * @param {Boolean} clear
     */
    clear: function (clear) {
      var me = this;

      F.each(me.items, function (item) {
        switch (item.type) {
          case 'html':
          case 'recaptcha':
          case 'button':
            return;
            break;
        }

        if (clear !== false) {
          item.clear();
        }

        if (me.hasCls(FIELD_NOT_VALID_CLS)) {
          me.removeCls(FIELD_NOT_VALID_CLS);
          me.css('height', ( parseInt(me.css('height')) - 6) + 'px');
        }
        if (me.hasCls(FIELD_BLANK_ERR_CLS)) {
          me.removeCls(FIELD_BLANK_ERR_CLS);
          me.css('height', ( parseInt(me.css('height')) - 6) + 'px');
        }

        if (item.name && me.params && me.params[item.name]) {
          delete me.params[item.name];
        }
      });
    },
    /*
     * @param {Object} o
     */
    submit: function (o) {
      var me = this,
        o = o || {},
        params = me.params || {};

      me.params = me.params || {};

      F.apply(me, o);

      if (o.params) {
        F.apply(params, me.params);
        me.params = params;
      }

      me.clear(false);
      if (me.valid() === false) {
        return;
      }

      var values = me.get();

      F.apply(me.params, values);

      if (me.params.recaptcha === 'wait') {
        me.submit(o);
        return;
      }

      if (me.params.recaptcha === '') {
        return;
      }

      me.params['g-recaptcha-response'] = me.params.recaptcha;
      delete me.params.recaptcha;

      F.Ajax(me);
    },
    /*
     * @return {Boolean}
     */
    valid: function () {
      var valid = true;

      F.each(this.items, function (item) {
        if (valid === true) {
          valid = item.onBlur();
        }
        else {
          item.onBlur();
        }
      });

      return !!valid;
    },
    /*
     * @param {String} name
     * @return {Object}
     */
    getItem: function (name) {
      var item = false;

      F.each(this.items, function (_item) {
        if (_item.name === name) {
          item = _item;
          return true;
        }
      });

      return item;
    },
    /*
     *
     */
    showAt: function () {
      var panel = this.panel;

      if (panel) {
        panel.showAt.apply(panel, arguments);
      }
    },
    /*
     *
     */
    show: function () {
      var panel = this.panel;

      if (panel) {
        panel.show.apply(panel, arguments);
      }
      else {
        this.el.show();
      }
    },
    /*
     *
     */
    hide: function () {
      var me = this;

      if (me.panel) {
        me.panel.css({
          display: 'none'
        });
      }
      else {
        me.css({
          display: 'none'
        });
      }

      var modal = F.select('.' + MODAL_CLS);

      if (modal.dom) {
        modal.css('display', 'none');
      }

      var i = 0,
        iL = me.items.length;

      for (; i < iL; i++) {
        if (me.items[i].type === 'combo') {
          me.items[i].hideList();
        }
      }
    },
    /*
     * @param {Number} height
     */
    setHeight: function (height) {
      var me = this;

      if (me.panel) {
        me.panel.css('height', height);

        if (me.buttons) {
          height -= me.barHeight;
        }

        if (me.bbar) {
          height -= me.barHeight;
        }

        if (me.tbar || me.tabs) {
          height -= me.barHeight;
        }

        if (me.title) {
          height -= me.titleHeight;
        }

        height -= me.panelBodyBorders[0];
        height -= me.panelBodyBorders[2];
      }

      me.css('height', height);
    },
    /*
     * TODO:
     */
    setWidth: function () {
    },
    /*
     * @return {Number}
     */
    getHeight: function () {
      var panel = this.panel;

      if (panel) {
        return panel.getHeight();
      }

      return parseInt(this.css('height'));
    },
    /*
     *
     */
    calcFieldSize: function () {
      var me = this,
        width = me.width,
        defaults = me.defaults || {},
        labelWidth,
        maxLabelNumber = me.maxLabelNumber;

      defaults.width = width - me.panelBorderWidth * 2;

      F.each(me.items, function (item) {
        switch (item.type) {
          case 'set':
          case 'tab':
            if (item.type === 'tab') {
              me.tabbed = true;
            }

            var minusWidth = item.type === 'set' ? 62 : 20;

            F.each(item.items, function (_item) {
              if (_item.width === undefined) {
                _item.width = width - minusWidth;
              }

              if (_item.label && _item.label.length > maxLabelNumber) {
                maxLabelNumber = _item.label.length;
              }
            });

            item.defaults = item.defaults || {};
            item.defaults.labelWidth = item.defaults.labelWidth || (maxLabelNumber + 1) * 8;

            break;
          case 'line':
            var numOfFields = item.items.length,
              isWidthInit = false,
              averageWidth = (width - 8 - 8 - 8) / numOfFields;

            F.each(item.items, function (_item) {
              _item.width = averageWidth;
              if (_item.labelWidth || _item.inputWidth) {
                isWidthInit = true;
              }
            });

            if (isWidthInit === false) {
              F.each(item.items, function (_item) {
                if (_item.labelAlign === 'top') {
                  _item.labelWidth = averageWidth;
                }
                else {
                  //Bad bug fix
                  _item.labelWidth = 100;
                }
              });
            }

            item.defaults = item.defaults || {};
            if (item.defaults.labelWidth === undefined) {
              item.defaults.labelWidth = me.labelWidth;
            }
            break;
          default:
            if (item.label && item.label.length > maxLabelNumber) {
              maxLabelNumber = item.label.length;
            }
        }
      });

      maxLabelNumber++;

      labelWidth = maxLabelNumber * 6;
      if (labelWidth < 80) {
        labelWidth = 80;
      }

      defaults.labelWidth = labelWidth;

      if (me.inputWidth) {
        defaults.inputWidth = me.inputWidth;
      }

      me.defaults = defaults;
    },
    /*
     *
     */
    destroy: function () {
      var me = this;

      me.el.destroy();

      if (me.panel) {
        me.panel.el.destroy();
      }
    },
    /*
     * @param {Function} fn
     * @param {Object} scope
     */
    each: function (fn, scope) {
      var me = this,
        items = me.items,
        i = 0,
        iL = items.length;

      if (scope) {
        for (; i < iL; i++) {
          fn.apply(this, [items[i]]);
        }
      }
      else {
        for (; i < iL; i++) {
          fn(items[i]);
        }
      }
    },
    /*
     *
     */
    loadModules: function () {
      var me = this,
        existedModules = F.modules || {},
        requiredModules = {},
        fields = me.items || [];

      F.modules = existedModules;

      if (F.nojQuery) {
        requiredModules.dom = true;
      }

      if (F.isTouch) {
        requiredModules.touch = true;
      }

      var i = 0,
        iL = fields.length;

      for (; i < iL; i++) {
        var field = fields[i];
        if (field.type === 'date') {
          requiredModules.grid = true;
          requiredModules.selection = true;
          requiredModules.date = true;
        }

        if (field.items) {
          var j = 0,
            jL = field.items.length;

          for (; j < jL; j++) {
            var _field = field.items[j];

            if (_field.type === 'date') {
              requiredModules.grid = true;
              requiredModules.selection = true;
              requiredModules.date = true;
            }
          }
        }
      }

      me.neededModules = {
        length: 0
      };

      for (var p in requiredModules) {
        if (F.modules[p] === undefined) {
          me.neededModules[p] = true;
          me.neededModules.length++;
        }
      }

      if (me.neededModules.length === 0) {
        me.neededModules = true;
        me.init();
        return;
      }

      var onLoad = function (name) {
        delete me.neededModules[name];
        me.neededModules.length--;

        if (me.neededModules.length === 0) {
          me.neededModules = true;
          me.init();
        }
      };

      for (var p in me.neededModules) {
        if (p === 'length') {
          continue;
        }

        F.loadModule(p, onLoad);
      }
    },
    /*
     *
     */
    prevTab: function () {
      var me = this;

      me.activeTab--;
      if (me.activeTab < 0) {
        me.activeTab = 0;
      }

      me.setActiveTab();
    },
    /*
     *
     */
    nextTab: function () {
      var me = this,
        tabNumber = me.el.select('.' + FIELD_TAB_CLS).length;

      me.activeTab++;

      if (me.activeTab >= tabNumber) {
        me.activeTab = tabNumber - 1;
      }

      me.setActiveTab();
    }
  });

})();
/*
 * @mixin Fancy.form.mixin.PrepareConfig
 */
Fancy.Mixin('Fancy.form.mixin.PrepareConfig', {
  /*
   * @param {Object} config
   * @param {Object} originalConfig
   * @return {Object}
   */
  prepareConfig: function(config, originalConfig){
    var me = this;

    config = me.prepareConfigTheme(config, originalConfig);
    config = me.prepareConfigLang(config, originalConfig);
    config = me.prepareConfigDefaults(config);
    config = me.prepareConfigItems(config);
    config = me.prepareConfigFooter(config);

    return config;
  },
  /*
   * @param {Object} config
   * @return {Object}
   */
  prepareConfigDefaults: function(config){
    if( config.defaults ){
      for(var p in config.defaults){
        Fancy.each(config.items, function(item){
          if( item[p] === undefined ){
            item[p] = config.defaults[p];
          }
        });
      }
    }

    return config;
  },
  /*
   * @param {Object} config
   * @return {Object}
   */
  prepareConfigItems: function(config){
    var me = this,
      fn = function(item){
        item.theme = me.theme || '';

        if( item.labelWidth === undefined ){
          item.labelWidth = me.labelWidth;
        }

        if( item.inputWidth === undefined ){
          item.inputWidth = me.inputWidth;
        }

        if( item.type === 'pass' || item.type === 'password' ){
          item.type = 'string';
          item.isPassword = true;
        }

        if(item.items){
          Fancy.each(item.items, fn);
        }
      };

    Fancy.each(config.items, fn);

    return config;
  }
});
/**
 * @class Fancy.Form
 * @extends Fancy.Widget
 */
Fancy.define('Fancy.Form', {
  extend: Fancy.Widget,
  mixins: [
    'Fancy.form.mixin.Form',
    Fancy.panel.mixin.PrepareConfig,
    Fancy.panel.mixin.methods,
    'Fancy.form.mixin.PrepareConfig'
  ],
  type: 'form',
  theme: 'default',
  i18n: 'en',
  //labelWidth: 100,
  maxLabelNumber: 11,
  minWidth: 200,
  minHeight: 200,
  barScrollEnabled: true,
  /*
   * @constructor
   * @param {Object} config
   */
  constructor: function(config){
    var me = this,
      config = config || {};

    var fn = function(params){
      if(params){
        Fancy.apply(config, params);
      }

      config = me.prepareConfig(config, me);
      Fancy.applyConfig(me, config);

      me.Super('const', arguments);
    };

    var preInit = function(){
      var i18n = config.i18n || me.i18n;

      if( Fancy.loadLang(i18n, fn) === true ) {
        fn({
          //lang: Fancy.i18n[i18n]
        });
      }
    };

    if(!Fancy.modules['form'] && !Fancy.fullBuilt && Fancy.MODULELOAD !== false && Fancy.MODULESLOAD !== false && me.fullBuilt !== true && me.neededModules !== true){
      if(Fancy.modules['grid']){
        Fancy.loadModule('form', function(){
          preInit();
        });
      }
      else{
        me.loadModules(preInit, config);
      }
    }
    else{
      preInit();
    }
  },
  /*
   * @param {Function} preInit
   * @param {Object} config
   */
  loadModules: function(preInit, config){
    var me = this,
      requiredModules = {
        form: true
      };

    Fancy.modules = Fancy.modules || {};

    if(Fancy.nojQuery){
      requiredModules.dom = true;
    }

    if(Fancy.isTouch){
      requiredModules.touch = true;
    }

    if(config.url){
      requiredModules.ajax = true;
    }

    var items = config.items || [],
      i = 0,
      iL = items.length,
      item;

    for(;i<iL;i++){
      item = items[i];

      if(item.type === 'combo' && item.data && item.data.proxy){
        requiredModules.ajax = true;
      }

      if(item.type === 'date'){
        requiredModules.grid = true;
        requiredModules.date = true;
        requiredModules.selection = true;
      }
    }

    me.neededModules = {
      length: 0
    };

    for(var p in requiredModules){
      if(Fancy.modules[p] === undefined) {
        me.neededModules[p] = true;
        me.neededModules.length++;
      }
    }

    if(me.neededModules.length === 0){
      me.neededModules = true;
      preInit();
      return;
    }

    var onLoad = function(name){
      delete me.neededModules[name];
      me.neededModules.length--;

      if(me.neededModules.length === 0){
        me.neededModules = true;
        preInit();
      }
    };

    if(me.neededModules.dom){
      Fancy.loadModule('dom', function(){
        delete me.neededModules.dom;
        me.neededModules.length--;

        for(var p in me.neededModules){
          if(p === 'length'){
            continue;
          }

          Fancy.loadModule(p, onLoad);
        }
      });
    }
    else {
      for (var p in me.neededModules) {
        if (p === 'length') {
          continue;
        }

        Fancy.loadModule(p, onLoad);
      }
    }
  }
});

var FancyForm = Fancy.Form;
/*
 * @param {String} id
 */
FancyForm.get = function(id){
  var formId = Fancy.get(id).select('.fancy-form').dom.id;

  return Fancy.getWidget(formId);
};

FancyForm.defineTheme = Fancy.defineTheme;
FancyForm.defineController = Fancy.defineController;
FancyForm.addValid = Fancy.addValid;

if(!Fancy.nojQuery && Fancy.$){
  Fancy.$.fn.FancyForm = function(o){
    o.renderTo = $(this.selector)[0].id;
    return new Fancy.Form(o);
  };
}
/*
 * @mixin Fancy.form.field.Mixin
 */
(function () {
  //SHORTCUTS
  var F = Fancy;

  //CONSTANTS
  var FIELD_NOT_VALID_CLS = F.FIELD_NOT_VALID_CLS;
  var FIELD_LABEL_ALIGN_TOP_CLS = F.FIELD_LABEL_ALIGN_TOP_CLS;
  var FIELD_TEXT_CLS = F.FIELD_TEXT_CLS;
  var FIELD_LABEL_CLS = F.FIELD_LABEL_CLS;
  var FIELD_TEXTAREA_TEXT_CLS = F.FIELD_TEXTAREA_TEXT_CLS;
  var FIELD_LABEL_ALIGN_RIGHT_CLS = F.FIELD_LABEL_ALIGN_RIGHT_CLS;

  F.ns('Fancy.form.field');

  F.form.field.Mixin = function () {};

  F.form.field.Mixin.prototype = {
    padding: '8px 8px 0px 8px',
    inputHeight: 29,
    labelHeight: 18,
    failedValidCls: FIELD_NOT_VALID_CLS,
    cls: '',
    checkValidOnTyping: false,
    /*
     *
     */
    ons: function () {
      var me = this,
        el = me.el,
        input = me.el.getByTag('input');

      me.input = input;
      input.on('blur', me.onBlur, me);
      input.on('focus', me.onFocus, me);
      input.on('input', me.onInput, me);
      input.on('keydown', me.onKeyDown, me);
      el.on('mouseenter', me.onMouseOver, me);
      el.on('mouseleave', me.onMouseOut, me);
      me.on('key', me.onKey, me);

      if (me.tip) {
        el.on('mousemove', me.onMouseMove, me);
      }

      if (me.format && me.format.inputFn) {
        switch (me.value) {
          case '':
          case undefined:
            break;
          default:
            me.formatValue(me.value);
        }
        me.on('key', me.onKeyInputFn);
      }

      if (me.stopPropagation) {
        el.on('mousedown', function (e) {
          e.stopPropagation();
        });
      }
    },
    /*
     * @param {Object} field
     * @param {*} value
     * @param {Object} e
     */
    onKeyInputFn: function (field, value, e) {
      var keyCode = e.keyCode,
        key = F.key;

      switch (keyCode) {
        case key.ENTER:
        case key.ESC:
        case key.LEFT:
        case key.RIGHT:
          return;
          break;
      }

      this.formatValue(value);
    },
    /*
     * @param {*} value
     */
    formatValue: function (value) {
      value = this.format.inputFn(value);
      this.input.dom.value = value;
    },
    /*
     * @param {Object} e
     */
    onMouseOver: function (e) {
      var me = this;

      me.fire('mouseover');

      if (me.tip) {
        me.renderTip(e);
      }
    },
    /*
     * @param {Object} e
     */
    onMouseOut: function (e) {
      var me = this;

      me.fire('mouseout');

      if (me.tip && me.tooltip) {
        me.tooltipToDestroy = true;
        me.tooltip.destroy();
        delete me.tooltip;
      }
    },
    /*
     *
     */
    render: function () {
      var me = this,
        renderTo = me.renderTo || document.body,
        renderAfter = me.renderAfter,
        renderBefore = me.renderBefore,
        el = F.get(document.createElement('div'));

      if (F.isString(renderTo)) {
        renderTo = document.getElementById(renderTo);
        if (!renderTo) {
          renderTo = F.select(renderTo).item(0);
        }
      }

      me.fire('beforerender');

      el.addCls(
        F.cls,
        me.cls,
        me.fieldCls
      );

      el.attr('id', me.id);

      var labelWidth = '',
        itemsHTML = '';

      if (me.itemsHTML) {
        itemsHTML = me.itemsHTML;
      }

      if (me.labelAlign === 'top' && me.label) {
        //auto fixing of wrong labelWidth.
        //will not fix right if user change color of label font-size to bigger
        if (me.labelWidth < me.label.length * 7) {
          me.labelWidth = (me.label.length + 2) * 7;
        }
      }

      if (me.labelWidth) {
        labelWidth = 'width:' + me.labelWidth + 'px;';
      }

      var label = me.label;

      if (me.label === '') {
        label = '&nbsp;';
      }
      else if (me.label === undefined) {
        label = '&nbsp;';
      }
      else if (me.labelAlign !== 'right') {
        label += ':';
      }

      var labelDisplay = '',
        inputLabelDisplay = '',
        inputLabel = '';

      if (me.label === false) {
        labelDisplay = 'display:none;';
      }

      if (!me.inputLabel) {
        inputLabelDisplay = 'display:none;';
      }
      else {
        inputLabel = me.inputLabel;
      }

      if (me.type === 'recaptcha') {
        el.update(me.tpl.getHTML({
            key: me.key
          })
        );
      }
      else {
        el.update(
          me.tpl.getHTML({
            labelWidth: labelWidth,
            label: label,
            labelDisplay: labelDisplay,
            inputLabelDisplay: inputLabelDisplay,
            inputLabel: inputLabel,
            emptyText: me.emptyText,
            value: me.value,
            height: me.height,
            itemsHTML: itemsHTML,
            errorTextStyle: '',
            buttonText: me.buttonText
          })
        );
      }

      me.el = el;
      me.setStyle();

      if (me.renderId === true) {
        el.attr('id', me.id);
      }

      if (renderAfter) {
        el = renderAfter.after(el.dom.outerHTML).next();
      }
      else if (renderBefore) {
        el = renderBefore.before(el.dom.outerHTML).prev();
      }
      else {
        renderTo.appendChild(el.dom);
      }
      me.el = el;

      if (me.type === 'textarea') {
        me.input = me.el.getByTag('textarea');
      }
      else {
        me.input = me.el.getByTag('input');
      }

      if (me.name) {
        me.input.name = me.name;
      }

      me.setSize();

      if (me.labelAlign === 'top') {
        me.el.addCls(FIELD_LABEL_ALIGN_TOP_CLS);
        me.el.select('.' + FIELD_TEXT_CLS).css('float', 'none');
      }
      else if (me.labelAlign === 'right') {
        me.el.addCls(FIELD_LABEL_ALIGN_RIGHT_CLS);
        switch (me.type) {
          case 'radio':
            $(el.dom).find('.' + FIELD_LABEL_CLS).insertAfter($(el.dom).find('.' + FIELD_TEXT_CLS + ':last'));
            break;
          case 'textarea':
            $(el.dom).find('.' + FIELD_LABEL_CLS).insertAfter($(el.dom).find('.' + FIELD_TEXTAREA_TEXT_CLS));
            break;
          default:
            $(el.dom).find('.' + FIELD_LABEL_CLS).insertAfter($(el.dom).find('.' + FIELD_TEXT_CLS));
        }
      }
      else if (me.type !== 'radio') {
      }

      me.acceptedValue = me.value;
      me.fire('afterrender');
      me.fire('render');

      if (me.type !== 'recaptcha' && me.type !== 'chat') {
        setTimeout(function () {
          if (me.input && me.input.dom) {
            if (me.input.dom.value.length === 0) {
              if (me.prevColor === undefined) {
                me.prevColor = me.input.css('color');
              }

              //me.input.css('color', 'grey');
            }
          }
        }, 1);
      }
    },
    /*
     * @param {Object} e
     */
    onKeyDown: function (e) {
      var me = this,
        keyCode = e.keyCode,
        key = F.key;

      if (me.type === 'number') {
        if (F.Key.isNumControl(keyCode, e) === false) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
      }

      switch (keyCode) {
        case key.TAB:
          me.fire('tab', e);
          break;
        case key.ENTER:
          me.fire('enter', me.getValue());
          if (me.type !== 'textarea') {
            e.preventDefault();
            e.stopPropagation();
          }
          break;
        case key.UP:
          switch (me.type) {
            case 'number':
            case 'field.number':
              me.spinUp();
              break;
          }

          me.fire('up', me.getValue());

          if (me.type !== 'textarea') {
            e.preventDefault();
            e.stopPropagation();
          }
          break;
        case key.DOWN:
          switch (me.type) {
            case 'number':
            case 'field.number':
              me.spinDown();
              break;
          }

          me.fire('down', me.getValue());

          if (me.type !== 'textarea') {
            e.preventDefault();
            e.stopPropagation();
          }
          break;
        case key.LEFT:
          break;
        case key.RIGHT:
          e.stopPropagation();
          break;
        default:
          setTimeout(function () {
            if (me.input) {
              if (me.input.dom.value.length === 0) {
                if (me.prevColor === undefined) {
                  me.prevColor = me.input.css('color');
                }

                me.input.css('color', 'grey');
              }
              else {
                if (me.prevColor) {
                  me.input.css('color', me.prevColor);
                }
                else {
                  me.input.css('color', ' ');
                }
              }
            }
          }, 1);
      }

      setTimeout(function () {
        me.fire('key', me.input.dom.value, e);
      }, 1);
    },
    /*
     * @param {Object} me
     * @param {*} value
     */
    onKey: function (me, value) {
      if (!me.isValid() || me.checkValidOnTyping) {
        me.validate(value);
      }
    },
    /*
     *
     */
    onBlur: function () {
      var me = this;

      me.fire('blur');

      if (me.input) {
        return me.validate(me.input.dom.value);
      }

      return true;
    },
    /*
     * @param {*} value
     */
    validate: function (value) {
      var me = this,
        vtype = me.vtype;

      if (vtype === undefined) {
        return true;
      }
      else {
        var valid = F.isValid(vtype, value);
        if (valid !== true) {
          me.errorText = new F.Template(valid.text).getHTML(valid);
          me.failedValid();

          return false;
        }
        else {
          me.successValid();
          return true;
        }
      }
    },
    /*
     *
     */
    isValid: function () {
      return !this.hasCls(this.failedValidCls);
    },
    /*
     *
     */
    onFocus: function () {
      this.fire('focus');
    },
    /*
     *
     */
    onInput: function () {
      var me = this,
        input = me.input,
        value = me.getValue(),
        oldValue = me.acceptedValue;

      me.acceptedValue = me.get();
      me.fire('input', value);
      me.fire('change', value, oldValue);
    },
    /*
     *
     */
    get: function () {
      var me = this;

      if (me.format) {
        //Place of bugs
        if (F.isString(me.format)) {
        }
        else if (F.isObject(me.format)) {
          if (me.format.inputFn) {
            if (me.type === 'number' || me.type === 'field.number') {
              if (isNaN(parseFloat(me.value))) {
                return me.value;
              }

              return Number(me.value);
            }
          }
        }
        else {
          return me.value;
        }
      }

      return me.input.dom.value;
    },
    /*
     *
     */
    getValue: function () {
      return this.get();
    },
    /*
     * @param {*} value
     * @param {Boolean} onInput
     */
    set: function (value, onInput) {
      var me = this;

      me.value = value;

      if (me.format && me.format.inputFn) {
        me.formatValue(value);
      }
      else {
        me.input.dom.value = value;
      }

      if (onInput !== false) {
        me.onInput();
      }

      me.validate(value);
    },
    /*
     * @param {*} value
     * @param {Boolean} onInput
     */
    setValue: function (value, onInput) {
      this.set(value, onInput);
    },
    /*
     *
     */
    clear: function () {
      this.set('');
      this.clearValid();
    },
    /*
     *
     */
    failedValid: function () {
      var me = this;

      if (me.hasCls(me.failedValidCls)) {
        if (me.tooltip && me.errorText) {
          me.tooltip.update(me.errorText);
        }
      }
      else {
        if (!me.tooltip && me.errorText) {
          me.showErrorTip();

          me.el.on('mousemove', me.onMouseMove, me);
          me.input.hover(function (e) {
            if (me.errorText) {
              me.showErrorTip();
              me.tooltip.show(e.pageX + 15, e.pageY - 25);
            }
          }, function () {
            me.hideErrorTip();
          });
        }

        me.addCls(me.failedValidCls);
      }
    },
    clearValid: function () {
      this.removeCls(this.failedValidCls);
    },
    /*
     *
     */
    successValid: function () {
      var me = this;

      me.removeCls(me.failedValidCls);
      me.hideErrorTip();
      delete me.errorText;
    },
    /*
     *
     */
    showErrorTip: function () {
      var me = this;

      if (!me.tooltip) {
        me.tooltip = new F.ToolTip({
          text: me.errorText
        });
      }
    },
    /*
     *
     */
    hideErrorTip: function () {
      var me = this;

      if (me.tooltip) {
        me.tooltip.destroy();
        delete me.tooltip;
      }
    },
    /*
     * @param {Object} o
     */
    setInputSize: function (o) {
      var me = this;

      if (o.width) {
        me.input.css('width', o.width);
      }

      if (o.height) {
        me.input.css('height', o.height);
      }
    },
    /*
     *
     */
    focus: function () {
      var me = this;

      me.input.focus();
      setTimeout(function () {
        me.input.dom.selectionStart = me.input.dom.selectionEnd = 10000;
      }, 0);
    },
    /*
     *
     */
    hide: function () {
      var me = this;

      me.fire('beforehide');
      me.css('display', 'none');
      me.fire('hide');
    },
    /*
     *
     */
    show: function () {
      this.css('display', 'block');
    },
    /*
     * @param {Number|Object} width
     * @param {Number} height
     */
    setSize: function (width, height) {
      var me = this;

      switch (me.type) {
        case 'set':
        case 'line':
          return;
          break;
      }

      if (width === undefined && height === undefined) {
        width = me.width;
        height = me.height;
      }
      else if (height === undefined) {
        var o = width;
        if (o.width) {
          width = o.width;
        }
        else {
          width = me.width;
        }

        if (o.height) {
          height = o.height;
        }
        else {
          height = me.height;
        }
      }

      if (me.size) {
        me.size({
          width: width,
          height: height
        });

        return;
      }

      if (width !== undefined) {
        me.css('width', width);
      }

      if (me.labelAlign === 'top') {
        me.css('height', height * 1.5);
      }
      else {
        me.css('height', height);

        if (me.label) {
          me.el.select('.' + FIELD_LABEL_CLS).css('height', me.inputHeight);
        }
      }

      me.setInputSize({
        width: me.inputWidth,
        height: me.inputHeight
      });
    },
    /*
     *
     */
    setStyle: function () {
      var me = this,
        style = me.style || {},
        padding = me.padding;

      if (padding) {
        if (F.isNumber(padding)) {
          padding = padding + 'px';
        }
        else if (F.isString(padding)) {
        }

        if (style.padding === undefined) {
          style.padding = padding;
        }
      }
      else {
        style.padding = '0px';
      }

      if (me.hidden) {
        me.css('display', 'none')
      }

      me.css(style);
    },
    /*
     *
     */
    preRender: function () {
      var me = this;

      if (me.tpl && F.isObject(me.tpl) === false) {
        me.tpl = new F.Template(me.tpl);
      }

      me.calcSize();
    },
    /*
     *
     */
    calcSize: function () {
      var me = this,
        inputWidth,
        inputHeight = me.inputHeight,
        padding = me.padding,
        value,
        value1,
        value2,
        value3;

      if (F.isString(padding)) {
        padding = padding.replace(/px/g, '');
        padding = padding.split(' ');
        switch (padding.length) {
          case 1:
            value = Number(padding[0]);
            padding = [value, value, value, value];
            break;
          case 2:
            value1 = Number(padding[0]);
            value2 = Number(padding[1]);

            padding = [value1, value2, value1, value2];
            break;
          case 3:
            value1 = Number(padding[0]);
            value2 = Number(padding[1]);
            value3 = Number(padding[2]);

            padding = [value1, value2, value3, value1];
            break;
          case 4:
            padding = [Number(padding[0]), Number(padding[1]), Number(padding[2]), Number(padding[3])];
            break;
        }
      }
      else if (F.isNumber(padding)) {
        padding = [padding, padding, padding, padding];
      }
      else if (padding === false) {
        padding = [0, 0, 0, 0];
      }

      if (me.labelAlign === 'top') {
        me.height *= 1.5;
      }

      inputWidth = me.width;

      if (me.labelAlign !== 'top' && me.label) {
        inputWidth -= me.labelWidth;
      }

      if (me.height === me.inputHeight && me.padding !== false) {
        inputHeight -= padding[0] + padding[2];
      }

      if (me.type === 'radio' && !me.column) {
        me.calcColumns();
        if (me.rows !== 1) {
          inputHeight = (inputHeight - padding[0] - padding[2]) * me.rows;
        }
      }

      me.inputHeight = inputHeight;
      me.inputWidth = inputWidth - padding[1] - padding[3];
      me.height = inputHeight + padding[0] + padding[2];
    },
    /*
     * @param {Number} value
     */
    setWidth: function (value) {
      var me = this;

      me.width = value;
      me.calcSize();

      me.css('width', value);
      me.setInputSize({
        width: me.inputWidth
      });
    },
    /*
     * @param {Object} e
     */
    onMouseMove: function (e) {
      var me = this;

      delete me.tooltipToDestroy;

      if (me.tip) {
        me.renderTip(e);
      }
      else if (me.tooltip) {
        me.tooltip.show(e.pageX + 15, e.pageY - 25);
      }
    },
    /*
     * @param {Object} e
     */
    renderTip: function (e) {
      var me = this,
        value = '',
        tpl = new F.Template(me.tip || me.tooltip);

      if (me.getValue) {
        value = me.getValue();
      }

      var text = tpl.getHTML({
        value: value
      });

      if (me.tooltip) {
        me.tooltip.update(text);
      }
      else {
        me.tooltip = new F.ToolTip({
          text: text
        });
      }

      me.tooltip.show(e.pageX + 15, e.pageY - 25);
    },
    /*
     * @return {Object}
     */
    getInputSelection: function () {
      var me = this,
        start = 0,
        end = 0,
        normalizedValue,
        range,
        textInputRange,
        len,
        endRange,
        el = me.input.dom;

      if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
        start = el.selectionStart;
        end = el.selectionEnd;
      }
      else {
        range = document.selection.createRange();

        if (range && range.parentElement() == el) {
          len = el.value.length;
          normalizedValue = el.value.replace(/\r\n/g, "\n");

          // Create a working TextRange that lives only in the input
          textInputRange = el.createTextRange();
          textInputRange.moveToBookmark(range.getBookmark());

          // Check if the start and end of the selection are at the very end
          // of the input, since moveStart/moveEnd doesn't return what we want
          // in those cases
          endRange = el.createTextRange();
          endRange.collapse(false);

          if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
            start = end = len;
          } else {
            start = -textInputRange.moveStart("character", -len);
            start += normalizedValue.slice(0, start).split("\n").length - 1;

            if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
              end = len;
            } else {
              end = -textInputRange.moveEnd("character", -len);
              end += normalizedValue.slice(0, end).split("\n").length - 1;
            }
          }
        }
      }

      return {
        start: start,
        end: end
      };
    }
  };

})();
/*
 * @class Fancy.StringField
 * @extends Fancy.Widget
 */
Fancy.define(['Fancy.form.field.String', 'Fancy.StringField'], {
  mixins: [
    Fancy.form.field.Mixin
  ],
  extend: Fancy.Widget,
  type: 'field.string',
  /*
   * @constructor
   * @param {Object} config
   */
  constructor: function(config){
    Fancy.apply(this, config);
    this.Super('const', arguments);
  },
  /*
   *
   */
  init: function(){
    var me = this;

    me.addEvents('focus', 'blur', 'input', 'enter', 'up', 'down', 'tab','change', 'key');

    me.Super('init', arguments);

    me.preRender();
    me.render();

    me.ons();

    if( me.isPassword ){
      me.input.attr({
        "type": "password"
      });
    }

    if( me.hidden ){
      me.css('display', 'none');
    }

    if( me.style ){
      me.css(me.style);
    }
  },
  fieldCls: Fancy.FIELD_CLS,
  value: '',
  width: 100,
  emptyText: '',
  tpl: [
    '<div class="fancy-field-label" style="{labelWidth}{labelDisplay}">',
      '{label}',
    '</div>',
    '<div class="fancy-field-text">',
      '<input placeholder="{emptyText}" class="fancy-field-text-input" style="{inputWidth}" value="{value}">',
      '<div class="fancy-field-error" style="{errorTextStyle}"></div>',
    '</div>',
    '<div class="fancy-clearfix"></div>'
  ]
});
/*
 * @class Fancy.NumberField
 * @extends Fancy.Widget
 */
(function() {
  /*
   * CONSTANTS
   */
  var CLEARFIX_CLS = Fancy.CLEARFIX_CLS;
  var FIELD_CLS = Fancy.FIELD_CLS;
  var FIELD_LABEL_CLS = Fancy.FIELD_LABEL_CLS;
  var FIELD_ERROR_CLS = Fancy.FIELD_ERROR_CLS;
  var FIELD_TEXT_CLS = Fancy.FIELD_TEXT_CLS;
  var FIELD_TEXT_INPUT_CLS = Fancy.FIELD_TEXT_INPUT_CLS;
  var FIELD_SPIN_CLS = Fancy.FIELD_SPIN_CLS;
  var FIELD_SPIN_UP_CLS = Fancy.FIELD_SPIN_UP_CLS;
  var FIELD_SPIN_DOWN_CLS = Fancy.FIELD_SPIN_DOWN_CLS;

  Fancy.define(['Fancy.form.field.Number', 'Fancy.NumberField'], {
    mixins: [
      Fancy.form.field.Mixin
    ],
    extend: Fancy.Widget,
    type: 'field.number',
    allowBlank: true,
    /*
     * @constructor
     * @param {Object} config
     */
    constructor: function (config) {
      Fancy.apply(this, config);
      this.Super('const', arguments);
    },
    /*
     *
     */
    init: function () {
      var me = this;

      me.addEvents('focus', 'blur', 'input', 'enter', 'up', 'down', 'tab', 'change', 'key');

      me.Super('init', arguments);

      me.preRender();
      me.render();

      me.ons();

      if (me.hidden) {
        me.css('display', 'none');
      }

      me.initSpin();
    },
    fieldCls: FIELD_CLS,
    value: '',
    width: 100,
    emptyText: '',
    step: 1,
    tpl: [
      '<div class="'+FIELD_LABEL_CLS+'" style="{labelWidth}{labelDisplay}">',
        '{label}',
      '</div>',
      '<div class="'+FIELD_TEXT_CLS+'">',
      '<input placeholder="{emptyText}" class="'+FIELD_TEXT_INPUT_CLS+'" style="{inputWidth}" value="{value}">',
      '<div class="'+FIELD_SPIN_CLS+'">',
      '<div class="'+FIELD_SPIN_UP_CLS+'"></div>',
      '<div class="'+FIELD_SPIN_DOWN_CLS+'"></div>',
      '</div>',
      '<div class="'+FIELD_ERROR_CLS+'" style="{errorTextStyle}"></div>',
      '</div>',
      '<div class="'+CLEARFIX_CLS+'"></div>'
    ],
    /*
     *
     */
    onInput: function () {
      var me = this,
        input = me.input,
        value = me.get(),
        oldValue = me.acceptedValue;

      if (me.isValid()) {
        var _value = input.dom.value,
          _newValue = '',
          i = 0,
          iL = _value.length;

        for (; i < iL; i++) {
          switch (_value[i]) {
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case '-':
            case '+':
            case '.':
              _newValue += _value[i];
              break;
          }
        }

        if (!isNaN(Number(_newValue))) {
          me.value = _newValue;
          value = _newValue;
        }
      }

      me.acceptedValue = Number(me.get());
      me.fire('input', value);
      me.fire('change', Number(value), Number(oldValue));
    },
    /*
     * @param {String} value
     * @return {Boolean}
     */
    isNumber: function (value) {
      if (value === '' || value === '-') {
        return true;
      }

      return Fancy.isNumber(+value);
    },
    /*
     * @param {Number|String} value
     * @return {Boolean}
     */
    checkMinMax: function (value) {
      var me = this;

      if (value === '' || value === '-') {
        return true;
      }

      value = +value;

      return value >= me.min && value <= me.max;
    },
    /*
     * @param {Number} value
     */
    setMin: function (value) {
      this.min = value;
    },
    /*
     * @param {Number} value
     */
    setMax: function (value) {
      this.max = value;
    },
    /*
     *
     */
    initSpin: function () {
      var me = this;

      if (me.spin !== true) {
        return;
      }

      me.el.select('.' + FIELD_SPIN_CLS).css('display', 'block');

      me.el.select('.' + FIELD_SPIN_UP_CLS).on('mousedown', me.onMouseDownSpinUp, me);
      me.el.select('.' + FIELD_SPIN_DOWN_CLS).on('mousedown', me.onMouseDownSpinDown, me);
    },
    /*
     * @param {Object} e
     */
    onMouseDownSpinUp: function (e) {
      var me = this,
        docEl = Fancy.get(document),
        timeInterval = 700,
        time = new Date();

      e.preventDefault();

      me.mouseDownSpinUp = true;

      me.spinUp();

      me.spinInterval = setInterval(function () {
        me.mouseDownSpinUp = false;
        if (new Date() - time > timeInterval) {
          if (timeInterval === 700) {
            timeInterval = 150;
          }

          time = new Date();
          me.spinUp();
          timeInterval--;
          if (timeInterval < 20) {
            timeInterval = 20;
          }
        }
      }, 20);

      docEl.once('mouseup', function () {
        clearInterval(me.spinInterval);
      });
    },
    /*
     * @param {Object} e
     */
    onMouseDownSpinDown: function (e) {
      var me = this,
        docEl = Fancy.get(document),
        timeInterval = 700,
        time = new Date();

      e.preventDefault();

      me.mouseDownSpinDown = true;

      me.spinDown();

      me.spinInterval = setInterval(function () {
        me.mouseDownSpinDown = false;

        if (new Date() - time > timeInterval) {
          if (timeInterval === 700) {
            timeInterval = 150;
          }

          time = new Date();
          me.spinDown();
          timeInterval--;
          if (timeInterval < 20) {
            timeInterval = 20;
          }
        }
      }, 20);

      docEl.once('mouseup', function () {
        clearInterval(me.spinInterval);
      });
    },
    /*
     *
     */
    spinUp: function () {
      var me = this,
        newValue = +me.get() + me.step;

      if (Fancy.Number.isFloat(me.step)) {
        newValue = Fancy.Number.correctFloat(newValue);
      }

      if (isNaN(newValue)) {
        newValue = me.min || 0;
      }

      if (me.max !== undefined && newValue > me.max) {
        newValue = me.max;
      }
      else if (newValue < me.min) {
        newValue = me.min;
      }

      me.set(newValue);
    },
    /*
     *
     */
    spinDown: function () {
      var me = this,
        newValue = +me.get() - me.step;

      if (Fancy.Number.isFloat(me.step)) {
        newValue = Fancy.Number.correctFloat(newValue);
      }

      if (isNaN(newValue)) {
        newValue = me.min || 0;
      }

      if (me.min !== undefined && newValue < me.min) {
        newValue = me.min;
      }
      else if (newValue > me.max) {
        newValue = me.max;
      }

      me.set(newValue);
    }
  });

})();
/*
 * @class Fancy.DateField
 * @extends Fancy.Widget
 */
(function () {
  //SHORTCUTS
  var F = Fancy;
  var D = F.Date;

  //CONSTANTS
  var CLEARFIX_CLS = F.CLEARFIX_CLS;
  var FIELD_CLS = F.FIELD_CLS;
  var FIELD_LABEL_CLS = F.FIELD_LABEL_CLS;
  var FIELD_TEXT_CLS = F.FIELD_TEXT_CLS;
  var FIELD_ERROR_CLS = F.FIELD_ERROR_CLS;
  var FIELD_TEXT_INPUT_CLS = F.FIELD_TEXT_INPUT_CLS;

  F.define(['Fancy.form.field.Date', 'Fancy.DateField'], {
    mixins: [
      F.form.field.Mixin
    ],
    extend: F.Widget,
    type: 'field.date',
    picker: true,
    i18n: 'en',
    theme: 'default',
    fieldCls: FIELD_CLS,
    value: '',
    width: 100,
    emptyText: '',
    tpl: [
      '<div class="' + FIELD_LABEL_CLS + '" style="{labelWidth}{labelDisplay}">',
        '{label}',
      '</div>',
      '<div class="' + FIELD_TEXT_CLS + '">',
        '<input placeholder="{emptyText}" class="' + FIELD_TEXT_INPUT_CLS + '" style="{inputWidth}" value="{value}">',
        '<div class="fancy-field-picker-button"></div>',
        '<div class="' + FIELD_ERROR_CLS + '" style="{errorTextStyle}"></div>',
      '</div>',
      '<div class="' + CLEARFIX_CLS + '"></div>'
    ],
    /*
     * @constructor
     * @param {Object} config
     */
    constructor: function (config) {
      F.apply(this, config);
      this.Super('const', arguments);
    },
    /*
     *
     */
    init: function () {
      var me = this;

      me.addEvents('focus', 'blur', 'input', 'enter', 'up', 'down', 'tab', 'change', 'key', 'showpicker');

      me.initFormat();
      me.Super('init', arguments);

      me.preRender();
      me.render();

      me.ons();

      if (me.hidden) {
        me.css('display', 'none');
      }

      if (me.style) {
        me.css(me.style);
      }

      if (!F.isDate(me.value)) {
        me.initDate();
      }
      me.changeInputValue();
      me.initPicker();
    },
    /*
     * @param {String} value
     * @param {String} format
     */
    initDate: function (value, format) {
      var me = this;

      if (value) {
        if (F.typeOf(value) === 'date') {
          me.date = value;
          return;
        }

        var date;
        if (format) {
          date = D.parse(value, format, me.format.mode);
        }
        else {
          date = D.parse(value, me.format.read, me.format.mode);
        }

        if (date.toString === 'Invalid Date') {
          date = D.parse(value, me.format.edit, me.format.mode);
        }

        if (date.toString === 'Invalid Date') {
          return;
        }

        me.date = date;
        return;
      }

      switch (F.typeOf(value)) {
        case 'date':
          me.date = me.value;
          break;
        case 'undefined':
        case 'string':
          if (!me.value) {
            delete me.date;
            return;
          }
          me.date = D.parse(me.value, me.format.read, me.format.mode);
          break;
      }
    },
    /*
     *
     */
    changeInputValue: function () {
      var me = this;

      if (F.typeOf(me.date) !== 'date' || me.date.toString() === 'Invalid Date') {
        me.input.dom.value = '';
        return;
      }

      var value = D.format(me.date, me.format.edit, undefined, me.format.mode);

      if (me.format && me.format.inputFn) {
        value = me.format.inputFn(value);
      }

      if (value === undefined) {
        value = '';
      }

      me.input.dom.value = value;

      me.fire('change', value);
    },
    /*
     *
     */
    initFormat: function () {
      var me = this;

      if (me.format) {
        if (F.isObject(me.format)) {
          F.applyIf(me.format, F.i18n[me.i18n].date);
        }
      }
      else {
        me.format = F.i18n[me.i18n].date;
      }
    },
    /*
     * @param {*} value
     */
    formatValue: function (value) {
      var me = this;

      if (!me.value && value) {
        me.value = value;
      }
      else if (!value && me.value) {
        value = me.value;
      }

      if (!me.value) {
      }
      else if (F.typeOf(me.value) === 'date') {
        me.value = D.format(me.value, me.format.read, undefined, me.format.mode);
        if (value === undefined) {
          var _date = D.parse(me.value, me.format.edit, me.format.mode);
          value = D.format(_date, me.format.edit, undefined, me.format.mode);
        }
        me.acceptedValue = value;
      }
      else {
        var date = D.parse(me.value, me.format.read, me.format.mode);
        me.value = D.format(date, me.format.edit, undefined, me.format.mode);
      }

      if (me.format && me.format.inputFn) {
        value = me.format.inputFn(value);
      }

      if (value === undefined) {
        value = '';
      }

      if (/NaN/.test(value)) {
        value = '';
      }

      me.input.dom.value = value;
    },
    /*
     *
     */
    ons: function () {
      var me = this,
        input = me.el.getByTag('input');

      me.input = input;
      input.on('blur', me.onBlur, me);
      input.on('focus', me.onFocus, me);
      input.on('input', me.onInput, me);
      input.on('keydown', me.onKeyDown, me);
      me.on('key', me.onKey, me);
      me.on('enter', me.onEnter, me);

      me.on('beforehide', me.onBeforeHide, me);

      if (me.format && me.format.inputFn) {
        me.on('key', me.onKeyInputFn);
      }
    },
    /*
     *
     */
    initPicker: function () {
      var me = this;

      if (me.picker === false) {
        return;
      }

      if (me.dateImage === false) {
        me.el.select('.fancy-field-picker-button').css('display', 'none');
        me.input.on('click', me.onInputClick, me);
      }
      else {
        me.pickerButton = me.el.select('.fancy-field-picker-button');
        me.pickerButton.on('mousedown', me.onPickerButtonMouseDown, me);
      }
    },
    /*
     *
     */
    onInputClick: function (e) {
      e.preventDefault();

      this.toggleShowPicker();
    },
    /*
     * @param {Object} e
     */
    onPickerButtonMouseDown: function (e) {
      e.preventDefault();
      this.toggleShowPicker();
    },
    /*
     *
     */
    showPicker: function () {
      var me = this,
        el = me.el,
        input = me.input,
        docEl = F.get(document);

      if (me.picker === true) {
        me.renderPicker();
      }

      var offset = input.offset(),
        x = offset.left,
        y = offset.top + el.select('.' + FIELD_TEXT_CLS).height(),
        date = me.date || new Date();

      if (date.toString() === 'Invalid Date') {
        date = new Date();
      }

      me.picker.setDate(date);

      F.datepicker.Manager.add(me.picker);

      me.picker.showAt(x, y);

      me.fire('showpicker');

      if (!me.docSpy) {
        me.docSpy = true;
        docEl.on('click', me.onDocClick, me);
      }
    },
    /*
     *
     */
    onDocClick: function (e) {
      var me = this,
        datePicker = me.picker,
        monthPicker = datePicker.monthPicker,
        target = e.target;

      if (target.tagName.toLocaleLowerCase() === 'input') {
      }
      else if (F.get(target).hasCls('fancy-field-picker-button')) {
      }
      else if (datePicker.panel.el.within(target)) {
      }
      else if (monthPicker && monthPicker.panel.el.within(target)) {
      }
      else {
        me.hidePicker();
      }
    },
    /*
     *
     */
    hidePicker: function () {
      var me = this;

      if (me.picker !== false && me.picker.hide) {
        me.picker.hide();
      }

      if (me.docSpy) {
        var docEl = F.get(document);
        me.docSpy = false;
        docEl.un('click', me.onDocClick, me);
      }
    },
    /*
     *
     */
    toggleShowPicker: function () {
      var me = this;

      if (me.picker === true) {
        me.showPicker();
        return;
      }

      if (me.picker.panel.el.css('display') === 'none') {
        me.showPicker();
      }
      else {
        me.hidePicker();
      }
    },
    /*
     *
     */
    renderPicker: function () {
      var me = this;

      if (!F.fullBuilt && !F.modules['grid'] && F.MODULELOAD !== false && F.MODULESLOAD !== false) {
        return;
      }

      me.picker = new F.DatePicker({
        window: true,
        date: me.date,
        format: me.format,
        theme: me.theme,
        events: [{
          changedate: me.onPickerChangeDate,
          scope: me
        }]
      });
    },
    /*
     * @return {String}
     */
    get: function () {
      var me = this;

      if (me.input.dom.value === '') {
        delete me.date;
        delete me.value;

        return '';
      }

      if (me.date) {
        return D.format(me.date, me.format.write, undefined, me.format.mode);
      }
      else {
        return '';
      }
    },
    /*
     * @return {Date}
     */
    getDate: function () {
      return this.date || '';
    },
    /*
     *
     */
    onBeforeHide: function () {
      this.hidePicker();
    },
    /*
     * @param {Object} picker
     * @param {Date} newDate
     * @param {Boolean} hidePicker
     */
    onPickerChangeDate: function (picker, newDate, hidePicker) {
      var me = this;

      if (hidePicker !== false) {
        me.picker.hide();
      }

      me.initDate(newDate);
      me.changeInputValue();
    },
    /*
     *
     */
    onInput: function () {
      var me = this,
        input = me.input,
        value = input.dom.value,
        oldValue = me.acceptedValue;

      if (D.parse(value, me.format.edit, me.format.mode).toString() === 'Invalid Date') {
        return;
      }

      me.initDate(value, me.format.edit);

      me.fire('input', value);
      me.fire('change', value, oldValue);
    },
    /*
     * @return {Boolean}
     */
    isValid: function () {
      var me = this;

      return D.parse(me.get(), me.format.edit, me.format.mode).toString() !== 'Invalid Date';
    },
    /*
     * @param {String|Date|Number} value
     */
    set: function (value) {
      var me = this;

      switch (value) {
        case '':
        case undefined:
          delete me.value;
          delete me.date;
          me.changeInputValue();
          return;
          break;
      }

      me.initDate(value);
      me.changeInputValue();
    },
    /*
     * @param {*} oldValue
     * @return {Boolean}
     */
    isEqual: function (oldValue) {
      var me = this,
        oldDate = D.parse(oldValue, me.format.read, me.format.mode),
        value = me.input.dom.value;

      oldValue = D.format(oldDate, me.format.edit, undefined, me.format.mode);

      return oldValue === value;
    },
    onEnter: function () {
      var me = this,
        input = me.input,
        value = input.dom.value,
        oldValue = me.acceptedValue;

      if (value === '') {
        me.initDate();

        me.fire('input', value);
        me.fire('change', value, oldValue);
      }
    }
  });

})();
/*
 * @class Fancy.DateRangeField
 * @extends Fancy.Widget
 */
(function () {
  //SHORTCUTS
  var F = Fancy;
  var D = F.Date;

  F.define(['Fancy.form.field.DateRange', 'Fancy.DateRangeField'], {
    extend: F.Widget,
    type: 'field.daterange',
    picker: true,
    format: 'm/d/Y',
    dateImage: true,
    theme: 'default',
    /*
     * @constructor
     * @param {Object} config
     */
    constructor: function(config){
      F.apply(this, config);
      this.Super('const', arguments);
    },
    /*
     *
     */
    init: function () {
      var me = this;

      me.addEvents('changedatefrom', 'changedateto', 'change');

      me.preRender();
      me.render();
      me.initDateFields();
    },
    //Can not find where it is used. Maybe to remove
    fieldCls: F.cls + ' fancy-date-range',
    width: 100,
    /*
     *
     */
    render: function () {
      var me = this,
        renderTo = me.renderTo || document.body,
        el = F.get(document.createElement('div'));

      el.addCls(me.cls);

      me.el = F.get(F.get(renderTo).dom.appendChild(el.dom));
    },
    /*
     *
     */
    preRender: function () {
    },
    /*
     *
     */
    initDateFields: function () {
      var me = this,
        theme = me.theme;

      me.dateField1 = new F.DateField({
        renderTo: me.el.dom,
        label: false,
        dateImage: me.dateImage,
        width: me.width / 2,
        padding: false,
        theme: theme,
        style: {
          position: 'absolute',
          bottom: '2px',
          left: '3px'
        },
        format: me.format,
        events: [{
          showpicker: me.onShowPicker1,
          scope: me
        }, {
          change: me.onChangeDate1,
          scope: me
        }, {
          focus: me.onFocus1,
          scope: me
        }, {
          enter: me.onEnter,
          scope: me
        }]
      });

      me.dateField1.setInputSize({
        width: me.width / 2
      });

      me.dateField2 = new F.DateField({
        renderTo: me.el.dom,
        label: false,
        dateImage: me.dateImage,
        width: me.width / 2,
        padding: false,
        theme: theme,
        style: {
          position: 'absolute',
          bottom: '2px',
          right: '2px'
        },
        format: me.format,
        events: [{
          showpicker: me.onShowPicker2,
          scope: me
        }, {
          change: me.onChangeDate2,
          scope: me
        }, {
          focus: me.onFocus2,
          scope: me
        }, {
          keydown: me.onEnter,
          scope: me
        }]
      });

      me.dateField2.setInputSize({
        width: me.width / 2
      });

    },
    /*
     *
     */
    onFocus1: function () {
      this.dateField2.hidePicker();
    },
    /*
     *
     */
    onFocus2: function () {
      this.dateField1.hidePicker();
    },
    /*
     *
     */
    onShowPicker1: function () {
      this.dateField2.hidePicker();
    },
    /*
     *
     */
    onShowPicker2: function () {
      this.dateField1.hidePicker();
    },
    /*
     * @param {Object} field
     * @param {Date} date
     */
    onChangeDate1: function (field, date) {
      var me = this,
        date = D.parse(date, field.format.edit, field.format.mode);

      me.fire('changedatefrom', date);
      me.fire('change');
    },
    /*
     * @param {Object} field
     * @param {Date} date
     */
    onChangeDate2: function (field, date) {
      var date = D.parse(date, field.format.edit, field.format.mode);

      this.fire('changedateto', date);
      this.fire('change');
    },
    /*
     *
     */
    onEnter: function () {
      this.dateField1.hidePicker();
      this.dateField2.hidePicker();
    }
  });

})();
/*
 * @class Fancy.TextField
 * @extends Fancy.Widget
 */
Fancy.define(['Fancy.form.field.Text', 'Fancy.TextField'], {
  mixins: [
    Fancy.form.field.Mixin
  ],
  extend: Fancy.Widget,
  type: 'field.text',
  /*
   * @constructor
   * @param {Object} config
   */
  constructor: function(config){
    Fancy.apply(this, config);
    this.Super('const', arguments);
  },
  /*
   *
   */
  init: function(){
    var me = this;

    me.Super('init', arguments);

    me.preRender();
    me.render();

    //me.ons();

    if( me.hidden ){
      me.css('display', 'none');
    }

    if( me.style ){
      me.css(me.style);
    }
  },
  fieldCls: Fancy.FIELD_CLS + ' fancy-field-field-text',
  value: '',
  width: 100,
  emptyText: '',
  tpl: [
    '<div class="fancy-field-label" style="{labelWidth}{labelDisplay}">',
      '{label}',
    '</div>',
    '<div class="fancy-field-text">',
      '<div class="fancy-field-text-value">{value}</div>',
      '<div class="fancy-field-error" style="{errorTextStyle}"></div>',
    '</div>',
    '<div class="fancy-clearfix"></div>'
  ],
  /*
   * @param {*} value
   */
  set: function(value){
    this.el.select('.fancy-field-text-value').item(0).update(value);
  }
});
/*
 * @class Fancy.EmptyField
 * @extends Fancy.Widget
 */
Fancy.define(['Fancy.form.field.Empty', 'Fancy.EmptyField'], {
  mixins: [
    Fancy.form.field.Mixin
  ],
  extend: Fancy.Widget,
  type: 'field.empty',
  /*
   * @constructor
   * @param {Object} config
   */
  constructor: function(config){
    Fancy.apply(this, config);
    this.Super('const', arguments);
  },
  /*
   *
   */
  init: function(){
    var me = this;

    me.addEvents();

    me.Super('init', arguments);

    me.preRender();
    me.render();

    if( me.style ){
      me.css(me.style);
    }
  },
  /*
   *
   */
  ons: function(){},
  fieldCls: Fancy.FIELD_CLS + ' ' + Fancy.FIELD_EMPTY_CLS,
  width: 100,
  tpl: [
    '<div class="fancy-field-label" style="{labelWidth}{labelDisplay}">',
      '{label}',
    '</div>',
    '<div class="fancy-field-text">',
      '<div class="fancy-field-error" style="{errorTextStyle}"></div>',
    '</div>',
    '<div class="fancy-clearfix"></div>'
  ]
});
/*
 * @class Fancy.TextArea
 * @extends Fancy.Widget
 */
(function () {
  //SHORTCUTS
  var F = Fancy;

  //CONSTANTS
  var FIELD_CLS = F.FIELD_CLS;
  var FIELD_TEXTAREA_CLS = F.FIELD_TEXTAREA_CLS;
  var FIELD_LABEL_CLS = F.FIELD_LABEL_CLS;
  var FIELD_TEXTAREA_TEXT_CLS = F.FIELD_TEXTAREA_TEXT_CLS;
  var FIELD_TEXTAREA_TEXT_INPUT_CLS = F.FIELD_TEXTAREA_TEXT_INPUT_CLS;
  var FIELD_ERROR_CLS = F.FIELD_ERROR_CLS;
  var CLEARFIX_CLS = F.CLEARFIX_CLS;

  F.define(['Fancy.form.field.TextArea', 'Fancy.TextArea'], {
    mixins: [
      F.form.field.Mixin
    ],
    extend: F.Widget,
    type: 'field.textarea',
    /*
     * @constructor
     */
    constructor: function () {
      this.Super('const', arguments);
    },
    /*
     *
     */
    init: function () {
      var me = this;

      me.addEvents('change', 'key');
      me.Super('init', arguments);

      me.preRender();
      me.render();

      me.ons();
    },
    fieldCls: FIELD_CLS + ' ' + FIELD_TEXTAREA_CLS,
    value: '',
    width: 250,
    height: 100,
    labelWidth: 60,
    inputWidth: 180,
    minHeight: 100,
    maxHeight: 210,
    lineHeight: 12.5,
    emptyText: '',
    tpl: [
      '<div class="' + FIELD_LABEL_CLS + '" style="{labelWidth}{labelDisplay}">',
      '{label}',
      '</div>',
      '<div class="' + FIELD_TEXTAREA_TEXT_CLS + '">',
      '<textarea autocomplete="off" placeholder="{emptyText}" type="text" class="' + FIELD_TEXTAREA_TEXT_INPUT_CLS + '" style="{inputWidth}height:{inputHeight}px;">{value}</textarea>',
      '<div class="' + FIELD_ERROR_CLS + '" style="{errorTextStyle}"></div>',
      '</div>',
      '<div class="' + CLEARFIX_CLS + '"></div>'
    ],
    /*
     *
     */
    ons: function () {
      var me = this,
        input = me.el.getByTag('textarea');

      me.input = input;
      input.on('blur', me.onBlur, me);
      input.on('focus', me.onFocus, me);
      input.on('input', me.onInput, me);
      input.on('keydown', me.onKeyDown, me);
      me.on('key', me.onKey, me);

      if (me.autoHeight) {
        input.on('input', me.onChange, me);
      }
    },
    /*
     *
     */
    preRender: function () {
      var me = this;

      if (me.tpl) {
        me.tpl = new F.Template(me.tpl);
      }

      me.initHeight();
      me.calcSize();
    },
    /*
     *
     */
    initHeight: function () {
      var me = this,
        height;

      if (me.height) {
        height = me.height;
        if (me.maxHeight < me.height) {
          me.maxHeight = me.height;
          setTimeout(function () {
            me.input.css({
              'overflow-y': 'scroll'
            });
          }, 1);
        }
      }
      else if (me.value) {
        var length = me.value.match(/\n/g);

        if (length) {
          length = length.length;
        }
        else {
          length = 1;
        }

        height = length * me.lineHeight;
      }
      else {
        height = me.height;
      }

      if (height < me.minHeight) {
        height = me.minHeight;
      }
      else if (height > me.maxHeight) {
        height = me.maxHeight;
        setTimeout(function () {
          me.input.css({
            'overflow-y': 'scroll'
          });
        }, 1);
      }

      me.height = height;
      me.inputHeight = height;
    },
    /*
     *
     */
    calcSize: function () {
      var me = this,
        inputWidth,
        padding = me.padding,
        value,
        value1,
        value2,
        value3;

      if (F.isString(padding)) {
        padding = padding.replace(/px/g, '');
        padding = padding.split(' ');
        switch (padding.length) {
          case 1:
            value = Number(padding[0]);
            padding = [value, value, value, value];
            break;
          case 2:
            value1 = Number(padding[0]);
            value2 = Number(padding[1]);

            padding = [value1, value2, value1, value2];
            break;
          case 3:
            value1 = Number(padding[0]);
            value2 = Number(padding[1]);
            value3 = Number(padding[2]);

            padding = [value1, value2, value3, value1];
            break;
          case 4:
            padding = [Number(padding[0]), Number(padding[1]), Number(padding[2]), Number(padding[3])];
            break;
        }
      }
      else if (F.isNumber(padding)) {
        padding = [padding, padding, padding, padding];
      }
      else if (padding === false) {
        padding = [0, 0, 0, 0];
      }

      if (me.labelAlign === 'top') {
        me.inputHeight -= 40;
      }

      inputWidth = me.width;

      if (me.labelAlign !== 'top' && me.label) {
        inputWidth -= me.labelWidth;
      }

      if (me.height === me.inputHeight && me.padding !== false) {
        me.inputHeight -= padding[0] + padding[2];
      }

      me.inputWidth = inputWidth - padding[1] - padding[3];
      me.height = me.inputHeight + padding[0] + padding[2];
    },
    /*
     *
     */
    onChange: function () {
      var me = this,
        value = me.input.dom.value,
        input = me.el.getByTag('textarea'),
        height = value.match(/\n/g).length * me.lineHeight;

      if (height < me.minHeight) {
        height = me.minHeight;
        input.css({
          'overflow-y': 'hidden'
        });
      }
      else if (height > me.maxHeight) {
        height = me.maxHeight;
        input.css({
          'overflow-y': 'scroll'
        });
      }
      else {
        input.css({
          'overflow-y': 'hidden'
        });
      }

      me.height = height;
    }
  });

})();
/*
 * @class Fancy.CheckBox
 * @extends Fancy.Widget
 */
(function() {
  /*
   * CONSTANTS
   */
  var CLEARFIX_CLS = Fancy.CLEARFIX_CLS;
  var FIELD_CLS = Fancy.FIELD_CLS;
  var FIELD_LABEL_CLS = Fancy.FIELD_LABEL_CLS;
  var FIELD_TEXT_CLS = Fancy.FIELD_TEXT_CLS;
  var FIELD_CHECKBOX_CLS = Fancy.FIELD_CHECKBOX_CLS;
  var FIELD_CHECKBOX_INPUT_CLS = Fancy.FIELD_CHECKBOX_INPUT_CLS;
  var FIELD_INPUT_LABEL_CLS =  Fancy.FIELD_INPUT_LABEL_CLS;
  var FIELD_CHECKBOX_ON_CLS = Fancy.FIELD_CHECKBOX_ON_CLS;

  Fancy.define(['Fancy.form.field.CheckBox', 'Fancy.CheckBox'], {
    mixins: [
      Fancy.form.field.Mixin
    ],
    extend: Fancy.Widget,
    type: 'field.checkbox',
    /*
     * @constructor
     * @param {Object} config
     */
    constructor: function (config) {
      Fancy.applyConfig(this, config);
      this.Super('const', arguments);
    },
    /*
     *
     */
    init: function () {
      var me = this;

      me.addEvents(
        'focus', 'blur', 'input',
        'up', 'down',
        'beforechange', 'change',
        'key'
      );

      me.Super('init', arguments);

      me.preRender();
      me.render({
        labelWidth: me.labelWidth,
        labelDispay: me.labelText ? '' : 'none',
        label: me.label
      });

      if (me.expander) {
        me.addCls('fancy-checkbox-expander');
      }

      me.acceptedValue = me.value;
      me.set(me.value, false);

      me.ons();
    },
    labelText: '',
    labelWidth: 60,
    value: false,
    editable: true,
    stopIfCTRL: false,
    checkedCls: FIELD_CHECKBOX_ON_CLS,
    fieldCls: FIELD_CLS + ' ' + FIELD_CHECKBOX_CLS,
    tpl: [
      '<div class="'+FIELD_LABEL_CLS+'" style="{labelWidth}{labelDisplay}">',
        '{label}',
      '</div>',
      '<div class="'+FIELD_TEXT_CLS+'">',
      '<div class="'+FIELD_CHECKBOX_INPUT_CLS+'"></div>',
      '</div>',
      '<div class="'+FIELD_INPUT_LABEL_CLS+'" style="{inputLabelDisplay}">',
        '{inputLabel}',
      '</div>',
      '<div class="'+CLEARFIX_CLS+'"></div>'
    ],
    /*
     *
     */
    ons: function () {
      var me = this,
        el = me.el;

      el.on('click', me.onClick, me);
      el.on('mousedown', me.onMouseDown, me);
    },
    /*
     * @param {Object} e
     */
    onClick: function (e) {
      var me = this,
        el = me.el;

      me.fire('beforechange');

      if (e.ctrlKey && me.stopIfCTRL) {
        return
      }

      if (me.editable === false) {
        return;
      }

      if (me.canceledChange === true) {
        me.canceledChange = true;
        return;
      }

      el.toggleCls(me.checkedCls);
      var oldValue = me.value;
      me.value = el.hasCls(me.checkedCls);
      me.fire('change', me.value, oldValue);
    },
    /*
     * @params {Object} e
     */
    onMouseDown: function (e) {

      e.preventDefault();
    },
    /*
     * @params {*} value
     * @params {Boolean} fire
     */
    set: function (value, fire) {
      var me = this,
        el = me.el;

      if (value === '') {
        value = false;
      }

      if (value === true || value === 1) {
        el.addCls(me.checkedCls);
        value = true;
      }
      else if (value === false || value === 0) {
        el.removeClass(me.checkedCls);
        value = false;
      }
      else if (value === undefined) {
        value = false;
      }
      else {
        throw new Error('not right value for checkbox ' + value);
      }

      me.value = value;
      if (fire !== false) {
        me.fire('change', me.value);
      }
    },
    /*
     * @params {*} value
     * @params {Boolean} onInput
     */
    setValue: function (value, onInput) {
      this.set(value, onInput);
    },
    /*
     * @return {*}
     */
    getValue: function () {
      return this.value;
    },
    /*
     * @return {*}
     */
    get: function () {
      return this.getValue();
    },
    /*
     *
     */
    clear: function () {
      this.set(false);
    },
    /*
     *
     */
    toggle: function () {
      me.set(!this.value);
    }
  });

})();
/*
 * @class Fancy.Switcher
 */
Fancy.define(['Fancy.form.field.Switcher', 'Fancy.Switcher'], {
  extend: Fancy.CheckBox,
  type: 'field.switcher',
  /*
   * @constructor
   * @param {Object} config
   */
  constructor: function(config){
    Fancy.applyConfig(this, config);
    this.Super('const', arguments);
  },
  /*
   *
   */
  init: function(){
    this.Super('init', arguments);
  },
  checkedCls: 'fancy-switcher-on',
  fieldCls: Fancy.FIELD_CLS + ' fancy-field-switcher',
  tpl: [
    '<div class="fancy-field-label" style="{labelWidth}{labelDisplay}">',
      '{label}',
    '</div>',
    '<div class="fancy-field-text">',
    '</div>',
    '<div class="fancy-field-input-label" style="{inputLabelDisplay}">',
      '{inputLabel}',
    '</div>',
    '<div class="fancy-clearfix"></div>'
  ]
});
/**
 * @class Fancy.Combo
 * @extends Fancy.Widget
 *
 * Note: because multiselection code became overcomplex
 */
(function(){
  //SHORTCUTS
  var F = Fancy;

  //CONSTANTS
  var FIELD_CLS = F.FIELD_CLS;
  var FIELD_COMBO_CLS = F.FIELD_COMBO_CLS;
  var FIELD_LABEL_CLS = F.FIELD_LABEL_CLS;
  var FIELD_TEXT_CLS = F.FIELD_TEXT_CLS;
  var CLEARFIX_CLS = F.CLEARFIX_CLS;
  var FIELD_ERROR_CLS = F.FIELD_ERROR_CLS;
  var FIELD_TEXT_INPUT_CLS = F.FIELD_TEXT_INPUT_CLS;

  F.define('Fancy.combo.Manager', {
    singleton: true,
    opened: [],
    add: function(combo){
      this.hideLists();

      this.opened.push(combo);
    },
    hideLists: function(){
      F.each(this.opened, function(item){
        item.hideList();
      });

      this.opened = [];
    }
  });

  F.define(['Fancy.form.field.Combo', 'Fancy.Combo'], {
    type: 'field.combo',
    mixins: [
      F.form.field.Mixin
    ],
    extend: F.Widget,
    selectedItemCls: 'fancy-combo-item-selected',
    focusedItemCls: 'fancy-combo-item-focused',
    fieldCls: FIELD_CLS + ' ' + FIELD_COMBO_CLS,
    width: 250,
    labelWidth: 60,
    listRowHeight: 25,
    dropButtonWidth: 27,
    emptyText: '',
    editable: true,
    typeAhead: true, // not right name
    readerRootProperty: 'data',
    valueKey: 'value',
    displayKey: 'text',
    multiSelect: false,
    itemCheckBox: false,
    tpl: [
      '<div class="' + FIELD_LABEL_CLS + '" style="{labelWidth}{labelDisplay}">',
        '{label}',
      '</div>',
      '<div class="' + FIELD_TEXT_CLS + '">',
        '<div class="fancy-combo-input-container" style="{inputWidth}{inputHeight}">',
          '<input placeholder="{emptyText}" class="' + FIELD_TEXT_INPUT_CLS + '" style="{inputWidth}{inputHeight}cursor:default;" value="{value}">',
          '<div class="fancy-combo-dropdown-button">&nbsp;</div>',
        '</div>',
      '</div>',
      '<div class="' + FIELD_ERROR_CLS + '" style="{errorTextStyle}"></div>',
      '<div class="' + CLEARFIX_CLS + '"></div>'
    ],
    /*
     * @constructor
     */
    constructor: function () {
      this.tags = this.tags || [];
      this.Super('const', arguments);
    },
    /*
     *
     */
    init: function () {
      var me = this;

      me.addEvents(
        'focus', 'blur', 'input',
        'up', 'down', 'change', 'key', 'enter', 'esc',
        'empty',
        'load'
      );
      me.Super('init', arguments);

      if (!me.loadListData()) {
        me.data = me.configData(me.data);
      }

      if(me.multiSelect && me.data.length){
        me.initMultiSelect();
      }

      me.preRender();
      me.render();

      me.ons();

      me.applyStyle();
      me.applyTheme();

      /*
       * Bug fix: #1074
       */
      setTimeout(function () {
        me.applyTheme();
      }, 1);
    },
    /*
     * @return {Boolean}
     */
    loadListData: function () {
      var me = this;

      if (!F.isObject(me.data)) {
        return false;
      }

      var proxy = me.data.proxy,
        readerRootProperty = me.readerRootProperty;

      if (!proxy || !proxy.url) {
        throw new Error('[FancyGrid Error]: combo data url is not defined');
      }

      if (proxy.reader && proxy.reader.root) {
        readerRootProperty = proxy.reader.root;
      }

      F.Ajax({
        url: proxy.url,
        params: proxy.params || {},
        method: proxy.method || 'GET',
        getJSON: true,
        success: function (o) {
          me.data = me.configData(o[readerRootProperty]);
          me.renderList();
          me.onsList();

          if(me.multiSelect){
            me.initMultiSelect();

            if(me.value){
              me.updateInput();
            }
          }
          else if (me.value) {
            var displayValue = me.getDisplayValue(me.value);

            if (displayValue) {
              me.input.dom.value = displayValue;
            }
          }

          me.fire('load');
        }
      });

      return true;
    },
    /*
     * @param {Array} data
     * @return {Array}
     */
    configData: function (data) {
      if (F.isObject(data) || data.length === 0) {
        return data;
      }

      if (!F.isObject(data[0])) {
        var _data = [],
          i = 0,
          iL = data.length;

        for (; i < iL; i++) {
          _data.push({
            text: data[i],
            value: i
          });
        }

        return _data;
      }

      return data;
    },
    /*
     *
     */
    applyStyle: function () {
      var me = this;

      if (me.hidden) {
        me.css('display', 'none');
      }

      if (me.style) {
        me.css(me.style);
      }
    },
    /*
     *
     */
    applyTheme: function () {
      var me = this;

      if (me.theme && me.theme !== 'default') {
        me.addCls('fancy-theme-' + me.theme);
        me.list.addCls('fancy-theme-' + me.theme);
      }
    },
    /*
     *
     */
    ons: function () {
      var me = this,
        drop = me.el.select('.fancy-combo-dropdown-button');

      me.input = me.el.getByTag('input');
      me.inputContainer = me.el.select('.fancy-combo-input-container');
      me.drop = drop;

      me.onsList();

      me.input.on('mousedown', me.onInputMouseDown, me);
      me.input.on('click', me.onInputClick, me);
      drop.on('mousedown', me.onDropMouseDown, me);
      drop.on('click', me.onDropClick, me);

      if (me.typeAhead && me.editable) {
        me.input.on('keydown', me.onKeyDown, me);
      }

      me.on('esc', me.onEsc, me);
      me.on('enter', me.onEnter, me);
      me.on('up', me.onUp, me);
      me.on('down', me.onDown, me);
    },
    /*
     * @param {Object} e
     */
    onKeyDown: function (e) {
      var me = this,
        keyCode = e.keyCode,
        key = F.key;

      switch (keyCode) {
        case key.ESC:
          me.fire('esc', e);
          break;
        case key.ENTER:
          me.fire('enter', e);
          break;
        case key.UP:
          me.fire('up', e);
          break;
        case key.DOWN:
          me.fire('down', e);
          break;
        case key.TAB:
          break;
        case key.BACKSPACE:
          setTimeout(function () {
            if (me.input.dom.value.length === 0) {
              me.value = -1;
              me.valueIndex = -1;
              me.hideAheadList();

              if (me.multiSelect) {
                me.values = [];
                me.clearListActive();
              }

              me.fire('empty');
            }
            else {
              if(me.multiSelect){
                if(me.input.dom.value.split(',').length !== me.valuesIndex.length){
                  var newValues = me.getFromInput();

                  me.set(newValues);
                }
              }

              if (me.generateAheadData().length === 0) {
                me.hideAheadList();
                return;
              }

              me.renderAheadList();
              me.showAheadList();
            }
          }, 100);
          break;
        default:
          setTimeout(function () {
            if (me.generateAheadData().length === 0) {
              me.hideAheadList();
              return;
            }

            me.renderAheadList();
            me.showAheadList();
          }, 1);
      }
    },
    /*
     * @param {Object} e
     */
    onInputClick: function (e) {
      var me = this,
        list = me.list;

      if (me.editable === true) {
        return;
      }

      if (list.css('display') === 'none') {
        me.showList();
      }
      else {
        me.hideList();
      }
    },
    /*
     * @param {Object} e
     */
    onDropClick: function (e) {
      var me = this,
        list = me.list;

      if (list.css('display') === 'none') {
        F.combo.Manager.add(this);
        
        me.showList();
      }
      else {
        me.hideList();
      }

      if (me.editable === true) {
        me.input.focus();
      }
    },
    /*
     *
     */
    showList: function () {
      var me = this,
        list = me.list,
        el = me.input.parent().parent(),
        p = el.$dom.offset(),
        xy = [p.left, p.top + el.$dom.height()],
        docEl = F.get(document),
        selectedItemCls = me.selectedItemCls,
        focusedItemCls = me.focusedItemCls;

      me.hideAheadList();

      if (!me.list) {
        return;
      }

      list.css({
        display: '',
        left: xy[0] + 'px',
        top: xy[1] + 'px',
        width: me.getListWidth(),
        "z-index": 2000 + F.zIndex++
      });

      var index;

      me.clearFocused();

      var selected = list.select('.' + selectedItemCls);

      if (selected.length === 0) {
        if(me.multiSelect && me.values.length){
          me.valuesIndex.each(function (i, value, length) {
            if(index === undefined){
              index = i;
            }

            list.select('li').item(i).addCls(selectedItemCls);
          });
        }
        else {
          index = 0;
        }
      }
      else {
        if(me.multiSelect && selected.length !== me.valuesIndex.length){
          list.select('.' + selectedItemCls).removeCls(selectedItemCls);

          me.valuesIndex.each(function (i, value, length) {
            if(index === undefined){
              index = i;
            }
            list.select('li').item(i).addCls(selectedItemCls);
          });
        }

        index = selected.item(0).index();
      }

      if(index === -1){
        index = 0;
      }

      list.select('li').item(index).addCls(focusedItemCls);
      me.scrollToListItem(index);

      if (!me.docSpy) {
        me.docSpy = true;
        docEl.on('click', me.onDocClick, me);
      }
    },
    /*
     *
     */
    showAheadList: function () {
      var me = this,
        list = me.aheadList,
        el = me.input.parent().parent(),
        p = el.$dom.offset(),
        xy = [p.left, p.top + el.$dom.height()],
        docEl = F.get(document);

      me.hideList();

      if (!list) {
        return;
      }

      list.css({
        display: '',
        left: xy[0] + 'px',
        top: xy[1] + 'px',
        //width: el.width(),
        width: me.getListWidth(),
        "z-index": 2000 + F.zIndex++
      });

      if (!me.docSpy2) {
        me.docSpy2 = true;
        docEl.on('click', me.onDocClick, me);
      }
    },
    /*
     * @param {Object} e
     */
    onDocClick: function (e) {
      var me = this;

      if (me.input.parent().parent().within(e.target) === false) {
        if (me.list.within(e.target) === true) {
          return;
        }
        me.hideList();
        me.hideAheadList();
      }
    },
    /*
     *
     */
    hideList: function () {
      var me = this;

      if (!me.list) {
        return;
      }

      me.list.css('display', 'none');

      if (me.docSpy) {
        var docEl = F.get(document);
        me.docSpy = false;
        docEl.un('click', me.onDocClick, me);
      }
    },
    /*
     *
     */
    hideAheadList: function () {
      var me = this;

      if (!me.aheadList) {
        return;
      }

      me.aheadList.css('display', 'none');

      if (me.docSpy) {
        var docEl = F.get(document);
        me.docSpy = false;
        docEl.un('click', me.onDocClick, me);
      }
    },
    /*
     * @param {Object} e
     */
    onInputMouseDown: function (e) {
      if (this.editable === false) {
        e.preventDefault();
      }
    },
    /*
     * @param {Object} e
     */
    onDropMouseDown: function (e) {
      e.preventDefault();
    },
    /*
     *
     */
    onsList: function () {
      var me = this;

      me.list.on('click', me.onListItemClick, me, 'li');
      me.list.on('mouseenter', me.onListItemOver, me, 'li');
      me.list.on('mouseleave', me.onListItemLeave, me, 'li');
    },
    /*
     *
     */
    onsAheadList: function () {
      var me = this;

      me.aheadList.on('click', me.onListItemClick, me, 'li');
    },
    /*
     * @param {Object} e
     */
    onListItemOver: function (e) {
      var li = F.get(e.target);

      li.addCls(this.focusedItemCls);
    },
    /*
     *
     */
    onListItemLeave: function () {
      this.clearFocused();
    },
    /*
     * @param {Object} e
     */
    onListItemClick: function (e) {
      var me = this,
        li = F.get(e.currentTarget),
        value = li.attr('value'),
        selectedItemCls = me.selectedItemCls,
        focusedItemCls = me.focusedItemCls;

      if (F.nojQuery && value === 0) {
        value = '';
      }

      if (me.multiSelect) {
        if (me.values.length === 0) {
          me.clearListActive();
        }

        me.clearFocused();

        li.toggleCls(selectedItemCls);

        if (li.hasCls(selectedItemCls)) {
          me.addValue(value);
          li.addCls(focusedItemCls);
        }
        else {
          me.removeValue(value);
          me.clearFocused()
        }

        me.updateInput();
      }
      else {
        me.set(value);
        me.hideList();
      }

      if (me.editable) {
        me.input.focus();
      }
      else {
        me.onBlur();
      }
    },
    /*
     * @param {*} value
     * @param {Boolean} onInput
     */
    set: function (value, onInput) {
      var me = this,
        valueStr = '',
        index;

      if(me.multiSelect && !F.isArray(value)){
        if(value === -1){
          value = [];
        }
        else {
          value = [value];
        }
      }

      if(F.isArray(value) && me.multiSelect){
        var displayedValues = [];

        me.valuesIndex.removeAll();

        F.each(value, function(v, i){
          var _index = me.getIndex(v);

          if(_index === -1){
            return;
          }

          me.valuesIndex.add(_index, value[i]);

          displayedValues.push(me.data[_index][me.displayKey]);

          valueStr = displayedValues.join(', ');
        });

        me.values = value;
        index = me.getIndex(value[0]);
        me.value = value[0];
        me.valueIndex = index;
      }
      else{
        index = me.getIndex(value);

        if(index !== -1) {
          me.valueIndex = index;
          valueStr = me.data[index][me.displayKey];
          me.selectItem(index);
        }
        else{
          if (value !== -1 && value && value.length > 0) {
            valueStr = '';
            //valueStr = value;
            me.value = -1;
            me.valueIndex = -1;
          }
          else {
            valueStr = '';
          }
        }

        me.value = value;
      }

      me.input.dom.value = valueStr;

      if (onInput !== false) {
        me.onInput();
      }
    },
    /*
     * Method used only for multiSelect
     *
     * @param {*} v
     */
    addValue: function(v){
      var me = this,
        index = me.getIndex(v);

      if(index !== -1 && !me.valuesIndex.get(index)){
        me.value = v;
        me.values.push(v);
        me.valuesIndex.add(index, v);
      }
    },
    /*
     * Method used only for multiSelect
     *
     * @param {*} v
     */
    removeValue: function(v){
      var me = this,
        index = -1;

      F.each(me.values, function(value, i){
        if( value === v ){
          index = i;
        }
      });

      if(index !== -1) {
        me.values.splice(index, 1);
        me.valuesIndex.remove(me.getIndex(v));
      }

      if (me.values.length) {
        me.value = me.values[me.values.length - 1];
      }
      else {
        me.value = -1;
        me.valueIndex = -1;
      }
    },
    /*
     * Method used only for multiSelect
     *
     * @param {Boolean} onInput
     */
    updateInput: function(onInput){
      var me = this,
        displayValues = [];

      me.valuesIndex.each(function (i, v, length) {
        displayValues.push(me.data[i][me.displayKey]);
      });

      me.input.dom.value = displayValues.join(", ");

      if (onInput !== false) {
        me.onInput();
      }
    },
    /*
     * @param {Number} index
     */
    selectItem: function(index){
      var me = this;

      if (!me.list) {
        return;
      }

      if (!me.multiSelect) {
        me.clearListActive();
      }

      me.clearFocused();

      var item = me.list.select('li').item(index);

      item.addCls(me.focusedItemCls, me.selectedItemCls);
    },
    /*
     *
     */
    render: function () {
      var me = this,
        renderTo = F.get(me.renderTo || document.body).dom,
        el = F.get(document.createElement('div')),
        value = me.value,
        index = -1;

      el.attr('id', me.id);

      if (value === undefined) {
        value = '';
      }
      else {
        if(me.multiSelect && F.isArray(me.data) && me.data.length > 0){
          value = '';

          me.valuesIndex.each(function(i, v){
            if(index === -1){
              index = i;
              me.valueIndex = i;
            }

            value += me.data[i][me.displayKey] + ', ';
          });

          value = value.replace(/, $/, '');
        }
        else {
          index = me.getIndex(value);

          if (index !== -1) {
            me.valueIndex = index;
            value = me.data[index][me.displayKey];
          }
          else {
            value = '';
          }
        }
      }

      me.fire('beforerender');
      el.addCls(
        F.cls,
        me.cls,
        me.fieldCls
      );

      var labelWidth = '';

      if (me.labelWidth) {
        labelWidth = 'width:' + me.labelWidth + 'px;';
      }

      var label = me.label;

      if (me.label === '') {
        label = '&nbsp;';
      }
      else if (me.label === undefined) {
        label = '&nbsp;';
      }
      else if (me.labelAlign !== 'right') {
        label += ':';
      }

      el.update(me.tpl.getHTML({
        labelWidth: labelWidth,
        labelDisplay: me.label === false ? 'display: none;' : '',
        label: label === false ? '' : label,
        emptyText: me.emptyText,
        inputHeight: 'height:' + me.inputHeight + 'px;',
        value: value
      }));

      me.el = el;
      me.setStyle();

      me.input = me.el.getByTag('input');
      me.inputContainer = me.el.select('.fancy-combo-input-container');
      me.drop = me.el.select('.fancy-combo-dropdown-button');
      me.setSize();
      renderTo.appendChild(el.dom);

      if (me.labelAlign === 'top') {
        me.el.addCls('fancy-field-label-align-top');
      }
      else if (me.labelAlign === 'right') {
        me.el.addCls('fancy-field-label-align-right');
        $(el.dom).find('.fancy-field-label').insertAfter($(el.dom).find('.fancy-field-text'));
      }

      if (me.valueIndex) {
        me.acceptedValue = me.value;
      }

      if (me.editable) {
        me.input.css('cursor', 'auto');
      }

      me.renderList();

      me.fire('afterrender');
      me.fire('render');
    },
    /*
     *
     */
    renderList: function () {
      var me = this,
        list = F.get(document.createElement('div')),
        listHtml = [
          '<ul style="position: relative;">'
        ];

      if (me.list) {
        me.list.destroy();
      }

      F.each(me.data, function (row, i) {
        var isActive = '',
          displayValue = row[me.displayKey],
          value = row[me.valueKey];

        if (me.value === value) {
          isActive = me.selectedItemCls;
        }

        if (displayValue === '' || displayValue === ' ') {
          displayValue = '&nbsp;';
        }
        else if (me.listItemTpl) {
          var listTpl = new F.Template(me.listItemTpl);
          displayValue = listTpl.getHTML(row);
        }

        if (me.multiSelect && me.itemCheckBox) {
          listHtml.push('<li value="' + value + '" class="' + isActive + '"><div class="fancy-field-checkbox-input" style=""></div><span class="fancy-combo-list-value">' + displayValue + '</span></li>');
        }
        else {
          listHtml.push('<li value="' + value + '" class="' + isActive + '"><span class="fancy-combo-list-value">' + displayValue + '</span></li>');
        }
      });

      listHtml.push('</ul>');

      list.addCls('fancy fancy-combo-result-list');
      list.update(listHtml.join(""));

      list.css({
        display: 'none',
        left: '0px',
        top: '0px',
        width: me.getListWidth()
      });

      if (me.data.length > 9) {
        list.css({
          height: me.listRowHeight * 9 + 'px',
          overflow: 'auto'
        });
      }

      document.body.appendChild(list.dom);
      me.list = list;
    },
    /*
     * @return {Number}
     */
    getListWidth: function(){
      var me = this,
        el,
        listWidth = me.inputWidth + 14,
        minListWidth = me.minListWidth;

      if (me.input) {
        el = me.input.parent().parent();
        listWidth = el.width();
      }

      if (minListWidth && minListWidth > listWidth) {
        listWidth = minListWidth;
      }

      return listWidth;
    },
    /*
     * @return {Array}
     */
    generateAheadData: function(){
      var me = this,
        inputValue = me.input.dom.value.toLocaleLowerCase(),
        aheadData = [];

      if (me.multiSelect) {
        var splitted = inputValue.split(', '),
          inputSelection = me.getInputSelection(),
          passedCommas = 0;

        F.each(inputValue, function (v, i) {
          if(inputSelection.start <= i){
            return true;
          }

          if(inputValue[i] === ','){
            passedCommas++;
          }
        });

        inputValue = splitted[passedCommas];
      }

      F.each(me.data, function (item){
        if (new RegExp('^' + inputValue).test(item[me.displayKey].toLocaleLowerCase())) {
          aheadData.push(item);
        }
      });

      if (me.data.length === aheadData.length) {
        aheadData = [];
      }

      me.aheadData = aheadData;

      return aheadData;
    },
    /*
     *
     */
    renderAheadList: function () {
      var me = this,
        list,
        listHtml = [
          '<ul style="position: relative;">'
        ],
        presented = false;

      if (me.aheadList) {
        me.aheadList.firstChild().destroy();
        list = me.aheadList;
        presented = true;
      }
      else {
        list = F.get(document.createElement('div'));
      }

      F.each(me.aheadData, function (row, i) {
        var isActive = '',
          displayValue = row[me.displayKey],
          value = row[me.valueKey];

        if (i === 0) {
          isActive = me.selectedItemCls;
        }

        if (displayValue === '' || displayValue === ' ') {
          displayValue = '&nbsp;';
        }

        listHtml.push('<li value="' + value + '" class="' + isActive + '"><span class="fancy-combo-list-value">' + displayValue + '</span></li>');
      });

      listHtml.push('</ul>');

      list.update(listHtml.join(""));
      list.css({
        display: 'none',
        left: '0px',
        top: '0px',
        width: me.getListWidth()
      });

      list.css({
        'max-height': me.listRowHeight * 9 + 'px',
        overflow: 'auto'
      });

      if (presented === false) {
        list.addClass(F.cls, 'fancy-combo-result-list');
        document.body.appendChild(list.dom);
        me.aheadList = list;

        me.onsAheadList();
      }
    },
    /*
     *
     */
    hide: function () {
      var me = this;

      me.css('display', 'none');
      me.hideList();
      me.hideAheadList();
    },
    /*
     *
     */
    clear: function () {
      var me = this;

      if(me.multiSelect){
        me.set([], false);
      }
      else {
        me.set(-1, false);
      }
    },
    /*
     *
     */
    clearListActive: function () {
      var me = this,
        selectedItemCls = me.selectedItemCls,
        focusedItemCls = me.focusedItemCls;

      me.list.select('.' + focusedItemCls).removeCls(focusedItemCls);
      me.list.select('.' + selectedItemCls).removeCls(selectedItemCls);
    },
    clearFocused: function () {
      var me = this,
        focusedItemCls = me.focusedItemCls;

      if(me.list) {
        me.list.select('.' + focusedItemCls).removeCls(focusedItemCls);
      }

      if(me.aheadList) {
        me.aheadList.select('.' + focusedItemCls).removeCls(focusedItemCls);
      }
    },
    /*
     *
     */
    onInput: function () {
      var me = this,
        value = me.getValue(),
        oldValue = me.acceptedValue;

      me.acceptedValue = me.get();
      me.fire('change', value, oldValue);
    },
    /*
     * @param {*} value
     * @param {Boolean} onInput
     */
    setValue: function (value, onInput) {
      this.set(value, onInput);
    },
    /*
     * @param {key} value
     * @return {*}
     */
    getDisplayValue: function (value, returnPosition) {
      var me = this,
        index = me.getIndex(value);

      if(returnPosition){
        return index;
      }
      else{
        return me.data[index][me.displayKey];
      }
    },
    /*
     * @param {key} value
     * @param {Boolean} [returnPosition]
     */
    getValueKey: function (value, returnPosition) {
      var me = this,
        i = 0,
        iL = me.data.length;

      for(;i<iL;i++){
        if (me.data[i][me.displayKey] === value) {
          if (returnPosition) {
            return i;
          }

          return me.data[i][me.valueKey];
        }
      }
    },
    /*
     * @return {*}
     */
    get: function () {
      return this.getValue();
    },
    /*
     * @return {*}
     */
    getValue: function () {
      var me = this;

      if (me.multiSelect) {
        return me.values;
      }

      if (me.value === -1 || me.value === undefined) {
        if (me.value === -1 && me.input.dom.value) {
          return me.input.dom.value;
        }
        return '';
      }

      if (me.valueKey !== undefined) {
        return me.value;
      }

      return me.value;
    },
    /*
     * @param {Object} o
     */
    size: function (o) {
      var me = this,
        width = o.width,
        height = o.height,
        input = me.input,
        inputContainer = me.inputContainer,
        drop = me.drop;

      if (me.labelAlign !== 'top') {
        me.inputHeight = height;
      }

      if (height !== undefined) {
        me.height = height;
      }

      if (width !== undefined) {
        me.width = width;
      }

      me.calcSize();

      if (me.labelAlign === 'top') {
        me.css({
          height: me.height * 1.5,
          width: me.width
        });
      }
      else {
        me.css({
          height: me.height,
          width: me.width
        });
      }

      var inputWidth = me.inputWidth;

      input.css({
        width: inputWidth - 2,
        height: me.inputHeight
      });

      inputContainer.css({
        width: inputWidth,
        height: me.inputHeight
      });

      drop.css('height', me.inputHeight);
    },
    /*
     * @param {Object} field
     * @param {Object} e
     */
    onEnter: function (field, e) {
      var me = this,
        list = me.getActiveList(),
        focusedItemCls = me.focusedItemCls,
        selectedItemCls = me.selectedItemCls,
        value;

      if (me.multiSelect) {
        if (!list) {
          return;
        }

        var item = list.select('.' + focusedItemCls);

        if (!item || !item.dom) {
          item = list.select('.' + selectedItemCls).last();
        }

        if (item && item.dom) {
          value = item.attr('value');

          me.addValue(value);

          var position = me.getDisplayValue(value, true);
          me.selectItem(position);

          me.updateInput();
        }
      }
      else if (list) {
        var item = list.select('.' + focusedItemCls);

        if(!item || !item.dom){
          item = list.select('.' + selectedItemCls);
        }

        value = item.attr('value');

        me.set(value);
      }
      else {
        me.set(me.input.dom.value);
      }

      me.hideList();
      me.hideAheadList();
    },
    /*
     * @param {Object} field
     * @param {Object} e
     */
    onEsc: function (field, e) {
      var me = this;

      me.hideList();
      me.hideAheadList();
    },
    /*
     * @param {Object} field
     * @param {Object} e
     */
    onUp: function (field, e) {
      var me = this,
        list = me.getActiveList(),
        focusedItemCls = me.focusedItemCls;

      if (list) {
        e.preventDefault();
        var activeLi = list.select('.' + focusedItemCls),
          notFocused = false;

        if (!activeLi.dom) {
          notFocused = true;
          activeLi = list.lastChild();
        }

        var index = activeLi.index(),
          lis = list.select('li'),
          height = parseInt(list.css('height'));

        if (index !== 0 && !notFocused) {
          index--;
        }
        else {
          index = lis.length - 1;
        }

        var nextActiveLi = lis.item(index),
          top = nextActiveLi.position().top;

        if (top - list.dom.scrollTop > height) {
          list.dom.scrollTop = 10000;
        }
        else if (top - list.dom.scrollTop < 0) {
          list.dom.scrollTop = top;
        }

        me.clearFocused();

        nextActiveLi.addClass(focusedItemCls);
      }
    },
    /*
     * @param {Object} field
     * @param {Object} e
     */
    onDown: function (field, e) {
      var me = this,
        list = me.getActiveList(),
        focusedItemCls = me.focusedItemCls;

      if (list) {
        e.preventDefault();

        var activeLi = list.select('.' + focusedItemCls),
          notFocused = false;

        if (!activeLi.dom) {
          notFocused = true;
          activeLi = list.firstChild();
        }

        var activeLiHeight = parseInt(activeLi.css('height')),
          index = activeLi.index(),
          lis = list.select('li'),
          height = parseInt(list.css('height'));

        if (index !== lis.length - 1 && !notFocused) {
          index++;
        }
        else {
          index = 0;
        }

        var nextActiveLi = lis.item(index),
          top = nextActiveLi.position().top,
          nextActiveLiHeight = parseInt(nextActiveLi.css('height'));

        if (top - list.dom.scrollTop < 0) {
          list.dom.scrollTop = 0;
        }
        else if (top + nextActiveLiHeight + 3 - list.dom.scrollTop > height) {
          list.dom.scrollTop = top - height + activeLiHeight + nextActiveLiHeight;
        }

        me.clearFocused();

        nextActiveLi.addClass(focusedItemCls);
      }
      else {
        me.showList();
      }
    },
    /*
     * @param {Number} index
     */
    scrollToListItem: function (index) {
      var me = this,
        list = me.getActiveList(),
        lis = list.select('li'),
        item = lis.item(index),
        top = item.position().top,
        height = parseInt(list.css('height'));

      if (index === 0) {
        list.dom.scrollTop = 0;
      }
      else if (index === lis.length - 1) {
        list.dom.scrollTop = 10000;
      }
      else {
        list.dom.scrollTop = top;
      }
    },
    /*
     * @return {Fancy.Element}
     */
    getActiveList: function () {
      var me = this,
        list = false;

      if (me.list && me.list.css('display') !== 'none') {
        list = me.list;
      }
      else if (me.aheadList && me.aheadList.css('display') !== 'none') {
        list = me.aheadList;
      }

      return list;
    },
    /*
     *
     */
    initMultiSelect: function () {
      var me = this,
        value = me.value;

      me.values = [];
      me.valuesIndex = new F.Collection();

      if(me.value !== undefined && value !== null && value !== ''){
        if(F.isArray(value)){
          me.values = value;
          me.value = value[0];
        }
        else{
          me.values = [me.value];
        }

        F.each(me.values, function(value){
          me.valuesIndex.add(me.getIndex(value), value);
        });
      }
    },
    /*
     * @param {*} value
     * @return {Number}
     */
    getIndex: function(value){
      var me = this,
        data = me.data,
        i = 0,
        iL = data.length,
        index = -1;

      for(;i<iL;i++){
        if(data[i][me.valueKey] == value) {
          return i;
        }
      }

      return index;
    },
    /*
     * Method used only for multiSelect
     *
     * @return {Array}
     */
    getFromInput: function(){
      var me = this,
        value = me.input.dom.value,
        values = value.split(','),
        _values = [];

      F.each(values, function(v){
        var displayValue = v.replace(/ $/, '').replace(/^ /, ''),
          _value = me.getValueKey(displayValue);

        if(_value){
          _values.push(_value);
        }
      });

      return _values;
    }
  });

})();
/*
 * @class Fancy.ButtonField
 * @extends Fancy.Widget
 */
(function() {
  //SHORTCUTS
  var F = Fancy;
  /*
   * CONSTANTS
   */
  var CLEARFIX_CLS = F.CLEARFIX_CLS;
  var FIELD_CLS = F.FIELD_CLS;
  var FIELD_LABEL_CLS = F.FIELD_LABEL_CLS;
  var FIELD_TEXT_CLS = F.FIELD_TEXT_CLS;
  var FIELD_BUTTON_CLS= F.FIELD_BUTTON_CLS;

  F.define(['Fancy.form.field.Button', 'Fancy.ButtonField'], {
    mixins: [
      F.form.field.Mixin
    ],
    extend: F.Widget,
    type: 'field.button',
    pressed: false,
    /*
     * @constructor
     * @param {Object} config
     */
    constructor: function (config) {
      F.apply(this, config);
      this.Super('const', arguments);
    },
    /*
     *
     */
    init: function () {
      var me = this;

      me.addEvents('click');

      me.Super('init', arguments);

      me.preRender();
      me.render();
      me.renderButton();

      me.ons();

      if (me.hidden) {
        me.css('display', 'none');
      }

      if (me.style) {
        me.css(me.style);
      }
    },
    fieldCls: FIELD_CLS + ' ' + FIELD_BUTTON_CLS,
    value: '',
    width: 100,
    emptyText: '',
    tpl: [
      '<div class="'+FIELD_LABEL_CLS+'" style="{labelWidth}{labelDisplay}">',
      '{label}',
      '</div>',
      '<div class="'+FIELD_TEXT_CLS+'">',
      '</div>',
      '<div class="'+CLEARFIX_CLS+'"></div>'
    ],
    /*
     *
     */
    renderButton: function(){
      var me = this;

      new F.Button({
        renderTo: me.el.select('.' + FIELD_TEXT_CLS).item(0).dom,
        text: me.buttonText,
        handler: function () {
          if (me.handler) {
            me.handler();
          }
        }
      });
    },
    /*
     *
     */
    ons: function () {
    },
    /*
     *
     */
    onClick: function () {
      var me = this;

      me.fire('click');

      if (me.handler) {
        me.handler();
      }
    }
  });
})();
/*
 * @class Fancy.SegButtonField
 * @extends Fancy.Widget
 */
Fancy.define(['Fancy.form.field.SegButton', 'Fancy.SegButtonField'], {
  mixins: [
    Fancy.form.field.Mixin
  ],
  extend: Fancy.Widget,
  type: 'field.button',
  allowToggle: true,
  /*
   * @constructor
   * @param {Object} config
   */
  constructor: function(config){
    Fancy.apply(this, config);
    this.Super('const', arguments);
  },
  /*
   *
   */
  init: function(){
    var me = this;

    me.addEvents('click', 'change');

    me.Super('init', arguments);

    me.preRender();
    me.render();
    me.renderButton();

    me.ons();

    if( me.hidden ){
      me.css('display', 'none');
    }

    if( me.style ){
      me.css(me.style);
    }
  },
  fieldCls: 'fancy fancy-field fancy-field-button',
  value: '',
  width: 100,
  emptyText: '',
  tpl: [
    '<div class="fancy-field-label" style="{labelWidth}{labelDisplay}">',
      '{label}',
    '</div>',
    '<div class="fancy-field-text">',
    '</div>',
    '<div class="fancy-clearfix"></div>'
  ],
  /*
   *
   */
  renderButton: function(){
    var me = this;

    me.button = new Fancy.SegButton({
      renderTo: me.el.select('.fancy-field-text').item(0).dom,
      items: me.items,
      multiToggle: me.multiToggle,
      allowToggle: me.allowToggle
    });
  },
  /*
   *
   */
  ons: function(){
    var me = this;

    me.button.on('toggle', function(){
      me.fire('toggle');
    });
  },
  /*
   *
   */
  onClick: function(){
    var me = this;

    me.fire('click');

    if(me.handler){
      me.handler();
    }
  },
  /*
   * @return {String}
   */
  get: function(){
    var me = this,
      pressed = [];

    Fancy.each(me.items, function (item, i) {
      if(item.pressed){
        if(item.value){
          pressed.push(item.value);
        }
        else {
          pressed.push(i);
        }
      }
    });

    return pressed.toString();
  },
  /*
   * @param {Boolean} [fire]
   */
  clear: function(fire){
    if(this.allowToggle){
      Fancy.each(this.items, function (item){
        item.setPressed(false, fire);
      });
    }
  }
});
/*
 * @class Fancy.FieldLine
 * @extend Fancy.Widget
 */
Fancy.define(['Fancy.form.field.Line', 'Fancy.FieldLine'], {
  mixins: [
    Fancy.form.field.Mixin
  ],
  extend: Fancy.Widget,
  type: 'field.line',
  /*
   * @constructor
   * @param {Object} config
   */
  constructor: function(config){
    Fancy.apply(this, config);
    this.Super('const', arguments);
  },
  /*
   *
   */
  init: function(){
    var me = this;

    me.addEvents();

    me.Super('init', arguments);

    var i = 0,
      iL = me.items.length,
      isItemTop;

    for(;i<iL;i++){
      var item = me.items[i];

      item.style = item.style || {};

      if( item.labelAlign === 'top' ){
        isItemTop = true;
      }
      else{
        item.style['padding-top'] = '0px'
      }

      if( i === 0 ){
        item.style['padding-left'] = '0px';
      }
    }

    me.preRender();
    me.render();

    if( isItemTop ){
      me.css('height', '48px');
    }
  },
  fieldCls: 'fancy fancy-field fancy-field-line',
  value: '',
  width: 100,
  emptyText: '',
  tpl: [
    '<div class="fancy-field-text fancy-field-line-items">',
    '</div>'
  ]
});
/*
 * @class Fancy.SetField
 * @extends Fancy.Widget
 */
Fancy.define(['Fancy.form.field.Set', 'Fancy.SetField'], {
  mixins: [
    Fancy.form.field.Mixin
  ],
  extend: Fancy.Widget,
  type: 'field.set',
  /*
   * @constructor
   * @param {Object} config
   */
  constructor: function(config){
    Fancy.apply(this, config);
    this.Super('const', arguments);
  },
  /*
   *
   */
  init: function(){
    var me = this;

    me.addEvents('beforecollapse', 'collapse', 'expanded');

    me.Super('init', arguments);

    Fancy.each(me.items, function(item, i){
      if( item.labelAlign === 'top' ){
        if( i === 0 ){
          item.style = {
            'padding-left': '0px'
          };
        }
      }
    });

    me.preRender();
    me.render();
    if( me.checkbox !== undefined ){
      me.initCheckBox();
    }

    me.on('beforecollapse', me.onBeforeCollapsed, me);
    me.on('expanded', me.onExpanded, me);
  },
  fieldCls: 'fancy-field-set',
  value: '',
  width: 100,
  emptyText: '',
  tpl: [
    '<fieldset>',
      '<legend>',
        '<div class="fancy-field-checkbox-input" style="float:left;margin-top: 4px;display: none;"></div>',
        '<div class="fancy-field-set-label" style="float:left;">{label}</div>',
        '<div class="fancy-clearfix"></div>',
      '</legend>',
      '<div class="fancy-field-text fancy-field-set-items">',

      '</div>',
    '</fieldset>'
  ],
  /*
   *
   */
  initCheckBox: function(){
    var me = this,
      checkbox = me.el.select('.fancy-field-checkbox-input');

    checkbox.css('display', '');

    if( me.checkbox === true ){
      me.addCls('fancy-checkbox-on');
    }

    var itemsEl = me.el.select('.fancy-field-set-items');

    setTimeout(function(){
      if( me.checkbox === true ){}
      else{
        me.fire('collapse');
      }
    }, 1);

    if( me.checkbox === true ){
      itemsEl.css('display', '');
      me.removeCls('fancy-set-collapsed');
    }
    else{
      itemsEl.css('display', 'none');
      me.addCls('fancy-set-collapsed');
    }

    checkbox.on('click', function(){
      me.toggleCls('fancy-checkbox-on');

      var isChecked = me.el.hasCls('fancy-checkbox-on'),
        itemsEl = me.el.select('.fancy-field-set-items');

      if( isChecked ){
        me.fire('beforeexpanded');
        itemsEl.css('display', '');
        me.removeCls('fancy-set-collapsed');
        me.fire('expanded');
      }
      else{
        me.fire('beforecollapse');
        itemsEl.css('display', 'none');
        me.addCls('fancy-set-collapsed');
        me.fire('collapse');
      }
    });
  },
  /*
   *
   */
  onBeforeCollapsed: function(){
    var me = this,
      form = me.form,
      itemsEl = me.el.select('.fancy-field-set-items'),
      itemsHeight = parseInt(itemsEl.css('height'));

    form.setHeight(form.getHeight() - itemsHeight);
  },
  /*
   *
   */
  onExpanded: function(){
    var me = this,
      form = me.form,
      itemsEl = me.el.select('.fancy-field-set-items'),
      itemsHeight = parseInt(itemsEl.css('height'));

    form.setHeight(form.getHeight() + itemsHeight);
  }
});
/*
 * @class Fancy.Tab
 * @extends Fancy.Widget
 */
Fancy.define(['Fancy.form.field.Tab', 'Fancy.Tab'], {
  mixins: [
    Fancy.form.field.Mixin
  ],
  extend: Fancy.Widget,
  type: 'field.tab',
  /*
   * @constructor
   * @param {Object} config
   */
  constructor: function(config){
    Fancy.apply(this, config);
    this.Super('const', arguments);
  },
  /*
   *
   */
  init: function(){
    var me = this;

    me.addEvents('collapsed', 'expanded');

    me.Super('init', arguments);

    var i = 0,
      iL = me.items.length,
      isItemTop;

    for(;i<iL;i++){
      var item = me.items[i];

      if( item.labelAlign === 'top' ){
        isItemTop = true;
        //break;
        if( i === 0 ){
          item.style = {
            'padding-left': '0px'
          };
        }
      }
    }

    me.preRender();
    me.render();
  },
  fieldCls: 'fancy fancy-field-tab',
  value: '',
  width: 100,
  emptyText: '',
  tpl: [
    '<div class="fancy-field-text fancy-field-tab-items">',
    '</div>'
  ]
});
/*
 * @class Fancy.HTMLField
 * @extends Fancy.Widget
 */
Fancy.define(['Fancy.form.field.HTML', 'Fancy.HTMLField'], {
  mixins: [
    Fancy.form.field.Mixin
  ],
  extend: Fancy.Widget,
  type: 'field.html',
  /*
   * @constructor
   * @param {Object} config
   */
  constructor: function(config){
    Fancy.apply(this, config);
    this.Super('const', arguments);
  },
  /*
   *
   */
  init: function(){
    var me = this;

    me.addEvents('focus', 'blur', 'input', 'enter', 'up', 'down', 'change', 'key');

    me.Super('init', arguments);

    me.preRender();
    me.render();

    //me.ons();

    if( me.hidden ){
      me.css('display', 'none');
    }

    if( me.style ){
      me.css(me.style);
    }
  },
  fieldCls: 'fancy fancy-field-html',
  value: '',
  width: 100,
  emptyText: '',
  tpl: [
    '<div class="" style="">',
      '{value}',
    '</div>'
  ],
  /*
   *
   */
  render: function(){
    var me = this,
      renderTo = me.renderTo || document.body,
      el = document.createElement('div');

    me.fire('beforerender');

    el.innerHTML = me.tpl.getHTML({
      value: me.value,
      height: me.height
    });

    me.el = renderTo.appendChild(el);
    me.el = Fancy.get(me.el);

    me.addCls(me.cls, me.fieldCls);

    me.acceptedValue = me.value;
    me.fire('afterrender');
    me.fire('render');
  },
  /*
   * @param {*} value
   * @param {Boolean} onInput
   */
  set: function(value, onInput){
    var me = this;

    me.el.firstChild().update(value);
    if(onInput !== false){
      me.onInput();
    }
  },
  /*
   * @return {String}
   */
  get: function(){
    return this.el.firstChild().dom.innerHTML;
  }
});
/**
 * @class Fancy.ReCaptcha
 * @extends Fancy.Widget
 */
Fancy.define(['Fancy.form.field.ReCaptcha', 'Fancy.ReCaptcha'], {
  type: 'field.recaptcha',
  mixins: [
    Fancy.form.field.Mixin
  ],
  extend: Fancy.Widget,
  /*
   * @constructor
   * @param {Object} config
   */
  constructor: function(config){
    Fancy.apply(this, config);
    this.Super('const', arguments);
  },
  /*
   *
   */
  init: function(){
    var me = this;

    me.addEvents('focus', 'blur', 'input', 'enter', 'up', 'down', 'change', 'key');

    me.Super('init', arguments);

    me.tpl = new Fancy.Template(me.tpl);
    me.render();

    me.name = 'recaptcha';

    //me.ons();

    if( me.hidden ){
      me.css('display', 'none');
    }

    if( me.style ){
      me.css(me.style);
    }

    var s = document.createElement("script");

    s.type = "text/javascript";
    s.src = 'https://www.google.com/recaptcha/api.js';

    Fancy.get(document.head).append(s);
  },
  /*
   * @return {'wait'|*}
   */
  get: function(){
    var me = this,
      formReCaptchaEl = me.el.select('form');

    if( me.value ){
      return me.value;
    }

    me.value = 'wait';

    formReCaptchaEl.one('submit', function(e){
      e.preventDefault();
      me.value = $(this).serialize().replace('g-recaptcha-response=', '');
    });

    formReCaptchaEl.submit();

    return me.value;
  },
  fieldCls: Fancy.FIELD_CLS,
  value: '',
  width: 100,
  tpl: [
    '<form method="POST">',
    '<div class="g-recaptcha" data-sitekey="{key}"></div>',
    '</form>'
  ]
});
/*
 * @class Fancy.Radio
 * @extends Fancy.Widget
 */
(function () {
  //SHORTCUTS
  var F = Fancy;

  //CONSTANTS
  var CLEARFIX_CLS = F.CLEARFIX_CLS;
  var FIELD_CLS = F.FIELD_CLS;
  var FIELD_RADIO_CLS = F.FIELD_RADIO_CLS;
  var FIELD_RADIO_COLUMN_CLS = F.FIELD_RADIO_COLUMN_CLS;
  var FIELD_TEXT_CLS = F.FIELD_TEXT_CLS;
  var FIELD_RADIO_ON_CLS = F.FIELD_RADIO_ON_CLS;
  var FIELD_RADIO_INPUT_CLS = F.FIELD_RADIO_INPUT_CLS;
  var FIELD_LABEL_CLS = F.FIELD_LABEL_CLS;
  var FIELD_ERROR_CLS = F.FIELD_ERROR_CLS;

  F.define(['Fancy.form.field.Radio', 'Fancy.Radio'], {
    mixins: [
      F.form.field.Mixin
    ],
    extend: F.Widget,
    type: 'field.radio',
    /*
     * @private
     */
    radioRows: 1,
    /*
     * @constructor
     */
    constructor: function () {
      this.Super('const', arguments);
    },
    /*
     *
     */
    init: function () {
      var me = this;

      me.addEvents('focus', 'blur', 'input', 'up', 'down', 'change', 'key');
      me.Super('init', arguments);

      var itemsHTML = '';

      if (me.column) {
        me.cls += ' ' + FIELD_RADIO_COLUMN_CLS;
        itemsHTML += '<div style="margin-left: ' + ( me.labelWidth ) + 'px;">';
      }

      F.each(me.items, function (item, i) {
        var marginLeft = '',
          itemCls = FIELD_TEXT_CLS;

        if (!me.column && i !== 0) {
          marginLeft = 'margin-left:10px;';
        }

        if (item.value === me.value) {
          itemCls += ' ' + FIELD_RADIO_ON_CLS;
        }

        itemsHTML += [
          '<div class="' + itemCls + '" value=' + item.value + '>',
          '<div class="' + FIELD_RADIO_INPUT_CLS + '" style="float:left;' + marginLeft + '"></div>',
          '<div style="float:left;margin:7px 0 0 0;">' + item.text + '</div>',
          '</div>'
        ].join("");
      });

      if (me.column) {
        itemsHTML += '</div>';
      }

      me.itemsHTML = itemsHTML;

      me.preRender();
      me.render();
      me.setColumnsStyle();
      me.acceptedValue = me.value;
      me.set(me.value);

      me.ons();
    },
    labelText: '',
    labelWidth: 60,
    value: false,
    checkedCls: FIELD_RADIO_ON_CLS,
    fieldCls: FIELD_CLS + ' ' + FIELD_RADIO_CLS,
    tpl: [
      '<div class="' + FIELD_LABEL_CLS + '" style="{labelWidth}{labelDisplay}">',
        '{label}',
        '<div class="' + FIELD_ERROR_CLS + '" style="{errorTextStyle}"></div>',
      '</div>',
        '{itemsHTML}',
      '<div class="' + CLEARFIX_CLS + '"></div>'
    ],
    /*
     *
     */
    ons: function () {
      var me = this,
        el = this.el;

      el.$dom.delegate('.' + FIELD_TEXT_CLS, 'click', function () {
        me.set(F.get(this).attr('value'));
      });

      el.on('mousedown', me.onMouseDown, me);
    },
    /*
     *
     */
    onClick: function () {
      var me = this,
        checkedCls = me.checkedCls;

      me.addCls(checkedCls);
      me.toggleCls(checkedCls);

      me.value = me.hasCls(checkedCls);

      me.fire('change', me.value);
    },
    /*
     * @param {Object} e
     */
    onMouseDown: function (e) {

      e.preventDefault();
    },
    /*
     * @param {*} value
     * @param {Boolean} onInput
     */
    set: function (value, fire) {
      var me = this,
        el = me.el,
        checkedCls = me.checkedCls,
        radioEls = el.select('.' + FIELD_TEXT_CLS);

      radioEls.removeCls(checkedCls);

      el.select('[value=' + value + ']').addCls(checkedCls);

      me.value = value;
      if (fire !== false) {
        me.fire('change', me.value);
      }
    },
    /*
     * @param {*} value
     * @param {Boolean} onInput
     */
    setValue: function (value, onInput) {
      this.set(value, onInput);
    },
    /*
     * @return {*} value
     */
    getValue: function () {
      return this.value;
    },
    /*
     * @return {*} value
     */
    get: function () {
      return this.getValue();
    },
    /*
     *
     */
    clear: function () {
      this.set(false);
    },
    /*
     *
     */
    calcColumns: function () {
      var me = this,
        maxChars = 0,
        inputWidth = me.width;

      if (me.labelAlign !== 'top' && me.label) {
        inputWidth -= me.labelWidth;
        inputWidth -= 20;
      }

      F.Array.each(me.items, function (item) {
        if (item.text.length > maxChars) {
          maxChars = item.text.length;
        }
      });

      var columns = Math.floor(inputWidth / (maxChars * 7 + 30));

      if (me.columns && me.columns <= columns) {
        columns = me.columns;
      }
      else {
        me.columns = columns;
      }

      me.columnWidth = Math.ceil(inputWidth / columns);
      me.rows = Math.ceil(me.items.length / columns);
    },
    /*
     *
     */
    setColumnsStyle: function () {
      var me = this;

      if (!me.columns || me.rows === 1) {
        return;
      }

      var radioEls = me.el.select('.' + FIELD_TEXT_CLS),
        radioInputs = me.el.select('.' + FIELD_TEXT_CLS + ' .' + FIELD_RADIO_INPUT_CLS);

      radioEls.each(function (item, i) {
        if (i % me.columns === 0) {
          radioInputs.item(i).css('margin-left', '0px');
        }

        item.css('width', me.columnWidth);
      });
    }
  });

})();
(function () {

  Fancy.vtypes = {};

  /*
   * @param {String} name
   * @param {Object} o
   */
  Fancy.addValid = function(name, o){
    Fancy.vtypes[name] = o;
  };


  /*
   * @param {*} type
   * @param {*} value
   * @return {Boolean}
   */
  Fancy.isValid = function(type, value){
    var vtype;

    if (Fancy.isString(type)) {
      vtype = Fancy.vtypes[type];
    }
    else if(Fancy.isObject(type)) {
      if(type.type){
        vtype = Fancy.vtypes[type.type];
        Fancy.applyIf(type, vtype);
      }
      else{
        vtype = type;
      }
    }

    if (vtype.before) {
      var before = vtype.before,
        list = [type];

      if (Fancy.isString(before)) {
        list.push(before);
      }
      else if (Fancy.isArray(before)) {
        list = list.concat(before);
      }

      list.reverse();

      var i = 0,
        iL = list.length;

      for (; i < iL; i++) {
        if (Fancy.isObject(list[i])) {
          vtype = list[i];
        }
        else {
          vtype = Fancy.vtypes[list[i]];
        }

        if (vtype.re) {
          if(vtype.re.test(value) === false){
            return vtype;
          }
        }
        else if (vtype.fn) {
          if (vtype.fn.apply(vtype, [value]) === false) {
            return vtype;
          }
        }
      }
    }
    else{
      if (vtype.re) {
        if(vtype.re.test(value) === false){
          return vtype;
        }
      }
      else if (vtype.fn.apply(vtype, [value]) === false) {
        return vtype;
      }
    }

    return true;
  };

})();
Fancy.addValid('notempty', {
  text: 'Must be present',
  fn: function(value){
    if(value === null || value === undefined){
      return false;
    }

    return String(value).length !== 0;
  }
});

Fancy.addValid('notnan', {
  text: 'Must be numeric',
  fn: function(value){
    return !isNaN(value);
  }
});

Fancy.addValid('min', {
  before: ['notempty', 'notnan'],
  text: 'Must be must be at least {param}',
  fn: function(value){
    return value >= this.param;
  }
});

Fancy.addValid('max', {
  before: ['notempty', 'notnan'],
  text: 'Must be no more than {param}',
  fn: function(value){
    return value <= this.param;
  }
});

Fancy.addValid('range', {
  before: ['notempty', 'notnan'],
  text: 'Must be between {min} and {max}',
  fn: function(value){
    return value >= this.min && value <= this.max;
  }
});

Fancy.addValid('email', {
  before: 'notempty',
  re: /^(")?(?:[^\."])(?:(?:[\.])?(?:[\w\-!#$%&'*+\/=?\^_`{|}~]))*\1@(\w[\-\w]*\.){1,5}([A-Za-z]){2,6}$/,
  text: 'Is not a valid email address'
});
/*
 * @mixin Fancy.grid.mixin.PrepareConfig
 */
Fancy.Mixin('Fancy.grid.mixin.PrepareConfig', {
  /*
  TODO: it goes many  time for columns, to get something and it takes a bit time.
  TODO: if possible to redo to one for, but maybe it is not so timely, so I am not sure
 */
  /*
   * @param {Object} config
   * @param {Object} originalConfig
   * @return {Object}
   */
  prepareConfig: function(config, originalConfig){
    var me = this;

    config._plugins = config._plugins || [];

    /*
     * prevent columns linking if one columns object for several grids
     */
    config = me.copyColumns(config, originalConfig);
    config = me.prepareConfigScroll(config, originalConfig);
    config = me.prepareConfigData(config, originalConfig);
    config = me.prepareConfigTheme(config, originalConfig);
    config = me.prepareConfigLang(config, originalConfig);
    config = me.prepareConfigSpark(config, originalConfig);
    config = me.prepareConfigPaging(config, originalConfig);
    config = me.prepareConfigTBar(config);
    config = me.prepareConfigExpander(config);
    config = me.prepareConfigColumnMinMaxWidth(config);
    config = me.prepareConfigGrouping(config);
    config = me.prepareConfigGroupHeader(config);
    config = me.prepareConfigSorting(config);
    config = me.prepareConfigEdit(config);
    config = me.prepareConfigSelection(config);
    config = me.prepareConfigLoadMask(config, originalConfig);
    config = me.prepareConfigDefaults(config);
    config = me.prepareConfigFilter(config);
    config = me.prepareConfigSearch(config);
    config = me.prepareConfigSummary(config);
    config = me.prepareConfigExporter(config);
    config = me.prepareConfigSmartIndex(config);
    config = me.prepareConfigActionColumn(config);
    config = me.prepareConfigWidgetColumn(config);
    config = me.prepareConfigChart(config, originalConfig);
    config = me.prepareConfigCellTip(config);
    config = me.prepareConfigColumnsWidth(config);
    config = me.prepareConfigSize(config, originalConfig);
    config = me.prepareConfigColumns(config);
    config = me.prepareConfigColumnsResizer(config);
    config = me.prepareConfigFooter(config);
    config = me.prepareConfigDD(config);

    return config;
  },
  /*
   * @param {Object} config
   * @param {Object} originalConfig
   * @return {Object}
   */
  copyColumns: function(config, originalConfig){
    if(config.columns){
      config.columns = Fancy.Array.copy(config.columns, true);
    }

    if(originalConfig.columns){
      originalConfig.columns = Fancy.Array.copy(originalConfig.columns);
    }

    return config;
  },
  /*
   * @param {Object} config
   * @param {Object} originalConfig
   * @return {Object}
   */
  prepareConfigScroll: function (config, originalConfig) {
    if(Fancy.isIE && originalConfig.nativeScroller !== false){
      config.nativeScroller = true;
    }

    return config;
  },
  /*
   * @param {Object} config
   * @param {Object} originalConfig
   * @return {Object}
   */
  prepareConfigSpark: function(config, originalConfig){
    var me = this;

    Fancy.each(config.columns, function(column){
      var spark = column.sparkConfig;

      if(spark && spark.legend){
        switch(spark.legend.type){
          case 'tbar':
          case 'bbar':
          case 'buttons':
            var barName = spark.legend.type,
              index = column.index;

            config[barName] = config[barName] || [];
            config[barName] = config[barName].concat(me._generateLegendBar(spark.title, index, spark.legend.style, column));
            break;
        }
      }
    });

    return config;
  },
  /*
   * @private
   * @param {String} title
   * @param {Object} style
   * @param {Object} column
   * @return {Array}
   */
  _generateLegendBar: function(title, indexes, style, column){
    var i = 0,
      iL = title.length,
      bar = [],
      me = this;

    var disabled = {
      length: 0
    };

    var legendFn = function(button){
      var grid = me,
        indexOrder;

      Fancy.each(me.columns, function(column, i){
        if(column.index === me.columns[i].index){
          indexOrder = i;
        }
      });

      if(!button.hasCls('fancy-legend-item-disabled') && title.length - 1 === disabled.length){
        return;
      }

      button.toggleCls('fancy-legend-item-disabled');

      if(button.hasCls('fancy-legend-item-disabled')){
        disabled[button.index] = true;
        grid.disableLegend(indexOrder, button.index);
        disabled.length++;
      }
      else{
        grid.enableLegend(indexOrder, button.index);
        delete disabled[button.index];
        disabled.length--;
      }
    };

    for(;i<iL;i++){
      var index = indexes[i];
      if(Fancy.isString(column.index)){
        index = column.index + '.' + i;
      }

      var buttonConfig = {
        handler: legendFn,
        index: index,
        imageColor: Fancy.COLORS[i],
        text: title[i]
      };

      if(i === 0 && style){
        buttonConfig.style = style;
      }

      bar.push(buttonConfig);
    }

    return bar;
  },
  /*
   * @param {Object} config
   * @param {Object} originalConfig
   * @return {Object}
   */
  prepareConfigData: function(config, originalConfig){
    if(Fancy.isArray(config.data) && config.data.length === 0 && config.columns){
      var fields = [];

      Fancy.each(config.columns, function(column){
        if(column.index){
          fields.push(column.index || column.key);
        }
      });

      config.data = {
        fields: fields,
        items: []
      };
    }

    return config;
  },
  /*
   * @param {Object} config
   * @return {Object}
   */
  prepareConfigLoadMask: function(config){
    config._plugins.push({
      type: 'grid.loadmask'
    });

    return config;
  },
  /*
   * @param {Array} data
   */
  reConfigStore: function(data){
    var me = this,
      s = me.store,
      fields = me.getFieldsFromData(data),
      modelName = 'Fancy.model.'+Fancy.id();

    Fancy.define(modelName, {
      extend: Fancy.Model,
      fields: fields
    });

    me.model = modelName;
    s.model = modelName;

    me.fields = fields;
    s.fields = fields;
    s.setModel();
  },
  /*
   * @param {Object} config
   * @return {Object}
   */
  prepareConfigDefaults: function(config){
    config.defaults = config.defaults || {};

    if(config.defaults.type === undefined){
      config.defaults.type = 'string';
    }

    Fancy.each(config.defaults, function(value, p){
      Fancy.each(config.columns, function(column){
        switch(column.type){
          case 'select':
          case 'order':
          case 'expand':
            return;
            break;
        }

        if(column[p] === undefined){
          column[p] = config.defaults[p];
        }
      });
    });

    return config;
  },
  prepareConfigColumnMinMaxWidth: function(config){
    Fancy.each(config.columns, function(column){
      if(column.width === undefined && column.minWidth){
        column.width = column.minWidth;
      }
    });

    return config;
  },
  /*
   * @param {Object} config
   * @return {Object}
   */
  prepareConfigCellTip: function(config){
    Fancy.each(config.columns, function(column){
      if(column.cellTip){
        config._plugins.push({
          type: 'grid.celltip'
        });
        return true;
      }
    });

    return config;
  },
  /*
   * @param {Object} config
   * @return {Object}
   */
  prepareConfigDD: function(config){
    if(config.gridToGrid){
      var pluginConfig = {
        type: 'grid.dragdrop'
      };

      Fancy.apply(pluginConfig, config.gridToGrid);

      config._plugins.push(pluginConfig);
    }

    return config;
  },
  /*
   * @param {Object} config
   * @return {Object}
   */
  prepareConfigColumns: function(config){
    var columns = config.columns,
      leftColumns = [],
      rightColumns = [],
      i = 0,
      iL = columns.length,
      isDraggable = false;

    for(;i<iL;i++){
      var column = columns[i];

      if(column.draggable){
        isDraggable = true;
      }

      switch(column.type){
        case 'select':
          this.checkboxRowSelection = true;
          this.multiSelect = true;
          columns[i].index = '$selected';
          columns[i].editable = true;
          break;
        case 'order':
          columns[i].editable = false;
          columns[i].sortable = false;
          columns[i].cellAlign = 'right';
          break;
        case 'checkbox':
          if(column.cellAlign === undefined){
            column.cellAlign = 'center';
          }
          break;
        case 'currency':
          if(column.format === undefined){
            column.format = 'number';
          }
          break;
      }

      if(column.locked){
        leftColumns.push(column);
        columns.splice(i, 1);
        i--;
        iL--;
        continue;
      }

      if(column.rightLocked){
        rightColumns.push(column);
        columns.splice(i, 1);
        i--;
        iL--;
        continue;
      }
    }

    if(isDraggable){
      config._plugins.push({
        type: 'grid.columndrag'
      });
    }

    config.leftColumns = leftColumns;
    config.rightColumns = rightColumns;

    return config;
  },
  /*
   * @param {Object} config
   * @return {Object}
   */
  prepareConfigColumnsWidth: function(config){
    var columns = config.columns,
      width = config.width,
      columnsWithoutWidth = [],
      flexColumns = [],
      maxWidth = 100,
      minWidth = 50,
      defaultWidth = maxWidth,
      flexTotal = 0,
      column,
      hasLocked = false,
      hasRightLocked = false;

    if(width === undefined && config.renderTo){
      width = Fancy.get(config.renderTo).width();
    }

    if(config.flexScrollSensitive !== false){
      width -= config.bottomScrollHeight;
      width -= config.panelBorderWidth * 2;
    }
    else{
      width -= 1;
    }

    Fancy.each(columns, function(column, i){
      if(column.flex){
        config.hasFlexColumns = true;
      }

      switch(column.type){
        case 'select':
          if(column.width === undefined){
            column.width = 35;
          }
          break;
        case 'order':
          if(column.width === undefined){
            column.width = 40;
          }
          break;
        case 'expand':
          if(column.width === undefined){
            column.width = 38;
          }
          break;
      }

      if(column.locked){
        hasLocked = true;
      }

      if(column.rightLocked){
        hasRightLocked = true;
      }

      if(column.width === undefined){
        if(column.flex){
          flexTotal += column.flex;
          flexColumns.push(i);
        }
        columnsWithoutWidth.push(i);
      }
      else if(Fancy.isNumber(column.width) ){
        width -= column.width;
      }
    });

    if(config.hasFlexColumns){
      config._plugins.push({
        type: 'grid.columnresizer'
      });
    }

    if(hasLocked && hasRightLocked){
      width -= 2;
    }

    var averageWidth = width/columnsWithoutWidth.length;

    if(averageWidth < minWidth){
      averageWidth = minWidth;
    }

    if(averageWidth > maxWidth){
      defaultWidth = maxWidth;
    }

    if(averageWidth < minWidth){
      defaultWidth = minWidth;
    }

    var isOverFlow = false,
      _width = width;

    Fancy.each(columnsWithoutWidth, function(value){
      column = columns[value];
      if(column.flex === undefined){
        _width -= defaultWidth;
      }
    });

    if(flexTotal){
      Fancy.each(flexColumns, function(column){
        _width -= (_width/flexTotal) * column.flex;
      });
    }

    if(_width < 0){
      isOverFlow = true;
    }

    Fancy.each(columnsWithoutWidth, function(value){
      column = columns[value];
      if(column.flex === undefined){
        column.width = defaultWidth;
        width -= defaultWidth;
      }
    });

    if(flexTotal){
      Fancy.each(flexColumns, function(value){
        column = columns[value];
        if(isOverFlow){
          column.width = defaultWidth * column.flex;
        }
        else {
          column.width = (width / flexTotal) * column.flex;
        }
      });
    }

    return config;
  },
  /*
   * @param {Object} column
   * @return {Object}
   */
  prepareConfigActionRender: function(column){
    return function(o){
      Fancy.each(column.items, function(item){
        var itemText = item.text || '',
          style = Fancy.styleToString(item.style),
          cls = item.cls || '';

        o.value += [
          '<div class="fancy-grid-column-action-item '+cls+'" style="' + style + '">',
          itemText,
          '</div>'
        ].join(" ");
      });

      return o;
    }
  },
  /*
   * @param {Object} config
   * @return {Object}
   */
  prepareConfigSmartIndex: function(config){
    Fancy.each(config.columns, function(column){
      if(/\+|\-|\/|\*|\[|\./.test(column.index)){
        var smartIndex = column.index;

        switch(smartIndex){
          case 'xAxis.categories':
          case 'yAxis.categories':
          case 'zAxis.categories':
            return;
            break;
        }

        smartIndex = smartIndex.replace(/(\w+)/g, function(found, found, index, str){
          if(str[index - 1] === '.'){
            return found;
          }

          if(isNaN(Number(found))){
            return 'data.' + found;
          }
          return found;
        });
        smartIndex = 'return ' + smartIndex + ';';
        column.smartIndexFn = new Function('data', smartIndex);
      }
    });

    return config;
  },
  /*
   * @param {Object} config
   * @return {Object}
   */
  prepareConfigActionColumn: function(config){
    var me = this,
      columns = config.columns,
      i = 0,
      iL = columns.length;

    for(;i<iL;i++){
      var column = columns[i];

      if(column.type === 'action'){
        column.sortable = false;
        column.editable = false;
        column.render = me.prepareConfigActionRender(column);

        var items = column.items;

        if(items !== undefined && items.length !== 0){
          var j = 0,
            jL = items.length,
            item;

          for(;j<jL;j++){
            item = items[j];
            switch(item.action){
              case 'remove':
                if(item.handler === undefined){
                  item.handler = function(grid, o){
                    grid.remove(o);
                  };
                }

                break;
              case 'dialog':
                (function(item) {
                  if (item.handler === undefined) {
                    var _items = [],
                      k = 0,
                      kL = columns.length,
                      height = 42 + 38 + 7;

                    for(;k<kL;k++){
                      var _column = columns[k];
                      switch (_column.type) {
                        case 'action':
                          continue;
                          break;
                      }

                      _items.push({
                        label: _column.title || '',
                        type: _column.type,
                        name: _column.index
                      });

                      height += 38;
                    }

                    item.handler = function(grid, o){
                      if(item.dialog){
                        item.dialog.show();
                        item.dialog.set(o.data);
                      }
                      else {
                        item.dialog = new FancyForm({
                          window: true,
                          draggable: true,
                          modal: true,
                          title: {
                            text: 'Edit',
                            tools: [{
                              text: 'Close',
                              handler: function(){
                                this.hide();
                              }
                            }]
                          },
                          width: 300,
                          height: height,
                          items: _items,
                          buttons: ['side', {
                            text: 'Clear',
                            handler: function(){
                              this.clear();
                            }
                          }, {
                            text: 'Save',
                            handler: function(){
                              var values = this.get();

                              if(!values.id){
                                return;
                              }

                              me.getById(values.id).set(values);
                              me.update();
                            }
                          }],
                          events: [{
                            init: function(){
                              this.show();
                              this.set(o.data);
                            }
                          }]
                        });
                      }
                    };
                  }
                })(item);

                break;
            }
          }
        }
      }
    }

    return config;
  },
  /*
   * @param {Object} config
   * @return {Object}
   */
  prepareConfigWidgetColumn: function(config){
    var columns = config.columns,
      i = 0,
      iL = columns.length;

    for(;i<iL;i++) {
      var column = columns[i];

      if(column.widget){
        column.render = function(o){
          var fieldEl = o.cell.select('.' + Fancy.FIELD_CLS),
            field,
            renderTo = o.cell.dom,
            column = o.column;

          var itemComfig = {
            vtype: column.vtype,
            style: {
              'padding': '0px',
              'margin-top': '-10px',
              'margin-left': '-1px'
            },
            label: false,
            renderTo: renderTo,
            value: o.value,
            emptyText: column.emptyText
          };

          if(fieldEl.length){
            field = Fancy.getWidget(fieldEl.dom.id);

            if(field.get() != o.value){
              field.set(o.value);
            }
          }
          else {
            var width = o.column.width,
              column = o.column,
              index = column.index;

            switch(o.column.type){
              case 'number':
              case 'currency':
                Fancy.apply(itemComfig, {
                  spin: column.spin,
                  min: column.min,
                  max: column.max,
                  events: [{
                    change: function(field, value){
                      grid.set(o.rowIndex, index, value);
                      grid.updater.updateRow();
                    }
                  }]
                });

                field = new Fancy.NumberField(itemComfig);
                break;
              case 'string':
              case 'image':
                Fancy.apply(itemComfig, {
                  events: [{
                    change: function(field, value){
                      grid.set(o.rowIndex, index, value);
                      grid.updater.updateRow();
                    }
                  }]
                });

                field = new Fancy.StringField(itemComfig);
                break;
              case 'combo':
                Fancy.apply(itemComfig, {
                  displayKey: o.column.displayKey,
                  valueKey: o.column.displayKey,
                  padding: false,
                  checkValidOnTyping: true,
                  data: o.column.data,
                  events: [{
                    change: function(field, value){
                      grid.set(o.rowIndex, index, value);
                      grid.updater.updateRow();
                    }
                  }]
                });

                field = new Fancy.Combo(itemComfig);
                break;
            }

            switch(o.column.type){
              case 'number':
              case 'string':
              case 'currency':
              case 'image':
                field.setInputSize({
                  width: width + 1,
                  height: 33
                });
                break;
              case 'combo':
                field.size({
                  width: width + 1,
                  height: 33
                });
                break;
            }


          }

          return o;
        };
      }
    }

    return config;
  },
  /*
   * @param {Object} config
   * @return {Object}
   */
  prepareConfigSorting: function(config){
    var defaults = config.defaults || {};

    if(defaults.sortable){
      config._plugins.push({
        type: 'grid.sorter'
      });

      return config;
    }

    Fancy.each(config.columns, function(column){
      if(column.sortable){
        config._plugins.push({
          type: 'grid.sorter'
        });
      }
    });

    return config;
  },
  /*
   * @param {Object} config
   * @return {Object}
   */
  prepareConfigSelection: function(config){
    var initSelection = false,
      selectionConfig = {
        type: 'grid.selection'
      };

    if(config.trackOver || config.columnTrackOver || config.cellTrackOver){
      initSelection = true;
    }

    if(config.selModel){
      initSelection = true;
      var checkOnly = false;
      var memory = false;

      if(Fancy.isObject(config.selModel)){
        checkOnly = !!config.selModel.checkOnly;

        if(!config.selModel.type){
          throw new Error('FancyGrid Error 5: Type for selection is not set');
        }

        memory = config.selModel.memory === true;
        config.selModel = config.selModel.type;
      }

      if(config.selModel === 'rows'){
        config.multiSelect = true;
      }

      config.selection = config.selection || {};
      config.selection.selModel = config.selModel;
      config.selection[config.selModel] = true;
      config.selection.checkOnly = checkOnly;
      config.selection.memory = memory;
    }

    if(config.selection){
      initSelection = true;

      if(Fancy.isObject(config.selection)){
        Fancy.apply(selectionConfig, config.selection);
      }
    }

    if(initSelection === true){
      config._plugins.push(selectionConfig);
    }

    return config;
  },
  /*
   * @param {Object} config
   * @return {Object}
   */
  prepareConfigEdit: function(config){
    var defaults = config.defaults || {},
      editPluginConfig = {
        type: 'grid.edit'
      },
      included = false,
      editable = defaults.editable;

    if(config.clicksToEdit){
      editPluginConfig.clicksToEdit = config.clicksToEdit;
    }

    if(editable){
      if(!included){
        config._plugins.push(editPluginConfig);
      }

      config._plugins.push({
        type: 'grid.celledit'
      });

      included = true;
    }

    if(config.rowEdit){
      config._plugins.push({
        type: 'grid.rowedit'
      });
    }

    Fancy.each(config.columns, function(column){
      if(column.index === undefined && column.key === undefined){
        column.editable = false;
      }

      switch(column.type){
        case 'image':
          column.sortable = false;
          break;
        case 'sparklineline':
        case 'sparklinebar':
        case 'sparklinetristate':
        case 'sparklinediscrete':
        case 'sparklinebullet':
        case 'sparklinepie':
        case 'sparklinebox':
          column.editable = false;
          column.sortable = false;
          break;
      }

      if(column.editable && included === false){
        config._plugins.push(editPluginConfig);

        config._plugins.push({
          type: 'grid.celledit'
        });
      }
    });

    return config;
  },
  /*
   * @param {Object} config
   * @return {Object}
   */
  prepareConfigExpander: function(config){
    if(config.expander){
      var expanderConfig = config.expander;

      Fancy.apply(expanderConfig, {
        type: 'grid.expander'
      });

      config.expanded = {};

      if(config.grouping){
        expanderConfig.expanded = false;
      }

      config._plugins.push(expanderConfig);
    }

    return config;
  },
  /*
   * @param {Object} config
   * @return {Object}
   */
  prepareConfigGrouping: function(config){
    if(config.grouping){
      var groupConfig = config.grouping;

      Fancy.apply(groupConfig, {
        type: 'grid.grouping'
      });

      config.expanded = {};

      config._plugins.push(groupConfig);
    }

    return config;
  },
  /*
   * @param {Object} config
   * @return {Object}
   */
  prepareConfigSummary: function(config){
    if(config.summary){
      var summaryConfig = config.summary;

      if(summaryConfig === true){
        summaryConfig = {};
      }

      Fancy.apply(summaryConfig, {
        type: 'grid.summary'
      });

      config._plugins.push(summaryConfig);
    }

    return config;
  },
  /*
   * @param {Object} config
   * @return {Object}
   */
  prepareConfigExporter: function(config){
    if(config.exporter){
      var exporterConfig = config.exporter;

      if(exporterConfig === true){
        exporterConfig = {};
      }

      Fancy.apply(exporterConfig, {
        type: 'grid.exporter'
      });

      config._plugins.push(exporterConfig);
    }

    return config;
  },
  /*
   * @param {Object} config
   * @return {Object}
   */
  prepareConfigFilter: function(config){
    var columns = config.columns,
      isFilterable = false,
      isHeaderFilter = false,
      /*
       * Detects if at least one header cell with filter under group header cell
       */
      isInGroupHeader = false,
      filterConfig = {
        type: 'grid.filter'
      };

    if(config.filter){
      if(config.filter === true){
        isFilterable = true;
        config.filter = {};
      }

      Fancy.apply(filterConfig, config.filter);
    }

    Fancy.each(columns, function(column){
      if(column.filter){
        isFilterable = true;
        if(column.filter.header){
          isHeaderFilter = true;

          if(column.grouping){
            isInGroupHeader = true;
          }
        }
      }
    });

    filterConfig.header = isHeaderFilter;
    filterConfig.groupHeader = isInGroupHeader;

    if(isFilterable){
      config._plugins.push(filterConfig);
    }

    return config;
  },
  /*
   * @param {Object} config
   * @return {Object}
   */
  prepareConfigSearch: function(config){
    var searchConfig = {
        type: 'grid.search'
      },
      isSearchable = false;

    if(config.searching){
      isSearchable = true;
    }

    if(isSearchable){
      config._plugins.push(searchConfig);
    }

    return config;
  },
  /*
   * @param {Object} config
   * @return {Object}
   */
  prepareConfigGroupHeader: function(config){
    var columns = config.columns,
      i = 0,
      iL = columns.length,
      groups = [],
      isGrouped = false,
      _columns = [];

    Fancy.each(columns, function(column){
      if(column.columns){
        isGrouped = true;
        groups.push(column);
      }
    });

    if(isGrouped){
      i = 0;
      for(;i<iL;i++){
        var column = columns[i];

        if(column.columns){
          var j = 0,
            jL = column.columns.length,
            groupName = column.text || column.title || '  ';

          for(;j<jL;j++){
            if(column.locked){
              column.columns[j].locked = true;
            }

            if(column.rightLocked){
              column.columns[j].rightLocked = true;
            }
            column.columns[j].grouping = groupName;

            if(column.defaults){
              Fancy.applyIf(column.columns[j], column.defaults);
            }
          }

          _columns = _columns.concat(column.columns);

          isGrouped = true;
          groups.push(column);
        }
        else{
          _columns = _columns.concat( columns.slice(i, i+1) );
        }
      }

      config.columns = _columns;

      config._plugins.push({
        type: 'grid.groupheader',
        groups: groups
      });

      config.isGroupedHeader = true;
    }

    return config;
  },
  /*
   * @param {Object} config
   * @param {Object} originalConfig
   * @return {Object}
   */
  prepareConfigPaging: function(config, originalConfig){
    var me = this,
      lang = config.lang,
      paging = config.paging,
      barType = 'bbar';

    if(!paging){
      return config;
    }

    if(paging.barType !== undefined){
      switch(paging.barType){
        case 'bbar':
        case 'tbar':
        case 'both':
          barType = paging.barType;
          break;
        case false:
        case 'none':
          barType = 'none';
          break;
        default:
          throw new Error('[FancyGrid Error]: - not supported bar type for paging');
      }
    }

    config._plugins.push({
      i18n: originalConfig.i18n,
      type: 'grid.paging',
      barType: barType
    });

    if(barType === 'both'){
      config['tbar'] = me.generatePagingBar(paging, lang);
      config['bbar'] = me.generatePagingBar(paging, lang);
    }
    else if(barType === 'none'){}
    else {
      config[barType] = me.generatePagingBar(paging, lang);
    }

    return config;
  },
  /*
   * @param {Object|Boolean} paging
   * @param {Object} lang
   * @return {Array}
   */
  generatePagingBar: function(paging, lang){
    var me = this,
      bar = [],
      disabledCls = 'fancy-bar-button-disabled',
      style = {
        "float": 'left',
        'margin-right': '5px',
        'margin-top': '3px'
      };

    bar.push({
      imageCls: 'fancy-paging-first',
      disabledCls: disabledCls,
      role: 'first',
      handler: function(button){
        me.paging.firstPage();
      },
      style: {
        'float': 'left',
        'margin-left': '5px',
        'margin-right': '5px',
        'margin-top': '3px'
      }
    });

    bar.push({
      imageCls: 'fancy-paging-prev',
      disabledCls: disabledCls,
      role: 'prev',
      handler: function(){
        me.paging.prevPage();
      },
      style: style
    });

    bar.push('|');

    bar.push({
      type: 'text',
      text: lang.paging.page
    });

    bar.push({
      type: 'number',
      label: false,
      padding: false,
      style: {
        "float": 'left',
        'margin-left': '-1px',
        'margin-right': '8px',
        'margin-top': '4px'
      },
      role: 'pagenumber',
      min: 1,
      width: 30,
      listeners: [{
        enter: function(field){
          if (parseInt(field.getValue()) === 0) {
            field.set(1);
          }

          var page = parseInt(field.getValue()) - 1,
            setPage = me.paging.setPage(page);

          if (page !== setPage) {
            field.set(setPage);
          }
        }
      },{
        up: function(field, value){
          var pages = me.store.pages;

          if(Number(value) > pages ){
            field.set(pages);
          }
        }
      }]
    });

    bar.push({
      type: 'text',
      text: '',
      role: 'ofText'
    });

    bar.push('|');

    bar.push({
      imageCls: 'fancy-paging-next',
      disabledCls: disabledCls,
      role: 'next',
      style: style,
      handler: function(){
        me.paging.nextPage();
      }
    });

    bar.push({
      imageCls: 'fancy-paging-last',
      disabledCls: disabledCls,
      role: 'last',
      style: style,
      handler: function(){
        me.paging.lastPage();
      }
    });

    if(Fancy.isObject(paging) && paging.refreshButton === true){
      bar.push('|');

      bar.push({
        imageCls: 'fancy-paging-refresh',
        disabledCls: disabledCls,
        role: 'refresh',
        style: style,
        handler: function(){
          me.paging.refresh();
        }
      });
    }

    if(paging && Fancy.isArray(paging.pageSizeData)){
      var pageSizeData = paging.pageSizeData,
        sizes = [],
        i = 0,
        iL = pageSizeData.length,
        value = 0;

      for(;i<iL;i++){
        sizes.push({
          index: i,
          value: pageSizeData[i]
        });

        if(paging.pageSize === pageSizeData[i]){
          value = i;
        }
      }

      var sizeStyle = Fancy.Object.copy(style);

      sizeStyle['margin-top'] = '4px';

      bar.push({
        editable: false,
        width: 50,
        type: 'combo',
        role: 'size',
        style: sizeStyle,
        data: sizes,
        displayKey: 'value',
        valueKey: 'index',
        value: value,
        events: [{
          change: function(field, value){
            me.paging.setPageSize(pageSizeData[value]);
          }
        }]
      });
    }

    bar.push('side');

    bar.push({
      type: 'text',
      role: 'info',
      text: ''
    });

    return bar;
  },
  /*
   * @param {Object} config
   * @return {Object}
   */
  prepareConfigColumnsResizer: function(config){
    var defaults = config.defaults || {};

    if(defaults.resizable){
      config._plugins.push({
        type: 'grid.columnresizer'
      });

      return config;
    }

    var columns = [].concat(config.columns).concat(config.leftColumns).concat(config.rightColumns);

    Fancy.each(columns, function(column){
      if(column.resizable){
        config._plugins.push({
          type: 'grid.columnresizer'
        });
      }
    });

    return config;
  },
  /*
   * @param {Object} config
   * @return {Object}
   */
  prepareConfigTBar: function(config){
    var me = this,
      tbar = config.tbar;

    if(tbar){
      var i = 0,
        iL = tbar.length;

      for(;i<iL;i++){
        if(tbar[i].type === 'search'){
          config.searching = true;
          config.filter = true;
        }

        switch(tbar[i].action){
          case 'add':
            if(tbar[i].handler === undefined){
              tbar[i].handler = function(){
                me.insert(0, {});
              };
            }
            break;
          case 'remove':
            if(tbar[i].handler === undefined){
              tbar[i].disabled = true;
              tbar[i].handler = function(){
                Fancy.each(me.getSelection(), function(item){
                  me.remove(item);
                });

                me.selection.clearSelection();
              };

              tbar[i].events = [{
                render: function(){
                  var me = this;
                  setTimeout(function(){
                    var grid = Fancy.getWidget( me.el.parent().parent().parent().select('.' + Fancy.GRID_CLS).dom.id );

                    grid.on('select', function(){
                      var selection = grid.getSelection();
                      if(selection.length === 0){
                        me.disable();
                      }
                      else{
                        me.enable();
                      }
                    });

                    grid.on('clearselect', function(){
                      me.disable();
                    });
                  }, 10);
                }
              }];
            }
            break;
        }
      }
    }

    return config;
  },
  /*
   * @param {Object} config
   * @return {Object}
   */
  prepareConfigChart: function(config){
    var data = config.data,
      chart = data.chart;

    if(Fancy.isObject(chart)){
      chart = [chart];
    }

    if(data && data.chart){
      config._plugins.push({
        type: 'grid.chartintegration',
        chart: chart,
        toChart: data.items? true: (data.proxy? true: false)
      });

      Fancy.each(chart, function(_chart){
        var type = _chart.type;

        switch(type){
          case 'highchart':
          case 'highcharts':
            config._plugins.push({
              type: 'grid.highchart'
            });
            break;
          case undefined:
            throw new Error('[FancyGrid Error] - type of chart is undefined');
            break;
          default:
            throw new Error('[FancyGrid Error] - type of chart ' + type + ' does not exist');
        }
      });
    }

    return config;
  },
  /*
   * @param {Object} config
   * @param {Object} originalConfig
   * @return {Object}
   */
  prepareConfigSize: function(config, originalConfig){
    var renderTo = config.renderTo,
      el,
      isPanel = !!( config.title ||  config.subTitle || config.tbar || config.bbar || config.buttons || config.panel),
      panelBodyBorders = config.panelBodyBorders,
      gridBorders = config.gridBorders;

    if(config.width === undefined){
      if(renderTo){
        config.responsive = true;
        el = Fancy.get(renderTo);
        config.width = parseInt(el.width());
      }
    }
    else if(config.width === 'fit'){
      var width = 0,
        hasLocked = false;

      Fancy.each(config.columns, function(column){
        width += column.width;
        if(column.locked){
          hasLocked = true;
        }
      });

      if(config.title || config.subTitle){
        width += panelBodyBorders[1] + panelBodyBorders[3] + gridBorders[1] + gridBorders[3];
      }
      else{
        width += gridBorders[1] + gridBorders[3];
      }

      if(hasLocked){
        width--;
      }

      config.width = width;
    }

    if(config.height === 'fit'){
      var length = 0;

      if(Fancy.isArray(config.data)){
        length = config.data.length;
      }
      else if(config.data && Fancy.isArray(config.data.items)){
        length = config.data.items.length;
      }

      height = length * config.cellHeight;

      if(config.title){
        height += config.titleHeight;
      }

      if(config.tbar || config.tabs){
        height += config.barHeight;
      }

      if(config.bbar){
        height += config.barHeight;
      }

      if(config.buttons){
        height += config.barHeight;
      }

      if(config.subTBar){
        height += config.barHeight;
      }

      if(config.footer){
        height += config.barHeight;
      }

      if(config.header !== false){
        height += config.cellHeaderHeight;
      }

      if( isPanel ){
        height += panelBodyBorders[0] + panelBodyBorders[2] + gridBorders[0] + gridBorders[2];
      }
      else{
        height += gridBorders[0] + gridBorders[2];
      }

      if(config.minHeight && height < config.minHeight){
        height = config.minHeight;
      }

      config.heightFit = true;

      config.height = height;
    }

    return config;
  }
});
/*
 * @mixin Fancy.grid.mixin.ActionColumn
 */
Fancy.Mixin('Fancy.grid.mixin.ActionColumn', {
  /*
   *
   */
  initActionColumnHandler: function(){
    var me = this;

    me.on('cellclick', me.onCellClickColumnAction, me);
  },
  /*
   * @param {Object} grid
   * @param {Object} o
   */
  onCellClickColumnAction: function(grid, o){
    var me = this,
      column = o.column,
      activeItem,
      columnItems = column.items,
      item;

    if(column.type !== 'action'){
      return;
    }

    activeItem = me.getActiveActionColumnItem(o);

    if(columnItems && activeItem !== undefined){
      item = columnItems[activeItem];
      if(item.handler){
        item.handler(me, o);
      }
    }
  },
  /*
   * @param {Object} o
   * @return {Number}
   */
  getActiveActionColumnItem: function(o){
    var cell = Fancy.get(o.cell),
      target = o.e.target,
      actionEls = cell.select('.' + Fancy.GRID_COLUMN_ACTION_ITEM_CLS),
      i = 0,
      iL = actionEls.length;

    for(;i<iL;i++){
      if(actionEls.item(i).within(target)){
        return i;
      }
    }
  }
});
/*
 * @mixin Fancy.grid.mixin.Edit
 */
Fancy.Mixin('Fancy.grid.mixin.Edit', {
  /*
   * @param {*} o
   * @param {Boolean} at
   */
  remove: function(o, at){
    var me = this,
      store = me.store,
      method = 'remove';

    if(!me.store){
      setTimeout(function(){
        me.remove(o, at)
      }, 100);
      return;
    }

    if(at){
      method = 'removeAt';
    }

    if(Fancy.isArray(o)){
      var i = 0,
        iL = o.length;

      for(;i<iL;i++){
        store[method](o[i]);
      }
    }
    else{
      store[method](o);
    }

    me.setSidesHeight();
  },
  /*
   * @param {*} o
   */
  removeAt: function(o){
    this.remove(o, true);
  },
  /*
   *
   */
  removeAll: function () {
    var me = this;

    me.store.removeAll();
    me.update();
    me.scroller.update();

    if(me.paging){
      me.paging.updateBar();
    }

    if(me.grouping){
      me.grouping.reGroup();
    }
  },
  /*
   * @param {*} o
   */
  add: function(o){
    var me = this;

    if(!me.store){
      setTimeout(function(){
        me.add(o)
      }, 100);
      return;
    }

    if(Fancy.isArray(o)){
      var i = 0,
        iL = o.length;

      for(;i<iL;i++){
        me.add(o[i]);
      }

      return;
    }

    me.store.add(o);
    me.setSidesHeight();
  },
  /*
   * @param {Number} index
   * @param {Object} o
   */
  insert: function(index, o){
    var me = this,
      s = me.store;

    if(!me.store){
      setTimeout(function(){
        me.insert(index, o)
      }, 100);
      return;
    }

    if(Fancy.isArray(o)){
      var i = o.length - 1;

      for(;i !== -1;i--){
        me.insert(o[i], index);
      }

      me.setSidesHeight();
      return;
    }
    else if(Fancy.isArray(index)){
      var i = index.length - 1;

      for(;i !== -1;i--){
        me.insert(index[i], 0);
      }

      me.setSidesHeight();
      return;
    }
    else if(Fancy.isObject(index) && o === undefined){
      o = index;
      index = 0;
    }
    else if(Fancy.isObject(index) && Fancy.isNumber(o)){
      var _index = o;
      o = index;
      index = _index;
    }

    if(me.paging && s.proxyType !== 'server'){
      index += s.showPage * s.pageSize;
    }

    s.insert(index, o);
    me.setSidesHeight();
  },
  /*
   * @param {Number} rowIndex
   * @param {String} key
   * @param {*} value
   */
  set: function(rowIndex, key, value){
    var me = this,
      s = me.store;

    if(!me.store){
      setTimeout(function(){
        me.set(rowIndex, key, value)
      }, 100);
      return;
    }

    if(Fancy.isObject(key) && value === undefined){
      s.setItemData(rowIndex, key, value);
    }
    else {
      s.set(rowIndex, key, value);
    }
  },
  /*
   * @param {Number} rowIndex
   * @param {String} key
   * @param {*} value
   */
  setById: function(id, key, value){
    var me = this,
      s = me.store,
      rowIndex = s.getRow(id);

    if(!me.store){
      setTimeout(function(){
        me.set(rowIndex, key, value)
      }, 100);
      return;
    }

    if(Fancy.isObject(key) && value === undefined){
      for(var p in key){
        var column = me.getColumnByIndex(p);

        if(column && column.type === 'date'){
          var format = column.format,
            newDate = Fancy.Date.parse(key[p], format.read, format.mode),
            oldDate = Fancy.Date.parse(s.getById(id).get(p), format.edit, format.mode);

          if(+newDate === +oldDate){
            delete key[p];
          }
        }
      }

      s.setItemData(rowIndex, key, value);
    }
    else {
      s.set(rowIndex, key, value);
    }
  }
});
/*
 * @mixin Fancy.grid.mixin.Grid
 */
(function () {
  //SHORTCUTS
  var F = Fancy;

  //CONSTANTS
  var TOUCH_CLS = F.TOUCH_CLS;
  var HIDDEN_CLS = F.HIDDEN_CLS;
  var GRID_CENTER_CLS = F.GRID_CENTER_CLS;
  var GRID_LEFT_CLS = F.GRID_LEFT_CLS;
  var GRID_RIGHT_CLS = F.GRID_RIGHT_CLS;
  var GRID_HEADER_CLS = F.GRID_HEADER_CLS;
  var GRID_BODY_CLS = F.GRID_BODY_CLS;
  var PANEL_BODY_INNER_CLS =  F.PANEL_BODY_INNER_CLS;
  var GRID_UNSELECTABLE_CLS = F.GRID_UNSELECTABLE_CLS;
  var GRID_LEFT_EMPTY_CLS = F.GRID_LEFT_EMPTY_CLS;
  var GRID_RIGHT_EMPTY_CLS = F.GRID_RIGHT_EMPTY_CLS;

  F.Mixin('Fancy.grid.mixin.Grid', {
    tpl: [
      '<div class="' + GRID_LEFT_CLS + ' ' + GRID_LEFT_EMPTY_CLS + '"></div>',
      '<div class="' + GRID_CENTER_CLS + '"></div>',
      '<div class="' + GRID_RIGHT_CLS + ' '+GRID_RIGHT_EMPTY_CLS+'"></div>',
      '<div class="fancy-grid-editors"></div>'
    ],
    /*
     *
     */
    initStore: function () {
      var me = this,
        fields = me.getFieldsFromData(me.data),
        modelName = 'Fancy.model.' + F.id(),
        data = me.data,
        remoteSort,
        remoteFilter,
        collapsed = false,
        state = me.state;

      if (me.data.items) {
        data = me.data.items;
      }

      remoteSort = me.data.remoteSort;
      remoteFilter = me.data.remoteFilter;

      F.define(modelName, {
        extend: F.Model,
        fields: fields
      });

      if (me.grouping && me.grouping.collapsed !== undefined) {
        collapsed = me.grouping.collapsed;
      }

      var storeConfig = {
        widget: me,
        model: modelName,
        data: data,
        paging: me.paging,
        remoteSort: remoteSort,
        remoteFilter: remoteFilter,
        collapsed: collapsed,
        multiSort: me.multiSort
      };

      if (state) {
        if (state.filters) {
          storeConfig.filters = state.filters;
        }
      }

      if (data.pageSize) {
        storeConfig.pageSize = data.pageSize;
      }

      me.store = new F.Store(storeConfig);

      me.model = modelName;
      me.fields = fields;

      if (me.store.filters) {
        setTimeout(function () {
          me.filter.filters = me.store.filters;
          me.filter.updateStoreFilters();
        }, 1);
      }
    },
    /*
     *
     */
    initTouch: function () {
      var me = this;

      if (F.isTouch && window.FastClick) {
        if (me.panel) {
          FastClick.attach(me.panel.el.dom);
          me.panel.addCls(TOUCH_CLS);
        }
        else {
          FastClick.attach(me.el.dom);
          me.addCls(TOUCH_CLS);
        }
      }
    },
    /*
     *
     */
    initElements: function () {
      var me = this;

      if (me.header !== false) {

        me.leftHeader = new F.grid.Header({
          widget: me,
          side: 'left'
        });

        me.header = new F.grid.Header({
          widget: me,
          side: 'center'
        });

        me.rightHeader = new F.grid.Header({
          widget: me,
          side: 'right'
        });
      }

      me.leftBody = new F.grid.Body({
        widget: me,
        side: 'left'
      });

      me.body = new F.grid.Body({
        widget: me,
        side: 'center'
      });

      me.rightBody = new F.grid.Body({
        widget: me,
        side: 'right'
      });

      me.leftEl = me.el.select('.' + GRID_LEFT_CLS);
      me.centerEl = me.el.select('.' + GRID_CENTER_CLS);
      me.rightEl = me.el.select('.' + GRID_RIGHT_CLS);
    },
    /*
     * @param {Array} data
     * @return {Array}
     */
    getFieldsFromData: function (data) {
      var items = data.items || data;

      if (data.fields) {
        return data.fields;
      }

      if (!items) {
        throw new Error('FancyGrid Error 4: Data is empty and not set fields of data to build model');
      }

      var itemZero = items[0],
        fields = [];

      for (var p in itemZero) {
        fields.push(p);
      }

      return fields;
    },
    /*
     *
     */
    render: function () {
      var me = this,
        renderTo = me.renderTo || document.body,
        el = F.get(document.createElement('div')),
        panelBodyBorders = me.panelBodyBorders;

      el.addCls(
        F.cls,
        me.widgetCls,
        me.cls
      );

      el.attr('id', me.id);

      if (me.panel === undefined && me.shadow) {
        el.addCls('fancy-panel-shadow');
      }

      if (me.columnLines === false) {
        el.addCls('fancy-grid-disable-column-lines');
      }

      if (me.theme !== 'default' && !me.panel) {
        el.addCls('fancy-theme-' + me.theme);
      }

      var panelBordersWidth = 0,
        panelBorderHeight = 0;

      if (me.panel) {
        panelBordersWidth = panelBodyBorders[1] + panelBodyBorders[3];
      }

      el.css({
        width: (me.width - panelBordersWidth) + 'px',
        height: (me.height - panelBorderHeight) + 'px'
      });

      me.initTpl();
      el.update(me.tpl.getHTML({}));

      me.el = F.get(F.get(renderTo).dom.appendChild(el.dom));

      me.setHardBordersWidth();

      me.rendered = true;
    },
    /*
     *
     */
    setHardBordersWidth: function () {
      var me = this,
        borders = me.panel ? me.gridBorders : me.gridWithoutPanelBorders;

      if (me.wrapped) {
        borders = me.gridBorders;
      }

      me.css({
        'border-top-width': borders[0],
        'border-right-width': borders[1],
        'border-bottom-width': borders[2],
        'border-left-width': borders[3]
      })
    },
    /*
     *
     */
    update: function () {
      var me = this,
        s = me.store;

      if (s.loading) {
        return;
      }

      me.updater.update();
      me.fire('update');

      if (me.heightFit) {
        me.fitHeight();
      }

      me.setBodysHeight();
    },
    /*
     * @param {String} side
     * @return {Number}
     */
    getColumnsWidth: function (side) {
      var me = this;

      switch (side) {
        case 'center':
          return me.getCenterFullWidth();
        case 'left':
          return me.getLeftFullWidth();
        case 'right':
          return me.getRightFullWidth();
      }
    },
    /*
     *
     */
    setSides: function () {
      var me = this,
        leftColumns = me.leftColumns,
        rightColumns = me.rightColumns,
        leftWidth = me.getLeftFullWidth(),
        centerWidth = me.getCenterFullWidth(),
        rightWidth = me.getRightFullWidth(),
        gridBorders = me.gridBorders,
        panelBodyBorders = me.panelBodyBorders,
        gridWithoutPanelBorders = me.gridWithoutPanelBorders;

      if (leftColumns.length > 0) {
        me.leftEl.removeCls(GRID_LEFT_EMPTY_CLS);
      }

      if (rightColumns.length > 0) {
        me.rightEl.removeCls(GRID_RIGHT_EMPTY_CLS);
      }

      if (me.wrapped) {
        centerWidth = me.width - gridBorders[1] - gridBorders[3];
      }
      else if (me.panel) {
        centerWidth = me.width - gridBorders[1] - gridBorders[3] - panelBodyBorders[1] - panelBodyBorders[3];
      }
      else {
        centerWidth = me.width - gridWithoutPanelBorders[1] - gridWithoutPanelBorders[3];
      }

      if (leftWidth === 0 && rightWidth === 0) {
      }
      else if (rightWidth === 0) {
        centerWidth -= leftWidth;
      }
      else if (leftWidth === 0) {
        centerWidth -= rightWidth;
      }
      else if (me.width > leftWidth + centerWidth + rightWidth) {
        centerWidth -= leftWidth;
      }
      else {
        centerWidth -= leftWidth + rightWidth;
      }

      me.leftEl.css({
        width: leftWidth + 'px'
      });

      me.centerEl.css({
        left: leftWidth + 'px',
        width: centerWidth + 'px'
      });

      if (me.header) {
        me.el.select('.' + GRID_LEFT_CLS + ' .' + GRID_HEADER_CLS).css({
          width: leftWidth + 'px'
        });

        me.el.select('.' + GRID_CENTER_CLS + ' .' + GRID_HEADER_CLS).css({
          width: centerWidth + 'px'
        });
      }

      me.el.select('.' + GRID_CENTER_CLS + ' .' + GRID_BODY_CLS).css({
        width: centerWidth + 'px'
      });

      if (me.width > leftWidth + centerWidth + rightWidth) {
        me.rightEl.css({
          right: '0px'
        });
      }
      else {
        me.rightEl.css({
          left: '',
          right: '0px'
        });
      }

      me.rightEl.css({
        width: rightWidth
      });

      if (me.header) {
        me.el.select('.' + GRID_RIGHT_CLS + ' .' + GRID_HEADER_CLS).css({
          width: rightWidth + 'px'
        });
      }

      me.startWidths = {
        center: centerWidth,
        left: leftWidth,
        right: rightWidth
      };
    },
    /*
     *
     */
    setColumnsPosition: function () {
      var me = this;

      me.body.setColumnsPosition();
      me.leftBody.setColumnsPosition();
      me.rightBody.setColumnsPosition();
    },
    /*
     *
     */
    setSidesHeight: function () {
      var me = this,
        s = me.store,
        height = 1,
        cellHeaderHeight = me.cellHeaderHeight;

      if (me.header !== false) {
        height += cellHeaderHeight;
        if (me.filter && me.filter.header) {
          if (me.groupheader) {
            if (me.filter.groupHeader) {
              height += cellHeaderHeight;
            }
          }
          else {
            height += cellHeaderHeight;
          }
        }

        if (me.groupheader) {
          if (!(me.filter && me.filter.header)) {
            height += cellHeaderHeight;
          }
          else {
            height += cellHeaderHeight;
          }
        }
      }

      if (me.grouping) {
        height += me.grouping.groups.length * me.groupRowHeight;
      }

      if (me.expander) {
        height += me.expander.plusHeight;
      }

      if (me.summary) {
        height += me.summary.topOffSet;
      }

      height += s.getLength() * me.cellHeight - 1;

      if (me.paging && me.summary && me.summary.position === 'bottom') {
        height = me.height;
      }

      me.leftEl.css({
        height: height + 'px'
      });

      me.centerEl.css({
        height: height + 'px'
      });

      me.rightEl.css({
        height: height + 'px'
      });
    },
    /*
     *
     */
    setBodysHeight: function () {
      var me = this;

      me.body.setHeight();
      me.leftBody.setHeight();
      me.rightBody.setHeight();
    },
    /*
     *
     */
    preRender: function () {
      var me = this;

      if (me.title || me.subTitle || me.tbar || me.bbar || me.buttons || me.panel) {
        me.renderPanel();
      }
    },
    /*
     *
     */
    renderPanel: function () {
      var me = this,
        panelConfig = {
          renderTo: me.renderTo,
          title: me.title,
          subTitle: me.subTitle,
          width: me.width,
          height: me.height,
          titleHeight: me.titleHeight,
          subTitleHeight: me.subTitleHeight,
          barHeight: me.barHeight,
          theme: me.theme,
          shadow: me.shadow,
          style: me.style || {},
          window: me.window,
          modal: me.modal,
          frame: me.frame,
          items: [me],
          draggable: me.draggable,
          resizable: me.resizable,
          minWidth: me.minWidth,
          minHeight: me.minHeight,
          panelBodyBorders: me.panelBodyBorders,
          barContainer: me.barContainer,
          barScrollEnabled: me.barScrollEnabled
        },
        panelBodyBorders = me.panelBodyBorders;

      if (me.bbar) {
        panelConfig.bbar = me.bbar;
        me.height -= me.barHeight;
      }

      if (me.tbar) {
        panelConfig.tbar = me.tbar;
        me.height -= me.barHeight;
      }

      if (me.subTBar) {
        panelConfig.subTBar = me.subTBar;
        me.height -= me.barHeight;
      }

      if (me.buttons) {
        panelConfig.buttons = me.buttons;
        me.height -= me.barHeight;
      }

      if (me.footer) {
        panelConfig.footer = me.footer;
        me.height -= me.barHeight;
      }

      me.panel = new F.Panel(panelConfig);

      me.bbar = me.panel.bbar;
      me.tbar = me.panel.tbar;
      me.subTBar = me.panel.subTBar;
      me.buttons = me.panel.buttons;

      if (!me.wrapped) {
        me.panel.addCls('fancy-panel-grid-inside');
      }

      if (me.title) {
        me.height -= me.titleHeight;
      }

      if (me.subTitle) {
        me.height -= me.subTitleHeight;
        me.height += panelBodyBorders[2];
      }

      me.height -= panelBodyBorders[0] + panelBodyBorders[2];

      me.renderTo = me.panel.el.select('.' + PANEL_BODY_INNER_CLS).dom;
    },
    /*
     * @return {Number}
     */
    getBodyHeight: function () {
      var me = this,
        height = me.height,
        rows = 1,
        gridBorders = me.gridBorders,
        gridWithoutPanelBorders = me.gridWithoutPanelBorders;

      if (me.groupheader) {
        rows = 2;
      }

      if (me.filter && me.filter.header) {
        if (me.groupheader) {
          if (me.filter.groupHeader) {
            rows++;
          }
        }
        else {
          rows++;
        }
      }

      if (me.header !== false) {
        height -= me.cellHeaderHeight * rows;
      }

      if (me.panel) {
        height -= gridBorders[0] + gridBorders[2];
      }
      else {
        height -= gridWithoutPanelBorders[0] + gridWithoutPanelBorders[2];
      }

      if (me.summary) {
        height -= me.summary.topOffSet;
        height -= me.summary.bottomOffSet;
      }

      return height;
    },
    /*
     *
     */
    ons: function () {
      var me = this,
        store = me.store,
        docEl = F.get(document);

      store.on('change', me.onChangeStore, me);
      store.on('set', me.onSetStore, me);
      store.on('remove', me.onRemoveStore, me);
      store.on('beforesort', me.onBeforeSortStore, me);
      store.on('sort', me.onSortStore, me);
      store.on('beforeload', me.onBeforeLoadStore, me);
      store.on('load', me.onLoadStore, me);
      docEl.on('mouseup', me.onDocMouseUp, me);
      docEl.on('click', me.onDocClick, me);
      docEl.on('mousemove', me.onDocMove, me);
      store.on('servererror', me.onServerError, me);
      store.on('serversuccess', me.onServerSuccess, me);

      if (me.responsive) {
        F.$(window).bind('resize', function () {
          me.onWindowResize()
        });
      }

      me.on('activate', me.onActivate, me);
      me.on('deactivate', me.onDeActivate, me);
    },
    /*
     * @param {Object} grid
     * @param {String} errorTitle
     * @param {String} errorText
     * @param {Object} request
     */
    onServerError: function (grid, errorTitle, errorText, request) {
      this.fire('servererror', errorTitle, errorText, request);
    },
    /*
     * @param {Object} grid
     * @param {Array} data
     * @param {Object} request
     */
    onServerSuccess: function (grid, data, request) {
      this.fire('serversuccess', data, request);
    },
    /*
     *
     */
    onChangeStore: function () {
      this.update();
    },
    /*
     * @param {Object} store
     */
    onBeforeLoadStore: function (store) {
      this.fire('beforeload');
    },
    /*
     * @param {Object} store
     * @param {String} id
     * @param {Fancy.Model} record
     */
    onRemoveStore: function (store, id, record) {
      var me = this;

      me.fire('remove', id, record);
    },
    /*
     * @param {Object} store
     */
    onLoadStore: function (store) {
      this.fire('load');
    },
    /*
     * @param {Object} store
     * @param {Object} o
     */
    onSetStore: function (store, o) {
      var me = this;

      me.fire('set', o);
    },
    /*
     * @param {Object} store
     * @param {Object} o
     */
    onBeforeSortStore: function (store, o) {
      this.fire('beforesort', o);
    },
    /*
     * @param {Object} store
     * @param {Object} o
     */
    onSortStore: function (store, o) {
      this.fire('sort', o);
    },
    /*
     * @return {Number}
     */
    getCellsViewHeight: function () {
      var me = this,
        s = me.store,
        plusScroll = 0,
        scrollBottomHeight = 0;

      if (me.grouping) {
        plusScroll += me.grouping.plusScroll;
      }

      if (me.expander) {
        plusScroll += me.expander.plusScroll;
      }

      if (!me.scroller.scrollBottomEl || me.scroller.scrollBottomEl.hasCls(HIDDEN_CLS)) {
      }
      else {
        scrollBottomHeight = me.scroller.cornerSize;
      }

      return (me.cellHeight) * s.dataView.length + scrollBottomHeight + plusScroll;
    },
    /*
     * @param {Object} e
     */
    onDocMouseUp: function (e) {
      this.fire('docmouseup');
    },
    /*
     * @param {Object} e
     */
    onDocClick: function (e) {
      this.fire('docclick', e);
    },
    /*
     * @param {Object} e
     */
    onDocMove: function (e) {
      this.fire('docmove', e);
    },
    /*
     * @return {Number}
     */
    getCenterViewWidth: function () {
      //Realization could be reason of bug
      var me = this,
        elWidth = me.centerEl.width();

      if (elWidth === 0) {
        var columnsWidth = 0,
          columns = me.columns,
          i = 0,
          iL = columns.length;

        for (; i < iL; i++) {
          var column = columns[i];
          if (!column.hidden) {
            columnsWidth += column.width;
          }
        }

        return columnsWidth;
      }

      return elWidth;
    },
    /*
     * @return {Number}
     */
    getCenterFullWidth: function () {
      var me = this,
        centerColumnsWidths = 0,
        columns = me.columns,
        i = 0,
        iL = columns.length;

      for (; i < iL; i++) {
        var column = columns[i];
        if (!column.hidden) {
          centerColumnsWidths += column.width;
        }
      }

      return centerColumnsWidths;
    },
    /*
     * @return {Number}
     */
    getLeftFullWidth: function () {
      var me = this,
        width = 0,
        columns = me.leftColumns,
        i = 0,
        iL = columns.length;

      for (; i < iL; i++) {
        var column = columns[i];
        if (!column.hidden) {
          width += column.width;
        }
      }

      return width;
    },
    /*
     * @return {Number}
     */
    getRightFullWidth: function () {
      var me = this,
        width = 0,
        columns = me.rightColumns,
        i = 0,
        iL = columns.length;

      for (; i < iL; i++) {
        var column = columns[i];
        if (!column.hidden) {
          width += column.width;
        }
      }

      return width;
    },
    /*
     * @param {String} side
     * @return {Array}
     */
    getColumns: function (side) {
      var me = this,
        columns;

      switch (side) {
        case 'left':
          columns = me.leftColumns;
          break;
        case 'center':
          columns = me.columns;
          break;
        case 'right':
          columns = me.rightColumns;
          break;
      }

      return columns;
    },
    /*
     * @param {String} side
     * @return {Fancy.grid.Body}
     */
    getBody: function (side) {
      var me = this,
        body;

      switch (side) {
        case 'left':
          body = me.leftBody;
          break;
        case 'center':
          body = me.body;
          break;
        case 'right':
          body = me.rightBody;
          break;
      }

      return body;
    },
    /*
     * @param {String} side
     * @return {Fancy.grid.Header}
     */
    getHeader: function (side) {
      var me = this,
        header;

      switch (side) {
        case 'left':
          header = me.leftHeader;
          break;
        case 'center':
          header = me.header;
          break;
        case 'right':
          header = me.rightHeader;
          break;
      }

      return header;
    },
    /*
     * @param {Number} rowIndex
     * @return {Array}
     */
    getDomRow: function (rowIndex) {
      var me = this,
        leftBody = me.leftBody,
        body = me.body,
        rightBody = me.rightBody,
        leftColumns = me.leftColumns,
        columns = me.columns,
        rightColumns = me.rightColumns,
        i = 0,
        iL = leftColumns.length,
        cells = [];

      for (; i < iL; i++) {
        cells.push(leftBody.getDomCell(rowIndex, i));
      }

      i = 0;
      iL = columns.length;
      for (; i < iL; i++) {
        cells.push(body.getDomCell(rowIndex, i));
      }

      i = 0;
      iL = rightColumns.length;
      for (; i < iL; i++) {
        cells.push(rightBody.getDomCell(rowIndex, i));
      }

      return cells;
    },
    /*
     *
     */
    initTextSelection: function () {
      var me = this,
        body = me.body,
        leftBody = me.leftBody,
        rightBody = me.rightBody;

      if (me.textSelection === false) {
        me.addCls(GRID_UNSELECTABLE_CLS);

        var fn = function (e) {
          var targetEl = F.get(e.target);
          if (targetEl.hasCls('fancy-field-text-input') || targetEl.hasCls('fancy-textarea-text-input')) {
            return;
          }

          e.preventDefault();
        };

        body.el.on('mousedown', fn);
        leftBody.el.on('mousedown', fn);
        rightBody.el.on('mousedown', fn);
      }
    },
    /*
     * @param {String} type
     * @param {*} value
     */
    setTrackOver: function (type, value) {
      var me = this;

      switch (type) {
        case 'cell':
          me.cellTrackOver = value;
          break;
        case 'column':
          me.columnTrackOver = value;
          break;
        case 'row':
          me.trackOver = value;
          break;
      }
    },
    /*
     * @param {String} type
     */
    setSelModel: function (type) {
      var me = this,
        selection = me.selection;

      selection.cell = false;
      selection.cells = false;
      selection.row = false;
      selection.rows = false;
      selection.column = false;
      selection.columns = false;
      selection[type] = true;

      if (type === 'rows') {
        me.multiSelect = true;
      }
      else {
        me.multiSelect = false;
      }

      selection.clearSelection();
    },
    /*
     * @param {Boolean} [returnModel]
     * @return {Array}
     */
    getSelection: function (returnModel) {
      var me = this;

      return me.selection.getSelection(returnModel);
    },
    /*
     *
     */
    clearSelection: function () {
      var me = this,
        selection = me.selection;

      selection.clearSelection();
    },
    /*
     *
     */
    destroy: function () {
      var me = this,
        docEl = F.get(document);

      docEl.un('mouseup', me.onDocMouseUp, me);
      docEl.un('click', me.onDocClick, me);
      docEl.un('mousemove', me.onDocMove, me);

      me.body.destroy();
      me.leftBody.destroy();
      me.rightBody.destroy();

      me.header.destroy();
      me.leftHeader.destroy();
      me.rightHeader.destroy();

      me.scroller.destroy();

      me.el.destroy();

      if (me.panel) {
        me.panel.el.destroy();
      }
    },
    /*
     *
     */
    showAt: function () {
      var me = this;

      if (me.panel) {
        me.panel.showAt.apply(me.panel, arguments);
      }
    },
    /*
     *
     */
    show: function () {
      var me = this;

      if (me.panel) {
        me.panel.show.apply(me.panel, arguments);
      }
      else {
        me.el.show();
      }
    },
    /*
     *
     */
    hide: function () {
      var me = this;

      if (me.panel) {
        me.panel.hide.apply(me.panel, arguments);
      }
      else {
        me.el.hide();
      }
    },
    /*
     *
     */
    initDateColumn: function () {
      var me = this;

      var prepareColumns = function (columns) {
        var i = 0,
          iL = columns.length;

        for (; i < iL; i++) {
          var column = columns[i];

          if (column.type === 'date') {
            column.format = column.format || {};

            var format = {
              type: 'date'
            };

            F.applyIf(format, me.lang.date);

            F.applyIf(column.format, format);
          }
        }

        return columns;
      };

      me.columns = prepareColumns(me.columns);
      me.leftColumns = prepareColumns(me.leftColumns);
      me.rightColumns = prepareColumns(me.rightColumns);
    },
    /*
     *
     */
    stopEditor: function () {
      var me = this;

      me.edit.stopEditor();
    },
    /*
     * @param {String} id
     * @return {Fancy.Model}
     */
    getById: function (id) {
      var me = this;

      return me.store.getById(id);
    },
    /*
     * @param {Number} rowIndex
     * @param {String} key
     * @return {Fancy.Model}
     */
    get: function (rowIndex, key) {
      var me = this,
        store = me.store;

      if (key !== undefined) {
        return store.get(rowIndex, key);
      }
      else if (rowIndex === undefined) {
        return store.get();
      }

      return store.getItem(rowIndex);
    },
    /*
     * @return {Number}
     */
    getTotal: function () {
      return this.store.getTotal();
    },
    /*
     * @return {Number}
     */
    getViewTotal: function () {
      return this.store.getLength();
    },
    /*
     * @return {Array}
     */
    getDataView: function () {
      return this.store.getDataView();
    },
    /*
     * @return {Array}
     */
    getData: function () {
      return this.store.getData();
    },
    /*
     * @param {Number} rowIndex
     */
    selectRow: function (rowIndex) {
      var me = this;

      me.selection.selectRow(rowIndex);
    },
    /*
     * @param {String} key
     */
    selectColumn: function (key) {
      var me = this,
        side,
        columnIndex,
        leftColumns = me.leftColumns || [],
        columns = me.columns || [],
        rightColumns = me.rightColumns || [];

      var isInSide = function (columns) {
        var i = 0,
          iL = columns.length;

        for (; i < iL; i++) {
          var column = columns[i];
          if (column.index === key || column.key === key) {
            columnIndex = i;
            return true;
          }
        }

        return false;
      };

      if (isInSide(leftColumns)) {
        side = 'left';
      }
      else if (isInSide(columns)) {
        side = 'center';
      }
      else if (isInSide(rightColumns)) {
        side = 'right';
      }

      if (side) {
        me.selection.selectColumns(columnIndex, side);
      }
    },
    /*
     * @param {String} key
     * @return {Object}
     */
    getColumnByIndex: function (key) {
      var me = this,
        leftColumns = me.leftColumns || [],
        columns = me.columns || [],
        rightColumns = me.rightColumns || [],
        _columns = leftColumns.concat(columns).concat(rightColumns),
        i = 0,
        iL = _columns.length;

      for (; i < iL; i++) {
        var column = _columns[i];
        if (column.index === key || column.key === key) {
          return column;
        }
      }
    },
    /*
     *
     */
    load: function () {
      var me = this;

      me.store.loadData();
    },
    /*
     *
     */
    save: function () {
      var me = this;

      me.store.save();
    },
    /*
     *
     */
    onWindowResize: function () {
      var me = this,
        renderTo = me.renderTo,
        el;

      if (me.panel) {
        renderTo = me.panel.renderTo;

        el = F.get(renderTo);
        me.setWidth(parseInt(el.width()));
      }

      me.setBodysHeight();
    },
    /*
     * @param {Number} width
     */
    setWidth: function (width) {
      var me = this,
        el = me.el,
        gridBorders = me.gridBorders,
        gridWithoutPanelBorders = me.gridWithoutPanelBorders,
        panelBodyBorders = me.panelBodyBorders,
        body = me.body,
        header = me.header;

      me.scroller.scroll(0, 0);

      var calcColumnsWidth = function (columns) {
        var i = 0,
          iL = columns.length,
          width = 0;

        for (; i < iL; i++) {
          var column = columns[i];

          if (!column.hidden) {
            width += columns[i].width;
          }
        }

        return width;
      };

      var leftColumnWidth = calcColumnsWidth(me.leftColumns),
        rightColumnWidth = calcColumnsWidth(me.rightColumns),
        newCenterWidth = width - leftColumnWidth - rightColumnWidth - panelBodyBorders[1] - panelBodyBorders[3],
        gridWidth;

      if (me.wrapped) {
        gridWidth = width;
        newCenterWidth = width - leftColumnWidth - rightColumnWidth;

        newCenterWidth -= gridBorders[1] + gridBorders[3];

        me.css({
          width: gridWidth
        });
      }
      else if (me.panel) {
        newCenterWidth = width - leftColumnWidth - rightColumnWidth - panelBodyBorders[1] - panelBodyBorders[3];
        me.panel.el.width(width);

        newCenterWidth -= gridBorders[1] + gridBorders[3];

        gridWidth = width - panelBodyBorders[1] - panelBodyBorders[3];

        me.css({
          width: gridWidth
        });
      }
      else {
        newCenterWidth = width - leftColumnWidth - rightColumnWidth - gridWithoutPanelBorders[1] - gridWithoutPanelBorders[3];

        el.css('width', width);
      }

      if (newCenterWidth < 100) {
        newCenterWidth = 100;
      }

      el.select('.' + GRID_CENTER_CLS).css('width', newCenterWidth);

      header.css('width', newCenterWidth);
      body.css('width', newCenterWidth);

      if (me.hasFlexColumns) {
        me.reCalcColumnsWidth();
        me.columnresizer.updateColumnsWidth();
      }

      me.scroller.setScrollBars();
    },
    /*
     * @return {Number}
     */
    getWidth: function () {
      var me = this,
        value;

      if (me.panel) {
        value = parseInt(me.panel.css('width'));
      }
      else {
        value = parseInt(me.css('width'));
      }

      return value;
    },
    /*
     * @return {Number}
     */
    getHeight: function () {
      var me = this,
        value;

      if (me.panel) {
        value = parseInt(me.panel.css('height'));
      }
      else {
        value = parseInt(me.css('height'));
      }

      return value;
    },
    /*
     * @param {Number} value
     * @param {Number} changePanelHeight
     */
    setHeight: function (value, changePanelHeight) {
      var me = this,
        gridBorders = me.gridBorders,
        panelBodyBorders = me.panelBodyBorders;

      if (me.panel && changePanelHeight !== false) {
        me.panel.setHeight(value);
      }

      if (me.title) {
        value -= me.titleHeight;
      }

      if (me.subTitle) {
        value -= me.subTitleHeight;
      }

      if (me.footer) {
        value -= me.barHeight;
      }

      if (me.bbar) {
        value -= me.barHeight;
      }

      if (me.tbar) {
        value -= me.barHeight;
      }

      if (me.subTBar) {
        value -= me.barHeight;
      }

      if (me.buttons) {
        value -= me.barHeight;
      }

      var bodyHeight = value;

      if (me.header) {
        bodyHeight -= me.cellHeaderHeight;
        if (me.groupheader) {
          bodyHeight -= me.cellHeaderHeight;
        }
      }

      if (me.panel) {
        bodyHeight -= panelBodyBorders[0] + panelBodyBorders[2];
      }

      bodyHeight -= gridBorders[0] + gridBorders[2];

      if (me.body) {
        me.body.css('height', bodyHeight);
      }

      if (me.leftBody) {
        me.leftBody.css('height', bodyHeight);
      }

      if (me.rightBody) {
        me.rightBody.css('height', bodyHeight);
      }

      me.el.css('height', value);
      me.height = value;

      me.scroller.update();
    },
    /*
     * @param {String} key
     * @param {*} value
     * @return {Array}
     */
    find: function (key, value) {
      return this.store.find(key, value);
    },
    /*
     * @param {String} key
     * @param {*} value
     * @return {Array}
     */
    findItem: function (key, value) {
      return this.store.findItem(key, value);
    },
    /*
     * @param {Function} fn
     * @param {Object} scope
     */
    each: function (fn, scope) {
      this.store.each(fn, scope);
    },
    /*
     *
     */
    onActivate: function () {
      var me = this,
        doc = F.get(document);

      setTimeout(function () {
        doc.on('click', me.onDeactivateClick, me);
      }, 100);
    },
    /*
     *
     */
    onDeActivate: function () {
      var me = this,
        doc = F.get(document);

      me.activated = false;
      doc.un('click', me.onDeactivateClick, me);
    },
    /*
     * @param {Object} e
     */
    onDeactivateClick: function (e) {
      var me = this,
        i = 0,
        iL = 20,
        parent = F.get(e.target);

      for (; i < iL; i++) {
        if (!parent.dom) {
          return;
        }

        if (!parent.dom.tagName || parent.dom.tagName.toLocaleLowerCase() === 'body') {
          me.fire('deactivate');
          return;
        }

        if (parent.hasCls(me.widgetCls)) {
          return;
        }

        parent = parent.parent();
      }
    },
    /*
     * @param {Array} keys
     * @param {Array} values
     */
    search: function (keys, values) {
      var me = this;

      me.searching.search(keys, values);
    },
    /*
     *
     */
    stopSelection: function () {
      var me = this;

      if (me.selection) {
        me.selection.stopSelection();
      }
    },
    /*
     * @param {Boolean} value
     */
    enableSelection: function (value) {
      var me = this;

      if (me.selection) {
        me.selection.enableSelection(value);
      }
    },
    /*
     * @param {String} side
     * @param {Number} index
     */
    hideColumn: function (side, index) {
      var me = this,
        body = me.getBody(side),
        header = me.getHeader(side),
        columns = me.getColumns(side),
        orderIndex,
        i = 0,
        iL = columns.length,
        column,
        centerEl = me.centerEl,
        leftEl = me.leftEl,
        leftHeader = me.leftHeader,
        rightEl = me.rightEl,
        rightHeader = me.rightHeader;

      for (; i < iL; i++) {
        column = columns[i];

        if (column.index === index) {
          orderIndex = i;
          column.hidden = true;
          break;
        }
      }

      header.hideCell(orderIndex);
      body.hideColumn(orderIndex);

      if (me.rowedit) {
        me.rowedit.hideField(orderIndex, side);
      }

      switch (side) {
        case 'left':
          leftEl.css('width', parseInt(leftEl.css('width')) - column.width);
          leftHeader.css('width', parseInt(leftHeader.css('width')) - column.width);
          centerEl.css('left', parseInt(centerEl.css('left')) - column.width);
          centerEl.css('width', parseInt(centerEl.css('width')) + column.width);
          me.body.css('width', parseInt(me.body.css('width')) + column.width);
          me.header.css('width', parseInt(me.header.css('width')) + column.width);
          break;
        case 'right':
          rightEl.css('width', parseInt(rightEl.css('width')) - column.width);
          rightHeader.css('width', parseInt(rightHeader.css('width')) - column.width);
          centerEl.css('width', parseInt(centerEl.css('width')) + column.width);
          me.body.css('width', parseInt(me.body.css('width')) + column.width);
          me.header.css('width', parseInt(me.header.css('width')) + column.width);
          break;
      }
    },
    /*
     * @param {String} side
     * @param {Number} index
     */
    showColumn: function (side, index) {
      var me = this,
        body = me.getBody(side),
        header = me.getHeader(side),
        columns = me.getColumns(side),
        orderIndex,
        i = 0,
        iL = columns.length,
        column,
        centerEl = me.centerEl,
        leftEl = me.leftEl,
        leftHeader = me.leftHeader,
        rightEl = me.rightEl,
        rightHeader = me.rightHeader;

      for (; i < iL; i++) {
        column = columns[i];

        if (column.index === index) {
          orderIndex = i;
          column.hidden = false;
          break;
        }
      }

      header.showCell(orderIndex);
      body.showColumn(orderIndex);

      if (me.rowedit) {
        me.rowedit.showField(orderIndex, side);
      }

      switch (side) {
        case 'left':
          leftEl.css('width', parseInt(leftEl.css('width')) + column.width);
          leftHeader.css('width', parseInt(leftHeader.css('width')) + column.width);
          centerEl.css('left', parseInt(centerEl.css('left')) + column.width);
          centerEl.css('width', parseInt(centerEl.css('width')) - column.width);
          me.body.css('width', parseInt(me.body.css('width')) - column.width);
          me.header.css('width', parseInt(me.header.css('width')) - column.width);
          break;
        case 'right':
          rightEl.css('width', parseInt(rightEl.css('width')) + column.width);
          rightHeader.css('width', parseInt(rightHeader.css('width')) + column.width);
          centerEl.css('width', parseInt(centerEl.css('width')) - column.width);
          me.body.css('width', parseInt(me.body.css('width')) - column.width);
          me.header.css('width', parseInt(me.header.css('width')) - column.width);
          break;
      }
    },
    /*
     * @param {Number} indexOrder
     * @param {String} side
     * @return {Object}
     */
    removeColumn: function (indexOrder, side) {
      var me = this,
        leftEl = me.leftEl,
        leftHeader = me.leftHeader,
        leftBody = me.leftBody,
        centerEl = me.centerEl,
        body = me.body,
        header = me.header,
        rightEl = me.rightEl,
        rightBody = me.rightBody,
        rightHeader = me.rightHeader,
        column;

      switch (side) {
        case 'left':
          column = me.leftColumns[indexOrder];
          me.leftColumns.splice(indexOrder, 1);
          leftHeader.removeCell(indexOrder);
          leftHeader.reSetIndexes();
          leftBody.removeColumn(indexOrder);
          leftEl.css('width', parseInt(leftEl.css('width')) - column.width);
          centerEl.css('left', parseInt(centerEl.css('left')) - column.width);
          centerEl.css('width', parseInt(centerEl.css('width')) + column.width);
          body.css('width', parseInt(body.css('width')) + column.width);
          header.css('width', parseInt(header.css('width')) + column.width);
          break;
        case 'center':
          column = me.columns[indexOrder];
          me.columns.splice(indexOrder, 1);
          header.removeCell(indexOrder);
          header.reSetIndexes();
          body.removeColumn(indexOrder);
          break;
        case 'right':
          column = me.rightColumns[indexOrder];
          me.rightColumns.splice(indexOrder, 1);
          rightHeader.removeCell(indexOrder);
          rightHeader.reSetIndexes();
          rightBody.removeColumn(indexOrder);
          rightEl.css('right', parseInt(rightEl.css('right')) - column.width);
          centerEl.css('width', parseInt(centerEl.css('width')) + column.width);
          header.css('width', parseInt(header.css('width')) + column.width);
          body.css('width', parseInt(body.css('width')) + column.width);
          break;
      }

      if (column.grouping) {
        delete column.grouping;
      }

      if (me.summary) {
        me.summary.removeColumn(indexOrder, side);
      }

      return column;
    },
    /*
     * @param {Object} column
     * @param {Number} index
     * @param {String} side
     * @param {String} fromSide
     */
    insertColumn: function (column, index, side, fromSide) {
      var me = this,
        leftEl = me.leftEl,
        leftBody = me.leftBody,
        leftHeader = me.leftHeader,
        centerEl = me.centerEl,
        body = me.body,
        header = me.header,
        rightEl = me.rightEl,
        rightBody = me.rightBody,
        rightHeader = me.rightHeader;

      side = side || 'center';

      switch (side) {
        case 'center':
          me.columns.splice(index, 0, column);
          header.insertCell(index, column);
          header.reSetIndexes();
          body.insertColumn(index, column);
          break;
        case 'left':
          me.leftColumns.splice(index, 0, column);
          leftHeader.insertCell(index, column);
          leftHeader.reSetIndexes();
          leftBody.insertColumn(index, column);
          leftEl.css('width', parseInt(leftEl.css('width')) + column.width);
          centerEl.css('width', parseInt(centerEl.css('width')) - column.width);
          centerEl.css('left', parseInt(centerEl.css('left')) + column.width);
          body.el.css('width', parseInt(body.el.css('width')) - column.width);
          header.el.css('width', parseInt(header.el.css('width')) - column.width);
          break;
        case 'right':
          me.rightColumns.splice(index, 0, column);
          rightHeader.insertCell(index, column);
          rightHeader.reSetIndexes();
          rightBody.insertColumn(index, column);
          rightEl.css('width', parseInt(rightEl.css('width')) + column.width);
          centerEl.css('width', parseInt(centerEl.css('width')) - column.width);
          body.css('width', parseInt(body.css('width')) - column.width);
          header.css('width', parseInt(header.css('width')) - column.width);
          break;
      }

      if (column.menu) {
        column.menu = true;
      }

      if (me.grouping) {
        me.grouping.updateGroupRows();
        me.grouping.setCellsPosition(index, side);
      }

      if (column.rowEditor) {
        if (side === 'left') {
          index--;
        }

        me.rowedit.moveEditor(column, index, side, fromSide);
      }

      if (me.summary) {
        me.summary.insertColumn(index, side);
      }

      me.header.destroyMenus();
      me.leftHeader.destroyMenus();
      me.rightHeader.destroyMenus();
    },
    /*
     * @param {Number} orderIndex
     * @param {String} legend
     */
    disableLegend: function (orderIndex, legend) {
      var me = this;

      me.columns[orderIndex].disabled = me.columns[orderIndex].disabled || {};
      me.columns[orderIndex].disabled[legend] = true;

      me.body.updateRows(undefined, orderIndex);
    },
    /*
     * @param {Number} orderIndex
     * @param {String} legend
     */
    enableLegend: function (orderIndex, legend) {
      var me = this;

      me.columns[orderIndex].disabled = me.columns[orderIndex].disabled || {};
      delete me.columns[orderIndex].disabled[legend];

      me.body.updateRows(undefined, orderIndex);
    },
    /*
     *
     */
    fitHeight: function () {
      var me = this,
        s = me.store,
        panelBodyBorders = me.panelBodyBorders,
        gridBorders = me.gridBorders,
        height = s.getLength() * me.cellHeight;

      if (me.title) {
        height += me.titleHeight;
      }

      if (me.tbar) {
        height += me.barHeight;
      }

      if (me.bbar) {
        height += me.barHeight;
      }

      if (me.buttons) {
        height += me.barHeight;
      }

      if (me.subTBar) {
        height += me.barHeight;
      }

      if (me.footer) {
        height += me.barHeight;
      }

      if (me.header !== false) {
        height += me.cellHeaderHeight;
        if (me.filter && me.filter.header) {
          height += me.cellHeaderHeight;
        }
      }

      if (me.panel) {
        height += panelBodyBorders[0] + panelBodyBorders[2] + gridBorders[0] + gridBorders[2];
      }
      else {
        height += gridBorders[0] + gridBorders[2];
      }

      me.setHeight(height);
    },
    /*
     * @param {String} index
     * @param {Mixed} value
     * @param {String} sign
     */
    addFilter: function (index, value, sign) {
      var me = this,
        filter = me.filter.filters[index],
        sign = sign || '';

      if (filter === undefined) {
        filter = {};
      }

      if (F.isDate(value)) {
        var format = this.getColumnByIndex(index).format;

        filter['type'] = 'date';
        filter['format'] = format;
        value = Number(value);
      }

      if (value === '') {
        delete filter[sign];
      }
      else {
        filter[sign] = value;
      }

      me.filter.filters[index] = filter;
      me.filter.updateStoreFilters();

      me.filter.addValuesInColumnFields(index, value, sign);
    },
    /*
     * @param {String} [index]
     * @param {String} [sign]
     */
    clearFilter: function (index, sign) {
      var me = this,
        s = me.store;

      if (index === undefined) {
        me.filter.filters = {};
        s.filters = {};
      }
      else if (sign === undefined) {
        me.filter.filters[index] = {};
        s.filters[index] = {};
      }
      else {
        if (me.filter && me.filter.filters && me.filter.filters[index] && me.filter.filters[index][sign]) {
          delete me.filter.filters[index][sign];
          delete s.filters[index][sign];
        }
      }

      s.changeDataView();
      me.update();

      if (me.filter) {
        me.filter.clearColumnsFields(index, sign);
      }
    },
    /*
     * @param {String} text
     */
    showLoadMask: function (text) {
      this.loadmask.showLoadMask(text);
    },
    /*
     *
     */
    hideLoadMask: function () {
      this.loadmask.hideLoadMask();
    },
    /*
     *
     */
    prevPage: function () {
      this.paging.prevPage();
    },
    /*
     *
     */
    nextPage: function () {
      this.paging.nextPage();
    },
    /*
     * @param {Number} value
     */
    setPage: function (value) {
      value--;
      if (value < 0) {
        value = 0;
      }

      this.paging.setPage(value);
    },
    /*
     *
     */
    firstPage: function () {
      this.paging.firstPage();
    },
    /*
     *
     */
    lastPage: function () {
      this.paging.lastPage();
    },
    /*
     * @param {Number} value
     */
    setPageSize: function (value) {
      this.paging.setPageSize(value);
    },
    /*
     * @return {Number}
     */
    getPage: function () {
      return this.store.showPage + 1;
    },
    /*
     * @return {Number}
     */
    getPages: function () {
      return this.store.pages;
    },
    /*
     * @return {Number}
     */
    getPageSize: function () {
      return this.store.pageSize;
    },
    /*
     *
     */
    refresh: function () {
      this.paging.refresh();
    },
    /*
     * @param {Number} x
     * @param {Number} y
     */
    scroll: function (x, y) {
      var me = this,
        scroller = me.scroller;

      scroller.scroll(x, y);

      scroller.scrollBottomKnob();
      scroller.scrollRightKnob();
    },
    /*
     * @return {Array}
     */
    getDataFiltered: function () {
      return this.store.filteredData;
    },
    /*
     *
     */
    reCalcColumnsWidth: function () {
      var me = this;

      if (!me.hasFlexColumns) {
        return;
      }

      var scroller = me.scroller,
        viewWidth = me.getCenterViewWidth(),
        columns = me.columns,
        flex = 0,
        i = 0,
        iL = columns.length,
        widthForFlex = viewWidth,
        flexPerCent;

      if (me.flexScrollSensitive !== false && scroller.isRightScrollable() && !scroller.nativeScroller) {
        widthForFlex -= me.bottomScrollHeight;
      }

      for (; i < iL; i++) {
        var column = columns[i];

        if (column.flex) {
          flex += column.flex;
        }
        else {
          widthForFlex -= column.width;
        }
      }

      if (flex === 0) {
        return;
      }

      flexPerCent = widthForFlex / flex;

      i = 0;
      for (; i < iL; i++) {
        var column = columns[i];

        if (column.flex) {
          column.width = Math.floor(column.flex * flexPerCent);

          if (column.minWidth && column.width < column.minWidth) {
            column.width = column.minWidth;
          }
          else if (column.width < me.minColumnWidth) {
            column.width = me.minColumnWidth;
          }
        }
      }
    },
    /*
     * @return {Array}
     */
    getDisplayedData: function () {
      var me = this,
        viewTotal = me.getViewTotal(),
        data = [],
        i = 0,
        leftColumns = me.leftColumns,
        columns = me.columns,
        rightColumns = me.rightColumns;

      for (; i < viewTotal; i++) {
        var rowData = [];

        F.each(leftColumns, function (column) {
          if (column.index === undefined) {
            return;
          }
          rowData.push(me.get(i, column.index));
        });

        F.each(columns, function (column) {
          if (column.index === undefined) {
            return;
          }
          rowData.push(me.get(i, column.index));
        });

        F.each(rightColumns, function (column) {
          if (column.index === undefined) {
            return;
          }
          rowData.push(me.get(i, column.index));
        });

        data.push(rowData);
      }

      return data;
    },
    /*
     *
     */
    exportToExcel: function () {
      var me = this;

      if (me.exporter) {
        me.exporter.exportToExcel();
      }
    }
  });

})();
/**
 * @class Fancy.Grid
 * @extends Fancy.Widget
 */
Fancy.define(['Fancy.Grid', 'FancyGrid'], {
  extend: Fancy.Widget,
  mixins: [
    'Fancy.grid.mixin.Grid',
    Fancy.panel.mixin.PrepareConfig,
    Fancy.panel.mixin.methods,
    'Fancy.grid.mixin.PrepareConfig',
    'Fancy.grid.mixin.ActionColumn',
    Fancy.grid.mixin.Edit
  ],
  plugins: [{
    type: 'grid.updater'
  },{
    type: 'grid.scroller'
  },{
    type: 'grid.licence'
  }],
  type: 'grid',
  theme: 'default',
  i18n: 'en',
  emptyText: '',
  prefix: 'fancy-grid-',
  cls: '',
  widgetCls: Fancy.GRID_CLS,
  header: true,
  shadow: true,
  striped: true,
  columnLines: true,
  textSelection: false,
  width: 200,
  height: 200,
  minWidth: 200,
  minHeight: 200,
  minColumnWidth: 30,
  emptyValue: '&nbsp;',
  frame: true,
  keyNavigation: false,
  draggable: false,
  activated: false,
  multiSort: false,
  tabEdit: true,
  dirtyEnabled: true,
  barScrollEnabled: true,
  /*
   * @constructor
   * @param {Object} config
   */
  constructor: function(config){
    var me = this,
      config = config || {};

    var fn = function(params){
      if(params){
        Fancy.apply(config, params);
      }

      config = me.prepareConfig(config, me);
      Fancy.applyConfig(me, config);

      me.Super('const', arguments);
    };

    var preInit = function(){
      var i18n = config.i18n || me.i18n;

      if( Fancy.loadLang(i18n, fn) === true ){
        fn({
          //lang: Fancy.i18n[i18n]
        });
      }
    };

    if(!Fancy.modules['grid'] && !Fancy.fullBuilt && Fancy.MODULELOAD !== false && Fancy.MODULESLOAD !== false){
      Fancy.loadModule('grid', function(){
        preInit();
      });
    }
    else{
      preInit();
    }
  },
  /*
   *
   */
  init: function(){
    var me = this;

    me.initId();
    me.addEvents('beforerender', 'afterrender', 'render', 'show', 'hide', 'destroy');
    me.addEvents(
      'headercellclick', 'headercellmousemove', 'headercellmousedown',
      'docmouseup', 'docclick', 'docmove',
      'init',
      'columnresize', 'columnclick', 'columndblclick', 'columnenter', 'columnleave', 'columnmousedown',
      'cellclick', 'celldblclick', 'cellenter', 'cellleave', 'cellmousedown', 'beforecellmousedown',
      'rowclick', 'rowdblclick', 'rowenter', 'rowleave', 'rowtrackenter', 'rowtrackleave',
      'columndrag',
      'scroll', 'nativescroll',
      'remove',
      'set',
      'update',
      'beforesort', 'sort',
      'beforeload', 'load', 'servererror', 'serversuccess',
      'select',
      'clearselect',
      'activate', 'deactivate',
      'beforeedit',
      'startedit',
      'changepage',
      'dropitems',
      'collapse', 'expand',
      'lockcolumn', 'rightlockcolumn', 'unlockcolumn',
      'filter'
    );

    if(Fancy.fullBuilt !== true && Fancy.MODULELOAD !== false && Fancy.MODULESLOAD !== false && me.fullBuilt !== true && me.neededModules !== true){
      if(me.wtype !== 'datepicker' && me.wtype !== 'monthpicker') {
        me.loadModules();
        return;
      }
    }

    me.initStore();

    me.initPlugins();

    me.ons();

    me.initDateColumn();
    me.fire('beforerender');
    me.preRender();
    me.render();
    me.initElements();
    me.initActionColumnHandler();
    me.fire('render');
    me.fire('afterrender');
    me.setSides();
    me.setSidesHeight();
    me.setColumnsPosition();
    me.update();
    me.initTextSelection();
    me.initTouch();

    setTimeout(function(){
      me.inited = true;
      me.fire('init');

      me.setBodysHeight();
    }, 1);
  },
  /*
   *
   */
  loadModules: function(){
    var me = this,
      requiredModules = {},
      columns = me.columns || [],
      leftColumns = me.leftColumns || [],
      rightColumns = me.rightColumns || [];

    Fancy.modules = Fancy.modules || {};

    if(Fancy.nojQuery){
      requiredModules.dom = true;
    }

    if(Fancy.isTouch){
      requiredModules.touch = true;
    }

    if(me.summary){
      requiredModules.summary = true;
    }

    if(me.exporter){
      requiredModules.exporter = true;
      requiredModules.excel = true;
    }

    if(me.paging){
      requiredModules.paging = true;
    }

    if(me.filter || me.searching){
      requiredModules.filter = true;
    }

    if(me.data && me.data.proxy){
      requiredModules.edit = true;
    }

    if(me.clicksToEdit){
      requiredModules.edit = true;
    }

    if(Fancy.isObject(me.data)){
      if(me.data.proxy){
        requiredModules['server-data'] = true;
        if(Fancy.nojQuery){
          requiredModules['ajax'] = true;
        }
      }

      if(me.data.chart){
        requiredModules['chart-integration'] = true;
      }
    }

    if(me.expander){
      requiredModules['expander'] = true;
    }

    if(me.isGroupedHeader){
      requiredModules['grouped-header'] = true;
    }

    if(me.grouping){
      requiredModules['grouping'] = true;
    }

    if(me.summary){
      requiredModules['summary'] = true;
    }

    if(me.exporter){
      requiredModules['exporter'] = true;
      requiredModules['excel'] = true;
    }

    if(me.trackOver || me.columnTrackOver || me.cellTrackOver || me.selection){
      requiredModules['selection'] = true;
    }

    var _columns = columns.concat(leftColumns).concat(rightColumns);

    Fancy.each(_columns, function(column){
      if(column.draggable === true){
        requiredModules['column-drag'] = true;
      }

      if(column.sortable === true){
        requiredModules.sort = true;
      }

      if(column.editable === true){
        requiredModules.edit = true;
      }

      if(column.menu === true){
        requiredModules.menu = true;
      }

      if(column.filter){
        requiredModules.filter = true;
      }

      switch(column.type){
        case 'select':
          me.checkboxRowSelection = true;
          requiredModules['selection'] = true;
          break;
        case 'combo':
          if(column.data && column.data.proxy){
            requiredModules['ajax'] = true;
          }
          break;
        case 'progressbar':
        case 'progressdonut':
        case 'grossloss':
        case 'hbar':
          requiredModules.spark = true;
          break;
        case 'date':
          requiredModules.date = true;
          requiredModules.selection = true;
          break;
      }
    });

    if(Fancy.isArray(me.tbar)){
      Fancy.each(me.tbar, function(item){
        switch(item.action){
          case 'add':
          case 'remove':
            requiredModules.edit = true;
            break;
        }
      });
    }

    if(me.gridToGrid){
      requiredModules.dd = true;
    }

    me.neededModules = {
      length: 0
    };

    for(var p in requiredModules){
      if(Fancy.modules[p] === undefined) {
        me.neededModules[p] = true;
        me.neededModules.length++;
      }
    }

    if(me.neededModules.length === 0){
      me.neededModules = true;
      me.init();
      return;
    }

    var onLoad = function(name){
      delete me.neededModules[name];
      me.neededModules.length--;

      if(me.neededModules.length === 0){
        me.neededModules = true;
        me.init();
      }
    };

    for(var p in me.neededModules){
      if(p === 'length'){
        continue;
      }

      Fancy.loadModule(p, onLoad);
    }
  },
  /*
   * @param {Number} indexOrder
   * @param {String} side
   */
  lockColumn: function(indexOrder, side){
    var me = this;

    if(me.columns.length === 1){
      return false;
    }

    var removedColumn = me.removeColumn(indexOrder, side);

    me.insertColumn(removedColumn, me.leftColumns.length, 'left');

    me.fire('lockcolumn');
  },
  /*
   * @param {Number} indexOrder
   * @param {String} side
   */
  rightLockColumn: function(indexOrder, side){
    var me = this;

    if(me.columns.length === 1){
      return false;
    }

    var removedColumn = me.removeColumn(indexOrder, side);

    me.insertColumn(removedColumn, 0, 'right');

    me.fire('rightlockcolumn');
  },
  /*
   * @param {Number} indexOrder
   * @param {String} side
   */
  unLockColumn: function(indexOrder, side){
    var me = this,
      removedColumn;

    switch(side){
      case 'left':
        removedColumn = me.removeColumn(indexOrder, side);
        me.insertColumn(removedColumn, 0, 'center', 'left');
        break;
      case 'right':
        removedColumn = me.removeColumn(indexOrder, side);
        me.insertColumn(removedColumn, me.columns.length, 'center', 'right');
        break;
    }

    if(side === 'left' && me.grouping && me.leftColumns.length === 0){
      me.grouping.insertGroupEls();
    }

    me.fire('unlockcolumn');
  },
  /*
   * @param {String} fromSide
   * @param {String} toSide
   * @param {Number} fromIndex
   * @param {Number} toIndex
   */
  moveColumn: function (fromSide, toSide, fromIndex, toIndex) {
    var me = this,
      removedColumn;

    if(fromSide === 'center'){
      removedColumn = me.removeColumn(fromIndex, 'center');
      switch(toSide){
        case 'left':
          me.insertColumn(removedColumn, toIndex, 'left', 'center');
          break;
        case 'right':
          me.insertColumn(removedColumn, toIndex, 'right', 'center');
          break;
      }
    }
    else if(fromSide === 'left'){
      removedColumn = me.removeColumn(fromIndex, 'left');
      switch(toSide){
        case 'center':
          me.insertColumn(removedColumn, toIndex, 'center', 'left');
          break;
        case 'right':
          me.insertColumn(removedColumn, toIndex, 'right', 'left');
          break;
      }
    }
    else if(fromSide === 'right'){
      removedColumn = me.removeColumn(fromIndex, 'right');
      switch(toSide){
        case 'center':
          me.insertColumn(removedColumn, toIndex, 'center', 'right');
          break;
        case 'left':
          me.insertColumn(removedColumn, toIndex, 'left', 'right');
          break;
      }
    }

    if(me.groupheader){
      me.header.fixGroupHeaderSizing();

      if(me.leftColumns){
        me.leftHeader.fixGroupHeaderSizing();
      }

      if(me.rightColumns){
        me.rightHeader.fixGroupHeaderSizing();
      }
    }
  }
});

/*
 * @param {String} id
 */
FancyGrid.get = function(id){
  var gridId = Fancy.get(id).select('.' + Fancy.GRID_CLS).dom.id;

  return Fancy.getWidget(gridId);
};

FancyGrid.defineTheme = Fancy.defineTheme;
FancyGrid.defineController = Fancy.defineController;
FancyGrid.addValid = Fancy.addValid;

if(!Fancy.nojQuery && Fancy.$){
  Fancy.$.fn.FancyGrid = function(o){
    o.renderTo = $(this.selector)[0].id;
    return new Fancy.Grid(o);
  };
}
/*
 * @class Fancy.grid.plugin.Updater
 * @extends Fancy.Plugin
 */
Fancy.define('Fancy.grid.plugin.Updater', {
  extend: Fancy.Plugin,
  ptype: 'grid.updater',
  inWidgetName: 'updater',
  /*
   * @param {Object} config
   */
  constructor: function(config){
    Fancy.applyConfig(this, config);

    this.Super('const', arguments);
  },
  /*
   *
   */
  init: function(){},
  /*
   *
   */
  update: function(){
    var w = this.widget;

    w.leftBody.update();
    w.body.update();
    w.rightBody.update();
  },
  /*
   * @param {Number} rowIndex
   */
  updateRow: function(rowIndex){
    var w = this.widget;

    w.leftBody.updateRows(rowIndex);
    w.body.updateRows(rowIndex);
    w.rightBody.updateRows(rowIndex);
  }
});
/*
 * @class Fancy.grid.plugin.Scroller
 * @extends Fancy.Plugin
 */
(function(){
  //SHORTCUTS
  var F = Fancy;

  /*
   * CONSTANTS
   */
  var RIGHT_SCROLL_CLS = 'fancy-scroll-right';
  var BOTTOM_SCROLL_CLS = 'fancy-scroll-bottom';
  var RIGHT_SCROLL_INNER_CLS = 'fancy-scroll-right-inner';
  var BOTTOM_SCROLL_INNER_CLS = 'fancy-scroll-bottom-inner';
  var NATIVE_SCROLLER_CLS = 'fancy-grid-native-scroller';
  var RIGHT_SCROLL_HOVER_CLS = 'fancy-scroll-right-hover';
  var BOTTOM_SCROLL_HOVER_CLS = 'fancy-scroll-bottom-hover';
  var RIGHT_SCROLL_ACTIVE_CLS = 'fancy-scroll-right-active';
  var BOTTOM_SCROLL_ACTIVE_CLS = 'fancy-scroll-bottom-active';
  var HIDDEN_CLS = F.HIDDEN_CLS;
  var GRID_COLUMN_CLS = F.GRID_COLUMN_CLS;
  var GRID_CENTER_CLS = F.GRID_CENTER_CLS;

  F.define('Fancy.grid.plugin.Scroller', {
    extend: F.Plugin,
    ptype: 'grid.scroller',
    inWidgetName: 'scroller',
    rightKnobDown: false,
    bottomKnobDown: false,
    minRightKnobHeight: 35,
    minBottomKnobWidth: 35,
    cornerSize: 12,
    /*
     * @private
     */
    scrollLeft: 0,
    /*
     * @constructor
     * @param {Object} config
     */
    constructor: function (config) {
      this.Super('const', arguments);
    },
    /*
     *
     */
    init: function () {
      this.Super('init', arguments);
      this.ons();
    },
    /*
     *
     */
    ons: function () {
      var me = this,
        w = me.widget,
        mouseWheelEventName = F.getMouseWheelEventName();

      w.once('render', function () {
        me.render();
        w.leftBody.el.on(mouseWheelEventName, me.onMouseWheel, me);
        if (w.nativeScroller) {
          w.leftBody.el.on(mouseWheelEventName, me.onMouseWheelLeft, me);
          w.rightBody.el.on(mouseWheelEventName, me.onMouseWheelRight, me);
        }
        w.body.el.on(mouseWheelEventName, me.onMouseWheel, me);
        w.rightBody.el.on(mouseWheelEventName, me.onMouseWheel, me);
        w.once('init', me.onGridInit, me);

        if (w.nativeScroller) {
          w.body.el.on('scroll', me.onNativeScrollBody, me);
          w.leftBody.el.on('scroll', me.onNativeScrollLeftBody, me);
          w.rightBody.el.on('scroll', me.onNativeScrollRightBody, me);
        }
      });

      me.on('render', me.onRender, me);

      w.store.on('change', me.onChangeStore, me);
    },
    /*
     *
     */
    destroy: function () {
      var me = this,
        w = me.widget,
        leftBody = w.leftBody,
        body = w.body,
        rightBody = w.rightBody,
        docEl = F.get(document),
        mouseWheelEventName = F.getMouseWheelEventName();

      docEl.un('mouseup', me.onMouseUpDoc, me);
      docEl.un('mousemove', me.onMouseMoveDoc, me);

      leftBody.el.un(mouseWheelEventName, me.onMouseWheel, me);
      body.el.un(mouseWheelEventName, me.onMouseWheel, me);
      rightBody.el.un(mouseWheelEventName, me.onMouseWheel, me);

      me.scrollBottomEl.un('mousedown', me.onMouseDownBottomSpin, me);
      me.scrollRightEl.un('mousedown', me.onMouseDownRightSpin, me);

      if (F.isTouch) {
        leftBody.el.un('touchstart', me.onBodyTouchStart, me);
        leftBody.el.un('touchmove', me.onBodyTouchMove, me);

        body.el.un('touchstart', me.onBodyTouchStart, me);
        body.el.un('touchmove', me.onBodyTouchMove, me);

        rightBody.el.un('touchstart', me.onBodyTouchStart, me);
        rightBody.el.un('touchmove', me.onBodyTouchMove, me);

        docEl.un('touchend', me.onMouseUpDoc, me);
      }
    },
    /*
     *
     */
    onGridInit: function () {
      var me = this,
        w = me.widget,
        docEl = F.get(document);

      me.setScrollBars();
      docEl.on('mouseup', me.onMouseUpDoc, me);
      docEl.on('mousemove', me.onMouseMoveDoc, me);
      w.on('columnresize', me.onColumnResize, me);

      w.on('lockcolumn', me.onLockColumn, me);
      w.on('rightlockcolumn', me.onRightLockColumn, me);
      w.on('unlockcolumn', me.onUnLockColumn, me);

      setTimeout(function () {
        me.update();
      }, 1);
    },
    /*
     *
     */
    render: function () {
      var me = this,
        w = me.widget,
        body = w.body,
        rightScrollEl = F.get(document.createElement('div')),
        bottomScrollEl = F.get(document.createElement('div')),
        right = 1;

      if (w.nativeScroller) {
        w.el.addCls(NATIVE_SCROLLER_CLS);
      }
      else {
        rightScrollEl.addCls(RIGHT_SCROLL_CLS);
        bottomScrollEl.addCls(BOTTOM_SCROLL_CLS, HIDDEN_CLS);

        rightScrollEl.update([
          '<div class="' + RIGHT_SCROLL_INNER_CLS + '"></div>'
        ].join(" "));

        rightScrollEl.select('.' + RIGHT_SCROLL_INNER_CLS).css('margin-top', w.knobOffSet);

        bottomScrollEl.update([
          '<div class="' + BOTTOM_SCROLL_INNER_CLS + '"></div>'
        ].join(" "));

        F.get(body.el.append(rightScrollEl.dom));
        me.scrollRightEl = body.el.select('.fancy-scroll-right');

        F.get(body.el.append(bottomScrollEl.dom));
        me.scrollBottomEl = body.el.select('.fancy-scroll-bottom');
      }

      me.fire('render');
    },
    /*
     *
     */
    onMouseWheel: function (e) {
      var me = this,
        w = me.widget,
        delta = F.getWheelDelta(e.originalEvent || e);

      if (me.isRightScrollable() == false) {
        return;
      }

      if (w.stopProp) {
        e.stopPropagation();
      }

      if (w.nativeScroller) {}
      else {
        if (me.scrollDelta(delta)) {
          e.preventDefault();
        }
        me.scrollRightKnob();
      }
    },
    /*
     *
     */
    onRender: function () {
      var me = this,
        w = me.widget;

      if (w.nativeScroller !== true) {
        me.scrollRightEl.hover(function () {
          if (me.bottomKnobDown !== true) {
            me.scrollRightEl.addCls(RIGHT_SCROLL_HOVER_CLS);
          }
        }, function () {
          me.scrollRightEl.removeCls(RIGHT_SCROLL_HOVER_CLS);
        });

        me.scrollBottomEl.hover(function () {
          if (me.rightKnobDown !== true) {
            me.scrollBottomEl.addCls(BOTTOM_SCROLL_HOVER_CLS);
          }
        }, function () {
          me.scrollBottomEl.removeCls(BOTTOM_SCROLL_HOVER_CLS);
        });

        me.initRightScroll();
        me.initBottomScroll();
      }

      if (F.isTouch) {
        me.initTouch();
      }
    },
    /*
     *
     */
    initTouch: function () {
      var me = this,
        w = me.widget,
        leftBody = w.leftBody,
        body = w.body,
        rightBody = w.rightBody,
        docEl = F.get(document);

      leftBody.el.on('touchstart', me.onBodyTouchStart, me);
      leftBody.el.on('touchmove', me.onBodyTouchMove, me);

      body.el.on('touchstart', me.onBodyTouchStart, me);
      body.el.on('touchmove', me.onBodyTouchMove, me);

      rightBody.el.on('touchstart', me.onBodyTouchStart, me);
      rightBody.el.on('touchmove', me.onBodyTouchMove, me);

      docEl.on('touchend', me.onMouseUpDoc, me);
    },
    /*
     * @param {Object} e
     */
    onBodyTouchStart: function (e) {
      var me = this,
        e = e.originalEvent || e,
        touchXY = e.changedTouches[0];

      me.rightKnobDown = true;
      me.bottomKnobDown = true;

      me.mouseDownXY = {
        x: touchXY.pageX,
        y: touchXY.pageY
      };

      me.rightKnobTop = parseInt(me.rightKnob.css('margin-top'));
      me.scrollRightEl.addCls(RIGHT_SCROLL_ACTIVE_CLS);

      me.bottomKnobLeft = parseInt(me.bottomKnob.css('margin-left'));
      me.scrollBottomEl.addCls(BOTTOM_SCROLL_ACTIVE_CLS);
    },
    /*
     *
     */
    onBodyTouchEnd: function () {
      this.onMouseUpDoc();
    },
    /*
     * @param {Object} e
     */
    onBodyTouchMove: function (e) {
      var me = this,
        e = e.originalEvent,
        touchXY = e.changedTouches[0];

      if (me.rightKnobDown === true) {
        e.preventDefault();
      }

      if (me.bottomKnobDown === true) {
        e.preventDefault();
      }

      me.onMouseMoveDoc({
        pageX: touchXY.pageX,
        pageY: touchXY.pageY
      });
    },
    /*
     *
     */
    initRightScroll: function () {
      var me = this;

      me.rightKnob = me.scrollRightEl.select('.' + RIGHT_SCROLL_INNER_CLS);
      me.scrollRightEl.on('mousedown', me.onMouseDownRightSpin, me);
    },
    /*
     *
     */
    initBottomScroll: function () {
      var me = this;

      me.bottomKnob = me.scrollBottomEl.select('.' + BOTTOM_SCROLL_INNER_CLS);
      me.scrollBottomEl.on('mousedown', me.onMouseDownBottomSpin, me);
    },
    /*
     * @param {Object} e
     */
    onMouseDownRightSpin: function (e) {
      var me = this;


      if (F.isTouch) {
        return;
      }

      e.preventDefault();

      me.rightKnobDown = true;
      me.mouseDownXY = {
        x: e.pageX,
        y: e.pageY
      };

      me.rightKnobTop = parseInt(me.rightKnob.css('margin-top'));
      me.scrollRightEl.addCls(RIGHT_SCROLL_ACTIVE_CLS);
    },
    /*
     * @param {Object} e
     */
    onMouseDownBottomSpin: function (e) {
      var me = this;

      e.preventDefault();

      me.bottomKnobDown = true;
      me.mouseDownXY = {
        x: e.pageX,
        y: e.pageY
      };

      me.bottomKnobLeft = parseInt(me.bottomKnob.css('margin-left'));
      me.scrollBottomEl.addCls(BOTTOM_SCROLL_ACTIVE_CLS);
    },
    /*
     *
     */
    onMouseUpDoc: function () {
      var me = this;

      if (me.rightKnobDown === false && me.bottomKnobDown === false) {
        return;
      }

      me.scrollRightEl.removeCls(RIGHT_SCROLL_ACTIVE_CLS);
      me.scrollBottomEl.removeCls(BOTTOM_SCROLL_ACTIVE_CLS);
      me.rightKnobDown = false;
      me.bottomKnobDown = false;
    },
    /*
     * @param {Object} e
     */
    onMouseMoveDoc: function (e) {
      var me = this,
        w = me.widget,
        topScroll = false,
        bottomScroll = false,
        knobOffSet = w.knobOffSet,
        x = e.pageX,
        y = e.pageY,
        deltaX,
        deltaY,
        marginTop,
        marginLeft;

      if (me.rightKnobDown) {
        if (F.isTouch) {
          deltaY = me.mouseDownXY.y - y;
          marginTop = deltaY + me.rightKnobTop;
        }
        else {
          deltaY = y - me.mouseDownXY.y;
          marginTop = deltaY + me.rightKnobTop;
        }

        if (marginTop < me.knobOffSet) {
          marginTop = me.knobOffSet;
        }

        if (me.bodyViewHeight < marginTop + me.rightKnobHeight) {
          marginTop = me.bodyViewHeight - me.rightKnobHeight;
        }

        if (marginTop < me.rightScrollScale) {
          marginTop = 0;
        }

        me.rightKnob.css('margin-top', (marginTop + knobOffSet) + 'px');
        topScroll = me.rightScrollScale * marginTop;

        me.scroll(topScroll);
      }

      if (me.bottomKnobDown) {
        if (F.isTouch) {
          deltaX = me.mouseDownXY.x - x;
          deltaY = me.mouseDownXY.y - y;
          marginLeft = deltaX + me.bottomKnobLeft;
        }
        else {
          deltaX = x - me.mouseDownXY.x;
          deltaY = y - me.mouseDownXY.y;
          marginLeft = deltaX + me.bottomKnobLeft;
        }

        if (marginLeft < 1) {
          marginLeft = 1;
        }

        if (me.bodyViewWidth - 2 < marginLeft + me.bottomKnobWidth) {
          marginLeft = me.bodyViewWidth - me.bottomKnobWidth - 2;
        }

        if (me.bottomScrollScale < 0 && marginLeft < 0) {
          marginLeft = 0;
          me.bottomScrollScale = 0;
        }

        me.bottomKnob.css('margin-left', marginLeft + 'px');
        bottomScroll = Math.ceil(me.bottomScrollScale * (marginLeft - 1));

        me.scroll(false, bottomScroll);
      }
    },
    /*
     *
     */
    setScrollBars: function () {
      var me = this,
        w = me.widget;

      //me.checkRightScroll();
      setTimeout(function () {
        me.checkRightScroll();
      }, 1);

      if (!me.checkBottomScroll()) {
        if (me.scrollTop) {
          w.scroll(false, 0);
        }
      }

      if (!w.nativeScroller) {
        me.checkCorner();
        me.setRightKnobSize();
        me.setBottomKnobSize();
      }
    },
    /*
     *
     */
    checkRightScroll: function () {
      var me = this,
        w = me.widget,
        body = w.body,
        gridBorders = w.gridBorders,
        bodyViewHeight = w.getBodyHeight(),
        cellsViewHeight = w.getCellsViewHeight() - gridBorders[0] - gridBorders[2];

      if (w.nativeScroller) {
        if (bodyViewHeight >= cellsViewHeight) {
          body.el.css('overflow-y', 'hidden');
        }
        else {
          body.el.css('overflow-y', 'scroll');
        }
      }
      else {
        if (bodyViewHeight >= cellsViewHeight) {
          me.scrollRightEl.addCls(HIDDEN_CLS);
        }
        else {
          me.scrollRightEl.removeCls(HIDDEN_CLS);
        }
      }
    },
    /*
     *
     */
    isRightScrollable: function () {
      var w = this.widget;

      if (w.nativeScroller) {
        return w.body.el.css('overflow-y') === 'scroll';
      }

      return !this.scrollRightEl.hasCls(HIDDEN_CLS);
    },
    /*
     *
     */
    setRightKnobSize: function () {
      var me = this,
        w = me.widget;

      if (w.nativeScroller) {
        return;
      }

      var bodyViewHeight = w.getBodyHeight() - (me.corner ? me.cornerSize : 0) - 2,
        cellsViewHeight = w.getCellsViewHeight() - (me.corner ? me.cornerSize : 0),
        scrollRightPath = cellsViewHeight - bodyViewHeight,
        percents = 100 - scrollRightPath / (bodyViewHeight / 100),
        knobHeight = bodyViewHeight * (percents / 100),
        knobOffSet = w.knobOffSet;

      if (knobHeight < me.minRightKnobHeight) {
        knobHeight = me.minRightKnobHeight;
      }

      if (me.corner === false) {
        bodyViewHeight -= knobOffSet;
      }

      me.rightKnob.css('height', knobHeight + 'px');
      me.rightKnobHeight = knobHeight;
      me.bodyViewHeight = bodyViewHeight;
      me.rightScrollScale = (cellsViewHeight - bodyViewHeight) / (bodyViewHeight - knobHeight);
    },
    /*
     *
     */
    checkBottomScroll: function () {
      var me = this,
        w = me.widget,
        body = w.body,
        centerViewWidth = w.getCenterViewWidth(),
        centerFullWidth = w.getCenterFullWidth() - 2,
        showBottomScroll;

      if (w.nativeScroller) {
        if (centerViewWidth > centerFullWidth) {
          showBottomScroll = false;
          body.el.css('overflow-x', 'hidden');
        }
        else {
          showBottomScroll = true;
          body.el.css('overflow-x', 'scroll');
        }
      }
      else {
        if (centerViewWidth > centerFullWidth) {
          showBottomScroll = false;
          me.scrollBottomEl.addCls(HIDDEN_CLS);
        }
        else {
          showBottomScroll = true;
          me.scrollBottomEl.removeCls(HIDDEN_CLS);
        }
      }

      return showBottomScroll;
    },
    /*
     *
     */
    checkCorner: function () {
      var me = this,
        w = me.widget;

      if (w.nativeScroller) {
        return;
      }

      me.corner = !me.scrollRightEl.hasCls(HIDDEN_CLS) && !me.scrollBottomEl.hasCls(HIDDEN_CLS);
    },
    /*
     *
     */
    setBottomKnobSize: function () {
      var me = this,
        w = me.widget;

      if (w.nativeScroller) {
        return;
      }

      var centerViewWidth = w.getCenterViewWidth() - (me.corner ? me.cornerSize : 0),
        centerFullWidth = w.getCenterFullWidth() - (me.corner ? me.cornerSize : 0),
        scrollBottomPath = centerFullWidth - centerViewWidth,
        percents = 100 - scrollBottomPath / (centerFullWidth / 100),
        knobWidth = centerViewWidth * (percents / 100) - 2;

      if (knobWidth < me.minBottomKnobWidth) {
        knobWidth = me.minBottomKnobWidth;
      }

      me.bottomKnob.css('width', knobWidth + 'px');
      me.bottomKnobWidth = knobWidth;
      me.bodyViewWidth = centerViewWidth;
      me.bottomScrollScale = (centerViewWidth - centerFullWidth) / (centerViewWidth - knobWidth - 2 - 1);
    },
    /*
     * @param {Number} y
     * @param {Number} x
     */
    scroll: function (y, x) {
      var me = this,
        w = me.widget,
        scrollInfo;

      if (w.nativeScroller) {
        if (y !== null && y !== undefined) {
          w.body.el.dom.scrollTop = y;
        }

        if (x !== null && x !== undefined) {
          w.body.el.dom.scrollLeft = x;
          if (w.header) {
            w.header.scroll(x);
          }
        }

        w.fire('scroll');
        return
      }

      w.leftBody.scroll(y);
      scrollInfo = w.body.scroll(y, x);
      w.rightBody.scroll(y);

      if (scrollInfo.scrollTop !== undefined) {
        me.scrollTop = Math.abs(scrollInfo.scrollTop);
      }

      if (scrollInfo.scrollLeft !== undefined) {
        me.scrollLeft = Math.abs(scrollInfo.scrollLeft);
      }

      w.fire('scroll');
    },
    /*
     * @param {Number} value
     * @return {Boolean}
     */
    scrollDelta: function (value) {
      var me = this,
        w = me.widget,
        scrollInfo;

      w.leftBody.wheelScroll(value);
      scrollInfo = w.body.wheelScroll(value);
      w.rightBody.wheelScroll(value);

      me.scrollTop = Math.abs(scrollInfo.newScroll);
      me.scrollLeft = Math.abs(scrollInfo.scrollLeft);

      w.fire('scroll');

      return scrollInfo.scrolled;
    },
    /*
     *
     */
    scrollRightKnob: function () {
      var me = this,
        w = me.widget,
        bodyScrolled = me.getScroll(),
        newKnobScroll = bodyScrolled / me.rightScrollScale + w.knobOffSet;

      if (!me.rightKnob) {
        return;
      }

      me.rightKnob.css('margin-top', newKnobScroll + 'px');
    },
    /*
     *
     */
    scrollBottomKnob: function () {
      var me = this,
        w = me.widget,
        scrolled = me.getBottomScroll(),
        newKnobScroll = scrolled / me.bottomScrollScale + w.knobOffSet;

      if (scrolled === 0) {
        newKnobScroll = -1;
      }

      if (!me.bottomKnob) {
        return;
      }

      me.bottomKnob.css('margin-left', -newKnobScroll + 'px');
    },
    /*
     * @return {Number}
     */
    getScroll: function () {
      return Math.abs(parseInt(this.widget.body.el.select('.' + GRID_COLUMN_CLS).item(0).css('top')));
    },
    /*
     * @return {Number}
     */
    getBottomScroll: function () {
      return Math.abs(parseInt(this.widget.body.el.select('.' + GRID_COLUMN_CLS).item(0).css('left')));
    },
    /*
     *
     */
    update: function () {
      this.setScrollBars();
      this.checkScroll();
    },
    /*
     *
     */
    onChangeStore: function () {
      this.update();
    },
    /*
     *
     */
    onColumnResize: function () {
      this.setScrollBars();
    },
    /*
     *
     */
    checkScroll: function () {
      var me = this,
        w = me.widget,
        rightScrolled = me.getScroll(),
        bodyViewHeight = w.getBodyHeight() - (me.corner ? me.cornerSize : 0),
        cellsViewHeight = w.getCellsViewHeight() - (me.corner ? me.cornerSize : 0);

      if (rightScrolled && cellsViewHeight < bodyViewHeight) {
        me.scroll(0);
        if (!w.nativeScroller) {
          me.scrollRightKnob();
        }
      }
    },
    /*
     * @param {Fancy.Element} cell
     */
    scrollToCell: function (cell) {
      var me = this,
        w = me.widget,
        cellHeight = w.cellHeight,
        cellEl = F.get(cell),
        columnEl = cellEl.parent(),
        rowIndex = Number(cellEl.attr('index')),
        columnIndex = Number(columnEl.attr('index')),
        rightScroll = me.getScroll(),
        passedHeight = cellHeight * (rowIndex + 1),
        bodyViewHeight = w.getBodyHeight(),
        bottomScroll = me.getBottomScroll(),
        bodyViewWidth = parseInt(w.body.el.css('width')),
        passedWidth = 0,
        isCenterBody = columnEl.parent().parent().hasCls(GRID_CENTER_CLS);

      if(w.nativeScroller){
        return;
      }

      if (rowIndex === 0 && columnIndex === 0) {
        me.scroll(0, 0);
        me.scrollBottomKnob();
        me.scrollRightKnob();

        return;
      }

      if (passedHeight - rightScroll > bodyViewHeight) {
        rightScroll += cellHeight;
        me.scroll(rightScroll);
      }

      if (isCenterBody) {
        var columns = w.columns,
          i = 0;

        for (; i <= columnIndex; i++) {
          passedWidth += columns[i].width;
        }

        if (passedWidth - bottomScroll > bodyViewWidth) {
          if (!columns[i]) {
            me.scroll(rightScroll, -(passedWidth - bottomScroll - bodyViewWidth));
          }
          else {
            me.scroll(rightScroll, -(bottomScroll + columns[i - 1].width));
          }
        }
        else if (bottomScroll !== 0) {
          if (columnIndex === 0) {
            me.scroll(rightScroll, 0);
          }
        }

        me.scrollBottomKnob();
      }

      me.scrollRightKnob();
    },
    /*
     *
     */
    onNativeScrollBody: function(){
      var me = this,
        w = me.widget,
        scrollTop = w.body.el.dom.scrollTop,
        scrollLeft = w.body.el.dom.scrollLeft;

      if(w.header){
        w.header.scroll(-scrollLeft);
      }

      if (w.leftBody){
        w.leftBody.el.dom.scrollTop = scrollTop;
      }

      if (w.rightBody){
        w.rightBody.el.dom.scrollTop = scrollTop;
      }

      if(w.leftColumns.length && w.leftBody.el.dom.scrollTop !== w.body.el.dom.scrollTop){
        w.body.el.dom.scrollTop = w.leftBody.el.dom.scrollTop;
      }
      else if(w.rightColumns.length && w.rightBody.el.dom.scrollTop !== w.body.el.dom.scrollTop){
        w.body.el.dom.scrollTop = w.rightBody.el.dom.scrollTop;
      }

      w.fire('nativescroll');
    },
    /*
     *
     */
    onNativeScrollLeftBody: function(){
      var w = this.widget;

      if(w.leftBody.el.dom.scrollTop !== w.body.el.dom.scrollTop){
        this.onNativeScrollBody();
      }
    },
    /*
     *
     */
    onNativeScrollRightBody: function(){
      var w = this.widget;

      if(w.rightBody.el.dom.scrollTop !== w.body.el.dom.scrollTop){
        this.onNativeScrollBody();
      }
    },
    /*
     * @param {Object} e
     */
    onMouseWheelLeft: function (e) {
      var w = this.widget,
        delta = F.getWheelDelta(e.originalEvent || e),
        scrollTop = delta * w.cellHeight;

      w.leftBody.el.dom.scrollTop -= scrollTop;
      w.body.el.dom.scrollTop -= scrollTop;
      w.rightBody.el.dom.scrollTop -= scrollTop;
    },
    /*
     * @param {Object} e
     */
    onMouseWheelRight: function (e) {
      var w = this.widget,
        delta = F.getWheelDelta(e.originalEvent || e),
        scrollTop = delta * w.cellHeight;

      w.leftBody.el.dom.scrollTop -= scrollTop;
      w.body.el.dom.scrollTop -= scrollTop;
      w.rightBody.el.dom.scrollTop -= scrollTop;
    },
    /*
     *
     */
    onLockColumn: function () {
      this.update();
      this.widget.setColumnsPosition();
    },
    /*
     *
     */
    onRightLockColumn: function () {
      this.update();
      this.widget.setColumnsPosition();
    },
    /*
     *
     */
    onUnLockColumn: function () {
      this.update();
      this.widget.setColumnsPosition();
    }
  });

})();
/*
 * @class Fancy.grid.plugin.Sorter
 * @extends Fancy.Plugin
 */
(function () {
  //SHORTCUTS
  var F = Fancy;

  //CONSTANTS
  var GRID_COLUMN_SORT_ASC = F.GRID_COLUMN_SORT_ASC;
  var GRID_COLUMN_SORT_DESC = F.GRID_COLUMN_SORT_DESC;
  var GRID_COLUMN_RESIZER_CLS = F.GRID_COLUMN_RESIZER_CLS;
  var FIELD_CLS = F.FIELD_CLS;
  var GRID_CENTER_CLS = F.GRID_CENTER_CLS;
  var GRID_LEFT_CLS = F.GRID_LEFT_CLS;
  var GRID_RIGHT_CLS = F.GRID_RIGHT_CLS;

  F.define('Fancy.grid.plugin.Sorter', {
    extend: F.Plugin,
    ptype: 'grid.sorter',
    inWidgetName: 'sorter',
    /*
     * @constructor
     * @param {Object} config
     */
    constructor: function (config) {
      this.Super('const', arguments);
    },
    /*
     *
     */
    init: function () {
      this.Super('init', arguments);
      this.ons();
    },
    /*
     *
     */
    ons: function () {
      var me = this,
        w = me.widget;

      w.once('render', function () {
        me.onsHeaders();
      });
    },
    /*
     *
     */
    onsHeaders: function () {
      var me = this,
        w = me.widget;

      w.on('headercellclick', me.onHeaderCellClick, me);
    },
    /*
     * @param {Fancy.Grid} grid
     * @param {Object} o
     */
    onHeaderCellClick: function (grid, o) {
      var me = this,
        w = me.widget,
        cellEl = F.get(o.cell),
        side = o.side,
        index = o.index,
        action,
        columns,
        column,
        key,
        e = o.e,
        target = e.target;

      if (target.tagName.toLocaleLowerCase() === 'input') {
        return;
      }

      var field = cellEl.select('.' + FIELD_CLS);
      if (field.length > 0 && field.item(0).within(target) === true) {
        return;
      }

      if (cellEl.hasCls(GRID_COLUMN_RESIZER_CLS) || w.startResizing) {
        return;
      }

      columns = w.getColumns(side);

      if (cellEl.hasCls(GRID_COLUMN_SORT_ASC)) {
        action = 'desc';
      }
      else if (cellEl.hasCls(GRID_COLUMN_SORT_DESC)) {
        action = 'asc';
      }
      else {
        action = 'asc';
      }

      column = columns[index];
      key = column.index || column.key;

      me.sort(action, key, side, column, cellEl);
    },
    /*
     * @param {String} dir
     * @param {String} index
     * @param {String} side
     * @param {Object} column
     * @param {Object} cell
     */
    sort: function (dir, index, side, column, cell) {
      var me = this,
        w = me.widget,
        s = w.store,
        columns = w.getColumns(side),
        i = 0,
        iL = columns.length,
        type,
        header = w.getHeader(side);

      if (!column || !cell) {
        for (; i < iL; i++) {
          if (columns[i].index === index) {
            column = columns[i];
            cell = header.getCell(i);
            break;
          }
        }
      }

      if (column.sortable !== true) {
        return;
      }

      if (w.multiSort) {
        me.clearHeaderMultiSortCls(dir, cell);
      }
      else {
        me.clearHeaderSortCls();
      }

      switch (dir) {
        case 'asc':
          cell.addCls(GRID_COLUMN_SORT_ASC);
          break;
        case 'desc':
          cell.addCls(GRID_COLUMN_SORT_DESC);
          break;
      }

      type = column.type;

      var format,
        mode;

      if (column.format) {
        if (F.isString(column.format)) {
          switch (column.format) {
            case 'date':
              format = w.lang.date.read;
              if (column.format.mode) {
                mode = column.format.mode;
              }
              break;
          }
        }
        else {
          switch (column.type) {
            case 'date':
              format = column.format.read;
              if (column.format.mode) {
                mode = column.format.mode;
              }
              break;
          }
        }
      }

      if (w.grouping) {
        if (s.remoteSort) {
          s.once('load', function () {
            w.grouping.reGroup();
            //Write code instead of reGroup
          });
        }
      }

      s.sort(dir, type, index, {
        smartIndexFn: column.smartIndexFn,
        format: format,
        mode: mode
      });
    },
    /*
     * @param {String} dir
     * @param {Fancy.Element} cellEl
     */
    clearHeaderMultiSortCls: function (dir, cellEl) {
      var me = this,
        w = me.widget,
        s = w.store,
        itemsASC,
        itemsDESC;

      switch (dir.toLocaleUpperCase()) {
        case 'ASC':
          cellEl.removeCls(GRID_COLUMN_SORT_DESC);
          break;
        case 'DESC':
          cellEl.removeCls(GRID_COLUMN_SORT_ASC);
          break;
      }

      itemsASC = w.el.select('.' + GRID_COLUMN_SORT_ASC);
      itemsDESC = w.el.select('.' + GRID_COLUMN_SORT_DESC);

      if (itemsASC.length + itemsDESC.length < 3) {
        return;
      }

      //TODO: Small refactoring that decrease size
      var i = 0,
        iL = itemsASC.length,
        cellToRemoveCls;

      for (; i < iL; i++) {
        var cell = itemsASC.item(i),
          sideEl = cell.parent().parent(),
          side,
          columns,
          key,
          index = cell.attr('index');

        if (sideEl.hasCls(GRID_CENTER_CLS)) {
          side = 'center';
        }
        else if (sideEl.hasCls(GRID_LEFT_CLS)) {
          side = 'left';
        }
        else if (sideEl.hasCls(GRID_RIGHT_CLS)) {
          side = 'right';
        }

        columns = w.getColumns(side);
        key = columns[index].index;

        var firstSorter = s.sorters[0];

        if (firstSorter.key === key) {
          cellToRemoveCls = cell;
        }
      }

      var i = 0,
        iL = itemsDESC.length;

      for (; i < iL; i++) {
        var cell = itemsDESC.item(i),
          sideEl = cell.parent().parent(),
          side,
          columns,
          key,
          index = cell.attr('index');

        if (sideEl.hasCls(GRID_CENTER_CLS)) {
          side = 'center';
        }
        else if (sideEl.hasCls(GRID_LEFT_CLS)) {
          side = 'left';
        }
        else if (sideEl.hasCls(GRID_RIGHT_CLS)) {
          side = 'right';
        }

        columns = w.getColumns(side);
        key = columns[index].index;

        var firstSorter = s.sorters[0];

        if (firstSorter.key === key) {
          cellToRemoveCls = cell;
        }
      }

      cellToRemoveCls.removeCls(GRID_COLUMN_SORT_ASC);
      cellToRemoveCls.removeCls(GRID_COLUMN_SORT_DESC);
    },
    /*
     *
     */
    clearHeaderSortCls: function () {
      var el = this.widget.el;

      el.select('.' + GRID_COLUMN_SORT_ASC).removeCls(GRID_COLUMN_SORT_ASC);
      el.select('.' + GRID_COLUMN_SORT_DESC).removeCls(GRID_COLUMN_SORT_DESC);
    }
  });

})();
/*
 * @class Fancy.grid.plugin.Paging
 * @extends Fancy.Plugin
 */
Fancy.define('Fancy.grid.plugin.Paging', {
  extend: Fancy.Plugin,
  ptype: 'grid.paging',
  inWidgetName: 'paging',
  barType: 'bbar',
  /*
   * @constructor
   * @param {Object} config
   */
  constructor: function(config) {
    this.Super('const', arguments);
  },
  /*
   *
   */
  init: function(){
    this.Super('init', arguments);
    this.ons();
  },
  /*
   *
   */
  ons: function(){
    var me = this,
      w = me.widget,
      store = w.store;

    store.on('change', me.onChangeStore, me);
    store.on('remove', me.onChangeStore, me);
    store.on('filter', me.onChangeStore, me);
    w.on('render', me.onRenderGrid, me);
  },
  /*
   * @param {Number} value
   */
  setPageSize: function(value){
    this.widget.store.setPageSize(value);
  },
  /*
   *
   */
  nextPage: function(){
    this.widget.store.nextPage();
  },
  /*
   *
   */
  lastPage: function(){
    this.widget.store.lastPage();
  },
  /*
   *
   */
  prevPage: function(){
    this.widget.store.prevPage();
  },
  /*
   *
   */
  firstPage: function(){
    this.widget.store.firstPage();
  },
  /*
   * @param {Fancy.Store} store
   */
  onChangeStore: function(store){
    var me = this,
      w = me.widget,
      s = w.store,
      panel = w.panel,
      pageField;

    switch(me.barType){
      case 'both':
        pageField = panel['_bbar'].roles.pagenumber;
        pageField.setValue(s.showPage + 1);

        pageField = panel['_tbar'].roles.pagenumber;
        pageField.setValue(s.showPage + 1);

        me.updateBar('tbar');
        me.updateBar('bbar');
        break;
      case 'none':
      case false:
        break;
      default:
        pageField = panel['_'+me.barType].roles.pagenumber;
        pageField.setValue(s.showPage + 1);

        me.updateBar();
    }

    w.setSidesHeight();
    w.fire('changepage');
  },
  /*
   * @param {Number} value
   */
  setPage: function(value){
    var me = this,
      w = me.widget,
      s = w.store;

    if(value < 0){
      value = 0;
    }
    else if(value > s.pages ){
      value = s.pages;
    }

    s.setPage(value);

    return value;
  },
  refresh: function(){
    var me = this,
      w = me.widget,
      s = w.store;

    w.showLoadMask();
    setTimeout(function() {
      s.refresh();

      if(s.pageType !== 'server'){
        w.hideLoadMask();
      }
    }, 200);
  },
  /*
   * @param {String} barType
   */
  updateBar: function(barType){
    var me = this,
      w = me.widget,
      s = w.store,
      showPage = s.showPage,
      pageSize = s.pageSize,
      pages = s.pages,
      panel = w.panel,
      barType = barType || me.barType,
      barRoles = panel['_' + barType].roles,
      pageField = barRoles.pagenumber,
      ofText = barRoles.ofText,
      info = barRoles.info,
      first = barRoles.first,
      prev = barRoles.prev,
      next = barRoles.next,
      last = barRoles.last,
      infoStart = showPage * pageSize + 1,
      infoEnd = infoStart + pageSize,
      infoTotal = s.getTotal() || 0,
      lang = w.lang;

    if(infoEnd > infoTotal){
      infoEnd = infoTotal;
    }

    if(infoEnd === 0){
      infoStart = 0;
    }

    pageField.setValue(s.showPage + 1);

    ofText.el.update( Fancy.String.format(lang.paging.of, [pages || 1]) );
    info.el.update( Fancy.String.format(lang.paging.info, [infoStart, infoEnd, infoTotal]) );

    if(showPage === 0){
      first.disable();
      prev.disable();
    }
    else{
      first.enable();
      prev.enable();
    }

    if(pages - 1 === showPage || pages === 0){
      last.disable();
      next.disable();
    }
    else{
      last.enable();
      next.enable();
    }
  },
  /*
   *
   */
  onRenderGrid: function(){
    var me = this;

    switch(me.barType){
      case 'both':
        me.updateBar('tbar');
        me.updateBar('bbar');
        break;
      case 'none':
      case false:
        break;
      default:
        me.updateBar();
    }
  }
});
/*
 * @class Fancy.grid.plugin.LoadMask
 * @extends Fancy.Plugin
 */
Fancy.define('Fancy.grid.plugin.LoadMask', {
  extend: Fancy.Plugin,
  ptype: 'grid.loadmask',
  inWidgetName: 'loadmask',
  cls: 'fancy-loadmask',
  innerCls: 'fancy-loadmask-inner',
  imageCls: 'fancy-loadmask-image',
  textCls: 'fancy-loadmask-text',
  /*
   * @constructor
   * @param {Object} config
   */
  constructor: function(config){
    this.Super('const', arguments);
  },
  /*
   *
   */
  init: function(){
    this.Super('init', arguments);
    this.ons();
  },
  /*
   *
   */
  ons: function(){
    var me = this,
      w = me.widget,
      s = w.store;

    w.once('render', function(){
      me.render();
      if(s.loading){
        me.onBeforeLoad();
      }
      w.on('beforeload', me.onBeforeLoad, me);
      w.on('load', me.onLoad, me);
    });
  },
  /*
   *
   */
  render: function(){
    var me = this,
      w = me.widget,
      wEl = w.el,
      renderTo = wEl,
      width,
      height,
      el = Fancy.get( document.createElement('div')),
      lang = w.lang;

    if(w.panel){
      renderTo = w.panel.el;
    }

    width = renderTo.width();
    height = renderTo.height();

    el.addCls(me.cls);

    if( w.theme !== 'default' ){
      el.addCls('fancy-theme-' + w.theme);
    }

    el.css({
      width: width,
      height: height,
      opacity: 0
    });

    el.update([
      '<div class="'+me.innerCls+'">' +
        '<div class="'+me.imageCls+'"></div>'+
        '<div class="'+me.textCls+'">' + lang.loadingText +'</div>'+
      '</div>'
    ].join(' '));

    me.el = Fancy.get(renderTo.dom.appendChild(el.dom));
    me.innerEl = me.el.select('.' + me.innerCls);
    me.textEl = me.el.select('.'+me.textCls);

    var innerWidth = me.innerEl.width(),
      innerHeight = me.innerEl.height();

    me.innerEl.css({
      left: width/2 - innerWidth/2,
      top: height/2 - innerHeight/2
    });

    if(w.store.loading !== true){
      el.css('display', 'none');
    }
    else{
      el.css('display', 'block');
      me.showLoadMask();
    }
    el.css('opacity', 1);
  },
  /*
   *
   */
  onBeforeLoad: function(){
    this.showLoadMask();
  },
  /*
   *
   */
  onLoad: function(){
    this.hideLoadMask();
  },
  /*
   * @param {String} text
   */
  showLoadMask: function(text){
    var me = this,
      w = me.widget,
      lang = w.lang;

    if(text){
      me.textEl.update(text);
      me.el.css('display', 'block');
      return;
    }

    me.loaded = false;

    setTimeout(function(){
      if(me.loaded !== true){
        me.textEl.update(lang.loadingText);

        me.el.css('display', 'block');
      }
    }, 50);
  },
  /*
   *
   */
  hideLoadMask: function(){
    this.loaded = true;
    this.el.css('display', 'none');
  }
});
/*
 * @class Fancy.grid.plugin.ColumnResizer
 * @extend Fancy.Plugin
 */
(function () {
  //SHORTCUTS
  var F = Fancy;
  var G = F.get;

  //CONSTANTS
  var FIELD_CLS = F.FIELD_CLS;
  var GRID_RESIZER_LEFT_CLS = F.GRID_RESIZER_LEFT_CLS;
  var GRID_RESIZER_RIGHT_CLS = F.GRID_RESIZER_RIGHT_CLS;
  var GRID_HEADER_CELL_TRIGGER_CLS = F.GRID_HEADER_CELL_TRIGGER_CLS;
  var GRID_HEADER_CELL_TRIGGER_IMAGE_CLS = F.GRID_HEADER_CELL_TRIGGER_IMAGE_CLS;
  var GRID_HEADER_CELL_CLS = F.GRID_HEADER_CELL_CLS;
  var GRID_COLUMN_RESIZER_CLS = F.GRID_COLUMN_RESIZER_CLS;
  var GRID_COLUMN_CLS = F.GRID_COLUMN_CLS;
  var GRID_HEADER_CELL_GROUP_LEVEL_2_CLS = F.GRID_HEADER_CELL_GROUP_LEVEL_2_CLS;

  F.define('Fancy.grid.plugin.ColumnResizer', {
    extend: F.Plugin,
    ptype: 'grid.columnresizer',
    inWidgetName: 'columnresizer',
    /*
     * @param {Object} config
     */
    constructor: function (config) {
      this.Super('const', arguments);
    },
    /*
     *
     */
    init: function () {
      var me = this,
        w = me.widget;

      me.Super('init', arguments);

      w.on('render', function () {
        me.render();
        me.ons();
      });
    },
    /*
     *
     */
    ons: function () {
      var me = this,
        w = me.widget;

      w.on('headercellmousemove', me.onCellMouseMove, me);
      w.on('headercellmousedown', me.onHeaderCellMouseDown, me);
      w.on('docclick', me.onDocClick, me);
      w.on('docmove', me.onDocMove, me);
      w.on('docmouseup', me.onDocMouseUp, me);
    },
    /*
     * @param {Fancy.Grid} grid
     * @param {Object} o
     */
    onCellMouseMove: function (grid, o) {
      var me = this,
        w = me.widget,
        e = o.e,
        cellEl = G(o.cell),
        offsetX = e.offsetX,
        cellWidth = cellEl.width(),
        target = G(e.target),
        isInTrigger = target.hasCls(GRID_HEADER_CELL_TRIGGER_CLS),
        isInTriggerImage = target.hasCls(GRID_HEADER_CELL_TRIGGER_IMAGE_CLS),
        triggerEl = cellEl.select('.' + GRID_HEADER_CELL_TRIGGER_CLS).item(0),
        triggerImageEl = cellEl.select('.' + GRID_HEADER_CELL_TRIGGER_IMAGE_CLS).item(0),
        hasFieldInSide = G(e.target).closest('.' + FIELD_CLS).hasCls(FIELD_CLS),
        triggerWidth = parseInt(triggerEl.css('width')),
        triggerImageWidth = parseInt(triggerImageEl.css('width')),
        _width = cellWidth,
        inOffsetX = 7;

      if (isInTrigger) {
        _width = triggerWidth;
      }

      if (isInTriggerImage) {
        _width = triggerImageWidth;
      }

      if (w.startResizing) {
        return;
      }

      if (o.side === 'left' && o.index === w.leftColumns.length - 1 && (_width - offsetX) < inOffsetX + 2) {
        inOffsetX += 2;
      }

      if (!isInTrigger && !isInTriggerImage && o.side === 'right' && o.index === 0 && offsetX < inOffsetX) {
        if (me.isColumnResizable(o)) {
          if (!hasFieldInSide) {
            me.addCellResizeCls(o.cell);
          }
        }
      }
      else if (!isInTrigger && !isInTriggerImage && offsetX < inOffsetX && o.side === 'center' && o.index === 0 && w.leftColumns.length) {
        o.side = 'left';
        o.index = w.leftColumns.length - 1;
        if (me.isColumnResizable(o)) {
          if (!hasFieldInSide) {
            me.addCellResizeCls(o.cell);
          }
        }
      }
      else if (!isInTrigger && !isInTriggerImage && ( (_width - offsetX) < inOffsetX || offsetX < inOffsetX) && o.index !== 0) {
        var isLeft = offsetX < inOffsetX;

        if (me.isColumnResizable(o, isLeft)) {
          if (!hasFieldInSide) {
            me.addCellResizeCls(o.cell);
          }
        }
      }
      else if ((_width - offsetX) < inOffsetX) {
        if (isInTriggerImage) {
          if (triggerImageWidth - offsetX > 2) {
            me.removeCellResizeCls(o.cell);
          }
          else {
            me.addCellResizeCls(o.cell);
          }
        }
        else if (me.isColumnResizable(o)) {
          me.addCellResizeCls(o.cell);
        }
      }
      else {
        me.removeCellResizeCls(o.cell);
      }
    },
    /*
     * @param {Fancy.Element} cell
     */
    addCellResizeCls: function (cell) {
      var me = this,
        w = me.widget,
        columndrag = w.columndrag;

      if(columndrag && columndrag.status === 'dragging'){
        return;
      }

      G(cell).addCls(GRID_COLUMN_RESIZER_CLS);
      G(cell).select('.' + GRID_HEADER_CELL_TRIGGER_CLS).addCls(GRID_COLUMN_RESIZER_CLS);
    },
    /*
     * @param {Fancy.Element} cell
     */
    removeCellResizeCls: function (cell) {
      G(cell).removeClass(GRID_COLUMN_RESIZER_CLS);
      G(cell).select('.' + GRID_HEADER_CELL_TRIGGER_CLS).item(0).removeClass(GRID_COLUMN_RESIZER_CLS);
    },
    /*
     * @param {Object} e
     * @param {Object} o
     */
    onHeaderCellMouseDown: function (e, o) {
      var me = this,
        w = me.widget,
        e = o.e,
        target = G(e.target),
        cellEl = G(o.cell),
        offsetX = e.offsetX,
        cellWidth = cellEl.width(),
        field = cellEl.select('.' + FIELD_CLS),
        isInTrigger = target.hasCls(GRID_HEADER_CELL_TRIGGER_CLS),
        isInTriggerImage = target.hasCls(GRID_HEADER_CELL_TRIGGER_IMAGE_CLS),
        triggerEl = cellEl.select('.' + GRID_HEADER_CELL_TRIGGER_CLS).item(0),
        triggerImageEl = cellEl.select('.' + GRID_HEADER_CELL_TRIGGER_IMAGE_CLS).item(0),
        triggerWidth = parseInt(triggerEl.css('width')),
        triggerImageWidth = parseInt(triggerImageEl.css('width')),
        _width = cellWidth,
        inOffsetX = 7;

      if (isInTrigger) {
        _width = triggerWidth;
      }

      if (isInTriggerImage) {
        _width = triggerImageWidth;
        return;
      }

      if (field.length > 0 && field.item(0).within(target.dom)) {
        return;
      }

      if (o.side === 'left' && o.index === w.leftColumns.length - 1 && (_width - offsetX) < inOffsetX + 2) {
        inOffsetX += 2;
      }

      if (!isInTrigger && !isInTriggerImage && o.side === 'right' && o.index === 0 && offsetX < inOffsetX) {
        w.startResizing = true;
        F.apply(me, {
          cell: o.cell,
          activeSide: o.side,
          clientX: e.clientX,
          columnIndex: o.index,
          moveLeftResizer: true
        });
      }
      else if (offsetX < 7 && o.side === 'center' && o.index === 0 && w.leftColumns.length) {
        w.startResizing = true;
        o.side = 'left';
        o.index = w.leftColumns.length - 1;
        F.apply(me, {
          cell: me.getCell(o),
          activeSide: o.side,
          clientX: e.clientX,
          columnIndex: o.index
        });
      }
      else if (!isInTrigger && !isInTriggerImage && offsetX < inOffsetX && o.index !== 0) {
        w.startResizing = true;
        F.apply(me, {
          cell: me.getPrevCell(o),
          activeSide: o.side,
          clientX: e.clientX,
          columnIndex: o.index - 1
        });
      }
      else if ((_width - offsetX) < inOffsetX) {
        w.startResizing = true;
        F.apply(me, {
          cell: o.cell,
          activeSide: o.side,
          clientX: e.clientX,
          columnIndex: o.index
        });
      }

      if (w.startResizing) {
        me.isColumnResizable();
      }
    },
    /*
     * @param {Object} o
     * @param {Boolean} isLeft
     * @return {Boolean}
     */
    isColumnResizable: function (o, isLeft) {
      var me = this,
        w = me.widget,
        columns,
        column,
        index;

      if (o) {
        columns = w.getColumns(o.side);
        index = o.index;
        if (isLeft) {
          index--;
        }
        if (isNaN(index)) {
          return;
        }
        column = columns[index];
        return column.resizable === true;
      }
      else {
        columns = w.getColumns(me.activeSide);
        if (columns[me.columnIndex].resizable !== true) {
          w.startResizing = false;
          delete me.cell;
          delete me.activeSide;
          delete me.clientX;
          delete me.columnIndex;
        }
      }
    },
    /*
     * @return {Number}
     */
    getMinColumnWidth: function () {
      var me = this,
        w = me.widget,
        minCellWidth = w.minCellWidth,
        columns,
        column;

      if (me.columnIndex === undefined) {
        return minCellWidth;
      }

      columns = w.getColumns(me.activeSide);
      column = columns[me.columnIndex];

      if (column.minWidth) {
        return column.minWidth;
      }

      return minCellWidth;
    },
    /*
     * @return {Number|false}
     */
    getMaxColumnWidth: function () {
      var me = this,
        w = me.widget,
        columns,
        column;

      if (me.columnIndex === undefined) {
        return false;
      }

      columns = w.getColumns(me.activeSide);
      column = columns[me.columnIndex];

      if (column.maxWidth) {
        return column.maxWidth;
      }

      return false;
    },
    /*
     *
     */
    onDocClick: function () {
      this.widget.startResizing = false;
    },
    /*
     * @param {Fancy.Grid} grid
     * @param {Object} e
     */
    onDocMove: function (grid, e) {
      if (this.widget.startResizing) {
        this.moveResizeEls(e);
      }
    },
    /*
     *
     */
    render: function () {
      var me = this,
        w = me.widget,
        leftEl = G(document.createElement('div')),
        rightEl = G(document.createElement('div'));

      leftEl.addCls(GRID_RESIZER_LEFT_CLS);
      rightEl.addCls(GRID_RESIZER_RIGHT_CLS);

      me.leftEl = G(w.el.dom.appendChild(leftEl.dom));
      me.rightEl = G(w.el.dom.appendChild(rightEl.dom));
    },
    /*
     * @param {Object} e
     */
    moveResizeEls: function (e) {
      var me = this,
        w = me.widget,
        cellEl = G(me.cell),
        left = parseInt(cellEl.css('left')),
        minWidth = me.getMinColumnWidth(),
        maxWidth = me.getMaxColumnWidth();

      switch (me.activeSide) {
        case 'left':
          break;
        case 'center':
          left += parseInt(w.leftEl.css('width'));
          break;
        case 'right':
          left += parseInt(w.leftEl.css('width'));
          left += parseInt(w.centerEl.css('width'));
          break;
      }

      var clientX = e.clientX,
        deltaClientX = clientX - me.clientX,
        cellWidth = cellEl.width() + deltaClientX;

      if (cellWidth < minWidth) {
        cellWidth = minWidth;
      }

      if (maxWidth && cellWidth > maxWidth) {
        cellWidth = maxWidth;
      }

      me.deltaWidth = cellEl.width() - cellWidth;

      if (me.moveLeftResizer) {
        deltaClientX = clientX - me.clientX;
        cellWidth = cellEl.width() - deltaClientX;

        if (cellWidth < minWidth) {
          cellWidth = minWidth;
        }

        me.deltaWidth = cellEl.width() - cellWidth;

        me.leftEl.css({
          display: 'block',
          left: left + deltaClientX + 'px'
        });

        me.rightEl.css({
          display: 'block',
          left: (left + cellEl.width() - 1) + 'px'
        });
      }
      else {
        me.leftEl.css({
          display: 'block',
          left: left + 'px'
        });

        me.rightEl.css({
          display: 'block',
          left: left + cellWidth + 'px'
        });
      }

      me.cellWidth = cellWidth;
    },
    /*
     *
     */
    onDocMouseUp: function () {
      var me = this,
        w = me.widget;

      if (w.startResizing === false) {
        return;
      }

      me.leftEl.css({
        display: 'none'
      });

      me.rightEl.css({
        display: 'none'
      });

      me.fixSidesWidth();
      w.startResizing = false;
      me.moveLeftResizer = false;
      delete me.cellWidth;
    },
    /*
     *
     */
    fixSidesWidth: function () {
      var me = this,
        w = me.widget,
        cellWidth = me.cellWidth,
        index = me.columnIndex,
        delta = me.deltaWidth,
        domColumns,
        domHeaderCells,
        leftEl = w.leftEl,
        centerEl = w.centerEl,
        rightEl = w.rightEl,
        leftHeaderEl = w.leftHeader.el,
        centerHeaderEl = w.header.el,
        rightHeaderEl = w.rightHeader.el,
        centerBodyEl = w.body.el,
        groupMove = {},
        ignoreGroupIndexes = {},
        column,
        newCenterWidth,
        minCenterWidth = me.minCenterWidth;

      if (cellWidth === undefined) {
        return;
      }

      var leftFix = 1;
      if (F.nojQuery) {
        leftFix = 0;
      }

      switch (me.activeSide) {
        case 'left':
          newCenterWidth = parseInt(centerEl.css('width')) + delta + leftFix;

          if (newCenterWidth < minCenterWidth) {
            return;
          }

          column = w.leftColumns[index];

          w.leftColumns[me.columnIndex].width = cellWidth;
          domColumns = w.leftBody.el.select('.' + GRID_COLUMN_CLS);
          domHeaderCells = w.leftHeader.el.select('.' + GRID_HEADER_CELL_CLS);
          domColumns.item(index).css('width', cellWidth + 'px');

          var i = me.columnIndex + 1,
            iL = domHeaderCells.length,
            _i = 0,
            _iL = i;

          for (; _i < _iL; _i++) {
            var domHeaderCell = domHeaderCells.item(_i),
              groupIndex = domHeaderCell.attr('group-index');

            if (groupIndex) {
              ignoreGroupIndexes[groupIndex] = true;
            }
          }

          for (; i < iL; i++) {
            var domColumnEl = domColumns.item(i),
              domHeaderCell = domHeaderCells.item(i);

            domColumnEl.css('left', parseInt(domColumnEl.css('left')) - delta - leftFix);
            if (domHeaderCell.hasCls(GRID_HEADER_CELL_GROUP_LEVEL_2_CLS) && ignoreGroupIndexes[domHeaderCell.attr('index')]) {
            }
            else {
              domHeaderCell.css('left', parseInt(domHeaderCell.css('left')) - delta - leftFix);
            }
          }

          leftEl.css('width', parseInt(leftEl.css('width')) - delta - leftFix);
          leftHeaderEl.css('width', parseInt(leftHeaderEl.css('width')) - delta - leftFix + 'px');

          if (w.columns.length) {
            centerEl.css('left', parseInt(centerEl.css('left')) - delta - leftFix);
            centerEl.css('width', newCenterWidth);
            centerHeaderEl.css('width', parseInt(centerHeaderEl.css('width')) + delta + leftFix);
            centerBodyEl.css('width', parseInt(centerBodyEl.css('width')) + delta + leftFix);
          }

          break;
        case 'center':
          column = w.columns[index];
          w.columns[me.columnIndex].width = cellWidth;
          domColumns = w.body.el.select('.' + GRID_COLUMN_CLS);
          domHeaderCells = w.header.el.select('.' + GRID_HEADER_CELL_CLS);
          domColumns.item(index).css('width', cellWidth + 'px');

          var i = me.columnIndex + 1,
            iL = domHeaderCells.length,
            _i = 0,
            _iL = i;

          for (; _i < _iL; _i++) {
            var domHeaderCell = domHeaderCells.item(_i),
              groupIndex = domHeaderCell.attr('group-index');

            if (groupIndex) {
              ignoreGroupIndexes[groupIndex] = true;
            }
          }

          for (; i < iL; i++) {
            var domColumnEl = domColumns.item(i),
              domHeaderCell = domHeaderCells.item(i),
              left = parseInt(domColumnEl.css('left')) - delta - leftFix,
              _left = parseInt(domHeaderCell.css('left')) - delta - leftFix;

            if (domHeaderCell.attr('group-index')) {
              groupMove[domHeaderCell.attr('group-index')] = {};
            }

            domColumnEl.css('left', left);

            if (domHeaderCell.hasCls(GRID_HEADER_CELL_GROUP_LEVEL_2_CLS) && ignoreGroupIndexes[domHeaderCell.attr('index')]) {
            }
            else {
              domHeaderCell.css('left', _left);
            }
          }

          break;
        case 'right':
          newCenterWidth = parseInt(centerEl.css('width')) + delta + leftFix;

          if (newCenterWidth < minCenterWidth) {
            return;
          }

          column = w.rightColumns[index];

          w.rightColumns[me.columnIndex].width = cellWidth;
          domColumns = w.rightBody.el.select('.' + GRID_COLUMN_CLS);
          domHeaderCells = w.rightHeader.el.select('.' + GRID_HEADER_CELL_CLS);
          domColumns.item(index).css('width', cellWidth + 'px');

          var i = me.columnIndex + 1,
            iL = domHeaderCells.length,
            _i = 0,
            _iL = i;

          for (; _i < _iL; _i++) {
            var domHeaderCell = domHeaderCells.item(_i),
              groupIndex = domHeaderCell.attr('group-index');

            if (groupIndex) {
              ignoreGroupIndexes[groupIndex] = true;
            }
          }

          for (; i < iL; i++) {
            var domColumnEl = domColumns.item(i),
              domHeaderCell = domHeaderCells.item(i);

            domColumnEl.css('left', parseInt(domColumnEl.css('left')) - delta - leftFix);

            if (domHeaderCell.hasCls(GRID_HEADER_CELL_GROUP_LEVEL_2_CLS) && ignoreGroupIndexes[domHeaderCell.attr('index')]) {
            }
            else {
              domHeaderCell.css('left', parseInt(domHeaderCell.css('left')) - delta - leftFix);
            }
          }

          rightEl.css('width', parseInt(rightEl.css('width')) - delta - leftFix);
          rightHeaderEl.css('width', parseInt(rightHeaderEl.css('width')) - delta - leftFix + 'px');

          if (w.columns.length) {
            centerEl.css('width', newCenterWidth);
            centerHeaderEl.css('width', parseInt(centerHeaderEl.css('width')) + delta + leftFix);
            centerBodyEl.css('width', parseInt(centerBodyEl.css('width')) + delta + leftFix);
          }
          break;
      }

      var cellEl = G(me.cell),
        groupName = cellEl.attr('group-index'),
        groupCell;

      cellEl.css('width', cellWidth + 'px');

      if (groupName) {
        groupCell = w.el.select("[index='" + groupName + "']");
        groupCell.css('width', parseInt(groupCell.css('width')) - delta - leftFix);
      }
      else {
        for (var p in groupMove) {
          groupCell = w.el.select("[index='" + p + "']");
          groupCell.css('left', parseInt(groupCell.css('left')) - groupMove[p].delta - leftFix);
        }
      }

      w.fire('columnresize', {
        cell: cellEl.dom,
        width: cellWidth
      });

      if (/sparkline/.test(column.type)) {
        switch (me.activeSide) {
          case 'left':
            w.leftBody.updateRows(undefined, index);
            break;
          case 'center':
            w.body.updateRows(undefined, index);
            break;
          case 'right':
            w.rightBody.updateRows(undefined, index);
            break;
        }
      }
    },
    /*
     * @param {Object} o
     * @return {Fancy.Element}
     */
    getPrevCell: function (o) {
      var me = this,
        w = me.widget,
        header;

      switch (o.side) {
        case 'left':
          header = w.leftHeader;
          break;
        case 'center':
          header = w.header;
          break;
        case 'right':
          header = w.rightHeader;
          break;
      }

      return header.el.select('.' + GRID_HEADER_CELL_CLS).item(o.index - 1).dom;
    },
    /*
     * @param {Object} o
     * @return {HTMLElement}
     */
    getCell: function (o) {
      var me = this,
        w = me.widget,
        header;

      switch (o.side) {
        case 'left':
          header = w.leftHeader;
          break;
        case 'center':
          header = w.header;
          break;
        case 'right':
          header = w.rightHeader;
          break;
      }

      return header.el.select('.' + GRID_HEADER_CELL_CLS).item(o.index).dom;
    },
    /*
     * @param {String} side
     */
    updateColumnsWidth: function (side) {
      var me = this,
        w = me.widget,
        side = side || 'center',
        header = w.getHeader(side),
        columns = w.getColumns(side),
        i = 0,
        iL = columns.length;

      for (; i < iL; i++) {
        var column = columns[i];

        me.setColumnWidth(i, column.width, side);
      }

      header.setCellsPosition();
    },
    /*
     * @param {Number} index
     * @param {Number} width
     * @param {String} side
     */
    setColumnWidth: function (index, width, side) {
      var me = this,
        w = me.widget,
        columns = w.getColumns(side),
        header = w.getHeader(side),
        body = w.getBody(side),
        columnEl = G(body.getDomColumn(index)),
        headerCellEl = header.getCell(index),
        nextHeaderCellEl,
        nextColumnEl,
        left = parseInt(columnEl.css('left'));

      columnEl.css('width', width);
      headerCellEl.css('width', width);

      if (columns[index + 1]) {
        left += width;

        nextColumnEl = G(body.getDomColumn(index + 1));
        nextColumnEl.css('left', left);

        nextHeaderCellEl = header.getCell(index + 1);
        nextHeaderCellEl.css('left', left);
      }
    }
  });

})();
/*
 * @class Fancy.grid.plugin.ColumnDrag
 * @extend Fancy.Plugin
 */
(function () {
  //SHORTCUTS
  var F = Fancy;
  var DOC = F.get(document);

  //CONSTANTS
  var HIDDEN_CLS = F.HIDDEN_CLS;
  var GRID_HEADER_CELL_CLS = F.GRID_HEADER_CELL_CLS;
  var GRID_HEADER_CELL_TRIGGER_CLS = F.GRID_HEADER_CELL_TRIGGER_CLS;
  var GRID_HEADER_CELL_GROUP_LEVEL_1_CLS = F.GRID_HEADER_CELL_GROUP_LEVEL_1_CLS;
  var GRID_HEADER_CELL_GROUP_LEVEL_2_CLS = F.GRID_HEADER_CELL_GROUP_LEVEL_2_CLS;

  F.define('Fancy.grid.plugin.ColumnDrag', {
    extend: F.Plugin,
    ptype: 'grid.columndrag',
    inWidgetName: 'columndrag',
    activeSide: undefined,
    activeCell: undefined,
    activeIndex: undefined,
    activeColumn: undefined,
    inCell: undefined,
    inIndex: undefined,
    inSide: undefined,
    ok: false,
    status: 'none', //none/dragging
    /*
     * @param {Object} config
     */
    constructor: function (config) {
      this.Super('const', arguments);
    },
    /*
     *
     */
    init: function () {
      var me = this,
        w = me.widget;

      me.Super('init', arguments);

      w.on('render', function(){
        me.ons();
        me.initHint();
      });
    },
    /*
     *
     */
    ons: function () {
      var me = this,
        w = me.widget;

      w.el.on('mousedown', me.onMouseDownCell, me, 'div.' + GRID_HEADER_CELL_CLS);
    },
    onMouseDownCell: function (e) {
      var me = this,
        w = me.widget,
        cell = Fancy.get(e.currentTarget),
        index = Number(cell.attr('index')),
        side = me.getSideByCell(cell),
        columns = w.getColumns(side),
        column = columns[index];

      if(cell.hasCls(GRID_HEADER_CELL_GROUP_LEVEL_2_CLS)){
        //TODO: write realization
        //me.activeCellTopGroup = me.getGroupStartEnd(cell, side);
        return;
      }

      if(w.startResizing){
        return;
      }

      if(!me.activeCellTopGroup && column.draggable === false){
        return;
      }

      if(cell.hasCls(GRID_HEADER_CELL_GROUP_LEVEL_1_CLS)){
        me.activeUnderGroup = true;
      }

      me.activeSide = side;
      me.inSide = side;
      me.activeCell = cell;
      me.inCell = cell;
      me.activeIndex = Number(cell.attr('index'));
      me.inIndex = me.activeIndex;
      me.activeColumn = columns[me.activeIndex];

      me.mouseDownX = e.x;
      me.mouseDownY = e.y;

      DOC.once('mouseup', me.onMouseUp, me);
      DOC.on('mousemove', me.onMouseMove, me);

      w.el.on('mouseleave', me.onMouseLeave, me);
      w.el.on('mouseenter', me.onMouseEnterCell, me, 'div.' + GRID_HEADER_CELL_CLS);
      w.el.on('mousemove', me.onMouseMoveCell, me, 'div.' + GRID_HEADER_CELL_CLS);
    },
    onMouseLeave: function () {
      this.hideHint();
    },
    onMouseUp: function () {
      var me = this,
        w = me.widget,
        dragged = false;

      DOC.un('mousemove', me.onMouseMove, me);

      w.el.un('mouseleave', me.onMouseLeave, me);
      w.el.un('mouseenter', me.onMouseEnterCell, me, 'div.' + GRID_HEADER_CELL_CLS);
      w.el.un('mousemove', me.onMouseMoveCell, me, 'div.' + GRID_HEADER_CELL_CLS);

      if(me.ok){
        if(me.inSide === me.activeSide){
          me.dragColumn(me.inSide);
        }
        else if(me.activeSide === 'center'){
          var inIndex = me.inIndex;
          if(me.okPosition === 'right'){
            inIndex++;
          }
          w.moveColumn(me.activeSide, me.inSide, me.activeIndex, inIndex);
        }
        else{
          var inIndex = me.inIndex;
          if(me.okPosition === 'right'){
            inIndex++;
          }
          w.moveColumn(me.activeSide, me.inSide, me.activeIndex, inIndex);
        }

        dragged = true;
      }

      delete me.inUpGroupCell;
      delete me.inUnderGroup;
      delete me.activeCellTopGroup;
      delete me.activeUnderGroup;
      delete me.activeSide;
      delete me.activeCell;
      delete me.activeIndex;
      delete me.activeIndex;
      delete me.activeColumn;
      delete me.mouseDownX;
      delete me.mouseDownY;
      me.ok = false;
      delete me.okPosition;

      if(me.tip){
        me.tip.destroy();
        delete me.tip;
      }

      if(me.status === 'dragging'){
        setTimeout(function () {
          me.status = 'none';
          if(dragged) {
            w.fire('columndrag');
            w.scroller.update();
          }
        }, 10);
      }

      me.hideHint();
    },
    onMouseMove: function (e) {
      var me = this,
        w = me.widget,
        x = e.x,
        y = e.y,
        columns = w.getColumns(me.activeSide);

      if((Math.abs(x - me.mouseDownX) > 10 || Math.abs(y - me.mouseDownY)) && !me.tip){
        me.tip = new Fancy.ToolTip({
          text: me.activeColumn.title,
          cls: 'fancy-drag-cell'
        });

        me.tip.el.css('display', 'block');
      }
      else if(!me.tip){
        return;
      }

      if(columns.length === 1 && me.activeSide === 'center'){
        me.tip.destroy();
        return;
      }

      me.tip.show(e.pageX + 15, e.pageY + 15);
    },
    onMouseEnterCell: function(e){
      var me = this,
        cell = Fancy.get(e.currentTarget),
        side = me.getSideByCell(cell);

      me.hideHint();

      if(cell.hasCls(GRID_HEADER_CELL_GROUP_LEVEL_1_CLS)){
        me.inUnderGroup = true;
      }
      else{
        delete me.inUnderGroup;
      }

      if(cell.hasCls(GRID_HEADER_CELL_GROUP_LEVEL_2_CLS)){
        me.inUpGroupCell = cell;
      }
      else{
        delete me.inUpGroupCell;
      }

      me.inSide = side;
      me.inCell = cell;
      me.inIndex = Number(cell.attr('index'));
    },
    onMouseMoveCell: function(e){
      var me = this,
        w = me.widget,
        cell = me.inCell,
        cellWidth = parseInt(cell.css('width')),
        triggerEl = cell.select('.' + GRID_HEADER_CELL_TRIGGER_CLS),
        targetEl = Fancy.get(e.target),
        inTriggerEl = triggerEl.within(targetEl) || targetEl.hasClass(GRID_HEADER_CELL_TRIGGER_CLS),
        fromGroup = me.activeUnderGroup !== me.inUnderGroup && me.inUnderGroup === true,
        toGroup = me.activeUnderGroup !== me.inUnderGroup && me.activeUnderGroup === true;

      me.status = 'dragging';

      var columns = w.getColumns(me.activeSide);
      if(columns.length === 1 && me.activeSide === 'center'){
        me.ok = false;
        me.hideHint();
        return;
      }

      if(me.inUpGroupCell){
        var o = me.getGroupStartEnd(),
          startIndex = o.start,
          endIndex = o.end;

        if(me.activeSide !== me.inSide){
          me.ok = true;
          if(e.offsetX > cellWidth/2 || inTriggerEl){
            me.showHint('right');
          }
          else{
            me.showHint('left');
          }
        }
        else{
          if (e.offsetX > cellWidth / 2) {
            if(me.activeIndex > endIndex && me.activeIndex - 1 === endIndex){
              me.hideHint();
            }
            else {
              me.ok = true;
              me.showHint('right');
            }
          }
          else {
            if(me.activeIndex < startIndex && me.activeIndex + 1 === startIndex){
              me.hideHint();
            }
            else {
              me.ok = true;
              me.showHint('left');
            }
          }
        }
      }
      else if(me.activeSide !== me.inSide){
        me.ok = true;
        if(e.offsetX > cellWidth/2 || inTriggerEl){
          me.showHint('right');
        }
        else{
          me.showHint('left');
        }
      }
      else if(me.activeIndex === me.inIndex){
        me.ok = false;
      }
      else if(me.activeIndex < me.inIndex){
        if(e.offsetX > cellWidth/2 || inTriggerEl){
          me.ok = true;
          me.showHint('right');
        }
        else{
          if(e.offsetX < cellWidth/2 && (me.activeIndex + 1) !== me.inIndex){
            me.ok = true;
            me.showHint('left');
          }
          else {
            if(me.activeIndex + 1 === me.inIndex && (fromGroup || toGroup) ){
              me.ok = true;
              me.showHint('left');
            }
            else{
              me.ok = false;
              me.hideHint();
            }
          }
        }
      }
      else if(me.activeIndex > me.inIndex){
        if(e.offsetX < cellWidth/2){
          if(inTriggerEl){
            if(fromGroup || toGroup){
              me.ok = true;
              me.showHint('right');
            }
            else if(me.activeIndex - 1 === me.inIndex || me.inUpGroupCell) {
              me.ok = false;
              me.hideHint();
            }
            else{
              me.ok = true;
              me.showHint('right');
            }
          }
          else {
            me.ok = true;
            me.showHint('left');
          }
        }
        else{
          if(e.offsetX > cellWidth/2){
            if((me.activeIndex - 1) === me.inIndex && (fromGroup || toGroup)){
              me.ok = true;
              me.showHint('right');
            }
            else{
              if((me.activeIndex - 1) !== me.inIndex || me.activeUnderGroup){
                me.ok = true;
                me.showHint('right');
              }
              else{
                me.ok = false;
                me.hideHint();
              }
            }
          }
          else {
            me.ok = false;
            me.hideHint();
          }
        }
      }
    },
    showHint: function(position){
      var me = this,
        w = me.widget,
        CELL_HEADER_HEIGHT = w.cellHeaderHeight,
        cell = me.inCell,
        topEl = me.topEl,
        bottomEl = me.bottomEl,
        o = cell.offset(),
        cellWidth = parseInt(cell.css('width')),
        cellHeight = parseInt(cell.css('height'));

      me.okPosition = position;

      topEl.removeCls(HIDDEN_CLS);
      bottomEl.removeCls(HIDDEN_CLS);

      var plusWidth = 0;

      if(position === 'right'){
        plusWidth += cellWidth;
      }

      topEl.css({
        left: o.left + plusWidth - Math.ceil(parseInt(topEl.css('width'))/2),
        top: o.top - parseInt(topEl.css('height'))
      });

      var bottomTop = o.top + cellHeight;

      if(me.inUpGroupCell){
        var rows = w.header.calcRows();
        bottomTop = o.top + rows * CELL_HEADER_HEIGHT;
      }

      bottomEl.css({
        left: o.left + plusWidth - Math.ceil(parseInt(bottomEl.css('width'))/2),
        top: bottomTop
      });
    },
    hideHint: function(){
      var me = this;

      me.topEl.addCls(HIDDEN_CLS);
      me.bottomEl.addCls(HIDDEN_CLS);
    },
    initHint: function(){
      var me = this,
        w = me.widget,
        themeCls = 'fancy-theme-' + w.theme,
        renderTo = F.get(document.body).dom,
        topEl = F.get(document.createElement('div')),
        bottomEl = F.get(document.createElement('div'));

      topEl.addCls('fancy-drag-hint-top', HIDDEN_CLS, themeCls);
      bottomEl.addCls('fancy-drag-hint-bottom', HIDDEN_CLS, themeCls);

      me.topEl = F.get(renderTo.appendChild(topEl.dom));
      me.bottomEl = F.get(renderTo.appendChild(bottomEl.dom));
    },
    /*
     * @param {String} side
     */
    dragColumn: function (side) {
      var me = this,
        w = me.widget,
        header = w.getHeader(side),
        body = w.getBody(side),
        activeIndex = me.activeIndex,
        inIndex = me.inIndex,
        position = me.okPosition,
        columns = w.getColumns(side),
        column = columns[activeIndex],
        rows = header.calcRows();

      if(me.inUpGroupCell){
        var o = me.getGroupStartEnd();

        inIndex = o.start;

        if(position === 'right'){
          inIndex = o.end + 1;
        }
      }
      else if(position === 'right'){
        if(me.inUnderGroup){
          var groupName = columns[inIndex].grouping,
            nextColumn = columns[inIndex + 1];

          if(nextColumn && nextColumn.grouping === groupName){
            inIndex++;
          }
        }
        else {
          inIndex++;
        }
      }

      if(w.groupheader){
        var inColumn = columns[inIndex];

        if(inColumn && inColumn.grouping && me.inUnderGroup){
          column.grouping = inColumn.grouping;

          if(column.filter && column.filter.header && rows < 3){
            delete column.filter;
          }
        }
        else{
          delete column.grouping;
        }
      }

      columns.splice(activeIndex, 1);

      if(activeIndex<inIndex){
        inIndex--;
      }

      columns.splice(inIndex, 0, column);

      body.clearColumnsStyles();
      header.updateTitles();
      header.updateCellsSizes();
      if(w.groupheader){
        w.header.fixGroupHeaderSizing();
        if(w.leftColumns){
          w.leftHeader.fixGroupHeaderSizing();
        }

        if(w.rightColumns){
          w.rightHeader.fixGroupHeaderSizing();
        }

        header.reSetGroupIndexes();
      }

      header.reSetColumnsAlign();
      body.reSetColumnsAlign();
      body.reSetColumnsCls();
      body.updateColumnsSizes();
      w.update();
    },
    /*
     *
     */
    getSideByCell: function (cell) {
      var me = this,
        w = me.widget,
        side;

      if(w.centerEl.within(cell)){
        side = 'center';
      }
      else if(w.leftEl.within(cell)){
        side = 'left';
      }
      else if(w.rightEl.within(cell)){
        side = 'right';
      }

      return side;
    },
    /*
     * @param {Object} [cell]
     * @param {String} [side]
     * @return {Object}
     */
    getGroupStartEnd: function (cell, side) {
      var me = this,
        w = me.widget,
        header = w.getHeader(side || me.inSide),
        groupName = (cell || me.inUpGroupCell).attr('index'),
        inUpGroupCells = header.el.select('[group-index="' + groupName + '"]'),
        values = [];

      inUpGroupCells.each(function(cell){
        values.push(Number(cell.attr('index')));
      });

      return {
        start: F.Array.min(values),
        end: F.Array.max(values)
      };
    }
  });

})();
/*
 * @class Fancy.grid.plugin.ChartIntegration
 */
Fancy.define('Fancy.grid.plugin.ChartIntegration', {
  extend: Fancy.Plugin,
  ptype: 'grid.chartintegration',
  inWidgetName: 'chartintegration',
  /*
   * @constructor
   * @param {Object} config
   */
  constructor: function(config){
    this.Super('const', arguments);
  },
  /*
   *
   */
  init: function(){
    var me = this;

    me.Super('init', arguments);
    me.initKeys();
    me.initBind();

    me.ons();
  },
  /*
   *
   */
  initKeys: function(){
    var me = this,
      chart = me.chart,
      i = 0,
      iL = chart.length;

    for(;i<iL;i++){
      var _chart = chart[i],
        fields = _chart.fields,
        k = 0,
        kL,
        keys = {};

      if(Fancy.isString(fields)){
        keys = fields;
      }
      else {

        kL = fields.length;

        for (; k < kL; k++) {
          keys[fields[k]] = true;
        }
      }

      chart[i].keys = keys;
    }
  },
  /*
   *
   */
  ons: function(){
    var me = this,
      w = me.widget,
      s = w.store;

    w.once('render', function(){
      if(me.toChart){
        me.renderToChart();
      }
      else{
        me.readDataFromChart();
      }

      s.on('set', me.onSet, me);
      s.on('sort', me.onSort, me);
    });
  },
  /*
   *
   */
  renderToChart: function(){
    var me = this,
      w = me.widget,
      chart = me.chart,
      i = 0,
      iL = chart.length;

    for(;i<iL;i++){
      var _chart = chart[i],
        type = _chart.type;

      switch(type){
        case 'highchart':
        case 'highcharts':
          w.highchart.setData(_chart);
          break;
      }
    }
  },
  /*
   * @param {Object} store
   * @param {Object} o
   */
  onSet: function(store, o){
    var me = this,
      w = me.widget,
      chart = me.chart,
      i = 0,
      iL = chart.length,
      key = o.key;

    for(;i<iL;i++){
      var _chart = chart[i],
        type = _chart.type;

      if(_chart.keys[key] !== true){
        continue;
      }

      switch(type){
        case 'highchart':
        case 'highcharts':
          w.highchart.set(_chart, o);
          break;
      }
    }
  },
  /*
   * @param {Object} store
   * @param {Object} o
   */
  onSort: function(store, o){
    var me = this,
      w = me.widget,
      chart = me.chart,
      i = 0,
      iL = chart.length;

    for(;i<iL;i++){
      var _chart = chart[i],
        type = _chart.type;

      switch(type) {
        case 'highchart':
        case 'highcharts':
          if (_chart.sortBind !== false) {
            var categories = w.highchart.sort(_chart, o);
            chart[i].categories = categories.original;
          }
          break;
      }
    }
  },
  /*
   *
   */
  readDataFromChart: function(){
    var me = this,
      w = me.widget,
      s = w.store,
      chart = me.chart,
      _chart = chart[0],
      type = _chart.type,
      data;

    switch(type){
      case 'highchart':
      case 'highcharts':
        data = w.highchart.getData(_chart);
        break;
    }

    w.reConfigStore(data);
    s.setData(data);
  },
  /*
   *
   */
  initBind: function(){
    var me = this,
      chart = me.chart,
      _chart,
      i = 0,
      iL = chart.length;

    for(;i<iL;i++){
      _chart = chart[i];

      if(_chart.bind){
        me.chartBind(_chart);
      }
    }
  },
  /*
   * @param {Object} chart
   */
  chartBind: function(chart){
    var me = this,
      w = me.widget,
      bind = chart.bind;

    w.on(bind.event, me.onBindEvent, {
      chart: chart
    });
  },
  /*
   * @param {Fancy.Grid} grid
   * @param {Object} o
   */
  onBindEvent: function(grid, o){
    var me = this,
      w = grid,
      chart = me.chart,
      bind = chart.bind,
      series = bind.series,
      data = o.data,
      id = chart.id;

    switch(bind.action){
      case 'add':
        var existedSeries = w.highchart.doesSeriesExist(id, data[series.name]),
          seriesNumber = w.highchart.getNumberSeries(id);

        if(existedSeries !== false && seriesNumber !== 1){
          w.highchart.removeSeries(id, existedSeries);
          return;
        }

        if(chart.maxToShow){
          if(chart.maxToShow <= seriesNumber){
            w.highchart.removeLastSeries(id);
          }
        }

        if(w.highchart.isTreeMap(id)){
          w.highchart.setSeriesData(id, {
            data: data[series.data]
          });
        }
        else {
          w.highchart.addSeries(id, {
            name: data[series.name],
            data: data[series.data]
          });
        }
        break;
    }
  }
});
/*
 * @class Fancy.grid.plugin.HighChart
 */
Fancy.define('Fancy.grid.plugin.HighChart', {
  extend: Fancy.Plugin,
  ptype: 'grid.highchart',
  inWidgetName: 'highchart',
  /*
   * @constructor
   * @param {Object} config
   */
  constructor: function(config){
    this.Super('const', arguments);
  },
  /*
   *
   */
  init: function(){
    this.Super('init', arguments);
    this.ons();
  },
  /*
   *
   */
  ons: function(){},
  /*
   * @param {Object} chartConfig
   */
  setData: function(chartConfig){
    var me = this,
      w = me.widget,
      s = w.store,
      data = s.getDataView(),
      fields = chartConfig.fields,
      j = 0,
      jL = data.length,
      i = 0,
      iL = fields.length,
      chart = me.getChart(chartConfig.id),
      series = chart.series,
      read = chartConfig.read;

    if(read){
      if(read.rowIndex !== undefined){
        data = [data[read.rowIndex]];
        iL = 1;
      }
    }

    if(Fancy.isString(fields)){
      for (; i < iL; i++) {
        var indexData = data[i][fields],
          sery = series[i],
          seryData = [],
          j = 0,
          jL = indexData.length;

        if(chartConfig.names){
          for (; j < jL; j++) {
            var seryConfig = {
              name: chartConfig.names[j],
              value: indexData[j]
            };

            seryData.push(seryConfig);
          }
        }
        else {
          for (; j < jL; j++) {
            seryData.push(indexData[j]);
          }
        }

        if(sery) {
          sery.setData(seryData);

          if(chartConfig.name){
            sery.update({
              name: data[i][chartConfig.name]
            });
          }
        }
        else{
          break;
        }
      }
    }
    else {
      for (; i < iL; i++) {
        var fieldName = fields[i],
          sery = series[i],
          seryData = [];

        j = 0;
        for (; j < jL; j++) {
          seryData.push(data[j][fieldName]);
        }

        sery.setData(seryData);
      }
    }
  },
  /*
   * @param {String} id
   * @param {Array} data
   */
  setSeriesData: function(id, data){
    var chart = this.getChart(chartConfig.id),
      sery = chart.series[0];

    sery.setData(data.data);
  },
  /*
   * @param {Object} chartConfig
   * @param {Object} o
   */
  set: function(chartConfig, o){
    var fieldsMap = this.getFieldsMap(chartConfig),
      _chart = this.getChart(chartConfig.id),
      series = _chart.series,
      sery;

    sery = series[fieldsMap[o.key]];
    sery.data[o.rowIndex].update(Number(o.value));
  },
  /*
   * @param {Object} chartConfig
   * @return {Object}
   */
  sort: function(chartConfig){
    var me = this,
      w = me.widget,
      s = w.store,
      _chart = me.getChart(chartConfig.id),
      categories = chartConfig.categories?chartConfig.categories : _chart.xAxis[0].categories,
      order = s.order,
      newCategories = [],
      i = 0,
      iL = order.length;

    for(;i<iL;i++){
      newCategories.push(categories[order[i]]);
    }
    _chart.xAxis[0].update({categories: newCategories}, true);

    me.update(chartConfig);

    return {
      original: categories,
      newCategories: newCategories
    };
  },
  /*
   * @param {Object} chartConfig
   */
  update: function(chartConfig){
    var me = this,
      w = me.widget,
      s = w.store,
      data = s.getDataView(),
      fields = chartConfig.fields,
      j = 0,
      jL = data.length,
      i = 0,
      iL,
      chart = me.getChart(chartConfig.id),
      series = chart.series,
      _data = [],
      k = 0,
      kL = fields.length;

    for(;k<kL;k++){
      var fieldName = fields[k];
      j = 0;
      var row = [];
      for(;j<jL;j++){

        row.push(data[j][fieldName]);
      }

      _data.push(row);
    }

    iL = series.length;
    for(;i<iL;i++){
      var sery = series[i];

      sery.setData(_data[i], false);
    }

    chart.redraw();
  },
  /*
   * @param {Object} chartConfig
   * @return {Array}
   */
  getData: function(chartConfig){
    var me = this,
      chart = me.getChart(chartConfig.id),
      fields =  fields = chartConfig.fields,
      i = 0,
      iL = fields.length,
      series = chart.series,
      jL = series[0].data.length,
      data = [];

    for(;i<iL;i++){
      var fieldName = fields[i],
        j = 0,
        sery = series[i];

      for(;j<jL;j++){
        if( data[j] === undefined ){
          data[j] = {};
        }

        data[j][fieldName] = sery.data[j].y;
      }
    }

    var indexes = me.getColumnsChartIndexes();
    i = 0;
    iL = indexes.length;

    for(;i<iL;i++){
      var index = indexes[i],
        splited = index.split('.'),
        values = chart[splited[0]][0][splited[1]];

      j = 0;
      jL = values.length;

      for(;j<jL;j++){
        data[j][index] = values[j];
      }
    }

    return data;
  },
  /*
   * @return {Array}
   */
  getColumnsChartIndexes: function(){
    var w = this.widget,
      indexes = [],
      columns = w.columns,
      i = 0,
      iL = columns.length;

    for(;i<iL;i++){
      var index = columns[i].index;

      if(/xAxis\../.test(index)){
        indexes.push(index)
      }
    }

    return indexes;
  },
  /*
   * @param {Object} chartConfig
   * @return {Object}
   */
  getFieldsMap: function(chartConfig){
    var fieldsMap = {},
      fields = chartConfig.fields,
      j = 0,
      jL = fields.length;

    for(;j<jL;j++){
      fieldsMap[fields[j]] = j;
    }

    return fieldsMap;
  },
  /*
   * @param {String} id
   * @param {Object} o
   */
  addSeries: function(id, o){
    var chart = this.getChart(id);

    chart.addSeries(o);
  },
  /*
   * @param {String} id
   * @return {Number}
   */
  getNumberSeries: function(id){
    var chart = this.getChart(id);

    return chart.series.length;
  },
  /*
   * @param {String} id
   */
  removeLastSeries: function(id){
    var chart = this.getChart(id);

    chart.series[chart.series.length - 1].remove();
  },
  /*
   * @param {String} id
   * @param {String} index
   */
  removeSeries: function(id, index){
    var chart = this.getChart(id);

    chart.series[index].remove();
  },
  /*
   * @param {String} id
   * @param {String} name
   * @return {false|Number}
   */
  doesSeriesExist: function(id, name){
    var me= this,
      chart = me.getChart(id),
      i = 0,
      iL = chart.series.length;

    for(;i<iL;i++){
      if( chart.series[i].name === name ){
        return i;
      }
    }

    return false;
  },
  /*
   * @param {String} id
   * @return {Boolean}
   */
  isTreeMap: function(id){
    var chart = this.getChart(id);

    if( chart.series[0] === undefined ){
      return false;
    }

    return chart.series[0].type === 'treemap';
  },
  /*
   * @param {String} id
   * @return {Object}
   */
  getChart: function(id){
    var charts = Highcharts.charts,
      chosenChart;

    charts.forEach(function(chart, index){
      if(chart.renderTo.id === id){
        chosenChart = chart;
      }
    });

    return chosenChart;
  }
});
/*
 * @class Fancy.grid.plugin.Edit
 */
Fancy.define('Fancy.grid.plugin.Edit', {
  extend: Fancy.Plugin,
  ptype: 'grid.edit',
  inWidgetName: 'edit',
  clicksToEdit: 2,
  tabColumnsSupport: {
    date: true,
    combo: true,
    image: true,
    number: true,
    string: true,
    text: true
  },
  /*
   * @constructor
   * @param {Object} config
   */
  constructor: function(config){
    this.Super('const', arguments);
  },
  /*
   *
   */
  init: function(){
    var me = this,
      w = me.widget,
      s = w.store;

    me.addEvents('tab');

    me.Super('init', arguments);

    w.once('render', function(){
      me.ons();
      s.on('beforeupdate', me.onStoreCRUDBeforeUpdate, me);
      s.on('update', me.onStoreCRUDUpdate, me);

      s.on('beforedestroy', me.onStoreCRUDBeforeDestroy, me);
      s.on('destroy', me.onStoreCRUDDestroy, me);
      s.on('create', me.onCreate, me);
    });
  },
  /*
   *
   */
  ons: function(){
    var me = this,
      w = me.widget,
      s = w.store,
      clickEventName = 'cell' + me.getClickEventName();

    w.on('cellclick', me.onClickCell, me);
    s.on('set', me.onStoreSet, me);
    me.on('tab', me.onTab, me);

    w.once('init', function(){
      w.on(clickEventName, me.onClickCellToEdit, me);
    });

    w.on('activate', me.onGridActivate, me);
    w.on('deactivate', me.onGridDeActivate, me);
  },
  /*
   *
   */
  onGridActivate: function(){
    Fancy.get(document).on('keydown', this.onKeyDown, this);
  },
  /*
   *
   */
  onGridDeActivate: function(){
    Fancy.get(document).un('keydown', this.onKeyDown, this);
  },
  /*
   * @param {Object} e
   */
  onKeyDown: function(e){
    var keyCode = e.keyCode,
      key = Fancy.key;

    switch(keyCode) {
      case key.TAB:
        this.fire('tab', e);
        break;
    }
  },
  /*
   * @param {Object} me
   * @param {Object} e
   */
  onTab: function(me, e){
    var me = this,
      w = me.widget,
      activeParams = me.activeCellEditParams;

    if(!activeParams){
      return;
    }

    e.preventDefault();

    var params = me.getNextCellEditParam();

    if(w.celledit) {
      w.celledit.hideEditor();
      if (w.tabEdit !== false) {
        setTimeout(function () {
          w.celledit.edit(params);
        }, 100);
      }
    }
  },
  /*
   * @return {Object}
   */
  getNextCellEditParam: function(){
    var me = this,
      w = me.widget,
      s = w.store,
      activeParams = me.activeCellEditParams,
      leftColumns = w.leftColumns;

    var columnIndex = activeParams.columnIndex,
      rowIndex = activeParams.rowIndex,
      side = activeParams.side,
      body,
      columns = w.getColumns(side),
      nextColumn = columns[columnIndex + 1],
      nextCell,
      key,
      id;

    var i = 0,
      maxRecursion = 20;

    for(;i<maxRecursion;i++){
      var cellInfo = me.getNextCellInfo({
        side: side,
        columnIndex: columnIndex,
        rowIndex: rowIndex
      });

      side = cellInfo.side;
      columnIndex = cellInfo.columnIndex;
      rowIndex = cellInfo.rowIndex;
      columns = w.getColumns(side);
      nextColumn = columns[cellInfo.columnIndex];

      if(me.tabColumnsSupport[nextColumn.type] && nextColumn.editable === true){
        break;
      }
    }

    body = w.getBody(side);
    nextCell = body.getCell(rowIndex, columnIndex).dom;
    if(!nextCell){
      side = 'center';
      if(leftColumns.length){
        side = 'left';
      }

      rowIndex = 0;
      columnIndex = 0;

      body = w.getBody(side);
      nextCell = body.getCell(rowIndex, columnIndex).dom;
    }

    //TODO: function that get next editable cell(checkbox does not suit)
    //maybe in future to learn how other frameworks does it and checkbox also to add.

    key = nextColumn.index || nextColumn.key;
    id = s.getId(rowIndex);

    return {
      id: s.getId(rowIndex),
      side: side,
      column: nextColumn,
      cell: nextCell,
      columnIndex: columnIndex,
      rowIndex: rowIndex,
      value: s.get(rowIndex, key),
      data: s.get(rowIndex),
      item: s.getById(id)
    };
  },
  /*
   * @param {Object} o
   * @return {Object}
   */
  getNextCellInfo: function(o){
    var me = this,
      w = me.widget,
      side = o.side,
      columns = w.getColumns(side),
      columnIndex = o.columnIndex,
      rowIndex = o.rowIndex,
      nextColumn = columns[columnIndex + 1],
      rightColumns = w.rightColumns,
      leftColumns = w.leftColumns;

    if(nextColumn){
      columnIndex++;
    }
    else{
      switch(side){
        case 'left':
          side = 'center';
          columnIndex = 0;
          break;
        case 'center':
          if(rightColumns.length){
            side = 'right';
            columnIndex = 0;
          }
          else if(leftColumns.length){
            side = 'left';
            columnIndex = 0;
            rowIndex++;
          }
          else{
            columnIndex = 0;
            rowIndex++;
          }
          break;
        case 'right':
          if(leftColumns.length){
            side = 'left';
            columnIndex = 0;
            rowIndex++;
          }
          else{
            side = 'center';
            columnIndex = 0;
            rowIndex++;
          }
          break;
      }
    }

    return {
      side: side,
      rowIndex: rowIndex,
      columnIndex: columnIndex
    }
  },
  /*
   * @return {String}
   */
  getClickEventName: function(){
    switch(this.clicksToEdit){
      case 1:
        return 'click';
      case 2:
        return 'dblclick';
    }
  },
  /*
   *
   */
  stopEditor: function(){
    this.stopped = true;
  },
  /*
   * @param {Fancy.Grid} grid
   * @param {Object} o
   */
  onClickCell: function(grid, o){
    var w = this.widget,
      column = o.column;

    if(column.editable && column.type === 'checkbox' && w.celledit){
      w.celledit.onCheckBoxChange(o);
    }
  },
  /*
   * @param {Fancy.Grid} grid
   * @param {Object} o
   */
  onClickCellToEdit: function(grid, o){
    var me = this,
      w = me.widget,
      column = o.column;

    if(w.rowedit){}
    else if(w.celledit){
      w.celledit.hideEditor();
    }

    me.fire('beforedit');

    if(me.stopped === true){
      me.stopped = false;
      return;
    }

    if(w.rowedit){
      w.rowedit.edit(o);
    }
    else if(column.editable && column.type !== 'checkbox' && w.celledit){
      w.celledit.edit(o);
    }
  },
  /*
   * @param {Fancy.Store} store
   * @param {Object} o
   */
  onStoreSet: function(store, o){
    this.widget.updater.updateRow(o.rowIndex);
  },
  /*
   *
   */
  onStoreCRUDBeforeUpdate: function(){
    var me = this,
      w = me.widget,
      o = me.activeCellEditParams;

    if(!o){
      return;
    }

    w.updater.updateRow(o.rowIndex);
  },
  /*
   * @param {Fancy.Store} store
   * @param {String|Number} id
   * @param {String} key
   * @param {*} value
   */
  onStoreCRUDUpdate: function(store, id, key, value){
    delete store.changed[id];

    this.clearDirty();
  },
  /*
   *
   */
  onStoreCRUDBeforeDestroy: function(){},
  /*
   *
   */
  onStoreCRUDDestroy: function(){
    this.widget.store.loadData();
    this.clearDirty();
  },
  /*
   *
   */
  clearDirty: function(){
    var w = this.widget;

    setTimeout(function() {
      w.leftBody.clearDirty();
      w.body.clearDirty();
      w.rightBody.clearDirty();
    }, 500);
  },
  /*
   * @param {Object} store
   * @param {Array} data
   */
  onCreate: function(store, data){
    this.widget.updater.update();
    this.clearDirty();
  }
});
/*
 * @class Fancy.grid.plugin.CellEdit
 * @extends Fancy.Plugin
 */
(function () {
  //SHORTCUTS
  var F = Fancy;
  var D = F.Date;

  //CONSTANTS
  var GRID_CELL_CLS = F.GRID_CELL_CLS;

  F.define('Fancy.grid.plugin.CellEdit', {
    extend: F.Plugin,
    ptype: 'grid.celledit',
    inWidgetName: 'celledit',
    editorsCls: 'fancy-grid-editors',
    /*
     * @constructor
     * @param {Object} config
     */
    constructor: function (config) {
      this.Super('const', arguments);
    },
    /*
     *
     */
    init: function () {
      this.Super('init', arguments);
      this.ons();
    },
    /*
     *
     */
    ons: function () {
      var me = this,
        w = me.widget;

      w.once('render', function () {
        me.initEditorContainer();
        me.checkAutoInitEditors();
        w.on('scroll', me.onScroll, me);
        w.on('nativescroll', me.onNativeScroll, me);
        w.on('docclick', me.onDocClick, me);
        w.on('headercellmousedown', me.onHeaderCellMouseDown, me);
      });
    },
    /*
     * @param {Fancy.Grid} grid
     * @param {Object} e
     */
    onDocClick: function (grid, e) {
      var me = this,
        o = me.activeCellEditParams,
        editor = me.activeEditor,
        inCombo = true,
        target = e.target,
        targetEl = F.get(target);

      if (editor === undefined) {
        return;
      }
      else if (o.column.type === 'date') {
        return;
      }
      else if (o.column.type === 'combo') {
      }
      else {
        var cellEl = targetEl.closest('.' + GRID_CELL_CLS);

        if (!cellEl.dom && !editor.el.within(target)) {
          editor.hide();
        }
        return;
      }

      if (editor.el.within(target) === false && editor.list.within(target) === false && me.comboClick !== true) {
        inCombo = false;
      }

      if (inCombo === false) {
        editor.hide();
      }

      me.comboClick = false;
    },
    /*
     *
     */
    initEditorContainer: function () {
      var me = this,
        w = me.widget;

      me.editorsContainer = w.el.select('.' + me.editorsCls);
    },
    /*
     * @param {Object} o
     */
    edit: function (o) {
      var me = this,
        w = me.widget,
        column = o.column;

      if (column.index === '$selected') {
        return;
      }

      me.activeCellEditParams = o;
      w.edit.activeCellEditParams = o;

      column.editor = me.generateEditor(column);

      //me.hideEditor();
      w.scroller.scrollToCell(o.cell);
      me.showEditor(o);
    },
    /*
     * @param {Object} column
     * @return {Object}
     */
    generateEditor: function (column) {
      var me = this,
        w = me.widget,
        style = {
          position: 'absolute',
          left: '0px',
          top: '0px',
          display: 'none',
          padding: '0px'
        },
        type = column.type,
        editor,
        vtype = column.vtype,
        renderTo,
        theme = w.theme;

      if (column.editor) {
        return column.editor;
      }

      renderTo = me.editorsContainer.dom;

      var itemConfig = {
        renderTo: renderTo,
        label: false,
        style: style,
        checkValidOnTyping: true
      };

      switch (type) {
        case 'combo':
          var displayKey = 'text',
            valueKey = 'text',
            data = column.data,
            events = [{
              change: me.onComboChange,
              scope: me
            }];

          if (column.editorEvents) {
            var i = 0,
              iL = column.editorEvents.length;

            for (; i < iL; i++) {
              events.push(column.editorEvents[i]);
            }
          }

          if (column.displayKey !== undefined) {
            displayKey = column.displayKey;
            valueKey = displayKey;
          }

          if (theme === 'default') {
            theme = undefined;
          }

          editor = new F.Combo({
            theme: theme,
            renderTo: renderTo,
            label: false,
            style: style,
            data: data,
            displayKey: displayKey,
            valueKey: valueKey,
            value: 0,
            padding: false,
            vtype: vtype,
            events: events,
            checkValidOnTyping: true
          });
          break;
        case 'text':
          editor = new F.TextArea({
            renderTo: renderTo,
            label: false,
            style: style,
            vtype: vtype,
            checkValidOnTyping: true,
            events: [{
              enter: me.onEditorEnter,
              scope: me
            }, {
              beforehide: me.onEditorBeforeHide,
              scope: me
            }, {
              blur: me.onBlur,
              scope: me
            }]
          });
          break;
        case 'image':
        case 'string':
        case 'color':
          editor = new F.StringField({
            renderTo: renderTo,
            label: false,
            style: style,
            vtype: vtype,
            format: column.format,
            checkValidOnTyping: true,
            events: [{
              enter: me.onEditorEnter,
              scope: me
            }, {
              beforehide: me.onEditorBeforeHide,
              scope: me
            }, {
              blur: me.onBlur,
              scope: me
            }]
          });
          break;
        case 'number':
        case 'currency':
          F.apply(itemConfig, {
            vtype: vtype,
            format: column.format,
            events: [{
              enter: me.onEditorEnter,
              scope: me
            }, {
              beforehide: me.onEditorBeforeHide,
              scope: me
            }, {
              blur: me.onBlur,
              scope: me
            }]
          });

          if (column.spin !== undefined) {
            itemConfig.spin = column.spin;
          }

          if (column.step !== undefined) {
            itemConfig.step = column.step;
          }

          if (column.min !== undefined) {
            itemConfig.min = column.min;
          }

          if (column.max !== undefined) {
            itemConfig.max = column.max;
          }

          editor = new F.NumberField(itemConfig);
          break;
        case 'date':
          editor = new F.DateField({
            renderTo: renderTo,
            label: false,
            style: style,
            format: column.format,
            lang: w.lang,
            vtype: vtype,
            theme: theme,
            checkValidOnTyping: true,
            events: [{
              enter: me.onEditorEnter,
              scope: me
            }, {
              beforehide: me.onEditorBeforeHide,
              scope: me
            }, {
              blur: me.onBlur,
              scope: me
            }]
          });

          break;
        default:
          throw new Error('[FancyGrid error] - type ' + type + ' editor does not exit');
      }

      return editor;
    },
    /*
     * @param {Object} o
     */
    showEditor: function (o) {
      var me = this,
        w = me.widget,
        column = o.column,
        type = column.type,
        //editor = me[type + 'Editor'],
        editor = column.editor,
        cell = o.cell,
        cellXY = me.getCellPosition(cell),
        cellSize = me.getCellSize(cell);

      if (type === 'combo') {
        me.comboClick = true;
      }

      me.activeEditor = editor;
      me.setEditorValue(o);
      me.setEditorSize(cellSize);
      editor.show();
      editor.el.css(cellXY);

      editor.focus();

      if (type === 'combo') {
        if (o.value !== undefined) {
          editor.set(o.value, false);
        }
      }

      w.fire('startedit', o);
    },
    /*
     * @param {Number} side
     */
    setEditorSize: function (size) {
      var me = this;

      if (me.activeEditor.wtype === 'field.combo') {
        me.activeEditor.size(size);
      }
      else {
        me.activeEditor.setInputSize({
          width: size.width,
          height: size.height
        });
      }
    },
    /*
     *
     */
    hideEditor: function () {
      var me = this,
        w = me.widget,
        s = w.store,
        key,
        value,
        o = me.activeCellEditParams,
        editor = me.activeEditor,
        column;

      if (editor) {
        column = o.column;
        value = editor.get();

        if (s.proxyType === 'server' && column.type !== 'combo') {
          key = me.getActiveColumnKey();
          value = me.prepareValue(value);

          s.set(o.rowIndex, key, value);
        }

        editor.hide();
        editor.hideErrorTip();
      }

      delete me.activeEditor;

      //Bug fix: when editor is out of side, grid el scrolls
      if (w.el.dom.scrollTop) {
        w.el.dom.scrollTop = 0;
      }
    },
    /*
     * @param {Fancy.Element} cell
     * @return {Object}
     */
    getCellPosition: function (cell) {
      var me = this,
        w = me.widget,
        gridBorders = w.gridBorders,
        cellEl = F.get(cell),
        cellOffset = cellEl.offset(),
        gridOffset = w.el.offset(),
        offset = {
          left: parseInt(cellOffset.left) - parseInt(gridOffset.left) - 2 + 'px',
          top: parseInt(cellOffset.top) - parseInt(gridOffset.top) - (gridBorders[0] + gridBorders[2]) + 'px'
        };

      return offset;
    },
    /*
     * @param {Fancy.Element} cell
     * @return {Object}
     */
    getCellSize: function (cell) {
      var me = this,
        w = me.widget,
        cellEl = F.get(cell),
        width = cellEl.width(),
        height = cellEl.height(),
        coeficient = 2;

      if (F.nojQuery && w.panelBorderWidth === 2) {
        coeficient = 1;
      }

      width += parseInt(cellEl.css('border-right-width')) * coeficient;
      height += parseInt(cellEl.css('border-bottom-width')) * coeficient;

      return {
        width: width,
        height: height
      };
    },
    /*
     * @param {Object} o
     */
    setEditorValue: function (o) {
      var me = this,
        editor = me.activeEditor;

      switch (o.column.type) {
        case 'combo':
          if (editor.valueIndex !== -1) {
            editor.set(editor.getValueKey(o.value), false);
          }
          break;
        case 'date':
          var format = o.column.format,
            date = D.parse(o.value, format.read, format.mode);

          editor.set(date);
          break;
        default:
          editor.set(o.value);
      }
    },
    /*
     * @param {Object} editor
     * @param {String} value
     */
    onEditorEnter: function (editor, value) {
      this.hideEditor();
    },
    /*
     *
     */
    onHeaderCellMouseDown: function () {
      this.hideEditor();
    },
    /*
     * @param {Object} editor
     * @param {String} value
     */
    onKey: function (editor, value) {
    },
    /*
     * @param {String} value
     */
    setValue: function (value) {
      var me = this,
        w = me.widget,
        s = w.store,
        key,
        o = me.activeCellEditParams,
        editor = me.activeEditor;

      if (editor === undefined) {
        return;
      }

      if (editor.isValid() === false) {
        return;
      }

      if (s.proxyType === 'server') {
        return;
      }

      key = me.getActiveColumnKey();

      value = me.prepareValue(value);

      if (editor.type === 'field.date' && editor.isEqual(s.get(o.rowIndex, key))) {
        return;
      }

      s.set(o.rowIndex, key, value);
    },
    /*
     * @param {Object} editor
     */
    onEditorBeforeHide: function (editor) {
      if (editor.isValid()) {
        this.setValue(editor.getValue());
      }
    },
    /*
     *
     */
    onScroll: function () {
      this.hideEditor();
    },
    /*
     *
     */
    onNativeScroll: function () {
      this.hideEditor();
    },
    /*
     * @param {Object} field
     */
    onBlur: function (field) {
      var me = this;

      if (!me.activeEditor || field.id === me.activeEditor.id) {
        if (field.mouseDownSpinUp === true || field.mouseDownSpinDown) {
          return;
        }

        me.hideEditor();
      }
    },
    /*
     * @param {*} value
     * @return {*}
     */
    prepareValue: function (value) {
      var me = this,
        type = me.getActiveColumnType(),
        o = me.activeCellEditParams,
        column = o.column,
        format = column.format;

      switch (type) {
        case 'number':
        case 'currency':
          if (format && format.inputFn) {
            var _value = '',
              i = 0,
              iL = value.length;

            if (F.isNumber(value)) {
              return value;
            }

            for (; i < iL; i++) {
              if (!isNaN(Number(value[i]))) {
                _value += value[i];
              }
            }

            value = _value;
          }
          else if (value !== '') {
            value = Number(value);
          }
          break;
        case 'date':
          if (column.format && column.format.read) {
            var date = column.editor.getDate();
            value = D.format(date, column.format.read, undefined, column.format.mode);
          }
          break;
      }

      return value;
    },
    /*
     * @return {String}
     */
    getActiveColumnType: function () {
      var o = this.activeCellEditParams,
        column = o.column;

      return column.type;
    },
    /*
     * @return {String}
     */
    getActiveColumnKey: function () {
      var o = this.activeCellEditParams,
        column = o.column,
        key = column.key || column.index;

      return key;
    },
    /*
     * @param {Object} o
     */
    onCheckBoxChange: function (o) {
      var me = this,
        w = me.widget,
        column = o.column,
        key = column.key || column.index,
        s = w.store,
        value = me.checkBoxChangedValue;

      if (me.activeEditor) {
        me.hideEditor();
      }

      if (me.checkBoxChangedValue === undefined) {
        return
      }

      delete me.checkBoxChangedValue;

      me.activeCellEditParams = o;
      w.edit.activeCellEditParams = o;

      s.set(o.rowIndex, key, value);
    },
    /*
     * @param {Object} combo
     * @param {*} value
     */
    onComboChange: function (combo, value) {
      var me = this,
        w = me.widget,
        s = w.store,
        o = me.activeCellEditParams,
        key = me.getActiveColumnKey(),
        newValue = combo.getDisplayValue(value);

      s.set(o.rowIndex, key, newValue);
      me.hideEditor();
    },
    checkAutoInitEditors: function () {
      var me = this,
        w = me.widget;

      F.each(w.columns, function (column) {
        if (column.editorAutoInit) {
          column.editor = me.generateEditor(column);
        }
      });
    }
  });

})();
/*
 * @class Fancy.grid.plugin.RowEdit
 */
(function () {
  //SHORTCUTS
  var F = Fancy;
  var E = F.each;

  //CONSTANTS
  var GRID_CELL_CLS = F.GRID_CELL_CLS;
  var FIELD_CLS = F.FIELD_CLS;
  var GRID_ROW_EDIT_CLS = F.GRID_ROW_EDIT_CLS;
  var GRID_ROW_EDIT_BUTTONS_CLS = F.GRID_ROW_EDIT_BUTTONS_CLS;
  var GRID_ROW_EDIT_BUTTON_UPDATE_CLS =  F.GRID_ROW_EDIT_BUTTON_UPDATE_CLS;
  var GRID_ROW_EDIT_BUTTON_CANCEL_CLS = F.GRID_ROW_EDIT_BUTTON_CANCEL_CLS;

  F.define('Fancy.grid.plugin.RowEdit', {
    extend: F.Plugin,
    ptype: 'grid.rowedit',
    inWidgetName: 'rowedit',
    rendered: false,
    /*
     * @constructor
     * @param {Object} config
     */
    constructor: function (config) {
      this.Super('const', arguments);
    },
    /*
     *
     */
    init: function () {
      this.Super('init', arguments);
      this.ons();
    },
    /*
     *
     */
    ons: function () {
      var me = this,
        w = me.widget;

      w.on('scroll', me.onScroll, me);
      w.on('columnresize', me.onColumnResize, me);

      w.on('columndrag', me.onColumnDrag, me);

      if (w.grouping) {
        w.on('collapse', me.onCollapse, me);
        w.on('expand', me.onExpand, me);
      }
    },
    /*
     *
     */
    onCollapse: function () {
      this.hide();
    },
    /*
     *
     */
    onExpand: function () {
      this.hide();
    },
    /*
     * @param {Object} o
     */
    edit: function (o) {
      var me = this,
        w = me.widget,
        column = o.column;

      if (column.index === '$selected') {
        return;
      }

      w.scroller.scrollToCell(o.cell);
      me.showEditor(o);
    },
    /*
     * @param {Object} o
     */
    showEditor: function (o) {
      var me = this;

      me.changed = {};

      if (!me.rendered) {
        me.render();
        me.changePosition(o.rowIndex, false);
      }
      else {
        var isHidden = me.el.css('display') === 'none';
        me.show();
        me.changePosition(o.rowIndex, !isHidden);
      }

      me.setValues(o);

      me.setSizes();
    },
    /*
     *
     */
    render: function () {
      var me = this,
        w = me.widget;

      if (w.leftColumns) {
        me.leftEl = me.renderTo(w.leftBody.el, w.leftColumns);
      }

      if (w.columns) {
        me.el = me.renderTo(w.body.el, w.columns);
      }

      if (w.rightColumns) {
        me.rightEl = me.renderTo(w.rightBody.el, w.rightColumns);
      }

      me.renderButtons();

      me.rendered = true;
    },
    /*
     * @param {Object} renderTo
     * @param {Array} columns
     *  @param {Number} order
     * @param {String} side
     * @param {String} fromSide
     * @return {Fancy.Element}
     */
    renderTo: function (renderTo, columns, order, side, fromSide) {
      var me = this,
        w = me.widget,
        container = F.get(document.createElement('div')),
        el,
        i = 0,
        iL = columns.length,
        theme = w.theme,
        column,
        style = {
          'float': 'left',
          margin: '0px',
          padding: '0px'
        },
        renderAfter,
        renderBefore;

      if (!side) {
        container.addCls(GRID_ROW_EDIT_CLS);
        el = F.get(renderTo.dom.appendChild(container.dom));
      }
      else {
        var fieldEls = renderTo.select('.' + FIELD_CLS);

        i = order;
        iL = order + 1;

        switch (side) {
          case 'right':
            renderBefore = fieldEls.item(order);
            break;
          case 'left':
            renderAfter = fieldEls.item(order);
            break;
          case 'center':
            switch (fromSide) {
              case 'left':
                renderBefore = fieldEls.item(0);
                break;
              case 'right':
                renderAfter = fieldEls.item(fieldEls.length - 1);
                break;
            }
            break;
        }
      }

      for (; i < iL; i++) {
        column = columns[i];
        var columnWidth = column.width;

        var itemConfig = {
          index: column.index,
          label: false,
          style: style,
          width: columnWidth,
          vtype: column.vtype,
          format: column.format,
          stopPropagation: true,
          theme: theme,
          checkValidOnTyping: true,
          events: [{
            change: me.onFieldChange,
            delay: 100,
            scope: me
          }, {
            enter: me.onFieldEnter,
            scope: me
          }]
        };

        switch (side) {
          case 'left':
            itemConfig.renderAfter = renderAfter;
            break;
          case 'right':
            itemConfig.renderBefore = renderBefore;
            break;
          case 'center':
            switch (fromSide) {
              case 'left':
                itemConfig.renderBefore = fieldEls.item(0);
                break;
              case 'right':
                itemConfig.renderAfter = fieldEls.item(fieldEls.length - 1);
                break;
            }
            break;
          default:
            itemConfig.renderTo = el.dom;
        }

        var editor;

        if (column.editable === false) {
          switch (column.type) {
            case 'string':
            case 'number':
              editor = new F.TextField(itemConfig);
              break;
            default:
              editor = new F.EmptyField(itemConfig);
          }
        }
        else {
          switch (column.type) {
            case 'date':
              if (column.format) {
                itemConfig.format = column.format;
              }

              editor = new F.DateField(itemConfig);
              break;
            case 'image':
            case 'string':
            case 'color':
              editor = new F.StringField(itemConfig);
              break;
            case 'number':
              if (column.spin) {
                itemConfig.spin = column.spin;
              }

              if (column.step) {
                itemConfig.step = column.step;
              }

              if (column.min) {
                itemConfig.min = column.min;
              }

              if (column.max) {
                itemConfig.max = column.max;
              }

              editor = new F.NumberField(itemConfig);
              break;
            case 'combo':
              F.apply(itemConfig, {
                data: column.data,
                value: -1,
                padding: false
              });

              if (column.displayKey) {
                itemConfig.displayKey = column.displayKey;
                itemConfig.valueKey = column.displayKey;
              }
              else {
                itemConfig.displayKey = 'text';
                itemConfig.valueKey = 'text';
              }

              editor = new F.Combo(itemConfig);
              break;
            case 'checkbox':
              var paddingLeft;
              switch (column.cellAlign) {
                case 'left':
                  paddingLeft = 7;
                  break;
                case 'center':
                  paddingLeft = (column.width - 20 - 2) / 2;
                  break;
                case 'right':
                  paddingLeft = (column.width - 20) / 2 + 11;
                  break;
              }

              F.apply(itemConfig, {
                renderId: true,
                value: false,
                style: {
                  padding: '0px',
                  display: 'inline-block',
                  'padding-left': paddingLeft,
                  'float': 'left',
                  margin: '0px'
                }
              });

              editor = new F.CheckBox(itemConfig);
              break;
            default:
              editor = new F.EmptyField(itemConfig);
          }
        }

        column.rowEditor = editor;
      }

      return el;
    },
    /*
     *
     */
    renderButtons: function () {
      var me = this,
        w = me.widget,
        container = F.get(document.createElement('div')),
        el;

      container.addCls(GRID_ROW_EDIT_BUTTONS_CLS);

      el = F.get(w.body.el.dom.appendChild(container.dom));

      me.buttonsEl = el;

      me.buttonUpdate = new F.Button({
        cls: GRID_ROW_EDIT_BUTTON_UPDATE_CLS,
        renderTo: el.dom,
        text: 'Update',
        events: [{
          click: me.onClickUpdate,
          scope: me
        }]
      });

      me.buttonCancel = new F.Button({
        cls: GRID_ROW_EDIT_BUTTON_CANCEL_CLS,
        renderTo: el.dom,
        text: 'Cancel',
        events: [{
          click: me.onClickCancel,
          scope: me
        }]
      });
    },
    /*
     *
     */
    setSizes: function () {
      var me = this,
        w = me.widget;

      if (w.leftColumns) {
        me._setSizes(w.leftBody.el.select('.' + GRID_CELL_CLS + '[index="0"]'), w.leftColumns, 'left');
      }

      if (w.columns) {
        me._setSizes(w.body.el.select('.' + GRID_CELL_CLS + '[index="0"]'), w.columns);
      }

      if (w.rightColumns) {
        me._setSizes(w.rightBody.el.select('.' + GRID_CELL_CLS + '[index="0"]'), w.rightColumns, 'right');
      }

      me.setElSize();
    },
    /*
     *
     */
    setElSize: function () {
      var w = this.widget,
        centerWidth = w.getCenterViewWidth(),
        centerFullWidth = w.getCenterFullWidth();

      if (centerWidth < centerFullWidth) {
        this.el.css('width', centerFullWidth);
      }
    },
    /*
     * @private
     * @param {Fancy.Elements} firstRowCells
     * @param {Array} columns
     * @param {String} side
     */
    _setSizes: function (firstRowCells, columns, side) {
      var me = this,
        i = 0,
        iL = columns.length,
        column,
        cellSize,
        cell,
        cellEl,
        editor,
        borderWidth = 1,
        offset = 2;

      for (; i < iL; i++) {
        column = columns[i];
        cell = firstRowCells.item(i).dom;
        cellEl = F.get(cell);
        cellSize = me.getCellSize(cell);
        editor = column.rowEditor;

        if (!editor) {
          continue;
        }

        if ((side === 'left' || side === 'right') && i === iL - 1) {
          cellSize.width--;
        }

        cellSize.height -= 2;

        if (i === iL - 1) {
          editor.el.css('width', (cellSize.width - 2));
        }
        else {
          editor.el.css('width', (cellSize.width - 1));
        }

        editor.el.css('height', (cellSize.height));

        cellSize.width -= borderWidth * 2;
        cellSize.width -= offset * 2;

        cellSize.height -= offset * 2;

        me.setEditorSize(editor, cellSize);
      }
    },
    //Dublication code from Fancy.grid.plugin.CellEdit
    /*
     * @param {Fancy.Element} cell
     * @return {Object}
     */
    getCellSize: function (cell) {
      var w = this.widget,
        cellEl = F.get(cell),
        width = cellEl.width(),
        height = cellEl.height(),
        coeficient = 2;

      if (F.nojQuery && w.panelBorderWidth === 2) {
        coeficient = 1;
      }

      width += parseInt(cellEl.css('border-right-width')) * coeficient;
      height += parseInt(cellEl.css('border-bottom-width')) * coeficient;

      return {
        width: width,
        height: height
      };
    },
    /*
     * @param {Object} editor
     * @param {Number} size
     */
    setEditorSize: function (editor, size) {
      if (editor.wtype === 'field.combo') {
        editor.size(size);

        editor.el.css('width', size.width + 5);
      }
      else {
        editor.setInputSize({
          width: size.width,
          height: size.height
        });
      }
    },
    /*
     * @param {Number} rowIndex
     * @param {Boolean} animate
     */
    changePosition: function (rowIndex, animate) {
      var me = this,
        w = me.widget,
        scrollTop = w.scroller.getScroll(),
        bottomScroll = w.scroller.getBottomScroll(),
        newTop = w.cellHeight * rowIndex - 1 - scrollTop,
        duration = 100,
        plusTop = 0;

      if (w.grouping) {
        plusTop += w.grouping.getOffsetForRow(rowIndex);
        newTop += plusTop;
      }

      if (me.leftEl) {
        if (animate !== false) {
          me.leftEl.animate({
            duration: duration,
            top: newTop
          });
        }
        else {
          me.leftEl.css('top', newTop);
        }
      }

      if (me.el) {
        if (animate !== false) {
          me.el.animate({
            duration: duration,
            top: newTop
          });
        }
        else {
          me.el.css('top', newTop);
        }
      }

      if (me.rightEl) {
        if (animate !== false) {
          me.rightEl.animate({
            duration: duration,
            top: newTop
          });
        }
        else {
          me.rightEl.css('top', newTop);
        }
      }

      var showOnTop = w.getViewTotal() - 3 < rowIndex,
        buttonTop = newTop;

      if (rowIndex < 3) {
        showOnTop = false;
      }

      if (showOnTop) {
        if (w.grouping) {
          if (w.getViewTotal() - 3 < rowIndex - w.grouping.getSpecialRowsUnder(rowIndex)) {
            buttonTop = newTop - parseInt(me.buttonsEl.css('height')) + 1;
          }
          else {
            buttonTop = newTop + w.cellHeight;
            showOnTop = false;
          }
        }
        else {
          buttonTop = newTop - parseInt(me.buttonsEl.css('height')) + 1;
        }
      }
      else {
        buttonTop = newTop + w.cellHeight;
      }

      if (animate !== false) {
        me.buttonsEl.animate({
          duration: duration,
          top: buttonTop
        });
      }
      else {
        me.buttonsEl.css('top', buttonTop);
      }

      me.el.css('left', -bottomScroll);

      me.changeButtonsLeftPos();

      me.activeRowIndex = rowIndex;
    },
    /*
     *
     */
    changeButtonsLeftPos: function () {
      var me = this,
        w = me.widget,
        viewWidth = w.getCenterViewWidth(),
        buttonsElWidth = parseInt(me.buttonsEl.css('width'));

      me.buttonsEl.css('left', (viewWidth - buttonsElWidth) / 2);
    },
    /*
     * @param {Object} o
     */
    setValues: function (o) {
      var me = this,
        w = me.widget;

      if (w.leftColumns) {
        me._setValues(o.data, w.leftColumns);
      }

      if (w.columns) {
        me._setValues(o.data, w.columns);
      }

      if (w.rightColumns) {
        me._setValues(o.data, w.rightColumns);
      }

      me.activeId = o.id;
      me.activeRowIndex = o.rowIndex;
    },
    /*
     * @private
     * @param {Array} data
     * @param {Array} columns
     */
    _setValues: function (data, columns) {
      E(columns, function (column) {
        var editor = column.rowEditor;
        if (editor) {
          switch (column.type) {
            case 'action':
            case 'button':
            case 'order':
            case 'select':
              break;
            default:
              editor.set(data[column.index], false);
          }
        }
      });
    },
    /*
     *
     */
    onScroll: function () {
      var me = this;

      if (me.rendered === false) {
        return;
      }

      if (me.activeRowIndex !== undefined) {
        me.changePosition(me.activeRowIndex, false);
      }
    },
    /*
     *
     */
    onColumnResize: function () {
      if (this.rendered === false) {
        return;
      }

      this.setSizes();
    },
    /*
     *
     */
    onClickUpdate: function () {
      var me = this,
        w = me.widget,
        s = w.store,
        data = me.prepareChanged(),
        rowIndex = s.getRow(me.activeId);

      s.setItemData(rowIndex, data);
      w.update();

      me.hide();
    },
    /*
     *
     */
    prepareChanged: function () {
      var me = this,
        w = me.widget,
        data = me.changed;

      for (var p in data) {
        var column = w.getColumnByIndex(p);

        switch (column.type) {
          case 'date':
            var date = F.Date.parse(data[p], column.format.edit, column.format.mode),
              formattedValue = F.Date.format(date, column.format.read, column.format.mode);

            data[p] = formattedValue;
            break;
        }
      }

      return data;
    },
    /*
     *
     */
    onClickCancel: function () {
      this.hide();
    },
    /*
     *
     */
    hide: function () {
      var me = this;

      if (!me.el) {
        return;
      }

      if (me.leftEl) {
        me.leftEl.hide();
      }

      me.el.hide();

      if (me.rightEl) {
        me.rightEl.hide();
      }

      me.buttonsEl.hide();
    },
    /*
     *
     */
    show: function () {
      var me = this;

      if (me.leftEl) {
        me.leftEl.show();
      }

      me.el.show();

      if (me.rightEl) {
        me.rightEl.show();
      }

      me.buttonsEl.show();
    },
    /*
     * @param {Object} field
     * @param {*} newValue
     * @param {*} oldValue
     */
    onFieldChange: function (field, newValue, oldValue) {
      var me = this;

      if (!field.isValid()) {
        delete me.changed[field.index];
      }
      else {
        me.changed[field.index] = newValue;
      }
    },
    /*
     *
     */
    onFieldEnter: function () {
      var me = this,
        w = me.widget,
        s = w.store,
        rowIndex = s.getRow(me.activeId);

      s.setItemData(rowIndex, me.changed);
      w.update();

      me.hide();
    },
    /*
     * @param {Number} index
     * @param {String} side
     */
    hideField: function (index, side) {
      var w = this.widget,
        columns = w.getColumns(side),
        column = columns[index];

      if (column.rowEditor) {
        column.rowEditor.hide();
      }
    },
    /*
     * @param {Number} index
     * @param {String} side
     */
    showField: function (index, side) {
      var w = this.widget,
        columns = w.getColumns(side),
        column = columns[index];

      if (column.rowEditor) {
        column.rowEditor.show();
      }
    },
    /*
     * @param {Object} column
     * @param {Number} index
     * @param {String} side
     * @param {String} fromSide
     */
    moveEditor: function (column, index, side, fromSide) {
      var me = this,
        w = me.widget,
        s = w.store,
        columns = w.getColumns(side),
        editor = column.rowEditor,
        body = w.getBody(side),
        rowEditRowEl = body.el.select('.' + GRID_ROW_EDIT_CLS),
        item = s.getById(me.activeId),
        value = item.get(column.index),
        field;

      if (me.activeId === undefined) {
        value = s.get(me.activeRowIndex)[column.index];
      }

      editor.destroy();
      me.renderTo(rowEditRowEl, columns, index, side, fromSide);

      field = me.getField(index, side);
      column.rowEditor = field;

      field.set(value);
      me.setSizes();

      me.changeButtonsLeftPos();
      me.reSetColumnsEditorsLinks();
    },
    /*
     * @param {Number} index
     * @param {String} side
     * @return {Object}
     */
    getField: function (index, side) {
      var w = this.widget,
        body = w.getBody(side),
        field;

      switch (side) {
        case 'left':
          index++;
          break;
      }

      field = F.getWidget(body.el.select('.' + FIELD_CLS).item(index).attr('id'));

      return field;
    },
    /*
     *
     */
    reSetColumnsEditorsLinks: function () {
      var w = me.widget,
        cells = w.body.el.select('.' + FIELD_CLS);

      E(w.columns, function (column, i) {
        column.rowEditor = F.getWidget(cells.item(i).attr('id'));
      });

      cells = w.leftBody.el.select('.' + FIELD_CLS);

      E(w.leftColumns, function (column, i) {
        column.rowEditor = F.getWidget(cells.item(i).attr('id'));
      });

      cells = w.rightBody.el.select('.' + FIELD_CLS);

      E(w.rightColumns, function (column, i) {
        column.rowEditor = F.getWidget(cells.item(i).attr('id'));
      });
    },
    onColumnDrag: function () {
      var me = this;

      me.destroyEls();
      me.hide();
    },
    destroyEls: function () {
      var me = this,
        w = me.widget;

      if(me.rendered){
        me.rendered = false;

        if (w.leftColumns) {
          me.leftEl.destroy();
          F.each(w.leftColumns, function (column) {
            column.rowEditor.destroy();
          });
        }

        if (w.columns) {
          me.el.destroy();
          F.each(w.columns, function (column) {
            column.rowEditor.destroy();
          });
        }

        if (w.rightColumns) {
          me.rightEl.destroy();
          F.each(w.rightColumns, function (column) {
            column.rowEditor.destroy();
          });
        }
      }
    }
  });

})();
/*
 * @class Fancy.grid.plugin.Selection
 * @extends Fancy.Plugin
 */
(function(){
  //SHORTCUTS
  var F = Fancy;

  /*
   * CONSTANTS
   */
  var FIELD_CHECKBOX_CLS = F.FIELD_CHECKBOX_CLS;
  var GRID_CELL_CLS = F.GRID_CELL_CLS;
  var GRID_CELL_OVER_CLS = F.GRID_CELL_OVER_CLS;
  var GRID_CELL_SELECTED_CLS = F.GRID_CELL_SELECTED_CLS;
  var GRID_COLUMN_CLS = F.GRID_COLUMN_CLS;
  var GRID_COLUMN_OVER_CLS = F.GRID_COLUMN_OVER_CLS;
  var GRID_COLUMN_SELECT_CLS = F.GRID_COLUMN_SELECT_CLS;
  var GRID_COLUMN_SELECTED_CLS = F.GRID_COLUMN_SELECTED_CLS;
  var GRID_ROW_OVER_CLS = F.GRID_ROW_OVER_CLS;
  var GRID_HEADER_CELL_SELECT_CLS = F.GRID_HEADER_CELL_SELECT_CLS;

  F.define('Fancy.grid.plugin.Selection', {
    extend: F.Plugin,
    ptype: 'grid.selection',
    inWidgetName: 'selection',
    mixins: [
      'Fancy.grid.selection.mixin.Navigation'
    ],
    enabled: true,
    checkboxRow: false,
    checkOnly: false,
    memory: false,
    /*
     * @constructor
     * @param {Object} config
     */
    constructor: function (config) {
      this.Super('const', arguments);
    },
    /*
     *
     */
    init: function () {
      var me = this;

      me.Super('init', arguments);

      if (me.memory) {
        me.initMemory();
      }

      me.ons();
    },
    /*
     *
     */
    ons: function () {
      var me = this,
        w = me.widget;

      w.once('render', function () {
        me.initTrackOver();
        me.initColumnTrackOver();
        me.initCellTrackOver();
        me.initCellSelection();
        me.initRowSelection();
        me.initColumnSelection();
        if (w.keyNavigation) {
          me.initNavigation();
        }
        w.on('changepage', me.onChangePage, me);

        if(F.nojQuery){
          me.initFixTrackOver();
        }
      });

      w.on('sort', me.onSort, me);
    },
    /*
     *
     */
    initMemory: function () {
      var me = this;

      me.memory = {
        all: false,
        except: {},
        selected: {},
        setAll: function () {
          F.apply(me.memory, {
            all: true,
            except: {},
            selected: {}
          });
        },
        clearAll: function () {
          F.apply(me.memory, {
            all: false,
            except: {},
            selected: {}
          });
        }
      };
    },
    /*
     *
     */
    initTrackOver: function () {
      var me = this,
        w = me.widget;

      w.on('rowenter', me.onRowEnter, me);
      w.on('rowleave', me.onRowLeave, me);
    },
    /*
     *
     */
    initCellTrackOver: function () {
      var me = this,
        w = me.widget;

      w.on('cellenter', me.onCellEnter, me);
      w.on('cellleave', me.onCellLeave, me);
    },
    /*
     *
     */
    initColumnTrackOver: function () {
      var me = this,
        w = me.widget;

      w.on('columnenter', me.onColumnEnter, me);
      w.on('columnleave', me.onColumnLeave, me);
    },
    /*
     * @param {Fancy.Grid} grid
     * @param {Object} params
     */
    onCellEnter: function (grid, params) {
      var w = this.widget;

      if (!w.cellTrackOver) {
        return;
      }

      F.get(params.cell).addCls(GRID_CELL_OVER_CLS);
    },
    /*
     * @param {Fancy.Grid} grid
     * @param {Object} params
     */
    onCellLeave: function (grid, params) {
      var w = this.widget;

      if (!w.cellTrackOver) {
        return;
      }

      F.get(params.cell).removeCls(GRID_CELL_OVER_CLS);
    },
    /*
     * @param {Fancy.Grid} grid
     * @param {Object} params
     */
    onColumnEnter: function (grid, params) {
      var w = this.widget,
        scroller = w.scroller;

      if (!w.columnTrackOver || scroller.bottomKnobDown || scroller.rightKnobDown || params.column.trackOver === false) {
        return;
      }

      F.get(params.columnDom).addCls(GRID_COLUMN_OVER_CLS);
    },
    /*
     * @param {Fancy.Grid} grid
     * @param {Object} params
     */
    onColumnLeave: function (grid, params) {
      var w = this.widget;

      if (!w.columnTrackOver) {
        return;
      }

      F.get(params.columnDom).removeCls(GRID_COLUMN_OVER_CLS);
    },
    /*
     * @param {Fancy.Grid} grid
     * @param {Object} params
     */
    onRowEnter: function (grid, params) {
      var w = this.widget,
        scroller = w.scroller;

      if (this.enabled === false) {
        return;
      }

      if (!w.trackOver || scroller.bottomKnobDown || scroller.rightKnobDown) {
        return;
      }

      var rowCells = w.getDomRow(params.rowIndex);

      F.each(rowCells, function (cell) {
        F.get(cell).addCls(GRID_ROW_OVER_CLS);
      });

      w.fire('rowtrackenter', params);
    },
    /*
     * @param {Fancy.Grid} grid
     * @param {Object} params
     */
    onRowLeave: function (grid, params) {
      var w = this.widget;

      if (this.enabled === false) {
        return;
      }

      if (!w.trackOver) {
        return;
      }

      var rowCells = w.getDomRow(params.rowIndex);

      F.each(rowCells, function (cell) {
        F.get(cell).removeCls(GRID_ROW_OVER_CLS);
      });

      w.fire('rowtrackleave', params);
    },
    /*
     *
     */
    onChangePage: function () {
      if (this.memory) {
        return;
      }

      this.clearSelection();
    },
    /*
     *
     */
    initCellSelection: function () {
      var me = this,
        w = me.widget;

      w.on('cellclick', me.onCellClick, me);

      w.on('cellmousedown', me.onCellMouseDownCells, me);
      w.on('cellenter', me.onCellEnterSelection, me);
    },
    /*
     *
     */
    initRowSelection: function () {
      var me = this,
        w = me.widget;

      if (w.checkboxRowSelection) {
        me.checkboxRow = true;
        setTimeout(function () {
          if (me.selModel === 'rows') {
            me.renderHeaderCheckBox();
          }
        }, 1);
      }

      w.on('rowclick', me.onRowClick, me);

      w.on('cellmousedown', me.onCellMouseDownRows, me);
      w.on('cellclick', me.onCellClickRows, me);
      w.on('rowenter', me.onRowEnterSelection, me);
    },
    /*
     * @param {Object} grid
     * @param {Object} params
     */
    onCellMouseDownRows: function (grid, params) {
      var me = this,
        w = me.widget;

      if (!me.rows || !me.enabled) {
        return;
      }

      if (me.checkOnly && params.column.index !== '$selected') {
        return;
      }

      var e = params.e,
        target = e.target,
        isCTRL = e.ctrlKey;

      var rowIndex = params.rowIndex,
        rowCells = w.getDomRow(rowIndex);

      if (isCTRL && w.multiSelect) {
        if (F.get(rowCells[0]).hasCls(GRID_CELL_SELECTED_CLS)) {
          me.domDeSelectRow(rowIndex);
          if (me.checkboxRow) {
            me.deSelectCheckBox(rowIndex);
          }
        }
        else {
          me.domSelectRow(rowIndex);
          if (me.checkboxRow) {
            me.selectCheckBox(rowIndex);
          }
        }
      }
      else {
        if (params.column.index === '$selected') {
          var checkbox = F.getWidget(F.get(params.cell).select('.' + FIELD_CHECKBOX_CLS).attr('id'));

          if (checkbox.el.within(target)) {
            me.domSelectRow(rowIndex);
            if (checkbox.get() === true) {
              me.domDeSelectRow(rowIndex);
            }
            else {
              me.domSelectRow(rowIndex);
            }
          }
          else {
            me.clearSelection();
            me.domSelectRow(rowIndex);
            if (me.checkboxRow) {
              me.selectCheckBox(rowIndex);
            }
          }
        }
        else {
          me.clearSelection();
          me.domSelectRow(rowIndex);
          if (me.checkboxRow) {
            me.selectCheckBox(rowIndex);
          }
        }
      }

      me.isMouseDown = true;
      me.startRowSelection = rowIndex;

      F.$(document).one('mouseup', function () {
        delete me.isMouseDown;
        delete me.startCellSelection;
      });

      w.fire('select');
    },
    /*
     * @param {Number} rowIndex
     */
    selectCheckBox: function (rowIndex) {
      var me = this,
        w = me.widget,
        checkBoxEls = w.el.select('.' + GRID_COLUMN_SELECT_CLS + ' .' + GRID_CELL_CLS + '[index="' + rowIndex + '"] .' + FIELD_CHECKBOX_CLS);

      checkBoxEls.each(function (item) {
        F.getWidget(item.attr('id')).set(true);
      });

      if (w.selModel === 'rows') {
        me.clearHeaderCheckBox();
      }
      //w.set(rowIndex, '$selected', true);
    },
    /*
     * @param {Number} rowIndex
     */
    deSelectCheckBox: function (rowIndex) {
      var me = this,
        w = me.widget,
        s = w.store,
        checkBoxEls = w.el.select('.' + GRID_COLUMN_SELECT_CLS + ' .' + GRID_CELL_CLS + '[index="' + rowIndex + '"] .' + FIELD_CHECKBOX_CLS),
        id = s.get(rowIndex, 'id');

      if (!id) {
        return;
      }

      if (me.memory) {
        me.memory.except[id] = true;
        delete me.memory.selected[id];
      }

      checkBoxEls.each(function (item) {
        F.getWidget(item.attr('id')).set(false);
      });

      me.clearHeaderCheckBox();
      //w.set(rowIndex, '$selected', true);
    },
    /*
     * @param {Number} rowIndex
     */
    domSelectRow: function (rowIndex) {
      var me = this,
        w = me.widget,
        s = w.store,
        rowCells = w.getDomRow(rowIndex),
        id = s.get(rowIndex, 'id');

      if (me.memory) {
        delete me.memory.except[id];
        me.memory.selected[id] = true;
      }

      F.each(rowCells, function (cell) {
        F.get(cell).addCls(GRID_CELL_SELECTED_CLS);
      });
    },
    /*
     * @param {Number} rowIndex
     */
    domDeSelectRow: function (rowIndex) {
      var w = this.widget,
        rowCells = w.getDomRow(rowIndex);

      F.each(rowCells, function (cell) {
        F.get(cell).removeCls(GRID_CELL_SELECTED_CLS);
      });
    },
    /*
     * @param {Object} grid
     * @param {Object} params
     */
    onColumnEnterSelection: function (grid, params) {
      var me = this,
        w = me.widget;

      if (!me.columns || me.isMouseDown !== true) {
        return;
      }

      var start = {
        columnIndex: me.startColumnColumnIndex,
        side: me.startColumnSide
      };

      var end = {
        columnIndex: params.columnIndex,
        side: params.side
      };

      if (start.side === end.side) {
        switch (start.side) {
          case 'center':
            me.clearSelection('right');
            me.clearSelection('left');
            break;
          case 'left':
            me.clearSelection('center');
            me.clearSelection('right');
            break;
          case 'right':
            me.clearSelection('center');
            me.clearSelection('left');
            break;
        }

        me.selectColumns(start.columnIndex, end.columnIndex, start.side);
      }
      else if (start.side === 'center' && end.side === 'right') {
        me.selectColumns(start.columnIndex, w.columns.length, 'center');
        me.selectColumns(0, end.columnIndex, 'right');
      }
      else if (start.side === 'center' && end.side === 'left') {
        me.selectColumns(0, start.columnIndex, 'center');
        me.selectColumns(end.columnIndex, w.leftColumns.length, 'left');
      }
      else if (start.side === 'left' && end.side === 'center') {
        me.clearSelection('right');
        me.selectColumns(start.columnIndex, w.leftColumns.length, 'left');
        me.selectColumns(0, end.columnIndex, 'center');
      }
      else if (start.side === 'left' && end.side === 'right') {
        me.selectColumns(start.columnIndex, w.leftColumns.length, 'left');
        me.selectColumns(0, w.columns.length, 'center');
        me.selectColumns(0, end.columnIndex, 'right');
      }
      else if (start.side === 'right' && end.side === 'center') {
        me.clearSelection('left');
        me.selectColumns(0, start.columnIndex, 'right');
        me.selectColumns(end.columnIndex, w.columns.length, 'center');
      }
      else if (start.side === 'right' && end.side === 'left') {
        me.selectColumns(0, start.columnIndex, 'right');
        me.selectColumns(0, w.columns.length, 'center');
        me.selectColumns(end.columnIndex, w.leftColumns.length, 'left');
      }
    },
    /*
     * @param {Object} grid
     * @param {Object} params
     */
    onRowEnterSelection: function (grid, params) {
      var me = this,
        w = me.widget;

      if (me.enabled === false) {
        return;
      }

      if (!me.rows || me.isMouseDown !== true) {
        return;
      }

      var rowStart = me.startRowSelection,
        rowEnd = params.rowIndex,
        newSelectedRows = {};

      if (rowStart > rowEnd) {
        rowStart = params.rowIndex;
        rowEnd = me.startRowSelection;
      }

      var i = rowStart,
        iL = rowEnd + 1;

      for (; i < iL; i++) {
        newSelectedRows[i] = true;
      }

      var currentSelected = me.getSelectedRowByColumn(params.columnIndex, params.side),
        toSelect = {},
        toDeselect = {};

      for (var p in newSelectedRows) {
        if (currentSelected[p] !== true) {
          toSelect[p] = true;
        }
      }

      for (var p in currentSelected) {
        if (newSelectedRows[p] !== true) {
          toDeselect[p] = true;
        }
      }

      for (var p in toSelect) {
        me.domSelectRow(p);
        if (me.checkboxRow) {
          me.selectCheckBox(p);
        }
      }

      for (var p in toDeselect) {
        me.domDeSelectRow(p);
        if (me.checkboxRow) {
          me.deSelectCheckBox(p);
        }
      }

      w.fire('select');
    },
    /*
     * @param {Number} columnIndex
     * @param {String} side
     * @return {Object}
     */
    getSelectedRowByColumn: function (columnIndex, side) {
      var w = this.widget,
        body;

      switch (side) {
        case 'left':
          body = w.leftBody;
          break;
        case 'center':
          body = w.body;
          break;
        case 'right':
          body = w.rightBody;
          break;
      }

      var columnEl = body.el.select('.' + GRID_COLUMN_CLS + '[index="' + columnIndex + '"][grid="' + w.id + '"]'),
        selectedCells = columnEl.select('.' + GRID_CELL_SELECTED_CLS),
        selectedRows = {};

      selectedCells.each(function (cell) {
        selectedRows[Number(cell.attr('index'))] = true;
      });

      return selectedRows;
    },
    /*
     * @return {Number}
     */
    getSelectedRow: function () {
      var w = this.widget,
        body = w.body,
        selectedCells = body.el.select('.' + GRID_CELL_SELECTED_CLS);

      if (selectedCells.length === 0) {
        return -1;
      }

      return Number(selectedCells.item(0).attr('index'));
    },
    /*
     * @return {Array}
     */
    getSelectedRows: function () {
      var w = this.widget,
        body = w.body,
        columnEl = body.el.select('.' + GRID_COLUMN_CLS + '[index="0"][grid="' + w.id + '"]'),
        selectedCells = columnEl.select('.' + GRID_CELL_SELECTED_CLS),
        rows = [];

      selectedCells.each(function (cell) {
        rows.push(Number(cell.attr('index')));
      });

      return rows;
    },
    /*
     *
     */
    initColumnSelection: function () {
      var me = this,
        w = me.widget;

      me.selectedColumns = [];

      w.on('columnclick', me.onColumnClick, me);
      w.on('columnmousedown', me.onColumnMouseDown, me);
      w.on('columnenter', me.onColumnEnterSelection, me);
    },
    /*
     * @param {Fancy.Grid} grid
     * @param {Object} params
     */
    onColumnClick: function (grid, params) {
      var me = this;

      if (!me.column || params.column.selectable === false) {
        return;
      }

      var columnEl = F.get(params.columnDom);

      if (me.column) {
        me.selectedColumns[0] = params;
      }

      me.clearSelection();

      columnEl.addCls(GRID_COLUMN_SELECTED_CLS);
    },
    /*
     * @param {Fancy.Grid} grid
     * @param {Object} params
     */
    onRowClick: function (grid, params) {
      var me = this,
        w = me.widget,
        rowIndex = params.rowIndex;

      if (!me.row || params === false) {
        return;
      }

      if (me.checkOnly && params.column.index !== '$selected') {
        return;
      }

      var column = params.column,
        select = true;

      if (column.type === 'action' && column.items) {
        F.each(column.items, function (item) {
          if (item.action === 'remove') {
            select = false;
          }
        });
      }

      me.clearSelection();

      var rowCells = w.getDomRow(rowIndex);

      if (params.column.index === '$selected') {
        var checkbox = F.getWidget(F.get(params.cell).select('.' + FIELD_CHECKBOX_CLS).attr('id'));

        if (checkbox.get() === true) {
          me.selectCheckBox(rowIndex);
          F.each(rowCells, function (cell) {
            F.get(cell).addCls(GRID_CELL_SELECTED_CLS);
          });
        }
        else {
          me.deSelectCheckBox(rowIndex);
        }
      }
      else if (select) {
        F.each(rowCells, function (cell) {
          F.get(cell).addCls(GRID_CELL_SELECTED_CLS);
        });

        me.selectCheckBox(rowIndex);
        w.fire('select');
      }
    },
    /*
     * @param {Object} grid
     * @param {Object} params
     */
    onCellClickRows: function (grid, params) {
      var me = this,
        w = me.widget;

      if (!me.rows || !me.enabled) {
        return;
      }

      if (me.checkOnly && params.column.index !== '$selected') {
        return;
      }

      var e = params.e,
        isCTRL = e.ctrlKey,
        rowIndex = params.rowIndex;

      if (isCTRL && w.multiSelect) {
      }
      else if (params.column.index === '$selected') {
        var checkbox = F.getWidget(F.get(params.cell).select('.' + FIELD_CHECKBOX_CLS).attr('id'));
        if (checkbox.get() === true) {
          me.selectCheckBox(rowIndex);
        }
        else {
          me.deSelectCheckBox(rowIndex);
        }
      }
    },
    /*
     * @param {Number} rowIndex
     */
    selectRow: function (rowIndex) {
      var me = this,
        w = me.widget;

      if (!me.row && !me.rows) {
        throw new Error('[FancyGrid Error] - row selection was not enabled');
      }

      me.clearSelection();

      var rowCells = w.getDomRow(rowIndex);

      F.each(rowCells, function (cell) {
        F.get(cell).addCls(GRID_CELL_SELECTED_CLS);
      });

      w.fire('select');
    },
    /*
     * @param {Fancy.Grid} grid
     * @param {Object} params
     */
    onCellClick: function (grid, params) {
      var me = this,
        w = me.widget;

      if (!me.cell) {
        return;
      }

      me.clearSelection();

      F.get(params.cell).addCls(GRID_CELL_SELECTED_CLS);

      w.fire('select');
    },
    /*
     * @param {String} side
     */
    clearSelection: function (side) {
      var me = this,
        w = me.widget;

      if (me.checkboxRow) {
        var selected = w.body.el.select('.' + GRID_COLUMN_CLS + '[index="0"] .' + GRID_CELL_SELECTED_CLS);

        selected.each(function (item) {
          var rowIndex = item.attr('index');

          me.deSelectCheckBox(rowIndex);
        });

        if (me.memory) {
          me.memory.clearAll();
        }
      }

      if (side) {
        switch (side) {
          case 'left':
            w.leftBody.el.select('.' + GRID_CELL_SELECTED_CLS).removeCls(GRID_CELL_SELECTED_CLS);
            w.leftBody.el.select('.' + GRID_COLUMN_SELECTED_CLS).removeCls(GRID_COLUMN_SELECTED_CLS);
            w.leftBody.el.select('.' + GRID_CELL_OVER_CLS).removeCls(GRID_CELL_OVER_CLS);
            break;
          case 'center':
            w.body.el.select('.' + GRID_CELL_SELECTED_CLS).removeCls(GRID_CELL_SELECTED_CLS);
            w.body.el.select('.' + GRID_COLUMN_SELECTED_CLS).removeCls(GRID_COLUMN_SELECTED_CLS);
            w.body.el.select('.' + GRID_CELL_OVER_CLS).removeCls(GRID_CELL_OVER_CLS);
            break;
          case 'right':
            w.rightBody.el.select('.' + GRID_CELL_SELECTED_CLS).removeCls(GRID_CELL_SELECTED_CLS);
            w.rightBody.el.select('.' + GRID_COLUMN_SELECTED_CLS).removeCls(GRID_COLUMN_SELECTED_CLS);
            w.rightBody.el.select('.' + GRID_CELL_OVER_CLS).removeCls(GRID_CELL_OVER_CLS);
            break;
        }
      }
      else {
        w.el.select('.' + GRID_CELL_SELECTED_CLS).removeCls(GRID_CELL_SELECTED_CLS);
        w.el.select('.' + GRID_COLUMN_SELECTED_CLS).removeCls(GRID_COLUMN_SELECTED_CLS);
        w.el.select('.' + GRID_CELL_OVER_CLS).removeCls(GRID_CELL_OVER_CLS);
      }

      w.fire('clearselect');
    },
    /*
     *
     */
    onSort: function () {
      if (this.memory) {
        return;
      }

      this.clearSelection();
    },
    /*
     * @param {Fancy.Grid} grid
     * @param {Object} params
     */
    onCellEnterSelection: function (grid, params) {
      var me = this,
        w = me.widget,
        numOfSelectedCells = 0;

      if (!me.cells || me.isMouseDown !== true) {
        return;
      }

      me.prevCellsSelection = params.cell;
      me.prevCellRowIndex = params.rowIndex;
      me.prevCellColumnIndex = params.columnIndex;
      me.prevCellSide = params.side;

      var start = {
        rowIndex: me.startCellRowIndex,
        columnIndex: me.startCellColumnIndex,
        side: me.startCellSide
      };

      var end = {
        rowIndex: params.rowIndex,
        columnIndex: params.columnIndex,
        side: params.side
      };

      if (params.rowIndex < me.startCellRowIndex) {
        start.rowIndex = params.rowIndex;
        end.rowIndex = me.startCellRowIndex;
      }

      if (me.startCellSide === params.side) {
        if (params.columnIndex < me.startCellColumnIndex) {
          start.columnIndex = params.columnIndex;
          end.columnIndex = me.startCellColumnIndex;
        }

        numOfSelectedCells = me.selectCells(start, end, start.side);

        if (me.startCellSide === 'left') {
          me.clearSelection('center');
          me.clearSelection('right');
        }
        else if (me.startCellSide === 'center') {
          me.clearSelection('left');
          me.clearSelection('right');
        }
        else if (me.startCellSide === 'right') {
          me.clearSelection('left');
          me.clearSelection('center');
        }
      }
      else {
        if (me.startCellSide === 'left') {
          numOfSelectedCells = me.selectCells(start, {
            rowIndex: params.rowIndex,
            columnIndex: w.leftColumns.length - 1
          }, 'left');

          if (params.side === 'center') {
            numOfSelectedCells += me.selectCells({
              columnIndex: 0,
              rowIndex: start.rowIndex,
            }, end, 'center');

            me.clearSelection('right');
          }
          else if (params.side === 'right') {
            numOfSelectedCells += me.selectCells({
              columnIndex: 0,
              rowIndex: start.rowIndex
            }, {
              columnIndex: w.columns.length - 1,
              rowIndex: end.rowIndex
            }, 'center');

            numOfSelectedCells += me.selectCells({
              columnIndex: 0,
              rowIndex: start.rowIndex
            }, end, 'right');
          }
        }
        else if (me.startCellSide === 'center') {
          if (params.side === 'left') {
            numOfSelectedCells += me.selectCells({
              columnIndex: 0,
              rowIndex: start.rowIndex
            }, {
              rowIndex: end.rowIndex,
              columnIndex: start.columnIndex
            }, 'center');

            numOfSelectedCells += me.selectCells({
              columnIndex: end.columnIndex,
              rowIndex: start.rowIndex
            }, {
              rowIndex: end.rowIndex,
              columnIndex: w.leftColumns.length - 1
            }, 'left');
          }
          else if (params.side === 'right') {
            numOfSelectedCells += me.selectCells({
              columnIndex: start.columnIndex,
              rowIndex: start.rowIndex
            }, {
              columnIndex: w.columns.length - 1,
              rowIndex: end.rowIndex
            }, 'center');

            numOfSelectedCells += me.selectCells({
              columnIndex: 0,
              rowIndex: start.rowIndex
            }, {
              columnIndex: end.columnIndex,
              rowIndex: end.rowIndex
            }, 'right');
          }
        }
        else if (me.startCellSide === 'right') {
          numOfSelectedCells += me.selectCells({
            columnIndex: 0,
            rowIndex: start.rowIndex
          }, {
            columnIndex: start.columnIndex,
            rowIndex: end.rowIndex
          }, 'right');

          if (params.side === 'center') {
            numOfSelectedCells += me.selectCells({
              columnIndex: end.columnIndex,
              rowIndex: start.rowIndex
            }, {
              columnIndex: w.columns.length - 1,
              rowIndex: end.rowIndex
            }, 'center');
            me.clearSelection('left');
          }
          else if (params.side === 'left') {
            numOfSelectedCells += me.selectCells({
              columnIndex: 0,
              rowIndex: start.rowIndex
            }, {
              columnIndex: w.columns.length - 1,
              rowIndex: end.rowIndex
            }, 'center');

            numOfSelectedCells += me.selectCells({
              columnIndex: end.columnIndex,
              rowIndex: start.rowIndex
            }, {
              columnIndex: w.leftColumns.length - 1,
              rowIndex: end.rowIndex
            }, 'left');
          }
        }
      }

      me.endCellRowIndex = end.rowIndex;

      w.fire('select');
    },
    /*
     * @param {Fancy.Grid} grid
     * @param {Object} params
     */
    onColumnMouseDown: function (grid, params) {
      var me = this,
        w = me.widget;

      if (!me.columns || params.column.selectable === false || !me.enabled) {
        return;
      }

      var columnEl = F.get(params.columnDom);

      me.isMouseDown = true;
      me.startColumnColumnIndex = params.columnIndex;
      me.startColumnSide = params.side;

      me.clearSelection();

      columnEl.addCls(GRID_COLUMN_SELECTED_CLS);

      F.$(document).one('mouseup', function () {
        delete me.isMouseDown;
      });


      w.fire('select');
    },
    /*
     * @param {Fancy.Grid} grid
     * @param {Object} params
     */
    onCellMouseDownCells: function (grid, params) {
      var me = this,
        w = me.widget;

      if (w.celledit) {
        w.celledit.hideEditor();
      }

      if (!me.cells || !me.enabled) {
        return;
      }

      var cellEl = F.get(params.cell);

      me.clearSelection();

      cellEl.addCls(GRID_CELL_SELECTED_CLS);
      me.isMouseDown = true;
      me.startCellSelection = params.cell;
      me.startCellRowIndex = params.rowIndex;
      me.startCellColumnIndex = params.columnIndex;
      me.startCellSide = params.side;

      F.$(document).one('mouseup', function () {
        delete me.isMouseDown;
        delete me.startCellSelection;
      });

      w.fire('select');
    },
    /*
     * @param {Number} start
     * @param {Number} end
     * @param {String} side
     */
    selectCells: function (start, end, side) {
      var me = this,
        w = me.widget,
        body = w.body,
        leftBody = w.leftBody,
        rightBody = w.rightBody,
        i = start.rowIndex,
        iL = end.rowIndex + 1,
        b,
        j,
        jL,
        selectedCells = me.getSelectedCells(side || 'center'),
        needToSelect = {},
        toSelect = {},
        toDeselect = {};

      i = start.rowIndex;
      iL = end.rowIndex + 1;
      for (; i < iL; i++) {
        needToSelect[i] = needToSelect[i] || {};
        j = start.columnIndex;
        jL = end.columnIndex + 1;

        for (; j < jL; j++) {
          needToSelect[i][j] = true;
        }
      }

      for (var p in needToSelect) {
        if (selectedCells[p] === undefined) {
          toSelect[p] = needToSelect[p];
        }
        else {
          for (var q in needToSelect[p]) {
            if (selectedCells[p][q] !== true) {
              toSelect[p] = toSelect[p] || {};
              toSelect[p][q] = true;
            }
          }
        }
      }

      for (var p in selectedCells) {
        if (needToSelect[p] === undefined) {
          toDeselect[p] = selectedCells[p];
        }
        else {
          for (var q in selectedCells[p]) {
            if (needToSelect[p][q] !== true) {
              toDeselect[p] = toDeselect[p] || {};
              toDeselect[p][q] = true;
            }
          }
        }
      }

      switch (side) {
        case 'left':
          b = leftBody;
          break;
        case 'center':
          b = body;
          break;
        case 'right':
          b = rightBody;
          break;
        default:
          b = body;
      }

      for (var p in toSelect) {
        for (var q in toSelect[p]) {
          var cell = b.getCell(p, q);

          cell.addCls(GRID_CELL_SELECTED_CLS);
        }
      }

      for (var p in toDeselect) {
        for (var q in toDeselect[p]) {
          var cell = b.getCell(p, q);

          cell.removeCls(GRID_CELL_SELECTED_CLS);
        }
      }
    },
    /*
     * @param {String} side
     * @return {Array}
     */
    getSelectedCells: function (side) {
      var me = this,
        w = me.widget,
        body = w.getBody(side || 'center'),
        selectedCells = body.el.select('.' + GRID_CELL_SELECTED_CLS),
        selected = {},
        i = 0,
        iL = selectedCells.length;

      for (; i < iL; i++) {
        var cell = selectedCells.item(i),
          columnIndex = Number(cell.parent().attr('index')),
          rowIndex = Number(cell.attr('index'));

        selected[rowIndex] = selected[rowIndex] || {};
        selected[rowIndex][columnIndex] = true;
      }

      return selected;
    },
    /*
     * @return {Array}
     */
    getNumberSelectedCells: function () {
      return this.widget.el.select('.' + GRID_CELL_SELECTED_CLS).length;
    },
    /*
     * @param {String} side
     * @return {Array}
     */
    getSelectedColumns: function (side) {
      var w = this.widget,
        body = w.getBody(side),
        selected = {},
        selectedColumns = body.el.select('.' + GRID_COLUMN_SELECTED_CLS),
        i = 0,
        iL = selectedColumns.length;

      for (; i < iL; i++) {
        selected[selectedColumns.item(i).attr('index')] = true;
      }

      return selected;
    },
    /*
     * @param {Number} start
     * @param {Number} end
     * @param {String} side
     */
    selectColumns: function (start, end, side) {
      var me = this,
        selectedColumns = me.getSelectedColumns(side || 'center'),
        needToSelect = {},
        toSelect = {},
        toDeselect = {},
        i = start,
        iL = end;

      if (iL < i) {
        i = end;
        iL = start;
      }

      iL++;
      for (; i < iL; i++) {
        needToSelect[i] = true;
      }

      for (var p in needToSelect) {
        if (selectedColumns[p] !== true) {
          toSelect[p] = true;
        }
      }

      for (var p in selectedColumns) {
        if (needToSelect[p] !== true) {
          toDeselect[p] = true;
        }
      }

      for (var p in toSelect) {
        me.selectColumn(p, side);
      }

      for (var p in toDeselect) {
        me.deselectColumn(p, side);
      }
    },
    /*
     * @param {Object} columnIndex
     * @param {String} side
     */
    selectColumn: function (columnIndex, side) {
      var w = this.widget,
        body = w.getBody(side || 'center'),
        columnEl = F.get(body.getDomColumn(columnIndex));

      columnEl.addCls(GRID_COLUMN_SELECTED_CLS);
    },
    /*
     * @param {Object} columnIndex
     * @param {String} side
     */
    deselectColumn: function (columnIndex, side) {
      var w = this.widget,
        body = w.getBody(side || 'center'),
        columnEl = F.get(body.getDomColumn(columnIndex));

      columnEl.removeCls(GRID_COLUMN_SELECTED_CLS);
    },
    /*
     * @param {Object} returnModel
     * @return {Fancy.Model|Array}
     */
    getSelection: function (returnModel) {
      var me = this,
        w = me.widget,
        s = w.store,
        model = {};

      switch (me.selModel) {
        case 'row':
          model.row = me.getSelectedRow();
          if (model.row !== -1) {
            model.items = [s.get(model.row)];
            model.rows = [model.row];
          }
          else {
            model.items = [];
            model.rows = [];
          }
          break;
        case 'rows':
          model.rows = me.getSelectedRows();
          if (me.memory && me.memory.all) {
            model.items = s.data;
          }
          else {
            model.items = [];

            var i = 0,
              iL = model.rows.length;

            for (; i < iL; i++) {
              model.items.push(s.get(model.rows[i]));
            }
          }
          break;
        case 'cells':
          break;
        case 'cell':
          break;
        case 'column':
          break;
        case 'columns':
          break;
      }

      if (returnModel) {
        return model;
      }
      return model.items;
    },
    /*
     *
     */
    renderHeaderCheckBox: function () {
      var me = this,
        w = this.widget;

      me._renderHeaderCheckBox(w.leftHeader, w.leftColumns);
      me._renderHeaderCheckBox(w.header, w.columns);
      me._renderHeaderCheckBox(w.rightHeader, w.rightColumns);
    },
    /*
     * @param {Fancy.Header} header
     * @param {Array} columns
     */
    _renderHeaderCheckBox: function (header, columns) {
      var me = this,
        memory = me.memory;

      F.each(columns, function (column, i) {
        if (column.index === '$selected') {
          var headerCellContainer = header.getCell(i).firstChild();

          column.headerCheckBox = new F.CheckBox({
            renderTo: headerCellContainer.dom,
            renderId: true,
            value: false,
            label: false,
            style: {
              padding: '0px',
              display: 'inline-block'
            },
            events: [{
              change: function (checkbox, value) {
                if (value) {
                  me.selectAll();
                  if (memory) {
                    memory.setAll();
                  }
                }
                else {
                  me.deSelectAll();
                  if (memory) {
                    memory.clearAll();
                  }
                }
              }
            }]
          });
        }
      });
    },
    /*
     *
     */
    selectAll: function () {
      var me = this,
        w = me.widget,
        headerCheckBoxEls = w.el.select('.' + GRID_HEADER_CELL_SELECT_CLS + ' .' + FIELD_CHECKBOX_CLS),
        i = 0,
        iL = w.getViewTotal();

      for (; i < iL; i++) {
        var checkBoxEls = w.el.select('.' + GRID_COLUMN_SELECT_CLS + ' .' + GRID_CELL_CLS + '[index="' + i + '"] .' + FIELD_CHECKBOX_CLS),
          j = 0,
          jL = checkBoxEls.length;

        for (; j < jL; j++) {
          var checkBox = F.getWidget(checkBoxEls.item(j).attr('id'));

          checkBox.setValue(true);
        }

        me.domSelectRow(i);
      }

      headerCheckBoxEls.each(function (item) {
        var checkBox = F.getWidget(item.attr('id'));

        checkBox.setValue(true, false);
      });
    },
    /*
     *
     */
    deSelectAll: function () {
      var me = this,
        w = me.widget,
        i = 0,
        iL = w.getViewTotal();

      for (; i < iL; i++) {
        var checkBoxEls = w.el.select('.' + GRID_COLUMN_SELECT_CLS + ' .' + GRID_CELL_CLS + '[index="' + i + '"] .' + FIELD_CHECKBOX_CLS);

        checkBoxEls.each(function (item) {
          var checkBox = F.getWidget(item.attr('id'));

          checkBox.setValue(false);
        });

        me.domDeSelectRow(i);
      }

      me.clearHeaderCheckBox();
    },
    /*
     *
     */
    clearHeaderCheckBox: function () {
      var me = this,
        w = me.widget,
        headerCheckBoxEls = w.el.select('.' + GRID_HEADER_CELL_SELECT_CLS + ' .' + FIELD_CHECKBOX_CLS);

      headerCheckBoxEls.each(function (item) {
        var checkBox = F.getWidget(item.attr('id'));

        checkBox.setValue(false, false);
      });
    },
    stopSelection: function () {
      this.enabled = false;
    },
    enableSelection: function (value) {
      if (value !== undefined) {
        this.enabled = value;
        return;
      }

      this.enabled = true;
    },
    initFixTrackOver: function(){
      var me = this,
        w = me.widget;

      if(w.columns){
        w.body.el.on('mouseleave', me.onBodyMouseLeave, me);
        w.body.el.on('mouseenter', me.onBodyMouseEnter, me);
      }

      if(w.leftColumns){
        w.leftBody.el.on('mouseleave', me.onLeftBodyMouseLeave, me);
        w.leftBody.el.on('mouseenter', me.onLeftBodyMouseEnter, me);
      }

      if(w.rightColumns){
        w.rightBody.el.on('mouseleave', me.onRightBodyMouseLeave, me);
        w.rightBody.el.on('mouseenter', me.onRightBodyMouseEnter, me);
      }
    },
    onBodyMouseLeave: function () {
      var me = this,
        w = me.widget;

      me.clearBodyTrackCls(w.body);
    },
    onBodyMouseEnter: function () {
      var me = this;

      me.rowTrackFixInBody = true;
      setTimeout(function () {
        me.rowTrackFixInBody = false;
      }, 30);
    },
    onLeftBodyMouseLeave: function () {
      var me = this,
        w = me.widget;

      me.clearBodyTrackCls(w.leftBody);
    },
    onLeftBodyMouseEnter: function () {
      var me = this;

      me.rowTrackFixInBody = true;
      setTimeout(function () {
        me.rowTrackFixInBody = false;
      }, 30);
    },
    onRightBodyMouseLeave: function () {
      var me = this,
        w = me.widget;

      me.clearBodyTrackCls(w.rightBody);
    },
    onRightBodyMouseEnter: function () {
      var me = this;

      me.rowTrackFixInBody = true;
      setTimeout(function () {
        me.rowTrackFixInBody = false;
      }, 30);
    },
    clearBodyTrackCls: function (body) {
      var me = this,
        w = me.widget;

      if(w.cellTrackOver){
        body.el.select('.' + GRID_CELL_OVER_CLS).removeCls(GRID_CELL_OVER_CLS);
      }

      if(w.trackOver){
        delete body.prevCellOver;
        if(me.rowTrackFixInterval){
          clearInterval(me.rowTrackFixInterval);
          delete me.rowTrackFixInterval;
        }

        me.rowTrackFixInterval = setTimeout(function () {
          if(!me.rowTrackFixInBody){
            w.el.select('.' + GRID_ROW_OVER_CLS).removeCls(GRID_ROW_OVER_CLS);
          }
        }, 20);
      }
    }
  });

})();
/*
 * @class Fancy.grid.plugin.Expander
 * @extends Fancy.Plugin
 */
(function () {
  //SHORTCUTS
  var F = Fancy;
  var G = F.get;

  //CONSTANTS
  var GRID_CELL_CLS = F.GRID_CELL_CLS;
  var GRID_COLUMN_CLS = F.GRID_COLUMN_CLS;
  var GRID_ROW_EXPAND_CLS = F.GRID_ROW_EXPAND_CLS;
  var GRID_ROW_EXPAND_OVER_CLS = F.GRID_ROW_EXPAND_OVER_CLS;
  var GRID_ROW_EXPAND_SELECTED_CLS = F.GRID_ROW_EXPAND_SELECTED_CLS;
  var GRID_ROW_OVER_CLS = F.GRID_ROW_OVER_CLS;

  F.define('Fancy.grid.plugin.Expander', {
    extend: F.Plugin,
    ptype: 'grid.expander',
    inWidgetName: 'expander',
    plusScroll: 0,
    /*
     * @constructor
     * @param {Object} config
     */
    constructor: function (config) {
      this.Super('const', arguments);
    },
    /*
     *
     */
    init: function () {
      var me = this;

      me.Super('init', arguments);

      me._expanded = {};
      me._expandedIds = {};
      // For grid grouping
      me.expandedGroups = {};

      me.initTpl();

      me.ons();
    },
    /*
     *
     */
    ons: function () {
      var me = this,
        w = me.widget,
        s = w.store;

      w.on('scroll', me.onScroll, me);
      //w.on('sort', me.onSort, me);
      w.on('beforesort', me.onBeforeSort, me);
      w.on('changepage', me.onChangePage, me);
      w.on('filter', me.onFilter, me);
      w.on('columnresize', me.onColumnReSize, me);

      w.on('rowdblclick', me.onRowDBlClick, me);

      w.on('rowtrackenter', me.onRowTrackOver, me);
      w.on('rowtrackleave', me.onRowTrackLeave, me);

      w.on('collapse', me.onGroupCollapse, me);
      w.on('expand', me.onGroupExpand, me);
      w.on('remove', me.onRemove, me);

      w.on('render', function () {
        w.el.on('mouseenter', me.onExpandRowMouseEnter, me, 'div.' + GRID_ROW_EXPAND_CLS);
        w.el.on('mouseleave', me.onExpandRowMouseLeave, me, 'div.' + GRID_ROW_EXPAND_CLS);
      });

      w.on('select', me.onSelect, me);
      w.on('clearselect', me.onClearSelect, me);

      s.on('beforeinsert', me.onBeforeInsert, me);

      if (me.expanded) {
        if (s.proxyType) {
          w.once('load', function () {
            me.expandAll();
          });
        }
        else {
          w.on('init', function () {
            me.expandAll();
          });
        }
      }
    },
    /*
     * @param {Number} rowIndex
     */
    expand: function (rowIndex) {
      var me = this,
        w = me.widget,
        id = w.get(rowIndex).id;

      if (me._expandedIds[id] === undefined) {
        me._expandedIds[id] = {};
        me.expandRow(Number(rowIndex), id);
        me.addMargin(Number(rowIndex) + 1, id);
      }
      else {
        me.showRow(Number(rowIndex), id);
      }

      delete me._expandedIds[id].hidden;

      me.reSetTop();
      me.reSetPlusScroll();

      var checkBoxEls = w.el.select('.' + GRID_COLUMN_CLS + '[grid="' + w.id + '"] .' + GRID_CELL_CLS + '[index="' + rowIndex + '"] .fancy-checkbox-expander'),
        i = 0,
        iL = checkBoxEls.length;

      for (; i < iL; i++) {
        var checkBox = F.getWidget(checkBoxEls.item(i).attr('id'));

        if (checkBox.get() === false) {
          checkBox.set(true, false);
        }
      }

      me.changeSidesSize();
      me.onSelect();
    },
    /*
     * @param {Number} rowIndex
     */
    collapse: function (rowIndex) {
      var me = this,
        w = me.widget,
        scroller = w.scroller,
        id = w.get(rowIndex).id;

      me.collapseRow(Number(rowIndex), id);
      me.clearMargin(Number(rowIndex) + 1, id);

      me.reSetTop();
      me.reSetPlusScroll();

      me.changeSidesSize();

      scroller.scrollDelta(1);
      scroller.scrollRightKnob();
    },
    /*
     * @param {Number} rowIndex
     * @param {String} id
     */
    collapseRow: function (rowIndex, id) {
      var me = this,
        w = me.widget,
        item = me._expandedIds[id];

      item.el.hide();
      item.hidden = true;

      if (w.leftColumns) {
        item.leftEl.hide();
      }

      if (w.rightColumns) {
        item.rightEl.hide();
      }

      var checkBoxEls = w.el.select('.' + GRID_COLUMN_CLS + '[grid="' + w.id + '"] .' + GRID_CELL_CLS + '[index="' + rowIndex + '"] .fancy-checkbox-expander'),
        i = 0,
        iL = checkBoxEls.length;

      for (; i < iL; i++) {
        var checkBox = F.getWidget(checkBoxEls.item(i).attr('id'));

        if (checkBox.get() === true) {
          checkBox.set(false, false);
          checkBox.collapsedTime = new Date();
        }
      }
    },
    /*
     *
     */
    _hideAllSideExpandedRow: function () {
      var me = this,
        w = me.widget;

      for (var p in me._expandedIds) {
        var item = me._expandedIds[p];

        item.el.hide();
        item.hidden = true;

        if (w.leftColumns) {
          item.leftEl.hide();
        }

        if (w.rightColumns) {
          item.rightEl.hide();
        }
      }
    },
    /*
     *
     */
    expandAll: function () {
      var w = this.widget,
        viewTotal = w.getViewTotal(),
        i = 0;

      for (; i < viewTotal; i++) {
        this.expand(i);
      }
    },
    /*
     * @param {Number} rowIndex
     * @param {String} id
     */
    expandRow: function (rowIndex, id) {
      var me = this,
        w = me.widget,
        el = G(document.createElement('div')),
        item = w.getById(id),
        data = me.prepareData(item),
        html,
        left = -w.scroller.scrollLeft || 0,
        width = w.getCenterFullWidth(),
        height;

      if (me.tpl) {
        html = me.tpl.getHTML(data);
        el.update(html);
      }

      el.addCls(GRID_ROW_EXPAND_CLS);
      el.css({
        left: left,
        width: width
      });
      el.attr('index', rowIndex);

      w.body.el.dom.appendChild(el.dom);

      if (me.render) {
        /*renderTo, data, width*/
        me.render(el.dom, data, w.getCenterFullWidth());
      }

      height = parseInt(el.css('height'));

      me._expandedIds[id].rowIndex = rowIndex;
      me._expandedIds[id].el = el;
      me._expandedIds[id].height = height;
      me._expandedIds[id].width = width;

      if (w.leftColumns) {
        var leftEl = G(document.createElement('div'));

        leftEl.css('left', '0px');
        leftEl.css('height', height);
        leftEl.css('width', w.getLeftFullWidth());
        leftEl.attr('index', rowIndex);

        leftEl.addCls(GRID_ROW_EXPAND_CLS);
        w.leftBody.el.dom.appendChild(leftEl.dom);

        me._expandedIds[id].leftEl = leftEl;
      }

      if (w.rightColumns) {
        var rightEl = G(document.createElement('div'));

        rightEl.css('left', '0px');
        rightEl.css('height', height);
        rightEl.css('width', w.getRightFullWidth());
        rightEl.attr('index', rowIndex);

        rightEl.addCls(GRID_ROW_EXPAND_CLS);
        w.rightBody.el.dom.appendChild(rightEl.dom);

        me._expandedIds[id].rightEl = rightEl;
      }
    },
    /*
     * @param {Number} rowIndex
     * @param {String} id
     */
    addMargin: function (rowIndex, id) {
      var me = this,
        w = me.widget,
        height = me._expandedIds[id].height,
        items = w.el.select('.' + GRID_COLUMN_CLS + '[grid="' + w.id + '"] .' + GRID_CELL_CLS + '[index="' + rowIndex + '"]');

      items.css('margin-top', height);
    },
    /*
     * @param {Number} rowIndex
     * @param {String} id
     */
    clearMargin: function (rowIndex, id) {
      var w = this.widget;

      w.el.select('.' + GRID_COLUMN_CLS + '[grid="' + w.id + '"] .' + GRID_CELL_CLS + '[index="' + rowIndex + '"]').css('margin-top', '0');
    },
    /*
     *
     */
    onBeforeSort: function () {
      this.reSet();
    },
    /*
     *
     */
    onChangePage: function () {
      this.reSet();
    },
    /*
     *
     */
    onFilter: function () {
      this.reSet();
    },
    /*
     *
     */
    onRemove: function () {
      this.reSet();
    },
    /*
     *
     */
    reSet: function () {
      var me = this,
        w = me.widget;

      for (var p in me._expandedIds) {
        var item = me._expandedIds[p];

        item.el.destroy();
        me.clearMargin(Number(item.rowIndex) + 1, p);
      }

      me._hideAllSideExpandedRow();

      me._expandedIds = {};

      me.reSetTop();
      me.reSetPlusScroll();
      me.changeSidesSize();
      w.scroller.scrollDelta(1);
    },
    /*
     * @param {Number} rowIndex
     * @param {String} id
     */
    showRow: function (rowIndex, id) {
      var me = this,
        w = me.widget,
        item = me._expandedIds[id];

      item.el.show();

      if (w.leftColumns) {
        item.leftEl.show();
      }

      if (w.rightColumns) {
        item.rightEl.show();
      }

      me.addMargin(rowIndex + 1, id);
    },
    /*
     * @param {Number} rowIndex
     * @return {Number}
     */
    getBeforeHeight: function (rowIndex) {
      var height = 0;

      for (var p in this._expandedIds) {
        var item = this._expandedIds[p];

        if (item.rowIndex < rowIndex && !item.hidden && item.el.css('display') !== 'none') {
          height += item.height;
        }
      }

      return height;
    },
    /*
     * @param {Boolean} [grouping]
     */
    reSetTop: function (grouping) {
      var me = this,
        w = me.widget,
        cellHeight = w.cellHeight,
        top = -w.scroller.scrollTop || 0,
        left = -w.scroller.scrollLeft || 0;

      if (w.grouping) {
        me.expandedGroups = {};
        var expanded = w.grouping.expanded;

        for (var p in expanded) {
          me.expandedGroups[p] = me.expandedGroups[p] || {};
        }
      }

      for (var p in me._expandedIds) {
        var item = me._expandedIds[p];

        if (item.el.css('display') === 'none') {
          continue;
        }

        //BUG: item.rowIndex has wrong value, if it has collapsed rows on top

        var beforeHeight = me.getBeforeHeight(item.rowIndex),
          rowIndex = me.getDisplayedRowsBefore(item, p),
          _top = top + (rowIndex) * cellHeight + beforeHeight;

        if (w.grouping) {
          var id = p,
            groupName = w.grouping.getGroupById(id),
            orderIndex = w.grouping.getGroupOrderIndex(groupName);

          if (item.el.css('display') !== 'none') {
            me.expandedGroups[groupName] = me.expandedGroups[groupName] || {};
            me.expandedGroups[groupName][p] = item;

            _top += (orderIndex + 1) * w.groupRowHeight;
          }
        }

        item.el.css({
          top: _top,
          left: left
        });

        if (w.leftColumns) {
          item.leftEl.css('top', _top);
        }

        if (w.rightColumns) {
          item.rightEl.css('top', _top);
        }
      }

      if (w.grouping && grouping !== false) {
        w.grouping.setPositions();
        w.grouping.setExpanderCellsPosition();
      }
    },
    /*
     * @param {Object} item
     * @param {String|Number} id
     * @return {Number}
     */
    getDisplayedRowsBefore: function (item, id) {
      var w = this.widget;

      if (w.grouping) {
        var rowIndex = 0;

        if (item.el.css('display') !== 'none') {
          rowIndex = w.store.getRow(id);
        }

        return rowIndex + 1;
      }

      return item.rowIndex + 1;
    },
    /*
     *
     */
    onScroll: function () {
      this.reSetTop();
    },
    /*
     *
     */
    reSetPlusScroll: function () {
      var me = this,
        w = me.widget;

      me.plusScroll = me.getPlusHeight();
      w.scroller.setRightKnobSize();

      setTimeout(function () {
        if (w.scroller.isRightScrollable() === false) {
          w.scroller.scroll(0);
        }
      }, 1);
    },
    /*
     * @return {Number}
     */
    getPlusHeight: function () {
      var me = this,
        plusHeight = 0;

      for (var p in me._expandedIds) {
        var item = me._expandedIds[p];

        if (!item.hidden && item.el.css('display') !== 'none') {
          plusHeight += item.height;
        }
      }

      me.plusHeight = plusHeight;

      return me.plusHeight;
    },
    /*
     *
     */
    onColumnReSize: function () {
      var me = this,
        w = me.widget;

      for (var p in me._expandedIds) {
        var item = me._expandedIds[p],
          width = w.getCenterFullWidth();

        item.el.css('width', width);

      }
    },
    /*
     * @param {Object} item
     * @return {Object}
     */
    prepareData: function (item) {
      var me = this,
        w = me.widget,
        data = item.data;

      if (me.dataFn) {
        data = me.dataFn(w, data);
      }

      return data;
    },
    /*
     *
     */
    changeSidesSize: function () {
      var w = this.widget;

      w.setSidesHeight();
      w.scroller.checkRightScroll();
    },
    /*
     * @param {Fancy.Grid} grid
     * @param {Object} o
     */
    onRowDBlClick: function (grid, o) {
      var me = this,
        w = me.widget,
        rowIndex = Number(o.rowIndex),
        id = o.id,
        item = me._expandedIds[id];

      if (w.edit) {
        w.un('rowdblclick', me.onRowDBlClick, me);
        return;
      }

      if (item === undefined) {
        me.expand(rowIndex);
      }
      else {
        if (item.hidden === true && item.el.css('display') === 'none') {
          me.expand(rowIndex);
        }
        else {
          me.collapse(rowIndex);
        }
      }
    },
    /*
     * @param {Fancy.Grid} grid
     * @param {Object} o
     */
    onRowTrackOver: function (grid, o) {
      var me = this,
        w = me.widget,
        item = me._expandedIds[o.id];

      if (item) {
        item.el.addCls(GRID_ROW_EXPAND_OVER_CLS);

        if (w.leftColumns) {
          item.leftEl.addCls(GRID_ROW_EXPAND_OVER_CLS);
        }

        if (w.rightColumns) {
          item.rightEl.addCls(GRID_ROW_EXPAND_OVER_CLS);
        }
      }
    },
    /*
     * @param {Fancy.Grid} grid
     * @param {Object} o
     */
    onRowTrackLeave: function (grid, o) {
      var me = this,
        w = me.widget,
        item = me._expandedIds[o.id];

      if (item) {
        item.el.removeCls(GRID_ROW_EXPAND_OVER_CLS);

        if (w.leftColumns) {
          item.leftEl.removeCls(GRID_ROW_EXPAND_OVER_CLS);
        }

        if (w.rightColumns) {
          item.rightEl.removeCls(GRID_ROW_EXPAND_OVER_CLS);
        }
      }
    },
    /*
     * @param {Object} e
     */
    onExpandRowMouseEnter: function (e) {
      var me = this,
        w = me.widget,
        scroller = w.scroller,
        expandRowEl = G(e.currentTarget),
        index = expandRowEl.attr('index');

      w.el.select('.' + GRID_ROW_EXPAND_CLS + '[index="' + index + '"]').addCls(GRID_ROW_EXPAND_OVER_CLS);

      if (!w.trackOver || scroller.bottomKnobDown || scroller.rightKnobDown) {
      }
      else {
        w.el.select('.' + GRID_COLUMN_CLS + '[grid="' + w.id + '"] .' + GRID_CELL_CLS + '[index="' + index + '"]').addCls(GRID_ROW_OVER_CLS);
      }
    },
    /*
     * @param {Object} e
     */
    onExpandRowMouseLeave: function (e) {
      var me = this,
        w = me.widget,
        scroller = w.scroller,
        expandRowEl = G(e.currentTarget),
        index = expandRowEl.attr('index');

      w.el.select('.' + GRID_ROW_EXPAND_CLS + '[index="' + index + '"]').removeCls(GRID_ROW_EXPAND_OVER_CLS);

      if (!w.trackOver || scroller.bottomKnobDown || scroller.rightKnobDown) {
      }
      else {
        w.el.select('.' + GRID_COLUMN_CLS + '[grid="' + w.id + '"] .' + GRID_CELL_CLS + '[index="' + index + '"]').removeCls(GRID_ROW_OVER_CLS);
      }
    },
    /*
     *
     */
    onSelect: function () {
      var me = this,
        w = me.widget,
        selection = w.selection;

      if (!selection || (!selection.row && !selection.rows)) {
        return;
      }

      me.onClearSelect();

      selection = w.getSelection(true);
      var rows = selection.rows,
        i = 0,
        iL = rows.length;

      for (; i < iL; i++) {
        var rowIndex = rows[i];

        w.el.select('.' + GRID_ROW_EXPAND_CLS + '[index="' + rowIndex + '"]').addCls(GRID_ROW_EXPAND_SELECTED_CLS);
      }
    },
    /*
     *
     */
    onClearSelect: function () {
      var me = this,
        w = me.widget,
        selection = w.selection;

      if (!selection.row && !selection.rows) {
        return;
      }

      selection = w.getSelection(true);

      var shouldBeSelected = {},
        rows = selection.rows,
        i = 0,
        iL = rows.length;

      for (; i < iL; i++) {
        shouldBeSelected[rows[i]] = true;
      }

      var selected = w.el.select('.' + GRID_ROW_EXPAND_SELECTED_CLS),
        i = 0,
        iL = selected.length;

      for (; i < iL; i++) {
        var index = selected.item(i).attr('index');

        if (!shouldBeSelected[index]) {
          w.el.select('.' + GRID_ROW_EXPAND_CLS + '[index="' + index + '"]').removeCls(GRID_ROW_EXPAND_SELECTED_CLS);
        }
      }
    },
    /*
     * @param {Fancy.Grid} grid
     * @param {Number} index
     * @param {String} groupName
     */
    onGroupCollapse: function (grid, index, groupName) {
      var me = this,
        w = me.widget,
        expandedGroups = me.expandedGroups;

      if (expandedGroups[groupName]) {
        var items = expandedGroups[groupName];

        for (var q in items) {
          var item = items[q];

          if (me._expandedIds[q]) {
            delete me._expandedIds[q];
          }

          item.el.hide();
          if (item.leftEl.dom) {
            item.leftEl.hide();
          }

          if (item.rightEl.dom) {
            item.rightEl.hide();
          }
        }
      }

      me.reSetTop(false);
      me.reSetIndexes();
      setTimeout(function () {
        w.grouping.setExpanderCellsPosition();
      }, 1);
    },
    /*
     * @param {Fancy.Grid} grid
     * @param {Number} index
     * @param {String} groupName
     */
    onGroupExpand: function (grid, index, groupName) {
      var me = this,
        w = me.widget;

      me.reSetTop(false);
      me.reSetIndexes();
      setTimeout(function () {
        w.grouping.setExpanderCellsPosition();
      }, 1);
    },
    /*
     *
     */
    reSetIndexes: function () {
      var me = this,
        w = me.widget,
        s = w.store;

      for (var id in me._expandedIds) {
        me._expandedIds[id].rowIndex = s.getRow(id);
      }
    },
    onAdd: function(){
      this.reSet();
    },
    onBeforeInsert: function(){
      this.reSet();
    }
  });

})();
/*
 * @class Fancy.grid.plugin.GroupHeader
 * @extends Fancy.Plugin
 */
Fancy.define('Fancy.grid.plugin.GroupHeader', {
  extend: Fancy.Plugin,
  ptype: 'grid.groupheader',
  inWidgetName: 'groupheader',
  /*
   * @constructor
   * @param {Object} config
   */
  constructor: function(config){
    this.Super('const', arguments);
  },
  /*
   *
   */
  init: function(){
    this.Super('init', arguments);

    this.ons();
  },
  /*
   *
   */
  ons: function(){}
});
/*
 * @class Fancy.grid.plugin.Grouping
 * @extend Fancy.Plugin
 */
(function () {
  //SHORTCUTS
  var F = Fancy;
  var E = Fancy.each;

  //CONSTANTS
  var GRID_ROW_GROUP_INNER_CLS = F.GRID_ROW_GROUP_INNER_CLS;
  var GRID_ROW_GROUP_CLS = F.GRID_ROW_GROUP_CLS;
  var GRID_ROW_GROUP_COLLAPSED_CLS = F.GRID_ROW_GROUP_COLLAPSED_CLS;
  var GRID_CELL_CLS = F.GRID_CELL_CLS;

  F.define('Fancy.grid.plugin.Grouping', {
    extend: F.Plugin,
    ptype: 'grid.grouping',
    inWidgetName: 'grouping',
    tpl: '{text}:{number}',
    _renderFirstTime: true,
    /*
     * @constructor
     * @param {Object} config
     */
    constructor: function (config) {
      this.Super('const', arguments);
    },
    /*
     *
     */
    init: function () {
      var me = this,
        w = me.widget;

      me.Super('init', arguments);

      me._expanded = {};

      me.initTpl();
      me.initGroups();
      me.initOrder();
      me.calcPlusScroll();
      me.configParams();

      me.ons();

      if (!me.collapsed && w.store.data) {
        setTimeout(function () {
          w.store.changeDataView({
            doNotFired: true
          });

          w.update();
        }, 100);
      }
    },
    /*
     *
     */
    ons: function () {
      var me = this,
        w = me.widget,
        s = w.store;

      w.once('render', function () {
        me.renderGroupedRows();
        me.update();

        w.el.on('click', me.onClick, me, 'div.' + GRID_ROW_GROUP_CLS);
        w.el.on('mousedown', me.onMouseDown, me, 'div.' + GRID_ROW_GROUP_CLS);
        w.on('scroll', me.onScroll, me);

        w.on('columnresize', me.onColumnResize, me);

        s.on('insert', me.onInsert, me);
        s.on('remove', me.onRemove, me);

        w.on('columndrag', me.onColumnDrag, me);
      });
    },
    onInsert: function () {
      this.reGroup();
    },
    onRemove: function () {
      var me = this,
        w = me.widget,
        s = w.store,
        groups = me.groups;

      me.initGroups();
      me.update();
      me.updateGroupRowsText();

      if (groups.length > me.groups.length) {
        var removedGroup;

        E(groups, function (group, i) {
          if (group !== me.groups[i]) {
            removedGroup = group;
            return true;
          }
        });

        delete s.expanded[removedGroup];
        delete me.expanded[removedGroup];
        delete me._expanded[removedGroup];
      }
    },
    /*
     * @param {String} [dataProperty]
     */
    initGroups: function (dataProperty) {
      var me = this,
        w = me.widget,
        s = w.store,
        o = s.initGroups(dataProperty);

      me.groups = o.groups;
      me.groupsCounts = o._groups;
    },
    /*
     * @param {String|Number} id
     * @return {String}
     */
    getGroupById: function (id) {
      var w = this.widget,
        s = w.store;

      return s.groupMap[id];
    },
    /*
     * @param {String} group
     * @return {Number}
     */
    getGroupOrderIndex: function (group) {
      var groups = this.groups,
        i = 0,
        iL = groups.length;

      for (; i < iL; i++) {
        if (groups[i] === group) {
          return i
        }
      }
    },
    /*
     *
     */
    initOrder: function () {
      var me = this,
        w = me.widget,
        s = w.store,
        groups = [],
        i,
        iL,
        groupNameUpperCase = {},
        upperGroups = [];

      if (me.order && me.order.length !== 0) {
        switch (F.typeOf(me.order)) {
          case 'string':
            //TODO
            break;
          case 'array':
            //TODO
            break;
        }
      }
      else {
        groups = me.groups;
        i = 0;
        iL = groups.length;

        E(groups, function (group) {
          var upperGroup = group.toLocaleUpperCase();

          groupNameUpperCase[upperGroup] = group;
          upperGroups.push(upperGroup);
        });

        upperGroups = upperGroups.sort();

        for (; i < iL; i++) {
          groups[i] = groupNameUpperCase[upperGroups[i]];
        }
      }

      me.groups = groups;
      s.changeOrderByGroups(groups, me.by);
    },
    /*
     *
     */
    calcPlusScroll: function () {
      var w = this.widget;

      this.plusScroll = this.groups.length * w.groupRowHeight;
    },
    /*
     *
     */
    configParams: function () {
      var me = this,
        w = me.widget,
        s = w.store;

      me.expanded = me.expanded || {};
      s.expanded = s.expanded || {};

      if (me.collapsed) {
        s.collapsed = true;
      }
      else {
        E(me.groups, function (group) {
          if (me.expanded[group] === undefined) {
            s.expanded[group] = true;
            me.expanded[group] = true;
            me._expanded[group] = true;
          }
        });
      }
    },
    /*
     *
     */
    renderGroupedRows: function () {
      var me = this,
        w = me.widget,
        body = w.body,
        leftBody = w.leftBody,
        rightBody = w.rightBody,
        width = w.getCenterFullWidth(),
        leftWidth = w.getLeftFullWidth(),
        rightWidth = w.getRightFullWidth(),
        el,
        passedTop = 0;

      E(me.groups, function (groupText) {
        var groupCount = me.groupsCounts[groupText];

        if (leftWidth) {
          el = me.generateGroupRow(groupText, groupCount, true, passedTop);
          el.css('width', leftWidth);
          leftBody.el.dom.appendChild(el.dom);

          el = me.generateGroupRow(groupText, groupCount, false, passedTop);
          el.css('width', width);
          body.el.dom.appendChild(el.dom);
        }
        else {
          el = me.generateGroupRow(groupText, groupCount, true, passedTop);
          el.css('width', width);
          body.el.dom.appendChild(el.dom);
        }

        if (rightWidth) {
          el = me.generateGroupRow(groupText, groupCount, false, passedTop);
          el.css('width', rightWidth);
          rightBody.el.dom.appendChild(el.dom);
        }

        if (me.collapsed) {
          passedTop += w.groupRowHeight;
        }
      });
    },
    /*
     *
     */
    removeGroupRows: function () {
      var me = this,
        w = me.widget,
        columns = w.columns,
        leftColumns = w.leftColumns,
        rightColumns = w.rightColumns,
        body = w.body,
        leftBody = w.leftBody,
        rightBody = w.rightBody;

      if (columns.length) {
        body.el.select('.' + GRID_ROW_GROUP_CLS).remove();
      }

      if (leftColumns.length) {
        leftBody.el.select('.' + GRID_ROW_GROUP_CLS).remove();
      }

      if (rightColumns.length) {
        rightBody.el.select('.' + GRID_ROW_GROUP_CLS).remove();
      }
    },
    /*
    *
    */
    removeLastGroupRow: function () {
      var me = this,
        w = me.widget,
        columns = w.columns,
        groups = me.groups,
        lastItemIndex = groups.length,
        leftColumns = w.leftColumns,
        rightColumns = w.rightColumns,
        body = w.body,
        leftBody = w.leftBody,
        rightBody = w.rightBody;

      if (columns.length) {
        var el = body.el.select('.' + GRID_ROW_GROUP_CLS).item(lastItemIndex);
        el.remove();
      }

      if (leftColumns.length) {
        leftBody.el.select('.' + GRID_ROW_GROUP_CLS).item(lastItemIndex).remove();
      }

      if (rightColumns.length) {
        rightBody.el.select('.' + GRID_ROW_GROUP_CLS).item(lastItemIndex).remove();
      }
    },
    /*
     *
     */
    removeCells: function () {
      var me = this,
        w = me.widget,
        columns = w.columns,
        leftColumns = w.leftColumns,
        rightColumns = w.rightColumns,
        body = w.body,
        leftBody = w.leftBody,
        rightBody = w.rightBody;

      if (columns.length) {
        body.el.select('.' + GRID_CELL_CLS).remove();
      }

      if (leftColumns.length) {
        leftBody.el.select('.' + GRID_CELL_CLS).remove();
      }

      if (rightColumns.length) {
        rightBody.el.select('.' + GRID_CELL_CLS).remove();
      }
    },
    /*
     * @param {String} groupText
     * @param {Number} groupCount
     * @param {Boolean} addText
     * @param {Number} top
     */
    generateGroupRow: function (groupText, groupCount, addText, top) {
      var me = this,
        el = F.get(document.createElement('div'));

      el.addCls(GRID_ROW_GROUP_CLS);
      el.attr('group', groupText);
      if (addText) {
        var text = me.tpl.getHTML({
          text: groupText,
          number: groupCount
        });
        el.update('<div class="' + GRID_ROW_GROUP_INNER_CLS + '"> ' + text + '</div>');
      }

      if (me.collapsed) {
        el.css('top', top + 'px');
        el.addCls(GRID_ROW_GROUP_COLLAPSED_CLS);
      }
      else {
        el.css('top', '0px');
      }

      return el;
    },
    /*
     *
     */
    insertGroupEls: function () {
      var me = this,
        w = me.widget,
        leftBody = w.leftBody,
        body = w.body;

      if (w.leftColumns.length) {
        leftBody.el.select('.' + GRID_ROW_GROUP_CLS).each(function (el) {
          var groupText = me.groups[i];

          el.update('<div class="' + GRID_ROW_GROUP_INNER_CLS + '">' + groupText + '</div>');
        });
      }
      else {
        body.el.select('.' + GRID_ROW_GROUP_CLS).each(function (el, i) {
          var groupText = me.groups[i],
            groupCount = me.groupsCounts[groupText],
            text = me.tpl.getHTML({
              text: groupText,
              number: groupCount
            });

          el.update('<div class="' + GRID_ROW_GROUP_INNER_CLS + '">' + text + '</div>');
        });
      }
    },
    /*
     * @param {Object} e
     */
    onClick: function (e) {
      var me = this,
        w = me.widget,
        rowEl = F.get(e.currentTarget),
        isCollapsed,
        group = rowEl.attr('group');

      w.el.select('.' + GRID_ROW_GROUP_CLS + '[group="' + group + '"]').toggleCls(GRID_ROW_GROUP_COLLAPSED_CLS);

      isCollapsed = rowEl.hasCls(GRID_ROW_GROUP_COLLAPSED_CLS);

      if (isCollapsed) {
        me.collapse(me.by, group);
      }
      else {
        me.expand(me.by, group);
      }

      //update works very slow in this case
      //it needs some fast solution without update
      //me.fastCollapse();
      me.update();
    },
    /*
     *
     */
    fastCollapse: function () {
    },
    /*
     * @param {Object} e
     */
    onMouseDown: function (e) {
      e.preventDefault();
    },
    /*
     *
     */
    onScroll: function () {
      this.setPositions();
    },
    /*
     * @param {String} group
     * @param {String} value
     */
    collapse: function (group, value) {
      var me = this,
        w = me.widget,
        s = w.store;

      s.collapse(group, value);
      delete me._expanded[value];
      delete me.expanded[value];

      w.fire('collapse', group, value);
    },
    /*
     * @param {String} group
     * @param {String} value
     */
    expand: function (group, value) {
      var me = this,
        w = me.widget,
        s = w.store;

      s.expand(group, value);
      me._expanded[value] = true;
      me.expanded[value] = true;

      w.fire('expand', group, value);
    },
    /*
     *
     */
    setPositions: function () {
      var me = this,
        w = me.widget,
        top = -w.scroller.scrollTop || 0,
        leftRows = w.leftBody.el.select('.' + GRID_ROW_GROUP_CLS),
        rows = w.body.el.select('.' + GRID_ROW_GROUP_CLS),
        rightRows = w.rightBody.el.select('.' + GRID_ROW_GROUP_CLS);

      E(me.groups, function (groupName, i) {
        if (leftRows.length) {
          leftRows.item(i).css('top', top + 'px');
        }

        if (rows.length) {
          rows.item(i).css('top', top + 'px');
        }

        if (rightRows.length) {
          rightRows.item(i).css('top', top + 'px');
        }

        if (w.expander) {
          var expanded = w.expander.expandedGroups[groupName];

          for (var p in expanded) {
            var item = expanded[p];

            top += parseInt(item.el.css('height'));
          }
        }

        top += w.groupRowHeight;

        if (me._expanded[groupName] === true) {
          top += me.groupsCounts[groupName] * w.cellHeight;
        }
      });
    },
    /*
     * @param {Number} index
     * @param {String} side
     */
    setCellsPosition: function (index, side) {
      var me = this,
        w = me.widget,
        i = 0,
        iL = me.groups.length,
        j = 0,
        jL,
        body = w.body,
        leftBody = w.leftBody,
        rightBody = w.rightBody,
        row = 0,
        top = w.groupRowHeight,
        rows = [],
        cell,
        marginedRows = {},
        rowExpanderGroupMargined = {},
        by = me.by;

      for (; i < iL; i++) {
        var groupName = me.groups[i];

        if (me._expanded[groupName] === true) {
          rows.push(row);
          marginedRows[row] = true;

          if (side === undefined || side === 'center') {
            j = 0;
            jL = w.columns.length;

            if (index !== undefined) {
              j = index;
              jL = index + 1;
            }

            if (w.expander) {
              var dataItem = w.get(row),
                _itemGroupName = dataItem.get(by),
                expandedGroups = w.expander.expandedGroups,
                groupOrderIndex = me.getGroupOrderIndex(groupName),
                plusHeight = 0;

              for (var p in expandedGroups) {
                var _groupOrderIndex = me.getGroupOrderIndex(p);

                if (groupOrderIndex <= _groupOrderIndex) {
                  continue;
                }

                var groupItems = expandedGroups[p];

                for (var q in groupItems) {
                  var _item = groupItems[q];

                  if (_item.el.css('display') !== 'none' && !rowExpanderGroupMargined[q]) {
                    var prevRow = row - 1;
                    if (row < 0) {
                      row = 0;
                    }
                    prevRow = w.get(prevRow);
                    var prevRowGroupName = prevRow.get(by);
                    if (_itemGroupName !== prevRowGroupName) {
                      if (prevRow.id === q) {
                        rowExpanderGroupMargined[q] = true;
                        plusHeight += parseInt(_item.el.css('height'));
                      }
                    }
                    else {
                      rowExpanderGroupMargined[q] = true;
                      plusHeight += parseInt(_item.el.css('height'));
                    }
                  }
                }
              }

              top += plusHeight;

              cell = body.getCell(row, j);

              for (; j < jL; j++) {
                cell = body.getCell(row, j);
                cell.css('margin-top', top + 'px');
              }
            }
            else {
              for (; j < jL; j++) {
                cell = body.getCell(row, j);

                cell.css('margin-top', top + 'px');
              }
            }
          }

          if (side === undefined || side === 'left') {
            j = 0;
            jL = w.leftColumns.length;

            if (index !== undefined) {
              j = index;
              jL = index + 1;
            }

            for (; j < jL; j++) {
              cell = leftBody.getCell(row, j);

              cell.css('margin-top', top + 'px');
            }
          }

          if (side === undefined || side === 'right') {
            j = 0;
            jL = w.rightColumns.length;

            if (index !== undefined) {
              j = index;
              jL = index + 1;
            }

            for (; j < jL; j++) {
              cell = rightBody.getCell(row, j);

              cell.css('margin-top', top + 'px');
            }
          }

          row += me.groupsCounts[groupName];
          top = w.groupRowHeight;
        }
        else {
          top += w.groupRowHeight;
        }
      }

      if (me._renderFirstTime) {
        me._renderFirstTime = false;
      }
      else {
        var toClearMargins = [];

        E(me.prevRows, function (rowIndex) {
          if (marginedRows[rowIndex] !== true) {
            toClearMargins.push(rowIndex);
          }
        });

        me.clearMargins(toClearMargins);
      }

      me.prevRows = rows;
    },
    /*
     * It is used only to collapse groups of 'grouping row' with 'row expander'.
     */
    setExpanderCellsPosition: function () {
      var me = this,
        w = me.widget,
        s = w.store,
        dataView = s.dataView,
        body = w.body,
        leftBody = w.leftBody,
        rightBody = w.rightBody,
        cell,
        expandedGroups = w.expander.expandedGroups,
        groupsCounts = me.groupsCounts,
        dataItem,
        top = w.groupRowHeight,
        rowIndex = 0,
        nextPlusTop = 0;

      E(me.groups, function (groupName) {
        if (me._expanded[groupName] === true) {
          var iL = rowIndex + groupsCounts[groupName];

          for (; rowIndex < iL; rowIndex++) {
            dataItem = dataView[rowIndex];
            if (!dataItem) {
              continue;
            }

            var dataItemId = dataItem.id,
              expandedItem = expandedGroups[groupName][dataItemId];

            if (nextPlusTop) {
              top += nextPlusTop;
              nextPlusTop = 0;
            }

            if (expandedItem) {
              nextPlusTop = parseInt(expandedItem.el.css('height'));
            }

            E(w.columns, function (column, i) {
              cell = body.getCell(rowIndex, i);
              cell.css('margin-top', top + 'px');
            });

            E(w.leftColumns, function (column, i) {
              cell = leftBody.getCell(rowIndex, i);
              cell.css('margin-top', top + 'px');
            });

            E(w.rightColumns, function (column, i) {
              cell = rightBody.getCell(rowIndex, i);
              cell.css('margin-top', top + 'px');
            });

            top = 0;
          }

          top = w.groupRowHeight;
        }
        else {
          top += w.groupRowHeight;
        }
      });
    },
    /*
     * @params {Array|undefined} rows
     */
    clearMargins: function (rows) {
      var me = this,
        rows = rows || me.prevRows;

      if (rows === undefined) {
        return;
      }

      var w = me.widget,
        body = w.body,
        leftBody = w.leftBody,
        rightBody = w.rightBody,
        cell;

      E(rows, function (row) {
        E(w.columns, function (column, j) {
          cell = body.getCell(row, j);
          if (cell.dom === undefined) {
            return true;
          }

          cell.css('margin-top', '0px');
        });

        E(w.leftColumns, function (column, j) {
          cell = leftBody.getCell(row, j);

          if (cell.dom === undefined) {
            return true;
          }

          cell.css('margin-top', '0px');
        });

        E(w.rightColumns, function (column, j) {
          cell = rightBody.getCell(row, j);

          if (cell.dom === undefined) {
            return true;
          }

          cell.css('margin-top', '0px');
        });
      });
    },
    /*
     *
     */
    onColumnResize: function () {
      this.updateGroupRows();
    },
    /*
     *
     */
    updateGroupRows: function () {
      var me = this,
        w = me.widget,
        leftColumns = w.leftColumns,
        rightColumns = w.rightColumns,
        body = w.body,
        leftBody = w.leftBody,
        rightBody = w.rightBody,
        width = 0;

      width += w.getCenterFullWidth();

      body.el.select('.' + GRID_ROW_GROUP_CLS).css('width', width + 'px');

      width += w.getLeftFullWidth();

      if (leftColumns.length) {
        leftBody.el.select('.' + GRID_ROW_GROUP_CLS).css('width', width + 'px');
      }

      width += w.getRightFullWidth();

      if (rightColumns.length) {
        rightBody.el.select('.' + GRID_ROW_GROUP_CLS).css('width', width + 'px');
      }
    },
    /*
     * @param {Boolean} loaded
     */
    update: function (loaded) {
      var me = this,
        w = me.widget,
        s = w.store;

      if (!loaded && (s.loading === true || s.autoLoad === false) && !s.data.length) {
        //s.once('load', function(){
        s.on('load', function () {
          me.initGroups();
          me.initOrder();
          me.calcPlusScroll();
          me.configParams();
          s.changeDataView({
            doNotFired: true
          });

          me.renderGroupedRows();
          me.update(true);
        }, me);
      }
      else if (loaded && s.data.length && s.loadedTimes > 1) {
        me.reGroup();
      }
      else {
        me.setPositions();
        w.update();
        w.scroller.update();
        me.setCellsPosition();
        w.setSidesHeight();
      }
    },
    /*
     * @param {Number} rowIndex
     * @return {Number}
     */
    getOffsetForRow: function (rowIndex) {
      var me = this,
        w = me.widget,
        top = 0,
        rows = 0;

      E(me.groups, function (groupName) {
        top += w.groupRowHeight;

        if (me._expanded[groupName] === true) {
          rows += me.groupsCounts[groupName];
        }

        if (rowIndex < rows) {
          return true;
        }
      });

      return top;
    },
    /*
     * @param {Number} rowIndex
     * @return {Number}
     */
    getSpecialRowsUnder: function (rowIndex) {
      var me = this,
        w = me.widget,
        top = 0,
        rows = 0,
        rowsAfter = 0;

      E(me.groups, function (groupName) {
        if (rowIndex < rows) {
          rowsAfter++;
        }

        top += w.groupRowHeight;

        if (me._expanded[groupName] === true) {
          rows += me.groupsCounts[groupName];
        }
      });

      return rowsAfter;
    },
    /*
     *
     */
    reGroup: function () {
      var me = this,
        w = me.widget,
        s = w.store,
        dataProperty = 'data';

      me.expanded = {};
      me._expanded = {};
      w.store.expanded = {};
      w.store.dataView = [];

      me.collapsed = true;

      if (w.store.filteredData) {
        dataProperty = 'filteredData';
      }

      me.removeGroupRows();
      me.removeCells();

      me.initGroups(dataProperty);
      if (s.remoteFilter) {
        me.initOrder();
      }
      me.calcPlusScroll();
      me.configParams();
      me.renderGroupedRows();
      w.setSidesHeight();
    },
    /*
     * @param {Number} value
     */
    scrollLeft: function (value) {
      this.widget.body.el.select('.' + GRID_ROW_GROUP_CLS).css('left', value);
    },
    /*
     *
     */
    updateGroupRowsText: function () {
      var me = this,
        w = me.widget,
        groups = me.groups,
        leftBody = w.leftBody,
        body = w.body,
        rightBody = w.rightBody,
        leftGroupInnerEls = leftBody.el.select('.' + GRID_ROW_GROUP_INNER_CLS),
        groupElInners = body.el.select('.' + GRID_ROW_GROUP_INNER_CLS),
        leftGroupEls = leftBody.el.select('.' + GRID_ROW_GROUP_CLS),
        groupEls = body.el.select('.' + GRID_ROW_GROUP_CLS),
        rightGroupEls = rightBody.el.select('.' + GRID_ROW_GROUP_CLS);

      E(groups, function (groupText, i) {
        var groupCount = me.groupsCounts[groupText],
          text = me.tpl.getHTML({
            text: groupText,
            number: groupCount
          }),
          groupEl;

        if (w.leftColumns.length) {
          leftGroupInnerEls.item(i).update(text);
          groupEl = leftGroupEls.item(i);
          groupEl.attr('group', groupText);

          if (me.expanded[groupText]) {
            groupEl.removeClass(GRID_ROW_GROUP_COLLAPSED_CLS);
          }
          else {
            groupEl.addClass(GRID_ROW_GROUP_COLLAPSED_CLS);
          }
        }
        else {
          groupElInners.item(i).update(text);
          groupEl = groupEls.item(i);

          if (me.expanded[groupText]) {
            groupEl.removeClass(GRID_ROW_GROUP_COLLAPSED_CLS);
          }
          else {
            groupEl.addClass(GRID_ROW_GROUP_COLLAPSED_CLS);
          }
        }

        groupEls.item(i).attr('group', groupText);

        if (w.rightColumns.length) {
          rightGroupEls.item(i).attr('group', groupText);
        }
      });

      if (groups.length < body.el.select('.' + GRID_ROW_GROUP_CLS).length) {
        setTimeout(function () {
          me.removeLastGroupRow();
        }, 10);
      }
    },
    onColumnDrag: function () {
      var me = this,
        w = me.widget,
        groupRowEls = w.el.select('.' + GRID_ROW_GROUP_CLS);

      if(!w.leftColumns.length && groupRowEls.length){
        groupRowEls.destroy();
        me.renderGroupedRows();
        me.update();
      }
    }
  });

})();
/*
 * @class Fancy.grid.plugin.ColumnDrag
 * @extend Fancy.Plugin
 */
(function () {
  //SHORTCUTS
  var F = Fancy;
  var DOC = F.get(document);

  //CONSTANTS
  var HIDDEN_CLS = F.HIDDEN_CLS;
  var GRID_HEADER_CELL_CLS = F.GRID_HEADER_CELL_CLS;
  var GRID_HEADER_CELL_TRIGGER_CLS = F.GRID_HEADER_CELL_TRIGGER_CLS;
  var GRID_HEADER_CELL_GROUP_LEVEL_1_CLS = F.GRID_HEADER_CELL_GROUP_LEVEL_1_CLS;
  var GRID_HEADER_CELL_GROUP_LEVEL_2_CLS = F.GRID_HEADER_CELL_GROUP_LEVEL_2_CLS;

  F.define('Fancy.grid.plugin.ColumnDrag', {
    extend: F.Plugin,
    ptype: 'grid.columndrag',
    inWidgetName: 'columndrag',
    activeSide: undefined,
    activeCell: undefined,
    activeIndex: undefined,
    activeColumn: undefined,
    inCell: undefined,
    inIndex: undefined,
    inSide: undefined,
    ok: false,
    status: 'none', //none/dragging
    /*
     * @param {Object} config
     */
    constructor: function (config) {
      this.Super('const', arguments);
    },
    /*
     *
     */
    init: function () {
      var me = this,
        w = me.widget;

      me.Super('init', arguments);

      w.on('render', function(){
        me.ons();
        me.initHint();
      });
    },
    /*
     *
     */
    ons: function () {
      var me = this,
        w = me.widget;

      w.el.on('mousedown', me.onMouseDownCell, me, 'div.' + GRID_HEADER_CELL_CLS);
    },
    onMouseDownCell: function (e) {
      var me = this,
        w = me.widget,
        cell = Fancy.get(e.currentTarget),
        index = Number(cell.attr('index')),
        side = me.getSideByCell(cell),
        columns = w.getColumns(side),
        column = columns[index];

      if(cell.hasCls(GRID_HEADER_CELL_GROUP_LEVEL_2_CLS)){
        //TODO: write realization
        //me.activeCellTopGroup = me.getGroupStartEnd(cell, side);
        return;
      }

      if(w.startResizing){
        return;
      }

      if(!me.activeCellTopGroup && column.draggable === false){
        return;
      }

      if(cell.hasCls(GRID_HEADER_CELL_GROUP_LEVEL_1_CLS)){
        me.activeUnderGroup = true;
      }

      me.activeSide = side;
      me.inSide = side;
      me.activeCell = cell;
      me.inCell = cell;
      me.activeIndex = Number(cell.attr('index'));
      me.inIndex = me.activeIndex;
      me.activeColumn = columns[me.activeIndex];

      me.mouseDownX = e.x;
      me.mouseDownY = e.y;

      DOC.once('mouseup', me.onMouseUp, me);
      DOC.on('mousemove', me.onMouseMove, me);

      w.el.on('mouseleave', me.onMouseLeave, me);
      w.el.on('mouseenter', me.onMouseEnterCell, me, 'div.' + GRID_HEADER_CELL_CLS);
      w.el.on('mousemove', me.onMouseMoveCell, me, 'div.' + GRID_HEADER_CELL_CLS);
    },
    onMouseLeave: function () {
      this.hideHint();
    },
    onMouseUp: function () {
      var me = this,
        w = me.widget,
        dragged = false;

      DOC.un('mousemove', me.onMouseMove, me);

      w.el.un('mouseleave', me.onMouseLeave, me);
      w.el.un('mouseenter', me.onMouseEnterCell, me, 'div.' + GRID_HEADER_CELL_CLS);
      w.el.un('mousemove', me.onMouseMoveCell, me, 'div.' + GRID_HEADER_CELL_CLS);

      if(me.ok){
        if(me.inSide === me.activeSide){
          me.dragColumn(me.inSide);
        }
        else if(me.activeSide === 'center'){
          var inIndex = me.inIndex;
          if(me.okPosition === 'right'){
            inIndex++;
          }
          w.moveColumn(me.activeSide, me.inSide, me.activeIndex, inIndex);
        }
        else{
          var inIndex = me.inIndex;
          if(me.okPosition === 'right'){
            inIndex++;
          }
          w.moveColumn(me.activeSide, me.inSide, me.activeIndex, inIndex);
        }

        dragged = true;
      }

      delete me.inUpGroupCell;
      delete me.inUnderGroup;
      delete me.activeCellTopGroup;
      delete me.activeUnderGroup;
      delete me.activeSide;
      delete me.activeCell;
      delete me.activeIndex;
      delete me.activeIndex;
      delete me.activeColumn;
      delete me.mouseDownX;
      delete me.mouseDownY;
      me.ok = false;
      delete me.okPosition;

      if(me.tip){
        me.tip.destroy();
        delete me.tip;
      }

      if(me.status === 'dragging'){
        setTimeout(function () {
          me.status = 'none';
          if(dragged) {
            w.fire('columndrag');
            w.scroller.update();
          }
        }, 10);
      }

      me.hideHint();
    },
    onMouseMove: function (e) {
      var me = this,
        w = me.widget,
        x = e.x,
        y = e.y,
        columns = w.getColumns(me.activeSide);

      if((Math.abs(x - me.mouseDownX) > 10 || Math.abs(y - me.mouseDownY)) && !me.tip){
        me.tip = new Fancy.ToolTip({
          text: me.activeColumn.title,
          cls: 'fancy-drag-cell'
        });

        me.tip.el.css('display', 'block');
      }
      else if(!me.tip){
        return;
      }

      if(columns.length === 1 && me.activeSide === 'center'){
        me.tip.destroy();
        return;
      }

      me.tip.show(e.pageX + 15, e.pageY + 15);
    },
    onMouseEnterCell: function(e){
      var me = this,
        cell = Fancy.get(e.currentTarget),
        side = me.getSideByCell(cell);

      me.hideHint();

      if(cell.hasCls(GRID_HEADER_CELL_GROUP_LEVEL_1_CLS)){
        me.inUnderGroup = true;
      }
      else{
        delete me.inUnderGroup;
      }

      if(cell.hasCls(GRID_HEADER_CELL_GROUP_LEVEL_2_CLS)){
        me.inUpGroupCell = cell;
      }
      else{
        delete me.inUpGroupCell;
      }

      me.inSide = side;
      me.inCell = cell;
      me.inIndex = Number(cell.attr('index'));
    },
    onMouseMoveCell: function(e){
      var me = this,
        w = me.widget,
        cell = me.inCell,
        cellWidth = parseInt(cell.css('width')),
        triggerEl = cell.select('.' + GRID_HEADER_CELL_TRIGGER_CLS),
        targetEl = Fancy.get(e.target),
        inTriggerEl = triggerEl.within(targetEl) || targetEl.hasClass(GRID_HEADER_CELL_TRIGGER_CLS),
        fromGroup = me.activeUnderGroup !== me.inUnderGroup && me.inUnderGroup === true,
        toGroup = me.activeUnderGroup !== me.inUnderGroup && me.activeUnderGroup === true;

      me.status = 'dragging';

      var columns = w.getColumns(me.activeSide);
      if(columns.length === 1 && me.activeSide === 'center'){
        me.ok = false;
        me.hideHint();
        return;
      }

      if(me.inUpGroupCell){
        var o = me.getGroupStartEnd(),
          startIndex = o.start,
          endIndex = o.end;

        if(me.activeSide !== me.inSide){
          me.ok = true;
          if(e.offsetX > cellWidth/2 || inTriggerEl){
            me.showHint('right');
          }
          else{
            me.showHint('left');
          }
        }
        else{
          if (e.offsetX > cellWidth / 2) {
            if(me.activeIndex > endIndex && me.activeIndex - 1 === endIndex){
              me.hideHint();
            }
            else {
              me.ok = true;
              me.showHint('right');
            }
          }
          else {
            if(me.activeIndex < startIndex && me.activeIndex + 1 === startIndex){
              me.hideHint();
            }
            else {
              me.ok = true;
              me.showHint('left');
            }
          }
        }
      }
      else if(me.activeSide !== me.inSide){
        me.ok = true;
        if(e.offsetX > cellWidth/2 || inTriggerEl){
          me.showHint('right');
        }
        else{
          me.showHint('left');
        }
      }
      else if(me.activeIndex === me.inIndex){
        me.ok = false;
      }
      else if(me.activeIndex < me.inIndex){
        if(e.offsetX > cellWidth/2 || inTriggerEl){
          me.ok = true;
          me.showHint('right');
        }
        else{
          if(e.offsetX < cellWidth/2 && (me.activeIndex + 1) !== me.inIndex){
            me.ok = true;
            me.showHint('left');
          }
          else {
            if(me.activeIndex + 1 === me.inIndex && (fromGroup || toGroup) ){
              me.ok = true;
              me.showHint('left');
            }
            else{
              me.ok = false;
              me.hideHint();
            }
          }
        }
      }
      else if(me.activeIndex > me.inIndex){
        if(e.offsetX < cellWidth/2){
          if(inTriggerEl){
            if(fromGroup || toGroup){
              me.ok = true;
              me.showHint('right');
            }
            else if(me.activeIndex - 1 === me.inIndex || me.inUpGroupCell) {
              me.ok = false;
              me.hideHint();
            }
            else{
              me.ok = true;
              me.showHint('right');
            }
          }
          else {
            me.ok = true;
            me.showHint('left');
          }
        }
        else{
          if(e.offsetX > cellWidth/2){
            if((me.activeIndex - 1) === me.inIndex && (fromGroup || toGroup)){
              me.ok = true;
              me.showHint('right');
            }
            else{
              if((me.activeIndex - 1) !== me.inIndex || me.activeUnderGroup){
                me.ok = true;
                me.showHint('right');
              }
              else{
                me.ok = false;
                me.hideHint();
              }
            }
          }
          else {
            me.ok = false;
            me.hideHint();
          }
        }
      }
    },
    showHint: function(position){
      var me = this,
        w = me.widget,
        CELL_HEADER_HEIGHT = w.cellHeaderHeight,
        cell = me.inCell,
        topEl = me.topEl,
        bottomEl = me.bottomEl,
        o = cell.offset(),
        cellWidth = parseInt(cell.css('width')),
        cellHeight = parseInt(cell.css('height'));

      me.okPosition = position;

      topEl.removeCls(HIDDEN_CLS);
      bottomEl.removeCls(HIDDEN_CLS);

      var plusWidth = 0;

      if(position === 'right'){
        plusWidth += cellWidth;
      }

      topEl.css({
        left: o.left + plusWidth - Math.ceil(parseInt(topEl.css('width'))/2),
        top: o.top - parseInt(topEl.css('height'))
      });

      var bottomTop = o.top + cellHeight;

      if(me.inUpGroupCell){
        var rows = w.header.calcRows();
        bottomTop = o.top + rows * CELL_HEADER_HEIGHT;
      }

      bottomEl.css({
        left: o.left + plusWidth - Math.ceil(parseInt(bottomEl.css('width'))/2),
        top: bottomTop
      });
    },
    hideHint: function(){
      var me = this;

      me.topEl.addCls(HIDDEN_CLS);
      me.bottomEl.addCls(HIDDEN_CLS);
    },
    initHint: function(){
      var me = this,
        w = me.widget,
        themeCls = 'fancy-theme-' + w.theme,
        renderTo = F.get(document.body).dom,
        topEl = F.get(document.createElement('div')),
        bottomEl = F.get(document.createElement('div'));

      topEl.addCls('fancy-drag-hint-top', HIDDEN_CLS, themeCls);
      bottomEl.addCls('fancy-drag-hint-bottom', HIDDEN_CLS, themeCls);

      me.topEl = F.get(renderTo.appendChild(topEl.dom));
      me.bottomEl = F.get(renderTo.appendChild(bottomEl.dom));
    },
    /*
     * @param {String} side
     */
    dragColumn: function (side) {
      var me = this,
        w = me.widget,
        header = w.getHeader(side),
        body = w.getBody(side),
        activeIndex = me.activeIndex,
        inIndex = me.inIndex,
        position = me.okPosition,
        columns = w.getColumns(side),
        column = columns[activeIndex],
        rows = header.calcRows();

      if(me.inUpGroupCell){
        var o = me.getGroupStartEnd();

        inIndex = o.start;

        if(position === 'right'){
          inIndex = o.end + 1;
        }
      }
      else if(position === 'right'){
        if(me.inUnderGroup){
          var groupName = columns[inIndex].grouping,
            nextColumn = columns[inIndex + 1];

          if(nextColumn && nextColumn.grouping === groupName){
            inIndex++;
          }
        }
        else {
          inIndex++;
        }
      }

      if(w.groupheader){
        var inColumn = columns[inIndex];

        if(inColumn && inColumn.grouping && me.inUnderGroup){
          column.grouping = inColumn.grouping;

          if(column.filter && column.filter.header && rows < 3){
            delete column.filter;
          }
        }
        else{
          delete column.grouping;
        }
      }

      columns.splice(activeIndex, 1);

      if(activeIndex<inIndex){
        inIndex--;
      }

      columns.splice(inIndex, 0, column);

      body.clearColumnsStyles();
      header.updateTitles();
      header.updateCellsSizes();
      if(w.groupheader){
        w.header.fixGroupHeaderSizing();
        if(w.leftColumns){
          w.leftHeader.fixGroupHeaderSizing();
        }

        if(w.rightColumns){
          w.rightHeader.fixGroupHeaderSizing();
        }

        header.reSetGroupIndexes();
      }

      header.reSetColumnsAlign();
      body.reSetColumnsAlign();
      body.reSetColumnsCls();
      body.updateColumnsSizes();
      w.update();
    },
    /*
     *
     */
    getSideByCell: function (cell) {
      var me = this,
        w = me.widget,
        side;

      if(w.centerEl.within(cell)){
        side = 'center';
      }
      else if(w.leftEl.within(cell)){
        side = 'left';
      }
      else if(w.rightEl.within(cell)){
        side = 'right';
      }

      return side;
    },
    /*
     * @param {Object} [cell]
     * @param {String} [side]
     * @return {Object}
     */
    getGroupStartEnd: function (cell, side) {
      var me = this,
        w = me.widget,
        header = w.getHeader(side || me.inSide),
        groupName = (cell || me.inUpGroupCell).attr('index'),
        inUpGroupCells = header.el.select('[group-index="' + groupName + '"]'),
        values = [];

      inUpGroupCells.each(function(cell){
        values.push(Number(cell.attr('index')));
      });

      return {
        start: F.Array.min(values),
        end: F.Array.max(values)
      };
    }
  });

})();
/*
 * @class Fancy.grid.plugin.Summary
 * @extend Fancy.Plugin
 */
(function () {
  //SHORTCUTS
  var F = Fancy;

  //CONSTANTS
  var GRID_CELL_CLS = Fancy.GRID_CELL_CLS;
  var GRID_CELL_INNER_CLS = Fancy.GRID_CELL_INNER_CLS;
  var GRID_ROW_SUMMARY_CLS = Fancy.GRID_ROW_SUMMARY_CLS;
  var GRID_ROW_SUMMARY_CONTAINER_CLS = Fancy.GRID_ROW_SUMMARY_CONTAINER_CLS;
  var GRID_ROW_SUMMARY_BOTTOM_CLS = Fancy.GRID_ROW_SUMMARY_BOTTOM_CLS;

  F.define('Fancy.grid.plugin.Summary', {
    extend: F.Plugin,
    ptype: 'grid.summary',
    inWidgetName: 'summary',
    position: 'top',
    sumDisplayed: true,
    topOffSet: 0,
    bottomOffSet: 0,
    /*
     * @constructor
     * @param {Object} config
     */
    constructor: function (config) {
      this.Super('const', arguments);
    },
    /*
     *
     */
    init: function () {
      this.Super('init', arguments);

      this.ons();
    },
    /*
     *
     */
    ons: function () {
      var me = this,
        w = me.widget;

      w.once('render', function () {
        me.calcOffSets();
      });

      w.once('init', function () {
        me.render();
        me.update();

        w.on('update', function () {
          me.update();
        });

        w.on('set', function () {
          me.update();
        });
      });

      w.on('columnresize', me.onColumnResize, me);

      if (me.sumDisplayed) {
        w.on('changepage', me.onChangePage, me);
      }
    },
    /*
     *
     */
    render: function () {
      var me = this,
        w = me.widget,
        body = w.body,
        leftBody = w.leftBody,
        rightBody = w.rightBody,
        width = w.getCenterFullWidth(),
        leftWidth = w.getLeftFullWidth(),
        rightWidth = w.getRightFullWidth(),
        el,
        method = me.position === 'top' ? 'before' : 'after';

      el = me.generateRow('center');
      el.css('width', w.startWidths.center);
      el.firstChild().css('width', width);
      el.css('height', w.cellHeight);
      el.firstChild().css('height', w.cellHeight);

      me.el = el;

      body.el[method](el.dom);

      if (leftWidth) {
        el = me.generateRow('left');
        el.css('width', leftWidth - 2);
        el.firstChild().css('width', leftWidth);
        el.css('height', w.cellHeight);

        me.leftEl = el;

        leftBody.el[method](el.dom);
      }

      if (rightWidth) {
        el = me.generateRow('right');
        el.css('width', rightWidth - 1);
        el.firstChild().css('width', rightWidth);
        el.css('height', w.cellHeight);

        me.rightEl = el;

        rightBody.el[method](el.dom);
      }
    },
    /*
     * @param {String} side
     * @return {Fancy.Element}
     */
    generateRow: function (side) {
      var me = this,
        w = me.widget,
        cellHeight = w.cellHeight,
        columnsWidth = w.getColumnsWidth(side),
        el = F.get(document.createElement('div')),
        cells = '';

      F.each(w.getColumns(side), function (column) {
        cells += [
          '<div style="width:' + column.width + 'px;height:' + cellHeight + 'px;" class="' + GRID_CELL_CLS + '">',
          '<div class="' + GRID_CELL_INNER_CLS + '"></div>',
          '</div>'
        ].join("");
      });

      var inner = [
        '<div style="position: relative;" class="' + GRID_ROW_SUMMARY_CLS + '">',
        cells,
        '</div>'
      ].join("");

      el.update(inner);

      el.css('width', columnsWidth + 'columnsWidth');
      el.addCls(GRID_ROW_SUMMARY_CONTAINER_CLS);
      if (me.position === 'bottom') {
        el.addCls(GRID_ROW_SUMMARY_BOTTOM_CLS);
      }

      return el;
    },
    /*
     *
     */
    calcPlusScroll: function () {
      var me = this,
        w = me.widget;

      me.plusScroll = me.groups.length * w.groupRowHeight;
    },
    /*
     * @param {Number} value
     */
    scrollLeft: function (value) {
      this.el.firstChild().css('left', value);
    },
    /*
     *
     */
    update: function () {
      var me = this,
        w = me.widget;

      me.updateSide('center');
      if (w.leftColumns.length) {
        me.updateSide('left');
      }

      if (w.rightColumns.length) {
        me.updateSide('right');
      }
    },
    /*
     * @param {String} side
     * @return {Fancy.Element}
     */
    getEl: function (side) {
      var me = this;

      switch (side) {
        case 'center':
          return me.el;
        case 'left':
          return me.leftEl;
        case 'right':
          return me.rightEl;
        default:
          return me.el;
      }
    },
    /*
     * @param {String} side
     */
    updateSide: function (side) {
      var me = this,
        w = me.widget,
        body = w.body,
        s = w.store,
        cellInners = me.getEl(side).select('.' + GRID_CELL_INNER_CLS),
        dataProperty = 'data';

      if (me.sumDisplayed) {
        dataProperty = 'dataView';
      }

      F.each(w.getColumns(side), function (column, i) {
        if (!column.summary) {
          return;
        }

        var columnIndex = column.index,
          columnValues = s.getColumnOriginalValues(columnIndex, {
            smartIndexFn: column.smartIndexFn,
            dataProperty: dataProperty
          }),
          value = '';

        switch (F.typeOf(column.summary)) {
          case 'string':
            value = F.Array[column.summary](columnValues);
            break;
          case 'object':
            value = F.Array[column.summary.type](columnValues);
            if (column.summary.fn) {
              value = column.summary.fn(value);
            }
            break;
          case 'function':
            value = column.summary(columnValues);
            break;
        }

        if (column.format) {
          value = body.format(value, column.format);
        }

        cellInners.item(i).update(value);
      });
    },
    /*
     *
     */
    onColumnResize: function () {
      var me = this,
        w = me.widget;

      me.updateSizes('center');

      if (w.leftColumns.length) {
        me.updateSizes('left');
      }

      if (w.rightColumns.length) {
        me.updateSizes('right');
      }
    },
    /*
     * @param {String} side
     */
    updateSizes: function (side) {
      var me = this,
        w = me.widget,
        el = me.getEl(side),
        cells = el.select('.' + GRID_CELL_CLS),
        totalWidth = 0;

      F.each(w.getColumns(side), function (column, i) {
        totalWidth += column.width;
        cells.item(i).css('width', column.width + 'px');
      });

      el.firstChild().css('width', totalWidth);

      switch (side) {
        case 'center':
          me.el.css('width', w.centerEl.css('width'));
          break;
        case 'left':
          me.leftEl.css('width', parseInt(w.leftEl.css('width')) - 2);
          break;
        case 'right':
          me.rightEl.css('width', parseInt(w.rightEl.css('width')) - 1);
          break;
      }
    },
    /*
     *
     */
    calcOffSets: function () {
      var me = this,
        w = me.widget;

      switch (me.position) {
        case 'top':
          me.topOffSet = w.cellHeight;
          break;
        case 'bottom':
          me.bottomOffSet = w.cellHeight;
          break;
        case 'both':
          me.topOffSet = w.cellHeight;
          me.bottomOffSet = w.cellHeight;
          break;
      }
    },
    /*
     * @param {Number} index
     * @param {String} side
     */
    removeColumn: function (index, side) {
      var el = this.getEl(side),
        cells = el.select('.' + GRID_CELL_CLS),
        cell = cells.item(index);

      cell.destroy();

      this.updateSizes(side);
    },
    /*
     * @param {Number} index
     * @param {String} side
     */
    insertColumn: function (index, side) {
      var me = this,
        w = me.widget,
        columns = w.getColumns(side),
        column = columns[index],
        el = me.getEl(side),
        cells = el.select('.' + GRID_CELL_CLS),
        cell = cells.item(index - 1),
        newCell = F.get(document.createElement('div'));

      if (index === 0) {
        cell = cells.item(0);
      }

      newCell.css({
        width: column.width,
        height: w.cellHeight
      });

      newCell.addCls(GRID_CELL_CLS);
      newCell.update('<div class="' + GRID_CELL_INNER_CLS + '"></div>');

      if (index === 0) {
        cell.before(newCell.dom);
      }
      else {
        cell.after(newCell.dom);
      }

      me.updateSizes(side);
      me.updateSide(side);
    },
    /*
     *
     */
    onChangePage: function () {
      this.update();
    }
  });

})();
/*
 * @class Fancy.grid.plugin.CellTip
 * @extends Fancy.Plugin
 */
(function () {
  //SHORTCUTS
  var F = Fancy;

  F.define('Fancy.grid.plugin.CellTip', {
    extend: F.Plugin,
    ptype: 'grid.celltip',
    inWidgetName: 'celltip',
    cellTip: '{value}',
    stopped: true,
    /*
     * @param {Object} config
     */
    constructor: function (config) {
      this.Super('const', arguments);
    },
    /*
     *
     */
    init: function () {
      this.Super('init', arguments);
      this.ons();
    },
    /*
     *
     */
    ons: function () {
      var me = this,
        w = me.widget,
        docEl = F.get(document);

      w.on('cellenter', me.onCellEnter, me);
      w.on('cellleave', me.onCellLeave, me);
      docEl.on('touchend', me.onTouchEnd, me);
      docEl.on('mousemove', me.onDocMove, me);
    },
    /*
     * @param {Fancy.Grid} grid
     * @param {Object} o
     */
    onCellEnter: function (grid, o) {
      var me = this,
        column = o.column,
        cellTip = me.cellTip,
        e = o.e;

      if (column.cellTip) {
        if (F.isString(column.cellTip)) {
          cellTip = column.cellTip;
        }
        else if (F.isFunction(column.cellTip)) {
          cellTip = column.cellTip(o);
          if (cellTip === false) {
            return;
          }
        }

        var tpl = new F.Template(cellTip),
          data = {
            title: column.title,
            value: o.value,
            columnIndex: 0,
            rowIndex: 0
          };

        me.stopped = false;
        F.apply(data, o.data);

        F.tip.update(tpl.getHTML(data));
        F.tip.show(e.pageX + 15, e.pageY - 25);
      }
    },
    /*
     * @param {Fancy.Grid} grid
     * @param {Object} o
     */
    onCellLeave: function (grid, o) {
      this.stopped = true;
      F.tip.hide(1000);
    },
    /*
     * @param {Fancy.Grid} grid
     * @param {Object} o
     */
    onTouchEnd: function (grid, o) {
      this.stopped = true;
      F.tip.hide(1000);
    },
    /*
     * @param {Object} e
     */
    onDocMove: function (e) {
      if (this.stopped === true) {
        return;
      }

      F.tip.show(e.pageX + 15, e.pageY - 25);
    }
  });

})();
/*
 * @class Fancy.grid.plugin.Filter
 * @extends Fancy.Plugin
 */
(function() {
  //SHORTCUTS
  var F = Fancy;
  var D = Fancy.Date;

  //CONSTANTS
  var FIELD_CLS = F.FIELD_CLS;
  var GRID_HEADER_CELL_DOUBLE_CLS = F.GRID_HEADER_CELL_DOUBLE_CLS;
  var GRID_HEADER_CELL_TRIPLE_CLS = F.GRID_HEADER_CELL_TRIPLE_CLS;
  var GRID_HEADER_CELL_FILTER_CLS = F.GRID_HEADER_CELL_FILTER_CLS;
  var GRID_HEADER_CELL_FILTER_FULL_CLS = F.GRID_HEADER_CELL_FILTER_FULL_CLS;
  var GRID_HEADER_CELL_FILTER_SMALL_CLS = F.GRID_HEADER_CELL_FILTER_SMALL_CLS;

  F.define('Fancy.grid.plugin.Filter', {
    extend: F.Plugin,
    ptype: 'grid.filter',
    inWidgetName: 'filter',
    autoEnterDelay: 500,
    /*
     * @constructor
     * @param {Object} config
     */
    constructor: function (config) {
      this.filters = {};
      this.Super('const', arguments);
    },
    /*
     *
     */
    init: function () {
      this.Super('init', arguments);
      this.ons();
    },
    /*
     *
     */
    ons: function () {
      var me = this,
        w = me.widget;

      w.once('render', function () {
        me.render();
      });

      w.on('columnresize', me.onColumnResize, me);
      w.on('filter', me.onFilter, me);
      w.on('lockcolumn', me.onLockColumn, me);
      w.on('rightlockcolumn', me.onRightLockColumn, me);
      w.on('unlockcolumn', me.onUnLockColumn, me);

      w.on('columndrag', me.onColumnDrag, me);
    },
    /*
     *
     */
    render: function () {
      var me = this,
        w = me.widget;

      me._renderSideFields(w.header, w.columns);
      me._renderSideFields(w.leftHeader, w.leftColumns);
      me._renderSideFields(w.rightHeader, w.rightColumns);
    },
    _renderSideFields: function (header, columns) {
      var me = this,
        i = 0,
        iL = columns.length,
        cell,
        column;

      for (; i < iL; i++) {
        column = columns[i];
        cell = header.getCell(i);
        if (column.filter && column.filter.header) {
          me.renderFilter(column.type, column, cell);
          if (me.groupHeader && !column.grouping) {
            cell.addCls(GRID_HEADER_CELL_TRIPLE_CLS);
          }

          cell.addCls(GRID_HEADER_CELL_FILTER_CLS);
        }
        else if (me.header) {
          if (me.groupHeader && !column.grouping) {
            cell.addCls(GRID_HEADER_CELL_TRIPLE_CLS);
          }
          else {
            if (column.grouping && me.groupHeader) {
              cell.addCls(GRID_HEADER_CELL_DOUBLE_CLS);
            }
            else if (!column.grouping) {
              cell.addCls(GRID_HEADER_CELL_DOUBLE_CLS);
            }
          }
        }
      }
    },
    _clearColumnsFields: function (columns, header, index, sign) {
      var i = 0,
        iL = columns.length,
        column;

      for (; i < iL; i++) {
        column = columns[i];
        if (column.filter && column.filter.header) {
          if (index && column.index !== index) {
            continue;
          }

          switch (column.type) {
            case 'date':
              var els = header.getCell(i).select('.' + FIELD_CLS),
                fieldFrom = F.getWidget(els.item(0).attr('id')),
                fieldTo = F.getWidget(els.item(1).attr('id'));

              fieldFrom.clear();
              fieldTo.clear();
              break;
            default:
              var id = header.getCell(i).select('.' + FIELD_CLS).attr('id'),
                field = F.getWidget(id);

              if (sign) {
                var splitted = field.get().split(',');

                if (splitted.length < 2 && !sign) {
                  field.clear();
                }
                else {
                  var j = 0,
                    jL = splitted.length,
                    value = '';

                  for (; j < jL; j++) {
                    var splitItem = splitted[j];

                    if (!new RegExp(sign).test(splitItem)) {
                      value += splitItem;
                    }
                  }

                  field.set(value);
                }
              }
              else {
                field.clear();
              }
          }
        }
      }
    },
    clearColumnsFields: function (index, sign) {
      var me = this,
        w = me.widget;

      me._clearColumnsFields(w.columns, w.header, index, sign);
      me._clearColumnsFields(w.leftColumns, w.leftHeader, index, sign);
      me._clearColumnsFields(w.rightColumns, w.rightHeader, index, sign);
    },
    _addValuesInColumnFields: function (columns, header, index, value, sign) {
      var i = 0,
        iL = columns.length,
        column;

      for (; i < iL; i++) {
        column = columns[i];
        if (column.index === index && column.filter && column.filter.header) {
          switch (column.type) {
            case 'date':
              var els = header.getCell(i).select('.' + FIELD_CLS),
                fieldFrom = F.getWidget(els.item(0).attr('id')),
                fieldTo = F.getWidget(els.item(1).attr('id'));

              fieldFrom.clear();
              fieldTo.clear();
              break;
            default:
              var id = header.getCell(i).select('.' + FIELD_CLS).attr('id'),
                field = F.getWidget(id),
                fieldValue = field.get(),
                splitted = field.get().split(',');

              if (splitted.length === 1 && splitted[0] === '') {
                field.set((sign || '') + value);
              }
              else if (splitted.length === 1) {
                if (new RegExp(sign).test(fieldValue)) {
                  field.set((sign || '') + value);
                }
                else {
                  field.set(fieldValue + ',' + (sign || '') + value);
                }
              }
              else {
                var j = 0,
                  jL = splitted.length,
                  newValue = '';

                for (; j < jL; j++) {
                  var splittedItem = splitted[j];

                  if (!new RegExp(sign).test(splittedItem)) {
                    if (newValue.length !== 0) {
                      newValue += ',';
                    }
                    newValue += splittedItem;
                  }
                  else {
                    if (newValue.length !== 0) {
                      newValue += ',';
                    }
                    newValue += (sign || '') + value;
                  }
                }

                field.set(newValue);
              }
          }
        }
      }
    },
    addValuesInColumnFields: function (index, value, sign) {
      var me = this,
        w = me.widget;

      me._addValuesInColumnFields(w.columns, w.header, index, value, sign);
      me._addValuesInColumnFields(w.leftColumns, w.leftHeader, index, value, sign);
      me._addValuesInColumnFields(w.rightColumns, w.rightHeader, index, value, sign);
    },
    /*
     * @param {String} type
     * @param {Object} column
     * @param {Fancy.Element} dom
     */
    renderFilter: function (type, column, dom) {
      var me = this,
        w = me.widget,
        field,
        style = {
          position: 'absolute',
          bottom: '3px'
        },
        filter = column.filter,
        theme = w.theme,
        tip = filter.tip;

      switch (type) {
        case 'date':
          var events = [];

          events.push({
            change: me.onDateChange,
            scope: me
          });

          var format;

          if (F.isString(column.format)) {
            switch (column.format) {
              case 'date':
                format = column.format;
                break;
            }
          }

          field = new F.DateRangeField({
            renderTo: dom.dom,
            value: new Date(),
            format: column.format,
            label: false,
            padding: false,
            style: style,
            events: events,
            width: column.width - 8,
            emptyText: filter.emptyText,
            dateImage: false,
            theme: theme
          });
          break;
        case 'string':
          var events = [{
            enter: me.onEnter,
            scope: me
          }];

          if (me.autoEnterDelay !== false) {
            events.push({
              key: me.onKey,
              scope: me
            });
          }

          field = new F.StringField({
            renderTo: dom.dom,
            label: false,
            padding: false,
            style: style,
            events: events,
            emptyText: filter.emptyText,
            tip: tip
          });
          break;
        case 'number':
        case 'grossloss':
        case 'progressbar':
        case 'progressdonut':
          var events = [{
            enter: me.onEnter,
            scope: me
          }];

          if (me.autoEnterDelay !== false) {
            events.push({
              key: me.onKey,
              scope: me
            });
          }

          field = new F.NumberField({
            renderTo: dom.dom,
            label: false,
            padding: false,
            style: style,
            emptyText: filter.emptyText,
            events: events,
            tip: tip
          });
          break;
        case 'combo':
          var displayKey = 'text',
            valueKey = 'text',
            data;

          if (column.displayKey !== undefined) {
            displayKey = column.displayKey;
            valueKey = displayKey;
          }

          if (F.isObject(column.data) || F.isObject(column.data[0])) {
            data = column.data;
          }
          else {
            data = me.configComboData(column.data);
          }

          field = new F.Combo({
            renderTo: dom.dom,
            label: false,
            padding: false,
            style: style,
            width: column.width - 8,
            displayKey: displayKey,
            valueKey: valueKey,
            value: '',
            height: 28,
            emptyText: filter.emptyText,
            theme: theme,
            tip: tip,
            multiSelect: column.multiSelect,
            itemCheckBox: column.itemCheckBox,
            minListWidth: column.minListWidth,
            events: [{
              change: me.onEnter,
              scope: me
            }, {
              empty: function () {
                this.set(-1);
              }
            }],
            data: data
          });

          break;
        case 'checkbox':
          field = new F.Combo({
            renderTo: dom.dom,
            label: false,
            padding: false,
            style: style,
            displayKey: 'text',
            valueKey: 'value',
            width: column.width - 8,
            emptyText: filter.emptyText,
            value: '',
            editable: false,
            events: [{
              change: me.onEnter,
              scope: me
            }],
            data: [{
              value: '',
              text: ''
            }, {
              value: 'false',
              text: w.lang.no
            }, {
              value: 'true',
              text: w.lang.yes
            }]
          });

          break;
        default:
          var events = [{
            enter: me.onEnter,
            scope: me
          }];

          if (me.autoEnterDelay !== false) {
            events.push({
              key: me.onKey,
              scope: me
            });
          }

          field = new F.StringField({
            renderTo: dom.dom,
            label: false,
            style: style,
            padding: false,
            emptyText: filter.emptyText,
            events: events
          });
      }

      field.filterIndex = column.index;
      field.column = column;

      /*
      field.el.on('click', function (e) {
        e.stopPropagation();
      });
      */

      if (type !== 'date') {
        field.el.css('padding-left', '4px');
        field.el.css('padding-top', '0px');
      }

      switch (type) {
        case 'checkbox':
        case 'combo':
        case 'date':
          break;
        default:
          field.setInputSize({
            width: column.width - 8
          });
      }

      column.filterField = field;
    },
    /*
     * @param {Object} field
     * @param {String|Number} value
     * @param {Object} options
     */
    onEnter: function (field, value, options) {
      var me = this,
        w = me.widget,
        s = w.store,
        filterIndex = field.filterIndex,
        signs = {
          '<': true,
          '>': true,
          '!': true,
          '=': true
        };

      options = options || {};

      if (me.intervalAutoEnter) {
        clearInterval(me.intervalAutoEnter);
        me.intervalAutoEnter = false;
      }
      delete me.intervalAutoEnter;

      if (value.length === 0) {
        me.filters[field.filterIndex] = {};
        me.updateStoreFilters();

        if (w.grouping) {
          w.grouping.reGroup();
        }

        return;
      }

      var filters = me.processFilterValue(value, field.column.type),
        i = 0,
        iL = filters.length;

      me.filters[filterIndex] = {};

      for (; i < iL; i++) {
        var filter = filters[i];

        me.filters[filterIndex][filter.operator] = filter.value;
        if (filter.operator !== '|') {
          //F.apply(me.filters[filterIndex], options);
        }

        if (field.column.type === 'date') {
          F.apply(me.filters[filterIndex], options);
        }
      }

      if (s.remoteFilter) {
        s.filters = me.filters;
        s.serverFilter();
      }
      else {
        me.updateStoreFilters();
      }

      if (w.grouping) {
        if (s.remoteSort) {
          s.once('load', function () {
            w.grouping.reGroup();
            w.fire('filter', me.filters);
          });
        }
        else {
          w.grouping.reGroup();
        }
      }

      w.setSidesHeight();
    },
    /*
     * @param {String|Number} value
     * @param {String} type
     */
    processFilterValue: function (value, type) {
      var signs = {
          '<': true,
          '>': true,
          '!': true,
          '=': true,
          '|': true
        },
        operator,
        _value,
        i = 0,
        iL = 3,
        filters = [],
        splitted,
        j,
        jL;

      if (F.isArray(value)) {
        _value = {};

        F.Array.each(value, function (v, i) {
          _value[String(v).toLocaleLowerCase()] = true;
        });

        filters.push({
          operator: '|',
          value: _value
        });

        return filters;
      }

      splitted = value.split(',');
      j = 0;
      jL = splitted.length;

      for (; j < jL; j++) {
        i = 0;
        operator = '';
        _value = splitted[j];

        for (; i < iL; i++) {
          if (signs[_value[i]]) {
            operator += _value[i];
          }
        }

        _value = _value.replace(new RegExp('^' + operator), '');

        if (_value.length < 1) {
          continue;
        }

        switch (type) {
          case 'number':
            _value = Number(_value);
            break;
          case 'combo':
            operator = '=';
            break;
        }

        filters.push({
          operator: operator,
          value: _value
        });
      }

      return filters;
    },
    /*
     *
     */
    updateStoreFilters: function () {
      var me = this,
        w = me.widget,
        s = w.store;

      s.filters = me.filters;

      s.changeDataView();
      w.update();

      w.fire('filter', me.filters);
      w.setSidesHeight();
    },
    /*
     * @param {Fancy.Grid} grid
     * @param {Object} o
     */
    onColumnResize: function (grid, o) {
      var cell = F.get(o.cell),
        width = o.width,
        fieldEl = cell.select('.' + FIELD_CLS),
        field;

      if (fieldEl.length === 0) {
      }
      else if (fieldEl.length === 2) {
        field = F.getWidget(fieldEl.item(0).dom.id);

        field.setWidth((width - 8) / 2);

        field = F.getWidget(fieldEl.item(1).dom.id);

        field.setWidth((width - 8) / 2);
      }
      else {
        field = F.getWidget(fieldEl.dom.id);

        if (field.wtype === 'field.combo') {
          field.size({
            width: width - 8
          });

          field.el.css('width', width - 8 + 5);
        }
        else {
          field.setInputSize({
            width: width - 8
          });
        }
      }
    },
    /*
     * @param {Object} field
     * @param {String|Number} value
     * @param {Object} e
     */
    onKey: function (field, value, e) {
      var me = this;

      if (e.keyCode === F.key.ENTER) {
        return;
      }

      me.autoEnterTime = +new Date();

      if (!me.intervalAutoEnter) {
        me.intervalAutoEnter = setInterval(function () {
          var now = new Date();

          if (!me.intervalAutoEnter) {
            return;
          }

          if (now - me.autoEnterTime > me.autoEnterDelay) {
            clearInterval(me.intervalAutoEnter);
            delete me.intervalAutoEnter;
            value = field.getValue();

            me.onEnter(field, value);
          }
        }, 200);
      }
    },
    /*
     * @param {Object} field
     * @param {*} date
     */
    onDateChange: function (field, date) {
      var me = this,
        w = me.widget,
        format = field.format,
        s = w.store,
        dateFrom = field.dateField1.getDate(),
        dateTo = field.dateField2.getDate(),
        value,
        isValid1 = dateFrom.toString() !== 'Invalid Date' && F.isDate(dateFrom),
        isValid2 = dateTo.toString() !== 'Invalid Date' && F.isDate(dateTo),
        value1,
        value2,
        isRemote = s.remoteFilter;

      if (isValid1) {
        dateFrom = new Date(dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate());
      }

      if (isValid2) {
        dateTo = new Date(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate());
      }

      if (isValid1 && isValid2) {
        if (isRemote !== true) {
          value1 = Number(dateFrom);
          value2 = Number(dateTo);
        }
        else {
          value1 = D.format(dateFrom, format.edit, format.mode);
          value2 = D.format(dateTo, format.edit, format.mode);
        }

        value = '>=' + value1 + ',<=' + value2;
      }
      else if (isValid1) {
        if (isRemote !== true) {
          value = '>=' + Number(dateFrom);
        }
        else {
          value = '>=' + D.format(dateFrom, format.edit, format.mode);
        }

        me.clearFilter(field.filterIndex, '<=', false);
      }
      else if (isValid2) {
        if (isRemote !== true) {
          value = '<=' + Number(dateTo);
        }
        else {
          value = '<=' + D.format(dateFrom, format.edit, format.mode);
        }

        me.clearFilter(field.filterIndex, '>=', false);
      }
      else {
        me.clearFilter(field.filterIndex);
      }

      if (value) {
        me.onEnter(field, value, {
          type: 'date',
          format: field.format
        });
      }
    },
    /*
     * @param {String} index
     * @param {String} operator
     * @param {Boolean} update
     */
    clearFilter: function (index, operator, update) {
      var me = this;

      if (operator === undefined) {
        delete me.filters[index];
      }
      else {
        if (me.filters[index]) {
          delete me.filters[index][operator];
        }
      }

      if (update !== false) {
        me.updateStoreFilters();
      }
    },
    onFilter: function () {
      this.widget.scroll(0);
    },
    /*
     * @param {Array} data
     * @return {Array}
     */
    configComboData: function (data) {
      var i = 0,
        iL = data.length,
        _data = [];

      if (F.isObject(data)) {
        return data;
      }

      for (; i < iL; i++) {
        _data.push({
          value: i,
          text: data[i]
        });
      }

      return _data;
    },
    destroyFields: function () {
      var me = this,
        w = me.widget;

      F.each(w.columns, function (column) {
        if(column.filterField){
          column.filterField.destroy();
          delete column.filterField;
        }
      });

      F.each(w.leftColumns, function (column) {
        if(column.filterField){
          column.filterField.destroy();
          delete column.filterField;
        }
      });

      F.each(w.rightColumns, function (column) {
        if(column.filterField){
          column.filterField.destroy();
          delete column.filterField;
        }
      });

      w.el.select('.' + GRID_HEADER_CELL_FILTER_CLS).removeCls(GRID_HEADER_CELL_FILTER_CLS);
      w.el.select('.' + GRID_HEADER_CELL_FILTER_FULL_CLS).removeCls(GRID_HEADER_CELL_FILTER_FULL_CLS);
      w.el.select('.' + GRID_HEADER_CELL_FILTER_SMALL_CLS).removeCls(GRID_HEADER_CELL_FILTER_SMALL_CLS);

      w.el.select('.' + GRID_HEADER_CELL_DOUBLE_CLS).removeCls(GRID_HEADER_CELL_DOUBLE_CLS);
      w.el.select('.' + GRID_HEADER_CELL_TRIPLE_CLS).removeCls(GRID_HEADER_CELL_TRIPLE_CLS);
    },
    /*
     *
     */
    onLockColumn: function () {
      this.render();
    },
    /*
     *
     */
    onUnLockColumn: function () {
      this.render();
    },
    /*
     *
     */
    onRightLockColumn: function () {
      this.render();
    },
    /*
     *
     */
    onColumnDrag: function () {
      var me = this;

      me.destroyFields();
      me.render();
    }
  });

})();
/*
 * @class Fancy.grid.plugin.Search
 */
Fancy.define('Fancy.grid.plugin.Search', {
  extend: Fancy.Plugin,
  ptype: 'grid.search',
  inWidgetName: 'searching',
  autoEnterDelay: 500,
  /*
   * @constructor
   * @param {Object} config
   */
  constructor: function(config){
    this.searches = {};
    this.Super('const', arguments);
  },
  /*
   *
   */
  init: function(){
    this.Super('init', arguments);

    //me.generateKeys();
    this.ons();
  },
  /*
   *
   */
  ons: function(){
    var me = this,
      w = me.widget;
    
    w.once('init', function(){
      me.generateKeys();
    });
  },
  /*
   * @param {*} keys
   * @param {*} values
   */
  search: function(keys, values){
    var me = this,
      w = me.widget,
      s = w.store;

    me.searches = {};

    if(!keys && !values ){
      me.clear();
      me.updateStoreSearches();

      if(w.grouping){
        w.grouping.reGroup();
      }

      return;
    }

    if(Fancy.isArray(keys) === false && !values){
      me.searches = keys;
    }

    me.setFilters();

    if(s.remoteSort){
      s.serverFilter();
    }
    else {
      me.updateStoreSearches();
    }

    if(w.grouping){
      if(s.remoteSort){
        s.once('load', function(){
          w.grouping.reGroup();
        });
      }
      else {
        w.grouping.reGroup();
      }
    }
  },
  /*
   *
   */
  updateStoreSearches: function(){
    var w = this.widget,
      s = w.store;

    s.changeDataView();
    w.update();
  },
  /*
   * @param {*} keys
   */
  setKeys: function(keys){
    var me = this;

    me.keys = keys;
    me.setFilters();
    me.updateStoreSearches();
  },
  /*
   * @return {Object}
   */
  generateKeys: function(){
    var me = this,
      w = me.widget;

    if(!me.keys){
      me.keys = {};

      var columns = [];

      if(w.columns){
        columns = columns.concat(w.columns);
      }

      if(w.leftColumns){
        columns = columns.concat(w.leftColumns);
      }

      if(w.rightColumns){
        columns = columns.concat(w.rightColumns);
      }

      var fields = [];

      Fancy.each(columns, function (column) {
        var index = column.index || column.key;

        if(column.searchable === false){
          return;
        }

        switch(column.type){
          case 'color':
          case 'combo':
          case 'date':
          case 'number':
          case 'string':
          case 'text':
          case 'currency':
            break;
          default:
            return;
        }

        if(index){
          fields.push(index);
        }
      });

      Fancy.each(fields, function(index){
        if(index === '$selected'){
          return;
        }

        me.keys[index] = true;
      });
    }

    return me.keys;
  },
  /*
   *
   */
  setFilters: function(){
    var me = this,
      w = me.widget,
      s = w.store,
      filters = s.filters || {};

    if(me.searches === undefined || Fancy.isObject(me.searches)){
      me.clear();
      return;
    }

    for(var p in me.keys){
      if(me.keys[p] === false){
        if(filters[p]){
          delete filters[p]['*'];
        }
        continue;
      }

      filters[p] = filters[p] || {};

      filters[p]['*'] = me.searches;
    }

    me.filters = filters;
    s.filters = filters;
  },
  /*
   *
   */
  clear: function(){
    var me = this,
      w = me.widget,
      s = w.store,
      filters = s.filters || {};

    for(var p in me.keys){
      if(filters[p] === undefined){
        continue;
      }

      delete filters[p]['*'];
    }

    me.filters = filters;
    s.filters = filters;
    delete me.searches;
  }
});
/*
 * @class Fancy.grid.plugin.GridToGrid
 * @extends Fancy.Plugin
 */
(function () {
  //SHORTCUTS
  var F = Fancy;

  //CONSTANTS
  var GRID_BODY_CLS = F.GRID_BODY_CLS;
  var GRID_CLS = F.GRID_CLS;
  var GRID_CELL_CLS = F.GRID_CELL_CLS;

  F.define('Fancy.grid.plugin.GridToGrid', {
    extend: F.Plugin,
    ptype: 'grid.dragdrop',
    inWidgetName: 'dragdrop',
    dropOK: false,
    cellMaskCls: 'fancy-drop-cell-mask',
    dropZoneCls: 'fancy-drop-zone-active',
    dropOkCls: 'fancy-drop-ok',
    dropNotOkCls: 'fancy-drop-not-ok',
    dropHeaderMaskCls: 'fancy-drop-header-mask',
    droppable: true,
    dropZoneOverClass: GRID_BODY_CLS,
    /*
     * @param {Object} config
     */
    constructor: function (config) {
      this.Super('const', arguments);
    },
    /*
     *
     */
    init: function () {
      var me = this;

      me.addEvents('drop');
      me.Super('init', arguments);
      me.initDropCls();
      me.initEnterLeave();

      me.ons();
    },
    /*
     *
     */
    initDropCls: function () {
      var me = this,
        dropCls = '.' + me.dropGroup;

      dropCls += ' .' + me.dropZoneOverClass;

      me.dropCls = dropCls;
    },
    /*
     *
     */
    addDragDropCls: function(){
      this.widget.el.addCls(this.dragGroup);
    },
    /*
     *
     */
    ons: function () {
      var me = this,
        w = me.widget;

      w.on('render', function () {
        me.addDragDropCls();
      });

      if (me.dropGroup) {
        w.on('beforecellmousedown', me.onBeforeCellMouseDown, me);
        w.on('cellmousedown', me.onCellMouseDown, me);
        w.on('cellleave', me.onCellLeave, me);
        w.on('cellenter', me.onCellEnter, me);
      }

      me.on('drop', me.onDropItems, me);
    },
    /*
     * @param {Object} dd
     * @param {*} items
     */
    onDropItems: function (dd, items) {
      var me = this,
        w = me.widget,
        dropGrid = me.dropGrid,
        rowIndex = dropGrid.activeRowEnterIndex === undefined ? dropGrid.getViewTotal() : dropGrid.activeRowEnterIndex;

      w.fire('dropitems', items, rowIndex);
      if (me.onDrop) {
        me.onDrop.apply(w, [items, rowIndex]);
      }
    },
    /*
     * @param {Fancy.Grid} grid
     * @param {Object} o
     */
    onBeforeCellMouseDown: function (grid, o) {
      var me = this,
        w = me.widget,
        lang = w.lang,
        docEl = F.get(document),
        selected = w.getSelection(),
        e = o.e,
        isCTRL = e.ctrlKey;

      if (isCTRL && w.multiSelect === true) {
        return;
      }

      if (selected.length > 1) {
        var passed = false;

        F.each(selected, function (item) {
          if (item.id === o.id) {
            passed = true;
            return true;
          }
        });

        if (passed === false) {
          return;
        }

        w.stopSelection();

        docEl.once('mouseup', me.onDocMouseUp, me);
        docEl.on('mousemove', me.onDocMouseMove, me);

        docEl.once('mouseup', function () {
          w.enableSelection();
        }, me);

        selected = w.getSelection();
        var text = F.String.format(lang.dragText, [selected.length, selected.length > 1 ? 's' : '']);

        me.initTip(text);

        me.dragItems = w.getSelection();

        me.cellMouseDown = true;

      }
    },
    /*
     * @param {Fancy.Grid} grid
     * @param {Object} o
     */
    onCellMouseDown: function (grid, o) {
      var me = this,
        w = me.widget,
        docEl = F.get(document);

      if (w.selection.enabled === false) {
        return;
      }

      var e = o.e,
        isCTRL = e.ctrlKey;

      if (isCTRL && w.multiSelect === true) {
        return;
      }

      if (o.column.index === '$selected') {
      }
      else {
        w.clearSelection();
      }

      docEl.once('mouseup', me.onDocMouseUp, me);
      docEl.on('mousemove', me.onDocMouseMove, me);

      me.cellMouseDown = true;
      me.activeRowIndex = o.rowIndex;
    },
    /*
     *
     */
    initEnterLeave: function () {
      var me = this,
        dropEl = F.select(me.dropCls);

      if (dropEl.length === 0) {
        setTimeout(function () {
          me.initEnterLeave();
        }, 500);
        return;
      }

      dropEl.on('mouseenter', me.onMouseEnterDropGroup, me);
      dropEl.on('mouseleave', me.onMouseLeaveDropGroup, me);
    },
    /*
     * @param {Object} e
     */
    onMouseEnterDropGroup: function (e) {
      var me = this;

      if (!me.cellMouseDown) {
        return;
      }

      var targetEl = F.get(e.currentTarget);

      me.dropGrid = F.getWidget(targetEl.closest('.' + GRID_CLS).attr('id'));

      if (me.dropGrid && me.dropGrid.dragdrop && me.dropGrid.dragdrop.droppable === false) {
        me.dropOK = false;
        if (me.tip) {
          me.tip.el.replaceClass(me.dropOkCls, me.dropNotOkCls);
        }
        return;
      }

      me.setDropGridCellsMask();
      if (!me.dropGridEventInited) {
        me.onsDropGrid();
      }

      targetEl.addCls(me.dropZoneCls);

      me.dropOK = true;

      if (me.tip) {
        me.tip.el.replaceClass(me.dropNotOkCls, me.dropOkCls);
      }
    },
    /*
     * @param {Object} e
     */
    onMouseLeaveDropGroup: function (e) {
      var me = this;

      if (!me.cellMouseDown) {
        return;
      }

      F.get(e.currentTarget).removeCls(me.dropZoneCls);

      me.dropOK = false;
      me.tip.el.replaceClass(me.dropOkCls, me.dropNotOkCls);
      me.clearCellsMask();
    },
    /*
     *
     */
    setDropGridCellsMask: function () {
      var me = this,
        dropGrid = me.dropGrid,
        total;

      if (!dropGrid || !me.cellMouseDown) {
        return;
      }

      total = dropGrid.getTotal();

      if (total === 0) {
        dropGrid.el.addCls(me.dropHeaderMaskCls);
      }
      else {
        dropGrid.el.select('.' + GRID_CELL_CLS + '[index="' + (total - 1) + '"]').addCls(me.cellMaskCls);
      }
    },
    /*
     *
     */
    onsDropGrid: function () {
      var me = this;

      me.dropGrid.on('rowenter', me.onDropGridRowEnter, me);
      me.dropGrid.on('rowleave', me.onDropGridRowLeave, me);

      me.dropGridEventInited = true;
    },
    /*
     * @param {Fancy.Grid} grid
     * @param {Object} o
     */
    onDropGridRowEnter: function (grid, o) {
      var me = this;

      if (me.cellMouseDown === false) {
        //Fix core bug. In future needs to find out what it is.
        //'un' does not unset handler
        me.dropGrid.un('rowenter', me.onDropGridRowEnter);
        me.dropGrid.un('rowleave', me.onDropGridRowLeave);
      }

      me.clearCellsMask();

      if (o.rowIndex === 0) {
        grid.el.addCls(me.dropHeaderMaskCls);
      }
      else {
        grid.el.select('.' + GRID_CELL_CLS + '[index="' + (o.rowIndex - 1) + '"]').addCls(me.cellMaskCls);
      }

      if (me.cellMouseDown === false) {
        me.clearCellsMask();
      }

      if (me.dropGrid) {
        me.dropGrid.activeRowEnterIndex = o.rowIndex;
      }
    },
    /*
     * @param {Fancy.Grid} grid
     * @param {Object} o
     */
    onDropGridRowLeave: function (grid, o) {
      var me = this;

      me.clearCellsMask();
      me.setDropGridCellsMask();

      if (me.dropGrid) {
        delete me.dropGrid.activeRowEnterIndex;
      }
    },
    clearCellsMask: function () {
      var me = this,
        cellMaskCls = me.cellMaskCls;

      if (!me.dropGrid) {
        return;
      }

      me.dropGrid.el.removeCls(me.dropHeaderMaskCls);
      me.dropGrid.el.select('.' + cellMaskCls).removeCls(cellMaskCls);
    },
    /*
     * @param {Object} e
     */
    onDocMouseUp: function (e) {
      var me = this,
        w = me.widget,
        docEl = F.get(document);

      me.cellMouseDown = false;
      if (me.tip) {
        me.tip.hide();
      }
      w.enableSelection();

      docEl.un('mousemove', me.onDocMouseMove);

      if (me.dropOK === true) {
        w.clearSelection();
        me.dropGrid.clearSelection();
        me.fire('drop', me.dragItems);
      }

      delete me.dragItems;
      me.dropOK = false;

      F.select('.' + me.dropZoneCls).removeCls(me.dropZoneCls);

      me.clearCellsMask();

      if (me.dropGrid) {
        me.dropGrid.un('rowenter', me.onDropGridRowEnter);
        me.dropGrid.un('rowleave', me.onDropGridRowLeave);
        //delete me.dropGrid;
      }

      delete me.dropGridEventInited;
    },
    /*
     * @param {Object} e
     */
    onDocMouseMove: function (e) {
      if (!this.dragItems) {
        return;
      }

      this.tip.show(e.pageX + 20, e.pageY + 20);
    },
    /*
     * @param {Fancy.Grid} grid
     * @param {Object} o
     */
    onCellLeave: function (grid, o) {
      var me = this,
        w = me.widget,
        lang = w.lang;

      setTimeout(function () {
        if (me.onceStopDrag) {
          me.onceStopDrag = false;
          return;
        }

        if (me.cellMouseDown !== true || me.dragItems) {
          return;
        }

        var selected = w.getSelection(),
          text = F.String.format(lang.dragText, [selected.length, selected.length > 1 ? 's' : '']);

        w.stopSelection();
        me.initTip(text, o.e);

        me.tip.show();
        me.tip.el.css('display', 'block');

        me.dragItems = selected;
      }, 1);
    },
    /*
     * @param {Fancy.Grid} grid
     * @param {Object} o
     */
    onCellEnter: function (grid, o) {
      var me = this;

      if (me.cellMouseDown !== true || me.dragItems) {
        return;
      }

      if (o.rowIndex !== me.activeRowIndex) {
        me.onceStopDrag = true;
        me.activeRowIndex = o.rowIndex;
      }
    },
    /*
     * @param {String} text
     * @param {Object} e
     */
    initTip: function (text, e) {
      var me = this,
        dropNotOkCls = me.dropNotOkCls;

      if (!me.tip) {
        me.tip = new F.ToolTip({
          cls: dropNotOkCls,
          text: text
        });
      }

      if (e) {
        me.tip.show(e.pageX + 20, e.pageY + 20);
      }

      me.tip.update(text);
      me.tip.el.replaceClass(me.dropOkCls, dropNotOkCls);
    }
  });

})();
/*
 * @class Fancy.grid.plugin.Exporter
 * @extends Fancy.Plugin
 */
Fancy.define('Fancy.grid.plugin.Exporter', {
  extend: Fancy.Plugin,
  ptype: 'grid.exporter',
  inWidgetName: 'exporter',
  /*
   * @param {Object} config
   */
  constructor: function(config){
    this.Super('const', arguments);
  },
  /*
   *
   */
  init: function(){},
  /*
   *
   */
  exportToExcel: function(){
    var me = this,
      w = me.widget,
      columnsData = me.getColumnsData(),
      data = me.getData(),
      dataToExport = [columnsData].concat(data),
      Workbook = function(){
        if(!(this instanceof Workbook)) return new Workbook();
        this.SheetNames = [];
        this.Sheets = {};
      },
      wb = new Workbook(),
      ws = me.sheet_from_array_of_arrays(dataToExport);

    ws['!cols'] = [];

    Fancy.each(me.widths, function(width){
      ws['!cols'].push({
        wch: width
      });
    });

    var ws_name = w.title || 'grid_data';

    /* add worksheet to workbook */
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;
    var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});

    function s2ab(s){
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    }

    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), ws_name + ".xlsx")
  },
  getColumnsData: function(){
    var me = this,
      w = me.widget,
      columns = [].concat(w.leftColumns).concat(w.columns).concat(w.rightColumns),
      data = [];

    me.widths = [];

    Fancy.each(columns, function(column){
      me.widths.push(column.width);
      data.push(column.title || '');
    });

    return data;
  },
  getData: function(){
    var me = this,
      w = me.widget,
      data = [],
      displayedData = w.getDisplayedData();

    Fancy.each(displayedData, function(rowData){
      var _rowData = [];

      Fancy.each(rowData, function(value){
        _rowData.push(value);
      });

      data.push(_rowData);
    });

    return data;
  },
  sheet_from_array_of_arrays: function(data, opts){
    var ws = {},
      range = {
        s: {
          c:10000000,
          r:10000000
        },
        e: {
          c:0,
          r:0
        }
      },
      R = 0,
      RL = data.length;

    var datenum = function(v, date1904){
      if(date1904){
        v += 1462;
      }
      var epoch = Date.parse(v);

      return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
    };

    for(;R != RL;++R){
      for(var C = 0; C != data[R].length; ++C) {
        if(range.s.r > R) {
          range.s.r = R;
        }

        if(range.s.c > C) {
          range.s.c = C;
        }

        if(range.e.r < R) {
          range.e.r = R;
        }

        if(range.e.c < C) {
          range.e.c = C;
        }

        var cell = {
          v: data[R][C]
        };

        if(cell.v == null) {
          continue;
        }

        var cell_ref = XLSX.utils.encode_cell({
          c:C,
          r:R
        });

        if(typeof cell.v === 'number') {
          cell.t = 'n';
        }
        else if(typeof cell.v === 'boolean') {
          cell.t = 'b';
        }
        else if(cell.v instanceof Date) {
          cell.t = 'n'; cell.z = XLSX.SSF._table[14];
          cell.v = datenum(cell.v);
        }
        else {
          cell.t = 's';
        }

        ws[cell_ref] = cell;
      }
    }

    if(range.s.c < 10000000) {
      ws['!ref'] = XLSX.utils.encode_range(range);
    }

    return ws;
  }
});
/*
 * @class Fancy.grid.plugin.Licence
 * @extends Fancy.Plugin
 */
Fancy.define('Fancy.grid.plugin.Licence', {
  extend: Fancy.Plugin,
  ptype: 'grid.licence',
  inWidgetName: 'licence',
  /*
   * @constructor
   * @param {Object} config
   */
  constructor: function(config){
    this.Super('const', arguments);
  },
  /*
   *
   */
  init: function(){
    this.Super('init', arguments);
    this.ons();
  },
  /*
   *
   */
  ons: function(){
    var me = this,
      w = me.widget;

    w.once('render', function() {
      me.render();
    });
  },
  /*
   *
   */
  render: function(){
    var me = this,
      w = me.widget,
      body = w.body,
      licenceEl = Fancy.get(document.createElement('div'));

    if(/fancygrid/.test(location.host) && !w.watermark){
      return;
    }

    if( me.checkLicence() === true && !w.watermark){
      return;
    }

    licenceEl.css({
      position: 'absolute',
      'z-index': 2,
      width: '30px',
      height: '30px'
    });

    if(w.nativeScroller){
      licenceEl.css({
        top: '2px',
        left: '2px'
      });
    }
    else{
      licenceEl.css({
        right: '4px',
        bottom: '0px'
      });
    }

    licenceEl.update('<a href="http://www.fancygrid.com" title="JavaScript Grid - FancyGrid" style="background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAPklEQVR42mNgGLGAo+/4f1IwTN+i8y/+k4JHLR61eNTiUYuHgcUjD5AbZORG0ajFoxaPWjxq8RC2eBQMWwAAuxzh7E9tdUsAAAAASUVORK5CYII=);color: #60B3E2;font-size: 25px;line-height: 30px;text-decoration: none;">&nbsp;&nbsp;&nbsp;&nbsp;</a>');

    Fancy.get(body.el.append(licenceEl.dom));

    me.licenceEl = licenceEl;

    if(w.watermark){
      me.configWatermark();
    }

    me.showConsoleText();
  },
  showConsoleText: function(){
    if(!window.console || !console.log){
      return;
    }

    if(!Fancy.isChrome){
      return;
    }

    console.log("%cFancy%cGrid%c %cTrial%c Version! \nPurchase license for legal usage!\nSales email: sales@fancygrid.com",
      'color:#A2CFE8;font-size: 14px;font-weight: bold;',
      'color:#088EC7;font-size: 14px;font-weight: bold;',
      'font-weight:bold;color: #515151;font-size: 12px;',
      'color: red;font-weight: bold;font-size: 14px;',
      'font-weight:bold;color: #515151;font-size: 12px;'
    );
  },
  /*
   *
   */
  configWatermark: function(){
    var me = this,
      w = me.widget,
      watermark = w.watermark;

    if(watermark.text){
      var link = me.licenceEl.firstChild();

      link.css('background-image', 'none');
      link.css('font-size', '11px');
      link.update(watermark.text);
      me.licenceEl.css('width', 'initial');
    }

    if(watermark.style){
      me.licenceEl.css(watermark.style);
    }
  },
  /*
   * @return {Boolean}
   */
  checkLicence: function(){
    var me = this,
      keyWord = 'FancyGrid';

    if(!Fancy.LICENSE && !FancyGrid.LICENSE){
      return false;
    }

    var hostCode = String(me.md5(location.host.replace(/^www\./, ''), keyWord)),
      i,
      iL,
      license,
      LICENSE = Fancy.LICENSE || FancyGrid.LICENSE || [],
      UNIVERSAL = me.md5('UNIVERSAL', keyWord),
      SAAS = me.md5('SAAS', keyWord),
      INTERNAL = me.md5('INTERNAL', keyWord),
      OEM = me.md5('OEM', keyWord),
      ENTERPRISE = me.md5('ENTERPRISE', keyWord);

    i = 0;
    iL = LICENSE.length;

    for(;i<iL;i++){
      license = String(LICENSE[i]);

      switch (license){
        case hostCode:
        case UNIVERSAL:
        case SAAS:
        case INTERNAL:
        case OEM:
        case ENTERPRISE:
          return true;
      }
    }

    return false;
  },
  /*
   * @param {String} string
   * @param {String} key
   * @param {String} raw
   * @return {String}
   */
  md5: function(string, key, raw){
      /*
       * Add integers, wrapping at 2^32. This uses 16-bit operations internally
       * to work around bugs in some JS interpreters.
       */
      var safe_add = function(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF),
          msw = (x >> 16) + (y >> 16) + (lsw >> 16);

        return (msw << 16) | (lsw & 0xFFFF);
      };

      /*
       * Bitwise rotate a 32-bit number to the left.
       */
      var bit_rol = function(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
      };

      /*
       * These functions implement the four basic operations the algorithm uses.
       */
      var md5_cmn = function(q, a, b, x, s, t) {
        return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
      };

      var md5_ff = function(a, b, c, d, x, s, t) {
        return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
      };

      var md5_gg = function(a, b, c, d, x, s, t) {
        return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
      };

      var md5_hh = function(a, b, c, d, x, s, t) {
        return md5_cmn(b ^ c ^ d, a, b, x, s, t);
      };

      var md5_ii = function(a, b, c, d, x, s, t) {
        return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
      };

      /*
       * Calculate the MD5 of an array of little-endian words, and a bit length.
       */
      var binl_md5 = function(x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << (len % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;

        var i,
          olda,
          oldb,
          oldc,
          oldd,
          a = 1732584193,
          b = -271733879,
          c = -1732584194,
          d = 271733878;

        for (i = 0; i < x.length; i += 16) {
          olda = a;
          oldb = b;
          oldc = c;
          oldd = d;

          a = md5_ff(a, b, c, d, x[i], 7, -680876936);
          d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
          c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
          b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
          a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
          d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
          c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
          b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
          a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
          d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
          c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
          b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
          a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
          d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
          c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
          b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

          a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
          d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
          c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
          b = md5_gg(b, c, d, a, x[i], 20, -373897302);
          a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
          d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
          c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
          b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
          a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
          d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
          c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
          b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
          a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
          d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
          c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
          b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

          a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
          d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
          c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
          b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
          a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
          d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
          c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
          b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
          a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
          d = md5_hh(d, a, b, c, x[i], 11, -358537222);
          c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
          b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
          a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
          d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
          c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
          b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

          a = md5_ii(a, b, c, d, x[i], 6, -198630844);
          d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
          c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
          b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
          a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
          d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
          c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
          b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
          a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
          d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
          c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
          b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
          a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
          d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
          c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
          b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

          a = safe_add(a, olda);
          b = safe_add(b, oldb);
          c = safe_add(c, oldc);
          d = safe_add(d, oldd);
        }

        return [a, b, c, d];
      };

      /*
       * Convert an array of little-endian words to a string
       */
      var binl2rstr = function(input) {
        var i,
          output = '';

        for (i = 0; i < input.length * 32; i += 8) {
          output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
        }

        return output
      };

      /*
       * Convert a raw string to an array of little-endian words
       * Characters >255 have their high-byte silently ignored.
       */
      var rstr2binl = function (input) {
        var i,
          output = [];

        output[(input.length >> 2) - 1] = undefined;
        for (i = 0; i < output.length; i += 1) {
          output[i] = 0;
        }

        for (i = 0; i < input.length * 8; i += 8) {
          output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
        }

        return output;
      };

      /*
       * Calculate the MD5 of a raw string
       */
      var rstr_md5 = function(s){
        return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
      };

      /*
       * Calculate the HMAC-MD5, of a key and some data (raw strings)
       */
      var rstr_hmac_md5 = function (key, data) {
        var i,
          bkey = rstr2binl(key),
          ipad = [],
          opad = [],
          hash;

        ipad[15] = opad[15] = undefined;
        if (bkey.length > 16) {
          bkey = binl_md5(bkey, key.length * 8);
        }

        for (i = 0; i < 16; i += 1) {
          ipad[i] = bkey[i] ^ 0x36363636;
          opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }
        hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
        return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
      };

      /*
       * Convert a raw string to a hex string
       */
      var rstr2hex = function(input){
        var hex_tab = '0123456789abcdef',
          output = '',
          x,
          i;

        for (i = 0; i < input.length; i += 1) {
          x = input.charCodeAt(i);
          output += hex_tab.charAt((x >>> 4) & 0x0F) + hex_tab.charAt(x & 0x0F);
        }
        return output
      };

      /*
       * Encode a string as utf-8
       */
      var str2rstr_utf8 = function(input){
        return unescape(encodeURIComponent(input));
      };

      /*
       * Take string arguments and return either raw or hex encoded strings
       */
      var raw_md5 = function(s) {
        return rstr_md5(str2rstr_utf8(s));
      };

      var hex_md5 = function(s) {
        return rstr2hex(raw_md5(s));
      };

      var raw_hmac_md5 = function(k, d) {
        return rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d));
      };

      var hex_hmac_md5 = function(k, d) {
        return rstr2hex(raw_hmac_md5(k, d));
      };

      var md5 = function(string, key, raw) {
        if (!key) {
          if (!raw) {
            return hex_md5(string);
          }
          return raw_md5(string);
        }
        if (!raw) {
          return hex_hmac_md5(key, string);
        }
        return raw_hmac_md5(key, string);
      };

    return md5(string, key, raw);
  }
});
/*
 * @mixin Fancy.grid.body.mixin.Updater
 */
(function() {
  //SHORTCUTS
  var F = Fancy;

  // CONSTANTS
  var GRID_CELL_CLS = F.GRID_CELL_CLS;
  var GRID_CELL_EVEN_CLS = F.GRID_CELL_EVEN_CLS;
  var GRID_COLUMN_CLS = F.GRID_COLUMN_CLS;
  var GRID_COLUMN_TEXT_CLS = F.GRID_COLUMN_TEXT_CLS;
  var GRID_COLUMN_ELLIPSIS_CLS = F.GRID_COLUMN_ELLIPSIS_CLS;
  var GRID_COLUMN_ORDER_CLS = F.GRID_COLUMN_ORDER_CLS;
  var GRID_COLUMN_SELECT_CLS = F.GRID_COLUMN_SELECT_CLS;
  var GRID_CELL_INNER_CLS = F.GRID_CELL_INNER_CLS;
  var GRID_CELL_DIRTY_CLS = F.GRID_CELL_DIRTY_CLS;
  var GRID_CELL_DIRTY_EL_CLS = F.GRID_CELL_DIRTY_EL_CLS;
  var GRID_PSEUDO_CELL_CLS = F.GRID_PSEUDO_CELL_CLS;
  var GRID_EMPTY_CLS =  F.GRID_EMPTY_CLS;
  var GRID_COLUMN_SPARKLINE_CLS = F.GRID_COLUMN_SPARKLINE_CLS;
  var GRID_COLUMN_SPARKLINE_BULLET_CLS = F.GRID_COLUMN_SPARKLINE_BULLET_CLS;
  var GRID_COLUMN_CHART_CIRCLE_CLS = F.GRID_COLUMN_CHART_CIRCLE_CLS;
  var GRID_COLUMN_SPARK_PROGRESS_DONUT_CLS =  F.GRID_COLUMN_SPARK_PROGRESS_DONUT_CLS;
  var GRID_COLUMN_GROSSLOSS_CLS = F.GRID_COLUMN_GROSSLOSS_CLS;
  var GRID_COLUMN_PROGRESS_CLS = F.GRID_COLUMN_PROGRESS_CLS;
  var GRID_COLUMN_PROGRESS_BAR_CLS = F.GRID_COLUMN_PROGRESS_BAR_CLS;
  var GRID_COLUMN_H_BAR_CLS = F.GRID_COLUMN_H_BAR_CLS;

  F.ns('Fancy.grid.body.mixin');

  /*
   * @mixin Fancy.grid.body.mixin.Updater
   */
  F.grid.body.mixin.Updater = function () {};

  F.grid.body.mixin.Updater.prototype = {
    /*
     *
     */
    update: function () {
      var me = this,
        w = me.widget,
        s = w.store;

      me.checkDomColumns();

      if (s.loading) {
        return;
      }

      me.checkDomCells();
      me.updateRows();

      me.showEmptyText();
    },
    /*
     *
     */
    checkDomColumns: function () {
      var me = this,
        w = me.widget,
        numExistedColumn = me.el.select('.' + GRID_COLUMN_CLS).length,
        columns = me.getColumns(),
        i = 0,
        iL = columns.length;

      if (iL <= numExistedColumn) {
        return;
      }

      for (; i < iL; i++) {
        var column = columns[i],
          width = column.width,
          el = F.get(document.createElement('div'));

        if (column.hidden) {
          el.css('display', 'none');
        }

        el.addCls(GRID_COLUMN_CLS);
        el.attr('grid', w.id);

        if (column.index === '$selected') {
          el.addCls(GRID_COLUMN_SELECT_CLS);
        }
        else {
          switch (column.type) {
            case 'order':
              el.addCls(GRID_COLUMN_ORDER_CLS);
              break;
          }
        }

        if (column.cls) {
          el.addCls(column.cls);
        }

        if (column.type === 'text') {
          el.addCls(GRID_COLUMN_TEXT_CLS);
        }

        el.css({
          width: width + 'px'
        });
        el.attr('index', i);

        if (column.cellAlign) {
          el.css('text-align', column.cellAlign);
        }

        if (column.ellipsis === true) {
          switch (column.type) {
            case 'string':
            case 'text':
            case 'number':
              el.addCls(GRID_COLUMN_ELLIPSIS_CLS);
              break;
          }
        }

        me.el.dom.appendChild(el.dom);
      }

      me.fire('adddomcolumns');
    },
    /*
     * @param {number} indexOrder
     */
    checkDomCells: function (indexOrder) {
      var me = this,
        w = me.widget,
        s = w.store,
        i = 0,
        iL = s.dataView.length,
        j = 0,
        jL,
        columns,
        column;

      switch (me.side) {
        case 'left':
          columns = w.leftColumns;
          break;
        case 'center':
          columns = w.columns;
          break;
        case 'right':
          columns = w.rightColumns;
          break;
      }

      jL = columns.length;

      var columsDom = me.el.select('.' + GRID_COLUMN_CLS),
        dataLength = s.getLength(),
        cellTpl = me.cellTpl;

      if (w.cellWrapper) {
        cellTpl = me.cellWrapperTpl;
      }

      if (indexOrder !== undefined) {
        j = indexOrder;
        jL = indexOrder;
      }

      for (; j < jL; j++) {
        column = columns[j];
        var columnDom = columsDom.item(j);
        i = 0;
        var delta = dataLength - columnDom.select('.' + GRID_CELL_CLS).length;
        i = iL - delta;
        for (; i < iL; i++) {
          var cellHTML = cellTpl.getHTML({});

          var el = F.get(document.createElement('div'));
          el.css({
            height: w.cellHeight + 'px'
          });
          el.addCls(GRID_CELL_CLS);
          el.attr('index', i);

          if (i % 2 !== 0 && w.striped) {
            el.addCls(GRID_CELL_EVEN_CLS)
          }
          el.update(cellHTML);
          columnDom.dom.appendChild(el.dom);
        }

        if (w.nativeScroller && (me.side === 'left' || me.side === 'right')) {
          columnDom.select('.' + GRID_PSEUDO_CELL_CLS).destroy();

          var cellHTML = cellTpl.getHTML({
            cellValue: '&nbsp;'
          });

          var el = F.get(document.createElement('div'));
          el.css({
            height: w.cellHeight + 'px'
          });
          el.addCls(GRID_PSEUDO_CELL_CLS);

          el.update(cellHTML);
          columnDom.dom.appendChild(el.dom);
        }
      }
    },
    /*
     * @param {Number} rowIndex
     * @param {Number} columnIndex
     */
    updateRows: function (rowIndex, columnIndex) {
      var me = this,
        w = me.widget,
        i = 0,
        columns,
        iL;

      if (rowIndex === undefined) {
        me.clearDirty();
      }
      else {
        me.clearDirty(rowIndex);
      }

      switch (me.side) {
        case 'left':
          columns = w.leftColumns;
          break;
        case 'center':
          columns = w.columns;
          break;
        case 'right':
          columns = w.rightColumns;
          break;
      }

      iL = columns.length;

      if (columnIndex !== undefined) {
        i = columnIndex;
        iL = columnIndex + 1;
      }

      for (; i < iL; i++) {
        var column = columns[i];

        switch (column.type) {
          case 'string':
          case 'number':
          case 'combo':
          case 'action':
          case 'text':
          case 'date':
          case 'currency':
            me.renderUniversal(i, rowIndex);
            break;
          case 'order':
            me.renderOrder(i, rowIndex);
            break;
          case 'expand':
            me.renderExpand(i, rowIndex);
            break;
          case 'select':
            me.renderSelect(i, rowIndex);
            break;
          case 'color':
            me.renderColor(i, rowIndex);
            break;
          case 'checkbox':
            me.renderCheckbox(i, rowIndex);
            break;
          case 'image':
            me.renderImage(i, rowIndex);
            break;
          case 'sparklineline':
            me.renderSparkLine(i, rowIndex, 'line');
            break;
          case 'sparklinebar':
            me.renderSparkLine(i, rowIndex, 'bar');
            break;
          case 'sparklinetristate':
            me.renderSparkLine(i, rowIndex, 'tristate');
            break;
          case 'sparklinediscrete':
            me.renderSparkLine(i, rowIndex, 'discrete');
            break;
          case 'sparklinebullet':
            me.renderSparkLine(i, rowIndex, 'bullet');
            break;
          case 'sparklinepie':
            me.renderSparkLine(i, rowIndex, 'pie');
            break;
          case 'sparklinebox':
            me.renderSparkLine(i, rowIndex, 'box');
            break;
          case 'circle':
            me.renderCircle(i, rowIndex);
            break;
          case 'progressdonut':
            me.renderProgressDonut(i, rowIndex);
            break;
          case 'progressbar':
            me.renderProgressBar(i, rowIndex);
            break;
          case 'hbar':
            me.renderHBar(i, rowIndex);
            break;
          case 'grossloss':
            me.renderGrossLoss(i, rowIndex);
            break;
          default:
            throw new Error('[FancyGrid error] - not existed column type ' + column.type);
            break;
        }
      }

      me.removeNotUsedCells();
    },
    /*
     * @param {Number} i
     * @param {Number} rowIndex
     */
    renderUniversal: function (i, rowIndex) {
      var me = this,
        w = me.widget,
        lang = w.lang,
        emptyValue = w.emptyValue,
        s = w.store,
        columns = me.getColumns(),
        column = columns[i],
        key,
        columsDom = me.el.select('.' + GRID_COLUMN_CLS),
        columnDom = columsDom.item(i),
        cellsDom = columnDom.select('.' + GRID_CELL_CLS),
        cellsDomInner = columnDom.select('.' + GRID_CELL_CLS + ' .' + GRID_CELL_INNER_CLS),
        j,
        jL,
        currencySign = lang.currencySign;

      if (column.key !== undefined) {
        key = column.key;
      }
      else if (column.index !== undefined) {
        key = column.index;
      }
      else {
        key = column.type === 'action' ? 'none' : undefined;
      }

      if (rowIndex !== undefined) {
        j = rowIndex;
        jL = rowIndex + 1;
      }
      else {
        j = 0;
        jL = s.getLength();
      }

      for (; j < jL; j++) {
        var data = s.get(j),
          id = s.getId(j),
          inner = cellsDomInner.item(j),
          cell = cellsDom.item(j),
          o = {
            rowIndex: j,
            data: data,
            style: {},
            column: column,
            id: id,
            item: s.getItem(j),
            inner: inner,
            cell: cell
          },
          value,
          dirty = false;

        if (s.changed[o.id] && s.changed[o.id][column.index]) {
          dirty = true;
        }

        if (column.smartIndexFn) {
          value = column.smartIndexFn(data);
        }
        else {
          value = s.get(j, key);
        }

        o.value = value;

        if (column.format) {
          o.value = me.format(o.value, column.format);
          value = o.value;
        }

        switch (column.type) {
          case 'currency':
            if (value !== '') {
              value = currencySign + value;
            }
            o.value = value;
            break;
        }

        if (column.render) {
          o = column.render(o);
          value = o.value;
        }

        switch (value) {
          case '':
          case undefined:
            value = emptyValue;
            break;
        }

        if (w.cellStylingCls) {
          me.clearCls(cell);
        }

        if (o.cls) {
          cell.addCls(o.cls);
        }

        if (dirty && w.dirtyEnabled) {
          me.enableCellDirty(cell);
        }

        cell.css(o.style);

        if (!o.column.widget) {
          inner.update(value);
        }
      }
    },
    /*
     * @param {Number} i
     */
    renderOrder: function (i) {
      var me = this,
        w = me.widget,
        s = w.store,
        columns = me.getColumns(),
        column = columns[i],
        columsDom = me.el.select('.' + GRID_COLUMN_CLS),
        columnDom = columsDom.item(i),
        cellsDom = columnDom.select('.' + GRID_CELL_CLS),
        cellsDomInner = columnDom.select('.' + GRID_CELL_CLS + ' .' + GRID_CELL_INNER_CLS),
        j = 0,
        jL = s.getLength(),
        plusValue = 0;

      if (w.paging) {
        plusValue += s.showPage * s.pageSize;
      }

      for (; j < jL; j++) {
        var data = s.get(j),
          id = s.getId(j),
          o = {
            rowIndex: j,
            data: data,
            style: {},
            column: column,
            id: id,
            item: s.getItem(j)
          },
          value = j + 1 + plusValue;

        o.value = value;

        if (column.render) {
          o = column.render(o);
          value = o.value;
        }

        var cell = cellsDom.item(j);
        if (w.cellStylingCls) {
          me.clearCls(cell);
        }

        if (o.cls) {
          cell.addCls(o.cls);
        }

        cell.css(o.style);
        cellsDomInner.item(j).update(value);
      }
    },
    /*
     * @param {Number} i
     * @param {Number} rowIndex
     */
    renderExpand: function (i, rowIndex) {
      var me = this,
        w = me.widget,
        s = w.store,
        columsDom = me.el.select('.' + GRID_COLUMN_CLS),
        columnDom = columsDom.item(i),
        cellsDomInner = columnDom.select('.' + GRID_CELL_CLS + ' .' + GRID_CELL_INNER_CLS),
        j,
        jL;

      if (rowIndex !== undefined) {
        j = rowIndex;
        jL = rowIndex + 1;
      }
      else {
        j = 0;
        jL = s.getLength();
      }

      for (; j < jL; j++) {
        var cellInnerEl = cellsDomInner.item(j),
          checkBox = cellInnerEl.select('.fancy-field-checkbox'),
          checkBoxId,
          isCheckBoxInside = checkBox.length !== 0,
          dataItem = w.get(j),
          dataItemId = dataItem.id;

        if (isCheckBoxInside === false) {
          new F.CheckBox({
            renderTo: cellsDomInner.item(j).dom,
            renderId: true,
            value: false,
            label: false,
            expander: true,
            style: {
              padding: '0px',
              display: 'inline-block'
            },
            events: [{
              change: function (checkbox, value) {
                rowIndex = checkbox.el.parent().parent().attr('index');

                if (value) {
                  w.expander.expand(rowIndex);
                }
                else {
                  w.expander.collapse(rowIndex);
                }
              }
            }]
          });
        }
        else {
          checkBoxId = checkBox.dom.id;
          checkBox = F.getWidget(checkBoxId);

          if (w.expander._expandedIds[dataItemId]) {
            checkBox.set(true, false);
          }
          else {
            checkBox.set(false, false);
          }
        }
      }
    },
    /*
     * @param {Fancy.Element} cell
     */
    clearCls: function (cell) {
      var w = this.widget;

      F.each(w.cellStylingCls, function (cls) {
        cell.removeCls(cls);
      });
    },
    /*
     * @param {Number} i
     * @param {Number} rowIndex
     */
    renderColor: function (i, rowIndex) {
      var me = this,
        w = me.widget,
        s = w.store,
        columns = me.getColumns(),
        column = columns[i],
        key = column.key || column.index,
        columsDom = me.el.select('.' + GRID_COLUMN_CLS),
        columnDom = columsDom.item(i),
        cellsDom = columnDom.select('.' + GRID_CELL_CLS),
        j,
        jL;

      if (rowIndex !== undefined) {
        j = rowIndex;
        jL = rowIndex + 1;
      }
      else {
        j = 0;
        jL = s.getLength();
      }

      for (; j < jL; j++) {
        var data = s.get(j),
          o = {
            rowIndex: j,
            data: data,
            style: {},
            column: column
          },
          value;

        if (column.smartIndexFn) {
          value = column.smartIndexFn(data);
        }
        else {
          value = s.get(j, key);
        }

        if (column.render) {
          o = column.render(o);
          value = o.value;
        }

        o.value = value;

        var cell = cellsDom.item(j);
        cell.css(o.style);

        var cellInner = cell.select('.' + GRID_CELL_INNER_CLS);
        cellInner.update('<div class="fancy-grid-color-cell" style="background: ' + value + ';"></div>');
      }
    },
    /*
     * @param {Number} i
     * @param {Number} rowIndex
     */
    renderCombo: function (i, rowIndex) {
      var me = this,
        w = me.widget,
        s = w.store,
        columns = me.getColumns(),
        column = columns[i],
        key = column.key || column.index,
        columsDom = me.el.select('.' + GRID_COLUMN_CLS),
        columnDom = columsDom.item(i),
        cellsDom = columnDom.select('.' + GRID_CELL_CLS),
        cellsDomInner = columnDom.select('.' + GRID_CELL_CLS + ' .' + GRID_CELL_INNER_CLS),
        j,
        jL;

      if (rowIndex !== undefined) {
        j = rowIndex;
        jL = rowIndex + 1;
      }
      else {
        j = 0;
        jL = s.getLength();
      }

      for (; j < jL; j++) {
        var value = s.get(j, key),
          o = {
            rowIndex: j,
            value: value,
            style: {}
          };

        if (column.render) {
          o = column.render(o);
          value = o.value;
        }

        cellsDom.item(j).css(o.style);
        cellsDomInner.item(j).update(value);
      }
    },
    /*
     * @param {Number} i
     * @param {Number} rowIndex
     */
    renderCheckbox: function (i, rowIndex) {
      var me = this,
        w = me.widget,
        s = w.store,
        columns = me.getColumns(),
        column = columns[i],
        key = column.key || column.index,
        columsDom = me.el.select('.' + GRID_COLUMN_CLS),
        columnDom = columsDom.item(i),
        cellsDom = columnDom.select('.' + GRID_CELL_CLS),
        cellsDomInner = columnDom.select('.' + GRID_CELL_CLS + ' .' + GRID_CELL_INNER_CLS),
        j,
        jL;

      if (rowIndex !== undefined) {
        j = rowIndex;
        jL = rowIndex + 1;
      }
      else {
        j = 0;
        jL = s.getLength();
      }

      for (; j < jL; j++) {
        var data = s.get(j),
          value = s.get(j, key),
          cellInnerEl = cellsDomInner.item(j),
          checkBox = cellInnerEl.select('.fancy-field-checkbox'),
          checkBoxId,
          isCheckBoxInside = checkBox.length !== 0,
          dirty = false,
          id = s.getId(j),
          o = {
            rowIndex: j,
            data: data,
            style: {},
            column: column,
            id: id,
            item: s.getItem(j),
            value: value
          };

        if (s.changed[o.id] && s.changed[o.id][column.index]) {
          dirty = true;
        }

        if (column.render) {
          o = column.render(o);
          value = o.value;
        }

        if (isCheckBoxInside === false) {

          if (!o.stopped) {
            var editable = true;

            if (w.rowEdit) {
              editable = false;
            }

            cellsDomInner.item(j).update('');

            new F.CheckBox({
              renderTo: cellsDomInner.item(j).dom,
              renderId: true,
              value: value,
              label: false,
              editable: editable,
              style: {
                padding: '0px',
                display: 'inline-block'
              },
              events: [{
                beforechange: function (checkbox) {
                  if (column.index === '$selected') {
                    return;
                  }

                  if (column.editable !== true) {
                    checkbox.canceledChange = true;
                  }
                }
              }, {
                change: function (checkbox, value) {
                  if (column.index === '$selected') {
                    return;
                  }

                  w.celledit.checkBoxChangedValue = value;
                }
              }]
            });
          }
          else {
            cellsDomInner.item(j).update(value);
          }
        }
        else {
          checkBoxId = checkBox.dom.id;
          checkBox = F.getWidget(checkBoxId);
          if (o.stopped) {
            checkBox.destroy();
            cellsDomInner.item(j).update(value);
          }
          else {
            checkBox.set(value, false);
          }
        }

        if (dirty) {
          var cell = cellsDom.item(j);
          me.enableCellDirty(cell);
        }
      }
    },
    /*
     * @param {Number} i
     * @param {Number} rowIndex
     */
    renderSelect: function (i, rowIndex) {
      var me = this,
        w = me.widget,
        s = w.store,
        columns = me.getColumns(),
        column = columns[i],
        key = column.key || column.index,
        columsDom = me.el.select('.' + GRID_COLUMN_CLS),
        columnDom = columsDom.item(i),
        cellsDomInner = columnDom.select('.' + GRID_CELL_CLS + ' .' + GRID_CELL_INNER_CLS),
        j,
        jL;

      if (rowIndex !== undefined) {
        j = rowIndex;
        jL = rowIndex + 1;
      }
      else {
        j = 0;
        jL = s.getLength();
      }

      for (; j < jL; j++) {
        var value = s.get(j, key),
          id = s.get(j, 'id'),
          cellInnerEl = cellsDomInner.item(j),
          checkBox = cellInnerEl.select('.fancy-field-checkbox'),
          checkBoxId,
          isCheckBoxInside = checkBox.length !== 0;

        if (w.selection.memory) {
          if (w.selection.memory.all && !w.selection.memory.except[id]) {
            value = true;
            w.selection.domSelectRow(j);
          }
          else if (w.selection.memory.selected[id]) {
            value = true;
            w.selection.domSelectRow(j);
          }
          else {
            value = false;
            w.selection.domDeSelectRow(j);
          }
        }

        if (isCheckBoxInside === false) {
          new F.CheckBox({
            renderTo: cellsDomInner.item(j).dom,
            renderId: true,
            value: value,
            label: false,
            stopIfCTRL: true,
            style: {
              padding: '0px',
              display: 'inline-block'
            }
          });
        }
        else {
          checkBoxId = checkBox.dom.id;
          checkBox = F.getWidget(checkBoxId);
          checkBox.set(value, false);
        }
      }
    },
    /*
     * @param {Number} i
     * @param {Number} rowIndex
     */
    renderImage: function (i, rowIndex) {
      var me = this,
        w = me.widget,
        s = w.store,
        columns = me.getColumns(),
        column = columns[i],
        key = column.key || column.index,
        columsDom = me.el.select('.' + GRID_COLUMN_CLS),
        columnDom = columsDom.item(i),
        cellsDom = columnDom.select('.' + GRID_CELL_CLS),
        cellsDomInner = columnDom.select('.' + GRID_CELL_CLS + ' .' + GRID_CELL_INNER_CLS),
        j,
        jL;

      if (rowIndex !== undefined) {
        j = rowIndex;
        jL = rowIndex + 1;
      }
      else {
        j = 0;
        jL = s.getLength();
      }

      for (; j < jL; j++) {
        var value = s.get(j, key),
          data = s.get(j),
          o = {
            rowIndex: j,
            value: value,
            data: data,
            style: {}
          },
          attr = '';

        if (column.render) {
          o = column.render(o);
          value = o.value;
        }

        if (o.attr) {
          for (var p in o.attr) {
            attr += p + '="' + o.attr[p] + '"';
          }
        }

        value = '<img ' + attr + ' src="' + o.value + '">';

        cellsDom.item(j).css(o.style);
        cellsDomInner.item(j).update(value);
      }
    },
    /*
     * @param {Number} i
     * @param {Number} rowIndex
     * @param {String} type
     */
    renderSparkLine: function (i, rowIndex, type) {
      var me = this,
        w = me.widget,
        cellHeight = w.cellHeight,
        s = w.store,
        columns = me.getColumns(),
        column = columns[i],
        columnWidth = column.width,
        key = column.key || column.index,
        columsDom = me.el.select('.' + GRID_COLUMN_CLS),
        columnDom = columsDom.item(i),
        cellsDom = columnDom.select('.' + GRID_CELL_CLS),
        cellsDomInner = columnDom.select('.' + GRID_CELL_CLS + ' .' + GRID_CELL_INNER_CLS),
        j,
        jL,
        _sparkConfig = column.sparkConfig || {};

      columnDom.addCls(GRID_COLUMN_SPARKLINE_CLS);

      if (rowIndex !== undefined) {
        j = rowIndex;
        jL = rowIndex + 1;
      }
      else {
        j = 0;
        jL = s.getLength();
      }

      var sparkHeight = cellHeight - 1,
        sparkWidth = columnWidth - 20,
        widthName;

      switch (type) {
        case 'line':
        case 'pie':
        case 'box':
          widthName = 'width';
          break;
        case 'bullet':
          widthName = 'width';
          sparkHeight -= 11;
          columnDom.addCls(GRID_COLUMN_SPARKLINE_BULLET_CLS);
          break;
        case 'discrete':
          widthName = 'width';
          sparkWidth = columnWidth;
          sparkHeight -= 2;
          break;
        case 'bar':
        case 'tristate':
          widthName = 'barWidth';
          break;
      }

      for (; j < jL; j++) {
        var value = s.get(j, key),
          data = s.get(j),
          o = {
            rowIndex: j,
            value: value,
            data: data,
            style: {}
          };

        if (column.render) {
          o = column.render(o);
          value = o.value;
        }

        if (F.isArray(column.values)) {
          var k = 0,
            kL = column.values.length;

          value = [];

          for (; k < kL; k++) {
            value.push(s.get(j, column.values[k]));
          }
        }

        cellsDom.item(j).css(o.style);
        var innerDom = cellsDomInner.item(j).dom,
          sparkConfig = {
            type: type,
            fillColor: 'transparent',
            height: sparkHeight
          };

        F.apply(sparkConfig, _sparkConfig);

        if (type === 'bar' || type === 'tristate') {
          sparkWidth = columnWidth - 20;
          sparkWidth = sparkWidth / value.length;
        }

        sparkConfig[widthName] = sparkWidth;

        F.$(innerDom).sparkline(value, sparkConfig);
      }
    },
    /*
     * @param {Number} i
     * @param {Number} rowIndex
     */
    renderProgressDonut: function (i, rowIndex) {
      var me = this,
        w = me.widget,
        s = w.store,
        columns = me.getColumns(),
        column = columns[i],
        key = column.key || column.index,
        columsDom = me.el.select('.' + GRID_COLUMN_CLS),
        columnDom = columsDom.item(i),
        cellsDom = columnDom.select('.' + GRID_CELL_CLS),
        cellsDomInner = columnDom.select('.' + GRID_CELL_CLS + ' .' + GRID_CELL_INNER_CLS),
        j,
        jL;

      columnDom.addCls(GRID_COLUMN_SPARK_PROGRESS_DONUT_CLS);

      if (rowIndex !== undefined) {
        j = rowIndex;
        jL = rowIndex + 1;
      }
      else {
        j = 0;
        jL = s.getLength();
      }

      for (; j < jL; j++) {
        var data = s.get(j),
          o = {
            rowIndex: j,
            data: data,
            style: {},
            column: column
          },
          value;

        if (column.smartIndexFn) {
          value = column.smartIndexFn(data);
        }
        else {
          value = s.get(j, key);
        }

        o.value = value;

        if (column.format) {
          o.value = me.format(o.value, column.format);
          value = o.value;
        }

        if (column.render) {
          o = column.render(o);
          value = o.value;
        }

        cellsDom.item(j).css(o.style);
        var sparkConfig = column.sparkConfig || {},
          renderTo = cellsDomInner.item(j).dom;

        F.apply(sparkConfig, {
          renderTo: renderTo,
          value: value
        });

        if (!sparkConfig.size && !sparkConfig.height && !sparkConfig.width) {
          sparkConfig.size = w.cellHeaderHeight - 3 * 2;
        }

        F.get(renderTo).update('');

        new F.spark.ProgressDonut(sparkConfig);
      }
    },
    /*
     * @param {Number} i
     * @param {Number} rowIndex
     */
    renderGrossLoss: function (i, rowIndex) {
      var me = this,
        w = me.widget,
        s = w.store,
        columns = me.getColumns(),
        column = columns[i],
        key = column.key || column.index,
        columsDom = me.el.select('.' + GRID_COLUMN_CLS),
        columnDom = columsDom.item(i),
        cellsDom = columnDom.select('.' + GRID_CELL_CLS),
        cellsDomInner = columnDom.select('.' + GRID_CELL_CLS + ' .' + GRID_CELL_INNER_CLS),
        j,
        jL;

      columnDom.addCls(GRID_COLUMN_GROSSLOSS_CLS);

      if (rowIndex !== undefined) {
        j = rowIndex;
        jL = rowIndex + 1;
      }
      else {
        j = 0;
        jL = s.getLength();
      }

      var sparkConfig = column.sparkConfig || {};

      if (sparkConfig.showOnMax) {
        sparkConfig.maxValue = Math.max.apply(Math, s.getColumnData(key, column.smartIndexFn));
      }

      for (; j < jL; j++) {
        var data = s.get(j),
          o = {
            rowIndex: j,
            data: data,
            style: {},
            column: column
          },
          value;

        if (column.smartIndexFn) {
          value = column.smartIndexFn(data);
        }
        else {
          value = s.get(j, key);
        }

        o.value = value;

        if (column.format) {
          o.value = me.format(o.value, column.format);
          value = o.value;
        }

        if (column.render) {
          o = column.render(o);
          value = o.value;
        }

        cellsDom.item(j).css(o.style);

        F.apply(sparkConfig, {
          renderTo: cellsDomInner.item(j).dom,
          value: value,
          column: column
        });

        new F.spark.GrossLoss(sparkConfig);
      }
    },
    /*
     * @param {Number} i
     * @param {Number} rowIndex
     */
    renderProgressBar: function (i, rowIndex) {
      var me = this,
        w = me.widget,
        s = w.store,
        columns = me.getColumns(),
        column = columns[i],
        key = column.key || column.index,
        columsDom = me.el.select('.' + GRID_COLUMN_CLS),
        columnDom = columsDom.item(i),
        cellsDom = columnDom.select('.' + GRID_CELL_CLS),
        cellsDomInner = columnDom.select('.' + GRID_CELL_CLS + ' .' + GRID_CELL_INNER_CLS),
        j,
        jL,
        maxValue = 100;

      columnDom.addCls(GRID_COLUMN_PROGRESS_CLS);

      if (rowIndex !== undefined) {
        j = rowIndex;
        jL = rowIndex + 1;
      }
      else {
        j = 0;
        jL = s.getLength();
      }

      var sparkConfig = column.sparkConfig || {};
      if (sparkConfig.percents === false) {
        maxValue = Math.max.apply(Math, s.getColumnData(key));
      }

      for (; j < jL; j++) {
        var data = s.get(j),
          o = {
            rowIndex: j,
            data: data,
            style: {},
            column: column
          },
          value;

        if (column.smartIndexFn) {
          value = column.smartIndexFn(data);
        }
        else {
          value = s.get(j, key);
        }

        o.value = value;

        if (column.format) {
          o.value = me.format(o.value, column.format);
          value = o.value;
        }

        if (column.render) {
          o = column.render(o);
          value = o.value;
        }

        cellsDom.item(j).css(o.style);

        var _renderTo = F.get(cellsDomInner.item(j).dom);

        if (_renderTo.select('.' + GRID_COLUMN_PROGRESS_BAR_CLS).length) {
          var spark = F.getWidget(_renderTo.select('.' + GRID_COLUMN_PROGRESS_BAR_CLS).item(0).attr('id'));
          spark.value = value;
          spark.maxValue = maxValue;
          spark.update();
          continue;
        }

        F.apply(sparkConfig, {
          renderTo: cellsDomInner.item(j).dom,
          value: value,
          column: column,
          maxValue: maxValue
        });

        new F.spark.ProgressBar(sparkConfig);
      }
    },
    /*
     * @param {Number} i
     * @param {Number} rowIndex
     */
    renderHBar: function (i, rowIndex) {
      var me = this,
        w = me.widget,
        s = w.store,
        columns = me.getColumns(),
        column = columns[i],
        key = column.key || column.index,
        columsDom = me.el.select('.' + GRID_COLUMN_CLS),
        columnDom = columsDom.item(i),
        cellsDom = columnDom.select('.' + GRID_CELL_CLS),
        cellsDomInner = columnDom.select('.' + GRID_CELL_CLS + ' .' + GRID_CELL_INNER_CLS),
        j,
        jL,
        sparkConfig = column.sparkConfig || {},
        disabled = column.disabled || {};

      columnDom.addCls(GRID_COLUMN_H_BAR_CLS);

      var values = {},
        i = 0,
        iL,
        kL,
        maxItemValue = Number.MIN_VALUE;

      if (F.isArray(column.index)) {
        iL = column.index.length;
        for (; i < iL; i++) {
          var _key = column.index[i];

          if (disabled[_key]) {
            continue;
          }

          values[_key] = s.getColumnData(_key);

          var _maxItemValue = Math.max.apply(Math, values[_key]);
          if (_maxItemValue > maxItemValue) {
            maxItemValue = _maxItemValue;
          }

          kL = values[_key].length;
        }
      }
      else {
        var data = s.getColumnData(column.index),
          fields = [];

        iL = data.length;

        for (; i < iL; i++) {
          var n = 0,
            nL = data[i].length;

          for (; n < nL; n++) {
            if (disabled[n]) {
              continue;
            }

            values[n] = values[n] || [];
            values[n].push(data[i][n]);
          }
        }

        for (var p in values) {
          var _maxItemValue = Math.max.apply(Math, values[p]);
          fields.push(p);

          if (_maxItemValue > maxItemValue) {
            maxItemValue = _maxItemValue;
          }

          kL = values[p].length;
        }

        if (!column.fields) {
          column.fields = fields;
        }
      }

      var sum = [],
        k = 0;

      for (; k < kL; k++) {
        sum[k] = 0;
        for (var p in values) {
          if (column.fields && disabled[column.index + '.' + p]) {
            continue;
          }
          else if (disabled[p]) {
            continue;
          }

          sum[k] += values[p][k];
        }
      }

      maxValue = Math.max.apply(Math, sum);

      sparkConfig.maxItemValue = maxItemValue;

      if (rowIndex !== undefined) {
        j = rowIndex;
        jL = rowIndex + 1;
      }
      else {
        j = 0;
        jL = s.getLength();
      }

      for (; j < jL; j++) {
        var data = s.get(j),
          o = {
            rowIndex: j,
            data: data,
            style: {},
            column: column
          },
          value;

        if (column.smartIndexFn) {
          value = column.smartIndexFn(data);
        }
        else {
          value = s.get(j, key);
        }

        o.value = value;

        if (column.format) {
          o.value = me.format(o.value, column.format);
          value = o.value;
        }

        if (column.render) {
          o = column.render(o);
          value = o.value;
        }

        cellsDom.item(j).css(o.style);

        var _renderTo = F.get(cellsDomInner.item(j).dom);

        if (_renderTo.select('.fancy-spark-hbar').length) {
          var spark = F.getWidget(_renderTo.select('.fancy-spark-hbar').item(0).attr('id'));
          spark.maxValue = maxValue;
          spark.maxItemValue = maxItemValue;
          spark.update(data);
          continue;
        }

        F.apply(sparkConfig, {
          renderTo: cellsDomInner.item(j).dom,
          value: value,
          data: data,
          column: column,
          maxValue: maxValue,
          height: w.cellHeight - 1
        });

        new F.spark.HBar(sparkConfig);
      }
    },
    /*
     * @param {Number} i
     * @param {Number} rowIndex
     */
    renderCircle: function (i, rowIndex) {
      var me = this,
        w = me.widget,
        s = w.store,
        columns = me.getColumns(),
        column = columns[i],
        key = column.key || column.index,
        columsDom = me.el.select('.' + GRID_COLUMN_CLS),
        columnDom = columsDom.item(i),
        cellsDomInner = columnDom.select('.' + GRID_CELL_CLS + ' .' + GRID_CELL_INNER_CLS),
        j,
        jL,
        cellHeight = w.cellHeight - 4;

      columnDom.addCls(GRID_COLUMN_CHART_CIRCLE_CLS);

      function pieChart(percentage, size) {
        //http://jsfiddle.net/da5LN/62/

        var svgns = "http://www.w3.org/2000/svg";
        var chart = document.createElementNS(svgns, "svg:svg");
        chart.setAttribute("width", size);
        chart.setAttribute("height", size);
        chart.setAttribute("viewBox", "0 0 " + size + " " + size);

        var back = document.createElementNS(svgns, "circle");
        back.setAttributeNS(null, "cx", size / 2);
        back.setAttributeNS(null, "cy", size / 2);
        back.setAttributeNS(null, "r", size / 2);
        var color = "#F0F0F0";
        if (size > 50) {
          color = "F0F0F0";
        }

        if (percentage < 0) {
          color = '#F9DDE0';
        }

        back.setAttributeNS(null, "fill", color);
        chart.appendChild(back);

        var path = document.createElementNS(svgns, "path");
        var unit = (Math.PI * 2) / 100;
        var startangle = 0;
        var endangle = percentage * unit - 0.001;
        var x1 = (size / 2) + (size / 2) * Math.sin(startangle);
        var y1 = (size / 2) - (size / 2) * Math.cos(startangle);
        var x2 = (size / 2) + (size / 2) * Math.sin(endangle);
        var y2 = (size / 2) - (size / 2) * Math.cos(endangle);
        var big = 0;
        if (endangle - startangle > Math.PI) {
          big = 1;
        }
        var d = "M " + (size / 2) + "," + (size / 2) +
          " L " + x1 + "," + y1 +
          " A " + (size / 2) + "," + (size / 2) +
          " 0 " + big + " 1 " +
          x2 + "," + y2 +
          " Z";

        path.setAttribute("d", d); // Set this path
        if (percentage < 0) {
          path.setAttribute("fill", '#EA7369');
        }
        else {
          path.setAttribute("fill", '#44A4D3');
        }
        chart.appendChild(path);

        var front = document.createElementNS(svgns, "circle");
        front.setAttributeNS(null, "cx", (size / 2));
        front.setAttributeNS(null, "cy", (size / 2));
        front.setAttributeNS(null, "r", (size * 0.25));
        front.setAttributeNS(null, "fill", "#fff");
        chart.appendChild(front);
        return chart;
      }

      if (rowIndex !== undefined) {
        j = rowIndex;
        jL = rowIndex + 1;
      }
      else {
        j = 0;
        jL = s.getLength();
      }

      for (; j < jL; j++) {
        var value,
          data = s.get(j),
          o = {
            rowIndex: j,
            data: data,
            style: {}
          };

        if (column.smartIndexFn) {
          value = column.smartIndexFn(data);
        }
        else {
          value = s.get(j, key);
        }

        o.value = value;

        if (column.render) {
          o = column.render(o);
          value = o.value;
        }

        var innerDom = cellsDomInner.item(j).dom;

        if (innerDom.innerHTML === '') {

          innerDom.appendChild(pieChart(value, cellHeight));
        }
      }
    },
    /*
     *
     */
    removeNotUsedCells: function () {
      var me = this,
        w = me.widget,
        store = w.store,
        columnsDom = me.el.select('.' + GRID_COLUMN_CLS),
        i = 0,
        iL = columnsDom.length;

      for (; i < iL; i++) {
        var columnDom = columnsDom.item(i),
          cellsDom = columnDom.select('.' + GRID_CELL_CLS),
          j = store.getLength(),
          jL = cellsDom.length;

        for (; j < jL; j++) {
          cellsDom.item(j).remove();
        }
      }
    },
    /*
     * @param {String|Object} format
     * @return {Function|String|Object}
     */
    getFormat: function (format) {
      var me = this,
        w = me.widget,
        lang = w.lang;

      switch (format) {
        case 'number':
          return function (value) {
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, lang.thousandSeparator);
          };
          break;
        case 'date':
          return function (value) {
            var date = F.Date.parse(value, lang.date.read, format.mode);
            value = F.Date.format(date, lang.date.write, format.mode);

            return value;
          };
          break;
      }

      switch (format.type) {
        case 'date':
          return function (value) {
            if (value.length === 0) {
              return '';
            }
            var date = F.Date.parse(value, format.read, format.mode);
            value = F.Date.format(date, format.write, undefined, format.mode);


            return value;
          };
          break;
      }

      if (format.inputFn) {
        return format.inputFn;
      }
    },
    /*
     * @param {String} value
     * @param {*} format
     * @return {String}
     */
    format: function (value, format) {
      switch (F.typeOf(format)) {
        case 'string':
          value = this.getFormat(format)(value);
          break;
        case 'function':
          value = format(value);
          break;
        case 'object':
          if (format.inputFn) {
            value = format.inputFn(value);
          }
          else {
            value = this.getFormat(format)(value);
          }

          break;
      }

      return value;
    },
    /*
     * @param {Fancy.Element} cell
     */
    enableCellDirty: function (cell) {
      if (cell.hasCls(GRID_CELL_DIRTY_CLS)) {
        return;
      }

      cell.addCls(GRID_CELL_DIRTY_CLS);
      cell.append('<div class="' + GRID_CELL_DIRTY_EL_CLS + '"></div>');
    },
    /*
     * @param {Number} rowIndex
     */
    clearDirty: function (rowIndex) {
      var me = this;

      if (rowIndex !== undefined) {
        me.el.select('.' + GRID_CELL_CLS + '[index="' + rowIndex + '"] .' + GRID_CELL_DIRTY_EL_CLS).destroy();
        me.el.select('.' + GRID_CELL_DIRTY_CLS + '[index="' + rowIndex + '"]').removeCls(GRID_CELL_DIRTY_CLS);

        return;
      }

      me.el.select('.' + GRID_CELL_DIRTY_EL_CLS).destroy();
      me.el.select('.' + GRID_CELL_DIRTY_CLS).removeCls(GRID_CELL_DIRTY_CLS);
    },
    /*
     *
     */
    showEmptyText: function () {
      var me = this,
        w = me.widget,
        s = w.store;

      if (me.side !== 'center') {
        return;
      }

      if (me.emptyTextEl) {
        me.emptyTextEl.destroy();
        delete me.emptyTextEl;
      }

      if (s.dataView.length === 0) {
        var el = F.get(document.createElement('div'));

        el.addCls(GRID_EMPTY_CLS);
        el.update(w.emptyText);

        me.emptyTextEl = F.get(me.el.dom.appendChild(el.dom));
      }
    }
  };

})();
/**
 * @class Fancy.grid.Body
 * @extends Fancy.Widget
 */
(function () {
  //SHORTCUTS
  var F = Fancy;

  /*
   * Constants
   */
  var GRID_CELL_CLS = F.GRID_CELL_CLS;
  var GRID_CELL_INNER_CLS = F.GRID_CELL_INNER_CLS;
  var GRID_COLUMN_CLS = F.GRID_COLUMN_CLS;
  var GRID_BODY_CLS = F.GRID_BODY_CLS;
  var GRID_CELL_WRAPPER_CLS = F.GRID_CELL_WRAPPER_CLS;
  var GRID_COLUMN_SELECT_CLS = F.GRID_COLUMN_SELECT_CLS;
  var GRID_COLUMN_ELLIPSIS_CLS = F.GRID_COLUMN_ELLIPSIS_CLS;
  var GRID_COLUMN_ORDER_CLS = F.GRID_COLUMN_ORDER_CLS;
  var GRID_COLUMN_TEXT_CLS = F.GRID_COLUMN_TEXT_CLS;

  var GRID_COLUMN_SPARKLINE_CLS = F.GRID_COLUMN_SPARKLINE_CLS;
  var GRID_COLUMN_SPARKLINE_BULLET_CLS = F.GRID_COLUMN_SPARKLINE_BULLET_CLS;
  var GRID_COLUMN_CHART_CIRCLE_CLS = F.GRID_COLUMN_CHART_CIRCLE_CLS;
  var GRID_COLUMN_SPARK_PROGRESS_DONUT_CLS =  F.GRID_COLUMN_SPARK_PROGRESS_DONUT_CLS;
  var GRID_COLUMN_GROSSLOSS_CLS = F.GRID_COLUMN_GROSSLOSS_CLS;
  var GRID_COLUMN_PROGRESS_CLS = F.GRID_COLUMN_PROGRESS_CLS;
  var GRID_COLUMN_PROGRESS_BAR_CLS = F.GRID_COLUMN_PROGRESS_BAR_CLS;
  var GRID_COLUMN_H_BAR_CLS = F.GRID_COLUMN_H_BAR_CLS;

  F.define('Fancy.grid.Body', {
    extend: F.Widget,
    mixins: [
      F.grid.body.mixin.Updater
    ],
    cls: GRID_BODY_CLS,
    cellTpl: [
      '<div class="' + GRID_CELL_INNER_CLS + '">{cellValue}</div>'
    ],
    cellWrapperTpl: [
      '<div class="' + GRID_CELL_WRAPPER_CLS + '">',
      '<div class="' + GRID_CELL_INNER_CLS + '">{cellValue}</div>',
      '</div>'
    ],
    /*
     * @constructor
     * @param {Object} config
     */
    constructor: function () {
      this.Super('const', arguments);
    },
    /*
     *
     */
    init: function () {
      var me = this;

      me.Super('init', arguments);
      me.addEvents('adddomcolumns');

      me.initTpl();
      me.render();
      me.ons();
    },
    /*
     *
     */
    initTpl: function () {
      var me = this;

      me.cellTpl = new F.Template(me.cellTpl);
      me.cellWrapperTpl = new F.Template(me.cellWrapperTpl);
    },
    /*
     *
     */
    ons: function () {
      var me = this,
        w = me.widget,
        id = w.id;

      w.on('afterrender', me.onAfterRender, me);

      var columnSelector = '.' + GRID_COLUMN_CLS + '[grid="' + id + '"]',
        cellSelector = columnSelector + ' div.' + GRID_CELL_CLS;

      me.el.on('click', me.onCellClick, me, cellSelector);
      me.el.on('dblclick', me.onCellDblClick, me, cellSelector);
      me.el.on('mouseenter', me.onCellMouseEnter, me, cellSelector);
      me.el.on('mouseleave', me.onCellMouseLeave, me, cellSelector);
      me.el.on('mousedown', me.onCellMouseDown, me, cellSelector);

      me.el.on('mouseenter', me.onColumnMouseEnter, me, columnSelector);
      me.el.on('mouseleave', me.onColumnMouseLeave, me, columnSelector);
    },
    /*
     *
     */
    render: function () {
      var me = this,
        w = me.widget,
        renderTo,
        el = F.get(document.createElement('div'));

      el.addCls(GRID_BODY_CLS);
      renderTo = w.el.select('.fancy-grid-' + me.side).dom;
      me.el = F.get(renderTo.appendChild(el.dom));
    },
    /*
     *
     */
    onAfterRender: function () {
      this.update();
      this.setHeight();
    },
    /*
     * @param {Number} scrollLeft
     */
    setColumnsPosition: function (scrollLeft) {
      var me = this,
        w = me.widget,
        columns = me.getColumns(),
        i = 0,
        iL = columns.length,
        columnsWidth = 0,
        bodyDomColumns = me.el.select('.' + GRID_COLUMN_CLS + '[grid="' + w.id + '"]'),
        scrollLeft = scrollLeft || me.scrollLeft || 0;

      columnsWidth += scrollLeft;

      for (; i < iL; i++) {
        var column = columns[i],
          columnEl = bodyDomColumns.item(i);

        columnEl.css({
          left: columnsWidth + 'px'
        });

        if (!column.hidden) {
          columnsWidth += column.width;
        }
      }
    },
    /*
     * @param {Number} delta
     * @return {Object}
     */
    wheelScroll: function (delta) {
      var me = this,
        w = me.widget,
        knobOffSet = w.knobOffSet,
        columnsDom = me.el.select('.' + GRID_COLUMN_CLS + '[grid="' + w.id + '"]');

      if (columnsDom.length === 0) {
        return;
      }

      var oldScrollTop = parseInt(columnsDom.item(0).css('top')),
        i = 0,
        iL = columnsDom.length,
        bodyViewHeight = w.getBodyHeight(),
        cellsViewHeight = w.getCellsViewHeight(),
        scrollRightPath = cellsViewHeight - bodyViewHeight + knobOffSet,
        o = {
          oldScroll: parseInt(columnsDom.item(0).css('top')),
          newScroll: parseInt(columnsDom.item(0).css('top')) + 30 * delta,
          deltaScroll: 30 * delta
        };

      for (; i < iL; i++) {
        var columnEl = columnsDom.item(i),
          topValue = parseInt(columnEl.css('top')) + 30 * delta;

        if (topValue > 0) {
          topValue = 0;
          o.newScroll = 0;
        }
        else if (Math.abs(topValue) > scrollRightPath) {
          topValue = -scrollRightPath - knobOffSet;
          o.newScroll = topValue;
        }

        columnEl.css('top', topValue + 'px');
      }

      o.scrolled = oldScrollTop !== parseInt(columnsDom.item(0).css('top'));

      return o;
    },
    /*
     * @param {Number} y
     * @param {Number} x
     * @return {Object}
     */
    scroll: function (y, x) {
      var me = this,
        w = me.widget,
        columnsDom = me.el.select('.' + GRID_COLUMN_CLS + '[grid="' + w.id + '"]'),
        i = 0,
        iL = columnsDom.length,
        o = {};

      if (y !== false && y !== null && y !== undefined) {
        o.scrollTop = y;
        for (; i < iL; i++) {
          var columnEl = columnsDom.item(i);
          columnEl.css('top', -y + 'px');
        }
      }

      if (x !== false && x !== null && x !== undefined) {
        o.scrollLeft = x;
        if (w.header) {
          w.header.scroll(x);
        }
        me.scrollLeft = x;
        w.body.setColumnsPosition(x);

        if (me.side === 'center') {
          if (w.grouping) {
            w.grouping.scrollLeft(x);
          }

          if (w.summary) {
            w.summary.scrollLeft(x);
          }
        }
      }

      return o;
    },
    /*
     *
     */
    setHeight: function () {
      var height = this.widget.getBodyHeight();

      this.css('height', height + 'px');
    },
    /*
     * @param {Object} e
     */
    onCellClick: function (e) {
      var me = this,
        w = me.widget;

      w.fire('cellclick', me.getEventParams(e));
      w.fire('rowclick', me.getEventParams(e));
      w.fire('columnclick', me.getColumnEventParams(e));
      if (w.activated === false) {
        w.activated = true;
        w.fire('activate');
      }
    },
    /*
     * @param {Object} e
     */
    onCellDblClick: function (e) {
      var me = this,
        w = me.widget;

      w.fire('celldblclick', me.getEventParams(e));
      w.fire('rowdblclick', me.getEventParams(e));
      w.fire('columndblclick', me.getColumnEventParams(e));
    },
    /*
     * @param {Object} e
     * @return {false|Object}
     */
    getEventParams: function (e) {
      var me = this,
        w = me.widget,
        s = w.store,
        columns = me.getColumns(),
        cell = e.currentTarget,
        cellEl = F.get(e.currentTarget),
        columnEl = cellEl.parent();

      if (cellEl.parent().dom === undefined) {
        return false;
      }

      if (s.getLength() === 0) {
        return false;
      }

      var columnIndex = parseInt(columnEl.attr('index')),
        rowIndex = parseInt(cellEl.attr('index')),
        column = columns[columnIndex],
        key = column.index || column.key,
        value = s.get(rowIndex, key),
        id = s.getId(rowIndex),
        data = s.get(rowIndex),
        item = s.getById(id);

      if (column.smartIndexFn) {
        value = column.smartIndexFn(data);
      }

      return {
        e: e,
        id: id,
        side: me.side,
        cell: cell,
        column: column,
        rowIndex: rowIndex,
        columnIndex: columnIndex,
        value: value,
        data: data,
        item: item
      };
    },
    /*
     * @param {Object} e
     * @return {Object}
     */
    getColumnEventParams: function (e) {
      var me = this,
        w = me.widget,
        s = w.store,
        cellEl = F.get(e.currentTarget),
        columnEl = cellEl.parent(),
        columnIndex = parseInt(columnEl.attr('index')),
        columns = me.getColumns(),
        column = columns[columnIndex],
        config = {
          e: e,
          side: me.side,
          columnIndex: columnIndex,
          column: column,
          columnDom: columnEl.dom
        };

      if (w.columnClickData) {
        config.data = s.getColumnData(column.index, column.smartIndexFn);
      }

      return config;
    },
    /*
     * @param {Object} e
     * @return {Object}
     */
    getColumnHoverEventParams: function (e) {
      var me = this,
        columnEl = F.get(e.currentTarget),
        columnIndex = parseInt(columnEl.attr('index')),
        columns = me.getColumns(),
        column = columns[columnIndex];

      return {
        e: e,
        side: me.side,
        columnIndex: columnIndex,
        column: column,
        columnDom: columnEl.dom
      };
    },
    /*
     * @return {Array}
     */
    getColumns: function () {
      return this.widget.getColumns(this.side);
    },
    /*
     * @param {Object} e
     */
    onCellMouseEnter: function (e) {
      var me = this,
        w = me.widget,
        params = me.getEventParams(e),
        prevCellOver = me.prevCellOver;

      if (F.nojQuery && prevCellOver) {
        if (me.fixZeptoBug) {
          if (params.rowIndex !== prevCellOver.rowIndex || params.columnIndex !== prevCellOver.columnIndex || params.side !== prevCellOver.side) {
            w.fire('cellleave', prevCellOver);
            if (params.rowIndex !== prevCellOver.rowIndex) {
              w.fire('rowleave', prevCellOver);
            }
          }
        }
      }

      if (!prevCellOver) {
        w.fire('rowenter', params);
      }
      else {
        if (params.rowIndex !== me.prevCellOver.rowIndex) {
          w.fire('rowenter', params);
        }
      }

      w.fire('cellenter', params);

      me.prevCellOver = params;
    },
    /*
     * @param {Object} e
     */
    onCellMouseDown: function (e) {
      var me = this,
        w = me.widget,
        params = me.getEventParams(e),
        columnParams = {
          e: params.e,
          side: params.side,
          columnDom: F.get(params.cell).parent().dom,
          column: params.column,
          columnIndex: params.columnIndex
        };

      w.fire('beforecellmousedown', params);
      w.fire('cellmousedown', params);
      w.fire('columnmousedown', columnParams);
    },
    /*
     * @param {Object} e
     */
    onCellMouseLeave: function (e) {
      var me = this,
        w = me.widget,
        params = me.getEventParams(e),
        prevCellOver = me.prevCellOver;

      if (F.nojQuery) {
        if (prevCellOver === undefined) {
          return;
        }

        me.fixZeptoBug = params;
        return;
      }

      w.fire('rowleave', prevCellOver);
      w.fire('cellleave', prevCellOver);
      delete me.prevCellOver;
    },
    /*
     * @param {Object} e
     */
    onColumnMouseEnter: function (e) {
      var me = this,
        w = me.widget,
        params = me.getColumnHoverEventParams(e),
        prevColumnOver = me.prevColumnOver;

      if (!prevColumnOver) {
        w.fire('columnenter', params);
      }
      else if (me.prevCellOver) {
        if (params.rowIndex !== me.prevCellOver.rowIndex) {
          w.fire('rowenter', params);
        }
      }

      me.prevColumnOver = params;
    },
    /*
     * @param {Object} e
     */
    onColumnMouseLeave: function (e) {
      var me = this,
        w = me.widget;

      w.fire('columnleave', me.prevColumnOver);
      delete me.prevColumnOver;
    },
    /*
     * @param {Number} row
     * @param {Number} column
     * @return {Fancy.Element}
     */
    getCell: function (row, column) {
      return this.el.select('.' + GRID_COLUMN_CLS + '[index="' + column + '"] .' + GRID_CELL_CLS + '[index="' + row + '"]');
    },
    /*
     * @param {Number} row
     * @param {Number} column
     * @return {HTMLElement}
     */
    getDomCell: function (row, column) {
      var me = this,
        w = me.widget;

      return me.el.select('.' + GRID_COLUMN_CLS + '[index="' + column + '"][grid="' + w.id + '"] .' + GRID_CELL_CLS + '[index="' + row + '"]').dom;
    },
    /*
     * @param {Number} index
     * @return {HTMLElement}
     */
    getDomColumn: function (index) {
      var me = this,
        w = me.widget;

      return me.el.select('.' + GRID_COLUMN_CLS + '[index="' + index + '"][grid="' + w.id + '"]').dom;
    },
    /*
     *
     */
    destroy: function () {
      var me = this,
        el = me.el,
        cellSelector = 'div.' + GRID_CELL_CLS,
        columnSelector = 'div.' + GRID_COLUMN_CLS;

      el.un('click', me.onCellClick, me, cellSelector);
      el.un('dblclick', me.onCellDblClick, me, cellSelector);
      el.un('mouseenter', me.onCellMouseEnter, me, cellSelector);
      el.un('mouseleave', me.onCellMouseLeave, me, cellSelector);
      el.un('mousedown', me.onCellMouseDown, me, cellSelector);

      el.un('mouseenter', me.onColumnMouseEnter, me, columnSelector);
      el.un('mouseleave', me.onColumnMouseLeave, me, columnSelector);
    },
    /*
     * @param {Number} orderIndex
     */
    hideColumn: function (orderIndex) {
      var me = this,
        columns = me.el.select('.' + GRID_COLUMN_CLS),
        column = columns.item(orderIndex),
        columnWidth = parseInt(column.css('width')),
        i = orderIndex + 1,
        iL = columns.length;

      column.hide();

      for (; i < iL; i++) {
        var _column = columns.item(i),
          left = parseInt(_column.css('left')) - columnWidth;

        _column.css('left', left);
      }
    },
    /*
     * @param {Number} orderIndex
     */
    showColumn: function (orderIndex) {
      var me = this,
        columns = me.el.select('.' + GRID_COLUMN_CLS),
        column = columns.item(orderIndex),
        columnWidth,
        i = orderIndex + 1,
        iL = columns.length;

      column.show();

      columnWidth = parseInt(column.css('width'));

      for (; i < iL; i++) {
        var _column = columns.item(i),
          left = parseInt(_column.css('left')) + columnWidth;

        _column.css('left', left);
      }
    },
    /*
     * @param {Number} orderIndex
     */
    removeColumn: function (orderIndex) {
      var me = this,
        columns = me.el.select('.' + GRID_COLUMN_CLS),
        column = columns.item(orderIndex),
        columnWidth = parseInt(column.css('width')),
        i = orderIndex + 1,
        iL = columns.length;

      column.destroy();

      for (; i < iL; i++) {
        var _column = columns.item(i),
          left = parseInt(_column.css('left')) - columnWidth;

        _column.attr('index', i - 1);
        _column.css('left', left);
      }
    },
    /*
     * @param {Number} index
     * @param {Object} column
     */
    insertColumn: function (index, column) {
      var me = this,
        w = me.widget,
        _columns = me.getColumns(),
        columns = me.el.select('.' + GRID_COLUMN_CLS),
        width = column.width,
        el = F.get(document.createElement('div')),
        i = index,
        iL = columns.length,
        left = 0,
        j = 0,
        jL = index,
        passedLeft;

      for (; j < jL; j++) {
        left += _columns[j].width;
      }

      passedLeft = left;

      for (; i < iL; i++) {
        var _column = columns.item(i);
        left = parseInt(_column.css('left')) + column.width;

        _column.css('left', left);
        _column.attr('index', i + 1);
      }

      el.addCls(GRID_COLUMN_CLS);
      el.attr('grid', w.id);

      if (column.index === '$selected') {
        el.addCls(GRID_COLUMN_SELECT_CLS);
      }
      else {
        switch (column.type) {
          case 'order':
            el.addCls(GRID_COLUMN_ORDER_CLS);
            break;
        }
      }

      if (column.cls) {
        el.addCls(column.cls);
      }

      if (column.type === 'text') {
        el.addCls(GRID_COLUMN_TEXT_CLS);
      }

      el.css({
        width: width + 'px'
      });
      el.attr('index', index);

      if (column.cellAlign) {
        el.css('text-align', column.cellAlign);
      }

      if (column.ellipsis === true) {
        switch (column.type) {
          case 'string':
          case 'text':
          case 'number':
            el.addCls(GRID_COLUMN_ELLIPSIS_CLS);
            break;
        }
      }

      var scrolled = w.scroller.getScroll();
      el.css('top', -scrolled);

      if (index === 0 && columns.length) {
        el.css('left', '0px');
        me.el.dom.insertBefore(el.dom, columns.item(index).dom);
      }
      else if (index !== 0 && columns.length) {
        if(index === columns.length){
          el.css('left', left + 'px');
          me.el.dom.appendChild(el.dom);
        }
        else {
          el.css('left', passedLeft + 'px');
          me.el.dom.insertBefore(el.dom, columns.item(index).dom);
        }
      }

      me.checkDomCells();
      me.updateRows(undefined, index);
    },
    reSetIndexes: function () {
      var me = this,
        columns = me.getColumns();

      F.each(columns, function (column, i) {
        me.el.select('.' + GRID_COLUMN_CLS + '[index="'+i+'"]').attr('index', i);
      });
    },
    /*
     *
     */
    clearColumnsStyles: function(){
      var me = this,
        cells = me.el.select('div.' + GRID_CELL_CLS);

      cells.each(function(cell){
        cell.css('color', '');
        cell.css('background-color', '');
      });
    },
    /*
     *
     */
    updateColumnsSizes: function () {
      var me = this,
        w = me.widget,
        columns = me.getColumns(),
        left = -w.scroller.scrollLeft || 0;

      F.each(columns, function (column, i) {
        var el = me.el.select('.' + GRID_COLUMN_CLS + '[index="'+i+'"]');

        el.css({
          width: column.width,
          left: left
        });

        left += column.width;
      });
    },
    reSetColumnsAlign: function () {
      var me = this,
        columns = me.getColumns(),
        columnEls = this.el.select('.' + GRID_COLUMN_CLS);

      columnEls.each(function(columnEl, i){
        var column = columns[i];

        columnEl.css('text-align', column.cellAlign || '');
      });
    },
    reSetColumnsCls: function () {
      var me = this,
        columns = me.getColumns(),
        columnEls = this.el.select('.' + GRID_COLUMN_CLS);

      columnEls.each(function(columnEl, i){
        var column = columns[i],
          clss = columnEl.attr('class').split(' ');

        F.each(clss, function (cls) {
          switch(cls){
            case GRID_COLUMN_CLS:
              break;
            case column.cls:
              break;
            case spark[column.type]:
              break;
            default:
              columnEl.removeCls(cls);
          }
        });

        if(column.cls){
          columnEl.addCls(column.cls);
        }
      });
    }
  });

  var spark = {
    sparklineline: GRID_COLUMN_SPARKLINE_CLS,
    sparklinebar: GRID_COLUMN_SPARKLINE_CLS,
    sparklinetristate: GRID_COLUMN_SPARKLINE_CLS,
    sparklinediscrete: GRID_COLUMN_SPARKLINE_CLS,
    sparklinebullet: GRID_COLUMN_SPARKLINE_CLS,
    sparklinepie: GRID_COLUMN_SPARKLINE_CLS,
    sparklinebox: GRID_COLUMN_SPARKLINE_CLS,
    circle: GRID_COLUMN_CHART_CIRCLE_CLS,
    progressdonut: GRID_COLUMN_SPARK_PROGRESS_DONUT_CLS,
    grossloss: GRID_COLUMN_GROSSLOSS_CLS,
    progressbar: GRID_COLUMN_PROGRESS_CLS,
    hbar: GRID_COLUMN_H_BAR_CLS
  }

})();
/*
 * @mixin Fancy.grid.header.mixin.Menu
 */
(function () {
  //SHORTCUTS
  var F = Fancy;

  //CONSTANTS
  var GRID_HEADER_COLUMN_TRIGGERED_CLS = F.GRID_HEADER_COLUMN_TRIGGERED_CLS;
  var GRID_HEADER_CELL_TRIGGER_UP_CLS = F.GRID_HEADER_CELL_TRIGGER_UP_CLS;
  var GRID_HEADER_CELL_TRIGGER_DOWN_CLS = F.GRID_HEADER_CELL_TRIGGER_DOWN_CLS;

  F.Mixin('Fancy.grid.header.mixin.Menu', {
    triggeredColumnCls: GRID_HEADER_COLUMN_TRIGGERED_CLS,
    triggerUpCls: GRID_HEADER_CELL_TRIGGER_UP_CLS,
    triggerDownCls: GRID_HEADER_CELL_TRIGGER_DOWN_CLS,
    /*
     * @param {Object} cell
     * @param {Number} index
     * @param {Object} column
     * @param {Array} columns
     */
    showMenu: function (cell, index, column, columns) {
      var me = this,
        w = me.widget,
        offset = cell.offset();

      me.hideMenu();
      cell.addCls(GRID_HEADER_COLUMN_TRIGGERED_CLS);

      if (!column.menu.rendered) {
        column.menu = me.generateMenu(column, columns);
        column.menu = new F.Menu({
          column: column,
          items: column.menu,
          theme: w.theme,
          events: [{
            hide: me.onMenuHide,
            scope: me
          }]
        });
      }
      else {
        me.updateColumnsMenu(column, columns);
      }

      column.menu.showAt(offset.left + parseInt(cell.css('width')) - 26, offset.top + parseInt(cell.css('height')) - 1);

      me.activeMenu = column.menu;
      me.activeCell = cell;
    },
    /*
     *
     */
    hideMenu: function () {
      var me = this,
        w = me.widget,
        header = w.header,
        rightHeader = w.rightHeader,
        leftHeader = w.leftHeader;

      switch (me.side) {
        case 'left':
          if (header.activeMenu) {
            header.activeMenu.hide();
            header.activeCell.removeCls(GRID_HEADER_COLUMN_TRIGGERED_CLS);
            delete header.activeMenu;
            delete header.activeCell;
          }

          if (rightHeader.activeMenu) {
            rightHeader.activeMenu.hide();
            rightHeader.activeCell.removeCls(GRID_HEADER_COLUMN_TRIGGERED_CLS);
            delete rightHeader.activeMenu;
            delete rightHeader.activeCell;
          }
          break;
        case 'center':
          if (leftHeader.activeMenu) {
            leftHeader.activeMenu.hide();
            leftHeader.activeCell.removeCls(GRID_HEADER_COLUMN_TRIGGERED_CLS);
            delete leftHeader.activeMenu;
            delete leftHeader.activeCell;
          }

          if (rightHeader.activeMenu) {
            rightHeader.activeMenu.hide();
            rightHeader.activeCell.removeCls(GRID_HEADER_COLUMN_TRIGGERED_CLS);
            delete rightHeader.activeMenu;
            delete rightHeader.activeCell;
          }
          break;
        case 'right':
          if (leftHeader.activeMenu) {
            leftHeader.activeMenu.hide();
            leftHeader.activeCell.removeCls(GRID_HEADER_COLUMN_TRIGGERED_CLS);
            delete leftHeader.activeMenu;
            delete leftHeader.activeCell;
          }

          if (header.activeMenu) {
            header.activeMenu.hide();
            header.activeCell.removeCls(GRID_HEADER_COLUMN_TRIGGERED_CLS);
            delete header.activeMenu;
            delete header.activeCell;
          }
          break;
      }

      if (me.activeMenu) {
        me.activeMenu.hide();
        me.activeCell.removeCls(GRID_HEADER_COLUMN_TRIGGERED_CLS);
      }

      delete me.activeMenu;
      delete me.activeCell;
    },
    /*
     * @param {Object} column
     * @param {Array} columns
     */
    generateMenu: function (column, columns) {
      var me = this,
        w = me.widget,
        lang = w.lang,
        menu = [],
        cls = '',
        indexOrder,
        i = 0,
        iL = columns.length;

      for (; i < iL; i++) {
        if (column.index === columns[i].index) {
          indexOrder = i;
          break;
        }
      }

      if (column.sortable === false) {
        cls = 'fancy-menu-item-disabled';
      }

      if (column.sortable) {
        menu.push({
          text: lang.sortAsc,
          cls: cls,
          imageCls: GRID_HEADER_CELL_TRIGGER_UP_CLS,
          handler: function () {
            w.sorter.sort('asc', column.index, me.side);
            column.menu.hide();
          }
        });

        menu.push({
          text: lang.sortDesc,
          cls: cls,
          imageCls: GRID_HEADER_CELL_TRIGGER_DOWN_CLS,
          handler: function () {
            w.sorter.sort('desc', column.index, me.side);
            column.menu.hide();
          }
        });
      }

      menu.push({
        text: lang.columns,
        index: 'columns',
        items: me.prepareColumns(columns)
      });

      switch (me.side) {
        case 'left':
        case 'right':
          if (column.lockable !== false) {
            menu.push({
              text: 'Unlock',
              handler: function () {
                column.menu.hide();
                w.unLockColumn(indexOrder, me.side);
              }
            });
          }
          break;
        case 'center':
          if (columns.length > 1 && (w.leftColumns.length) && column.lockable !== false) {
            menu.push({
              text: 'Lock',
              handler: function () {
                column.menu.hide();
                w.lockColumn(indexOrder, me.side);
              }
            });
          }

          if (columns.length > 1 && w.rightColumns.length && column.lockable !== false) {
            menu.push({
              text: 'Right Lock',
              handler: function () {
                column.menu.hide();
                w.rightLockColumn(indexOrder, me.side);
              }
            });
          }
          break;
      }

      return menu;
    },
    /*
     * @param {Array} columns
     */
    prepareColumns: function (columns) {
      var me = this,
        w = me.widget,
        _columns = [],
        i = 0,
        iL = columns.length,
        group = [],
        groupName;

      for (; i < iL; i++) {
        var value = true,
          column = columns[i];

        if (column.hidden) {
          value = false;
        }

        var columnConfig = {
          text: column.title,
          checked: value,
          index: column.index,
          handler: function (menu, item) {
            if (item.checked === true && !item.checkbox.get()) {
              item.checkbox.set(true);
            }

            if (item.checked && menu.el.select('.fancy-checkbox-on').length === 1) {
              item.checkbox.set(true);
              return;
            }

            item.checked = !item.checked;
            item.checkbox.set(item.checked);

            if (item.checked) {
              w.showColumn(me.side, item.index);
            }
            else {
              w.hideColumn(me.side, item.index);
            }
          }
        };

        if (column.grouping) {
          group = group || [];
          group.push(columnConfig);
          groupName = column.grouping;
          continue;
        }
        else if (group.length) {
          _columns.push({
            text: groupName,
            items: group
          });
          groupName = undefined;
          group = [];
        }

        _columns.push(columnConfig);
      }

      if (group.length) {
        _columns.push({
          text: groupName,
          items: group
        });
      }

      return _columns;
    },
    /*
     *
     */
    onMenuHide: function () {
      this.el.select('.' + GRID_HEADER_COLUMN_TRIGGERED_CLS).removeCls(GRID_HEADER_COLUMN_TRIGGERED_CLS);
    },
    /*
     * @param {Object} column
     * @param {Array} columns
     * @param {Boolean} hard
     */
    updateColumnsMenu: function (column, columns, hard) {
      var me = this,
        menu = column.menu,
        columnsMenu,
        i = 0,
        iL = menu.items.length,
        item;

      for (; i < iL; i++) {
        item = menu.items[i];

        if (item.index === 'columns') {
          columnsMenu = item;
          break;
        }
      }

      i = 0;
      iL = columnsMenu.items.length;
      var rendered = false;

      for (; i < iL; i++) {
        item = columnsMenu.items[i];
        var _column = columns[i];

        if (item.checkbox) {
          item.checkbox.set(!_column.hidden, false);
          rendered = true;
        }
      }

      if (!rendered && !hard) {
        columnsMenu.items = me.prepareColumns(columns);
      }
    },
    /*
     *
     */
    destroyMenus: function () {
      var me = this,
        w = me.widget,
        columns = w.getColumns(me.side),
        i = 0,
        iL = columns.length,
        column;

      for (; i < iL; i++) {
        column = columns[i];

        if (F.isObject(column.menu)) {
          column.menu.destroy();
        }
      }
    }
  });

})();
/**
 * @class Fancy.grid.Header
 * @extends Fancy.Widget
 */
(function () {
  //SHORTCUTS
  var F = Fancy;

  //CONSTANTS
  var GRID_HEADER_CLS = F.GRID_HEADER_CLS;
  var GRID_HEADER_CELL_CLS = F.GRID_HEADER_CELL_CLS;
  var GRID_HEADER_CELL_CONTAINER_CLS = F.GRID_HEADER_CELL_CONTAINER_CLS;
  var GRID_HEADER_CELL_TEXT_CLS = F.GRID_HEADER_CELL_TEXT_CLS;
  var GRID_HEADER_CELL_TRIGGER_CLS  = F.GRID_HEADER_CELL_TRIGGER_CLS;
  var GRID_HEADER_CELL_TRIGGER_IMAGE_CLS  = F.GRID_HEADER_CELL_TRIGGER_IMAGE_CLS;
  var GRID_HEADER_CELL_TRIGGER_DISABLED_CLS = F.GRID_HEADER_CELL_TRIGGER_DISABLED_CLS;
  var GRID_HEADER_CELL_GROUP_LEVEL_1_CLS = F.GRID_HEADER_CELL_GROUP_LEVEL_1_CLS;
  var GRID_HEADER_CELL_GROUP_LEVEL_2_CLS = F.GRID_HEADER_CELL_GROUP_LEVEL_2_CLS;
  var GRID_HEADER_CELL_SELECT_CLS = F.GRID_HEADER_CELL_SELECT_CLS;
  var GRID_HEADER_CELL_FILTER_FULL_CLS = F.GRID_HEADER_CELL_FILTER_FULL_CLS;
  var GRID_HEADER_CELL_FILTER_SMALL_CLS = F.GRID_HEADER_CELL_FILTER_SMALL_CLS;

  F.define('Fancy.grid.Header', {
    extend: F.Widget,
    cls: GRID_HEADER_CLS,
    mixins: [
      'Fancy.grid.header.mixin.Menu'
    ],
    cellTpl: [
      '<div class="' + GRID_HEADER_CELL_CLS + ' {cls}" style="display:{display};width:{columnWidth}px;height: {height};left: {left};" {groupIndex} index="{index}">',
        '<div class="' + GRID_HEADER_CELL_CONTAINER_CLS + '" style="height: {height};">',
          '<span class="' + GRID_HEADER_CELL_TEXT_CLS + '">{columnName}</span>',
          '<span class="' + GRID_HEADER_CELL_TRIGGER_CLS + '">',
            '<div class="' + GRID_HEADER_CELL_TRIGGER_IMAGE_CLS + '"></div>',
          '</span>',
        '</div>',
      '</div>'
    ],
    /*
     * @constructor
     * @param {Object} config
     */
    constructor: function (config) {
      this.Super('const', arguments);
    },
    /*
     *
     */
    init: function () {
      var me = this;

      me.Super('init', arguments);

      me.initTpl();
      me.render();

      me.renderHeaderCheckBox();

      me.setAlign();
      me.setCellsPosition();
      me.ons();
    },
    /*
     *
     */
    initTpl: function () {
      this.cellTpl = new F.Template(this.cellTpl);
    },
    /*
     *
     */
    ons: function () {
      var me = this,
        w = me.widget,
        el = me.el,
        headerCellSelector = 'div.' + GRID_HEADER_CELL_CLS;

      w.on('render', me.onAfterRender, me);
      el.on('click', me.onTriggerClick, me, 'span.' + GRID_HEADER_CELL_TRIGGER_CLS);
      el.on('click', me.onCellClick, me, headerCellSelector);
      el.on('mousemove', me.onCellMouseMove, me, headerCellSelector);
      el.on('mousedown', me.onCellMouseDown, me, headerCellSelector);
      el.on('mousedown', me.onMouseDown, me);
    },
    /*
     *
     */
    render: function () {
      var me = this,
        w = me.widget,
        columns = me.getColumns(),
        renderTo,
        el = F.get(document.createElement('div')),
        html = '',
        i = 0,
        iL = columns.length,
        numRows = 1,
        groups = {},
        passedWidth = 0,
        isFilterHeader = w.filter && w.filter.header,
        cellFilterGroupType = 'full',
        cellHeight = w.cellHeaderHeight;

      if (w.groupheader) {
        if (isFilterHeader && !w.filter.groupHeader) {
          cellFilterGroupType = 'small';
        }
        else {
          numRows = 2;
        }
      }

      if (isFilterHeader) {
        numRows++;
      }

      for (; i < iL; i++) {
        var column = columns[i],
          title = column.title || column.header,
          height = cellHeight,
          cls = '',
          groupIndex = '';

        if (numRows !== 1) {
          if (!column.grouping) {
            height = (numRows * cellHeight) + 'px';
          }
          else {
            if (!groups[column.grouping]) {
              groups[column.grouping] = {
                width: 0,
                title: column.grouping,
                left: passedWidth
              };
            }

            if (isFilterHeader && w.filter.groupHeader) {
              height = (2 * cellHeight) + 'px';
            }
            else {
              height = cellHeight + 'px';
            }

            if (!column.hidden) {
              groups[column.grouping].width += column.width;
            }

            groupIndex = 'group-index="' + column.grouping + '"';

            cls = GRID_HEADER_CELL_GROUP_LEVEL_1_CLS;
          }
        }

        passedWidth += column.width;

        if (column.index === '$selected') {
          cls += ' ' + GRID_HEADER_CELL_SELECT_CLS;
        }

        if (!column.menu) {
          cls += ' ' + GRID_HEADER_CELL_TRIGGER_DISABLED_CLS;
        }

        if (column.filter && column.filter.header) {
          switch (cellFilterGroupType) {
            case 'small':
              cls += ' ' + GRID_HEADER_CELL_FILTER_SMALL_CLS;
              break;
            case 'full':
              cls += ' ' + GRID_HEADER_CELL_FILTER_FULL_CLS;
              break;
          }
        }

        html += me.cellTpl.getHTML({
          cls: cls,
          columnName: title,
          columnWidth: column.width,
          index: i,
          height: height,
          left: 'initial',
          groupIndex: groupIndex,
          display: column.hidden ? 'none' : ''
        });
      }

      el.css({
        height: cellHeight * numRows + 'px',
        width: me.getColumnsWidth()
      });

      el.addCls(me.cls);

      if (w.groupheader) {
        el.addCls('fancy-grid-header-grouped');
        html += me.getGroupingCellsHTML(groups);
      }

      el.update(html);

      renderTo = w.el.select('.fancy-grid-' + me.side).dom;
      me.el = F.get(renderTo.appendChild(el.dom));
    },
    /*
     * @param {Number} index
     * @param {Object} column
     */
    insertCell: function (index, column) {
      var me = this,
        w = me.widget,
        cells = me.el.select('.' + GRID_HEADER_CELL_CLS + ':not(.' + GRID_HEADER_CELL_GROUP_LEVEL_2_CLS + ')'),
        columns = me.getColumns(),
        cls = '',
        title = column.title || column.header,
        cellHeight = parseInt(cells.item(0).css('height')),
        groupIndex = '',
        left = 0;

      if (w.groupheader) {
        cellHeight = w.cellHeight * 2;
        var groupUpCells = me.el.select('.' + GRID_HEADER_CELL_GROUP_LEVEL_2_CLS);

        //BUG: possible bug for dragging column
        if (index !== w.columns.length - 1) {
          groupUpCells.each(function (cell) {
            var left = parseInt(cell.css('left') || 0) + column.width;

            cell.css('left', left);
          });
        }
      }

      if (column.index === '$selected') {
        cls += ' ' + GRID_HEADER_CELL_SELECT_CLS;
      }

      if (!column.menu) {
        cls += ' ' + GRID_HEADER_CELL_TRIGGER_DISABLED_CLS;
      }

      var j = 0,
        jL = index;

      for (; j < jL; j++) {
        left += columns[j].width;
      }

      var i = index,
        iL = columns.length - 1;

      for (; i < iL; i++) {
        var _cell = cells.item(i),
          _left = parseInt(_cell.css('left') || 0) + column.width;

        _cell.css('left', _left);
      }

      var cellHTML = me.cellTpl.getHTML({
        cls: cls,
        columnName: title,
        columnWidth: column.width,
        index: index,
        height: String(cellHeight) + 'px',
        left: String(left) + 'px',
        groupIndex: groupIndex
      });

      if (index === 0 && cells.length) {
        F.get(cells.item(0).before(cellHTML));
      }
      else if (index !== 0 && cells.length) {
        if(index === cells.length) {
          me.el.append(cellHTML);
        }
        else{
          F.get(cells.item(index).before(cellHTML));
        }
      }

      me.css('width', parseInt(me.css('width')) + column.width);
    },
    /*
     *
     */
    setAlign: function () {
      var me = this,
        columns = me.getColumns(),
        i = 0,
        iL = columns.length;

      for (; i < iL; i++) {
        var column = columns[i];

        if (column.align) {
          me.getDomCell(i).css('text-align', column.align);
        }
      }
    },
    onAfterRender: function () {},
    /*
     *
     */
    setCellsPosition: function () {
      var me = this,
        w = me.widget,
        columns = me.getColumns(),
        cellsWidth = 0,
        cellsDom = me.el.select('.' + GRID_HEADER_CELL_CLS);

      cellsWidth += me.scrollLeft || 0;

      F.each(columns, function (column, i) {
        var cellEl = cellsDom.item(i),
          top = '0px';

        if (column.grouping) {
          top = w.cellHeaderHeight + 'px';
        }

        cellEl.css({
          top: top,
          left: cellsWidth + 'px'
        });

        if (!column.hidden) {
          cellsWidth += column.width;
        }
      });

      if (w.groupheader) {
        var groupCells = me.el.select('.' + GRID_HEADER_CELL_GROUP_LEVEL_2_CLS);

        groupCells.each(function (groupCell) {
          var groupName = groupCell.attr('index');

          var underGroupCells = me.el.select('[group-index="' + groupName + '"]'),
            groupCellLeft = underGroupCells.item(0).css('left'),
            groupCellWidth = 0;

          F.each(columns, function (column) {
            if (column.grouping === groupName && !column.hidden) {
              groupCellWidth += column.width;
            }
          });

          groupCell.css('left', groupCellLeft);
          groupCell.css('width', groupCellWidth);
        });
      }
    },
    /*
     *
     */
    fixGroupHeaderSizing: function () {
      var me = this,
        w = me.widget,
        CELL_HEADER_HEIGHT = w.cellHeaderHeight,
        columns = me.getColumns(),
        cellsDom = me.el.select('.' + GRID_HEADER_CELL_CLS),
        left = w.scroller.scrollLeft,
        groups = {},
        groupsWidth = {},
        groupsLeft = {},
        rows = me.calcRows();

      F.each(columns, function (column, i) {
        var cell = cellsDom.item(i),
          grouping = column.grouping,
          top = '0px',
          height = CELL_HEADER_HEIGHT * rows;

        groups[grouping] = true;

        if(grouping){
          if(groupsWidth[grouping] === undefined){
            groupsWidth[grouping] = column.width;
            groupsLeft[grouping] = left;
          }
          else{
            groupsWidth[grouping] += column.width;
          }

          cell.addCls(GRID_HEADER_CELL_GROUP_LEVEL_1_CLS);
          top = CELL_HEADER_HEIGHT + 'px';
          height = CELL_HEADER_HEIGHT;

          if(column.filter && column.filter.header){
            height = CELL_HEADER_HEIGHT * 2;
            setTimeout(function () {
              cell.addCls(GRID_HEADER_CELL_FILTER_FULL_CLS);
            }, 30);
          }
        }
        else{
          cell.removeCls(GRID_HEADER_CELL_GROUP_LEVEL_1_CLS);
          if(column.filter && column.filter.header){
            setTimeout(function () {
              cell.addCls(GRID_HEADER_CELL_FILTER_SMALL_CLS);
            }, 30);
            cell.addCls(GRID_HEADER_CELL_FILTER_SMALL_CLS);
          }
        }

        if(w.groupheader && height === CELL_HEADER_HEIGHT && !grouping && !column.filter){
          height = CELL_HEADER_HEIGHT * 2;
        }

        //TODO: case for ungroup all cells over column drag with filtering

        cell.css({
          top: top,
          height: height
        });

        left += column.width;
      });

      for(var p in groupsWidth){
        var groupCell = me.el.select('[index="'+p+'"]');

        groupCell.css({
          left: groupsLeft[p],
          width: groupsWidth[p]
        });
      }

      var groupCells = me.el.select('.' + GRID_HEADER_CELL_GROUP_LEVEL_2_CLS);

      groupCells.each(function (cell) {
        var groupName = cell.attr('index');

        if(!groups[groupName]){
          cell.destroy();
        }
      });
    },
    /*
     * @return {Number}
     */
    getColumnsWidth: function () {
      var me = this,
        columns = me.getColumns(),
        cellsWidth = 0,
        i = 0,
        iL = columns.length;

      for (; i < iL; i++) {
        var column = columns[i];

        cellsWidth += column.width;
      }

      return cellsWidth;
    },
    /*
     * @return {Array}
     */
    getColumns: function () {
      var me = this,
        w = me.widget,
        columns;

      switch (me.side) {
        case 'left':
          columns = w.leftColumns;
          break;
        case 'center':
          columns = w.columns;
          break;
        case 'right':
          columns = w.rightColumns;
          break;
      }

      return columns;
    },
    /*
     * @param {Number} index
     * @return {Fancy.Element}
     */
    getDomCell: function (index) {
      return this.el.select('.' + GRID_HEADER_CELL_CLS).item(index);
    },
    /*
     * @param {Event} e
     */
    onCellClick: function (e) {
      var me = this,
        w = me.widget,
        columndrag = w.columndrag,
        cell = e.currentTarget,
        target = F.get(e.target),
        index = parseInt(F.get(cell).attr('index'));

      if(columndrag && columndrag.status === 'dragging'){
        return;
      }

      if (target.hasCls(GRID_HEADER_CELL_TRIGGER_CLS)) {
        return
      }

      if (target.hasCls(GRID_HEADER_CELL_TRIGGER_IMAGE_CLS)) {
        return
      }

      if (F.get(cell).hasCls(GRID_HEADER_CELL_GROUP_LEVEL_2_CLS)) {
        return;
      }

      w.fire('headercellclick', {
        e: e,
        side: me.side,
        cell: cell,
        index: index
      });
    },
    /*
     * @param {Event} e
     */
    onCellMouseMove: function (e) {
      var me = this,
        w = me.widget,
        cell = e.currentTarget,
        cellEl = F.get(cell),
        isGroupCell = cellEl.hasCls(GRID_HEADER_CELL_GROUP_LEVEL_2_CLS),
        index = parseInt(F.get(cell).attr('index'));

      if (isGroupCell) {
        return;
      }

      w.fire('headercellmousemove', {
        e: e,
        side: me.side,
        cell: cell,
        index: index
      });
    },
    /*
     * @param {Event} e
     */
    onMouseDown: function (e) {
      var targetEl = F.get(e.target);

      if (targetEl.prop("tagName") === 'INPUT') {
      }
      else {
        e.preventDefault();
      }
    },
    /*
     * @param {Event} e
     */
    onCellMouseDown: function (e) {
      var w = this.widget,
        cell = e.currentTarget,
        index = parseInt(F.get(cell).attr('index'));

      w.fire('headercellmousedown', {
        e: e,
        side: this.side,
        cell: cell,
        index: index
      });
    },
    /*
     * @param {Number} value
     */
    scroll: function (value) {
      this.scrollLeft = value;
      this.setCellsPosition();
    },
    /*
     * @param {Array} groups
     * @return {String}
     */
    getGroupingCellsHTML: function (groups) {
      var me = this,
        w = me.widget,
        html = '';

      F.each(groups, function (group, p) {
        html += me.cellTpl.getHTML({
          cls: GRID_HEADER_CELL_GROUP_LEVEL_2_CLS,
          columnName: group.title,
          columnWidth: group.width,
          index: p,
          height: w.cellHeaderHeight + 'px',
          left: group.left + 'px',
          groupIndex: ''
        });
      });

      return html;
    },
    /*
     *
     */
    destroy: function () {
      var me = this,
        el = me.el,
        cellSelector = 'div.' + GRID_HEADER_CELL_CLS;

      el.un('click', me.onCellClick, me, cellSelector);
      el.un('mousemove', me.onCellMouseMove, me, cellSelector);
      el.un('mousedown', me.onCellMouseDown, me, cellSelector);
      el.un('mousedown', me.onMouseDown, me);
    },
    /*
     * @param {Number} index
     * @return {Fancy.Element}
     */
    getCell: function (index) {
      return this.el.select('.' + GRID_HEADER_CELL_CLS + '[index="' + index + '"]');
    },
    /*
     * @param {Event} e
     */
    onTriggerClick: function (e) {
      var me = this,
        target = F.get(e.currentTarget),
        cell = target.parent().parent(),
        index = parseInt(cell.attr('index')),
        columns = me.getColumns(),
        column = columns[index];

      e.stopPropagation();

      me.showMenu(cell, index, column, columns);
    },
    /*
     * @param {Number} orderIndex
     */
    hideCell: function (orderIndex) {
      var me = this,
        cells = me.el.select('.' + GRID_HEADER_CELL_CLS + ':not(.' + GRID_HEADER_CELL_GROUP_LEVEL_2_CLS + ')'),
        cell = cells.item(orderIndex),
        cellWidth = parseInt(cell.css('width')),
        i = orderIndex + 1,
        iL = cells.length,
        columns = me.getColumns();

      if (cell.hasCls(GRID_HEADER_CELL_GROUP_LEVEL_1_CLS)) {
        var groupIndex = cell.attr('group-index'),
          groupCell = me.el.select('.' + GRID_HEADER_CELL_GROUP_LEVEL_2_CLS + '[index="' + groupIndex + '"]').item(0),
          groupCellWidth = parseInt(groupCell.css('width'));

        groupCell.css('width', groupCellWidth - cellWidth);
      }

      cell.hide();

      var groups = {};

      for (; i < iL; i++) {
        var _cell = cells.item(i),
          left = parseInt(_cell.css('left')) - cellWidth,
          column = columns[i];

        if (column.grouping) {
          if (columns[orderIndex].grouping !== column.grouping) {
            groups[column.grouping] = true;
          }
        }

        _cell.css('left', left);
      }

      F.each(groups, function (group, p) {
        var groupCell = me.el.select('.' + GRID_HEADER_CELL_GROUP_LEVEL_2_CLS + '[index="' + p + '"]').item(0);

        groupCell.css('left', parseInt(groupCell.css('left')) - cellWidth);
      });
    },
    /*
     * @param {Number} orderIndex
     */
    showCell: function (orderIndex) {
      var me = this,
        cells = me.el.select('.' + GRID_HEADER_CELL_CLS + ':not(.' + GRID_HEADER_CELL_GROUP_LEVEL_2_CLS + ')'),
        cell = cells.item(orderIndex),
        cellWidth,
        i = orderIndex + 1,
        iL = cells.length,
        columns = me.getColumns();

      cell.show();

      cellWidth = parseInt(cell.css('width'));

      if (cell.hasCls(GRID_HEADER_CELL_GROUP_LEVEL_1_CLS)) {
        var groupIndex = cell.attr('group-index'),
          groupCell = me.el.select('.' + GRID_HEADER_CELL_GROUP_LEVEL_2_CLS + '[index="' + groupIndex + '"]').item(0),
          groupCellWidth = parseInt(groupCell.css('width'));

        groupCell.css('width', groupCellWidth + cellWidth);
      }

      var groups = {};

      for (; i < iL; i++) {
        var _cell = cells.item(i),
          left = parseInt(_cell.css('left')) + cellWidth,
          column = columns[i];

        if (column.grouping) {
          if (columns[orderIndex].grouping !== column.grouping) {
            groups[column.grouping] = true;
          }
        }
        _cell.css('left', left);
      }

      for (var p in groups) {
        var groupCell = me.el.select('.' + GRID_HEADER_CELL_GROUP_LEVEL_2_CLS + '[index="' + p + '"]').item(0);
        groupCell.css('left', parseInt(groupCell.css('left')) + cellWidth);
      }
    },
    /*
     * @param {Number} orderIndex
     */
    removeCell: function (orderIndex) {
      var me = this,
        cells = me.el.select('.' + GRID_HEADER_CELL_CLS + ':not(.' + GRID_HEADER_CELL_GROUP_LEVEL_2_CLS + ')'),
        cell = cells.item(orderIndex),
        cellWidth = parseInt(cell.css('width')),
        i = orderIndex + 1,
        iL = cells.length,
        groupCells = {},
        isGroupCell = false;

      if (cell.attr('group-index')) {
        isGroupCell = cell.attr('group-index');
        groupCells[isGroupCell] = true;
      }

      cell.destroy();

      for (; i < iL; i++) {
        var _cell = cells.item(i),
          left = parseInt(_cell.css('left')) - cellWidth;

        if (_cell.attr('group-index')) {
          groupCells[_cell.attr('group-index')] = true;
        }

        _cell.attr('index', i - 1);

        _cell.css('left', left);
      }

      for (var p in groupCells) {
        var groupCell = me.el.select('[index="' + p + '"]'),
          newCellWidth = parseInt(groupCell.css('width')) - cellWidth,
          newCellLeft = parseInt(groupCell.css('left')) - cellWidth;

        if (isGroupCell && groupCell) {
          groupCell.css('width', newCellWidth);

          if (groupCell.attr('index') !== isGroupCell) {
            groupCell.css('left', newCellLeft);
          }
        }
        else {
          groupCell.css('left', newCellLeft);
        }
      }

      if (isGroupCell) {
        if (me.el.select('[group-index="' + isGroupCell + '"]').length === 0) {
          var groupCell = me.el.select('[index="' + isGroupCell + '"]');

          groupCell.destroy();
        }
      }

      if (me.side !== 'center') {
        me.css('width', parseInt(me.css('width')) - cellWidth);
      }
    },
    /*
     *
     */
    renderHeaderCheckBox: function () {
      var me = this,
        w = me.widget,
        columns = me.getColumns(),
        i = 0,
        iL = columns.length,
        cells = me.el.select('.' + GRID_HEADER_CELL_CLS + ':not(.' + GRID_HEADER_CELL_GROUP_LEVEL_2_CLS + ')');

      for (; i < iL; i++) {
        var column = columns[i];

        if (column.headerCheckBox === true) {
          var cell = cells.item(i),
            headerCellContainer = cell.firstChild(),
            textEl = cell.select('.' + GRID_HEADER_CELL_TEXT_CLS),
            text = textEl.dom.innerHTML,
            label = !text ? false : text,
            labelWidth = 0;

          cell.addCls('fancy-grid-header-cell-checkbox');
          textEl.update('');

          if (label.length) {
            labelWidth = label.width * 15;
          }

          column.headerCheckBox = new F.CheckBox({
            renderTo: headerCellContainer.dom,
            renderId: true,
            labelWidth: labelWidth,
            value: false,
            label: label,
            labelAlign: 'right',
            style: {
              padding: '0px',
              display: 'inline-block'
            },
            events: [{
              change: function (checkbox, value) {
                var i = 0,
                  iL = w.getViewTotal();

                for (; i < iL; i++) {
                  w.set(i, column.index, value);
                }
              }
            }]
          });
        }
      }
    },
    /*
     *
     */
    reSetIndexes: function () {
      var cells = this.el.select('.' + GRID_HEADER_CELL_CLS + ':not(.' + GRID_HEADER_CELL_GROUP_LEVEL_2_CLS + ')');

      cells.each(function (cell, i) {
        cell.attr('index', i);
      })
    },
    /*
     *
     */
    reSetGroupIndexes: function () {
      var me = this,
        columns = me.getColumns(),
        cells = this.el.select('.' + GRID_HEADER_CELL_CLS + ':not(.' + GRID_HEADER_CELL_GROUP_LEVEL_2_CLS + ')');

      cells.each(function (cell, i) {
        var column = columns[i],
          grouping = column.grouping;

        if(cell.attr('group-index') && !grouping){
          cell.removeAttr('group-index');
        }
        else if(grouping && cell.attr('group-index') !== grouping){
          cell.attr('group-index', grouping);
        }
      });
    },
    /*
     *
     */

    /*
     *
     */
    updateTitles: function(){
      var me = this,
        columns = me.getColumns();

      F.each(columns, function (column, i) {
        me.el.select('div.' + GRID_HEADER_CELL_CLS + '[index="'+i+'"] .' + GRID_HEADER_CELL_TEXT_CLS).update(column.title || '');
      });
    },
    /*
     *
     */
    updateCellsSizes: function(){
      var me = this,
        w = me.widget,
        columns = me.getColumns(),
        left = -w.scroller.scrollLeft || 0;

      F.each(columns, function (column, i){
        var cell = me.el.select('div.' + GRID_HEADER_CELL_CLS + '[index="'+i+'"]');

        cell.css({
          width: column.width,
          left: left
        });

        left += column.width;
      });
    },
    /*
     * @return {Number}
     */
    calcRows: function(){
      var me = this,
        w = me.widget,
        columns = w.columns.concat(w.leftColumns).concat(w.rightColumns),
        rows = 1;

      Fancy.each(columns, function(column){
         if(column.grouping){
           if(rows < 2){
             rows = 2;
           }

           if(column.filter && column.filter.header){
             if(rows < 3){
               rows = 3;
             }
           }
         }

        if(column.filter && column.filter.header){
          if(rows < 2){
            rows = 2;
          }
        }
      });

      return rows;
    },
    /*
     *
     */
    reSetColumnsAlign: function () {
      var me = this,
        columns = me.getColumns(),
        cells = this.el.select('.' + GRID_HEADER_CELL_CLS + ':not(.' + GRID_HEADER_CELL_GROUP_LEVEL_2_CLS + ')');

      cells.each(function(cell, i){
        var column = columns[i];

        cell.css('text-align', column.align || '');
      });
    },
    /*
     * Bug Fix: Empty method that is rewritten in HeaderMenu mixin
     */
    destroyMenus: function () {}
  });

})();
/*
 * @class Fancy.DatePicker
 */
(function () {
  //SHORTCUTS
  var F = Fancy;
  var D = F.Date;

  //CONSTANTS
  var PICKER_DATE_CELL_ACTIVE_CLS = F.PICKER_DATE_CELL_ACTIVE_CLS;
  var PICKER_DATE_CLS = F.PICKER_DATE_CLS;
  var PICKER_DATE_CELL_TODAY_CLS = F.PICKER_DATE_CELL_TODAY_CLS;
  var PICKER_DATE_CELL_OUT_RANGE_CLS = F.PICKER_DATE_CELL_OUT_RANGE_CLS;
  var PICKER_BUTTON_BACK_CLS = F.PICKER_BUTTON_BACK_CLS;
  var PICKER_BUTTON_NEXT_CLS = F.PICKER_BUTTON_NEXT_CLS;
  var PICKER_BUTTON_DATE_CLS = F.PICKER_BUTTON_DATE_CLS;
  var PICKER_BUTTON_DATE_WRAPPER_CLS = F.PICKER_BUTTON_DATE_WRAPPER_CLS;
  var PICKER_BUTTON_TODAY_CLS = F.PICKER_BUTTON_TODAY_CLS;
  var PICKER_BUTTON_TODAY_WRAPPER_CLS = F.PICKER_BUTTON_TODAY_WRAPPER_CLS;

  F.define('Fancy.datepicker.Manager', {
    singleton: true,
    opened: [],
    /*
     * @param {Object} picker
     */
    add: function (picker) {
      this.hide();
      this.opened.push(picker);
    },
    hide: function () {
      var opened = this.opened,
        i = 0,
        iL = opened.length;

      for (; i < iL; i++) {
        opened[i].hide();
      }

      this.opened = [];
    }
  });

  F.define(['Fancy.picker.Date', 'Fancy.DatePicker'], {
    extend: F.Grid,
    type: 'datepicker',
    mixins: [
      'Fancy.grid.mixin.Grid',
      F.panel.mixin.PrepareConfig,
      F.panel.mixin.methods,
      'Fancy.grid.mixin.PrepareConfig',
      'Fancy.grid.mixin.ActionColumn',
      'Fancy.grid.mixin.Edit'
    ],
    width: 308,
    height: 299,
    frame: false,
    //panelBorderWidth: 0,
    i18n: 'en',
    cellTrackOver: true,
    cellStylingCls: [PICKER_DATE_CELL_OUT_RANGE_CLS, PICKER_DATE_CELL_TODAY_CLS, PICKER_DATE_CELL_ACTIVE_CLS],
    activeCellCls: PICKER_DATE_CELL_ACTIVE_CLS,
    todayCellCls: PICKER_DATE_CELL_TODAY_CLS,
    pickerDateCls: PICKER_DATE_CLS,
    outRangeCellCls: PICKER_DATE_CELL_OUT_RANGE_CLS,
    buttonBackCls: PICKER_BUTTON_BACK_CLS,
    buttonDateCls: PICKER_BUTTON_DATE_CLS,
    buttonDateWrapperCls: PICKER_BUTTON_DATE_WRAPPER_CLS,
    buttonNextCls: PICKER_BUTTON_NEXT_CLS,
    buttonTodayCls: PICKER_BUTTON_TODAY_CLS,
    buttonTodayWrapperCls: PICKER_BUTTON_TODAY_WRAPPER_CLS,
    defaults: {
      type: 'string',
      width: 44,
      align: 'center',
      cellAlign: 'center'
    },
    gridBorders: [1, 0, 1, 1],
    panelBodyBorders: [0, 0, 0, 0],
    barScrollEnabled: false,
    /*
     * @constructor
     * @param {Object} config
     */
    constructor: function (config) {
      var me = this;

      F.apply(me, config);

      me.initFormat();
      me.initColumns();
      me.initDate();
      me.initData();
      me.initBars();

      me.Super('constructor', [me]);
    },
    /*
     *
     */
    init: function () {
      var me = this;

      me.Super('init', arguments);

      me.onUpdate();

      me.addEvents('changedate');

      me.on('update', me.onUpdate, me);
      me.on('cellclick', me.onCellClick, me);

      me.addCls(PICKER_DATE_CLS);
      me.el.on('mousewheel', me.onMouseWheel, me);

      me.panel.el.on('mousedown', me.onMouseDown, me);
    },
    /*
     *
     */
    initFormat: function () {
      var me = this;

      if (me.format) {
      }
      else {
        me.format = F.i18n[me.i18n].date;
      }
    },
    /*
     *
     */
    initMonthPicker: function () {
      var me = this;

      if (!F.fullBuilt && F.MODULELOAD !== false && F.MODULELOAD !== false && ( me.monthPicker || !F.modules['grid'] )) {
        return;
      }

      me.monthPicker = new F.MonthPicker({
        date: me.date,
        renderTo: me.panel.el.dom,
        style: {
          position: 'absolute',
          top: '-' + me.panel.el.height() + 'px',
          left: '0px'
        },
        events: [{
          cancelclick: me.onMonthCancelClick,
          scope: me
        }, {
          okclick: me.onMonthOkClick,
          scope: me
        }]
      });
    },
    /*
     *
     */
    initData: function () {
      this.data = this.setData();
    },
    /*
     *
     */
    initDate: function () {
      var me = this;

      if (me.date === undefined) {
        me.date = new Date();
      }

      me.showDate = me.date;
    },
    /*
     *
     */
    initColumns: function () {
      var me = this,
        format = me.format,
        days = format.days,
        startDay = format.startDay,
        i = startDay,
        iL = days.length,
        dayIndexes = D.dayIndexes,
        columns = [],
        today = new Date();

      var render = function (o) {
        o.cls = '';

        switch (o.rowIndex) {
          case 0:
            if (Number(o.value) > 20) {
              o.cls += ' ' + PICKER_DATE_CELL_OUT_RANGE_CLS;
            }
            break;
          case 4:
          case 5:
            if (Number(o.value) < 15) {
              o.cls += ' ' + PICKER_DATE_CELL_OUT_RANGE_CLS;
            }
            break;
        }

        var date = me.date,
          showDate = me.showDate;

        if (today.getMonth() === showDate.getMonth() && today.getFullYear() === showDate.getFullYear()) {
          if (o.value === today.getDate()) {
            if (o.rowIndex === 0) {
              if (o.value < 20) {
                o.cls += ' ' + PICKER_DATE_CELL_TODAY_CLS;
              }
            }
            else if (o.rowIndex === 4 || o.rowIndex === 5) {
              if (o.value > 20) {
                o.cls += ' ' + PICKER_DATE_CELL_TODAY_CLS;
              }
            }
            else {
              o.cls += ' ' + PICKER_DATE_CELL_TODAY_CLS;
            }
          }
        }

        if (date.getMonth() === showDate.getMonth() && date.getFullYear() === showDate.getFullYear()) {
          if (o.value === date.getDate()) {
            if (o.rowIndex === 0) {
              if (o.value < 20) {
                o.cls += ' ' + PICKER_DATE_CELL_ACTIVE_CLS;
              }
            }
            else if (o.rowIndex === 4 || o.rowIndex === 5) {
              if (o.value > 20) {
                o.cls += ' ' + PICKER_DATE_CELL_ACTIVE_CLS;
              }
            }
            else {
              o.cls += ' ' + PICKER_DATE_CELL_ACTIVE_CLS;
            }
          }
        }

        return o;
      };

      for (; i < iL; i++) {
        columns.push({
          index: dayIndexes[i],
          title: days[i][0].toLocaleUpperCase(),
          render: render
        });
      }

      i = 0;
      iL = startDay;

      for(;i<iL;i++){
        columns.push({
          index: dayIndexes[i],
          title: days[i][0].toLocaleUpperCase(),
          render: render
        });
      }

      me.columns = columns;
    },
    /*
     * @return {Array}
     */
    getDataFields: function () {
      var me = this,
        fields = [],
        format = me.format,
        days = format.days,
        startDay = format.startDay,
        i = startDay,
        iL = days.length,
        dayIndexes = D.dayIndexes;

      for (; i < iL; i++) {
        fields.push(dayIndexes[i]);
      }

      i = 0;
      iL = startDay;

      for (; i < iL; i++) {
        fields.push(dayIndexes[i]);
      }

      return fields;
    },
    /*
     *
     */
    setData: function () {
      var me = this,
        format = me.format,
        startDay = format.startDay,
        date = me.showDate,
        daysInMonth = D.getDaysInMonth(date),
        firstDayOfMonth = D.getFirstDayOfMonth(date),
        data = [],
        fields = me.getDataFields(),
        i = 0,
        iL = daysInMonth,
        keyPlus = 0;

      for (; i < iL; i++) {
        var key = i + firstDayOfMonth - startDay + keyPlus;
        if (key < 0) {
          key = 7 - startDay;
          keyPlus = key + 1;
        }

        if (key === 0) {
          key = 7;
          keyPlus = key;
        }

        data[key] = i + 1;
      }

      var month = date.getMonth(),
        year = date.getFullYear(),
        _date = date.getDate(),
        hour = date.getHours(),
        minute = date.getMinutes(),
        second = date.getSeconds(),
        millisecond = date.getMilliseconds();

      if (month === 0) {
        month = 11;
        year--;
      }
      else {
        month--;
      }

      var prevDate = new Date(year, month, _date, hour, minute, second, millisecond),
        prevDateDaysInMonth = D.getDaysInMonth(prevDate);

      i = 7;

      while (i--) {
        if (data[i] === undefined) {
          data[i] = prevDateDaysInMonth;
          prevDateDaysInMonth--;
        }
      }

      var i = 28,
        iL = 42,
        nextMonthDay = 1;

      for (; i < iL; i++) {
        if (data[i] === undefined) {
          data[i] = nextMonthDay;
          nextMonthDay++;
        }
      }

      var _data = [],
        i = 0,
        iL = 6;

      for (; i < iL; i++) {
        _data[i] = data.splice(0, 7);
      }

      return {
        fields: fields,
        items: _data
      };
    },
    /*
     *
     */
    initBars: function () {
      this.initTBar();
      this.initBBar();
    },
    /*
     *
     */
    initTBar: function () {
      var me = this,
        tbar = [];

      tbar.push({
        cls: PICKER_BUTTON_BACK_CLS,
        handler: me.onBackClick,
        scope: me,
        style: {}
      });

      tbar.push({
        cls: PICKER_BUTTON_DATE_CLS,
        wrapper: {
          cls: PICKER_BUTTON_DATE_WRAPPER_CLS
        },
        handler: me.onDateClick,
        scope: me,
        text: '                       '
      });

      tbar.push('side');

      tbar.push({
        cls: PICKER_BUTTON_NEXT_CLS,
        handler: me.onNextClick,
        scope: me
      });

      me.tbar = tbar;
    },
    /*
     *
     */
    initBBar: function () {
      var me = this,
        bbar = [];

      bbar.push({
        text: me.format.today,
        cls: PICKER_BUTTON_TODAY_CLS,
        wrapper: {
          cls: PICKER_BUTTON_TODAY_WRAPPER_CLS
        },
        handler: me.onClickToday,
        scope: me
      });

      me.bbar = bbar;
    },
    /*
     *
     */
    onBackClick: function () {
      var me = this,
        date = me.showDate,
        month = date.getMonth(),
        year = date.getFullYear(),
        _date = date.getDate(),
        hour = date.getHours(),
        minute = date.getMinutes(),
        second = date.getSeconds(),
        millisecond = date.getMilliseconds();

      if (month === 0) {
        month = 11;
        year--;
      }
      else {
        month--;
      }

      me.showDate = new Date(year, month, _date, hour, minute, second, millisecond);

      var data = me.setData();
      me.store.setData(data.items);
      me.update();
    },
    /*
     *
     */
    onNextClick: function () {
      var me = this,
        date = me.showDate,
        month = date.getMonth(),
        year = date.getFullYear(),
        _date = date.getDate(),
        hour = date.getHours(),
        minute = date.getMinutes(),
        second = date.getSeconds(),
        millisecond = date.getMilliseconds();

      if (month === 11) {
        month = 0;
        year++;
      }
      else {
        month++;
      }

      me.showDate = new Date(year, month, _date, hour, minute, second, millisecond);

      var data = me.setData();
      me.store.setData(data.items);
      me.update();
    },
    /*
     *
     */
    onUpdate: function () {
      var me = this,
        value = D.format(me.showDate, 'F Y', {
          date: me.format
        });

      me.tbar[1].setText(value);
    },
    /*
     *
     */
    onClickToday: function () {
      var me = this,
        date = new Date();

      me.showDate = date;
      me.date = date;

      var data = me.setData();
      me.store.setData(data.items);
      me.update();
    },
    /*
     * @param {Fancy.Grid} grid
     * @param {Object} o
     */
    onCellClick: function (grid, o) {
      var me = this,
        date = me.showDate,
        year = date.getFullYear(),
        month = date.getMonth(),
        hour = date.getHours(),
        minute = date.getMinutes(),
        second = date.getSeconds(),
        millisecond = date.getMilliseconds(),
        day,
        cell = F.get(o.cell);

      me.date = new Date(year, month, Number(o.value), hour, minute, second, millisecond);

      me.el.select('.' + PICKER_DATE_CELL_ACTIVE_CLS).removeCls(PICKER_DATE_CELL_ACTIVE_CLS);

      cell.addCls(PICKER_DATE_CELL_ACTIVE_CLS);

      me.fire('changedate', me.date);

      if (cell.hasCls(PICKER_DATE_CELL_OUT_RANGE_CLS)) {
        day = Number(o.value);
        if (o.rowIndex < 3) {
          if (month === 0) {
            year--;
            month = 11;
          }
          else {
            month--;
          }
        }
        else {
          if (month === 11) {
            year++;
            month = 11;
          }
          else {
            month++;
          }
        }

        me.date = new Date(year, month, day, hour, minute, second, millisecond);
        me.showDate = me.date;

        var data = me.setData();

        me.store.setData(data.items);
        me.update();
      }
    },
    /*
     * @param {Object} e
     */
    onMouseWheel: function (e) {
      var delta = F.getWheelDelta(e.originalEvent || e);

      if (delta < 0) {
        this.onBackClick();
      }
      else {
        this.onNextClick();
      }
    },
    /*
     *
     */
    onDateClick: function () {
      var me = this;

      me.initMonthPicker();

      me.monthPicker.panel.css('display', 'block');
      if (F.$.fn.animate) {
        me.monthPicker.panel.el.animate({
          top: '0px'
        });
      }
      else {
        me.monthPicker.panel.css({
          top: '0px'
        });
      }
    },
    /*
     *
     */
    onMonthCancelClick: function () {
      this.hideMonthPicker();
    },
    /*
     *
     */
    onMonthOkClick: function () {
      var me = this,
        monthPickerDate = me.monthPicker.date,
        newMonth = monthPickerDate.getMonth(),
        newYear = monthPickerDate.getFullYear(),
        date = me.date.getDate(),
        hour = me.date.getHours(),
        minute = me.date.getMinutes(),
        second = me.date.getSeconds(),
        millisecond = me.date.getMilliseconds();

      me.hideMonthPicker();

      if(date > 28){
        date = 1;
      }

      me.date = new Date(newYear, newMonth, date, hour, minute, second, millisecond);
      me.showDate = me.date;

      var data = me.setData();
      me.store.setData(data.items);
      me.update();

      me.fire('changedate', me.date, false);
    },
    /*
     *
     */
    hideMonthPicker: function () {
      var el = this.monthPicker.panel.el;

      if (F.$.fn.animate) {
        el.animate({
          top: '-' + el.css('height')
        }, {
          complete: function () {
            el.css('display', 'none');
          }
        });
      }
      else {
        el.css('display', 'none');
      }
    },
    /*
     * @param {Object} e
     */
    onMouseDown: function (e) {
      e.preventDefault();
    },
    /*
     * @param {Date} date
     */
    setDate: function (date) {
      var me = this;

      me.date = date;
      me.showDate = date;
      me.store.setData(me.setData().items);
      me.update();
    }
  });

})();
/*
 * @class Fancy.MonthPicker
 * @extends Fancy.Grid
 */
(function () {
  //SHORTCUTS
  var F = Fancy;

  //CONSTANTS
  var PICKER_MONTH_CELL_ACTIVE_CLS = F.PICKER_MONTH_CELL_ACTIVE_CLS;
  var PICKER_MONTH_CLS = F.PICKER_MONTH_CLS;
  var PICKER_BUTTON_BACK_CLS = F.PICKER_BUTTON_BACK_CLS;
  var PICKER_BUTTON_NEXT_CLS = F.PICKER_BUTTON_NEXT_CLS;
  var PICKER_MONTH_ACTION_BUTTONS_CLS = F.PICKER_MONTH_ACTION_BUTTONS_CLS;

  F.define(['Fancy.picker.Month', 'Fancy.MonthPicker'], {
    extend: F.Grid,
    type: 'monthpicker',
    mixins: [
      'Fancy.grid.mixin.Grid',
      F.panel.mixin.PrepareConfig,
      F.panel.mixin.methods,
      'Fancy.grid.mixin.PrepareConfig',
      'Fancy.grid.mixin.ActionColumn',
      'Fancy.grid.mixin.Edit'
    ],
    width: 308,
    height: 299,
    frame: false,
    //panelBorderWidth: 0,
    cellHeight: 37,
    i18n: 'en',
    cellTrackOver: true,
    cellStylingCls: [PICKER_MONTH_CELL_ACTIVE_CLS],
    activeCellCls: PICKER_MONTH_CELL_ACTIVE_CLS,
    buttonBackCls: PICKER_BUTTON_BACK_CLS,
    buttonNextCls: PICKER_BUTTON_NEXT_CLS,
    actionButtonsCls: PICKER_MONTH_ACTION_BUTTONS_CLS,
    defaults: {
      type: 'string',
      width: 76,
      align: 'center',
      cellAlign: 'center'
    },
    gridBorders: [1, 0, 1, 1],
    panelBodyBorders: [0, 0, 0, 0],
    header: false,
    /*
     * @constructor
     * @param {Object} config
     */
    constructor: function (config) {
      var me = this;

      F.apply(me, config);
      me.initLang();
      me.initColumns();
      me.initDate();
      me.initData();
      me.initBars();

      me.Super('constructor', [me]);
    },
    /*
     *
     */
    init: function () {
      var me = this;

      me.Super('init', arguments);
      me.addEvents('cancelclick', 'okclick');

      me.addEvents('changedate');
      me.on('cellclick', me.onCellClick, me);

      me.panel.addCls(PICKER_MONTH_CLS);
    },
    /*
     *
     */
    initData: function () {
      this.data = this.setData();
    },
    /*
     *
     */
    initDate: function () {
      var me = this;

      if (me.date === undefined) {
        me.date = new Date();
      }

      me.showDate = me.date;
    },
    /*
     *
     */
    initLang: function () {
      var me = this;

      if (me.lang) {
        return;
      }

      me.lang = F.Object.copy(F.i18n[me.i18n]);
    },
    /*
     *
     */
    initColumns: function () {
      var me = this;

      var renderMonth = function (o) {
        var date = me.date,
          month = date.getMonth();

        if (me.lang.date.months[month].substr(0, 3) === o.value) {
          o.cls = PICKER_MONTH_CELL_ACTIVE_CLS;
        }

        return o;
      };

      var renderYear = function (o) {
        var date = me.date,
          year = date.getFullYear();

        if (year === Number(o.value)) {
          o.cls = PICKER_MONTH_CELL_ACTIVE_CLS;
        }

        return o;
      };

      me.columns = [{
        index: 'month1',
        render: renderMonth,
        locked: true
      }, {
        index: 'month2',
        render: renderMonth,
        locked: true,
        width: 77
      }, {
        index: 'year1',
        render: renderYear,
        width: 77
      }, {
        index: 'year2',
        render: renderYear,
        width: 77
      }];
    },
    /*
     * @return {Object}
     */
    setData: function () {
      var me = this,
        lang = me.lang,
        date = me.showDate,
        year = date.getFullYear(),
        months = lang.date.months,
        data = [],
        i,
        iL,
        years = [];

      i = 0;
      iL = 12;

      for (; i < iL; i++) {
        years.push(year - 5 + i);
      }

      i = 0;
      iL = 6;

      for (; i < iL; i++) {
        data[i] = {};

        data[i]['month1'] = months[i].substr(0, 3);
        data[i]['month2'] = months[6 + i].substr(0, 3);

        data[i]['year1'] = years[i];
        data[i]['year2'] = years[6 + i];
      }

      return {
        fields: ['month1', 'month2', 'year1', 'year2'],
        items: data
      };
    },
    /*
     *
     */
    initBars: function () {
      this.initTBar();
      this.initBBar();
    },
    /*
     *
     */
    initTBar: function () {
      var me = this,
        tbar = [];

      tbar.push('side');
      tbar.push({
        cls: PICKER_BUTTON_BACK_CLS,
        handler: me.onBackClick,
        scope: me
      });

      tbar.push({
        cls: PICKER_BUTTON_NEXT_CLS,
        handler: me.onNextClick,
        scope: me
      });

      me.tbar = tbar;
    },
    /*
     *
     */
    initBBar: function () {
      var me = this,
        bbar = [],
        lang = me.lang;

      bbar.push({
        type: 'wrapper',
        cls: PICKER_MONTH_ACTION_BUTTONS_CLS,
        items: [{
          text: lang.date.ok,
          handler: me.onClickOk,
          scope: me
        }, {
          text: lang.date.cancel,
          handler: me.onClickCancel,
          scope: me
        }]
      });

      me.bbar = bbar;
    },
    /*
     *
     */
    onBackClick: function () {
      var me = this,
        date = me.showDate,
        year = date.getFullYear(),
        month = date.getMonth(),
        _date = date.getDate(),
        hour = date.getHours(),
        minute = date.getMinutes(),
        second = date.getSeconds(),
        millisecond = date.getMilliseconds();

      year -= 10;

      me.showDate = new Date(year, month, _date, hour, minute, second, millisecond);

      var data = me.setData();
      me.store.setData(data.items);
      me.update();
    },
    /*
     *
     */
    onNextClick: function () {
      var me = this,
        date = me.showDate,
        year = date.getFullYear(),
        month = date.getMonth(),
        _date = date.getDate(),
        hour = date.getHours(),
        minute = date.getMinutes(),
        second = date.getSeconds(),
        millisecond = date.getMilliseconds();

      year += 10;

      me.showDate = new Date(year, month, _date, hour, minute, second, millisecond);

      var data = me.setData();
      me.store.setData(data.items);
      me.update();
    },
    /*
     *
     */
    onClickOk: function () {
      this.fire('okclick');
    },
    /*
     *
     */
    onClickCancel: function () {
      this.fire('cancelclick');
    },
    /*
     * @param {Fancy.Grid} grid
     * @param {Object} o
     */
    onCellClick: function (grid, o) {
      var me = this,
        date = me.date,
        year = date.getFullYear(),
        month = date.getMonth(),
        _date = date.getDate(),
        hour = date.getHours(),
        minute = date.getMinutes(),
        second = date.getSeconds(),
        millisecond = date.getMilliseconds(),
        cell = F.get(o.cell),
        body;

      if (o.side === 'center') {
        body = me.body;
        year = Number(o.value);
      }
      else {
        body = me.leftBody;
        month = o.rowIndex + o.columnIndex * 6;
      }

      body.el.select('.' + PICKER_MONTH_CELL_ACTIVE_CLS).removeCls(PICKER_MONTH_CELL_ACTIVE_CLS);
      cell.addCls(PICKER_MONTH_CELL_ACTIVE_CLS);

      if (_date > 28) {
        _date = 1;
      }

      me.showDate = new Date(year, month, _date, hour, minute, second, millisecond);
      me.date = me.showDate;

      me.fire('changedate', me.date);
    },
    /*
     * @param {Object} e
     */
    onMouseWheel: function (e) {
      var delta = F.getWheelDelta(e.originalEvent || e);

      if (delta < 0) {
        this.onBackClick();
      }
      else {
        this.onNextClick();
      }
    },
    /*
     *
     */
    onDateClick: function () {
      this.initMonthPicker();
    }
  });

})();
/*
 * @class Fancy.spark.ProgressDonut
 */
Fancy.define('Fancy.spark.ProgressDonut', {
  svgns: 'http://www.w3.org/2000/svg',
  sum: 100,
  prefix: 'fancy-spark-progress-donut-',
  /*
   * @constructor
   * @param {Object} o
   */
  constructor: function(o){
    var me = this;

    Fancy.apply(me, o);
    
    me.init();
  },
  /*
   *
   */
  init: function(){
    var me = this;

    me.initId();
    me.initChart();    
    me.setSize();
    me.setRadius();
    me.setInnerRadius();
    me.setParams();
    
    me.iniColors();
    
    me.preRender();    
    me.render();

    if( me.inited !== true ) {
      me.renderTo.appendChild(me.chart);
      me.ons();
    }
  },
  /**
   * generate unique id for class
   */
  initId: function(){
    var me = this,
      prefix = me.prefix || Fancy.prefix;

    me.id = me.id || Fancy.id(null, prefix);

    Fancy.addWidget(me.id, me);
  },
  /*
   *
   */
  ons: function(){
    var me = this;

    me.el.on('mouseenter', me.onMouseEnter, me);
    me.el.on('mouseleave', me.onMouseLeave, me);
    me.el.on('mousemove', me.onMouseMove, me);
  },
  /*
   * @param {Object} e
   */
  onMouseEnter: function(e){
    var me = this,
      value = me.el.attr('value');

    if(me.tipTpl){
      var tpl = new Fancy.Template(me.tipTpl);
      value = tpl.getHTML({
        value: value
      });
    }

    me.tooltip = new Fancy.ToolTip({
      text: '<span style="color: '+me.color+';">●</span> ' + value
    });
  },
  /*
   * @param {Object} e
   */
  onMouseLeave: function(e){
    var me = this;

    me.tooltip.destroy();
  },
  /*
   * @param {Object} e
   */
  onMouseMove:  function(e){
    var me = this;

    //Fix IE 9-10 bug
    if(!me.tooltip){
      return;
    }

    me.tooltip.css('display', 'block');
    me.tooltip.show(e.pageX + 15, e.pageY - 25);
  },
  /*
   *
   */
  iniColors: function(){
    var me = this;
    
    if(me.value < 0){
      me.backColor = '#F9DDE0';
      me.color = '#EA7369';
    }
    else{
      me.backColor = '#eee';
      me.color = '#44A4D3';
    }
  },
  /*
   *
   */
  preRender: function(){
    var me = this,
      size = me.size,
      chart = me.chart;
      
    chart.setAttribute('width', size);
    chart.setAttribute('height', size);
    chart.setAttribute('viewBox', '0 0 ' + size + ' ' + size);
  },
  /*
   *
   */
  render: function(){
    var me = this;
    
    //render 100% progress
    me.renderBack();
    
    //render progress
    me.renderProgress();
  },
  /*
   *
   */
  renderBack: function(){
    //render 100% progress
    var me = this,
      radius = me.radius,
      innerRadius = me.innerRadius,
      d = [
        'M', me.cx, me.y1,
        'A', radius, radius, 0, 1, 1, me.x2, me.y1,
        'L', me.x2, me.y2,
        'A', innerRadius, innerRadius, 0, 1, 0, me.cx, me.y2
      ].join(' '),
      path = document.createElementNS(me.svgns, "path");
    
    path.setAttribute('d', d);
    path.setAttribute('fill', me.backColor);

    me.chart.appendChild(path);
  },
  /*
   *
   */
  renderProgress: function(){
    //render progress
    var me = this,
      radius = me.radius,
      innerRadius = me.innerRadius,
      path = document.createElementNS(me.svgns, "path"),
      value = me.value,
      cumulative = 0;
      
    if(value > 99){
      value = 99.99999
    }
    
    if(value < -99){
      value = 99.99999
    }
    
    if(value < 0){
      cumulative = 100 + value;
      value *= -1;
    }
    
    var portion = value / me.sum,
      cumulativePlusValue = cumulative + value;
    
    var d = ['M'].concat(
      me.scale(cumulative, radius),
      'A', radius, radius, 0, portion > 0.5 ? 1 : 0, 1,
      me.scale(cumulativePlusValue, radius),
      'L'
    );
    
    if (innerRadius) {
      d = d.concat(
        me.scale(cumulativePlusValue, innerRadius),
        'A', innerRadius, innerRadius, 0, portion > 0.5 ? 1 : 0, 0,
        me.scale(cumulative, innerRadius)
      )
    }
    else{
      d.push(cx, cy)
    }
    
    d = d.join(" ");
    
    path.setAttribute('d', d);
    path.setAttribute("fill", me.color);
    
    me.chart.appendChild(path);
  },
  /*
   *
   */
  initChart: function(){
    var me = this,
      el = Fancy.get(me.renderTo);

    me.renderTo = Fancy.get(me.renderTo).dom;

    if(el.select('svg').length === 0) {
       me.chart = document.createElementNS(me.svgns, "svg:svg");
    }
    else{
      me.chart = el.select('svg').dom;
      me.chart.innerHTML = '';
      me.inited = true;
    }

    me.el = Fancy.get(me.chart);
    me.el.attr('id', me.id);
    if(me.value < 1 && me.value > 0){
      me.el.attr('value', me.value.toFixed(1));
    }
    else if(me.value > -1 && me.value < 0){
      me.el.attr('value', me.value.toFixed(1));
    }
    else {
      me.el.attr('value', me.value.toFixed(0));
    }
  },
  /*
   * @param {Number} value
   * @param {Number} radius
   * @return {Object}
   */
  scale: function(value, radius){
    var me = this,
      pi = Math.PI,
      sum = me.sum,   
      radians = value / sum * pi * 2 - pi / 2;

    return [
      radius * Math.cos(radians) + me.cx,
      radius * Math.sin(radians) + me.cy
    ]    
  },
  /*
   * @param {Number} degrees
   * @return {Number}
   */
  radians: function(degrees) {
    return degrees * Math.PI / 180;
  },
  /*
   *
   */
  setSize: function(){
    var me = this;
    
    me.width = me.width || me.height || me.size || 30;
    me.height = me.height || me.width || me.size || 30;
    me.size = me.size || me.height;
  },
  /*
   *
   */
  setRadius: function(){
    var me = this;
    
    me.radius = me.radius || me.height/2;
  },
  /*
   *
   */
  setInnerRadius: function(){
    var me = this;
    
    me.innerRadius = me.innerRadius || me.height/2 - me.height/4;
  },
  /*
   *
   */
  setParams: function(){
    var me = this,
      radius = me.radius,
      innerRadius = me.innerRadius,
      height = me.height,
      width = me.width;
      
    me.cy = height / 2;
    me.y1 = me.cy - radius;
    me.y2 = me.cy - innerRadius;
     
    me.cx = width / 2;
    me.x2 = me.cx - 0.01;
  }
});
/*
 * @class Fancy.spark.GrossLoss
 */
Fancy.define('Fancy.spark.GrossLoss', {
  maxValue: 100,
  tipTpl: '<span style="color: {color};">●</span> {value} {suffix}',
  /*
   * @constructor
   * @param {Object} o
   */
  constructor: function(o){
    Fancy.apply(this, o);
    this.init();
  },
  /*
   *
   */
  init: function(){
    var me = this;

    me.preRender();    
    me.render();

    if( me.inited !== true ) {
      me.ons();
    }
  },
  /*
   *
   */
  ons: function(){
    var me = this;

    me.el.on('mouseenter', me.onMouseEnter, me);
    me.el.on('mouseleave', me.onMouseLeave, me);
    me.el.on('mousemove', me.onMouseMove, me);
  },
  /*
   *
   */
  onMouseEnter: function(){
    var me = this,
      value = me.el.attr('value'),
      color = me.el.css('background-color'),
      suffix = '',
      text;

    if(me.percents){
      suffix = ' %';
    }

    var tpl = new Fancy.Template(me.tipTpl);
    text = tpl.getHTML({
      value: value,
      color: color,
      suffix: suffix
    });

    me.tooltip = new Fancy.ToolTip({
      text: text
    });
  },
  /*
   *
   */
  onMouseLeave: function(){
    this.tooltip.destroy();
  },
  /*
   * @param {Object} e
   */
  onMouseMove:  function(e){
    this.tooltip.el.css('display', 'block');
    this.tooltip.show(e.pageX + 15, e.pageY - 25);
  },
  /*
   *
   */
  preRender: function(){},
  /*
   *
   */
  render: function(){
    var me = this,
      column = me.column,
      width = column.width,
      percent = width / me.maxValue,
      minusBarWidth = 0,
      plusBarWidth = 0,
      value = me.value,
      color = '';

    if(value < 0){
      minusBarWidth = (-value * percent)/2;
      if(me.lossColor){
        color = 'background-color:' + me.lossColor + ';';
      }
      value = '<div class="fancy-grid-grossloss-loss" style="'+color+'width:'+minusBarWidth+'%">&nbsp;</div>';
    }
    else{
      plusBarWidth = (value * percent)/2;
      if(me.grossColor){
        color = 'background-color:' + me.grossColor + ';';
      }
      value = '<div class="fancy-grid-grossloss-gross" style="'+color+'width:'+plusBarWidth+'%">&nbsp;</div>';
    }

    me.renderTo.innerHTML = value;

    if(me.value < 0) {
      me.el = Fancy.get(me.renderTo).select('.fancy-grid-grossloss-loss').item(0);
    }
    else{
      me.el = Fancy.get(me.renderTo).select('.fancy-grid-grossloss-gross').item(0);
    }

    me.el.attr('value', me.value.toFixed(2));
  }
});
/*
 * @class Fancy.spark.ProgressBar
 */
Fancy.define('Fancy.spark.ProgressBar', {
  tipTpl: '{value} {suffix}',
  /*
   * @constructor
   * @param {Object} o
   */
  constructor: function(o){
    var me = this;

    Fancy.apply(me, o);
    
    me.init();
  },
  /*
   *
   */
  init: function(){
    var me = this;

    me.initId();
    me.render();

    if( me.inited !== true ) {
      me.ons();
    }
  },
  /*
   *
   */
  initId: function(){
    var me = this,
      prefix = me.prefix || Fancy.prefix;

    me.id = me.id || Fancy.id(null, prefix);

    Fancy.addWidget(me.id, me);
  },
  /*
   *
   */
  ons: function() {
    var me = this;
    
    if(me.tip !== false){
      me.el.on('mouseenter', me.onMouseEnter, me);
      me.el.on('mouseleave', me.onMouseLeave, me);
      me.el.on('mousemove', me.onMouseMove, me);
    }
  },
  /*
   * @param {Object} e
   */
  onMouseEnter: function(e){
    var me = this,
      value = me.el.attr('value'),
      suffix = '%';

    if(me.percents === false){
      suffix = '';
    }

    var tpl = new Fancy.Template(me.tipTpl),
      text = tpl.getHTML({
        value: value,
        suffix: suffix
      });

    Fancy.tip.update(text);
  },
  /*
   * @param {Object} e
   */
  onMouseLeave: function(e){
    Fancy.tip.hide(1000);
  },
  /*
   * @param {Object} e
   */
  onMouseMove:  function(e){
    Fancy.tip.show(e.pageX + 15, e.pageY - 25);
  },
  /*
   *
   */
  render: function(){
    var me = this,
      column = me.column,
      width = column.width - 18,
      percent = width / me.maxValue,
      barWidth = me.value * percent,
      value,
      attrValue = me.value,
      spark = column.sparkConfig;

    if(me.percents === false){
      attrValue = me.value;
    }
    else {
      if (attrValue < 1) {
        attrValue = me.value.toFixed(1);
      }
      else {
        attrValue = me.value.toFixed(0);
      }
    }

    var inside = '&nbsp;',
      outside = '',
      outSideLeft = '';

    if(spark.label){
      switch(spark.label.type){
        case 'left':
          inside = '<div class="fancy-grid-bar-label" style="float: left;">'+attrValue+'</div>';
          if(barWidth < String(attrValue).length * 7){
            inside = '&nbsp;';
            outside = '<div class="fancy-grid-bar-label-out" style="">'+attrValue+'</div>';
          }
          break;
        case 'right':
          inside = '<div class="fancy-grid-bar-label" style="float: right;">'+attrValue+'</div>';
          if(barWidth < String(attrValue).length * 7){
            inside = '&nbsp;';
            if(spark.align === 'right'){
              outside = '<div class="fancy-grid-bar-label-out-left" style="">'+attrValue+'</div>';
            }
            else{
              outside = '<div class="fancy-grid-bar-label-out" style="">'+attrValue+'</div>';
            }
          }
          break;
        default:
          inside = '<div class="fancy-grid-bar-label" style="float: left;">'+attrValue+'</div>';
          if(barWidth < String(attrValue).length * 7){
            inside = '&nbsp;';
            outSideLeft = '<div class="fancy-grid-bar-label-out-left" style="">'+attrValue+'</div>';
          }
      }
    }

    var _width = 'width:'+(barWidth)+'px;',
      _float = '';

    if(spark.align){
      _float = 'float:' + spark.align + ';';
    }

    value = '<div id="'+me.id+'" value="' + attrValue + '" class="fancy-grid-column-progress-bar" style="' + _width + _float + '">' + inside + '</div>' + outside + outSideLeft;

    me.renderTo.innerHTML = value;
    me.el = Fancy.get(me.renderTo).select('.fancy-grid-column-progress-bar').item(0);

    if(Fancy.isFunction(me.style)){
      var _style = me.style({
        value: me.value,
        column: me.column,
        rowIndex: me.rowIndex,
        data: me.data
      });

      me.el.css(_style)
    }
  },
  /*
   *
   */
  update: function(){
    var me = this,
      column = me.column,
      width = column.width - 18,
      charLength = 10,
      percent = width / me.maxValue,
      value = me.value,
      barWidth = value * percent,
      spark = column.sparkConfig,
      cellInnerEl = me.el.parent();

    me.el.css('width', barWidth);
    me.el.attr('value', value);

    if(spark.label){
      if(spark.label.type === 'right'){
        var labelBar = cellInnerEl.select('.fancy-grid-column-progress-bar'),
          labelEl = cellInnerEl.select('.fancy-grid-bar-label'),
          labelOutEl = cellInnerEl.select('.fancy-grid-bar-label-out');

        if(String(value).length * charLength + 5*2 > barWidth){
          if(labelEl.dom){
            labelBar.update('&nbsp;');
            labelEl.destroy();
          }
          if(!labelOutEl.dom){
            cellInnerEl.append('<div class="fancy-grid-bar-label-out">' + value + '</div>');
          }
          else {
            labelOutEl.update(value);
          }
        }
        else{
          if(!labelEl.dom){
            labelBar.append('<div class="fancy-grid-bar-label" style="float: right;"></div>');
            labelEl = cellInnerEl.select('.fancy-grid-bar-label');
          }

          labelEl.update(value);
          if(labelOutEl.dom){
            labelOutEl.destroy();
          }
        }
      }
      else{
        var labelBar = cellInnerEl.select('.fancy-grid-column-progress-bar'),
          labelEl = cellInnerEl.select('.fancy-grid-bar-label'),
          labelOutLeftEl = cellInnerEl.select('.fancy-grid-bar-label-out-left');

        if(String(value).length * charLength + 5*2 > barWidth){
          if(labelEl.dom){
            labelBar.update('&nbsp;');
            labelEl.destroy();
          }
          if(!labelOutLeftEl.dom){
            cellInnerEl.append('<div class="fancy-grid-bar-label-out-left">' + value + '</div>');
          }
          else {
            labelOutLeftEl.update(value);
          }
        }
        else{
          if(!labelEl.dom){
            labelBar.append('<div class="fancy-grid-bar-label" style="float: left;"></div>');
            labelEl = cellInnerEl.select('.fancy-grid-bar-label');
          }

          labelEl.update(value);
          if(labelOutLeftEl.dom){
            labelOutLeftEl.destroy();
          }
        }
      }
    }
  }
});
/*
 * @class Fancy.spark.HBar
 */
Fancy.define('Fancy.spark.HBar', {
  tipTpl: '{value}',
  maxValue: 100,
  stacked: false,
  fullStack: false,
  /*
   * @constructor
   * @param {Object} o
   */
  constructor: function(o){
    var me = this;

    Fancy.apply(me, o);
    
    me.init();
  },
  /*
   *
   */
  init: function(){
    var me = this;

    me.initId();
    me.render();

    if( me.inited !== true ) {
      me.ons();
    }
  },
  /*
   *
   */
  initId: function(){
    var me = this,
      prefix = me.prefix || Fancy.prefix;

    me.id = me.id || Fancy.id(null, prefix);

    Fancy.addWidget(me.id, me);
  },
  /*
   *
   */
  ons: function() {
    var me = this;
    
    if(me.tip !== false){
      me.el.on('mouseenter', me.onMouseEnter, me, '.fancy-grid-column-h-bar-node');
      me.el.on('mouseleave', me.onMouseLeave, me, '.fancy-grid-column-h-bar-node');
      me.el.on('mousemove', me.onMouseMove, me, '.fancy-grid-column-h-bar-node');
    }
  },
  /*
   * @param {Object} e
   */
  onMouseEnter: function(e){
    var me = this,
      el = Fancy.get(e.target),
      key = el.attr('key'),
      title = el.attr('data-title'),
      value = Number(el.attr('value')),
      percents = Number(el.attr('percents'));

    if(me.tipFormat){
      var config = {
        value: value,
        percents: percents,
        key: key,
        column: me.column,
        data: me.data,
        title: title
      };

      value = me.tipFormat(config);
    }

    var tpl = new Fancy.Template(me.tipTpl),
      text = tpl.getHTML({
        value: value
      });

    Fancy.tip.update(text);
  },
  /*
   * @param {Object} e
   */
  onMouseLeave: function(e){
    Fancy.tip.hide(1000);
  },
  /*
   * @param {Object} e
   */
  onMouseMove:  function(e){
    Fancy.tip.show(e.pageX + 15, e.pageY - 25);
  },
  /*
   *
   */
  render: function(){
    var me = this,
      column = me.column,
      width = column.width - 18,
      widthPercent = width/100,
      fields = column.index,
      totalValue = 0,
      percent,
      value,
      disabled = column.disabled || {},
      lineHeight = '',
      margin = '',
      marginTop = 2,
      i = 0,
      iL = fields.length;

    if(column.fields){
      iL = column.fields.length;
      Fancy.each(column.fields, function (field) {
        var key = column.index + '.' + field;

        if(disabled[key]){
          return;
        }

        totalValue += me.data[column.index][key];
      });
    }
    else{
      Fancy.each(fields, function (key) {
        if(disabled[key]){
          return;
        }

        totalValue += me.data[key];
      });
    }

    if(!me.stacked){
      totalValue = me.maxItemValue;
      lineHeight = 'line-height:' + ((me.height - 1) / fields.length - marginTop) + 'px;';
    }
    else if(!me.fullStack){
      totalValue = me.maxValue;
    }

    percent = totalValue/100;

    i = 0;

    var sparkCls = 'fancy-spark-hbar';

    if(me.stacked){
      sparkCls += ' fancy-spark-stacked ';
    }

    value = '<div id="'+me.id+'" class="' + sparkCls + '">';

    for(;i<iL;i++){
      if(column.fields){
        var key = column.fields[i],
          _value = me.data[column.index][key];
      }
      else{
        var key = fields[i],
          _value = me.data[key];
      }

      var percents = _value/percent,
        columnWidth = percents * widthPercent;

      if(disabled[key]){
        continue;
      }

      if(i !== 0){
        columnWidth--;
      }

      if(!me.stacked){
        if(i === 0){
          margin = 'margin-top:' + (marginTop) + 'px;';
        }
        else{
          margin = 'margin-top:' + marginTop + 'px;';
        }
      }

      if(columnWidth > 0 && columnWidth < 1){
        columnWidth = 2;
      }

      var color = 'background: '+Fancy.COLORS[i] + ';',
        _width = 'width:'+(columnWidth)+';',
        display = '',
        title = 'data-title=""';

      if(columnWidth === 0){
        display = 'display: none;';
      }

      if(me.title){
        title = 'data-title="'+me.title[i]+'" ';
      }

      var _key = 'key="' + key + '" ';
      _value = 'value="' + _value + '" ';
      var _percents = 'percents="' + percents + '" ';

      value += '<div ' + title + _key + _value + _percents + '" class="fancy-grid-column-h-bar-node" style="' + display + _width + color + lineHeight + margin + '">&nbsp;</div>';
    }

    value += '</div>';

    me.renderTo.innerHTML = value;
    me.el = Fancy.get(me.renderTo);
  },
  /*
   * @param {Array} data
   */
  update: function(data){
    var me = this,
      column = me.column,
      width = column.width - 18,
      widthPercent = width/100,
      fields = column.index,
      totalValue = 0,
      percent,
      disabled = column.disabled || {},
      lineHeight,
      marginTop = 2;

    me.data = data;

    var i = 0,
      iL = fields.length,
      dLength = 0;

    if(column.fields){
      iL = column.fields.length;

      Fancy.each(column.fields, function(key){
        if(disabled[column.index + '.' + key]){
          dLength++;
          return;
        }

        totalValue += me.data[column.index][key];
      });
    }
    else{
      Fancy.each(fields, function(key){
        if(disabled[key]){
          dLength++;
          return;
        }

        totalValue += me.data[key];
      });
    }

    if(!me.stacked){
      totalValue = me.maxItemValue;
      lineHeight = (me.height - 1) / (fields.length - dLength) - marginTop;
    }
    else if(!me.fullStack){
      totalValue = me.maxValue;
    }

    percent = totalValue/100;

    i = 0;

    for(;i<iL;i++) {
      if(column.fields){
        var key = column.fields[i],
          _value = me.data[column.index][key];
      }
      else{
        var key = fields[i],
          _value = me.data[key];
      }

      var percents = _value / percent,
        columnWidth = percents * widthPercent,
        item = me.el.select('.fancy-grid-column-h-bar-node[key="' + key + '"]');

      if(column.fields && disabled[column.index + '.' + key]){
        item.css('width', '0px');
        item.hide();
        continue;
      }
      else if(disabled[key]){
        item.css('width', '0px');
        item.hide();
        continue;
      }

      if(i !== 0){
        columnWidth--;
      }

      if(!me.stacked){
        item.css('line-height', lineHeight + 'px');
        if(i === 0){
          item.css('margin-top', (marginTop) + 'px');
        }
        else {
          item.css('margin-top', marginTop + 'px');
        }
      }

      if(columnWidth === 0 || columnWidth === -1){
        item.css('display', 'none');
      }
      else{
        item.css('display', 'block');
      }

      if(columnWidth > 0 && columnWidth < 2){
        columnWidth = 2;
      }

      item.animate({
        duration: 2,
        width: columnWidth
      });
    }
  }
});
/*
 * @class Fancy.ToolTip
 * @extends Fancy.Widget
 */
(function () {
  //SHORTCUTS
  var F = Fancy;

  //CONSTANTS
  var TOOLTIP_CLS = F.TOOLTIP_CLS;
  var TOOLTIP_INNER_CLS = F.TOOLTIP_INNER_CLS;

  F.define('Fancy.ToolTip', {
    extend: F.Widget,
    /*
     * @constructor
     * @param {Object} config
     */
    constructor: function (config) {
      this.Super('const', arguments);
    },
    /*
     *
     */
    init: function () {
      this.initTpl();
      this.render();
    },
    tpl: [
      '<div class="' + TOOLTIP_INNER_CLS + '">{text}</div>'
    ],
    widgetCls: TOOLTIP_CLS,
    cls: '',
    extraCls: '',
    /*
     *
     */
    render: function () {
      var me = this,
        renderTo = F.get(me.renderTo || document.body).dom,
        el = F.get(document.createElement('div'));

      el.addCls(
        F.cls,
        me.widgetCls,
        me.cls,
        me.extraCls
      );

      el.update(me.tpl.getHTML({
        text: me.text
      }));

      me.el = F.get(renderTo.appendChild(el.dom));
    },
    /*
     * @param {Number} x
     * @param {Number} y
     */
    show: function (x, y) {
      var me = this;

      if (me.timeout) {
        clearInterval(me.timeout);
        delete me.timeout;
      }

      if (me.css('display') === 'none') {
        me.css({
          display: 'block'
        });
      }

      me.css({
        left: x,
        top: y
      });
    },
    /*
     * @param {Number} [delay]
     */
    hide: function (delay) {
      var me = this;

      if (me.timeout) {
        clearInterval(me.timeout);
        delete me.timeout;
      }

      if (delay) {
        me.timeout = setTimeout(function () {
          me.el.hide();
        }, delay);
      }
      else {
        me.el.hide();
      }
    },
    /*
     *
     */
    destroy: function () {
      this.el.destroy();
    },
    /*
     * @param {String} html
     */
    update: function (html) {
      this.el.select('.' + TOOLTIP_INNER_CLS).update(html);
    }
  });

  F.tip = {
    update: function (text) {
      F.tip = new F.ToolTip({
        text: text
      });
    },
    show: function (x, y) {
      F.tip = new F.ToolTip({
        text: ' '
      });
      F.tip.show(x, y);
    },
    hide: function () {
      F.tip = new F.ToolTip({
        text: ' '
      });
    }
  };

})();
(function () {
	'use strict';

	/**
	 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
	 *
	 * @codingstandard ftlabs-jsv2
	 * @copyright The Financial Times Limited [All Rights Reserved]
	 * @license MIT License (see LICENSE.txt)
	 */

	/*jslint browser:true, node:true*/
	/*global define, Event, Node*/


	/**
	 * Instantiate fast-clicking listeners on the specified layer.
	 *
	 * @constructor
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	function FastClick(layer, options) {
		var oldOnClick;

		options = options || {};

		/**
		 * Whether a click is currently being tracked.
		 *
		 * @type boolean
		 */
		this.trackingClick = false;


		/**
		 * Timestamp for when click tracking started.
		 *
		 * @type number
		 */
		this.trackingClickStart = 0;


		/**
		 * The element being tracked for a click.
		 *
		 * @type EventTarget
		 */
		this.targetElement = null;


		/**
		 * X-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartX = 0;


		/**
		 * Y-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartY = 0;


		/**
		 * ID of the last touch, retrieved from Touch.identifier.
		 *
		 * @type number
		 */
		this.lastTouchIdentifier = 0;


		/**
		 * Touchmove boundary, beyond which a click will be cancelled.
		 *
		 * @type number
		 */
		this.touchBoundary = options.touchBoundary || 10;


		/**
		 * The FastClick layer.
		 *
		 * @type Element
		 */
		this.layer = layer;

		/**
		 * The minimum time between tap(touchstart and touchend) events
		 *
		 * @type number
		 */
		this.tapDelay = options.tapDelay || 200;

		/**
		 * The maximum time for a tap
		 *
		 * @type number
		 */
		this.tapTimeout = options.tapTimeout || 700;

		if (FastClick.notNeeded(layer)) {
			return;
		}

		// Some old versions of Android don't have Function.prototype.bind
		function bind(method, context) {
			return function() { return method.apply(context, arguments); };
		}


		var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
		var context = this;
		for (var i = 0, l = methods.length; i < l; i++) {
			context[methods[i]] = bind(context[methods[i]], context);
		}

		// Set up event handlers as required
		if (deviceIsAndroid) {
			layer.addEventListener('mouseover', this.onMouse, true);
			layer.addEventListener('mousedown', this.onMouse, true);
			layer.addEventListener('mouseup', this.onMouse, true);
		}

		layer.addEventListener('click', this.onClick, true);
		layer.addEventListener('touchstart', this.onTouchStart, false);
		layer.addEventListener('touchmove', this.onTouchMove, false);
		layer.addEventListener('touchend', this.onTouchEnd, false);
		layer.addEventListener('touchcancel', this.onTouchCancel, false);

		// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
		// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
		// layer when they are cancelled.
		if (!Event.prototype.stopImmediatePropagation) {
			layer.removeEventListener = function(type, callback, capture) {
				var rmv = Node.prototype.removeEventListener;
				if (type === 'click') {
					rmv.call(layer, type, callback.hijacked || callback, capture);
				} else {
					rmv.call(layer, type, callback, capture);
				}
			};

			layer.addEventListener = function(type, callback, capture) {
				var adv = Node.prototype.addEventListener;
				if (type === 'click') {
					adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
						if (!event.propagationStopped) {
							callback(event);
						}
					}), capture);
				} else {
					adv.call(layer, type, callback, capture);
				}
			};
		}

		// If a handler is already declared in the element's onclick attribute, it will be fired before
		// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
		// adding it as listener.
		if (typeof layer.onclick === 'function') {

			// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
			// - the old one won't work if passed to addEventListener directly.
			oldOnClick = layer.onclick;
			layer.addEventListener('click', function(event) {
				oldOnClick(event);
			}, false);
			layer.onclick = null;
		}
	}

	/**
	* Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
	*
	* @type boolean
	*/
	var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;

	/**
	 * Android requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;


	/**
	 * iOS requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;


	/**
	 * iOS 4 requires an exception for select elements.
	 *
	 * @type boolean
	 */
	var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


	/**
	 * iOS 6.0-7.* requires the target element to be manually derived
	 *
	 * @type boolean
	 */
	var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS [6-7]_\d/).test(navigator.userAgent);

	/**
	 * BlackBerry requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

	/**
	 * Determine whether a given element requires a native click.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @return {boolean} Returns true if the element needs a native click
	 */
	FastClick.prototype.needsClick = function(target) {
		switch (target.nodeName.toLowerCase()) {

		// Don't send a synthetic click to disabled inputs (issue #62)
		case 'button':
		case 'select':
		case 'textarea':
			if (target.disabled) {
				return true;
			}

			break;
		case 'input':

			// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
			if ((deviceIsIOS && target.type === 'file') || target.disabled) {
				return true;
			}

			break;
		case 'label':
		case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
		case 'video':
			return true;
		}

		return (/\bneedsclick\b/).test(target.className);
	};


	/**
	 * Determine whether a given element requires a call to focus to simulate click into element.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @return {boolean} Returns true if the element requires a call to focus to simulate native click.
	 */
	FastClick.prototype.needsFocus = function(target) {
		switch (target.nodeName.toLowerCase()) {
		case 'textarea':
			return true;
		case 'select':
			return !deviceIsAndroid;
		case 'input':
			switch (target.type) {
			case 'button':
			case 'checkbox':
			case 'file':
			case 'image':
			case 'radio':
			case 'submit':
				return false;
			}

			// No point in attempting to focus disabled inputs
			return !target.disabled && !target.readOnly;
		default:
			return (/\bneedsfocus\b/).test(target.className);
		}
	};


	/**
	 * Send a click event to the specified element.
	 *
	 * @param {EventTarget|Element} targetElement
	 * @param {Event} event
	 */
	FastClick.prototype.sendClick = function(targetElement, event) {
		var clickEvent, touch;

		// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
		if (document.activeElement && document.activeElement !== targetElement) {
			document.activeElement.blur();
		}

		touch = event.changedTouches[0];

		// Synthesise a click event, with an extra attribute so it can be tracked
		clickEvent = document.createEvent('MouseEvents');
		clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
		clickEvent.forwardedTouchEvent = true;
		targetElement.dispatchEvent(clickEvent);
	};

	FastClick.prototype.determineEventType = function(targetElement) {

		//Issue #159: Android Chrome Select Box does not open with a synthetic click event
		if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
			return 'mousedown';
		}

		return 'click';
	};


	/**
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.focus = function(targetElement) {
		var length;

		// Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
		if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
			length = targetElement.value.length;
			targetElement.setSelectionRange(length, length);
		} else {
			targetElement.focus();
		}
	};


	/**
	 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
	 *
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.updateScrollParent = function(targetElement) {
		var scrollParent, parentElement;

		scrollParent = targetElement.fastClickScrollParent;

		// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
		// target element was moved to another parent.
		if (!scrollParent || !scrollParent.contains(targetElement)) {
			parentElement = targetElement;
			do {
				if (parentElement.scrollHeight > parentElement.offsetHeight) {
					scrollParent = parentElement;
					targetElement.fastClickScrollParent = parentElement;
					break;
				}

				parentElement = parentElement.parentElement;
			} while (parentElement);
		}

		// Always update the scroll top tracker if possible.
		if (scrollParent) {
			scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
		}
	};


	/**
	 * @param {EventTarget} targetElement
	 * @return {Element|EventTarget}
	 */
	FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {

		// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
		if (eventTarget.nodeType === Node.TEXT_NODE) {
			return eventTarget.parentNode;
		}

		return eventTarget;
	};


	/**
	 * On touch start, record the position and scroll offset.
	 *
	 * @param {Event} event
	 * @return {boolean}
	 */
	FastClick.prototype.onTouchStart = function(event) {
		var targetElement, touch, selection;

		// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
		if (event.targetTouches.length > 1) {
			return true;
		}

		targetElement = this.getTargetElementFromEventTarget(event.target);
		touch = event.targetTouches[0];

		if (deviceIsIOS) {

			// Only trusted events will deselect text on iOS (issue #49)
			selection = window.getSelection();
			if (selection.rangeCount && !selection.isCollapsed) {
				return true;
			}

			if (!deviceIsIOS4) {

				// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
				// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
				// with the same identifier as the touch event that previously triggered the click that triggered the alert.
				// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
				// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
				// Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
				// which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
				// random integers, it's safe to to continue if the identifier is 0 here.
				if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
					event.preventDefault();
					return false;
				}

				this.lastTouchIdentifier = touch.identifier;

				// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
				// 1) the user does a fling scroll on the scrollable layer
				// 2) the user stops the fling scroll with another tap
				// then the event.target of the last 'touchend' event will be the element that was under the user's finger
				// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
				// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
				this.updateScrollParent(targetElement);
			}
		}

		this.trackingClick = true;
		this.trackingClickStart = event.timeStamp;
		this.targetElement = targetElement;

		this.touchStartX = touch.pageX;
		this.touchStartY = touch.pageY;

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			event.preventDefault();
		}

		return true;
	};


	/**
	 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
	 *
	 * @param {Event} event
	 * @return {boolean}
	 */
	FastClick.prototype.touchHasMoved = function(event) {
		var touch = event.changedTouches[0], boundary = this.touchBoundary;

		if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
			return true;
		}

		return false;
	};


	/**
	 * Update the last position.
	 *
	 * @param {Event} event
	 * @return {boolean}
	 */
	FastClick.prototype.onTouchMove = function(event) {
		if (!this.trackingClick) {
			return true;
		}

		// If the touch has moved, cancel the click tracking
		if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
			this.trackingClick = false;
			this.targetElement = null;
		}

		return true;
	};


	/**
	 * Attempt to find the labelled control for the given label element.
	 *
	 * @param {EventTarget|HTMLLabelElement} labelElement
	 * @return {Element|null}
	 */
	FastClick.prototype.findControl = function(labelElement) {

		// Fast path for newer browsers supporting the HTML5 control attribute
		if (labelElement.control !== undefined) {
			return labelElement.control;
		}

		// All browsers under test that support touch events also support the HTML5 htmlFor attribute
		if (labelElement.htmlFor) {
			return document.getElementById(labelElement.htmlFor);
		}

		// If no for attribute exists, attempt to retrieve the first labellable descendant element
		// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
		return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
	};


	/**
	 * On touch end, determine whether to send a click event at once.
	 *
	 * @param {Event} event
	 * @return {boolean}
	 */
	FastClick.prototype.onTouchEnd = function(event) {
		var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

		if (!this.trackingClick) {
			return true;
		}

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			this.cancelNextClick = true;
			return true;
		}

		if ((event.timeStamp - this.trackingClickStart) > this.tapTimeout) {
			return true;
		}

		// Reset to prevent wrong click cancel on input (issue #156).
		this.cancelNextClick = false;

		this.lastClickTime = event.timeStamp;

		trackingClickStart = this.trackingClickStart;
		this.trackingClick = false;
		this.trackingClickStart = 0;

		// On some iOS devices, the targetElement supplied with the event is invalid if the layer
		// is performing a transition or scroll, and has to be re-detected manually. Note that
		// for this to function correctly, it must be called *after* the event target is checked!
		// See issue #57; also filed as rdar://13048589 .
		if (deviceIsIOSWithBadTarget) {
			touch = event.changedTouches[0];

			// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
			targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
			targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
		}

		targetTagName = targetElement.tagName.toLowerCase();
		if (targetTagName === 'label') {
			forElement = this.findControl(targetElement);
			if (forElement) {
				this.focus(targetElement);
				if (deviceIsAndroid) {
					return false;
				}

				targetElement = forElement;
			}
		} else if (this.needsFocus(targetElement)) {

			// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
			// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
			if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
				this.targetElement = null;
				return false;
			}

			this.focus(targetElement);
			this.sendClick(targetElement, event);

			// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
			// Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
			if (!deviceIsIOS || targetTagName !== 'select') {
				this.targetElement = null;
				event.preventDefault();
			}

			return false;
		}

		if (deviceIsIOS && !deviceIsIOS4) {

			// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
			// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
			scrollParent = targetElement.fastClickScrollParent;
			if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
				return true;
			}
		}

		// Prevent the actual click from going though - unless the target node is marked as requiring
		// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
		if (!this.needsClick(targetElement)) {
			event.preventDefault();
			this.sendClick(targetElement, event);
		}

		return false;
	};


	/**
	 * On touch cancel, stop tracking the click.
	 *
	 * @return {void}
	 */
	FastClick.prototype.onTouchCancel = function() {
		this.trackingClick = false;
		this.targetElement = null;
	};


	/**
	 * Determine mouse events which should be permitted.
	 *
	 * @param {Event} event
	 * @return {boolean}
	 */
	FastClick.prototype.onMouse = function(event) {

		// If a target element was never set (because a touch event was never fired) allow the event
		if (!this.targetElement) {
			return true;
		}

		if (event.forwardedTouchEvent) {
			return true;
		}

		// Programmatically generated events targeting a specific element should be permitted
		if (!event.cancelable) {
			return true;
		}

		// Derive and check the target element to see whether the mouse event needs to be permitted;
		// unless explicitly enabled, prevent non-touch click events from triggering actions,
		// to prevent ghost/doubleclicks.
		if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

			// Prevent any user-added listeners declared on FastClick element from being fired.
			if (event.stopImmediatePropagation) {
				event.stopImmediatePropagation();
			} else {

				// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
				event.propagationStopped = true;
			}

			// Cancel the event
			event.stopPropagation();
			event.preventDefault();

			return false;
		}

		// If the mouse event is permitted, return true for the action to go through.
		return true;
	};


	/**
	 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
	 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
	 * an actual click which should be permitted.
	 *
	 * @param {Event} event
	 * @return {boolean}
	 */
	FastClick.prototype.onClick = function(event) {
		var permitted;

		// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
		if (this.trackingClick) {
			this.targetElement = null;
			this.trackingClick = false;
			return true;
		}

		// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
		if (event.target.type === 'submit' && event.detail === 0) {
			return true;
		}

		permitted = this.onMouse(event);

		// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
		if (!permitted) {
			this.targetElement = null;
		}

		// If clicks are permitted, return true for the action to go through.
		return permitted;
	};


	/**
	 * Remove all FastClick's event listeners.
	 *
	 * @return {void}
	 */
	FastClick.prototype.destroy = function() {
		var layer = this.layer;

		if (deviceIsAndroid) {
			layer.removeEventListener('mouseover', this.onMouse, true);
			layer.removeEventListener('mousedown', this.onMouse, true);
			layer.removeEventListener('mouseup', this.onMouse, true);
		}

		layer.removeEventListener('click', this.onClick, true);
		layer.removeEventListener('touchstart', this.onTouchStart, false);
		layer.removeEventListener('touchmove', this.onTouchMove, false);
		layer.removeEventListener('touchend', this.onTouchEnd, false);
		layer.removeEventListener('touchcancel', this.onTouchCancel, false);
	};


	/**
	 * Check whether FastClick is needed.
	 *
	 * @param {Element} layer The layer to listen on
	 */
	FastClick.notNeeded = function(layer) {
		var metaViewport;
		var chromeVersion;
		var blackberryVersion;
		var firefoxVersion;

		// Devices that don't support touch don't need FastClick
		if (typeof window.ontouchstart === 'undefined') {
			return true;
		}

		// Chrome version - zero for other browsers
		chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

		if (chromeVersion) {

			if (deviceIsAndroid) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// Chrome 32 and above with width=device-width or less don't need FastClick
					if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}

			// Chrome desktop doesn't need FastClick (issue #15)
			} else {
				return true;
			}
		}

		if (deviceIsBlackBerry10) {
			blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

			// BlackBerry 10.3+ does not require Fastclick library.
			// https://github.com/ftlabs/fastclick/issues/251
			if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// user-scalable=no eliminates click delay.
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// width=device-width (or less than device-width) eliminates click delay.
					if (document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}
			}
		}

		// IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
		if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		// Firefox version - zero for other browsers
		firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

		if (firefoxVersion >= 27) {
			// Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

			metaViewport = document.querySelector('meta[name=viewport]');
			if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
				return true;
			}
		}

		// IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
		// http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
		if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		return false;
	};


	/**
	 * Factory method for creating a FastClick object
	 *
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	FastClick.attach = function(layer, options) {
		return new FastClick(layer, options);
	};


	if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {

		// AMD. Register as an anonymous module.
		define(function() {
			return FastClick;
		});
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = FastClick.attach;
		module.exports.FastClick = FastClick;
	} else {
		window.FastClick = FastClick;
	}
}());
/*
 *
 */
Fancy.enableCompo = function(){
  var doc = document,
    componentsLength = 0,
    components = {},
    interval;

  /*
   * @constructor
   * @param {String} selector
   * @param {Object} o
   */
  Fancy.Component = function (selector, o) {
    componentsLength++;
    components[selector] = o;
  };

  /*
   *
   */
  Fancy.stopWatch = function(){
    clearInterval(interval);
  };

  function findComponent() {
    if (componentsLength === 0) return;

    for (var p in components) {
      var comp = components[p],
        founded = doc.querySelectorAll(p),
        attrPreSelector = comp.appPreSelector ? comp.appPreSelector + '-' : 'data-',
        preSelector = comp.preSelector ? comp.preSelector + '-' : 'fancy-',
        i = 0,
        iL = founded.length,
        j,
        jL;

      if (founded.length === 0) {
        return;
      }

      for (; i < iL; i++) {
        var itemConfig = {},
          item = founded[i],
          id = item.id || 'rand-id-' + (+new Date()),
          attrs = item.attributes;

        j = 0;
        jL = attrs.length;

        //Get values in attributes values
        for (; j < jL; j++) {
          var attr = attrs[j],
            attrName = attr.name,
            attrValue = attr.value;

          if (new RegExp(attrPreSelector).test(attrName)) {
            attrValue = prePareValue(attrValue);

            itemConfig[attrName.replace(attrPreSelector, '')] = attrValue;
          }
        }

        //Get values in innerHTML tags
        (function getValuesInTags() {
          var childs = item.getElementsByTagName('*');

          j = 0;
          jL = childs.length;

          for (; j < jL; j++) {
            var child = childs[j],
              tagName = child.tagName.toLowerCase(),
              name,
              value;

            if (new RegExp(preSelector).test(tagName)) {
              name = tagName.replace(preSelector, '');
              value = prePareValue(child.innerHTML);

              itemConfig[name.replace(attrPreSelector, '')] = value;
            }
          }

        })(item, itemConfig);

        item.outerHTML = '<div id="' + id + '"></div>';
        comp.init(doc.getElementById(id), itemConfig);
      }
    }
  }

  /*
   * @param {String} v
   * @return {String}
   */
  function prePareValue(v) {
    if (/\[/.test(v) || /\{/.test(v)) {
      v = v.replace(/\n/g, '');
      v = (new Function("return " + v + ";")());
    }
    else if (!isNaN(Number(v))) {
      v = Number(v);
    }
    else {
      v = v.replace(/\n/g, '');
    }

    return v;
  }

  findComponent();

  doc.addEventListener("DOMContentLoaded", function() {
    findComponent();
  });

  setTimeout(function(){
    findComponent();
  }, 1);

  interval = setInterval(function(){
    findComponent();
  }, 250);

  Fancy.Component('fancy-grid', {
    preSelector: 'fancy',
    attrPreSelector: 'data',
    init: function (el, config) {
      config.renderTo = el;

      window[el.id] = new FancyGrid(config);
    }
  });

  Fancy.Component('fancy-form', {
    preSelector: 'fancy',
    attrPreSelector: 'data',
    init: function (el, config) {
      config.renderTo = el;

      window[el.id] = new FancyForm(config);
    }
  });

  Fancy.Component('fancy-tab', {
    preSelector: 'fancy',
    attrPreSelector: 'data',
    init: function (el, config) {
      config.renderTo = el;

      window[el.id] = new FancyTab(config);
    }
  });
};
