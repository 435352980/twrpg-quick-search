import React, { FC, CSSProperties } from 'react';
import itemsBg from '@renderer/assets/items_bg.png';
import { tagString } from '@renderer/helper';
import styled from '@emotion/styled';

interface GamePanelProps {
  displayName?: string;
  img?: string;
  imgData?: string;
  desc: string;
  forceMaxWidth?: boolean;
  style?: CSSProperties;
}

const GamePanelRoot = styled.div`
  border-radius: 6px;
  background: url(${itemsBg});
  background-repeat: no-repeat;
  background-size: cover;
  max-width: 424px;
  border: 1px solid black;
  font-size: 1rem;
  div {
    border-radius: 5px;
    border: 1px solid #806600;
    div {
      border: 1px solid #ffcc00;
      border-radius: 4px;
      div {
        border: 1px solid #806600;
        border-radius: 3px;
        div {
          border-radius: 2px;
          padding: 8px;
          color: white;
          background: #122e3c63;
          border: 1px solid #000;
        }
      }
    }
  }
`;

const GamePanel: FC<GamePanelProps> = ({ displayName, imgData, desc, style = null }) => {
  return (
    <GamePanelRoot style={style}>
      <div>
        <div>
          <div>
            <div>
              {displayName && <div style={{ display: 'flex' }}>{tagString(displayName)}</div>}
              {imgData && (
                <>
                  <img src={imgData} />
                  <br />
                </>
              )}
              {tagString(desc)}
            </div>
          </div>
        </div>
      </div>
    </GamePanelRoot>
  );
};

export default GamePanel;
