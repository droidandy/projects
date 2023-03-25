require 'rails_helper'

RSpec.describe Onboarding::Update do
  subject { described_class.new(user, attributes) }

  context 'invalid step' do
    let(:user) { create(:user, onboarding_step: 2) }
    let(:attributes) { { onboarding_step: 3 } }

    it 'returns error' do
      subject.execute!
      expect(subject).not_to be_success
      expect(subject.errors).to eq(onboarding_step: ['invalid'])
    end
  end

  describe 'Step 0' do
    let(:user) { create(:user, onboarding_step: 0) }

    context 'valid attributes' do
      let(:attributes) do
        {
          onboarding_step: 0,
          email: 'm@il.com',
          first_name: 'John',
          last_name: 'Doe',
          phone: '+41 000',
          license_number: '010101',
          how_did_you_hear_about: 'ads'
        }
      end

      it 'updates user and increments step' do
        subject.execute!
        expect(subject).to be_success
        updated_user = subject.updated_user
        expect(updated_user.attributes).to include(
          'onboarding_step' => 1,
          'email' => 'm@il.com',
          'first_name' => 'John',
          'last_name' => 'Doe',
          'phone' => '+41 000',
          'license_number' => '010101',
          'how_did_you_hear_about' => 'ads'
        )
      end

      context 'user re-visits step' do
        let(:user) { create(:user, onboarding_step: 2) }

        it 'does not increment step' do
          subject.execute!
          expect(subject).to be_success
          expect(subject.updated_user.onboarding_step).to eq(2)
        end
      end
    end

    context 'invalid attributes' do
      let(:attributes) { { onboarding_step: 0 } }

      it 'returns errors' do
        subject.execute!
        expect(subject).not_to be_success
        expect(subject.errors).to eq(
          email: ['is missing'],
          first_name: ['is missing'],
          last_name: ['is missing'],
          license_number: ['is missing'],
          phone: ['is missing'],
        )
      end
    end
  end

  describe 'Step 1' do
    let(:user) { create(:user, onboarding_step: 1) }

    context 'valid attributes' do
      let(:attributes) do
        {
          onboarding_step: 1,
          min_rides_number: 100,
          other_rating: 4.5,
          vehicle_reg_year: 2015
        }
      end

      it 'updates user and increments step' do
        subject.execute!
        expect(subject).to be_success
        updated_user = subject.updated_user
        expect(updated_user.attributes).to include(
          'onboarding_step' => 2,
          'min_rides_number' => 100,
          'other_rating' => 4.5,
          'vehicle_reg_year' => 2015
        )
      end

      context 'onboarding was failed' do
        let(:user) { create(:user, onboarding_step: 1, onboarding_failed_at: Time.current) }

        it 'updates user, increments step and resets onboarding_failed_at' do
          subject.execute!
          expect(subject).to be_success
          updated_user = subject.updated_user
          expect(updated_user.attributes).to include(
            'onboarding_step' => 2,
            'onboarding_failed_at' => nil
          )
        end
      end
    end

    context 'criteria not met' do
      let(:attributes) do
        {
          onboarding_step: 1,
          min_rides_number: 0,
          other_rating: 4.4,
          vehicle_reg_year: 2011
        }
      end

      it 'fails onboarding' do
        subject.execute!
        expect(subject).to be_success
        updated_user = subject.updated_user
        expect(updated_user.onboarding_step).to eq(1)
        expect(updated_user.onboarding_failed_at).to be_present
      end
    end

    context 'step does not match exactly' do
      let(:user) { create(:user, onboarding_step: 2) }
      let(:attributes) do
        {
          onboarding_step: 1,
          min_rides_number: 100,
          other_rating: 5,
          vehicle_reg_year: 2017
        }
      end

      it 'returns error' do
        subject.execute!
        expect(subject).not_to be_success
        expect(subject.errors).to include(onboarding_step: ['invalid'])
      end
    end

    context 'invalid attributes' do
      let(:attributes) { { onboarding_step: 1 } }

      it 'returns errors' do
        subject.execute!
        expect(subject).not_to be_success
        expect(subject.errors).to eq(
          min_rides_number: ['is missing'],
          other_rating: ['is missing'],
          vehicle_reg_year: ['is missing']
        )
      end
    end
  end

  describe 'Step 2' do
    let(:user) { create(:user, onboarding_step: 2) }

    context 'valid attributes' do
      let(:attributes) do
        {
          onboarding_step: 2,
          sort_code: '0101',
          account_number: '0101010101',
          city: 'London',
          postcode: 'A1 W1W',
          address: '13 Downing Str.',
          insurance_number: '010101',
          insurance_number_agreement: true,
          documents_agreement: true
        }
      end

      it 'updates user and increments step' do
        subject.execute!
        expect(subject).to be_success
        updated_user = subject.updated_user
        expect(updated_user.attributes).to include(
          'onboarding_step' => 3,
          'sort_code' => '0101',
          'account_number' => '0101010101',
          'city' => 'London',
          'postcode' => 'A1 W1W',
          'address' => '13 Downing Str.',
          'insurance_number' => '010101',
          'insurance_number_agreement' => true,
          'documents_agreement' => true
        )
      end
    end

    context 'invalid attributes' do
      let(:attributes) do
        {
          onboarding_step: 2,
          insurance_number_agreement: false,
          documents_agreement: false
        }
      end

      it 'returns errors' do
        subject.execute!
        expect(subject).not_to be_success
        expect(subject.errors).to eq(
          address: ['is missing'],
          account_number: ['is missing'],
          sort_code: ['is missing'],
          city: ['is missing'],
          insurance_number: ['is missing'],
          postcode: ['is missing']
        )
      end
    end
  end

  describe 'Step 3' do
    let(:user) { create(:user, onboarding_step: 3) }

    context 'valid attributes' do
      let(:attributes) { { onboarding_step: 3, appointment_scheduled: true } }

      it 'updates user and increments step' do
        subject.execute!
        expect(subject).to be_success
        updated_user = subject.updated_user
        expect(updated_user.attributes).to include(
          'onboarding_step' => 4,
          'appointment_scheduled' => true
        )
      end
    end

    context 'invalid attributes' do
      let(:attributes) { { onboarding_step: 3, appointment_scheduled: false } }

      it 'returns errors' do
        subject.execute!
        expect(subject).not_to be_success
        expect(subject.errors).to eq(
          appointment_scheduled: ['You need to confirm acceptance to proceed']
        )
      end
    end
  end

  describe 'Step 4' do
    let(:user) { create(:user, onboarding_step: 4) }

    context 'valid attributes' do
      let(:attributes) { { onboarding_step: 4, documents_uploaded: true } }

      it 'updates user and increments step' do
        subject.execute!
        expect(subject).to be_success
        updated_user = subject.updated_user
        expect(updated_user.attributes).to include(
          'onboarding_step' => 5,
          'documents_uploaded' => true
        )
      end
    end

    context 'invalid attributes' do
      let(:attributes) { { onboarding_step: 4, documents_uploaded: false } }

      it 'returns errors' do
        subject.execute!
        expect(subject).not_to be_success
        expect(subject.errors).to eq(
          documents_uploaded: ['You need to confirm acceptance to proceed']
        )
      end
    end
  end
end
