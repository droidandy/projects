<?php

namespace Test\AppBundle;

use AppBundle\Service\Import\Wellcomemat\WellcomematGuzzleAdapter;
use AppBundle\Service\Import\Wellcomemat\WellcomematFeed;
use GuzzleHttp\Client;
use GuzzleHttp\Handler\MockHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Psr7\Response;
use Psr\Log\LoggerInterface;

class WellcomematFeedTest extends AbstractFrameworkTestCase
{
    /**
     * @var WellcomematFeed
     */
    private $wcFeed;
    /**
     * @var MockHandler
     */
    private $mockHandler;
    /**
     * @var LoggerInterface
     */
    private $logger;

    protected function setUp()
    {
        $this->logger = $this->getLogger();

        $this->mockHandler = $mockHandler = new MockHandler();
        $client = new Client(['handler' => HandlerStack::create($mockHandler)]);

        $this->wcFeed = new WellcomematFeed(
            new WellcomematGuzzleAdapter(null, null, null, $client),
            $this->logger
        );
    }

    public function testGetCustomIdVideos()
    {
        $medias = <<<JSON
    [
        {
          "hash": "gc5062fe923516",
          "created": "2014-06-04 10:48:57 EST",
          "replaced": "2014-06-04 11:02:58 EST",
          "status_code": "400",
          "status_message": "Active",
          "title": "Fidelio: 2547 Halfway Road, The Plains, VA 20198",
          "description": "Nestled in the rolling hills of the renowned Virginia Hunt Country, Fidelio is a masterful expression of timeless neoclassical architecture. Designed for showcasing art, gracious entertaining and luxurious living, the Villa features finely proportioned rooms with vaulted and coffered ceilings, antique floors and exquisite mantels. Twelve sets of French doors open to a loggia, courtyard and to the formal gardens and landscapes beyond. The estate's numerous dependencies provide every comfort and convenience. The 61 acres include picturesque stacked-stone walls, bridges and paths, a meandering stream and specimen landscaping. Two miles from Middleburg, Fidelio is located within the territory of the Orange County Hunt. The estate offers security, privacy and tranquility along with easy access to Dulles International Airport and the Washington, DC Metropolitan Area.",
          "keywords": "Real Estate,Luxury,RitzertWeiss,TTR Sotheby's International Realty,Estate,Fidelio,Virginia,Washington DC Metropolitan area,Middleburg",
          "customid": "K4WVJ7",
          "original_http_url": "http:\/\/82465a8c6019cbd03786-7b33788af20eb16deff7769bccdf782b.r23.cf1.rackcdn.com\/",
          "original": "original_gc5062fe923516_n6nftl.mov",
          "source": "site",
          "traffic_url": null,
          "slideshow": "0",
          "video_type": "1",
          "price": "15000000",
          "location": {
            "address": "2547 Halfway Road",
            "city": "The Plains",
            "state_province": "VA",
            "postal_code": "20198",
            "latitude": "38.931384000000",
            "longitude": "-77.740222000000"
          },
          "image": {
            "hash": "35162088e2c5ep77",
            "http_url": "https:\/\/0f09f3dc97720fdbfce6-edffc6cf84a1214568eae26dc2113f20.ssl.cf1.rackcdn.com\/",
            "icon": "gc5062fe923516_35162088e2c5ep77_icon.jpg",
            "square": "gc5062fe923516_35162088e2c5ep77_square.jpg",
            "thumbnail": "gc5062fe923516_35162088e2c5ep77_thumbnail.jpg",
            "thumbnail_16x9": "gc5062fe923516_35162088e2c5ep77_thumbnail16x9.jpg",
            "small": "gc5062fe923516_35162088e2c5ep77_small.jpg",
            "medium": "gc5062fe923516_35162088e2c5ep77_medium.jpg",
            "large": "gc5062fe923516_35162088e2c5ep77_large.jpg",
            "play": "gc5062fe923516_35162088e2c5ep77_play.jpg"
          },
          "video": {
            "http_url": "http:\/\/0f837d73c52260b6ff9d-eaef829eae7c04fd12005cc3ad780db0.r48.cf1.rackcdn.com\/",
            "v270p": "gc5062fe923516_3c124b8b_270p.mp4",
            "v360p": "gc5062fe923516_e6bd4bfb_360p.mp4",
            "v480p": "gc5062fe923516_4a06a0fa_480p.mp4",
            "v720p": "gc5062fe923516_01adbf50_720p.mp4",
            "v1080p": null
          }
        },
        {
          "hash": "gce9685dfc33pa",
          "created": "2014-05-30 10:19:02 EST",
          "replaced": "2014-05-30 10:20:48 EST",
          "status_code": "400",
          "status_message": "Active",
          "title": "626 Philip Digges Drive, Great Falls, VA 22066",
          "description": "Artisan craftsmanship, the finest materials, and extraordinary design elements imported from around the world combine in this elegant stone French Normandy masterpiece by BOWA Builders. Ideally suited for both private relaxationandgrand entertaining, the home offers a dramatic collection of ornate rooms complimented by extensive outdoor spaces and a custom pool overlooking a tranquil private lake.",
          "keywords": "real estate,Great Falls VA,For Sale,TTR Sotheby's International Realty,Marmota Farm,Wine Cellar,Private Lake,Fairfax County",
          "customid": "KWSVZG",
          "original_http_url": "http:\/\/82465a8c6019cbd03786-7b33788af20eb16deff7769bccdf782b.r23.cf1.rackcdn.com\/",
          "original": "original_gce9685dfc33pa_n6e53q.mp4",
          "source": "site",
          "traffic_url": null,
          "slideshow": "0",
          "video_type": "1",
          "price": "5390000",
          "location": {
            "address": "626 Philip Digges Dr ",
            "city": "Great Falls",
            "state_province": "VA",
            "postal_code": "22066",
            "latitude": "39.000248000000",
            "longitude": "-77.281772000000"
          },
          "image": {
            "hash": "33pa5ad5fb0bep79",
            "http_url": "https:\/\/0f09f3dc97720fdbfce6-edffc6cf84a1214568eae26dc2113f20.ssl.cf1.rackcdn.com\/",
            "icon": "gce9685dfc33pa_33pa5ad5fb0bep79_icon.jpeg",
            "square": "gce9685dfc33pa_33pa5ad5fb0bep79_square.jpeg",
            "thumbnail": "gce9685dfc33pa_33pa5ad5fb0bep79_thumbnail.jpeg",
            "thumbnail_16x9": "gce9685dfc33pa_33pa5ad5fb0bep79_thumbnail16x9.jpeg",
            "small": "gce9685dfc33pa_33pa5ad5fb0bep79_small.jpeg",
            "medium": "gce9685dfc33pa_33pa5ad5fb0bep79_medium.jpeg",
            "large": "gce9685dfc33pa_33pa5ad5fb0bep79_large.jpeg",
            "play": "gce9685dfc33pa_33pa5ad5fb0bep79_play.jpeg"
          },
          "video": {
            "http_url": "http:\/\/0f837d73c52260b6ff9d-eaef829eae7c04fd12005cc3ad780db0.r48.cf1.rackcdn.com\/",
            "v270p": "gce9685dfc33pa_d72b646d_270p.mp4",
            "v360p": "gce9685dfc33pa_d5317110_360p.mp4",
            "v480p": "gce9685dfc33pa_52132c16_480p.mp4",
            "v720p": "gce9685dfc33pa_1780dc37_720p.mp4",
            "v1080p": null
          }
        }
    ]
JSON;
        $medias = json_decode($medias, true);
        $medias = [
            'K4WVJ7' => [$medias[0]],
            'KWSVZG' => [$medias[1]],
        ];

        $this
            ->mockHandler
            ->append(
                new Response(
                    200,
                    [],
                    file_get_contents($this->getFixture('/wellcomemat/response_active_g.json'))
                )
            )
        ;
        $videos = $this->wcFeed->getVideos();

        $this->assertEquals(2, count($videos));
        $this->assertArrayHasKey('K4WVJ7', $videos);
        $this->assertArrayHasKey('KWSVZG', $videos);
        $this->assertEquals($medias, $videos);
    }

