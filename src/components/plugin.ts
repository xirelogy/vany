import {
  App,
  Component as VueComponent,
} from 'vue';

import {
  _cast,
} from '@xirelogy/xwts';

import * as comp from '../components/index';


/**
 * Initialization
 * @param app
 */
export default function pluginInitComponents(app: App) {
  app.component('VanyApp', comp.VanyApp);
  app.component('VanyAutocomplete', comp.VanyAutocomplete);
  app.component('VanyBreadcrumb', comp.VanyBreadcrumb);
  app.component('VanyBreadcrumbItem', comp.VanyBreadcrumbItem);
  app.component('VanyButton', comp.VanyButton);
  app.component('VanyCard', comp.VanyCard);
  app.component('VanyCheck', _cast<VueComponent>(comp.VanyCheck));
  app.component('VanyContainer', comp.VanyContainer);
  app.component('VanyDateInput', _cast<VueComponent>(comp.VanyDateInput));
  app.component('VanyDialog', comp.VanyDialog);
  app.component('VanyDiv', comp.VanyDiv);
  app.component('VanyDrawer', comp.VanyDrawer);
  app.component('VanyDropdownMenu', comp.VanyDropdownMenu);
  app.component('VanyForm', comp.VanyForm);
  app.component('VanyFormItem', comp.VanyFormItem);
  app.component('VanyIcon', comp.VanyIcon);
  app.component('VanyImageInput', comp.VanyImageInput);
  app.component('VanyImagesInput', comp.VanyImagesInput);
  app.component('VanyInput', _cast<VueComponent>(comp.VanyInput));
  app.component('VanyInputFrame', comp.VanyInputFrame);
  app.component('VanyInputGroup', comp.VanyInputGroup);
  app.component('VanyList', comp.VanyList);
  app.component('VanyMenu', comp.VanyMenu);
  app.component('VanyMenuDivider', comp.VanyMenuDivider);
  app.component('VanyMenuItem', comp.VanyMenuItem);
  app.component('VanyOption', comp.VanyOption);
  app.component('VanyProgress', comp.VanyProgress);
  app.component('VanyRadio', comp.VanyRadio);
  app.component('VanyRadioGroup', _cast<VueComponent>(comp.VanyRadioGroup));
  app.component('VanySelect', _cast<VueComponent>(comp.VanySelect));
  app.component('VanyTable', comp.VanyTable);
  app.component('VanyTableColumn', comp.VanyTableColumn);
  app.component('VanyTabPane', comp.VanyTabPane);
  app.component('VanyTabs', comp.VanyTabs);
  app.component('VanyTag', comp.VanyTag);
  app.component('VanyTimeInput', _cast<VueComponent>(comp.VanyTimeInput));
}