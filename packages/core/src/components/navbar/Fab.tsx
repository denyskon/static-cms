import { Add as AddIcon } from '@styled-icons/material/Add';
import React from 'react';
import { translate } from 'react-polyglot';

import type { TranslateProps } from 'react-polyglot';

import Button from '../common/button/Button';

const Fab = ({ t }: TranslateProps) => {

  return (
    <Button
            className="
              btn-rounded
              btn-contained-primary
              fixed
              z-90
              bottom-6
              right-6
              drop-shadow
            "
          >
            <AddIcon className='h-8 w-8' />
          </Button>
  );
};

export default translate()(Fab);