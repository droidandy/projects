require 'rails_helper'

module SeedsSpec
  DB.drop_table? :seed_items
  DB.create_table :seed_items do
    primary_key :id
    String :name
    String :description
  end

  Item = Class.new(Sequel::Model(:seed_items))
end

RSpec.describe Seeds do
  after(:all) { DB.drop_table :seed_items }

  describe '#seed' do
    subject { -> { Seeds.seed(SeedsSpec::Item, :name, [name: 'foo', description: 'updated']) } }

    context "when record doesn't exit" do
      it { is_expected.to change(SeedsSpec::Item, :count).by(1) }
    end

    context "when record exists" do
      let!(:item) { SeedsSpec::Item.create(name: 'foo', description: 'bar') }

      it { is_expected.not_to change(SeedsSpec::Item, :count) }
      it { is_expected.to change{ item.reload.description }.from('bar').to('updated') }
    end
  end

  describe '#seed_once' do
    subject { -> { Seeds.seed_once(SeedsSpec::Item, :name, [name: 'foo', description: 'updated']) } }

    context "when record doesn't exit" do
      it { is_expected.to change(SeedsSpec::Item, :count).by(1) }
    end

    context "when record exists" do
      let!(:item) { SeedsSpec::Item.create(name: 'foo', description: 'bar') }

      it { is_expected.not_to change(SeedsSpec::Item, :count) }
      it { is_expected.not_to change{ item.reload.description } }
    end
  end
end
