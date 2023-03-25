require 'swagger_helper'

RSpec.describe 'Onboarding API' do
  path '/onboarding' do
    put 'Update onboarding' do
      tags 'Onboarding'

      consumes 'application/json'

      parameter name: :attributes,
        in: :body,
        description: 'Onboarding attributes',
        schema: {
          type: :object,
          properties: {
            attributes: {
              type: :object,
              required: [:onboarding_step],
              properties: {
                attributes: {
                  onboarding_step: {
                    type: :number,
                    example: 1
                  },
                  email: {
                    type: :string,
                    example: 'm@il.com'
                  },
                  first_name: {
                    type: :string,
                    example: 'John',
                  },
                  last_name: {
                    type: :string,
                    example: 'Doe',
                  },
                  phone: {
                    type: :string,
                    example: '+41 123',
                  },
                  license_number: {
                    type: :string,
                    example: '123',
                  },
                  how_did_you_hear_about: {
                    type: :string,
                    example: 'ads'
                  },
                  min_rides_number: {
                    type: :integer,
                    example: 100,
                    enum: [0, 100, 200, 300, 400, 500]
                  },
                  other_rating: {
                    type: :number,
                    example: 4.52
                  },
                  vehicle_reg_year: {
                    type: :number,
                    example: 2017
                  },
                  sort_code: {
                    type: :string,
                    example: '123'
                  },
                  account_number: {
                    type: :string,
                    example: '123'
                  },
                  city: {
                    type: :string,
                    example: 'London'
                  },
                  postcode: {
                    type: :string,
                    example: 'A1 W1W'
                  },
                  address: {
                    type: :string,
                    example: '1 Downing Str.'
                  },
                  insurance_number: {
                    type: :string,
                    example: '123'
                  },
                  insurance_number_agreement: {
                    type: :boolean,
                    example: true
                  },
                  documents_agreement: {
                    type: :boolean,
                    example: true
                  },
                  appointment_scheduled: {
                    type: :boolean,
                    example: true
                  },
                  documents_uploaded: {
                    type: :boolean,
                    example: true
                  }
                }
              }
            }
          }
        }

        let(:attributes) do
          {
            attributes: {
              onboarding_step: 1,
              min_rides_number: 100,
              other_rating: 5,
              vehicle_reg_year: 2017
            }
          }
        end
        user_authentication_required!
        before { current_user.update_attributes(onboarding_step: 1) }

        response '200', 'onboarding updated successfully' do
          schema '$ref' => '#/definitions/user'

          run_test!
        end
    end
  end
end
