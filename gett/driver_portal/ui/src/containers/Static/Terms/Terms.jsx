import React, { Component } from 'react'
import styled from 'styled-components'
import { Circle } from 'containers/Static/components/Circle'
import { media } from 'components/Media'
import { FrontOfficeLayout } from 'containers/Layouts/FrontOfficeLayout'

export default class Terms extends Component {
  render() {
    const { currentUser, logout, history: { location }, setVehicle } = this.props

    return (
      <FrontOfficeLayout
        currentUser={ currentUser }
        setVehicle={ setVehicle }
        logout={ logout }
        location={ location }
      >
        <PageHeader>
          <PageName>
            Terms and Condition
          </PageName>
        </PageHeader>
        <Container>
          <UpdateStatus>Updated: 10 / 10 / 2017</UpdateStatus>
          <TextContainer>
            <MainTitle>IMPORTANT:</MainTitle>
            <p>
              THESE TERMS AND CONDITIONS (“Conditions”) DEFINE THE BASIS UPON WHICH GETT WILL PROVIDE YOU WITH ACCESS TO THE GETT MOBILE APPLICATION PLATFORM,
              PURSUANT TO WHICH YOU WILL BE ABLE TO PROVIDE CERTAIN TRANSPORTATION SERVICES TO CUSTOMERS ON RECEIPT OF ORDERS MADE THROUGH GETT’S MOBILE APPLICATION PLATFORM.
              THESE CONDITIONS (TOGETHER WITH THE DOCUMENTS REFERRED TO HEREIN) SET OUT THE TERMS OF USE ON WHICH YOU MAY, AS A DRIVER, USE THE APP AND PROVIDE THE TRANSPORTATION SERVICES.
              BY USING THE APP, YOU INDICATE THAT YOU ACCEPT THESE TERMS OF USE WHICH APPLY, AMONG OTHER THINGS,\
              TO ALL SERVICES HEREINUNDER TO BE RENDERED TO OR BY YOU VIA THE APP WITHIN THE UK AND THAT YOU AGREE TO ABIDE BY THEM.
              PLEASE READ THESE TERMS OF USE CAREFULLY BEFORE YOU START TO USE THE APP AND/OR PROVIDE TRANSPORTATION SERVICES.
              IF YOU DO NOT AGREE TO THESE TERMS OF USE, YOU MUST NOT USE THE APP OR PROVIDE THE TRANSPORTATION SERVICES.
            </p>
            <div>
              <TextBlock>
                <IndexNumber number={ 1 } />
                <Title>Definitions and Interpretation</Title>
              </TextBlock>
              <Text>
                1.1 In these Conditions (unless the context otherwise requires), the following words and phrases shall have the following meanings:
              </Text>
              <Text><BoldText>“App”</BoldText> means the mobile application which provides a platform for access to the Services and is owned by Gett;</Text>
              <Text><BoldText>“Applicable Law”</BoldText> means all laws and regulations applicable in England and Wales;</Text>
              <Text><BoldText>“Collection Location”</BoldText> means the locations as notified via the App, from which the Customers  are to be collected;</Text>
              <Text><BoldText>“Customers”</BoldText> means the customers identified via the App who wish to engage Transportation Services;</Text>
              <Text><BoldText>“Customer Personal Data”</BoldText> means Personal Data of the Customer which is processed by either party in connection with these Conditions;</Text>
              <Text>
                <BoldText>“Data Protection Laws”</BoldText> means (until 25 May 2018) the Data Protection Act 1998 and (from 25 May 2018) the General Data Protection Regulation, together with all legislation made thereunder and any other laws relating to the processing of Personal Data,
                in each case as amended, superseded or replaced from time to time;
              </Text>
              <Text>
                <BoldText>“Delivery Location”</BoldText> means the location notified by the Customer using the App, which will be the final destination of the Transportation Services;
              </Text>
              <Text>
                <BoldText>“Driver”</BoldText> means a person who is an independent vehicle owner and/or operator who has accepted these Conditions with Gett to provide transportation services to Customers who place Orders in the App,
                as an independent contractor working on his or her own account;
              </Text>
              <Text>
                <BoldText>“Driver Account”</BoldText> means the Driver’s account with Gett which contains the Driver’s personal information including their name, address, date of birth, licensing and insurance information.
              </Text>
              <Text><BoldText>“Fees”</BoldText> means the fees payable to the Driver for the Transportation Services as set out in Condition 5 which is separate to any additional fees which Gett may pay at its sole discretion;</Text>
              <Text>
                <BoldText>“Gett”</BoldText> means GT GETTAXI (UK) LIMITED a company established under the laws of England and Wales with company number 07603404 whose registered office is at Seal House, 3rd Floor, 1 Swan Lane, London, EC4R 3TN;
              </Text>
              <Text>
                <BoldText>“Gett Together”</BoldText> means the Transportation Service provided on a pre-defined and set route for multiple Customers;
              </Text>
              <Text>
                <BoldText>“Insurance”</BoldText> means the following Driver insurances:
              </Text>
              <List>
                <ListItem>(i) fully comprehensive taxi insurance; and</ListItem>
                <ListItem>(ii) public liability insurance with a minimum cover of £1,000,000 per event;</ListItem>
              </List>
              <Text>
                <BoldText>“Intellectual Property Rights”</BoldText> means any and all patents, trademarks and service marks, registered designs, design rights and copyright, moral rights,
                rights in data and databases and other protectable lists of information, rights in confidential information, trade secrets, inventions and know how, trade and business names,
                domain names, get ups, logos and trade dress (including all extensions, revivals and renewals, where relevant) in each case whether registered or unregistered and
                application for any of them and the goodwill attaching to any of them and any rights or forms of protection of a similar nature and having equivalent or similar effect to any of them which may subsist anywhere in the world;
              </Text>
              <Text>
                <BoldText> “Minimum Acceptance Rate”</BoldText> means the minimum Order acceptance rates and the minimum Customer evaluation rating set by Gett from time to time at its sole discretion;
              </Text>
              <Text>
                <BoldText>“Order”</BoldText> means a request for Transportation Services by a Customer via the App;
              </Text>
              <Text>
                <BoldText>“Privacy Policy”</BoldText> means Gett’s privacy policy which is available on the Gett website or by clicking <RefLink href="/privacy">here</RefLink>;
              </Text>
              <Text>
                <BoldText>“Personal Data”</BoldText> has the meaning set out in the Data Protection Law;
              </Text>
              <Text>
                <BoldText>“Ride Fee”</BoldText> means the total fee payable by the Customer for each Order;
              </Text>
              <Text>
                <BoldText>“Services”</BoldText> means the platform, through the App or otherwise, which connects Customers and Drivers for the performance of Transportation Services in accordance with Orders;
              </Text>
              <Text>
                <BoldText>“Service Commission”</BoldText> means the commission payment payable by the Driver to Gett for the Services, being 10% of the Ride Fees plus value added tax, or such other commission amount as Gett may notify from time to time;
              </Text>
              <Text>
                <BoldText>“Transportation Services”</BoldText> means the transportation services provided by a Driver to Customers from a Collection Location to a Delivery Location in accordance with Orders; and
              </Text>
              <Text>
                <BoldText>“Week”</BoldText> means Monday to Sunday (inclusive).
              </Text>
              <Text>
                1.2 In these Conditions (unless the context requires otherwise):
              </Text>
              <Text>
                1.2.1 the words <BoldText>“including”</BoldText>, <BoldText>“include”</BoldText>, or <BoldText>“in particular”</BoldText> means including, includes or in particular without limitation and words in the singular include the plural and in the plural shall include the singular;
              </Text>
              <Text>
                1.2.2  references to <BoldText>“you”</BoldText> and <BoldText>“your”</BoldText> shall be construed as references to the Driver.  References to <BoldText>“us”</BoldText> and <BoldText>“we”</BoldText> shall mean Gett;
              </Text>
              <Text>
                1.2.3 reference to a party shall, upon any assignment or other transfer that is permitted by these Conditions, be construed to include those successors and permitted assigns or transferees;
              </Text>
              <Text>
                1.2.4 the contents list, headings, and any descriptive notes are for ease of reference only and shall not affect the construction or interpretation of these Conditions; and
              </Text>
              <Text>
                1.2.5 reference to any legislative provision shall be deemed to include any statutory instrument, bylaw, regulation, rule, subordinate or delegated legislation or order and any rules and regulations which are made under it, and any subsequent reenactment or amendment of the same.
              </Text>
            </div>
            <div>
              <TextBlock>
                <IndexNumber number={ 2 } />
                <Title>Services</Title>
              </TextBlock>
              <Text>
                2.1 The App provides a means to enable Customers who seek transportation to certain destinations to be connected with Drivers.
                Gett does not provide transportation services, rather we are a technological service provider that uses an electronic platform to provide the Services.
              </Text>
              <Text>
                2.2 You will need to provide your own mobile device in order to download the App and will be responsible for all costs associated with such mobile device including, without limitation, any data or call charges.
              </Text>
              <Text>
                2.3 You are free to use the App at any time and no minimum or maximum periods of use are applied save that you must ensure that you comply with any regulatory and insurance requirements imposed on you as a provider of the Transportation Services particularly in respect of periods of rest.
                Drivers may be offered additional payments or priority status in connection with their level of usage.
              </Text>
              <Text>
                2.4 Notwithstanding the provisions of Condition 2.1, Gett does not guarantee availability nor uninterrupted or error free use of the App and shall not be liable for any damage, loss, claims, costs or expenses resulting from or as a consequence of scheduled or unscheduled downtime, unavailability or slowness.
              </Text>
              <Text>
                2.5 Nothing contained in these Conditions shall be construed or have effect as constituting any relationship of employer and employee between Gett and the Driver.
                Drivers will at all times be independent contractors of Transportation Services.
              </Text>
              <Text>
                2.6 Nothing in these Conditions shall constitute the Driver acting as an agent of Gett.
                The Driver shall not have any right or power whatsoever to contract on behalf of Gett or bind Gett in any way in relation to third parties unless specifically authorised to do so.
                Only in respect of Condition 5.2, is Gett acting as a commercial agent of the Driver and only for the purposes of U.K. payment services regulations.
              </Text>
            </div>
            <div>
              <TextBlock>
                <IndexNumber number={ 3 } />
                <Title>Transportation Services</Title>
              </TextBlock>
              <Text>
                3.1 You shall be solely responsible for determining the most effective, efficient and safe manner to perform each Order.
                As an independent contractor in business on your own account, you shall be responsible for furnishing at your own expense any necessary equipment, tools and materials unless otherwise noted herein.
              </Text>
              <Text>
                3.2 You acknowledge that your geolocation information must be provided by your device in order to enable you to provide the Transportation Services.
                You acknowledge and agree that your geolocation information will be accessible by the App and when you are loggedin your location will be displayed to Gett and Customers.
              </Text>
              <Text>
                3.3 You acknowledge and agree that you will be responsible for making your own decision as to the accuracy and suitability of a Customer and as to whether you will accept or decline to provide them with Transportation Services.
                If you provide Transportation Services to someone who is not a customer or is not the Customer identified via the App for you to provide Transportation Services to, you agree that you will not be paid for these Transportation Services.
                Further, you will not be paid (other than directly by a customer) for any Transportation Services you provide to a Customer once you have completed the ride in the App and any further transportation services you provide to a Customer are at your own risk.
              </Text>
            </div>
            <div>
              <TextBlock>
                <IndexNumber number={ 4 } />
                <Title>Driver Requirements</Title>
              </TextBlock>
              <InlineText>4.1 In order to provide the Transportation Services, you must:</InlineText>
              <InlineText>4.1.1 have a valid full UK drivers licence which you have held for longer than 12 months;</InlineText>
              <InlineText>4.1.2 have valid Insurance;</InlineText>
              <InlineText>4.1.3 hold a taxi licence valid in the local area where you will provide the Transportation Services;</InlineText>
              <InlineText>4.1.4 have a clean and well maintained vehicle for the provision of Transportation Services;</InlineText>
              <InlineText>4.1.5 have antivirus software installed and maintained on your device which will provide appropriate security against unauthorised access to Customer Personal Data;</InlineText>
              <InlineText>4.1.6 abide by the terms of any contractor standards issued by Gett from time to time; and</InlineText>
              <Text>4.1.7 not download any software or other applications which may interfere with or modify the App or its operation.</Text>
              <Text>
                together the <BoldText>“Minimum Requirements”</BoldText>. You must notify Gett immediately if you do not have any of the Minimum Requirements and you must cease to provide the Transportation Services immediately.
              </Text>
              <Text>
                4.2 You warrant that you will provide the Transportation Services in full conformity to the Minimum Requirements and shall not do anything in contravention of these requirements and/or which may threaten the validity of, or limit the cover provided by, such Minimum Requirements.
                In addition, you must only accept Orders that are in accordance with the conditions and requirements of your taxi licence, including any zoning requirements.
                You shall indemnify Gett against all liabilities, costs, expenses, damages and losses (including but not limited to any direct, indirect or consequential losses,
                loss of profit, loss of reputation and all interest, penalties and legal costs (calculated on a full indemnity basis) and all other professional costs and expenses) suffered or incurred arising out of, or in connection with, a breach by you of this Condition 4.2.
              </Text>
              <Text>
                4.3 Gett reserves the right to give priority to Drivers that have better operational performance, and to exclude (temporarily or permanently) Drivers that do not meet the Minimum Requirements and any other operational threshold set by Gett in the future.You agree that you will maintain the Minimum Acceptance Rate.
                If you accept an Order from a Customer and you do not wish to provide Transportation Services to that Customer again, you may rate that Customer in such a manner that the Customer will not be permitted to receive the Transportation Services from you again.
              </Text>
              <Text>
                4.4 At all times when providing the Transportation Services, you acknowledge and warrant that you will comply with the requirements of the Equality Act 2010 (as amended) and any other Applicable Law.
                You acknowledge that as a requirement of your taxi/private hire licence you are required to be a “fit and proper person” and you agree that you will at all times maintain this status and not act in a manner that could reasonably be considered to be contrary to this requirement.
              </Text>
              <Text>
                4.5 You acknowledge and agree that when accepting an Order, you will immediately update the App when you reach the Collection Location and the Delivery Location and when the Customer enters your vehicle if you are required to wait for the Customer.
                You acknowledge that if you fail or delay in updating the App, this will be deemed as fraudulent activity and you may not be paid (in whole or in part) for the Transportation Services and/or your access to the App may be suspended.
              </Text>
              <Text>
                4.6 If, during the provision of the Transportation Services, you are involved in an accident or you are involved in any incident involving a Customer, you must immediately notify Gett by contacting our customer service centre on the number provided in the App.
              </Text>
            </div>
            <div>
              <TextBlock>
                <IndexNumber number={ 5 } />
                <Title>Fees and Promotions </Title>
              </TextBlock>
              <Text>5.1 In consideration of the Services, you are required to pay Gett the Service Commission.</Text>
              <Text>
                5.1.1 for Gett Together, Ride Fees will be paid on a fixed fee basis and Drivers will receive their Fee based upon a set number of hours of providing the Gett Together Transportation Services.
                The Fee payable will be notified in the App; and
              </Text>
              <InlineText>5.2 Fees payable to Drivers for Transportation Services are calculated as follows:</InlineText>
              <InlineText>
                5.2.2 for Transportation Services other than Gett Together, Ride Fees may be paid on a fixed fee basis or on a meter basis. Fees payable to Drivers will be the Ride Fee less the Service Commission.  Where the Ride Fees are paid on a fixed fee basis, the amount of the Fee payable to you (subject to deduction of Service Commission)
                will be notified via the App and you will have the opportunity to either accept or decline the Order and where the Ride Fees are chargeable on a metered basis, you will be paid in accordance with the metered fare recorded by the App (less Service Commission), subject to you abiding by the terms of Condition 4.5.
              </InlineText>
              <Text>
                As part of the Services, Gett shall collect all the Ride Fees from the Customer on behalf of Drivers. Gett may also levy charges on the Customer for the Services. From time to time Gett may offer you additional payments at its sole discretion, however such payments will not be for Transportation Services.
                You agree and appoint Gett to be commercial agent solely of the Driver in collecting all Ride Fees and distributing the Fees to Drivers in respect of the U.K. payment services regulations.
              </Text>
              <Text>
                5.3 Within five days following the end of a Week, Gett shall provide the Driver with a statement which shall set out the Orders completed and the Fees due to the Driver (plus where relevant Service Commission payable) (“Driver Statement”). The Driver Statement will also include any separate additional fees payable to the Driver by Gett.  If you believe the Driver Statement is incorrect, you must notify Gett within 24 hours via email to Drivers.uk@Gett.com and Gett will investigate this dispute.  You must provide Gett with all reasonable assistance and information requested when they are investigating your dispute. Gett will investigate your dispute and it’s decision shall be final.
                If you fail to notify Gett of your dispute or cooperate in accordance with this Condition 5.3, you will be deemed to have accepted the Driver Statement and the Fees due.
              </Text>
              <Text>
                5.4 If a Customer challenges or otherwise disputes the accuracy of the Transportation Services or the charges levied in respect of the same, Gett may withhold payment of the Fees in respect of that Order or, if the Fees have already been paid to the Driver, may deduct an amount equivalent to the disputed Fees from the next Driver Statement payment.
                Gett will investigate the Customer dispute and it’s decision on payment of such disputed Fees shall be final.
              </Text>
              <Text>
                5.5 Gett will pay you the Fees less the Services Commission in arrears in accordance with the Driver Statement. Gett will endeavour to process all payments to you within a week (subject to any disputes) of the date of the issue of the Driver Statement.
                For the avoidance of doubt this means that if for example you perform Transportation Services on a Monday, you will not be paid for those services until after the Driver Statement has been issued (and in the case of dispute, where agreed) during the following Week.
              </Text>
              <Text>
                5.6 From time to time Gett may run promotions which will offer Drivers or Customers discounts or additional fees for using the Services.
                Gett will notify you of offers that you are eligible to accept from time and any additional promotional terms and conditions.
                Where a promotion offers Drivers a bonus for completing a set numbers of Orders, you must not do anything in fulfilment of this promotion which may be deemed fraudulent.
                All Orders must involve the provision of bone fide Transportation Services to Customers and you must not create any fake or fictitious Customer profiles in order to qualify for any bonus payment.
                To achieve a promotional bonus, all Orders completed must be for the provision of Transportation Services to independent third parties and must not relate to Transportation Services to family members, friends or people known to you.
                Gett reserves the right to report any fraudulent activities to relevant law enforcement authorities.
              </Text>
              <Text>
                5.7 Where it is reasonably considered by Gett that you have acted in a manner that is otherwise than in accordance with Condition 5.5 above, Gett will notify you and, at its sole discretion, may withhold or deduct any bonus payment from the Fees paid to you and/or suspend or terminate your access to the App.
                If you receive such a notification and you believe that you have not breached the requirements of Condition 5.5, you can dispute this decision by writing to Drivers.uk@gett.com within 48 hours of receipt of such notification and providing full reasons for your dispute.
                Gett will consider your representations and will notify you of the outcome of its decision (which shall be final).
              </Text>
            </div>
            <div>
              <TextBlock>
                <IndexNumber number={ 6 } />
                <Title>Data and Data Privacy</Title>
              </TextBlock>
              <Text>
                6.1 By downloading and/or using the App you consent to Gett processing your Personal Data. Gett will process your Personal Data for purposes connected with the Services.
                From time to time, Gett may process your Personal Data in order to notify you of opportunities connected with the Services either directly or by an affiliate of Gett.
                When processing your Personal Data, Gett will take appropriate technological measures to protect and keep your Personal Data secure and shall process your information in accordance with Data Protection Laws.
                Your Personal Data may be processed outside of the EEA.
              </Text>
              <Text>
                6.2 In order to allow you to provide the Transportation Services, Customer Personal Data may be transferred to you by Gett.
                You must keep this Customer Personal Data safe and secure at all times and not allow access to any third parties to such information.
                You must not store any Customer Personal Data on your mobile device or any other mobile telephone (other than on the App) or otherwise process
                any Customer Personal Data unless the Customer provides you with express permission to do so.
              </Text>
              <Text>
                6.3 In order to allow Gett to provide the Services, Gett will provide Customers with your information so that the Customer can identify you as the provider of Transportation Services.
                Gett shall provide Customers with your name, vehicle details including registration number, telephone number and such other details in your Driver Account which may help the Customer to identify you and you confirm that you give your permission for Gett to transfer this information to the Customer.
              </Text>
              <Text>
                6.4 We also process your Personal Data in accordance with Gett’s Privacy Policy, please ensure that you read this document before using the App.
                By using the App, you acknowledge and confirm that you have understood the use of your Personal Data set out in the Privacy Policy.
              </Text>
              <InlineText>6.5 You confirm that at all times when accessing the Services and Customer Personal Data, you will:</InlineText>
              <InlineText>6.5.1 comply with all Data Protection Laws;</InlineText>
              <InlineText>6.5 2 not knowingly or recklessly do anything which would put Gett in breach of its obligations under Data Protection Laws; and</InlineText>
              <Text>6.5.3 indemnify Gett in full for any losses which it incurs as a result of a breach by you of this Condition 6.</Text>
              <InlineText>6.6 You must:</InlineText>
              <InlineText>6.6.1 notify us immediately if you become aware of any Customer Personal Data Breach;</InlineText>
              <InlineText>6.6.2 provide all information relating to the Customer Personal Data Breach which is in your possession; and</InlineText>
              <Text>6.6.3 comply with our reasonable instructions in relation to the contamination and remediation of the Customer Personal Data Breach.</Text>
              <Text>
                6.7 Gett does not guarantee that the App will be secure or free from bugs or viruses. You must not misuse the App by knowingly introducing viruses, trojans, worms, logic bombs or other material which is malicious or technologically harmful.
                You must not attempt to gain unauthorised access to the App, the server on which the App is stored or any server, device or database connected to the App.  You must not attack the App via a denialofservice attack or a distributed denialof service attack.  By breaching this provision, you may commit a criminal offence under the Computer Misuse Act 1990.  Gett will report any such breach to the relevant law enforcement authorities and Gett will cooperate with those authorities by disclosing your identity to them.
                In the event of such a breach, your right to use the App will cease immediately.
              </Text>
              <Text>
                6.8 The App may include links to other websites, apps or material which is beyond Gett’s control and which are owned and controlled by third parties.
                Gett is not responsible for the content on these links, the internet or World Wide Web pages or any other site or app outside the App.
                Where the App contain links to other sites or apps or materials provided by third parties, these links are provided for your information only.
                These links are provided as a courtesy to Gett’s users and are not administered or verified in any way by Gett.
                Such links are accessed by you at your own risk and Gett makes no representations or warranties about the content of such websites or apps and cannot be held liable for the content and activities of these websites or any losses you suffer as a result of using such third party websites.
                Gett may provide links to third party websites or apps that use cookies on users to collect data and/or to solicit personal information.
                As a result, Gett strongly recommends that you read the privacy policies and terms of use of any third party websites or apps prior to using them.
              </Text>
              <Text>
                  6.9 Electronic Communications
                  When you use the App or send us emails or use popups or make calls, you may be communicating with Gett electronically.
                  Gett will communicate with you by email, popup, phone, text or by posting notices on the Gett website.
                  You agree that all agreements, notices, disclosures and other communications sent to you electronically satisfy any legal requirement that such communications should be in writing.
              </Text>
            </div>
            <div>
              <TextBlock>
                <IndexNumber number={ 7 } />
                <Title>Suspension or Modification</Title>
              </TextBlock>
              <Text>
                Gett reserves the right, at its sole discretion, to change, alter, suspend or indefinitely close the App and/or your access to the Services.
                From time to time, Gett may also restrict access to some or all parts of the Services and/or the App.
              </Text>
            </div>
            <div>
              <TextBlock>
                <IndexNumber number={ 8 } />
                <Title>GETT’S LIABILITY</Title>
              </TextBlock>
              <Text>
                8.1 Nothing in these Conditions excludes or limits Gett’s liability for death or personal injury arising from Gett’s negligence, or its fraud or fraudulent misrepresentation, or any other liability that cannot be excluded or limited by English law.
              </Text>
              <Text>
                8.2 The material displayed on the App is provided without any guarantees, conditions or warranties as to its accuracy.  You must bear the risks associated with the use of the App, the Services and the internet.
              </Text>
              <InlineText>
                8.3 To the fullest extent permitted by law, Gett (including its officers, directors and employees) and third parties (including any agents or subcontractors) connected to it hereby expressly exclude:
              </InlineText>
              <InlineText>
                8.3 1 all conditions, warranties and other terms which might otherwise be implied by statute, common law or the law of equity in it provision of the Services and/or use of the App; and
              </InlineText>
              <InlineText>8.3.2 any liability arising under or in connection with:</InlineText>
              <InlineText>8.3.2.1 use of, or inability to use, the App and/or Services;</InlineText>
              <InlineText>8.3.1.2 use of or reliance on any content displayed on the App;</InlineText>
              <InlineText>8.3.3.3 incompatibility of the App with any of your electronic and/or mobile equipment, devices, software or telecommunications links; and</InlineText>
              <Text>8.3.3.4 unsuitability, unreliability or inaccuracy of the App and/or the Services.</Text>
              <Text>
                8.4 To the fullest extent permitted by law you acknowledge and agree that Gett will not be liable to you or any third party for any indirect or consequential losses or for any loss of income or revenue,
                loss of business, loss of profits or contracts, loss of anticipated savings, loss of data, loss of goodwill, wasted management and/or office time, however arising and whether caused by tort (including negligence), breach of contract or otherwise, (even if foreseeable) resulting from your use of the App and/or Services.
              </Text>
              <Text>
                8.5 Gett will not be liable for any loss or damage caused by a virus, distributed denialofservice attack, or other technologically harmful material that may infect your electronic and/or mobile equipment,
                computer programs, data or other proprietary material due to your use of the
                App and/or the Services or to your downloading of any content on it, or on any website linked to it.
              </Text>
              <Text>
                8.6 Gett shall not be in breach of these Conditions nor liable for any delay in performing, or failure to perform, any of its obligations under these Conditions if such delay or failure results from events, circumstances or causes beyond its reasonable control.
              </Text>
              <Text>
                8.7 Subject to the remainder of this Condition 8, Gett’s total liability to you in connection with these Conditions and the Services, however arising whether caused by tort (including negligence), breach of contract or otherwise, shall be limited to the Fees payable to you in relation to the Order in which the liability arose.
              </Text>
            </div>
            <div>
              <TextBlock>
                <IndexNumber number={ 9 } />
                <Title>Indemnity</Title>
              </TextBlock>
              <Text>
                By accepting these Conditions you agree to defend, indemnify (compensate) and hold Gett, its affiliates, its licensors, and each of their officers, directors, other users, employees, attorneys and agents, harmless from all and against any and all claims, costs, damages, losses, liabilities and expenses (including attorney’s fees) arising out of or in connection with:
              </Text>
              <Text>9.1 your violation or breach of these Conditions or any Applicable Law or regulation, whether or not referenced herein;</Text>
              <Text>9.2 your violation or breach of any rights of any third party, including Customers; or</Text>
              <Text>9.3 your use or misuse of the App and/or Services.</Text>
            </div>
            <div>
              <TextBlock>
                <IndexNumber number={ 10 } />
                <Title>Termination</Title>
              </TextBlock>
              <Text>
                10.1 These Conditions shall exist for an indefinite period of time. However, you may terminate your agreement with us at any time by permanently deleting the App installed on any device and deactivating your account.
              </Text>
              <Text>
                10.2 Gett is entitled to terminate its provision of the Services to you or your licence to use the App, with immediate effect, by disabling your account or otherwise preventing you from accessing or using the App, at its sole discretion.
              </Text>
            </div>
            <div>
              <TextBlock>
                <IndexNumber number={ 11 } />
                <Title>Variations</Title>
              </TextBlock>
              <Text>
                11.1 Gett reserves the right, in its sole discretion, to vary these Conditions at any time.  It is your responsibility to check the terms and conditions available in the App and/or Driver portal in order ensure you agree to the latest version. The date of the most recent revisions will appear at the bottom of this page.
              </Text>
              <Text>11.2 If there is any inconsistency between Gett’s Privacy Policy and these Conditions, the Privacy Policy shall prevail.</Text>
            </div>
            <div>
              <TextBlock>
                <IndexNumber number={ 12 } />
                <Title>Assignment</Title>
              </TextBlock>
              <Text>
                Your Driver Account and the Services are personal to you, and therefore you may not assign, sublicence or transfer in any other way your rights and obligations under these Conditions of use to any third party.
                However, if necessary, Gett may freely assign its rights and obligations without your consent and without the need to notify you before assigning them.
              </Text>
            </div>
            <div>
              <TextBlock>
                <IndexNumber number={ 13 } />
                <Title>Invalidity</Title>
              </TextBlock>
              <Text>
                If any part of these Conditions are disallowed or found to be ineffective by any court or regulator, the other provisions shall continue to apply to the maximum extent permitted by law.
              </Text>
            </div>
            <div>
              <TextBlock>
                <IndexNumber number={ 14 } />
                <Title>Third Party Rights</Title>
              </TextBlock>
              <Text>
                Rights under these Conditions only accrue to a person party to these Conditions.  Accordingly a person who is not a party to these Conditions shall have no rights under the Contracts (Rights of Third Parties) Act 1999 to enforce any of its Conditions, but this does not affect any right or remedy of a third party which exists or is available apart from that Act.
              </Text>
            </div>
            <div>
              <TextBlock>
                <IndexNumber number={ 15 } />
                <Title>Waiver</Title>
              </TextBlock>
              <Text>
                  No failure or delay by Gett to exercise any right or remedy provided in these Conditions or by law shall constitute a waiver of that or any right or remedy, nor shall it preclude or restrict the further exercise of that or any right or remedy.
                  No single or partial exercise of such remedy shall preclude or restrict the further exercise of that or any other right or remedy.
              </Text>
            </div>
            <div>
              <TextBlock>
                <IndexNumber number={ 16 } />
                <Title>Partnership and Joint Venture</Title>
              </TextBlock>
              <Text>
                Nothing contained in these Conditions shall constitute a partnership or joint venture between the Driver and Gett.
              </Text>
            </div>
            <div>
              <TextBlock>
                <IndexNumber number={ 17 } />
                <Title>Your Concerns</Title>
              </TextBlock>
              <Text>If you have any concerns about material which appears on the Site and/or the App, please contact us at <RefLink href="mailto:drivers.uk@Gett.com">drivers.uk@Gett.com</RefLink>.</Text>
            </div>
            <div>
              <TextBlock>
                <IndexNumber number={ 18 } />
                <Title>Jurisdiction and Applicable Law</Title>
              </TextBlock>
              <Text>
                These Conditions, and any noncontractual obligations arising out of them, are governed and construed in accordance with the law of England and Wales and any proceedings resulting out of these terms of use, and any noncontractual obligations arising out of them, the Privacy Policy, Services and/or the use of the App shall be held in the Courts of England and Wales.
              </Text>
            </div>
          </TextContainer>
        </Container>
      </FrontOfficeLayout>
    )
  }
}

