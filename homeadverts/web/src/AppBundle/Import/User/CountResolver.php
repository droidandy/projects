<?php

namespace AppBundle\Import\User;

use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Property\PropertyRepository;
use AppBundle\Entity\Social\Article;
use AppBundle\Entity\Social\Article\ArticleRepository;
use AppBundle\Entity\User\User;
use AppBundle\Entity\User\UserRepository;
use AppBundle\Elastic\User\Mapping\UserMapping;
use AppBundle\Helper\SprintfLoggerTrait;
use Doctrine\DBAL\LockMode;
use Doctrine\ORM\EntityManager;
use Psr\Log\LoggerInterface;

class CountResolver
{
    use SprintfLoggerTrait;

    const CHAIN_MODE_ADD = 'add';
    const CHAIN_MODE_UPDATE = 'update';
    /**
     * @var UserRepository
     */
    private $userRepo;
    /**
     * @var PropertyRepository
     */
    private $propertyRepo;
    /**
     * @var ArticleRepository
     */
    private $articleRepo;
    /**
     * @var UserMapping
     */
    private $userMapping;
    /**
     * @var EntityManager
     */
    private $em;
    /**
     * @var LoggerInterface
     */
    private $logger;
    /**
     * @var array
     */
    private $processedIds = [];
    /**
     * @var bool
     */
    private $shouldUpdateCache = false;

    public function __construct(
        UserRepository $userRepo,
        PropertyRepository $propertyRepo,
        ArticleRepository $articleRepo,
        UserMapping $userMapping,
        EntityManager $em,
        LoggerInterface $logger
    ) {
        $this->userRepo = $userRepo;
        $this->propertyRepo = $propertyRepo;
        $this->articleRepo = $articleRepo;
        $this->userMapping = $userMapping;
        $this->em = $em;
        $this->logger = $logger;
    }

    public function resolveAgent($userId)
    {
        if ($userId instanceof User) {
            $userId = $userId->getId();
        }

        $this->processedIds[] = $userId;
        [$forSale, $toRent] = $this->propertyRepo->getCountsForAgent($userId);
        $articleCount = $this->articleRepo->getArticleCountForUser($userId);

        $this->userRepo->updateAgentAssetCounts(
            $forSale,
            $toRent,
            $articleCount,
            $userId
        );

        $this->info(
            <<<MSG
            Agent %s resolved with method "%s"
                for_sale %s
                to_rent %s
                article_count %s
MSG
            ,
            $userId,
            'updateAgentAssetCounts',
            $forSale,
            $toRent,
            $articleCount
        );

        $this->updateCache();
    }

    public function resolveOffice($userId, string $mode): void
    {
        if ($userId instanceof User) {
            $userId = $userId->getId();
        }

        $oldCounts = $this->userRepo->getAssetCounts($userId);

        $oldAgentCount = $oldCounts['agentCount'];
        $oldAffiliateCount = $oldCounts['affiliateCount'];
        $oldPropertyForSaleCount = $oldCounts['propertyForSaleCount'];
        $oldPropertyToRentCount = $oldCounts['propertyToRentCount'];
        $oldArticleCount = $oldCounts['articleCount'];

        [$newPropertyForSaleCount, $newPropertyToRentCount] = $this->propertyRepo->getCountsForOffice($userId);
        $newAgentCount = $this->userRepo->getDirectAgentChildCount($userId);
        $newAffiliateCount = $this->userRepo->getDirectAffiliateChildCount($userId);
        $newArticleCount = $this->articleRepo->getArticleCountForUser($userId);

        $this->userRepo->updateChainCounts(
            $userId,
            $newAgentCount - $oldAgentCount,
            $newAffiliateCount - $oldAffiliateCount,
            $newPropertyForSaleCount - $oldPropertyForSaleCount,
            $newPropertyToRentCount - $oldPropertyToRentCount,
            $newArticleCount - $oldArticleCount,
            $mode
        );

        $this->info(
            <<<MSG
            Office %s resolved with method "%s" and mode "%s"
                old_agent=%s, new_agent=%s
                old_affiliate=%s, new_affiliate=%s
                old_property_for_sale=%s, new_property_for_sale=%s
                old_property_to_rent=%s, new_property_to_rent=%s
                old_article=%s, new_article=%s
MSG
            ,
            $userId,
            'updateChainCounts',
            $mode,
            $oldAgentCount,
            $newAgentCount,
            $oldAffiliateCount,
            $newAffiliateCount,
            $oldPropertyForSaleCount,
            $newPropertyForSaleCount,
            $oldPropertyToRentCount,
            $newPropertyToRentCount,
            $oldArticleCount,
            $newArticleCount
        );

        $this->processedIds[] = $userId;
        $parentIds = $this->userRepo->getParentIds($userId);

        $this->processedIds = array_merge($this->processedIds, $parentIds);

        $this->updateCache();
    }

