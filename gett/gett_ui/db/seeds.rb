# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
Rails.application.config.sequel.audited_enabled = false
Sequel::Model.plugin :update_or_create
Sequel::Model.unrestrict_primary_key

Seeds.load('shared.rb')
Seeds.load("#{Rails.env}.rb")
