import styled from '@emotion/styled';

const Tag = styled.div`
  display: inline-block;
  text-align: center;
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
`;

export const TagIcon = styled.img`
  width: 64px;
  height: 64px;
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
`;

export const TagText = styled.div`
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
`;

export default Tag;
