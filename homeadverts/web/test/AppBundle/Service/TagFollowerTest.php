<?php

namespace Test\AppBundle\Entity\Integration;

use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Test\AppBundle\AbstractTestCase;
use Test\Utils\Traits\TagTrait;
use Test\Utils\Traits\UserTrait;
use AppBundle\Service\TagFollower;

class TagFollowerTest extends AbstractTestCase
{
    use UserTrait;
    use TagTrait;

    /**
     * @var TagFollower
     */
    private $tagFollower;

    protected function setUp()
    {
        parent::setUp();

        $this->tagFollower = $this->getContainer()->get('ha_tag.follower');
    }

    protected function tearDown()
    {
        unset($this->tagFollower);

        parent::tearDown();
    }

    /**
     * A user has n followed tag, +m got added. Now the user has n+m followed categories;.
     */
    public function testNFollowedTagsMAdded()
    {
        $em = $this->em;

        // Add
        $user = $this->newUserPersistent();
        $tagA = $this->newTagPersistent([
            'user' => $user,
        ]);
        $tagB = $this->newTagPersistent([
            'user' => $user,
        ]);
        $tagC = $this->newTagPersistent([
            'user' => $user,
        ]);

        // Run: follow tag A
        $this->tagFollower->followTag($user, $tagA);
        $em->flush();

        // Verify
        $em->refresh($user);
        $this->assertEquals(1, $user->getTagsFollowedCount());
        $this->assertTrue($user->isTagFollowed($tagA));

        // Run: follow tag B,C
        $this->tagFollower->followTag($user, $tagB);
        $this->tagFollower->followTag($user, $tagC);
        $em->flush();

        // Verify
        $em->refresh($user);
        $this->assertEquals(3, $user->getTagsFollowedCount());
        $this->assertTrue($user->isTagFollowed($tagA));
        $this->assertTrue($user->isTagFollowed($tagB));
        $this->assertTrue($user->isTagFollowed($tagC));

        // Remove
        $this->em->remove($tagA);
        $this->em->remove($tagB);
        $this->em->remove($tagC);
        $this->em->remove($user);
        $this->em->flush();
    }

    /**
     * Second addition of the already followed tag doesn't change amount of followed categories;.
     */
    public function testDuplicatedFollowingThrowsUniqueConstraintViolationException()
    {
        $this->expectException(UniqueConstraintViolationException::class);

        $em = $this->em;

        // Add
        $user = $this->newUserPersistent();
        $tagA = $this->newTagPersistent([
            'user' => $user,
        ]);

        // Run: follow tag A
        $this->tagFollower->followTag($user, $tagA);
        $em->flush();

        // Verify
        $em->refresh($user);
        $this->assertEquals(1, $user->getTagsFollowedCount());
        $this->assertTrue($user->isTagFollowed($tagA));

        // Run: follow tag A throws the error
        $this->tagFollower->followTag($user, $tagA);
        $em->flush();

        // Remove
        $this->em->remove($tagA);
        $this->em->remove($user);
        $this->em->flush();
    }

    /**
     * A user has n followed tag, -m got removed. Now the user has n-m followed categories;.
     */
    public function testNFollowedTagsMRemoved()
    {
        $em = $this->em;

        // Add
        $user = $this->newUserPersistent();
        $tagA = $this->newTagPersistent([
            'user' => $user,
        ]);
        $tagB = $this->newTagPersistent([
            'user' => $user,
        ]);
        $tagC = $this->newTagPersistent([
            'user' => $user,
        ]);

        // Run: follow tag A, B, C
        $this->tagFollower->followTag($user, $tagA);
        $followedTagB = $this->tagFollower->followTag($user, $tagB);
        $this->tagFollower->followTag($user, $tagC);
        $em->flush();

        // Verify
        $em->refresh($user);
        $this->assertEquals(3, $user->getTagsFollowedCount());
        $this->assertTrue($user->isTagFollowed($tagA));
        $this->assertTrue($user->isTagFollowed($tagB));
        $this->assertTrue($user->isTagFollowed($tagC));

        // Run: remove follower tag
        $this->em->remove($followedTagB);
        $em->flush();

        // Verify
        $em->refresh($user);
        $this->assertEquals(2, $user->getTagsFollowedCount());
        $this->assertTrue($user->isTagFollowed($tagA));
        $this->assertFalse($user->isTagFollowed($tagB));
        $this->assertTrue($user->isTagFollowed($tagC));

        // Remove
        $this->em->remove($tagA);
        $this->em->remove($tagB);
        $this->em->remove($tagC);
        $this->em->remove($user);
        $this->em->flush();
    }

    /**
     * Removal of the tag not being followed doesn't change amount of followed categories;.
     */
    public function testRemovedTagDoesNotChangeFollowedAmount()
    {
        $em = $this->em;

        // Add
        $user = $this->newUserPersistent();
        $tagA = $this->newTagPersistent([
            'user' => $user,
        ]);
        $tagB = $this->newTagPersistent([
            'user' => $user,
        ]);
        $tagC = $this->newTagPersistent([
            'user' => $user,
        ]);

        // Run: follow tag A
        $this->tagFollower->followTag($user, $tagA);
        $this->tagFollower->followTag($user, $tagB);
        $em->flush();

        // Verify
        $em->refresh($user);
        $this->assertEquals(2, $user->getTagsFollowedCount());
        $this->assertTrue($user->isTagFollowed($tagA));
        $this->assertTrue($user->isTagFollowed($tagB));
        $this->assertFalse($user->isTagFollowed($tagC));

        // Run: remove tag C
        $this->em->remove($tagC);
        $em->flush();

        // Verify
        $em->refresh($user);
        $this->assertEquals(2, $user->getTagsFollowedCount());
        $this->assertTrue($user->isTagFollowed($tagA));
        $this->assertTrue($user->isTagFollowed($tagB));

        // Remove
        $this->em->remove($tagA);
        $this->em->remove($tagB);
        $this->em->remove($user);
        $this->em->flush();
    }
}
