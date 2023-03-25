<?php

namespace Test\AppBundle\Import_\Adapter\Sothebys\Mock;

class HydratorMockStatement implements \IteratorAggregate, \Doctrine\DBAL\Driver\Statement
{
    private $_resultSet;

    /**
     * Creates a new mock statement that will serve the provided fake result set to clients.
     *
     * @param array $resultSet the faked SQL result set
     */
    public function __construct(array $resultSet)
    {
        $this->_resultSet = $resultSet;
    }

    /**
     * Fetches all rows from the result set.
     *
     * @return array
     */
    public function fetchAll($fetchMode = null, $columnIndex = null, array $ctorArgs = null)
    {
        return $this->_resultSet;
    }

    public function fetchColumn($columnNumber = 0)
    {
        $row = current($this->_resultSet);
        if (!is_array($row)) {
            return false;
        }
        $val = array_shift($row);

        return null !== $val ? $val : false;
    }

    /**
     * Fetches the next row in the result set.
     */
    public function fetch($fetchMode = null)
    {
        $current = current($this->_resultSet);
        next($this->_resultSet);

        return $current;
    }

    /**
     * Closes the cursor, enabling the statement to be executed again.
     *
     * @return bool
     */
    public function closeCursor()
    {
        return true;
    }

    public function setResultSet(array $resultSet)
    {
        reset($resultSet);
        $this->_resultSet = $resultSet;
    }

    public function bindColumn($column, &$param, $type = null)
    {
    }

    public function bindValue($param, $value, $type = null)
    {
    }

    public function bindParam($column, &$variable, $type = null, $length = null, $driverOptions = array())
    {
    }

    public function columnCount()
    {
    }

    public function errorCode()
    {
    }

    public function errorInfo()
    {
    }

    public function execute($params = array())
    {
    }

    public function rowCount()
    {
    }

    public function setFetchMode($fetchMode, $arg2 = null, $arg3 = null)
    {
    }

    public function getIterator()
    {
        return new \IteratorIterator($this);
    }
}
