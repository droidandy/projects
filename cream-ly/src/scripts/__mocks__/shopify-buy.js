const shopifyBuy = jest.genMockFromModule("shopify-buy");

let mockResponse = null;

shopifyBuy.__setMockResponse = response => {
  mockResponse = response;
};

shopifyBuy.buildClient = jest.fn().mockReturnValue({
  checkout: {
    updateEmail: jest.fn().mockImplementation((checkoutId, email) => {
      console.log("mock updateEmail " + checkoutId + " " + email);
      return Promise.resolve(mockResponse);
    }) // .mockResolvedValue({done: true})
  }
});

module.exports = shopifyBuy;
