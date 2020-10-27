import path from 'path';
import { clipboard, nativeImage } from 'electron';
import React, { useEffect, useState, createRef } from 'react';
import W3GReplay from 'w3gjs';
import { Typography, Container, Grid } from '@material-ui/core';
import htmlToImage from 'html-to-image';

// import Footer from './Footer';
import useWindowSize from '@renderer/hooks/useWindowSize';
import ColorBtn from '@renderer/components/ColorBtn';
import { message, convertMS } from '@renderer/helper';
import { useStoreState } from '@renderer/store';

const Parser = new W3GReplay();

const ReplayView = () => {
  const { innerHeight } = useWindowSize();
  const local = useStoreState(state => state.app.local);
  const [chatData, setChatData] = useState<any[]>([]);
  const [loading, setloading] = useState(false);
  const printRef = createRef<HTMLElement>();

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const onDropReplayFile = async (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) {
      const file = e.dataTransfer.files[0];

      if (file && (path.extname(file.name) === '.nwg' || path.extname(file.name) === '.w3g')) {
        setChatData([]);
        setloading(true);
        try {
          const replay = await Parser.parse(file.path);
          const playerInfo = replay.players;
          setChatData(
            replay.chat.map(data => {
              const playerConfig = playerInfo.find(player => player.id === data.playerId);
              let color = playerConfig ? playerConfig.color || '#000' : '#000';

              if (color?.toLowerCase() === '#ffff00' || color?.toLowerCase() === '#fffc00') {
                // 避免颜色无法分辨
                color = '#D6D60B';
              }
              const tempTime = convertMS(data.timeMS);

              const hours = tempTime.hours >= 10 ? tempTime.hours : `0${tempTime.hours}`;
              const minutes = tempTime.minutes >= 10 ? tempTime.minutes : `0${tempTime.minutes}`;
              const seconds = tempTime.seconds >= 10 ? tempTime.seconds : `0${tempTime.seconds}`;
              return {
                time: `${hours}:${minutes}:${seconds}`,
                playerName: data.playerName,
                message: data.message,
                color,
              };
            }),
          );
          setloading(false);
        } catch (e) {
          setloading(false);
        }
      }
    }
  };

  useEffect(() => {
    document.addEventListener('drop', onDropReplayFile);
    document.addEventListener('dragover', onDragOver);
    return () => {
      document.removeEventListener('drop', onDropReplayFile);
      document.removeEventListener('dragover', onDragOver);
    };
  }, []);

  return (
    <>
      <Container maxWidth="xl">
        <div
          style={{ height: 48, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <div>
            <Typography
              variant="h5"
              component="span"
              color="primary"
              style={{ verticalAlign: 'middle', cursor: 'default' }}
            >
              {loading ? 'Loading...' : local.views.replay.title}
            </Typography>
            {chatData.length > 0 && (
              <ColorBtn
                color="primary"
                onClick={() =>
                  printRef.current &&
                  htmlToImage
                    .toPng(printRef.current, {
                      quality: 1,
                      backgroundColor: 'white',
                      style: { height: '100%', width: 'auto' },
                    })
                    .then(url => {
                      clipboard.writeImage(nativeImage.createFromDataURL(url));
                      message.success(local.views.replay.copySuccess);
                    })
                }
              >
                {local.views.replay.copyToClipboard}
              </ColorBtn>
            )}
          </div>
        </div>
      </Container>
      <Container
        ref={printRef}
        maxWidth="xl"
        style={{ height: innerHeight - 179, overflow: 'auto' }}
      >
        {chatData.map((data, index) => (
          <Grid item key={index}>
            <Typography component="span" variant="body1" style={{ marginRight: 16 }}>
              {`[${data.time}]`}
            </Typography>
            <Typography
              component="span"
              variant="body1"
              style={{ color: data.color, marginRight: 16 }}
            >
              {data.playerName}
            </Typography>
            <Typography component="span" variant="body1">
              {data.message}
            </Typography>
          </Grid>
        ))}
      </Container>
    </>
  );
};

export default ReplayView;
