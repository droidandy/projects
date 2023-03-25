import navigation from '../navigation';

describe('RFP Navigation', () => {
  const products = {
    medical: true,
    dental: true,
    vision: true,
    life: true,
    std: true,
    ltd: true,
  };

  it('should be all visible', () => {
    const nav = navigation(products);
    let allVisible = true;
    for (let i = 0; i < nav.major.length; i += 1) {
      const item = nav.major[i];

      if (item.hidden) allVisible = false;
    }

    expect(allVisible).toBe(true);
  });

  it('should be dental hidden', () => {
    products.dental = false;
    const nav = navigation(products);

    expect(nav.major[2].hidden).toBe(true);
  });

  it('should be medical hidden and enrollment visible', () => {
    products.medical = false;
    const nav = navigation(products);

    expect(nav.major[1].hidden).toBe(true);
    expect(nav.major[8].hidden).toBe(false);
  });

  it('should be enrollment hidden', () => {
    products.medical = false;
    products.dental = false;
    products.vision = false;
    const nav = navigation(products);

    expect(nav.major[8].hidden).toBe(true);
  });
});
