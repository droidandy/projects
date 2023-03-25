<?php

namespace AppBundle\Elastic\Integration\Mapping;

use AppBundle\Elastic\Integration\Query\RequestInterface;

interface MappingInterface
{
    const MAPPINGS = [
        'user',
        'property',
        'tag',
        'article',
    ];

    public function apply();

    public function update(...$fields);

    public function remove();

    public function addDocument($id, $entity);

    /**
     * @return DocumentParserInterface
     */
    public function getDocumentParser();

    public function execute(RequestInterface $request);
}
