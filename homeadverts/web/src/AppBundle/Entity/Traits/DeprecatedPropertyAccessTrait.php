<?php

namespace AppBundle\Entity\Traits;

/**
 * A tool for refactoring old entities/objects that have direct property
 * access (instead of getters/setters).
 *
 * Use this trait in your object and change properties from public to
 * protected. Old code that uses direct property access will still work but
 * will throw a deprecated error.
 */
trait DeprecatedPropertyAccessTrait
{
    public function __get($name)
    {
        $msg = sprintf('Directly retrieved property %s from %s that should now be accessed using a getter.', $name, get_class($this));
        trigger_error($msg, E_USER_DEPRECATED);

        if (property_exists($this, $name)) {
            return $this->{$name};
        }

        return;
    }

    public function __set($name, $value)
    {
        $msg = sprintf('Directly set property %s on %s that should now be accessed using a setter.', $name, get_class($this));
        trigger_error($msg, E_USER_DEPRECATED);

        $this->{$name} = $value;
    }

    public function __isset($name)
    {
        $msg = sprintf('Directly retrieved property %s from %s that should now be accessed using a getter.', $name, get_class($this));
        trigger_error($msg, E_USER_DEPRECATED);

        return isset($this->{$name});
    }
}
