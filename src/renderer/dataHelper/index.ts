import DBHelper from './dbHelper';
import getHeroLimitConfigs from './getHeroLimitConfigs';
import itemEffect from './itemEffect';
import { attachHelmets, attachRings, attachWings } from './attachConfigs';
import activityConfigs from './activityConfigs';
import skinConfigs from './skinConfigs';
import {
  GoodSource,
  UnitSource,
  HeroSource,
  DropSource,
  MakeSource,
  ExclusiveSource,
  Good,
  Hero,
  Unit,
  SplitGoodNode,
  UpgradeGoodNode,
  DiffResult,
  CalcResult,
  AttachInfo,
} from './types';

type TreeData<T> = T & { children?: TreeData<T>[] };

export default class DataHelper {
  private goodSourceHelper: DBHelper<GoodSource>;
  private unitSourceHelper: DBHelper<UnitSource>;
  private heroSourceHelper: DBHelper<HeroSource>;
  private exclusives: ExclusiveSource[];
  private dropSourceHelper: DBHelper<DropSource>;
  private makeSourceHelper: DBHelper<MakeSource>;
  private skinConfig: { id: string; heroIds: string[] }[];
  private skinMapping: { [key: string]: string };
  private imagesMap: { [propName: string]: string };
  private lang: 'cn' | 'en' | 'ko';

  public goodDB: DBHelper<Good>;
  public heroDB: DBHelper<Hero>;
  public unitDB: DBHelper<Unit>;

  public attachHelmets: AttachInfo[] = [];
  public attachRings: AttachInfo[] = [];
  public attachWings: AttachInfo[] = [];
  public attachUnknowns: AttachInfo[] = [];

  /**
   * 粉末ID列表
   */
  // public DUST_IDS = ['I04U', 'I04V', 'I04W', 'I04X', 'I04Y'];
  public DUST_IDS = [];
  /**
   * 矿石ID列表
   */
  // public ORE_IDS = ['I05K', 'I05P', 'I05Q'];
  public ORE_IDS = [];
  /**
   * 魔法石ID列表
   */
  public MAGIC_STONE_IDS = ['I04X', 'I04W', 'I04V', 'I04U'];
  /**
   * 杂项(凡叔系列 神秘树枝)
   */
  public OTHER_UNNESSARY_IDS = ['I0B9', 'I0BA', 'I0BB', 'I0BC', 'I06C'];

  public activityConfigs = activityConfigs;

  constructor(
    GoodSources: GoodSource[] = [],
    UnitSources: UnitSource[] = [],
    heroes: HeroSource[] = [],
    drops: DropSource[] = [],
    makes: MakeSource[] = [],
    exclusives: ExclusiveSource[] = [],
    skinConfig: { id: string; heroIds: string[] }[] = [],
    skinMapping: { [key: string]: string } = {},
    imagesMap: { [propName: string]: string } = {},
    lang: 'cn' | 'en' | 'ko' = 'cn',
  ) {
    this.goodSourceHelper = new DBHelper(GoodSources);
    this.unitSourceHelper = new DBHelper(UnitSources);
    this.heroSourceHelper = new DBHelper(heroes);
    this.dropSourceHelper = new DBHelper(drops);
    this.makeSourceHelper = new DBHelper(makes);
    this.exclusives = exclusives;
    this.skinConfig = skinConfig;
    this.skinMapping = skinMapping;
    this.imagesMap = imagesMap;
    this.lang = lang;

    this.goodDB = new DBHelper(GoodSources.map(GoodSource => this.buildGood(GoodSource)));
    this.heroDB = new DBHelper(heroes.map(hero => this.buildHero(hero)));
    this.unitDB = new DBHelper(UnitSources.map(UnitSource => this.buildUnit(UnitSource)));
    this.buildAttaches();

    // console.log(makes.filter(mk => mk.id === 'I0C8'));
  }

  /**
   * 判断是否为杂项
   */
  public isUnnecessaryItem(id: string) {
    return [
      ...this.DUST_IDS,
      ...this.ORE_IDS,
      ...this.MAGIC_STONE_IDS,
      ...this.OTHER_UNNESSARY_IDS,
    ].includes(id);
  }

