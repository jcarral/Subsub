<?php

namespace PicBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction()
    {
        $em = $this->getDoctrine()->getEntitymanager();
        $repo = $em->getRepository("PicBundle:User");
        $users = $repo->findAll();
        foreach ($users as $user) {
          echo $user->getName() . " <br/>";
           $posts = $user->getUserRatings();
          // echo "<pre>";
          // print_r($posts);
          // echo "</pre>";
         foreach ($posts as $post) {
        //     echo $post->getTitle() . " " . $post->getDescription() . "<br/>";
            echo $post->getPoints() . "<br/>";
            //echo $post->getPoints() . "<br/>";
        }
          //var_dump($posts);

          echo "<hr />";
        }
        die();
        return $this->render('PicBundle:Default:index.html.twig');
    }
}
