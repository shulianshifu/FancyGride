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