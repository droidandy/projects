module Documents
  class Reject < ApplicationService
    attr_reader :updated_document

    schema do
      required(:document_id).filled(:int?)
      required(:comment).filled(:str?)
      optional(:metadata).maybe(:hash?)
    end

    def execute!
      raise ActiveRecord::RecordNotFound unless document
      authorize! document

      super do
        if metadata.present? # present? returns false for empty hash
          compose(
            Documents::Metadata::Save.new(current_user, document: document, metadata: metadata, allow_blank: true),
            :updated_document
          )
          next unless @updated_document
        end

        compose(Documents::ChangeStatus.new(current_user, document: document, status: 'rejected', comment: comment))
      end
    end

    on_success { @updated_document = document }

    def document
      @document ||= begin
        search = Documents::Search.new({ id: document_id }, current_user: current_user)
        search.one
      end
    end
  end
end
