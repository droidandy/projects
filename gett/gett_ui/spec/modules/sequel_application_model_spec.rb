require 'rails_helper'

RSpec.describe 'Sequel::Plugins::ApplicationModel' do
  describe '#validates_phone_number' do
    let(:model_class) do
      Class.new(Sequel::Model) do
        plugin :application_model

        attr_accessor :phone

        def validate
          validates_phone_number :phone
        end
      end
    end

    context 'invalid phone' do
      invalid_numbers = [
        '0747609261*',
        '0747609261=',
        '0747609261!',
        '0747609261$',
        '0747609261@',
        '0747609261?',
        '0747609261£',
        '0747609261%',
        '0747609261&',
        ')))))))))))',
        '+12345',
        '+1234567890123456789',
        'Simone Marvulli NW1 7ET 113 Arlighton Road, Camden, 25-',
        '020759289853 020759289853',
        ''
      ]

      invalid_numbers.each do |number|
        it { expect(model_class.new(phone: number)).not_to be_valid }
      end
    end

    context 'valid phone' do
      valid_numbers = [
        '+1234353453',
        '+131070663512',
        '+123435345312345'
      ]

      valid_numbers.each do |number|
        it { expect(model_class.new(phone: number)).to be_valid }
      end
    end
  end
end
