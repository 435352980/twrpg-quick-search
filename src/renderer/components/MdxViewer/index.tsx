import React, { useRef, useEffect, useState, useCallback, FC } from 'react';
import { makeStyles } from '@material-ui/core';
import { Grid, Button } from '@material-ui/core';
import m3Viewer from 'mdx-m3-viewer/src/index';
import M3Viewer from 'mdx-m3-viewer/src/viewer/viewer';
import M3Model from 'mdx-m3-viewer/src/viewer/model';
import M3Instance from 'mdx-m3-viewer/src/viewer/modelinstance';
import M3Scene from 'mdx-m3-viewer/src/viewer/scene';
import { render } from 'react-dom';
import Select from 'react-dropdown-select';
// import ModelViewer from 'mdx-m3-viewer/src/viewer/viewer';
import setupCamera from './camera';
import useWindowSize from '@/hooks/useWindowSize';

import {
  attachWings,
  attachHelmets,
  attachJewelries,
  AttachModelConfig,
} from '@/configs/attachConfigs';
import { getImage, getDb } from '@/db';

const useStyles = makeStyles({
  footer: { display: 'flex', flexDirection: 'column' },
  footerRow: { display: 'flex' },
  attachOptionRoot: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    minHeight: 'max-content',
    cursor: 'pointer',
    '& img': { width: 24, height: 24 },
    '& div': {
      flex: 1,
      textAlign: 'center',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      width: '100%',
    },
    '&:hover': {
      background: '#0074D9',
      color: '#fff',
    },
  },
});

const {
  viewer: { ModelViewer, handlers },
} = m3Viewer;

const pathSolver = (path: string) => [
  'resources/' +
    path
      .replace(/^units/, 'Units')
      .replace('Replaceabletextures', 'ReplaceableTextures')
      .replace('replaceabletextures', 'ReplaceableTextures')
      .replace('abilities', 'Abilities')
      .replace('splats', 'Splats')
      .replace('Teamglow', 'TeamGlow')
      .replace('textures', 'Textures')
      .replace('units/Orc', 'Units/Orc')
      .replace('BLP', 'blp'),
  path.substr(path.lastIndexOf('.')),
  true,
];

