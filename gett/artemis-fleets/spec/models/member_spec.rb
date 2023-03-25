describe Member do
  describe 'roles enum' do
    it 'has several roles' do
      expect(described_class.roles.keys).to include('admin', 'finance', 'user')
    end
  end
end
