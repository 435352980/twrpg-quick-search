import React from 'react';

import BuildFromTable from './BuildFromTable';
import DropByTable from './DropByTable';
import CreateByTable from './CreateByTable';
import MakeToTable from './MakeToTable';
import { getDb } from '@/db';

const DetailTables: React.FC<{ id: string | null | undefined }> = ({ id }) => {
  if (!id) {
    return null;
  }
  const good = getDb('goods').find('id', id);
  return (
    <React.Fragment>
      <BuildFromTable data={good.buildFrom} />
      <DropByTable data={good.dropFrom} />
      <CreateByTable data={good.createFrom} />
      <MakeToTable data={good.makeTo} />
    </React.Fragment>
  );
};

export default DetailTables;
