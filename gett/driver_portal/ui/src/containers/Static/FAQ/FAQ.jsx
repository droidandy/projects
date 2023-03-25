import React, { Component } from 'react'
import styled from 'styled-components'
import MediaQuery from 'react-responsive'
import { Link } from 'react-router-dom'
import { IconArrow, IconQuestion } from 'components/Icons'
import { media, sizes } from 'components/Media'
import { FrontOfficeLayout } from 'containers/Layouts/FrontOfficeLayout'
import { Tabs, Tab } from './components/Tabs'
import { Accordion, Section } from './components/Accordion'

class FAQ extends Component {
  componentDidMount() {
    this.props.history.push('?tab=1')
  }
  renderBackArrow() {
    const value = this.props.location.search
    if (value) {
      return (
        <LinkWrapper to="/auth/faq">
          <BackArrow color="#74818f" width={ 7 } height={ 14 } />
        </LinkWrapper>
      )
    }
  }

  render() {
    const { currentUser, logout, history: { location }, setVehicle } = this.props
    return (
      <FrontOfficeLayout
        currentUser={ currentUser }
        setVehicle={ setVehicle }
        logout={ logout }
        location={ location }
      >
        <MediaQuery minWidth={ sizes.phoneLarge }>
          <PageHeader>
            <PageName>
              FAQs
              <QuestionIcon color="#abacbe" />
            </PageName>
            <PageQuestion>Still not sure about something?</PageQuestion>
          </PageHeader>
        </MediaQuery>
        <MediaQuery maxWidth={ sizes.phoneLarge }>
          <PageHeader>
            { this.renderBackArrow() }
            <PageName>
              FAQs
              <QuestionIcon color="#abacbe" />
            </PageName>
          </PageHeader>
        </MediaQuery>
        <Container>
          <Tabs orientation="vertical">
            <Tab label="The App">
              <Accordion id={ 1 } >
                <Section title="How can I download and install the Gett app??">
                  <TextContainer>
                    <TitleText>iOS (iPhone/iPad):</TitleText>
                    <ol>
                      <li>To install the app on your iPhone/iPad you will need to open a web browser (eg. Safari or Google Chrome)</li>
                      <li>Type this web page address in your browser: <RefLink href="https://gettaxi.me/driverhelp/">https://gettaxi.me/driverhelp/</RefLink> and tap GO.</li>
                      <li>Select “Download for IPHONE” and then tap “Install”</li>
                      <li>Push the home button on the bottom of the phone/tablet and you will see the Gett App is installing.</li>
                      <li>After the app has finished installing tap the app. Your device will give you an error and say “Untrusted Developer” and it will not open the app. To fix this, tap “Cancel”.</li>
                      <li>Go to: Settings>General>Device Management>GT GETTAXI SERVICES and tap “Trust “GT GETTAXI SERVICES ISRAEL” and tap “Trust” again.</li>
                      <li>Push the home button again.</li>
                      <li>
                        Tap the Gett App. Allow the app to send you notifications by tapping OK. The app is now installed on your device.
                        Put in your phone number, tap “Next” and confirm that is your phone number
                      </li>
                      <li>
                        The app will now ask you for a SMS code. You will receive this as a sms on your phone a couple of seconds after putting your phone number in.
                        Type in the SMS code that you received and tap “LOGIN”. Allow the app to access your location if it asks you to.
                      </li>
                    </ol>
                    <Text>
                      You are now Logged in the app.
                    </Text>
                    <TitleText>
                      Android:
                    </TitleText>
                    <ol>
                      <li>
                        To install the app you will need to use the Playstore app on your phone. The app looks like a shopping bag with an arrow on it.
                        To find it, press Menu and swipe through the screens until you recognize the play store app.
                      </li>
                      <li>Tap on the Play Store icon.</li>
                      <li>Tap the search bar on top and type “Gett Drivers“ and then tap “Search”</li>
                      <li>Tap the Gett Divers App and tap “Install” and then “Accept”. The app will now be installed on your device.</li>
                      <li>
                        Tap the home button on your phone and locate the Gett app then tap it. The app is now installed on your device. Put in your phone number, tap “Next” and confirm that is your phone number.
                      </li>
                      <li>The app will now ask you for an SMS code.</li>
                      <li>You will receive this as a text message on your phone a couple of seconds after putting your phone number in. Type in the SMS code that you received and tap “LOGIN"</li>
                      <li>
                        To create a shortcut touch the app and keep your finger on it. After a couple of seconds you will see your main screen.
                        Just release your finger from the app. Your shortcut is now available.
                      </li>
                    </ol>
                    <Text>You are now Logged in the app.</Text>
                    <Text>
                      To add a shortcut to the app on your main screen, push the home button on your phone, then press the menu button and scroll through the screens until you locate the Gett Drivers App.
                    </Text>
                  </TextContainer>
                </Section>
                <Section title="How to use the Gett app?">
                  <TextContainer>
                    <Text>
                      We have created a very simple guide on how to use the app, click the <RefLink href="https://drive.google.com/file/d/0Bzi5FenSr2chVFBwRzJYSEM2TnNjcC12NV9STnVsSXN2c0pN/view">link</RefLink> for the online version. Please email drivers.uk@gett.com if you would like a physical booklet to be sent to you in the post.
                    </Text>
                  </TextContainer>
                </Section>
                <Section title="What phone/tablet do I need to have in order to run the Gett App?">
                  <TextContainer>
                    <Text>
                      The Gett app can be installed on any newer generation IOS or Android device, may it be a phone or a tablet.
                      We recommend that you use at least an iPhone 5 or a Samsung Galaxy S5 or any newer generation Android phone or tablet that is no older than 2 years.
                    </Text>
                    <Text>
                      Your phone/tablet also needs to have an active mobile internet connection and  meet the following minimum technical requirements:
                    </Text>
                    <Text>
                      Android 5.or newer or IOS 9.3 or newer
                    </Text>
                    <Text>
                      GPS: A-GPS, GLONASS, BDS
                    </Text>
                    <Text>
                      Memory 2GB RAM
                    </Text>
                    <Text>
                      CPU: Qualcomm MSM8996 Snapdragon 820
                    </Text>
                    <Text>
                      Screen: 5 inch, 1920x1080(minimum resolution)
                    </Text>
                  </TextContainer>
                </Section>
                <Section title="I'm not receiving any orders on my iPhone/iPad although my status is 'Free'">
                  <TextContainer>
                    <Text>
                      If you Gett app has a white background instead of a map it means your location services are turned off.
                      To switch them on you need to go to: Settings > General > Privacy > Location Services > Scroll down until you see the Gett app and then tap it >Tap Always
                    </Text>
                  </TextContainer>
                </Section>
                <Section title="I can't log into my Gett app. Is There anything I can do?">
                  <TextContainer>
                    <Text>
                      Please switch your phone off and then back on again before trying to log in.
                      If this does not work then please delete the app and reinstall it.
                      If the problem persists then please e-mail or call Driver Support on drivers.uk@gett.com 02073974320.
                    </Text>
                  </TextContainer>
                </Section>
              </Accordion>
            </Tab>
            <Tab label="Payments & Scrubs">
              <Accordion id={ 2 }>
                <Section title="When do I get paid?">
                  <TextContainer>
                    <Text>
                      Jobs Monday to Sunday will be seen on the statement issued the following Wednesday and paid the next day (Thursday). This is a faster payment schedule than the previous once-weekly system.
                    </Text>
                  </TextContainer>
                </Section>
                <Section title="Why Fixed Fares?">
                  <TextContainer>
                    <Text>Customers enjoy using the fixed fares that we provide. This is a great way to keep them in black cabs and out of the competition. Passengers find it comforting to know what they are going to pay for the journey in advance.</Text>
                    <Text>Our fixed fares are close to the meter. Please accept fixed fare jobs as many of these orders are coming from customers who are coming back to black cabs. We don’t want to let them down and let them use the competition instead!</Text>
                  </TextContainer>
                </Section>
                <Section title="Can I change to a meter job once I have accepted a Fixed Fare job?">
                  <TextContainer>
                    <Text>
                      When you have accepted a job with a Fixed Fare it means you have accepted the price of the job and there is no way of changing this.
                    </Text>
                    <Text>
                      The only times you will need to change the Fixed Fare price to the meter is if the passenger has requested more drop off points or if they would like to continue their journey once they have reached the Fixed Fare destination.
                    </Text>
                    <Text>Please phone customer care to change the live-job status with your Driver ID and Order ID information ready.</Text>
                  </TextContainer>
                </Section>
                <Section title="Do pre-­booked fixed fares use live traffic data as well?">
                  <TextContainer>
                    <Text>
                      Yes. When a customer books in advance, Google Maps will make an intelligent calculation about likely traffic at that time of day, based on its historic data.
                      It may be slightly less accurate than the immediate calculation, but will still mean the Fixed Fare goes up when traffic is likely to be busy.
                    </Text>
                  </TextContainer>
                </Section>
                <Section title="What is the commission?">
                  <TextContainer>
                    <Text>
                      10% + 2% VAT on every job
                    </Text>
                  </TextContainer>
                </Section>
                <Section title="Do I wait the same amount of time for an ASAP job and an account job?">
                  <TextContainer>
                    <Text>No. When you get the information on the job offer screen it will inform you whether this is an ASAP job (a passenger from the street requesting a ride) or an account job (through a business account).</Text>
                    <Text>For an ASAP job, you are expected to wait a minimum of five minutes. If they do not turn up after 5 minutes, the 'no show' button appears. This will allow you to cancel yourself off the job and you will receive a scrub.</Text>
                    <Text>For an account job, you are expected a minumum of 15 minutes waiting time. If the job is cancelled you will be compensated.</Text>
                  </TextContainer>
                </Section>
                <Section title="Scrub information">
                  <Table>
                    <thead>
                      <tr>
                        <th />
                        <th>Private</th>
                        <th>Business Account</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Putting on the meter (ASAP ride)</td>
                        <td>2 mins after arrival</td>
                        <td>Meter on at arrival</td>
                      </tr>
                      <tr>
                        <td>Putting the meter on Future Order)</td>
                        <td>Put meter on scheduled time</td>
                        <td>Put meter on scheduled time</td>
                      </tr>
                      <tr>
                        <td>Waiting Time</td>
                        <td>5 minutes</td>
                        <td>30 minutes</td>
                      </tr>
                      <tr>
                        <td>Cancellation fees (if ride is cancelled 3 mins or more after you accept the ride)</td>
                        <td>
                          <div>£3 if still on way</div>
                          <div>£5 if arrived</div>
                        </td>
                        <td>£5 scrubs plus 50p/ minute of waiting time</td>
                      </tr>
                    </tbody>
                  </Table>
                </Section>
                <Section title="How long do I wait for an airport job?">
                  <TextContainer>
                    <Text>Airport jobs are slightly different - there is 15 minutes free waiting time - don’t put the meter on until 15 minutes after the scheduled pick-up time.</Text>
                  </TextContainer>
                </Section>
              </Accordion>
            </Tab>
            <Tab label="Future Orders">
              <Accordion id={ 3 } >
                <Section title="How can I look at and book Future Orders?">
                  <TextContainer>
                    <TitleText>Future Orders</TitleText>
                    <Text>
                      Future orders are great for helping you plan your day. Reserve yourself on up to five jobs at a time via your driver app. Just tap on the main menu, select the Future Order tab and look through at the jobs on offer. You can amend the 'sort' tab and the 'filter' tab at the top to tailor your search.
                    </Text>
                    <TitleText>Job Amendments</TitleText>
                    <Text>
                      If a customer amends their booking you’ll get a notification of the change and the job will be removed from your list of reserved future orders. The job is removed as the changes made could be very different to the original job.
                    </Text>
                    <TitleText>
                      Scrubs:
                    </TitleText>
                    <Text>
                      When a passenger cancels a job, the scrub will be automatic Scrub fees remain the same on all jobs including future orders (detailed info in the "Payment and Scrubs" section. To receive jobs, your status must be on free for a minimum of 15 minutes before the scheduled pick-up time.
                    </Text>
                  </TextContainer>
                </Section>
              </Accordion>
            </Tab>
            <Tab label="Contact Us">
              <Accordion id={ 3 } >
                <Section title="How can I get a nameboard, Gett receipt pads or promotional materials?">
                  <TextContainer>
                    <Text>
                      Please email our Driver Support team on drivers.uk@gett.com who can assist you.
                    </Text>
                    <Text>
                      If you are a London driver, you can get promotional material from our driver office at 162 Farringdon Road, EC4R 3AS.
                    </Text>
                  </TextContainer>
                </Section>
                <Section title="Who can I speak with if I need help on a live job?">
                  <TextContainer>
                    <Text>
                      If you ever need any assistance regarding live job we will always be available for you.
                      Our Customer Care department is available 24/7 and they can assist you with any issues that might appear during live jobs.
                      You can call them using the contact section in the app or by calling: 0207 397 4321. If you have a payment query or a general query please contact our Driver Support department. They are available Monday to Friday from 09:00 to 17:00.
                      You can call them on 0207 397 4320 or email them at drivers.uk@gett.com.
                    </Text>
                  </TextContainer>
                </Section>
                <Section title="How can I get the most up-to-date information?">
                  <TextContainer>
                    <Text>We have several channels of communication where we share the latest Gett news and information on new app features. </Text>
                    <Text>Follow us on our Gett Driver Facebook Page https://www.facebook.com/GettDriversUK/</Text>
                    <Text>Follow our Gett Driver Twitter @GettDrivers_UK</Text>
                    <Text>Check your emails! We send a newsletter to drivers every Monday.</Text>
                    <Text>If there are any urgent communications, we will send you a text message.</Text>
                  </TextContainer>
                </Section>
              </Accordion>
            </Tab>
            <Tab label="Compliance">
              <Accordion id={ 3 } >
                <Section title="Why do you need my documents?">
                  <TextContainer>
                    <Text>
                      We want to continue to bid for more account work. We need your most up-to-date documents to meet compliance requirements. We need pictures of your DVLA driving licence, your bill, your badge, a photo of yourself and your taxi plate number and expiry date. Compliant drivers are eligible for the best account work.
                      If at any time you need to update these documents, please upload your information using the link we sent you before or write to drivers.uk@gett.com
                    </Text>
                  </TextContainer>
                </Section>
              </Accordion>
            </Tab>
            <Tab label="Have more questions?">
              <Accordion id={ 3 } >
                <Section title="Check Gett driver manual">
                  <TextContainer>
                    <Text>
                      Check Gett driver <RefLink href="https://drive.google.com/file/d/0Bzi5FenSr2chVFBwRzJYSEM2TnNjcC12NV9STnVsSXN2c0pN/view">manual</RefLink>
                    </Text>
                  </TextContainer>
                </Section>
              </Accordion>
            </Tab>
          </Tabs>
        </Container>
      </FrontOfficeLayout>
    )
  }
}

