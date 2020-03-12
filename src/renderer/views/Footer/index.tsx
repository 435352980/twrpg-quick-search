import path from 'path';
import fs from 'fs';

import React, { useEffect, FC, useState, useCallback, useMemo } from 'react';
import { Button, Avatar } from '@material-ui/core';
import { Typography } from '@material-ui/core';

// import QRCode from 'qrcode.react';
import { ipcRenderer, clipboard } from 'electron';
import PrintDialog from '@renderer/components/PrintDialog';
import useSaveFileDrag from '@renderer/hooks/useSaveFileDrag';
import IconImage from '@renderer/components/IconImage';
import CyanTooltip from '@renderer/components/CyanTooltip';
import { getSaveGoods, getAnchor, getSaveFileInfo, getSaveCodes, message } from '@renderer/helper';

import { useStoreState, useStoreActions } from '@renderer/store';
import styled from '@emotion/styled';
// import FolderIcon from '@material-ui/icons/Folder';
import MultiSplit from '../TeamView/MultiSplit';
import AnalysisView from '../TeamView/AnalysisView';

const OperationBtn = styled(Button)`
  ${({ size }) =>
    size === 'small'
      ? `line-height: initial;
  padding: 0;
  min-height: 0;
  margin-bottom: 2px;`
      : ''}
`;

// const FolderAvatar = styled(Avatar)`
//   width: 36px;
//   height: 36px;
//   background-color: #fff;
//   color: #00bcd4;
// `;

