<?php
namespace PicBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\JsonResponse;

use PicBundle\Entity\Post;
use PicBundle\Entity\Rating;

class RatingController extends Controller
{

  public function addAction(Request $request)
  {
    $em = $this->getDoctrine()->getManager();
    $post_repo = $em->getRepository('PicBundle:Post');
    $this_repo = $em->getRepository('PicBundle:Rating');
    $postId = htmlspecialchars($request->request->get('postId'));
    $val = htmlspecialchars($request->request->get('val'));
    $user = $this->getUser();


    if(!$this->validRating($val, $postId)) return new JsonResponse(array('message' => 'ERR#0'));
    $post = $post_repo->find(array('id'=>$postId));
    if(count($post) == 0) return new JsonResponse(array('message' => 'ERR#1'));

    $rating = $this_repo->findOneBy(array('user'=>$user, 'post' => $post));
    if(count($rating) == 0){
      $rating = new Rating();
      $rating->setPost($post);
      $rating->setPoints($val);
      $rating->setUser($user);
      $date = new \DateTime("now");
      $rating->setInserteddate($date);
    }else{
      $rating->setPoints($val);
    }
    $em->persist($rating);
    $flush = $em->flush();
    return new JsonResponse(array('message' => 'OK#0'));
  }

  public function countAction(Request $request, $id)
  {
    $em = $this->getDoctrine()->getManager();
    $repo = $em->getRepository('PicBundle:Post');
    $post = $repo->find(array('id'=>$id));
    $count = $repo->getPostRatingMedia($post);
    return new JsonResponse(array('count' => $count));
  }

  private function validRating($val, $postId){
    return is_numeric($val) && $val > 0 && $val <= 5 && is_numeric($postId);
  }
}


 ?>
