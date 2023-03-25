<?php

namespace Test\AppBundle;

use AppBundle\Service\Import\Wellcomemat\WellcomematGuzzleAdapter;
use GuzzleHttp\Client;
use GuzzleHttp\Handler\MockHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Psr7\Response;

class WellcomematGuzzleAdapterTest extends AbstractFrameworkTestCase
{
    public function testQueryAll()
    {
        $mockHandler = new MockHandler([
            new Response(
                200,
                [],
                file_get_contents($this->getFixture('/wellcomemat/response_g.json'))
            ),
            new Response(
                200,
                [],
                file_get_contents($this->getFixture('/wellcomemat/response_active_g.json'))
            ),
        ]);

        $client = new Client(['handler' => HandlerStack::create($mockHandler)]);
        $api = new WellcomematGuzzleAdapter(null, null, null, $client);

        $response = $api->queryAll();

        $this->assertEquals(1, $response['success']);
        $this->assertEquals(8, count($response['medias']));

        $media1 = <<<JSON
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
    }
JSON;
        $media2 = <<<JSON
    {
      "hash": "g1269cb8fberi",
      "created": "2011-08-17 09:22:22 EST",
      "replaced": "2012-11-16 12:17:18 EST",
      "status_code": "500",
      "status_message": "Inactive",
      "title": "Wexford Hall",
      "description": "This masterpiece was designed by noted New York architect, William B. Tubby. Breathtaking interiors, indoor golf range, manicured grounds, enclosed courtyard, stunning pool, charming carriage house and additional three bedroom guest house. There is an exceptional new addition reflecting the original details. Truly one of the greatest estate homes ever built in Connecticut. One hour to Manhattan.",
      "keywords": "Wexford Hall,New Canaan,Connecticut,Property Tour,544 Oenoke Ridge",
      "customid": "133729",
      "original_http_url": "http:\/\/82465a8c6019cbd03786-7b33788af20eb16deff7769bccdf782b.r23.cf1.rackcdn.com\/",
      "original": "wm_v57549Z382mq6zj.mov",
      "source": "site",
      "traffic_url": null,
      "slideshow": "0",
      "video_type": "1",
      "price": "8900000",
      "wm1_id": "CA1788FCE0",
      "location": {
        "address": "544 Oenoke Ridge",
        "city": "New Canaan",
        "state_province": "Ct",
        "postal_code": "06840",
        "latitude": "41.163151900000",
        "longitude": "-73.510364000000"
      },
      "image": {
        "hash": "eri9089b3b05hv2",
        "http_url": "https:\/\/0f09f3dc97720fdbfce6-edffc6cf84a1214568eae26dc2113f20.ssl.cf1.rackcdn.com\/",
        "icon": null,
        "square": null,
        "thumbnail": "57549_xxoejuev_wm1_thumb.jpg",
        "thumbnail_16x9": "57549_xxoejuev_wm1_thumb.jpg",
        "small": "57549_xxoejuev.jpg",
        "medium": "57549_xxoejuev.jpg",
        "large": "57549_xxoejuev.jpg",
        "play": null
      },
      "video": {
        "http_url": "http:\/\/0f837d73c52260b6ff9d-eaef829eae7c04fd12005cc3ad780db0.r48.cf1.rackcdn.com\/",
        "v270p": "50972ceccf0_ef7a0423_270p.mp4",
        "v360p": "50972ceccf0_0c5bb583_360p.mp4",
        "v480p": "50972ceccf0_7f32a01c_480p.mp4",
        "v720p": "50972ceccf0_fda2ad68_720p.mp4",
        "v1080p": null
      }
    }
JSON;

        $this->assertEquals(json_decode($media1, true), $response['medias'][0]);
        $this->assertEquals(json_decode($media2, true), $response['medias'][7]);

        $response = $api->queryAll([
            'status' => WellcomematGuzzleAdapter::ACTIVE,
        ]);
        $this->assertEquals(1, $response['success']);

        $this->assertEquals(6, count($response['medias']));

