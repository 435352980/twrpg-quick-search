import React, { useState, KeyboardEvent, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled from '@emotion/styled';
import ClickOutside from './components/ClickOutside';

import Content from './components/Content';
import Dropdown from './components/Dropdown';
import Loading from './components/Loading';
import Clear from './components/Clear';
import Separator from './components/Separator';
import DropdownHandle from './components/DropdownHandle';

import {
  debounce,
  hexToRGBA,
  isEqual,
  getByPath,
  getProp,
  valueExistInSelected,
  isomorphicWindow,
} from './util';
import { LIB_NAME } from './constants';
import { SelectProps, SelectRenderer, SetStateFnArgs, SelectKeyDown } from './types';

export type DropDownComponent<T extends object = {}> = (
  props: React.PropsWithChildren<SelectProps<T>>,
) => JSX.Element;

const usePrevious = function<T>(value: T) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef<T>();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
};

const ReactDropdownSelect = styled.div<{
  disabled?: boolean;
  direction: string;
  color: string;
  noBorder: boolean;
}>`
  position: relative;
  display: flex;
  border: 1px solid #ccc;
  width: 100%;
  border-radius: 2px;
  padding: 2px 5px;
  flex-direction: row;
  direction: ${({ direction }) => direction};
  align-items: center;
  cursor: pointer;
  min-height: 36px;
  ${({ disabled }) =>
    disabled ? 'cursor: not-allowed;pointer-events: none;opacity: 0.3;' : 'pointer-events: all;'};

  ${({ noBorder }) =>
    noBorder
      ? `
     border: none;
                outline: none;
                box-shadow: none;
    `
      : `
      :hover,
  :focus-within {
    border-color: ${({ color }) => color};
  }

  :focus,
  :focus-within {
    outline: 0;
    box-shadow: 0 0 0 3px ${({ color }) => hexToRGBA(color, 0.2)};
  }
    `}
`;

