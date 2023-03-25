import React from 'react'
import auth from 'api/auth'
import styled from 'styled-components'

const LoggedAsUser = ({ fullName }) => {
  return (
    <div>
      You logged in as { fullName }
      <ToBackOffice onClick={ () => auth.removeToken() }>
          Return to Back office
      </ToBackOffice>
    </div>
  )
}

const ToBackOffice = styled.span`
  color: #fff;
  cursor: pointer;
  margin-left: 5px;
  text-decoration: underline;
`

export default LoggedAsUser
