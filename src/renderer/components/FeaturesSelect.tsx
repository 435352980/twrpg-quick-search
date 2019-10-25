import React, { FC } from 'react';
import Select from 'react-dropdown-select';
import Option from 'react-dropdown-select/lib/components/Option';
import { Typography, ButtonBase } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import goodFieldsConfig from '@/configs/goodFieldsConfig';
import { textAvatorCyan } from '@/theme/common';

interface FeaturesSelectProps {
  onChange: (featureKeys: (keyof Good)[]) => void;
}
interface Option {
  label: string;
  value: string;
}

const useStyles = makeStyles({
  contentText: { fontWeight: 'bold', cursor: 'default', userSelect: 'none' },
  itemsWrapper: { display: 'flex', flexWrap: 'wrap' },
  avatar: {
    ...textAvatorCyan,
    width: 'calc(100%/7)',
    margin: 4,
    backgroundColor: '#ddd',
  },
  selectedAvator: { ...textAvatorCyan, width: 'calc(100%/7)', margin: 4 },
});

const options: Option[] = Object.entries(goodFieldsConfig).map(([featureKey, displayName]) => ({
  label: displayName,
  value: featureKey,
}));

const FeaturesSelect: FC<FeaturesSelectProps> = ({ onChange }) => {
  const classes = useStyles();
  return (
    <Select
      style={{ width: '100%' }}
      multi
      separator
      clearable
      searchable={false}
      portal={document.body}
      placeholder=""
      dropdownHeight="330px"
      values={[]}
      options={options}
      onChange={(values: Option[]) => {
        onChange(values.map(item => item.value) as (keyof Good)[]);
      }}
      contentRenderer={({ props, state, methods }: any) =>
        state.values.length === 0 ? (
          <Typography variant="body2" align="center" className={classes.contentText}>
            选择特性
          </Typography>
        ) : (
          <>
            {state.values.map((item: any) => (
              <Option
                key={`${item[props.valueField]}${item[props.labelField]}`}
                item={item}
                state={state}
                props={props}
                methods={methods}
              />
            ))}
          </>
        )
      }
      dropdownRenderer={({ props, state, methods }: any) => {
        console.log(props, state);
        return (
          <div className={classes.itemsWrapper}>
            {options.map(item => {
              const { addItem, isSelected } = methods;
              const className = isSelected(item) ? classes.selectedAvator : classes.avatar;
              return (
                <ButtonBase
                  key={item.value}
                  className={className}
                  onClick={() => {
                    if (state.values.length < 7 || isSelected(item)) {
                      addItem(item);
                    }
                  }}
                >
                  {item.label}
                </ButtonBase>
              );
            })}
          </div>
        );
      }}
    ></Select>
  );
};

export default FeaturesSelect;
