<?php

namespace PicBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;

/**
 * Post.
 */
class Post
{
    private $id;
    private $title;
    private $description;
    private $image;
    private $inserteddate;
    private $updateddate;
    private $status;
    private $location;
    private $type;
    private $author;
    protected $postRatings;
    /**
   * @var \PicBundle\Entity\PostTag
   */
    protected $postTags;
    protected $postComments;
    protected $postFavs;

    public function constructor()
    {
        $this->postRatings = new ArrayCollection();
        $this->postTags = new ArrayCollection();
        $this->postComments = new ArrayCollection();
        $this->postFavs = new ArrayCollection();
    }

    public function getPostFavs()
    {
        return $this->postFavs;
    }

    public function getPostComments()
    {
        return $this->postComments;
    }

    public function getPostRatings()
    {
        return $this->postRatings;
    }

    public function getPostTags()
    {
        return $this->postTags;
    }

    public function addPostTag(\PicBundle\Entity\Tag $tag){
		$this->postTags[] = $tag;

		return $this;
	}

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

    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }

    public function getDescription()
    {
        return $this->description;
    }

    public function setImage($image)
    {
        $this->image = $image;

        return $this;
    }

    public function getImage()
    {
        return $this->image;
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

    public function setUpdateddate($updateddate)
    {
        $this->updateddate = $updateddate;

        return $this;
    }

    public function getUpdateddate()
    {
        return $this->updateddate;
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

    public function setLocation($location)
    {
        $this->location = $location;

        return $this;
    }

    public function getLocation()
    {
        return $this->location;
    }

    public function setType($type)
    {
        $this->type = $type;

        return $this;
    }

    public function getType()
    {
        return $this->type;
    }

    public function setAuthor(\PicBundle\Entity\User $author = null)
    {
        $this->author = $author;

        return $this;
    }

    public function getAuthor()
    {
        return $this->author;
    }

    public function __toString(){
      return 'Post';
    }

}
