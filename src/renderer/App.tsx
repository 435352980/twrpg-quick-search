import React from 'react';
import { render } from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import { message } from '@renderer/helper';

import { StoreProvider } from 'easy-peasy';
import store from '@renderer/store';
import Main from '@renderer/views/Main';

import { CssBaseline, createMuiTheme, ThemeProvider } from '@material-ui/core';
import blue from '@material-ui/core/colors/blue';
// 引入自定义css: react-base-table 以及 antd-message缺失的动效文件
import 'antd/es/message/style/index.css';
import './style';

const theme = createMuiTheme({
  typography: {
    button: { textTransform: 'capitalize' },
    fontFamily: `'Chinese Quote', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'`,
  },
  palette: { primary: blue },
});

message.config({ maxCount: 1, top: 80, duration: 1.2 });

const App = () => {
  return (
    <>
      <CssBaseline />
      <StoreProvider store={store}>
        <Router>
          <ThemeProvider theme={theme}>
            <Main />
          </ThemeProvider>
        </Router>
      </StoreProvider>
    </>
  );
};

render(<App />, document.querySelector('#root'));
