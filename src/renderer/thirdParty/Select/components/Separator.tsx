import React from 'react';
import styled from '@emotion/styled';
import { LIB_NAME } from '../constants';
import { SelectRenderer } from '../types';

const Separator = function<T>({ props, state, methods }: SelectRenderer<T>) {
  return props.separatorRenderer ? (
    props.separatorRenderer({ props, state, methods })
  ) : (
    <SeparatorComponent className={`${LIB_NAME}-separator`} />
  );
};

const SeparatorComponent = styled.div`
  border-left: 1px solid #ccc;
  width: 1px;
  height: 25px;
  display: block;
`;

export default Separator;
