/**
 * 公共基础字段
 */
export interface BaseField {
  /**
   * ID
   */
  id: string;
  /**
   * 名称
   */
  name: string;
  /**
   * 显示名称(游戏内)
   */
  displayName: string;
  /**
   * 图标路径
   */
  img: string;
}
/**
 * 技能设定
 */
export interface SkillConfig {
  hotKeys?: string;
  /**
   * 技能显示名称(游戏内)
   */
  displayName: string;
  /**
   * 技能图标路径
   */
  img: string;
  /**
   * 图标 Base64
   */
  imgData: string;
  /**
   * 技能说明
   */
  desc: string;
  /**
   * 技能信息(针对能开关的技能)
   */
  closeInfo?: {
    /**
     * 技能说明
     */
    displayName: string;
    /**
     * 技能图标路径
     */
    img: string;
    /**
     * 图标 Base64
     */
    imgData: string;
    /**
     * 技能说明
     */
    desc: string;
  };
}

export interface ExclusiveSource {
  heroId: string;
  goodId: string;
  on: string;
  desc: string;
}

/**
 * 专属信息
 */
export interface Exclusive extends BaseField {
  /**
   * 图标 Base64
   */
  imgData: string;
  /**
   * 作用技能名
   */
  on: string;
  /**
   * 专属描述
   */
  desc: string;
}

/**
 * 英雄信息(基础提取)
 */
export interface HeroSource extends BaseField {
  /**
   * 模型文件
   */
  mdx: string;
  /**
   * 称谓
   */
  upro: string;
  /**
   * 攻击 1 - 基础伤害
   */
  ua1b: string;
  /**
   * 攻击 1 - 攻击间隔
   */
  ua1c: string;
  /**
   * 攻击 1 - 攻击范围
   */
  ua1r: string;
  /**
   * 攻击 1 - 攻击类型
   */
  ua1t: string;
  /**
   * 主动攻击范围
   */
  uacq: string;
  /**
   * 装甲类型
   */
  uarm: string;
  /**
   * 碰撞体积
   */
  ucol: string;
  /**
   * 基础护甲
   */
  udef: string;
  /**
   * 护甲类型
   */
  udty: string;
  /**
   * 生命最大值
   */
  uhpm: string;
  /**
   * 生命回复
   */
  uhpr: string;
  /**
   * 魔法最大值
   */
  umpm: string;
  /**
   * 高度
   */
  umvh: string;
  /**
   * 转身速度
   */
  umvr: string;
  /**
   * 基础速度
   */
  umvs: string;
  /**
   * 模型缩放
   */
  usca: string;
  /**
   * 视野范围(白天)
   */
  usid: string;
  /**
   * 视野范围(夜晚)
   */
  usin: string;
  /**
   * 技能
   */
  skills: SkillConfig[];
}

/**
 * 掉落信息(基础提取)
 */
export interface DropSource {
  /**
   * 来源ID(可能为单位或者物品)
   */
  id: string;
  /**
   * 掉落项ID字段,有掉落代理的ID形如 agentId:dropId1,dropId2,dropId3
   */
  dropId: string;
  /**
   * 概率
   */
  chance?: number;
  /**
   * 说明
   */
  desc?: string;
  /**
   * 中介掉落物品及概率信息
   */
  drops?: {
    /**
     * 掉落项ID
     */
    id: string;
    /**
     * 概率
     */
    chance: number;
  }[];
}

/**
 * 合成基础设定(提取)
 */
export interface MakeSource {
  /**
   * 构建项ID
   */
  id: string;
  /**
   * 子项ID
   */
  subId: string;
  /**
   * 需求数量
   */
  num: number;
  /**
   * 是否可选
   */
  choose?: boolean;
}

/**
 * 物品基础信息(w3t)
 */
export interface W3tItem extends BaseField {
  /**
   * 物品说明
   */
  desc: string;
  /**
   * 品阶
   */
  quality?: number;
}

/**
 * 物品设定信息(jass)
 */
