require 'rails_helper'

RSpec.describe Passwords::Update do
  subject { described_class.new(args) }

  let(:old_password) { 'qwerty' }

  let!(:user) do
    create(:user, password: old_password, password_confirmation: old_password)
  end

  let(:password) { '123456789' }
  let(:password_confirmation) { '123456789' }

  let(:token) do
    service = Passwords::Reset.new(email: user.email)
    service.execute!

    raise 'Something went wrong with password reset' if service.fail?

    service.token
  end

  let(:args) do
    {
      token: token,
      password: password,
      password_confirmation: password_confirmation
    }
  end

  describe '#execute' do
    it 'updates password' do
      subject.execute!
      expect(subject.user.authenticate(password)).to eq(user)
    end

    it 'invalidates reset password digest' do
      subject.execute!
      expect(subject.user.reset_password_digest).to be nil
    end

    it 'creates session object' do
      subject.execute!
      expect(subject.session).not_to be nil
    end

    context 'when token is invalid' do
      let(:token) { 'foobar' }

      it 'returns error' do
        subject.execute!
        expect(subject.errors[:token]).to be_present
      end
    end

    context 'when password does not match' do
      let(:password_confirmation) { 'foobar' }

      it 'returns error' do
        subject.execute!
        expect(subject.errors[:password_confirmation]).to be_present
      end
    end
  end
end