    public function testNoSuccess()
    {
        $this
            ->mockHandler
            ->append(
                new Response(200, [], '{"success":0}')
            )
        ;
        /** @var \PHPUnit_Framework_MockObject_MockObject $logger */
        $logger = $this->logger;
        $logger
            ->expects($this->once())
            ->method('error')
            ->with('Wellcomemat error {"success":0}')
        ;

        $videos = $this->wcFeed->getVideos();
        $this->assertEmpty($videos);
    }

    public function testFailedRequest()
    {
        $this
            ->mockHandler
            ->append(
                new Response(500, [], 'Wrong credentials')
            )
        ;
        /** @var \PHPUnit_Framework_MockObject_MockObject $logger */
        $logger = $this->logger;
        $logger
            ->expects($this->once())
            ->method('error')
            ->with($this->callback(function ($msg) {
                $this->assertStringStartsWith('Wellcomemat transfer error [500]', $msg);
                $this->assertContains('Wrong credentials', $msg);

                return true;
            }))
        ;

        $videos = $this->wcFeed->getVideos();
        $this->assertEmpty($videos);
    }

    public function testDisabled()
    {
        $this->wcFeed->disable();
        $videos = $this->wcFeed->getVideos();
        $this->assertEmpty($videos);
    }

    private function getLogger()
    {
        return $this
            ->getMockBuilder(LoggerInterface::class)
            ->getMock()
        ;
    }
}
