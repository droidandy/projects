<?php

namespace AppBundle\Service\Article\Analysis;

use Google\Cloud\Language\LanguageClient;
use Symfony\Bridge\Monolog\Logger;
use Google\Cloud\Core\Exception\BadRequestException;

class AnalyzerClientGoogle implements AnalyzerClientInterface
{
    /**
     * @var
     */
    private $googleCloudApiKey;
    /**
     * @var
     */
    private $logger;

    /**
     * @param string $rootDir
     * @param Logger $logger
     */
    public function __construct($key, $logger)
    {
        $this->googleCloudApiKey = $key;
        $this->logger = $logger;
    }

    /**
     * @param string $text
     *
     * @return array
     */
    public function getTags($text)
    {
        $cleanText = strip_tags($text);
        $language = new LanguageClient([
            'keyFilePath' => $this->googleCloudApiKey,
        ]);
        $tags = [];

        try {
            $annotation = $language->annotateText($cleanText);

            foreach ($annotation->entities() as $entity) {
                if ($entity['salience'] > 0.02
                    && $entity['sentiment']['magnitude'] > 0
                    && 'OTHER' != $entity['type']
                ) {
                    $tags[] = $entity['name'];
                }
            }
        } catch (BadRequestException $e) {
            $this->logger->critical($e->getMessage());
        }

        return array_unique($tags);
    }
}
