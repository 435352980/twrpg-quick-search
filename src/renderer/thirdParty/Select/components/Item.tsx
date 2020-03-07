import React, { Component } from 'react';
import styled from '@emotion/styled';
import { hexToRGBA, getByPath } from '../util';
import { LIB_NAME } from '../constants';
import { SelectRenderer } from '../types';

class Item<T> extends Component<SelectRenderer<T> & { item: T; itemIndex: number }> {
  item = React.createRef<HTMLSpanElement>();

  componentDidUpdate() {
    if (this.props.state.cursor === this.props.itemIndex) {
      this.item.current &&
        this.item.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  }

  render() {
    const { props, state, methods, item, itemIndex } = this.props;

    if (props.itemRenderer) {
      return props.itemRenderer({ item, itemIndex, props, state, methods });
    }

    if (!props.keepSelectedInList && methods.isSelected(item)) {
      return null;
    }

    return (
      <ItemComponent
        role="option"
        ref={this.item}
        aria-selected={methods.isSelected(item)}
        aria-disabled={(item as T & { disabled?: boolean }).disabled}
        disabled={(item as T & { disabled?: boolean }).disabled}
        aria-label={getByPath(item, props.labelField)}
        key={`${getByPath(item, props.valueField)}${getByPath(item, props.labelField)}`}
        tabIndex={-1}
        className={`${LIB_NAME}-item ${
          methods.isSelected(item) ? `${LIB_NAME}-item-selected` : ''
        } ${state.cursor === itemIndex ? `${LIB_NAME}-item-active` : ''} ${
          (item as T & { disabled?: boolean }).disabled ? `${LIB_NAME}-item-disabled` : ''
        }`}
        onClick={
          (item as T & { disabled?: boolean }).disabled ? undefined : () => methods.addItem(item)
        }
        onKeyPress={
          (item as T & { disabled?: boolean }).disabled ? undefined : () => methods.addItem(item)
        }
        color={props.color}
      >
        {getByPath(item, props.labelField)}{' '}
        {(item as T & { disabled?: boolean }).disabled && <ins>{props.disabledLabel}</ins>}
      </ItemComponent>
    );
  }
}

const ItemComponent = styled.span<{ disabled: boolean; color: string }>`
  padding: 5px 10px;
  cursor: pointer;
  border-bottom: 1px solid #fff;

  &.${LIB_NAME}-item-active {
    border-bottom: 1px solid #fff;
    ${({ disabled, color }) => !disabled && color && `background: ${hexToRGBA(color, 0.1)};`}
  }

  :hover,
  :focus {
    background: ${({ color }) => color && hexToRGBA(color, 0.1)};
    outline: none;
  }

  &.${LIB_NAME}-item-selected {
    ${({ disabled, color }) =>
      disabled
        ? `
    background: #f2f2f2;
    color: #ccc;
    `
        : `
    background: ${color};
    color: #fff;
    border-bottom: 1px solid #fff;
    `}
  }

  ${({ disabled }) =>
    disabled
      ? `
    background: #f2f2f2;
    color: #ccc;

    ins {
      text-decoration: none;
      border:1px solid #ccc;
      border-radius: 2px;
      padding: 0px 3px;
      font-size: x-small;
      text-transform: uppercase;
    }
    `
      : ''}
`;

export default Item;
