describe('Future Improvement', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Search "TV Episodies" and assert every result rows', () => {
    // Technical limitation : Cannot use cypress intercept in this test case.
    // Because IMDB use document type server request instead of Xhr api network call.

    const searchKeyword = 'Manifest'
    cy.get('#home_img_holder')
    cy.get('#nav-search-form')
    cy.get('.ipc-button[for="navbar-search-category-select"]').click()
    cy.get('.ipc-menu[role="presentation"]')
    cy.get('ul.searchCatSelector')
      .find('li[role="menuitem"]')
      .eq(2)
      .should('contain', 'TV Episodes')
      .click()
    cy.get('.ipc-button[for="navbar-search-category-select"]').should(
      'have.attr',
      'aria-label',
      'TV Episodes'
    )
    cy.get('input[type="text"]').type(`${searchKeyword}{enter}`)
    // Assert the search result for the first row.
    cy.get('body').then(($body) => {
      if ($body.find('div[id="main"]').length > 0) {
        cy.get('.findSection')
        cy.get('table.findList')
          .find('tbody>tr>td.result_text')
          .each(($item) => {
            // cy.wrap($item).should('contain', searchKeyword)
            expect($item.text().toLowerCase()).to.contain(
              searchKeyword.toLowerCase()
            )
            cy.log($item)
          })
        // .eq(0)
        // .should('contain', searchKeyword)
      } else {
        cy.get('section[data-testid="find-results-section-title"]')
        cy.get('ul.ipc-metadata-list')
          .children('li')
          .each(($item) => {
            cy.wrap($item).should('contain', searchKeyword)
            cy.log($item)
          })
        // .eq(0)
        // .should('contain', searchKeyword)
      }
    })
  })

  it('Stubbing the response with mock data to display two movies only ', () => {
    const searchKeyword = 'spi'
    cy.intercept(
      'GET',
      'https://v3.sg.media-imdb.com/suggestion/x/spi.json?includeVideos=1',
      { fixture: 'movies.json' }
    ).as('mockMovies')
    
    cy.get('#suggestion-search')
    cy.get('input[type="text"]').clear().type(searchKeyword)
    cy.wait('@mockMovies').its('response.statusCode').should('eq', 200)

    cy.get('@mockMovies').then((result) => {
        const movies = result.response.body.d
        movies.forEach((movie) => {
          cy.get(
            'div[class="sc-90ef1f68-0 lyCuq imdb-header__search-menu"]'
          ).then(($searchResult) => {
            const wrappedResult = cy.wrap($searchResult)
            wrappedResult.should('contain', searchKeyword)
            wrappedResult.should('contain', movie.l)
          })
        })
      })
  })



})
