import { NgPostgrestPage } from './app.po';

describe('ng-postgrest App', () => {
  let page: NgPostgrestPage;

  beforeEach(() => {
    page = new NgPostgrestPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
