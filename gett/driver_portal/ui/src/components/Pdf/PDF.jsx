import React, { Component } from 'react'

import pdfjs from 'pdfjs-dist'
import { map } from 'lodash'

import PdfPage from './PdfPage'
import PdfPagePagination from './PdfPagePagination'

const makeCancelable = (promise) => {
  let hasCanceled = false

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(val => (
      hasCanceled ? reject(new Error({ pdf: val, isCanceled: true })) : resolve(val)
    ))
    promise.catch(error => (
      hasCanceled ? reject(new Error({ isCanceled: true })) : reject(error)
    ))
  })

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled = true
    }
  }
}

const SCALE_DEFAULT = 1.0

class Pdf extends Component {
  static defaultProps = {
    scale: SCALE_DEFAULT
  }

  state = {}

  componentDidMount() {
    this.loadPDFDocument(this.props)
  }

  componentWillUnmount() {
    const { pdf } = this.state
    if (pdf) {
      pdf.destroy()
    }
    if (this.documentPromise) {
      this.documentPromise.cancel()
    }
  }

  onDocumentComplete = (pdf) => {
    this.setState({ pdf })
    const { onDocumentComplete, pagination } = this.props
    if (typeof onDocumentComplete === 'function') {
      onDocumentComplete(pdf.numPages)
    }
    if (!pagination) pdf.getData()
  }

  onDocumentError = (err) => {
    if (err.isCanceled && err.pdf) {
      err.pdf.destroy()
    }
  }

  getDocument = (val) => {
    if (this.documentPromise) {
      this.documentPromise.cancel()
    }
    this.documentPromise = makeCancelable(pdfjs.getDocument(val).promise)
    this.documentPromise
      .promise
      .then(this.onDocumentComplete)
      .catch(this.onDocumentError)
    return this.documentPromise
  }

  loadByteArray = (byteArray) => {
    this.getDocument(byteArray)
  }

  loadPDFDocument = (props) => {
    if (props.file) {
      if (typeof props.file === 'string') {
        return this.getDocument(props.file)
      }
      // Is a File object
      const reader = new FileReader()
      reader.onloadend = () =>
        this.loadByteArray(new Uint8Array(reader.result))
      reader.readAsArrayBuffer(props.file)
    } else if (props.binaryContent) {
      this.loadByteArray(props.binaryContent)
    } else if (props.content) {
      const bytes = window.atob(props.content)
      const byteLength = bytes.length
      const byteArray = new Uint8Array(new ArrayBuffer(byteLength))
      for (let index = 0; index < byteLength; index += 1) {
        byteArray[index] = bytes.charCodeAt(index)
      }
      this.loadByteArray(byteArray)
    } else {
      throw new Error('PDF works with a file-url or base64-content.')
    }
  }

  render() {
    const {
      Loader,
      scale,
      rotate,
      pagination,
      page,
      className
    } = this.props
    const { pdf } = this.state
    if (pagination) {
      return pdf
        ? (
          <PdfPagePagination
            pdf={ pdf }
            page={ page || 1 }
            scale={ scale }
            rotate={ rotate }
            className={ className }
          />
        )
        : <Loader /> || <div>Loading PDF...</div>
    } else {
      return pdf
        ? (
          <div>
            { map([...Array(pdf.numPages)], (_, page) => {
              return <PdfPage
                key={ page }
                pdf={ pdf }
                page={ page + 1 }
                scale={ scale }
                rotate={ rotate }
                className={ className }
              />
            })}
          </div>
        )
        : <Loader /> || <div>Loading PDF...</div>
    }
  }
}

export default Pdf
