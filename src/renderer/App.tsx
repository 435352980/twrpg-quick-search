import React from 'react';
import { render } from 'react-dom';
import { StoreProvider } from 'easy-peasy';

import { CssBaseline, createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import blue from '@material-ui/core/colors/blue';
import { createHistory, createMemorySource, LocationProvider } from '@reach/router';
import { fontFamilyStyle } from './theme/common';
import store from '@/store';

import Header from '@/views/Header';
import Frame from '@/views/Frame';

import 'fixed-data-table-2/dist/fixed-data-table.css';
import 'react-table/react-table.css';
import 'react-virtualized/styles.css';

const theme = createMuiTheme({
  typography: { fontFamily: fontFamilyStyle },
  palette: { primary: blue },
});

const App = () => (
  <StoreProvider store={store}>
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <LocationProvider history={createHistory(createMemorySource('/'))}>
        {location => (
          <>
            <Header navigate={location.navigate} />
            <Frame {...location} />
          </>
        )}
      </LocationProvider>
    </MuiThemeProvider>
  </StoreProvider>
);

render(<App />, document.querySelector('#root'));
