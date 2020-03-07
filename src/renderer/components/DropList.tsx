import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Good, Hero, Unit } from '@renderer/dataHelper/types';
import styled from '@emotion/styled';
import CyanTooltip from './CyanTooltip';

const DragImg = styled.img<{ size?: number }>`
  ${({ size = 48 }) => `width: ${size}px;height: ${size}px`};
`;

interface ItemDraggableProps<T> {
  item: T;
  index: number;
  imgSize?: number;
  getDragItemProps?: (item: T, index: number) => React.HTMLAttributes<HTMLImageElement>;
}

const ItemDraggable = function<T extends Good | Hero | Unit>({
  item,
  index,
  imgSize,
  getDragItemProps = () => null,
}: React.PropsWithChildren<ItemDraggableProps<T>>) {
  return (
    <Draggable draggableId={`${item.id}_${index}`} index={index}>
      {provided => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <CyanTooltip key={index} title={item.name} placement="top">
            <DragImg size={imgSize || 48} src={item.imgData} {...getDragItemProps(item, index)} />
          </CyanTooltip>
        </div>
      )}
    </Draggable>
  );
};

interface DragItemsProps<T> {
  list: T[];
  imgSize?: number;
  getDragItemProps?: (item: T, index: number) => React.HTMLAttributes<HTMLImageElement>;
}

const DragItems = function<T extends Good | Hero | Unit>({
  list,
  getDragItemProps,
  imgSize,
}: React.PropsWithChildren<DragItemsProps<T>>) {
  return (
    <>
      {list.map((item, index) => (
        <ItemDraggable<T>
          item={item}
          index={index}
          key={`${item.id}-${index}`}
          getDragItemProps={getDragItemProps}
          imgSize={imgSize}
        />
      ))}
    </>
  );
};

interface DropListProps<T> {
  /**
   * droppableId
   */
  id: string;
  providedProps?: React.HTMLAttributes<HTMLDivElement>;
  /**
   * ID列表(物品,单位,英雄)
   */
  list: T[];
  getDragItemProps?: (item: T, index: number) => React.HTMLAttributes<HTMLImageElement>;
  imgSize?: number;
}

const DropWrapper = styled.div`
  display: flex;
  overflow-x: auto;
  min-width: 300px;
  min-height: 64px;
  max-height: 64px;
`;

const DropList = <T extends Good | Hero | Unit>({
  id,
  list,
  imgSize,
  providedProps,
  getDragItemProps,
}: React.PropsWithChildren<DropListProps<T>>) => (
  <Droppable droppableId={id} direction="horizontal">
    {provided => (
      <DropWrapper ref={provided.innerRef} {...provided.droppableProps} {...providedProps}>
        <DragItems list={list} getDragItemProps={getDragItemProps} imgSize={imgSize} />
        {provided.placeholder}
      </DropWrapper>
    )}
  </Droppable>
);

const MemoDropList = (React.memo(DropList) as unknown) as <T extends Good | Hero | Unit>(
  props: React.PropsWithChildren<DropListProps<T>>,
) => React.ReactElement;

export default MemoDropList;
