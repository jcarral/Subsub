<?php

namespace PicBundle\Entity;

/**
 * Follower.
 */
class Follower
{
    private $id;
    private $follower;
    private $user;

    public function getId()
    {
        return $this->id;
    }

    public function setFollower(\PicBundle\Entity\User $follower = null)
    {
        $this->follower = $follower;

        return $this;
    }

    public function getFollower()
    {
        return $this->follower;
    }

    public function setUser(\PicBundle\Entity\User $user = null)
    {
        $this->user = $user;

        return $this;
    }

    public function getUser()
    {
        return $this->user;
    }
}