  /**
   * 根据ID获取基本显示信息(id, name, displayName, img)
   * @param objId 物品/单位/英雄 ID
   */
  public getObjDisplayInfoById(objId: string) {
    // console.log(objId);
    const { id, name, displayName, img } =
      this.goodSourceHelper.find('id', objId) ||
      this.unitSourceHelper.find('id', objId) ||
      this.heroSourceHelper.find('id', objId);
    return { id, name, displayName, img, imgData: this.getImgData(img) };
  }

  /**
   * 根据ID获取类别
   * @param objId ID
   */
  private getObjTypeById(objId: string) {
    if (this.goodSourceHelper.find('id', objId)) {
      return 'good';
    }
    if (this.unitSourceHelper.find('id', objId)) {
      return 'unit';
    }
    if (this.heroSourceHelper.find('id', objId)) {
      return 'hero';
    }
  }

  /**
   * 根据ID获取基本显示信息(id, name, displayName, img)
   * @param objId 物品/单位/英雄 ID
   */
  public getObjAndTypeById(objId: string): [Partial<Good & Unit & Hero>, 'good' | 'unit' | 'hero'] {
    const good = this.goodDB.find('id', objId);
    if (good) {
      return [good, 'good'];
    }
    const unit = this.unitDB.find('id', objId);
    if (unit) {
      return [unit, 'unit'];
    }
    const hero = this.heroDB.find('id', objId);
    if (hero) {
      return [hero, 'hero'];
    }
  }

  /**
   * 根据物品ID获取专属信息
   * @param goodId 物品 ID
   */
  public getExclusivesByGoodId = (goodId: string) => {
    return this.exclusives
      .filter(exclusive => exclusive.goodId === goodId)
      .map(exclusive => {
        const hero = this.heroSourceHelper.find('id', exclusive.heroId);
        return {
          id: hero.id,
          name: hero.name,
          displayName: hero.displayName,
          img: hero.img,
          imgData: this.getImgData(hero.img),
          on: exclusive.on,
          desc: exclusive.desc,
        };
      });
  };

  /**
   * 获取 掉落或生成 信息
   * @param id 物品/单位 ID
   */
  private getDropFrom(id: string) {
    const dropInfos = this.dropSourceHelper.filter(dp => dp.dropId.includes(id));
    const dropFrom = dropInfos.map(dropInfo => {
      const fromDisplayInfo = this.getObjDisplayInfoById(dropInfo.id);
      if (!fromDisplayInfo) {
        console.log('未检索到信息', dropInfo);
      }
      const agentId = dropInfo.dropId.split(':')[0];
      const agentDisplayInfo = this.getObjDisplayInfoById(agentId);
      // 非中介掉落(附魔矿石 怒焰/海晶碎片 封印枷锁圣器 )
      if (agentId === id) {
        return {
          ...fromDisplayInfo,
          desc: dropInfo.chance ? dropInfo.chance + '%' : dropInfo.desc,
        };
      }

      const drop = (dropInfo.drops || []).find(drop => drop.id === id);

      return {
        ...fromDisplayInfo,
        desc: drop.chance + '%',
        agent: {
          ...agentDisplayInfo,
          desc: dropInfo.chance ? dropInfo.chance + '%' : dropInfo.desc,
        },
      };
    });
    return dropFrom;
  }

