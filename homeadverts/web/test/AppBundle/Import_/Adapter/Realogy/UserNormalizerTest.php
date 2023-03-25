<?php

namespace Test\AppBundle\Import_\Adapter\Sothebys;

use AppBundle\Import\Adapter\Sothebys\UserNormalizer;
use Monolog\Logger;

class UserNormalizerTest extends \PHPUnit_Framework_TestCase
{
    public function testNormalize()
    {
        $feedUserData = [
            'agent_key' => '4038826',
            'agent_guid' => '0005F370-1853-4A4C-9678-13B50CE8838C',
            'first_name' => 'Chris',
            'last_name' => 'Engelskirger',
            'phones' => [
                [
                    'phone_no' => '8055437727',
                    'phone_type' => '2',
                ],
                [
                    'phone_no' => '8052352070',
                    'phone_type' => '8',
                ],
                [
                    'phone_no' => '8052352070',
                    'phone_type' => '9',
                ],
            ],
            'emails' => [
                [
                    'email' => 'cengelskirger@yahoo.com',
                    'email_type_key' => '1',
                ],
                [
                    'email' => 'jasonjennings@sothebysrealty.ca',
                    'email_type_key' => '2',
                ],
                [
                    'email' => 'chris.engelskirger@sothebysrealty.com',
                    'email_type_key' => '3',
                ],
                [
                    'email' => 'thillier@sothebysrealty.ca',
                    'email_type_key' => '5',
                ],
                [
                    'email' => 'thillier@sothebysrealty.ca',
                    'email_type_key' => '6',
                ],
                [
                    'email' => 'thillier@sothebysrealty.ca',
                    'email_type_key' => '10',
                ],
                [
                    'email' => 'thillier@sothebysrealty.ca',
                    'email_type_key' => '11',
                ],
                [
                    'email' => 'thillier@sothebysrealty.ca',
                    'email_type_key' => '14',
                ],
            ],
            'urls' => [
                [
                    'web_url' => 'http://streetsir.com/',
                    'web_address_type_name' => 'Business',
                ],
                [
                    'web_url' => 'https://www.facebook.com/ThePowersGroupatSSIR/',
                    'web_address_type_name' => 'Facebook',
                ],
                [
                    'web_url' => 'https://www.instagram.com/davidpowersrealtor/',
                    'web_address_type_name' => 'Instagram',
                ],
                [
                    'web_url' => 'https://www.linkedin.com/in/david-powers-98310226?trk=nav_responsive_tab_profile',
                    'web_address_type_name' => 'Other',
                ],
                [
                    'web_url' => 'https://twitter.com/BexleyRealtor',
                    'web_address_type_name' => 'Twitter',
                ],
            ],
            'photos' => [
                [
                    'media_category_type' => '5',
                    'image_sequence_no' => '3',
                    'url' => 'http://m.sothebysrealty.com/4i0/9svrdmk83wa74btxq1b62ra6q1i',
                ],
                [
                    'media_category_type' => '5',
                    'image_sequence_no' => '1',
                    'url' => 'http://m.sothebysrealty.com/4i0/4mvgdvvhe41q4e6har6qyjj802i',
                ],
                [
                    'media_category_type' => '5',
                    'image_sequence_no' => '5',
                    'url' => 'http://m.sothebysrealty.com/4i0/haj6hzdckkdc4m6e7gv9mhdkq7i',
                ],
                [
                    'media_category_type' => '5',
                    'image_sequence_no' => '4',
                    'url' => 'http://m.sothebysrealty.com/4i0/x18tfwhbf52g4zy4az9c441dp2i',
                ],
                [
                    'media_category_type' => '5',
                    'image_sequence_no' => '2',
                    'url' => 'http://m.sothebysrealty.com/4i0/84bpwkzvxh71mtj1k87za21ch1i',
                ],
            ],
            'descriptions' => [
                [
                    'profile' => $this->getDescription(),
                    'language_code' => 'en',
                ],
            ],
            'office_name' => 'Wilson & Co.',
            'phone_1' => '8055437727',
            'address_1' => '3590 Broad Street, Suite 130',
            'city' => 'San Luis Obispo',
            'country_iso_code' => 'US',
            'postal_code' => '93401',
            'state_iso_code' => 'CA',
        ];

        $userNormalizer = new UserNormalizer($this->getLogger());
        $normalisedUser = $userNormalizer->normalize($feedUserData);

        $this->assertEquals('3yd-RFGSIR-4038826', $normalisedUser->sourceRef);
        $this->assertEquals([
            (object) ['ref' => $feedUserData['agent_guid'], 'type' => 'guid'],
        ], $normalisedUser->sourceRefs);
        $this->assertEquals('Chris Engelskirger', $normalisedUser->name);
        $this->assertEquals('8052352070', $normalisedUser->phone);
        $this->assertEquals('chris.engelskirger@sothebysrealty.com', $normalisedUser->email);
        $this->assertEquals([
            'cengelskirger@yahoo.com',
            'jasonjennings@sothebysrealty.ca',
            'chris.engelskirger@sothebysrealty.com',
            'thillier@sothebysrealty.ca',
        ], $normalisedUser->allEmails);
        $this->assertEquals('http://streetsir.com/', $normalisedUser->homePageUrl);
        $this->assertEquals('http://m.sothebysrealty.com/4i0/4mvgdvvhe41q4e6har6qyjj802i', $normalisedUser->avatarUrl);
        $this->assertEquals([
            (object) [
                'locale' => 'en',
                'description' => $this->getDescription(),
            ],
        ], $normalisedUser->descriptions);
        $this->assertEquals('Wilson & Co. Sotheby\'s International Realty', $normalisedUser->companyName);
        $this->assertEquals('8055437727', $normalisedUser->companyPhone);
        $this->assertEquals('3590 Broad Street, Suite 130', $normalisedUser->street);
        $this->assertEquals('San Luis Obispo', $normalisedUser->townCity);
        $this->assertEquals('US', $normalisedUser->country);
        $this->assertEquals('93401', $normalisedUser->zip);
        $this->assertEquals('CA', $normalisedUser->stateCounty);
    }

