import { Action, action } from 'easy-peasy';

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
};

export default commonModel;
