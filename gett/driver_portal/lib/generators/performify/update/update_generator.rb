module Performify
  class UpdateGenerator < Rails::Generators::NamedBase
    desc 'Creates performify-base service object for entity update and spec'

    source_root File.expand_path("../templates", __FILE__)

    def generate_service
      template 'service.erb', "app/services/#{file_path}.rb"
    end

    def generate_spec
      template 'spec.erb', "spec/services/#{file_path}_spec.rb"
    end
  end
end
