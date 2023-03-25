require 'rails_helper'

RSpec.describe Users::Show do
  describe '#as_json' do
    let(:password) { '123456789' }
    let(:date) { Time.zone.today }
    let(:birth_date) { Time.zone.today + 1.day }
    let(:user) do
      create(
        :user,
        :with_driver_role,
        account_number:         'account_number',
        address:                'address',
        badge_number:           'badge_number',
        badge_type:             'badge_type',
        birth_date:             birth_date,
        city:                   'city',
        disability_description: 'disability_description',
        disability_type:        'disability_type',
        driving_cab_since:      date,
        email:                  'em@fakemail.com',
        gett_id:                1111,
        hobbies:                'hobbies',
        is_frozen:              true,
        license_number:         'license_number',
        phone:                  'phone',
        postcode:               'postcode',
        sort_code:              'sort_code',
        talking_topics:         'talking_topics',
        min_rides_number:       200
      )
    end
    let!(:vehicles) { create_list :vehicle, 3, user: user }

    subject { described_class.new(user).as_json }

    context 'without invites' do
      it 'returns json' do
        time = Time.current
        allow_any_instance_of(Redis).to receive(:get).and_return(time.to_s)

        expect(subject).to eq(
          {
            id:                           user.id,
            created_at:                   user.created_at,
            updated_at:                   user.updated_at,
            account_number:               'account_number',
            active:                       true,
            address:                      'address',
            appointment_scheduled:        false,
            approval_status:              user.approval_status,
            badge_number:                 'badge_number',
            badge_type:                   'badge_type',
            birth_date:                   birth_date,
            city:                         'city',
            disability_description:       'disability_description',
            disability_type:              'disability_type',
            documents_agreement:          false,
            documents_expiration_warning: false,
            documents_uploaded:           false,
            driving_cab_since:            date,
            email:                        'em@fakemail.com',
            first_name:                   'Frank',
            gett_id:                      1111,
            hobbies:                      'hobbies',
            insurance_number_agreement:   false,
            is_frozen:                    true,
            last_activity_at:             time.iso8601,
            last_name:                    'Sinatra',
            license_number:               'license_number',
            license:                      'account_number',
            onboarding_completed:         false,
            onboarding_step:              0,
            phone:                        'phone',
            postcode:                     'postcode',
            min_rides_number:             200,
            roles:                        ['driver'],
            sort_code:                    'sort_code',
            talking_topics:               'talking_topics',
            pending_documents_number:     0
          }
        )
      end
    end

    context 'with invite' do
      let!(:invite) { create(:invite, user: user) }

      it { expect(subject).to have_key(:invite) }
    end

    context 'with vehicles parameter' do
      subject { described_class.new(user).as_json(with_vehicles: true) }

      it 'has vehicles array' do
        expect(subject[:vehicles].count).to eq(3)
      end
    end

    context 'with driver option and user to approve' do
      subject { described_class.new(user).as_json(with_driver: true) }
      let!(:user_to_approve) { create :user, approver: user }

      it 'render driver' do
        expect(subject[:driver_to_approve_id]).to eq(user_to_approve.id)
      end
    end

    context 'with mandatory documents expiring soon' do
      let!(:document) { create(:document, :required, user: user, expires_at: 5.days.from_now) }

      it 'has expiration warning flag' do
        expect(subject[:documents_expiration_warning]).to eq(true)
      end
    end

    context 'with pending documents' do
      before do
        create_list(:document, 2, user: user)
        create(:document, :approved, user: user)
        create(:document, user: user, hidden: true)
      end

      it 'returns number of pending documents' do
        expect(subject[:pending_documents_number]).to eq(2)
      end
    end

    context 'user is onboarding agent' do
      let(:user) { create(:user, :with_onboarding_agent_role) }

      before do
        Agents::ChangeStatus.new(user, status: 'available').execute!
        user.reload
      end

      it 'returns extra fields' do
        expect(subject.keys).to include(
          :assigned_drivers_count,
          :agent_status,
          :agent_status_updated_at
        )
      end
    end
  end
end
