import React from 'react';
import { Link } from 'react-router-dom';
import ListItem from './ListItem';
import css from './style.css';

export default function TermsOfConditions() {
  return (
    <div className={ `black-text sm-pl-20 sm-pr-20 ${css.service}` }>
      <div className="text-center text-uppercase text-18 bold-text mb-30 mt-30">ONE TRANSPORT CUSTOMER TERMS AND CONDITIONS</div>
      <div className="text-uppercase text-18 bold-text mb-30">IMPORTANT:</div>
      <div className="text-uppercase bold-text mb-30">
        THESE TERMS AND CONDITIONS ("Conditions") DEFINE THE BASIS UPON WHICH YOU WILL BE PROVIDED WITH ACCESS TO THE ONE TRANSPORT MOBILE APPLICATION PLATFORM, PURSUANT TO WHICH YOU WILL BE ABLE TO REQUEST CERTAIN TRANSPORTATION SERVICES FROM THIRD PARTY DRIVERS BY PLACING ORDERS THROUGH ONE TRANSPORT'S MOBILE APPLICATION PLATFORM. ONE TRANSPORT IS PART OF THE GETT GROUP.  THESE CONDITIONS (TOGETHER WITH THE DOCUMENTS REFERRED TO HEREIN) SET OUT THE TERMS OF USE ON WHICH YOU MAY, USE THE APP AND REQUEST TRANSPORTATION SERVICES. BY USING THE APP AND TICKING THE ACCEPTANCE BOX, YOU INDICATE THAT YOU ACCEPT THESE TERMS OF USE WHICH APPLY, AMONG OTHER THINGS, TO ALL SERVICES HEREINUNDER TO BE RENDERED TO OR BY YOU VIA THE APP AND THAT YOU AGREE TO ABIDE BY THEM. PLEASE READ THESE TERMS OF USE CAREFULLY BEFORE YOU START TO USE THE APP AND/OR REQUEST TRANSPORTATION SERVICES. IF YOU DO NOT AGREE TO THESE TERMS OF USE, YOU MUST NOT USE THE APP OR REQUEST THE TRANSPORTATION SERVICES.
      </div>
      <div className="text-uppercase bold-text mb-30">
        YOUR ATTENTION IS PARTICULARLY DRAWN TO CONDITION 9 WHICH LIMITS ONE TRANSPORT'S LIABILITY TO YOU.
      </div>

      <div className="bold-text text-20 mb-30">1. Definitions and interpretation</div>
      <ListItem marker="1.1">
        <div className="mb-30">
          In these Conditions (unless the context otherwise requires), the following words and phrases shall have the following meanings:
        </div>
        <div className="mb-30">
          "<span className="bold-text">Advanced Technology Fee</span>" means the charge which may be levied by One Transport for the provision of the Services, including for the convenience of accessing Transportation Services via the App but not from the provision of Transportation Services;
        </div>
        <div className="mb-30">
          "<span className="bold-text">App</span>" means the website and/or mobile application which provides a platform for placing Orders and is owned by Gett and licensed to One Transport;
        </div>
        <div className="mb-30">
          "<span className="bold-text">Cancellation Fee</span>" means the fee charged for cancellation of an Order as outlined in Condition 4.7;
        </div>
        <div className="mb-30">
          "<span className="bold-text">Collection Location</span>" means the location notified by you via the App to be picked up by a Driver;
        </div>
        <div className="mb-30">
          "<span className="bold-text">Customer</span>" means the individual making a request via One Transport's mobile application platform (being part of the App) for Transportation Services. A reference to "<span className="bold-text">you</span>" or "<span className="bold-text">your</span>" shall be construed as a reference to the Customer;
        </div>
        <div className="mb-30">
          "<span className="bold-text">Customer Account</span>" means the Customer's account with One Transport which contains the Customer's personal information including their name, address, email address, phone number and payment information;
        </div>
        <div className="mb-30">
          "<span className="bold-text">Data Controller</span>" and "<span className="bold-text">Data Processor</span>" have the meaning set out in the Data Protection Laws;
        </div>
        <div className="mb-30">
          "<span className="bold-text">Data Protection Laws</span>" means (until 25 May 2018) the Data Protection Act 1998 and (from 25 May 2018) the General Data Protection Regulation, together with all legislation made thereunder and any other laws relating to the processing of Personal Data, in each case as amended, superseded or replaced from time to time;
        </div>
        <div className="mb-30">
          "<span className="bold-text">Driver</span>" means a driver who is the holder of a private hire vehicle licence and is employed, or otherwise a contractor of, the Operator and will provide the Transportation Services;
        </div>
        <div className="mb-30">
          "<span className="bold-text">Fees</span>" means the fare charges payable by the Customer in connection with the Transportation Services [and the Advanced Technology Fee] as further outlined in Condition 4;
        </div>
        <div className="mb-30">
          "<span className="bold-text">Final Location</span>" means the location notified by the Customer using the App as the final destination for the Transportation Services;
        </div>
        <div className="mb-30">
          "<span className="bold-text">Gett</span>" means <span className="bold-text">GT GETTAXI (UK) LIMITED</span> a company established under the laws of England and Wales with company number 07603404 whose registered office is at Seal House, 3rd Floor, 1 Swan Lane, London, EC4R 3TN;
        </div>
        <div className="mb-30">
          "<span className="bold-text">Intellectual Property Rights</span>" means any and all patents, trademarks and service marks, registered designs, design rights and copyright, moral rights, rights in data and databases and other protectable lists of information, rights in confidential information, trade secrets, inventions and know how, trade and business names, domain names, get ups, logos and trade dress (including all extensions, revivals and renewals, where relevant) in each case whether registered or unregistered and application for any of them and the goodwill attaching to any of them and any rights or forms of protection of a similar nature and having equivalent or similar effect to any of them which may subsist anywhere in the world;
        </div>
        <div className="mb-30">
          "<span className="bold-text">One Transport</span>" means One Transport Limited a company established under the laws of England and Wales with company number 04254912 whose registered office is at Seal House, 3rd Floor, 1 Swan Lane, London, EC4R 3TN and references to "<span className="bold-text">us</span>" or "<span className="bold-text">we</span>" shall be construed accordingly;
        </div>
        <div className="mb-30">
          "<span className="bold-text">Operator</span>" means a licensed operator of private vehicles services (or equivalent under any local laws) who has entered into an agreement with One Transport to provide sub-contracted Transportation Services;
        </div>
        <div className="mb-30">
          "<span className="bold-text">Order</span>" means a request for Transportation Services by the Customer via the App;
        </div>
        <div className="mb-30">
          "<span className="bold-text">Privacy Policy</span>" means One Transport's privacy policy available on the One Transport website or by clicking <Link to="/privacy-policy">here</Link>;
        </div>
        <div className="mb-30">
          "<span className="bold-text">Personal Data</span>" has the meaning set out in section the Data Protection Laws;
        </div>
        <div className="mb-30">
          "<span className="bold-text">Services</span>" means the platform for ordering Drivers, through the App, for performance of Transportation Services;
        </div>
        <div className="mb-30">
          "<span className="bold-text">Standby Fee</span>" means the sum for each minute a Driver is waiting to collect you or such other sum as notified to you from time to time via the App; and
        </div>
        <div className="mb-30">
          "<span className="bold-text">Transportation Services</span>" means private hire transportation services or black taxi (if in the UK) to be provided to you by a Driver in a licensed private hire vehicle (or equivalent in any local jurisdiction).
        </div>
      </ListItem>

      <ListItem marker="1.2">
        <div className="mb-30">
          In these Conditions (unless the context requires otherwise):
        </div>
        <ListItem marker="1.2.1">
          the words "<span className="bold-text">including</span>", "<span className="bold-text">include</span>", or "<span className="bold-text">in particular</span>" means including, includes or in particular without limitation and words in the singular include the plural and in the plural shall include the singular;
        </ListItem>
        <ListItem marker="1.2.2">
          reference to a party shall, upon any assignment or other transfer that is permitted by these Conditions, be construed to include those successors and permitted assigns or transferees;
        </ListItem>
        <ListItem marker="1.2.3">
          the contents list, headings, and any descriptive notes are for ease of reference only and shall not affect the construction or interpretation of these Conditions; and
        </ListItem>
        <ListItem marker="1.2.4">
          reference to any legislative provision shall be deemed to include any statutory instrument, by-law, regulation, rule, subordinate or delegated legislation or order and any rules and regulations which are made under it, and any subsequent re-enactment or amendment of the same.
        </ListItem>
      </ListItem>
      <ListItem marker="1.3">
        These Conditions shall apply to the Customer's access and use of the Services and all Orders placed by the Customer through the App.
      </ListItem>

      <div className="bold-text text-20 mb-30">2. Services</div>
      <ListItem marker="2.1">
        One Transport is an affiliate of Gett and a permitted user and operator of the App.
      </ListItem>
      <ListItem marker="2.2">
        You must be 18 years of age or older to use the App and place Orders. Access to the App is permitted for personal use only.
      </ListItem>
      <ListItem marker="2.3">
        The App provides a means to enable Customers who seek transportation to certain destinations to be connected with Drivers. Gett does not directly provide transportation services, rather it is a technological service provider.  Gett has granted One Transport the right to use its electronic platform and other centralised services to enable One Transport to provide the Services and take Orders.
      </ListItem>
      <ListItem marker="2.4">
        Access to, and use of, the App is free of charge. You will need to set up a Customer Account and provide your payment details in order to access the Services. Any notice or other communication permitted or required in accordance with these Conditions by One Transport will be in writing and sent to the email address that you provided when setting up your Customer Account and/or the App.
      </ListItem>
      <ListItem marker="2.5">
        Notwithstanding the provisions of Condition 2.3, One Transport does not guarantee availability nor uninterrupted or error free use of the App and shall not be liable for any damage, loss, claims, costs or expenses resulting from or as a consequence of scheduled or unscheduled downtime, unavailability or slowness.
      </ListItem>

      <div className="bold-text text-20 mb-30">3. Transportation services</div>
      <ListItem marker="3.1">
        One Transport is a licenced operator of private hire vehicles in the local authority area of Barnet, London. In order to provide you with Transportation Services, One Transport will sub-contract the Transportation Services to the Operator. For the avoidance of doubt, One Transport will not provide you with the Transportation Services and all Transportation Services will be completed by the Operator.
      </ListItem>
      <ListItem marker="3.2">
        In order to connect you to Drivers, you will be required to enter your Collection Location into the App. Where you enter your Final Location, we will provide you with an estimated Fee for the journey, based on the information provided, and provide you with the Services. If you wish to proceed with your request for Transportation Services, you should select the order button and you will be connected through the App by One Transport with a Driver for Transportation Services and this shall constitute an Order. By selecting the order button, you will enter into a contract for Transportation Services and be provided with the Driver's details via the App.
      </ListItem>
      <ListItem marker="3.3">
        You acknowledge that your geo-location information must be provided by your device in order to enable us to provide the Services. You acknowledge and agree that your geo-location information will be accessible by the App and when you are logged-in your location will be displayed to Gett and One Transport, the Operator and Drivers.
      </ListItem>
      <ListItem marker="3.4">
        Transportation Services may be cancelled by you prior to the Driver arriving at the Collection Location, subject to the payment of a Cancellation Fee. If you are not at the Collection Location when the Driver arrives, you may be charged the Standby Fee. Drivers may cancel their provision of Transportation Services at any time.
      </ListItem>
      <ListItem marker="3.5">
        Following a Driver completing an Order, you may be able to rate your Driver via the App. Where you chose to rate your Driver, you must provide accurate feedback on the Driver in order to allow us to monitor the quality of the Transportation Services they provide to users of the App. Drivers may also be permitted to rate you as a Customer and such information may be used by Drivers when deciding whether to accept or reject your future Orders. Customers must (and where appropriate Customers must ensure their guests) at all times act in a polite and courteous manner towards Drivers and any other passengers of the vehicle.
      </ListItem>

      <div className="bold-text text-20 mb-30">4. Fees</div>
      <ListItem marker="4.1">
        In consideration of the Services and the Transportation Services, you will be charged the Fees. The Fees will be calculated based on a number of factors including distance travelled, traffic, length of journey, etc., and an additional Advanced Technology Fee may be added. The amount of the Fee will be notified to you via the App and you will have the opportunity to accept and place the Order at your sole discretion. As a provider of Transportation Services, the Operator is required to ensure that all Drivers provide the Transportation Services in an effective, efficient and safe manner. Once the Transportation Services have been completed and payment made, we will send you an electronic receipt. Details of past journeys are available via the App.
      </ListItem>
      <ListItem marker="4.2">
        As part of the booking process, for every Order you place, you agree to One Transport making a pre-authorisation payment on your payment card provided on your Customer Account ("<span className="bold-text">Pre-Authorisation Payment</span>"). The amount of the Pre-Authorisation Payment will be the Fee or, if a fixed fee is not selected, such other amount that One Transport (acting reasonably) determines as an estimate of the Fee. This amount will not be debited from your account at the time of placing your Order, but is ring-fenced for payment of the Fee. A request will be made against the card you provided for payment of the Fee following completion of your Order. If, after fulfilment of your Order, full payment is not successfully made by you, the Pre-Authorisation Payment may be used to settle, or as part payment, towards the outstanding Fee. If payment is received in full, the Pre-Authorisation Payment will be released by One Transport. Please note that this may take your bank up to 5 working days to process.
      </ListItem>
      <ListItem marker="4.3">
        If you fail to make payment of the Fee in full, Gett and/or One Transport may suspend your access to the Services and/or permanently delete your Customer Account and access to the Services. Further Gett and/or One Transport will notify the One Transport customer to obtain the Fees
      </ListItem>
      <ListItem marker="4.4">
        If, during the course of the Transportation Services, you require the Driver to change his route in any matter whatsoever, including making any unscheduled stops or using an alternative route, the estimated fee [or fixed fee (if applicable)] may be recalculated to take account of such changes. Fees will be recalculated based on the meter and such changes to the fixed fee will be notified to you via the App.
      </ListItem>
      <ListItem marker="4.5">
        If you are not waiting at the Collection Location when the Driver arrives, you will be charged the Standby Fee. If you do not arrive within 5 minutes, your Order will be cancelled and you will be charged the Cancellation Fee and the Standby Fee.
      </ListItem>
      <ListItem marker="4.6">
        If after placing an Order you decide to cancel your Order, you will be charged such other Cancellation Fee as One Transport may notify from time to time.
      </ListItem>

      <div className="bold-text text-20 mb-30">5. Data and data privacy</div>
      <ListItem marker="5.1">
        By downloading and/or using the App you consent to One Transport processing your Personal Data. One Transport will process your Personal Data for purposes connected with the Services and Transportation Services. From time to time, One Transport may process your Personal Data in order to notify you of opportunities connected with the Services either directly or by an affiliate of One Transport. When processing your Personal Data, One Transport will take appropriate technological measures to protect and keep your Personal Data secure and shall process your information in accordance with Data Protection Laws. Your Personal Data may be processed outside of the EEA.
      </ListItem>
      <ListItem marker="5.2">
        In order to allow us to provide you with the Services and/or access to Transportation Services, your Personal Data may be transferred by One Transport to the Operator and Drivers as well as other data such as your telephone number. One Transport advises all Operators that they must ensure that they keep your Personal Data safe and secure at all times and not allow access to any third parties to such information, other than Drivers.
      </ListItem>
      <ListItem marker="5.3">
        We also process your Personal Data in accordance with One Transport’s Privacy Policy, please ensure that you read this document before using the App. By using the App, you acknowledge and confirm that you have understood the use of your Personal Data set out in the Privacy Policy.
      </ListItem>
      <ListItem marker="5.4">
        One Transport and/or Gett does not guarantee that the App will be secure or free from bugs or viruses. You must not misuse the App by knowingly introducing viruses, trojans, worms, logic bombs or other material which is malicious or technologically harmful. You must not attempt to gain unauthorised access to the App, the server on which the App is stored or any server, device or database connected to the App. You must not attack the App via a denial-of-service attack or a distributed denial-of service attack. By breaching this provision, you may commit a criminal offence under the Computer Misuse Act 1990. One Transport will report any such breach to the relevant law enforcement authorities and One Transport will co-operate with those authorities by disclosing your identity to them. In the event of such a breach, your right to use the App will cease immediately.
      </ListItem>
      <ListItem marker="5.5">
        The App may include links to other websites, apps or material which is beyond One Transport’s control and which are owned and controlled by third parties. We are not responsible for the content on these links, the internet or World Wide Web pages or any other site or app outside the App. Where the App contain links to other sites or apps or materials provided by third parties, these links are provided for your information only. These links are provided as a courtesy to One Transport’s users and are not administered or verified in any way by One Transport. Such links are accessed by you at your own risk and One Transport makes no representations or warranties about the content of such websites or apps and cannot be held liable for the content and activities of these websites or any losses you suffer as a result of using such third party websites. One Transport may provide links to third party websites or apps that use cookies on users to collect data and/or to solicit personal information. As a result, One Transport strongly recommends that you read the privacy policies and terms of use of any third party websites or apps prior to using them.
      </ListItem>

      <div className="bold-text text-20 mb-30">6. Electronic Communications</div>
      <ListItem marker="6.1">
        When you use the App or send us emails or use pop-ups or make calls, you may be communicating with One Transport electronically.  One Transport will communicate with you by email, pop-up, phone, text or by posting notices on the One Transport website. You agree that all agreements, notices, disclosures and other communications sent to you electronically satisfy any legal requirement that such communications should be in writing.
      </ListItem>

      <div className="bold-text text-20 mb-30">7. Intellectual property</div>
      <ListItem marker="7.1">
        You acknowledge that all Intellectual Property Rights and all other rights in the App are owned by Gett and licensed to One Transport and remain vested in Gett and One Transport at all times. You do not acquire any rights in or to the App under these Conditions.
      </ListItem>

      <div className="bold-text text-20 mb-30">8. Suspension or modification</div>
      <ListItem marker="8.1">
        One Transport reserves the right, at its sole discretion, to change, alter, suspend or indefinitely close the App and/or your access to the Services. From time to time, One Transport may also restrict access to some or all parts of the Services and/or the App.
      </ListItem>

      <div className="bold-text text-20 mb-30">9. One Transport's liability</div>
      <ListItem marker="9.1">
        Nothing in these Conditions excludes or limits One Transport’s liability for death or personal injury arising from One Transport’s negligence, or its fraud or fraudulent misrepresentation, or any other liability that cannot be excluded or limited by English law.
      </ListItem>
      <ListItem marker="9.2">
        The material displayed on the App is provided without any guarantees, conditions or warranties as to its accuracy. You must bear the risks associated with the use of the App, the Services and the internet.
      </ListItem>
      <ListItem marker="9.3">
        <div className="mb-30">
          To the fullest extent permitted by law, One Transport (including its officers, directors and employees) and third parties (including any agents or sub-contractors) connected to it hereby expressly exclude:
        </div>
        <ul>
          <li>
            <div className="mb-30">
              all conditions, warranties and other terms which might otherwise be implied by statute, common law or the law of equity in it provision of the Services and/or use of the App; and
            </div>
            <ul>
              <li>any liability arising under or in connection with:</li>
              <li>use of, or inability to use, the App and/or Services;</li>
              <li>use of or reliance on any content displayed on the App;</li>
              <li>incompatibility of the App with any of your electronic and/or mobile equipment, devices, software or telecommunications links; and</li>
              <li>unsuitability, unreliability or inaccuracy of the App and/or the Services.</li>
            </ul>
          </li>
        </ul>
      </ListItem>
      <ListItem marker="9.4">
        One Transport shall not be liable to the Customer for the actions or omissions of any Driver or in connection with the Transportation Services. Your contract for the Transportation Services is with the Driver directly and therefore any claim that you may have in relation to the Transportation Services should be directed to the Driver. If you are unclear as to who provided you with the Transportation Services, you can contact us at <a href="mailto:customercare.uk@gett.com">customercare.uk@Gett.com</a> and ask us to provide you with the Driver details.
      </ListItem>
      <ListItem marker="9.5">
        If we fail to comply with these Conditions, we are responsible for loss or damage you suffer that is a foreseeable result of our breaking of our contract with you or our failing to use reasonable care and skill, but we are not responsible for any loss or damage that is not foreseeable. Loss or damage is foreseeable if either it is obvious that it will happen or, if at the time these Conditions were accepted, both we and you knew it might happen. We only provide access to the App and/or Services for domestic and private use. You agree not to use the App and/or Services for any commercial, business or re-sale purposes and we have no liability to you for any loss of profit or revenue, loss of business, business interruption or loss of business opportunity.
      </ListItem>
      <ListItem marker="9.6">
        One Transport will not be liable for any loss or damage caused by a virus, distributed denial-of-service attack, or other technologically harmful material that may infect your electronic and/or mobile equipment, computer programs, data or other proprietary material due to your use of the App and/or the Services or to your downloading of any content on it, or on any website linked to it.
      </ListItem>
      <ListItem marker="9.7">
        One Transport shall not be in breach of these Conditions nor liable for any delay in performing, or failure to perform, any of its obligations under these Conditions if such delay or failure results from events, circumstances or causes beyond its reasonable control.
      </ListItem>
      <ListItem marker="9.8">
        Subject to the remainder of this Condition 9, One Transport's total liability to you in connection with these Conditions and the Services, however arising whether caused by tort (including negligence), breach of contract or otherwise, shall be limited to the Fees paid by you in relation to the Order in which the liability arose.
      </ListItem>

      <div className="bold-text text-20 mb-30">10. Termination</div>
      <ListItem marker="10.1">
        These Conditions shall exist for an indefinite period of time. However, you may terminate your agreement with us at any time by permanently deleting the App installed on any device and deactivating your account.
      </ListItem>
      <ListItem marker="10.2">
        One Transport is entitled to terminate its provision of the Services to you or your licence to use the App, with immediate effect, by disabling your account or otherwise preventing you from accessing or using the App, at its sole discretion.
      </ListItem>

      <div className="bold-text text-20 mb-30">11. Variations</div>
      <ListItem marker="11.1">
        One Transport reserves the right, in its sole discretion, to vary these Conditions at any time. We will notify you of any changes by emails and/or through the App and the date of the most recent revisions will appear at the bottom of this page.
      </ListItem>
      <ListItem marker="11.2">
        If there is any inconsistency between One Transport’s Privacy Policy and these Conditions, the Privacy Policy shall prevail.
      </ListItem>

      <div className="bold-text text-20 mb-30">12. Assignment</div>
      <div className="mb-30">
        Your Customer Account and the Services are personal to you, and therefore you may not assign, sub-licence or transfer in any other way your rights and obligations under these Conditions of use to any third party. However, if necessary, One Transport may freely assign its rights and obligations without your consent and without the need to notify you before assigning them.
      </div>

      <div className="bold-text text-20 mb-30">13. Invalidity</div>
      <div className="mb-30">
        If any part of these Conditions are disallowed or found to be ineffective by any court or regulator, the other provisions shall continue to apply to the maximum extent permitted by law.
      </div>

      <div className="bold-text text-20 mb-30">14. Third party rights</div>
      <div className="mb-30">
        Rights under these Conditions only accrue to a person party to these Conditions. Accordingly a person who is not a party to these Conditions shall have no rights under the Contracts (Rights of Third Parties) Act 1999 to enforce any of its Conditions, but this does not affect any right or remedy of a third party which exists or is available apart from that Act.
      </div>

      <div className="bold-text text-20 mb-30">15. Waiver</div>
      <div className="mb-30">
        No failure or delay by One Transport to exercise any right or remedy provided in these Conditions or by law shall constitute a waiver of that or any right or remedy, nor shall it preclude or restrict the further exercise of that or any right or remedy. No single or partial exercise of such remedy shall preclude or restrict the further exercise of that or any other right or remedy.
      </div>

      <div className="bold-text text-20 mb-30">16. Contacting us and complaints</div>
      <div className="mb-30">
        If you have any concerns, or wish to contact us for any reason, you can do so by emailing us at <a href="mailto:customercare.uk@gett.com">customercare.uk@gett.com</a>. You can also contact us by writing to us at our registered address.
      </div>

      <div className="bold-text text-20 mb-30">17. Jurisdiction and applicable law</div>
      <div className="mb-30">
        These Conditions, and any non-contractual obligations arising out of them, are governed and construed in accordance with the law of England and Wales and any proceedings resulting out of these terms of use, and any non-contractual obligations arising out of them, the Privacy Policy, Services and/or the use of the App shall be held in the Courts of England and Wales.
      </div>

      <div className="bold-text text-20 mb-30">18. No agency</div>
      <div className="mb-30">
        Nothing in these Conditions shall be construed as creating, in any form, an agency relationship between One Transport and Customers under the laws of England and Wales.
      </div>

      <div className="bold-text text-20 mb-30">19. Your statutory rights</div>
      <div className="mb-30">These Conditions are without prejudice to your statutory rights.</div>
    </div>
  );
}
