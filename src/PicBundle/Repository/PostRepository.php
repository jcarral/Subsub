<?php
namespace PicBundle\Repository;
use PicBundle\Entity\Tag;
use PicBundle\Entity\PostTag;
use PicBundle\Entity\Post;

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
      return 'OK#0';
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
}

 ?>
