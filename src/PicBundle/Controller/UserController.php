<?php

namespace PicBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\JsonResponse;

use PicBundle\Entity\User;
use PicBundle\Form\UserType;

class UserController extends Controller
{
    private $session;

    public function __construct()
    {
        $this->session = new Session();
    }

    public function loginAction(Request $request)
    {
      $authenticationUtils = $this->get("security.authentication_utils");
      $error = $authenticationUtils->getLastAuthenticationError();
      $lastUsername = $authenticationUtils->getLastUsername();

      $user = new User();
      $form = $this->createForm(UserType::class,$user);

      $form->handleRequest($request);
      if($form->isSubmitted()){
        if($form->isValid()){
          $em=$this->getDoctrine()->getEntityManager();
          $user_repo=$em->getRepository("PicBundle:User");
          $user = $user_repo->findOneBy(array("email"=>$form->get("email")->getData()));

          if(count($user)==0){
            $user = new User();
            $user->setName($form->get("name")->getData());
            $user->setStatus('public');
            $user->setMail($form->get("mail")->getData());

            $factory = $this->get("security.encoder_factory");
            $encoder = $factory->getEncoder($user);
            $password = $encoder->encodePassword($form->get("pass")->getData(), $user->getSalt());

            $user->setPassword($password);
            $user->setRole("ROLE_USER");
            $user->setStatus('deactivated');
            $user->setImagen(null);

            $em = $this->getDoctrine()->getEntityManager();
            $em->persist($user);
            $flush = $em->flush();
            if($flush==null){
              $status = "El usuario se ha creado correctamente";
            }else{
              $status = "No te has registrado correctamente";
            }
          }else{
            $status = "El usuario ya existe!!!";
          }
        }else{
          $status = "No te has registrado correctamente";
        }

        $this->session->getFlashBag()->add("status",$status);
      }
      return $this->render("PicBundle:User:login.html.twig", array(
        "error" => $error,
        "last_username" => $lastUsername,
        "form" => $form->createView()
      ));
    }



    public function meAction(Request $request)
    {
        $user = $this->getUser();
        return $this->renderUserProfile($user);
    }

    public function detailAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();
        $user_repo = $em->getRepository('PicBundle:User');
        $user = $user_repo->find(array('id'=>$id));
        return $this->renderUserProfile($user);
    }

    public function nameAction(Request $request)
    {
        $name = htmlspecialchars($request->request->get('name'));
        $user = $this->getUser();
        if($name == null) return new JsonResponse(array('message' => 'ERROR#0'));
        if(strlen(trim($name, ' ')) < 3) return new JsonResponse(array('message' => 'ERROR#1'.$name));
        if($user == null) return new JsonResponse(array('message' => 'ERROR#2'));
        $em = $this->getDoctrine()->getManager();
        $user->setName($name);
        $em->persist($user);
        $em->flush();
        return new JsonResponse(array('message' => 'OK#0'));
    }

    public function visibilityAction(Request $request)
    {
      $status = htmlspecialchars($request->request->get('status'));
      $user = $this->getUser();
      if($status == null || ($status != 'public' && $status != 'private')) return new JsonResponse(array('message' => 'ERROR#0'));
      if($user == null) return new JsonResponse(array('message' => 'ERROR#1'));
      $em = $this->getDoctrine()->getManager();
      $user->setStatus($status);
      $em->persist($user);
      $em->flush();
      return new JsonResponse(array('message' => 'OK#0'));
    }


    private function renderUserProfile($user){
      if($user == null) return $this->redirect($this->generateUrl('login'));
      $em = $this->getDoctrine()->getManager();
      $follower_repo = $em->getRepository('PicBundle:Follower');

      $posts = $user->getUserPost();
      $favs = $user->getUserFavs();
      $followers = $user->getUserFollowers();
      $following = $user->getUserStalker();
      $follower = $this->getuser();
      if($follower == null) $imFollowing = false;

      $follow_search = $follower_repo->findOneBy(array('follower'=>$follower, 'user'=>$user));
      if(count($follow_search) == 0) $imFollowing = false;
      else $imFollowing = true;

      return $this->render('PicBundle:User:profile.html.twig', array(
        'user' => $user,
        'posts' => $posts->slice(0, 20),
        'favs' => $favs,
        'followers' => $followers,
        'following' => $following,
        'imFollowing' => $imFollowing
      ));
    }
}