    public function resolveCompany($userId, string $mode): void
    {
        if ($userId instanceof User) {
            $userId = $userId->getId();
        }

        $oldCounts = $this->userRepo->getAssetCounts($userId);

        $oldAgentCount = $oldCounts['agentCount'];
        $oldAffiliateCount = $oldCounts['affiliateCount'];
        $oldPropertyForSaleCount = $oldCounts['propertyForSaleCount'];
        $oldPropertyToRentCount = $oldCounts['propertyToRentCount'];
        $oldArticleCount = $oldCounts['articleCount'];

        $counts = $this->userRepo->getDirectChildAssetCounts($userId);
        $counts['article_count'] += $this->articleRepo->getArticleCountForUser($userId);
        $counts['affiliate_count'] += $this->userRepo->getDirectAffiliateChildCount($userId);

        $newAgentCount = $counts['agent_count'];
        $newAffiliateCount = $counts['affiliate_count'];
        $newPropertyForSaleCount = $counts['property_for_sale_count'];
        $newPropertyToRentCount = $counts['property_to_rent_count'];
        $newArticleCount = $counts['article_count'];

        $this->userRepo->updateChainCounts(
            $userId,
            $newAgentCount - $oldAgentCount,
            $newAffiliateCount - $oldAffiliateCount,
            $newPropertyForSaleCount - $oldPropertyForSaleCount,
            $newPropertyToRentCount - $oldPropertyToRentCount,
            $newArticleCount - $oldArticleCount,
            $mode
        );
        $this->info(
            <<<MSG
            Company %s resolved with method "%s" and mode "%s"
                old_agent=%s, new_agent=%s
                old_affiliate=%s, new_affiliate=%s
                old_property_for_sale=%s, new_property_for_sale=%s
                old_property_to_rent=%s, new_property_to_rent=%s
                old_article=%s, new_article=%s
MSG
            ,
            $userId,
            'updateChainCounts',
            $mode,
            $oldAgentCount,
            $newAgentCount,
            $oldAffiliateCount,
            $newAffiliateCount,
            $oldPropertyForSaleCount,
            $newPropertyForSaleCount,
            $oldPropertyToRentCount,
            $newPropertyToRentCount,
            $oldArticleCount,
            $newArticleCount
        );

        $this->processedIds[] = $userId;

        $processedIds = $this->userRepo->getParentIds($userId);
        $this->processedIds = array_merge($this->processedIds, $processedIds);

        $this->updateCache();
    }

    public function onPropertyAdded(Property $property): void
    {
        list($forSaleDelta, $toRentDelta) = true === $property->rental ? [0, 1] : [1, 0];

        $this->onPropertyCb(
            $property->user
                ? $property->user->getId()
                : null,
            $property->company
                ? $property->company->getId()
                : null,
            $forSaleDelta,
            $toRentDelta
        );
    }

    public function onPropertyDeleted($isRental, $agentId, $officeId): void
    {
        list($forSaleDelta, $toRentDelta) = $isRental ? [0, -1] : [-1, 0];

        $this->onPropertyCb(
            $agentId,
            $officeId,
            $forSaleDelta,
            $toRentDelta
        );
    }

    private function onPropertyCb($agentId, $officeId, $forSaleDelta, $toRentDelta)
    {
        if ($agentId) {
            $this
                ->userRepo
                ->deltaUserCount(
                    $agentId,
                    null,
                    null,
                    $forSaleDelta,
                    $toRentDelta,
                    0
                )
            ;
            $this->processedIds[] = $agentId;
        }

        if ($officeId) {
            $this
                ->userRepo
                ->updateChainCounts(
                    $officeId,
                    0,
                    0,
                    $forSaleDelta,
                    $toRentDelta,
                    0,
                    self::CHAIN_MODE_UPDATE
                )
            ;

            $this->processedIds[] = $officeId;
            $parentIds = $this->userRepo->getParentIds($officeId);
            $this->processedIds = array_merge($this->processedIds, $parentIds);
        }

        $this->updateCache();
    }

