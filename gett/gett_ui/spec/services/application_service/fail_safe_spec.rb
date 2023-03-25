require 'rails_helper'

RSpec.describe ApplicationService::FailSafe, type: :service do
  let(:service) { service_klass.new }

  def self.behavior(&block)
    let(:service_klass) do
      Class.new(ApplicationService) do
        define_method(:execute!, &block)

        def foo; end
      end
    end
  end

  context ':fail_on_error option' do
    subject { service.execute }

    context 'when no value is specified, uses `false` by default' do
      behavior do
        success!
        fail_safe(silence: true) { fail 'foo' }
      end

      it { is_expected.to be_success }
    end

    context 'when `true` value is used' do
      behavior do
        success!
        fail_safe(silence: true, fail_on_error: true) { fail 'foo' }
      end

      it { is_expected.not_to be_success }
    end
  end

  describe ':retry option' do
    before { allow(service).to receive(:foo) }

    context 'when no value is specified' do
      behavior do
        fail_safe(silence: true) { fail 'foo' }
      end

      subject { -> { service.execute } }

      it { is_expected.not_to raise_error }
    end

    context 'when number value is used' do
      behavior do
        fail_safe(retry: 2, silence: true) do
          foo
          fail 'foo'
        end
      end

      specify do
        expect{ service.execute }.not_to raise_error
        expect(service).to have_received(:foo).exactly(3).times
      end
    end

    context 'when exception class is specified' do
      SpecError = Class.new(StandardError)

      context 'and when it is raised' do
        behavior do
          fail_safe(retry: {SpecError => 1}, silence: true) do
            foo
            fail SpecError
          end
        end

        specify do
          expect{ service.execute }.not_to raise_error
          expect(service).to have_received(:foo).exactly(2).times
        end
      end

      context 'and when other error is raised' do
        behavior do
          fail_safe(retry: {SpecError => 1}, silence: true) do
            foo
            fail 'other'
          end
        end

        specify do
          expect{ service.execute }.not_to raise_error
          expect(service).to have_received(:foo).exactly(1).times
        end
      end
    end
  end

  describe ':silence option' do
    subject { -> { service.execute } }

    context 'when no value is specified, uses `false` by default' do
      behavior do
        fail_safe { fail 'foo' }
      end

      it { is_expected.to raise_error('foo') }
    end

    context 'when `true` value is used' do
      behavior do
        fail_safe(silence: true) do
          fail 'foo'
        end
      end

      it { is_expected.not_to raise_error }
    end
  end
end
