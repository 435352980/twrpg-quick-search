import React, { useMemo } from 'react';

import { useStoreState, useStoreActions } from '@renderer/store';
import PrintDialog from '@renderer/components/PrintDialog';
import SplitChart from '@renderer/components/SplitChart';
import local from '@renderer/local';
import { Switch, Route } from 'react-router-dom';

import Header from '@renderer/views/Header';
import GoodView from '@renderer/views/GoodView';
import UpgradeChart from '@renderer/views/UpgradeChart';
import Calc from '@renderer/views/Calc';
import Detail from '@renderer/views/Detail';
import HeroView from '@renderer/views/HeroView';
import TeamView from '@renderer/views/TeamView';
import MdxDrawer from '@renderer/views/MdxDrawer';
import UnitView from './UnitView';
import ReplayView from './ReplayView';
import RecordView from './RecordView';
import ActivityView from './ActivityView';

const PageFrame = () => {
  const { goodDB } = useStoreState(state => state.app.dataHelper);
  const { detail, upgrade, split, calc, mdx } = useStoreState(state => state.view);
  const { setUpgradeView, setSplitView } = useStoreActions(actions => actions.view);

  const detailDrawer = useMemo(
    () => <Detail id={detail.id} show={detail.show} anchor={detail.anchor} />,
    [detail.id, detail.show, detail.anchor],
  );

  const splitDialog = useMemo(() => {
    const name = split.id ? goodDB.find('id', split.id).name : '';
    return (
      <PrintDialog
        name={`【${name}】${local.COMMON.SPLIT}`}
        show={!!split.show}
        onClose={() => setSplitView({ show: false })}
      >
        <SplitChart id={split.id} />
      </PrintDialog>
    );
  }, [goodDB, setSplitView, split.id, split.show]);

  const upgradeDialog = useMemo(() => {
    const name = upgrade.id ? goodDB.find('id', upgrade.id).name : '';
    return (
      <PrintDialog
        name={`【${name}】${local.COMMON.UPGRADE}`}
        show={upgrade.show}
        onClose={() => setUpgradeView({ show: false })}
      >
        <UpgradeChart id={upgrade.id} />
      </PrintDialog>
    );
  }, [goodDB, setUpgradeView, upgrade.id, upgrade.show]);

  const calcDrawer = useMemo(() => <Calc anchor={calc.anchor} show={calc.show} />, [
    calc.anchor,
    calc.show,
  ]);

  const mdxDrawer = useMemo(
    () => <MdxDrawer name={mdx.name} anchor={mdx.anchor} show={mdx.show} />,
    [mdx.name, mdx.anchor, mdx.show],
  );

  return (
    <>
      <Header />
      <Switch>
        <Route path="/hero">
          <HeroView />
        </Route>
        <Route path="/unit">
          <UnitView />
        </Route>
        <Route path="/team">
          <TeamView />
        </Route>
        <Route path="/record">
          <RecordView />
        </Route>
        <Route path="/replay">
          <ReplayView />
        </Route>
        <Route path="/activity">
          <ActivityView />
        </Route>
        <Route path={['/good', '*']}>
          <GoodView />
        </Route>
      </Switch>

      {detailDrawer}
      {splitDialog}
      {upgradeDialog}
      {calcDrawer}
      {mdxDrawer}
    </>
  );
};

export default PageFrame;
