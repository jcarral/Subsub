<?php

namespace PicBundle\Entity;

/**
 * Comment.
 */
class Comment
{
    private $id;
    private $title;
    private $content;
    private $inserteddate;
    private $post;
    private $user;

    public function getId()
    {
        return $this->id;
    }

    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    public function getTitle()
    {
        return $this->title;
    }

    public function setContent($content)
    {
        $this->content = $content;

        return $this;
    }

    public function getContent()
    {
        return $this->content;
    }

    public function setInserteddate($inserteddate)
    {
        $this->inserteddate = $inserteddate;

        return $this;
    }

    public function getInserteddate()
    {
        return $this->inserteddate;
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
