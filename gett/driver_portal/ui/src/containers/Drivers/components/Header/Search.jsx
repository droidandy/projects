import React, { Component } from 'react'
import styled from 'styled-components'
import { media } from 'components/Media'

import { SelectDropdown } from 'components/SelectDropdown'
import { SearchField } from 'components/SearchField'

const SEARCH_CATEGORIES = {
  'all': 'Select category',
  'name': 'Name and Surname',
  'email': 'Email',
  'phone': 'Phone',
  'badge_number': 'Badge number',
  'license_number': 'TFL license number',
  'vehicle_reg': 'Vehicle Plate number',
  'gett_id': 'Gett ID'
}

class Search extends Component {
  render() {
    const { value, onChange, onChangeCategory } = this.props

    return (
      <Wrapper>
        <Category
          values={ SEARCH_CATEGORIES }
          styleDropdown={ styleDropdown }
          onChange={ onChangeCategory }
        />
        <White>
          <Line />
        </White>
        <SearchInput
          borderRadius="0px 4px 4px 0px"
          value={ value }
          onChange={ onChange }
        />
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 4;
`

const Category = styled(SelectDropdown)`
  width: 210px;
  
  ${media.desktopSmall`
    width: 170px;
  `}
  
  ${media.tablet`
    width: 210px;
  `}
`

const styleDropdown = {
  border: 'none',
  borderRadius: '4px 0px 0px 4px'
}

const White = styled.div`
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 40px;
  z-index: 100;
  width: 20px;
`

const Line = styled.div`
  background-color: #d2dadc;
  height: 30px;
  width: 1px;
  border: 1px solid #d2dad;
`

const SearchInput = styled(SearchField)`
  width: 290px;
  
  ${media.desktopSmall`
    width: 200px;
  `}
  
  ${media.tablet`
    width: 290px;
  `}
`

export default Search
