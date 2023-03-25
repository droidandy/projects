<?php

namespace AppBundle\Import\User;

use AppBundle\Import\Normalizer\Company\NormalisedCompanyInterface;
use AppBundle\Import\Normalizer\Office\NormalisedOfficeInterface;
use AppBundle\Import\Normalizer\User\NormalisedUserInterface;
use AppBundle\Import\User\Populator\PopulateException;
use AppBundle\Import\User\Populator\PopulatorInterface;
use AppBundle\Entity\User\User;

class NormalizedToDBUserTransformer
{
    /**
     * @var PopulatorInterface[][]
     */
    private $populators;

    /**
     * @param PopulatorInterface[][] $populators
     */
    public function __construct(array $populators)
    {
        $this->populators = $populators;
    }

    /**
     * @param User                                                                         $user
     * @param NormalisedUserInterface|NormalisedCompanyInterface|NormalisedOfficeInterface $normalisedUser
     *
     * @throws SyncException
     */
    public function persistFromNormalised(User $user, $normalisedUser)
    {
        if ($normalisedUser instanceof NormalisedUserInterface) {
            $type = 'user';
        } elseif ($normalisedUser instanceof NormalisedCompanyInterface) {
            $type = 'company';
        } elseif ($normalisedUser instanceof NormalisedOfficeInterface) {
            $type = 'office';
        } else {
            throw new \RuntimeException('Unrecognized type');
        }
        $messages = [];
        foreach ($this->populators[$type] as $populator) {
            try {
                $populator->populate($user, $normalisedUser);
            } catch (PopulateException $e) {
                $messages[] = $e->getMessage();
            }
        }
        if (!empty($messages)) {
            throw new SyncException($messages);
        }
    }
}
