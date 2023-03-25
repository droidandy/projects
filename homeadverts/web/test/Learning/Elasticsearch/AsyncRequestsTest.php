<?php

namespace Learning\Elasticsearch;

use Elasticsearch\ClientBuilder;

class AsyncRequestsTest extends \PHPUnit_Framework_TestCase
{
    public function testAsyncRequests()
    {
        $builder = ClientBuilder::create();
        $builder->setHosts('10.133.29.38:9200');

        $client = $builder->build();

        $futures = [];
        $time = microtime(true);
        foreach (['property_id.json', 'property_mls_ref.json', 'property_zip.json', 'agent_name.json', 'property_location_aggregations.json', 'agent_location_aggregations.json'] as $query) {
            $json = file_get_contents(__DIR__.'/fixtures/queries/'.$query);
            $query = json_decode($json, true);
            $query['client'] = [
                'future' => 'lazy',
            ];
            $futures[] = $client
                ->search($query)
            ;
        }
        // initiate execution in parallel
        foreach ($futures as $future) {
            $result = $future['hits'];
        }

        echo 'Finished in '.microtime(true) - $time;
    }
}
