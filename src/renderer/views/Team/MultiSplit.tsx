import React from 'react';

import { Divider, Button } from '@material-ui/core';

import SplitChart from '@/components/SplitChart';

interface MultiSplit {
  player: Player;
}

const MultiSplit: React.FC<MultiSplit> = ({ player }) => {
  const { name, target, panel, bag } = player;

  return (
    <>
      <Button color="primary" disableRipple style={{ fontSize: '2em' }}>
        {player.name}
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
