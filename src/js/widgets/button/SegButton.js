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
    var me = this;

    me.scope = scope;

    me.Super('const', arguments);
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
  widgetCls: 'fancy-seg-button',
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

    el.addClass(Fancy.cls);
    el.addClass(me.widgetCls);
    el.addClass(me.cls);
    el.addClass(me.extraCls);

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