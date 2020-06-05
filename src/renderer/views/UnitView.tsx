import React, { useState } from 'react';
import { WindowTable } from 'react-window-table';
import { useStoreState, useStoreActions } from '@renderer/store';
import IconImage from '@renderer/components/IconImage';
import { Typography, Button } from '@material-ui/core';
import { UnitDropInfo } from '@renderer/dataHelper/types';
import LiteTooltip from 'react-tooltip-lite';
import { getAnchor, message } from '@renderer/helper';
import UnitAttrs from '@renderer/components/UnitAttrs';
import TargetPanel from './TargetPanel';
import Footer from './Footer';

const mdxConfig = {
  h077: 'IllidanEvil.mdx', //君主

  h06T: 'WaterElemental.mdx', //水灵战神
  h06U: 'NetherDragon.mdx', //潮汐召唤者
  h060: 'FireTempleKeeperElemental.mdx', //火灵战神 伊弗利特
  h061: 'Slime.mdx', //岩浆
  h062: 'VoidWalker.mdx', //熔岩精灵
  h063: 'MountainGiant.mdx', //黑曜石巨人
  h01K: 'FelGuard.mdx', //被遗忘的黑暗怨魔
  h01P: 'felhound_V1.mdx', //被遗忘的迪鲌雷奥
  h01R: 'Demoness.mdx', //被遗忘的韦保尔
  h01S: 'BansheeRanger.mdx', //被遗忘的女猎手
  h01T: 'SkeletonArcher.mdx', //被遗忘的猎犬
  h01U: 'treasurechest.mdx', //死亡审判
  h04O: 'TaurenRock.mdx', //雷电战神 瓦尔托拉
  h04P: 'spiritwalker.mdx', //雷神的奴仆

  n02Y: 'FrostWyrm.mdx', //被诅咒的冰霜巨龙 辛德拉苟萨
  n01Q: 'FrostWyrm.mdx', //迎宾者-罗伯特
  n03I: 'FrostWyrm.mdx', //迎宾者-罗伯特(大佬)
  o000: 'Imperius.mdx', //主天使 哈乜嘢

  n03S: 'HeroDracoRich.mdx', //远古骨龙
  n030: 'AncientOfWind.mdx', //秘境守护者法老他爷
  n03W: 'AncientOfWonder.mdx', //远古法爷
  n03X: 'AncientProtector.mdx', //巨人法爷
  n02V: 'SkeletonOrc.mdx', //亡灵 战神 维扎克斯
  h00W: 'Skeleton.mdx', //骷髅勇士
  n033: 'Zombie.mdx', //僵尸领主
  n039: 'Acolyte.mdx', //不朽信徒
  n03A: 'Zombie.mdx', //僵尸

  h018: 'GiantSeaTurtle.mdx', //沧海巨兽 领主
  hpxe: 'SeaTurtle.mdx', //巨兽海尔
  n02R: 'SeaTurtle.mdx', //贮存者
  n02M: 'JungleBeast.mdx', //枭兽 雷奥利斯
  n02N: 'Ice Wings.mdx', //苍白焱灵 火焰梦魇
  n02P: 'Revenant.mdx', //愤怒
  n02O: 'GrimReaper.mdx', //死神
  hmpr: 'RevenantOfTheWaves.mdx', //堕落者电棍
  ohun: 'Abomination.mdx', //憎恶者
  odoc: 'Ghoul.mdx', //食尸者

  n01Y: 'Dolomeros.mdx', //恶魔领主 恶魔
  h034: 'NerubianSlayer.mdx', //冰霜巨蛛 极寒领主
  H01F: 'Icespider.mdx', //蜘蛛女皇
  n023: 'HeroLichCIN.mdx', //冰霜领主卡尔特兹
  n01O: 'Amaducias.mdx', //堕落天使 黑天使
  n01N: 'AvengingAngel.mdx', //第三军团守卫军 白天使
  H00V: 'Ice Wings.mdx', //圣堡阿瓦隆 守门人
  h01B: 'Witchking.mdx', //元素领主
  n01W: 'Saikann.mdx', //杰克隆登
  n01K: 'Deathwing.mdx', //死亡之翼 巨龙
  H00F: 'al.mdx', //瓦几内拉 伯爵
  n022: 'Hydra.mdx', //拉芙海统治者 许德拉

  n038: 'Saikann.mdx', //瓦几内拉古堡 领主
  h010: 'AncientBeast(mana).mdx', //远古法老
  n02Z: 'VoidWalker.mdx', //远古熔岩巨兽
  n036: 'Scarab.mdx', //噬魂尸虫
  n037: 'SpiritOfVengeance.mdx', //瓦几内拉古堡 亡灵
  n03Y: 'HeroDreadLord.mdx', //瓦几内拉古堡 怪人
  n02L: 'BansheeGhost.mdx', //鲜血亡灵
  h00Y: 'GolemStatue.mdx', //巨人魔像
  h014: 'FacelessOne.mdx', //触须统治者
  n01J: 'HeroFlameLord.mdx', //火焰统治者 拉格纳
  h00T: 'HeroDeathKnight.mdx', //瓦几内拉古堡 爵士 领主
  o005: 'ElderGorilla.mdx', //金刚
  oshm: 'Mammoth.mdx', //冰原猛犸
  n01E: 'PolarBear.mdx', //巨型极地熊
  n01D: 'Wendigo.mdx', //雪原巨兽
  o004: 'Walrus.mdx', //海象
  orai: 'Lobstrokkred.mdx', //帝王蟹
  n015: 'DragonSeaTurtle.mdx', //龙龟
  o003: 'AncientOfLore.mdx', //自然守护者
  n00A: 'WhiteWolf.mdx', //银狼
};

