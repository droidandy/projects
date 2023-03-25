import React, { Component, Fragment } from 'react'
import styled, { css, keyframes } from 'styled-components'
import moment from 'moment'
import { connect } from 'react-redux'
import { debounce, isEmpty } from 'lodash'
import { FrontOfficeLayout } from 'containers/Layouts/FrontOfficeLayout'
import { Selectable } from 'components/Selectable'
import { breakpoints, sizes, media } from 'components/Media'
import { Desktop, PhoneLarge } from 'components/MediaQuery'
import { Empty } from 'components/Empty'
import { ActionsButton } from 'components/ActionsButton'
import { IconFilter } from 'components/Icons'
import { SearchField } from 'components/SearchField'
import { ShareWithDialog } from './components/ShareWithDialog'
import { StatementsGrid, Actions } from './components/StatementsGrid'
import { Loader } from 'components/Loader'
import { DatePicker } from 'components/DatePicker'
import { mapStateToProps } from './reducers'
import * as mapDispatchToProps from './actions'

const PER_PAGE = 25
const FORMAT = 'YYYY-MM-DDTHH:mm:ssZ'

class Statements extends Component {
  state = {
    selected: {},
    id: '',
    ids: '',
    shareWith: {
      active: false
    },
    perPage: PER_PAGE,
    page: 1,
    hidePicker: false,
    showFilters: false,
    datepicker: {
      startDate: moment().subtract(1, 'months'),
      endDate: moment()
    }
  }

  componentWillMount() {
    this.props.initialize()
  }

  componentWillUpdate(nextProps, nextState) {
    const reset = nextState.page === 1
    if (reset) this.container.scrollTop = 0
    const { match: { params } } = nextProps

    if (params && params.id && isEmpty(this.state.id)) {
      this.setState({ id: params.id }, this.onSearch(params.id))
    } else {
      if (this.compareDates(nextState.datepicker)) {
        this.setState({ page: 1, hidePicker: true, ids: '' })
        this.loadStatements({ ...nextState.datepicker }, nextState.perPage, 1, reset)
      } else if (this.state.page !== nextState.page) {
        this.loadStatements({ ...nextState.datepicker }, nextState.perPage, nextState.page, reset)
      }
    }
  }

  handleScroll = (e) => {
    const { page } = this.props
    if ((e.target.scrollTop + e.target.clientHeight + 100 > e.target.scrollHeight) &&
      page > this.state.page) {
      this.setState({ page, hidePicker: true })
    }
  }

  compareDates({ startDate, endDate }) {
    return (!(moment(endDate).isSame(this.state.datepicker.endDate)) ||
      !(moment(startDate).isSame(this.state.datepicker.startDate))) &&
      !(moment(startDate).isSame(endDate))
  }

  handleChangePicker = () => {
    this.setState({ hidePicker: false })
  }

  handleDatePicker = (datepicker) => {
    if (datepicker && datepicker.startDate && datepicker.endDate) {
      this.setState({ datepicker })
    }
  }

  render() {
    const { currentUser, logout, loading, statements, last, history: { location }, setVehicle } = this.props
    const { datepicker, hidePicker, showFilters, shareWith, ids } = this.state
    const actions = (selection) => {
      return (<ActionsWrapper>
        <Actions
          statements={ selection.selected() }
          trigger={
            <ActionsButtonStyled disabled={ selection.selectedCount() === 0 }>
              Actions
            </ActionsButtonStyled>
          }
          onEmailMe={ this.emailMe }
          onShareWith={ this.showShareWith }
          onDownloadPDF={ this.downloadPDF }
        />
      </ActionsWrapper>)
    }
    return (
      <FrontOfficeLayout
        currentUser={ currentUser }
        setVehicle={ setVehicle }
        logout={ logout }
        location={ location }
        onScroll={ this.handleScroll }
      >
        <Selectable collection={ statements } render={ selection => (
          <Fragment>
            <Container innerRef={ (node) => this.container = node }>
              <PageHeader>
                <PageName>Statements</PageName>
                <ActionsHolder maxWidth={ sizes.phoneLarge } minWidth={ 0 }>
                  <div>
                    <FiltersToggle active={ showFilters } onClick={ this.showFilters }>
                      <IconFilter />
                    </FiltersToggle>
                    { actions(selection) }
                  </div>
                </ActionsHolder>
                <Desktop>
                  <Search
                    value={ ids }
                    onChange={ this.onSearch }
                  />
                </Desktop>
                <Desktop>
                  <Filter>
                    <DatePicker
                      type="rangePicker"
                      handleSelect={ this.handleDatePicker }
                      value={ datepicker }
                      hide={ hidePicker }
                      changeHide={ this.handleChangePicker }
                    />
                    { actions(selection) }
                  </Filter>
                </Desktop>
              </PageHeader>
              <FiltersHolder show={ showFilters } >
                <PhoneLarge maxWidth={ sizes.phoneLarge } minWidth={ 0 }>
                  <Search
                    value={ ids }
                    onChange={ this.onSearch }
                  />
                  <FilterPhoneLarge>
                    <DatePickerPhone
                      type="rangePicker"
                      handleSelect={ this.handleDatePicker }
                      value={ datepicker }
                      phone
                      hide={ hidePicker }
                      changeHide={ this.handleChangePicker }
                    />
                  </FilterPhoneLarge>
                </PhoneLarge>
              </FiltersHolder>
              <GridWrapper>
                {
                  isEmpty(statements) ? (
                    <Empty loading={ loading } />
                  ) : (
                    <StatementsGrid
                      statements={ statements }
                      isSelected={ selection.isSelected }
                      select={ selection.select }
                      onEmailMe={ this.emailMe }
                      onShareWith={ this.showShareWith }
                      onDownloadPDF={ this.downloadPDF }
                    />
                  )
                }
                {!isEmpty(statements) && (loading ? <LoaderStyled color="#FDB924" /> : !last && <LoaderText>Scroll down to see more</LoaderText>)}
              </GridWrapper>
              <ShareWithDialog
                width={ 700 }
                active={ shareWith.active }
                statements={ shareWith.statements }
                onSend={ this.shareWith }
                onClose={ this.closeShareWith }
              />
            </Container>
          </Fragment>
        ) } />
      </FrontOfficeLayout>
    )
  }

