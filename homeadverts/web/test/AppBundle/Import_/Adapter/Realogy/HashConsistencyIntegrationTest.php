<?php

namespace Test\AppBundle\Import_\Adapter\Sothebys;

use AppBundle\Import\Adapter\ImportObserverInterface;
use AppBundle\Import\Adapter\Sothebys\Extractor;
use AppBundle\Import\Adapter\Sothebys\FeedDeployerInterface;
use AppBundle\Import\ImportContext;
use AppBundle\Import\User\Hasher;
use AppBundle\Import\NormalisedProperty;
use AppBundle\Import\NormalisedUser;
use AppBundle\Import\User\SourceRefUserRegistry;
use Doctrine\DBAL\Connection;
use AppBundle\Entity\Import;
use AppBundle\Entity\ImportJob;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\DependencyInjection\ContainerInterface;

class HashConsistencyIntegrationTest extends KernelTestCase
{
    /**
     * @var ContainerInterface
     */
    private $container;
    /**
     * @var FeedDeployerInterface
     */
    private $feedDeployer;
    /**
     * @var Extractor
     */
    private $extractor;
    /**
     * @var Hasher
     */
    private $hasher;
    /**
     * @var Connection
     */
    private $sothebysConn;
    /**
     * @var array
     */
    private $userHashes = [];
    /**
     * @var array
     */
    private $propertyHashes = [];

    protected function setUp()
    {
        self::bootKernel();
        $this->container = self::$kernel->getContainer();

        $this->container->set('ha.import.import_context', $this->getImportContext());
        $sourceRefUserRegistry = $this->getSourceRefRegistry();
        $sourceRefUserRegistry
            ->expects($this->any())
            ->method('getUserId')
            ->willReturn(1)
        ;
        $this->container->set('ha.import.source_ref_user_registry', $sourceRefUserRegistry);

        $this->feedDeployer = $this->container->get('sothebys.feed_deployer');
        $this->extractor = $this->container->get('sothebys.feed_extractor');
        $this->hasher = $this->container->get('ha.import.model_hasher');
        $this->sothebysConn = $this->container->get('doctrine.dbal.sothebys_connection');
        $dir = $this->container->getParameter('ha.import.sir_deploy_dir');
        $this->container->get('filesystem')->mkdir($dir);
    }

    protected function tearDown()
    {
        $this->truncateSothebysTables();
        parent::tearDown();
    }

    public function testHashConsistency()
    {
        $this->feedDeployer->deploy();
        $users = $this->extractor->getUsers(null, null);
        /** @var NormalisedUser $user */
        foreach ($users as $user) {
            $this->userHashes[$user->sourceRef] = $this->hasher->hash($user);
        }
        unset($users);
        $properties = $this->extractor->getPropertiesIteratively();
        /** @var NormalisedProperty $property */
        foreach ($properties as $property) {
            $this->propertyHashes[$property->getSourceRef()] = $this->hashProperty($property);
        }
        unset($properties);

        // Now import the same data again to check hash stability
        for ($i = 0; $i < 3; ++$i) {
            $this->feedDeployer->deploy();
            $users = $this->extractor->getUsers(null, null);
            /** @var NormalisedUser $user */
            foreach ($users as $user) {
                $this->assertEquals($this->userHashes[$user->sourceRef], $this->hasher->hash($user));
            }
            unset($users);
            $properties = $this->extractor->getPropertiesIteratively();
            /** @var NormalisedProperty $property */
            foreach ($properties as $property) {
                $this->assertEquals($this->propertyHashes[$property->getSourceRef()], $this->hashProperty($property));
            }
            unset($properties);
        }
    }

    private function getImportContext()
    {
        return new ImportContext(
            new ImportJob(new Import()),
            null,
            $this->getImportObserverFactory()
        );
    }

    private function getSourceRefRegistry()
    {
        return $this
            ->getMockBuilder(SourceRefUserRegistry::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function truncateSothebysTables()
    {
        $tables = [
            'sir_residential_listing_url', 'sir_residential_listing_remark_i18n', 'sir_residential_listing_remark',
            'sir_residential_listing_prop_features', 'sir_residential_listing_media_original',
            'sir_residential_listing_agent_details', 'sir_residential_listing',
            'sir_agent_web_address', 'sir_agent_profile_i18n', 'sir_agent_profile', 'sir_agent_phone',
            'sir_agent_media_resized', 'sir_agent_media_original', 'sir_agent_email', 'sir_agent',
            'sir_office_web_address', 'sir_office_profile_i18n', 'sir_office_profile', 'sir_office_phone', 'sir_office',
            'sir_code_address_type', 'sir_code_email_type', 'sir_code_listing_status', 'sir_code_office_designation',
            'sir_code_office_status', 'sir_code_phone_type', 'sir_code_property_subtype', 'sir_code_property_type',
            'sir_code_remark_type',
        ];

        foreach ($tables as $table) {
            $this->sothebysConn->exec(sprintf('TRUNCATE %s', $table));
        }
    }

    private function hashProperty(NormalisedProperty $property)
    {
        $arr = clone $property;
        $arr->setIndex(null);

        return sha1(serialize($arr));
    }

    private function getImportObserverFactory()
    {
        return function () {
            return $this->getImportObserver();
        };
    }

    private function getImportObserver()
    {
        return $this
            ->getMockBuilder(ImportObserverInterface::class)
            ->getMock()
        ;
    }
}
