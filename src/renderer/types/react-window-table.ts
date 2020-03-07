declare module 'react-window-table' {
  import React, { CSSProperties } from 'react';

  interface StringTMap<T> {
    [key: string]: T;
  }

  type StringAnyMap = StringTMap<CSSProperties>;

  type ClassNamesProps = {
    CONTAINER?: string;
    HEADER?: string;
    CELL?: string;

    COL_ODD?: string;
    COL_EVEN?: string;
    COL_FIRST?: string;
    COL_LAST?: string;

    ROW_ODD?: string;
    ROW_EVEN?: string;
    ROW_FIRST?: string;
    ROW_LAST?: string;

    SECTION?: string;
    SECTION_TOP?: string;
    SECTION_LEFT?: string;
    SECTION_RIGHT?: string;
    SECTION_BOTTOM?: string;
    SECTION_CENTER?: string;
    SECTION_CENTER_V?: string;
    SECTION_CENTER_H?: string;

    GUIDELINE?: string;
    GUIDELINE_TOP?: string;
    GUIDELINE_LEFT?: string;
    GUIDELINE_RIGHT?: string;
    GUIDELINE_BOTTOM?: string;

    // [key: string]: string | StringAnyMap;
  };

  export type ClassNames = {
    CONTAINER: string;
    HEADER: string;
    CELL: string;

    COL_ODD: string;
    COL_EVEN: string;
    COL_FIRST: string;
    COL_LAST: string;

    ROW_ODD: string;
    ROW_EVEN: string;
    ROW_FIRST: string;
    ROW_LAST: string;

    SECTION: string;
    SECTION_TOP: string;
    SECTION_LEFT: string;
    SECTION_RIGHT: string;
    SECTION_BOTTOM: string;
    SECTION_CENTER: string;
    SECTION_CENTER_V: string;
    SECTION_CENTER_H: string;

    GUIDELINE: string;
    GUIDELINE_TOP: string;
    GUIDELINE_LEFT: string;
    GUIDELINE_RIGHT: string;
    GUIDELINE_BOTTOM: string;

    SCROLL_TOP: string;
    SCROLL_LEFT: string;
    SCROLL_RIGHT: string;
    SCROLL_BOTTOM: string;

    IS_SCROLLING: string;
    IS_NOT_SCROLLING: string;

    [key: string]: string | StringAnyMap;
  };

  type Column<T> = {
    name: string;
    label?: string;
    width?: number;
    ellipsis?: boolean;
    textAlign?: 'left' | 'center' | 'right';
    minWidth?: number;
    getValue?: (columnData: any, rowData: T, context: any) => any;
    header?: (
      columnData: any,
      column: Column<T>,
      selectInfo: { selectedStatus: 'none' | 'all' | 'some' },
    ) => JSX.Element | string | number;
    render?: (
      columnData: any,
      rowData: T,
      cloumnProps: { rowIndex: number; columnIndex: number; style: CSSProperties },
    ) => JSX.Element | string | number;
  };

  type GetChildRowsFunc<T> = (row?: T) => JSX.Element[] | string[];

  enum Selector {
    '[data-row-index]',
    '[data-column-index]',
    '[data-column]',
  }
  type EventTarget<T> = {
    target: HTMLElement;
    rowIndex: number;
    columnIndex: number;
    column: string;
    data: T;
    context: any;
  } | null;
  type EventHandler<T> = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    target: EventTarget<T>,
  ) => void;
  type EventMap<T> = { [selector in Selector | string]: EventHandler<T> };

  type WindowTableProps<T> = {
    scrollTop?: number;
    scrollLeft?: number;
    width?: number;
    height?: number;
    columns?: (string | Column<T>)[];
    columnCount: number;
    columnWidth: number | ((index: number) => number);
    rows?: T[];
    rowCount: number;
    rowHeight: number | ((index: number) => number);
    fixedTopCount?: number;
    fixedLeftCount?: number;
    fixedRightCount?: number;
    fixedBottomCount?: number;
    overscanCount?: number;
    fillerColumn?: 'none' | 'append' | 'stretch' | 'shrink';
    fillerRow?: 'none' | 'append' | 'stretch' | 'shrink';
    /** 스크롤되는 뷰포트 너비가 특정값 이하로 떨어지면 fixedColumn 이 무효화된다. */
    minVisibleScrollViewWidth: number;
    minVisibleScrollViewHeight: number;
    containerStyle?: CSSProperties;
    guideline?: boolean;
    events?: { click?: EventMap<T>; mouseover?: EventMap<T>; mouseout?: EventMap<T> };
    renderHeader?: (columnData: any, column: Column<T>) => JSX.Element | string;
    maxHeight?: number;
    context?: any;
    getChildRows?: GetChildRowsFunc<T>;
    getClassNames?: (props: {
      rowIndex: number;
      columnIndex: number;
      _rowIndex: number;
      _isChildRow: boolean;
    }) => string;
    checkbox?: boolean;
    trackBy?: Function;
    cancelMouseMove?: boolean;
    onSelect?: Function;
    selected?: string[];
    status?: string;
    theme?: ((classNames: ClassNamesProps) => { [key: number]: string | CSSProperties }) | string;
    onColumnResizeEnd?: (props: { name: string; width: number }) => void;
    onVisibleRangeChange?: (props: {
      visibleColumnStartIndex: number;
      visibleColumnStopIndex: number;
      visibleRowStartIndex: number;
      visibleRowStopIndex: number;
    }) => void;
  };
  export const WindowTable: <T extends object | string = {}>(
    props: WindowTableProps<T>,
  ) => JSX.Element;
}
