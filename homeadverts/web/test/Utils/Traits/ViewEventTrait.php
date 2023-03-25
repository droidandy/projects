<?php

namespace Test\Utils\Traits;

use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Statistics\ArticleImpression;
use AppBundle\Entity\Statistics\PropertyImpression;
use AppBundle\Entity\Statistics\PropertyView;
use Faker;
use DateTime;
use AppBundle\Entity\Social\Article;
use AppBundle\Entity\Statistics\ArticleView;
use AppBundle\Entity\User\User;

trait ViewEventTrait
{
    /**
     * @param Article|Property $entity
     * @param User             $user
     * @param DateTime         $date
     * @param string           $sessionId
     * @param string           $model
     * @param string           $event
     *
     * @return ArticleView|ArticleImpression|PropertyView|PropertyImpression
     */
    public function newDisplayEventPersistent(
        $entity,
        User $user = null,
        DateTime $date,
        $sessionId,
        $model,
        $event
    ) {
        $displayEvent = $this->newDisplayEventInstance($model, $event);

        if ($user) {
            $displayEvent->setUserId($user->getId());
        }

        $displayEvent->setItemId($entity->getId());

        $displayEvent->setIp($this->getFaker()->ipv4);
        $displayEvent->setSessionId($sessionId);
        $displayEvent->setSource(ArticleView::SOURCE_DETAILS);

        $displayEvent->setCreatedAt($date);

        $this->em->persist($displayEvent);
        $this->em->flush($displayEvent);

        return $displayEvent;
    }

    /**
     * @param string $model
     * @param string $event
     *
     * @return ArticleView|ArticleImpression|PropertyView|PropertyImpression
     */
    private function newDisplayEventInstance($model, $event)
    {
        $className = sprintf(
            'AppBundle\Entity\Statistics\%s%s',
            ucfirst($model),
            ucfirst($event)
        );

        return new $className();
    }

    /**
     * @return Faker\Generator
     */
    abstract protected function getFaker();
}
