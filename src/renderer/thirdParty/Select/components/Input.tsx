import React, { Component } from 'react';
import styled from '@emotion/styled';
import { valueExistInSelected } from '../util';
import { LIB_NAME } from '../constants';
import { SelectProps, SelectState, SelectRenderer } from '../types';

const handlePlaceHolder = function<T>(props: SelectProps<T>, state: SelectState<T>) {
  const { addPlaceholder, searchable, placeholder } = props;
  const noValues = state.values && state.values.length === 0;
  const hasValues = state.values && state.values.length > 0;

  if (hasValues && addPlaceholder && searchable) {
    return addPlaceholder;
  }

  if (noValues) {
    return placeholder;
  }

  if (hasValues && !searchable) {
    return '';
  }

  return '';
};

class Input<T> extends Component<SelectRenderer<T>> {
  input = React.createRef<HTMLInputElement>();

  componentDidUpdate(prevProps) {
    if (
      this.props.state.dropdown ||
      (prevProps.state.dropdown !== this.props.state.dropdown && this.props.state.dropdown) ||
      this.props.props.autoFocus
    ) {
      this.input.current.focus();
    }

    if (prevProps.state.dropdown !== this.props.state.dropdown && !this.props.state.dropdown) {
      this.input.current.blur();
    }
  }

  onBlur = event => {
    event.stopPropagation();
    if (!this.props.state.dropdown) {
      return this.input.current.blur();
    }

    return this.input.current.focus();
  };

  handleKeyPress = event => {
    const { props, state, methods } = this.props;

    return (
      props.create &&
      event.key === 'Enter' &&
      !valueExistInSelected(state.search, state.values, this.props) &&
      state.search &&
      state.cursor === null &&
      methods.createNew(state.search)
    );
  };

  render() {
    const { props, state, methods } = this.props;

    if (props.inputRenderer) {
      return props.inputRenderer({ props, state, methods, inputRef: this.input });
    }

    return (
      <InputComponent
        ref={this.input}
        tabIndex={-1}
        onFocus={event => event.stopPropagation()}
        className={`${LIB_NAME}-input`}
        size={methods.getInputSize()}
        value={state.search}
        readOnly={!props.searchable}
        onClick={() => methods.dropDown('open')}
        onKeyPress={this.handleKeyPress}
        onChange={methods.setSearch}
        onBlur={this.onBlur}
        placeholder={handlePlaceHolder(props, state)}
        disabled={props.disabled}
      />
    );
  }
}

const InputComponent = styled.input<{ size: number; readOnly: boolean }>`
  line-height: inherit;
  width: calc(${({ size }) => `${size}ch`} + 5px);
  border: none;
  margin-left: 5px;
  background: transparent;
  font-size: smaller;
  ${({ readOnly }) => readOnly && 'cursor: pointer;'} :focus {
    outline: none;
  }
`;

export default Input;
