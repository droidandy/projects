require 'rails_helper'

RSpec.describe Sessions::Create, type: :service do
  subject(:service) { Sessions::Create.new(params: params, api_type: api_type) }

  let(:company) { create(:company) }
  let!(:user) do
    create(:booker,
      email: 'mail@example.com',
      password: '12345',
      password_confirmation: '12345',
      locked: locked,
      invalid_passwords_count: invalid_passwords_count,
      company: company
    )
  end
  let(:locked) { false }
  let(:invalid_passwords_count) { 0 }
  let(:api_type) { nil }

  context 'email is blank or user not exists' do
    before do
      expect_any_instance_of(User).not_to receive(:realm)
      expect(JsonWebToken).not_to receive(:encode)
      service.execute
    end

    context 'since blank' do
      let(:params) { {} }

      it { is_expected.not_to be_success }
      its(:errors) { is_expected.to eq('The email or password you entered is incorrect.') }
    end

    context 'since email is blank' do
      let(:params) { {email: '', password: '12345'} }

      it { is_expected.not_to be_success }
      its(:errors) { is_expected.to eq('The email or password you entered is incorrect.') }
    end

    context 'since email is wrong' do
      let(:params) { {email: 'wrong_email@exampl.com', password: '12345'} }

      it { is_expected.not_to be_success }
      its(:errors) { is_expected.to eq('The email or password you entered is incorrect.') }
    end
  end

  context 'user is locked' do
    before { service.execute }

    let(:locked) { true }
    let(:params) { {email: 'mail@example.com', password: '12345'} }

    it { is_expected.not_to be_success }
    its(:errors) { is_expected.to eq('Your account was temorary locked because of suspicious login activity. Try again later.') }
  end

  describe 'captcha requirements' do
    let(:invalid_passwords_count) { 11 }
    let(:params) { {email: 'mail@example.com', password: '12345'} }

    context 'when captcha is required but not provided' do
      before { service.execute }

      it { is_expected.to be_success }
      its(:result) { is_expected.to eq(show_captcha: true, site_key: 'site_key') }
    end

    context 'when request comes from mobile app' do
      let(:api_type) { 'mobile' }

      before do
        expect_any_instance_of(Member).to receive(:realms).and_return(['realm'])
        expect(JsonWebToken).to receive(:encode).with(id: user.id).and_return('token')
      end

      it "doesn't require captcha" do
        expect(service.execute).to be_success
        expect(service.result).to eq(token: 'token', realms: ['realm'])
      end
    end
  end

  context 'captcha required and provided but not valid' do
    before do
      allow(service).to receive(:captcha_response_valid?).and_return(false)
      service.execute
    end

    let(:invalid_passwords_count) { 11 }
    let(:params) { {email: 'mail@example.com', password: '12345', captcha_response: 'captcha'} }

    it { is_expected.not_to be_success }
    its(:errors) { is_expected.to eq('Failed to validate captcha response') }
  end

  context 'when credentials are correct' do
    let(:params) { {email: 'mail@example.com', password: '12345'} }

    context 'and access is not prohibited' do
      before do
        expect_any_instance_of(Member).to receive(:realms).and_return(['realm'])
        expect(JsonWebToken).to receive(:encode).with(id: user.id).and_return('token')
        service.execute
      end

      it { is_expected.to be_success }
      its(:result) { is_expected.to eq(token: 'token', realms: ['realm']) }

      context 'when email with spaces' do
        let(:params) { {email: 'mail@example.com ', password: '12345'} }

        it { is_expected.to be_success }
        its(:result) { is_expected.to eq(token: 'token', realms: ['realm']) }
      end

      context 'when different case is used in email' do
        let(:user) { create(:booker, email: 'Mail@example.com', password: '12345', password_confirmation: '12345') }
        let(:params) { {email: 'mAIL@example.com ', password: '12345'} }

        it { is_expected.to be_success }
        its(:result) { is_expected.to eq(token: 'token', realms: ['realm']) }
      end

      context 'user has failed login attempts' do
        let(:invalid_passwords_count) { 1 }

        it { expect(user.reload.invalid_passwords_count).to eq(0) }
      end
    end

    context 'and access is prohibited' do
      before do
        expect_any_instance_of(User).not_to receive(:realm)
        expect(JsonWebToken).not_to receive(:encode)
      end

      context "since user's company is inactive" do
        before do
          user.company.update(active: false)
          service.execute
        end

        it { is_expected.not_to be_success }
        its(:errors) { is_expected.to eq('Your company account has been deactivated') }
      end

      context "since user is inactive" do
        before do
          user.update(active: false)
          service.execute
        end

        it { is_expected.not_to be_success }
        its(:errors) { is_expected.to eq('Your account has been deactivated') }
      end
    end

    context 'when BBC company' do
      let(:company) { create(:company, :bbc) }

      context 'user logged in 1 hour before' do
        before do
          user.update(last_logged_in_at: 1.hour.ago)
        end

        it 'doesnt send notifications' do
          expect(Messages::CreatePersonal).to_not receive(:new)
          expect(BbcNotificationsMailer).to_not receive(:please_update_pd)

          service.execute
        end
      end

      context 'user pd doesnt expired' do
        before do
          user.update(pd_expires_at: 1.day.from_now)
        end

        it 'doesnt send notifications' do
          expect(Messages::CreatePersonal).to_not receive(:new)
          expect(BbcNotificationsMailer).to_not receive(:please_update_pd)

          service.execute
        end
      end

      context 'user pd expired' do
        before do
          user.update(pd_expires_at: 1.day.ago)
        end

        it 'sends notifications' do
          expect(Messages::CreatePersonal).to receive(:new)
            .with(recipient: user, message_body: I18n.t('bbc.passenger_notifications.pd_unsigned'))
            .and_return(double(execute: true))

          expect(BbcNotificationsMailer).to receive(:please_update_pd)
            .with(passenger: user)
            .and_return(double(deliver_later: true))

          service.execute
        end
      end
    end
  end

  context 'when credentials are invalid' do
    let(:captcha_validator_stub) { double('GoogleRecaptcha::ValidateResponse', execute: double(success?: true), result: true) }

    before do
      allow(GoogleRecaptcha::ValidateResponse).to receive(:new).and_return(captcha_validator_stub)
      expect_any_instance_of(User).not_to receive(:realm)
      expect(JsonWebToken).not_to receive(:encode)
      service.execute
    end

    context 'since blank' do
      let(:params) { {} }

      it { is_expected.not_to be_success }
      its(:errors) { is_expected.to eq('The email or password you entered is incorrect.') }
    end

    context 'since email is blank' do
      let(:params) { {email: '', password: '12345'} }

      it { is_expected.not_to be_success }
      its(:errors) { is_expected.to eq('The email or password you entered is incorrect.') }
    end

    context 'since email is wrong' do
      let(:params) { {email: 'wrong_email@exampl.com', password: '12345'} }

      it { is_expected.not_to be_success }
      its(:errors) { is_expected.to eq('The email or password you entered is incorrect.') }
    end

    context 'since password is wrong' do
      context 'captcha is not required' do
        let(:params) { {email: 'mail@example.com', password: 'wrong'} }

        it { is_expected.not_to be_success }
        its(:errors) { is_expected.to eq('The email or password you entered is incorrect.') }
      end

      context 'captcha is required' do
        let(:params) { {email: 'mail@example.com', password: 'wrong', captcha_response: 'captcha'} }

        context 'allowed login attempts number not exceeded' do
          let!(:invalid_passwords_count) { 11 }

          it { is_expected.not_to be_success }
          it { expect(user.reload.invalid_passwords_count).to eq(12) }
          its(:errors) { is_expected.to eq('The email or password you entered is incorrect.') }
        end

        context 'allowed login attempts number exceeded' do
          let!(:invalid_passwords_count) { 19 }

          it { is_expected.not_to be_success }
          it { expect(user.reload.invalid_passwords_count).to eq(20) }
          it { expect(user.reload.locked).to be(true) }
          it { expect(user.reload.locks_count).to eq(1) }
          its(:errors) { is_expected.to eq('The email or password you entered is incorrect.') }
        end
      end
    end
  end

  context 'when bbc user goes trough the mobile app' do
    let!(:bbc_user) do
      create(:booker,
        email:                 email,
        password:              password,
        password_confirmation: password,
        company:               company
      )
    end

    let(:company)  { create(:company, :bbc) }
    let(:email)    { 'bbc_mail@example.com' }
    let(:password) { '12345' }
    let(:api_type) { 'mobile' }

    before { service.execute }

    context 'generic mobile app' do
      let(:params)   { {email: email, password: password} }
      let(:error_message) { 'Please use our BBC mobile app' }

      it { is_expected.not_to be_success }
      its(:errors) { is_expected.to eq(error_message) }
    end

    context 'BBC mobile app' do
      let(:params) { {email: email, password: password, app_type: 'bbc'} }

      it { is_expected.to be_success }
    end
  end

  context 'when generic user goes through BBC mobile app' do
    let(:api_type) { 'mobile' }
    let(:error_message) { 'Please use our generic mobile app' }
    let(:params) { {email: user.email, password: '12345', app_type: 'bbc'} }

    before { service.execute }

    it { is_expected.not_to be_success }
    its(:errors) { is_expected.to eq(error_message) }
  end

  context 'when affiliate user goes trough the mobile app' do
    let!(:affiliate_user) do
      create(:booker,
        email: email,
        password: password,
        password_confirmation: password,
        company: company
      )
    end

    let(:company)  { create(:company, :affiliate) }
    let(:email)    { 'affiliate_mail@example.com' }
    let(:password) { '12345' }
    let(:api_type) { 'mobile' }
    let(:params)   { {email: email, password: password} }

    before { service.execute }

    it           { is_expected.not_to be_success }
    its(:errors) { is_expected.to be_present }
    its(:errors) { is_expected.not_to match(/translation missing/) }
  end
end