  /**
   * 构建BOSS数据
   * @param unit 源BOSS信息
   */
  private buildUnit(unit: UnitSource) {
    const dropInfos = this.dropSourceHelper.filter('id', unit.id);
    const dropIds: string[] = [];
    const drops = dropInfos.map(dp => {
      const agentId = dp.dropId.split(':')[0];
      if (this.getObjTypeById(agentId)) {
        dropIds.push(agentId);
      }
      return {
        ...this.getObjDisplayInfoById(agentId),
        desc: dp.chance ? dp.chance + '%' : dp.desc,
        ...(dp.drops
          ? {
              agentDrops: dp.drops.map(drop => {
                if (this.getObjTypeById(drop.id)) {
                  dropIds.push(drop.id);
                }
                return {
                  ...this.getObjDisplayInfoById(drop.id),
                  desc: drop.chance + '%',
                };
              }),
            }
          : null),
      };
    });

    const relations: string[] = [
      ...new Set<string>(
        dropIds.reduce((acc, dropId) => {
          const makeTo = this.makeSourceHelper
            .filter(make => dropId === make.subId)
            .map(make => make.id);
          return [...acc, ...makeTo];
        }, []),
      ),
    ];

    return {
      ...unit,
      imgData: this.getImgData(unit.img),
      ...(drops.length > 0 ? { drops } : null),
      ...(relations.length > 0 ? { relations } : null),
    };
  }

  /**
   * 根据物品ID获取物品合成信息
   * @param id 物品ID
   */
  private buildGood(good: GoodSource) {
    const dropFroms = this.getDropFrom(good.id);

    const makeTos = this.makeSourceHelper
      .filter(item => item.subId.includes(good.id))
      .map(make => {
        const good = this.goodSourceHelper.find('id', make.id);
        if (!good) {
          console.log('找不到物品', make);
          return null;
        }
        return {
          id: make.id,
          name: good.name,
          displayName: good.displayName,
          img: good.img,
          imgData: this.getImgData(good.img),
        };
      })
      .filter(info => !!info);

    const limitHeroes = (getHeroLimitConfigs()[good.limit] || [])
      .map(heroId => {
        const hero = this.heroSourceHelper.find('id', heroId);
        if (!hero) {
          return null;
        }
        const { id, name, displayName, img } = hero;
        return { id, name, displayName, img, imgData: this.getImgData(img) };
      })
      .filter(limitHero => !!limitHero);

    const effect =
      itemEffect.find(item => item.id === good.id)?.[this.lang === 'ko' ? 'en' : this.lang] || null;

    const exclusives = this.getExclusivesByGoodId(good.id);

    const buildFroms = this.makeSourceHelper
      .filter('id', good.id)
      .map(make => {
        if (Array.isArray(make.choose)) {
          return make.choose.map(chooseInfo => {
            const good = this.goodSourceHelper.find('id', chooseInfo.subId);
            // const dropFroms = this.getDropFrom(good.id);
            return {
              id: good.id,
              name: good.name,
              displayName: good.displayName,
              img: good.img,
              imgData: this.getImgData(good.img),
              ...(chooseInfo.num > 1 ? { num: chooseInfo.num } : null),
            };
          });
        }
        const good = this.goodSourceHelper.find('id', make.subId);
        if (!good) {
          console.log('找不到物品', make);
          return null;
        }
        // const dropFroms = this.getDropFrom(good.id);
        return {
          id: good.id,
          name: good.name,
          displayName: good.displayName,
          img: good.img,
          imgData: this.getImgData(good.img),
          // ...(dropFroms.length > 0 ? { dropFroms } : null),
          ...(make.num > 1 ? { num: make.num } : null),
          ...(make.choose ? { choose: make.choose } : null),
        };
      })
      .filter(info => !!info);
    const multiWays = dropFroms.length > 0 && buildFroms.length > 0;
    // 小四所有白字绿字(银币合成) 深渊指环 圣光之戒 为特殊可选项，不可进一步拆解
    const specialChoose =
      // 深渊指环，圣光之戒为百搭的可选合成物品，并且自身的获取也需要合成
      (buildFroms.length > 0 &&
        !!this.makeSourceHelper.find(item =>
          item?.choose?.some?.(item => item.subId.includes(good.id)),
        )) ||
      // 小四主龙所有boss的掉落项(可由银币合成)
      !!([3, 4, 5, 6].includes(good.stage) && this.dropSourceHelper.find('dropId', good.id)) ||
      this.DUST_IDS.includes(good.id);

    // 是否属于杂项
    const unnecessary = this.isUnnecessaryItem(good.id);

    return {
      ...good,
      imgData: this.getImgData(good.img),
      ...(effect ? { effect } : null),
      ...(limitHeroes.length > 0 ? { limitHeroes } : null),
      ...(exclusives.length > 0 ? { exclusives } : null),
      ...(dropFroms.length > 0 ? { dropFroms } : null),
      ...(buildFroms.length > 0 ? { buildFroms } : null),
      ...(makeTos.length > 0 ? { makeTos } : null),
      ...(multiWays ? { multiWays } : null),
      ...(specialChoose ? { specialChoose } : null),
      ...(unnecessary ? { unnecessary } : null),
    };
  }

