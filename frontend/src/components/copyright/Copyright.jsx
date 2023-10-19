import React from 'react';

import { Box } from '@mui/material';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

const Copyright = (props) => {
  return (
    <Box {...props}>
      <Typography variant='body2' align='center'>
        {'Copyright © '}
        <Link color='inherit' href='#'>
          TechnoDynamic
        </Link>
        {` `} {new Date().getFullYear()}
        {'.'}
      </Typography>
    </Box>
  );
};

export default Copyright;
