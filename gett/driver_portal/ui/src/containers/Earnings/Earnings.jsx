import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import moment from 'moment'
import { debounce, isEmpty } from 'lodash'
import { FrontOfficeLayout } from 'containers/Layouts'
import { media, sizes, breakpoints } from 'components/Media'
import { DatePicker } from 'components/DatePicker'
import { Loader } from 'components/Loader'
import { Desktop, PhoneLarge } from 'components/MediaQuery'
import { Empty } from 'components/Empty'
import { Selectable } from 'components/Selectable'
import { ActionsButton } from 'components/ActionsButton'
import { ShareWithDialog } from './components/ShareWithDialog'
import { EarningsGrid, Actions } from './components/EarningsGrid'
import * as mapDispatchToProps from './actions'
import { mapStateToProps } from './reducers'

const PER_PAGE = 25
const FORMAT = 'YYYY-MM-DDTHH:mm:ssZ'

class Earnings extends Component {
  state = {
    selected: {},
    datepicker: {
      startDate: moment().subtract(1, 'months'),
      endDate: moment()
    },
    shareWith: {
      active: false
    },
    perPage: PER_PAGE,
    page: 1,
    hidePicker: false
  }

  handleDatePicker = (datepicker) => {
    if (datepicker && datepicker.startDate && datepicker.endDate) {
      this.setState({ datepicker })
    }
  }

  loadEarnings = debounce(({ startDate, endDate }, perPage, page, reset) => {
    this.props.loadEarnings({
      from: moment(startDate).format(FORMAT),
      to: moment(endDate).format(FORMAT),
      perPage,
      page,
      reset
    })
  }, 300)

  loadDetails = (id, issuedAt) => {
    this.props.loadDetails({ id, issuedAt })
  }

  compareDates({ startDate, endDate }) {
    return (!(moment(endDate).isSame(this.state.datepicker.endDate)) ||
      !(moment(startDate).isSame(this.state.datepicker.startDate))) &&
      !(moment(startDate).isSame(endDate))
  }

  componentWillUpdate(nextProps, nextState) {
    const reset = nextState.page === 1
    if (reset) this.container.scrollTop = 0
    if (this.compareDates(nextState.datepicker)) {
      this.setState({ page: 1, hidePicker: true })
      this.loadEarnings({ ...nextState.datepicker }, nextState.perPage, 1, reset)
    } else if (this.state.page !== nextState.page) {
      this.loadEarnings({ ...nextState.datepicker }, nextState.perPage, nextState.page, reset)
    }
  }

  handleScroll = (e) => {
    const { page } = this.props
    if ((e.target.scrollTop + e.target.clientHeight + 100 > e.target.scrollHeight) &&
      page > this.state.page) {
      this.setState({ page, hidePicker: true })
    }
  }

  handleChangePicker = () => {
    this.setState({ hidePicker: false })
  }

  emailMe = (earnings) => {
    const { datepicker: { startDate, endDate } } = this.state
    this.props.emailMe({
      earnings,
      from: moment(startDate).format(FORMAT),
      to: moment(endDate).format(FORMAT)
    })
  }

  showShareWith = (earnings) => {
    this.setState(state => ({
      ...state,
      shareWith: {
        active: true,
        earnings
      }
    }))
  }

  shareWith = (earnings, receivers, message) => {
    const { datepicker: { startDate, endDate } } = this.state
    this.props.shareWith({
      earnings,
      receivers,
      message,
      from: moment(startDate).format(FORMAT),
      to: moment(endDate).format(FORMAT)
    })
  }

  closeShareWith = () => {
    this.setState(state => ({
      ...state,
      shareWith: {
        active: false
      }
    }))
  }

  downloadCSV = (earnings) => {
    const { datepicker: { startDate, endDate } } = this.state
    this.props.downloadCSV({
      earnings,
      from: moment(startDate).format(FORMAT),
      to: moment(endDate).format(FORMAT)
    })
  }

  onStatementId = ({ issuedAt, earningsId }) => {
    this.props.loadStatementId({ issuedAt, earningsId })
  }

  render() {
    const { currentUser, logout, loading, last, earnings, earningsDetails, history: { location }, setVehicle } = this.props
    const { datepicker, hidePicker, shareWith } = this.state

    const actions = (selection) => {
      return (<ActionsWrapper>
        <Actions
          earnings={ selection.selected() }
          trigger={
            <ActionsButtonStyled disabled={ selection.selectedCount() === 0 }>
              Actions
            </ActionsButtonStyled>
          }
          onEmailMe={ this.emailMe }
          onShareWith={ this.showShareWith }
          onDownloadCSV={ this.downloadCSV }
        />
      </ActionsWrapper>)
    }

    return (
      <FrontOfficeLayout
        currentUser={ currentUser }
        logout={ logout }
        location={ location }
        onScroll={ this.handleScroll }
        setVehicle={ setVehicle }
      >
        <Selectable collection={ earnings } byField="externalId" render={ selection => (
          <Fragment>
            <Container innerRef={ (node) => this.container = node }>
              <PageHeader>
                <PageName>
                  Earnings
                </PageName>
                <PhoneLarge maxWidth={ sizes.phoneLarge } minWidth={ 0 }>
                  { actions(selection) }
                </PhoneLarge>
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
              <PhoneLarge maxWidth={ sizes.phoneLarge } minWidth={ 0 }>
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
              <GridWrapper>
                {
                  isEmpty(earnings) ? (
                    <Empty loading={ loading } />
                  ) : (
                    <EarningsGrid
                      earnings={ earnings }
                      earningsDetails={ earningsDetails }
                      isSelected={ selection.isSelected }
                      select={ selection.select }
                      loadDetails={ this.loadDetails }
                      onEmailMe={ this.emailMe }
                      onShareWith={ this.showShareWith }
                      onDownloadCSV={ this.downloadCSV }
                      onStatementId={ this.onStatementId }
                    />
                  )
                }
                {!isEmpty(earnings) && (loading ? <LoaderStyled color="#FDB924" /> : !last && <LoaderText>Scroll down to see more</LoaderText>)}
              </GridWrapper>
              <ShareWithDialog
                width={ 700 }
                active={ shareWith.active }
                earnings={ shareWith.earnings }
                onSend={ this.shareWith }
                onClose={ this.closeShareWith }
              />
            </Container>
          </Fragment>
        ) } />
      </FrontOfficeLayout>
    )
  }
}

const Container = styled.div`
  position: relative;
  width: 100%;
  background: #f4f7fa;
`

const PageHeader = styled.div`
  display: flex;
  height: 48px;
  align-items: center;
  justify-content: flex-start;
  margin-top: 20px;
`

const Filter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-right: 30px;
  width: 100%;
`

const FilterPhoneLarge = styled.div`
  display: flex;
  width: 100%;
  margin-top: 20px;
`

const DatePickerPhone = styled(DatePicker)`
  width: 100%;
  margin: 0px 15px 20px 15px;
`

const ActionsWrapper = styled.div`
 margin-left: 20px;

 ${media.phoneLarge`
  margin-right: 15px;
 `}
`

const ActionsButtonStyled = styled(ActionsButton)`
  width: 105px;
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

const LoaderStyled = styled(Loader)`
  margin-bottom: 15px;
`

const LoaderText = styled.div`
  font-size: 14px;
  text-align: center;
  color: #000000;
  margin: 15px 0 15px 0;
`

const GridWrapper = styled.div`
  padding: 0 15px 0 15px;

  ${breakpoints.phoneLarge`
    padding: 0 30px 0 30px;
  `}
`

export default connect(mapStateToProps, mapDispatchToProps)(Earnings)
