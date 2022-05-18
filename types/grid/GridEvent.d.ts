import GridApi from "./GridApi";

export default interface GridEvent {
  activate?(grid: GridApi): void;
  beforeedit?(grid: GridApi, params: object): void;
  beforeendedit?(grid: GridApi, params: object): void;
  cellclick?(grid: GridApi, params: object): void;
  celldblclick?(grid: GridApi, params: object): void;
  cellenter?(grid: GridApi, params: object): void;
  cellleave?(grid: GridApi, params: object): void;
  change?(grid: GridApi, params: object): void;
  changepage?(grid: GridApi, page: number): void;
  changepagesize?(grid: GridApi, pageSize: number): void;
  columnclick?(grid: GridApi, params: object): void;
  columndblclick?(grid: GridApi, params: object): void;
  columndrag?(grid: GridApi, params: object): void;
  columnenter?(grid: GridApi, params: object): void;
  columnhide?(grid: GridApi, params: object): void;
  columnleave?(grid: GridApi, params: object): void;
  columnshow?(grid: GridApi, params: object): void;
  columnresize?(grid: GridApi, params: object): void;
  columntitlechange?(grid: GridApi, params: object): void;
  contextmenu?(grid: GridApi, params: object): void;
  deactivate?(grid: GridApi): void;
  delay?: number;
  deselectrow?(grid: GridApi, rowIndex: number, dataItem: any): void;
  dragrows?(grid: GridApi, rows: any[]): void;
  dropitems?(grid: GridApi, items: any[], rowIndex: number): void;
  endedit?(grid: GridApi, params: object): void;
  filter?(grid: GridApi, filters: object): void;
  init?(grid: GridApi): void;
  insert?(grid: GridApi, item: object): void;
  headercellclick?(grid: GridApi, params: object): void;
  headercellenter?(grid: GridApi, params: object): void;
  headercellleave?(grid: GridApi, params: object): void;
  load?(grid: GridApi, params: object): void;
  lockcolumn?(grid: GridApi, params: object): void;
  remove?(grid: GridApi, id: number|string, item: any): void;
  rowclick?(grid: GridApi, params: object): void;
  rowdblclick?(grid: GridApi, params: object): void;
  rowenter?(grid: GridApi, params: object): void;
  rowleave?(grid: GridApi, params: object): void;
  scope?: any;
  select?(grid: GridApi, selection: any[]|object): void;
  selectrow?(grid: GridApi, rowIndex: number, dataItem: object): void;
  servererror?(grid: GridApi, errorName: string, error: any, response: any): void;
  set?(grid: GridApi, params: object): void;
  sort?(grid: GridApi, params: object): void;
  startedit?(grid: GridApi, params: object): void;
  statechange?(grid: GridApi, state: object): void;
  unlockcolumn?(grid: GridApi, params: object): void;
  update?(grid: GridApi, params: object): void;
}