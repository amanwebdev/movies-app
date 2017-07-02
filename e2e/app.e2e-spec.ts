import { AccentureAppPage } from './app.po';

describe('accenture-app App', () => {
  let page: AccentureAppPage;

  beforeEach(() => {
    page = new AccentureAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