        $media1 = <<<JSON
    {
      "hash": "g10e1e8081erg",
      "created": "2011-05-11 12:00:30 EST",
      "replaced": "2012-11-16 12:16:50 EST",
      "status_code": "400",
      "status_message": "Active",
      "title": "William Pitt",
      "description": "Meet Our Ceo Series\\\\n\\\\nPaul Breunich talks about how William Pitt was his mentor and how he gave him the biggest opportunity of his life.  William Pitt did a lot for his community and Paul considers him his role model.\\\\n",
      "keywords": "CEO, Paul Breunich, Leadership",
      "customid": "",
      "original_http_url": "http:\/\/82465a8c6019cbd03786-7b33788af20eb16deff7769bccdf782b.r23.cf1.rackcdn.com\/",
      "original": "wm_v52729Zc958b.mov",
      "source": "site",
      "traffic_url": null,
      "slideshow": "0",
      "video_type": "11",
      "wm1_id": "58FAE83ED4",
      "location": {
        "address": "901 Main Ave, Suite 100",
        "city": "Norwalk",
        "state_province": "Connecticut",
        "postal_code": "06850",
        "latitude": "41.144988000000",
        "longitude": "-73.428669000000"
      },
      "image": {
        "hash": "ergbe2dbaab2mp7",
        "http_url": "https:\/\/0f09f3dc97720fdbfce6-edffc6cf84a1214568eae26dc2113f20.ssl.cf1.rackcdn.com\/",
        "icon": null,
        "square": null,
        "thumbnail": "52729_1305142953_wm1_thumb.jpg",
        "thumbnail_16x9": "52729_1305142953_wm1_thumb.jpg",
        "small": "52729_1305142953.jpg",
        "medium": "52729_1305142953.jpg",
        "large": "52729_1305142953.jpg",
        "play": null
      },
      "video": {
        "http_url": "http:\/\/0f837d73c52260b6ff9d-eaef829eae7c04fd12005cc3ad780db0.r48.cf1.rackcdn.com\/",
        "v270p": "501c2d55940_3c6234c0_270p.mp4",
        "v360p": "501c2d55940_6d73d855_360p.mp4",
        "v480p": "501c2d55940_d4af1a8c_480p.mp4",
        "v720p": "501c2d55940_c8446dc0_720p.mp4",
        "v1080p": null
      }
    }
JSON;
        $media2 = <<<JSON
    {
      "hash": "g16321da83erh",
      "created": "2011-05-12 12:13:14 EST",
      "replaced": "2012-11-16 12:17:14 EST",
      "status_code": "400",
      "status_message": "Active",
      "title": "William Pitt Sotheby&#39;s International Realty",
      "description": "Meet Our CEO Series\\\\n\\\\nPaul Breunich answers the question many wonder, Why Choose William Pitt Sotheby&#39;s International Realty?",
      "keywords": "CEO, Paul Breunich, Leadership",
      "customid": "",
      "original_http_url": "http:\/\/82465a8c6019cbd03786-7b33788af20eb16deff7769bccdf782b.r23.cf1.rackcdn.com\/",
      "original": "wm_v52796Zbd0a6.mov",
      "source": "site",
      "traffic_url": null,
      "slideshow": "0",
      "video_type": "11",
      "wm1_id": "AD5DAF5C60",
      "location": {
        "address": "901 Main Ave, Suite 100",
        "city": "Norwalk",
        "state_province": "Connecticut",
        "postal_code": "06850",
        "latitude": "41.144988000000",
        "longitude": "-73.428669000000"
      },
      "image": {
        "hash": "erh4b68ea2e2mp8",
        "http_url": "https:\/\/0f09f3dc97720fdbfce6-edffc6cf84a1214568eae26dc2113f20.ssl.cf1.rackcdn.com\/",
        "icon": null,
        "square": null,
        "thumbnail": "52796_1305229925_wm1_thumb.jpg",
        "thumbnail_16x9": "52796_1305229925_wm1_thumb.jpg",
        "small": "52796_1305229925.jpg",
        "medium": "52796_1305229925.jpg",
        "large": "52796_1305229925.jpg",
        "play": null
      },
      "video": {
        "http_url": "http:\/\/0f837d73c52260b6ff9d-eaef829eae7c04fd12005cc3ad780db0.r48.cf1.rackcdn.com\/",
        "v270p": "502a6c38de0_4f6a0e05_270p.mp4",
        "v360p": "502a6c38de0_776f4d67_360p.mp4",
        "v480p": "502a6c38de0_50941453_480p.mp4",
        "v720p": "502a6c38de0_f869cb51_720p.mp4",
        "v1080p": null
      }
    }
JSON;

        $this->assertEquals(json_decode($media1, true), $response['medias'][0]);
        $this->assertEquals(json_decode($media2, true), $response['medias'][5]);
    }

    /*private function createMedia(
        $hash, $created, $replaced, $statusCode, $statusMessage, $title,
        $description, $keywords, $customId, $originalHttpUrl, $original,
        $source, $trafficUrl, $slideShow, $videoType, $wm1Id, $location, $image, $video
    )
    {
        return [
            'hash' => $hash,
            'created' => $created,
            'replaced' => $replaced,
            'status_code' => $statusCode,
            'status_message' => $statusMessage,
            'title' => $title,
            'description' => $description,
            'keywords' => $keywords,
            'customid' => $customId,
            'original_http_url' => $originalHttpUrl,
            'original' => $original,
            'source' => $source,
            'traffic_url' => $trafficUrl,
            'slideshow' => $slideShow,
            'video_type' => $videoType,
            'wm1_id' => $wm1Id,
            'location' => $location,
            'image' => $image,
            'video' => $video
        ];
    }*/
}
