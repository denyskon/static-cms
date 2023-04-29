import React from 'react';
import { useMediaQuery } from 'react-responsive';
import TopBarProgress from 'react-topbar-progress-indicator';

import classNames from '../lib/util/classNames.util';
import Fab from './navbar/Fab';
import Navbar from './navbar/Navbar';
import Sidebar from './navbar/Sidebar';

import type { ReactNode } from 'react';
import type { Breadcrumb } from '../interface';

TopBarProgress.config({
  barColors: {
    0: '#000',
    '1.0': '#000',
  },
  shadowBlur: 0,
  barThickness: 2,
});

interface MainViewProps {
  breadcrumbs?: Breadcrumb[];
  showQuickCreate?: boolean;
  navbarActions?: ReactNode;
  showLeftNav?: boolean;
  noMargin?: boolean;
  noScroll?: boolean;
  children: ReactNode;
}

const MainView = ({
  children,
  breadcrumbs,
  showQuickCreate = false,
  showLeftNav = false,
  noMargin = false,
  noScroll = false,
  navbarActions,
}: MainViewProps) => {
  const isMobile = useMediaQuery({ maxWidth: 640 });

  return (
    <>
      <Navbar
        breadcrumbs={breadcrumbs}
        showQuickCreate={showQuickCreate}
        navbarActions={navbarActions}
        showSidebarToggle={showLeftNav && isMobile}
      />
      <div className="flex bg-slate-50 dark:bg-slate-900">
        {showLeftNav && !isMobile ? <Sidebar /> : null}
        <div
          className={classNames(
            showLeftNav && !isMobile ? 'w-main left-64' : 'w-full',
            !noMargin && 'px-5 py-4',
            noScroll ? 'overflow-hidden' : 'overflow-y-auto',
            `
              h-main
              relative
              styled-scrollbars
            `,
          )}
        >
          {children}
        </div>
        {isMobile && showQuickCreate ? <Fab /> : null}
      </div>
    </>
  );
};

export default MainView;