  /**
   * 构建英雄信息
   * @param hero 英雄基础信息
   */
  private buildHero(hero: HeroSource) {
    const exclusives = this.exclusives
      .filter(ex => ex.heroId === hero.id)
      .map(ex => {
        const good = this.goodSourceHelper.find('id', ex.goodId);
        return {
          id: ex.goodId,
          name: good.name,
          displayName: good.displayName,
          img: good.img,
          imgData: this.getImgData(good.img),
          on: ex.on,
          desc: ex.desc,
        };
      });
    const skills = hero.skills.map(({ closeInfo, ...info }) => {
      return {
        ...info,
        imgData: this.getImgData(info.img),
        ...(closeInfo
          ? { closeInfo: { ...closeInfo, imgData: this.getImgData(closeInfo.img) } }
          : null),
      };
    });
    return {
      ...hero,
      skills,
      imgData: this.getImgData(hero.img),
      ...(exclusives.length > 0 ? { exclusives } : null),
    };
  }

  private buildAttaches() {
    const addImgData = (attachBase: Omit<AttachInfo, 'imgData'>) => ({
      ...attachBase,
      imgData: this.goodDB.find('id', attachBase.id)?.imgData,
    });
    // 处理附加模型
    this.goodDB
      .filter(item => !!item.attach)
      .forEach(item => {
        const info = { id: item.id, name: item.name, imgData: item.imgData, ...item.attach };
        if (item.cat.includes('Wings')) {
          return (this.attachWings = [...this.attachWings, info]);
        }
        if (item.cat.includes('Helm')) {
          return (this.attachHelmets = [...this.attachHelmets, info]);
        }
        if (item.cat.includes('Ring')) {
          return (this.attachRings = [...this.attachRings, info]);
        }
        this.attachUnknowns = [...this.attachUnknowns, info];
      });
    this.attachWings = [...this.attachWings, ...attachWings.map(addImgData)];
    this.attachHelmets = [...this.attachHelmets, ...attachHelmets.map(addImgData)];
    this.attachRings = [...this.attachRings, ...attachRings.map(addImgData)];
    // return {
    //   attachWings: this.attachWings,
    //   attachHelmets: this.attachHelmets,
    //   attachRings: this.attachRings,
    //   attachUnkonwns: this.attachUnkonwns,
    // };
  }

  /**
   * 获取图片数据
   * @param imageName 图片名称
   */
  public getImgData(imageName?: string) {
    return this.imagesMap[
      imageName
        ? imageName
            .split(/[\\/]/)
            .pop()
            .replace(/\.(tga|blp)/, '')
        : 'BTNSpy'
    ];
  }

  /**
   * 根据ID拆解装备
   * @param goodId 拆解物品ID
   * @param excludeIds 排除ID
   */
  public splitGoodById(goodId: string, excludeIds: string[] = []): SplitGoodNode {
    const source = this.goodDB.find('id', goodId);
    const { buildFroms = [] } = source;
    const children = excludeIds.includes(goodId)
      ? []
      : buildFroms.reduce((acc: any[], item) => {
          if (Array.isArray(item)) {
            return [
              ...acc,
              ...item.map(i => ({
                ...this.splitGoodById(i.id, excludeIds),
                num: i.num,
                choose: item.map(i => i.name),
              })),
            ];
          }
          return [
            ...acc,
            {
              ...this.splitGoodById(item.id, excludeIds),
              num: item.num,
              choose: item.choose || false,
            },
          ];
        }, []);

    if (children && children.length > 0) {
      return { ...source, children, num: 1, choose: false, hasChild: true };
    } else {
      // 使用buildFroms字段处理真实展开收起情况
      return { ...source, num: 1, choose: false, hasChild: !!source.buildFroms };
    }
  }

