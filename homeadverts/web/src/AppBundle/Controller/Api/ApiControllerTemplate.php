<?php

namespace AppBundle\Controller\Api;

use JMS\Serializer\SerializationContext;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use AppBundle\Exception\InvalidDataException;

abstract class ApiControllerTemplate extends Controller
{
    /**
     * @var string
     */
    protected $model;

    /**
     * @param Request $request
     *
     * @return mixed
     */
    final public function postAction(Request $request)
    {
        $this->postPreProcessor();
        $entity = $this->buildInstanceFromPayload($request->getContent());
        $this->userAssignmentProcessor($entity);

        $instance = $this->persistEntity($entity);

        // Pass response
        $route = str_replace(
            '_post',
            '_get',
            $this->get('request_stack')->getCurrentRequest()->get('_route')
        );
        $url = $this->generateUrl(
            $route,
            ['id' => $instance->getId()],
            true // absolute
        );

        $response = new Response();
        $response->setStatusCode(201);
        $response->headers->set('Location', $url);

        return $response;
    }

    /**
     * @param int $id
     *
     * @throws NotFoundHttpException
     *
     * @return mixed
     */
    final public function getAction($id)
    {
        $entity = $this
            ->get('em')
            ->getRepository($this->model)
            ->find($id);

        if (null === $entity) {
            throw new NotFoundHttpException();
        }

        return new Response($this->serializeEntity($entity, ['details']));
    }

    /**
     * @return Response
     */
    public function getCollectionAction()
    {
        $entities = $this
            ->get('em')
            ->getRepository($this->model)
            ->findAll();

        return new Response($this->serializeEntity(
            $entities,
            ['collection']
        ));
    }

    /**
     * @param mixed $entity
     * @param array $groups
     *
     * @return mixed|string
     */
    protected function serializeEntity($entity, array $groups = [])
    {
        $context = SerializationContext::create()
            ->enableMaxDepthChecks();

        if (count($groups)) {
            $context->setGroups($groups);
        }

        return $this
            ->container
            ->get('jms_serializer')
            ->serialize(
                $entity,
                'json',
                $context
            );
    }

    /**
     * @param string $payload
     *
     * @return mixed
     */
    protected function buildInstanceFromPayload($payload)
    {
        return $this
            ->get('jms_serializer')
            ->deserialize(
                $payload,
                $this->model,
                'json'
            );
    }

    /**
     * @param mixed $entity
     *
     * @return mixed
     */
    protected function validateEntity($entity)
    {
        $violations = $this->get('validator')->validate($entity);

        if ($violations->count()) {
            throw new InvalidDataException($violations);
        }
    }

    protected function postPreProcessor()
    {
    }

    /**
     * @param mixed $entity
     */
    protected function userAssignmentProcessor(&$entity)
    {
        if (property_exists($this->model, 'user')) {
            $entity->user = $this->getUser();
        }
    }

    /**
     * @param mixed $entity
     *
     * @return mixed
     */
    private function persistEntity($entity)
    {
        // Force constructor to be called
        // Alt see: https://stackoverflow.com/questions/31948118/jms-serializer-why-are-new-objects-not-being-instantiated-through-constructor
        if (method_exists($entity, '__construct')) {
            $entity->__construct();
        }

        $this->validateEntity($entity);

        $em = $this->get('em');
        $em->persist($entity);
        $em->flush();

        return $entity;
    }
}
