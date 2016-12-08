<?php

namespace PicBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;
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

    private function renderUserProfile($user){
      if($user == null) return $this->redirect($this->generateUrl('login'));
      $posts = $user->getUserPost();
      $favs = $user->getUserFavs();
      $followers = $user->getUserFollowers();
      $following = $user->getUserStalker();

      return $this->render('PicBundle:User:profile.html.twig', array(
        'user' => $user,
        'posts' => $posts,
        'favs' => $favs,
        'followers' => $followers,
        'following' => $following
      ));
    }
}
