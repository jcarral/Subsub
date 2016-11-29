<?php

namespace PicBundle\Entity;

/**
 * Rating
 */
class Rating
{

    private $id;
    private $points;
    private $inserteddate;
    private $post;
    private $user;


    public function getId()
    {
        return $this->id;
    }


    public function setPoints($points)
    {
        $this->points = $points;

        return $this;
    }

    public function getPoints()
    {
        return $this->points;
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
