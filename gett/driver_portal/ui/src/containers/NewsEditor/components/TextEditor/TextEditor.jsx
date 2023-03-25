import React, { Component } from 'react'
import styled from 'styled-components'
import { isEmpty, forEach } from 'lodash'

import {
  IconBold,
  IconBulletList,
  IconHyperlink,
  IconItalic,
  IconImage,
  IconJustifyFull,
  IconJustifyLeft,
  IconJustifyCenter,
  IconNumberList,
  IconJustifyRight
} from 'components/Icons'
import { SelectDropdown } from 'components/SelectDropdown'
import { SelectColor } from 'components/SelectColor'

import AddLink from './AddLink'

const ADD_LINK_WIDTH = 460

class TextEditor extends Component {
  selection = ''
  coordinate = ''
  state = {
    value: '',
    uploadImage: false,
    toolbarStatus: {
      bold: false,
      italic: false,
      createlink: false,
      insertimage: false,
      insertUnorderedList: false,
      insertOrderedList: false,
      justifyFull: false,
      justifyLeft: false,
      justifyCenter: false,
      justifyRight: false
    },
    // add link popup
    addLinkOpen: false,
    addLinkRef: null,
    addLinkForm: {
      text: null,
      link: null
    },
    addLinkPosition: {
      top: null,
      left: null
    }
  }

  componentDidMount() {
    if (this.editor) {
      const { value } = this.props
      if (isEmpty(value) || isEmpty(this.editor.innerHTML)) {
        this.setState({ value }, this.handleEditorValue(value))
      }

      this.editor.addEventListener('selectstart', this.handleSaveSelection)
      this.editor.addEventListener('mouseup', this.handleSaveSelection)
      this.editor.addEventListener('mouseout', this.handleSaveSelection)
      this.editor.addEventListener('keyup', this.handleSaveSelection)
      this.editor.addEventListener('keydown', this.handleEnter)
    }
  }

  componentWillUnmount() {
    this.editor.removeEventListener('selectstart', this.handleSaveSelection)
    this.editor.removeEventListener('mouseup', this.handleSaveSelection)
    this.editor.removeEventListener('mouseout', this.handleSaveSelection)
    this.editor.removeEventListener('keyup', this.handleSaveSelection)
    this.editor.removeEventListener('keydown', this.handleEnter)
  }

  componentWillReceiveProps(newProps) {
    const { value, image } = newProps
    if (isEmpty(value) || (this.editor && isEmpty(this.editor.innerHTML))) {
      this.setState({ value }, this.handleEditorValue(value))
    }
    if (image && image !== this.props.image && this.state.uploadImage) {
      const img = `
        <div style="display: flex;flex-direction: column;"><p class="editorImage" style="background-image: url(${image})" contenteditable="false"></p></div><br><br>
      `
      document.execCommand('insertHTML', false, img)
      this.setState({ uploadImage: false })
    }
  }

