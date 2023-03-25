class ServiceJob < ApplicationJob
  def perform(service_klass, attrs)
    ApplicationService::Context.with_context(user: :system) do
      service_klass.constantize.new(attrs).execute
    end
  end
end
