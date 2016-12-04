<?php

namespace PicBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;
use PicBundle\Entity\Post;
use PicBundle\Form\PostType;

class PostController extends Controller
{
    private $session;

    public function __construct()
    {
        $this->session = new Session();
    }

    public function listAction(Request $request)
    {
      $em = $this->getDoctrine()->getManager();
      $repo = $em->getRepository("PicBundle:Post");
      $post_list = $repo->findAll();

      return $this->render('PicBundle:Post:list_items.html.twig',
        array(
          'posts' => $post_list
        )
      );
    }


    public function addAction(Request $request)
    {
      $post = new Post();
      $form = $this->createForm(PostType::class, $post);
      $form->handleRequest($request);

      if ($form->isSubmitted()) {
          if ($form->isValid()) {
              $em = $this->getDoctrine()->getManager();
              $post = new Post();
              $date = date('Y-m-d H:i:s');
              $post->setTitle($form->get("title")->getData());
              $post->setDescription($form->get("description")->getData());
              $post->setStatus($form->get("status")->getData());
              //$post->setInserteddate($date);
              $image = $form["image"]->getData();
              $ext = $image->guessExtension();
              $image_name = time().'.'.$ext;
              $image->move('uploads', $image_name);
              $post->setImage($image_name);
              $user = $this->getUser();
              $post->setAuthor($user);
              $em->persist($post);
              $flush = $em->flush();

          }
        }
        return $this->render('PicBundle:Post:new_post.html.twig',
          array(
            'form' => $form->createView(),
          )
      );
    }
}
