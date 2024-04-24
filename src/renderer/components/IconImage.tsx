import styled from '@emotion/styled';

const IconImage = styled.img<{ size: number; pointer?: boolean; float?: 'left' | 'right' }>`
  ${({ size }) => `width:${size}px;height:${size}px`};
  ${({ pointer }) => `cursor:${pointer ? 'pointer' : 'inherit'}`};
  ${({ float }) => (float ? `float:${float};` : '')};
  /* vertical-align: sub; */
`;

export default IconImage;
