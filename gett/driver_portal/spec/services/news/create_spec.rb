require 'rails_helper'
require 'support/shared_examples/service_examples'
include ActionDispatch::TestProcess

RSpec.describe News::Create do
  describe '#execute!' do
    subject { described_class.new(current_user, params) }

    let(:current_user) { create :user }
    let(:binding_hash) { nil }

    let(:params) do
      {
        title: 'Title',
        image: fixture_file_upload('1x1.jpg', 'image/jpg'),
        content: '<h1>Content</h1>',
        published_at: Time.current.iso8601,
        item_type: 'regular',
        binding_hash: binding_hash
      }
    end

    include_examples 'it uses policy', News::ItemPolicy, :create?

    context 'with regular type' do
      it 'should create news item' do
        subject.execute!
        expect(subject).to be_success
        expect(subject.news_item).to be_valid
      end

      context 'with images to bind' do
        let(:current_user) { create :user, :with_community_manager_role } # to get images scope
        let(:binding_hash) { 'AbCdEf123456' }
        let!(:images) { create_list(:news_image, 3, binding_hash: 'AbCdEf123456') }
        let!(:another_images) { create_list(:news_image, 2, :without_news_item) }
        let!(:already_bound_images) { create_list(:news_image, 2, :with_news_item) }

        it 'should bind images' do
          subject.execute!
          expect(subject.news_item.images.count).to eq(3)
        end
      end
    end

    context 'with numbers type' do
      let(:params) do
        {
          title: 'Title',
          published_at: Time.current.iso8601,
          item_type: 'numbers',
          number: 42,
          binding_hash: binding_hash
        }
      end

      it 'should create news item' do
        subject.execute!
        expect(subject).to be_success
        expect(subject.news_item).to be_valid
      end
    end
  end
end
