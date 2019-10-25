import { makeStyles } from '@material-ui/core';
import { tableStyle, textRed, textAvatorCyan, textAvatorRed, blueTip } from '@/theme/common';

const useStyles = makeStyles({
  //table 基础样式
  table: tableStyle,
  //Table header基础样式
  header: {
    color: 'white',
    fontSize: '0.875rem',
    textAlign: 'center',
    userSelect: 'none',
  },
  //图片样式
  img: {
    width: 48,
  },
  //功能按钮cell样式
  btnsCell: {
    display: 'flex',
    flexDirection: 'column',
  },
  //功能按钮
  operationBtn: {
    color: '#fff',
    padding: 0,
    minHeight: 0,
    marginBottom: 2,
    background: 'linear-gradient(132deg, #68ade2 0, #55b0ff 100%)',
    boxShadow: '0 1px 2px 1px rgba(33, 203, 243, .3)',
  },
  //可点击的单元格
  pointerCell: {
    cursor: 'pointer',
  },
  //单元格红色文本
  redCell: textRed,
  //带下拉列表的单元格
  dropDownCell: {
    padding: '0!important',
    width: '100%',
    '& >div': {
      width: '100%',
    },
  },
  avatorTipTrigger: {
    paddingLeft: 4,
    paddingRight: 4,
  },
  avator: textAvatorCyan,
  avatorRed: textAvatorRed,
  infoTip: {
    ...blueTip,
    minWidth: 350,
    maxWidth: 600,
    color: '#000!important',
  },
  heroLimitTip: {
    ...blueTip,
    maxWidth: 360,
    color: '#000!important',
    '& img': { width: 48, height: 48, margin: 2 },
  },
  overViewTip: { ...blueTip, color: '#000!important' },
});
export default useStyles;
