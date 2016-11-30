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
        $authUtils = $this->get('security.authentication_utils');
        $error = $authUtils->getLastAuthenticationError();
        $lastUser = $authUtils->getLastUsername();

        $user = new User();
        $form = $this->createForm(UserType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted()) {
            if ($form->isValid()) {
                $em = $this->getDoctrine()->getManager();
                $user_repo = $em->getRepository('PicBundle:User');
                $user = $user_repo->findOneBy(array('mail' => $form->get('mail')->getData()));
                if (count($user) == 0) {
                    $factory = $this->get('security.encoder_factory');
                    $encoder = $factory->getEncoder($user);
                    $password = $encoder->encodePassword($form->get('pass')->getData(), $user->getSalt());
                    $user->setName($form->get('name')->getData());
                    $user->setMail($form->get('mail')->getData());
                    $user->setPass($password);
                    $user->setRole('ROLE_USER');
                    $user->setStatus('public');

                    $em = $this->getDoctrine()->getManager();
                    $em->persist($user);
                    $flush = $em->flush();
                    if ($flush == null) {
                        $status = 'Te has registrado correctamente';
                    } else {
                        $status = 'No te has podido registrar, comprueba que has introducido bien todos los campos';
                    }
                } else {
                    $status = 'El usuario que intentas meter ya existe';
                }
            } else {
                $status = 'No te has podido registrar, comprueba que has introducido bien todos los campos';
            }
            $this->session->getFlashBag()->add('status', $status);
        }

        return $this->render('PicBundle:User:login.html.twig',
          array(
            'error' => $error,
            'last_username' => $lastUser,
            'form' => $form->createView(),
          )
      );
    }
}
