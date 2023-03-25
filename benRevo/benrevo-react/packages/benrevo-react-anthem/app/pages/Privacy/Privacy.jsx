import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Header, Image } from 'semantic-ui-react';
import Helmet from 'react-helmet';
import { Link } from 'react-router';

class Privacy extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {};

  render() {
    return (
      <div>
        <Helmet
          title="Privacy Policy"
          meta={[
            { name: 'description', content: 'Privacy Policy' },
          ]}
        />
        <Grid stackable container className="privacy section-wrap">
          <Grid.Column width={16}>
            <Grid stackable as={Segment} className="gridSegment">
              <Grid.Row>
                <Grid.Column width={16} textAlign="center" >
                  <Header as="h1" className="rfpPageHeading">Provider Privacy Policy</Header>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={16}>
                  <div>
                    <h5 className="terms-effective">Version 1</h5>
                    <h5 className="terms-effective">Effective Date: August 21</h5>
                    <h5>Last Updated Date: August 21, 2017</h5>
                    <p>BenRevo (<b>“Provider”</b> or <b>“we”</b> or <b>“us”</b>) is committed to protecting your privacy. We have prepared this Privacy Policy to describe to you our practices regarding the Personal Data (as defined below) that we collect from users of our website (<b>“Users”</b>),  located at <a href="https://quote.benrevo.com/anthem" target="_tab">https://quote.benrevo.com/anthem</a> (<b>“Website”</b>), and related services (<b>“Services”</b>). Any terms not defined herein shall have the meaning given to them in the associated <Link to="/terms">Terms of Use</Link>.</p>
                    <h4>USER CONSENT</h4>

                    <p>By submitting Personal Data through our Website or Services, you agree to the terms of this Privacy Policy and you expressly consent to the collection, use and disclosure of your Personal Data in accordance with this Privacy Policy.</p>

                    <h4>TYPES OF DATA WE COLLECT.</h4>

                    <p><b>“Personal Data”</b> means data that allows someone to identify or contact you, including, for example, your name, gender, date of birth, address, telephone number, e-mail address, as well as any other non-public information about you that is associated with or linked to any of the foregoing data. <b>“Anonymous Data”</b> means data that is not associated with or linked to your Personal Data; Anonymous Data does not, by itself, permit the identification of individual persons. We collect Personal Data and Anonymous Data, as described below.</p>

                    <h4>Information You Provide to Us.</h4>

                    <ol>
                      <li>We may collect Personal Data from you when you create an account (“Account”) using your username and password to log in to our network.</li>
                      <li>Our Website lets you store preferences like how your content is displayed, your location, safe search settings, and favorite widgets. We may associate these choices with your Account, browser or the mobile device, and you can edit these preferences at any time.</li>
                      <li>When connecting to our Services via a service provider that uniquely identifies your mobile device, we may receive this identification and use it to offer extended services and/or functionality.</li>
                      <li>We retain information on your behalf, such as files and messages that you store using your Account.</li>
                      <li>If you provide us feedback or contact us via e-mail, we will collect your name and e-mail address, as well as any other content included in the e-mail, in order to send you a reply.</li>
                      <li>If you choose to participate in one of our surveys, we may collect additional profile information.</li>
                      <li>We may also collect Personal Data, such as at other points in our Website that state that Personal Data is being collected.</li>
                    </ol>

                    <h4>Information Collected via Technology.</h4>

                    <ol>
                      <li><u>Information Collected by Our Servers.</u> To make our Website and Services more useful to you, our servers (which may be hosted by a third-party service provider) collect information from you, including your browser type, operating system, Internet Protocol (<b>“IP”</b>) address (a number that is automatically assigned to your computer when you use the Internet, which may vary from session to session), domain name, and/or a date/time stamp for your visit.</li>
                      <li><u>Log Files.</u> As is true of most websites, we gather certain information automatically and store it in log files.  This information includes IP addresses, browser type, Internet service provider (<b>“ISP”</b>), referring/exit pages, operating system, date/time stamp, and clickstream data.  We use this information to analyze trends, administer the Website track Users’ movements around the Website, gather demographic information about our user base as a whole, and better tailor our Services to our Users’ needs. Except as noted in this Privacy Policy, we do not link this automatically-collected data to Personal Data.</li>
                      <li><u>Cookies.</u> Like many online services, we use cookies to collect information. <b>“Cookies”</b> are small pieces of information that a website sends to your computer’s hard drive while you are viewing the website.  We may use both session Cookies (which expire once you close your web browser) and persistent Cookies (which stay on your computer until you delete them) to provide you with a more personal and interactive experience on our Website.   This type of information is collected to make the Website more useful to you and to tailor the experience with us to meet your special interests and needs.</li>
                      <li><u>Pixel Tags</u> In addition, we use <b>“Pixel Tags”</b> (also referred to as clear Gifs, Web beacons, or Web bugs).  Pixel Tags are tiny graphic images with a unique identifier, similar in function to Cookies, that are used to track online movements of Web Users.  In contrast to Cookies, which are stored on a User’s computer hard drive, Pixel Tags are embedded invisibly in Web pages.  Pixel Tags also allow us to send e-mail messages in a format Users can read, and they tell us whether e-mails have been opened to ensure that we are sending only messages that are of interest to our Users.  We may use this information to reduce or eliminate messages sent to a User.  We do not tie the information gathered by Pixel Tags to our Users’ Personal Data.</li>
                      <li><u>Flash LSOs.</u> When we post videos, third parties may use local shared objects, known as <b>“Flash Cookies”</b> to store your preferences for volume control or to personalize certain video features.  Flash Cookies are different from browser Cookies because of the amount and type of data and how the data is stored.  Cookie management tools provided by your browser will not remove Flash Cookies.  To learn how to manage privacy and storage settings for Flash Cookies, click here: <a src="http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager07.html" target="_tab">http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager07.html</a>.</li>
                      <li><u>Analytics Services.</u> In addition to the tracking technologies we place, other companies may set their own Cookies or similar tools when you visit our Website.  This includes third party analytics services, including but not limited to Google Analytics (<b>“Analytics Services”</b>), that we engage to help analyze how Users use the Website, as well as third parties that deliver content or offers.  We may receive reports based on these parties’ use of these tools on an individual or aggregate basis.  We use the information we get from Analytics Services only to improve our Website and Services.  The information generated by the Cookies or other technologies about your use of our Website and Services (the <b>“Analytics Information”</b>) is transmitted to the Analytics Services. The Analytics Services use Analytics Information to compile reports on User activity.  The Analytics Services may also transfer information to third parties where required to do so by law, or where such third parties process Analytics Information on their behalf. Each Analytics Services’ ability to use and share Analytics Information is restricted by such Analytics Services’ Terms of Use and Privacy Policy. By using our Website and Services, you consent to the processing of data about you by Analytics Services in the manner and for the purposes set out above.  For a full list of Analytics Services, please contact us at <a href="mailto:anthem@benrevo.com">anthem@benrevo.com</a></li>
                    </ol>

                    <p>
                      <b>Information Collected from Third Parties.</b> We may receive Personal Data and/or Anonymous Data about Users from Anthem, Inc. and its affiliates. We may add this information to the information we have already collected from you via our Website in order to improve the Services we provide.
                    </p>

                    <h4>USE OF YOUR PERSONAL DATA</h4>
                    <p><b>General Use.</b> In general, Personal Data you submit to us is used either to respond to requests that you make, or to aid us in serving you better.  We use your Personal Data in the following ways:
                    </p>
                    <ol>
                      <li>facilitate the creation of and secure your Account on our network;</li>
                      <li>identify you as a User in our system;</li>
                      <li>provide improved administration of our Website and Services;</li>
                      <li>provide the Services you request, such as, providing a comparison of Anthem’s insurance pricing information and values inputted by you;</li>
                      <li>contact you to solicit feedback;</li>
                      <li>improve the quality of experience when you interact with our Website and Services;</li>
                      <li>send you administrative e-mail notifications, such as security or support and maintenance advisories; and</li>
                      <li>send newsletters, surveys, offers, and other promotional materials related to our Services and for other marketing purposes of Provider.</li>
                    </ol>
                    <p>
                      <b>Creation of Anonymous Data.</b> We may create Anonymous Data records from Personal Data by excluding information (such as your name) that makes the data personally identifiable to you.  We use this Anonymous Data to analyze request and usage patterns so that we may enhance the content of our Services and improve Website navigation.
                    </p>

                    <h4>DISCLOSURE OF YOUR PERSONAL DATA</h4>
                    <p>We disclose your Personal Data as described below and as described elsewhere in this Privacy Policy.</p>
                    <p><b>Insurance Provider Users.</b>  We will share a User’s Personal Data with [Anthem, Inc. and its affiliates], solely for the purpose of providing the Services.</p>
                    <p><b>Corporate Restructuring.</b>  We may share some or all of your Personal Data in connection with or during negotiation of any merger, or acquisition of all or substantially of our business or assets. If another company acquires our company, business, or assets, that company will possess the Personal Data collected by us and will assume the rights and obligations regarding your Personal Data as described in this Privacy Policy.</p>
                    <p><b>Disclosure to Third Party Individuals or Companies.</b></p>
                    <p>This Privacy Policy addresses our use and disclosure of information we collect from and/or about you on the Website, or through the Service. The use and disclosure restrictions contained in this Privacy Policy will not apply to any third party.  We do not control the privacy policies of third parties, and you are subject to the privacy policies of those third parties where applicable.</p>
                    <p><b>Other Disclosures.</b>  Regardless of any choices you make regarding your Personal Data, Provider may disclose Personal Data if it believes in good faith that such disclosure is necessary (a) in connection with any legal investigation; (b) to comply with relevant laws or to respond to subpoenas or warrants served on Provider; (c) to protect or defend the rights or property of Provider or Users of the Website or Services; and/or (d) to investigate or assist in preventing any violation or potential violation of the law, this Privacy Policy, or our Terms of Use.</p>

                    <h4>THIRD PARTY WEBSITES</h4>

                    <p>Our Website may contain links to third party websites.  When you click on a link to any other website or location, you will leave our Website and go to another site, and another entity may collect Personal Data, or Anonymous Data from you.  We have no control over, do not review, and cannot be responsible for, these third-party websites or their content.  Please be aware that the terms of this Privacy Policy do not apply to these third-party websites or content, or to any collection of your Personal Data after you click on links to such third-party websites.  We encourage you to read the privacy policies of every website you visit.  The links to third party websites or locations are for your convenience and do not signify our endorsement of such third parties or their products, content or websites.</p>

                    <h4>YOUR CHOICES REGARDING INFORMATION</h4>

                    <p>You have several choices regarding the use of information on our Service:</p>
                    <p><b>Email Communications.</b>We will periodically send you free newsletters and e-mails that directly promote the use of our Website or Services.  When you receive newsletters or promotional communications from us, you may indicate a preference to stop receiving further communications from us and you will have the opportunity to “opt-out” by following the unsubscribe instructions provided in the e-mail you receive or by contacting us directly (please see contact information below).  Despite your indicated e-mail preferences, we may send you service related communications, including notices of any updates to our Terms of Use or Privacy Policy.</p>

                    <p><b>Cookies.</b>  If you decide at any time that you no longer wish to accept Cookies from our Service for any of the purposes described above, then you can instruct your browser, by changing its settings, to stop accepting Cookies or to prompt you before accepting a Cookie from the websites you visit. Consult your browser’s technical information. If you do not accept Cookies, however, you may not be able to use all portions of the Service or all functionality of the Service. If you have any questions about how to disable or modify Cookies, please let us know at the contact information provided below.</p>
                    <p><b>Changing or Deleting Your Personal Data.</b>  All Registered Users may review, update, correct or delete the Personal Data in their Account (including any imported contacts) by [contacting us or editing their profile via the Services.]  If you completely delete all of your Personal Data, then your Account may become deactivated.  We will use commercially reasonable efforts to honor your request.  We may retain an archived copy of your records as required by law or for legitimate business purposes.</p>
                    <p><b>QUESTIONS; CONTACTING PROVIDER; REPORTING VIOLATIONS.</b>  If you have any questions or concerns or complaints about our Privacy Policy or our data collection or processing practices, or if you want to report any security violations to us, please contact us at the following email address: <a href="mailto:anthem@benrevo.com">anthem@benrevo.com</a>.</p>

                    <h4>A NOTE ABOUT CHILDREN</h4>
                    <p>We do not intentionally gather Personal Data from any person who is under the age of 13.  If a child under 13 submits Personal Data to Provider and we become aware that the Personal Data is the information of a child under 13, we will endeavor to delete the information as soon as possible.  If you believe that we might have any Personal Data from a child under 13, please contact us at <a href="mailto:anthem@benrevo.com">anthem@benrevo.com</a></p>

                    <h4>A NOTE TO USERS OUTSIDE OF THE UNITED STATES</h4>

                    <p>This Website is not intended for non-U.S. users. Our Website is located and targeted to United States citizens and our policies are directed at compliance with laws in the United States.</p>

                    <h4>CHANGES TO THIS PRIVACY POLICY.</h4>

                    <p>This Privacy Policy may be updated from time to time for any reason.  We will notify you of any changes to our Privacy Policy by posting the new Privacy Policy here [insert URL] and we will change the “Last Updated” date above.  If you do not agree to any change(s) after receiving a notice of such change(s), you shall stop using the Website and/or the Services.  Otherwise, your continued use of the Website and/or Services constitutes your acceptance of such change(s).  YOU SHOULD CONSULT THIS PRIVACY POLICY REGULARLY FOR ANY CHANGES.</p>
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default Privacy;
