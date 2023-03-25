<?php

namespace AppBundle\Service;

use SunCat\MobileDetectBundle\DeviceDetector\MobileDetector;

class Paginator
{
    /**
     * @var MobileDetector
     */
    private $deviceDetector;

    /**
     * @var array
     */
    private $pagination;

    /**
     * @param MobileDetector $deviceDetector
     * @param array          $pagination
     */
    public function __construct(MobileDetector $deviceDetector, array $pagination)
    {
        $this->deviceDetector = $deviceDetector;
        $this->pagination = $pagination;
    }

    /**
     * @param string $type
     *
     * @return int
     */
    public function getPageLimit($type = 'default')
    {
        $isPhone = $this->deviceDetector->isMobile() && !$this->deviceDetector->isTablet();
        $isTablet = $this->deviceDetector->isMobile() && $this->deviceDetector->isTablet();

        if ($isPhone) {
            return $this->pagination[$type]['mobile']['per_page'];
        } elseif ($isTablet) {
            return $this->pagination[$type]['tablet']['per_page'];
        } else {
            return $this->pagination[$type]['full']['per_page'];
        }
    }

    /**
     * @param string $type
     *
     * @return int
     */
    public function getRowLimit($type = 'default')
    {
        $isPhone = $this->deviceDetector->isMobile() && !$this->deviceDetector->isTablet();
        $isTablet = $this->deviceDetector->isMobile() && $this->deviceDetector->isTablet();

        if ($isPhone) {
            return $this->pagination[$type]['mobile']['per_row'];
        } elseif ($isTablet) {
            return $this->pagination[$type]['tablet']['per_row'];
        } else {
            return $this->pagination[$type]['full']['per_row'];
        }
    }

    /**
     * @param int $page
     *
     * @return int
     */
    public function getOffset($page)
    {
        return ($page - 1) * $this->getPageLimit();
    }

    /**
     * @param int $page
     *
     * @return int
     */
    public function getJumboOffset($page)
    {
        return ($page - 1) * 3;
    }

    /**
     * @param int $page
     *
     * @return int
     */
    public function getSingleItemOffset($page)
    {
        return $page - 1;
    }

    /**
     * @param int $count
     *
     * @return int
     */
    public function getPageTotal($count)
    {
        return ceil($count / $this->getPageLimit());
    }
}
