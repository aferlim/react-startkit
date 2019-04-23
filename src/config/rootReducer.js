import { combineReducers } from 'redux'
import { reducer as oidcReducer } from 'redux-oidc'

const premmiar = (state = { premmiar }) => ({ ...state })

const rootReducer = combineReducers({
  oidc: oidcReducer,
  premmiar
})

export default rootReducer
