import React from 'react';
import styled from '@emotion/styled';

import { LIB_NAME } from '../constants';
import { getByPath } from '../util';
import { SelectRenderer } from '../types';
import Option from './Option';
import Input from './Input';

const Content = function<T>({ props, state, methods }: SelectRenderer<T>) {
  return (
    <ContentComponent
      className={`${LIB_NAME}-content ${
        props.multi ? `${LIB_NAME}-type-multi` : `${LIB_NAME}-type-single`
      }`}
      onClick={event => {
        event.stopPropagation();
        !props.disableContentTrigger && methods.dropDown('open');
      }}
    >
      {props.contentRenderer ? (
        props.contentRenderer({ props, state, methods })
      ) : (
        <React.Fragment>
          {props.multi
            ? state.values &&
              state.values.map(item => (
                <Option
                  key={`${getByPath(item, props.valueField)}${getByPath(item, props.labelField)}`}
                  item={item}
                  state={state}
                  props={props}
                  methods={methods}
                />
              ))
            : state.values &&
              state.values.length > 0 &&
              !state.search &&
              !props.multi && <span>{getByPath(state.values[0], props.labelField)}</span>}
          <Input props={props} methods={methods} state={state} />
        </React.Fragment>
      )}
    </ContentComponent>
  );
};

const ContentComponent = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  overflow: hidden;
`;

export default Content;
