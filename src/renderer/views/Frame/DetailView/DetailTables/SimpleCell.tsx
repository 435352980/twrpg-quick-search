import React from 'react';
import { Typography } from '@material-ui/core';
import { TypographyProps } from '@material-ui/core/Typography';

const SimpleCell: React.FC<TypographyProps> = props => <Typography variant="body1" {...props} />;

export default SimpleCell;
