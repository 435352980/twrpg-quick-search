import React from 'react';
import { Typography } from '@mui/material';
import Select, { DropDownComponent } from '@renderer/thirdParty/Select';
import { useStoreState } from '@renderer/store';
import styled from '@emotion/styled';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import muiGreen from '@mui/material/colors/green';

const HeroDropDown = styled(Select)`
  height: 40px;
  background: #00bcd4;
  color: white;
  user-select: none;
  width: 100%;
  & > div {
    height: 100%;
  }
` as DropDownComponent<{ label: string; value: string }>;

const PlaceHolder = styled(Typography)`
  cursor: default;
  user-select: none;
`;

const SelectedIcon = styled(CheckCircleIcon)`
  position: absolute;
  transform: translate(0%, 80%);
  pointer-events: none;
  background: #fff;
  color: ${muiGreen.A700};
  opacity: 0.9;
`;

const Option = styled.div`
  display: flex;
  flex-direction: column;
  color: #000;
  align-items: center;
  float: left;
  cursor: pointer;
`;

const HeroNameLabel = styled.div`
  width: 64px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
`;
interface HeroSelectProps {
  placeholder: string;
  onChange?: (heroIds: string[]) => void;
  portal?: boolean;
}

const HeroSelect = ({ placeholder, onChange, portal = true }) => {
  const { heroDB } = useStoreState(state => state.app.dataHelper);

  const options = heroDB
    .raw()
    .filter(hero => hero.upro)
    .map(hero => ({ label: hero.name, value: hero.id }));

  return (
    <HeroDropDown
      separator
      clearable
      noBorder
      searchable={false}
      placeholder=""
      dropdownHeight="338px"
      {...(portal ? { portal: document.body } : null)}
      // portal={document.body}
      values={[]}
      options={options}
      contentRenderer={({ props, state, methods }) => {
        const length = state.values.length;
        return (
          <PlaceHolder variant="body1" align="center" noWrap>
            {`${length ? `${placeholder}-${state.values[0].label}` : placeholder}`}
          </PlaceHolder>
        );
      }}
      dropdownRenderer={({ props, state, methods }) => (
        <div>
          {options.map(item => {
            const { addItem, isSelected } = methods;
            const selected = isSelected(item);
            const hero = heroDB.find('id', item.value);
            return (
              <Option key={item.value} onClick={() => addItem(item)}>
                <img alt={hero.name} src={hero.imgData} />
                {selected ? <SelectedIcon /> : null}
                <HeroNameLabel>{item.label}</HeroNameLabel>
              </Option>
            );
          })}
        </div>
      )}
      onChange={values => onChange && onChange(values.map(item => item.value))}
    />
  );
};

export default HeroSelect;
