import React, { HTMLProps, ImgHTMLAttributes } from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { TypographyProps } from '@material-ui/core/Typography';

interface IconLabelProps {
  /**
   * base64string图标
   */
  icon: string;
  /**
   * 说明文本
   */
  text: string | React.ReactNode;
  /**
   * 根容器单击事件
   */
  onRootClick?: (e: MouseEvent) => void;
  /**
   * 图标单击事件
   */
  onIconClick?: (e: MouseEvent) => void;
  /**
   * 文本单击事件
   */
  onTextClick?: (e: MouseEvent) => void;
  /**
   * 附加到根节点标签的属性
   */
  rootProps?: HTMLProps<HTMLDivElement>;
  /**
   * 附加到图标标签的属性
   */
  iconProps?: ImgHTMLAttributes<HTMLImageElement>;
  /**
   * 附加到文本标签的属性
   */
  textProps?: TypographyProps;
}

const useStyles = makeStyles({
  root: (props: any) => ({
    display: 'inline-block',
    textAlign: 'center',
    cursor: props.onRootClick ? 'pointer' : 'default',
  }),
  img: (props: any) => ({
    width: 64,
    height: 64,
    cursor: props.onIconClick ? 'pointer' : 'default',
  }),
  text: (props: any) => ({ cursor: props.onTextClick ? 'pointer' : 'default' }),
});

const IconLabel: React.FC<IconLabelProps> = ({
  icon,
  text,
  onRootClick,
  onIconClick,
  onTextClick,
  rootProps,
  iconProps,
  textProps,
  // children,
}) => {
  const classes = useStyles({ onRootClick, onIconClick, onTextClick });

  const handleClick = (callback: Function | undefined | null) => (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
    if (callback) {
      callback(e);
    }
  };

  return (
    <div className={classes.root} onClick={handleClick(onRootClick)} {...rootProps}>
      <img
        src={icon}
        className={classes.img}
        onClick={handleClick(onIconClick)}
        {...iconProps}
      ></img>
      <Typography
        variant="body1"
        component="div"
        className={classes.text}
        onClick={handleClick(onTextClick)}
        {...textProps}
      >
        {text}
      </Typography>
    </div>
  );
};

export default IconLabel;
