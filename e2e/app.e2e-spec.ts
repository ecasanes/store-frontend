import { MercuryAngularPage } from './app.po';

describe('mercury-angular App', function() {
  let page: MercuryAngularPage;

  beforeEach(() => {
    page = new MercuryAngularPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
