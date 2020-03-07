import React, { useState, FC } from 'react';
import { useStoreState, useStoreActions } from '@renderer/store';
import Select, { DropDownComponent } from '@renderer/thirdParty/Select';
import { DropResult, DragDropContext } from 'react-beautiful-dnd';
import arrayMove from 'array-move';
import MemoDropList from '@renderer/components/DropList';
import { Good } from '@renderer/dataHelper/types';
import { TextField, Typography, Button, Paper, Grid } from '@material-ui/core';
import CyanTooltip from '@renderer/components/CyanTooltip';
import IconImage from '@renderer/components/IconImage';
import { ipcRenderer } from 'electron';
import { confirm, getAnchor } from '@renderer/helper';
import local from '@renderer/local';
import TargetAddModal from './TargetAddModal';
import styled from '@emotion/styled';

const TargetSelect = styled(Select)`
  width: calc(100% - 150px);
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
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
          <Button color="secondary" disabled={!!selectedTarget} onClick={() => setCacheIds([])}>
            {local.TARGET_PANEL.CLEAR_CACHE}
          </Button>
          <Button
            variant="text"
            color="secondary"
            disabled={!selectedTarget}
            onClick={() =>
              selectedTarget &&
              confirm({
                onOk: () => {
                  ipcRenderer.send('deleteTarget', selectedTarget.id);
                  setSelectedTarget(null);
                },
                title: local.COMMON.DELETE_CONFIRM,
                content: `
                ${local.TARGET_PANEL.DELETE_TARGET_CONFIRM_CONTENT_PRE}
                ${selectedTarget.name}
                ${local.TARGET_PANEL.DELETE_TARGET_CONFIRM_CONTENT_END}`,
              })
            }
          >
            {local.TARGET_PANEL.DELETE_TARGET}
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
                    placeholder={local.TARGET_PANEL.SEARCH_PLACEHOLDER}
                    value={state.search}
                    onChange={methods.setSearch}
                  />
                  <div style={{ overflow: 'auto', minHeight: 10, maxHeight: 240 }}>
                    {filterOptions.length === 0 && (
                      <Typography color="primary" variant="h6" align="center">
                        {local.COMMON.NOT_FOUND}
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
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
          <Button
            color="primary"
            disabled={disableShow}
            onClick={() => {
              setShowCache(sourceList.length > 0 ? !showCache : false);
            }}
          >
            {local.TARGET_PANEL.TOGGLE}
          </Button>
          <Button variant="text" color="primary" onClick={() => setShowAddModal(true)}>
            {local.TARGET_PANEL.ADD_TARGET}
          </Button>
        </div>
      </Grid>
      <TargetAddModal
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
