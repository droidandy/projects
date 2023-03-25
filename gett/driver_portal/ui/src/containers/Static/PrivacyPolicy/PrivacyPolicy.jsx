import React, { Component } from 'react'
import styled from 'styled-components'
import { Circle } from 'containers/Static/components/Circle'
import { media } from 'components/Media'
import { FrontOfficeLayout } from 'containers/Layouts/FrontOfficeLayout'

export default class PrivacyPolicy extends Component {
  render() {
    const { currentUser, logout, history: { location }, setVehicle } = this.props

    return (
      <FrontOfficeLayout
        setVehicle={ setVehicle }
        currentUser={ currentUser }
        logout={ logout }
        location={ location }
      >
        <PageHeader>
          <PageName>Gett Privacy Policy</PageName>
        </PageHeader>
        <Container>
          <TextContainer>
            <div>
              <TextBlock>
                <IndexNumber number={ 1 } />
                <Text>
                  GT Gettaxi (UK) Limited (“Gett”) is an English company incorporated and registered in England and Wales with company number 07603404 whose registered office is at 64 Princes Court, 88 Brompton Road, Knightsbridge, London, SW3 1ES.
                  Gett is committed to protecting and respecting your, the user’s, privacy.
                </Text>
              </TextBlock>
              <TextBlock>
                <IndexNumber number={ 2 } />
                <Text>
                  Safeguarding your personal information is important to Gett and it recognises the responsibility you entrust it with when providing your personal data.
                  This Privacy Policy details how your personal information is used by Gett both actively and passively, when you use the website, www.gett.com/uk (“the Site”), and/or download or use the Gett Mobile Telephone Application (“the App”).
                  This policy (together with Gett’s Terms & Conditions and any other documents referred to on it) Gett wishes to outline the basis on which any personal data Gett collect from you, or that you provide to Gett, will be processed including,
                  what information it may collect from you via the Site and/or the App, how it will use it, how it may disclose information provided by you to third parties and the use of “cookies” on the Site and by the App.
                </Text>
              </TextBlock>
              <TextBlock>
                <IndexNumber number={ 3 } />
                <Text>
                  Gett is committed to safe-guarding your personal information in line with the UK’s data protection laws, specifically the Data Protection Act 1998 (the “DPA”).
                  For the purposes of the DPA, the data controller is GT Gettaxi (UK) Limited of 64 Princes Court, 88 Brompton Road, Knightsbridge, London, SW3 1ES.
                  Please read the following carefully to understand Gett’s views and practices regarding your personal data and how Gett will treat it.
                </Text>
              </TextBlock>
              <TextBlock>
                <IndexNumber number={ 4 } />
                <Text>
                  By using Gett’s services or registering, downloading information or entering the Site and/or the App you are accepting and consenting to the practices described in this policy, and consent to the processing (including collecting, using, disclosing, retaining or disposing) of your information under the terms of this policy.
                  The information Gett holds about you may be held and processed on computer and/or paper files.
                </Text>
              </TextBlock>
            </div>
            <div>
              <Title>Send your message to Our Support Team</Title>
              <TextBlock>
                <IndexNumber number={ 5 } />
                <Text>Gett may collect and process data about you relating to:</Text>
              </TextBlock>
              <List>
                <ListItem>
                  the provision of services or online content in order to deal with your requests and enquiries.
                  This includes data you provide at the time of: registering to use the Site and/or the App; subscribing to any services or Gett offers; downloading information posted on the Site and/or the App; posting material; or requesting further services from Gett;
                </ListItem>
                <ListItem>
                  data you provide in connection with or participation in any promotions or competitions sponsored, promoted or offered by Gett and/or any third party and any data provided to Gett by way of feedback, profile forms or Site issues;
                </ListItem>
                <ListItem>
                  your contacting it, for example you may provide information about you when corresponding with Gett by email, post, telephone or otherwise, in which case Gett may keep a record of that correspondence to respond to your enquiries and improve its services;
                </ListItem>
                <ListItem>
                  other information from your interaction with the Site and/or the App, services, content and advertising. With regard to each of your visits to the Site and/or use of the App, Gett may automatically collect technical information and information about your visit,
                  including computer and connection information, statistics on page views, traffic to and from the Site, ad data, IP address, standard web log information and the resources that you access; and
                </ListItem>
              </List>
              <TextBlock>
                <IndexNumber number={ 6 } />
                <Text>
                  Gett may receive information about you if you use any of the other websites it operates or the other services it provides.
                  Gett are also working closely with third parties (including, for example, business partners, sub-contractors in technical, payment and delivery services, advertising networks, analytics providers, search information providers, credit reference agencies) and may receive information about you from them.
                </Text>
              </TextBlock>
              <TextBlock>
                <IndexNumber number={ 7 } />
                <Text>
                  Gett may also share your data with its UK-based third party statistical analytics service provider, solely for the provision of analytics and to better understand its users.
                </Text>
              </TextBlock>
            </div>
            <div>
              <Title>IP addresses and cookies</Title>
              <TextBlock>
                <IndexNumber number={ 8 } />
                <Text>
                  Gett may collect information about your computer and/or your mobile telephone device, including where available your IP address, operating system and browser type, for system administration and to report aggregate information to Gett’s advertisers.
                  This is statistical data about Gett’s users’ browsing actions and patterns, and does not identify any individual.
                </Text>
              </TextBlock>
              <TextBlock>
                <IndexNumber number={ 9 } />
                <Text>
                  For the same reason, the Site and the App both use cookies to distinguish you from other users. Gett may use a cookie file, which is stored on the browser or hard drive of your computer and/or your mobile telephone device, to obtain information about your general internet usage by.
                  Cookies contain information that is transferred to your computer’s and/or mobile telephone device’s hard drive.
                  They help Gett to improve the Site and the App, and to deliver a better and more personalised service. They enable Gett:
                </Text>
              </TextBlock>
              <List>
                <ListItem>to estimate Gett’s audience size and usage pattern and perform other analytics;</ListItem>
                <ListItem>
                  to store information about your preferences and so allow Gett to customise the Site and/or App according to your individual interests;
                </ListItem>
                <ListItem>
                  to continually improve Gett’s services; and
                </ListItem>
                <ListItem>
                  to recognise you when you return to the Site and/or App.
                </ListItem>
              </List>
              <TextBlock>
                <IndexNumber number={ 10 } />
                <Text>
                  You may block cookies by activating the setting on your browser that allows you to refuse the setting of all or some cookies.
                  However, if you select this setting you may be unable to access certain parts of the Site and/or App, for example, you may not be able to shop online.
                  Unless you have adjusted your browser setting so that it will refuse cookies, Gett’s system will issue cookies when you log on to the Site and/or use the App.
                  You may wish to look at <RefLink href="http://www.aboutcookies.org/">http://www.aboutcookies.org/</RefLink> which has further information on cookies and how to manage them.
                </Text>
              </TextBlock>
            </div>
            <div>
              <Title>Where Gett stores your personal data</Title>
              <TextBlock>
                <IndexNumber number={ 11 } />
                <Text>
                  The data that Gett collects from you may be transferred to, and stored at, a destination outside the European Economic Area (“EEA”).
                  It may also be processed by staff operating outside the EEA who work for Gett or for one of its suppliers, service providers or partner entities
                  By submitting your personal data, you agree to this transfer, storing or processing.
                  Gett will take all steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Policy.
                </Text>
              </TextBlock>
              <TextBlock>
                <IndexNumber number={ 12 } />
                <Text>
                  Where Gett has given you (or where you have chosen) a username, login or password which enables you to access certain parts of the Site and/or the App,
                  you are responsible for keeping this information confidential.
                  Gett asks you not to share a username, login or password with anyone.
                </Text>
              </TextBlock>
              <TextBlock>
                <IndexNumber number={ 13 } />
                <Text>
                  Unfortunately, the transmission of information via the internet and/or by mobile telephone applications is not completely secure.
                  Although Gett will do its best to protect your personal data, Gett cannot guarantee the security of your data transmitted to the Site and/or the App; any transmission is at your own risk.
                  Once Gett has received your information, it will use strict procedures and security features to try to prevent unauthorised access.
                </Text>
              </TextBlock>
              <TextBlock>
                <IndexNumber number={ 14 } />
                <Text>
                  Gett restricts access to your data to individuals who need access to it in order to process it on Gett’s behalf.
                  These individuals, where employees, are bound by confidentiality agreements and Gett will take appropriate action
                  (which may include disciplinary proceedings) in the event Gett finds that its employee(s) has failed to meet standards in looking after your personal data.
                  Gett cannot accept any liability for employees or agents acting outside its normal course of business.
                </Text>
              </TextBlock>
            </div>
            <div>
              <Title>Uses made of the information</Title>
              <TextBlock>
                <IndexNumber number={ 15 } />
                <Text>Gett uses information held about you in the following ways:</Text>
              </TextBlock>
              <List>
                <ListItem>to ensure that content on the Site and/or the App is presented in the most effective manner for you and for your computer and/or your mobile telephone;</ListItem>
                <ListItem>to provide you with information, products or services that you request from Gett or which may interest you, where you have consented to be contacted for such purposes;</ListItem>
                <ListItem>to carry out Gett’s obligations arising from any contracts entered into between you and Gett (including but not limited to providing you with the information, goods and/or services you request from it);</ListItem>
                <ListItem>to provide you with information about other goods and services Gett offers that are similar to those that you have already purchased or enquired about;</ListItem>
                <ListItem>to allow you to participate in interactive features of Gett’s services, when you choose to do so;</ListItem>
                <ListItem>to contact you for your views on Gett’s services and to notify you about changes or developments to Gett’s service;</ListItem>
                <ListItem>to administer the Site and the App, and for internal operations, including troubleshooting, data analysis, testing, research, statistical and survey purposes;</ListItem>
                <ListItem>as part of Gett’s efforts to keep the Site and the App safe and secure;</ListItem>
                <ListItem>to measure or understand the effectiveness of any advertising Gett serve to you and others, and to deliver relevant advertising to you;</ListItem>
                <ListItem>to improve the Site and/or the App including tailoring it to your needs;</ListItem>
                <ListItem>to use GPS to identify the location of users.</ListItem>
              </List>
              <TextBlock>
                <IndexNumber number={ 16 } />
                <Text>
                  Gett’s third party analytics service provider may cross-reference your data with data it already holds (independently of Gett) to provide Gett with statistical analysis of the demographic of its users.
                  Gett uses aggregated and anonymous analytics information for internal business planning and other similar purposes.
                </Text>
              </TextBlock>
              <TextBlock>
                <IndexNumber number={ 17 } />
                <Text>
                  Gett may also use your data, or permit selected third parties to use your data, to provide you with information about goods and services which may be of interest to you and Gett or they may contact you about these by email, post or telephone.
                </Text>
              </TextBlock>
              <TextBlock>
                <IndexNumber number={ 17 } />
                <Text>
                  If you are a new customer, and where Gett permits selected third parties to use your data, Gett (or any third party) will contact you by electronic means only if you have consented to this.
                  If you do not want Gett to use your data in these ways, or to pass your details on to third parties for marketing purposes,
                  please tick the relevant box situated on the form on which it collects your data (the registration form),
                  or contact Gett by post at 612 Highgate Studios, 53-79 Highgate Road, London, NW5 1TL or by email at <RefLink href="mailto:help@gett.com">help@gett.com</RefLink>.
                  Gett will be happy to remove you from Gett’s marketing list and will do so as soon as reasonably practicable after receiving your written request and adequately verifying your identity.
                </Text>
              </TextBlock>
            </div>
            <div>
              <Title>Disclosure of your information</Title>
              <TextBlock>
                <IndexNumber number={ 18 } />
                <Text>
                  Gett may disclose your personal information to any member of Gett’s group, which means Gett’s ultimate holding company and its subsidiaries. Gett may also use your information to send you offers and news about Gett’s services or those of other carefully selected companies which Gett thinks may be of interest to you.
                  Gett may contact you by post, email, telephone or fax for these purposes.
                </Text>
              </TextBlock>
              <TextBlock>
                <IndexNumber number={ 19 } />
                <Text>
                  Gett may share your information with selected third parties including: business partners, suppliers and sub-contractors for the performance of any contract it enters into with them or you; advertisers and advertising networks that require the data to select and serve relevant adverts to you and others;
                  and analytics and search engine providers that assist Gett in the improvement and optimisation of the Site, the App, or its products and services.
                </Text>
              </TextBlock>
              <TextBlock>
                <IndexNumber number={ 20 } />
                <Text>
                  Gett may share your information with selected third parties including: business partners, suppliers and sub-contractors for the performance of any contract it enters into with them or you; advertisers and advertising networks that require the data to select and serve relevant adverts to you and others;
                  and analytics and search engine providers that assist Gett in the improvement and optimisation of the Site, the App, or its products and services.
                </Text>
              </TextBlock>
              <TextBlock>
                <IndexNumber number={ 21 } />
                <Text>
                  Gett may also pass your information on to any successor or potential successor in title to the business and suppliers that process data on Gett’s behalf both in the United Kingdom and abroad.
                  Gett may also use and disclose information in aggregate (so that no individual customers are identified) for marketing and strategic purposes.
                </Text>
              </TextBlock>
              <TextBlock>
                <IndexNumber number={ 22 } />
                <Text>
                  Gett may disclose your personal data to third parties: in the event that Gett sells or buys any business or assets, in which case it may disclose your personal data to the prospective seller or buyer of such business or assets; if Gett or substantially all of its assets are acquired by a third party, in which case personal data held by it about its customers will be one of the transferred assets;
                  or if Gett is under a duty to disclose or share your personal data in order to comply with any legal obligation, or in order to enforce or apply its Terms and Conditions <RefLink href="http://gett.com/uk/terms-conditions.html">http://gett.com/uk/terms-conditions.html</RefLink> and other agreements; or to protect the rights, property, or safety of Gett, its customers, or others.
                  This includes exchanging information with other companies and organisations for the purposes of fraud protection and credit risk reduction.
                </Text>
              </TextBlock>
            </div>
            <div>
              <Title>Your rights</Title>
              <TextBlock>
                <IndexNumber number={ 23 } />
                <Text>
                  You have the right to request that Gett does not process your personal data for marketing purposes.
                  You can exercise your right to prevent such processing by contacting Gett at any time by post at 612 Highgate Studios, 53-79 Highgate Road, London, NW5 1TL or by email to <RefLink href="mailto:help@gett.com">help@gett.com</RefLink>.
                  You also have the right to ask Gett to amend any data it holds about you if it is inaccurate or misleading as to any matter of fact.
                  Gett also asks that you provide it with two forms of photographic identification so that Gett can verify your identity.
                  Any request to amend Gett’s records should be in writing and addressed to it by post at 612 Highgate Studios, 53-79 Highgate Road, London, NW5 1TL or by email at <RefLink href="mailto:help@gett.com">help@gett.com</RefLink>.
                </Text>
              </TextBlock>
              <TextBlock>
                <IndexNumber number={ 24 } />
                <Text>
                  From time to
                  Safeguarding your personal information is important to Gett and it recognises the responsibility you entrust it with when providing your personal data.
                  This Privacy Policy details how your personal informatio time Gett may post links to third party websites on the Site and/or the App.
                  These links are provided as a courtesy to Gett’s customers and are not administered or verified in any way by Gett.
                  Such links are accessed by you at your own risk and Gett makes no representations or warranties about the content of such websites including any cookies used by the website operator.
                  If you follow a link to any of these websites, please note that these websites have their own privacy policies and that Gett does not accept any responsibility or liability for these policies.
                  As a result, Gett strongly recommends that you read the privacy policies of any third party websites before you provide any personal data to them.
                </Text>
              </TextBlock>
            </div>
            <div>
              <Title>Access to information</Title>
              <TextBlock>
                <IndexNumber number={ 25 } />
                <Text>
                  The DPA gives you the right to access information held about you. Your right of access can be exercised in accordance with the DPA.
                  Any access request may be subject to a fee of £10.00 to meet Gett’s costs in providing you with details of the information it holds about you.
                  Gett also asks that you provide it with two forms of photographic identification so that it can verify your identity.
                  Any request should be in writing and addressed to Gett by post at 612 Highgate Studios, 53-79 Highgate Road, London, NW5 1TL or by email at <RefLink href="mailto:help@gett.com">help@gett.com</RefLink>.
                  Gett will use reasonable efforts to supply, correct or delete personal information about you on its files.
                  Gett shall endeavour to respond as soon as practicably possible within the statutory period of 40 calendar days from receipt of the request and fee.
                </Text>
              </TextBlock>
            </div>
            <div>
              <Title>Changes to Gett’s Privacy Policy</Title>
              <TextBlock>
                <IndexNumber number={ 26 } />
                <Text>
                 Any changes Gett may make to this Privacy Policy in the future will be posted on this page and, where appropriate, notified to you (usually by e-mail).
                 This Privacy Policy will be updated from time to time, so you may want to check it each time you send Gett personal information.
                 The date of the most recent revisions will appear on this page.
                </Text>
              </TextBlock>
            </div>
          </TextContainer>
        </Container>
      </FrontOfficeLayout>
    )
  }
}

