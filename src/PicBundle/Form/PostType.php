<?php

namespace PicBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\RadioType;


class PostType extends AbstractType
{
    /**
     * @param FormBuilderInterface $builder
     * @param array                $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('title', TextType::class, array('label' => 'Título', 'required' => 'required', 'attr' => array(
              'class' => 'form-input',
              'placeholder' => 'Introduce el título del post',
            )))
            ->add('description', TextareaType::class, array('label' => 'Descripcion', 'required' => 'required',
            'attr' => array(
              'class' => 'form-input',
              'placeholder' => 'Introduce una descripcion',
            ), ))
            ->add('image', FileType::class, array('label' => 'Post', 'required' => 'required', 'attr' => array(
              'class' => 'hidden',
              'id' => 'uploadImage',
              'required' => false,
              'placeholder' => 'Introduce el nombre de usuario',
            )))
            ->add('status', ChoiceType::class, array('label' => 'Estado: ',
            'choices' => array('Publico' => 'public', 'Privado' => 'private'),
            'data' => 'public',
            'attr' => array(
              'class' => 'form-radio--status',
            ), 'expanded' => true))
            ->add('Subir', SubmitType::class, array('attr' => array('class' => 'form-submit')))
        ;
    }

    /**
     * @param OptionsResolver $resolver
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'PicBundle\Entity\Post',
        ));
    }
}
