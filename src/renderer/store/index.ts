import { createStore, createTypedHooks } from 'easy-peasy';
import Logger from 'redux-logger';

import view, { ViewModel } from './view';
import common, { CommonModel } from './common';
import good, { GoodModel } from './good';
import app, { AppModel } from './app';

export interface StoreModel {
  app: AppModel;
  common: CommonModel;
  good: GoodModel;
  view: ViewModel;
}

const { useStoreActions, useStoreState, useStoreDispatch, useStore } = createTypedHooks<
  StoreModel
>();

export { useStoreActions, useStoreState, useStoreDispatch, useStore };

export default createStore<StoreModel>({ app, common, good, view }, { middleware: [Logger] });
