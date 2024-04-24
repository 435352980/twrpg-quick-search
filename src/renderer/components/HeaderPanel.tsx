import React, { FC, CSSProperties } from 'react';
import styled from '@emotion/styled';

const Container = styled.div<{ width: number; height: number }>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  background: #00bcd4;
  color: white;
  display: flex;
`;

const Cell = styled.div<{
  width: number;
  height: number;
  justify?: 'center' | 'start' | 'end';
}>`
  justify-content: ${({ justify = 'center' }) => justify};
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  display: flex;
  font-size: 1rem;
  padding: 0;
  border-right: 2px solid #dedede;
  align-items: center;
  line-height: 1.5;
  font-weight: 400;
`;

interface CellConfig {
  width: number;
  justify?: 'center' | 'start' | 'end';
  label?: string | number;
  render?: () => JSX.Element;
}

interface HeaderPanelProps {
  width: number;
  height: number;
  cells: CellConfig[];
}

const HeaderPanel: FC<HeaderPanelProps> = ({ width, height, cells }) => {
  return (
    <Container width={width} height={height}>
      {cells.map(({ width, label, render }, index) => (
        <Cell key={index} width={width} height={height}>
          {render ? render() : label}
        </Cell>
      ))}
    </Container>
  );
};

export default HeaderPanel;
