import createOidcMiddleware from 'redux-oidc'
import ReduxThunk from 'redux-thunk'
import storage from 'redux-persist/lib/storage'
import { createStore, compose, applyMiddleware } from 'redux'
import { routerMiddleware, connectRouter } from 'connected-react-router'

import { persistStore, persistReducer } from 'redux-persist'
import { multiClientMiddleware } from 'redux-axios-middleware'

import history from './history'
import rootReducer from './rootReducer'
import initialState from './initial-state'
import clients from './clients'
import { userManager } from '../features/Auth'

const oidcMiddleware = createOidcMiddleware(userManager)

const createStoreWithMiddlewares = compose(
  applyMiddleware(
    routerMiddleware(history),
    ReduxThunk,
    oidcMiddleware,
    multiClientMiddleware(clients)
  )
)(createStore)

const reducerWithRouter = connectRouter(history)(rootReducer)

const reduxWithPersist = persistReducer(
  { key: 'root', storage },
  reducerWithRouter
)

const store = createStoreWithMiddlewares(
  reduxWithPersist,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

const persistor = persistStore(store)

export default store
export { persistor }
