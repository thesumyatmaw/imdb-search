describe('Search functions for IMDB', () => {
  describe('Search by Movie name', () => {
    beforeEach(() => {
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
          expect($li.text()).to.be.oneOf(categories)
        })
    })

    it('Type invalid keyword on the searchbar & check error message', () => {
      const searchKeyword = '%$9'
      const errorMsg = 'No results found.'
      cy.get('#suggestion-search')
      cy.get('input[type="text"]').type(searchKeyword)
      cy.get('div[class="sc-90ef1f68-0 lyCuq imdb-header__search-menu"]')
      cy.get('.ipc-error-message').should('have.text', errorMsg)
    })

    it('Search by some letters on the search bar ', () => {
      const searchKeyword = 'spi'
      cy.intercept(
        'GET',
        'https://v3.sg.media-imdb.com/suggestion/x/spi.json?includeVideos=1'
      ).as('getmovielists')

      cy.get('#suggestion-search')
      cy.get('input[type="text"]').clear().type(searchKeyword)
      cy.wait('@getmovielists').its('response.statusCode').should('eq', 200)
      cy.get('@getmovielists').then((result) => {
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

    it('Search movie name on the search bar & click on this movie', () => {
      const searchKeyword = 'Spirited Away'
      cy.intercept(
        'GET',
        'https://v3.sg.media-imdb.com/suggestion/x/spirited%20away.json?includeVideos=1'
      ).as('getMovie')
      cy.get('#suggestion-search')
      cy.get('input[type="text"]').clear().type(searchKeyword)
      cy.wait('@getMovie').its('response.statusCode').should('eq', 200)
      cy.get('@getMovie').then((result) => {
        const movies = result.response.body.d

        const foundMovie = movies.find((movie) => movie.l === searchKeyword)
        cy.get('div[class="sc-90ef1f68-0 lyCuq imdb-header__search-menu"]')
          .contains(foundMovie.l)
          .click()

        cy.get('h1[data-testid="hero-title-block__title"]', {
          timeout: 1000,
        }).should('have.text', foundMovie.l)
      })
    })
  })

  describe('Search by TV Episode', () => {
    beforeEach(() => {
      cy.visit('/')
    })

    it('Select "TV Episodies" from search menu & search TV episodes', () => {
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
            .eq(0)
            .should('contain', searchKeyword)
        } else {
          cy.get('section[data-testid="find-results-section-title"]')
          cy.get('ul.ipc-metadata-list')
            .find('li')
            .eq(0)
            .should('contain', searchKeyword)
        }
      })
    })
  })

  describe('Search by Celeb', () => {
    beforeEach(() => {
      cy.visit('/')
    })

    it('Select "Celebs" from search menu & search Cele person', () => {
      const searchKeyword = 'Jennifer Lawrence'
      cy.intercept(
        'GET',
        'https://v3.sg.media-imdb.com/suggestion/names/x/jennifer%20lawrence.json?includeVideos=1'
      ).as('getceleb')

      cy.get('#home_img_holder')
      cy.get('#nav-search-form')
      cy.get('.ipc-button[for="navbar-search-category-select"]').click()
      cy.get('.ipc-menu[role="presentation"]')
      cy.get('ul.searchCatSelector')
        .find('li[role="menuitem"]')
        .eq(3)
        .should('contain', 'Celebs')
        .click()
      cy.get('.ipc-button[for="navbar-search-category-select"]').should(
        'have.attr',
        'aria-label',
        'Celebs'
      )
      cy.get('input[type="text"]').type(searchKeyword)
      cy.wait('@getceleb').its('response.statusCode').should('eq', 200)
      cy.get('@getceleb').then((result) => {
        const celebs = result.response.body.d
        const foundCeleb = celebs.find((celeb) => celeb.l === searchKeyword)
        cy.get('div[class="sc-90ef1f68-0 lyCuq imdb-header__search-menu"]')
          .contains(foundCeleb.l)
          .click()

        cy.get('h1', {
          timeout: 3000,
        }).should('contain', foundCeleb.l)
      })
    })
  })

  describe('Search by Companies', () => {
    beforeEach(() => {
      cy.visit('/')
    })
    it('Select "Companies" from search menu & search Companies name', () => {
      // Technical limitation : Cannot use cypress intercept in this test case too.
      // Because IMDB use document type server request instead of Xhr api network call.

      const searchKeyword = 'Marvel Studios'
      cy.get('#home_img_holder')
      cy.get('#nav-search-form')
      cy.get('.ipc-button[for="navbar-search-category-select"]').click()
      cy.get('.ipc-menu[role="presentation"]')
      cy.get('ul.searchCatSelector')
        .find('li[role="menuitem"]')
        .eq(4)
        .should('contain', 'Companies')
        .click()
      cy.get('.ipc-button[for="navbar-search-category-select"]').should(
        'have.attr',
        'aria-label',
        'Companies'
      )
      cy.get('input[type="text"]').type(`${searchKeyword}{enter}`)

      // Assert the search result for the first row.
      cy.get('body').then(($body) => {
        if ($body.find('div[id="main"]').length > 0) {
          cy.get('.findSection')
          cy.get('table.findList')
            .find('tbody>tr>td.result_text')
            .eq(0)
            .should('contain', searchKeyword)
        } else {
          cy.get('section[data-testid="find-results-section-company"]')
          cy.get('ul.ipc-metadata-list')
            .find('li')
            .eq(0)
            .should('contain', searchKeyword)
        }
      })
    })
  })
})
