import React, { FC } from 'react';
import Select, { DropDownComponent } from '@renderer/thirdParty/Select';
import Option from '@renderer/thirdParty/Select/components/Option';
import { Typography, ButtonBase } from '@material-ui/core';
import { Good } from '@renderer/dataHelper/types';
import styled from '@emotion/styled';
import { useStoreState } from '@renderer/store';

interface FeaturesSelectProps {
  onChange: (featureKeys: (keyof Good)[]) => void;
}
interface Option {
  label: string;
  value: keyof Good;
}

const FeatureButton = styled(ButtonBase)<{ selected?: boolean }>`
  width: 48px;
  height: 48px;
  color: #616161;
  font-size: 1rem;
  width: calc(100% / 7);
  margin: 4px;
  background-color: ${({ selected }) => (selected ? '#6fcaddbf' : '#ddd')};
`;

const FeatureDropDown = styled(Select)`
  width: 100%;
  font-size: 1rem;
` as DropDownComponent<Option>;

const PlaceHolder = styled(Typography)`
  cursor: default;
  user-select: none;
`;

const FeaturesSelect: FC<FeaturesSelectProps> = ({ onChange }) => {
  const local = useStoreState(state => state.app.local);
  const options: Option[] = Object.entries(local.common.goodFields).map(
    ([featureKey, displayName]) => ({
      label: displayName,
      value: featureKey as keyof Good,
    }),
  );
  return (
    <FeatureDropDown
      multi
      separator
      clearable
      searchable={false}
      noBorder
      portal={document.body}
      placeholder=""
      dropdownHeight="330px"
      values={[]}
      options={options}
      onChange={values => {
        onChange(values.map(item => item.value));
      }}
      contentRenderer={({ props, state, methods }) =>
        state.values.length === 0 ? (
          <PlaceHolder variant="body1" align="center">
            {local.common.chooseFeature}
          </PlaceHolder>
        ) : (
          <>
            {state.values.map(item => (
              <Option<Option>
                key={`${item.value}${item.label}`}
                item={item}
                state={state}
                props={props}
                methods={methods}
              />
            ))}
          </>
        )
      }
      dropdownRenderer={({ props, state, methods }) => {
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {options.map(item => {
              const { addItem, isSelected } = methods;

              return (
                <FeatureButton
                  key={item.value}
                  selected={isSelected(item)}
                  onClick={() => {
                    if (state.values.length < 7 || isSelected(item)) {
                      addItem(item);
                    }
                  }}
                >
                  {item.label}
                </FeatureButton>
              );
            })}
          </div>
        );
      }}
    />
  );
};

export default FeaturesSelect;
