<?php

namespace Test\Utils\Traits;

trait DateTrait
{
    private $date = null;

    private function getDate($date = null)
    {
        if (!$this->date) {
            return $this->date = new \DateTime($date);
        }

        return $this->date;
    }
}
