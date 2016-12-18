<?php

namespace ApiBundle\Controller;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Controller\FOSRestController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;


use PicBundle\Entity\User;
use PicBundle\Entity\Tag;
use PicBundle\Entity\Post;


class PostController extends FOSRestController
{

  /**
  * @Rest\Get("/post/{id}")
  */
  public function pictureAction(Request $request, $id)
  {
      $em = $this->getDoctrine()->getManager();
      $post_repo = $em->getRepository('PicBundle:Post');
      $user_repo = $em->getRepository('PicBundle:User');

      $token = $request->query->get('token');
      $post = $post_repo->find($id);

      if(count($post) == 0) return new JsonResponse(array('message' => 'Error, no se encontró el post'));
      $current_user = ($token != null)?$user_repo->findOneBy(array('avatar' => $token)):null;
      if($post_repo->shouldIAddPost($current_user, $post)) {
        $data = array(
          'message' => 'POST#'.$id,
          'post' => $post_repo->filterPost($post)
        );

        $view = $this->view($data, Response::HTTP_OK);
        return $view;
      }else return new JsonResponse(array('message' => 'Error, no tienes acceso al post'));
  }

  /**
  * @Rest\Get("/tag/{name}")
  */
    public function tagAction(Request $request, $name)
    {
      $em = $this->getDoctrine()->getManager();
      $post_repo = $em->getRepository('PicBundle:Post');
      $user_repo = $em->getRepository('PicBundle:User');
      $tag_repo = $em->getRepository('PicBundle:Tag');

      $token = $request->query->get('token');
      $current_user = ($token != null)?$user_repo->findOneBy(array('avatar' => $token)):null;

      $posts = $post_repo->findPostsByTag($name, $current_user);
      $data = array(
        'message' => 'TAG#'.$name,
        'post' => $post_repo->filterPostList($posts)
      );

      $view = $this->view($data, Response::HTTP_OK);
      return $view;
    }

    /**
    * @Rest\Delete("/post/{id}")
    */
    public function deleteAction(Request $request, $id)
    {
      $em = $this->getDoctrine()->getManager();
      $post_repo = $em->getRepository('PicBundle:Post');
      $user_repo = $em->getRepository('PicBundle:User');

      $token = $request->request->get('token');
      $post = $post_repo->find($id);

      if(count($post) == 0) return new JsonResponse(array('message' => 'Error, no se encontró el post'));
      $current_user = ($token != null)?$user_repo->findOneBy(array('avatar' => $token)):null;
      if($current_user == null) return new JsonResponse(array('message' => 'Error, no tienes permisos para borrar el post'));
      $em->remove($post);
      $em->flush();
      return new JsonResponse(array('message' => 'OK#0, Se ha borrado el post correctamente'));
    }


}
