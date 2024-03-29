
const cellStates = {
  COVERED: 0,
  QUESTION: 1,
  ANSWER: 2
};



async function getCategory() {
    try{
    const randomCategory =  await axios.get('https://rithm-jeopardy.herokuapp.com/api/categories?count=100').then(response => {
        const categories = response.data;
        
        let randomCategory = categories[(Math.floor(Math.random() * categories.length))];

     
        // console.log(randomCategory);
        return randomCategory;

    });

   return randomCategory; 
 }  catch (error) {
    console.error(error);
 } 
};


async function getQuestionObjectData(categoryId) {
    console.log(categoryId);
    try{
        const randomQuestion =  await axios.get('https://rithm-jeopardy.herokuapp.com/api/category',{
                params: {
                    id: categoryId
                }
            }).then(response => {
                const categoryQuestions = response.data.clues;
                console.log(categoryQuestions);
                
                let randomQuestion = categoryQuestions[(Math.floor(Math.random() * categoryQuestions.length))];
                console.log(randomQuestion);
                return randomQuestion;

            });

        return randomQuestion; 
        
        }  catch (error) {
    console.error(error);
  }
};

async function getUniqueCategoryArray() {
  // create unique array of categories (no duplicates)
  const colemnCategory = [];
  const colCategoryIds = [];  
  //storing 6 random categories
  for (let j = 0; j < 6; j++) {
    let category = ""
    
    do{
      // wait for promise to become a full object
        category = await getCategory();
    // check array of numbers to see if the unique id is already used
    }while(colCategoryIds.includes(category.id))

    // save unique id to number array
    colCategoryIds.push(category.id);
    // save actual category object to category array
    colemnCategory.push(category);
    
  }

  return colemnCategory;
  

}

async function getUniqueQuestionObjectDataArray(categoryId) {
 // create unique array of categories (no duplicates)
 const rowQuestions = [];
 const rowQuestionsId = [];
   
 //storing 5 random categories
 for (let j = 0; j < 5; j++) {
   let question = ""
   do{
     // wait for promise to become a full object
       question = await getQuestionObjectData(categoryId);
   // check array of numbers to see if the unique id is already used
   }while(rowQuestionsId.includes(question.id))

   // save unique id to number array
   rowQuestionsId.push(question.id);
   // save actual category object to category array
   rowQuestions.push(question);
 }

 return rowQuestions;
}

function updatCell(evt){
  let cellId = evt.target.id.replace("img","cell");

  console.log(cellId)
const cellData = JSON.parse(localStorage.getItem(cellId));
console.log(cellData);
// console.log(evt);
if(cellData.state === cellStates.COVERED){
  const img = document.getElementById(evt.target.id);

 img.remove();
 const cell = document.getElementById(cellId);
  cell.innerText = cellData.question;
localStorage.setItem(cellId, JSON.stringify({
   "question": cellData.question,
   "answer": cellData.answer,
   "state": cellStates.QUESTION

}));
 }else if(cellData.state === cellStates.QUESTION){
  evt.target.innerText = cellData.answer;

  localStorage.setItem(cellId, JSON.stringify({
    "question": cellData.question,
    "answer": cellData.answer,
    "state": cellStates.ANSWER
 
 }));


 }
}