const UnitView = () => {
  const local = useStoreState(state => state.app.local);
  const dataHelper = useStoreState(state => state.app.dataHelper);
  const selectedTarget = useStoreState(state => state.common.selectedTarget);
  const { unitDB } = dataHelper;
  const [filterStage, setFilterStage] = useState(0);
  const setDetailView = useStoreActions(actions => actions.view.setDetailView);
  const addCacheId = useStoreActions(actions => actions.good.addCacheId);
  const addTargetItem = useStoreActions(actions => actions.common.addTargetItem);
  const setMdxView = useStoreActions(actions => actions.view.setMdxView);

  const data = unitDB
    .filter(unit => (filterStage ? unit.stage === filterStage : true))
    .sort((a, b) => b.stage - a.stage);

  return (
    <>
      <TargetPanel disableShow />
      <WindowTable
        cancelMouseMove={false}
        maxHeight={innerHeight - 203}
        rows={data}
        rowCount={data.length}
        rowHeight={(index: number) => {
          if (index === 0) {
            return 40;
          }
          return 64;
        }}
        columnCount={2}
        columnWidth={index => [48, 64, 300, 80, innerWidth - 48 - 64 - 300 - 80 - 12][index]}
        minVisibleScrollViewWidth={0}
        minVisibleScrollViewHeight={0}
        theme={classNames => {
          return {
            [classNames.GUIDELINE_BOTTOM]: { height: '0!important' },
            [classNames.GUIDELINE_TOP]: { height: '0!important' },
            [classNames.GUIDELINE_RIGHT]: { height: '0!important' },
            [classNames.GUIDELINE_LEFT]: { height: '0!important' },

            [classNames.CELL]: {
              display: 'flex',
              fontSize: '1rem',
              padding: '0!important',
              borderRight: '2px solid #dedede',
              alignItems: 'center',
              lineHeight: '1.5',
              fontWeight: 400,
            },
            [classNames.HEADER]: { background: '#00bcd4 !important', color: 'white' },
            [classNames.ROW_EVEN]: { background: '#f6f7f8' },
          };
        }}
        columns={[
          {
            name: 'no',
            textAlign: 'center',
            label: ' ',
            render: (rowData, unit, { rowIndex }) => rowIndex + 1,
          },
          {
            name: 'imgData',
            textAlign: 'center',
            label: local.views.unit.image,
            render: (imgData, unit) => (
              <LiteTooltip
                content={<UnitAttrs data={unit} />}
                direction="right"
                arrow={false}
                hoverDelay={0}
                mouseOutDelay={0}
                styles={{ height: '100%', display: 'flex', alignItems: 'center' }}
              >
                <IconImage
                  pointer={mdxConfig[unit.id]}
                  size={48}
                  src={imgData}
                  onClick={() => {
                    if (mdxConfig[unit.id]) {
                      setMdxView({ show: true, name: mdxConfig[unit.id] });
                    }
                  }}
                />
              </LiteTooltip>
            ),
          },
          {
            name: 'name',
            label: local.views.unit.name,
            textAlign: 'center',
            render: name => <Typography variant="body1">{name}</Typography>,
          },
          {
            name: 'stage',
            label: local.views.unit.stage,
            textAlign: 'center',
            render: stage => (
              <Typography variant="body1" color="secondary">
                {local.common.stages[stage]}
              </Typography>
            ),
          },
          {
            name: 'drops',
            header: () => (
              <>
                {local.common.stages.map((stage, index) => (
                  <Button key={index} color="inherit" onClick={() => setFilterStage(index)}>
                    {stage || local.common.all}
                  </Button>
                ))}
              </>
            ),
            render: drops => {
              return (
                <div
                  style={{
                    paddingLeft: 8,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  {((drops as UnitDropInfo[]) || []).reduce((acc, drop) => {
                    const { id, name, imgData, desc, agentDrops } = drop;
                    acc.push(
                      <LiteTooltip
                        key={id}
                        content={
                          <div style={{ padding: 8, display: 'flex', minWidth: 'max-content' }}>
                            <Typography variant="body1" component="span">
                              {name}
                            </Typography>
                            <Typography variant="body1" component="span" color="secondary">
                              {`　${desc}`}
                            </Typography>
                          </div>
                        }
                        background="linear-gradient(150deg, #6cd0f7 0%, #f3d7d7 103%)"
                        direction="up"
                        padding={0}
                        arrow={false}
                        hoverDelay={0}
                        mouseOutDelay={0}
                      >
                        <IconImage
                          pointer
                          float="left"
                          size={48}
                          src={imgData}
                          onClick={e => setDetailView({ id, show: true, anchor: getAnchor(e) })}
                          onContextMenu={() => {
                            if (selectedTarget) {
                              addTargetItem(id);
                              message.success(
                                `${name}${local.common.addedToTarget}【${selectedTarget.name}】`,
                              );
                            } else {
                              addCacheId(id);
                              message.success(`${name}${local.common.addedToCache}`);
                            }
                          }}
                        />
                      </LiteTooltip>,
                    );
                    if (agentDrops) {
                      agentDrops.map((agentDrop, index) => {
                        acc.push(
                          <LiteTooltip
                            key={id + 'agent' + index}
                            content={
                              <div style={{ padding: 8, display: 'flex', minWidth: 'max-content' }}>
                                <Typography variant="body1" color="secondary" component="span">
                                  {desc}
                                </Typography>
                                <Typography variant="body1" component="span">
                                  {name}
                                  {'=>'}
                                </Typography>
                                <Typography variant="body1" component="span">
                                  {agentDrop.name}
                                </Typography>
                                <Typography variant="body1" component="span" color="secondary">
                                  {`　${agentDrop.desc}`}
                                </Typography>
                              </div>
                            }
                            background="linear-gradient(150deg, #6cd0f7 0%, #f3d7d7 103%)"
                            direction="up"
                            padding={0}
                            arrow={false}
                            hoverDelay={0}
                            mouseOutDelay={0}
                          >
                            <IconImage
                              pointer
                              float="left"
                              size={48}
                              src={agentDrop.imgData}
                              onClick={e =>
                                setDetailView({
                                  id: agentDrop.id,
                                  show: true,
                                  anchor: getAnchor(e),
                                })
                              }
                              onContextMenu={() => {
                                if (selectedTarget) {
                                  addTargetItem(agentDrop.id);
                                  message.success(
                                    `${agentDrop.name}${local.common.addedToTarget}【${selectedTarget.name}】`,
                                  );
                                } else {
                                  addCacheId(agentDrop.id);
                                  message.success(`${agentDrop.name}${local.common.addedToCache}`);
                                }
                              }}
                            />
                          </LiteTooltip>,
                        );
                      });
                    }
                    return acc;
                  }, [])}
                </div>
              );
            },
          },
        ]}
      />
      <Footer showCalc />
    </>
  );
};

export default UnitView;