export interface ItemJassSetting {
  /**
   * 物品ID
   */
  id: string;
  /**
   * 物品类别
   */
  goodType: number;
  /**
   * 物品需求等级
   */
  level?: number;
  /**
   * 限定类别
   */
  limit?: string;
  /**
   * hp
   */
  hp?: number;
  /**
   * mp
   */
  mp?: number;
  /**
   * 攻击
   */
  atk?: number;
  /**
   * 防御
   */
  def?: number;
  /**
   * 力量
   */
  str?: number;
  /**
   * 敏捷
   */
  agi?: number;
  /**
   * 智力
   */
  int?: number;
  /**
   * 主属性增加
   */
  mainAttrInc?: number;
  /**
   * 攻速
   */
  atkSpeed?: number;
  /**
   * 移速
   */
  moveSpeed?: number;
  /**
   * 技伤
   */
  abilityDamageInc?: number;
  /**
   * 减伤
   */
  sufferDamageDec?: number;
  /**
   * 魔抗
   */
  magicDefInc?: number;
  /**
   * 回血
   */
  hpInc?: number;
  /**
   * 持续伤害
   */
  stillDamageInc?: number;
  /**
   * 攻击伤害
   */
  atkDamageInc?: number;
  /**
   * 回蓝
   */
  mpInc?: number;
  /**
   * 恢复量增加
   */
  hpRegenInc?: number;
  /**
   * 治疗量增加
   */
  sufferCureInc?: number;
  /**
   * 闪避概率增加
   */
  missInc?: number;
  /**
   * 倍击
   */
  punchAsChanceInc?: number;
  /**
   * 暴击
   */
  punchChanceInc?: number;
  /**
   * 读秒减少
   */
  resurrectionTimeDec?: number;
  /**
   * exp增加
   */
  expInc?: number;
  /**
   * 冰/水属性伤害增加
   */
  iceDamageInc?: number;
  /**
   * 火属伤害增加
   */
  fireDamageInc?: number;
  /**
   * 风属性伤害增加
   */
  windAttrInc?: number;
  /**
   * 自然属性增加
   */
  natureAttrInc?: number;
}

/**
 * 单位基础信息(w3u)
 */
export interface W3uUnit extends BaseField {
  /**
   * 模型文件
   */
  mdx: string;
  /**
   * 称谓
   */
  upro: string;
  /**
   * 攻击 1 - 基础伤害
   */
  ua1b: string;
  /**
   * 攻击 1 - 攻击间隔
   */
  ua1c: string;
  /**
   * 攻击 1 - 攻击范围
   */
  ua1r: string;
  /**
   * 攻击 1 - 攻击类型
   */
  ua1t: string;
  /**
   * 主动攻击范围
   */
  uacq: string;
  /**
   * 装甲类型
   */
  uarm: string;
  /**
   * 碰撞体积
   */
  ucol: string;
  /**
   * 基础护甲
   */
  udef: string;
  /**
   * 护甲类型
   */
  udty: string;
  /**
   * 生命最大值
   */
  uhpm: string;
  /**
   * 生命回复
   */
  uhpr: string;
  /**
   * 魔法最大值
   */
  umpm: string;
  /**
   * 高度
   */
  umvh: string;
  /**
   * 转身速度
   */
  umvr: string;
  /**
   * 基础速度
   */
  umvs: string;
  /**
   * 模型缩放
   */
  usca: string;
  /**
   * 视野范围(白天)
   */
  usid: string;
  /**
   * 视野范围(夜晚)
   */
  usin: string;
}

/**
 * Boss关联
 */
interface Relation extends BaseField {
  /**
   * 图标 Base64
   */
  imgData: string;
}

interface Drop extends BaseField {
  /**
   * 图标 Base64
   */
  imgData: string;
  /**
   * 概率或说明
   */
  desc: string;
}

/**
 * 掉落信息
 */
export interface UnitDropInfo extends Drop {
  /**
   * 掉落代理信息
   * 有此字段表示该物品也有子项掉落或生成
   * 例如:元素既有矿掉落也有枷锁生成物品
   */
  agentDrops?: Drop[];
}

/**
 * 物品信息(基础提取)
 */
export interface GoodSource extends W3tItem, ItemJassSetting {
  /**
   * 物品类别
   */
  cat: (
    | 'Equip'
    | 'Weapon'
    | 'Armor'
    | 'Helm'
    | 'Ring'
    | 'Wings'
    | 'Material'
    | 'Token'
    | 'Icon'
    | 'Wing Frame'
    | 'Quest'
    | 'Summoner'
    | 'Book'
    | 'Other'
  )[];
  /**
   * 物品品阶
   */
  quality?: number;
  /**
   * 物品阶段
   */
  stage?: number;
}

/**
 * 单位信息(基础提取)
 */
export interface UnitSource extends W3uUnit {
  /**
   * Boss阶段
   */
  stage: number;
}

/**
 * 单位信息(整合后)
 */
