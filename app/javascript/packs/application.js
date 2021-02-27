// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

import Rails from "@rails/ujs"
import Turbolinks from "turbolinks"
import * as ActiveStorage from "@rails/activestorage"
import "channels"

Rails.start()
Turbolinks.start()
ActiveStorage.start()

document.addEventListener('turbolinks:load', initImageUpload)

function initImageUpload() {
  const input = document.querySelector('.js-image-upload')
  if (!input) return

  let img
  input.addEventListener('change', () => {
    const [file] = input.files
    const csrfToken = Rails.csrfToken()

    const xhr = new XMLHttpRequest()
    xhr.open("POST", '/blobs', true)
    xhr.responseType = "json"
    xhr.setRequestHeader("X-CSRF-Token", csrfToken)

    xhr.addEventListener("load", event => requestDidLoad(event))
    xhr.addEventListener("error", event => requestDidError(event))

    const formdata = new FormData()
    formdata.append('file', file)
    xhr.send(formdata)

    function requestDidLoad(event) {
      const status = xhr.status
      if (status >= 200 && status < 300) {
        const { response } = xhr
        const { signed_id, url } = response
        setSignedId(signed_id)
        showImage(url)
      } else {
        requestDidError(event)
      }
    }

    function requestDidError(event) {
      console.error('request did error', event)
    }

    function setSignedId(signedId) {
      const hidden = document.createElement('input')
      hidden.type = 'hidden'
      hidden.name = 'comment[image]'
      hidden.value = signedId
      input.insertAdjacentElement('beforebegin', hidden)
    }

    function showImage(url) {
      if (!img) {
        img = document.createElement('img')
        img.width = '100'
        img.height = '100'
        input.insertAdjacentElement('beforebegin', img)
      }
      img.src = url
    }
  })
}
