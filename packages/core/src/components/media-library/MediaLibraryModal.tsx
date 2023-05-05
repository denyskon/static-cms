import { Close as CloseIcon } from '@styled-icons/material/Close';
import React, { useCallback } from 'react';

import { closeMediaLibrary } from '@staticcms/core/actions/mediaLibrary';
import { selectVisible } from '@staticcms/core/reducers/selectors/mediaLibrary';
import { useAppDispatch, useAppSelector } from '@staticcms/core/store/hooks';
import IconButton from '../common/button/IconButton';
import Modal from '../common/modal/Modal';
import MediaLibrary from './common/MediaLibrary';

import type { FC } from 'react';

const MediaLibraryModal: FC = () => {
  const dispatch = useAppDispatch();
  const isVisible = useAppSelector(selectVisible);

  const handleClose = useCallback(() => {
    dispatch(closeMediaLibrary());
  }, [dispatch]);

  return (
    <Modal
      open={isVisible}
      onClose={handleClose}
      className="
        rounded-none
        sm:rounded-lg
        w-full
        sm:w-media-library-dialog
        h-full
        sm:h-media-library-dialog
      "
    >
      <MediaLibrary canInsert isDialog closeDialog={handleClose} />
    </Modal>
  );
};

export default MediaLibraryModal;
