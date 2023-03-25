<?php

namespace AppBundle\Command\User;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand as Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Hobnob\XmlStreamReader\Parser;
use AppBundle\Import\Normalizer\User\NormalisedUser;

class MissingAgentKeysCommand extends Command
{
    protected function configure()
    {
        $this
            ->setName('fix:missing-agent-keys')
            ->setDescription('Assigns proeprties to the correct agent')
            ->addArgument('path', InputArgument::REQUIRED, 'The XML file to use')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $container = $this->getContainer();
        $helper = $container->get('ha.importer');
        $em = $container->get('doctrine');
        $db = $container->get('doctrine.dbal.default_connection');
        $propertyRepo = $em->getRepository('AppBundle:Property\Property');
        $userRepo = $em->getRepository('AppBundle:User\User');

        $index = 0;
        $xmlParser = new Parser();
        $xmlParser->registerCallback(
            '/Listings/Listing',
            function ($parser, $property) use ($output, $userRepo, $propertyRepo, $em, $db, $helper) {
                $property->registerXPathNamespace('c', 'http://rets.org/xsd/RETSCommons');

                $participant = @$property->listingparticipants[0]->participant[0];
                $office = @$property->offices[0]->office[0];
                $brokerage = @$property->brokerage[0];

                if ('-null' !== substr((string) @$participant->participantkey, -5)) {
                    return;
                }

                $emails = [
                   (string) @$property->leadroutingemail,
                   (string) $participant->email,
                   (string) $office->officeemail,
                   (string) $brokerage->email,
                ];

                $email = null;

                foreach ($emails as $potentialEmail) {
                    if (false !== strpos($potentialEmail, '@sothebys')) {
                        $email = $potentialEmail;
                        break;
                    }
                }

                if (!$email) {
                    $email = $emails[1]; // fallback to the users personal email
                }

                $participantKey = $email;

                if ((string) $participant->firstname) {
                    $name = (string) @$participant->firstname.' '.(string) @$participant->lastname;
                } else {
                    $name = (string) $office->name;
                }

                $propertyKey = (string) $property->listingkey;
                if (!$propertyEntity = $propertyRepo->findOneBySourceRef($propertyKey)) {
                    var_dump('Cant find property '.$propertyKey);

                    return;
                }

                // find a user with this email
                if (!$user = $userRepo->findOneByEmail($email)) {
                    var_dump('Creating user '.$name.' ('.$participantKey.')');
                    $user = $helper->createUser($this->getNormalisedUser($participantKey, $email, $name, $participant, $office, $brokerage));
                }

                var_dump('Updating property '.$propertyEntity->id.' to user ID '.$user->id);

                $db->executeUpdate('UPDATE property SET user = ? WHERE id = ?', [$user->id, $propertyEntity->id]);
            }
        );

        $handle = fopen($input->getArgument('path'), 'r');
        $xmlParser->parse($handle);
        fclose($handle);
    }

    public function getNormalisedUser($participantKey, $email, $name, $participant, $office, $brokerage)
    {
        $office->registerXPathNamespace('c', 'http://rets.org/xsd/RETSCommons');

        $user = new NormalisedUser();
        $user->sourceRef = $participantKey;
        $user->name = $name;
        $user->companyName = (string) @$office->name;
        $user->companyPhone = (string) @$brokerage->phone;
        $user->phone = (string) @$participant->primarycontactphone;
        $user->email = $email;
        $user->homePageUrl = (string) @$office->website;
        $user->address1 = (string) @$office->xpath('address/c:fullstreetaddress')[0];
        $user->townCity = (string) @$office->xpath('address/c:city')[0];
        $user->country = (string) @$office->xpath('address/c:country')[0];
        $user->postcode = (string) @$office->xpath('address/c:postalcode')[0];
        $user->stateCounty = (string) @$office->xpath('address/c:stateorprovince')[0];

        return $user;
    }
}
