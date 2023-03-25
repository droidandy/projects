module Statements
  module PDF
    class Share < ApplicationService
      schema do
        optional(:statements_ids).filled(:array?)
        required(:emails).filled(:array?)
        required(:body).filled(:str?)
      end

      def execute!
        compose(Statements::CreateZIP.new(current_user, statements_ids: statements_ids), :zip_data)
        return unless @zip_data

        StatementsMailer.share(current_user, @zip_data, emails, body).deliver_now
        success!
      end
    end
  end
end
