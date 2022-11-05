describe('Search functions Test Suite for IMDB', () => {
  describe('Search by Movie name Test Cases', () => {
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
          console.log($li)
          cy.log($li.text())
          expect($li.text()).to.be.oneOf(categories)
        })
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

    it('Search movie name on the search bar & click on this movie', () => {
      cy.intercept(
        'GET',
        'https://v3.sg.media-imdb.com/suggestion/x/spirited%20away.json?includeVideos=1'
      ).as('getmovie')
      cy.get('#suggestion-search')
      cy.get('input[type="text"]').clear().type('Spirited Away')
      cy.wait('@getmovie').its('response.statusCode').should('eq', 200)
      cy.get('@getmovie').then((results) => {
        cy.log(results)
        const getmovieslist = results.response.body.d
        const moviename = 'Spirited Away'
        const getmovie = getmovieslist.find(
          (resultmoviename) => resultmoviename.l === moviename
        )
        cy.log(getmovie.l)
        cy.get('div[class="sc-90ef1f68-0 lyCuq imdb-header__search-menu"]')
          .contains(getmovie.l)
          .click()

        cy.get('h1[data-testid="hero-title-block__title"]', {
          timeout: 1000,
        }).should('have.text', getmovie.l)
      })
    })
  })

  describe('Search by TV Episode Test Case', () => {
    beforeEach(() => {
      cy.visit('/')
    })

    it('Select "TV Episodies" from search menu & search TV episodes', () => {
      // Technical limitation : Cannot use cypress intercept in this test case.
      // Because IMDB use document type server request instead of Xhr api network call.
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
      cy.get('input[type="text"]').type('Manifest{enter}')
      // Assert the search result for the first row.
      cy.get('body').then(($body) => {
        if ($body.find('div[id="main"]').length > 0) {
          cy.get('.findSection')
          cy.get('table.findList')
            .find('tbody>tr>td.result_text')
            .eq(0)
            .should('contain', 'Manifest')
        } else {
          cy.get('section[data-testid="find-results-section-title"]')
          cy.get('ul.ipc-metadata-list')
            .find('li')
            .eq(0)
            .should('contain', 'Manifest')
        }
      })
    })
  })

  describe('Search by Celeb Test Case', () => {
    beforeEach(() => {
      cy.visit('/')
    })

    it('Select "Celebs" from search menu & search Cele person', () => {
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
      cy.get('input[type="text"]').type('Jennifer Lawrence')
      cy.wait('@getceleb').its('response.statusCode').should('eq', 200)
      cy.get('@getceleb').then((resultceleb) => {
        cy.log(resultceleb)
        console.log(resultceleb)
        const getceleblists = resultceleb.response.body.d
        const celebname = 'Jennifer Lawrence'
        const getceleb = getceleblists.find(
          (resultname) => resultname.l === celebname
        )
        cy.log(getceleb.l)
        cy.get('div[class="sc-90ef1f68-0 lyCuq imdb-header__search-menu"]')
          .contains(getceleb.l)
          .click()

        cy.get('h1', {
          timeout: 3000,
        }).should('contain', getceleb.l)
      })
    })
  })

  describe('Search by Companies Test Case', () => {
    beforeEach(() => {
      cy.visit('/')
    })
    it('Select "Companies" from search menu & search Companies name', () => {
      // Technical limitation : Cannot use cypress intercept in this test case too.
      // Because IMDB use document type server request instead of Xhr api network call.

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
      cy.get('input[type="text"]').type('Marvel Studios{enter}')

      // Assert the search result for the first row.
      cy.get('body').then(($body) => {
        if ($body.find('div[id="main"]').length > 0) {
          cy.get('.findSection')
          cy.get('table.findList')
            .find('tbody>tr>td.result_text')
            .eq(0)
            .should('contain', 'Marvel Studios')
        } else {
          cy.get('section[data-testid="find-results-section-company"]')
          cy.get('ul.ipc-metadata-list')
            .find('li')
            .eq(0)
            .should('contain', 'Marvel Studios')
        }
      })
    })
  })
})
