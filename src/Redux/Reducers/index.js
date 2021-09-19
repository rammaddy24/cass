import { combineReducers } from 'redux'

import { stack } from './navigation';
import CommonReducer from './CommonReducer'

const rootReducer = combineReducers({
   CommonReducer,stack
   
})

export default rootReducer
