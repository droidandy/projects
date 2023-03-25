namespace :rswag do
  namespace :specs do
    namespace :swaggerize do
      desc "Generate Swagger JSON files from integration specs for production environments"
      task :production do
        puts 'Note to run this task with RAILS_ENV=test because of `rswag-specs` gem.'
        ENV['SWAGGER_ENV'] = 'production'
        Rake::Task['rswag:specs:swaggerize'].invoke
      end
    end
  end
end