const Container = styled.div`
  padding: 15px 15px 15px 30px;
  position: relative;
  width: 100%;
  background: #f4f7fa;
  ${media.phoneSmall`
    padding: 15px;
  `}

`
const PageHeader = styled.div`
  display: flex;
  height: 48px;
  align-items: center;
  justify-content: flex-start;
  margin-top: 20px;
  margin-right: 15px;
`

const PageName = styled.span`
  font-size: 36px;
  color: #303030;
  margin-left: 30px;

  ${media.phoneSmall`
    font-size: 22px;
    margin-left: 15px;
  `}
`
const Text = styled.p`
  font-size: 14px;
  margin:0 0 15px;
`
const RefLink = styled.a`
  text-decoration: none;
  color: #f6b530;

  &:hover {
    text-decoration: underline;
  }
`

const TextContainer = styled.div`
  padding: 26px 0;
  max-width: 750px;
`

const TitleText = styled.div`
  font-size: 14px;
  margin-bottom: 10px;
  font-weight: bold;
`

const BackArrow = styled(IconArrow)`
  margin-left: 15px;
`

const QuestionIcon = styled(IconQuestion)`
  margin-left: 15px;
`

const PageQuestion = styled.div`
  flex: 1;
  text-align:right;
`
const LinkWrapper = styled(Link)`
  z-index: 100;
`

const Table = styled.table`
  font-size: 14px;
  border-spacing: 0;
  border-collapse: collapse;
  
  th {
    padding: 15px 0;
    color: #8794a0;
  }
  
  tr {
    td {
      text-align: center;
      padding: 15px;
      border-bottom: 1px solid #d7dee0;
    }
   
    td:first-child {
      padding:15px 15px 15px 0;
      text-align: left;
      border-right: 1px solid #d7dee0;
      font-weight: bold;
      color: #000;
    }
   
    td:last-child {
      border-left: 1px solid #d7dee0;
    }
  }
`

export default FAQ
