import React, { useState } from 'react';
import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { Table, Column } from 'react-virtualized';
import ReactTooltip from 'react-tooltip';

import { RouteComponentProps } from '@reach/router';
// import Footer from './Footer';
import useWindowSize from '@/hooks/useWindowSize';
import { blueTip, tableStyle } from '@/theme/common';
import { getDb, getImage } from '@/db';

import { getAnchor, formatTipString } from '@/utils/common';

import CachePanel from '@/views/CachePanel';
import { useStoreState, useStoreActions } from '@/store';
import Footer from '@/views/Footer';
import Cell from '@/components/Cell';
import TipPanel from '@/components/TipPanel';

// const heroInfos = getDb('heroes').getAll();
interface MdxConfig {
  [propName: string]: string;
}

const useStyles = makeStyles({
  //table 基础样式
  table: tableStyle,
  //Table header基础样式
  header: {
    color: 'white',
    fontSize: '1rem',
    textAlign: 'center',
    userSelect: 'none',
  },
  tip: {
    ...blueTip,
    width: 'max-content',
    margin: 0,
    padding: 0,
    border: 'none',
    borderRadius: 6,
  },
  img: { width: 48, height: 48 },
  imgPointer: { width: 48, height: 48, cursor: 'pointer' },
  changeColumn: {
    width: '100%',
    justifyContent: 'center',
    cursor: 'pointer',
    userSelect: 'none',
    '& >p': {
      fontWeight: 700,
    },
  },
  filterHeaderWrapper: {
    background: '#00bcd4',
    color: 'white',
    userSelect: 'none',
    fontWeight: 700,
  },
  filterTypeBtn: {
    padding: '0 8px',
    margin: 0,
    minHeight: 0,
    minWidth: 'max-content',
    fontSize: '1rem',
    fontWeight: 700,
  },
});

// const goods = orderBy(goodsFinal, ['quality', 'level'], ['asc', 'asc']);
// const flatSkills = skills => skills.reduce((pre, curr) => {
//     const { skills, ...skill } = curr;
//     return Array.isArray(skills) ? [...pre, skill, ...flatSkills(skills)] : [...pre, skill];
// }, []);

const mdxConfig: MdxConfig = {
  H001: 'Hakuman.mdx',
  H004: 'Assassin.mdx',
  H003: 'Micalela.mdx',
  H01H: 'Gilgamesh.mdx',
  H000: 'sein.mdx',
  H008: 'Shinoa.mdx',
  H00H: 'Berserker.mdx',
  H007: 'LibGirl.mdx',
  H009: 'CYT-PST.mdx',
  Hmkg: 'Sione.mdx',
  H00J: 'DarkMage.mdx',
  Hblm: 'LSWeiss.mdx',
  H01I: 'Edward.mdx',
  H00E: 'Ryu.mdx',
  H002: 'huashi.mdx',
  H005: 'TohsakaRin.mdx',
  H006: 'arcaneMage.mdx',
  H01N: 'Reset_01.mdx',
  H021: 'Killua.mdx',
  H015: 'Uryu.mdx',
  H00Z: 'Shya.mdx',
  H01V: 'Sharis.mdx',
  H00K: 'Chaika.mdx',
  H04Q: 'Mayoi.mdx',
  H04R: 'Beast_XH.mdx',
  H04S: 'LS R.mdx',
  H05B: 'Desperado_fix7.mdx',
  H05T: 'Youmu.mdx',
  H02M: 'Kururu.mdx',
  H065: 'Jueviolace.mdx',
  H066: 'KagariAtsuko.mdx',
};

