<?php

namespace AppBundle\Service\Analysis;

use AppBundle\Entity\Location\Location;
use AppBundle\Entity\Social\Article\ArticleRecommendedRepository;
use AppBundle\Entity\Social\Article\ArticleRepository;
use AppBundle\Entity\Social\Tag;
use AppBundle\Entity\Social\TagRepository;
use AppBundle\Entity\User\UserRepository;
use AppBundle\Elastic\Location\LocationRepo;
use Doctrine\ORM\EntityManager;
use Doctrine\Common\Cache\CacheProvider;

class Popular
{
    const POPULAR_LOCATION_LUGS = [
        'new-york-usa',
        'london-uk',
        'paris-france',
    ];
    const CACHE_NAMESPACE = 'popular';
    const CACHE_KEY_SEARCH = 'search';
    const CACHE_KEY_TAGS = 'tags';
    const CACHE_TTL = 3600;

    /**
     * @var EntityManager
     */
    protected $em;
    /**
     * @var CacheProvider
     */
    protected $cache;
    /**
     * @var LocationRepo
     */
    protected $locationRepo;
    /**
     * @var TagRepository
     */
    protected $tagRepo;
    /**
     * @var ArticleRepository
     */
    protected $articleRecommendedRepository;
    /**
     * @var ArticleRepository
     */
    protected $articleRepository;
    /**
     * @var TagRepository
     */
    protected $tagRepository;
    /**
     * @var UserRepository
     */
    protected $userRepository;

    /**
     * @param EntityManager                $entityManager
     * @param CacheProvider                $cache
     * @param TagRepository                $tagRepo
     * @param LocationRepo                 $locationRepo
     * @param ArticleRecommendedRepository $articleRecommendedRepository
     * @param ArticleRepository            $articleRepository
     * @param TagRepository                $tagRepository
     * @param UserRepository               $userRepository
     */
    public function __construct(
        EntityManager $entityManager,
        CacheProvider $cache,
        LocationRepo $locationRepo,
        TagRepository $tagRepo,
        ArticleRecommendedRepository $articleRecommendedRepository,
        ArticleRepository $articleRepository,
        TagRepository $tagRepository,
        UserRepository $userRepository
    ) {
        $this->em = $entityManager;
        $this->cache = $cache;

        $this->locationRepo = $locationRepo;
        $this->tagRepo = $tagRepo;
        $this->articleRecommendedRepository = $articleRecommendedRepository;
        $this->articleRepository = $articleRepository;
        $this->tagRepository = $tagRepository;
        $this->userRepository = $userRepository;
    }

    /**
     * @return Tag[]
     */
    public function getTopRatedTags()
    {
        $this->cache->setNamespace(self::CACHE_NAMESPACE);
        $popular = $this->cache->fetch(self::CACHE_KEY_TAGS);

        if (!$popular) {
            $popular = [];
            $tags = $this->tagRepo->getPopularTags(25);

            foreach ($tags as $t) {
                $popular[] = [
                    'tag' => $this->tagRepo->find($t['id']),
                    'rank' => $t['total_articles'],
                ];
            }

            $popular = serialize($popular);
            $this->cache->save(self::CACHE_KEY_TAGS, $popular, self::CACHE_TTL);
        }

        return unserialize($popular);
    }

    /**
     * @return array
     */
    public function getPopularUsingCache()
    {
        $this->cache->setNamespace(self::CACHE_NAMESPACE);
        $popular = $this->cache->fetch(self::CACHE_KEY_SEARCH);

        if (!$popular) {
            $popular = serialize($this->buildPopular());
            $this->cache->save(self::CACHE_KEY_SEARCH, $popular, self::CACHE_TTL);
        }

        return unserialize($popular);
    }

    /**
     * @return array
     */
    public function buildPopular()
    {
        $locationRepo = $this->em->getRepository(Location::class);

        $tags = $this->tagRepository->getPopularTags();
        $users = $this->userRepository->getPopularUsers();
        $locations = [];

        foreach (self::POPULAR_LOCATION_LUGS as $slug) {
            $location = $locationRepo->findOneBy([
                'slug' => $slug,
            ]);

            if ($location) {
                $locations[] = $this->locationRepo->summary($location)['location']['items'][0];
            }
        }
        return [
            'locations' => $locations,
            'articles' => $this->articleRecommendedRepository->getCover(3),
            'users' => $users,
            'tags' => $tags,
        ];
    }
}