    private function getLogger()
    {
        return $this
            ->getMockBuilder(Logger::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getDescription()
    {
        return <<<TEXT
 Broker Associate&lt;BR/&gt;&lt;BR/&gt;Nancy Johnson specializes in marketing exceptional \
homes in the Connecticut River Valley and along the shoreline. Using the latest in technology \
and a keen sense of where and how to market exclusive homes, she puts her listings in front of \
affluent home buyers worldwide. Nancy has a true passion for real estate. Whether she is working \
with a high-end client or a first-time home buyer, Nancy provides each and every buyer and seller \
with a first-rate luxury experience. Nancy\'s enthusiasm for providing exceptional service leads \
her to stay current on market trends, so that her clients have the most up-to-date pricing information \
possible - whether buying or selling. A master negotiator, she uses her market knowledge to protect \
and guide her clients.&lt;BR/&gt;&lt;BR/&gt;Testimonials&lt;BR/&gt;&lt;BR/&gt;"I would highly recommend \
Nancy as a real estate agent. She listened to what I wanted in a home and worked hard to find me houses \
to look at that were within my parameters. She is entirely professional but has a warmth of personality \
that made me feel very comfortable with her. When it came down to selecting a home she was invaluable in \
getting me the information and resources I needed throughout the process of buying my home. Her support \
was crucial during a difficult process and I would certainly call on her again if buying or selling a home.\
"&lt;BR/&gt;&lt;BR/&gt;"Thank you so much for helping us find our little gem by the sea.  We absolutely love it. \
It was such a pleasure to have you as our agent.  For a small woman you sure pack a lot of punch.  \
Your attention to detail, timely prompting and gentle reminders of key milestones were a great help.  \
We would definitely recommend you to friends and family. You get things done!  It is Such a pleasure to know you." \
Dave and Carmel Listro&lt;BR/&gt;&lt;BR/&gt;"I am very pleased to give my highest recommendation for Nancy Johnson \
as a selling agent.  She put forth exceptional effort to help sell my beach house in Clinton.  She is extremely \
knowledgeable in the realty business, very friendly and professional.  She goes way above and beyond what is \
expected.  Since I don\'t live close to Clinton, she personally met with contractors and inspectors on my behalf.  \
She even went to the Clinton Town Hall to find documents that the buyers were looking for.  In addition, \
she conducted many open houses and put ads in the local papers.  In summary, Nancy Johnson displays the best \
attributes of a selling agent.  She is honest, forthcoming and a pleasure to work with." Dr. Steve Brown, Avon, \
CT&lt;BR/&gt;&lt;BR/&gt;"When a person waits their entire adult life to start their search for their dream \
cottage, one can only hope they begin their search with Nancy Johnson.  For years I have been following Realtor, \
Trulia &amp; Zillow.com for a special place on the Connecticut shore.  When this property of interest appeared \
on Zillow, I called the listing agent and my call was returned immediately by Nancy Johnson.  At that moment, \
I knew I was connected with the right person!  My husband and I agreed that we found our special spot on the \
Connecticut shore and put down a deposit and made an offer.  Nancy is a true professional.  She knows her job, \
her properties and all the little details of the towns along the way.  Nancy was a pleasure to work with.  \
She listened while I talked. She answered every question I had.  She helped with every request, big or small, \
day or night.  Her personality gave us a sense of comfort knowing that not only was she our realtor but a new \
friend helping us find our dream.   I would recommend Nancy Johnson to anyone who is looking for their dream.  \
She will make it come true!"  Kathleen M. Banta, Unionville, CT&lt;BR/&gt;&lt;BR/&gt; &lt;BR/&gt;&lt;BR/&gt;
TEXT;
    }
}