async function generateTable() {
  // clearing local storage of old game 
  localStorage.clear();
   // if there was a previous game this wil delete it.
  $("table").remove();
  // creates a <table> element and a <tbody> element
   const tbl = document.createElement("table");
   const tblBody = document.createElement("tbody");
   //returns a promise with a arry of random categories with an axios call in the Get category function
   //colemnCategory = [category1, category2,... category6]
   //category1 = {id: #, title: "categoryName",...}
  colemnCategory = await getUniqueCategoryArray();
   // insert the Id of the first category from the arry of categories.
   // the function will return a promise with an arry of random questions
   // with an axios call in the Get Question function
    //colemnQuestions = [question1, question2,... question6]
   //question1 = {id: #, question: "questionName", answer: "answer",...}
  colemn0Questions = await getUniqueQuestionObjectDataArray(colemnCategory[0].id);
  colemn1Questions = await getUniqueQuestionObjectDataArray(colemnCategory[1].id);
  colemn2Questions = await getUniqueQuestionObjectDataArray(colemnCategory[2].id);
  colemn3Questions = await getUniqueQuestionObjectDataArray(colemnCategory[3].id);
  colemn4Questions = await getUniqueQuestionObjectDataArray(colemnCategory[4].id);
  colemn5Questions = await getUniqueQuestionObjectDataArray(colemnCategory[5].id);
  
  // 2d Array representing the rows and columns of the game board
  /* 2D question objects = [ 0,0  0,1  ...]
                           [ 1,0  1,1  ...]
                           [ ...  ...  ...]*/
  // each column is represented by an array of questions
  const twoDimQuestionObjects =[colemn0Questions,colemn1Questions,colemn2Questions,colemn3Questions,colemn4Questions,colemn5Questions];

  // this varible is used to uptain unique ids for each cell
  let cellNum = 0;
    // creating all cells
    // i represents each row number
  for (let i = 0; i < 6; i++) {
    // creates a table row
    const row = document.createElement("tr");
    // j represents each column number
    for (let j = 0; j < 6; j++) {
      //get category name from category JSON object
      //the category JSON object is in an array.
      //the categories unique per column, thats why we use the varible j to access the array
      const category = colemnCategory[j];
      // creating a unique HTML id for each cell on the game board.
      let cellId = `cell${cellNum}`;
      // Create a <td> element which will populate each cell of the board
      const cell = document.createElement("td");
      
     // assigning the HTML id to the cell element
      cell.id = cellId
      // setting cellText to an emtpy string
      let cellText =""
      // check if the row(i is equal to the row number) is at the top of the game board or not
      if (i === 0){
        // the top row of the board has a row # of 0
        //these cells are category cells of the game board
        // create a text node for the top row of the game board that contains the categories
         cellText = document.createTextNode(category.title);
      } else{
        //every other row of the game board has a row # not = to 0
        //these cells are question cells of the game board
        // gather all the data the question cell needs to know
        // the data is a JSON object that is stored in the 2D array
        // acces the data using the column # which is j and the row # is i-1
        // the row # is shifted down 1 since the categories are in the first row of the board
         //questionAnswer = {id: #, question: "questionName", answer: "answer",...}
        const questionAnswer = twoDimQuestionObjects[j][i-1];
         //questionAnswer = {id: #, question: "questionName", answer: "answer",...}
         //get Data from the questionAnwer JSON object
        const question = questionAnswer.question
        const answer = questionAnswer.answer
        // save state data for each state of the game
        // this cell data is stored in local storage
        // state:::: covered-> question -> answer
        const cellData = JSON.stringify({
          "question": question,
          "answer": answer,
          "state": cellStates.COVERED
        });
        console.log(cellId);
        //save the state dat into local storage
        localStorage.setItem(cellId,cellData);
        //create an event listener that runs update cell(changes the cell state from covered to answer)
        cell.addEventListener('click', updatCell);
        // sets the img inside each cell
         let imgId = `img${cellNum}`;
         let img = document.createElement("img");
         img.style.height = "180px"
         img.style.width = "200px"
         img.id = imgId
         img.src = "https://pngimg.com/uploads/question_mark/question_mark_PNG138.png";
         cell.appendChild(img);
         cellText = document.createTextNode(cellText);
      }
      
      cell.appendChild(cellText);
      row.appendChild(cell);

      cellNum++;

    }

    // add the row to the end of the table body
    tblBody.appendChild(row);
  }

  // put the <tbody> in the <table>
  tbl.appendChild(tblBody);
  // appends <table> into <body>
  document.body.appendChild(tbl);
  // sets the heght and width of the colemn and rows and 
//   tbl.setAttribute("border", "1");
  

}
// creates the loading gif and removes it after a set time,
function showLoadingView() {
  let loadingImg = document.createElement("img")
  loadingImg.id = "loading-gif";
  loadingImg.src = "https://i.gifer.com/XOsX.gif"
  document.body.prepend(loadingImg);
  setTimeout(hideLoadingView, 3700);
}



function hideLoadingView() {
  const img = document.getElementById("loading-gif")
  img.remove();
}
async function setupAndStart() {
  showLoadingView();
  generateTable();

}


// create the start button and then run the generate table function 

const BtnContainer = document.createElement("div");
let btn = document.createElement("button")
btn.textContent = "Start Game"
document.body.prepend(btn);
btn.style.position = "absolute"


btn.addEventListener('click', setupAndStart);
