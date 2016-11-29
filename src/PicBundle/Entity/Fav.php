<?php

namespace PicBundle\Entity;

/**
 * Fav.
 */
class Fav
{
    private $id;
    private $post;
    private $user;

    public function getId()
    {
        return $this->id;
    }

    public function setPost(\PicBundle\Entity\Post $post = null)
    {
        $this->post = $post;

        return $this;
    }

    public function getPost()
    {
        return $this->post;
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
