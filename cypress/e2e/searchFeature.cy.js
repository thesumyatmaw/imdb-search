describe('Search functions Test Suite for IMDB', () => {
  before(() => {
    cy.visit('/')
  })

  describe('Search by Movie names Test Cases', () => {
    // I use "before" to run once before all the testcases

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

  //Search by TV Episodesfrom search menus that doesn't work on auto Complete in IMDB.
  //So, to display TV Episodes search result I need to use Enter keyword.
  //Technical stuck : I cannot use cypress intercept.Because I didn't see network api call (Xhr/fetch) when I searched.
  describe('Search by TV Episodes Test Case', () => {
    it('Select "TV Episodies" from search menu & search TV episodes', () => {
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
      cy.get('input[type="text"]').type('Stranger Things{enter}')
      //Only check search result on the first row.
      cy.get('.findSection', { timeout: 5000 })
      cy.get('table.findList')
        .find('tbody>tr>td.result_text')
        .eq(0)
        .should('contain', 'Stranger Things')
    })
  })
})
