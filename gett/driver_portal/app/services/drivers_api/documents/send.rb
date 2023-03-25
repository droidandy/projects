module DriversApi
  module Documents
    class Send < ApplicationService
      schema do
        required(:document).filled
      end

      def execute!
        compose(
          DriversApi::Documents::Create.new(current_user, document: document),
          :document_id,
          as: :gett_document_id
        )
        return unless @gett_document_id

        document.update gett_id: @gett_document_id

        success! if compose(DriversApi::Documents::Upload.new(current_user, document: document))
      end
    end
  end
end
