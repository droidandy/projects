class Documents::DriverList < ApplicationService
  attr_reader :documents

  def execute!
    @documents ||= (existing_documents + missing_documents).sort_by { |document| document.kind.title }
    success!
  end

  private def existing_documents
    @existing_documents ||= search.resolved_scope.preload(:kind)
  end

  private def search
    ::Documents::Search.new({ hidden: false, driver_bound: true }, current_user: current_user)
  end

  private def missing_documents
    Documents::Kind.where(owner: :driver).where.not(id: filled_kinds_ids).map do |kind|
      Document.new(kind: kind, approval_status: :missing)
    end
  end

  private def filled_kinds_ids
    existing_documents.map(&:kind_id)
  end
end