  render() {
    const { toolbarStatus, addLinkOpen, addLinkForm, addLinkPosition } = this.state

    return (
      <Editor innerRef={ node => this.editorWrapper = node }>
        <Toolbar>
          <SelectWrapper>
            <SelectStyled
              onChange={ (e) => this.handleTextToolbar(e) }
              width={ 200 }
              height={ 30 }
              top={ 40 }
              nooverlay
            >
              <NormalText value="Normal Text">Normal Text</NormalText>
              <Header1 value="Header 1">Header 1</Header1>
              <Header2 value="Header 2">Header 2</Header2>
              <Header3 value="Header 3">Header 3</Header3>
              <Header4 value="Header 4">Header 4</Header4>
            </SelectStyled>
            <SelectColorStyled
              width={ 80 }
              height={ 30 }
              onClick={ this.handleRestoreSelection }
              onChange={ (color) => this.handleTextToolbar(color, 'forecolor') }
              nooverlay
              parentRef={ this.editor }
            />
          </SelectWrapper>
          <BtnWrapper>
            <Btn onClick={ (e) => this.handleTextToolbar(e, 'bold') } onMouseDown={ e => e.preventDefault() }>
              <IconBold color={ toolbarStatus.bold ? '#74818F' : '#d8d8d8' } />
            </Btn>
            <Btn onClick={ (e) => this.handleTextToolbar(e, 'italic') } onMouseDown={ e => e.preventDefault() }>
              <IconItalic color={ toolbarStatus.italic ? '#74818F' : '#d8d8d8' } />
            </Btn>
            <Btn onClick={ (e) => this.handleTextToolbar(e, 'createlink') } onMouseDown={ e => e.preventDefault() }>
              <IconHyperlink color={ toolbarStatus.createlink ? '#74818F' : '#d8d8d8' } />
            </Btn>
            <Btn onClick={ (e) => this.handleTextToolbar(e, 'insertimage') } onMouseDown={ e => e.preventDefault() }>
              <IconImage color={ toolbarStatus.insertimage ? '#74818F' : '#d8d8d8' } />
            </Btn>
            <Btn onClick={ (e) => this.handleTextToolbar(e, 'insertUnorderedList') } onMouseDown={ e => e.preventDefault() }>
              <IconBulletList color={ toolbarStatus.insertUnorderedList ? '#74818F' : '#d8d8d8' } />
            </Btn>
            <Btn onClick={ (e) => this.handleTextToolbar(e, 'insertOrderedList') } onMouseDown={ e => e.preventDefault() }>
              <IconNumberList color={ toolbarStatus.insertOrderedList ? '#74818F' : '#d8d8d8' } />
            </Btn>
            <Btn onClick={ (e) => this.handleTextToolbar(e, 'justifyFull') } onMouseDown={ e => e.preventDefault() }>
              <IconJustifyFull color={ toolbarStatus.justifyFull ? '#74818F' : '#d8d8d8' } />
            </Btn>
            <Btn onClick={ (e) => this.handleTextToolbar(e, 'justifyLeft') } onMouseDown={ e => e.preventDefault() }>
              <IconJustifyLeft color={ toolbarStatus.justifyLeft ? '#74818F' : '#d8d8d8' } />
            </Btn>
            <Btn onClick={ (e) => this.handleTextToolbar(e, 'justifyCenter') } onMouseDown={ e => e.preventDefault() }>
              <IconJustifyCenter color={ toolbarStatus.justifyCenter ? '#74818F' : '#d8d8d8' } />
            </Btn>
            <Btn onClick={ (e) => this.handleTextToolbar(e, 'justifyRight') } onMouseDown={ e => e.preventDefault() }>
              <IconJustifyRight color={ toolbarStatus.justifyRight ? '#74818F' : '#d8d8d8' } />
            </Btn>
          </BtnWrapper>
        </Toolbar>
        <Wrapper>
          { addLinkOpen &&
          <AddLink getLinkFromChild={ this.getLinkFromChild }
            handleAddLinkChange={ this.handleAddLinkChange }
            handleClickApply={ this.handleClickApply }
            text={ addLinkForm.text }
            top={ addLinkPosition.top }
            left={ addLinkPosition.left }
          />
          }
          <Content
            contentEditable
            innerRef={ node => this.editor = node }
            onBlur={ this.handleEditorChange }
            onInput={ this.handleEditorChange }
          />
        </Wrapper>
      </Editor>
    )
  }

  handleEditorValue = (value) => {
    if (this.editor && value) {
      this.editor.innerHTML = value
    }
  }

  handleEnter = (e) => {
    if (e && e.keyCode === 13) {
      document.execCommand('insertHTML', false, '<br><br>')
      this.handleToolbar()
      return false
    }
  }

  handleEditorChange = () => {
    const { onChange } = this.props
    if (this.editor) {
      let value = this.editor.innerHTML
      if (value !== this.state.value) {
        // if we have text line - wrap into div
        forEach(this.editor.childNodes, (children) => {
          if (children && children.nodeName === '#text') {
            this.handleWrapperTextInBlock(children, true)
          }
        })
        if (onChange) this.setState({ value }, onChange(value))
        else this.setState({ value })
      }
    }
  }

