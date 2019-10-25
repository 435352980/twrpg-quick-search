import React, { useMemo } from 'react';
import { Router, LocationContext } from '@reach/router';

import DetailView from './DetailView';
import UpgradeChart from './UpgradeChart';
import MdxDrawer from './MdxDrawer';
import CalcView from './CalcView';

import { getDb } from '@/db';
import { useStoreState, useStoreActions } from '@/store';
import SplitChart from '@/components/SplitChart';
import PrintDialog from '@/components/PrintDialog';

import Good from '@/views/Good';
import Hero from '@/views/Hero';
import Unit from '@/views/Unit';
import Record from '@/views/Record';
import Team from '@/views/Team';
import Replay from '@/views/Replay';
import Activity from '@/views/Activity';

const Frame: React.FC<LocationContext> = () => {
  const { detail, upgrade, split, calc, mdx } = useStoreState(state => state.view);
  const { setUpgradeView, setSplitView } = useStoreActions(actions => actions.view);

  const detailDrawer = useMemo(
    () => (
      <DetailView id={detail.id} show={detail.show} isGood={detail.isGood} anchor={detail.anchor} />
    ),
    [detail.id, detail.show, detail.isGood, detail.anchor],
  );
  const splitDialog = useMemo(() => {
    const name = split.id ? getDb('goods').find('id', split.id).name : '';
    return (
      <PrintDialog
        name={`【${name}】拆解`}
        show={!!split.show}
        onClose={() => setSplitView({ show: false })}
      >
        <SplitChart id={split.id} />
      </PrintDialog>
    );
  }, [setSplitView, split.id, split.show]);

  const upgradeDialog = useMemo(() => {
    const name = upgrade.id ? getDb('goods').find('id', upgrade.id).name : '';
    return (
      <PrintDialog
        name={`【${name}】进阶`}
        show={upgrade.show}
        onClose={() => setUpgradeView({ show: false })}
      >
        <UpgradeChart id={upgrade.id} />
      </PrintDialog>
    );
  }, [setUpgradeView, upgrade.id, upgrade.show]);

  const calcDrawer = useMemo(() => <CalcView anchor={calc.anchor} show={calc.show} />, [
    calc.anchor,
    calc.show,
  ]);

  const mdxDrawer = useMemo(
    () => <MdxDrawer name={mdx.name} anchor={mdx.anchor} show={mdx.show} />,
    [mdx.name, mdx.anchor, mdx.show],
  );
  return (
    <>
      <Router>
        <Good path="good" default></Good>
        <Hero path="hero"></Hero>
        <Unit path="unit"></Unit>
        <Record path="record"></Record>
        <Team path="team"></Team>
        <Replay path="replay"></Replay>
        <Activity path="activity"></Activity>
      </Router>
      {splitDialog}
      {upgradeDialog}
      {detailDrawer}
      {calcDrawer}
      {mdxDrawer}
    </>
  );
};

export default Frame;