const Container = styled.div`
  background: #fff;
  margin: 15px 15px 15px 30px;
  ${media.phoneSmall`
    padding: 15px;
  `}
`
const TextContainer = styled.div`
  padding-top: 35px;
  width: 80%;
  margin: 0 auto;
`

const Text = styled.p`
  margin: 0 0 0 20px;
  font-size: 14px;
  color: #000;
`

const Title = styled.div`
  margin: 0 0 25px 0;
  font-size: 20px;
  font-weight: bold;
`

const PageHeader = styled.div`
  display: flex;
  height: 48px;
  align-items: center;
  justify-content: flex-start;
  margin-top: 20px;
`

const List = styled.ul`
  list-style: none;
  font-size: 14px;
  margin: 20px 0 0 50px;
  padding: 0;
`

const IndexNumber = styled(Circle)`
  margin-right: 20px;
`

const ListItem = styled.li`
  padding-left: 10px;
  position: relative;
  margin-bottom: 20px;
  &:before {
    width: 6px;
    height: 6px;
    left: 0;
    top: 5px;
    position: absolute;
    border-radius: 50%;
    content: "";
    display: block;
    background-color: #f6b530;
  }
`

const RefLink = styled.a`
  text-decoration: none;
  color: #f6b530;

  &:hover {
    text-decoration: underline;
  }
`

const TextBlock = styled.div`
  align-items: baseline;
  margin-bottom: 20px;
  display: flex;
`

const PageName = styled.span`
  font-size: 36px;
  color: #303030;
  margin-left: 30px;
`
