import React from 'react';
import styled from '@emotion/styled';

import { LIB_NAME } from '../constants';
import NoData from '../components/NoData';
import Item from '../components/Item';

import { valueExistInSelected, hexToRGBA, isomorphicWindow } from '../util';
import { DropDownProps, SelectProps, SelectMethods, SelectRenderer } from '../types';

const dropdownPosition = function<T>(
  props: SelectProps<T>,
  methods: SelectMethods<T>,
): 'auto' | 'top' | 'bottom' {
  const DropdownBoundingClientRect = methods.getSelectRef().getBoundingClientRect();
  const dropdownHeight =
    DropdownBoundingClientRect.bottom +
    parseInt(props.dropdownHeight + '', 10) +
    parseInt(props.dropdownGap + '', 10);

  if (props.dropdownPosition !== 'auto') {
    return props.dropdownPosition;
  }

  if (
    dropdownHeight > isomorphicWindow().innerHeight &&
    dropdownHeight > DropdownBoundingClientRect.top
  ) {
    return 'top';
  }

  return 'bottom';
};

const Dropdown = function<T>({ props, state, methods }: SelectRenderer<T>) {
  return (
    <DropDown
      tabIndex={-1}
      aria-expanded="true"
      role="list"
      dropdownPosition={dropdownPosition(props, methods)}
      selectBounds={state.selectBounds as DOMRect}
      portal={props.portal}
      dropdownGap={props.dropdownGap}
      dropdownHeight={props.dropdownHeight}
      className={`${LIB_NAME}-dropdown ${LIB_NAME}-dropdown-position-${dropdownPosition(
        props,
        methods,
      )}`}
    >
      {props.dropdownRenderer ? (
        props.dropdownRenderer({ props, state, methods })
      ) : (
        <React.Fragment>
          {props.create &&
            state.search &&
            !valueExistInSelected(state.search, state.values, props) && (
              <AddNew
                className={`${LIB_NAME}-dropdown-add-new`}
                color={props.color}
                onClick={() => methods.createNew(state.search)}
              >
                {props.createNewLabel.replace('{search}', `"${state.search}"`)}
              </AddNew>
            )}
          {methods.searchResults().length === 0 ? (
            <NoData state={state} props={props} methods={methods} />
          ) : (
            methods
              .searchResults()
              .map((item, itemIndex) => (
                <Item
                  key={item[props.valueField]}
                  item={item}
                  itemIndex={itemIndex}
                  state={state}
                  props={props}
                  methods={methods}
                />
              ))
          )}
        </React.Fragment>
      )}
    </DropDown>
  );
};

const DropDown = styled.div<DropDownProps>`
  position: absolute;
  ${({ selectBounds, dropdownGap, dropdownPosition }) =>
    dropdownPosition === 'top'
      ? `bottom: ${selectBounds.height + 2 + dropdownGap}px`
      : `top: ${selectBounds.height + 2 + dropdownGap}px`};

  ${({ selectBounds, dropdownGap, dropdownPosition, portal }) =>
    portal
      ? `
      position: fixed;
      ${
        dropdownPosition === 'bottom'
          ? `top: ${selectBounds.bottom + dropdownGap}px;`
          : `bottom: ${isomorphicWindow().innerHeight - selectBounds.top + dropdownGap}px;`
      }
      left: ${selectBounds.left - 1}px;`
      : 'left: -1px;'};
  border: 1px solid #ccc;
  width: ${({ selectBounds }) => selectBounds.width}px;
  padding: 0;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 0 10px 0 ${() => hexToRGBA('#000000', 0.2)};
  max-height: ${({ dropdownHeight }) => dropdownHeight};
  overflow: auto;
  z-index: 1300;
  :focus {
    outline: none;
  }
`;

const AddNew = styled.div`
  color: ${({ color }) => color};
  padding: 5px 10px;

  :hover {
    background: ${({ color }) => color && hexToRGBA(color, 0.1)};
    outline: none;
    cursor: pointer;
  }
`;

export default Dropdown;
