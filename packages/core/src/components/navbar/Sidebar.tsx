import { Photo as PhotoIcon } from '@styled-icons/material/Photo';
import React, { ComponentType, useCallback, useMemo } from 'react';
import { translate } from 'react-polyglot';
import { useNavigate, useParams } from 'react-router-dom';

import { getIcon } from '@staticcms/core/lib/hooks/useIcon';
import { getAdditionalLinks } from '@staticcms/core/lib/registry';
import classNames from '@staticcms/core/lib/util/classNames.util';
import { selectCollections } from '@staticcms/core/reducers/selectors/collections';
import { selectIsSearchEnabled } from '@staticcms/core/reducers/selectors/config';
import { useAppSelector } from '@staticcms/core/store/hooks';
import CollectionSearch from '../collections/CollectionSearch';
import NestedCollection from '../collections/NestedCollection';
import NavLink from './NavLink';

import type { Collection, TranslatedProps } from '@staticcms/core/interface';

export interface SidebarProps {
  collapseSidebar: () => void;
  isMobile?: boolean;
  sidebarCollapsed?: boolean;
} 

const Sidebar = ({ isMobile = false, sidebarCollapsed = true, collapseSidebar, t }: TranslatedProps<SidebarProps>) => {
  const { name, searchTerm, ...params } = useParams();
  const filterTerm = useMemo(() => params['*'] ?? '', [params]);

  const navigate = useNavigate();
  const isSearchEnabled = useAppSelector(selectIsSearchEnabled);
  const collections = useAppSelector(selectCollections);

  const collection = useMemo(
    () => (name ? collections[name] : collections[0]) as Collection | undefined,
    [collections, name],
  );

  const collectionLinks = useMemo(
    () =>
      Object.values(collections)
        .filter(collection => collection.hide !== true)
        .map(collection => {
          const collectionName = collection.name;
          const icon = getIcon(collection.icon);

          if ('nested' in collection) {
            return (
              <NestedCollection
                key={`nested-${collectionName}`}
                collection={collection}
                filterTerm={filterTerm}
                data-testid={collectionName}
              />
            );
          }

          return (
            <NavLink key={collectionName} to={`/collections/${collectionName}`} icon={icon} onClick={collapseSidebar}>
              {collection.label}
            </NavLink>
          );
        }),
    [collections, filterTerm],
  );

  const additionalLinks = useMemo(() => getAdditionalLinks(), []);
  const links = useMemo(
    () =>
      Object.values(additionalLinks).map(
        ({ id, title, data, options: { icon: iconName } = {} }) => {
          const icon = getIcon(iconName);

          return typeof data === 'string' ? (
            <NavLink key={title} href={data} icon={icon}>
              {title}
            </NavLink>
          ) : (
            <NavLink key={title} to={`/page/${id}`} icon={icon}>
              {title}
            </NavLink>
          );
        },
      ),
    [additionalLinks],
  );

  const searchCollections = useCallback(
    (query?: string, collection?: string) => {
      if (!query) {
        return;
      }

      if (collection) {
        navigate(`/collections/${collection}/search/${query}`);
      } else {
        navigate(`/search/${query}`);
      }
    },
    [navigate],
  );

  return (
    <aside
      id='sidebar'
      className={classNames(
        'w-sidebar-expanded',
        'h-main-mobile sm:h-main sm:block fixed z-30 shadow-sidebar lg:block lg:z-auto lg:shadow-none',
        isMobile && sidebarCollapsed ? 'hidden' : null,
      )}
      aria-label="Sidebar"
    >
      <div
        className="
          px-3
          py-4
          h-full
          w-full
          overflow-y-auto
          bg-white
          dark:bg-slate-800
          styled-scrollbars
        "
      >
        <ul className="space-y-2">
          {isSearchEnabled && (
            <CollectionSearch
              searchTerm={searchTerm}
              collections={collections}
              collection={collection}
              onSubmit={(query: string, collection?: string) =>
                searchCollections(query, collection)
              }
            />
          )}
          {collectionLinks}
          {links}
          <NavLink key="Media" to="/media" icon={<PhotoIcon className="h-6 w-6" />}>
            {t('app.header.media')}
          </NavLink>
        </ul>
      </div>
    </aside>
  );
};

export default translate()(Sidebar) as ComponentType<SidebarProps>;
