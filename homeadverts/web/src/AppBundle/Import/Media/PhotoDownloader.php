<?php

namespace AppBundle\Import\Media;

use Guzzle\Http\Client;
use Guzzle\Http\Exception\BadResponseException;
use Monolog\Logger;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\File;

class PhotoDownloader
{
    /**
     * @var Client
     */
    private $httpClient;
    /**
     * @var Filesystem
     */
    private $filesystem;
    /**
     * @var Logger
     */
    private $logger;
    /**
     * @var string
     */
    private $fixturesDir;
    /**
     * @var bool
     */
    private $test;

    public function __construct(
        Client $httpClient,
        Filesystem $filesystem,
        Logger $logger,
        string $fixturesDir,
        $test = false
    )
    {
        $this->httpClient = $httpClient;
        $this->filesystem = $filesystem;
        $this->logger = $logger;
        $this->fixturesDir = $fixturesDir;
        $this->test = $test;
    }

    public function download($photoUrl, $localPath)
    {
        try {
            if ($this->test) {
                $dir = realpath($this->fixturesDir . '/../test/fixtures');
                $from = $dir . '/dummy_house.jpeg';
                $localPath = $dir . '/dummy_house_' . uniqid();

                $this->filesystem->copy($from, $localPath);
            } else {
                $this->filesystem->mkdir(dirname($localPath), 0777);
                $this->log('Downloading %s to %s', $photoUrl, $localPath);

                $photoUrl = 0 === strpos($photoUrl, '//')
                    ? 'http:' . $photoUrl
                    : $photoUrl;
                $retry = true;
                $retries = 0;
                $response = null;

                while ($retry && $retries < 3) {
                    try {
                        $response = $this->httpClient
                            ->get($photoUrl)
                            ->setResponseBody($localPath)
                            ->send();
                        $retry = false;
                    } catch (BadResponseException $e) {
                        if (
                            $e->getResponse()
                            && 503 == $e->getResponse()->getStatusCode()
                        ) {
                            $retry = true;
                            ++$retries;
                            usleep(500000);
                        } else {
                            $retry = false;
                        }
                    }
                }

                if (!$response) {
                    throw new \RuntimeException('PhotoDownloader Response is empty');
                }
            }

            $file = $this->makeFile($localPath);
            $ext = $file->guessExtension();
            $file = $file->move($file->getPath(), $file->getFilename() . '.' . $ext);
        } catch (\Exception $e) {
            if ($this->filesystem->exists($localPath)) {
                $this->filesystem->remove($localPath);
            }

            throw new MediaException($e->getMessage(), $e->getCode(), $e);
        }

        $this->log('File created %s', $file->getPathname());

        return $file;
    }

    public function makeFile($localPath)
    {
        return new File($localPath);
    }

    private function log($msg, ...$arguments)
    {
        $this->logger->debug(sprintf($msg, ...$arguments));
    }
}