  handleTextToolbar = (e, command) => {
    this.handleToolbar(command)
    this.handleRestoreSelection()
    if (!command && e) {
      let format
      switch (e) {
        case 'Header 1':
          format = 'h1'
          break
        case 'Header 2':
          format = 'h2'
          break
        case 'Header 3':
          format = 'h3'
          break
        case 'Header 4':
          format = 'h4'
          break
        default:
          format = 'p'
          break
      }
      document.execCommand('formatBlock', false, format)
    } else {
      if (command === 'forecolor' || command === 'backcolor') {
        document.execCommand(command, false, e)
      } else if (command === 'insertimage') {
        const { imageInsert } = this.props
        if (imageInsert) {
          this.setState({ uploadImage: true }, imageInsert)
        } else {
          const url = prompt('Enter the link here: ', 'http://')
          const image = `
            <div style="display: flex;flex-direction: column;"><p class="editorImage" style="background-image: url(${url})" contenteditable="false"></p></div><br><br>
          `
          document.execCommand('insertHTML', false, image)
        }
      } else if (command === 'createlink') {
        this.addLinkChangeState()

        this.setState({
          addLinkPosition: this.coordinate,
          addLinkForm: {
            text: this.selectionText,
            link: this.state.link
          }
        })
      } else {
        const set = window.getSelection()
        let notes = null
        // if we found image with class 'editorImage' align it, in another way - align text
        if (set && set.focusNode) {
          forEach(set.focusNode.childNodes, node => {
            if (node.className === 'editorImage') {
              notes = node
              return false
            }
          })
        }
        if (notes) {
          if (command === 'justifyLeft' || command === 'justifyFull') {
            notes.parentNode.style.alignItems = 'flex-start'
          } else if (command === 'justifyCenter') {
            notes.parentNode.style.alignItems = 'center'
          } else if (command === 'justifyRight') {
            notes.parentNode.style.alignItems = 'flex-end'
          }
        } else {
          document.execCommand(command, false, null)
        }
      }
    }
    this.handleSaveSelection()
    this.editor.focus()
  }

  addLinkChangeState = (forceClose) => {
    const { addLinkOpen, value } = this.state

    if (value.length > 0 && (addLinkOpen || this.selectionText)) {
      !addLinkOpen ? document.addEventListener('click', this.clickOutside)
        : document.removeEventListener('click', this.clickOutside)
      !addLinkOpen ? this.editor.removeEventListener('mouseout', this.handleSaveSelection)
        : this.editor.addEventListener('mouseout', this.handleSaveSelection)
      !addLinkOpen ? window.addEventListener('resize', () => this.addLinkChangeState(true))
        : window.removeEventListener('resize', () => this.addLinkChangeState(true))
      this.addLinkReset(forceClose)
    }
  }

  addLinkReset(forceClose) {
    this.setState(state => ({
      ...state,
      addLinkOpen: forceClose ? false : !state.addLinkOpen,
      addLinkForm: {
        text: '',
        link: ''
      }
    }))
  }

  clickOutside = (e) => {
    const { addLinkRef } = this.state
    if (addLinkRef && !addLinkRef.contains(e.target)) {
      this.addLinkChangeState()
    }
  }

  getLinkFromChild = (addLinkRef) => {
    this.setState({ addLinkRef })
  }

  handleAddLinkChange = (field, value) => {
    this.setState(state => ({
      ...state,
      addLinkForm: {
        ...state.addLinkForm,
        [field]: value
      }
    }))
  }

  handleClickApply = () => {
    this.addLinkChangeState()
    const preparedTreeObject = this.handleParseEditorContent()
    // find children to replace it with added link
    if (preparedTreeObject) {
      forEach(this.editor.childNodes, (children) => {
        if (children.nodeName === '#text') {
          if (children.data === preparedTreeObject.parentsTree) {
            this.handleWrapperTextInBlock(children)
          }
        } else {
          if (children && preparedTreeObject && children.outerHTML === preparedTreeObject.parentsTree) {
            children.innerHTML = preparedTreeObject.preparedLinkTree
          }
        }
      })
    }
  }

  handleParseEditorContent = () => {
    const { link, text } = this.state.addLinkForm
    let preparedLinkTree
    const parentsTree = this.getSelectionParentHtml()
    const insertLink = `<a href="${link}">${text}</a>`
    const numberOfOccurrences = this.selectionText ? (parentsTree.split(this.selectionText).length - 1) : 0
    /* If we have a selected text is not repeated in the parent house-element, then we just wrap it in a link and replace it.
     * If the selected text is repeated, then we take the block's context (old content), find the selected text,
     * wrap it in a link (new content), further we replace old content with a new one */

    if (numberOfOccurrences === 1) {
      preparedLinkTree = parentsTree.split(this.selectionText).join(insertLink)
      return {
        parentsTree,
        preparedLinkTree
      }
    } else if (numberOfOccurrences > 1) {
      const sel = window.getSelection()
      if (sel.rangeCount) {
        const range = sel.getRangeAt(0)
        const oldContent = range.commonAncestorContainer.data
        let newContent = ''
        if (oldContent) {
          newContent = `${oldContent.substr(0, range.startOffset)}${insertLink}${oldContent.substr(range.endOffset, oldContent.length - 1)}`
        }
        preparedLinkTree = parentsTree.replace(new RegExp(oldContent, 'g'), newContent)
        return {
          parentsTree,
          preparedLinkTree
        }
      }
    } else if (numberOfOccurrences === 0 && !this.selectionText) {
      return null
    }
  }

