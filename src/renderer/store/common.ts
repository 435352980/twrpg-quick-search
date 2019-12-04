import { Action, action } from 'easy-peasy';
import { ipcRenderer } from 'electron';

/**
 * 公共模块Model
 */
export interface CommonModel {
  /**
   * 选择的分组
   */
  selectedTeam: string;
  /**
   * 设置选择分组
   */
  setSelectedTeam: Action<CommonModel, string>;

  /**
   * 分组名列表
   */
  teams: string[];
  /**
   * 设置分组名列表
   */
  setTeams: Action<CommonModel, string[]>;

  /**
   * 选择的存档
   */
  selectedFile: string;
  /**
   * 设置选择的存档
   */
  setSelectedFile: Action<CommonModel, string>;

  /**
   * 存档名集合
   */
  files: string[];
  /**
   * 设置存档名集合
   */
  setFiles: Action<CommonModel, string[]>;

  /**
   * 选择的目标
   */
  selectedTarget: Target | null;
  /**
   * 设置选择的目标
   */
  setSelectedTarget: Action<CommonModel, Target | null>;
  /**
   * 目标集合
   */
  targets: Target[];
  /**
   * 设置目标集合
   */
  setTargets: Action<CommonModel, Target[]>;

  /**
   * 添加目标
   */
  addTargetItem: Action<CommonModel, string>;
}

const commonModel: CommonModel = {
  selectedTeam: '',
  setSelectedTeam: action((state, payload) => {
    state.selectedTeam = payload;
  }),

  teams: [],
  setTeams: action((state, payload) => {
    state.teams = payload;
  }),

  selectedFile: '',
  setSelectedFile: action((state, payload) => {
    state.selectedFile = payload;
  }),

  files: [],
  setFiles: action((state, payload) => {
    state.files = payload;
  }),

  targets: [],
  setTargets: action((state, payload) => {
    state.targets = payload;
    const selectedTarget = state.selectedTarget;
    /**
     * 同步展示的目标数据
     */
    if (selectedTarget) {
      state.selectedTarget = payload.find(target => target.id === selectedTarget.id) || null;
    }
  }),

  selectedTarget: null,
  setSelectedTarget: action((state, payload) => {
    state.selectedTarget = payload;
  }),

  addTargetItem: action((state, payload) => {
    const { selectedTarget } = state;
    if (selectedTarget) {
      ipcRenderer.send('modifyTarget', {
        ...selectedTarget,
        goods: [...selectedTarget.goods, payload],
      });
    }
  }),
};

export default commonModel;
