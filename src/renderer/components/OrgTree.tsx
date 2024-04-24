import React from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import styled from '@emotion/styled';

type TreeData<T> = T & { children?: TreeData<T>[] };

interface OrgTreeProps<T> {
  tree: TreeData<T>;
  label: (props: TreeData<T>) => string | React.ReactElement;
}

const TreeComponent = styled(Tree)`
  user-select: none;
  & > li {
    min-width: max-content;
    width: 100%;
  }
`;

const OrgTree = function<T>({ tree, label }: OrgTreeProps<T>) {
  const { children } = tree;

  //渲染children
  const renderNodes = (nodes: TreeData<T>[]) => (
    <>
      {nodes &&
        nodes.map((data, index) => {
          const { children } = data;
          return (
            <TreeNode key={index} label={label(data)}>
              {children && renderNodes(children)}
            </TreeNode>
          );
        })}
    </>
  );
  return (
    <TreeComponent
      label={label(tree)}
      lineHeight={'36px'}
      lineWidth={'2px'}
      lineColor={'green'}
      lineBorderRadius={'0px'}
      nodePadding={'4px'}
    >
      {children && renderNodes(children)}
    </TreeComponent>
  );
};

export default OrgTree;