  handleWrapperTextInBlock = (el, end) => {
    this.editor.innerHTML = `<div>${el.data}</div>`
    end && this.setEndOfContenteditable()
  }

  getSelectionParentHtml() {
    let parentEl = null
    if (window.getSelection) {
      this.handleRestoreSelection()
      const sel = window.getSelection()
      if (sel.rangeCount) {
        parentEl = sel.getRangeAt(0).commonAncestorContainer
        while (parentEl && parentEl.parentNode !== this.editor) {
          parentEl = parentEl.parentNode
        }
      }
    }
    return parentEl.outerHTML || parentEl.data
  }

  handleToolbar = (command) => {
    this.setState(state => ({
      ...state,
      toolbarStatus: {
        bold: false,
        italic: false,
        createlink: false,
        insertimage: false,
        insertUnorderedList: false,
        insertOrderedList: false,
        justifyFull: false,
        justifyLeft: false,
        justifyCenter: false,
        justifyRight: false,
        [command]: true
      }
    }))
  }

  handleSaveSelection = () => {
    let selection
    let coordinate = { top: 0, left: 0 }
    if (window.getSelection) {
      const sel = window.getSelection()
      if (sel.getRangeAt && sel.rangeCount) {
        selection = sel.getRangeAt(0)
      }
      if (window.getSelection().baseNode) {
        if (sel.rangeCount) {
          let width = 0
          const position = window.getSelection().baseNode.parentNode.getBoundingClientRect()
          const height = position.height
          if (sel.type === 'Range') {
            width = (sel.focusOffset - sel.baseOffset) * 12
          }
          const range = sel.getRangeAt(0).cloneRange()
          if (range.getClientRects) {
            let rect
            range.collapse(true)
            const rects = range.getClientRects()
            if (rects.length > 0) {
              rect = rects[0]
            }

            if (rect) {
              const x = rect.left
              const y = rect.top

              let offset = 0
              if (position.right - x < ADD_LINK_WIDTH && x > ADD_LINK_WIDTH) { offset = -ADD_LINK_WIDTH }
              if (x && y) {
                coordinate = {
                  top: y - this.editor.getBoundingClientRect().top + height + 200,
                  left: x - this.editor.getBoundingClientRect().left + width + offset
                }
              }
            }
          }
        }
      }
    } else if (document.selection && document.selection.createRange) {
      selection = document.selection.createRange()
    }
    this.selection = selection
    this.coordinate = coordinate
  }

  handleRestoreSelection = () => {
    const selection = this.selection
    if (selection) {
      if (window.getSelection) {
        const sel = window.getSelection()
        sel.removeAllRanges()
        sel.addRange(selection)
      } else if (document.selection && selection.select) {
        selection.select()
      }
    }
  }

  setEndOfContenteditable() {
    let range, selection
    if (document.createRange && this.editor) {
      range = document.createRange()
      range.selectNodeContents(this.editor)
      range.collapse(false)
      selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }

  get selectionText() {
    if (window.getSelection) {
      return window.getSelection().toString()
    }
    return ''
  }
}

const Editor = styled.div`
  background-color: #fff;
  margin-bottom: 10px;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: -15px;
`

const SelectStyled = styled(SelectDropdown)`
  height: 30px;
`

const SelectColorStyled = styled(SelectColor)`
  margin-left: 20px;
`

const BtnWrapper = styled.div`
  display: flex;
  align-self: flex-end;
`

const SelectWrapper = styled.div`
  display: flex;
`

const Btn = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 10px;
  
  &:hover {
    border-radius: 4px;
    background-color: #f6f6f6;
  }
`

const Content = styled.div`
  display: inline-block;
  border-radius: 4px;
  border: solid 1px #b6b6c1;
  min-height: 385px;
  overflow: auto;
  padding: 1em;
  margin-top: 10px;
  resize: vertical;
  outline: none;
  background: #fff;
`

const NormalText = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  padding: 20px 20px 20px 20px;
  height: 35px;

  &:hover {
    background-color: rgba(246, 181, 48, 0.2);
  }
`

const Header1 = styled(NormalText)`
  font-size: 30px;
`

const Header2 = styled(NormalText)`
  font-size: 24px;
`

const Header3 = styled(NormalText)`
  font-size: 18px;
`

const Header4 = styled(NormalText)`
  font-size: 16px;
`

export default TextEditor
