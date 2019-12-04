import React, { useState, FC } from 'react';
import Select, { components } from 'react-select';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import arrayMove from 'array-move';
import { makeStyles, Button, Grid, Tooltip, Typography, TextField } from '@material-ui/core';
import { ipcRenderer } from 'electron';
import { Modal } from 'antd';
import TargetAddModal from './TargetAddModal';
import DropList from '@/components/DropList';
import { getDb, getImage } from '@/db';
import useWindowSize from '@/hooks/useWindowSize';
import { useStoreState, useStoreActions } from '@/store';
import { getAnchor } from '@/utils/common';

const { MenuList } = components;

const useStyles = makeStyles({
  tip: {
    fontWeight: 400,
    backgroundImage: 'linear-gradient(150deg, #6cd0f7 0%, #f3d7d7 103%)',
    color: '#000',
    fontSize: '1.2rem',
  },
  option: {
    width: '100%',
    minHeight: 64,
    padding: 8,
    marginBottom: 8,
    '&:hover': { backgroundColor: '#eee' },
  },
});

const CustomMenuList = (props: any) => {
  return (
    <div>
      <div style={{ padding: 5, boxSizing: 'border-box' }}>
        <TextField
          autoFocus
          fullWidth
          placeholder="输入名称进行检索"
          value={props.selectProps.inputValue}
          onChange={e =>
            props.selectProps.onInputChange(e.target.value, {
              action: 'input-change',
            })
          }
          onMouseDown={e => {
            e.stopPropagation();
          }}
          onTouchEnd={e => {
            e.stopPropagation();
          }}
          onFocus={props.selectProps.onMenuInputFocus}
        />
      </div>
      <MenuList {...props} />
    </div>
  );
};

const TargetPanel: FC<{ disableShow?: boolean }> = ({ disableShow = false }) => {
  const classes = useStyles();
  const { innerWidth } = useWindowSize();
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

  const tempIds = selectedTarget ? selectedTarget.goods : cacheIds;

  const ValueContainer = (props: any) => {
    const values = props.getValue() as Target[];
    let list: string[] = [];
    if (values.length > 0) {
      list = values[0].goods;
    } else {
      list = cacheIds;
    }
    const onDragEnd = (result: DropResult) => {
      if (!result.destination) {
        return;
      }
      if (result.destination.index === result.source.index) {
        return;
      }
      if (!selectedTarget) {
        const newIds = arrayMove(cacheIds, result.source.index, result.destination.index);
        return setCacheIds(newIds);
      } else {
        const newGoods = arrayMove(list, result.source.index, result.destination.index);
        setSelectedTarget({ ...selectedTarget, goods: newGoods });
        ipcRenderer.send('modifyTarget', { ...selectedTarget, goods: newGoods });
      }
    };
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <DropList
          droppableId="targetPanel"
          list={list.map(id => getDb('goods').find('id', id))}
          onItemClick={(id, e) =>
            setDetailView({ isGood: true, id, show: true, anchor: getAnchor(e) })
          }
          onItemContextMenu={(id, itemIndex) => {
            if (selectedTarget) {
              ipcRenderer.send('modifyTarget', {
                ...selectedTarget,
                goods: selectedTarget.goods.filter((good, index) => index !== itemIndex),
              });
            } else {
              removeCacheId(id);
            }
          }}
          dragContentProps={{
            style: { width: innerWidth - 224, alignItems: 'center' },
          }}
        />
      </DragDropContext>
    );
  };

  const Option = (props: any) => {
    const data = props.data as Target;
    const isSelected = selectedTarget && selectedTarget.id === data.id;
    return (
      <div
        className={classes.option}
        style={isSelected ? { background: '#ddd' } : undefined}
        onClick={() => props.setValue(data)}
      >
        <Typography
          variant="body1"
          color="primary"
          align="center"
          component="span"
          style={{
            width: 344,
            lineHeight: '48px',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            display: 'inline-block',
            verticalAlign: 'middle',
            cursor: 'default',
          }}
        >
          {data.name}
        </Typography>
        {data.goods.map((id, index) => {
          const good = getDb('goods').find('id', id);
          return (
            <Tooltip key={index} title={good.name} classes={{ tooltip: classes.tip }}>
              <img style={{ width: 48, height: 48 }} src={getImage(good.img)} />
            </Tooltip>
          );
        })}
      </div>
    );
  };

  return (
    <Grid container direction="row" justify="space-between">
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
        <Button color="secondary" disabled={!!selectedTarget} onClick={() => setCacheIds([])}>
          清除缓存
        </Button>
        <Button
          variant="text"
          color="secondary"
          disabled={!selectedTarget}
          onClick={() =>
            selectedTarget &&
            Modal.confirm({
              maskClosable: true,
              mask: false,
              okText: '确定',
              cancelText: '取消',
              okType: 'danger',
              onOk: () => {
                ipcRenderer.send('deleteTarget', selectedTarget.id);
                setSelectedTarget(null);
              },
              title: '删除确认',
              content: `确认删除名为【${selectedTarget.name}】的目标吗(考虑仔细哦)`,
            })
          }
        >
          删除目标
        </Button>
      </div>

      <Select
        isClearable
        options={targets}
        value={selectedTarget}
        styles={{
          container: base => ({
            ...base,
            height: 80,
            display: 'flex',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            flex: 1,
          }),
          control: base => ({
            ...base,
            width: '100%',
            border: 'none',
            height: '100%',
            alignItems: 'flex-end',
          }),
          menu: base => ({ ...base, marginTop: 0 }),
          valueContainer: base => ({ ...base, width: '100%', flex: 1 }),
        }}
        components={{ ValueContainer, Option, MenuList: CustomMenuList }}
        menuPortalTarget={document.body}
        noOptionsMessage={() => '未检索到数据'}
        filterOption={(option, input) => {
          const data = option.data as Target;
          if (input) {
            return data.name.includes(input);
          }
          return true;
        }}
        onChange={option => setSelectedTarget(option as Target)}
      ></Select>

      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
        <Button
          color="primary"
          disabled={disableShow}
          onClick={() => {
            setShowCache(tempIds.length > 0 ? !showCache : false);
          }}
        >
          查看/恢复
        </Button>
        <Button variant="text" color="primary" onClick={() => setShowAddModal(true)}>
          新建目标
        </Button>
      </div>
      <TargetAddModal
        open={showAddModal}
        handleClose={() => setShowAddModal(false)}
        handleSubmit={targetName => {
          if (targets.every(target => target.name !== targetName)) {
            ipcRenderer.send('addTarget', targetName);
          }
        }}
      ></TargetAddModal>
    </Grid>
  );
};

export default TargetPanel;
