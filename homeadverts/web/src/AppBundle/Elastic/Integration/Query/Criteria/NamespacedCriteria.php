<?php

namespace AppBundle\Elastic\Integration\Query\Criteria;

class NamespacedCriteria implements CriteriaInterface
{
    /**
     * @var array
     */
    private $criteria = [];

    /**
     * @param array $criteria
     */
    public function __construct(array $criteria = [])
    {
        $this->criteria = $criteria;
    }

    /**
     * @param array|null $data
     *
     * @return array
     */
    public function resolve($data)
    {
        $errors = [];
        if (empty($data)) {
            $data = [];
        }
        $resolvedData = $this->doResolve($this->criteria, $data, $errors);

        if (!empty($errors)) {
            throw new ValidationException($errors, json_encode($errors));
        }

        return $resolvedData;
    }

    /**
     * @param array $criteriaMap
     * @param array $data
     * @param array $errors
     *
     * @return mixed
     */
    private function doResolve(array $criteriaMap, array $data, array &$errors)
    {
        $resolvedData = [];
        foreach ($criteriaMap as $namespace => $criteria) {
            $namespaceErrors = [];
            if (0 === strpos(key($criteria), '__ns__')) {
                $resolvedData[str_replace('__ns__', '', $namespace)] = $this->doResolve(
                    $criteria,
                    $data,
                    $namespaceErrors
                );
            } else {
                $resolvedData[str_replace('__ns__', '', $namespace)] = $this->resolveNamespace(
                    $data,
                    $criteria,
                    $namespaceErrors
                );
            }
            if (!empty($namespaceErrors)) {
                $errors[str_replace('__ns__', '', $namespace)] = $namespaceErrors;
            }
        }

        return $resolvedData;
    }

    /**
     * @param array $data
     * @param array $criteria
     * @param $errors
     *
     * @return array
     */
    private function resolveNamespace(array $data, array $criteria, &$errors)
    {
        $resolvedData = $errors = [];
        foreach ($criteria as $key => $type) {
            if (0 === strpos($key, '__')) {
                continue;
            }
            if (!array_key_exists($key, $data)) {
                if (array_key_exists('__default', $type)) {
                    $resolvedData[$key] = $type['__default'];
                    continue;
                } elseif (!empty($criteria[$key]['__required'])) {
                    $errors[$key] = 'Value is required';
                    continue;
                } else {
                    $resolvedData[$key] = null;
                    continue;
                }
            }

            if (!empty($criteria[$key]['__composite'])) {
                $value = $this->resolveNamespace($data[$key], $criteria[$key], $errors[$key]);
                if (empty($errors[$key])) {
                    unset($errors[$key]);
                }
            } else {
                $value = $data[$key];
            }

            if (isset($criteria[$key]['__normalize'])) {
                $value = $criteria[$key]['__normalize']($value);
            }

            if (isset($criteria[$key]['__validate'])) {
                if (!$criteria[$key]['__validate']($value, $criteria[$key])) {
                    $errors[$key] = 'Validation error';
                }
            }

            $resolvedData[$key] = $value;
        }

        return $resolvedData;
    }
}
