<?php
namespace PicBundle\Repository;
use PicBundle\Entity\Tag;
use PicBundle\Entity\PostTag;
use PicBundle\Entity\Post;
use Doctrine\Common\Collections\ArrayCollection;


class PostRepository extends \Doctrine\ORM\EntityRepository{

  public function addTagToPost($postId, $tag, $post = null){
    $em=$this->getEntityManager();
    $tag_repo = $em->getRepository('PicBundle:Tag');
    $posttag_repo = $em->getRepository('PicBundle:PostTag');

    if($post == null){
      $post = $this->findOneBy(array("id"=>$postId));
    }

    $isset_tag = $tag_repo->findOneBy(array("name"=>$tag));
    if(count($isset_tag) == 0){
      $tag_obj = new Tag();
      $tag_obj->setName($tag);
      $em->persist($tag_obj);
      $em->flush();
    }else{
      $tag_obj = $isset_tag;
    }

    $posttag = $posttag_repo->findOneBy(array("post"=>$post->getId(), "tag"=>$tag_obj));
    if(count($posttag) == 0){
      $postTag = new PostTag();
      $postTag->setPost($post);
      $postTag->setTag($tag_obj);
      $em->persist($postTag);
      $flush = $em->flush();
      return array('OK#0', $postTag->getId());
    }else{
      return 'ERROR#0';
    }

  }

  public function getAllPostTags($post)
  {
    $em=$this->getEntityManager();
    $tag_repo = $em->getRepository('PicBundle:Tag');
    $posttag_repo = $em->getRepository('PicBundle:PostTag');

    $post_tags = $posttag_repo->findBy(array('post' => $post));
    $list = array();
    foreach ($post_tags as $pt) {
      array_push($list, array('name' => $pt->getTag()->getName(), 'id' => $pt->getId()));
    }
    return $list;
  }

  public function getPostRatingMedia($post){
    $em=$this->getEntityManager();
    $rating_repo = $em->getRepository('PicBundle:Rating');

    $ratings = $rating_repo->findBy(array('post'=>$post));
    $count = 0;
    $rating_total = 0;
    foreach ($ratings as $rating) {
      $rating_total += $rating->getPoints();
      $count++;
    }
    if($count > 0)
      return ($rating_total/$count);
    else
      return 0;
  }

  public function getAllPostComments($post){

  }

  public function findPostsByAuthor($author, $user){
    $em = $this->getEntityManager();
    $user_repo = $em->getRepository('PicBundle:User');
    $post_repo = $em->getRepository('PicBundle:Post');

    $author = (is_numeric($author))?$user_repo->findOneBy(array('id'=>$author)):$user_repo->findOneBy(array('name' => $author));
    if(count($author) == 0 || $author->getStatus() == 'private') return array();
    $query = $this->getAuthorPostsQuery($author, $user, $em);
    return  $query->getResult();
  }

  public function findPostsByTag($tag, $user){
    $em = $this->getEntityManager();
    $tag_repo = $em->getRepository('PicBundle:Tag');
    $tagPost_repo = $em->getRepository('PicBundle:PostTag');

    $tag = $tag_repo->findOneBy(array('name' => $tag));
    if(count($tag) == 0) return array();
    $posts = $tagPost_repo->findBy(array('tag' => $tag));

    $list_posts = array();

    foreach ($posts as $post) {
      $post = $post->getPost();
      if($this->shouldIAddPost($user, $post)) array_push($list_posts, $post);
    }
    return $list_posts;

  }

  public function findPostByQuery($q, $user){
    $list_posts_tag = $this->findPostsByTag($q, $user);
    $list_posts_user = $this->findPostsByAuthor($q, $user);
    $list_posts_title = $this->getPostsByTitle($q, $user);
    $collection_post = new ArrayCollection(
    array_merge($list_posts_user, $list_posts_tag, $list_posts_title)
    );
    return $collection_post;
  }


/*

 */

 private function getPostsByTitle($q, $user){
   $em = $this->getEntityManager();
   $post_repo = $em->getRepository('PicBundle:Post');
   $posts = $post_repo->findBy(array('title'=>$q));
   $list_posts = array();
   foreach ($posts as $post) {
     $post = $post->getPost();
     echo $post->getId() . "OK </br>";
     if($this->shouldIAddPost($user, $post)) array_push($list_posts, $post);
   }
   return $list_posts;
 }

 private function shouldIAddPost($user, $post){
   $em = $this->getEntityManager();
   $status = $post->getStatus();
   $author = $post->getAuthor();
   $follower_repo = $em->getRepository('PicBundle:Follower');

   if($status == 'public') return true;
   else if($user == null || $author->getStatus() == 'private') return false;
   else if($status == 'follower' && count($follower_repo->findOneBy(array('user'=>$author, 'follower'=>$user)))==0) return false;
   else if($status == 'private' && ($author != $user && $user->getRole() != 'ROLE_ADMIN')) return false;
   else return true;
 }


  private function getAuthorPostsQuery($author, $user, $em){
    if($user == null){
      $query = $this->getPublicPostsQuery($author, $em);
    }else if($user->getRole() == 'ROLE_ADMIN' || $user == $author)  $query = $this->getAllPostsQuery($author, $em);
    else{
        $follower_repo = $em->getRepository('PicBundle:Follower');

        if(count($follower_repo->findOneBy(array('user'=>$author, 'follower'=>$user)))==0) $query = $this->getProtectedPostsQuery($author, $em);
        else $query = $this->getFollowersPostsQuery($author, $em);

    }
    return $query;

  }

  private function getAllPostsQuery($author, $em){
    $query = $em->createQuery(
      'SELECT p
      FROM PicBundle:Post p
      WHERE p.author=:author'
      )->setParameter('author', $author);
      return $query;
  }

  private function getProtectedPostsQuery($author, $em){
    $query = $em->createQuery(
      'SELECT p
      FROM PicBundle:Post p
      WHERE (p.status=:status1
      OR p.status=:status2)
      AND p.author=:author'
      )->setParameter('status1', 'public')->setParameter('status2', 'protected')->setParameter('author', $author);
      return $query;
  }

  private function getFollowersPostsQuery($author, $em){
    $query = $em->createQuery(
      'SELECT p
      FROM PicBundle:Post p
      WHERE (p.status=:status1
      OR p.status=:status2
      OR p.status=:status3)
      AND p.author=:author'
      )->setParameter('status1', 'public')->setParameter('status2', 'protected')->setParameter('status3', 'followers')->setParameter('author', $author);
      return $query;
  }

  private function getPublicPostsQuery($author, $em){
    $query = $em->createQuery(
      'SELECT p
      FROM PicBundle:Post p
      WHERE p.status=:status1
      AND p.author=:author'
      )->setParameter('status1', 'public')->setParameter('author', $author);
      return $query;
  }

  public function accessToPost($post, $user){

    $status = $post->getStatus();
    if($user == null && $status != 'public') return false;
    else if($status == "public" || $user->getRole() == "ROLE_ADMIN" || ($user != null && $status == "protected") || $post->getAuthor() == $user) return true;
    else if($status == 'private') return false;
    else if($status == 'followers'){ //Solo seguidores
      $followers = $post->getAuthor()->getUserFollowers();
      foreach ($followers as $follower) {
        if($follower == $user) return true;
      }
      return false;
    }
  }
}

 ?>
