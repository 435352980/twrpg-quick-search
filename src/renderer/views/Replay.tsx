import path from 'path';
import { clipboard, nativeImage } from 'electron';
import React, { useEffect, useState, createRef } from 'react';
import { RouteComponentProps } from '@reach/router';
import W3GReplay from 'w3gjs';
import moment from 'moment';
import { Typography, Container, Grid } from '@material-ui/core';
import htmlToImage from 'html-to-image';
import { notification } from 'antd';
import { makeStyles, createStyles } from '@material-ui/styles';
import Footer from './Footer';
import useWindowSize from '@/hooks/useWindowSize';
import ColorBtn from '@/components/ColorBtn';

const useStyles = makeStyles(() =>
  createStyles({
    controlPanel: { height: 48, display: 'flex', justifyContent: 'center', alignItems: 'center' },
    title: { verticalAlign: 'middle', cursor: 'default' },
  }),
);

const Parser = new W3GReplay();

const Replay: React.FC<RouteComponentProps> = () => {
  const classes = useStyles();
  const { innerHeight } = useWindowSize();
  const [chatData, setChatData] = useState<any[]>([]);
  const printRef = createRef<HTMLElement>();

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const onDropReplayFile = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) {
      const file = e.dataTransfer.files[0];

      if (file && (path.extname(file.name) === '.nwg' || path.extname(file.name) === '.w3g')) {
        try {
          const replay = Parser.parse(file.path);
          const playerInfo = replay.players;
          setChatData(
            replay.chat.map(data => {
              const playerConfig = playerInfo.find(player => player.id === data.playerId);
              const color = playerConfig ? playerConfig.color || '#000' : '#000';
              const tempTime = moment.duration(data.timeMS, 'milliseconds');
              const hours = tempTime.hours() >= 10 ? tempTime.hours() : `0${tempTime.hours()}`;
              const minutes =
                tempTime.minutes() >= 10 ? tempTime.minutes() : `0${tempTime.minutes()}`;
              const seconds =
                tempTime.seconds() >= 10 ? tempTime.seconds() : `0${tempTime.seconds()}`;
              return {
                time: `${hours}:${minutes}:${seconds}`,
                player: data.player,
                message: data.message,
                color,
              };
            }),
          );
        } catch (e) {}
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
        <div className={classes.controlPanel}>
          <div>
            <Typography variant="h5" component="span" color="primary" className={classes.title}>
              请拖入录像文件[nwg/w3g](某些录像可能无法解析)
            </Typography>
            {chatData.length > 0 && (
              <ColorBtn
                color="blue"
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
                      notification.success({
                        duration: 1,
                        placement: 'topLeft',
                        //   description: name,
                        message: '聊天记录图已复制至剪切板',
                      });
                    })
                }
              >
                点击复制聊天记录图
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
              {data.player}
            </Typography>
            <Typography component="span" variant="body1">
              {data.message}
            </Typography>
          </Grid>
        ))}
      </Container>
      <Footer />
    </>
  );
};

export default Replay;
