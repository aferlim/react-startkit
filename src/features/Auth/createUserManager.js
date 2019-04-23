import { UserManager, Log, MetadataService } from 'oidc-client'

class AzureADMetadataService extends MetadataService {
  getUrllogout() {
    const url = super.getMetadata().then(metadata => {
      const urlLogout = metadata.authorization_endpoint.replace(
        '/oauth2/authorize',
        ''
      )

      return Promise.resolve(
        `${urlLogout}/logout?client_id=${
          this._settings._client_id
        }&response_type=token&redirect_uri=${this._settings._redirect_uri}`
      )
    })

    return url
  }

  getEndSessionEndpoint() {
    console.log(this.getUrllogout())
    return Promise.resolve(this.getUrllogout())
  }
}

class AzureADUserManager extends UserManager {
  _signinStart(args, navigator, navigatorParams = {}) {
    Log.debug('_signinStart for Cognito')

    return navigator.prepare(navigatorParams).then(handle => {
      Log.debug('got navigator window handle')

      return this.createSigninRequest(args)
        .then(signinRequest => {
          Log.debug('got signin request')

          const nav = navigatorParams
          nav.url = signinRequest.url.replace('%20id_token', '')
          nav.id = signinRequest.state.id

          return handle.navigate(nav)
        })
        .catch(err => {
          if (handle.close) {
            Log.debug(
              'Error after preparing navigator, closing navigator window'
            )
            handle.close()
          }
          throw err
        })
    })
  }
}

const createUserManager = settings =>
  new AzureADUserManager({
    ...settings,
    MetadataServiceCtor: AzureADMetadataService
  })

export default createUserManager
