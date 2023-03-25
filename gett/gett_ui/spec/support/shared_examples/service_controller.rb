shared_examples_for 'service controller' do |prms|
  extension =
    Module.new do
      %i[get post put delete].each do |method|
        define_method(method) { |action, &block| describe_action(method, action, &block) }
      end

      define_method(:describe_action) do |method, action, &block|
        describe "#{method.to_s.upcase} ##{action}" do
          let(:params)        { {} }
          let(:dispatch)      { public_send(method, action, params: params) }
          let(:service_class) { "#{prms[:module]}::#{action.to_s.camelize}".constantize }
          let(:service)       { double(:service) }

          before do
            allow(service_class).to receive(:new).and_return(service)
            expect(service).to receive(:execute).at_least(:once).and_return(service)
          end

          instance_exec(&block)
        end
      end

      def stub_service(stubs = nil, &block)
        before { allow(service).to receive_messages(stubs || instance_exec(&block)) }
      end

      def params(&block)
        let(:params) { instance_exec(&block) }
      end

      def expected_service_attributes(&block)
        before { expect(service_class).to receive(:new).with(instance_exec(&block)).and_return(service) }
      end

      def on_success(&block)
        context 'when service executes successfully' do
          before { expect(service).to receive(:success?).and_return(true) }

          instance_exec(&block)
        end
      end

      def on_failure(&block)
        context 'when service fails to execute' do
          before { expect(service).to receive(:success?).and_return(false) }

          instance_exec(&block)
        end
      end

      def expected_response(expectation)
        status, body = expectation.is_a?(Hash) ? expectation.first : [expectation, '']

        it "responds with #{status} and corresponding body" do
          dispatch

          expect(response.status).to eq status
          expect(response.body).to eq body
        end
      end
    end

  extend extension
end
