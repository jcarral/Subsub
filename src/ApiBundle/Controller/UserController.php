<?php

namespace ApiBundle\Controller;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Controller\FOSRestController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

use PicBundle\Entity\User;


class UserController extends FOSRestController
{
  /**
  * @Rest\Get("/user/")
  */
 public function indexAction(Request $request)
 {
     $em = $this->getDoctrine()->getManager();
     $user_repo = $em->getRepository('PicBundle:User');
     $data = $user_repo->findAll();
     $view = $this->view($data, Response::HTTP_OK);
     return $view;
 }

 /**
 * @Rest\Get("/user/auth/")
 */
 public function authenticateAction(Request $request)
 {
  $em = $this->getDoctrine()->getManager();

  $token = bin2hex(random_bytes(64));
  $username = $request->headers->get('php-auth-user');
  $pass = $request->headers->get('php-auth-pw');
  $user_repo = $em->getRepository('PicBundle:User');

  $user = $user_repo->findOneBy(array('mail' => $username));

  if(count($user) == 0){
    $data = array(
      "error" => '404',
      "message" => "User not found"
    );
    $view = $this->view($data, Response::HTTP_OK);
    return $view;
  }else{
    $user->setAvatar($token);
    $em->persist($user);
    $em->flush();
    $data = array(
      "token" => $token
    );
    $view = $this->view($data, Response::HTTP_OK);
    return $view;
  }
 }

 /**
  * @Rest\Get("/user/{id}")
  */
  public function profileAction(Request $request, $id)
  {
      $token = $request->query->get('token');
      $em = $this->getDoctrine()->getManager();
      $user_repo = $em->getRepository('PicBundle:User');
      $post_repo = $em->getRepository('PicBundle:Post');

      $author = $user_repo->find($id);
      $current_user = $user_repo->findOneBy(array('avatar' => $token));
      $posts_list = $post_repo->findPostsByAuthor($id, $current_user);

      $data = array(
        'name' => $author->getName(),
        'posts' => $post_repo->filterPostList($posts_list)
      );

      $view = $this->view($data, Response::HTTP_OK);
      return $view;
  }

  /**
   * @Rest\Put("/user)
   */
  public function editAction(Request $request)
  {
    $em = $this->getDoctrine()->getManager();
    $user_repo = $em->getRepository('PicBundle:User');

    $token = $request->request->get('token');
    $status = $request->request->get('status');

    $current_user = $user_repo->findOneBy(array("avatar" => $token));
    if($token == null || count($current_user) == 0) return new JsonResponse(array('message' => 'ERROR#0', 'type' => 'No tienes permisos'));
    else if($status == null || ($status != 'private' && $status != 'public'))return new JsonResponse(array('message' => 'ERROR#1', 'type' => ' Parametros incorrectos'));

    $current_user->setStatus($status);
    $em->persist($current_user);
    $em->flush();
    return new JsonResponse(array('message' => 'OK'));
  }

}
