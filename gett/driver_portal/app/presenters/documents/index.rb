module Documents
  class Index < ApplicationPresenter
    attr_reader :documents

    def initialize(documents)
      @documents = documents
    end

    def as_json
      {
        documents: documents.map { |document| presenter_for(document).as_json }
      }
    end
  end
end
