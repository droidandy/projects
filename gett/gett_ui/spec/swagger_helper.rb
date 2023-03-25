require 'rails_helper'
require 'swagger_docs'

RSpec.shared_context 'jwt_authorization' do
  let(:company)       { create(:company) }
  let(:user)          { create(:member, company: company) }
  let(:Authorization) { JsonWebToken.encode(id: user.id) }
end

RSpec.configure do |config|
  # Specify a root folder where Swagger JSON files are generated
  # NOTE: If you're using the rswag-api to serve API descriptions, you'll need
  # to ensure that it's configured to server Swagger from the same folder
  config.swagger_root = Rails.root.to_s + '/swagger'

  # Define one or more Swagger documents and provide global metadata for each one
  # When you run the 'rswag:specs:to_swagger' rake task, the complete Swagger will
  # be generated at the provided relative path under swagger_root
  # By default, the operations defined in spec files are added to the first
  # document below. You can override this behavior by adding a swagger_doc tag to the
  # the root example_group in your specs, e.g. describe '...', swagger_doc: 'v2/swagger.json'
  config.swagger_docs = SwaggerDocs.load

  config.after(:each) do
    ApplicationService::Context.set_context!(user: :system)
  end

  config.include_context('jwt_authorization', swagger_doc: 'mobile/v1/swagger.json')
end
