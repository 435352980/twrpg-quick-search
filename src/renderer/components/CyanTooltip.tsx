import React from 'react';
import { Tooltip, TooltipProps } from '@material-ui/core';
import styled from '@emotion/styled';

const CyanTooltip = styled(({ className, ...props }) => (
  <Tooltip classes={{ tooltip: className }} {...props} />
))<{ fontSize?: number }>`
  font-weight: 400;
  background-image: linear-gradient(150deg, #6cd0f7 0%, #f3d7d7 103%);
  color: #000;
  width: max-content;
  height: max-content;
  ${({ fontSize }) => `font-size: ${fontSize || 1.2}rem;`}
` as React.ComponentType<TooltipProps & { fontSize?: number }>;

export default CyanTooltip;
