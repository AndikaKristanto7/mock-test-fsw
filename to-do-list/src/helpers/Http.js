/**
 * This class is intended for making http calls (get, post, put, delete)
 * with separate functions to generate headers needed when
 * we hit our APIs
 */

import axios from 'axios'
class Http {  
  
  constructor(){
    this.cookie = document.cookie;
    this.token = '';
    if(this.cookie != ''){
      this.cookie = this.cookie.split(';')
      .map(v => v.split('='))
      .reduce((acc, v) => {
        acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
        return acc;
      }, {});
    }else{
      this.setCookie('to-do-default-cookie','todolist',30)
    }
  }

  setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
  }

  reInstateCookie(){
    this.cookie = document.cookie.split(';')
      .map(v => v.split('='))
      .reduce((acc, v) => {
        acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
        return acc;
      }, {});
    if(this.cookie !== '' && this.cookie.user){
      let userCookie = JSON.parse(this.cookie.user)
      this.token = userCookie.token
    }
  }
  
  generateHeaders(
    contentType,
    token = ""
  ) {
    const header = {}
    header['Content-Type'] = contentType
    if(token !== ""){
      header['Authorization'] = `Bearer ${token}`
    }
    return header
  }

  get(url, params) {
    let uri = url
    const esc = encodeURIComponent

    if (params) {
      const query = Object.keys(params)
        .map(k => `${esc(k)}=${esc(params[k])}`)
        .join('&')

      uri = `${url}?${query}`
    }

    // generate headers for this request
    const headers = this.generateHeaders(
        'application/json'
    )
    const response = axios({
      method: 'get',
      url: uri,
      headers
    })

    response
    .then((res) => {
        return res
    })

    return response
  }

  delete(url, params) {
    let uri = url
    const esc = encodeURIComponent
    if (params) {
      const query = Object.keys(params)
        .map(k => `${esc(k)}=${esc(params[k])}`)
        .join('&')

      uri = `${url}?${query}`
    }

    // generate headers for this request
    this.reInstateCookie()
    const headers = this.generateHeaders(
      'application/json',
      this.token
    )
    const response = axios({
      method: 'delete',
      url: uri,
      headers
    })

    response
    .then((res) => {
        return res
    })

    return response
  }

  post(url, data) {
    let payload
    let contentType
    let responseType = 'json'

    if (data.responseType === 'blob') {
      payload = JSON.stringify(data.value)
      contentType = 'application/json'
      responseType = data.responseType
    }
    else if (!data.file) {
      payload = JSON.stringify(data)
      contentType = 'application/json'
    }
    else {
      contentType = 'multipart/form-data'
      payload = new FormData()
      
      payload.append('file', data.file)
    
    }
    this.reInstateCookie()
    // generate headers for this request
    const headers = this.generateHeaders(
        contentType,
        this.token
    )
    const response = axios({
      method: 'post',
      url,
      responseType,
      data: payload,
      headers
    })

    response
    .then((res) => {
        return res
    })

    return response
  }

  put(url, data) {
    const payload = JSON.stringify(data)
    
    this.reInstateCookie()

    const headers = this.generateHeaders(
        "application/json",
        this.token
    )
    const response = axios({
      method: 'put',
      url,
      data: payload,
      headers
    })

    response
    .then((res) => {
        return res
    })

    return response
  }
}

export default new Http()
