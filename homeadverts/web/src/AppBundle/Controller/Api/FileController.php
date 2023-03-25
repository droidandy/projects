<?php

namespace AppBundle\Controller\Api;

use AppBundle\Entity\Storage\File;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class FileController extends ApiControllerTemplate
{
    /**
     * @var string
     */
    protected $model = File::class;

    /**
     * @param Request $request
     *
     * @return Response
     */
    public function uploadAction(Request $request)
    {
        $uploadedFile = $request->files->get('file');

        $newFile = $this->buildInstanceFromPayload($request->getContent());

        $file = $this->storeFile($newFile, $uploadedFile);

        return new Response(
            $this->serializeEntity($file),
            201
        );
    }

    /**
     * @param Request $request
     *
     * @return Response
     */
    public function uploadArticleOriginAction(Request $request)
    {
        $uploadedFile = $request->files->get('files')[0];

        $newFile = new File();
        $newFile->origin = 'article';

        $file = $this->storeFile($newFile, $uploadedFile);

        return new Response(
            $this->serializeEntity($file),
            201
        );
    }

    /**
     * @param File         $newFile
     * @param UploadedFile $uploadedFile
     *
     * @return File
     */
    private function storeFile(File $newFile, UploadedFile $uploadedFile)
    {
        $newFile->user = $this->getUser();
        $newFile->setFileInfo($uploadedFile);
        $this->validateEntity($newFile);

        return $this->get('ha.file_manager')->save($newFile);
    }
}