const Footer: FC<{ showCalc?: boolean }> = ({ showCalc }) => {
  const local = useStoreState(state => state.app.local);
  const dataHelper = useStoreState(state => state.app.dataHelper);
  const { goodDB, heroDB } = dataHelper;
  // const forceUpdate = useForceUpdate();
  const [forceToggle, setForceToggle] = useState(false);
  const [footerRef, setFooterRef] = useState<HTMLDivElement | null>(null);
  const [dragFile, setDragFile] = useSaveFileDrag(footerRef);
  const war3Path = useStoreState(state => state.app.war3Path);
  const selectedFile = useStoreState(state => state.common.selectedFile);
  const selectedTarget = useStoreState(state => state.common.selectedTarget);

  const setDetailView = useStoreActions(actions => actions.view.setDetailView);
  const setCalcView = useStoreActions(actions => actions.view.setCalcView);

  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showMultiSplit, setShowMultiSplit] = useState(false);

  const isExists =
    war3Path && selectedFile
      ? fs.existsSync(path.join(war3Path, 'twrpg', `${selectedFile}.txt`))
      : false;

  const forceRefresh = useCallback(() => {
    setForceToggle(toggle => !toggle);
    //存档变更时重置底栏
    setDragFile('');
  }, [setForceToggle, setDragFile]);

  useEffect(() => {
    ipcRenderer.on('updateRecords', forceRefresh);
    ipcRenderer.on('insertRecord', forceRefresh);
    return () => {
      ipcRenderer.removeListener('updateRecords', forceRefresh);
      ipcRenderer.removeListener('insertRecord', forceRefresh);
    };
  }, [forceRefresh]);

  const buildItems = useCallback(
    (list: string[], index: number, allCount: number) => {
      if (list && list.length === 0) {
        return null;
      }
      return (
        <React.Fragment key={index}>
          {list.map((name, i) => {
            const good = goodDB.find('name', name.replace(/ x[1-9][0-9]*/, ''));
            return (
              <CyanTooltip key={i} placement="top" title={name}>
                {good ? (
                  <IconImage
                    pointer
                    float="left"
                    size={36}
                    src={good.imgData}
                    onClick={e =>
                      setDetailView({
                        id: good.id,
                        show: true,
                        anchor: getAnchor(e),
                        isGood: true,
                      })
                    }
                  />
                ) : (
                  <IconImage size={36} src={dataHelper.getImgData()} />
                )}
              </CyanTooltip>
            );
          })}
          {index !== allCount - 1 && (
            <IconImage size={36} src={dataHelper.getImgData('BTNBox')} />
            // <FolderAvatar variant="square">
            //   <FolderIcon />
            // </FolderAvatar>
          )}
        </React.Fragment>
      );
    },
    //eslint-disable-next-line
    [goodDB, setDetailView],
  );
  const renderItem = useMemo(() => {
    if (isExists || dragFile) {
      const source =
        dragFile || fs.readFileSync(path.join(war3Path, 'twrpg', `${selectedFile}.txt`)).toString();
      const goodGroupList = getSaveGoods(source);
      const codes = getSaveCodes(source);
      const allIds = goodGroupList
        .flat()
        .map(name => goodDB.find('name', name.replace(/ x[1-9][0-9]*/, ''))?.id)
        .filter(id => id);

      const saveFileInfo = getSaveFileInfo(source, selectedFile);

      if (goodGroupList.length === 0) {
        return (
          <div
            style={{
              height: 72,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <Typography variant="body1" align="center">
              {local.views.footer.thanks}
            </Typography>
          </div>
        );
      }
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <div style={{ display: 'flex', flex: 1, height: '100%' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', height: 72, alignItems: 'center' }}>
              {goodGroupList.map((groupList, index) =>
                buildItems(groupList, index, goodGroupList.length),
              )}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: 72,
              justifyContent: 'space-around',
            }}
          >
            {selectedTarget && showCalc && (
              <>
                <OperationBtn color="primary" size="small" onClick={() => setShowMultiSplit(true)}>
                  {local.views.footer.split}
                </OperationBtn>
                <OperationBtn color="primary" size="small" onClick={() => setShowAnalysis(true)}>
                  {local.views.footer.analysis}
                </OperationBtn>
                <OperationBtn
                  size="small"
                  color="primary"
                  onClick={e =>
                    setCalcView({
                      ids: selectedTarget.targets,
                      haves: allIds,
                      show: true,
                      anchor: getAnchor(e),
                    })
                  }
                >
                  {local.views.footer.calc}
                </OperationBtn>

                <AnalysisView
                  local={local}
                  members={[
                    {
                      name: saveFileInfo.playerName,
                      heroId: (heroDB.find('name', saveFileInfo.heroName as string) || {}).id,
                      panel: [],
                      bag: allIds,
                      target: selectedTarget.targets,
                    },
                  ]}
                  show={showAnalysis}
                  handleClose={() => setShowAnalysis(false)}
                />

                <PrintDialog
                  name={local.views.footer.targetSplit}
                  show={showMultiSplit}
                  onClose={() => setShowMultiSplit(false)}
                >
                  <MultiSplit
                    member={{
                      name: saveFileInfo.playerName || '',
                      heroId: (heroDB.find('name', saveFileInfo.heroName as string) || {}).id,
                      panel: [],
                      bag: allIds,
                      target: selectedTarget.targets,
                    }}
                  />
                </PrintDialog>
              </>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: 72,
              justifyContent: 'center',
            }}
          >
            {codes.length > 0 &&
              codes.map((code, index) => (
                <OperationBtn
                  key={index}
                  size={codes.length > 1 ? 'small' : 'medium'}
                  color="primary"
                  onClick={() => {
                    clipboard.writeText(code);
                    message.success(
                      local.views.footer.getCopySuccessText(
                        selectedFile,
                        codes.length > 1 ? index + 1 : 0,
                      ),
                    );
                  }}
                >
                  {local.views.footer.copy}
                  {codes.length > 1 ? index + 1 : ''}
                </OperationBtn>
              ))}
          </div>
        </div>
      );
    }
    return (
      <div
        style={{
          height: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <Typography variant="body1" align="center">
          {local.views.footer.thanks}
        </Typography>
      </div>
    );
    //eslint-disable-next-line
  }, [
    forceToggle,
    buildItems,
    dragFile,
    isExists,
    selectedFile,
    selectedTarget,
    setCalcView,
    showAnalysis,
    showCalc,
    showMultiSplit,
    war3Path,
  ]);
  return <div ref={ref => setFooterRef(ref)}>{renderItem}</div>;
};

export default Footer;
