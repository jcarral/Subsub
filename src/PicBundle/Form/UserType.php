<?php

namespace PicBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;

use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class UserType extends AbstractType
{
    /**
     * @param FormBuilderInterface $builder
     * @param array $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name', TextType::class, array("label"=>"Nombre de usuario", "required"=>"required", "attr"=>array(
              "class" => "form-input",
              "placeholder" => "Introduce el nombre de usuario"
            )))
            ->add('mail', EmailType::class, array("label"=>"Correo electrónico", "required"=>"required", "attr"=>array(
              "class" => "form-input",
              "placeholder" => "Introduce el correo"
            )))
            ->add('pass', PasswordType::class, array("label"=>"Contraseña", "required"=>"required", "attr"=>array(
              "class" => "form-input",
              "placeholder" => "Introduce la contraseña"
            )))
            ->add('Confirmar registro', SubmitType::class)
        ;
    }

    /**
     * @param OptionsResolver $resolver
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'PicBundle\Entity\User'
        ));
    }
}
