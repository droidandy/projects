<?php

namespace Test\AppBundle\Imagine;

use Aws\S3\S3Client;
use Liip\ImagineBundle\Imagine\Cache\Resolver\AwsS3Resolver;
use Liip\ImagineBundle\Imagine\Cache\Resolver\ProxyResolver;
use Test\AppBundle\AbstractWebTestCase;

class ProxyAwsResolverS3ClientIntegrationalTest extends AbstractWebTestCase
{
    public function testPathStyleFileName()
    {
        $s3Client = new S3Client([
            'region' => 'us-east-1',
            'version' => '2006-03-01',
            'credentials' => [
                'key' => 'key',
                'secret' => 'secret',
            ],
        ]);
        $resolver = new AwsS3Resolver($s3Client, 'properties-homeadverts-com');
        $proxyResolver = new ProxyResolver($resolver, ['http://d17iutq12wgiur.cloudfront.net']);

        /**
         * Commented assertions are possible scenarios of usage Liip+S3Client that will not work properly.
         */
//        $this->assertEquals(
//            'http://d17iutq12wgiur.cloudfront.net/list_thumb_adv/properties/17657/17657-180df2f0da0efe4b944f9035b5b8acd7b0e1872b.jpeg',
//                $proxyResolver->resolve('properties/17657/17657-180df2f0da0efe4b944f9035b5b8acd7b0e1872b.jpeg', 'list_thumb_adv')
//        );
//        $this->assertEquals(
//            'http://d17iutq12wgiur.cloudfront.net/list_thumb_adv/properties/17657/17657-180df2f0da0efe4b944f9035b5b8acd7b0e1872b.jpeg',
//                $proxyResolver->resolve('properties-homeadverts-com/properties/17657/17657-180df2f0da0efe4b944f9035b5b8acd7b0e1872b.jpeg', 'list_thumb_adv')
//        );

        $proxyResolver = new ProxyResolver($resolver, ['https://s3.amazonaws.com/properties-homeadverts-com' => 'http://d17iutq12wgiur.cloudfront.net']);

//        $this->assertEquals(
//            'http://d17iutq12wgiur.cloudfront.net/list_thumb_adv/properties/17657/17657-180df2f0da0efe4b944f9035b5b8acd7b0e1872b.jpeg',
//            $proxyResolver->resolve('properties/17657/17657-180df2f0da0efe4b944f9035b5b8acd7b0e1872b.jpeg', 'list_thumb_adv')
//        );
//        $this->assertEquals(
//            'http://d17iutq12wgiur.cloudfront.net/list_thumb_adv/properties/17657/17657-180df2f0da0efe4b944f9035b5b8acd7b0e1872b.jpeg',
//            $proxyResolver->resolve('properties-homeadverts-com/properties/17657/17657-180df2f0da0efe4b944f9035b5b8acd7b0e1872b.jpeg', 'list_thumb_adv')
//        );

        $proxyResolver = new ProxyResolver($resolver, ['https://s3.amazonaws.com/properties-homeadverts-com' => 'http://d17iutq12wgiur.cloudfront.net']);

        $this->assertEquals(
            'http://d17iutq12wgiur.cloudfront.net/list_thumb_adv/properties/17657/17657-180df2f0da0efe4b944f9035b5b8acd7b0e1872b.jpeg',
            $proxyResolver->resolve('properties/17657/17657-180df2f0da0efe4b944f9035b5b8acd7b0e1872b.jpeg', 'list_thumb_adv')
        );
//        $this->assertEquals(
//            'http://d17iutq12wgiur.cloudfront.net/list_thumb_adv/properties/17657/17657-180df2f0da0efe4b944f9035b5b8acd7b0e1872b.jpeg',
//            $proxyResolver->resolve('properties-homeadverts-com/properties/17657/17657-180df2f0da0efe4b944f9035b5b8acd7b0e1872b.jpeg', 'list_thumb_adv')
//        );
    }

    public function testVirtualHostFileName()
    {
        $s3Client = new S3Client([
            'region' => 'us-east-1',
            'version' => '2006-03-01',
            'credentials' => [
                'key' => 'key',
                'secret' => 'secret',
            ],
            'bucket_endpoint' => true,
            'endpoint' => 'https://properties-homeadverts-com.s3.amazonaws.com',
        ]);
        $resolver = new AwsS3Resolver($s3Client, 'properties-homeadverts-com');
        $proxyResolver = new ProxyResolver($resolver, ['http://d17iutq12wgiur.cloudfront.net']);

        $this->assertEquals(
            'http://d17iutq12wgiur.cloudfront.net/list_thumb_adv/properties/17657/17657-180df2f0da0efe4b944f9035b5b8acd7b0e1872b.jpeg',
            $proxyResolver->resolve('properties/17657/17657-180df2f0da0efe4b944f9035b5b8acd7b0e1872b.jpeg', 'list_thumb_adv')
        );

        /**
         * Commented assertions are possible scenarios of usage Liip+S3Client that will not work properly.
         */
//        $this->assertEquals(
//            'http://d17iutq12wgiur.cloudfront.net/list_thumb_adv/properties/17657/17657-180df2f0da0efe4b944f9035b5b8acd7b0e1872b.jpeg',
//            $proxyResolver->resolve('properties-homeadverts-com/properties/17657/17657-180df2f0da0efe4b944f9035b5b8acd7b0e1872b.jpeg', 'list_thumb_adv')
//        );

        $proxyResolver = new ProxyResolver($resolver, ['https://properties-homeadverts-com.s3.amazonaws.com' => 'http://d17iutq12wgiur.cloudfront.net']);

        $this->assertEquals(
            'http://d17iutq12wgiur.cloudfront.net/list_thumb_adv/properties/17657/17657-180df2f0da0efe4b944f9035b5b8acd7b0e1872b.jpeg',
            $proxyResolver->resolve('properties/17657/17657-180df2f0da0efe4b944f9035b5b8acd7b0e1872b.jpeg', 'list_thumb_adv')
        );
//        $this->assertEquals(
//            'http://d17iutq12wgiur.cloudfront.net/list_thumb_adv/properties/17657/17657-180df2f0da0efe4b944f9035b5b8acd7b0e1872b.jpeg',
//            $proxyResolver->resolve('properties-homeadverts-com/properties/17657/17657-180df2f0da0efe4b944f9035b5b8acd7b0e1872b.jpeg', 'list_thumb_adv')
//        );
    }
}
