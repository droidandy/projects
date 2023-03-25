import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as navigatorActions from '../redux/navigator';

import {
    // Input
} from 'react-onsenui';

import FooterDesktop from './FooterDesktop';

@connect((state) => ({ navigator: state.navigator, utility: state.utility }), (dispatch) => ({ actions: bindActionCreators(navigatorActions, dispatch) }))

class About extends React.Component {
  constructor(props) {
    super(props);
    // this.function1 = this.function1.bind(this);
    this.state = {
    };
  }
  componentDidMount() {
    document.getElementById('topot').scrollIntoView();
  }

  render() {
    let wideScreenClass = this.props.utility.isMobile
      ? ''
      : ' about__wrap__text__wide-screen';
    return (
        <div className='about__wrap'>
           <div id='topot' className='about__wrap__border'>
              <h2 className='about__title'>
                Terms of Use
              </h2>
              <div className={'about__wrap__text' + wideScreenClass}>
                <div>
                  <div id='bd-static-left-content'>
                      <h2>
                          XS Christians Privacy Statement and Terms of Use
                      </h2>
                      <p>
                          THIS AGREEMENT WAS LAST UPDATED ON FEBRUARY 1, 2007.
                      </p>
                      <p>
                          XS CHRISTIANS is firmly committed to privacy. The following discloses our information
                          gathering and dissemination practices for this website.
                      </p>
                      <p>
                          The protection of your privacy being very important, we have adopted the following
                          practices to safeguard the confidentiality of your personal information. We will
                          notify all registered users via email of any material change to this Privacy Statement,
                          unless you have opted-out of receiving email from us. From time to time, changes
                          to this Privacy Statement will also be communicated on this site.</p>
                      <p>
                          What information do you gather automatically from visitors?</p>
                      <p>
                          We use your IP address (the series of numbers associated with your individual computer)
                          to help us maintain our site and identify problems with our server. Your IP address
                          does not disclose any personally revealing information about you.
                      </p>
                      <p>
                          We may use cookies to identify traffic that comes through advertising and to facilitate
                          a more user friendly experience. Cookies are small pieces of information that a
                          web site places on your computer's hard drive so we know it's you when you visit.
                          Cookies help us create a more personalized experience for you when you visit our
                          site. The use of cookies is a very common practice on the Internet. If you are uncomfortable
                          with this, you can disable all cookies through your browser settings. Your enjoyment
                          of our site won't be affected if you have set your browser to reject cookies, although
                          certain functionality may no longer work.
                      </p>
                      <p>
                          What information will you ask me for?
                      </p>
                      <p>
                          When you register to use any XS Christian service you will be asked for some general
                          identifying information which will enable us to provide you with this individualized
                          service. We gather contact information (like your email address), demographic information
                          (like your city of residence or age). We may share some of this information for
                          our own research purposes with our professional advisors or consultants and third
                          party partners, however the information shared will be limited to non-personally
                          identifying demographic information shared under cover of a confidentiality agreement.
                          If you choose to become a Full Member, we may need to collect financial information
                          (like your credit card number and expiry date) and your address. We will only use
                          this information in the course of providing our service to you.</p>
                      <p>
                          Once you have registered, you will be given the option to input additional information
                          such as instant messenger address. You may also be asked for some personal but non-identifying
                          information to complete your profile (i.e. sport interests).
                      </p>
                      <p>
                          How will this information be used and who has access to it?
                      </p>
                      <p>
                          We reserve the right to use your contact information at any time to advise you of
                          any updates that may materially affect your rights or status on our site.
                      </p>
                      <p>
                          Your non-personally identifying demographic information is used to personalize your
                          experience, allow other members to find you through a search, to compose your personal
                          profile - which is associated with a pseudonymous identity you have created. The
                          personally identifiable information we collect from you is used for internet review
                          and to improve the content and functionality of our web server or customize the
                          layout of our pages for each individual member. The specific information we collect
                          is not shared with other organizations and we will never release your personally
                          identifiable information to an external organization without your prior consent
                          except for the purposes of validating credit information and collecting debts. We
                          may disclose your personally identifiable information if we reasonably believe we
                          are required to do so by operation of law, which may include, but is not limited
                          to a judicial proceeding, court order, or legal process served on XS Christians.
                      </p>
                      <p>
                          How long do you keep the information I've given you?
                      </p>
                      <p>
                          We keep the information you have given us for as long as you are a member on the
                          site or for as long as we are required to do so by law, which ever is longer.
                      </p>
                      <p>
                          Can I change the information I have already given you?
                      </p>
                      <p>
                          You can always verify or request the removal of the personally identifiable information
                          we have collected and change your registration information by selecting "My Details"
                          from the main menu after logging in to the site or by emailing XSChristians at:
                          Attn: Privacy Officer - xsc@xschristians.org</p>
                      <p>
                          Do you monitor online behavior?
                      </p>
                      <p>
                          Our members may communicate with each other through instant messages and onsite
                          mail. While we do not, as a rule, moderate or monitor members' private exchanges,
                          we reserve the right to do so if we suspect users of being under 18 or of using
                          our service for the purpose of solicitation or any other violation of our terms
                          of use or Privacy Statement. Member submissions that appear on the public area of
                          the site are moderated and, if necessary, we reserve the right to edit, delete,
                          remove or not use any communication on a public area of the site.
                      </p>
                      <p>
                          What security features do you have?
                      </p>
                      <p>
                          The security of your personal information is important to us. When you enter sensitive
                          information (such as credit card number) on our registration or order forms, we
                          encrypt that information using secure socket layer technology (SSL). SSL is the
                          leading security protocol on the Internet, it ensures that information being transferred
                          over the network is private through a process called encryption. Once encrypted
                          the information is an unintelligible code until it is decoded upon arrival at the
                          authorized destination.
                      </p>
                      <p>
                          We follow generally accepted industry standards to protect the personal information
                          submitted to us, both during transmission and once we receive it. No method of transmission
                          over the Internet, or method of electronic storage, is 100% secure, however. Therefore,
                          while we strive to use commercially acceptable means to protect your personal information,
                          we cannot guarantee its absolute security.</p>
                      <p>
                          <b>B. LEGAL NOTICE</b><br />
                          This is an adult service. By registering as a Member you acknowledge and confirm
                          that you are 18 years of age or older. XS Christians is a trademark of XS Christians,
                          a Washington Non-Profit Corporation. Trademarks of any third parties are used with
                          permission of the mark holders. In addition to our content, our services may include
                          the content of third parties. Unless otherwise indicated, all content may not be
                          reproduced without the permission of the copyright holder. For additional conditions
                          for use of this site, please refer to our Terms of Use and Privacy Statement. All
                          content on this website and its related services is protected by copyright.
                      </p>
                      <p>
                          <b>C. TERMS OF USE</b><br />
                          TERMS OF USE FOR XS CHRISTIANS<br />
                          THIS AGREEMENT WAS LAST UPDATED ON FEBRUARY 1, 2007
                      </p>
                      <p>
                          When you sign up for any service through this Website (XS Christians) you agree
                          to all of the terms and conditions of this Agreement. Please read the following
                          terms and conditions carefully, as they form the agreement between us. If you do
                          not agree to these terms and conditions, you may not use the service and should
                          not proceed to register. By using the Service after January 7, 2006, you are agreeing
                          to be bound by this Agreement, including all subsequent amendments made hereto.
                      </p>
                      <p>
                          User Agreement
                      </p>
                      <p>
                          This Agreement constitutes your agreement with XS Christians with respect to your
                          use of the website and any of its programs and services (Service). You must agree
                          to abide by all of the terms and conditions contained in this Agreement in order
                          to become or remain an authorized user of the Services. As used in this Agreement,
                          "we" and "us" means XS Christians and any and all successors and assigns.</p>
                      <p>
                          Right to Use</p>
                      <p>
                          Your right to use the Service is subject to any limitations, conditions and restrictions
                          established by us from time to time, in our sole discretion. We may alter, suspend
                          or discontinue any aspect of the Service at any time, including the availability
                          of any Service feature, database or content. We may also impose limits on certain
                          features and aspects of the Service or restrict your access to parts or all of the
                          Service without notice or liability.
                      </p>
                      <p>
                          Adult
                      </p>
                      <p>
                          You represent, warrant and covenant that you are at least 18 years old.
                      </p>
                      <p>
                          Code of Conduct
                      </p>
                      <p>
                          You agree to use the Service in accordance with the following Code of Conduct:
                      </p>
                      <p>
                          </p><ol>
                              <li>you will keep all information provided to you through the Service as private and
                                  confidential and will not give such information to anyone without the permission
                                  of the person who provided it to you </li>
                              <li>you will not use the Service to engage in any form of harassment or offensive behavior,
                                  including but not limited to the posting of communications, pictures, videos or
                                  audio recordings which contain libelous, slanderous, abusive or defamatory statements,
                                  or racist, pornographic, obscene, or offensive language or images </li>
                              <li>you will not forward chain letters through the Service </li>
                              <li>you will not use the Service to infringe the privacy rights, property rights, or
                                  any other rights of any person </li>
                              <li>you will not post messages, pictures or recordings or use the Service in any way
                                  which:
                                  <ol>
                                      <li>violates, plagiarizes or infringes upon the rights of any third party, including
                                          but not limited to any copyright or trade-mark law, privacy or other personal or
                                          proprietary rights, or</li>
                                      <li>is fraudulent or otherwise unlawful or violates any law; and </li>
                                  </ol>
                              </li>
                              <li>you will not use the Service to distribute, promote or otherwise publish any material
                                  containing any solicitation for funds, advertising or solicitation for goods or
                                  services. </li>
                              <li>you will not use the Service to distribute or up load any virus, Trojan horses or
                                  do anything else that might cause harm to the Service, XS Christians? systems or
                                  to other members' systems in any way. </li>
                              <li>you will not post or transmit in any manner any contact information including, but
                                  not limited to, email addresses, "instant messenger" nicknames, telephone numbers,
                                  postal addresses, URLs, or full names through your publicly posted information.
                              </li>
                          </ol>
                      <p></p>
                      <p>
                          Membership Categories
                      </p>
                      <p>
                          Users of the Service may become "Guests", or "Full Members" of the Service. Guests
                          are allowed access to a minimal level of the Service's features and are not charged
                          by us for the use of the features they can access. Full Members are provided with
                          access to additional features of the Service that are not available to Guests. Full
                          Members are not charged by us for the features that are free to Guests. Certain
                          additional features of the Service made available to Full Members are also free
                          of charge. Certain other features of the Service are "paid features", for which
                          a Full Member is charged.
                      </p>
                      <p>
                          Fees and Payments
                      </p>
                      <p>
                          In order to become a Full Member, the individual must provide a credit card charged
                          through our online system, all in accordance with our pricing policy as posted on
                          the Service from time to time. In addition to paying the published price, the purchaser
                          is responsible for paying all applicable taxes in connection with the purchase.
                          We reserve the right to change our pricing policy at any time at our sole discretion.
                          We also reserve the right to change the method or manner in which we charge members,
                          or the method of payment which is acceptable to us, at our sole discretion. Once
                          we have confirmed receipt of your payment, we will open your account. All payments
                          shall be made in US Dollars. If your usage of the Service is terminated because
                          of a breach of this Agreement or if it is terminated for any reason, any unused
                          credit is automatically and immediately forfeited. Purchases at this Site are NON-REFUNDABLE.</p>
                      <p>
                          Disclaimer</p>
                      <p>
                          By using the services you have also agreed to our Privacy Statement. You acknowledge
                          that (a) we cannot ensure the security or privacy of information you provide through
                          the Internet and your email messages, and you release us from any and all liability
                          in connection with the use of such information by other parties; (b) we are not
                          responsible for, and cannot control, the use by others of any information which
                          you provide to them and you should use caution in selecting the personal information
                          you provide to others through the Service; and (c) we cannot assume any responsibility
                          for the content of messages sent by other users of the Service, and you release
                          us from any and all liability in connection with the contents of any communications
                          you may receive from other users. We cannot guarantee, and assume no responsibility
                          for verifying, the accuracy of the information provided by other users of the Service.
                      </p>
                      <p>
                          ou may not use the Service for any unlawful purpose. We may refuse to grant you
                          an ID or nickname that impersonates someone else, is protected by trade-mark or
                          proprietary law, or is vulgar or otherwise offensive, as determined by us in our
                          sole discretion. You further agree that we take no responsibility for actions of
                          persons that you may be through this site and that we do not represent that we have
                          conducted a background check on any person other than chapter leaders who joins
                          this site and therefore do not warrant as to the safety of this site or any member
                          other than chapter leaders. The safest way to protect your information and yourself
                          personally is to not give out personal information and to conduct your own background
                          checks on any person you meet, whether on this site or off this site.</p>
                      <p>
                          Monitoring of Information
                      </p>
                      <p>
                          We reserve the right to monitor all advertisements, public postings, messages, video
                          and audio recordings to ensure that they conform to the content guidelines which
                          may be applicable from time to time.
                      </p>
                      <p>
                          Removal of Information</p>
                      <p>
                          While we do not and cannot review every message or other material posted or sent
                          by users of the Service, and are not responsible for any content of these messages
                          or materials, we reserve the right, but are not obligated, to delete, move, or edit
                          messages or materials, including without limitation profiles, public postings, messages,
                          video and audio recordings that we, in our sole discretion, deem to violate the
                          Code of Conduct set out above or any applicable content guidelines, or to be otherwise
                          unacceptable. You shall remain solely responsible for the content of profiles, public
                          postings, messages, video and audio recordings and other materials you may upload
                          to the Service or users of the Service.
                      </p>
                      <p>
                          Termination of Access to Service
                      </p>
                      <p>
                          We may, in our sole discretion, terminate or suspend your access to all or part
                          of the Service at any time, with or without notice, for any reason, including, without
                          limitation, breach of this Agreement. Without limiting the generality of the foregoing,
                          any fraudulent, abusive, or otherwise illegal activity, or that may otherwise affect
                          the enjoyment of the Service or the Internet by others may be grounds for termination
                          of your access to all or part of the Service at our sole discretion, and you may
                          be referred to appropriate law enforcement agencies.
                      </p>
                      <p>
                          Proprietary Information</p>
                      <p>
                          The Service contains information which is proprietary to us our partners, and our
                          users. We assert full copyright protection in the Service. Information posted by
                          us, our partners or users of the Service may be protected whether or not it is identified
                          as proprietary to us or to them. You agree not to modify, copy or distribute any
                          such information in any manner whatsoever without having first received the express
                          permission of the owner of such information. For additional information, please
                          refer to our Legal Section.
                      </p>
                      <p>
                          No Responsibility
                      </p>
                      <p>
                          You acknowledge that we are not responsible for suspension of the Service, regardless
                          of the cause of the interruption or suspension. Any claim against us, for any reason,
                          shall be limited to the amount you paid, if any, for use of the Service during the
                          previous 12 months. We may discontinue or change the Service or its availability
                          to you at any time, and you may stop using the Service at any time.
                      </p>
                      <p>
                          Security</p>
                      <p>
                          Your account is private and should not be used by anyone else. You are responsible
                          for all usage or activity on the Service by users using your password, including
                          but not limited to use of your password by any third party.
                      </p>
                      <p>
                          External Links
                      </p>
                      <p>
                          The Service may from time to time contain links to other Internet sites and resources
                          ("External Links"). You acknowledge that we are not responsible for, and have no
                          liability as a result of, the availability of External Links or their contents.
                          We suggest that you review the terms of use and privacy statement of such External
                          Links prior to use of them.
                      </p>
                      <p>
                          Indemnity</p>
                      <p>
                          You agree to indemnify us, our officers, directors, employees and agents, from any
                          loss or damages, including without limitation reasonable legal fees, which we may
                          suffer from your activities on or use of the Service, including without limitation
                          any breach by you of this Agreement or any charges or complaints made by other parties
                          against you. You shall cooperate as fully as reasonably required in the defense
                          of any claim. We reserve the right to assume the exclusive defense and control of
                          any matter otherwise subject to indemnification by you; provided, however, that
                          you shall remain liable for any such claim.</p>
                      <p>
                          No Warranties</p>
                      <p>
                          The Service is distributed on an "as is" basis. We do not warrant that this Service
                          will be uninterrupted or error-free. There may be delays, omissions, and interruptions
                          in the availability of the Service. Where permitted by law, you acknowledge that
                          the Service is provided without any warranties of any kind whatsoever, either express
                          or implied, including but not limited to the implied warranties of merchantability
                          and fitness for a particular purpose. You acknowledge that use of the Service is
                          at your own risk. We do not represent or endorse the accuracy or reliability of
                          any member profile, advice, opinion, statement or other information displayed, uploaded
                          or distributed through the Service by XS Christians, our partners or any user of
                          the Service or any other person or entity. You acknowledge that any reliance upon
                          any such opinion, member profile, advice, statement or information shall be at your
                          sole risk.
                      </p>
                      <p>
                          Your continued use of the Service now, or following the posting of notice of any
                          changes in this Agreement, will constitute a binding acceptance by you of this Agreement,
                          or any subsequent modifications.
                      </p>
                      <p>
                          Modifications</p>
                      <p>
                          We may modify this Agreement from time to time. Notification of changes in this
                          Agreement will be posted on the Service or sent via electronic mail, as we may determine
                          in our sole discretion. If you do not agree to any modifications, you should terminate
                          your use of the Service. Your continued use of the Service now, or following the
                          posting of notice of any changes in this Agreement, will constitute a binding acceptance
                          by you of this Agreement, or any subsequent modifications.
                      </p>
                      <p>
                          Disclosure and Other Communication
                      </p>
                      <p>
                          We reserve the right to send electronic mail to you, for the purpose of informing
                          you of changes or additions to the Service, or of any XS Christians related products
                          and services. We reserve the right to disclose information about your usage of the
                          Service and demographics in forms that do not reveal your personal identity.
                      </p>
                      <p>
                          And by your use of the Service, you consent to such disclosures and communications
                          subject to the terms of our Privacy Statement.
                      </p>
                      <p>
                          Governing Law
                      </p>
                      <p>
                          This Agreement is entered into in Seattle, Washington, USA. You agree that it will
                          be governed by the laws of the State of Washington and any disputes arising out
                          of this Agreement must be filed in King County Washington. If any provision in this
                          Agreement is invalid or unenforceable under applicable law, the remaining provisions
                          will continue in full force and effect. This Agreement will not be governed by the
                          United Nations Convention on Contracts for the International Sale of Goods.
                      </p>
                      <p>
                          THE PARTIES SPECIFICALLY AGREE THAT THE PERFORMANCE OF THIS AGREEMENT, IN ALL ITS
                          ASPECTS, DOES NOT TAKE PLACE OUTSIDE THE JURISDICTION OF THE STATE OF WASHINGTON
                      </p>
                      <p>
                          Assignment</p>
                      <p>
                          You do not have the right to assign this Agreement or any of your rights to the
                          Service to anyone. XS Christians has the right to assign any or all of its rights
                          and duties under this Agreement or to the Service to any third party. XS Christians,
                          2006</p>

                  </div>
                </div>
              </div>
           </div>

          {!this.props.utility.isMobile
            ? <div className='about__footer'>
                <FooterDesktop />
              </div>
            : null}

        </div>

    );
  }
}

export default About;
