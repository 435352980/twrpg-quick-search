import React, { useState, FC } from 'react';

declare const IMG_BASE_URL: string;
interface GameIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /**
   * 图标名称
   */
  img: string;
  size?: number;
}

const GameIcon: FC<GameIconProps> = ({ img, size = 48, ...props }) => {
  const [imgUrl, setImgUrl] = useState(
    `${IMG_BASE_URL}/${img
      .split(/[\\/]/)
      .pop()
      .replace(/\.(tga|blp)/, '')}.png`,
  );

  return (
    <img src={imgUrl} onError={() => setImgUrl(`${IMG_BASE_URL}/BTNSpy.png`)} {...props}></img>
  );
};

export default GameIcon;
