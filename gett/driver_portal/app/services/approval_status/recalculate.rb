module ApprovalStatus
  class Recalculate < ApplicationService
    APPROVED = 'approved'.freeze
    PENDING = 'pending'.freeze
    REJECTED = 'rejected'.freeze
    DOCUMENTS_MISSING = 'documents_missing'.freeze

    private def new_status
      @new_status ||= begin
        if required_documents_missing?
          DOCUMENTS_MISSING
        elsif all_documents_approved?
          APPROVED
        elsif rejected_document_exists?
          REJECTED
        else
          PENDING
        end
      end
    end

    private def all_documents_approved?
      documents_statuses == [APPROVED]
    end

    private def rejected_document_exists?
      documents_statuses.include?(REJECTED)
    end

    private def required_documents_missing?
      required_kinds.count > required_documents.count
    end

    private def documents_statuses
      @documents_statuses ||= required_documents.pluck(:approval_status).uniq
    end

    private def required_documents
      raise NotImplementedError
    end

    private def required_kinds
      raise NotImplementedError
    end
  end
end
