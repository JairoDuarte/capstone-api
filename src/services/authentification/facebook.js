'use strict'

import request from 'request-promise'

const getUser = (accessToken) =>
  request({
    uri: 'https://graph.facebook.com/me',
    json: true,
    qs: {
      access_token: accessToken,
      fields: 'id, name, email, picture'
    }
  }).then(({ id, name, email, picture }) => ({
    service: 'facebook',
    id,
    email,
    name,
    image: picture.data.url
  }))

export default getUser;