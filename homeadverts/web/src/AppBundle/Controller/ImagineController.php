<?php

namespace AppBundle\Controller;

use Liip\ImagineBundle\Controller\ImagineController as BaseImagineController;
use Liip\ImagineBundle\Imagine\Cache\CacheManager;
use Liip\ImagineBundle\Imagine\Cache\Resolver\CacheResolver;
use Liip\ImagineBundle\Imagine\Cache\Resolver\ResolverInterface;
use Liip\ImagineBundle\Imagine\Cache\SignerInterface;
use Liip\ImagineBundle\Imagine\Data\DataManager;
use Liip\ImagineBundle\Imagine\Filter\FilterManager;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Request;
use Imagine\Exception\RuntimeException;
use Liip\ImagineBundle\Exception\Imagine\Filter\NonExistingFilterException;
use Liip\ImagineBundle\Exception\Binary\Loader\NotLoadableException;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ImagineController extends BaseImagineController
{
    /**
     * @var CacheResolver
     */
    protected $cacheResolver;

    /**
     * @var ResolverInterface
     */
    protected $awsResolver;

    public function __construct(
        CacheResolver $cacheResolver,
        ResolverInterface $awsResolver,
        DataManager $dataManager,
        FilterManager $filterManager,
        CacheManager $cacheManager,
        SignerInterface $signer,
        LoggerInterface $logger
    ) {
        $this->cacheResolver = $cacheResolver;
        $this->awsResolver = $awsResolver;
        parent::__construct($dataManager, $filterManager, $cacheManager, $signer, $logger);
    }

    /**
     * This action applies a given filter to a given image, optionally saves the image and outputs it to the browser at the same time.
     *
     * @param Request $request
     * @param string  $path
     * @param string  $filter
     *
     * @throws \RuntimeException
     * @throws BadRequestHttpException
     *
     * @return RedirectResponse
     */
    public function filterAction(Request $request, $path, $filter)
    {
        ini_set('memory_limit', '512M');
        // decoding special characters and whitespaces from path obtained from url
        $path = urldecode($path);

        try {
            if (!$this->cacheResolver->isInCache($path, $filter)) {
                if (!$this->awsResolver->isStored($path, $filter)) {
                    try {
                        $binary = $this->dataManager->find($filter, $path);
                    } catch (NotLoadableException $e) {
                        if ($defaultImageUrl = $this->dataManager->getDefaultImageUrl($filter)) {
                            return new RedirectResponse($defaultImageUrl);
                        }

                        throw new NotFoundHttpException('Source image could not be found', $e);
                    }

                    $this->cacheManager->store(
                        $this->filterManager->applyFilter($binary, $filter),
                        $path,
                        $filter
                    );
                }
            }

            return new RedirectResponse($this->cacheManager->resolve($path, $filter), 301);
        } catch (NonExistingFilterException $e) {
            $message = sprintf('Could not locate filter "%s" for path "%s". Message was "%s"', $filter, $path, $e->getMessage());

            if (null !== $this->logger) {
                $this->logger->debug($message);
            }

            throw new NotFoundHttpException($message, $e);
        } catch (RuntimeException $e) {
            throw new \RuntimeException(sprintf('Unable to create image for path "%s" and filter "%s". Message was "%s"', $path, $filter, $e->getMessage()), 0, $e);
        }
    }
}
