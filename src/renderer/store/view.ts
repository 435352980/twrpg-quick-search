import { action, Action, ActionOn, actionOn } from 'easy-peasy';
import { StoreModel } from '@renderer/store';
interface DetailViewProps {
  /**
   * 物品/BOSS ID
   */
  id: string;
  /**
   * 是否显示详情视图
   */
  show: boolean;
  /**
   * 详情视图挂载位置
   */
  anchor: 'left' | 'right';
  /**
   * 当前展示项是否为物品类别
   */
  isGood: boolean;
}

interface SplitViewProps {
  /**
   * 拆解物品ID
   */
  id: string | null;
  /**
   * 是否显示拆解视图
   */
  show: boolean;
}

interface UpgradeViewProps {
  /**
   * 进阶物品ID
   */
  id: string;
  /**
   * 是否显示进阶视图
   */
  show: boolean;
}

interface CalcViewProps {
  /**
   * 待计算的物品ID集合
   */
  ids: string[];
  /**
   * 已拥有的物品ID集合
   */
  haves: string[];
  /**
   * 材料计算视图强制update增量
   */
  calcVersion: number;
  /**
   * 是否显示计算视图
   */
  show: boolean;
  /**
   * 计算视图挂载位置
   */
  anchor: 'left' | 'right';
}

interface MdxViewProps {
  /**
   * 模型名称
   */
  name: string;
  /**
   * 是否显示模型渲染视图
   */
  show: boolean;
  /**
   * 模型渲染视图挂载位置
   */
  anchor: 'left' | 'right';
}

/**
 * 视图模块Model
 */
export interface ViewModel {
  /**
   * 详情视图属性
   */
  detail: DetailViewProps;
  /**
   * 详情视图缓存ID
   */
  detailCacheIds: string[];
  onDetailChange: ActionOn<ViewModel, StoreModel>;
  /**
   * 设置详情视图属性
   */
  setDetailView: Action<ViewModel, Partial<DetailViewProps>>;

  /**
   * 进阶视图属性
   */
  upgrade: UpgradeViewProps;
  /**
   * 设置进阶视图属性
   */
  setUpgradeView: Action<ViewModel, Partial<UpgradeViewProps>>;

  /**
   * 拆解视图属性
   */
  split: SplitViewProps;
  /**
   * 设置拆解视图属性
   */
  setSplitView: Action<ViewModel, Partial<SplitViewProps>>;

  /**
   * 计算视图属性
   */
  calc: CalcViewProps;
  /**
   * 设置计算视图属性
   */
  setCalcView: Action<ViewModel, Partial<CalcViewProps>>;

  /**
   * 模型渲染视图属性
   */
  mdx: MdxViewProps;
  /**
   * 设置模型渲染视图属性
   */
  setMdxView: Action<ViewModel, Partial<MdxViewProps>>;
}

/**
 * 合并属性值
 * @param source 源对象
 * @param payload 输入对象
 */
const handleAssign = (source: any, payload: any) => {
  Object.keys(payload).forEach(key => {
    source[key] = payload[key];
  });
};

const viewModel: ViewModel = {
  detail: { id: '', show: false, anchor: 'right', isGood: true },
  detailCacheIds: [],
  onDetailChange: actionOn(
    (actions, storeActions) => storeActions.view.setDetailView,
    (state, action) => {
      const { id, show } = action.payload;
      if (id && show !== false) {
        if (!state.detailCacheIds.includes(id)) {
          state.detailCacheIds.push(id);
        }
      } else {
        state.detailCacheIds = [];
      }
    },
  ),
  setDetailView: action((state, payload) => {
    handleAssign(state.detail, payload);
  }),

  upgrade: { id: '', show: false },
  setUpgradeView: action((state, payload) => {
    handleAssign(state.upgrade, payload);
  }),

  split: { id: null, show: false },
  setSplitView: action((state, payload) => {
    handleAssign(state.split, payload);
  }),

  calc: { ids: [], haves: [], calcVersion: 1, show: false, anchor: 'left' },
  setCalcView: action((state, payload) => {
    const version = state.calc.calcVersion as number;
    handleAssign(state.calc, payload);
    state.calc.calcVersion = version + 1;
  }),

  mdx: { name: '', show: false, anchor: 'right' },
  setMdxView: action((state, payload) => {
    handleAssign(state.mdx, payload);
  }),
};

export default viewModel;
