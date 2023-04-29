import { OpenInNew as OpenInNewIcon } from '@styled-icons/material/OpenInNew';
import { Menu as MenuIcon } from '@styled-icons/material/Menu';
import React, { Fragment, useEffect } from 'react';
import { translate } from 'react-polyglot';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';

import { checkBackendStatus } from '@staticcms/core/actions/status';
import { selectDisplayUrl } from '@staticcms/core/reducers/selectors/config';
import { useAppDispatch, useAppSelector } from '@staticcms/core/store/hooks';
import Button from '../common/button/Button';
import { StaticCmsIcon } from '../images/_index';
import QuickCreate from './QuickCreate';
import SettingsDropdown from './SettingsDropdown';

import type { Breadcrumb, TranslatedProps } from '@staticcms/core/interface';
import type { ComponentType, ReactNode } from 'react';
import classNames from '@staticcms/core/lib/util/classNames.util';

export interface NavbarProps {
  breadcrumbs?: Breadcrumb[];
  showQuickCreate?: boolean;
  navbarActions?: ReactNode;
  showSidebarToggle?: boolean;
}

const Navbar = ({
  showQuickCreate = false,
  navbarActions = null,
  breadcrumbs = [],
  showSidebarToggle = false,
}: TranslatedProps<NavbarProps>) => {
  const isMobile = useMediaQuery({ maxWidth: 640 });

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
    <nav className="bg-white dark:bg-slate-800 drop-shadow-lg z-40 relative">
      <div key="nav" className={classNames(!showSidebarToggle ? "pl-4 sm:pl-0" : "", "mx-auto pr-2 sm:pr-4 lg:pr-5")}>
        <div className="relative flex flex-wrap h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-left h-full sm:items-stretch sm:justify-start gap-4">
            { !isMobile || showSidebarToggle ?
              (<div className="flex flex-shrink-0 items-center justify-center bg-slate-500 dark:bg-slate-700 w-16 h-16">
              { isMobile ? 
                <MenuIcon className="h-10 w-10 rounded-full py-1.5 px-1.5 active:animate-spin text-white hover:border hover:border-gray-200" onClick={() => console.log("toggle!")} />
               : (<StaticCmsIcon className="inline-flex w-10 h-10" />)
              } 
            </div>) : null
                        }
            <div className="flex h-full items-center text-xl font-semibold gap-1 text-gray-800 dark:text-white">
              {breadcrumbs.map((breadcrumb, index) =>
                breadcrumb.name ? (
                  <Fragment key={`breadcrumb-${index}`}>
                    {index > 0 ? <span key={`separator-${index}`}>&#62;</span> : null}
                    {breadcrumb.to ? (
                      <Link
                        key={`link-${index}`}
                        className="hover:text-gray-400 dark:hover:text-gray-400"
                        to={breadcrumb.to}
                      >
                        {breadcrumb.name}
                      </Link>
                    ) : (
                      <span key={`text-${index}`} className='text-ellipsis overflow-hidden'>{breadcrumb.name}</span>
                    )}
                  </Fragment>
                ) : null,
              )}
            </div>
          </div>
          <div className="flex gap-3 items-center">
            {displayUrl ? (
              <Button variant="text" className="flex gap-2" href={displayUrl}>
                {!isMobile ? displayUrl : null}
                <OpenInNewIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </Button>
            ) : null}
            {showQuickCreate && !isMobile ? <QuickCreate key="quick-create" /> : null}
            {navbarActions}
            <SettingsDropdown />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default translate()(Navbar) as ComponentType<NavbarProps>;