const PageHeader = styled.div`
  display: flex;
  height: 48px;
  align-items: center;
  justify-content: flex-start;
  margin-top: 20px;

  ${media.phoneSmall`
    height: auto;
  `}

`

const TextContainer = styled.div`
    max-width: 750px;
    margin: 0 auto;
    & > div {
        margin-bottom: 40px;
    }
`

const PageName = styled.span`
  font-size: 36px;
  color: #303030;
  margin: auto;
  margin-left: 30px;
`

const MainTitle = styled.div`
  font-weight: bold;
  font-size: 20px;
`

const Title = styled.div`
  font-weight: bold;
  font-size: 20px;
  margin-left: 20px;
`

const BoldText = styled.span`
  font-weight: bold;
`

const UpdateStatus = styled.div`
  text-align: right;
  font-size: 14px;
  margin-bottom: 30px;
`

const Text = styled.p`
  margin: 0 0 20px 50px;
  font-size: 14px;
  color: #000;
`

const InlineText = styled.div`
  margin: 0 0 0 50px;
  font-size: 14px;
  color: #000;
`

const Container = styled.div`
  background: #fff;
  padding: 15px 15px 15px 30px;
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

const TextBlock = styled.div`
  align-items: baseline;
  margin-bottom: 20px;
  display: flex;
`

const List = styled.ul`
  list-style: none;
  font-size: 14px;
  margin: 20px 0 0 50px;
  padding: 0;
`

const RefLink = styled.a`
  text-decoration: none;
  color: #f6b530;

  &:hover {
    text-decoration: underline;
  }
`
