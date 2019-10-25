export default {
  // className: '-striped -highlight',
  className: '-highlight',
  // style: { width: 680 }, // 683
  resizable: false,
  getTdProps: () => ({
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    },
  }),
  showPagination: false,
  sortable: false,
  NoDataComponent: () => null,
};
