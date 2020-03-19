console.log("bg is running");

const executing = browser.tabs.executeScript(1,{
  code: `console.log('tab works');`
});