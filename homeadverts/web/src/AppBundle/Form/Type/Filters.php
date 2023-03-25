<?php

namespace AppBundle\Form\Type;

use AppBundle\Service\CurrencyManager;
use AppBundle\Entity\Property\PropertyTypes;
use AppBundle\Entity\Property\Property;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use AppBundle\Form\DataTransformer\MarketTransformer;
use AppBundle\Service\Geo\LocaleFactory;

class Filters extends AbstractType
{
    protected $currencyManager;
    protected $localeFactory;
    protected $priceRanges = [];

    public static function defaultValues()
    {
        return ['', 0, '0', 'rand:rand', 'all'];
    }

    public function __construct(CurrencyManager $currencyManager, LocaleFactory $localeFactory)
    {
        $this->currencyManager = $currencyManager;
        $this->localeFactory = $localeFactory;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add(
                $builder->create('market', 'choice', [
                    'choices' => [
                        'all' => 'search.filters.market.all',
                        'to-rent' => 'search.filters.market.rent',
                        'for-sale' => 'search.filters.market.sale',
                    ],
                ])
                ->addModelTransformer(new MarketTransformer())
            )
            ->add('status', 'choice', [
                'choices' => [
                    '' => 'search.filters.status.any',
                    Property::STATUS_ACTIVE => 'search.filters.status.active',
                    Property::STATUS_INACTIVE => 'search.filters.status.inactive',
                    Property::STATUS_INVALID => 'search.filters.status.invalid',
                    Property::STATUS_INCOMPLETE => 'search.filters.status.incomplete',
                ],
            ])
            ->add('bedrooms', 'choice', [
                'choices' => [
                    0 => 'search.filter.bedroom.any',
                    1 => 'search.filter.bedroom.one',
                    2 => 'search.filter.bedroom.two',
                    3 => 'search.filter.bedroom.three',
                    4 => 'search.filter.bedroom.four',
                    5 => 'search.filter.bedroom.five',
                    6 => 'search.filter.bedroom.six',
                ],
            ])
            ->add('bathrooms', 'choice', [
                'choices' => [
                    0 => 'search.filter.bathroom.any',
                    1 => 'search.filter.bathroom.one',
                    2 => 'search.filter.bathroom.two',
                    3 => 'search.filter.bathroom.three',
                    4 => 'search.filter.bathroom.four',
                    5 => 'search.filter.bathroom.five',
                    6 => 'search.filter.bathroom.six',
                ],
            ])
            //for the translations to work, these need to be here,
            //not in the property type class
            ->add('type', 'choice', [
                'required' => false,
                'choices' => [
                    '' => 'search.filter.type.any',
                    PropertyTypes::DETACHED => 'search.filter.type.detatched',
                    PropertyTypes::SEMI_DETACHED => 'search.filter.type.semi',
                    PropertyTypes::APARTMENT => 'search.filter.type.flat',
                    PropertyTypes::FARM => 'search.filter.type.farm',
                    PropertyTypes::LAND => 'search.filter.type.land',
                    PropertyTypes::ISLAND => 'search.filter.type.island',
                    PropertyTypes::OTHER => 'search.filter.type.other',
                ],
            ])
            ->add('distance', 'choice', [
                'required' => false,
                'choices' => $this->getDistanceChoices(),
            ])
            ->add('dateAdded', 'choice', [
                'required' => false,
                'choices' => [
                    '' => 'search.filter.added.any',
                    '24hrs' => 'search.filter.added.one',
                    '3days' => 'search.filter.added.three',
                    '7days' => 'search.filter.added.seven',
                    '14days' => 'search.filter.added.foreteen',
                    '30days' => 'search.filter.added.thirty',
                ],
            ])
            ->add('sort', 'choice', [
                'choices' => [
                    'rand:rand' => 'search.filters.sort.random',
                    '_uid:desc' => 'search.filters.sort.id.desc',
                    'price:asc' => 'search.filters.sort.price.asc',
                    'price:desc' => 'search.filters.sort.price.desc',
                ],
            ])
            ->add('media', 'choice', [
                'choices' => [
                    'all' => 'search.filter.media.all',
                    'video' => 'search.filter.media.video',
                    '3d' => 'search.filter.media.3d',
                ],
            ])
            ->add(
                $builder
                    ->create('price', 'form')
                    ->add('currency', 'choice', [
                        'choices' => $this->getDisplayCurrencies(),
                        'preferred_choices' => $this->getPreferredCurrencies(),
                    ])
                    ->add('from', 'text', ['required' => false])
                    ->add('to', 'text', ['required' => false])
                    ->add('range', 'choice', [
                        'required' => false,
                        'choices' => $this->calculatePriceRanges(),
                    ])
            )
            ->add('period', 'choice', [
                'choices' => [
                    'day' => 'search.filters.period.day',
                    'week' => 'search.filters.period.week',
                    'month' => 'search.filters.period.month',
                ],
            ])
        ;
    }

    public function getName()
    {
        return 'filters';
    }

