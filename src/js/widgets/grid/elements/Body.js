/**
 * @class Fancy.Grid
 * @extends Fancy.Widget
 */
Fancy.define('Fancy.grid.Body', {
	extend: Fancy.Widget,
  mixins: [
    Fancy.grid.body.mixin.Updater
  ],
  cls: 'fancy-grid-body',
  cellCls: 'fancy-grid-cell',
  pseudoCellCls: 'fancy-grid-pseudo-cell',
  cellTpl: [
    '<div class="fancy-grid-cell-inner">{cellValue}</div>'
  ],
  cellWrapperTpl: [
    '<div class="fancy-grid-cell-wrapper">',
      '<div class="fancy-grid-cell-inner">{cellValue}</div>',
    '</div>'
  ],
  /*
   * @constructor
   * @param {Object} config
   */
	constructor: function(config){
		var me = this,
			config = config || {};
		
		me.Super('const', arguments);
	},
  /*
   *
   */
	init: function(){
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
  initTpl: function(){
    var me = this;

    me.cellTpl = new Fancy.Template(me.cellTpl);
    me.cellWrapperTpl = new Fancy.Template(me.cellWrapperTpl);
  },
  /*
   *
   */
	ons: function(){
		var me = this,
			w = me.widget,
      id = w.id;
		
		w.on('afterrender', me.onAfterRender, me);

    me.el.on('click', me.onCellClick, me, '.fancy-grid-column[grid="' + id + '"] div.fancy-grid-cell');
    me.el.on('dblclick', me.onCellDblClick, me, '.fancy-grid-column[grid="' + id + '"] div.fancy-grid-cell');
    me.el.on('mouseenter', me.onCellMouseEnter, me, '.fancy-grid-column[grid="' + id + '"] div.fancy-grid-cell');
    me.el.on('mouseleave', me.onCellMouseLeave, me, '.fancy-grid-column[grid="' + id + '"] div.fancy-grid-cell');
    me.el.on('mousedown', me.onCellMouseDown, me, '.fancy-grid-column[grid="' + id + '"] div.fancy-grid-cell');

    me.el.on('mouseenter', me.onColumnMouseEnter, me, '.fancy-grid-column[grid="' + id + '"]');
    me.el.on('mouseleave', me.onColumnMouseLeave, me, '.fancy-grid-column[grid="' + id + '"]');
	},
  /*
   *
   */
	render: function(){
		var me = this,
			w = me.widget,
			renderTo,
			el = Fancy.get(document.createElement('div'));

		el.addClass(me.cls);
    renderTo = w.el.select('.fancy-grid-' + me.side).dom;
		me.el = Fancy.get(renderTo.appendChild(el.dom));
	},
  /*
   *
   */
	onAfterRender: function(){
		var me = this,
      w = me.widget;

    me.update();
    me.setHeight();
	},
  /*
   * @param {Number} scrollLeft
   */
  setColumnsPosition: function(scrollLeft){
    var me = this,
      w = me.widget,
      columns = me.getColumns(),
      i = 0,
      iL = columns.length,
      columnsWidth = 0,
      bodyDomColumns = me.el.select('.fancy-grid-column[grid="' + w.id + '"]'),
      scrollLeft = scrollLeft || me.scrollLeft || 0;

    columnsWidth += scrollLeft;

    for(;i<iL;i++) {
      var column = columns[i],
        columnEl = bodyDomColumns.item(i);

      columnEl.css({
        left: columnsWidth + 'px'
      });

      if(!column.hidden){
        columnsWidth += column.width;
      }
    }
  },
  /*
   * @param {Number} delta
   * @return {Object}
   */
  wheelScroll: function(delta){
    var me = this,
      w = me.widget,
      knobOffSet = w.knobOffSet,
      columnsDom = me.el.select('.fancy-grid-column[grid="' + w.id + '"]');

    if(columnsDom.length === 0){
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
        //newScroll: parseInt(columnsDom.item(0).css('top')) + 30 * delta + knobOffSet,
        deltaScroll: 30 * delta
      };

    for(;i<iL;i++){
      var columnEl = columnsDom.item(i),
        topValue = parseInt(columnEl.css('top')) + 30 * delta;

      if(topValue > 0){
        topValue = 0;
        o.newScroll = 0;
      }
      else if(Math.abs(topValue) > scrollRightPath ){
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
  scroll: function(y, x){
    var me = this,
      w = me.widget,
      columnsDom = me.el.select('.fancy-grid-column[grid="'+ w.id +'"]'),
      i = 0,
      iL = columnsDom.length,
      o = {};

    if(y !== false && y !== null && y !== undefined){
      o.scrollTop = y;
      for(;i<iL;i++){
        var columnEl = columnsDom.item(i);
        columnEl.css('top', -y + 'px');
      }
    }

    if(x !== false && x !== null && x !== undefined){
      o.scrollLeft = x;
      if(w.header) {
        w.header.scroll(x);
      }
      me.scrollLeft = x;
      w.body.setColumnsPosition(x);

      if(me.side === 'center' && w.grouping){
        w.grouping.scrollLeft(x);
      }
    }

    return o;
  },
  /*
   *
   */
  setHeight: function(){
    var me = this,
      w = me.widget,
      height = w.getBodyHeight();

    me.css('height', height + 'px');
  },
  /*
   * @param {Object} e
   */
  onCellClick: function(e){
    var me = this,
      w = me.widget;

    w.fire('cellclick', me.getEventParams(e));
    w.fire('rowclick', me.getEventParams(e));
    w.fire('columnclick', me.getColumnEventParams(e));
    if(w.activated === false){
      w.activated = true;
      w.fire('activate');
    }
  },
  /*
   * @param {Object} e
   */
  onCellDblClick: function(e){
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
  getEventParams: function(e){
    var me = this,
      w = me.widget,
      s = w.store,
      columns = me.getColumns(),
      cell = e.currentTarget,
      cellEl = Fancy.get(e.currentTarget),
      columnEl = cellEl.parent();

    if(cellEl.parent().dom === undefined){
      return false;
    }

    if(s.getLength() === 0){
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

    if(column.smartIndexFn){
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
  getColumnEventParams: function(e){
    var me = this,
      w = me.widget,
      s = w.store,
      cellEl = Fancy.get(e.currentTarget),
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

    if(w.columnClickData){
      config.data = s.getColumnData(column.index, column.smartIndexFn);
    }

    return config;
  },
  /*
   * @param {Object} e
   * @return {Object}
   */
  getColumnHoverEventParams: function(e){
    var me = this,
      w = me.widget,
      columnEl = Fancy.get(e.currentTarget),
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
  getColumns: function(){
    var me = this,
      w = me.widget;

    return w.getColumns(me.side);
  },
  /*
   * @param {Object} e
   */
  onCellMouseEnter: function(e){
    var me = this,
      w = me.widget,
      params = me.getEventParams(e),
      prevCellOver = me.prevCellOver;

    if(Fancy.nojQuery && prevCellOver){
      if(me.fixZeptoBug){
        if(params.rowIndex !== prevCellOver.rowIndex || params.columnIndex !== prevCellOver.columnIndex || params.side !== prevCellOver.side){
          w.fire('cellleave', prevCellOver);
          if(params.rowIndex !== prevCellOver.rowIndex){
            w.fire('rowleave', prevCellOver);
          }
        }
        else{
          //return;
        }
      }
      else{
        //return;
      }
    }

    if(!prevCellOver){
      w.fire('rowenter', params);
    }
    else{
      if(params.rowIndex !== me.prevCellOver.rowIndex){
        w.fire('rowenter', params);
      }
    }

    w.fire('cellenter', params);

    me.prevCellOver = params;
  },
  /*
   * @param {Object} e
   */
  onCellMouseDown: function(e){
    var me = this,
      w = me.widget,
      params = me.getEventParams(e),
      columnParams = {
        e: params.e,
        side: params.side,
        columnDom: Fancy.get(params.cell).parent().dom,
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
  onCellMouseLeave: function(e){
    var me = this,
      w = me.widget,
      params = me.getEventParams(e),
      prevCellOver = me.prevCellOver;

    if(Fancy.nojQuery){
      if(prevCellOver === undefined){
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
  onColumnMouseEnter: function(e){
    var me = this,
      w = me.widget,
      params = me.getColumnHoverEventParams(e),
      prevColumnOver = me.prevColumnOver;

    if(!prevColumnOver){
      w.fire('columnenter', params);
    }
    else if(me.prevCellOver){
      if(params.rowIndex !== me.prevCellOver.rowIndex){
        w.fire('rowenter', params);
      }
    }

    me.prevColumnOver = params;
  },
  /*
   * @param {Object} e
   */
  onColumnMouseLeave: function(e){
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
  getCell: function(row, column){
    var me = this;

    return me.el.select('.fancy-grid-column[index="'+column+'"] .fancy-grid-cell[index="'+row+'"]');
  },
  /*
   * @param {Number} row
   * @param {Number} column
   * @return {HTMLElement}
   */
  getDomCell: function(row, column){
    var me = this,
      w = me.widget;

    return me.el.select('.fancy-grid-column[index="'+column+'"][grid="' + w.id + '"] .fancy-grid-cell[index="'+row+'"]').dom;
  },
  /*
   * @param {Number} index
   * @return {HTMLElement}
   */
  getDomColumn: function(index){
    var me = this,
      w = me.widget;

    return me.el.select('.fancy-grid-column[index="'+index+'"][grid="' + w.id + '"]').dom;
  },
  /*
   *
   */
  destroy: function(){
    var me = this;

    me.el.un('click', me.onCellClick, me, 'div.fancy-grid-cell');
    me.el.un('dblclick', me.onCellDblClick, me, 'div.fancy-grid-cell');
    me.el.un('mouseenter', me.onCellMouseEnter, me, 'div.fancy-grid-cell');
    me.el.un('mouseleave', me.onCellMouseLeave, me, 'div.fancy-grid-cell');
    me.el.un('mousedown', me.onCellMouseDown, me, 'div.fancy-grid-cell');

    me.el.un('mouseenter', me.onColumnMouseEnter, me, 'div.fancy-grid-column');
    me.el.un('mouseleave', me.onColumnMouseLeave, me, 'div.fancy-grid-column');
  },
  hideColumn: function(orderIndex){
    var me = this,
      columns = me.el.select('.fancy-grid-column'),
      column = columns.item(orderIndex),
      columnWidth = parseInt(column.css('width')),
      i = orderIndex + 1,
      iL = columns.length;

    column.hide();

    for(;i<iL;i++){
      var _column = columns.item(i),
        left = parseInt(_column.css('left')) - columnWidth;

      _column.css('left', left);
    }
  },
  showColumn: function(orderIndex){
    var me = this,
      columns = me.el.select('.fancy-grid-column'),
      column = columns.item(orderIndex),
      columnWidth,
      i = orderIndex + 1,
      iL = columns.length;

    column.show();

    columnWidth = parseInt(column.css('width'));

    for(;i<iL;i++){
      var _column = columns.item(i),
        left = parseInt(_column.css('left')) + columnWidth;

      _column.css('left', left);
    }
  },
  removeColumn: function(orderIndex){
    var me = this,
      columns = me.el.select('.fancy-grid-column'),
      column = columns.item(orderIndex),
      columnWidth = parseInt(column.css('width')),
      i = orderIndex + 1,
      iL = columns.length;

    column.destroy();

    for(;i<iL;i++){
      var _column = columns.item(i),
        left = parseInt(_column.css('left')) - columnWidth;

      _column.attr('index', i - 1);
      _column.css('left', left);
    }
  },
  insertColumn: function(index, column){
    var me = this,
      w = me.widget,
      columnCls = w.columnCls,
      _columns = me.getColumns(),
      columns = me.el.select('.' + columnCls),
      width = column.width,
      el = Fancy.get(document.createElement('div')),
      i = index,
      iL = columns.length,
      left = 0;

    var j = 0,
      jL = index;

    for(;j<jL;j++){
      left += _columns[j].width;
    }

    for(;i<iL;i++){
      var _column = columns.item(i),
        left = parseInt(_column.css('left')) + column.width;

      _column.css('left', left);
      _column.attr('index', i + 1);
    }

    el.addClass(columnCls);
    el.attr('grid', w.id);

    if(column.index === '$selected'){
      el.addClass('fancy-grid-cell-select');
    }
    else{
      switch(column.type){
        case 'order':
          el.addClass('fancy-grid-cell-order');
          break;
      }
    }

    if(column.cls){
      el.addClass(column.cls);
    }

    if(column.type === 'text'){
      el.addClass('fancy-grid-column-text');
    }

    el.css({
      width: width + 'px'
    });
    el.attr('index', index);

    if(column.cellAlign){
      el.css('text-align', column.cellAlign);
    }

    if(column.ellipsis === true){
      switch(column.type){
        case 'string':
        case 'text':
        case 'number':
          el.addClass('fancy-grid-column-ellipsis');
          break;
      }
    }

    var scrolled = w.scroller.getScroll();
    el.css('top', -scrolled);

    if(index === 0 && columns.length){
      el.css('left', '0px');
      me.el.dom.insertBefore(el.dom, columns.item(index).dom);
    }
    else if(index !== 0 && columns.length){
      el.css('left', left + 'px');
      me.el.dom.appendChild(el.dom);
    }

    me.checkDomCells();
    me.updateRows(undefined, index);
  }
});