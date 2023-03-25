require 'rails_helper'

RSpec.describe Sequel::Plugins::Points do
  before(:all) do
    DB.create_table!(:table_with_points) do
      primary_key :id
      Point :location1
      Point :location2
    end

    class ModelWithPoint < Sequel::Model(:table_with_points)
      plugin :points, columns: [:location1, :location2]
    end
  end

  after(:all) do
    DB.drop_table(:table_with_points)
  end

  context 'create new instance' do
    subject do
      ModelWithPoint.create(location1: [1, 3], location2: [12.4, 52.7])
    end

    it 'creates new instance' do
      expect{ subject }.to change(ModelWithPoint, :count).by(1)
    end

    its(:location1) { eq [1.0, 3.0] }
    its(:location2) { eq [12.4, 52.7] }
  end

  context 'change existed instance' do
    let!(:existed_instance) do
      ModelWithPoint.create(location1: [1, 3])
    end

    subject do
      existed_instance.update(location1: [53.2, 1])
    end

    it 'changes existed instance' do
      expect{ subject }.to change{ existed_instance.reload[:location1] }
        .from('(1,3)').to('(53.2,1)')
    end
  end
end
