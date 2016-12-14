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
    //Esto deberia almacenarlo en otro sitio como el parameters.yml pero para las pruebas me vale aquí. Mala práctica, lo sé.
    private $salt = 'ContraseñaSuperSecretaEImposibleDeDescifrarPorUnHacker';
    private $method = 'aes-256-gcm';

    public function __construct()
    {
        $this->session = new Session();
    }

    public function loginAction(Request $request)
    {
        $authenticationUtils = $this->get('security.authentication_utils');
        $error = $authenticationUtils->getLastAuthenticationError();
        $lastUsername = $authenticationUtils->getLastUsername();

        $user = new User();
        $form = $this->createForm(UserType::class, $user);

        $form->handleRequest($request);
        if ($form->isSubmitted()) {
            if ($form->isValid()) {
                $em = $this->getDoctrine()->getEntityManager();
                $user_repo = $em->getRepository('PicBundle:User');
                $user = $user_repo->findOneBy(array('mail' => $form->get('mail')->getData()));

                if (count($user) == 0) {
                    $user = new User();
                    $user->setName($form->get('name')->getData());
                    $user->setStatus('public');
                    $user->setMail($form->get('mail')->getData());

                    $factory = $this->get('security.encoder_factory');
                    $encoder = $factory->getEncoder($user);
                    $password = $encoder->encodePassword($form->get('pass')->getData(), $user->getSalt());

                    $user->setPass($password);
                    $user->setRole('ROLE_USER');
                    $user->setStatus('deactivated');
                    $user->setAvatar(null);

                    $em = $this->getDoctrine()->getEntityManager();
                    $em->persist($user);
                    $flush = $em->flush();
                    $this->sendMail($user->getName(), $user->getMail());
                    if ($flush == null) {
                        $status = 'El usuario se ha creado correctamente, revisa tu bandeja de entrada';
                          $this->session->getFlashBag()->add('status-success', $status);
                    } else {
                        $status = 'No te has registrado correctamente';
                          $this->session->getFlashBag()->add('status-error', $status);
                    }
                } else {
                    $status = 'El usuario ya existe, prueba con otro correo';
                    $this->session->getFlashBag()->add('status-error', $status);
                }
            } else {
                $status = 'No te has registrado correctamente';
                $this->session->getFlashBag()->add('status-error', $status);
            }


        }

        return $this->render('PicBundle:User:login.html.twig', array(
        'error' => $error,
        'last_username' => $lastUsername,
        'form' => $form->createView(),
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
        $app_user = $this->getUser();
        $user = $user_repo->find(array('id' => $id));
        if ($user->getStatus() == 'private' && ($app_user == null || $app_user->getRole() != 'ROLE_ADMIN')) {
            return $this->redirect('/');
        }

        return $this->renderUserProfile($user);
    }

    public function nameAction(Request $request)
    {
        $name = htmlspecialchars($request->request->get('name'));
        $user = $this->getUser();
        if ($name == null) {
            return new JsonResponse(array('message' => 'ERROR#0'));
        }
        if (strlen(trim($name, ' ')) < 3) {
            return new JsonResponse(array('message' => 'ERROR#1'.$name));
        }
        if ($user == null) {
            return new JsonResponse(array('message' => 'ERROR#2'));
        }
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
        if ($status == null || ($status != 'public' && $status != 'private')) {
            return new JsonResponse(array('message' => 'ERROR#0'));
        }
        if ($user == null) {
            return new JsonResponse(array('message' => 'ERROR#1'));
        }
        $em = $this->getDoctrine()->getManager();
        $user->setStatus($status);
        $em->persist($user);
        $em->flush();

        return new JsonResponse(array('message' => 'OK#0'));
    }

    public function activateAction(Request $request, $token)
    {
        $em = $this->getDoctrine()->getManager();
        $mail = $this->decrypt($token, $this->salt);
        $user_repo = $em->getRepository('PicBundle:User');
        $user = $user_repo->findOneBy(array('mail' => $mail));
        if($user == null || count($user) == 0) return $this->redirect('/error_mailing');
        $user->setStatus('public');
        $em->persist($user);
        $em->flush();
        return $this->redirect('/');
    }

    private function renderUserProfile($user)
    {
        if ($user == null) {
            return $this->redirect($this->generateUrl('login'));
        }
        $em = $this->getDoctrine()->getManager();
        $follower_repo = $em->getRepository('PicBundle:Follower');
        $post_repo = $em->getRepository('PicBundle:Post');

        $posts = $post_repo->findPostsByAuthor($user->getId(), $this->getUser());
        $favs = $user->getUserFavs();
        $followers = $user->getUserFollowers();
        $following = $user->getUserStalker();
        $follower = $this->getuser();
        if ($follower == null) {
            $imFollowing = false;
        }

        $follow_search = $follower_repo->findOneBy(array('follower' => $follower, 'user' => $user));
        if (count($follow_search) == 0) {
            $imFollowing = false;
        } else {
            $imFollowing = true;
        }

        return $this->render('PicBundle:User:profile.html.twig', array(
        'user' => $user,
        'posts' => array_slice($posts, 0, 20),
        'favs' => $favs,
        'followers' => $followers,
        'following' => $following,
        'imFollowing' => $imFollowing,
      ));
    }

    private function sendMail($name, $mail)
    {
        $token = $this->encrypt($mail, $this->salt);
        $url = 'http://'.$_SERVER['SERVER_NAME'].":8888/user/activate/$token";
        $message = \Swift_Message::newInstance()
        ->setSubject('Confirmación de cuenta en SUBSUB')
        ->setFrom('subsubsw17@gmail.com')
        ->setTo($mail)
        ->setBody(
            $this->renderView(
                'PicBundle:Default:email.html.twig',
                array('name' => $name,
                      'url' => $url, )
            )
        );
        $this->get('mailer')->send($message);

        return 'OK';
    }

/**
 * Returns an encrypted & utf8-encoded.
 */
private function encrypt($string, $key)
{
    $iv = mcrypt_create_iv(
    mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC),
    MCRYPT_DEV_URANDOM
);

    $encrypted = base64_encode(
    $iv.
    mcrypt_encrypt(
        MCRYPT_RIJNDAEL_128,
        hash('sha256', $key, true),
        $string,
        MCRYPT_MODE_CBC,
        $iv
    )
);

    return $encrypted;
}

/**
 * Returns decrypted original string.
 */
private function decrypt($encrypted, $key)
{
    $data = base64_decode($encrypted);
    $iv = substr($data, 0, mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC));

    $decrypted = rtrim(
  mcrypt_decrypt(
      MCRYPT_RIJNDAEL_128,
      hash('sha256', $key, true),
      substr($data, mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC)),
      MCRYPT_MODE_CBC,
      $iv
  ),
  "\0"
);

    return $decrypted;
}
}
