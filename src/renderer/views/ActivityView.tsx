import React, { useState } from 'react';
import { Typography, Paper } from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';

import { message, getAnchor } from '@renderer/helper';
import { useStoreActions, useStoreState } from '@renderer/store';

import ColorBtn from '@renderer/components/ColorBtn';
import useWindowSize from '@renderer/hooks/useWindowSize';
import styled from '@emotion/styled';
import { WindowTable } from 'react-window-table';
import IconImage from '@renderer/components/IconImage';
import WrapCell from '@renderer/components/WrapCell';
import Footer from '@renderer/views/Footer';

const PanelRoot = styled(Paper)`
  display: flex;
  justify-content: center;
  width: 100%;
  background: ${grey['100']};
`;

const Activity: React.FC = () => {
  const local = useStoreState(state => state.app.local);
  const dataHelper = useStoreState(state => state.app.dataHelper);
  const { goodDB, heroDB, activityConfigs } = dataHelper;
  const setMdxView = useStoreActions(actions => actions.view.setMdxView);
  const setDetailView = useStoreActions(actions => actions.view.setDetailView);
  const { innerWidth, innerHeight } = useWindowSize();
  const [activityType, setActivityType] = useState<'newYear' | 'summer' | 'april' | 'halloween'>(
    'newYear',
  );

  const source = activityConfigs[activityType];
  return (
    <div>
      <PanelRoot>
        <ColorBtn
          variant="contained"
          color={activityType === 'newYear' ? 'secondary' : 'primary'}
          onClick={() => activityType !== 'newYear' && setActivityType('newYear')}
        >
          {local.views.activity.newYear}
        </ColorBtn>

        <ColorBtn
          variant="contained"
          color={activityType === 'april' ? 'secondary' : 'primary'}
          onClick={() => activityType !== 'april' && setActivityType('april')}
        >
          {local.views.activity.april}
        </ColorBtn>

        <ColorBtn
          variant="contained"
          color={activityType === 'summer' ? 'secondary' : 'primary'}
          onClick={() => activityType !== 'summer' && setActivityType('summer')}
        >
          {local.views.activity.summer}
        </ColorBtn>

        <ColorBtn
          variant="contained"
          color={activityType === 'halloween' ? 'secondary' : 'primary'}
          onClick={() => activityType !== 'halloween' && setActivityType('halloween')}
        >
          {local.views.activity.halloween}
        </ColorBtn>
      </PanelRoot>

      <WindowTable
        cancelMouseMove={false}
        maxHeight={innerHeight - 211}
        rows={source}
        rowCount={source.length}
        rowHeight={(index: number) => {
          if (index === 0) {
            return 40;
          }
          if (source[index - 1]?.heroRef?.length * 48 > innerWidth - 96 - 64 - 360) {
            return 96;
          }
          return 64;
        }}
        columnCount={2}
        columnWidth={index => [96, 64, 360, innerWidth - 96 - 64 - 360][index]}
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
            label: local.views.activity.no,
            textAlign: 'center',
            render: (cellData, rowData, { rowIndex }) => rowIndex,
          },
          {
            name: 'id',
            label: local.views.activity.image,
            textAlign: 'center',
            render: id => (
              <WrapCell
                pointer
                onClick={e => setDetailView({ isGood: true, id, show: true, anchor: getAnchor(e) })}
              >
                <IconImage size={48} src={goodDB.find('id', id)?.imgData} />
              </WrapCell>
            ),
          },
          {
            name: 'name',
            label: local.views.activity.name,
            textAlign: 'center',
            render: name => <Typography variant="body1">{name}</Typography>,
          },
          {
            name: 'skin',
            header: () => (
              <Typography variant="body1" align="center" style={{ width: '100%' }}>
                {local.views.activity.skin}
              </Typography>
            ),
            render: (cellData, rowData) => {
              const { heroRef } = rowData;
              if (heroRef) {
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
                    {heroRef.map(heroId => {
                      const model = dataHelper.getHeroSkinModel(heroId, activityType, rowData.id);
                      return (
                        <IconImage
                          key={heroId}
                          size={48}
                          float="left"
                          pointer
                          src={heroDB.find('id', heroId)?.imgData}
                          onClick={e => {
                            if (model) {
                              setMdxView({ name: model, anchor: getAnchor(e), show: true });
                            } else {
                              message.info(local.views.activity.lossWarning);
                            }
                          }}
                        />
                      );
                    })}
                  </div>
                );
              }
              return null;
            },
          },
        ]}
      />
      <Footer />
    </div>
  );
};

export default Activity;
