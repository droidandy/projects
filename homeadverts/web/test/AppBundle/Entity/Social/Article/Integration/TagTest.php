<?php

namespace Test\AppBundle\Entity\Social\Article\Integration;

use Cocur\Slugify\Slugify;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Test\AppBundle\AbstractTestCase;
use Test\Utils\Traits\TagTrait;
use Test\Utils\Traits\UserTrait;

class TagTest extends AbstractTestCase
{
    use UserTrait;
    use TagTrait;

    public function testPersistTag()
    {
        $name = $this->faker->text;

        // Add
        $user = $this->newUserPersistent();
        $tag = $this->newTagPersistent([
            'user' => $user,
            'name' => $name,
        ]);

        // Verify
        $this->assertEquals($tag->getDisplayName(), $name);
        $this->assertEquals($tag->getName(), (Slugify::create())->slugify($name));
        $this->assertEquals($tag->user, $user);

        // Clean
        $this->removeEntity($user);
        $this->removeEntity($tag);
    }

    public function testPersistDuplicatedTagThrowsError()
    {
        $this->expectException(UniqueConstraintViolationException::class);

        $name = $this->faker->text;

        // Add
        $user = $this->newUserPersistent();
        $tagA = $this->newTagPersistent([
            'user' => $user,
            'name' => $name,
        ]);
        $tagB = $this->newTagPersistent([
            'user' => $user,
            'name' => $name,
        ]);

        // Clean
        $this->removeEntity($user);
        $this->removeEntity($tagA);
    }
}
