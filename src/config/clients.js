import axios from 'axios'

export default {
  sandbox: {
    client: axios.create({
      baseURL: 'https://react-todolist.getsandbox.com/',
      responseType: 'json'
    })
  }
}
