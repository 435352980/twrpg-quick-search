import React from 'react';

import { RouteComponentProps } from '@reach/router';
import QuickPanel from './QuickPanel';
import GoodTable from './GoodTable';
import CachePanel from '@/views/CachePanel';
import Footer from '@/views/Footer';

const Good: React.FC<RouteComponentProps> = () => {
  return (
    <>
      <CachePanel />
      <QuickPanel />
      <GoodTable />
      <Footer />
    </>
  );
};

export default Good;
