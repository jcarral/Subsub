<?php

namespace PicBundle\Entity;

/**
 * PostTag.
 */
class PostTag
{
    private $id;
    private $post;
    private $tag;

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

    public function setTag(\PicBundle\Entity\Tag $tag = null)
    {
        $this->tag = $tag;

        return $this;
    }

    public function getTag()
    {
        return $this->tag;
    }
}
