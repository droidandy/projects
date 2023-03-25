<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Social\Article\ArticleRepository;
use JMS\DiExtraBundle\Annotation\Inject;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use AppBundle\Service\CurrencyManager;
use AppBundle\Entity\Property\Property;

class PropertyDetailsController extends Controller
{
    /**
     * @Inject
     */
    protected $userRepo;
    /**
     * @Inject
     */
    protected $propertyRepo;
    /**
     * @Inject
     *
     * @var CurrencyManager
     */
    protected $currencyManager;

    /**
     * @param Request $request
     * @param int     $id
     * @param string  $slug
     *
     * @return Response
     */
    public function indexAction(Request $request, $id, $slug)
    {
        /** @var Property $property */
        $property = $this->propertyRepo->findOneById($id);

        // Get currencies
        $currencies = [];
        foreach ($this->currencyManager->getDisplayCurrencies() as $availableCurrency) {
            $currencies[$availableCurrency['id']] = $this
                ->currencyManager
                ->convert(
                    $property->currency,
                    $availableCurrency['id'],
                    $property->price
                );
        }

        /** @var ArticleRepository $repo */
        $repo = $this->get('article_repo');
        $relatedArticles = $repo->getPublishedArticles(
            0,
            3,
            [],
            []
        );

        return $this->render('AppBundle:property:details.html.twig', [
            'relatedProperties' => $this->get('ha.property.property_search_repo')->findRelated($property, 3),
            'property' => $property,
            'address' => $property->address,
            'currencies' => $currencies,
            'display_currency' => $this->currencyManager->getCurrency(),
            'user' => $property->getUser(),
            'id' => $property->id,
            'route' => $request->get('_route'),
            'relatedArticles' => $relatedArticles,
        ]);
    }

    /**
     * @return Response
     */
    public function notFoundAction()
    {
        return $this->render('AppBundle::details_not_found.html.twig', [
            'search' => [],
        ]);
    }
}
