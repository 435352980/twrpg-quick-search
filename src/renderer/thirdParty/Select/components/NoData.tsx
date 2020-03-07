import React from 'react';
import styled from '@emotion/styled';
import { LIB_NAME } from '../constants';
import { SelectRenderer } from '../types';

const NoData = function<T>({ props, state, methods }: SelectRenderer<T>) {
  return props.noDataRenderer ? (
    props.noDataRenderer({ props, state, methods })
  ) : (
    <NoDataComponent className={`${LIB_NAME}-no-data`} color={props.color}>
      {props.noDataLabel}
    </NoDataComponent>
  );
};

const NoDataComponent = styled.div`
  padding: 10px;
  text-align: center;
  color: ${({ color }) => color};
`;

export default NoData;
