require 'rails_helper'

RSpec.describe Passwords::Reset do
  subject { described_class.new(args) }

  let!(:user) do
    create(:user, email: email, password: password, password_confirmation: password)
  end

  let(:email) { 'test@example.com' }
  let(:password) { '123456789' }

  let(:args) do
    {
      email: email
    }
  end

  describe '#execute' do
    it 'saves reset token digest' do
      subject.execute!
      expect(subject.user.reset_password_digest).to be_present
    end

    it 'exists with success' do
      subject.execute!
      expect(subject.success?).to be true
    end

    it 'sends email to the user' do
      expect { subject.execute! }.to change { ActionMailer::Base.deliveries.count }.by(1)
    end

    context 'when email is invalid' do
      before do
        args[:email] = 'other@example.com'
      end

      it 'returns blank user' do
        subject.execute!
        expect(subject.user).to be nil
      end

      it 'exists with success anyway' do
        subject.execute!
        expect(subject.success?).to be true
      end
    end
  end
end
