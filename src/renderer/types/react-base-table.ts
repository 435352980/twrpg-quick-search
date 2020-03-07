declare module 'react-base-table' {
  import React from 'react';

  interface RowRendererProps<T> {
    isScrolling: boolean | undefined;
    cells: React.ReactNode[];
    columns: ColumnProps<T>[];
    rowData: T;
    rowIndex: number;
    depth: number;
  }

  interface HeaderRendererProps<T> {
    columns: ColumnProps<T>[];
    column: ColumnProps<T>;
    columnIndex: number;
    headerIndex: number;
    container: ReactBaseTable<T>;
  }

  interface CellRendererProps<T> {
    cellData: unknown;
    columns: ColumnProps<T>[];
    column: ColumnProps<T>;
    columnIndex: number;
    rowData: T;
    rowIndex: number;
    container: ReactBaseTable<T>;
    isScrolling: boolean | undefined;
  }

  export interface ColumnProps<T> {
    key: string;
    className?: string | ((obj: CallbackObject<T>) => string);
    /** Class name for the column header, could be a callback to return the class name The callback is of the shape of ({ columns, column, columnIndex, headerIndex }) => string */
    headerClassName?: string | ((obj: CallbackObject<T>) => string);
    /** Custom style for the column cell, including the header cells */
    style?: React.CSSProperties;
    /** Title for the column header */
    title?: string;
    /** Data key for the column cell, could be "a.b.c" */
    dataKey?: string;
    /** Custom cell data getter The handler is of the shape of ({ columns, column, columnIndex, rowData, rowIndex }) => node */
    dataGetter?: (obj: Omit<CallbackObject<T>, 'cellData'>) => unknown;
    /** Alignment of the column cell */
    align?: 'left' | 'center' | 'right';
    /** Flex grow style, defaults to 0 */
    flexGrow?: number;
    /** Flex shrink style, defaults to 1 for flexible table and 0 for fixed table */
    flexShrink?: number;
    /** The width of the column, gutter width is not included */
    width: number;
    /** Maximum width of the column, used if the column is resizable */
    maxWidth?: number;
    /** Minimum width of the column, used if the column is resizable */
    minWidth?: number;
    /** Whether the column is frozen and what's the frozen side */
    frozen?: 'left' | 'right' | true | false;
    /** Whether the column is hidden */
    hidden?: boolean;
    /** Whether the column is resizable, defaults to true */
    resizable?: boolean;
    /** Whether the column is sortable, defaults to true */
    sortable?: boolean;
    /** Custom column cell renderer The renderer receives props { cellData, columns, column, columnIndex, rowData, rowIndex, container, isScrolling } */
    cellRenderer?: (props: CellRendererProps<T>) => React.ReactNode;
    /** Custom column header renderer The renderer receives props { columns, column, columnIndex, headerIndex, container } */
    headerRenderer?: React.ReactNode | ((props: HeaderRendererProps<T>) => React.ReactNode);
  }
  export interface CallbackObject<T> {
    cellData: unknown;
    columns: ColumnProps<T>[];
    column: ColumnProps<T>;
    columnIndex: number;
    rowData: T;
    rowIndex: number;
  }
  export class Column<T> extends React.Component<ColumnProps<T>> {}
  export class Alignment extends React.Component<any> {}
  export class FrozenDirection extends React.Component<any> {}
  export type SortOrderProps = {};
  export class SortOrder extends React.Component<SortOrderProps> {
    static ASC: string;
    static DESC: string;
  }
  export class AutoResizer extends React.Component<any> {}
  export class TableHeader extends React.Component<any> {}
  export class TableRow extends React.Component<any> {}

  export const renderElement: any;
  export const normalizeColumns: any;
  export const isObjectEqual: any;
  export const callOrReturn: any;
  export const hasChildren: any;
  export const unflatten: any;
  export const flattenOnKeys: any;
  export const getScrollbarSize: any;
  export const getValue: any;

  export type OnColumnSort<T> = (obj: {
    column: ColumnProps<T>;
    key: string;
    order: string;
  }) => void;

  export type RowEventHandlers<T> = {
    [eventName: string]: (obj: {
      rowData: T;
      rowIndex: number;
      rowKey: string;
      event: React.MouseEvent;
    }) => any;
  };

  export default class ReactBaseTable<T> extends React.Component<{
    /** Prefix for table's inner className */
    classPrefix?: string;
    /** Class name for the table */
    className?: string;
    /** Custom style for the table */
    style?: React.CSSProperties;
    /** A collection of Column */
    children?: React.ReactNode;
    /** Columns for the table */
    columns?: ColumnProps<T>[];
    /** The data for the table */
    data?: T[];
    /** The data be frozen to top, rowIndex is negative and started from -1 */
    frozenData?: any[];
    /** The key field of each data item */
    rowKey?: string | number;
    /** The width of the table */
    width: number;
    /** The height of the table, will be ignored if maxHeight is set */
    height: number;
    /** The max height of the table, the table's height will auto change when data changes, will turns to vertical scroll if reaches the max height */
    maxHeight?: number;
    /** The height of each table row */
    rowHeight?: number;
    /** The height of the table header, set to 0 to hide the header, could be an array to render multi headers. */
    headerHeight?: number | number[];
    /** The height of the table footer */
    footerHeight?: number;
    /** Whether the width of the columns are fixed or flexible */
    fixed?: boolean;
    /** Whether the table is disabled */
    disabled?: boolean;
    /** Custom renderer on top of the table component */
    overlayRenderer?: React.ReactNode;
    /** Custom renderer when the length of data is 0 */
    emptyRenderer?: React.ReactNode;
    /** Custom footer renderer, available only if footerHeight is larger then 0 */
    footerRenderer?: React.ReactNode;
    /** Custom header renderer The renderer receives props { cells, columns, headerIndex } */
    headerRenderer?: React.ReactNode;
    /** Custom row renderer The renderer receives props { isScrolling, cells, columns, rowData, rowIndex, depth } */
    rowRenderer?: (props: RowRendererProps<T>) => React.ReactNode;
    /** Class name for the table header, could be a callback to return the class name The callback is of the shape of ({ columns, headerIndex }) => string */
    headerClassName?:
      | string
      | ((obj: {
          isScrolling: boolean;
          cells: any[];
          columns: any[];
          rowData: T;
          rowIndex: number;
          depth: number;
        }) => string);
    /** Class name for the table row, could be a callback to return the class name The callback is of the shape of ({ columns, rowData, rowIndex }) => string */
    rowClassName?: string | ((obj: { columns: ColumnProps<T>[]; headerIndex: number }) => string);
    /** Extra props applied to header element The handler is of the shape of ({ columns, headerIndex }) object */
    headerProps?:
      | object
      | ((obj: { columns: ColumnProps<T>[]; rowData: T; rowIndex: number }) => string);
    /** Extra props applied to header cell element The handler is of the shape of ({ columns, column, columnIndex, headerIndex }) => object */
    headerCellProps?: object | ((...args: any) => any);
    /** Extra props applied to row element The handler is of the shape of ({ columns, rowData, rowIndex }) => object */
    rowProps?: object | ((...args: any) => any);
    /** Extra props applied to row cell element The handler is of the shape of ({ columns, column, columnIndex, rowData, rowIndex }) => object */
    cellProps?: object | ((...args: any) => any);
    /** Extra props applied to ExpandIcon component The handler is of the shape of ({ rowData, rowIndex, depth, expandable, expanded }) => object */
    expandIconProps?: object | ((...args: any) => any);
    /** The key for the expand column which render the expand icon if the data is a tree */
    expandColumnKey?: string;
    /** Default expanded row keys when initialize the table */
    defaultExpandedRowKeys?: TableRow[];
    /** Controlled expanded row keys */
    expandedRowKeys?: TableRow[];
    /** A callback function when expand or collapse a tree node The handler is of the shape of ({ expanded, rowData, rowIndex, rowKey }) => * */
    onRowExpand?: (...args: any) => any;
    /** A callback function when the expanded row keys changed The handler is of the shape of (expandedRowKeys) => * */
    onExpandedRowsChange?: (...args: any) => any;
    /** The sort state for the table, will be ignored if sortState is set */
    sortBy?: { [column: string]: number };
    /** Multiple columns sort state for the table
    example:
    {
      'column-0': SortOrder.ASC,
      'column-1': SortOrder.DESC,
    } */
    sortState?: any;
    /** A callback function for the header cell click event The handler is of the shape of ({ column, key, order }) => * */
    onColumnSort?: OnColumnSort<T>;
    /** A callback function when resizing the column width The handler is of the shape of ({ column, width }) => * */
    onColumnResize?: (...args: any) => any;
    /** A callback function when resizing the column width ends The handler is of the shape of ({ column, width }) => * */
    onColumnResizeEnd?: (...args: any) => any;
    /** Adds an additional isScrolling parameter to the row renderer. This parameter can be used to show a placeholder row while scrolling. */
    useIsScrolling?: boolean;
    /** Number of rows to render above/below the visible bounds of the list */
    overscanRowCount?: number;
    /** Custom scrollbar size measurement */
    getScrollbarSize?: (...args: any) => any;
    /** A callback function when scrolling the table The handler is of the shape of ({ scrollLeft, scrollTop, horizontalScrollDirection, verticalScrollDirection, scrollUpdateWasRequested }) => *
    scrollLeft and scrollTop are numbers.
    horizontalDirection and verticalDirection are either forward or backward.
    scrollUpdateWasRequested is a boolean. This value is true if the scroll was caused by scrollTo*, and false if it was the result of a user interaction in the browser. */
    onScroll?: (...args: any) => any;
    /** A callback function when scrolling the table within onEndReachedThreshold of the bottom The handler is of the shape of ({ distanceFromEnd }) => * */
    onEndReached?: (...args: any) => any;
    /** Threshold in pixels for calling onEndReached.  */
    onEndReachedThreshold?: number;
    /** A callback function with information about the slice of rows that were just rendered The handler is of the shape of ({ overscanStartIndex, overscanStopIndex, startIndex， stopIndex }) => *  */
    onRowsRendered?: (...args: any) => any;
    /** A callback function when the scrollbar presence state changed The handler is of the shape of ({ size, vertical, horizontal }) => *  */
    onScrollbarPresenceChange?: (...args: any) => any;
    /** A object for the row event handlers Each of the keys is row event name, like onClick, onDoubleClick and etc. Each of the handlers is of the shape of ({ rowData, rowIndex, rowKey, event }) => object */
    rowEventHandlers?: RowEventHandlers<T>;
    /** A object for the custom components, like ExpandIcon and SortIndicator */
    components?: any;
  }> {
    /** Get the DOM node of the table */
    getDOMNode(): HTMLTableElement;

    /** Get the column manager*/
    getColumnManager(): any;

    /** Get internal expandedRowKeys state*/
    getExpandedRowKeys(): any;

    /** Get the expanded state, fallback to normal state if not expandable.*/
    getExpandedState(): any;

    /** Get the total height of all rows, including expanded rows.*/
    getTotalRowsHeight(): any;

    /** Get the total width of all columns.*/
    getTotalColumnsWidth(): any;

    /** Forcefully re-render the inner Grid component.
    Calling forceUpdate on Table may not re-render the inner Grid since it uses shallowCompare as a performance optimization. Use this method if you want to manually trigger a re-render. This may be appropriate if the underlying row data has changed but the row sizes themselves have not.*/
    forceUpdateTable(): any;

    /** Scroll to the specified offset. Useful for animating position changes.*/
    scrollToPosition(offset: object): any;

    /** Scroll to the specified offset vertically.*/
    scrollToTop(scrollTop: number): any;

    /** Scroll to the specified offset horizontally.*/
    scrollToLeft(scrollLeft: number): any;

    /** Scroll to the specified row. By default, the table will scroll as little as possible to ensure the row is visible. You can control the alignment of the row though by specifying an align property. Acceptable values are:
    auto (default) - Scroll as little as possible to ensure the row is visible.
    smart - Same as auto if it is less than one viewport away, or it's the same ascenter.
    center - Center align the row within the table.
    end - Align the row to the bottom side of the table.
    start - Align the row to the top side of the table.*/
    scrollToRow(rowIndex: number, align: string): any;

    /** Set expandedRowKeys manually. This method is available only if expandedRowKeys is uncontrolled. */
    setExpandedRowKeys(expandedRowKeys: TableRow[]): any;
  }
}
