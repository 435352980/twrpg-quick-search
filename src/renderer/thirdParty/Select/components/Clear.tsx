import React from 'react';
import styled from '@emotion/styled';
import { LIB_NAME } from '../constants';
import { SelectRenderer } from '../types';

const Clear = function<T>({ props, state, methods }: SelectRenderer<T>) {
  return props.clearRenderer ? (
    props.clearRenderer({ props, state, methods })
  ) : (
    <ClearComponent
      className={`${LIB_NAME}-clear`}
      tabIndex={-1}
      onClick={() => methods.clearAll()}
      onKeyPress={() => methods.clearAll()}
    >
      &times;
    </ClearComponent>
  );
};

const ClearComponent = styled.div`
  line-height: 25px;
  margin: 0 10px;
  cursor: pointer;

  :focus {
    outline: none;
  }

  :hover {
    color: tomato;
  }
`;

export default Clear;