  /**
   * 判断物品是否在拆解图中需要默认收起
   */
  public getSplitDefautHiddenIds() {
    return this.goodDB.filter(good => good.multiWays).map(good => good.id);
  }

  /**
   * 根据物品ID拆解物品
   * @param id 物品ID
   * @param excludeIds 不需要展现子项的物品ID
   */
  public getUpdateWaysById(id: string): TreeData<UpgradeGoodNode> {
    const source = this.goodDB.find('id', id);
    const { makeTos = [] } = source;
    // 默认排除粉末与毛皮项
    const children = makeTos.map(info => this.getUpdateWaysById(info.id));

    if (children && children.length > 0) {
      return { ...source, children, hasChild: true };
    } else {
      return { ...source, hasChild: !!source.makeTos };
    }
  }

  /**
   * 通过ID获取合成需求
   * @param goodId 物品ID
   * @returns [must,chooseGroup]
   */
  private getRequire(goodId: string): [string[], string[] | null] {
    const { buildFroms, specialChoose } = this.goodDB.find('id', goodId);
    let musts = [];
    let chooses = [];
    if (buildFroms && !specialChoose) {
      buildFroms.forEach(item => {
        if (Array.isArray(item)) {
          chooses = [...chooses, item.map(i => new Array(i.num || 1).fill(i.id))];
        } else {
          musts = [...musts, ...new Array(item.num || 1).fill(item.id)];
        }
      });
    } else {
      musts.push(goodId);
    }
    return [musts, chooses.length > 0 ? chooses : null];
  }

  /**
   * 打平需求量(一层)
   * @param goodIds 物品ID列表
   */
  private flatRequire(goodIds: string[]): [string[], string[][]] {
    return goodIds.reduce(
      (acc, id) => {
        const [mustAcc, chooseAcc] = acc;
        const [musts, choose] = this.getRequire(id);
        return [
          [...mustAcc, ...musts],
          choose
            ? [...chooseAcc, ...(choose.every(item => Array.isArray(item)) ? choose : [choose])]
            : chooseAcc,
        ];
      },
      [[], []],
    );
  }

  /**
   * 计算数组差值
   * @param arr1
   * @param arr2
   */
  private arrayDiff(arr1: string[], arr2: string[]): { added: string[]; removed: string[] } {
    let added = [];
    let removed = [];
    // let common = []
    const arr1Count = arr1.reduce((acc, item) => ({ ...acc, [item]: (acc[item] || 0) + 1 }), {});
    const arr2Count = arr2.reduce((acc, item) => ({ ...acc, [item]: (acc[item] || 0) + 1 }), {});

    [...new Set([...arr1, ...arr2])].forEach(key => {
      const count = (arr1Count[key] || 0) - (arr2Count[key] || 0);
      if (count > 0) {
        removed = [...removed, ...new Array(Math.abs(count)).fill(key)];
      }
      if (count < 0) {
        added = [...added, ...new Array(Math.abs(count)).fill(key)];
      }
      // if (count === 0) {
      //   common = [...common, ...new Array(Math.abs(arr1Count[key])).fill(key)];
      // }
    });

    return { added, removed };
  }

  /**
   * 计算需求量
   * @param targets 目标
   * @param haves 持有
   * @param targetChooseGroups 目标可选组
   */
  private diffRequire(
    targets: string[],
    haves: string[],
    targetChooseGroups: string[][] = [],
  ): DiffResult {
    // 初步diff
    const { removed: resultTargets, added: resultHaves } = this.arrayDiff(targets, haves);

    // 验证目标是否可被继续拆分
    if (
      this.goodDB
        .getListByFieldValues(resultTargets, 'id')
        .every(good => !good.buildFroms || good.specialChoose)
    ) {
      return { targets: resultTargets, targetChooseGroups, haves: resultHaves };
    } else {
      // 拆解一层继续计算 计算前需分离可选项
      const [targetMustAcc, targetChooseAcc] = this.flatRequire(resultTargets);
      return this.diffRequire(targetMustAcc, resultHaves, [
        ...targetChooseGroups,
        ...targetChooseAcc,
      ]);
    }
  }

