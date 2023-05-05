import React, { useCallback, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import TopBarProgress from 'react-topbar-progress-indicator';

import classNames from '../lib/util/classNames.util';
import Navbar from './navbar/Navbar';
import Sidebar from './navbar/Sidebar';

import type { ReactNode } from 'react';
import type { Breadcrumb } from '../interface';
import BottomNavbar from './navbar/BottomNavbar';

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

  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const handleToggleSidebar = useCallback(() => {
    if (sidebarCollapsed) {
      setSidebarCollapsed(false);
    } else {
      setSidebarCollapsed(true);
    }
  }, [sidebarCollapsed])

  return (
    <>
      <Navbar
        breadcrumbs={breadcrumbs}
        showQuickCreate={showQuickCreate}
        navbarActions={navbarActions}
        isMobile={isMobile}
      />
      <div className="flex bg-slate-50 dark:bg-slate-900">
        {showLeftNav ? <Sidebar collapseSidebar={() => setSidebarCollapsed(true)} isMobile={isMobile} sidebarCollapsed={sidebarCollapsed} /> : null}
        <div
          className={classNames(
            showLeftNav && !isMobile ? 'w-main left-64' : 'w-full',
            !noMargin && 'px-5 py-4',
            noScroll ? 'overflow-hidden' : 'overflow-y-auto',
            `
              h-main-mobile
              sm:h-main
              relative
              styled-scrollbars
            `,
          )}
        >
          {children}
        </div>
      </div>
      {isMobile ? <BottomNavbar 
        showQuickCreate={showQuickCreate}
        navbarActions={navbarActions}
        showSidebarToggle={showLeftNav}
        toggleSidebar={handleToggleSidebar}
      /> : null}
    </>
  );
};

export default MainView;
