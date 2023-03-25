import React, { PureComponent } from 'react'
import styled from 'styled-components'

import { IconDnD } from 'components/Icons'

import { Droppable } from '../lib/index'

class Upload extends PureComponent {
  render() {
    const { dragEnter, dragLeave, className, onChange, types } = this.props
    return (<Wrapper
      onClick={ () => this.file.click() }
      onDragEnter={ dragEnter }
      onDragLeave={ dragLeave }
      className={ className }
      types={ types }>
      <IconDnD height={ 36 } width={ 40 } />
      <Text>
          Drag & Drop
      </Text>
      <UploadLink innerRef={ node => this.file = node } type="file" accept="application/pdf,image/*"
        onChange={ onChange } />
      <Bottom>
        <TextBottom>your file here or</TextBottom>
        <LinkText htmlFor="file">browse</LinkText>
      </Bottom>
    </Wrapper>
    )
  }
}

const Wrapper = styled(Droppable)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: ${props => props.height || 331}px;
  border: dotted 1px #a8a8b5;
  border-radius: 4px;
`

const LinkText = styled.div`
  margin-top:10px;
  font-size: 14px;
  color: #5389df;
  cursor: pointer;
  text-decoration: underline;
`

const Text = styled.div`
  font-size: 18px;
`

const UploadLink = styled.input`
  display: none;
`

const Bottom = styled.div`
  display: flex;
  align-items: center;
`

const TextBottom = styled.div`
  margin-top:10px;
  margin-right:5px;
`

export default Upload
