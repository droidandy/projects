const MAP_PAGE = 'map';

export default async function checkDashboard(t) {
  await this.waitForVisible(MAP_PAGE, 5000);
  t.pass('Map is visible');
}
