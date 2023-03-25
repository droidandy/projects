lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)

require 'gett/template/version'

Gem::Specification.new do |spec|
  spec.name          = 'gett-template'
  spec.version       = Gett::Template::VERSION
  spec.authors       = ['Vigintas Labakojis']
  spec.email         = ['vigintas.labakojis@gmail.com']
  spec.summary       = 'Gett UK Ruby on Rails service contract template gem'
  spec.files         = Dir['lib/**/*.rb', '*.md']
  spec.require_paths = ['lib']

  spec.metadata['allowed_push_host'] = 'none'

  spec.add_dependency 'gett-core'

  spec.add_development_dependency 'bundler', '1.16.2'
  spec.add_development_dependency 'rake', '12.3.1'
  spec.add_development_dependency 'rspec', '3.7.0'
end
