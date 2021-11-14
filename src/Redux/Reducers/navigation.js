import { NavigationActions } from 'react-navigation';

import { Stack } from '../../Router/Stack/navigationConfiguration';

export function stack(state, action) {
  switch (action.type) {
   
      case 'Timesheets_DataAction': {
        const navigationAction = NavigationActions.navigate({
          routeName: 'View_Timesheets',
        });
        return Stack.router.getStateForAction(navigationAction, state);
      }

      case 'Timesheets_EditAction': {
        const navigationAction = NavigationActions.navigate({
          routeName: 'Edit_Timesheet',
        });
        return Stack.router.getStateForAction(navigationAction, state);
      }
      
      case 'Draft_EditAction': {
        const navigationAction = NavigationActions.navigate({
          routeName: 'Edit_Timesheet',
          params: { draftList: true},
        });
        return Stack.router.getStateForAction(navigationAction, state);
      }

      case 'Draft_DataAction': {
        const navigationAction = NavigationActions.navigate({
          routeName: 'View_Timesheets',
          params: { draftList: true},
        });
        return Stack.router.getStateForAction(navigationAction, state);
      }

      case 'Addmore_TSdata': {
        const navigationAction = NavigationActions.navigate({
          routeName: 'AddMore_Timesheet',
        });
        return Stack.router.getStateForAction(navigationAction, state);
      }
      
    default: return Stack.router.getStateForAction(action, state);
  }
}




