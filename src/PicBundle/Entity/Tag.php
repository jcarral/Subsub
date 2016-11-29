<?php

namespace PicBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;

/**
 * Tag.
 */
class Tag
{
    private $id;
    private $name;
    protected $tagPosts;

    public function __constructor()
    {
        $this->tagPosts = new ArrayCollection();
    }

    public function getTagPosts()
    {
        return $this->tagPosts;
    }

    public function getId()
    {
        return $this->id;
    }

    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    public function getName()
    {
        return $this->name;
    }
}
