<?php

namespace PicBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;

/**
 * User.
 */
class User
{
    private $id;
    private $name;
    private $mail;
    private $pass;
    private $avatar;
    private $role;
    private $status;
    protected $userPost;
    protected $userComment;
    protected $userRatings;
    protected $userFavs;
    protected $userStalker;
    protected $userFollowers;

    public function __constructor()
    {
        $this->userPost = new ArrayCollection();
        $this->userComment = new ArrayCollection();
        $this->userRatings = new ArrayCollection();
        $this->userFavs = new ArrayCollection();
        $this->userStalker = new ArrayCollection();
        $this->userFollowers = new ArrayCollection();
    }

    public function getUserStalker()
    {
        return $this->userStalker;
    }
    public function getUserFollowers()
    {
        return $this->userFollowers;
    }
    public function getUserRatings()
    {
        return $this->userRatings;
    }

    public function getUserFavs()
    {
        return $this->userFavs;
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

    public function setMail($mail)
    {
        $this->mail = $mail;

        return $this;
    }

    public function getMail()
    {
        return $this->mail;
    }

    public function setPass($pass)
    {
        $this->pass = $pass;

        return $this;
    }

    public function getPass()
    {
        return $this->pass;
    }

    public function setAvatar($avatar)
    {
        $this->avatar = $avatar;

        return $this;
    }

    public function getAvatar()
    {
        return $this->avatar;
    }

    public function setRole($role)
    {
        $this->role = $role;

        return $this;
    }

    public function getRole()
    {
        return $this->role;
    }

    public function setStatus($status)
    {
        $this->status = $status;

        return $this;
    }

    public function getStatus()
    {
        return $this->status;
    }

    public function addPost(Post $post)
    {
        $this->userPost[] = $post;

        return $this;
    }

    public function addComment(Comment $comment)
    {
        $this->userComment[] = $comment;

        return $this;
    }

    public function getUserComment()
    {
        return $this->userComment;
    }

    public function getUserPost()
    {
        return $this->userPost;
    }
}
