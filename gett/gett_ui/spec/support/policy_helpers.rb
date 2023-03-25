module PolicyHelpers
  def self.extended(group)
    group.instance_exec{ subject(:policy){ described_class } }
  end

  def permissions(*names, &block)
    names.each do |permission_name|
      describe permission_name.to_s do
        let(:subject_permission) { permission_name }

        instance_exec(&block)
      end
    end
  end

  def scope(name = :default, &block)
    describe '.scope' do
      let(:scope_name) { name }

      instance_exec(&block)
    end
  end

  def preload(*methods)
    before { methods.each(&method(:public_send)) }
  end
end
