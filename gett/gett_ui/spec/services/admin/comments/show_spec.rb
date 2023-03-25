require 'rails_helper'

RSpec.describe Admin::Comments::Show, type: :service do
  describe '#execute' do
    let(:comment) { create :comment }
    let(:service) { Admin::Comments::Show.new(comment: comment) }

    subject { service.execute.result }

    it { is_expected.to include 'id', 'text', 'created_at', 'author' }
    its(['author']) { is_expected.to include 'full_name', 'avatar_url' }
  end
end
