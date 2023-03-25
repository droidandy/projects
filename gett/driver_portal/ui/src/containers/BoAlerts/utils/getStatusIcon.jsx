import React from 'react'
import { IconApproved, IconMissing, IconPending, IconRejected } from 'components/Icons'

const getStatusIcon = (status) => {
  switch (status) {
    case 'approved':
      return <IconApproved />
    case 'documents_missing':
      return <IconMissing />
    case 'pending':
      return <IconPending />
    case 'rejected':
      return <IconRejected />
    default:
      return <IconMissing />
  }
}

export default getStatusIcon
