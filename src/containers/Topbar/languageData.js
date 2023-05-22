import React from "react";
import IntlMessages from "util/IntlMessages";
const languageData = [
  {
    languageId: 'english',
    locale: 'en',
    name: <IntlMessages id="language.English"/>,
    icon: 'us'
  },
  {
    languageId: 'spanish',
    locale: 'es',
    name: <IntlMessages id="language.Spanish"/>,
    icon: 'es'
  },
  {
    languageId: 'catalan',
    locale: 'ct',
    name: <IntlMessages id="language.Catalan"/>,
    icon: 'ct'
  }
  // {
  //   languageId: 'french',
  //   locale: 'fr',
  //   name: 'French',
  //   icon: 'fr'
  // },
  // {
  //   languageId: 'italian',
  //   locale: 'it',
  //   name: 'Italian',
  //   icon: 'it'
  // },
  // {
  //   languageId: 'saudi-arabia',
  //   locale: 'ar',
  //   name: 'Arabic',
  //   icon: 'sa'
  // },
  // {
  //   languageId: 'chinese',
  //   locale: 'zh',
  //   name: 'Chinese',
  //   icon: 'cn'
  // }

];
export default languageData;
