import { OpenInNew as OpenInNewIcon } from '@styled-icons/material/OpenInNew';
import { Menu as MenuIcon } from '@styled-icons/material/Menu';
import React, { Fragment, useEffect } from 'react';
import { translate } from 'react-polyglot';
import { Link } from 'react-router-dom';

import { checkBackendStatus } from '@staticcms/core/actions/status';
import { selectDisplayUrl } from '@staticcms/core/reducers/selectors/config';
import { useAppDispatch, useAppSelector } from '@staticcms/core/store/hooks';
import Button from '../common/button/Button';
import QuickCreate from './QuickCreate';
import SettingsDropdown from './SettingsDropdown';

import type { TranslatedProps } from '@staticcms/core/interface';
import type { ComponentType, ReactNode } from 'react';

export interface BottomNavbarProps {
  toggleSidebar: () => void;
  showQuickCreate?: boolean;
  navbarActions?: ReactNode;
  showSidebarToggle?: boolean;
}

const BottomNavbar = ({
  showQuickCreate = false,
  navbarActions = null,
  showSidebarToggle=false,
  toggleSidebar
}: TranslatedProps<BottomNavbarProps>) => {
  const dispatch = useAppDispatch();

  const displayUrl = useAppSelector(selectDisplayUrl);

  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(checkBackendStatus());
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [dispatch]);

  return (
    <nav className="bg-white dark:bg-slate-800 z-40 fixed bottom-0 left-0 right-0 border-t border-slate-200 dark:border-gray-700">
      <div key="nav" className="mx-auto pl-4 pr-4">
        <div className="relative flex flex-wrap h-12 items-center grow">
          <div className="flex grow gap-4 items-center justify-between">
            {showSidebarToggle ? (<Button variant='text' onClick={toggleSidebar}>
                <MenuIcon className='h-5 w-8' />
            </Button>) : null}
            {showQuickCreate ? <QuickCreate key="quick-create" isMobile /> : null}
            {displayUrl ? (
              <Button variant="text" className="flex gap-2" href={displayUrl}>
                <OpenInNewIcon className="h-5 w-5" />
              </Button>
            ) : null}
            {navbarActions}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default translate()(BottomNavbar) as ComponentType<BottomNavbarProps>;
