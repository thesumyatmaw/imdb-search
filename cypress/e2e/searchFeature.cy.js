describe('Search functions for IMDB', () => {
  before(() => {
    cy.visit('/')
  })

  it('Go to the IMDB page and assert the search bar & search menu items', () => {
    const categories = [
      'All',
      'Titles',
      'TV Episodes',
      'Celebs',
      'Companies',
      'Keywords',
    ]
    cy.get('#home_img_holder')
    cy.get('#nav-search-form')
    cy.get('input[type="text"]')
    cy.get('.ipc-button[for="navbar-search-category-select"]').click()
    cy.get('.ipc-menu[role="presentation"]')
    cy.get('ul.searchCatSelector')
      .children('li[role="menuitem"]')
      .each(($li) => {
        console.log($li)
        cy.log($li.text())
        expect($li.text()).to.be.oneOf(categories)
      })
  })
})