export interface Unit extends UnitSource {
  /**
   * 图标 Base64
   */
  imgData: string;
  /**
   * 关联信息
   */
  relations: string[];
  /**
   * 掉落信息
   */
  drops: UnitDropInfo[];
}

/**
 * 物品获取方式(掉落/生成)
 */
export interface DropFrom extends Drop {
  /**
   * 掉落代理
   */
  agent?: Drop;
}

/**
 * 物品获取方式(合成)
 */
interface BuildFrom extends BaseField {
  /**
   * 图标 Base64
   */
  imgData: string;
  /**
   * 需求量 大于1时才有此字段
   */
  num?: number;
  /**
   * 是否可选
   */
  choose?: boolean;
}

/**
 * 进阶信息
 */
export interface MakeTo extends BaseField {
  /**
   * 图标 Base64
   */
  imgData: string;
}

/**
 * 英雄限定信息
 */
export interface LimitHero extends BaseField {
  /**
   * 图标 Base64
   */
  imgData: string;
}

/**
 * 物品信息(整合)
 */
export interface Good extends GoodSource {
  /**
   * 图标 Base64
   */
  imgData: string;
  /**
   * 多获取方式
   */
  multiWays?: boolean;
  /**
   * 特殊可选子项
   * 表示装备是其他装备的可选合成子项
   * 并且自身也需要合成
   */
  specialChoose?: boolean;
  /**
   * 是否为杂项
   */
  unnecessary?: boolean;
  /**
   * 物品特效说明
   */
  effect?: string;
  /**
   * 物品英雄限定
   */
  limitHeroes?: LimitHero[];
  /**
   * 专属信息
   */
  exclusives?: Exclusive[];
  /**
   * 获取方式(掉落)集合
   */
  dropFroms?: DropFrom[];
  /**
   * 获取方式(生成)集合
   */
  buildFroms?: BuildFrom[];
  /**
   * 进阶集合
   */
  makeTos?: MakeTo[];
}

export interface Hero extends HeroSource {
  /**
   * 图标 Base64
   */
  imgData: string;
  /**
   * 专属列表
   */
  exclusives: Exclusive[];
}

export interface Unit extends UnitSource {
  /**
   * 图标 Base64
   */
  imgData: string;
  /**
   * 掉落信息
   */
  drops: UnitDropInfo[];
}

export interface ObjDisplayInfo extends BaseField {
  /**
   * 图标 Base64
   */
  imgData: string;
}

export interface SplitGoodNode extends Good {
  /**
   * 子项
   */
  children?: SplitGoodNode[];
  /**
   * 是否含有子项
   */
  hasChild?: boolean;
  /**
   * 数量
   */
  num: number;
  /**
   * 是否可选
   */
  choose: boolean;
}

export interface UpgradeGoodNode extends Good {
  hasChild?: boolean;
}

export interface DiffResult {
  /**
   * 剩余目标
   */
  targets: string[];
  /**
   * 剩余持有
   */
  haves: string[];
  /**
   * 目标可选组
   */
  targetChooseGroups: string[][];
}

export interface CalcResult {
  /**
   * 总需求量
   */
  count: number;
  /**
   * 必要项目需求统计
   */
  requireSum: { [propName: string]: number };
  /**
   * 可选项目需求统计
   */
  chooseGroupSum: { [propName: string]: number };
  /**
   * 杂项需求统计
   */
  unnecessarySum: { [propName: string]: number };
  /**
   * 剩余物品材料统计
   */
  haveSum: { [propName: string]: number };
}

export interface AttachModelConfig {
  /**
   * 模型关联物品ID
   */
  id: string;
  /**
   * 模型关联物品名称
   */
  name: string;
  /**
   * 模型名称
   */
  modelName: string;
  /**
   * 位置
   */
  location: string;
}

interface ActivityConfig {
  id: string;
  name: string;
  heroRef?: string[];
}

export interface ActivityConfigs {
  april: ActivityConfig[];
  summer: ActivityConfig[];
  halloween: ActivityConfig[];
  newYear: ActivityConfig[];
}

export interface SkinInfo {
  /**
   * 皮肤ID
   */
  id: string;
  /**
   * 皮肤名称
   */
  name: string;
  /**
   * 皮肤模型
   */
  model: string;
}

export interface Skins {
  april: SkinInfo[];
  summer: SkinInfo[];
  halloween: SkinInfo[];
  newYear: SkinInfo[];
}

export interface SkinConfig {
  /**
   * 英雄ID
   */
  heroId: string;
  /**
   * 英雄皮肤
   */
  skins: Skins;
}
