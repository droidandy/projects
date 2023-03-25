module Documents
  class GroupedIndex < ApplicationPresenter
    attr_reader :documents

    def initialize(documents)
      @documents = documents
    end

    def as_json
      {
        documents: {
          required: grouped_documents.fetch(true, [])
                      .map { |document| presenter_for(document).as_json },
          optional: grouped_documents.fetch(false, [])
                      .map { |document| presenter_for(document).as_json }
        }
      }
    end

    private def grouped_documents
      @grouped_documents ||= documents.group_by { |document| document.kind.mandatory }
    end
  end
end
