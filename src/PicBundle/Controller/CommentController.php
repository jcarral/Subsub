<?php

namespace PicBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Session\Session;
use PicBundle\Entity\Comment;
use PicBundle\Entity\Post;


class CommentController extends Controller
{

  public function addAction(Request $request)
  {
      $em = $this->getDoctrine()->getManager();
      $user = $this->getUser();
      $post_repo = $em->getRepository('PicBundle:Post');

      //Comment fields
      $date = new \DateTime("now");
      $title = htmlspecialchars($request->request->get('title'));
      $content = htmlspecialchars($request->request->get('content'));
      $postId = $request->request->get('postId');

      if($this->validComment($title, $content, $postId) && $user != null){
        $post = $post_repo->find(array('id' => $postId));
        if(count($post) == 0) return new JsonResponse(array('message' => 'ERROR#1'));

        $comment = new Comment();
        $comment->setTitle($title);
        $comment->setContent($content);
        $comment->setUser($user);
        $comment->setPost($post);
        $comment->setInserteddate($date);

        $em->persist($comment);
        $flush = $em->flush();

        if($flush == null) return new JsonResponse(array('message'=>'OK#0', 'date' => $date, 'author' => array('name' => $user->getName(), 'id' => $user->getid())));
        else return new JsonResponse(array('message' => 'ERROR#2'));
      }else{
        return new JsonResponse(array('message' => 'ERROR#0'));
      }

      return $this->render('index.html.twig');
  }

  public function countAction(Request $request, $id)
  {
      return $this->render('index.html.twig');
  }

  private function validComment($title, $content, $postId){
    return is_numeric($postId) && strlen(trim($title, ' ')) > 0 && strlen($title) < 120 && strlen(trim($content, ' ')) > 0 && strlen($content) < 250;
  }
}
