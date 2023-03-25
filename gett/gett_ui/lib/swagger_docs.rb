module SwaggerDocs
  DOCS_ROOT = File.join(Rails.root, '/spec/swagger_docs/')

  module_function

  # This loader makes possible to split swagger_docs into different directories/files
  # located under `spec/swagger_docs` folder
  def load
    Dir["#{DOCS_ROOT}/**/*.rb"].each{ |f| Kernel.load(f) unless f =~ /loader\.rb$/ }

    SwaggerDocs.constants.grep(/DOCS$/)
      .map{ |name| SwaggerDocs.const_get(name) }
      .reduce(&:merge)
  end

  def base_path(path)
    (ENV['SWAGGER_ENV'] == 'production') ? "/api#{path}" : path
  end
end
