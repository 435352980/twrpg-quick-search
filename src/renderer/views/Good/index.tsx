import React from 'react';
import { RouteComponentProps } from '@reach/router';
import QuickPanel from './QuickPanel';
import GoodTable from './GoodTable';
import Footer from '@/views/Footer';
import TargetPanel from '@/views/TargetPanel';

const Good: React.FC<RouteComponentProps> = () => {
  return (
    <>
      <TargetPanel />
      <QuickPanel />
      <GoodTable />
      <Footer showCalc />
    </>
  );
};

export default Good;
