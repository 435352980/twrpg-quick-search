import React, { FC, CSSProperties } from 'react';
import itemsBg from '@/assets/items_bg.png';
import tagString from '@/lib/tagString';
import { getImage } from '@/db';

interface TipPanelProps {
  displayName?: string;
  img?: string;
  desc: string;
  forceMaxWidth?: boolean;
  style?: CSSProperties;
}

const TipPanel: FC<TipPanelProps> = ({
  displayName,
  img,
  desc,
  forceMaxWidth = false,
  style = null,
}) => {
  const image = img ? getImage(img) : null;

  return (
    <div
      style={{
        borderRadius: 6,
        background: `url(${itemsBg})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        width: 'max-content',
        minWidth: forceMaxWidth ? 424 : 256,
        maxWidth: 424,
        border: '1px solid black',
        ...style,
      }}
    >
      <div
        style={{
          borderRadius: 5,
          border: '1px solid #806600',
        }}
      >
        <div style={{ border: '1px solid #ffcc00', borderRadius: 4 }}>
          <div style={{ border: '1px solid #806600', borderRadius: 3 }}>
            <div
              style={{
                borderRadius: 2,
                padding: 8,
                color: 'white',
                background: '#122e3c63',
                border: '1px solid #000',
              }}
            >
              {/* {item.id} */}
              {displayName && <div style={{ display: 'flex' }}>{tagString(displayName)}</div>}
              {image && (
                <>
                  <img src={image} />
                  <br />
                </>
              )}
              {tagString(desc)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipPanel;
