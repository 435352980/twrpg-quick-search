import styled from '@emotion/styled';

/**
 * 负责响应Table单元格事件
 * 解决一些由于内容大小问不便于触发事件问题
 */
const WrapCell = styled.div<{ pointer?: boolean; padding?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ padding }) => `${padding ? 'padding: 8px;' : ''}`}
  height: 100%;
  width: 100%;
  flex-wrap: wrap;
  ${({ pointer }) => `cursor:${pointer ? 'pointer' : 'default'}`};
`;

export default WrapCell;
