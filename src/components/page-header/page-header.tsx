import { useCallback, useState } from 'react';

//import constants
import { colors } from '@/constants';

//import types
import type { PageHeaderProps } from './types';

//import different headers
import NormalHeader from './normal-header';

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
  const [searchStatus, setSearchStatus] = useState(false);
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