const DropDownSelect = <T extends object | string = {}>(
  props: React.PropsWithRef<SelectProps<T>>,
) => {
  const [dropdown, setDropDown] = useState(false);
  const [values, setValues] = useState(props.values);
  const [search, setSearch] = useState('');
  const [selectBounds, setSelectBounds] = useState<DOMRect | {}>({});
  const [cursor, setCursor] = useState<number | null>(null);
  const [activeCursorItem, setActiveCursorItem] = useState<any>();

  const select = React.useRef<HTMLDivElement>();
  const dropdownRoot = React.useRef(
    typeof document !== 'undefined' && document.createElement('div'),
  );

  const getState = useCallback(
    () => ({
      dropdown,
      values,
      search,
      selectBounds,
      cursor,
      activeCursorItem,
    }),
    [activeCursorItem, cursor, dropdown, search, selectBounds, values],
  );

  const prevState = usePrevious(getState());
  const prevProps = usePrevious(props);

  const searchFn = ({ state, methods }: SelectRenderer<T>) => {
    const { searchBy, valueField } = props;
    const regexp = new RegExp(methods.safeString(state.search), 'i');

    return methods
      .sortBy()
      .filter(item => regexp.test(getByPath(item, searchBy) || getByPath(item, valueField)));
  };

  const handleKeyDownFn = ({ event, state, props, methods, setState }: SelectKeyDown<T>) => {
    const { cursor } = state;
    const escape = event.key === 'Escape';
    const enter = event.key === 'Enter';
    const arrowUp = event.key === 'ArrowUp';
    const arrowDown = event.key === 'ArrowDown';
    const backspace = event.key === 'Backspace';
    const tab = event.key === 'Tab' && !event.shiftKey;
    const shiftTab = event.shiftKey && event.key === 'Tab';

    if ((arrowDown || tab) && cursor === null) {
      return setCursor(0);
    }

    if (arrowUp || arrowDown || shiftTab || tab) {
      event.preventDefault();
    }

    if (escape) {
      methods.dropDown('close');
    }

    if (enter) {
      const currentItem = methods.searchResults()[cursor];
      if (currentItem && !(currentItem as T & { disabled?: boolean }).disabled) {
        if (props.create && valueExistInSelected(state.search, state.values, props)) {
          return null;
        }

        methods.addItem(currentItem);
      }
    }

    if ((arrowDown || tab) && methods.searchResults().length === cursor) {
      return setCursor(0);
    }

    if (arrowDown || tab) {
      setState(prevState => ({
        cursor: prevState.cursor + 1,
      }));
    }

    if ((arrowUp || shiftTab) && cursor > 0) {
      setState(prevState => ({
        cursor: prevState.cursor - 1,
      }));
    }

    if ((arrowUp || shiftTab) && cursor === 0) {
      setState({
        cursor: methods.searchResults().length,
      });
    }

    if (backspace && props.multi && props.backspaceDelete && this.getInputSize() === 0) {
      this.setState({
        values: this.state.values.slice(0, -1),
      });
    }
  };

  const methods = {
    removeItem: (
      event: React.MouseEvent<HTMLElement, MouseEvent> | null,
      item: T,
      close = false,
    ) => {
      const { valueField } = props;
      if (event && close) {
        event.preventDefault();
        event.stopPropagation();
        methods.dropDown('close');
      }
      setValues(
        values.filter(value => getByPath(value, valueField) !== getByPath(item, valueField)),
      );
    },
    dropDown: (
      action: 'toggle' | 'close' | 'open' = 'toggle',
      event?: React.MouseEvent<HTMLElement, MouseEvent> | null,
    ) => {
      //eslint-disable-next-line
      const target = (event && event.target) || (event && (event as any).srcElement);

      if (
        props.portal &&
        !props.closeOnScroll &&
        !props.closeOnSelect &&
        event &&
        target &&
        target.offsetParent &&
        target.offsetParent.classList.contains('react-dropdown-select-dropdown')
      ) {
        return;
      }

      if (props.keepOpen) {
        return setDropDown(true);
      }

      if (action === 'close' && dropdown) {
        const { clearOnBlur } = props;
        select.current.blur();
        setDropDown(false);
        return clearOnBlur && setSearch('');
      }

      if (action === 'open' && !dropdown) {
        return setDropDown(true);
      }

      if (action === 'toggle') {
        select.current.focus();
        return setDropDown(!dropdown);
      }

      return false;
    },
    addItem: (item: T) => {
      const { multi, valueField, clearOnSelect } = props;
      if (multi) {
        if (valueExistInSelected(getByPath(item, valueField), values, props)) {
          return methods.removeItem(null, item, false);
        }
        setValues([...values, item]);
      } else {
        setValues([item]);
        setDropDown(false);
      }

      clearOnSelect && setSearch('');

      return true;
    },
    setSearch: (event: React.ChangeEvent<HTMLInputElement>) => {
      setCursor(null);
      setSearch(event.target.value);
    },
    getInputSize: () => {
      const { placeholder, addPlaceholder } = props;
      if (search) {
        return search.length + (search.match(/[^\x00-\xff]/gi) || []).length;
      }

      if (values.length > 0) {
        return addPlaceholder.length + (addPlaceholder.match(/[^\x00-\xff]/gi) || []).length;
      }

      return placeholder.length + (placeholder.match(/[^\x00-\xff]/gi) || []).length;
    },
    toggleSelectAll: () => {
      return values.length === 0 ? methods.selectAll() : methods.clearAll();
    },
    selectAll: (valuesList: T[] = []) => {
      const { options, onSelectAll } = props;
      onSelectAll();
      const values =
        valuesList.length > 0
          ? valuesList
          : options.filter(option => !(option as T & { disabled?: boolean }).disabled);

      setValues(values);
    },
    clearAll: () => {
      const { onClearAll } = props;
      onClearAll();
      setValues([]);
    },
    searchResults: () => {
      const args = { state: getState(), props, methods };

      return props.searchFn(args) || searchFn(args);
    },
    getSelectRef: () => select.current,
    isSelected: (option: T) => {
      const { valueField } = props;
      return !!values.find(value => getByPath(value, valueField) === getByPath(option, valueField));
    },
    getSelectBounds: () => selectBounds,
    areAllSelected: () =>
      values.length ===
      props.options.filter(option => !(option as T & { disabled?: boolean }).disabled).length,
    handleKeyDown: (event: KeyboardEvent) => {
      const args = {
        event,
        state: getState(),
        props,
        methods,
        setState: (
          setter: (prevState: SetStateFnArgs<T>) => SetStateFnArgs<T> | SetStateFnArgs<T>,
        ) => {
          if (typeof args === 'function') {
            const {
              dropdown,
              values,
              search,
              selectBounds,
              cursor,
              activeCursorItem,
            } = (setter as (prevState: SetStateFnArgs<T>) => SetStateFnArgs<T>)(getState());
            setDropDown(dropdown);
            setValues(values);
            setSearch(search);
            setSelectBounds(selectBounds);
            setCursor(cursor);
            setActiveCursorItem(activeCursorItem);
          } else {
            const {
              dropdown,
              values,
              search,
              selectBounds,
              cursor,
              activeCursorItem,
            } = setter as SetStateFnArgs<T>;
            dropdown !== undefined && setDropDown(dropdown);
            values !== undefined && setDropDown(dropdown);
            search !== undefined && setDropDown(dropdown);
            selectBounds !== undefined && setDropDown(dropdown);
            cursor !== undefined && setDropDown(dropdown);
            activeCursorItem !== undefined && setDropDown(dropdown);
          }
        },
      };

      if (props.handleKeyDownFn) {
        props.handleKeyDownFn(args);
      } else {
        handleKeyDownFn(args);
      }
    },
    activeCursorItem: (activeCursorItem: any) => {
      setActiveCursorItem(activeCursorItem);
    },
    createNew: (search: string) => {
      const { labelField, valueField, onCreateNew } = props;
      const newValue = {
        [labelField]: search,
        [valueField]: search,
      };

      methods.addItem(newValue as T);
      onCreateNew(newValue as T);
      setSearch('');
    },
    sortBy: () => {
      const { sortBy, options } = props;

      if (!sortBy) {
        return options;
      }

      options.sort((a, b) => {
        if (getProp(a, sortBy) < getProp(b, sortBy)) {
          return -1;
        } else if (getProp(a, sortBy) > getProp(b, sortBy)) {
          return 1;
        } else {
          return 0;
        }
      });

      return options;
    },
    safeString: (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
  };

  const renderDropdown = () =>
    props.portal ? (
      createPortal(
        <Dropdown<T> props={props} state={getState()} methods={methods} />,
        dropdownRoot.current,
      )
    ) : (
      <Dropdown<T> props={props} state={getState()} methods={methods} />
    );

  const updateSelectBounds = useCallback(
    () => select.current && setSelectBounds(select.current.getBoundingClientRect()),
    [],
  );

  const onScroll = useCallback(() => {
    if (props.closeOnScroll) {
      methods.dropDown('close');
    }

    updateSelectBounds();
    //eslint-disable-next-line
  }, [props.closeOnScroll, updateSelectBounds]);

  const onDropdownClose = useCallback(() => {
    setCursor(null);
    props.onDropdownClose();
    //eslint-disable-next-line
  }, [props.onDropdownClose]);

  useEffect(() => {
    props.portal && props.portal.appendChild(dropdownRoot.current);
    isomorphicWindow().addEventListener('resize', debounce(updateSelectBounds));
    isomorphicWindow().addEventListener('scroll', debounce(onScroll));

    methods.dropDown('close');

    if (select) {
      updateSelectBounds();
    }
    return () => {
      //eslint-disable-next-line
      props.portal && props.portal.removeChild(dropdownRoot.current);
      isomorphicWindow().removeEventListener(
        'resize',
        debounce(updateSelectBounds, props.debounceDelay),
      );
      isomorphicWindow().removeEventListener('scroll', debounce(onScroll, props.debounceDelay));
    };
    //eslint-disable-next-line
  }, [dropdownRoot.current, onScroll, props.debounceDelay, props.portal, updateSelectBounds]);

  useEffect(() => {
    if (prevProps && prevState) {
      if (!isEqual(prevProps.values, props.values) && isEqual(prevProps.values, prevState.values)) {
        setValues(props.values);
        props.onChange(props.values);
        updateSelectBounds();
      }

      if (prevState.values !== values) {
        props.onChange(values);
        updateSelectBounds();
      }

      if (prevState.search !== search) {
        updateSelectBounds();
      }

      if (prevState.values !== values && props.closeOnSelect) {
        methods.dropDown('close');
      }

      if (prevProps.multi !== props.multi) {
        updateSelectBounds();
      }

      if (prevState.dropdown && prevState.dropdown !== dropdown) {
        onDropdownClose();
      }

      if (!prevState.dropdown && prevState.dropdown !== dropdown) {
        props.onDropdownOpen();
      }
    }
    //eslint-disable-next-line
  }, [
    prevState,
    prevProps,
    props,
    values,
    search,
    dropdown,
    updateSelectBounds,
    // methods,
    onDropdownClose,
  ]);

  return (
    <ClickOutside
      onClickOutside={event => methods.dropDown('close', event)}
      className={`${props.className} ${LIB_NAME}`}
    >
      <ReactDropdownSelect
        noBorder={props.noBorder}
        onKeyDown={methods.handleKeyDown}
        onClick={event => !props.disableContentTrigger && methods.dropDown('open', event as any)}
        onFocus={event => !props.disableContentTrigger && methods.dropDown('open', event as any)}
        tabIndex={props.disabled ? -1 : 0}
        direction={props.direction}
        style={props.style}
        ref={select}
        disabled={props.disabled}
        color={props.color}
        {...props.additionalProps}
      >
        <Content<T> props={props} state={getState()} methods={methods} />

        {(props.name || props.required) && (
          <input
            tabIndex={-1}
            style={{ opacity: 0, width: 0, position: 'absolute' }}
            name={props.name}
            required={props.required}
            pattern={props.pattern}
            value={values.map(value => value[props.labelField]).toString() || []}
            disabled={props.disabled}
          />
        )}

        {props.loading && <Loading<T> props={props} />}

        {props.clearable && <Clear<T> props={props} state={getState()} methods={methods} />}

        {props.separator && <Separator<T> props={props} state={getState()} methods={methods} />}

        {props.dropdownHandle && (
          <div
            onClick={event =>
              props.disableContentTrigger && methods.dropDown('toggle', event as any)
            }
          >
            <DropdownHandle<T>
              // onClick={() => select.current.focus()}
              props={props}
              state={getState()}
              methods={methods}
            />
          </div>
        )}

        {dropdown && !props.disabled && renderDropdown()}
      </ReactDropdownSelect>
    </ClickOutside>
  );
};

DropDownSelect.defaultProps = {
  addPlaceholder: '',
  placeholder: 'Select...',
  values: [],
  options: [],
  multi: false,
  disabled: false,
  searchBy: 'label',
  sortBy: null,
  clearable: false,
  searchable: true,
  dropdownHandle: true,
  separator: false,
  keepOpen: undefined,
  noDataLabel: 'No data',
  createNewLabel: 'add {search}',
  disabledLabel: 'disabled',
  dropdownGap: 5,
  closeOnScroll: false,
  debounceDelay: 0,
  labelField: 'label',
  valueField: 'value',
  color: '#0074D9',
  keepSelectedInList: true,
  closeOnSelect: false,
  clearOnBlur: true,
  clearOnSelect: true,
  dropdownPosition: 'bottom',
  dropdownHeight: '300px',
  autoFocus: false,
  portal: null,
  create: false,
  direction: 'ltr',
  name: null,
  required: false,
  pattern: false,
  onChange: () => undefined,
  onDropdownOpen: () => undefined,
  onDropdownClose: () => undefined,
  onClearAll: () => undefined,
  onSelectAll: () => undefined,
  onCreateNew: () => undefined,
  searchFn: () => undefined,
  handleKeyDownFn: () => undefined,
  additionalProps: null,
  backspaceDelete: true,
};

export default DropDownSelect;
