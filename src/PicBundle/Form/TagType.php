<?php

namespace PicBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;

class TagType extends AbstractType
{
    /**
     * @param FormBuilderInterface $builder
     * @param array $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name', TextType::class, array("label"=>"Nueva etiqueta", "required"=>"required", "attr"=>array(
              "class" => "form-input",
              "placeholder" => "Añadir nuevo tag"
            )))
            ->add('+', SubmitType::class, array("attr"=>array(
              "class" => "form-submit",
            )))
        ;
    }

    /**
     * @param OptionsResolver $resolver
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'PicBundle\Entity\Tag'
        ));
    }
}
