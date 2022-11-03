describe('Search functions for IMDB', () => {
  // I use "before" to run once before all the testcases
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
    // To close search categories list, I clicked again.
    cy.get('.ipc-button[for="navbar-search-category-select"]').click()
  })

  it('Type invalid keyword on the searchbar & check error message', () => {
    cy.get('#suggestion-search')
    cy.get('input[type="text"]').type('%$9')
    cy.get('div[class="sc-90ef1f68-0 lyCuq imdb-header__search-menu"]')
    cy.get('.ipc-error-message').should('have.text', 'No results found.')
  })

  it('Search by some letters on the search bar ', () => {
    cy.intercept(
      'GET',
      'https://v3.sg.media-imdb.com/suggestion/x/spi.json?includeVideos=1'
    ).as('getmovielists')

    cy.get('#suggestion-search')
    cy.get('input[type="text"]').clear().type('Spi')
    cy.wait('@getmovielists').its('response.statusCode').should('eq', 200)
    cy.get('@getmovielists').then((resultlists) => {
      cy.log(resultlists)
      const resultmovieslist = resultlists.response.body.d
      resultmovieslist.forEach((Movielists) => {
        cy.log(Movielists.l)
        cy.get(
          'div[class="sc-90ef1f68-0 lyCuq imdb-header__search-menu"]'
        ).contains(Movielists.l)
      })
    })
  })
})
