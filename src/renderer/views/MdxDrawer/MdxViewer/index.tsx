import React, { useRef, useEffect, useState, useCallback, FC } from 'react';
import styled from '@emotion/styled';
import ModelViewer from 'mdx-m3-viewer/src/viewer/viewer';
import mdxHandler from 'mdx-m3-viewer/src/viewer/handlers/mdx/handler';
import MdxModel from 'mdx-m3-viewer/src/viewer/handlers/mdx/model';
import MdxComplexInstance from 'mdx-m3-viewer/src/viewer/handlers/mdx/complexinstance';

import { useStoreState } from '@renderer/store';
import useWindowSize from '@renderer/hooks/useWindowSize';
import { AttachModelConfig } from '@renderer/dataHelper/types';
import Select from '@renderer/thirdParty/Select';

import setupCamera from './camera';

const AttachOption = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  min-height: max-content;
  cursor: pointer;
  & img {
    width: 24px;
    height: 24px;
  }
  & div {
    flex: 1;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
  }
  &:hover {
    background: #0074d9;
    color: #fff;
  }
`;

const DropDownContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  min-height: max-content;
  cursor: pointer;
  & img {
    width: 24px;
    height: 24px;
  }
  & div {
    flex: 1;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
  }
  &:hover {
    background: #0074d9;
    color: #fff;
  }
`;

const pathSolver = (path: string): [string, string, boolean] => [
  'resources/' +
    path
      .replace(/^units/, 'Units')
      .replace(/^objects/, 'Objects')
      .replace('sharedmodels', 'SharedModels')
      .replace('Replaceabletextures', 'ReplaceableTextures')
      .replace('replaceabletextures', 'ReplaceableTextures')
      .replace('abilities', 'Abilities')
      .replace('splats', 'Splats')
      .replace('Teamglow', 'TeamGlow')
      .replace('textures', 'Textures')
      .replace('units/Orc', 'Units/Orc')
      .replace('AncientofWind', 'AncientOfWind')
      .replace('BLP', 'blp'),
  path.substr(path.lastIndexOf('.')),
  true,
];

interface MdxViewerProps {
  /**
   * 模型名称
   */
  name: string;
  attaches: {
    attachHelmets: AttachModelConfig[];
    attachRings: AttachModelConfig[];
    attachWings: AttachModelConfig[];
  };
}
const MdxViewer: FC<MdxViewerProps> = ({
  name,
  attaches: { attachHelmets, attachRings, attachWings },
}) => {
  const { innerHeight } = useWindowSize();
  const local = useStoreState(state => state.app.local);
  const dataHelper = useStoreState(state => state.app.dataHelper);
  const { goodDB } = dataHelper;
  const canvasRef = useRef<HTMLCanvasElement>();
  const [viewer, setViewer] = useState<ModelViewer>();
  const [instance, setInstance] = useState<MdxComplexInstance>();
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
      viewer.addHandler(mdxHandler);
      const scene = viewer.addScene();
      //设置相机
      setupCamera(scene);
      const model = (await viewer.load(name, pathSolver).whenLoaded()) as MdxModel;
      const instance = model.addInstance() as MdxComplexInstance;
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
            const attachModel = (await model.viewer
              .load(`${modelName}.mdx`, pathSolver)
              .whenLoaded()) as MdxModel;
            const attachInstance = attachModel.addInstance() as MdxComplexInstance;
            attachInstance.setSequenceLoopMode(2);
            attachInstance.dontInheritScaling = false;
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
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex' }}>
          <Select
            clearable
            style={{ width: 300 }}
            options={animations.map((name, index) => ({ label: name, value: index }))}
            values={[]}
            searchBy="label"
            dropdownPosition="auto"
            contentRenderer={({ props, state, methods }) => {
              const option = state.values[0];
              return option ? option.label : local.views.mdx.selectAnimation;
            }}
            onChange={values => {
              // console.log(values);
              if (Array.isArray(values)) {
                if (values.length === 0) {
                  instance.setSequence(
                    (instance.model as MdxModel).sequences.findIndex(seq =>
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
              Array.isArray(values) && values.length === 0 && setWing(null);
            }}
            contentRenderer={({ props, state, methods }) => {
              const option = state.values[0];
              return option ? (
                <DropDownContent>
                  <img src={goodDB.find('id', option.id).imgData} />
                  <div>{option.name}</div>
                </DropDownContent>
              ) : (
                local.views.mdx.selectWing
              );
            }}
            itemRenderer={({ item, itemIndex, props, state, methods }) => {
              const good = goodDB.find('id', item.id);
              return (
                <AttachOption
                  onClick={() => {
                    methods.clearAll();
                    methods.addItem(item);
                    setWing(item);
                  }}
                >
                  <img src={good.imgData} />
                  <div>{good.name}</div>
                </AttachOption>
              );
            }}
          />
        </div>
        <div style={{ display: 'flex' }}>
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
                <AttachOption>
                  <img src={goodDB.find('id', option.id).imgData} />
                  <div>{option.name}</div>
                </AttachOption>
              ) : (
                local.views.mdx.selectHelmet
              );
            }}
            itemRenderer={({ item, itemIndex, props, state, methods }) => {
              const good = goodDB.find('id', item.id);
              return (
                <AttachOption
                  onClick={() => {
                    methods.clearAll();
                    methods.addItem(item);
                    setHelmet(item);
                  }}
                >
                  <img src={good.imgData} />
                  <div>{good.name}</div>
                </AttachOption>
              );
            }}
          />
          <Select
            clearable
            style={{ width: 300 }}
            options={attachRings}
            values={[]}
            valueField="id"
            searchBy="name"
            dropdownPosition="auto"
            onChange={values => Array.isArray(values) && values.length === 0 && setJewelry(null)}
            contentRenderer={({ props, state, methods }) => {
              const option = state.values[0];
              return option ? (
                <AttachOption>
                  <img src={goodDB.find('id', option.id).imgData} />
                  <div>{option.name}</div>
                </AttachOption>
              ) : (
                local.views.mdx.selectRing
              );
            }}
            itemRenderer={({ item, itemIndex, props, state, methods }) => {
              const good = goodDB.find('id', item.id);
              return (
                <AttachOption
                  onClick={() => {
                    methods.clearAll();
                    methods.addItem(item);
                    setJewelry(item);
                  }}
                >
                  <img src={good.imgData} />
                  <div>{good.name}</div>
                </AttachOption>
              );
            }}
          />
        </div>
      </div>
    </>
  );
};

export default MdxViewer;
