<?php

namespace AppBundle\Service\Import\Wellcomemat;

interface WellcomematFeedInterface
{
    /**
     * @return array
     */
    public function getVideos();

    public function isEnabled();

    public function enable();

    public function disable();
}
