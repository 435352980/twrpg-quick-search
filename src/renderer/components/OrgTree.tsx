import React from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import { makeStyles } from '@material-ui/core';

interface OrgTreeProps<T> {
  tree: TreeData<T>;
  label: (props: TreeData<T>) => string | React.ReactElement;
}

const useStyles = makeStyles({
  root: { userSelect: 'none', '&>li': { minWidth: 'max-content', width: '100%' } },
});

const OrgTree = function<T>({ tree, label }: OrgTreeProps<T>) {
  const classes = useStyles();
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
    <Tree
      className={classes.root}
      label={label(tree)}
      lineHeight={'36px'}
      lineWidth={'2px'}
      lineColor={'green'}
      lineBorderRadius={'0px'}
      nodePadding={'4px'}
    >
      {children && renderNodes(children)}
    </Tree>
  );
};

export default OrgTree;
