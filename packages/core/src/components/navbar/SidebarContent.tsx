import { Photo as PhotoIcon } from '@styled-icons/material/Photo';
import React, { useCallback, useMemo } from 'react';
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
import sidebarClasses from './Sidebar.classes';

import type { Collection } from '@staticcms/core/interface';
import type { FC } from 'react';
import type { TranslateProps } from 'react-polyglot';

const SidebarContent: FC<TranslateProps> = ({ t }) => {
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
            <NavLink key={collectionName} to={`/collections/${collectionName}`} icon={icon}>
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
    <div className={classNames(sidebarClasses.content, 'CMS_Scrollbar_root')}>
      <ul className={sidebarClasses.items}>
        {isSearchEnabled && (
          <CollectionSearch
            searchTerm={searchTerm}
            collections={collections}
            collection={collection}
            onSubmit={(query: string, collection?: string) => searchCollections(query, collection)}
          />
        )}
        {collectionLinks}
        {links}
        <NavLink
          key="Media"
          to="/media"
          icon={<PhotoIcon className={sidebarClasses['media-icon']} />}
        >
          {t('app.header.media')}
        </NavLink>
      </ul>
    </div>
  );
};

export default translate()(SidebarContent) as FC;
