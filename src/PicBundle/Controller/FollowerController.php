<?php

namespace PicBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\JsonResponse;

use PicBundle\Entity\User;
use PicBundle\Entity\Follower;



class FollowerController extends Controller
{
    private $session;

    public function __construct()
    {
        $this->session = new Session();
    }

    public function followAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();
        $user_repo = $em->getRepository('PicBundle:User');
        $follower_repo = $em->getRepository('PicBundle:Follower');

        $follower = $this->getUser();
        $user = $user_repo->find(array('id'=>$id));
        if($follower == null) return new JsonResponse(array('message' => 'ERROR#0'));
        if($user == null) return new JsonResponse(array('message' => 'ERROR#1'));
        $follower_search = $follower_repo->findOneBy(array('user' => $user, 'follower' => $follower));

        if(count($follower_search) == 0){
          $new_follower = new Follower();
          $new_follower->setFollower($follower);
          $new_follower->setUser($user);
          $em->persist($new_follower);
          $em->flush();
          return new JsonResponse(array('message' => 'OK#0'));
        }else{
          $em->remove($follower_search);
          $em->flush();
          return new JsonResponse(array('message' => 'OK#1'));

        }


    }
}
