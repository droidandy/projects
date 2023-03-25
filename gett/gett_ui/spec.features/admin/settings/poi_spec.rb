require 'features_helper'

feature 'POI' do
  let(:poi_page) { Pages::Admin.poi_list }
  let(:form) { poi_page.poi_form }
  let!(:existed_poi) { create(:predefined_address) }

  before do
    login_as_super_admin
    poi_page.load
    wait_until_true { poi_page.pois.present? }
  end

  scenario 'Create' do
    poi_page.add_new_poi_button.click
    poi_page.wait_until_poi_form_visible

    form.save_button.click
    expect(form.name.error_message).to eql("can't be blank")
    expect(form.postal_code.error_message).to eql("can't be blank")
    expect(form.latitude.error_message).to eql("can't be blank")
    expect(form.longitude.error_message).to eql("can't be blank")
    expect(form.city.error_message).to eql("can't be blank")

    form.postal_code.set('W2H')
    form.verify_button.click
    expect(form.postal_code.error_message).to eql('is invalid')

    form.latitude.set('180.00001')
    form.longitude.set('-90.00001')
    expect(form.latitude.error_message).to eql('Latitude should be from -180 to 180')
    expect(form.longitude.error_message).to eql('Longitude should be from -90 to 90')

    form.postal_code.set('NW1 6XE')
    form.verify_button.click
    form.latitude.set('51.5237102')
    form.longitude.set('-0.1584593')
    form.city.set('London')

    form.name.set(PredefinedAddress.first.line)
    form.save_button.click
    expect(form.name.error_message).to eql("is already taken")

    form.name.set('Baker Street')
    form.save_button.click
    poi_page.wait_until_poi_form_invisible

    poi_page.pagination.last_page.click
    expect(poi_page).to have_pois(text: 'Baker Street')
  end

  scenario 'Edit' do
    poi_page.pagination.last_page.click
    expect(poi_page).to have_pois(text: existed_poi.line)
    record = poi_page.get_poi_by_name(existed_poi.line)
    record.edit_button.click

    poi_page.wait_until_poi_form_visible

    form.name.set('New Baker Street')
    form.postal_code.set('NW1 6XE')
    form.verify_button.click
    form.latitude.set('51.5237102')
    form.longitude.set('-0.1584593')
    form.city.set('London')
    form.save_button.click
    poi_page.wait_until_poi_form_invisible
    poi_page.pagination.last_page.click
    expect(poi_page).to have_no_pois(text: existed_poi.line, wait: 2)
    expect(poi_page).to have_pois(text: 'New Baker Street')

    record = poi_page.get_poi_by_name('New Baker Street')
    record.edit_button.click
    expect(form.postal_code.value).to eql('NW1 6XE')
    expect(form.latitude.value).to eql('51.5237102')
    expect(form.longitude.value).to eql('-0.1584593')
    expect(form.city.value).to eql('London')
  end

  scenario 'Delete' do
    poi_page.pagination.last_page.click
    expect(poi_page).to have_pois(text: existed_poi.line)
    record = poi_page.get_poi_by_name(existed_poi.line)
    record.delete_button.click
    poi_page.delete_modal.ok_button.click

    poi_page.pagination.last_page.click
    expect(poi_page).to have_no_pois(text: existed_poi.line)
  end
end