interface MdxViewerProps {
  /**
   * 模型名称
   */
  name: string;
}
const MdxViewer: FC<MdxViewerProps> = ({ name = 'Gilgamesh.mdx' }) => {
  const classes = useStyles();
  const { innerHeight } = useWindowSize();
  const canvasRef = useRef<HTMLCanvasElement>();
  const [viewer, setViewer] = useState<M3Viewer>();
  const [instance, setInstance] = useState<M3Instance>();
  const [animations, setAnimations] = useState([]);
  const [wing, setWing] = useState<AttachModelConfig>();
  const [helmet, setHelmet] = useState<AttachModelConfig>();
  const [jewelry, setJewelry] = useState<AttachModelConfig>();

  //初始化模型查看器并加载默认模型
  const init = useCallback(async () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const viewer = new ModelViewer(canvas);
      viewer.gl.clearColor(0.244, 0.246, 0.249, 1);
      viewer.addHandler(handlers.mdx);
      const scene = viewer.addScene();
      //设置相机
      setupCamera(scene);
      const model = await viewer.load(name, pathSolver).whenLoaded();
      const instance = model.addInstance();
      instance.setScene(scene);
      instance.setSequence(
        model.sequences.findIndex(seq => seq.name.toLowerCase().includes('stand')) || 0,
      );
      instance.setSequenceLoopMode(2);

      const attachments = model.attachments;
      //加载各项
      for (const config of [wing, helmet, jewelry]) {
        if (config) {
          const { modelName, location } = config;
          const attachment = attachments.find(attachment => attachment.name === location);
          if (attachment) {
            const attachModel = await model.viewer
              .load(`${modelName}.mdx`, pathSolver)
              .whenLoaded();
            const attachInstance = attachModel.addInstance();
            attachInstance.setSequenceLoopMode(2);
            attachInstance.dontInheritScale = false;
            attachInstance.setParent(instance.nodes[attachment.objectId]);
            scene.addInstance(attachInstance);
            attachInstance.setSequence(
              attachModel.sequences.findIndex(seq => seq.name.toLowerCase().includes('stand')) || 0,
            );
          }
        }
      }
      setAnimations(model.sequences.map(seq => seq.name));
      setInstance(instance);
      setViewer(viewer);
    }
  }, [helmet, jewelry, name, wing]);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    // console.log(viewer);
    let requestId: number;
    const step = () => {
      viewer && viewer.updateAndRender();
      requestId = requestAnimationFrame(step);
    };
    step();
    return () => {
      cancelAnimationFrame(requestId);
    };
  }, [viewer]);
  if (!name) {
    return <div />;
  }

  return (
    <>
      <canvas ref={canvasRef} style={{ width: 600, height: innerHeight - 72 }} />
      <div className={classes.footer}>
        <div className={classes.footerRow}>
          <Select
            clearable
            style={{ width: 300 }}
            options={animations.map((name, index) => ({ label: name, value: index }))}
            values={[]}
            searchBy="label"
            dropdownPosition="auto"
            contentRenderer={({ props, state, methods }) => {
              const option = state.values[0];
              return option ? option.label : '请选择动画';
            }}
            onChange={values => {
              // console.log(values);
              if (Array.isArray(values)) {
                if (values.length === 0) {
                  instance.setSequence(
                    instance.model.sequences.findIndex(seq =>
                      seq.name.toLowerCase().includes('stand'),
                    ) || 0,
                  );
                } else {
                  instance.setSequence(values[0].value);
                }
              }
            }}
          />
          <Select
            clearable
            style={{ width: 300 }}
            options={attachWings}
            values={[]}
            valueField="id"
            searchBy="name"
            dropdownPosition="auto"
            onChange={values => {
              // console.log(values);
              Array.isArray(values) && values.length === 0 && setWing(null);
            }}
            contentRenderer={({ props, state, methods }) => {
              const option = state.values[0];
              return option ? (
                <div className={classes.attachOptionRoot}>
                  <img src={getImage(getDb('goods').find('id', option.id).img)} />
                  <div>{option.name}</div>
                </div>
              ) : (
                '请选择翅膀'
              );
            }}
            itemRenderer={({ item, itemIndex, props, state, methods }) => {
              const good = getDb('goods').find('id', item.id);
              return (
                <div
                  className={classes.attachOptionRoot}
                  onClick={() => {
                    methods.clearAll();
                    methods.addItem(item);
                    setWing(item);
                  }}
                >
                  <img src={getImage(good.img)} />
                  <div>{good.name}</div>
                </div>
              );
            }}
          />
        </div>
        <div className={classes.footerRow}>
          <Select
            clearable
            style={{ width: 300 }}
            options={attachHelmets}
            values={[]}
            valueField="id"
            searchBy="name"
            dropdownPosition="auto"
            onChange={values => Array.isArray(values) && values.length === 0 && setHelmet(null)}
            contentRenderer={({ props, state, methods }) => {
              const option = state.values[0];
              return option ? (
                <div className={classes.attachOptionRoot}>
                  <img src={getImage(getDb('goods').find('id', option.id).img)} />
                  <div>{option.name}</div>
                </div>
              ) : (
                '请选择头盔'
              );
            }}
            itemRenderer={({ item, itemIndex, props, state, methods }) => {
              const good = getDb('goods').find('id', item.id);
              return (
                <div
                  className={classes.attachOptionRoot}
                  onClick={() => {
                    methods.clearAll();
                    methods.addItem(item);
                    setHelmet(item);
                  }}
                >
                  <img src={getImage(good.img)} />
                  <div>{good.name}</div>
                </div>
              );
            }}
          />
          <Select
            clearable
            style={{ width: 300 }}
            options={attachJewelries}
            values={[]}
            valueField="id"
            searchBy="name"
            dropdownPosition="auto"
            onChange={values => Array.isArray(values) && values.length === 0 && setJewelry(null)}
            contentRenderer={({ props, state, methods }) => {
              const option = state.values[0];
              return option ? (
                <div className={classes.attachOptionRoot}>
                  <img src={getImage(getDb('goods').find('id', option.id).img)} />
                  <div>{option.name}</div>
                </div>
              ) : (
                '请选择饰品'
              );
            }}
            itemRenderer={({ item, itemIndex, props, state, methods }) => {
              const good = getDb('goods').find('id', item.id);
              return (
                <div
                  className={classes.attachOptionRoot}
                  onClick={() => {
                    methods.clearAll();
                    methods.addItem(item);
                    setJewelry(item);
                  }}
                >
                  <img src={getImage(good.img)} />
                  <div>{good.name}</div>
                </div>
              );
            }}
          />
        </div>
      </div>
    </>
  );
};

export default MdxViewer;
