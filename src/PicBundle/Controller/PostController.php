<?php

namespace PicBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Session\Session;
use PicBundle\Entity\Post;
use PicBundle\Entity\Follower;
use PicBundle\Entity\User;

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
      $em = $this->getDoctrine()->getManager();
      $post_repo = $em->getRepository('PicBundle:Post');
      $follower_repo = $em->getRepository('PicBundle:Follower');
      $user_repo = $em->getRepository('PicBundle:User');

        $post = $post_repo->findOneBy(array('id' => $postId));
        $listTags = $post_repo->getAllPostTags($post);
        $comments = $post->getPostComments();
        $follower = $this->getUser();
        if(!$this->accessToPost($post, $follower)) return $this->redirect('/');
        $following = false;
        if($follower != null){
          $user = $user_repo->findOneBy(array('id'=>$post->getAuthor()->getId()));
          $follow_search = $follower_repo->findOneBy(array('follower'=>$follower, 'user'=>$user));
          if(count($follow_search) == 0) $following = false;
          else $following = true;
        }
        return $this->render('PicBundle:Post:detail.html.twig',
          array(
            'post' => $post,
            'tags' => $listTags,
            'comments' => $comments,
            'following' => $following
          )
        );
    }

    public function addTagAction(Request $request){
      $em = $this->getDoctrine()->getManager();
      $post_repo = $em->getRepository('PicBundle:Post');
      $postId = $request->request->get('id');
      $postTag = htmlspecialchars($request->request->get('tag'));
      if($this->validTag($postTag, $postId)) $mssg = $post_repo->addTagToPost($postId, $postTag);
      else $mssg = "ERROR#1";

      if(is_array($mssg)) return new JsonResponse(array('message' => $mssg[0], 'id' => $mssg[1]));
      else return new JsonResponse(array('message' => $mssg));

    }

    public function visibilityAction(Request $request, $id)
    {
      if(!$this->isOwnerOrAdmin($id)) return new JsonResponse(array('message' => 'ERROR#0'));
      $em = $this->getDoctrine()->getManager();
      $post_repo = $em->getRepository('PicBundle:Post');
      $post = $post_repo->findOneBy(array('id' => $id));
      $visibility = $request->request->get('status');
      if(!$this->validVisibility($visibility)) return new JsonResponse(array('message' => 'ERROR#1'));
      $post->setStatus($visibility);
      $em->persist($post);
      $em->flush();
      return new JsonResponse(array('message' => 'OK#0', 'visibility' => $visibility));
    }


    private function accessToPost($post, $user){

      $status = $post->getStatus();
      if($user == null) return false;
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

    private function validVisibility($val){
      return $val == 'protected' || $val == 'private' || $val == 'public' || $val = 'followers';
    }

    public function deleteAction(Request $request, $id)
    {
        return $this->render('index.html.twig');
    }

    private function isOwnerOrAdmin($id){
      $user = $this->getUser();
      if($user == null) return false;
      else if($user->getRole() == 'ROLE_ADMIN') return true;
      else return $this->isOwner($user, $id);
    }

    private function isOwner($user, $id){
      $em = $this->getDoctrine()->getManager();
      $post_repo = $em->getRepository('PicBundle:Post');
      $post = $post_repo->findOneBy(array('id'=>$id, 'author'=>$user));
      return count($post) > 0;
    }

    private function validTag($tag, $postId){
      return is_numeric($postId) && strlen(trim($tag, ' ')) > 0;
    }

    private function validAjaxForm($title, $status, $image)
    {
        if (strlen(trim($title, ' ')) == 0 || ($status !== 'private' && $status != 'public') || (!base64_encode(base64_decode($image, true)) == $image)) return false;
        return true;
    }
}
