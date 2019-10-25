import red from '@material-ui/core/colors/red';

/**
 * 全局默认字体
 */
export const fontFamilyStyle = `
"Chinese Quote", 
-apple-system, 
BlinkMacSystemFont, 
"Segoe UI", 
"PingFang SC", 
"Hiragino Sans GB",
"Microsoft YaHei", 
"Helvetica Neue", 
Helvetica, Arial, 
sans-serif, 
"Apple Color Emoji", 
"Segoe UI Emoji",
"Segoe UI Symbol"`;

/**
 * 默认Table样式
 */
export const tableStyle = {
  borderBottom: '1px solid #ddd',
  '& .ReactVirtualized__Grid.ReactVirtualized__Table__Grid': {
    outline: 'none',
  },
  //头部背景
  '& .ReactVirtualized__Table__headerRow': {
    background: '#00bcd4',
  },
  //交替行（高亮）
  '& .ReactVirtualized__Table__row:nth-child(odd)': {
    background: '#f6f7f8',
  },
  //鼠标滑动
  '& .ReactVirtualized__Table__row:hover': {
    background: '#e3f1fd',
  },
  //头部单元格样式
  '& .ReactVirtualized__Table__headerColumn': {
    display: 'flex',
    alignItems: 'center',
    marginRight: 0,
    borderRight: '2px solid #d3d3d3',
    '& >span,>p': {
      flex: 1,
    },
  },
  //tbody单元格样式
  '& .ReactVirtualized__Table__rowColumn': {
    marginRight: 0,
    borderRight: '2px solid #d3d3d3',
    '& p': {
      flex: 1,
    },
  },
  //去除多余margin
  '& .ReactVirtualized__Table__headerColumn:first-of-type,.ReactVirtualized__Table__rowColumn:first-of-type': {
    marginLeft: 0,
  },

  '& .ReactVirtualized__Grid__innerScrollContainer': {
    borderBottom: '1px solid #ddd',
  },
};

/**
 * 图片(中)
 */
export const img48 = {
  width: 48,
};

/**
 * 图片(小)
 */
export const img32 = {
  width: 32,
};

export const textRed = {
  color: red.A400,
};

/**
 * 蓝色导航栏背景
 */
export const blueHeader =
  'repeating-linear-gradient(135deg, #2B3284, #2B3284 10%, #4177BC 10%, #4177BC 17%, #2B3284 17%, #2B3284 27%, #4177BC 27%, #FFFFFF 20%, #4177BC 21%, #4177BC 45%, #FFFFFF 45%, #FFFFFF 45%)';

/**
 * 蓝色提示框
 */
export const blueTip = {
  fontSize: '1rem',
  fontWeight: 400,
  opacity: ('1!important' as unknown) as 1,
  backgroundImage: 'linear-gradient(150deg, #6cd0f7 0%, #f3d7d7 103%)',
};

/**
 * 青色avator
 */
export const textAvatorCyan = {
  width: 48,
  height: 48,
  color: '#616161',
  fontSize: '1rem',
  backgroundColor: '#6fcaddbf',
};

/**
 * 红色avator
 */
export const textAvatorRed = {
  width: 48,
  height: 48,
  color: '#fff',
  fontSize: '1rem',
  backgroundColor: '#f571ae',
};
