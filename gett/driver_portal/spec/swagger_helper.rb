require 'rails_helper'

def definitions
  pattern = File.join(Rails.root, 'spec', 'swagger', 'models', '*.json')

  models = Dir.glob(pattern).map do |filepath|
    model_name = File.basename(filepath, '.json')
    properties = JSON.parse(File.read(filepath), symbolize_names: true)
    [model_name, { type: :object, properties: properties }]
  end

  models.to_h
end

module SwaggerGroupShortcuts
  def user_authentication_required!(current_user_traits: [], &block)
    let(:current_user) do
      current_user_traits = current_user_traits << :with_accepted_invitation
      create(:user, *current_user_traits, password: password, password_confirmation: password)
    end

    let(:password) { '123456789' }

    let(:authorization) do
      service = Sessions::Create.new(email: current_user.email, password: password)
      service.execute!
      service.session.access_token
    end

    parameter name: :authorization,
      in: :header,
      type: :string,
      description: 'Access token',
      required: true

    response '401', 'authentication error' do
      schema '$ref' => '#/definitions/errors'

      let(:current_user) { create(:user, password: password, password_confirmation: password) }
      let(:password) { '123456789' }
      let(:authorization) { nil }

      self.instance_eval(&block) if block.present?

      run_test!
    end
  end

  def with_admin_user(admin_traits: [])
    let(:admin) do
      create(:user, *admin_traits, password: '123456789', password_confirmation: '123456789')
    end

    let(:'Admin-Authorization') do
      service = Sessions::Create.new(email: admin.email, password: password)
      service.execute!
      service.session.access_token
    end

    parameter name: 'Admin-Authorization',
      in: :header,
      type: :string,
      description: 'Admin access token for log-is-as cases',
      required: false
  end

  def paginatable!
    parameter name: :page, in: :query, type: :integer, required: false
    parameter name: :per_page, in: :query, type: :integer, required: false
    let(:page) { 1 }
    let(:per_page) { 5 }
  end
end

module SwaggerShortcuts
end

RSpec.configure do |config|
  config.swagger_root = Rails.root.to_s + '/swagger'

  config.swagger_docs = {
    'v1/swagger.json' => {
      swagger: '2.0',
      info: {
        title: 'Gett: Driver Portal',
        version: 'v1',
        description: 'This is driver portal service'
      },
      schemes: ['http'],
      basePath: '/api/v1',
      paths: {},
      definitions: definitions
    }
  }

  config.extend SwaggerGroupShortcuts, type: :request
  config.include SwaggerShortcuts, type: :request
end

JWT_TOKEN_EXAMPLE = [
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9",
  "eyJpZCI6OSwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwidXVpZCI6ImI4MDRlNGYzLTYyNjAt" \
  "NGNmZC04NzEwLWQ2ZTFmOTE4NmU3OSIsImNyZWF0ZWRfYXQiOiIyMDE3LTA2LTAyIDEyOjIxOjE3IFVUQyJ9",
  "k4d1zmfVaWqbHqNSZhQ8WdVAFqX1hTG7byaaj12GWfk"
].join('.')
