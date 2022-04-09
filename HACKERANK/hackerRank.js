// as i have install puppeteer now first step is to reuire puppeteer 
// pupperteer is used to control the chrome or chromium browser 
const puppeteer = require("puppeteer");
let email = "";
let password = "";
let {answer} = require("./codes");
let cTab;

// puppeteer.launch - to open the browser we use this command 
let browserOpenPromise = puppeteer.launch(
{
    headless: false,
    defaultViewport : null,
    args: ["--start-maximized"],
    // Now i want to open the executable path like chrome
    // executablePath : "C:\Program Files\Google\Chrome\Application\chrome.exe",
}
);
// if this pronmise is fulfill then print browser is open

browserOpenPromise
.then(function(browser)
{
    console.log("browser is open");
    let allTabPromise = browser.pages();
    return allTabPromise;
})
// This is used to open the new tab 
.then(function(allTab)
{
    // ab hmare pass ek hi tab h jise hm apna cureent tab bnalenge 
    cTab = allTab[0];
    console.log("new tab");
    let visitingLoginPage = cTab.goto("https://www.hackerrank.com/auth/login");
    return visitingLoginPage;
    //.goto hme uss page pr leke jata h jiska hm url mention krennge 
// 
})
.then(function()
{
    console.log("hackerank site is successfully opened");
                                            //selector(where to type), data(what to type) 
    let emailWillBeTypePromise = cTab.type("input[name='username']", email);
    //here we are taking promise of typing email ctab.type in that defined the selector in which we have to type the email 
    return emailWillBeTypePromise;
    
    
})
.then(function()
{
    console.log("email is typed");
    let passwordWillBeTypePromise = cTab.type("input[name='password']",password);
    return passwordWillBeTypePromise;
})
.then(function()
{
    console.log("password is successfully types");
let willbeLoginpromise = cTab.click(".ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled");
return willbeLoginpromise;
// here i have addd the selector of login button and then return it 
})
.then(function()
{
    console.log("loged into hackerrank  successfully");
//WaitandClick wait for the page to be loaded  and then find the needed node and then click on the algorithm
let algorithmWillBeOpenedPromise = WaitandClick("div[data-automation='algorithms']");
return algorithmWillBeOpenedPromise;
})

.then(function()
{
console.log("Algorithm is successfully opened");
let allQuesPromise = cTab.waitForSelector('a[data-analytics="ChallengeListChallengeName"]')
return allQuesPromise;
})
.then(function()
    {
        function getallLinks ()
        {
        let allElemArr = document.querySelectorAll('a[data-analytics="ChallengeListChallengeName"]');
        // .querySelectorAll will select all the instances in which a[data-analytics="ChallengeListChallengeName] is present
        let linksArr = [];
        for(let i=0;i<allElemArr.length;i++)
        {
         linksArr.push(allElemArr[i].getAttribute("href"));
        
         //here we will get all the relative link of the   ques 
        }
        return linksArr;
        }
        let linkArrPromise = cTab.evaluate(getallLinks);
        return linkArrPromise;
    })
    //.evaluate - It execute the function where you want to execute 
    .then(function(linksArr)
    {
        console.log("links to all ques recieved ");
        console.log(linksArr);

    //links to the ques to be solved , index of the link array
        let quesWillbeSolvedPromise = quesSolver(linksArr[0],0);
      return quesWillbeSolvedPromise;
    }) 
    .then(function()
    {
        console.log("question is solved");
        //Tick the custom input box mark 
    })
    
.catch(function(err)
{
    console.log(err);
});


//here I have created a promise in which i have passed an algobuttton this will first wait for the selector to get loaded using wait for selector function and then click the button
function WaitandClick(algoButton)
{
    let mypromise = new Promise(function (resolve,reject){
    let waitforSelectorPromise =  cTab.waitForSelector(algoButton)
    waitforSelectorPromise
    .then(function()
    {
     let clickPromise = cTab.click(algoButton);
     return clickPromise;
    })
    .then(function()
    {
        console.log("algo button is successfully clicked")
        resolve();
    
    })
    
    .catch(function(err)
    {
        reject(err);
    })
});
return mypromise;
}

// This whole code will open a chromium and on the chromium it will be write than chrome is being open my automated test software

function quesSolver(url,idx)
{
    return new Promise(function(resolve,reject)
    {
        let fullLink = `https://www.hackerrank.com${url}`;
        let goTOQuesPagePromise = cTab.goto(fullLink);
        goTOQuesPagePromise
        .then(function()
        {
            console.log("Ques opened");
            // resolve();
            let waitForCheckBoxandClickPromise = WaitandClick(".checkbox-input");
            return waitForCheckBoxandClickPromise;
            })
            .then(function()
            {
                console.log("check box is successfully clicked");
                //Select the box where code will be typed
               let waitForTextBox = cTab.waitForSelector(".custominput");
               return waitForTextBox;
            })
            .then(function () {
                let codeWillBeTypedPromise = cTab.type(".custominput", answer[idx]);
                return codeWillBeTypedPromise;
              })
              .then(function () {
                //control key is pressed promise
                let controlPressedPromise = cTab.keyboard.down("Control");
                return controlPressedPromise;
              })
              .then(function () {
                let aKeyPressedPromise = cTab.keyboard.press("a");
                return aKeyPressedPromise;
              })
              .then(function () {
                let xKeyPressedPromise = cTab.keyboard.press("x");
                return xKeyPressedPromise;
              })
              .then(function () {
                let ctrlIsReleasedPromise = cTab.keyboard.up("Control");
                return ctrlIsReleasedPromise;
              })
              .then(function () {
                //select the editor promise
                let cursorOnEditorPromise = cTab.click(
                  ".monaco-editor.no-user-select.vs"
                );
                return cursorOnEditorPromise;
              })
              .then(function () {
                //control key is pressed promise
                let controlPressedPromise = cTab.keyboard.down("Control");
                return controlPressedPromise;
              })
              .then(function () {
                let aKeyPressedPromise = cTab.keyboard.press("A",{delay:100});
                return aKeyPressedPromise;
              })
              .then(function () {
                let vKeyPressedPromise = cTab.keyboard.press("V",{delay:100});
                return vKeyPressedPromise;
              })
              .then(function () {
                let controlDownPromise = cTab.keyboard.up("Control");
                return controlDownPromise;
              })
              .then(function () {
                let submitButtonClickedPromise = cTab.click(".hr-monaco-submit");
                return submitButtonClickedPromise;
              })
              .then(function () {
                console.log("code submitted successfully");
                resolve();
              })
              .catch(function (err) {
                reject(err);
              });
          });
        }