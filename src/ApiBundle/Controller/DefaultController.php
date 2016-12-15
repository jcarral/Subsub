<?php

namespace ApiBundle\Controller;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Controller\FOSRestController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class DefaultController extends FOSRestController
{
  /**
  * @Rest\Get("/")
  */
 public function indexAction(Request $request)
 {
     $data = ['hello' => 'world'];
     $view = $this->view($data, Response::HTTP_OK);
     return $view;
 }

 /*
    [GET] /api/user/{id}
    [GET] /api/pic/{id}
    [GET] /api/tag/{id}
    [GET] /api/tag

    [POST] /api/user/
    [POST] /api/tag/
    [POST] /api/post
    [POST] /api/fav/{postId}

    [DELETE] /api/post
    [DELETE] /api/fav/{postId}

    [PUT] /api/post/{id}
    [PUT] /api/user
  */

  
}