  loadStatements = debounce(({ startDate, endDate }, perPage, page, reset) => {
    this.props.loadStatements({
      from: moment(startDate).format(FORMAT),
      to: moment(endDate).format(FORMAT),
      perPage,
      page,
      reset
    })
  }, 300)

  searchStatements = debounce(() => {
    const { ids } = this.state
    this.props.loadStatements({
      ids,
      reset: true
    })
  }, 300)

  emailMe = (statements) => {
    this.props.emailMe({ statements })
  }

  showShareWith = (statements) => {
    this.setState(state => ({
      ...state,
      shareWith: {
        active: true,
        statements
      }
    }))
  }

  shareWith = (statements, receivers, message) => {
    this.props.shareWith({ statements, receivers, message })
  }

  closeShareWith = () => {
    this.setState(state => ({
      ...state,
      shareWith: {
        active: false
      }
    }))
  }

  showFilters = () => {
    this.setState(state => ({ showFilters: !state.showFilters }))
  }

  downloadPDF = (statements) => {
    this.props.downloadPDF({ statements })
  }

  onSearch = (query) => {
    this.setState({ ids: [query] }, this.searchStatements)
  }
}

const Container = styled.div`
  position: relative;
  width: 100%;
  background: #f4f7fa;
`

const GridWrapper = styled.div`
  padding: 0 30px 0 30px;
  ${media.phoneLarge`
    padding: 0 15px 0 15px;
  `}
`

const Search = styled(SearchField)`
  display: none;

  ${breakpoints.phoneLarge`
    display: block;
    width: 280px;
    margin: 0 20px;
  `}

  ${media.phoneLarge`
    display: flex;
    width: 100%;

    & > div {
     margin: 0 15px 0 15px;
    }
  `}
`

const PageHeader = styled.div`
  display: flex;
  height: 48px;
  align-items: center;
  justify-content: flex-end;
  margin-top: 20px;
`

const PageName = styled.span`
  font-size: 36px;
  color: #303030;
  margin: auto;
  margin-left: 30px;
  
  ${media.phoneLarge`
    font-size: 22px;
    margin-left: 15px;
  `}
`

const Filter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-right: 30px;
`

const FilterPhoneLarge = styled.div`
  display: flex;
  width: 100%;
  margin-top: 20px;
`

const DatePickerPhone = styled(DatePicker)`
  width: 100%;
  margin: 0 30px 0 30px;
  
  ${media.phoneLarge`
    margin: 0 15px 0 15px;
  `}
`

const LoaderStyled = styled(Loader)`
  margin-bottom: 15px;
`
const LoaderText = styled.div`
  font-size: 14px;
  text-align: center;
  color: #000000;
  margin: 15px 0 15px 0;
`

const ActionsWrapper = styled.div`
  margin-left: 10px;
  
  ${media.phoneLarge`
    margin-right: 15px;
 `}
`

const ActionsButtonStyled = styled(ActionsButton)`
  width: 105px;
`

const FiltersToggle = styled.div`
  align-items: center;
  justify-content: center;
  width: 40px;
  border-radius: 4px;
  background: ${props => props.active ? '#f6b530' : '#fff'};
  cursor: pointer;
  
  ${breakpoints.phoneLarge`
    display: none;
  `}
   
  ${media.phoneLarge`
    display: flex;
  `}
`

const ActionsHolder = styled(PhoneLarge)`
  display: flex;
  margin-left: auto;
`

const show = keyframes`
  from { overflow: hidden }
  to { overflow: visible;}
`

const hide = keyframes`
  from { overflow: visible }
  to { overflow: hidden; }
`

const FiltersHolder = styled.div`
  overflow:hidden;
  height: 0;
  animation: ${hide} 0.5s;
  animation-fill-mode: forwards;
  transition: height 0.5s ease-out;

  ${props => props.show && css`
    overflow: visible;
    animation: ${show} 0.5s;
    height: 110px;
    animation-fill-mode: forwards;
  `}
  
  ${breakpoints.phoneLarge`
    display: none;
  `}
`

export default connect(mapStateToProps, mapDispatchToProps)(Statements)