  /**
   * 分析需求量
   * @param targetIds 目标ID
   * @param haveIds 持有物品ID
   */
  public calcRequire(targetIds: string[], haveIds: string[]): CalcResult {
    const requireSum = {};
    const chooseGroupSum = {};
    const unnecessarySum = {};
    const haveSum = {};
    let count = 0;
    const { targets, haves, targetChooseGroups } = this.diffRequire(targetIds, haveIds);
    // console.log('targetChooseGroups', targetChooseGroups);
    // 执行可选项diff
    const [resultHaves, resultTargetChooseGroups] = haves.reduce(
      (acc, id) => {
        const [haveAcc, targetChooseGroupAcc] = acc;
        const findIndex = targetChooseGroupAcc.findIndex(item => {
          if (Array.isArray(item)) {
            return item.some(arr => arr.includes(id));
          }
          return (item as string).includes(id);
        });
        if (findIndex !== -1) {
          return [haveAcc, targetChooseGroupAcc.filter((item, index) => index !== findIndex)];
        }
        return [[...haveAcc, id], targetChooseGroupAcc];
      },
      [[], targetChooseGroups],
    );
    targets.forEach(id => {
      if (this.isUnnecessaryItem(id)) {
        // 杂项不计入总计
        unnecessarySum[id] = (unnecessarySum[id] || 0) + 1;
      } else {
        requireSum[id] = (requireSum[id] || 0) + 1;
        count++;
      }
    });
    resultTargetChooseGroups.forEach(group => {
      const id = group.join(',');
      chooseGroupSum[id] = (chooseGroupSum[id] || 0) + 1;
      count++;
    });
    resultHaves.forEach(id => {
      haveSum[id] = (haveSum[id] || 0) + 1;
    });
    return { count, requireSum, chooseGroupSum, unnecessarySum, haveSum };
  }

  /**
   * 根据ID字符串获取BOSS关联信息
   * @param idsText ID组字符串ID之间用逗号分隔
   */
  public findRefBossesById(idsText: string) {
    return this.unitDB.filter(
      unit =>
        // 处理分析界面金币问题,添加百搭及斩神特殊合成
        (unit.relations?.some(relationId => idsText.includes(relationId)) &&
          ('I08A,I08B'.includes(idsText) || 'I08G,I08H'.includes(idsText))) ||
        unit.drops?.some(dropInfo => idsText.includes(dropInfo.id)) ||
        unit.drops?.some(
          drop =>
            idsText.includes(drop.id) ||
            drop?.agentDrops?.some(agentDrop => idsText.includes(agentDrop.id)),
        ),
    );
  }

  public getAttachConfig() {
    return {
      attachHelmets: this.attachHelmets,
      attachRings: this.attachRings,
      attachWings: this.attachWings,
      attachUnknowns: this.attachUnknowns,
    };
  }

  public getAttaches() {
    return [
      ...this.attachHelmets,
      ...this.attachRings,
      ...this.attachWings,
      ...this.attachUnknowns,
    ];
  }

  public getHeroSkins = (heroId: string) => {
    return skinConfigs.find(config => config.heroId === heroId);
  };

  /**
   * 获取英雄活动模型
   */
  public getHeroSkinModel = (
    heroId: string,
    activityType: 'newYear' | 'summer' | 'april' | 'halloween',
    skinId: string,
  ) => {
    return (
      skinConfigs
        .find(config => config.heroId === heroId)
        ?.skins[activityType]?.find(skinConfig => skinConfig.id === skinId)?.model || ''
    );
  };

  public getSkinPairsBySkinId(skinId: string) {
    return this.skinConfig.find(config => config.id === skinId)?.heroIds;
  }

  public getSkinModelNameById(skinId: string) {
    return this.skinMapping[skinId];
  }

  toJSON() {
    return {
      goodDB: this.goodDB,
      heroDB: this.heroDB,
      unitDB: this.unitDB,
      imagesMap: this.imagesMap,
    };
  }
}
