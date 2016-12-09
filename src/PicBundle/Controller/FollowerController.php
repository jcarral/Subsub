<?php

namespace PicBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Normalizer\GetSetMethodNormalizer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
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
        $user = $user_repo->find(array('id' => $id));

        if ($follower == null) {
            return new JsonResponse(array('message' => 'ERROR#0'));
        }
        if ($user == null) {
            return new JsonResponse(array('message' => 'ERROR#1'));
        }
        $follower_search = $follower_repo->findOneBy(array('user' => $user, 'follower' => $follower));

        if (count($follower_search) == 0) {
            $new_follower = new Follower();
            $new_follower->setFollower($follower);
            $new_follower->setUser($user);
            $em->persist($new_follower);
            $em->flush();

            return new JsonResponse(array('message' => 'OK#0'));
        } else {
            $em->remove($follower_search);
            $em->flush();

            return new JsonResponse(array('message' => 'OK#1'));
        }
    }

    public function listAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();
        $user_repo = $em->getRepository('PicBundle:User');
        $user = $user_repo->findOneBy(array('id' => $id));
        $profileOwner = $user->getId() == $this->getUser()->getId();
        if ($user == null) {
            return new JsonResponse(array('message' => 'ERROR#0'));
        }
        $followers = $user->getUserFollowers();
        $following = $user->getUserStalker();

        $list_followers = array();
        foreach ($followers as $follower) {
          array_push($list_followers, json_encode($follower->getFollower()));
        }
        $list_following = array();
        foreach ($following as $follow) {
          array_push($list_following, json_encode($follow->getUser()));
        }
        return new JsonResponse(array('message' => 'OK#0', 'followers' => $list_followers, 'following' => $list_following, 'owner' => $profileOwner));
    }
}
