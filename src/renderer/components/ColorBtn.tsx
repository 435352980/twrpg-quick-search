import { Button } from '@material-ui/core';
import styled from '@emotion/styled';

const ColorBtn = styled(Button)`
  margin: 4px;
  flex: 1.3;
  font-size: 1rem;
  border: 0;
  border-radius: 3px;
  background: ${({ color }) =>
    color === 'primary'
      ? 'linear-gradient(132deg, #68ade2 0%, #55b0ff 100%);'
      : 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%);'};
  box-shadow: ${({ color }) =>
    color === 'primary'
      ? '0 3px 5px 2px rgba(33, 203, 243, .3);'
      : '0 3px 5px 2px rgba(255, 105, 135, .3);'};
  color: white;
`;

// const ColorBtn: React.FC<Omit<ButtonProps, 'color'> & { color: string }> = props => {
//   const { color, className = '', ...other } = props;
//   const classes = useStyles();
//   return (
//     <Button
//       className={`${color === 'red' ? classes.redBtn : classes.blueBtn} ${className}`}
//       {...other}
//     />
//   );
// };

export default ColorBtn;