const Hearo: React.FC<RouteComponentProps> = () => {
  const classes = useStyles();
  const [skillMode, setSkillMode] = useState(true);
  const [filterType, setFilterType] = useState<string | null>(null);
  const { innerWidth, innerHeight } = useWindowSize();
  // const cacheVersion = useStoreState(state => state.good.cacheVersion);
  const addCacheId = useStoreActions(actions => actions.good.addCacheId);
  const setDetailView = useStoreActions(actions => actions.view.setDetailView);
  const setMdxView = useStoreActions(actions => actions.view.setMdxView);

  const heroInfos = filterType
    ? getDb('heroes').filter(hero =>
        filterType === 'other' ? !hero.name : hero.attr === filterType,
      )
    : getDb('heroes').getAll();
  return (
    <React.Fragment>
      <CachePanel disableRight />
      <Table
        className={classes.table}
        headerClassName={classes.header}
        width={innerWidth}
        height={innerHeight - 212}
        headerHeight={40}
        rowStyle={{ alignItems: 'stretch' }}
        rowGetter={({ index }) => heroInfos[index]}
        rowCount={heroInfos.length}
        rowHeight={({ index }) => {
          // if (index === 12 && skillMode && (innerWidth - 414) / 24 < 64) {
          if (index === 12) {
            return 128;
          }
          return 64;
        }}
        onScroll={() => ReactTooltip.hide()}
      >
        <Column
          label="序号"
          dataKey="no"
          width={50}
          cellRenderer={({ rowIndex }) => (
            <Cell>
              <Typography variant="body1" align="center">
                {rowIndex + 1}
              </Typography>
            </Cell>
          )}
        />

        <Column
          label="图片"
          dataKey="img"
          width={64}
          cellRenderer={({ rowData }) => {
            const { id, name, img, subName, desc } = rowData as Hero;
            return (
              <Cell>
                <img
                  alt=""
                  data-tip={`${name || ''}\n${subName || ''}\n${desc}`}
                  onMouseEnter={() => ReactTooltip.rebuild()}
                  onClick={e => {
                    if (mdxConfig[id]) {
                      setMdxView({ show: true, name: mdxConfig[id], anchor: getAnchor(e) });
                    }
                  }}
                  className={classes.imgPointer}
                  src={getImage(img)}
                />
              </Cell>
            );
          }}
        />
        <Column
          label="英雄过滤"
          dataKey="filter"
          width={300}
          headerRenderer={() => (
            <Cell className={classes.filterHeaderWrapper}>
              <Button
                className={classes.filterTypeBtn}
                color="inherit"
                onClick={() => setFilterType(null)}
              >
                全部
              </Button>
              <Button
                className={classes.filterTypeBtn}
                color="inherit"
                onClick={() => setFilterType('力量')}
              >
                力量
              </Button>
              <Button
                className={classes.filterTypeBtn}
                color="inherit"
                onClick={() => setFilterType('敏捷')}
              >
                敏捷
              </Button>
              <Button
                className={classes.filterTypeBtn}
                color="inherit"
                onClick={() => setFilterType('智力')}
              >
                智力
              </Button>
              <Button
                className={classes.filterTypeBtn}
                color="inherit"
                onClick={() => setFilterType('other')}
              >
                召唤物
              </Button>
            </Cell>
          )}
          cellRenderer={({ rowData }) => {
            const hero = rowData as Hero;
            const name = hero.name || hero.subName;
            return (
              <Cell>
                <Typography variant="body1" align="center">
                  {name}
                </Typography>
              </Cell>
            );
          }}
        />
        {skillMode ? (
          <Column
            label="技能"
            dataKey="skill"
            width={200}
            flexGrow={1}
            headerRenderer={() => (
              <Cell className={classes.changeColumn} onClick={() => setSkillMode(!skillMode)}>
                <Typography variant="body1" align="center" color="inherit">
                  技能(点击切换专属装备)
                </Typography>
              </Cell>
            )}
            cellRenderer={({ rowData }) => {
              const hero = rowData as Hero;
              return (
                <Cell>
                  {hero.skills.map((skill, index) => {
                    const { displayName, desc } = skill;
                    return (
                      <img
                        alt=""
                        data-tip={desc}
                        onMouseEnter={() => ReactTooltip.rebuild()}
                        className={classes.img}
                        key={hero.id + index}
                        src={getImage(skill.img)}
                        // onClick={() => console.log(skill)}
                      />
                    );
                  })}
                </Cell>
              );
            }}
          />
        ) : (
          <Column
            label="专属装备"
            dataKey="exlusive"
            width={200}
            flexGrow={1}
            headerClassName={classes.header}
            headerRenderer={() => (
              <Cell className={classes.changeColumn} onClick={() => setSkillMode(!skillMode)}>
                <Typography variant="body1" align="center" color="inherit">
                  专属装备(点击切换技能)
                </Typography>
              </Cell>
            )}
            cellRenderer={({ rowData }) => {
              const hero = rowData as Hero;

              return (
                <Cell>
                  {hero.exclusive &&
                    hero.exclusive.map(exclusive => (
                      <img
                        alt=""
                        key={exclusive.id}
                        data-tip={formatTipString(exclusive.name, exclusive.on, exclusive.desc)}
                        onMouseEnter={() => ReactTooltip.rebuild()}
                        className={classes.imgPointer}
                        src={getImage(exclusive.img)}
                        onClick={e =>
                          setDetailView({
                            id: exclusive.id,
                            show: true,
                            anchor: getAnchor(e),
                            isGood: true,
                          })
                        }
                        onContextMenu={() => addCacheId(exclusive.id)}
                      />
                    ))}
                </Cell>
              );
            }}
          />
        )}
      </Table>
      <Footer />
      <ReactTooltip
        multiline
        place="top"
        type="warning"
        effect="solid"
        className={classes.tip}
        getContent={dataTip => (dataTip ? <TipPanel desc={dataTip} /> : null)}
      />
    </React.Fragment>
  );
};
export default Hearo;
