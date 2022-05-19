import {Column, Defaults} from "./Column";
import Data from "./Data";
import Expander from "./Expander";
import GridToGrid from "./GridToGrid";
import Grouping from "./Grouping";
import Paging from "./Paging";
import SelModel from "./SelModel";
import Summary from "./Summary";
import Panel from "../panel/Panel";
import GridEvent from "./GridEvent";

export default interface GridOptions extends Panel {
  cellHeaderHeight?: number;
  cellHeight?: number;
  cellStylingCls?: any[];
  cellTrackOver?: boolean;
  cellWrapper?: boolean;
  clicksToEdit?: number|boolean;
  columnClickData?: boolean;
  columnLines?: boolean;
  columns?: Column[];
  controllers?: any[];
  columnTrackOver?: boolean;
  contextmenu?: any[];
  data?: any[]|Data;
  defaults?: Defaults;
  dirtyEnabled?: boolean;
  draggable?: boolean;
  doubleHorizontalScroll?: boolean;
  emptyText?: string;
  events?: GridEvent[];
  expander?: Expander;
  exporter?: boolean;
  filter?: boolean|{
    autoEnterDelay?: boolean|number;
    caseSensitive?: boolean;
  };
  flexScrollSensitive?: boolean;
  gridToGrid?: GridToGrid;
  grouping?: boolean|Grouping;
  infinite?: boolean;
  loadMask?: string|boolean;
  minHeight?: number;
  minWidth?: number;
  multiSort?: boolean;
  multiSortLimit?: number;
  nativeScroller?: boolean;
  paging?: boolean|Paging;
  resizable?: boolean;
  rowEdit?: any;
  rowDragDrop?: boolean;
  rowLines?: boolean;
  searching?: any;
  selModel?: 'cell'|'cells'|'row'|'rows'|'column'|'columns'|SelModel;
  singleExpand?: boolean;
  state?: any;
  startEditByTyping?: boolean;
  stateful?: any;
  stateId?: string;
  striped?: boolean;
  summary?: string|Summary;
  textSelection?: boolean;
  trackOver?: boolean;
  type?: string;
}