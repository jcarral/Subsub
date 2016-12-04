<?php
namespace PicBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;

use PicBundle\Entity\Tag;
use PicBundle\Form\TagType;

class TagController extends Controller
{

  private $session;

  public function __construct()
  {
      $this->session = new Session();
  }
    public function indexAction(Request $request)
    {
        return $this->render('index.html.twig');
    }

    public function createAction(Request $req)
    {
        $tag = new Tag();
        $form = $this->createForm(TagType::class, $tag);

        $form->handleRequest($req);
        if($form->isSubmitted()){
          if($form->isValid()){
            $em = $this->getDoctrine()->getManager();
            $tag->setName($form->get("name")->getData());
            $em->persist($tag);
            $flush = $em->flush();
            if($flush==null){
              $status = "Etiqueta creada correctamente";
            }else{
              $status = "No se ha podido añadir la etiqueta";
            }

          }else{
            $status = "La etiqueta no se ha podido crear";
          }
          $this->session->getFlashBag()->add('status', $status);
        }
        return $this->render('PicBundle:Tag:add.html.twig', array(
        'form' => $form->createView(),
      ));
    }
}
