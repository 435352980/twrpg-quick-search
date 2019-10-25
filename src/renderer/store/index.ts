import { createStore, createTypedHooks } from 'easy-peasy';
import Logger from 'redux-logger';

import app, { AppModel } from './app';

import common, { CommonModel } from './common';

import good, { GoodModel } from './good';
import view, { ViewModel } from './view';

export interface StoreModel {
  app: AppModel;
  common: CommonModel;
  good: GoodModel;
  view: ViewModel;
}

const { useStoreActions, useStoreState, useStoreDispatch } = createTypedHooks<StoreModel>();

export { useStoreActions, useStoreState, useStoreDispatch };

export default createStore<StoreModel>({ app, common, good, view }, { middleware: [Logger] });
