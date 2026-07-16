import { useCallback, useState } from 'react';

//import constants
import { colors } from '@/constants';

//import components
import NormalHeader from './normal-header';

//import types
import type { PageHeaderProps } from './types';

/**
 * Selects and coordinates the configured page-header presentation.
 */
const PageHeader = ({
  navigation,
  placeholder = 'Search',
  loaderStatus = false,
  headerType = 'normalHeader',
  headerTitle = '',
  headerTitleColor = colors.baseWhite,
  iconArr = [],
  backBtn = false,
  crossBtn = false,
  customClickEvent,
  rightBtnClickEvent,
  searchBlur,
  searchEvent,
}: PageHeaderProps) => {
  //states
  const [searchStatus, setSearchStatus] = useState(false);

  //toggles the active header search state
  const updateSearchStatus = useCallback(() => {
    setSearchStatus((status) => !status);
  }, []);

  return (
    <>
      {headerType === 'normalHeader' && (
        <NormalHeader
          navigation={navigation}
          headerTitle={headerTitle}
          headerTitleColor={headerTitleColor}
          placeholder={placeholder}
          loaderStatus={loaderStatus}
          backBtn={backBtn}
          crossBtn={crossBtn}
          iconArr={iconArr}
          customClickEvent={customClickEvent}
          rightBtnClickEvent={rightBtnClickEvent}
          searchStatus={searchStatus}
          textChangeEvent={searchEvent}
          searchBlur={searchBlur}
          updateSearchStatus={updateSearchStatus}
        />
      )}
    </>
  );
};

export default PageHeader;
