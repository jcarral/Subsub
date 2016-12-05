<?php

namespace PicBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
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
        $repo = $em->getRepository('PicBundle:Post');
        $post_list = $repo->findAll();

        return $this->render('PicBundle:Post:list_items.html.twig',
        array(
          'posts' => $post_list,
        )
      );
    }

    public function addAction(Request $request)
    {
        $post = new Post();
        $form = $this->createForm(PostType::class, $post);
        $form->handleRequest($request);
        $user = $this->getUser();

        if ($form->isSubmitted() && $user != null) {
          $image = $form['image']->getData();
            if ($form->isValid() && $image != null) {
                $em = $this->getDoctrine()->getManager();
                $post = new Post();
                $date = date('Y-m-d H:i:s');
                $post->setTitle($form->get('title')->getData());
                $post->setDescription($form->get('description')->getData());
                $post->setStatus($form->get('status')->getData());
                $date = new \DateTime("now");
                $post->setInserteddate($date);

                $ext = $image->guessExtension();
                $image_name = time().'.'.$ext;
                $image->move('uploads', $image_name);
                $post->setImage($image_name);
                $post->setAuthor($user);
                $em->persist($post);
                $flush = $em->flush();
                if($flush == null)
                  return $this->redirect($this->generateUrl('post_detail', array('postId' => $post->getId())), 301);
            }
        }

        return $this->render('PicBundle:Post:new_post.html.twig',
          array(
            'form' => $form->createView(),
          )
      );
    }

    public function addAjaxAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $post = new Post();
        $title = htmlspecialchars($request->request->get('title'));
        $desc = htmlspecialchars($request->request->get('description'));
        $status = htmlspecialchars($request->request->get('status'));
        $image = $request->request->get('image');
        $image = str_replace('data:image/png;base64,', '', $image);
        $image = str_replace(' ', '+', $image);
        $user = $this->getUser();

        if ($this->validAjaxForm($title, $status, $image) && $user != null) {
            $post->setTitle($title);
            $post->setDescription($desc);
            $post->setStatus($status);
            $date = new \DateTime("now");
            $post->setInserteddate($date);
            
            $image = base64_decode($image);
            $path = __DIR__.'/../../../web/uploads/';
            $image_name = time().'.png';
            file_put_contents($path.$image_name, $image);
            $post->setImage($image_name);

            $post->setAuthor($user);
            $em->persist($post);
            $flush = $em->flush();
            if ($flush == null) {
                return new JsonResponse(array('id' => $post->getId()));
            } else {
                return new JsonResponse(array('error' => 'No se puede añadir el post'));
            }
        } else {
            return new JsonResponse(array('error' => 'Campos del formulario invalidos'));
        }
    }

    public function detailAction(Request $request, $postId)
    {
        return $this->render('PicBundle:Post:detail.html.twig',
          array(
            'postId' => $postId,
          )
        );
    }

    private function validAjaxForm($title, $status, $image)
    {
        if (strlen(trim($title, ' ')) == 0 || ($status !== 'private' && $status != 'public') || (!base64_encode(base64_decode($image, true)) == $image)) return false;
        return true;
    }
}