    /**
     * set the prices range array with values calculated into the right currency.
     *
     * @param float $min
     * @param float $max
     * @param float $avg
     */
    public function setPriceRange($min, $max, $avg)
    {
        foreach ($this->getDisplayCurrencies() as $currencyId => $_) {
            $currencyId = strtoupper($currencyId);

            $this->priceRanges[$currencyId] = [
                $this->currencyManager->convert('USD', $currencyId, $min),
                $this->currencyManager->convert('USD', $currencyId, $max),
                $this->currencyManager->convert('USD', $currencyId, $avg),
            ];
        }
    }

    /**
     * work out the different prices that are required to be shown in the filters based on the property values.
     *
     * @return array
     */
    protected function calculatePriceRanges()
    {
        $priceOptions = [];
        foreach ($this->priceRanges as $currency => $priceRange) {
            $priceOptions[$currency] = $this->calculatePriceRange($priceRange);
        }

        return $priceOptions;
    }

    /**
     * work out the different prices that are required to be shown in the filters based on the property values.
     *
     * @return array
     */
    protected function calculatePriceRange($priceRange)
    {
        $priceRanges = [
            '' => 'search.filter.price.any',
        ];

        if (!isset($priceRange)) {
            return $priceRanges;
        }

        $minPrice = $this->getInterquartileRange($priceRange[0], $priceRange[2]);
        $maxPrice = $this->getInterquartileRange($priceRange[2], $priceRange[1]);

        $diff = round(abs($minPrice - $maxPrice));
        $targetBucketNumber = 7;
        $maxBucketSize = 10;
        $averageBucketSize = round($diff / $targetBucketNumber);

        if (0 === $diff) {
            return $priceRanges;
        }

        $ranges = [10, 100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000, 5000000, 10000000];

        $groupSize = $this->getClosest($averageBucketSize, $ranges);

        $floor = floor($minPrice / $groupSize);
        if (($minPrice - $groupSize * $floor) > ($groupSize * ($floor + 1) - $minPrice)) {
            $startOffset = $groupSize * $floor;
        } else {
            $startOffset = $groupSize * ($floor + 1);
        }

        // make the bucket sizes
        $priceRanges[':'.$startOffset] = '< '.$this->shortenPrice($startOffset);

        for ($i = 0; $i < $maxBucketSize; ++$i) {
            $from = $startOffset + $i * $groupSize;
            $to = $startOffset + ($i + 1) * $groupSize;

            if ($to > $maxPrice) {
                break;
            }

            $priceRanges[$from.':'.$to] = $this->shortenPrice($from).' - '.$this->shortenPrice($to);
        }
        $priceRanges[($startOffset + $i * $groupSize).':'] = '> '.$this->shortenPrice($startOffset + $i * $groupSize);

        return $priceRanges;
    }

    protected function getDisplayCurrencies()
    {
        if (!$this->currencyManager) {
            return ['' => ''];
        }

        $currencies = [];
        foreach ($this->currencyManager->getDisplayCurrencies() as $id => $rate) {
            $currencies[$id] = $rate['name'];
        }

        asort($currencies);
        $currencies = array_merge(array_flip($this->getPreferredCurrencies()), $currencies);

        return $currencies;
    }

    protected function getPreferredCurrencies()
    {
        return array_unique([
            $this->currencyManager->getDefaultCurrency(),
            'USD',
            'EUR',
            'GBP',
            'RUB',
            'CNY',
        ]);
    }

    protected function getDistanceChoices()
    {
        if (in_array($this->localeFactory->getClientCountry(), ['US', 'GB'])) {
            return [
                '' => 'search.filter.distance.any',
                '0.25miles' => 'search.filter.distance.quarter',
                '1mile' => 'search.filter.distance.one',
                '3miles' => 'search.filter.distance.three',
                '5miles' => 'search.filter.distance.five',
                '10miles' => 'search.filter.distance.ten',
                '15miles' => 'search.filter.distance.fifteen',
                '25miles' => 'search.filter.distance.twentyfive',
            ];
        }

        return [
            '' => 'search.filter.distance.any',
            '0.25km' => '1/4 KM',
            '1km' => '1 KM',
            '3km' => '3 KM',
            '5km' => '5 KM',
            '10km' => '10 KM',
            '15km' => '15 KM',
            '25km' => '25 KM',
        ];
    }

    /**
     * get the closest value to the one provided.
     *
     * @param mixed $search
     * @param array $arr
     *
     * @return mixed
     */
    protected function getClosest($search, $arr)
    {
        $closest = null;
        foreach ($arr as $item) {
            if (null == $closest || abs($search - $closest) > abs($item - $search)) {
                $closest = $item;
            }
        }

        return $closest;
    }

    protected function shortenPrice($price)
    {
        $ranges = [
            1000000 => ['M', 1000000],
            10000 => ['K', 1000],
        ];

        foreach ($ranges as $key => $value) {
            if ($price >= $key) {
                return round($price / $value[1], 2).$value[0];
            }
        }

        return $price;
    }

    public function getInterquartileRange($from, $to, $skew = 0)
    {
        $diff = $to - $from;
        $diff *= (0.5 + $skew);

        return $from + $diff;
    }
}
