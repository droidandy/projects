import { call, put } from 'redux-saga/effects'
import api from 'api'
import { updateAvatarSuccess, updateAvatarFail } from '../actions'
import { loadCurrentUser, showStickyMessage } from 'containers/App/actions'
import { dataURLtoFile } from 'utils/file'

function * saga({ file, history }) {
  try {
    const form = new FormData()
    form.append('avatar', dataURLtoFile(file.dataURI, file.name), file.name)
    yield call(api().put, `/session/avatar`, form)

    yield put(updateAvatarSuccess())
    yield put(loadCurrentUser())
    yield call(history.push, '/profile/edit')
    yield put(showStickyMessage({
      kind: 'success',
      text: 'Avatar has been successfully updated'
    }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('upload user avatar', error)
    yield put(updateAvatarFail({ errors }))
  }
}

export default saga
