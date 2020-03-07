import React from 'react';
import TargetPanel from '@renderer/views/TargetPanel';
import GoodTable from './GoodTable';
import QuickPanel from './QuickPanel';

const Good = () => {
  return (
    <>
      <TargetPanel />
      <QuickPanel />
      <GoodTable />
    </>
  );
};

export default Good;
