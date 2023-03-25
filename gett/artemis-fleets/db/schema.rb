# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20171102140411) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_orders", force: :cascade do |t|
    t.integer "fleet_id"
    t.integer "order_id"
    t.datetime "scheduled_at"
    t.integer "driver_id"
    t.string "driver_name"
    t.string "driver_phone"
    t.integer "driver_status"
    t.string "pickup_address"
    t.string "pickup_location"
    t.string "destination_address"
    t.string "destination_location"
    t.integer "order_status"
    t.datetime "created_at", null: false
    t.datetime "order_received"
    t.datetime "pickup_time"
    t.datetime "will_arrive_at"
    t.datetime "arrived_at"
    t.integer "waiting_time_minutes"
    t.datetime "passanger_on_board"
    t.datetime "order_ended_at"
    t.float "driver_rating"
    t.string "driver_photo"
    t.string "driver_car_model"
    t.string "driver_taxi_reg"
    t.string "driver_device_type"
    t.string "passenger_name"
    t.datetime "order_cancelled_at"
    t.datetime "order_rejected_at"
    t.string "order_status_name"
  end

  create_table "addresses", force: :cascade do |t|
    t.string "line"
    t.string "postal_code"
    t.float "lat"
    t.float "lng"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "companies", force: :cascade do |t|
    t.string "name", null: false
    t.boolean "active", default: true, null: false
    t.string "logo"
    t.bigint "salesman_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "vat_number"
    t.string "cost_centre"
    t.string "legal_name"
    t.bigint "address_id"
    t.bigint "legal_address_id"
    t.integer "fleet_id"
    t.bigint "primary_contact_id"
    t.bigint "billing_contact_id"
    t.index ["address_id"], name: "index_companies_on_address_id"
    t.index ["billing_contact_id"], name: "index_companies_on_billing_contact_id"
    t.index ["legal_address_id"], name: "index_companies_on_legal_address_id"
    t.index ["primary_contact_id"], name: "index_companies_on_primary_contact_id"
    t.index ["salesman_id"], name: "index_companies_on_salesman_id"
  end

  create_table "completed_orders", force: :cascade do |t|
    t.integer "fleet_id"
    t.integer "order_id"
    t.datetime "scheduled_at"
    t.integer "driver_id"
    t.string "driver_name"
    t.string "driver_phone"
    t.integer "driver_status"
    t.string "pickup_address"
    t.string "pickup_location"
    t.string "destination_address"
    t.string "destination_location"
    t.integer "order_status"
    t.datetime "created_at", null: false
    t.text "path_points"
    t.datetime "order_received"
    t.datetime "pickup_time"
    t.datetime "will_arrive_at"
    t.datetime "arrived_at"
    t.integer "waiting_time_minutes"
    t.datetime "passanger_on_board"
    t.datetime "order_ended_at"
    t.float "driver_rating"
    t.string "driver_photo"
    t.string "driver_car_model"
    t.string "driver_taxi_reg"
    t.string "driver_device_type"
    t.string "passenger_name"
    t.datetime "order_cancelled_at"
    t.datetime "order_rejected_at"
    t.string "order_status_name"
  end

  create_table "contacts", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.string "email"
    t.string "phone"
    t.string "mobile"
    t.string "fax"
    t.bigint "address_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["address_id"], name: "index_contacts_on_address_id"
  end

  create_table "driver_locations", force: :cascade do |t|
    t.integer "fleet_id"
    t.integer "driver_id"
    t.string "driver_name"
    t.string "driver_phone"
    t.integer "status_id"
    t.float "latitude"
    t.float "longitude"
    t.datetime "created_at", null: false
    t.string "license_number"
    t.string "car_model"
  end

  create_table "driver_reports", force: :cascade do |t|
    t.integer "fleet_id"
    t.integer "driver_id"
    t.string "driver_name"
    t.string "driver_phone"
    t.integer "completed_for_period"
    t.float "acceptance_for_period"
    t.float "avg_rating_for_period"
    t.datetime "created_at", null: false
    t.integer "period"
  end

  create_table "fleet_reports", force: :cascade do |t|
    t.integer "fleet_id"
    t.integer "completed_for_period"
    t.float "acceptance_for_period"
    t.float "avg_rating_for_period"
    t.datetime "created_at", null: false
    t.date "date"
    t.integer "canceled_for_period"
  end

  create_table "future_orders", force: :cascade do |t|
    t.integer "fleet_id"
    t.integer "order_id"
    t.datetime "scheduled_at"
    t.integer "driver_id"
    t.string "driver_name"
    t.string "driver_phone"
    t.integer "driver_status"
    t.string "pickup_address"
    t.string "pickup_location"
    t.string "destination_address"
    t.string "destination_location"
    t.integer "order_status"
    t.datetime "created_at", null: false
    t.string "driver_type"
    t.datetime "order_received"
    t.datetime "pickup_time"
    t.datetime "will_arrive_at"
    t.datetime "arrived_at"
    t.integer "waiting_time_minutes"
    t.datetime "passanger_on_board"
    t.datetime "order_ended_at"
    t.float "driver_rating"
    t.string "driver_photo"
    t.string "driver_car_model"
    t.string "driver_taxi_reg"
    t.string "driver_device_type"
    t.string "passenger_name"
    t.datetime "order_cancelled_at"
    t.datetime "order_rejected_at"
    t.string "order_status_name"
  end

  create_table "messages", force: :cascade do |t|
    t.bigint "sender_id"
    t.bigint "company_id"
    t.string "body", null: false
    t.string "title"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["company_id"], name: "index_messages_on_company_id"
    t.index ["sender_id"], name: "index_messages_on_sender_id"
  end

  create_table "orders", force: :cascade do |t|
    t.integer "fleet_id"
    t.integer "order_id"
    t.datetime "scheduled_at"
    t.integer "driver_id"
    t.string "driver_name"
    t.string "driver_phone"
    t.integer "driver_status"
    t.string "pickup_address"
    t.string "pickup_location"
    t.string "destination_address"
    t.string "destination_location"
    t.integer "order_status"
    t.text "path_points"
    t.string "driver_type"
    t.datetime "order_received"
    t.datetime "pickup_time"
    t.datetime "will_arrive_at"
    t.datetime "arrived_at"
    t.integer "waiting_time_minutes"
    t.datetime "passanger_on_board"
    t.datetime "order_ended_at"
    t.float "driver_rating"
    t.datetime "created_at", null: false
    t.string "driver_photo"
    t.string "driver_car_model"
    t.string "driver_taxi_reg"
    t.string "driver_device_type"
    t.string "passenger_name"
    t.datetime "order_cancelled_at"
    t.datetime "order_rejected_at"
    t.string "order_status_name"
  end

  create_table "requests", force: :cascade do |t|
    t.string "request_class"
    t.integer "fleet_id"
    t.datetime "performed_at"
  end

  create_table "salesmen", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "password_digest"
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "type"
    t.bigint "company_id"
    t.boolean "active", default: true, null: false
    t.string "first_name"
    t.string "last_name"
    t.string "phone"
    t.string "mobile"
    t.string "avatar"
    t.integer "role", default: 0, null: false
    t.datetime "notification_seen_at"
    t.index ["company_id"], name: "index_users_on_company_id"
  end

end
