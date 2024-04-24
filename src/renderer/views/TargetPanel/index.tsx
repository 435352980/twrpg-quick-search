import React, { useState, FC } from 'react';
import { useStoreState, useStoreActions } from '@renderer/store';
import Select, { DropDownComponent } from '@renderer/thirdParty/Select';
import { DropResult, DragDropContext } from 'react-beautiful-dnd';
import arrayMove from 'array-move';
import MemoDropList from '@renderer/components/DropList';
import { Good } from '@renderer/dataHelper/types';
import { TextField, Typography, Button, Paper, Grid } from '@mui/material';
import CyanTooltip from '@renderer/components/CyanTooltip';
import IconImage from '@renderer/components/IconImage';
import { ipcRenderer } from 'electron';
import { confirm, getAnchor } from '@renderer/helper';
import styled from '@emotion/styled';
import TargetAddModal from './TargetAddModal';

const TargetSelect = styled(Select)`
  width: calc(100% - 208px);
  .react-dropdown-select-content {
    width: calc(100% - 64px);
    height: 66px;
    align-items: center;
    cursor: grab;
  }
` as DropDownComponent<Target>;

const OptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #eee;
  :hover {
    background-color: #eee;
  }
`;

const TargetPanel: FC<{ disableShow?: boolean }> = ({ disableShow = false }) => {
  const local = useStoreState(state => state.app.local);
  const dataHelper = useStoreState(state => state.app.dataHelper);
  const { goodDB } = dataHelper;
  const cacheIds = useStoreState(state => state.good.cacheIds);
  const showCache = useStoreState(state => state.good.showCache);
  const removeCacheId = useStoreActions(actions => actions.good.removeCacheId);
  const setCacheIds = useStoreActions(actions => actions.good.setCacheIds);
  const setShowCache = useStoreActions(actions => actions.good.setShowCache);

  const targets = useStoreState(state => state.common.targets);
  const selectedTarget = useStoreState(state => state.common.selectedTarget);
  const setSelectedTarget = useStoreActions(actions => actions.common.setSelectedTarget);

  const setDetailView = useStoreActions(actions => actions.view.setDetailView);

  const [showAddModal, setShowAddModal] = useState(false);

  const sourceList = selectedTarget?.targets || cacheIds;
  // console.log(sourceList, cacheIds);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    if (result.destination.index === result.source.index) {
      return;
    }
    const newIds = arrayMove(sourceList, result.source.index, result.destination.index);
    if (!selectedTarget) {
      return setCacheIds(newIds);
    } else {
      setSelectedTarget({ ...selectedTarget, targets: newIds });
      ipcRenderer.send('modifyTarget', { ...selectedTarget, targets: newIds });
    }
  };
  return (
    <Paper elevation={0}>
      <Grid container>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            flex: 1,
          }}
        >
          <Button color="secondary" disabled={!!selectedTarget} onClick={() => setCacheIds([])}>
            {local.views.targetPanel.clearCache}
          </Button>
          <Button
            variant="text"
            color="secondary"
            disabled={!selectedTarget}
            style={{ width: 'max-content' }}
            onClick={() =>
              selectedTarget &&
              confirm(
                {
                  onOk: () => {
                    ipcRenderer.send('deleteTarget', selectedTarget.id);
                    setSelectedTarget(null);
                  },
                  title: local.views.targetPanel.deleteTarget,
                  content: local.views.targetPanel.getDeleteTargetNotice(selectedTarget.name),
                },
                local,
              )
            }
          >
            {local.views.targetPanel.deleteTarget}
          </Button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <TargetSelect
            disableContentTrigger
            clearable
            values={[]}
            options={targets}
            separator
            noBorder
            contentRenderer={({ props, state, methods }) => (
              <MemoDropList<Good>
                id={'targetPanel'}
                list={goodDB.getListByFieldValues(sourceList, 'id')}
                getDragItemProps={(good, itemIndex) => ({
                  onClick: e =>
                    setDetailView({
                      isGood: true,
                      id: good.id,
                      show: true,
                      anchor: getAnchor(e),
                    }),
                  onContextMenu: () => {
                    if (selectedTarget) {
                      ipcRenderer.send('modifyTarget', {
                        ...selectedTarget,
                        targets: selectedTarget.targets.filter(
                          (targetId, index) => index !== itemIndex,
                        ),
                      });
                    } else {
                      removeCacheId(good.id);
                    }
                  },
                })}
              />
            )}
            dropdownRenderer={({ props, state, methods }) => {
              const filterOptions = props.options.filter(option =>
                state.search ? option.name.includes(state.search) : true,
              );
              return (
                <div style={{ padding: 4, boxSizing: 'border-box' }}>
                  <TextField
                    autoFocus
                    fullWidth
                    placeholder={local.views.targetPanel.searchPlaceholder}
                    value={state.search}
                    onChange={methods.setSearch}
                  />
                  <div style={{ overflow: 'auto', minHeight: 10, maxHeight: 240 }}>
                    {filterOptions.length === 0 && (
                      <Typography color="primary" variant="h6" align="center">
                        {local.common.notFound}
                      </Typography>
                    )}
                    {filterOptions.length > 0 &&
                      filterOptions.map((option, index) => {
                        return (
                          <OptionContainer onClick={() => methods.addItem(option)} key={index}>
                            <Typography variant="h6" color="primary" align="center">
                              {option.name}
                            </Typography>
                            <div>
                              {goodDB
                                .getListByFieldValues(option.targets, 'id')
                                .map((good, index) => {
                                  return (
                                    <CyanTooltip key={index} title={good.name} placement="top">
                                      <IconImage size={48} src={good.imgData} />
                                    </CyanTooltip>
                                  );
                                })}
                            </div>
                          </OptionContainer>
                        );
                      })}
                  </div>
                </div>
              );
            }}
            onChange={([value]) => {
              console.log(value);
              setSelectedTarget(value);
            }}
          />
        </DragDropContext>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            flex: 1,
          }}
        >
          <Button
            color="primary"
            disabled={disableShow}
            onClick={() => {
              setShowCache(sourceList.length > 0 ? !showCache : false);
            }}
          >
            {local.views.targetPanel.toggle}
          </Button>
          <Button variant="text" color="primary" onClick={() => setShowAddModal(true)}>
            {local.views.targetPanel.addTarget}
          </Button>
        </div>
      </Grid>
      <TargetAddModal
        local={local}
        open={showAddModal}
        handleClose={() => setShowAddModal(false)}
        handleSubmit={targetName => {
          if (targets.every(target => target.name !== targetName)) {
            ipcRenderer.send('addTarget', targetName);
          }
        }}
      />
    </Paper>
  );
};

export default TargetPanel;
