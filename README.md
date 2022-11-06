# imdb-search
## How to run the Cypress Test
* Download the Zip file or clone
* please go inside the automate testing folder from Terminal
* Run `npm install`
* After that run `npx cypress open`
* Cypress window will open automatically.
* Click on E2E testing.
* Choose Chrome browser and click on start e2e testing button.
* Another Cypress browser will open and click on **searchFeature.cy.js**

## Requirement Analysis and Test Case Designs
After learning and investigation on the search features at IMDB website, there has many search functions. However, as the user behaviors, normally users search by movie name directly (or) search by typing with some letters. 
And they want to see their search results in the autocomplete dropdown.

So, In my opinion the main search bar and displaying auto complete search results are the most important things to write the automation scripts. 
Other kinds of search catgories are less priority. However, it's better to have the automation scripts to cover most search functions for IMDB.

In my cypress test file, I have total 7 test cases in my test suite. To be more descriptive and organize, I grouped some testcases under each search category.

**Search by Movie name** 

1. Go to the IMDB page and assert the search bar & search menu items
2. Type invalid keyword on the searchbar & check error message
3. Search by some letters on the search bar
4. Search movie name on the search bar & click on this movie'

**Search by TV Episode** 

5. Select "TV Episodies" from search menu & search TV episodes 
(Notes: IMDB suggested autocomplete dropdown doesn't work on this category. So, I used enter key after type TV episode name.)

**Search by Celeb** 

6. Select "Celebs" from search menu & search Cele person

**Search by Companies** 

7. Select "Companies" from search menu & search Companies name.
(Notes: IMDB suggested autocomplete dropdown doesn't work on this category. So, I used enter key after type Companies name.)

## Files Structures
This project is followed by Cypress suggested folder structure. My test file **(searchFeature.cy.js)** is under the **e2e** folder.
```
/cypress.config.js
/cypress/e2e/searchFeature.cy.js
/cypress/fixtures/example.json
/cypress/support/commands.js
/cypress/support/e2e.js
```


## Different Approach 
I used `cy.intercept()` to spy the actual network api response and made assertion the response data.
I want to use another way of intercept strategies which is by stubbing the network api response with the local mock json data.
The benefit of this way is - the frondend automation will be more quicker and enables to control response data. 
This is another different apporach to spy the network request and response.


## Future Improvement

In some testcases, I asserted the search result on the first row only. For example, When I search "Stranger Things" selected by TV episodes, the serach results return around 200 lists. To reduce, performance I checked the first row only.
However, if needs, I can edit (or) add more assertion in my automation scripts.

Another thing is _ IMDB doesn't return api network response data for some search functions. They return HTML document Type. In this situation, I couldn't use cy.intercept(). I asserted the  HTML content only. 
It was fine but for better consistent testing, I just want to improve this by pretending I'm working at IMDB 😎, I would like to request to IMDB dev team to change the way to return response from network api call instead of document type (if that's possible).

## Overcome any technical challenges I encountered

When I was working on **Test case 5 (Select "TV Episodies" from search menu & search TV episodes)** , I found out that IMDB has a tricky issue which shows two different search result HTML contents randomly. And this only occurs in Cypress Browser.
If I use the normal chrome broswer, I got the only one consistent search result. 

Please see below screenshots for random result _

<img width="600" alt="Screen Shot 2565-11-04 at 9 01 12 PM" src="https://user-images.githubusercontent.com/53144137/200147267-6101a0a6-14af-4350-9f27-c6512f0b98a9.png">

<img width="600" alt="Screen Shot 2565-11-04 at 9 01 42 PM" src="https://user-images.githubusercontent.com/53144137/200147300-db688d1e-1579-4e5a-b6ca-0dc1310ce942.png">

This random behaviour is unpredictable and give difficulty to make the test successful.
To sovle this issue, I used **Conditional Testing** by checking element existence on two different search result HTML content and assigned the respective test strategies for each of them.









