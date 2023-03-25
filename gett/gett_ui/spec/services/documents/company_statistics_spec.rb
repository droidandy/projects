require 'rails_helper'

RSpec.describe Documents::CompanyStatistics, type: :service do
  let(:service) { Documents::CompanyStatistics.new(html: 'some html text') }

  describe '#template_assigns' do
    subject { service.template_assigns }

    it { is_expected.to eq(html: 'some html text') }
  end
end
