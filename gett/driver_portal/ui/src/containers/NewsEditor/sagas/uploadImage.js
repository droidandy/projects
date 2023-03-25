import { call, put } from 'redux-saga/effects'
import api from 'api'
import { uploadImageSuccess, uploadImageFail } from '../actions'
import { showStickyMessage } from 'containers/App/actions'

function * saga({ image, bindingHash, newsId }) {
  try {
    const form = new FormData()
    form.append('image', image, image.name)
    if (bindingHash) form.append('binding_hash', bindingHash)

    let result = {}
    if (newsId) {
      result = yield call(api().post, `/news/${newsId}/images`, form)
    } else {
      result = yield call(api().post, `/news/images`, form)
    }
    yield put(uploadImageSuccess({ imageInsert: result.data }))
    yield put(showStickyMessage({
      kind: 'success',
      text: 'News image has been successfully uploaded'
    }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('upload news image', error)
    yield put(uploadImageFail({ errors }))
    yield put(showStickyMessage({
      kind: 'error',
      text: 'Upload news image failed'
    }))
  }
}

export default saga