    public function onArticlePublished(Article $article): void
    {
        $this->onArticleCb($article, 1);
    }

    public function onArticleUnpublished(Article $article): void
    {
        $this->onArticleCb($article, -1);
    }

    private function onArticleCb(Article $article, $delta)
    {
        $author = $article->getAuthor();
        $assignee = $article->getAssignee();

        /** @var User $user */
        foreach (
            array_filter(
                [$author, $assignee]
            )
            as $user
        ) {
            if (in_array(User::ROLE_AGENT, $user->getRoles())) {
                $this
                    ->userRepo
                    ->deltaUserCount(
                        $user->getId(),
                        null,
                        null,
                        0,
                        0,
                        $delta
                    )
                ;
                $this->processedIds[] = $user->getId();
            } else {
                $this
                    ->userRepo
                    ->updateChainCounts(
                        $user->getId(),
                        0,
                        0,
                        0,
                        0,
                        $delta,
                        self::CHAIN_MODE_UPDATE
                    )
                ;
                $this->processedIds[] = $user->getId();
                $parentIds = $this->userRepo->getParentIds($user);

                $this->processedIds = array_merge($this->processedIds, $parentIds);
            }
        }

        $this->updateCache();
    }

    public function onAgentAdded($agentId): void
    {
        $this->onAgentCb($agentId, 1);
    }

    public function onAgentRemoved($agentId): void
    {
        $this->onAgentCb($agentId, -1);
    }

    private function onAgentCb($agentId, $delta)
    {
        if ($agentId instanceof User) {
            $agentId = $agentId->getId();
        }

        $directParentIds = $this->userRepo->getDirectParentIds($agentId);

        foreach ($directParentIds as $directParentId) {
            $this
                ->userRepo
                ->updateChainCounts(
                    $directParentId,
                    $delta,
                    0,
                    0,
                    0,
                    0,
                    self::CHAIN_MODE_UPDATE
                )
            ;

            $this->processedIds[] = $directParentId;
            $parentIds = $this->userRepo->getParentIds($directParentId);

            $this->processedIds = array_merge($this->processedIds, $parentIds);
        }

        $this->updateCache();
    }

    public function onOfficeRemoved($officeId, callable $removalFn): void
    {
        $this->onBusinessRemoved($officeId, $removalFn);
    }

    public function onCompanyRemoved($companyId, callable $removalFn): void
    {
        $this->onBusinessRemoved($companyId, $removalFn);
    }

    private function onBusinessRemoved($businessId, callable $removalFn)
    {
        if ($businessId instanceof User) {
            $businessId = $businessId->getId();
        }

        $directParentIds = $this->userRepo->getDirectParentIds($businessId);
        if (count($directParentIds) > 1) {
            throw new \RuntimeException(
                sprintf(
                    'Only single parent is expected for "%s", got "%s"',
                    $businessId,
                    implode(',', $directParentIds)
                )
            );
        }
        $businessAssetCounts = $this->userRepo->getAssetCounts($businessId);

        $removalFn();

        if (empty($directParentIds)) {
            return;
        }

        $directParentId = $directParentIds[0];

        $this
            ->userRepo
            ->updateChainCounts(
                $directParentId,
                -$businessAssetCounts['agentCount'],
                -$businessAssetCounts['affiliateCount'] - 1,
                -$businessAssetCounts['propertyForSaleCount'],
                -$businessAssetCounts['propertyToRentCount'],
                -$businessAssetCounts['articleCount'],
                self::CHAIN_MODE_UPDATE
            )
        ;

        $this->processedIds = $this->userRepo->getParentIds($businessId);
    }

    private function updateCache()
    {
        if ($this->shouldUpdateCache) {
            while ($userId = array_shift($this->processedIds)) {
                // force refresh by explicit lock mode
                $this->em->transactional(
                    function () use ($userId) {
                        $user = $this->em->find(User::class, $userId, LockMode::NONE);
                        if ($user) {
                            $this->userMapping->addDocument($userId, $user);
                        }
                    }
                );
            }
        }
    }
}
