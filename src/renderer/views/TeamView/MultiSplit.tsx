import React from 'react';

import { Divider, Button } from '@material-ui/core';

import SplitChart from '@renderer/components/SplitChart';

interface MultiSplit {
  member: Partial<TeamMember>;
}

const MultiSplit: React.FC<MultiSplit> = ({ member }) => {
  const { name, target, panel, bag } = member;

  return (
    <>
      <Button color="primary" disableRipple style={{ fontSize: '2em' }}>
        {member.name}
      </Button>
      <Divider style={{ marginBottom: 8 }} />
      {target.map((targetId, index) => (
        <SplitChart
          key={`${name}-${targetId}-${index}`}
          id={targetId}
          haves={panel.concat(bag)}
          tipId={`${name}-${targetId}-${index}`}
        />
      ))}
    </>
  );
};

export default MultiSplit;
