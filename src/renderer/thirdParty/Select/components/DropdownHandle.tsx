import React from 'react';
import styled from '@emotion/styled';
import { LIB_NAME } from '../constants';
import { SelectRenderer } from '../types';

const DropdownHandle = function<T>({ props, state, methods }: SelectRenderer<T>) {
  return props.dropdownHandleRenderer ? (
    props.dropdownHandleRenderer({ props, state, methods })
  ) : (
    <DropdownHandleComponent
      tabIndex={-1}
      dropdownOpen={state.dropdown}
      onClick={event =>
        !props.disableContentTrigger &&
        methods.dropDown(state.dropdown ? 'close' : 'open', event as any)
      }
      onKeyPress={event => !props.disableContentTrigger && methods.dropDown('toggle', event as any)}
      onKeyDown={event => !props.disableContentTrigger && methods.dropDown('toggle', event as any)}
      className={`${LIB_NAME}-dropdown-handle`}
      color={props.color}
    >
      <svg fill="currentColor" viewBox="0 0 40 40">
        <path d="M31 26.4q0 .3-.2.5l-1.1 1.2q-.3.2-.6.2t-.5-.2l-8.7-8.8-8.8 8.8q-.2.2-.5.2t-.5-.2l-1.2-1.2q-.2-.2-.2-.5t.2-.5l10.4-10.4q.3-.2.6-.2t.5.2l10.4 10.4q.2.2.2.5z" />
      </svg>
    </DropdownHandleComponent>
  );
};

const DropdownHandleComponent = styled.div<{ dropdownOpen: boolean; color: string }>`
  text-align: center;
  ${({ dropdownOpen }) =>
    dropdownOpen
      ? `
      pointer-events: all;
      transform: rotate(0deg);
      margin: 0px 0 -3px 5px;
      `
      : `
      pointer-events: none;
      margin: 0 0 0 5px;
      transform: rotate(180deg);
      `};
  cursor: pointer;

  svg {
    width: 16px;
    height: 16px;
  }

  :hover {
    path {
      stroke: ${({ color }) => color};
    }
  }

  :focus {
    outline: none;

    path {
      stroke: ${({ color }) => color};
    }
  }
`;

export default DropdownHandle;
