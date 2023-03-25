module ServiceHelpers
  def service_context(&block)
    around do |example|
      ApplicationService::Context.with_context(instance_exec(&block)) do
        example.run
      end
    end
  end

  def in_web(&block)
    context 'when executed in web server' do
      before do
        allow(Sidekiq).to receive(:server?).and_return(false)
      end

      instance_exec(&block)
    end
  end

  def in_background(&block)
    context 'when executed in background' do
      before { allow(Sidekiq).to receive(:server?).and_return(true) }

      let(:service) { described_class.new(background_attrs) }

      instance_exec(&block)
    end
  end

  def stub_channelling!
    before { allow(Faye).to receive(:notify).and_return(true) }
  end
end
