/* eslint-disable @typescript-eslint/triple-slash-reference */

import React from 'react';
import {LanguageContext} from '../context/LanguageContext';

// const initialState = {
//   language: 'en',
// };

const LanguageProvider = ({children}: any) => {
  const [languageState, setLanguageState] = React.useState<string>('vn');

  const languageValue = React.useMemo(
    () => ({languageState, setLanguageState}),
    [languageState, setLanguageState],
  );

  return (
    <LanguageContext.Provider value={languageValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
